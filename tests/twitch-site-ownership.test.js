import assert from 'node:assert/strict';
import test from 'node:test';

import {
  assertTwitchConnectionOwnership,
  getOwnedTwitchConnection
} from '../src/core/twitch-site-ownership.ts';

const SITE_A = 'site-a';
const SITE_B = 'site-b';
const USER_ID = 'user-test';
const OTHER_USER_ID = 'other-user';
const CONNECTION_ID = 'connection-test';

function createD1Fake() {
  const rows = [
    {
      id: CONNECTION_ID,
      userId: USER_ID,
      siteId: SITE_A,
      broadcasterId: 'broadcaster-a',
      broadcasterLogin: 'creator-a',
      status: 'connected'
    }
  ];

  return {
    rows,
    prepare(sql) {
      let binds = [];
      const statement = {
        bind(...values) {
          binds = values;
          return statement;
        },
        async first() {
          if (sql.includes('SELECT id FROM twitch_connections WHERE id=? AND user_id=? AND site_id=?')) {
            const [connectionId, userId, siteId] = binds;
            const row = rows.find((item) => item.id === connectionId && item.userId === userId && item.siteId === siteId);
            return row ? { id: row.id } : null;
          }

          if (sql.includes('SELECT id,broadcaster_id AS broadcasterId,broadcaster_login AS broadcasterLogin')) {
            const [userId, siteId] = binds;
            const row = rows
              .filter((item) => item.userId === userId && item.siteId === siteId)
              .sort(() => 0)
              .at(0);
            return row ? structuredClone(row) : null;
          }

          throw new Error('Unexpected first() query: ' + sql);
        }
      };
      return statement;
    }
  };
}

test('Twitch connection ownership rejects a different site or user', async () => {
  const env = { DB: createD1Fake() };

  assert.equal(
    await assertTwitchConnectionOwnership(env, SITE_A, USER_ID, CONNECTION_ID),
    true
  );
  assert.equal(
    await assertTwitchConnectionOwnership(env, SITE_B, USER_ID, CONNECTION_ID),
    false
  );
  assert.equal(
    await assertTwitchConnectionOwnership(env, SITE_A, OTHER_USER_ID, CONNECTION_ID),
    false
  );
});

test('Twitch owned connection lookup is site-scoped', async () => {
  const env = { DB: createD1Fake() };

  const owned = await getOwnedTwitchConnection(env, SITE_A, USER_ID);
  assert.equal(owned?.id, CONNECTION_ID);

  const otherSite = await getOwnedTwitchConnection(env, SITE_B, USER_ID);
  assert.equal(otherSite, null);
});

test('legacy NULL Twitch connection ownership is fail-closed and never returned as owned', async () => {
  const db = createD1Fake();
  db.rows.push({
    id: 'legacy-connection',
    userId: USER_ID,
    siteId: null,
    broadcasterId: 'legacy-broadcaster',
    broadcasterLogin: 'legacy',
    status: 'connected'
  });
  const env = { DB: db };

  assert.equal(
    await assertTwitchConnectionOwnership(env, SITE_A, USER_ID, 'legacy-connection'),
    false
  );
  assert.equal(
    await getOwnedTwitchConnection(env, SITE_A, USER_ID).then((row) => row?.id),
    CONNECTION_ID
  );
});
