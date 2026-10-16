import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { DatabaseSync } from 'node:sqlite';

const migration = readFileSync(new URL('../migrations/0020_site_navigation_snapshots.sql', import.meta.url), 'utf8');

function database() {
  const db = new DatabaseSync(':memory:');
  db.exec('PRAGMA foreign_keys = ON');
  db.exec(`
    CREATE TABLE sites (id TEXT PRIMARY KEY, slug TEXT NOT NULL UNIQUE, name TEXT NOT NULL);
    CREATE TABLE pages (
      id TEXT PRIMARY KEY,
      site_id TEXT NOT NULL REFERENCES sites(id),
      is_published INTEGER NOT NULL,
      published_slug TEXT,
      sort_order INTEGER NOT NULL,
      published_title TEXT
    );
    INSERT INTO sites VALUES ('site-a', 'site-a', 'Site A'), ('site-b', 'site-b', 'Site B');
    INSERT INTO pages VALUES
      ('a-home', 'site-a', 1, 'home', 0, 'Home'),
      ('a-youtube', 'site-a', 1, 'youtube', 1, 'YouTube'),
      ('a-draft', 'site-a', 0, NULL, 2, NULL),
      ('b-about', 'site-b', 1, 'about', 0, 'About');
  `);
  return db;
}

test('navigation migration seeds site-scoped published menus and excludes home/draft pages', t => {
  const db = database();
  t.after(() => db.close());
  db.exec(migration);

  const rows = db.prepare('SELECT site_id,draft_json,published_json,revision,published_revision FROM site_navigation ORDER BY site_id').all();
  assert.equal(rows.length, 2);
  assert.equal(rows[0].site_id, 'site-a');
  assert.deepEqual(JSON.parse(rows[0].draft_json), {
    schemaVersion: 1,
    items: [{ id: 'page:a-youtube', type: 'page', pageId: 'a-youtube', children: [] }]
  });
  assert.deepEqual(JSON.parse(rows[0].published_json), JSON.parse(rows[0].draft_json));
  assert.equal(rows[0].revision, 1);
  assert.equal(rows[0].published_revision, 1);
  assert.deepEqual(JSON.parse(rows[1].published_json).items.map(item => item.pageId), ['b-about']);
});

test('navigation migration creates an empty valid tree for a site without published pages', t => {
  const db = database();
  t.after(() => db.close());
  db.exec("INSERT INTO sites VALUES ('site-empty','site-empty','Empty')");
  db.exec(migration);

  const row = db.prepare("SELECT draft_json,published_json FROM site_navigation WHERE site_id='site-empty'").get();
  assert.deepEqual(JSON.parse(row.draft_json), { schemaVersion: 1, items: [] });
  assert.deepEqual(JSON.parse(row.published_json), { schemaVersion: 1, items: [] });
  assert.deepEqual(db.prepare('PRAGMA foreign_key_check').all(), []);
});
