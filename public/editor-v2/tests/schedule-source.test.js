import assert from 'node:assert/strict';
import test from 'node:test';

const { normalizeScheduleSyncWindow } = await import('../../../src/core/schedule/types.ts');
const { mapTwitchScheduleSegment } = await import('../../../src/core/schedule/mapper.ts');

test('schedule sync window normalizes to UTC', () => {
  assert.deepEqual(
    normalizeScheduleSyncWindow({
      startAt: '2026-09-24T00:00:00+02:00',
      endAt: '2026-10-01T00:00:00+02:00'
    }),
    {
      startAt: '2026-09-23T22:00:00.000Z',
      endAt: '2026-09-30T22:00:00.000Z'
    }
  );
});

test('schedule sync window rejects invalid ranges', () => {
  assert.throws(() => normalizeScheduleSyncWindow({
    startAt: '2026-10-01T00:00:00Z',
    endAt: '2026-09-24T00:00:00Z'
  }), /INVALID_SCHEDULE_SYNC_WINDOW/);
});

test('Twitch mapper preserves canonical external identity and metadata', () => {
  const mapped = mapTwitchScheduleSegment({
    id: 'segment-1',
    startAt: '2026-09-25T18:00:00Z',
    endAt: '2026-09-25T19:30:00Z',
    title: 'Fortnite ranked',
    canceledUntil: null,
    categoryId: '33214',
    categoryName: 'Fortnite',
    isRecurring: false
  }, '12345', 'sanci9517', '2026-09-24T16:00:00.000Z');

  assert.equal(mapped.source, 'twitch');
  assert.equal(mapped.sourceId, 'segment-1');
  assert.equal(mapped.sourceAccountId, '12345');
  assert.equal(mapped.platform, 'Twitch');
  assert.equal(mapped.status, 'scheduled');
  assert.equal(mapped.sourceCategoryId, '33214');
  assert.equal(mapped.sourceCategoryName, 'Fortnite');
  assert.equal(mapped.url, 'https://www.twitch.tv/sanci9517');
});

test('Twitch mapper preserves identity when an occurrence is canceled', () => {
  const mapped = mapTwitchScheduleSegment({
    id: 'segment-2',
    startAt: '2026-09-26T18:00:00Z',
    endAt: '2026-09-26T19:00:00Z',
    title: 'Canceled stream',
    canceledUntil: '2026-09-26T19:00:00Z',
    categoryId: null,
    categoryName: null,
    isRecurring: true
  }, '12345', 'sanci9517', '2026-09-24T16:00:00.000Z');

  assert.equal(mapped.sourceId, 'segment-2');
  assert.equal(mapped.status, 'cancelled');
  assert.equal(mapped.isRecurring, true);
});

test('Twitch mapper rejects malformed timestamps', () => {
  assert.throws(() => mapTwitchScheduleSegment({
    id: 'segment-3',
    startAt: 'bad',
    endAt: '2026-09-26T19:00:00Z',
    title: 'Broken',
    canceledUntil: null,
    categoryId: null,
    categoryName: null,
    isRecurring: false
  }, '12345', 'sanci9517', '2026-09-24T16:00:00.000Z'), /INVALID_TWITCH_SCHEDULE_SEGMENT/);
});
