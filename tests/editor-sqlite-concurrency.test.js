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


test('stale concurrent publish cannot replace the winning public snapshot', () => {
  const script = `
import sqlite3
c=sqlite3.connect(':memory:')
c.executescript("""
CREATE TABLE pages(id TEXT PRIMARY KEY,site_id TEXT,content_json TEXT,published_content_json TEXT,published_revision_id TEXT,is_published INTEGER);
CREATE TABLE editor_revisions(id TEXT PRIMARY KEY,page_id TEXT,version INTEGER,document_json TEXT,UNIQUE(page_id,version));
INSERT INTO pages VALUES ('p','site','initial','initial','old',1);
INSERT INTO editor_revisions VALUES ('old','p',1,'initial');
""")
insert="INSERT INTO editor_revisions(id,page_id,version,document_json) SELECT ?,?,?,? WHERE (SELECT COALESCE(MAX(version),0) FROM editor_revisions WHERE page_id=?)=?"
update="UPDATE pages SET content_json=?,published_content_json=?,published_revision_id=? WHERE id=? AND site_id=? AND EXISTS (SELECT 1 FROM editor_revisions WHERE id=?)"
results=[]
for rev,content in [('winner','published-v2'),('stale','must-not-publish')]:
    with c:
        inserted=c.execute(insert,(rev,'p',2,content,'p',1)).rowcount
        c.execute(update,(content,content,rev,'p','site',rev))
    results.append(inserted)
assert results==[1,0],results
assert c.execute('SELECT content_json,published_content_json,published_revision_id FROM pages').fetchone()==('published-v2','published-v2','winner')
assert c.execute('SELECT COUNT(*) FROM editor_revisions').fetchone()[0]==2
print('PASS')
`;
  assert.match(execFileSync('python3', ['-c', script], { encoding: 'utf8' }), /PASS/);
});


test('rollback creates a new draft without changing the public snapshot', () => {
  const script = `
import sqlite3
c=sqlite3.connect(':memory:')
c.executescript("""
CREATE TABLE pages(id TEXT PRIMARY KEY,site_id TEXT,content_json TEXT,published_content_json TEXT,published_revision_id TEXT,is_published INTEGER);
CREATE TABLE editor_revisions(id TEXT PRIMARY KEY,page_id TEXT,version INTEGER,document_json TEXT,UNIQUE(page_id,version));
INSERT INTO pages VALUES ('p','site','draft-v2','published-v1','published-rev',1);
INSERT INTO editor_revisions VALUES ('published-rev','p',1,'published-v1');
INSERT INTO editor_revisions VALUES ('draft-rev','p',2,'draft-v2');
""")
insert="INSERT INTO editor_revisions(id,page_id,version,document_json) SELECT ?,?,?,? WHERE (SELECT COALESCE(MAX(version),0) FROM editor_revisions WHERE page_id=?)=?"
update="UPDATE pages SET content_json=? WHERE id=? AND site_id=? AND EXISTS (SELECT 1 FROM editor_revisions WHERE id=?)"
with c:
    assert c.execute(insert,('rollback-rev','p',3,'published-v1','p',2)).rowcount==1
    assert c.execute(update,('published-v1','p','site','rollback-rev')).rowcount==1
assert c.execute('SELECT content_json,published_content_json,published_revision_id,is_published FROM pages').fetchone()==('published-v1','published-v1','published-rev',1)
with c:
    assert c.execute(insert,('stale-rev','p',3,'stale','p',2)).rowcount==0
    assert c.execute(update,('stale','p','site','stale-rev')).rowcount==0
assert c.execute('SELECT content_json,published_content_json,published_revision_id FROM pages').fetchone()==('published-v1','published-v1','published-rev')
print('PASS')
`;
  assert.match(execFileSync('python3', ['-c', script], { encoding: 'utf8' }), /PASS/);
});


test('draft metadata stays private until explicit publish, including slug changes', () => {
  const script = `
import sqlite3
db=sqlite3.connect(':memory:')
db.executescript("""
CREATE TABLE pages(id TEXT PRIMARY KEY,site_id TEXT,slug TEXT,title TEXT,description TEXT,content_json TEXT,published_slug TEXT,published_title TEXT,published_description TEXT,published_content_json TEXT,is_published INTEGER,published_revision_id TEXT);
CREATE TABLE editor_revisions(id TEXT PRIMARY KEY,page_id TEXT,version INTEGER,document_json TEXT,UNIQUE(page_id,version));
INSERT INTO pages VALUES ('p','site','old','Old','Old description','v1','old','Old','Old description','v1',1,'r1');
INSERT INTO editor_revisions VALUES ('r1','p',1,'v1');
""")
db.execute("UPDATE pages SET slug='new',title='New',description='Draft only',content_json='v2' WHERE id='p'")
assert db.execute("SELECT published_slug,published_title,published_description,published_content_json FROM pages").fetchone()==('old','Old','Old description','v1')
assert db.execute("SELECT id FROM pages WHERE site_id='site' AND published_slug='new' AND is_published=1").fetchone() is None
assert db.execute("SELECT id FROM pages WHERE site_id='site' AND published_slug='old' AND is_published=1").fetchone()==('p',)
db.execute("INSERT INTO editor_revisions VALUES ('r2','p',2,'v2')")
db.execute("""UPDATE pages SET published_slug=slug,published_title=title,published_description=description,published_content_json=content_json,published_revision_id='r2' WHERE id='p' AND site_id='site' AND EXISTS(SELECT 1 FROM editor_revisions WHERE id='r2')""")
assert db.execute("SELECT published_slug,published_title,published_description,published_content_json,published_revision_id FROM pages").fetchone()==('new','New','Draft only','v2','r2')
assert db.execute("SELECT id FROM pages WHERE site_id='site' AND published_slug='old' AND is_published=1").fetchone() is None
print('PASS')
`;
  assert.match(execFileSync('python3', ['-c', script], { encoding: 'utf8' }), /PASS/);
});
