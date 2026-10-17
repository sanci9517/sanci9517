import assert from 'node:assert/strict';
import test from 'node:test';
import { DatabaseSync } from 'node:sqlite';
import { hashSessionToken } from '../src/core/auth/session.ts';
import { adminNavigationRoute } from '../src/routes/admin/navigation.ts';

const empty=JSON.stringify({schemaVersion:1,items:[]});

async function fixture(t,{enabled=true}={}) {
  const db=new DatabaseSync(':memory:');
  t.after(()=>db.close());
  db.exec(`
    PRAGMA foreign_keys=ON;
    CREATE TABLE sites(id TEXT PRIMARY KEY,status TEXT);
    CREATE TABLE users(id TEXT PRIMARY KEY,email TEXT,display_name TEXT,role TEXT,is_active INTEGER);
    CREATE TABLE sessions(token_hash TEXT,user_id TEXT,expires_at TEXT);
    CREATE TABLE site_memberships(site_id TEXT,user_id TEXT,role TEXT,status TEXT,PRIMARY KEY(site_id,user_id));
    CREATE TABLE site_navigation(site_id TEXT PRIMARY KEY,draft_json TEXT,published_json TEXT,
      revision INTEGER,published_revision INTEGER,updated_at TEXT);
    CREATE TABLE pages(id TEXT PRIMARY KEY,site_id TEXT,archived_at TEXT,title TEXT,slug TEXT,
      published_title TEXT,published_slug TEXT,is_published INTEGER,sort_order INTEGER);
    CREATE TABLE audit_log(id TEXT PRIMARY KEY,user_id TEXT,action TEXT,entity_type TEXT,entity_id TEXT,metadata_json TEXT);
    INSERT INTO sites VALUES ('site-default','active'),('other','active');
    INSERT INTO users VALUES ('owner','owner@example.test','Owner','admin',1),
      ('viewer','viewer@example.test','Viewer','viewer',1);
    INSERT INTO site_memberships VALUES ('site-default','owner','admin','active'),
      ('other','viewer','editor','active');
  `);
  for (const siteId of ['site-default','other']) {
    db.prepare('INSERT INTO site_navigation(site_id,draft_json,published_json,revision,published_revision) VALUES (?,?,?,?,?)')
      .run(siteId,empty,empty,1,1);
  }
  for (const id of ['owner','viewer']) {
    db.prepare('INSERT INTO sessions VALUES (?,?,?)').run(
      await hashSessionToken(id),id,'2999-01-01T00:00:00.000Z'
    );
  }
  const env={
    ...(enabled?{SITE_MEMBERSHIP_ENFORCEMENT:'enabled'}:{}),
    DB:{
      prepare(sql){
        const stmt=db.prepare(sql);
        let params=[];
        return {bind(...values){params=values;return this;},
          async first(){return stmt.get(...params)??null;},
          async all(){return {results:stmt.all(...params)};},
          run(){return {meta:{changes:Number(stmt.run(...params).changes)}};}
        };
      },
      async batch(statements){
        db.exec('BEGIN');
        try{const result=statements.map(s=>s.run());db.exec('COMMIT');return result;}
        catch(e){db.exec('ROLLBACK');throw e;}
      }
    }
  };
  const call=(user,siteId='site-default',method='GET',body)=>adminNavigationRoute(
    new Request('https://example.test/api/admin/navigation',{
      method,headers:{...(user?{Cookie:`sanci9517_session=${user}`}:{}),
      ...(method!=='GET'?{'Content-Type':'application/json'}:{})},
      ...(method!=='GET'?{body:JSON.stringify(body)}:{})
    }),env,siteId
  );
  return {db,call};
}

test('the navigation API denies a global admin on unrelated sites',async t=>{
  const f=await fixture(t);
  assert.equal((await f.call('owner','other')).status,403);
  assert.equal((await f.call('owner','site-default')).status,200);
  assert.equal((await f.call('viewer','site-default')).status,403);
  assert.equal((await f.call('','other')).status,401);
});

test('site editor can edit/publish only the authorized site despite a legacy viewer role',async t=>{
  const f=await fixture(t);
  const before=f.db.prepare("SELECT draft_json,revision,published_revision FROM site_navigation WHERE site_id='site-default'").get();
  assert.equal((await f.call('viewer','other')).status,200);
  const tree={schemaVersion:1,items:[{id:'nav-link',type:'external',url:'https://example.org/',label:'External',children:[]}]};
  const updated=await f.call('viewer','other','PUT',{tree,expectedRevision:1});
  assert.equal(updated.status,200);
  assert.equal((await updated.json()).data.revision,2);
  assert.deepEqual({...f.db.prepare("SELECT draft_json,revision,published_revision FROM site_navigation WHERE site_id='site-default'").get()},{...before});
  assert.equal(f.db.prepare("SELECT revision FROM site_navigation WHERE site_id='other'").get().revision,2);
  assert.equal(f.db.prepare("SELECT COUNT(*) AS n FROM audit_log WHERE entity_id='other'").get().n,1);
  const published=await f.call('viewer','other','POST',{action:'publish',expectedRevision:2});
  assert.equal(published.status,200);
  assert.equal(f.db.prepare("SELECT published_revision FROM site_navigation WHERE site_id='other'").get().published_revision,2);
  assert.equal(f.db.prepare("SELECT published_revision FROM site_navigation WHERE site_id='site-default'").get().published_revision,1);
  f.db.prepare("UPDATE site_memberships SET status='revoked' WHERE site_id='other' AND user_id='viewer'").run();
  assert.equal((await f.call('viewer','other','PUT',{tree,expectedRevision:2})).status,403);
  assert.equal(f.db.prepare("SELECT COUNT(*) AS n FROM audit_log WHERE entity_id='other'").get().n,2);
});

test('missing membership table fails closed and legacy grants apply only to default site',async t=>{
  const f=await fixture(t);
  f.db.exec('DROP TABLE site_memberships');
  const denied=await f.call('owner','site-default');
  assert.equal(denied.status,503);
  assert.equal((await denied.json()).error.code,'SITE_ACCESS_UNAVAILABLE');
  const legacy=await fixture(t,{enabled:false});
  assert.equal((await legacy.call('owner','site-default')).status,200);
  assert.equal((await legacy.call('owner','other')).status,403);
});
