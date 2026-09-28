import assert from 'node:assert/strict';
import test from 'node:test';

import {
  assertTwitchConnectionOwnership,
  bindNewTwitchConnectionToSite,
  getOwnedTwitchConnection
} from '../src/core/twitch-site-ownership.ts';

const SITE_A = 'site-a';
const SITE_B = 'site-b';
const USER_ID = 'user-test';
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
            const row = rows.find((item) => item.userId === userId && item.siteId === siteId);
            return row ? structuredClone(row) : null;
          }

          throw new Error('Unexpected first() query: ' + sql);
        },
        async run() {
          if (sql.startsWith('UPDATE twitch_connections SET site_id=?')) {
            const [siteId, userId] = binds;
            let changes = 0;
            for (const row of rows) {
              if (row.userId === userId && row.siteId === null) {
                row.siteId = siteId;
                changes += 1;
              }
            }
            return { meta: { changes } };
          }

          throw new Error('Unexpected run() query: ' + sql);
        }
      };
      return statement;
    }
  };
}

test('Twitch connection ownership rejects a different site', async () => {
  const env = { DB: createD1Fake() };

  assert.equal(
    await assertTwitchConnectionOwnership(env, SITE_A, USER_ID, CONNECTION_ID),
    true
  );
  assert.equal(
    await assertTwitchConnectionOwnership(env, SITE_B, USER_ID, CONNECTION_ID),
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

test('legacy NULL Twitch connection ownership can be bound to the canonical site', async () => {
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

  await bindNewTwitchConnectionToSite(env, SITE_A, USER_ID);

  assert.equal(db.rows.find((row) => row.id === 'legacy-connection')?.siteId, SITE_A);
  assert.equal(db.rows.find((row) => row.id === CONNECTION_ID)?.siteId, SITE_A);
});
