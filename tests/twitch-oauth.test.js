import assert from 'node:assert/strict';
import test from 'node:test';

import { encryptTwitchToken, decryptTwitchToken } from '../src/core/twitch-crypto.ts';
import { refreshTwitchConnection } from '../src/core/twitch-oauth.ts';

const CONNECTION_ID = 'connection-test';
const ENCRYPTION_KEY = 'test-encryption-key';
const CLIENT_ID = 'test-client-id';
const CLIENT_SECRET = 'test-client-secret';
const INITIAL_ACCESS_TOKEN = 'initial-access-token';
const INITIAL_REFRESH_TOKEN = 'initial-refresh-token';
const REFRESHED_ACCESS_TOKEN = 'refreshed-access-token';
const REFRESHED_REFRESH_TOKEN = 'refreshed-refresh-token';

function createD1Fake(initialRow) {
  const row = structuredClone(initialRow);

  return {
    row,
    prepare(sql) {
      let binds = [];

      const statement = {
        bind(...values) {
          binds = values;
          return statement;
        },

        async first() {
          if (sql.startsWith('SELECT id,user_id AS userId,broadcaster_id AS broadcasterId')) {
            if (binds[0] !== CONNECTION_ID) return null;
            return structuredClone(row);
          }

          throw new Error('Unexpected D1 first() query: ' + sql);
        },

        async run() {
          if (sql.startsWith('UPDATE twitch_connections SET refresh_lock_token=?,refresh_lock_until=?')) {
            const [lockToken, lockUntil, connectionId] = binds;
            const lockExpired = row.refreshLockUntil === null || Date.parse(row.refreshLockUntil) <= Date.now();

            if (connectionId !== CONNECTION_ID || row.status !== 'connected' || !lockExpired) {
              return { meta: { changes: 0 } };
            }

            row.refreshLockToken = lockToken;
            row.refreshLockUntil = lockUntil;
            return { meta: { changes: 1 } };
          }

          if (sql.startsWith('UPDATE twitch_connections SET refresh_lock_token=NULL,refresh_lock_until=NULL')) {
            const [connectionId, lockToken] = binds;
            if (connectionId === CONNECTION_ID && row.refreshLockToken === lockToken) {
              row.refreshLockToken = null;
              row.refreshLockUntil = null;
              return { meta: { changes: 1 } };
            }
            return { meta: { changes: 0 } };
          }

          if (sql.startsWith('UPDATE twitch_connections SET access_token_ciphertext=?')) {
            const [
              accessCiphertext,
              accessIv,
              refreshCiphertext,
              refreshIv,
              scopesJson,
              accessTokenExpiresAt,
              connectionId,
              lockToken
            ] = binds;

            if (connectionId !== CONNECTION_ID || row.refreshLockToken !== lockToken) {
              return { meta: { changes: 0 } };
            }

            row.accessCiphertext = accessCiphertext;
            row.accessIv = accessIv;
            row.refreshCiphertext = refreshCiphertext;
            row.refreshIv = refreshIv;
            row.scopesJson = scopesJson;
            row.accessTokenExpiresAt = accessTokenExpiresAt;
            row.status = 'connected';
            row.refreshLockToken = null;
            row.refreshLockUntil = null;
            return { meta: { changes: 1 } };
          }

          if (sql.startsWith('UPDATE twitch_connections SET status=\'reauthorization_required\'')) {
            const [connectionId, lockToken] = binds;
            if (connectionId === CONNECTION_ID && row.refreshLockToken === lockToken) {
              row.status = 'reauthorization_required';
              return { meta: { changes: 1 } };
            }
            return { meta: { changes: 0 } };
          }

          throw new Error('Unexpected D1 run() query: ' + sql);
        }
      };

      return statement;
    }
  };
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' }
  });
}

test('Twitch refresh uses one D1 lock for two concurrent refresh calls', async () => {
  const initialAccess = await encryptTwitchToken(ENCRYPTION_KEY, INITIAL_ACCESS_TOKEN);
  const initialRefresh = await encryptTwitchToken(ENCRYPTION_KEY, INITIAL_REFRESH_TOKEN);

  const db = createD1Fake({
    id: CONNECTION_ID,
    userId: 'user-test',
    broadcasterId: '1144260301',
    broadcasterLogin: 'sanci9517',
    accessCiphertext: initialAccess.ciphertext,
    accessIv: initialAccess.iv,
    refreshCiphertext: initialRefresh.ciphertext,
    refreshIv: initialRefresh.iv,
    scopesJson: '[]',
    accessTokenExpiresAt: new Date(Date.now() + 60_000).toISOString(),
    status: 'connected',
    lastValidatedAt: null,
    refreshLockToken: null,
    refreshLockUntil: null
  });

  const env = {
    DB: db,
    TWITCH_CLIENT_ID: CLIENT_ID,
    TWITCH_CLIENT_SECRET: CLIENT_SECRET,
    TWITCH_TOKEN_ENCRYPTION_KEY: ENCRYPTION_KEY
  };

  let refreshRequests = 0;
  let releaseRefreshResponse;
  const refreshResponseReady = new Promise((resolve) => {
    releaseRefreshResponse = resolve;
  });

  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input, init) => {
    const url = String(input);
    assert.equal(url, 'https://id.twitch.tv/oauth2/token');
    assert.equal(init?.method, 'POST');

    refreshRequests += 1;
    assert.equal(refreshRequests, 1, 'only one caller may reach Twitch refresh');

    await refreshResponseReady;

    return jsonResponse({
      access_token: REFRESHED_ACCESS_TOKEN,
      refresh_token: REFRESHED_REFRESH_TOKEN,
      expires_in: 3600,
      scope: []
    });
  };

  try {
    const first = refreshTwitchConnection(env, CONNECTION_ID, initialAccess.ciphertext);
    await new Promise((resolve) => setTimeout(resolve, 10));

    const second = refreshTwitchConnection(env, CONNECTION_ID, initialAccess.ciphertext);

    releaseRefreshResponse();

    const [firstToken, secondToken] = await Promise.all([first, second]);

    assert.equal(firstToken, REFRESHED_ACCESS_TOKEN);
    assert.equal(secondToken, REFRESHED_ACCESS_TOKEN);
    assert.equal(refreshRequests, 1);

    assert.equal(db.row.status, 'connected');
    assert.equal(db.row.refreshLockToken, null);
    assert.equal(db.row.refreshLockUntil, null);

    const storedAccessToken = await decryptTwitchToken(
      ENCRYPTION_KEY,
      db.row.accessCiphertext,
      db.row.accessIv
    );
    const storedRefreshToken = await decryptTwitchToken(
      ENCRYPTION_KEY,
      db.row.refreshCiphertext,
      db.row.refreshIv
    );

    assert.equal(storedAccessToken, REFRESHED_ACCESS_TOKEN);
    assert.equal(storedRefreshToken, REFRESHED_REFRESH_TOKEN);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('Twitch invalid access token requires reauthorization after refresh failure', async () => {
  const initialAccess = await encryptTwitchToken(ENCRYPTION_KEY, INITIAL_ACCESS_TOKEN);
  const initialRefresh = await encryptTwitchToken(ENCRYPTION_KEY, INITIAL_REFRESH_TOKEN);
  const db = createD1Fake({
    id: CONNECTION_ID, userId: 'user-test', broadcasterId: '1144260301', broadcasterLogin: 'sanci9517',
    accessCiphertext: initialAccess.ciphertext, accessIv: initialAccess.iv,
    refreshCiphertext: initialRefresh.ciphertext, refreshIv: initialRefresh.iv,
    scopesJson: '[]', accessTokenExpiresAt: new Date(Date.now() + 3600_000).toISOString(),
    status: 'connected', lastValidatedAt: null, refreshLockToken: null, refreshLockUntil: null
  });
  const env = {
    DB: db, TWITCH_CLIENT_ID: CLIENT_ID, TWITCH_CLIENT_SECRET: CLIENT_SECRET,
    TWITCH_TOKEN_ENCRYPTION_KEY: ENCRYPTION_KEY
  };
  const originalFetch = globalThis.fetch;
  const requests = [];
  globalThis.fetch = async (input, init) => {
    const url = String(input);
    requests.push({ url, init });
    if (url === 'https://id.twitch.tv/oauth2/validate') return jsonResponse({ error: 'Unauthorized' }, 401);
    if (url === 'https://id.twitch.tv/oauth2/token') return jsonResponse({ error: 'invalid_grant' }, 400);
    throw new Error('Unexpected fetch URL: ' + url);
  };
  try {
    await assert.rejects(
      () => import('../src/core/twitch-oauth.ts').then(({ getValidTwitchAccessToken }) =>
        getValidTwitchAccessToken(env, CONNECTION_ID, { forceValidation: true })
      ),
      (err) => {
        assert.ok(err instanceof Error);
        assert.equal(err.message, 'TWITCH_REFRESH_FAILED');
        const message = String(err.message);
        assert.equal(message.includes(INITIAL_ACCESS_TOKEN), false);
        assert.equal(message.includes(INITIAL_REFRESH_TOKEN), false);
        assert.equal(message.includes(CLIENT_SECRET), false);
        return true;
      }
    );
    assert.equal(requests.length, 2);
    assert.equal(requests[0].url, 'https://id.twitch.tv/oauth2/validate');
    assert.equal(requests[1].url, 'https://id.twitch.tv/oauth2/token');
    assert.equal(db.row.status, 'reauthorization_required');
    assert.equal(db.row.refreshLockToken, null);
    assert.equal(db.row.refreshLockUntil, null);
  } finally {
    globalThis.fetch = originalFetch;
  }
});


test('B.13 exposes disconnect atomicity gap when Twitch revoke succeeds but D1 state update fails', async () => {
  const initialAccess = await encryptTwitchToken(ENCRYPTION_KEY, INITIAL_ACCESS_TOKEN);
  let status = 'connected';
  let revokeRequests = 0;

  const db = {
    prepare(sql) {
      let binds = [];
      const statement = {
        bind(...values) {
          binds = values;
          return statement;
        },
        async first() {
          assert.match(sql, /^SELECT access_token_ciphertext AS ciphertext,access_token_iv AS iv/);
          assert.equal(binds[0], CONNECTION_ID);
          return {
            ciphertext: initialAccess.ciphertext,
            iv: initialAccess.iv
          };
        },
        async run() {
          assert.match(sql, /^UPDATE twitch_connections SET status='revoked'/);
          assert.equal(binds[0], CONNECTION_ID);
          throw new Error('SIMULATED_D1_STATE_UPDATE_FAILURE');
        }
      };
      return statement;
    }
  };

  const env = {
    DB: db,
    TWITCH_CLIENT_ID: CLIENT_ID,
    TWITCH_CLIENT_SECRET: CLIENT_SECRET,
    TWITCH_TOKEN_ENCRYPTION_KEY: ENCRYPTION_KEY
  };

  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input, init) => {
    const url = String(input);
    assert.equal(url, 'https://id.twitch.tv/oauth2/revoke');
    assert.equal(init?.method, 'POST');
    revokeRequests += 1;
    return jsonResponse({}, 200);
  };

  try {
    await assert.rejects(
      () => import('../src/core/twitch-oauth.ts').then(({ revokeTwitchConnection }) =>
        revokeTwitchConnection(env, CONNECTION_ID)
      ),
      (err) => {
        assert.ok(err instanceof Error);
        assert.equal(err.message, 'SIMULATED_D1_STATE_UPDATE_FAILURE');
        return true;
      }
    );

    assert.equal(revokeRequests, 1);
    assert.equal(status, 'connected', 'the simulated persisted state remains connected after the external revoke');
  } finally {
    globalThis.fetch = originalFetch;
  }
});
