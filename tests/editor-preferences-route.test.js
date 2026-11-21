import assert from 'node:assert/strict';
import test from 'node:test';
import { DatabaseSync } from 'node:sqlite';
import { editorPreferencesRoute } from '../src/routes/admin/editor-preferences.ts';
import { hashSessionToken } from '../src/core/auth/session.ts';

async function fixture(t, { barrierConcurrentPreferenceReads = false } = {}) {
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
  let preferenceReadCount = 0;
  let releasePreferenceReads;
  const preferenceReadBarrier = new Promise(resolve => { releasePreferenceReads = resolve; });
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
          async first() {
            const row = statement.get(...values) ?? null;
            if (barrierConcurrentPreferenceReads && sql.includes('SELECT preferences_json FROM editor_preferences') && preferenceReadCount < 2) {
              preferenceReadCount += 1;
              if (preferenceReadCount === 2) releasePreferenceReads();
              await preferenceReadBarrier;
            }
            return row;
          },
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
  assert.deepEqual((await (await f.call('GET')).json()).data.revisions, { paletteFavoriteTypes: 0, workspace: 0 });

  const saved = await f.call('PUT', 'user-a', { paletteFavoriteTypes: ['heading', 'text', 'heading'], baseRevisions: { paletteFavoriteTypes: 0 } });
  assert.equal(saved.status, 200);
  assert.deepEqual((await saved.json()).data.paletteFavoriteTypes, ['heading', 'text']);
  assert.deepEqual((await (await f.call('GET')).json()).data.paletteFavoriteTypes, ['heading', 'text']);
  assert.deepEqual((await (await f.call('GET', 'user-b')).json()).data.paletteFavoriteTypes, [],
    'a second authorized account cannot read the first account preferences');

  await f.call('PUT', 'user-b', { paletteFavoriteTypes: ['divider'], baseRevisions: { paletteFavoriteTypes: 0 } });
  assert.deepEqual((await (await f.call('GET')).json()).data.paletteFavoriteTypes, ['heading', 'text']);
  assert.deepEqual((await (await f.call('GET', 'user-b')).json()).data.paletteFavoriteTypes, ['divider']);
  assert.deepEqual(f.db.prepare('SELECT user_id FROM editor_preferences ORDER BY user_id').all().map(row => row.user_id), ['user-a', 'user-b']);
});

test('account workspace settings round-trip independently from page content and palette favorites', async t => {
  const f = await fixture(t);
  const workspace = {
    version: 1,
    appearance: {
      version: 2, layout: 'custom', theme: 'aurora', density: 'compact', accent: '#8fa7ff',
      dockOrder: 'canvas-right-left', panelMode: 'tabbed', panelSide: 'left',
      floatingPosition: { left: { x: 24, y: 41 }, right: { x: 999, y: -8 } },
      dockTree: { id: 'root', kind: 'split', axis: 'horizontal', ratio: 0.38, children: [
        { id: 'left', kind: 'panel', side: 'left' },
        { id: 'right-split', kind: 'split', axis: 'horizontal', ratio: 0.72, children: [
          { id: 'canvas', kind: 'canvas' }, { id: 'right', kind: 'panel', side: 'right' }
        ] }
      ] },
      profiles: [{ name: 'Local-only profile must not sync' }]
    },
    dock: { leftOpen: true, rightOpen: true, leftTab: 'layers', leftTabOrder: ['navigation', 'pages'], inspectorTab: 'content', panelActive: 'right', leftWidth: 444.4, rightWidth: 281 },
    viewport: { device: 'tablet', zoom: 0.82 }
  };
  const saved = await f.call('PUT', 'user-a', { workspace, baseRevisions: { workspace: 0 } });
  assert.equal(saved.status, 200);
  const savedBody = (await saved.json()).data;
  assert.deepEqual(savedBody.workspace.viewport, { device: 'tablet', zoom: 0.82 });
  assert.deepEqual(savedBody.workspace.dock.leftTabOrder, ['navigation', 'pages', 'elements', 'layers', 'schedule']);
  assert.equal(savedBody.workspace.dock.leftWidth, 444);
  assert.deepEqual(savedBody.workspace.appearance.floatingPosition, { left: { x: 24, y: 41 }, right: { x: 600, y: 0 } });
  assert.equal('profiles' in savedBody.workspace.appearance, false, 'personal profile names stay local to the device');
  assert.deepEqual((await (await f.call('GET', 'user-a')).json()).data.workspace, savedBody.workspace);

  await f.call('PUT', 'user-a', { paletteFavoriteTypes: ['heading'], baseRevisions: { paletteFavoriteTypes: 0 } });
  const merged = (await (await f.call('GET', 'user-a')).json()).data;
  assert.deepEqual(merged.paletteFavoriteTypes, ['heading']);
  assert.deepEqual(merged.workspace, savedBody.workspace, 'patching favorites does not erase workspace state');

  const other = (await (await f.call('GET', 'user-b')).json()).data;
  assert.equal(other.workspace, null, 'workspace preferences are scoped to the authenticated account');
  assert.deepEqual(other.paletteFavoriteTypes, []);
  assert.equal(f.db.prepare('SELECT COUNT(*) AS n FROM editor_preferences').get().n, 1);
});

test('concurrent account preference writes preserve independent workspace and palette updates', async t => {
  const f = await fixture(t, { barrierConcurrentPreferenceReads: true });
  f.db.prepare('INSERT INTO editor_preferences(user_id, preferences_json) VALUES (?, ?)').run('user-a', JSON.stringify({
    version: 1,
    paletteFavoriteTypes: ['divider'],
    workspace: {
      version: 1,
      appearance: { version: 2, layout: 'canvas', theme: 'graphite' },
      dock: { leftOpen: false, rightOpen: false, leftTab: 'pages' },
      viewport: { device: 'desktop', zoom: 1 }
    }
  }));
  const workspace = {
    version: 1,
    appearance: { theme: 'aurora', layout: 'canvas' },
    dock: { leftOpen: true, leftTab: 'layers' },
    viewport: { device: 'desktop', zoom: 1 }
  };
  const [workspaceResponse, favoritesResponse] = await Promise.all([
    f.call('PUT', 'user-a', { workspace, baseRevisions: { workspace: 0 } }),
    f.call('PUT', 'user-a', { paletteFavoriteTypes: ['heading', 'text'], baseRevisions: { paletteFavoriteTypes: 0 } })
  ]);
  assert.equal(workspaceResponse.status, 200);
  assert.equal(favoritesResponse.status, 200);
  const stored = (await (await f.call('GET', 'user-a')).json()).data;
  assert.deepEqual(stored.workspace.appearance, {
    layout: 'canvas', theme: 'aurora', density: 'comfortable', accent: '#5b8cff', dockOrder: 'left-canvas-right',
    panelMode: 'separate', panelSide: 'right', floatingPosition: { left: { x: 0, y: 0 }, right: { x: 0, y: 0 } }
  });
  assert.deepEqual(stored.paletteFavoriteTypes, ['heading', 'text']);
  assert.deepEqual(stored.revisions, { paletteFavoriteTypes: 1, workspace: 1 });
});

test('same-field stale workspace writes return a conflict and preserve the first committed value', async t => {
  const f = await fixture(t);
  const workspace = theme => ({ version: 1, appearance: { theme }, dock: {}, viewport: {} });
  const [first, stale] = await Promise.all([
    f.call('PUT', 'user-a', { workspace: workspace('aurora'), baseRevisions: { workspace: 0 } }),
    f.call('PUT', 'user-a', { workspace: workspace('ocean'), baseRevisions: { workspace: 0 } })
  ]);
  assert.deepEqual([first.status, stale.status].sort(), [200, 409]);
  const conflict = first.status === 409 ? await first.json() : await stale.json();
  assert.equal(conflict.error.code, 'PREFERENCES_CONFLICT');
  assert.equal(conflict.data.revisions.workspace, 1);
  const stored = (await (await f.call('GET')).json()).data;
  assert.equal(stored.revisions.workspace, 1);
  assert.equal(['aurora', 'ocean'].includes(stored.workspace.appearance.theme), true);
  assert.equal(stored.workspace.appearance.theme, conflict.data.workspace.appearance.theme,
    'the conflict payload and stored state identify the winner without silently accepting the stale update');
});

test('same-field stale palette favorite writes return a conflict rather than replacing a newer list', async t => {
  const f = await fixture(t);
  const first = await f.call('PUT', 'user-a', { paletteFavoriteTypes: ['heading'], baseRevisions: { paletteFavoriteTypes: 0 } });
  const stale = await f.call('PUT', 'user-a', { paletteFavoriteTypes: ['divider'], baseRevisions: { paletteFavoriteTypes: 0 } });
  assert.equal(first.status, 200);
  assert.equal(stale.status, 409);
  assert.equal((await stale.json()).data.revisions.paletteFavoriteTypes, 1);
  const stored = (await (await f.call('GET')).json()).data;
  assert.deepEqual(stored.paletteFavoriteTypes, ['heading']);
  assert.equal(stored.revisions.paletteFavoriteTypes, 1);
});

test('a write without its field revision is rejected before storage changes', async t => {
  const f = await fixture(t);
  const response = await f.call('PUT', 'user-a', { workspace: { version: 1, appearance: {}, dock: {}, viewport: {} } });
  assert.equal(response.status, 428);
  assert.equal((await response.json()).error.code, 'PREFERENCES_REVISION_REQUIRED');
  assert.equal(f.db.prepare('SELECT COUNT(*) AS n FROM editor_preferences').get().n, 0);
});

test('workspace account preference payload rejects unsafe or malformed state without mutation', async t => {
  const f = await fixture(t);
  const valid = { version: 1, appearance: {}, dock: {}, viewport: {} };
  const invalid = [
    { workspace: { ...valid, pageModel: { overwrite: true } } },
    { workspace: { ...valid, viewport: { zoom: 99 } } },
    { workspace: { ...valid, dock: { inspectorTab: 'script' } } },
    { workspace: { ...valid, appearance: { theme: 'url(javascript:alert(1))' } } },
    { workspace: { ...valid, appearance: { dockTree: { id: 'canvas', kind: 'canvas' } } } },
    { workspace: { ...valid, appearance: { floatingPosition: { left: { x: 'url(1)' } } } } }
  ];
  for (const body of invalid) assert.equal((await f.call('PUT', 'user-a', body)).status, 400);
  assert.equal(f.db.prepare('SELECT COUNT(*) AS n FROM editor_preferences').get().n, 0);
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
  const repaired = await f.call('PUT', 'user-a', { paletteFavoriteTypes: ['heading'], baseRevisions: { paletteFavoriteTypes: 0 } });
  assert.equal(repaired.status, 200, 'a valid preference update repairs malformed legacy JSON safely');
  assert.deepEqual((await (await f.call('GET')).json()).data, {
    version: 1,
    paletteFavoriteTypes: ['heading'],
    workspace: null,
    revisions: { paletteFavoriteTypes: 1, workspace: 0 },
    updatedAt: f.db.prepare('SELECT updated_at FROM editor_preferences WHERE user_id = ?').get('user-a').updated_at
  });
  assert.doesNotThrow(() => JSON.parse(f.db.prepare('SELECT preferences_json FROM editor_preferences WHERE user_id = ?').get('user-a').preferences_json));
  assert.equal((await f.call('DELETE')).status, 405);
});

test('preference storage errors fail closed with a no-store unavailable response', async t => {
  const f = await fixture(t);
  f.db.exec('DROP TABLE editor_preferences');
  assert.equal((await f.call('GET')).status, 503);
  assert.equal((await f.call('PUT', 'user-a', { paletteFavoriteTypes: ['heading'], baseRevisions: { paletteFavoriteTypes: 0 } })).status, 503);
});
