import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { hashSessionToken } from '../src/core/auth/session.ts';
import { requireSiteGrant, siteRoleAllows } from '../src/core/auth/site-access.ts';

const sql = readFileSync(new URL('../scripts/pending/0026_site_memberships.sql', import.meta.url), 'utf8');
const baseSchema = `
  PRAGMA foreign_keys=ON;
  CREATE TABLE sites(id TEXT PRIMARY KEY,status TEXT NOT NULL);
  CREATE TABLE users(id TEXT PRIMARY KEY,email TEXT,display_name TEXT,role TEXT,is_active INTEGER);
  CREATE TABLE sessions(token_hash TEXT,user_id TEXT,expires_at TEXT);
  CREATE TABLE pages(id TEXT PRIMARY KEY,site_id TEXT,slug TEXT);
  INSERT INTO sites VALUES ('site-default','active'),('other','active'),('archived','archived');
  INSERT INTO users VALUES ('owner','owner@example.test','Owner','admin',1);
  INSERT INTO users VALUES ('editor','editor@example.test','Editor','editor',1);
  INSERT INTO users VALUES ('inactive','inactive@example.test','Inactive','admin',0);
  INSERT INTO pages VALUES ('existing','site-default','homepage');
`;

async function fixture(t, install = true) {
  const db = new DatabaseSync(':memory:');
  t.after(() => db.close());
  db.exec(baseSchema);
  if (install) db.exec(sql);
  for (const id of ['owner', 'editor', 'inactive']) {
    db.prepare('INSERT INTO sessions VALUES (?,?,?)')
      .run(await hashSessionToken(id), id, '2999-01-01T00:00:00.000Z');
  }
  const env = { DB: { prepare(query) {
    const statement = db.prepare(query);
    let args = [];
    return { bind(...values) { args = values; return this; },
      async first() { return statement.get(...args) ?? null; } };
  } } };
  const req = id => new Request('https://trusted.test/api/admin/pages', {
    headers: id ? { Cookie: `sanci9517_session=${id}` } : {}
  });
  const check = (user, siteId, role) => requireSiteGrant(req(user), env, siteId, role);
  return { db, check };
}

test('site memberships seed only existing active default-site users without touching pages', async t => {
  const { db, check } = await fixture(t);
  assert.deepEqual(db.prepare('SELECT id,site_id,slug FROM pages').all().map(x => ({...x})), [
    { id:'existing',site_id:'site-default',slug:'homepage' }
  ]);
  assert.deepEqual(db.prepare('SELECT site_id,user_id,role FROM site_memberships ORDER BY user_id').all()
    .map(x => ({...x})), [
    { site_id:'site-default',user_id:'editor',role:'editor' },
    { site_id:'site-default',user_id:'owner',role:'admin' }
  ]);
  const grant = await check('owner', 'site-default', 'admin');
  assert.equal(grant.siteId, 'site-default');
  assert.equal(grant.role, 'admin');
  assert.equal((await check('owner', 'other', 'viewer')).status, 403);
  assert.equal((await check('inactive', 'site-default', 'viewer')).status, 401);
});

test('site access is scoped by membership, not global user role', async t => {
  const { db, check } = await fixture(t);
  db.prepare("INSERT INTO site_memberships(site_id,user_id,role) VALUES ('other','owner','viewer')").run();
  db.prepare("INSERT INTO site_memberships(site_id,user_id,role) VALUES ('other','editor','editor')").run();
  assert.equal((await check('owner','other','editor')).status, 403);
  assert.equal((await check('owner','other','viewer')).role, 'viewer');
  assert.equal((await check('editor','other','editor')).role, 'editor');
  assert.equal((await check('editor','other','admin')).status, 403);
  assert.equal((await check('editor','site-default','admin')).status, 403);
  assert.equal((await check('owner','archived','viewer')).status, 403);
  db.prepare("UPDATE site_memberships SET status='revoked' WHERE site_id='other' AND user_id='editor'").run();
  assert.equal((await check('editor','other','viewer')).status, 403);
});

test('authorization fails closed for anonymous, unknown and invalid site contexts', async t => {
  const { check } = await fixture(t);
  assert.equal((await check('', 'site-default', 'viewer')).status, 401);
  assert.equal((await check('owner','nonexistent','viewer')).status, 403);
  assert.equal((await check('owner','', 'viewer')).status, 403);
  assert.equal(siteRoleAllows('admin', 'editor'), true);
  assert.equal(siteRoleAllows('root', 'viewer'), false);
  assert.equal(siteRoleAllows(null, 'viewer'), false);
});

test('schema not installed returns unavailable, never a legacy-role fallback', async t => {
  const { check } = await fixture(t, false);
  const response = await check('owner', 'site-default', 'viewer');
  assert.equal(response.status, 503);
  assert.equal((await response.json()).error.code, 'SITE_ACCESS_UNAVAILABLE');
});

test('membership SQL rejects duplicate grants, unsupported roles and missing sites', async t => {
  const { db } = await fixture(t);
  assert.throws(() => db.prepare("INSERT INTO site_memberships(site_id,user_id,role) VALUES ('site-default','owner','admin')").run(), /UNIQUE/);
  assert.throws(() => db.prepare("INSERT INTO site_memberships(site_id,user_id,role) VALUES ('other','owner','superadmin')").run(), /CHECK/);
  assert.throws(() => db.prepare("INSERT INTO site_memberships(site_id,user_id,role) VALUES ('absent','owner','viewer')").run(), /FOREIGN KEY/);
  assert.throws(() => db.prepare("INSERT INTO site_memberships(site_id,user_id,role,status) VALUES ('other','owner','viewer','pending')").run(), /CHECK/);
  assert.deepEqual(db.prepare('PRAGMA foreign_key_check').all(), []);
});
