import assert from 'node:assert/strict';
import test from 'node:test';

import { publicPagesRoute } from '../src/routes/public/pages.ts';
import { createTwitchAuthorizationUrl } from '../src/core/twitch-oauth.ts';
import { getTwitchScheduleConnectionIdentity } from '../src/core/schedule/twitch-sync.ts';
import { validateSiteId } from '../src/core/site-context.ts';

const SITE_ID = 'site-default';
const USER_ID = 'user-test';

function emptyPagesDb() {
  const calls = [];
  return {
    calls,
    prepare(sql) {
      let binds = [];
      const statement = {
        bind(...values) {
          binds = values;
          return statement;
        },
        async all() {
          calls.push({ method: 'all', sql, binds });
          assert.match(sql, /FROM pages WHERE site_id=?/);
          assert.equal(binds[0], SITE_ID);
          return { results: [] };
        },
        async first() {
          calls.push({ method: 'first', sql, binds });
          assert.match(sql, /FROM pages WHERE site_id=\?1 AND slug=\?2/);
          assert.equal(binds[0], SITE_ID);
          assert.equal(binds[1], 'about');
          return null;
        }
      };
      return statement;
    }
  };
}

function oauthStateDb() {
  const calls = [];
  return {
    calls,
    async batch(statements) {
      calls.push(...statements);
    },
    prepare(sql) {
      const statement = {
        sql,
        binds: [],
        bind(...values) {
          statement.binds = values;
          return statement;
        }
      };
      return statement;
    }
  };
}

test('public page list is site-scoped', async () => {
  const DB = emptyPagesDb();
  const env = { DB };
  const response = await publicPagesRoute(
    new Request('https://example.test/api/public/pages'),
    env
  );

  assert.equal(response.status, 200);
  assert.equal(DB.calls.length, 1);
});

test('public page lookup is site-scoped', async () => {
  const DB = emptyPagesDb();
  const env = { DB };
  const response = await publicPagesRoute(
    new Request('https://example.test/api/public/pages?slug=about'),
    env
  );

  assert.equal(response.status, 404);
  assert.equal(DB.calls.length, 1);
});

test('Twitch OAuth state creation writes site ownership atomically', async () => {
  const DB = oauthStateDb();
  const env = {
    DB,
    TWITCH_CLIENT_ID: 'test-client-id',
    TWITCH_CLIENT_SECRET: 'test-client-secret',
    TWITCH_TOKEN_ENCRYPTION_KEY: 'test-encryption-key'
  };

  const target = await createTwitchAuthorizationUrl(
    new Request('https://example.test/api/integrations/twitch/connect'),
    env,
    USER_ID,
    SITE_ID
  );

  assert.equal(new URL(target).pathname, '/oauth2/authorize');
  assert.equal(DB.calls.length, 2);
  assert.equal(DB.calls[1].sql.includes('INSERT INTO twitch_oauth_states (id,user_id,site_id,state_hash,expires_at)'), true);
  assert.deepEqual(DB.calls[1].binds.slice(1, 3), [USER_ID, SITE_ID]);
});


test('site context rejects missing or invalid site IDs', () => {
  for (const value of [undefined, null, '', '   ', 123, {}, []]) {
    assert.throws(() => validateSiteId(value), /SITE_CONTEXT_INVALID/);
  }

  assert.equal(validateSiteId(' site-default '), 'site-default');
});

test('Twitch Schedule connection identity is site-and-user scoped', async () => {
  const calls = [];
  const DB = {
    prepare(sql) {
      let binds = [];
      const statement = {
        bind(...values) {
          binds = values;
          return statement;
        },
        async first() {
          calls.push({ sql, binds });
          assert.match(sql, /FROM twitch_connections WHERE id=\? AND user_id=\? AND site_id=\? LIMIT 1/);
          if (binds[0] !== 'connection-a' || binds[1] !== USER_ID || binds[2] !== SITE_ID) return null;
          return { broadcasterId: 'broadcaster-a' };
        }
      };
      return statement;
    }
  };

  const identity = await getTwitchScheduleConnectionIdentity(
    { DB },
    SITE_ID,
    USER_ID,
    'connection-a'
  );
  assert.deepEqual(identity, { broadcasterId: 'broadcaster-a' });

  await assert.rejects(
    () => getTwitchScheduleConnectionIdentity({ DB }, SITE_ID, 'other-user', 'connection-a'),
    /TWITCH_CONNECTION_NOT_FOUND/
  );
  assert.equal(calls.length, 2);
});
