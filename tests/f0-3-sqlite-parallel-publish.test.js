import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import test from 'node:test';

// Two independent SQLite connections exercise the revision CAS under an actual
// write lock. This is not a substitute for a live Cloudflare D1 acceptance test.
test('concurrent publish requests preserve one winning snapshot and audit event', () => {
  const script = String.raw`
import os, sqlite3, tempfile, threading
fd,path=tempfile.mkstemp(suffix='.sqlite')
os.close(fd)
try:
    setup=sqlite3.connect(path)
    setup.executescript("""
    PRAGMA journal_mode=WAL;
    CREATE TABLE pages(id TEXT PRIMARY KEY,site_id TEXT,content_json TEXT,published_content_json TEXT,published_revision_id TEXT);
    CREATE TABLE editor_revisions(id TEXT PRIMARY KEY,page_id TEXT,version INTEGER,document_json TEXT,UNIQUE(page_id,version));
    CREATE TABLE audit_log(id TEXT PRIMARY KEY,action TEXT);
    INSERT INTO pages VALUES ('p','s','v1','v1','r1');
    INSERT INTO editor_revisions VALUES ('r1','p',1,'v1');
    """)
    setup.commit()
    setup.close()
    barrier=threading.Barrier(2)
    results=[]
    lock=threading.Lock()
    def publish(name):
        db=sqlite3.connect(path,timeout=10,isolation_level=None)
        try:
            barrier.wait(timeout=10)
            db.execute('BEGIN IMMEDIATE')
            inserted=db.execute("""INSERT INTO editor_revisions(id,page_id,version,document_json)
                SELECT ?,?,?,? WHERE (SELECT COALESCE(MAX(version),0) FROM editor_revisions WHERE page_id=?)=?""",
                (name,'p',2,name,'p',1)).rowcount
            db.execute("""UPDATE pages SET content_json=?,published_content_json=?,published_revision_id=?
                WHERE id='p' AND site_id='s' AND EXISTS(SELECT 1 FROM editor_revisions WHERE id=?)""",
                (name,name,name,name))
            db.execute("""INSERT INTO audit_log(id,action) SELECT ?,'page.publish'
                WHERE EXISTS(SELECT 1 FROM editor_revisions WHERE id=?)""",(name,name))
            db.commit()
            with lock: results.append(inserted)
        finally: db.close()
    threads=[threading.Thread(target=publish,args=(name,)) for name in ('first','second')]
    for thread in threads: thread.start()
    for thread in threads: thread.join(timeout=15)
    assert all(not thread.is_alive() for thread in threads)
    check=sqlite3.connect(path)
    assert sorted(results)==[0,1],results
    content,published,rev=check.execute('SELECT content_json,published_content_json,published_revision_id FROM pages').fetchone()
    assert content==published==rev and rev in ('first','second'),(content,published,rev)
    assert check.execute('SELECT COUNT(*) FROM editor_revisions').fetchone()[0]==2
    assert check.execute('SELECT COUNT(*) FROM audit_log').fetchone()[0]==1
    check.close()
    print('PASS')
finally:
    os.unlink(path)
`;
  assert.match(execFileSync('python3', ['-c', script], { encoding: 'utf8', timeout: 30000 }), /PASS/);
});
