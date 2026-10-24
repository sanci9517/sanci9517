import importlib.util
from pathlib import Path
import sqlite3
import tempfile
import hashlib
import subprocess
import sys
import unittest
from collections import Counter

ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('restore',ROOT/'scripts/d1/restore-order.py')
m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
FIXTURE=(ROOT/'tests/fixtures/d1-export-order.sql').read_text()

class RestoreOrder(unittest.TestCase):
 def test_original_fails_and_complete_reordered_restore_preserves_everything(self):
  original=sqlite3.connect(':memory:'); original.execute('PRAGMA foreign_keys=ON')
  with self.assertRaisesRegex(sqlite3.OperationalError,'no such table: main.editor_revisions'):
   original.executescript('BEGIN;'+FIXTURE+'COMMIT;')
  original.close()
  reference=sqlite3.connect(':memory:'); reference.executescript(FIXTURE)
  actual=sqlite3.connect(':memory:'); actual.execute('PRAGMA foreign_keys=ON')
  ordered,summary=m.ordered_export(FIXTURE)
  actual.executescript('BEGIN;'+ordered+'COMMIT;')
  self.assertEqual(actual.execute('PRAGMA quick_check').fetchall(),[('ok',)])
  self.assertEqual(actual.execute('PRAGMA foreign_key_check').fetchall(),[])
  query="SELECT type,name,tbl_name,sql FROM sqlite_master ORDER BY type,name"
  self.assertEqual(actual.execute(query).fetchall(),reference.execute(query).fetchall())
  for table in ['pages','editor_revisions','events','sqlite_sequence']:
   self.assertEqual(actual.execute('SELECT * FROM '+table).fetchall(),reference.execute('SELECT * FROM '+table).fetchall())
  before,_=m.statements(FIXTURE);after,_=m.statements(ordered)
  self.assertEqual(Counter(s.strip() for s in before),Counter(s.strip() for s in after))
  self.assertEqual(summary['phases'],[1,3,5,1,1])
  with self.assertRaisesRegex(sqlite3.IntegrityError,'empty;body'):
   actual.execute("UPDATE pages SET body='' WHERE id='page'")
  actual.close();reference.close()
 def test_comment_tail_and_semicolons_stay_intact(self):
  source=FIXTURE+'\n-- tail; comment\n/* more; comment */'
  ordered,_=m.ordered_export(source)
  self.assertTrue(ordered.endswith('-- tail; comment\n/* more; comment */'))
  self.assertEqual(len(m.statements(ordered)[0]),len(m.statements(FIXTURE)[0]))
 def test_unknown_or_unsafe_statements_fail_closed(self):
  for tail in ['UPDATE pages SET body=\'no\';','PRAGMA foreign_keys=OFF;','DROP TABLE pages;','DELETE FROM pages;','BEGIN;']:
   with self.assertRaises(ValueError):m.ordered_export(FIXTURE+tail)
 def test_cli_hash_and_overwrite_guards_do_not_modify_source(self):
  with tempfile.TemporaryDirectory() as folder:
   source=Path(folder)/'original.sql';output=Path(folder)/'restore.sql';source.write_text(FIXTURE)
   digest=hashlib.sha256(source.read_bytes()).hexdigest()
   args=[sys.executable,str(ROOT/'scripts/d1/restore-order.py'),'--source',str(source),'--output',str(output),'--expected-sha256']
   self.assertNotEqual(subprocess.run(args+['wrong'],capture_output=True).returncode,0)
   self.assertFalse(output.exists())
   result=subprocess.run(args+[digest],capture_output=True,text=True)
   self.assertEqual(result.returncode,0)
   self.assertNotIn("fixture;",result.stdout)
   before=output.read_bytes()
   self.assertNotEqual(subprocess.run(args+[digest],capture_output=True).returncode,0)
   self.assertEqual(output.read_bytes(),before)
   self.assertEqual(source.read_text(),FIXTURE)
   self.assertEqual(output.stat().st_mode & 0o777,0o600)
 def test_incomplete_statement_rejected(self):
  with self.assertRaises(ValueError):m.ordered_export(FIXTURE+"INSERT INTO pages VALUES('unterminated")

if __name__=='__main__':unittest.main()
