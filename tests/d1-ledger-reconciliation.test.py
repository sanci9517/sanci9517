import copy, importlib.util, json, sqlite3, unittest, tempfile, shutil
from pathlib import Path
root=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('ledger',root/'scripts/d1/ledger-reconciliation.py')
m=importlib.util.module_from_spec(spec); spec.loader.exec_module(m)

class Reconciliation(unittest.TestCase):
 def setUp(self):
  self.e=json.loads(m.EVIDENCE.read_text()); self.db=sqlite3.connect(':memory:')
  # Exact production sqlite_master SQL; synthetic rows, no production user data.
  objects=self.e['result'][0]['results']
  for kind in ('table','index','trigger','view'):
   for o in objects:
    if o['type']==kind: self.db.execute(o['sql'])
  for r in self.e['result'][1]['results']:
   self.db.execute('INSERT INTO d1_migrations(id,name,applied_at) VALUES(?,?,?)',(r['id'],r['name'],r['applied_at']))
  self.db.execute("INSERT INTO sites(id,slug,name) VALUES('site-default','default','Fixture')")
  self.db.execute("INSERT INTO media(id,site_id,object_key,original_name,mime_type,size_bytes) VALUES('asset','site-default','key','name','image/png',12)")
  self.db.execute("INSERT INTO site_domains(hostname,site_id,status,verified_at,verification_method) VALUES('sanci9517-streamer-brand.sandor-bogadi95.workers.dev','site-default','verified','2026-10-17','cloudflare-worker-route')")
  self.db.commit()
 def tearDown(self): self.db.close()
 def snapshot(self):
  return {r[0]:self.db.execute('SELECT * FROM "'+r[0]+'" ORDER BY 1').fetchall() for r in self.db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT IN ('d1_migrations','sqlite_sequence')")}
 def run_sql(self):
  try: self.db.executescript('BEGIN;\n'+m.reconciliation_sql(self.e)+'COMMIT;')
  except Exception:
   self.db.rollback(); raise
 def test_schema_seed_evidence(self): self.assertEqual(m.check_evidence(self.e),40)
 def test_idempotent_preserves_data_and_ledger_history(self):
  before=self.snapshot(); ledger=self.db.execute('SELECT * FROM d1_migrations').fetchall()
  self.run_sql(); first=self.db.execute('SELECT * FROM d1_migrations').fetchall()
  self.assertEqual(len(first),len(ledger)+4); self.assertEqual(first[:len(ledger)],ledger)
  self.assertEqual(before,self.snapshot()); self.run_sql()
  self.assertEqual(first,self.db.execute('SELECT * FROM d1_migrations').fetchall()); self.assertEqual(before,self.snapshot())
 def test_partial_reconciliation(self):
  self.db.execute('INSERT INTO d1_migrations(name) VALUES(?)',(m.manifest()[0]['name'],)); self.db.commit()
  self.run_sql(); self.assertEqual(self.db.execute('SELECT COUNT(*) FROM d1_migrations').fetchone()[0],34)
 def test_schema_drift_aborts_atomically(self):
  self.db.execute('DROP TRIGGER media_archive_pages_update_guard'); self.db.commit()
  with self.assertRaises(sqlite3.IntegrityError): self.run_sql()
  self.assertEqual(self.db.execute('SELECT COUNT(*) FROM d1_migrations').fetchone()[0],30)
  self.assertFalse(self.db.execute("SELECT 1 FROM sqlite_master WHERE name='__ledger_reconcile_guard'").fetchone())
 def test_unexpected_ledger_name_aborts(self):
  self.db.execute("INSERT INTO d1_migrations(name) VALUES('0025_unreviewed.sql')"); self.db.commit()
  with self.assertRaises(sqlite3.IntegrityError): self.run_sql()
 def test_fresh_bootstrap_matches_production_structure_and_reserved_names(self):
  fresh=sqlite3.connect(':memory:'); m.bootstrap(fresh)
  self.assertEqual(m.relevant(m.schema(fresh)),m.relevant(self.e['result'][0]['results']))
  files={p.name for p in (root/'migrations').glob('*.sql')}|{e['name'] for e in m.manifest()}
  self.assertEqual({r[0] for r in fresh.execute('SELECT name FROM d1_migrations')},files)
  self.assertEqual(fresh.execute('PRAGMA foreign_key_check').fetchall(),[])
  self.assertEqual(fresh.execute('PRAGMA quick_check').fetchall(),[('ok',)])
  with self.assertRaises(AssertionError): m.bootstrap(fresh)
  fresh.close()
 def test_bootstrap_sql_with_foreign_keys_enabled(self):
  fresh=sqlite3.connect(':memory:'); fresh.execute('PRAGMA foreign_keys=ON')
  fresh.executescript('BEGIN;'+m.bootstrap_sql()+'COMMIT;')
  self.assertEqual(m.relevant(m.schema(fresh)),m.relevant(self.e['result'][0]['results']))
  self.assertEqual(fresh.execute('PRAGMA foreign_key_check').fetchall(),[])
  fresh.close()
 def test_future_migration_follows_manual_chain_and_reserved_numbers_fail(self):
  original=m.ROOT
  with tempfile.TemporaryDirectory() as folder:
   target=Path(folder); shutil.copytree(root/'migrations',target/'migrations'); shutil.copytree(root/'scripts/pending',target/'scripts/pending')
   try:
    m.ROOT=target
    (target/'migrations/0029_future_probe.sql').write_text('CREATE TABLE future_probe AS SELECT archived_at FROM media;')
    fresh=sqlite3.connect(':memory:'); m.bootstrap(fresh)
    self.assertEqual(fresh.execute('SELECT name FROM d1_migrations ORDER BY id DESC LIMIT 1').fetchone()[0],'0029_future_probe.sql')
    fresh.close()
    (target/'migrations/0025_alternate.sql').write_text('SELECT 1;')
    with self.assertRaises(AssertionError): m.manifest()
   finally: m.ROOT=original
 def test_bootstrap_sql_rejects_nonempty_database(self):
  fresh=sqlite3.connect(':memory:'); fresh.execute('CREATE TABLE existing(id TEXT)')
  with self.assertRaises(sqlite3.IntegrityError): fresh.executescript('BEGIN;'+m.bootstrap_sql()+'COMMIT;')
  fresh.rollback(); self.assertEqual(fresh.execute("SELECT name FROM sqlite_master").fetchall(),[('existing',)])
  fresh.close()
 def test_generated_sql_is_reviewed_artifact(self):
  self.assertEqual(m.reconciliation_sql(self.e),(root/'scripts/d1/reconcile-0025-0028.sql').read_text())
 def test_evidence_drift_and_bad_seed_fail_closed(self):
  for mutate in [lambda e:e['result'][0]['results'].pop(),lambda e:e['result'][2]['results'][0].update(n=0)]:
   e=copy.deepcopy(self.e); mutate(e)
   with self.assertRaises(AssertionError): m.check_evidence(e)

if __name__=='__main__': unittest.main()
