import assert from 'node:assert/strict';
import test from 'node:test';
import { DatabaseSync } from 'node:sqlite';
import { adminPagesRoute } from '../src/routes/admin/pages.ts';
import { adminEditorRoute } from '../src/routes/admin/editor.ts';
import { publicPagesRoute } from '../src/routes/public/pages.ts';
import { hashSessionToken } from '../src/core/auth/session.ts';

// Executes production route SQL against SQLite. The adapter models D1's atomic
// batch contract; it does not claim to exercise the deployed Worker or D1.
async function fixture(t) {
  const db = new DatabaseSync(':memory:');
  t.after(() => db.close());
  db.exec(`
    CREATE TABLE users(id TEXT PRIMARY KEY,email TEXT,display_name TEXT,role TEXT,is_active INTEGER);
    CREATE TABLE sessions(token_hash TEXT,user_id TEXT,expires_at TEXT);
    CREATE TABLE pages(archived_at TEXT,id TEXT PRIMARY KEY,site_id TEXT,slug TEXT,title TEXT,description TEXT,
      content_json TEXT,published_content_json TEXT,published_revision_id TEXT,is_published INTEGER,
      published_slug TEXT,published_title TEXT,published_description TEXT,sort_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,updated_at TEXT DEFAULT CURRENT_TIMESTAMP,published_at TEXT);
    CREATE TABLE editor_revisions(id TEXT PRIMARY KEY,page_id TEXT,version INTEGER,document_json TEXT,
      created_by TEXT,note TEXT,created_at TEXT DEFAULT CURRENT_TIMESTAMP,UNIQUE(page_id,version));
    CREATE TABLE audit_log(id TEXT PRIMARY KEY,user_id TEXT,action TEXT,entity_type TEXT,entity_id TEXT,metadata_json TEXT);
  `);
  for (const role of ['editor', 'viewer']) {
    db.prepare('INSERT INTO users VALUES (?,?,?,?,1)').run(role, `${role}@example.test`, role, role);
    db.prepare('INSERT INTO sessions VALUES (?,?,?)').run(await hashSessionToken(role), role, '2999-01-01');
  }
  const document = (text, id = 'p') => ({ type: 'sanci-page-document', schemaVersion: 1, activePageId: id,
    pages: { [id]: { id, rootId: 'root', nodes: { root: { id: 'root', type: 'root', parentId: null,
      children: [], props: { text } } } } } });
  for (const [id, site] of [['p', 'site-default'], ['foreign', 'other-site']]) {
    const json = JSON.stringify(document('original', id));
    db.prepare(`INSERT INTO pages(id,site_id,slug,title,description,content_json,published_content_json,
      published_revision_id,is_published,published_slug,published_title,published_description)
      VALUES (?,?,?,?,?,?,?,?,1,?,?,?)`).run(id, site, id, 'Original', 'Description', json, json, `r-${id}`, id, 'Original', 'Description');
    db.prepare('INSERT INTO editor_revisions(id,page_id,version,document_json) VALUES (?,?,1,?)').run(`r-${id}`, id, json);
  }
  const env = { DB: {
    beforeBatch: null,
    prepare(sql) {
      // D1 supports indexed placeholders; these queries bind each index once.
      const statement = db.prepare(sql.replace(/\?\d+/g, '?'));
      let values = [];
      return { bind(...args) { values = args; return this; },
        async first() { return statement.get(...values) ?? null; },
        async all() { return { results: statement.all(...values) }; },
        run() { return { meta: { changes: Number(statement.run(...values).changes) } }; } };
    },
    async batch(statements) {
      const hook = this.beforeBatch; this.beforeBatch = null;
      if (hook) await hook();
      db.exec('BEGIN');
      try { const results = statements.map(s => s.run()); db.exec('COMMIT'); return results; }
      catch (error) { db.exec('ROLLBACK'); throw error; }
    }
  } };
  const edit = (body, method = 'POST', role = 'editor') => adminEditorRoute(new Request('https://example.test/api/admin/editor', {
    method, headers: role ? { Cookie: `sanci9517_session=${role}` } : {}, body: JSON.stringify(body)
  }), env);
  const read = (query = '?slug=p', role = '') => publicPagesRoute(new Request(`https://example.test/api/public/pages${query}`, {
    headers: role ? { Cookie: `sanci9517_session=${role}` } : {}
  }), env);
  const publish = text => ({ pageId: 'p', expectedVersion: 1, document: document(text), publish: true });
  const state = () => ({ pages: db.prepare('SELECT * FROM pages ORDER BY id').all(),
    revisions: db.prepare('SELECT * FROM editor_revisions ORDER BY id').all(), audit: db.prepare('SELECT * FROM audit_log ORDER BY id').all() });
  return { db, env, document, edit, read, publish, state };
}

test('anonymous/viewer preview and write attempts are denied without mutations', async t => {
  const f = await fixture(t), before = f.state();
  for (const [role, status] of [['', 401], ['viewer', 403]]) {
    for (const query of ['?preview=1', '?preview=1&slug=p']) {
      const response = await f.read(query, role);
      assert.equal(response.status, status);
      assert.match(response.headers.get('Cache-Control'), /no-store/);
    }
    assert.equal((await f.edit(f.publish('forbidden'), 'POST', role)).status, status);
    assert.equal((await f.edit({pageId:'p', version:1, expectedVersion:1}, 'PUT', role)).status, status);
  }
  assert.deepEqual(f.state(), before);
});

test('save isolates draft, publish exposes it, rollback remains draft until republished', async t => {
  const f = await fixture(t);
  assert.equal((await f.edit({...f.publish('draft-only'), publish:false})).status, 200);
  const publicResponse = await f.read('?slug=p', 'editor');
  assert.match(publicResponse.headers.get('Cache-Control'), /no-store/);
  assert.equal(publicResponse.headers.get('Vary'), 'Cookie');
  assert.doesNotMatch(JSON.stringify(await publicResponse.json()), /draft-only/);
  assert.match(JSON.stringify(await (await f.read('?slug=p&preview=1', 'editor')).json()), /draft-only/);
  assert.equal((await f.edit({...f.publish('published-new'), expectedVersion:2})).status, 200);
  assert.match(JSON.stringify(await (await f.read()).json()), /published-new/);
  assert.equal((await f.edit({pageId:'p', version:1, expectedVersion:3}, 'PUT')).status, 200);
  assert.match(JSON.stringify(await (await f.read()).json()), /published-new/);
  assert.match(JSON.stringify(await (await f.read('?slug=p&preview=1', 'editor')).json()), /original/);
  const restored = JSON.parse(f.db.prepare("SELECT content_json FROM pages WHERE id='p'").get().content_json);
  assert.equal((await f.edit({...f.publish('unused'), document:restored, expectedVersion:4})).status, 200);
  assert.match(JSON.stringify(await (await f.read()).json()), /original/);
});

test('two publishers reading the same version yield one winner and one conflict', async t => {
  const f = await fixture(t);
  f.env.DB.beforeBatch = async () => assert.equal((await f.edit(f.publish('winner'))).status, 200);
  const loser = await f.edit(f.publish('loser'));
  assert.equal(loser.status, 409);
  assert.equal((await loser.json()).error.code, 'REVISION_CONFLICT');
  assert.match(JSON.stringify(await (await f.read()).json()), /winner/);
  assert.doesNotMatch(JSON.stringify(f.state()), /loser/);
  assert.equal(f.state().audit.length, 1);
  assert.equal(f.state().revisions.length, 3); // initial revisions for two sites + winner
});

test('audit SQL failure rolls back revision, draft and published pointer together', async t => {
  const f = await fixture(t), before = f.state();
  f.db.exec("CREATE TRIGGER fail_audit BEFORE INSERT ON audit_log BEGIN SELECT RAISE(ABORT,'injected audit failure'); END");
  await assert.rejects(f.edit(f.publish('must-rollback')), /injected audit failure/);
  assert.deepEqual(f.state(), before);
});

test('unpublish racing a new publish conflicts without recording a false audit', async t => {
  const f = await fixture(t);
  f.env.DB.beforeBatch = async () => assert.equal((await f.edit(f.publish('new-public'))).status, 200);
  assert.equal((await f.edit({pageId:'p', action:'unpublish'})).status, 409);
  assert.match(JSON.stringify(await (await f.read()).json()), /new-public/);
  assert.deepEqual(f.state().audit.map(a => a.action), ['page.publish']);
  assert.equal((await f.edit({pageId:'p', action:'unpublish'})).status, 200);
  assert.equal((await f.read()).status, 404);
  assert.equal((await f.edit({pageId:'p', action:'unpublish'})).status, 200);
  assert.deepEqual(f.state().audit.map(a => a.action).sort(), ['page.publish', 'page.unpublish']);
});

test('foreign-site pages cannot be read, saved, restored or unpublished', async t => {
  const f = await fixture(t), before = f.state();
  assert.equal((await f.read('?slug=foreign')).status, 404);
  assert.equal((await f.read('?slug=foreign&preview=1', 'editor')).status, 404);
  for (const query of ['', '?preview=1']) {
    assert.doesNotMatch(JSON.stringify(await (await f.read(query, 'editor')).json()), /foreign/);
  }
  assert.equal((await f.edit({pageId:'foreign', expectedVersion:1, document:f.document('bad', 'foreign'), publish:true})).status, 404);
  assert.equal((await f.edit({pageId:'foreign', expectedVersion:1, version:1}, 'PUT')).status, 404);
  assert.equal((await f.edit({pageId:'foreign', action:'unpublish'})).status, 404);
  assert.deepEqual(f.state(), before);
});

test('rollback losing a race with publish preserves the winning revision and audit', async t => {
  const f = await fixture(t);
  f.env.DB.beforeBatch = async () => assert.equal((await f.edit(f.publish('winner'))).status, 200);
  assert.equal((await f.edit({pageId:'p', version:1, expectedVersion:1}, 'PUT')).status, 409);
  assert.match(JSON.stringify(await (await f.read()).json()), /winner/);
  assert.deepEqual(f.state().audit.map(a => a.action), ['page.publish']);
  assert.equal(f.state().revisions.length, 3);
});

test('missing/stale revision and invalid publish hierarchy leave all persisted state untouched', async t => {
  const f = await fixture(t), before = f.state();
  assert.equal((await f.edit({...f.publish('bad'), expectedVersion:undefined})).status, 428);
  assert.equal((await f.edit({...f.publish('bad'), expectedVersion:0})).status, 409);
  const invalid = f.publish('bad');
  invalid.document.pages.p.nodes.root.children = ['missing'];
  assert.equal((await f.edit(invalid)).status, 409);
  assert.deepEqual(f.state(), before);
});


test('page list distinguishes saved drafts from LIVE snapshots through save, metadata change, publish, rollback and unpublish',async t=>{
 const f=await fixture(t);
 const list=async(meta=false)=>{
  const response=await adminPagesRoute(new Request('https://example.test/api/admin/pages'+(meta?'?meta=1':''),{headers:{Cookie:'sanci9517_session=editor'}}),f.env);
  assert.equal(response.status,200);
  return (await response.json()).data;
 };
 let rows=await list();assert.equal(rows.length,1);assert.equal(rows[0].hasUnpublishedChanges,false);
 assert.equal((await f.edit({...f.publish('pending'),publish:false})).status,200);
 rows=await list(true);assert.equal(rows[0].hasUnpublishedChanges,true);assert.equal(rows[0].isPublished,true);assert.equal('content' in rows[0],false);
 const changed=await adminPagesRoute(new Request('https://example.test/api/admin/pages',{method:'PATCH',headers:{Cookie:'sanci9517_session=editor','Content-Type':'application/json'},body:JSON.stringify({id:'p',title:'Renamed',slug:'new-slug',expectedVersion:2})}),f.env);
 assert.equal(changed.status,200);const metadata=(await changed.json()).data;assert.equal(metadata.hasUnpublishedChanges,true);
 assert.equal((await f.read('?slug=p')).status,200);assert.equal((await f.read('?slug=new-slug')).status,404);
 assert.equal((await f.edit({pageId:'p',expectedVersion:3,document:metadata.content,publish:true})).status,200);
 rows=await list();assert.equal(rows[0].hasUnpublishedChanges,false);assert.equal((await f.read('?slug=new-slug')).status,200);
 assert.equal((await f.edit({pageId:'p',version:1,expectedVersion:4},'PUT')).status,200);assert.equal((await list())[0].hasUnpublishedChanges,true);
 assert.equal((await f.edit({pageId:'p',action:'unpublish'})).status,200);rows=await list();assert.equal(rows[0].isPublished,false);assert.equal(rows[0].hasUnpublishedChanges,false);
});
