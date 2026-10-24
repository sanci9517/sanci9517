"""Read-only structural contract for the ONE split master plan.
This never infers functional acceptance from matching text or a passing CI job.
"""
from pathlib import Path
import hashlib
import json
import re

MASTER = 'docs/SANCI9517-CREATOR-PLATFORM-PLAN.md'
TRACE = 'docs/evidence/feature-traceability.json'
ID = re.compile(r'^[A-Z]+-\d{3}$')


def catalog(root):
    path = Path(root) / 'docs/creator-master/part-01-of-12.md'
    text = path.read_text(encoding='utf-8')
    rows = []
    active = False
    for number, line in enumerate(text.splitlines(), 1):
        if line.startswith('## 24.'):
            active = True
        if line.startswith('## 25.'):
            break
        match = re.match(r'^- ([A-Z]+-\d{3}): (.+)$', line) if active else None
        if match:
            rows.append({'id': match[1], 'title': match[2], 'catalog': {'path': str(path.relative_to(root)), 'line': number}})
    if len(rows) != 396 or len({r['id'] for r in rows}) != 396:
        raise ValueError('Chapter 24 must define exactly 396 unique feature IDs')
    return rows


def cursor(root):
    text = (Path(root) / MASTER).read_text(encoding='utf-8')
    section = re.search(r'^## AKTUÁLIS VÉGREHAJTÁSI ÁLLAPOT[^\n]*\n(.*?)(?=^---\s*$)', text, re.M | re.S)
    if not section:
        raise ValueError('Missing single current execution state section')
    if len(re.findall(r'^## AKTUÁLIS VÉGREHAJTÁSI ÁLLAPOT', text, re.M)) != 1:
        raise ValueError('Multiple current execution state sections')
    main = re.findall(r'\*\*Aktív főblokk:\*\* `([^`]+)`', section[1])
    next_block = re.findall(r'\*\*Egyetlen következő blokk:\*\* `([^`]+)`', section[1])
    if len(main) != 1 or len(next_block) != 1:
        raise ValueError('Current state needs exactly one main block and next block')
    # Check real normative headings, not an incidental historical mention.
    number = main[0].split(' / ')[0]
    if not re.search(r'^## ' + re.escape(number) + r' /', text, re.M):
        raise ValueError('Active main block has no normative heading')
    if not next_block[0].startswith(number + '.'):
        raise ValueError('Next block is outside the active main block')
    if not re.search(r'\*\*' + re.escape(next_block[0]) + r' / OPEN', text):
        raise ValueError('Next block is not a declared OPEN execution block')
    return {'main': main[0], 'next': next_block[0]}


def validate(root, require_trace=True):
    root = Path(root)
    text = (root / MASTER).read_text(encoding='utf-8')
    for i in range(1, 13):
        name = f'part-{i:02d}-of-12.md'
        part = root / 'docs/creator-master' / name
        if not part.is_file() or len(part.read_text(encoding='utf-8')) < 100:
            raise ValueError(f'Missing or empty master part: {name}')
        if 'creator-master/' + name not in text:
            raise ValueError(f'Master entry does not link to {name}')
    current = cursor(root)
    rows = catalog(root)
    if require_trace:
        data = json.loads((root / TRACE).read_text(encoding='utf-8'))
        features = data['features']
        ids = [r['id'] for r in rows]
        if len(features) != 396 or sorted(f['id'] for f in features) != sorted(ids):
            raise ValueError('Traceability must contain each of the 396 IDs exactly once')
        expected = hashlib.sha256('\n'.join(sorted(ids)).encode()).hexdigest()
        if data.get('catalog_ids_sha256') != expected:
            raise ValueError('Stable feature ID fingerprint differs')
        expected_paths = {path for feature in features for path in feature['implementation']}
        if set(data.get('source_hashes', {})) != expected_paths:
            raise ValueError('Source fingerprints must cover every implementation reference')
        for path, fingerprint in data['source_hashes'].items():
            if not (root/path).is_file():
                raise ValueError(f'Missing implementation file: {path}')
            if hashlib.sha256((root/path).read_bytes()).hexdigest() != fingerprint:
                raise ValueError(f'Stale source fingerprint: {path}; review source mappings before rebuilding')
        by_id = {r['id']: r for r in rows}
        for feature in features:
            if feature['title'] != by_id[feature['id']]['title']:
                raise ValueError(f"Stale traceability title: {feature['id']}")
            if not feature.get('owner') or not feature.get('positive_acceptance') or not feature.get('negative_acceptance'):
                raise ValueError(f"Missing feature contract: {feature['id']}")
            if feature.get('acceptance') != 'NOT_RECERTIFIED':
                raise ValueError('This source inventory cannot certify acceptance')
            for field in ('implementation', 'test_candidates'):
                for path in feature[field]:
                    if not (root / path).is_file():
                        raise ValueError(f'Missing {field} file: {path}')
            contract = feature['contract_source']
            line = (root / contract['path']).read_text(encoding='utf-8').splitlines()[contract['line']-1]
            if not re.match(r'^\|\s*' + re.escape(feature['id']) + r'\s*\|', line):
                raise ValueError(f"Contract source mismatch: {feature['id']}")
            if feature['source_status'] not in ('PARTIAL_SOURCE', 'UNVERIFIED'):
                raise ValueError('Source inventory cannot mark a feature complete')
            if feature['source_status'] == 'PARTIAL_SOURCE' and not feature['implementation']:
                raise ValueError('Partial source status requires an implementation reference')
    return {'cursor': current, 'feature_count': len(rows), 'master_files': 13, 'functional_acceptance': 'NOT_CERTIFIED'}
