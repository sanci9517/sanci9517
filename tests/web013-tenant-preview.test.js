import assert from 'node:assert/strict';
import test from 'node:test';
import { DatabaseSync } from 'node:sqlite';
import { hashSessionToken } from '../src/core/auth/session.ts';
import { publicPagesRoute } from '../src/routes/public/pages.ts';

const doc = id => JSON.stringify({
  type:'sanci-page-document', schemaVersion:1, activePageId:id,
  pages:{[id]:{id,rootId:'root',nodes:{
    root:{id:'root',type:'root',parentId:null,children:[],props:{text:id}}
  }}}
});

async function fixture(t, { enabled=true }={}) {
  const db=new DatabaseSync(':memory:');
  t.after(()=>db.close());
  db.exec(`
    PRAGMA foreign_keys=ON;
    CREATE TABLE sites(id TEXT PRIMARY KEY,status TEXT);
    CREATE TABLE users(id TEXT PRIMARY KEY,email TEXT,display_name TEXT,role TEXT,is_active INTEGER);
    CREATE TABLE sessions(token_hash TEXT,user_id TEXT,expires_at TEXT);
    CREATE TABLE site_memberships(site_id TEXT,user_id TEXT,role TEXT,status TEXT,PRIMARY KEY(site_id,user_id));
    CREATE TABLE pages(id TEXT PRIMARY KEY,site_id TEXT,slug TEXT,title TEXT,description TEXT,
      published_slug TEXT,published_title TEXT,published_description TEXT,published_content_json TEXT,
      content_json TEXT,sort_order INTEGER,updated_at TEXT,published_at TEXT,archived_at TEXT,is_published INTEGER);
    INSERT INTO sites VALUES ('site-default','active'),('other','active');
    INSERT INTO users VALUES ('owner','owner@example.test','Owner','admin',1),
      ('viewer','viewer@example.test','Viewer','viewer',1),
      ('editor','editor@example.test','Editor','editor',1);
    INSERT INTO site_memberships VALUES ('site-default','owner','admin','active'),
      ('site-default','viewer','viewer','active'),
      ('site-default','editor','editor','active'),
      ('other','viewer','editor','active');
  `);
  for(const [id,site] of [['draft-default','site-default'],['draft-other','other']]) {
    const d=doc(id);
    db.prepare(`INSERT INTO pages(id,site_id,slug,title,description,published_slug,published_title,
      published_description,published_content_json,content_json,sort_order,updated_at,published_at,
      archived_at,is_published) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(
        id,site,id,id,'',null,null,null,null,d,0,'2026-10-17',null,null,0
      );
  }
  for(const id of ['owner','viewer','editor']) {
    db.prepare('INSERT INTO sessions VALUES (?,?,?)').run(
      await hashSessionToken(id),id,'2999-01-01T00:00:00.000Z'
    );
  }
  const env={
    ...(enabled?{SITE_MEMBERSHIP_ENFORCEMENT:'enabled'}:{}),
    DB:{prepare(sql) {
      const statement=db.prepare(sql);
      let args=[];
      return {
        bind(...values){args=values;return this;},
        async first(){return statement.get(...args)??null;},
        async all(){return {results:statement.all(...args)};}
      };
    }}
  };
  const fetch=(id,siteId='site-default',slug='draft-default')=>publicPagesRoute(
    new Request('https://example.test/api/public/pages?preview=1&slug='+slug,{
      headers:id?{Cookie:`sanci9517_session=${id}`}:{}
    }),env,siteId
  );
  return {db,fetch};
}

test('cross-site drafts require membership even for a global admin',async t=>{
  const f=await fixture(t);
  const r=await f.fetch('owner','other','draft-other');
  assert.equal(r.status,403);
  assert.match(r.headers.get('Cache-Control'),/no-store/);
  assert.equal((await f.fetch('owner','site-default','draft-default')).status,200);
  assert.equal((await f.fetch('owner','site-default','draft-other')).status,404);
});

test('tenant-granted editor can preview own site regardless of old global viewer role',async t=>{
  const f=await fixture(t);
  const allowed=await f.fetch('viewer','other','draft-other');
  assert.equal(allowed.status,200);
  const payload=await allowed.json();
  assert.equal(payload.ok,true);
  assert.equal(payload.data.slug,'draft-other');
  assert.equal((await f.fetch('viewer','other','draft-default')).status,404);
  assert.equal((await f.fetch('viewer','site-default','draft-default')).status,403);
  f.db.prepare("UPDATE site_memberships SET status='revoked' WHERE site_id='other' AND user_id='viewer'").run();
  assert.equal((await f.fetch('viewer','other','draft-other')).status,403);
});

test('unauthenticated and missing grant queries cannot read draft content',async t=>{
  const f=await fixture(t);
  assert.equal((await f.fetch('', 'other','draft-other')).status,401);
  assert.equal((await f.fetch('editor','other','draft-other')).status,403);
  const otherSite=f.db.prepare("UPDATE sites SET status='archived' WHERE id='other'").run();
  assert.equal((await f.fetch('viewer','other','draft-other')).status,403);
});

test('missing memberships fail closed; legacy preview is limited to default site',async t=>{
  const f=await fixture(t);
  f.db.exec('DROP TABLE site_memberships');
  const fail=await f.fetch('owner','site-default','draft-default');
  assert.equal(fail.status,503);
  assert.match(fail.headers.get('Cache-Control'),/no-store/);
  const legacy=await fixture(t,{enabled:false});
  assert.equal((await legacy.fetch('owner','site-default','draft-default')).status,200);
  assert.equal((await legacy.fetch('owner','other','draft-other')).status,403);
});
