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
    CREATE TABLE site_settings(key TEXT PRIMARY KEY,value_json TEXT,updated_at TEXT DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE audit_log(id TEXT PRIMARY KEY,user_id TEXT,action TEXT,entity_type TEXT,entity_id TEXT,metadata_json TEXT);
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
  const dbClient={
    beforeBatch:null,
    prepare(sql){
      const stmt=db.prepare(sql);
      let args=[];
      return {
        bind(...values){args=values;return this},
        async first(){return stmt.get(...args)??null},
        async all(){return {results:stmt.all(...args)}},
        _run(){const res=stmt.run(...args);return {results:[],meta:{changes:res.changes}}}
      };
    },
    async batch(statements){
      // Simulate a concurrent D1 update after advisory preflights, before
      // the transactional write-and-audit batch begins.
      if(this.beforeBatch){const hook=this.beforeBatch;this.beforeBatch=null;hook()}
      db.exec('BEGIN');
      try{
        const results=statements.map(stmt=>stmt._run());
        db.exec('COMMIT');
        return results;
      }catch(err){db.exec('ROLLBACK');throw err}
    }
  };
  const env={DB:dbClient,SITE_MEMBERSHIP_ENFORCEMENT:'enabled'};
  const request=(who,path='/api/admin/schedule',method='GET',payload={itemId:'1d084f6e-12f2-45f7-9154-007bdb0b1833',assetId:null})=>
    new Request('https://trusted.test'+path,{
      method,headers:{
        ...(who?{Cookie:'sanci9517_session='+who}:{}),
        ...(method==='PUT'?{'Content-Type':'application/json',Origin:'https://trusted.test'}:{})
      },
      ...(method==='PUT'?{body:JSON.stringify(payload)}:{})
    });
  const schedule=(who)=>adminScheduleRoute(request(who),env);
  const artwork=(who,assetId=null)=>adminScheduleMediaRoute(request(who,'/api/admin/schedule/media','PUT',
    {itemId:'1d084f6e-12f2-45f7-9154-007bdb0b1833',assetId}),env);
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

test('real artwork API batches only successful site-member updates into its audit trail',async t=>{
  const f=await fixture(t);
  const ITEM='1d084f6e-12f2-45f7-9154-007bdb0b1833';
  const IMAGE='2c969288-284e-4491-aa3c-49767a75da8d';
  f.db.prepare("INSERT INTO schedule_items(id,site_id,title,platform,starts_at,status,notes) VALUES (?,?,?,?,?,?,?)")
    .run(ITEM,'site-default','Fortnite','Twitch','2026-11-14T20:00','scheduled','');
  f.db.prepare("INSERT INTO media(id,site_id,archived_at,mime_type) VALUES (?,'site-default',NULL,'image/png')")
    .run(IMAGE);
  assert.equal((await f.artwork('readonly',IMAGE)).status,403,'global admin with viewer site grant is forbidden');
  assert.equal((await f.artwork('scoped',IMAGE)).status,200,'site editor may attach image');
  const key='schedule-artwork:site-default:'+ITEM;
  assert.equal(f.db.prepare('SELECT value_json FROM site_settings WHERE key=?').get(key).value_json,
    JSON.stringify({assetId:IMAGE}));
  assert.equal(f.db.prepare('SELECT COUNT(*) n FROM audit_log').get().n,1);
  assert.equal((await f.artwork('scoped',null)).status,200,'site editor may clear cover');
  assert.equal(f.db.prepare('SELECT COUNT(*) n FROM site_settings WHERE key=?').get(key).n,0);
  assert.equal(f.db.prepare('SELECT COUNT(*) n FROM audit_log').get().n,2);
  // Archival wins *after* the route's image preflight but before its DB.batch.
  f.env.DB.beforeBatch=()=>f.db.prepare("UPDATE media SET archived_at='2026-11-14' WHERE id=?").run(IMAGE);
  const raced=await f.artwork('scoped',IMAGE);
  assert.equal(raced.status,409,'failed conditional UPSERT returns a conflict');
  assert.equal((await raced.json()).error.code,'SCHEDULE_ARTWORK_CONFLICT');
  assert.equal(f.db.prepare('SELECT COUNT(*) n FROM audit_log').get().n,2,'failed attach creates no false success audit');
  assert.equal(f.db.prepare('SELECT COUNT(*) n FROM site_settings WHERE key=?').get(key).n,0);
  // Event deletion wins *after* a clear preflight: neither the clear nor the
  // audit may claim successful modification of a vanished event.
  f.env.DB.beforeBatch=()=>f.db.prepare('DELETE FROM schedule_items WHERE id=?').run(ITEM);
  const missing=await f.artwork('scoped',null);
  assert.equal(missing.status,409);
  assert.equal(f.db.prepare('SELECT COUNT(*) n FROM audit_log').get().n,2,'deleted event creates no false audit');
});
