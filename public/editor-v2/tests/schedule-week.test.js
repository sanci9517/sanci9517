import assert from 'node:assert/strict';
import test from 'node:test';
import {
  mondayOf, currentBudapestDate, currentBudapestMonday, addCalendarDays,
  budapestEventDateTime, weekScheduleDays, shiftScheduleWeek, renderScheduleWeek
} from '../core/schedule-week.js';

test('calendar: Monday and Sunday belong to the same week, including year change', () => {
  assert.equal(mondayOf('2026-11-13'), '2026-11-09');
  assert.equal(mondayOf('2026-11-15'), '2026-11-09');
  assert.equal(shiftScheduleWeek('2026-12-28', 1), '2027-01-04');
  assert.equal(addCalendarDays('2026-12-31', 1), '2027-01-01');
  assert.throws(() => mondayOf('2026-02-31'));
});
test('calendar: Budapest DST spring and autumn are handled', () => {
  assert.deepEqual(budapestEventDateTime('2026-03-29T00:30:00Z'), { day:'2026-03-29', time:'01:30' });
  assert.deepEqual(budapestEventDateTime('2026-03-29T01:30:00Z'), { day:'2026-03-29', time:'03:30' });
  assert.deepEqual(budapestEventDateTime('2026-10-25T01:30:00Z'), { day:'2026-10-25', time:'02:30' });
  assert.deepEqual(budapestEventDateTime('2026-11-08T23:30:00Z'), { day:'2026-11-09', time:'00:30' });
});
test('calendar: local manual dates are not misinterpreted as UTC', () => {
  assert.deepEqual(budapestEventDateTime('2026-11-13T18:40'), {day:'2026-11-13',time:'18:40'});
  assert.equal(budapestEventDateTime('bad'), null);
  assert.equal(currentBudapestMonday(new Date('2026-11-13T19:00:00Z')), '2026-11-09');
});
test('calendar: seven-day grouping and in-day order', () => {
  const rows = [
    {id:'a',startsAt:'2026-11-09T20:00:00Z'},
    {id:'b',startsAt:'2026-11-09T16:00'},
    {id:'c',startsAt:'2026-11-08T23:30:00Z'},
    {id:'d',startsAt:'2026-11-16T10:00:00Z'}
  ];
  const days=weekScheduleDays(rows,'2026-11-09');
  assert.equal(days.length,7);
  assert.deepEqual(days[0].items.map(i=>i.id), ['c','b','a']);
  assert.equal(days[6].items.length,0);
});
test('calendar: escapes external records and rejects unsafe links', () => {
  const html=renderScheduleWeek([{
    id:'test',title:'<script>alert(1)</script>',platform:'Twitch',
    startsAt:'2026-11-13T19:30',url:'javascript:alert(1)',status:'scheduled'
  }],'2026-11-09',{showTitle:true,showTime:true,showPlatform:true,showStatus:true,showLink:true});
  assert.match(html, /&lt;script&gt;/);
  assert.doesNotMatch(html, /<script>/);
  assert.doesNotMatch(html, /javascript:/);
  assert.match(html, /data-schedule-week-action="next"/);
  assert.equal((html.match(/<section class="sanci-week-day/g)||[]).length,7);
});
test('calendar: empty week displays seven real dates and no invented streams', () => {
  const html=renderScheduleWeek([], '2026-11-09', {emptyText:'Nincs meghirdetett adás'});
  assert.match(html, /Nincs meghirdetett adás/);
  assert.equal((html.match(/<section class="sanci-week-day/g)||[]).length,7);
  assert.doesNotMatch(html, /Fortnite/);
});
