#!/usr/bin/env node
const fs = require('node:fs');
const assert = require('node:assert/strict');
const { DatabaseSync } = require('node:sqlite');

const [backupPath, migrationPath] = process.argv.slice(2);

if (!backupPath || !migrationPath) {
  console.error('Usage: node scripts/e4-4-dry-run.cjs <backup.sql> <migration.sql>');
  process.exit(2);
}

const backup = fs.readFileSync(backupPath, 'utf8');
const migration = fs.readFileSync(migrationPath, 'utf8');
const db = new DatabaseSync(':memory:');

const affected = [
  'pages',
  'schedule_items',
  'media',
  'social_accounts',
  'twitch_connections',
  'twitch_oauth_states'
];

const compareRows = table => db.prepare(`SELECT * FROM ${table} ORDER BY rowid`).all();
const rowCount = table => db.prepare(`SELECT COUNT(*) AS count FROM ${table}`).get().count;
const siteRows = table => db.prepare(`SELECT id, site_id FROM ${table} ORDER BY id`).all();

db.exec('PRAGMA foreign_keys = OFF;');
db.exec(backup);
db.exec('PRAGMA foreign_keys = ON;');

const before = new Map();
for (const table of affected) before.set(table, compareRows(table));
const beforeEditorRevisions = compareRows('editor_revisions');

for (const table of affected) {
  const rows = before.get(table);
  const nullCount = rows.filter(row => row.site_id == null).length;
  assert.equal(nullCount, 0, `${table}: precondition site_id NULL count must be 0`);
}

assert(before.get('pages').some(row => row.published_revision_id), 'pages: expected at least one published revision linkage');

db.exec('BEGIN;');
try {
  db.exec(migration);
  db.exec('COMMIT;');
} catch (error) {
  try { db.exec('ROLLBACK;'); } catch {}
  throw error;
}

db.exec('PRAGMA foreign_keys = ON;');

for (const table of affected) {
  assert.deepEqual(compareRows(table), before.get(table), `${table}: row data changed`);
  assert.equal(rowCount(table), before.get(table).length, `${table}: row count changed`);

  const cols = db.prepare(`PRAGMA table_info(${table})`).all();
  const siteId = cols.find(col => col.name === 'site_id');
  assert(siteId, `${table}: site_id column missing`);
  assert.equal(siteId.notnull, 1, `${table}: site_id is not NOT NULL`);

  const badSiteRows = db.prepare(`SELECT id FROM ${table} WHERE site_id IS NULL`).all();
  assert.equal(badSiteRows.length, 0, `${table}: NULL site_id after migration`);
}

assert.deepEqual(compareRows('editor_revisions'), beforeEditorRevisions, 'editor_revisions: row data changed');

const pagesBefore = before.get('pages').map(row => ({
  id: row.id,
  published_revision_id: row.published_revision_id
})).sort((a, b) => a.id.localeCompare(b.id));

const pagesAfter = db.prepare('SELECT id, published_revision_id FROM pages ORDER BY id').all();
assert.deepEqual(pagesAfter, pagesBefore, 'pages: published_revision_id linkage changed');

const expectedIndexes = {
  pages: ['idx_pages_sort_order', 'idx_pages_published_revision', 'idx_pages_site_id'],
  editor_revisions: ['idx_editor_revisions_page', 'idx_editor_revisions_page_version', 'idx_editor_revisions_created_at'],
  schedule_items: [
    'idx_schedule_starts_at',
    'idx_schedule_source_identity',
    'idx_schedule_source_account_starts',
    'idx_schedule_source_presence_starts',
    'idx_schedule_site_starts'
  ],
  media: ['idx_media_site_id'],
  social_accounts: ['idx_social_accounts_site_id'],
  twitch_connections: [
    'idx_twitch_connections_user_id',
    'idx_twitch_connections_status',
    'idx_twitch_connections_refresh_lock',
    'idx_twitch_connections_site_id'
  ],
  twitch_oauth_states: [
    'idx_twitch_oauth_states_expires_at',
    'idx_twitch_oauth_states_site_id'
  ]
};

for (const [table, names] of Object.entries(expectedIndexes)) {
  const indexes = new Set(
    db.prepare(`PRAGMA index_list(${table})`).all().map(index => index.name)
  );
  for (const name of names) {
    assert(indexes.has(name), `${table}: missing index ${name}`);
  }
}

const foreignKeyErrors = db.prepare('PRAGMA foreign_key_check').all();
assert.deepEqual(foreignKeyErrors, [], 'foreign_key_check must be empty');

const orphanSnapshots = db.prepare(`
  SELECT name
  FROM sqlite_master
  WHERE type = 'table'
    AND name IN (
      '__e44_pages_snapshot_20261007',
      '__e44_editor_revisions_snapshot_20261007'
    )
`).all();
assert.deepEqual(orphanSnapshots, [], 'temporary E4.4 snapshot tables remain');

for (const table of affected) {
  const sql = db.prepare(
    "SELECT sql FROM sqlite_master WHERE type='table' AND name=?"
  ).get(table)?.sql || '';
  assert.match(sql, /site_id TEXT NOT NULL/i, `${table}: canonical NOT NULL site_id missing from table SQL`);
  assert.match(sql, /REFERENCES sites\(id\) ON DELETE RESTRICT/i, `${table}: canonical sites FK missing`);
}

console.log(JSON.stringify({
  ok: true,
  tables: affected.map(table => ({ table, rows: rowCount(table), site_id_not_null: true })),
  editor_revisions: beforeEditorRevisions.length,
  pages_published_revision_linkage_preserved: true,
  foreign_key_check: 'PASS',
  indexes: 'PASS',
  snapshot_cleanup: 'PASS'
}, null, 2));
