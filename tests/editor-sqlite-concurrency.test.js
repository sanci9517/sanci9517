import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import test from 'node:test';

test('SQLite revision gate rejects a second save and preserves winning content', () => {
  const script = `
import sqlite3
db=sqlite3.connect(':memory:')
db.executescript("""
CREATE TABLE pages(id TEXT PRIMARY KEY,site_id TEXT,content_json TEXT,published_content_json TEXT);
CREATE TABLE editor_revisions(id TEXT PRIMARY KEY,page_id TEXT,version INTEGER,document_json TEXT,created_by TEXT,note TEXT,UNIQUE(page_id,version));
CREATE TABLE audit_log(id TEXT PRIMARY KEY,user_id TEXT,action TEXT,entity_type TEXT,entity_id TEXT,metadata_json TEXT);
INSERT INTO pages(id,site_id,content_json) VALUES ('p','s','initial');
""")
insert="""INSERT INTO editor_revisions (id,page_id,version,document_json,created_by,note)
SELECT ?,?,?,?,?,? WHERE (SELECT COALESCE(MAX(version),0) FROM editor_revisions WHERE page_id=?)=?"""
draft="""UPDATE pages SET content_json=? WHERE id=? AND site_id=? AND EXISTS (SELECT 1 FROM editor_revisions WHERE id=?)"""
publish="""UPDATE pages SET published_content_json=? WHERE id=? AND site_id=? AND EXISTS (SELECT 1 FROM editor_revisions WHERE id=?)"""
audit_sql='INSERT INTO audit_log (id,user_id,action,entity_type,entity_id,metadata_json) SELECT ?,?,?,?,?,? WHERE EXISTS (SELECT 1 FROM editor_revisions WHERE id=?)'
results=[]
for rev,content in [('first','winning'),('second','losing')]:
    with db:
        inserted=db.execute(insert,(rev,'p',1,content,'u','save','p',0)).rowcount
        db.execute(draft,(content,'p','s',rev))
        db.execute(publish,(content,'p','s',rev))
        db.execute(audit_sql,('audit-'+rev,'u','page.publish','page','p','{}',rev))
    results.append(inserted)
row=db.execute('SELECT content_json,published_content_json FROM pages WHERE id=?',('p',)).fetchone()
assert results==[1,0],results
assert row==('winning','winning'),row
assert db.execute('SELECT COUNT(*) FROM editor_revisions').fetchone()[0]==1
assert db.execute('SELECT COUNT(*) FROM audit_log').fetchone()[0]==1
with db:
    assert db.execute(insert,('rollback','p',2,'restored','u','rollback','p',1)).rowcount==1
    db.execute(draft,('restored','p','s','rollback'))
    db.execute(audit_sql,('audit-rollback','u','page.rollback','page','p','{}','rollback'))
with db:
    assert db.execute(insert,('stale-rollback','p',2,'stale','u','rollback','p',1)).rowcount==0
    db.execute(draft,('stale','p','s','stale-rollback'))
    db.execute(audit_sql,('audit-stale','u','page.rollback','page','p','{}','stale-rollback'))
assert db.execute('SELECT content_json,published_content_json FROM pages').fetchone()==('restored','winning')
assert db.execute('SELECT COUNT(*) FROM audit_log').fetchone()[0]==2
print('PASS')
`;
  const result = execFileSync('python3', ['-c', script], { encoding: 'utf8' });
  assert.match(result, /PASS/);
});
