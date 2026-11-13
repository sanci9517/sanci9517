import assert from 'node:assert/strict';
import test from 'node:test';
import {scheduleStartEpoch,scheduleStartISO} from '../public/editor-v2/core/schedule-time.js';
import {defaultCountdownContent,normalizeCountdownContent,renderCountdownContent,remainingParts} from '../public/editor-v2/core/countdown-content.js';

test('next scheduled Budapest stream is parsed as CET, independent of viewer timezone',()=>{
 const start=scheduleStartEpoch('2026-11-14T15:27');
 assert.equal(start,Date.parse('2026-11-14T14:27:00Z'));
 assert.equal(scheduleStartISO('2026-11-14T15:27'),'2026-11-14T14:27:00.000Z');
 assert.equal(scheduleStartEpoch('2026-07-14T15:27'),Date.parse('2026-07-14T13:27:00Z'));
 assert.equal(scheduleStartEpoch('2026-11-14T14:27:00Z'),start);
 assert.equal(scheduleStartEpoch('2026-11-14T15:27+01:00'),start);
});
test('DST spring gap and malformed values cannot become a fake event',()=>{
 for(const value of ['2026-03-29T02:30','2026-11-31T12:30','2026-02-30T12:30','javascript:alert(1)','2026-11-14T25:00','2026-11-14','2026-11-14T12:99']){
  assert.equal(scheduleStartEpoch(value),null,value);
 }
 // Ambiguous CET fold selects the earlier occurrence consistently.
 assert.equal(scheduleStartISO('2026-10-25T02:30'),'2026-10-25T00:30:00.000Z');
});
test('automatic Countdown is valid without a manually authored fake ISO target',()=>{
 const dynamic=normalizeCountdownContent({
  version:1,title:'Következő stream',targetISO:'',finishText:'Hamarosan kezdődik.',showSeconds:true,source:'next-stream'
 });
 assert.deepEqual(dynamic,{version:1,title:'Következő stream',targetISO:'',finishText:'Hamarosan kezdődik.',showSeconds:true,source:'next-stream'});
 const html=renderCountdownContent(dynamic);
 assert.match(html,/data-countdown-source="next-stream"/);
 assert.match(html,/Következő adás keresése/);
 assert.doesNotMatch(html,/2030|2100|javascript:/);
 assert.match(html,/aria-live="polite"/);
});
test('manual date countdown stays backward compatible',()=>{
 const original=defaultCountdownContent();
 assert.equal(original.source,undefined);
 const manual=normalizeCountdownContent({...original,targetISO:'2030-12-31T20:30:00+01:00'});
 assert.equal(manual.targetISO,'2030-12-31T19:30:00.000Z');
 assert.equal(manual.source,undefined);
 assert.match(renderCountdownContent(manual),/data-countdown-source="manual"/);
 assert.throws(()=>normalizeCountdownContent({...original,source:'next-stream-ish'}),/forrás/);
 assert.throws(()=>normalizeCountdownContent(original),/időzóna/);
 const remaining=remainingParts('2030-12-31T20:30:00Z',Date.parse('2030-12-31T20:29:59Z'));
 assert.equal(remaining.seconds,1);
});
