import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import test from 'node:test';
import { DatabaseSync } from 'node:sqlite';

const migration = readFileSync(new URL('../scripts/pending/0025_site_domains_and_site_slug.sql', import.meta.url), 'utf8');
const preflight = readFileSync(new URL('../scripts/web013-site-scope-preflight.sql', import.meta.url), 'utf8');

function fixture(t) {
  const db = new DatabaseSync(':memory:');
  t.after(() => db.close());
  for (const file of readdirSync(new URL('../migrations/', import.meta.url)).sort()) {
    db.exec('BEGIN;' + readFileSync(new URL('../migrations/' + file, import.meta.url), 'utf8') + ';COMMIT;');
  }
  db.prepare("INSERT INTO sites(id,slug,name) VALUES ('other-site','other','Other')").run();
  const [parent, child] = db.prepare('SELECT id FROM pages ORDER BY id LIMIT 2').all();
  db.prepare('UPDATE pages SET parent_page_id=? WHERE id=?').run(parent.id, child.id);
  db.prepare('INSERT INTO page_slug_redirects(site_id,from_slug,page_id) VALUES (?,?,?)').run('site-default', 'legacy-test-url', parent.id);
  return { db, parent: parent.id, child: child.id };
}

const rows = (db, name) => db.prepare(`SELECT * FROM ${name} ORDER BY rowid`).all();
const names = db => db.prepare("SELECT type,name FROM sqlite_master WHERE type IN ('index','trigger') AND tbl_name IN ('pages','editor_revisions','page_slug_redirects') AND sql IS NOT NULL ORDER BY type,name").all().map(row => `${row.type}:${row.name}`);

test('pending site/slug rebuild preserves all page state, revisions, redirects, hierarchy and guards', t => {
  const { db, parent, child } = fixture(t);
  const before = Object.fromEntries(['pages', 'editor_revisions', 'page_slug_redirects', 'site_navigation'].map(name => [name, rows(db, name)]));
  const beforeNames = names(db);
  const oldSchema = db.prepare("SELECT sql FROM sqlite_master WHERE name='pages'").get().sql;
  assert.match(oldSchema, /slug TEXT NOT NULL UNIQUE/);
  db.exec(preflight);
  assert.deepEqual(rows(db, 'pages'), before.pages, 'read-only preflight changed pages');

  db.exec('BEGIN;' + migration + ';COMMIT;');
  for (const name of Object.keys(before)) assert.deepEqual(rows(db, name), before[name], `${name} changed`);
  assert.deepEqual(names(db), [...beforeNames, 'index:idx_pages_site_slug'].sort());
  assert.deepEqual(db.prepare('PRAGMA foreign_key_check').all(), []);
  assert.equal(db.prepare('SELECT parent_page_id FROM pages WHERE id=?').get(child).parent_page_id, parent);
  assert.equal(db.prepare('SELECT page_id FROM page_slug_redirects WHERE from_slug=?').get('legacy-test-url').page_id, parent);
  const newSchema = db.prepare("SELECT sql FROM sqlite_master WHERE name='pages'").get().sql;
  assert.doesNotMatch(newSchema, /slug TEXT NOT NULL UNIQUE/);

  const existingSlug = db.prepare('SELECT slug FROM pages WHERE id=?').get(parent).slug;
  db.prepare("INSERT INTO pages(id,site_id,slug,title,is_published,published_slug,published_title) VALUES ('other-copy','other-site',?,?,1,?,?)")
    .run(existingSlug, 'Other copy', existingSlug, 'Other copy');
  assert.throws(() => db.prepare("INSERT INTO pages(id,site_id,slug,title,is_published) VALUES ('same-site-copy','site-default',?,?,0)").run(existingSlug, 'Duplicate'), /PAGE_SLUG_RESERVED|UNIQUE/);
  db.prepare("INSERT INTO pages(id,site_id,slug,title,is_published) VALUES ('draft-one','site-default','draft-unique','Draft one',0)").run();
  assert.throws(() => db.prepare("INSERT INTO pages(id,site_id,slug,title,is_published) VALUES ('draft-two','site-default','draft-unique','Draft two',0)").run(), /UNIQUE/);
  assert.deepEqual(db.prepare('PRAGMA foreign_key_check').all(), []);
  assert.deepEqual(db.prepare("SELECT hostname,site_id,status,verification_method FROM site_domains").all().map(row => ({ ...row })), [
    { hostname: 'sanci9517-streamer-brand.sandor-bogadi95.workers.dev', site_id: 'site-default', status: 'verified', verification_method: 'cloudflare-worker-route' }
  ]);
  assert.throws(() => db.prepare("INSERT INTO site_domains(hostname,site_id,status) VALUES ('unverified.test','other-site','verified')").run(), /CHECK/);
});

test('pending rebuild can be rolled back as a single transaction before release', t => {
  const { db } = fixture(t);
  const before = rows(db, 'pages');
  db.exec('BEGIN;' + migration + ';ROLLBACK;');
  assert.deepEqual(rows(db, 'pages'), before);
  assert.match(db.prepare("SELECT sql FROM sqlite_master WHERE name='pages'").get().sql, /slug TEXT NOT NULL UNIQUE/);
  assert.equal(db.prepare("SELECT name FROM sqlite_master WHERE name='site_domains'").get(), undefined);
  assert.deepEqual(db.prepare('PRAGMA foreign_key_check').all(), []);
});
