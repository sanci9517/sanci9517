import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {scheduleArtworkKey,scheduleArtworkJSON,validScheduleArtworkId,SCHEDULE_ARTWORK_JOIN} from '../src/core/schedule-artwork.ts';
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
  for(const required of ['getAuthenticatedUser','hasRole(user,"editor")','request.headers.get("Origin")','site_id=?','archived_at IS NULL','image/png','site_settings','auditStatement']){
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
