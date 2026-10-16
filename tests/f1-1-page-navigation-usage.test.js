import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { DatabaseSync } from 'node:sqlite';
import { adminPagesRoute } from '../src/routes/admin/pages.ts';
import { hashSessionToken } from '../src/core/auth/session.ts';

const navigationMigration = readFileSync(new URL('../migrations/0020_site_navigation_snapshots.sql', import.meta.url), 'utf8');
const usageMigration = readFileSync(new URL('../migrations/0021_prevent_deleting_navigation_pages.sql', import.meta.url), 'utf8');

async function fixture(t) {
  const db = new DatabaseSync(':memory:');
  t.after(() => db.close());
  db.exec(`
    PRAGMA foreign_keys=ON;
    CREATE TABLE sites(id TEXT PRIMARY KEY,slug TEXT NOT NULL UNIQUE,name TEXT NOT NULL);
    CREATE TABLE users(id TEXT PRIMARY KEY,email TEXT,display_name TEXT,role TEXT,is_active INTEGER);
    CREATE TABLE sessions(token_hash TEXT,user_id TEXT,expires_at TEXT);
    CREATE TABLE pages(
      id TEXT PRIMARY KEY,site_id TEXT NOT NULL,slug TEXT NOT NULL,title TEXT NOT NULL,description TEXT NOT NULL,
      content_json TEXT NOT NULL,published_content_json TEXT,is_published INTEGER NOT NULL,
      published_revision_id TEXT,sort_order INTEGER NOT NULL,published_slug TEXT,published_title TEXT,
      published_description TEXT,published_at TEXT,created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE editor_revisions(id TEXT PRIMARY KEY,page_id TEXT,version INTEGER);
    CREATE TABLE audit_log(id TEXT PRIMARY KEY,user_id TEXT,action TEXT,entity_type TEXT,entity_id TEXT,metadata_json TEXT);
    INSERT INTO sites VALUES('site-default','sanci9517','Sanci9517'),('other-site','other','Other');
    INSERT INTO users VALUES('editor','editor@example.test','Editor','editor',1);
    INSERT INTO pages(id,site_id,slug,title,description,content_json,is_published,published_revision_id,sort_order,published_slug,published_title,published_description)
      VALUES
      ('home','site-default','home','Home','', '{}',1,'rev-home',0,'home','Home',''),
      ('youtube','site-default','youtube','YouTube','', '{}',1,'rev-youtube',1,'youtube','YouTube',''),
      ('unused','site-default','unused','Unused','', '{}',0,NULL,2,NULL,NULL,NULL),
      ('foreign','other-site','foreign','Foreign','', '{}',0,NULL,0,NULL,NULL,NULL);
  `);
  db.exec(navigationMigration);
  db.exec(usageMigration);
  db.prepare('INSERT INTO sessions VALUES(?,?,?)').run(await hashSessionToken('editor-token'), 'editor', '2999-01-01');
  const DB = {
    prepare(sql) {
      const statement = db.prepare(sql.replace(/\?\d+/g, '?'));
      let values = [];
      return {
        bind(...args) { values = [...args]; return this; },
        async first() { return statement.get(...values) ?? null; },
        async all() { return { results: statement.all(...values) }; },
        async run() { return { meta: { changes: Number(statement.run(...values).changes) } }; }
      };
    },
    async batch(statements) {
      db.exec('BEGIN');
      try {
        const results = [];
        for (const statement of statements) results.push(await statement.run());
        db.exec('COMMIT');
        return results;
      } catch (error) {
        db.exec('ROLLBACK');
        throw error;
      }
    }
  };
  const remove = id => adminPagesRoute(new Request('https://example.test/api/admin/pages', {
    method: 'DELETE',
    headers: { Cookie: 'sanci9517_session=editor-token', 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  }), { DB });
  return { db, remove };
}

test('page deletion is blocked when the published navigation uses the page', async t => {
  const f = await fixture(t);
  const response = await f.remove('youtube');
  assert.equal(response.status, 409);
  assert.equal((await response.json()).error.code, 'PAGE_IN_USE');
  assert.ok(f.db.prepare('SELECT id FROM pages WHERE id=?').get('youtube'));
  assert.equal(f.db.prepare("SELECT COUNT(*) AS n FROM audit_log WHERE action='page.delete'").get().n, 0);
});

test('page deletion is blocked for nested draft navigation references', async t => {
  const f = await fixture(t);
  f.db.prepare('UPDATE site_navigation SET draft_json=? WHERE site_id=?').run(JSON.stringify({
    schemaVersion: 1,
    items: [{ id: 'parent', type: 'external', url: 'https://example.org', label: 'Community', children: [
      { id: 'child', type: 'page', pageId: 'unused', children: [] }
    ] }]
  }), 'site-default');
  const response = await f.remove('unused');
  assert.equal(response.status, 409);
  assert.equal((await response.json()).error.code, 'PAGE_IN_USE');
  assert.ok(f.db.prepare('SELECT id FROM pages WHERE id=?').get('unused'));
});

test('page deletion still works when neither navigation snapshot references it', async t => {
  const f = await fixture(t);
  f.db.prepare('UPDATE site_navigation SET draft_json=?,published_json=? WHERE site_id=?')
    .run('{"schemaVersion":1,"items":[]}', '{"schemaVersion":1,"items":[]}', 'site-default');
  const response = await f.remove('youtube');
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json().then(body => body.data), { id: 'youtube', deleted: true });
  assert.equal(f.db.prepare('SELECT id FROM pages WHERE id=?').get('youtube'), undefined);
  assert.equal(f.db.prepare('SELECT sort_order FROM pages WHERE id=?').get('unused').sort_order, 1);
  assert.equal(f.db.prepare("SELECT COUNT(*) AS n FROM audit_log WHERE action='page.delete'").get().n, 1);
});

test('page deletion only checks navigation belonging to the same site', async t => {
  const f = await fixture(t);
  f.db.prepare('UPDATE site_navigation SET draft_json=?,published_json=? WHERE site_id=?')
    .run('{"schemaVersion":1,"items":[]}', '{"schemaVersion":1,"items":[]}', 'site-default');
  f.db.prepare('UPDATE site_navigation SET draft_json=? WHERE site_id=?').run(JSON.stringify({
    schemaVersion: 1,
    items: [{ id: 'foreign-reference', type: 'page', pageId: 'youtube', children: [] }]
  }), 'other-site');
  const response = await f.remove('youtube');
  assert.equal(response.status, 200);
});
