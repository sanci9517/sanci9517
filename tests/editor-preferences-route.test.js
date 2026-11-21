import assert from 'node:assert/strict';
import test from 'node:test';
import { DatabaseSync } from 'node:sqlite';
import { editorPreferencesRoute } from '../src/routes/admin/editor-preferences.ts';
import { hashSessionToken } from '../src/core/auth/session.ts';

async function fixture(t) {
  const db = new DatabaseSync(':memory:');
  t.after(() => db.close());
  db.exec(`
    PRAGMA foreign_keys=ON;
    CREATE TABLE users(id TEXT PRIMARY KEY,email TEXT,display_name TEXT,role TEXT,is_active INTEGER);
    CREATE TABLE sessions(token_hash TEXT,user_id TEXT,expires_at TEXT);
    CREATE TABLE sites(id TEXT PRIMARY KEY,slug TEXT,name TEXT,status TEXT);
    CREATE TABLE site_memberships(site_id TEXT,user_id TEXT,role TEXT,status TEXT,PRIMARY KEY(site_id,user_id));
    CREATE TABLE editor_preferences(user_id TEXT PRIMARY KEY,preferences_json TEXT NOT NULL DEFAULT '{}',
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE);
  `);
  const tokens = new Map();
  for (const [id, role, legacyRole] of [['user-a', 'editor', 'admin'], ['user-b', 'editor', 'editor'], ['viewer', 'viewer', 'viewer']]) {
    const token = `session-${id}`;
    tokens.set(id, token);
    db.prepare('INSERT INTO users VALUES (?,?,?,?,1)').run(id, `${id}@example.test`, id, legacyRole);
    db.prepare('INSERT INTO sessions VALUES (?,?,?)').run(await hashSessionToken(token), id, '2999-01-01T00:00:00.000Z');
  }
  db.exec("INSERT INTO sites VALUES ('site-default','default','Default','active')");
  db.exec("INSERT INTO site_memberships VALUES ('site-default','user-a','editor','active'),('site-default','user-b','editor','active'),('site-default','viewer','viewer','active')");
  const env = {
    SITE_MEMBERSHIP_ENFORCEMENT: 'enabled',
    DB: {
      prepare(sql) {
        const statement = db.prepare(sql.replace(/\?\d+/gu, '?'));
        let values = [];
        return {
          bind(...args) { values = args; return this; },
          async first() { return statement.get(...values) ?? null; },
          async run() { return { meta: { changes: Number(statement.run(...values).changes) } }; }
        };
      }
    }
  };
  const request = (method, userId, body) => new Request('https://example.test/api/admin/editor/preferences', {
    method,
    headers: {
      ...(userId ? { Cookie: `sanci9517_session=${tokens.get(userId)}` } : {}),
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' })
    },
    ...(body === undefined ? {} : { body: typeof body === 'string' ? body : JSON.stringify(body) })
  });
  const call = (method = 'GET', userId = 'user-a', body) => editorPreferencesRoute(request(method, userId, body), env, 'site-default');
  return { db, env, call };
}

test('editor favorites persist only under the authenticated user account and round-trip through D1', async t => {
  const f = await fixture(t);
  const first = await f.call('GET');
  assert.equal(first.status, 200);
  assert.match(first.headers.get('Cache-Control'), /no-store/u);
  assert.deepEqual((await first.json()).data.paletteFavoriteTypes, []);

  const saved = await f.call('PUT', 'user-a', { paletteFavoriteTypes: ['heading', 'text', 'heading'] });
  assert.equal(saved.status, 200);
  assert.deepEqual((await saved.json()).data.paletteFavoriteTypes, ['heading', 'text']);
  assert.deepEqual((await (await f.call('GET')).json()).data.paletteFavoriteTypes, ['heading', 'text']);
  assert.deepEqual((await (await f.call('GET', 'user-b')).json()).data.paletteFavoriteTypes, [],
    'a second authorized account cannot read the first account preferences');

  await f.call('PUT', 'user-b', { paletteFavoriteTypes: ['divider'] });
  assert.deepEqual((await (await f.call('GET')).json()).data.paletteFavoriteTypes, ['heading', 'text']);
  assert.deepEqual((await (await f.call('GET', 'user-b')).json()).data.paletteFavoriteTypes, ['divider']);
  assert.deepEqual(f.db.prepare('SELECT user_id FROM editor_preferences ORDER BY user_id').all().map(row => row.user_id), ['user-a', 'user-b']);
});

test('preference writes reject identity injection, invalid fields, unsafe IDs and oversized payloads without mutation', async t => {
  const f = await fixture(t);
  for (const body of [
    { userId: 'user-b', paletteFavoriteTypes: ['heading'] },
    { paletteFavoriteTypes: ['javascript:alert(1)'] },
    { paletteFavoriteTypes: ['A'.repeat(49)] },
    { paletteFavoriteTypes: Array.from({ length: 33 }, (_, index) => `type-${index}`) },
    { paletteFavoriteTypes: [], pageModel: { overwrite: true } }
  ]) {
    assert.equal((await f.call('PUT', 'user-a', body)).status, 400, JSON.stringify(body));
  }
  assert.equal((await f.call('PUT', 'user-a', 'x'.repeat(9000))).status, 413);
  assert.equal(f.db.prepare('SELECT COUNT(*) AS n FROM editor_preferences').get().n, 0);
});

test('preference route denies anonymous and viewer access and returns safe defaults for malformed legacy JSON', async t => {
  const f = await fixture(t);
  assert.equal((await f.call('GET', null)).status, 401);
  assert.equal((await f.call('PUT', 'viewer', { paletteFavoriteTypes: ['heading'] })).status, 403);
  f.db.prepare('INSERT INTO editor_preferences(user_id,preferences_json) VALUES (?,?)').run('user-a', '{bad json');
  assert.deepEqual((await (await f.call('GET')).json()).data.paletteFavoriteTypes, []);
  assert.equal((await f.call('DELETE')).status, 405);
});

test('preference storage errors fail closed with a no-store unavailable response', async t => {
  const f = await fixture(t);
  f.db.exec('DROP TABLE editor_preferences');
  assert.equal((await f.call('GET')).status, 503);
  assert.equal((await f.call('PUT', 'user-a', { paletteFavoriteTypes: ['heading'] })).status, 503);
});
