import assert from 'node:assert/strict';
import test from 'node:test';
import { DatabaseSync } from 'node:sqlite';
import { hashSessionToken } from '../src/core/auth/session.ts';
import { requireScheduleEditorAccess } from '../src/core/auth/schedule-editor-access.ts';
import { adminScheduleRoute } from '../src/routes/admin/schedule.ts';
import { adminScheduleMediaRoute } from '../src/routes/admin/schedule-media.ts';

// No production D1, R2 or sessions; the fixture deliberately exercises the
// real route entrypoints, including their fail-closed membership gate.
async function fixture(t){
  const db=new DatabaseSync(':memory:');
  t.after(()=>db.close());
  db.exec(`
    CREATE TABLE sites(id TEXT PRIMARY KEY,status TEXT NOT NULL);
    CREATE TABLE users(id TEXT PRIMARY KEY,email TEXT,display_name TEXT,role TEXT,is_active INTEGER NOT NULL);
    CREATE TABLE sessions(token_hash TEXT,user_id TEXT,expires_at TEXT);
    CREATE TABLE site_memberships(site_id TEXT,user_id TEXT,role TEXT,status TEXT NOT NULL);
    CREATE TABLE media(id TEXT PRIMARY KEY,site_id TEXT,archived_at TEXT,mime_type TEXT);
    CREATE TABLE site_settings(key TEXT PRIMARY KEY,value_json TEXT);
    CREATE TABLE schedule_items(
      id TEXT PRIMARY KEY,site_id TEXT,title TEXT,platform TEXT,starts_at TEXT,ends_at TEXT,
      status TEXT,url TEXT,notes TEXT
    );
    INSERT INTO sites VALUES ('site-default','active'),('other','active');
    INSERT INTO users VALUES
      ('owner','owner@example.test','Owner','admin',1),
      ('scoped','scoped@example.test','Scoped','viewer',1),
      ('readonly','readonly@example.test','Readonly','admin',1);
    INSERT INTO site_memberships VALUES
      ('site-default','scoped','editor','active'),
      ('site-default','readonly','viewer','active');
  `);
  for(const who of ['owner','scoped','readonly']){
    db.prepare('INSERT INTO sessions VALUES (?,?,?)').run(
      await hashSessionToken(who),who,'2999-01-01T00:00:00.000Z');
  }
  const dbClient={prepare(sql){
    const stmt=db.prepare(sql);
    let args=[];
    return {
      bind(...values){args=values;return this},
      async first(){return stmt.get(...args)??null},
      async all(){return {results:stmt.all(...args)}}
    };
  }};
  const env={DB:dbClient,SITE_MEMBERSHIP_ENFORCEMENT:'enabled'};
  const request=(who,path='/api/admin/schedule',method='GET')=>
    new Request('https://trusted.test'+path,{
      method,headers:{
        ...(who?{Cookie:'sanci9517_session='+who}:{}),
        ...(method==='PUT'?{'Content-Type':'application/json',Origin:'https://trusted.test'}:{})
      },
      ...(method==='PUT'?{body:JSON.stringify({itemId:'1d084f6e-12f2-45f7-9154-007bdb0b1833',assetId:null})}:{})
    });
  const schedule=(who)=>adminScheduleRoute(request(who),env);
  const artwork=(who)=>adminScheduleMediaRoute(request(who,'/api/admin/schedule/media','PUT'),env);
  return {db,env,request,schedule,artwork};
}

test('schedule and artwork APIs enforce same-site membership, not a global admin role',async t=>{
  const f=await fixture(t);
  for(const api of [f.schedule,f.artwork]){
    assert.equal((await api('owner')).status,403,'global admin without membership is denied');
    assert.equal((await api('readonly')).status,403,'site viewer cannot write or list admin schedule');
    assert.equal((await api('')).status,401,'anonymous cannot access admin schedule');
  }
  const allowed=await f.schedule('scoped');
  assert.equal(allowed.status,200,'site editor may list schedule despite legacy global viewer role');
  assert.deepEqual((await allowed.json()).data,[]);
  assert.equal((await f.artwork('scoped')).status,404,
    'site editor reaches event lookup; no event in fixture, so it is not denied by global role');
});

test('revoked membership, inactive sites and missing site-access schema fail closed',async t=>{
  const f=await fixture(t);
  f.db.prepare("UPDATE site_memberships SET status='revoked' WHERE user_id='scoped'").run();
  assert.equal((await f.schedule('scoped')).status,403);
  assert.equal((await f.artwork('scoped')).status,403);
  f.db.prepare("UPDATE site_memberships SET status='active' WHERE user_id='scoped'").run();
  f.db.prepare("UPDATE sites SET status='archived' WHERE id='site-default'").run();
  assert.equal((await f.schedule('scoped')).status,403);
  f.db.prepare("UPDATE sites SET status='active' WHERE id='site-default'").run();
  f.db.exec('DROP TABLE site_memberships');
  const missing=await f.schedule('scoped');
  assert.equal(missing.status,503);
  assert.equal((await missing.json()).error.code,'SITE_ACCESS_UNAVAILABLE');
  assert.equal((await f.artwork('scoped')).status,503,'missing schema must never enable legacy fallback');
});

test('legacy role works only on original site; cross-site access is never implicit',async t=>{
  const f=await fixture(t);
  f.env.SITE_MEMBERSHIP_ENFORCEMENT='disabled';
  assert.equal((await f.schedule('owner')).status,200,'legacy admin retains original-site access');
  assert.equal((await f.artwork('owner')).status,404,'legacy admin reaches the event lookup');
  assert.equal((await f.schedule('scoped')).status,403,'legacy viewer is not granted editor rights');
  const remote=await requireScheduleEditorAccess(f.request('owner'),f.env,'other');
  assert.equal(remote.status,403,'legacy global role never reaches another site');
  f.env.SITE_MEMBERSHIP_ENFORCEMENT='enabled';
  const noGrant=await requireScheduleEditorAccess(f.request('owner'),f.env,'other');
  assert.equal(noGrant.status,403,'site grants cannot fall through to the legacy role');
});
