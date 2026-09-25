import assert from 'node:assert/strict';
import test from 'node:test';

const { normalizeScheduleSyncWindow } = await import('../../../src/core/schedule/types.ts');
const { mapTwitchScheduleSegment } = await import('../../../src/core/schedule/mapper.ts');
const { mapTwitchScheduleResponseStatus } = await import('../../../src/core/schedule/twitch-errors.ts');
const { readPublicSchedule } = await import('../../../src/core/schedule-read.ts');
const { syncCanonicalTwitchSchedule } = await import('../../../src/core/schedule/sync.ts');

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


test('Twitch adapter maps canonical HTTP errors', () => {
  assert.equal(mapTwitchScheduleResponseStatus(401), 'TWITCH_SCHEDULE_REAUTHORIZATION_REQUIRED');
  assert.equal(mapTwitchScheduleResponseStatus(404), 'TWITCH_SCHEDULE_SOURCE_EMPTY');
  assert.equal(mapTwitchScheduleResponseStatus(429), 'TWITCH_SCHEDULE_RATE_LIMITED');
  assert.equal(mapTwitchScheduleResponseStatus(500), 'TWITCH_SCHEDULE_TRANSIENT_FAILURE');
  assert.equal(mapTwitchScheduleResponseStatus(400), 'TWITCH_SCHEDULE_BAD_RESPONSE');
  assert.equal(mapTwitchScheduleResponseStatus(200), null);
});

test('Twitch adapter errors map to canonical sync states without leaking raw HTTP status', async () => {
  const cases = [
    ['TWITCH_SCHEDULE_REAUTHORIZATION_REQUIRED', 'reauthorization_required'],
    ['TWITCH_SCHEDULE_SOURCE_EMPTY', 'source_empty'],
    ['TWITCH_SCHEDULE_RATE_LIMITED', 'rate_limited']
  ];

  for (const [code, expectedStatus] of cases) {
    const updates = [];
    const db = {
      prepare(sql) {
        return {
          bind(...values) {
            return {
              run: async () => {
                updates.push({ sql, values });
                return { meta: { changes: 1 } };
              }
            };
          }
        };
      }
    };

    await assert.rejects(
      syncCanonicalTwitchSchedule(
        db,
        { startAt: '2026-09-25T00:00:00Z', endAt: '2026-10-02T00:00:00Z' },
        async () => {
          throw { code };
        },
        '1144260301'
      ),
      error => error && error.code === code
    );

    const finish = updates.find(entry => entry.sql.includes('last_completed_at=CURRENT_TIMESTAMP'));
    assert.ok(finish);
    assert.equal(finish.values[0], expectedStatus);
    assert.equal(finish.values[3], code);
    assert.equal(finish.values[3].startsWith('HTTP_'), false);
  }
});

test('public schedule DTO does not leak source or sync fields', async () => {
  const row = {
    id: 'public-1',
    title: 'Fortnite',
    platform: 'Twitch',
    starts_at: '2026-09-25T18:00:00.000Z',
    ends_at: '2026-09-25T19:00:00.000Z',
    status: 'scheduled',
    url: 'https://www.twitch.tv/sanci9517',
    notes: '',
    source: 'twitch',
    source_id: 'segment-1',
    source_account_id: '12345',
    source_presence: 'present',
    source_synced_at: '2026-09-24T16:00:00.000Z',
    source_missing_at: null,
    source_category_id: '33214',
    source_category_name: 'Fortnite'
  };

  const db = {
    prepare() {
      return {
        bind() {
          return {
            all: async () => ({ results: [row] })
          };
        }
      };
    }
  };

  const result = await readPublicSchedule(db);
  assert.deepEqual(Object.keys(result[0]).sort(), [
    'endsAt', 'id', 'notes', 'platform', 'startsAt', 'status', 'title', 'url'
  ]);
  assert.equal(result[0].source, undefined);
  assert.equal(result[0].sourceId, undefined);
  assert.equal(result[0].sourceAccountId, undefined);
  assert.equal(result[0].sourcePresence, undefined);
  assert.equal(result[0].sourceSyncedAt, undefined);
  assert.equal(result[0].sourceMissingAt, undefined);
  assert.equal(result[0].sourceCategoryId, undefined);
  assert.equal(result[0].sourceCategoryName, undefined);
});
