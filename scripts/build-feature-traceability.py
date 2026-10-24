#!/usr/bin/env python3
"""Rebuild the 396-row SOURCE crosswalk, not a completion/acceptance report."""
from pathlib import Path
import argparse
import hashlib
import json
import re
from plan_contract import catalog, TRACE

ROOT = Path(__file__).resolve().parents[1]
# Manually reviewed module source boundaries. Narrow ID assignments below keep
# e.g. a template-library requirement from inheriting token-editor evidence.
SOURCES = {
 'ADM': ['public/admin-home.html','src/index.ts'],
 'WEB': ['src/routes/admin/pages.ts','src/routes/admin/editor.ts','src/routes/admin/navigation.ts','src/routes/public/pages.ts','src/core/page-redirects.ts','src/index.ts'],
 'EDT': ['public/editor-v2/app.js','public/editor-v2/core/schema.js','public/editor-v2/core/commands.js','public/editor-v2/core/property-registry.js','public/editor-v2/ui/property-controls.js','public/assets/page-renderer.js','src/core/editor-validation.ts'],
 'DSN': ['src/core/site-presentation.ts','src/routes/admin/presentation.ts','public/assets/admin-design.js','public/editor-v2/core/design-tokens.js'],
 'RES': ['src/routes/admin/media.ts','public/assets/admin-media.js','public/editor-v2/ui/element-content-controls.js','src/core/media-retention-policy.js'],
 'INT': ['src/routes/integrations/twitch.ts','src/core/twitch-oauth.ts','src/core/twitch-site-ownership.ts','src/core/schedule/twitch-adapter.ts'],
 'SCH': ['src/routes/admin/schedule.ts','src/core/schedule-read.ts','src/core/schedule/twitch-sync.ts','public/editor-v2/core/schedule-schema.js'],
 'SEC': ['src/core/auth/require-auth.ts','src/core/auth/site-access.ts','src/core/auth/admin-tenant-gate.ts','src/core/twitch-oauth.ts','src/core/audit.ts'],
 'OPS': ['src/routes/health.ts','src/routes/db-health.ts','scripts/web013-migration-safety-gate.mjs','scripts/d1/ledger-reconciliation.py'],
 'QA': ['.github/workflows/editor-core-test.yml','.github/workflows/f0-baseline.yml','tests/f0-3-route-integration.test.js'],
 'SET': ['src/routes/admin/settings.ts','src/core/site-scoped-settings.ts','src/core/site-domain.ts'],
 'SEO': ['src/routes/public/seo.ts','src/index.ts','src/routes/admin/link-report.ts'],
 'DYN': ['src/core/schedule-read.ts','src/routes/public/pages.ts'],
 'HELP': ['public/editor-v2/ui/property-controls.js'],
 'TEAM': ['src/core/auth/site-access.ts','src/core/site-domain.ts'],
}
PARTIAL = {
 'ADM': [1,3,7,8,9,10,11], 'WEB': list(range(1,15))+[16,28,30,31,32],
 'EDT': list(range(1,39))+[40,41,42,43,44], 'DSN':[1,2,4,5,6,7],
 'RES':[1,2,3,4,5,7,8,9,10,11,15], 'INT':list(range(1,12))+[19,20],
 'SCH':[1,2,3,5,7,8,9,10,11], 'SEC':[1,2,3,4,5,6,8,10],
 'OPS':[1,2,4,5,6,7,9], 'QA':list(range(1,10)), 'SET':[1,2,3,4],
 'SEO':[1,2,4,5], 'DYN':[5,6,7], 'HELP':[1], 'TEAM':[3,5],
}
# Narrow references for requirements whose evidence is outside their module shell.
EXACT_SOURCES = {
 'EDT-021':['public/editor-v2/core/property-registry.js'],
 'EDT-022':['public/editor-v2/core/property-values.js','public/editor-v2/ui/property-controls.js','src/core/editor-validation.ts'],
 'EDT-024':['public/editor-v2/core/responsive.js','public/editor-v2/ui/responsive-group-reset.js'],
 'EDT-043':['public/editor-v2/core/richtext-engine.js','public/editor-v2/core/richtext-import.js','public/editor-v2/core/richtext-links.js','public/editor-v2/app.js'],
 'RES-011':['public/editor-v2/core/icon-options.js','public/editor-v2/ui/basic-content-inspector.js'],
 'DSN-007':['public/editor-v2/core/property-values.js','public/editor-v2/ui/property-controls.js'],
 'SEC-001':['src/routes/auth/login.ts','src/routes/auth/logout.ts','src/core/auth/session.ts'],
 'SEC-003':['src/index.ts','src/core/site-domain.ts','src/core/auth/site-access.ts'],
 'SEC-005':['src/core/editor-validation.ts','public/editor-v2/core/richtext-links.js','public/editor-v2/core/creator-embed.js'],
 'SEC-006':['src/core/page-redirects.ts','public/editor-v2/core/richtext-links.js'],
}
TEST_GLOBS = {
 'ADM':['tests/admin-home*'], 'WEB':['tests/f1-1-*','tests/f0-3-route*','tests/web013-runtime*'],
 'EDT':['public/editor-v2/tests/*.test.js','tests/browser/editor-*.test.js','tests/editor-*.test.js','tests/f0-3-route*'],
 'DSN':['tests/site-presentation*','tests/browser/editor-design-tokens*'],
 'RES':['tests/media-*.test.js','tests/browser/admin-media*.test.js','tests/browser/editor-media*.test.js'],
 'INT':['tests/twitch-*.test.js'], 'SCH':['public/editor-v2/tests/schedule*','tests/twitch-*.test.js'],
 'SEC':['tests/*ownership*.test.js','tests/web013-*tenant*.test.js','tests/web013-site-membership*','tests/auth-session*'],
 'OPS':['tests/d1-*.py','tests/d1-*.mjs','tests/web013-manual*'],
 'QA':['tests/f0-3-route*','tests/browser/editor-layout*','tests/d1-*.py'],
 'SET':['tests/web013-site-scoped-settings*','tests/web013-runtime*'],
 'SEO':['tests/web013-runtime*','tests/f1-1-public-route*'],
 'DYN':['public/editor-v2/tests/schedule*','tests/f0-3-route*'],
 'HELP':['tests/browser/editor-ux-p0*'], 'TEAM':['tests/web013-tenant-*.test.js','tests/web013-site-membership*'],
}

def build(root=ROOT):
    rows = catalog(root)
    contracts = {}
    path = root / 'docs/creator-master/part-03-of-12.md'
    for n,line in enumerate(path.read_text(encoding='utf-8').splitlines(),1):
        cells = [c.strip() for c in line.strip('|').split('|')]
        if len(cells) == 7:
            cells = [cells[0], *cells[2:]]
        if len(cells) == 6 and re.fullmatch(r'[A-Z]+-\d{3}',cells[0]):
            if cells[0] in contracts: raise ValueError('Duplicate contract '+cells[0])
            contracts[cells[0]] = (cells, {'path':str(path.relative_to(root)), 'line':n})
    if set(contracts) != {r['id'] for r in rows}: raise ValueError('396 contracts must match the 396 catalog IDs')
    features = []
    for row in rows:
        prefix,number = row['id'].split('-'); partial = int(number) in PARTIAL.get(prefix,[])
        cells,source = contracts[row['id']]
        implementation = EXACT_SOURCES.get(row['id'], SOURCES.get(prefix,[])) if partial else []
        tests = sorted({str(p.relative_to(root)) for g in TEST_GLOBS.get(prefix,[]) for p in root.glob(g) if p.is_file()}) if partial else []
        features.append({**row,'surface':cells[1],'owner':cells[2],'positive_acceptance':cells[3],
          'negative_acceptance':cells[4],'dependencies':cells[5],'contract_source':source,
          'source_status':'PARTIAL_SOURCE' if partial else 'UNVERIFIED',
          'implementation':implementation,'test_candidates':tests,'acceptance':'NOT_RECERTIFIED',
          'gap':'Module source exists; complete ID-specific contract, negative/lifecycle tests and live acceptance remain unverified.' if partial else 'No ID-specific complete implementation established in this review; keep the requirement and verify before implementation.',
          'scope_note':'References identify reviewed module boundaries and candidate tests, not proof that every clause of this feature is implemented or tested.'})
    fingerprint=hashlib.sha256('\n'.join(sorted(r['id'] for r in rows)).encode()).hexdigest()
    source_hashes = {path:hashlib.sha256((root/path).read_bytes()).hexdigest() for path in sorted({path for row in features for path in row['implementation']})}
    return {'source_hashes':source_hashes,'schema_version':1,'kind':'source-traceability-not-acceptance','canonical_plan':'docs/SANCI9517-CREATOR-PLATFORM-PLAN.md',
      'catalog_ids_sha256':fingerprint,'feature_count':396,'features':features}

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--check',action='store_true');args=parser.parse_args()
    rendered=json.dumps(build(),ensure_ascii=False,indent=2)+'\n'; target=ROOT/TRACE
    if args.check:
        if not target.is_file() or target.read_text(encoding='utf-8')!=rendered:raise SystemExit('FAIL: feature source crosswalk is stale; rebuild with scripts/build-feature-traceability.py')
        print('PASS: 396 source mappings match catalog, contracts and current file paths; acceptance NOT certified')
    else:
        target.write_text(rendered,encoding='utf-8');print('Wrote '+TRACE)
