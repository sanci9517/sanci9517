import assert from 'node:assert/strict';
import test from 'node:test';

import { publicPagesRoute } from '../src/routes/public/pages.ts';
import { createTwitchAuthorizationUrl } from '../src/core/twitch-oauth.ts';

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
          assert.match(sql, /FROM pages WHERE site_id=? AND slug=?1/);
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
      for (const statement of statements) {
        calls.push(statement);
      }
    },
    prepare(sql) {
      let binds = [];
      const statement = {
        bind(...values) {
          binds = values;
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
    TWITCH_CLIENT_ID: 'test-client-id'
  };

  const target = await createTwitchAuthorizationUrl(
    new Request('https://example.test/api/integrations/twitch/connect'),
    env,
    USER_ID,
    SITE_ID
  );

  assert.equal(new URL(target).pathname, '/oauth2/authorize');
  assert.equal(DB.calls.length, 2);
  assert.match(DB.calls[1].sql, /INSERT INTO twitch_oauth_states (id,user_id,site_id,state_hash,expires_at)/);
  assert.deepEqual(DB.calls[1].binds.slice(1, 3), [USER_ID, SITE_ID]);
});
