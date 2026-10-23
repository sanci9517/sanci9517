#!/usr/bin/env python3
"""Offline-only D1 reconciliation planner. Never opens a network connection."""
import argparse, hashlib, json, re, sqlite3
from pathlib import Path
if not __debug__:
    raise RuntimeError('Do not run safety checks with Python -O')
ROOT = Path(__file__).resolve().parents[2]
MANIFEST = ROOT / 'scripts/d1/manual-migrations.json'
EVIDENCE = ROOT / 'docs/evidence/d1-ledger-preflight.json'
RELEVANT = {'pages','editor_revisions','page_slug_redirects','site_domains','site_memberships','site_scoped_settings','media'}

def manifest():
    entries = json.loads(MANIFEST.read_text())
    for e in entries:
        assert hashlib.sha256((ROOT/e['path']).read_bytes()).hexdigest() == e['sha256'], 'Manual migration hash mismatch: '+e['name']
        assert not (ROOT/'migrations'/e['name']).exists(), 'Unsafe automatic replay: '+e['name']
    assert not any(re.match(r'002[5-8][_-]', p.name) for p in (ROOT/'migrations').glob('*.sql')), 'Reserved migration number collision'
    return entries

def schema(db):
    return [dict(zip(('type','name','tbl_name','sql'),r)) for r in db.execute("SELECT type,name,tbl_name,sql FROM sqlite_master WHERE sql IS NOT NULL AND name NOT LIKE 'sqlite_%' ORDER BY type,name")]

def normalize(sql):
    return re.sub(r'\s+', '', sql.replace('"','').replace('`','')).rstrip(';').lower()

def relevant(objects):
    return {o['name']:(o['type'],o['tbl_name'],normalize(o['sql'])) for o in objects if o['tbl_name'] in RELEVANT}

def bootstrap(db):
    assert not db.execute("SELECT 1 FROM sqlite_master WHERE name NOT LIKE 'sqlite_%'").fetchone(), 'Bootstrap requires an empty database'
    db.execute('PRAGMA foreign_keys=ON')
    db.execute('CREATE TABLE d1_migrations(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT UNIQUE,applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL)')
    automatic = sorted((ROOT/'migrations').glob('*.sql'))
    files = [p for p in automatic if p.name[:4] <= '0024'] + [ROOT/e['path'] for e in manifest()] + [p for p in automatic if p.name[:4] > '0028']
    for p in files:
        escaped=p.name.replace("'","''")
        try:
            db.executescript('BEGIN;\n'+p.read_text()+f"\nINSERT INTO d1_migrations(name) VALUES('{escaped}');\nCOMMIT;")
        except Exception:
            if db.in_transaction: db.rollback()
            raise
    assert not db.execute('PRAGMA foreign_key_check').fetchall()

def bootstrap_sql():
    db=sqlite3.connect(':memory:'); bootstrap(db)
    dump=list(db.iterdump()); db.close()
    # D1 keeps FK enforcement on. Create ALL tables before inserting rows,
    # then defer cyclic page/revision FKs until the single transaction ends.
    tables=[s for s in dump if s.startswith('CREATE TABLE')]
    data=[s for s in dump if s.startswith('INSERT INTO') and not s.startswith('INSERT INTO "sqlite_sequence"')]
    sequence=[s for s in dump if s.startswith('INSERT INTO "sqlite_sequence"')]
    other=[s for s in dump if s.startswith(('CREATE INDEX','CREATE UNIQUE INDEX','CREATE TRIGGER','CREATE VIEW'))]
    guard=["CREATE TABLE __bootstrap_empty_guard(ok INTEGER NOT NULL CHECK(ok=1));",
           "INSERT INTO __bootstrap_empty_guard SELECT CASE WHEN EXISTS(SELECT 1 FROM sqlite_master WHERE name NOT LIKE 'sqlite_%' AND name NOT GLOB '_cf_*' AND name<>'__bootstrap_empty_guard') THEN 0 ELSE 1 END;"]
    return '\n'.join(['PRAGMA defer_foreign_keys=ON;']+guard+tables+data+['DELETE FROM sqlite_sequence;']+sequence+other+['DROP TABLE __bootstrap_empty_guard;'])+'\n'

def expected_schema():
    db=sqlite3.connect(':memory:'); bootstrap(db)
    result=schema(db); db.close(); return result

def check_evidence(evidence):
    assert evidence['account_id']=='64bbd6a12ac732ed2cac4ca25d8bfa7e'
    assert evidence['database_id']=='5a4a5e96-fdad-421a-a33c-143daaf33e98'
    results=evidence['result']
    assert evidence['success'] and all(r['success'] and r['meta']['rows_written']==0 and not r['meta']['changed_db'] for r in results)
    actual=relevant(results[0]['results']); expected=relevant(expected_schema())
    differences=sorted(k for k in actual.keys()|expected.keys() if actual.get(k)!=expected.get(k))
    assert not differences, 'Schema mismatch: '+', '.join(differences)
    checks={x['check_name']:x['n'] for x in results[2]['results']}
    assert checks=={'domain':1,'active_default_users_without_membership':0,'default_settings_missing_or_different':0,'snapshot_tables':0}, checks
    assert results[3]['results']==[] and results[4]['results']==[{'quick_check':'ok'}]
    names=[r['name'] for r in results[1]['results']]
    assert len(names)==len(set(names))
    required={p.name for p in (ROOT/'migrations').glob('*.sql')}
    assert required <= set(names), 'Missing baseline ledger entry'
    allowed=required|{e['name'] for e in manifest()}|{'0001_initial.sql','0002_twitch_oauth.sql'}
    assert set(names)<=allowed, 'Unknown ledger names; review required'
    return len(expected)

def reconciliation_sql(evidence):
    check_evidence(evidence)
    # Only the ledger changes. A CHECK-guard inside one D1 transaction rejects
    # changed schema/ledger since the snapshot, including conflicting names.
    objects=evidence['result'][0]['results']
    guard=[]
    for o in objects:
        if o['tbl_name'] in RELEVANT or o['name']=='d1_migrations':
            q=lambda s: "'"+s.replace("'","''")+"'"
            guard.append(f"EXISTS(SELECT 1 FROM sqlite_master WHERE type={q(o['type'])} AND name={q(o['name'])} AND tbl_name={q(o['tbl_name'])} AND sql={q(o['sql'])})")
    count=sum(o['tbl_name'] in RELEVANT or o['name']=='d1_migrations' for o in objects)
    tables=','.join("'"+t+"'" for t in sorted(RELEVANT|{'d1_migrations'}))
    guard.append(f"(SELECT COUNT(*) FROM sqlite_master WHERE sql IS NOT NULL AND name NOT LIKE 'sqlite_%' AND tbl_name IN ({tables}))={count}")
    guard.append('NOT EXISTS(SELECT 1 FROM pragma_foreign_key_check)')
    guard.append("EXISTS(SELECT 1 FROM site_domains WHERE hostname='sanci9517-streamer-brand.sandor-bogadi95.workers.dev' AND site_id='site-default' AND status='verified' AND verification_method='cloudflare-worker-route' AND verified_at IS NOT NULL)")
    guard.append("NOT EXISTS(SELECT 1 FROM users u WHERE u.is_active=1 AND NOT EXISTS(SELECT 1 FROM site_memberships m WHERE m.site_id='site-default' AND m.user_id=u.id AND m.status='active' AND m.role=u.role))")
    guard.append("NOT EXISTS(SELECT 1 FROM site_settings s WHERE s.key='site' AND json_valid(s.value_json) AND NOT EXISTS(SELECT 1 FROM site_scoped_settings t WHERE t.site_id='site-default' AND t.key=s.key AND t.value_json=s.value_json))")
    guard.append("NOT EXISTS(SELECT 1 FROM sqlite_master WHERE name GLOB '__web013_*')")
    names=[r['name'] for r in evidence['result'][1]['results']]
    for name in names:
        if name not in {e['name'] for e in manifest()}:
            guard.append("EXISTS(SELECT 1 FROM d1_migrations WHERE name='"+name+"')")
    allowed=sorted(set(names)|{e['name'] for e in manifest()})
    guard.append("NOT EXISTS(SELECT 1 FROM d1_migrations WHERE name IS NULL OR name NOT IN ("+','.join("'"+n+"'" for n in allowed)+"))")
    sql=['-- REVIEW ONLY. Execute as ONE D1 query transaction after approval and fresh preflight.',
         '-- applied_at records reconciliation time, not historical installation time.',
         'CREATE TABLE __ledger_reconcile_guard(ok INTEGER NOT NULL CHECK(ok=1));',
         'INSERT INTO __ledger_reconcile_guard(ok) SELECT CASE WHEN '+ '\n AND '.join(guard)+' THEN 1 ELSE 0 END;']
    for e in manifest():
        sql.append(f"INSERT INTO d1_migrations(name) SELECT '{e['name']}' WHERE NOT EXISTS(SELECT 1 FROM d1_migrations WHERE name='{e['name']}');")
    sql.append('DROP TABLE __ledger_reconcile_guard;')
    return '\n'.join(sql)+'\n'

def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('action',choices=['check','sql','bootstrap','bootstrap-sql']); p.add_argument('--evidence',type=Path,default=EVIDENCE); p.add_argument('--output',type=Path)
    a=p.parse_args()
    if a.action=='bootstrap-sql':
        assert a.output, '--output required'; a.output.write_text(bootstrap_sql()); print('PASS: empty-database-only bootstrap SQL generated'); return
    if a.action=='bootstrap':
        assert a.output and not a.output.exists(), 'Use a new local database path'
        db=sqlite3.connect(a.output); bootstrap(db); db.close(); print('PASS: fresh local bootstrap through 0028'); return
    e=json.loads(a.evidence.read_text()); n=check_evidence(e)
    if a.action=='sql':
        assert a.output, '--output required'; a.output.write_text(reconciliation_sql(e))
    print(f'PASS: {n} relevant schema objects, seed checks, integrity and ledger baseline')
if __name__=='__main__': main()
