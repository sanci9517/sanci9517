import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { DatabaseSync } from 'node:sqlite';
import { adminPagesRoute } from '../src/routes/admin/pages.ts';
import { adminEditorRoute } from '../src/routes/admin/editor.ts';
import { publicPagesRoute } from '../src/routes/public/pages.ts';
import worker from '../src/index.ts';
import { hashSessionToken } from '../src/core/auth/session.ts';

// Executes production route SQL against SQLite. The adapter models D1's atomic
// batch contract; it does not claim to exercise the deployed Worker or D1.
async function fixture(t) {
  const db = new DatabaseSync(':memory:');
  t.after(() => db.close());
  db.exec(`
    CREATE TABLE sites(id TEXT PRIMARY KEY,slug TEXT,name TEXT);
    INSERT INTO sites VALUES('site-default','sanci9517','Sanci9517'),('other-site','other','Other');
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
  db.exec('ALTER TABLE pages ADD COLUMN parent_page_id TEXT');
  db.exec('ALTER TABLE pages ADD COLUMN published_parent_page_id TEXT');
  db.exec(readFileSync(new URL('../migrations/0024_page_slug_redirects.sql',import.meta.url),'utf8'));
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

function urlFixture(f){
 f.env.ASSETS={fetch:async()=>new Response('<!doctype html><title>Public page</title>',{headers:{'Content-Type':'text/html'}})};
 const patch=body=>adminPagesRoute(new Request('https://example.test/api/admin/pages',{method:'PATCH',headers:{Cookie:'sanci9517_session=editor','Content-Type':'application/json'},body:JSON.stringify({id:'p',...body})}),f.env);
 const visit=(slug,query='')=>worker.fetch(new Request(`https://example.test/p/${slug}${query}`),f.env,{});
 const publish=(version,text)=>f.edit({pageId:'p',expectedVersion:version,document:f.document(text),publish:true});
 return {patch,visit,publish};
}

test('WEB-013 published rename creates a one-hop same-origin redirect; draft save and preview do not redirect',async t=>{
 const f=await fixture(t),u=urlFixture(f);
 assert.equal((await u.patch({slug:'renamed',expectedVersion:1})).status,200);
 assert.equal((await u.visit('p')).status,200,'old URL remains LIVE before explicit publish');
 assert.equal((await u.visit('renamed')).status,404,'draft URL is not public');
 assert.equal((await u.visit('p','?preview=1')).status,401,'anonymous preview is never redirected');
 assert.equal((await u.publish(2,'new published')).status,200);
 const redirect=await u.visit('p','?ref=phone');
 assert.equal(redirect.status,308);assert.equal(redirect.headers.get('Location'),'/p/renamed?ref=phone');
 assert.equal(redirect.headers.get('Cache-Control'),'private, no-store, max-age=0');
 assert.equal((await u.visit('renamed')).status,200);
 assert.equal((await f.read('?slug=p')).status,404,'content API does not expose a historical slug as a page');
 assert.deepEqual(f.db.prepare('SELECT site_id,from_slug,page_id FROM page_slug_redirects').all().map(row=>({...row})),[{site_id:'site-default',from_slug:'p',page_id:'p'}]);
});

test('WEB-013 repeat rename and return to an old slug never create chains or loops',async t=>{
 const f=await fixture(t),u=urlFixture(f);
 assert.equal((await u.patch({slug:'second',expectedVersion:1})).status,200);
 assert.equal((await u.publish(2,'second')).status,200);
 assert.equal((await u.patch({slug:'third',expectedVersion:3})).status,200);
 assert.equal((await u.publish(4,'third')).status,200);
 for(const old of ['p','second'])assert.equal((await u.visit(old)).headers.get('Location'),'/p/third');
 assert.equal((await u.patch({slug:'p',expectedVersion:5})).status,200,'own historical slug is reusable');
 assert.equal((await u.publish(6,'returned')).status,200);
 assert.equal((await u.visit('p')).status,200);
 for(const old of ['second','third'])assert.equal((await u.visit(old)).headers.get('Location'),'/p/p');
 assert.deepEqual(f.db.prepare('SELECT from_slug FROM page_slug_redirects ORDER BY from_slug').all().map(r=>r.from_slug),['second','third']);
 assert.equal((await u.visit('missing')).status,404);
});

test('WEB-013 reservations reject shadowing and cross-site ownership while preserving site-scoped aliases',async t=>{
 const f=await fixture(t),u=urlFixture(f);
 const json=JSON.stringify(f.document('other','q'));
 f.db.prepare('INSERT INTO pages(id,site_id,slug,title,description,content_json,is_published,sort_order) VALUES(?,?,?,?,?,?,0,1)').run('q','site-default','q','Q','',json);
 assert.equal((await u.patch({slug:'renamed',expectedVersion:1})).status,200);
 assert.equal((await u.publish(2,'renamed')).status,200);
 const qPatch=slug=>adminPagesRoute(new Request('https://example.test/api/admin/pages',{method:'PATCH',headers:{Cookie:'sanci9517_session=editor','Content-Type':'application/json'},body:JSON.stringify({id:'q',slug,expectedVersion:0})}),f.env);
 for(const slug of ['p','renamed']){
  const response=await qPatch(slug);assert.equal(response.status,409,slug);assert.equal((await response.json()).error.code,'SLUG_RESERVED');
 }
 assert.equal(f.db.prepare('SELECT slug FROM pages WHERE id=?').get('q').slug,'q');
 assert.throws(()=>f.db.prepare('INSERT INTO page_slug_redirects(site_id,from_slug,page_id) VALUES(?,?,?)').run('site-default','outside','foreign'),/REDIRECT_SITE_MISMATCH/);
 f.db.prepare('INSERT INTO page_slug_redirects(site_id,from_slug,page_id) VALUES(?,?,?)').run('other-site','p','foreign');
 assert.equal((await u.visit('p')).headers.get('Location'),'/p/renamed','foreign-site alias must not leak');
 assert.equal((await adminPagesRoute(new Request('https://example.test/api/admin/pages',{method:'DELETE',headers:{Cookie:'sanci9517_session=editor','Content-Type':'application/json'},body:JSON.stringify({id:'p'})}),f.env)).status,409,'history owner cannot be permanently deleted');
});

test('WEB-013 failed redirect write rolls back revision, published URL and history atomically',async t=>{
 const f=await fixture(t),u=urlFixture(f);
 assert.equal((await u.patch({slug:'renamed',expectedVersion:1})).status,200);
 f.db.exec("CREATE TRIGGER fail_redirect BEFORE INSERT ON page_slug_redirects BEGIN SELECT RAISE(ABORT,'injected redirect failure'); END;");
 const before=f.state();
 await assert.rejects(()=>u.publish(2,'would be new'),/injected redirect failure/);
 assert.deepEqual(f.state(),before);
 assert.equal(f.db.prepare('SELECT COUNT(*) n FROM page_slug_redirects').get().n,0);
 assert.equal((await u.visit('p')).status,200);
 assert.equal((await u.visit('renamed')).status,404);
});

test('WEB-013 aliases go dark on unpublish and revive only after explicit republish',async t=>{
 const f=await fixture(t),u=urlFixture(f);
 assert.equal((await u.patch({slug:'renamed',expectedVersion:1})).status,200);
 assert.equal((await u.publish(2,'renamed')).status,200);
 assert.equal((await f.edit({pageId:'p',action:'unpublish'})).status,200);
 assert.equal((await u.visit('p')).status,404);
 assert.equal((await u.visit('renamed')).status,404);
 assert.equal((await u.publish(3,'republished')).status,200);
 assert.equal((await u.visit('p')).status,308);
});

test('WEB-013 archived alias stays reserved but returns 404 until explicit republish after restore',async t=>{
 const f=await fixture(t),u=urlFixture(f);
 const json=JSON.stringify(f.document('other','q'));
 f.db.prepare('INSERT INTO pages(id,site_id,slug,title,description,content_json,is_published,sort_order) VALUES(?,?,?,?,?,?,0,1)').run('q','site-default','q','Q','',json);
 assert.equal((await u.patch({slug:'renamed',expectedVersion:1})).status,200);
 assert.equal((await u.publish(2,'renamed')).status,200);
 const action=action=>adminPagesRoute(new Request('https://example.test/api/admin/pages',{method:'PATCH',headers:{Cookie:'sanci9517_session=editor','Content-Type':'application/json'},body:JSON.stringify({id:'p',action})}),f.env);
 assert.equal((await action('archive')).status,200);
 assert.equal((await u.visit('p')).status,404);
 assert.equal(f.db.prepare('SELECT COUNT(*) n FROM page_slug_redirects WHERE from_slug=?').get('p').n,1);
 assert.equal((await action('restore')).status,200);
 assert.equal((await u.visit('p')).status,404,'restore does not publish');
 assert.equal((await u.publish(3,'republished')).status,200);
 assert.equal((await u.visit('p')).headers.get('Location'),'/p/renamed');
});
