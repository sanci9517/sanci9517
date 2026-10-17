import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import worker from '../src/index.ts';
import { hashSessionToken } from '../src/core/auth/session.ts';
import { requiredSiteRole } from '../src/core/auth/admin-tenant-gate.ts';

const bootstrapOrigin = 'https://sanci9517-streamer-brand.sandor-bogadi95.workers.dev';

async function fixture(t, { installed = true, enabled = true } = {}) {
  const db = new DatabaseSync(':memory:');
  t.after(() => db.close());
  db.exec(`
    PRAGMA foreign_keys=ON;
    CREATE TABLE sites(id TEXT PRIMARY KEY, name TEXT, status TEXT);
    CREATE TABLE users(id TEXT PRIMARY KEY, email TEXT, display_name TEXT, role TEXT, is_active INTEGER);
    CREATE TABLE sessions(token_hash TEXT, user_id TEXT, expires_at TEXT);
    CREATE TABLE site_domains(hostname TEXT PRIMARY KEY, site_id TEXT, status TEXT, verified_at TEXT);
    CREATE TABLE site_settings(key TEXT PRIMARY KEY, value_json TEXT, updated_at TEXT);
    INSERT INTO sites VALUES ('site-default','Sanci9517','active'),('other','Other','active');
    INSERT INTO site_domains VALUES ('other.test','other','verified','2026-10-17');
    INSERT INTO users VALUES ('owner','owner@example.test','Owner','admin',1),
      ('editor','editor@example.test','Editor','editor',1),
      ('viewer','viewer@example.test','Viewer','viewer',1);
  `);
  if (installed) {
    db.exec(readFileSync(new URL('../scripts/pending/0026_site_memberships.sql', import.meta.url), 'utf8'));
    db.prepare("INSERT INTO site_memberships(site_id,user_id,role) VALUES ('other','owner','admin')").run();
  }
  for (const id of ['owner','editor','viewer']) {
    db.prepare('INSERT INTO sessions VALUES (?,?,?)').run(await hashSessionToken(id), id, '2999-01-01T00:00:00.000Z');
  }
  let assetsServed = 0;
  const env = {
    ...(enabled ? { SITE_MEMBERSHIP_ENFORCEMENT: 'enabled' } : {}),
    SITE_HOST_BINDINGS: '{"other.test":"other"}',
    DB: {
      prepare(query) {
        const stmt = db.prepare(query);
        let args = [];
        return { bind(...values) { args = values; return this; },
          async first() { return stmt.get(...args) ?? null; },
          async all() { return { results: stmt.all(...args) }; } };
      }
    },
    ASSETS: {
      async fetch() {
        assetsServed++;
        return new Response('<html>Admin</html>', { status: 200, headers: { 'Content-Type': 'text/html' } });
      }
    }
  };
  const fetch = (pathname, id = '', origin = bootstrapOrigin, headers = {}) =>
    worker.fetch(new Request(origin + pathname, {
      headers: { ...(id ? { Cookie: `sanci9517_session=${id}` } : {}), ...headers }
    }), env, {});
  return { db, fetch, assetsServed: () => assetsServed };
}

test('role policy is limited to actual privileged paths, not login or public pages', () => {
  const url = new URL(bootstrapOrigin);
  assert.equal(requiredSiteRole('/admin/login', url), null);
  assert.equal(requiredSiteRole('/admin', url), 'viewer');
  assert.equal(requiredSiteRole('/admin/editor', url), 'editor');
  assert.equal(requiredSiteRole('/api/admin/settings', url), 'admin');
  assert.equal(requiredSiteRole('/api/admin/pages', url), 'editor');
  assert.equal(requiredSiteRole('/api/public/pages', url), null);
  assert.equal(requiredSiteRole('/p/home', new URL(bootstrapOrigin + '/p/home?preview=1')), 'editor');
  assert.equal(requiredSiteRole('/api/public/pages', new URL(bootstrapOrigin + '/api/public/pages?preview=1')), 'editor');
});

test('tenant enforcement retains the HTML login redirect without revealing Admin assets', async t => {
  const f = await fixture(t);
  const denied = await f.fetch('/admin');
  assert.equal(denied.status, 302);
  assert.equal(denied.headers.get('Location'), bootstrapOrigin + '/admin/login');
  assert.equal(f.assetsServed(), 0);
  assert.equal((await f.fetch('/admin/login')).status, 200);
  assert.equal(f.assetsServed(), 1);
  assert.equal((await f.fetch('/api/admin/settings')).status, 401);
});

test('default-site grants restrict roles and prohibit cross-site privilege inheritance', async t => {
  const f = await fixture(t);
  assert.equal((await f.fetch('/admin','viewer')).status, 200);
  assert.equal((await f.fetch('/admin/editor','viewer')).status, 403);
  assert.equal((await f.fetch('/admin/editor','editor')).status, 200);
  assert.equal((await f.fetch('/api/admin/settings','editor')).status, 403);
  assert.equal((await f.fetch('/api/admin/settings','owner')).status, 200);
  assert.equal((await f.fetch('/p/secret?preview=1','viewer')).status, 403);
  assert.equal((await f.fetch('/api/public/pages?preview=1','viewer')).status, 403);
  f.db.prepare("UPDATE site_memberships SET status='revoked' WHERE site_id='site-default' AND user_id='editor'").run();
  assert.equal((await f.fetch('/admin/editor','editor')).status, 403);
  assert.equal((await f.fetch('/admin','editor')).status, 403);
});

test('an authorized other-site member still cannot reach Admin before tenant routes are ready', async t => {
  const f = await fixture(t);
  assert.equal((await f.fetch('/admin','owner','https://other.test')).status, 403);
  assert.equal((await f.fetch('/api/admin/settings','owner','https://other.test')).status, 403);
  assert.equal((await f.fetch('/p/secret?preview=1','owner','https://other.test')).status, 403);
  assert.equal((await f.fetch('/admin','owner',bootstrapOrigin,{'X-Site-ID':'other'})).status, 200);
});

test('missing membership schema fails closed if enabled and is compatible if disabled', async t => {
  const blocked = await fixture(t, { installed: false, enabled: true });
  assert.equal((await blocked.fetch('/admin','owner')).status, 503);
  assert.equal((await blocked.fetch('/api/admin/settings','owner')).status, 503);
  const legacy = await fixture(t, { installed: false, enabled: false });
  assert.equal((await legacy.fetch('/admin','owner')).status, 200);
  assert.equal((await legacy.fetch('/admin/editor','editor')).status, 200);
});
