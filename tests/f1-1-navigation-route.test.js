import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { DatabaseSync } from 'node:sqlite';
import { adminNavigationRoute } from '../src/routes/admin/navigation.ts';
import { publicNavigationRoute } from '../src/routes/public/navigation.ts';
import { hashSessionToken } from '../src/core/auth/session.ts';

const migration = readFileSync(new URL('../migrations/0020_site_navigation_snapshots.sql', import.meta.url), 'utf8');

async function fixture(t) {
  const db = new DatabaseSync(':memory:');
  t.after(() => db.close());
  db.exec(`
    PRAGMA foreign_keys=ON;
    CREATE TABLE sites(id TEXT PRIMARY KEY,slug TEXT NOT NULL UNIQUE,name TEXT NOT NULL);
    CREATE TABLE users(id TEXT PRIMARY KEY,email TEXT,display_name TEXT,role TEXT,is_active INTEGER);
    CREATE TABLE sessions(token_hash TEXT,user_id TEXT,expires_at TEXT);
    CREATE TABLE pages(id TEXT PRIMARY KEY,site_id TEXT NOT NULL,is_published INTEGER NOT NULL,published_slug TEXT,published_title TEXT,title TEXT,slug TEXT,sort_order INTEGER);
    CREATE TABLE audit_log(id TEXT PRIMARY KEY,user_id TEXT,action TEXT,entity_type TEXT,entity_id TEXT,metadata_json TEXT);
    INSERT INTO sites VALUES('site-default','sanci9517','Sanci9517'),('other-site','other','Other');
    INSERT INTO users VALUES('editor','editor@example.test','Editor','editor',1),('viewer','viewer@example.test','Viewer','viewer',1);
    INSERT INTO pages VALUES('home','site-default',1,'home','Home','Home','home',0),('youtube','site-default',1,'youtube','YouTube','YouTube','youtube',1),('draft','site-default',0,NULL,NULL,'Draft','draft',2),('foreign','other-site',1,'foreign','Foreign','Foreign','foreign',0);
  `);
  db.exec(migration);
  const insertSession=db.prepare('INSERT INTO sessions VALUES(?,?,?)');
  insertSession.run(await hashSessionToken('editor-token'),'editor','2999-01-01');
  insertSession.run(await hashSessionToken('viewer-token'),'viewer','2999-01-01');
  const DB={
    prepare(sql){const statement=db.prepare(sql.replace(/\?\d+/g,'?'));let values=[];return{bind(...args){values=[...args];return this},async first(){return statement.get(...values)??null},async all(){return{results:statement.all(...values)}},async run(){return{meta:{changes:Number(statement.run(...values).changes)}}}}},
    async batch(statements){db.exec('BEGIN');try{const results=await Promise.all(statements.map(statement=>statement.run()));db.exec('COMMIT');return results}catch(error){db.exec('ROLLBACK');throw error}}
  };
  const req=(method='GET',body,cookie='editor-token')=>new Request('https://example.test/api/admin/navigation',{method,headers:{Cookie:`sanci9517_session=${cookie}`,'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body)});
  return {db,DB,req};
}

test('navigation administration requires an editor role and returns site-scoped snapshots',async t=>{
  const f=await fixture(t);
  assert.equal((await adminNavigationRoute(f.req('GET',undefined,''),{DB:f.DB})).status,401);
  assert.equal((await adminNavigationRoute(f.req('GET',undefined,'viewer-token'),{DB:f.DB})).status,403);
  const response=await adminNavigationRoute(f.req(),{DB:f.DB});
  assert.equal(response.status,200);
  const data=(await response.json()).data;
  assert.equal(data.revision,1);
  assert.deepEqual(data.draft.items.map(item=>item.pageId),['youtube']);
  assert.deepEqual(data.pages.map(page=>page.id),['home','youtube','draft']);
});

test('draft updates are revision-checked and do not alter the public menu before publish',async t=>{
  const f=await fixture(t);
  const tree={schemaVersion:1,items:[{id:'youtube-link',type:'page',pageId:'youtube',children:[]},{id:'external',type:'external',label:'Közösség',url:'https://example.org/community',children:[]}]};
  const response=await adminNavigationRoute(f.req('PUT',{tree,expectedRevision:1}),{DB:f.DB});
  assert.equal(response.status,200,JSON.stringify(await response.clone().json()));
  assert.equal((await response.json()).data.revision,2);
  const stored=f.db.prepare("SELECT draft_json,published_json,revision,published_revision FROM site_navigation WHERE site_id='site-default'").get();
  assert.deepEqual(JSON.parse(stored.draft_json),tree);
  assert.deepEqual(JSON.parse(stored.published_json).items.map(item=>item.pageId),['youtube']);
  assert.equal(stored.revision,2);assert.equal(stored.published_revision,1);
  assert.equal(f.db.prepare('SELECT COUNT(*) AS n FROM audit_log WHERE action=?').get('navigation.update').n,1);
  assert.equal((await adminNavigationRoute(f.req('PUT',{tree,expectedRevision:1}),{DB:f.DB})).status,409);
});

test('draft validation rejects foreign page targets, duplicate node IDs and unsafe external URLs',async t=>{
  const f=await fixture(t);
  const make=(item)=>({schemaVersion:1,items:[item]});
  const send=tree=>adminNavigationRoute(f.req('PUT',{tree,expectedRevision:1}),{DB:f.DB});
  assert.equal((await send(make({id:'foreign',type:'page',pageId:'foreign',children:[]}))).status,400);
  assert.equal((await send({schemaVersion:1,items:[{id:'x',type:'page',pageId:'youtube',children:[]},{id:'x',type:'page',pageId:'youtube',children:[]}]})).status,400);
  assert.equal((await send(make({id:'bad',type:'external',label:'Bad',url:'javascript:alert(1)',children:[]}))).status,400);
  assert.equal(f.db.prepare("SELECT revision FROM site_navigation WHERE site_id='site-default'").get().revision,1);
});

test('draft mutation and audit record roll back together on audit failure',async t=>{
  const f=await fixture(t);
  f.db.exec("CREATE TRIGGER fail_navigation_audit BEFORE INSERT ON audit_log WHEN NEW.action='navigation.update' BEGIN SELECT RAISE(FAIL,'audit unavailable'); END");
  const before=f.db.prepare("SELECT draft_json,revision FROM site_navigation WHERE site_id='site-default'").get();
  const tree={schemaVersion:1,items:[{id:'new-link',type:'page',pageId:'youtube',children:[]}]};
  await assert.rejects(()=>adminNavigationRoute(f.req('PUT',{tree,expectedRevision:1}),{DB:f.DB}),/audit unavailable/);
  const after=f.db.prepare("SELECT draft_json,revision FROM site_navigation WHERE site_id='site-default'").get();
  assert.deepEqual(after,before);
  assert.equal(f.db.prepare("SELECT COUNT(*) AS n FROM audit_log WHERE action='navigation.update'").get().n,0);
});

test('publishing rejects draft page targets and publishes only the expected revision',async t=>{
  const f=await fixture(t);
  const draftTree={schemaVersion:1,items:[{id:'draft-link',type:'page',pageId:'draft',children:[]}]};
  const saved=await adminNavigationRoute(f.req('PUT',{tree:draftTree,expectedRevision:1}),{DB:f.DB}); assert.equal(saved.status,200,JSON.stringify(await saved.clone().json()));
  const rejected=await adminNavigationRoute(f.req('POST',{action:'publish',expectedRevision:2}),{DB:f.DB});
  assert.equal(rejected.status,409);
  assert.deepEqual(JSON.parse(f.db.prepare("SELECT published_json FROM site_navigation WHERE site_id='site-default'").get().published_json).items.map(item=>item.pageId),['youtube']);
  f.db.prepare("UPDATE pages SET is_published=1,published_slug='draft',published_title='Draft' WHERE id='draft' AND site_id='site-default'").run();
  const accepted=await adminNavigationRoute(f.req('POST',{action:'publish',expectedRevision:2}),{DB:f.DB});
  assert.equal(accepted.status,200);
  const row=f.db.prepare("SELECT draft_json,published_json,revision,published_revision FROM site_navigation WHERE site_id='site-default'").get();
  assert.deepEqual(JSON.parse(row.published_json),JSON.parse(row.draft_json));
  assert.equal(row.revision,2);assert.equal(row.published_revision,2);
});

test('public navigation resolves only published pages and preserves nested order',async t=>{
  const f=await fixture(t);
  const tree={schemaVersion:1,items:[{id:'group',type:'external',label:'Creator',url:'https://example.org',children:[{id:'yt',type:'page',pageId:'youtube',children:[]},{id:'hidden',type:'page',pageId:'draft',children:[]},{id:'deleted',type:'page',pageId:'deleted-page',children:[]}]}]};
  f.db.prepare("UPDATE pages SET published_slug='youtube-renamed' WHERE id='youtube'").run();
  f.db.prepare("UPDATE site_navigation SET published_json=? WHERE site_id='site-default'").run(JSON.stringify(tree));
  const response=await publicNavigationRoute({DB:f.DB});
  assert.equal(response.status,200);
  const data=(await response.json()).data;
  assert.deepEqual(data.items.map(item=>item.label),['Creator']);
  assert.equal(data.items[0].href,'https://example.org');
  assert.deepEqual(data.items[0].children.map(item=>item.href),['/p/youtube-renamed']);
  assert.equal(response.headers.get('Cache-Control'),'no-store');
});
