import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DatabaseSync} from 'node:sqlite';
import {scheduleArtworkKey,scheduleArtworkJSON,validScheduleArtworkId,SCHEDULE_ARTWORK_JOIN,SCHEDULE_ARTWORK_SELECT,SCHEDULE_ARTWORK_ARCHIVE_GUARD,SCHEDULE_ARTWORK_ACTIVE_IMAGE_RECHECK,SCHEDULE_ARTWORK_ASSET_MATCH,SCHEDULE_ARTWORK_COMMIT_AUDIT_GUARD,SCHEDULE_ARTWORK_CLEAR_AUDIT_GUARD} from '../src/core/schedule-artwork.ts';
import {renderScheduleWeek} from '../public/editor-v2/core/schedule-week.js';

const file=p=>readFileSync(new URL(p,import.meta.url),'utf8');
const admin=file('../src/routes/admin/schedule-media.ts');
const management=file('../public/admin-schedule.html');
const app=file('../public/assets/admin-schedule.js');
const schedule=file('../src/core/schedule-read.ts');
const media=file('../src/routes/admin/media.ts');
const worker=file('../src/index.ts');
const index=file('../public/admin-home.html');

const ITEM='1d084f6e-12f2-45f7-9154-007bdb0b1833';
const IMAGE='2c969288-284e-4491-aa3c-49767a75da8d';
test('schedule artwork key and payload stay site-scoped without new migrations',()=>{
  assert.equal(scheduleArtworkKey('site-default',ITEM),'schedule-artwork:site-default:'+ITEM);
  assert.equal(scheduleArtworkJSON(IMAGE),JSON.stringify({assetId:IMAGE}));
  assert.equal(validScheduleArtworkId('not-an-asset'),false);
  assert.throws(()=>scheduleArtworkKey('site-other','not-uuid'));
  assert.match(SCHEDULE_ARTWORK_JOIN,/artwork\.key/);
});
test('artwork setter verifies session role, Origin, same-site event and an active image',()=>{
  for(const required of ['getAuthenticatedUser','hasRole(user,"editor")','request.headers.get("Origin")','site_id=?','archived_at IS NULL','image/png','site_settings','audit_log','SCHEDULE_ARTWORK_COMMIT_AUDIT_GUARD']){
    assert.ok(admin.includes(required),required);
  }
  assert.match(admin,/request\.method!=="PUT"/);
  assert.match(admin,/scheduleArtworkKey\(siteId,scheduleId\)/);
  assert.match(admin,/SCHEDULE_ARTWORK_NOT_FOUND/);
});
test('public image access is granted for real schedule associations only, never to arbitrary R2 assets',()=>{
  assert.match(schedule,/SCHEDULE_ARTWORK_JOIN/);
  assert.match(schedule,/SCHEDULE_ARTWORK_SELECT/);
  assert.match(media,/schedule-artwork:/);
  assert.match(media,/INNER JOIN site_settings artwork/);
  assert.match(media,/row\.mime_type\.startsWith\("image\/"\)/);
  assert.match(media,/documentAssetReferences\(page\.published_content_json/);
  assert.match(media,/SCHEDULE_ARTWORK_ASSET_MATCH/,'both usage and published access must share decoded asset matching');
  assert.match(media,/SCHEDULE_ARTWORK_ARCHIVE_GUARD/,'archive commit must recheck active schedule associations');
  assert.match(admin,/SCHEDULE_ARTWORK_ACTIVE_IMAGE_RECHECK/,'setter must atomically recheck active image before association');
  assert.match(admin,/SCHEDULE_ARTWORK_CONFLICT/,'a lost precondition is reported rather than acknowledged');
});
test('Admin schedule page has accessible CRUD and image-picker entry points',()=>{
  for(const name of ['startsAt','endsAt','status','url','notes','title','platform','imageAssetId']){
    assert.ok(management.includes('name="'+name+'"'),name);
  }
  assert.match(management,/<form id="event-form"/);
  assert.match(management,/aria-live="polite"/);
  assert.match(management,/href="\/admin"/);
  assert.match(worker,/pathname === "\/admin\/schedule"/);
  assert.match(index,/href="\/admin\/schedule"/);
  assert.match(app,/method:'DELETE'/);
  assert.match(app,/method:id\?'PUT':'POST'/);
  assert.match(app,/\/api\/admin\/schedule\/media/);
});
test('one valid asset is visible with image toggle, malicious source is not',()=>{
  const base={id:ITEM,title:'Teszt',startsAt:'2026-11-13T18:00',status:'scheduled',platform:'Twitch',imageAssetId:IMAGE};
  const view=renderScheduleWeek([base],'2026-11-09',{showTitle:true,showArtwork:true});
  assert.match(view,new RegExp('/media/'+IMAGE));
  assert.doesNotMatch(renderScheduleWeek([base],'2026-11-09',{showArtwork:false}),/sanci-week-event-image/);
  assert.doesNotMatch(renderScheduleWeek([{...base,imageAssetId:'data:image/svg+xml,...'}],'2026-11-09',{showArtwork:true}),/data:image|sanci-week-event-image/);
});


// Isolated D1-compatible SQL regression. No production D1/R2 resources are used.
function artworkFixture(){
 const db=new DatabaseSync(':memory:');
 db.exec(`
   CREATE TABLE media(id TEXT PRIMARY KEY,site_id TEXT NOT NULL,archived_at TEXT,mime_type TEXT NOT NULL);
   CREATE TABLE schedule_items(id TEXT PRIMARY KEY,site_id TEXT NOT NULL,title TEXT NOT NULL);
   CREATE TABLE site_settings(key TEXT PRIMARY KEY,value_json TEXT NOT NULL,updated_at TEXT DEFAULT CURRENT_TIMESTAMP);
 `);
 db.prepare("INSERT INTO schedule_items(id,site_id,title) VALUES (?,'site-default','Fortnite')").run(ITEM);
 db.prepare("INSERT INTO media(id,site_id,archived_at,mime_type) VALUES (?,'site-default',NULL,'image/png')").run(IMAGE);
 return db;
}

test('public schedule artwork never exposes archived, wrong-site, wrong-MIME or malformed sidecar images',()=>{
 const db=artworkFixture();
 try{
  const key=scheduleArtworkKey('site-default',ITEM);
  const set=value=>db.prepare('INSERT INTO site_settings(key,value_json) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value_json=excluded.value_json').run(key,value);
  const view=()=>db.prepare(`SELECT ${SCHEDULE_ARTWORK_SELECT} FROM schedule_items e${SCHEDULE_ARTWORK_JOIN} WHERE e.site_id=? AND e.id=?`).get('site-default',ITEM)?.image_asset_id;
  assert.equal(view(),null,'missing sidecar is private');
  set(scheduleArtworkJSON(IMAGE));
  assert.equal(view(),IMAGE,'same-site active image is visible');
  db.prepare('UPDATE media SET archived_at=? WHERE id=?').run('2026-11-14',IMAGE);
  assert.equal(view(),null,'archived media is never exposed in public schedule DTO');
  db.prepare('UPDATE media SET archived_at=NULL,mime_type=? WHERE id=?').run('audio/mpeg',IMAGE);
  assert.equal(view(),null,'non-image is not exposed as cover art');
  db.prepare('UPDATE media SET mime_type=? WHERE id=?').run('image/png',IMAGE);
  const foreign='3f7a0000-0000-4000-8000-000000000002';
  db.prepare("INSERT INTO media(id,site_id,archived_at,mime_type) VALUES (?,'site-other',NULL,'image/png')").run(foreign);
  set(scheduleArtworkJSON(foreign));
  assert.equal(view(),null,'another tenant\'s image ID stays private');
  set('{malformed');
  assert.equal(view(),null,'bad historic JSON is handled without throwing');
 }finally{db.close();}
});

test('archive and cover UPSERT check each other at SQL commit time without D1 schema changes',()=>{
 const db=artworkFixture();
 try{
  const key=scheduleArtworkKey('site-default',ITEM);
  const setter=db.prepare(`INSERT INTO site_settings(key,value_json,updated_at)
    SELECT ?,?,CURRENT_TIMESTAMP WHERE EXISTS (SELECT 1 FROM schedule_items WHERE id=? AND site_id=?)
    ${SCHEDULE_ARTWORK_ACTIVE_IMAGE_RECHECK}
    ON CONFLICT(key) DO UPDATE SET value_json=excluded.value_json,updated_at=CURRENT_TIMESTAMP`);
  const link=(asset=IMAGE)=>setter.run(key,scheduleArtworkJSON(asset),ITEM,'site-default',asset,'site-default').changes;
  const archive=db.prepare(`UPDATE media SET archived_at=CURRENT_TIMESTAMP
    WHERE id=? AND site_id=? AND archived_at IS NULL ${SCHEDULE_ARTWORK_ARCHIVE_GUARD}`);
  assert.equal(link(),1,'active media can be linked');
  assert.equal(archive.run(IMAGE,'site-default').changes,0,'an already linked live cover cannot be archived');
  // Historic uppercase and JSON-escaped UUIDs must also block the archive.
  db.prepare('UPDATE site_settings SET value_json=? WHERE key=?').run(JSON.stringify({assetId:IMAGE.toUpperCase()}),key);
  assert.equal(archive.run(IMAGE,'site-default').changes,0,'case variant cannot bypass archive guard');
  db.prepare('UPDATE site_settings SET value_json=? WHERE key=?').run('{"assetId":"'+String.raw`\u0032`+IMAGE.slice(1)+'"}',key);
  assert.equal(archive.run(IMAGE,'site-default').changes,0,'Unicode-escaped JSON cannot bypass archive guard');
  db.prepare('DELETE FROM site_settings WHERE key=?').run(key);
  assert.equal(archive.run(IMAGE,'site-default').changes,1,'unreferenced image can be archived');
  assert.equal(link(),0,'a now-archived image cannot be attached by a stale writer');
  assert.equal(db.prepare('SELECT COUNT(*) n FROM site_settings WHERE key=?').get(key).n,0,'failed association never persists');
  db.prepare('UPDATE media SET archived_at=NULL WHERE id=?').run(IMAGE);
  assert.equal(link(),1,'restored active media can be linked again');
  assert.equal(setter.run(key,scheduleArtworkJSON(IMAGE),'nonexistent','site-default',IMAGE,'site-default').changes,0,'missing event fails the SQL precondition');
  assert.equal(setter.run(key,scheduleArtworkJSON(IMAGE),ITEM,'site-other',IMAGE,'site-default').changes,0,'cross-site event fails the SQL precondition');
  assert.equal(setter.run(key,scheduleArtworkJSON(IMAGE),ITEM,'site-default',IMAGE,'site-other').changes,0,'cross-site media fails the SQL precondition');
 }finally{db.close();}
});

test('equivalent schedule sidecar JSON matches public projection and media usage by decoded, tenant-scoped UUID',()=>{
 const db=artworkFixture();
 try{
  const key=scheduleArtworkKey('site-default',ITEM);
  const update=db.prepare('INSERT INTO site_settings(key,value_json) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value_json=excluded.value_json');
  const usage=db.prepare(`SELECT e.id FROM schedule_items e
     INNER JOIN site_settings artwork ON artwork.key=('schedule-artwork:' || e.site_id || ':' || e.id)
     WHERE e.site_id=? AND ${SCHEDULE_ARTWORK_ASSET_MATCH} LIMIT 1`);
  const published=db.prepare(`SELECT ${SCHEDULE_ARTWORK_SELECT} FROM schedule_items e${SCHEDULE_ARTWORK_JOIN} WHERE e.id=? AND e.site_id=?`);
  const unicode='{"assetId":"'+String.raw`\u0032`+IMAGE.slice(1)+'"}';
  const valid=[
   JSON.stringify({assetId:IMAGE}),
   JSON.stringify({assetId:IMAGE.toUpperCase()}),
   '{  "assetId" : "'+IMAGE+'" }',
   unicode
  ];
  for(const json of valid){
   update.run(key,json);
   assert.equal(usage.get('site-default',IMAGE)?.id,ITEM,'valid equivalent JSON must appear in the usage index');
   assert.equal(usage.get('site-other',IMAGE),undefined,'another tenant cannot inspect the link');
   assert.equal(usage.get('site-default','7e000000-0000-4000-8000-000000000007'),undefined,'other images are not linked');
   assert.equal(published.get(ITEM,'site-default').image_asset_id,IMAGE,'real active image is projected with canonical asset ID');
  }
  for(const json of ['{"assetId":',JSON.stringify({assetId:0}),JSON.stringify({assetId:{bad:true}})]){
   update.run(key,json);
   assert.equal(usage.get('site-default',IMAGE),undefined,'malformed or non-string value is not a valid link');
   assert.equal(published.get(ITEM,'site-default').image_asset_id,null,'malformed sidecar does not reveal image ID');
  }
 }finally{db.close();}
});

test('schedule artwork audit is commit-guarded and never records a rejected link or removed event',()=>{
 const db=artworkFixture();
 try{
  db.exec(`CREATE TABLE audit_log(
    id TEXT PRIMARY KEY,user_id TEXT,action TEXT,entity_type TEXT,entity_id TEXT,metadata_json TEXT
  )`);
  const key=scheduleArtworkKey('site-default',ITEM);
  const setter=db.prepare(`INSERT INTO site_settings (key,value_json,updated_at)
    SELECT ?,?,CURRENT_TIMESTAMP WHERE EXISTS (SELECT 1 FROM schedule_items WHERE id=? AND site_id=?)
    ${SCHEDULE_ARTWORK_ACTIVE_IMAGE_RECHECK}
    ON CONFLICT(key) DO UPDATE SET value_json=excluded.value_json,updated_at=CURRENT_TIMESTAMP`);
  const guardedAudit=db.prepare(`INSERT INTO audit_log
    (id,user_id,action,entity_type,entity_id,metadata_json)
    SELECT ?,?,?,?,?,? WHERE ${SCHEDULE_ARTWORK_COMMIT_AUDIT_GUARD}`);
  let seq=0;
  const attach=(item=ITEM,site='site-default',mediaId=IMAGE)=>{
   const json=scheduleArtworkJSON(mediaId);
   db.exec('BEGIN');
   const changed=setter.run(key,json,item,site,mediaId,site).changes;
   const audited=guardedAudit.run('audit-'+(++seq),'editor','schedule.artwork.update','schedule_item',item,
     JSON.stringify({siteId:site,assetId:mediaId}),mediaId,item,site,json).changes;
   db.exec('COMMIT');
   return {changed,audited};
  };
  assert.deepEqual(attach(),{changed:1,audited:1},'live same-site artwork creates an audit row');
  assert.equal(db.prepare('SELECT COUNT(*) n FROM audit_log').get().n,1);
  db.prepare('DELETE FROM site_settings WHERE key=?').run(key);
  db.prepare('UPDATE media SET archived_at=? WHERE id=?').run('2026-11-14',IMAGE);
  assert.deepEqual(attach(),{changed:0,audited:0},'archive-after-preflight never yields a success audit');
  assert.equal(db.prepare('SELECT COUNT(*) n FROM audit_log').get().n,1);
  db.prepare('UPDATE media SET archived_at=NULL WHERE id=?').run(IMAGE);
  assert.deepEqual(attach(ITEM,'site-other'),{changed:0,audited:0},'wrong tenant cannot create audit');
  db.prepare('DELETE FROM schedule_items WHERE id=?').run(ITEM);
  assert.deepEqual(attach(),{changed:0,audited:0},'event deletion after preflight produces no audit');
  assert.equal(db.prepare('SELECT COUNT(*) n FROM audit_log').get().n,1);
  const clearAudit=db.prepare(`INSERT INTO audit_log
    (id,user_id,action,entity_type,entity_id,metadata_json)
    SELECT ?,?,?,?,?,? WHERE ${SCHEDULE_ARTWORK_CLEAR_AUDIT_GUARD}`);
  assert.equal(clearAudit.run('audit-missing','editor','schedule.artwork.update','schedule_item',ITEM,
    '{}',ITEM,'site-default').changes,0,'clearing deleted event is not reported as successful');
  db.prepare('INSERT INTO schedule_items(id,site_id,title) VALUES (?,?,?)').run(ITEM,'site-default','Restored');
  assert.equal(db.prepare('DELETE FROM site_settings WHERE key=?').run(key).changes,0,'idempotent clear needs no sidecar');
  assert.equal(clearAudit.run('audit-clear','editor','schedule.artwork.update','schedule_item',ITEM,
    '{}',ITEM,'site-default').changes,1,'idempotent clear still records authorized intent');
  assert.equal(db.prepare('SELECT COUNT(*) n FROM audit_log').get().n,2,'only committed valid actions were audited');
 }finally{db.close();}
});

test('API reads both write and audit result metadata before reporting artwork success',()=>{
 assert.match(admin,/env\\.DB\\.batch\\(\\[statement,audit\\]\\)/);
 assert.match(admin,/results\\?\\.\\[0\\]\\?\\.meta\\?\\.changes/);
 assert.match(admin,/results\\?\\.\\[1\\]\\?\\.meta\\?\\.changes/);
 assert.match(admin,/SCHEDULE_ARTWORK_CONFLICT/);
});
