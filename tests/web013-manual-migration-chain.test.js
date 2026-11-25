import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync, readdirSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { build0031ReleaseStatements } from "./review/prepare-0031-release.mjs";
import { build0032ReleaseStatements } from "./review/prepare-0032-release.mjs";

const migrations = new URL("../migrations/", import.meta.url);
const pendingNames = [
  "0025_site_domains_and_site_slug.sql",
  "0026_site_memberships.sql",
  "0027_site_scoped_settings.sql",
  "0028_media_archive.sql",
  "0029_media_archive_unicode_additive.sql",
  "0030_media_library_organization.sql",
  "0031_media_archive_malformed_json_guard.sql",
  "0032_forms_service.sql"
];
const pending = pendingNames.slice(0, 6).map(name =>
  readFileSync(new URL(name.startsWith("0029_") ? "../tests/fixtures/" + name : "../scripts/pending/" + name, import.meta.url), "utf8")
);

function applyFullManualChain(db) {
  db.exec("CREATE TABLE d1_migrations(id INTEGER PRIMARY KEY, name TEXT NOT NULL UNIQUE, applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);");
  const addMarker = db.prepare("INSERT INTO d1_migrations(id,name) VALUES(?,?)");
  for (let id = 1; id <= 30; id++) addMarker.run(id, `historical-${id}.sql`);
  for (let index = 0; index < pending.length; index++) {
    const sql = pending[index];
    db.exec("BEGIN;" + sql + ";COMMIT;");
    addMarker.run(31 + index, pendingNames[index]);
  }
  for (const sql of build0031ReleaseStatements()) db.exec("BEGIN;" + sql + ";COMMIT;");
  for (const sql of build0032ReleaseStatements()) db.exec("BEGIN;" + sql + ";COMMIT;");
}

function freshDatabase(t) {
  const db = new DatabaseSync(":memory:");
  db.exec("PRAGMA foreign_keys=ON;");
  t.after(() => db.close());
  const sqlFiles = readdirSync(migrations).filter(name => name.endsWith(".sql")).sort();
  assert.equal(sqlFiles.at(-1), "0024_page_slug_redirects.sql", "legacy schema baseline changed; review chain");
  for (const name of sqlFiles) {
    db.exec("BEGIN;" + readFileSync(new URL(name, migrations), "utf8") + ";COMMIT;");
  }
  return db;
}
function rows(db, table) {
  return db.prepare("SELECT * FROM " + table + " ORDER BY rowid").all();
}
function count(db, name) {
  return db.prepare("SELECT COUNT(*) AS n FROM " + name).get().n;
}

test("fresh 0024 DB upgrades through manually staged 0025-0032 without data loss", t => {
  const db = freshDatabase(t);
  db.prepare("INSERT INTO users(id,email,display_name,role,is_active) VALUES (?,?,?,?,?)")
    .run("owner-1", "owner@example.test", "Owner", "admin", 1);
  db.prepare("INSERT INTO users(id,email,display_name,role,is_active) VALUES (?,?,?,?,?)")
    .run("creator-2", "creator@example.test", "Creator", "editor", 1);
  db.prepare("INSERT INTO users(id,email,display_name,role,is_active) VALUES (?,?,?,?,?)")
    .run("disabled-3", "inactive@example.test", "Inactive", "viewer", 0);
  db.prepare("INSERT INTO sites(id,slug,name) VALUES (?,?,?)")
    .run("other-site", "other-site", "Other site");
  db.prepare("INSERT INTO site_settings(key,value_json,updated_at) VALUES (?,?,?) ON CONFLICT(key) DO UPDATE SET value_json=excluded.value_json,updated_at=excluded.updated_at")
    .run("site", JSON.stringify({siteName: "Fixture brand", tagline: "Original"}), "2026-10-17");
  db.prepare("INSERT INTO media(id,object_key,original_name,mime_type,size_bytes,alt_text,site_id) VALUES (?,?,?,?,?,?,?)")
    .run("asset-1","site-default/media/asset-1","cover.png","image/png",123,"Original alt","site-default");
  const [parent, child] = db.prepare("SELECT id FROM pages ORDER BY id LIMIT 2").all();
  assert.ok(parent?.id && child?.id, "baseline must contain two pages");
  db.prepare("UPDATE pages SET parent_page_id=? WHERE id=?").run(parent.id, child.id);
  db.prepare("INSERT INTO page_slug_redirects(site_id,from_slug,page_id) VALUES ('site-default',?,?)")
    .run("previous-home-link", parent.id);

  const originalMedia = db.prepare("SELECT id,object_key,original_name,mime_type,size_bytes,alt_text,created_at,site_id FROM media").all().map(row=>({...row}));
  const originals = Object.fromEntries(
    ["pages", "editor_revisions", "page_slug_redirects", "site_settings", "site_navigation", "users"]
      .map(name => [name, rows(db, name)])
  );
  assert.match(db.prepare("SELECT sql FROM sqlite_master WHERE name='pages'").get().sql, /slug TEXT NOT NULL UNIQUE/);

  applyFullManualChain(db);

  for (const [name, expected] of Object.entries(originals)) {
    assert.deepEqual(rows(db, name), expected, name + " was modified");
  }
  assert.doesNotMatch(db.prepare("SELECT sql FROM sqlite_master WHERE name='pages'").get().sql, /slug TEXT NOT NULL UNIQUE/);
  assert.equal(count(db, "site_domains"), 1);
  assert.equal(count(db, "forms"), 0);
  assert.equal(count(db, "form_submissions"), 0);
  assert.equal(count(db, "d1_migrations"), 38);
  assert.equal(db.prepare("SELECT name FROM d1_migrations ORDER BY id DESC LIMIT 1").get().name, "0032_forms_service.sql");
  assert.ok(db.prepare('PRAGMA table_info(media)').all().some(col=>col.name==='archived_at'));
  assert.ok(db.prepare("SELECT name FROM sqlite_master WHERE name='media_archive_pages_update_guard'").get());
  assert.deepEqual(db.prepare("SELECT id,site_id,folder_id FROM media").all().map(row=>({...row})),[{id:"asset-1",site_id:"site-default",folder_id:null}],
    "the additive organization schema preserves all existing media and assigns it to the implicit root");
  assert.deepEqual(db.prepare("SELECT id,object_key,original_name,mime_type,size_bytes,alt_text,created_at,site_id FROM media").all().map(row=>({...row})),originalMedia,
    "new organization metadata does not rewrite existing media metadata");
  for(const table of ["media_folders","media_tags","media_collections","media_asset_tags","media_collection_assets"])
    assert.ok(db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?").get(table),table+" must exist after the staged migration");
  assert.equal(count(db, "site_memberships"), 2, "only active default-site users are seeded");
  assert.deepEqual(
    db.prepare("SELECT user_id,role,site_id,status FROM site_memberships ORDER BY user_id").all().map(r => ({...r})),
    [
      { user_id:"creator-2", role:"editor", site_id:"site-default", status:"active" },
      { user_id:"owner-1", role:"admin", site_id:"site-default", status:"active" }
    ]
  );
  assert.deepEqual(
    db.prepare("SELECT site_id,key,value_json,updated_at FROM site_scoped_settings").all().map(r => ({...r})),
    [{
      site_id: "site-default", key: "site",
      value_json: JSON.stringify({siteName: "Fixture brand", tagline: "Original"}),
      updated_at: "2026-10-17"
    }]
  );
  assert.deepEqual(db.prepare("PRAGMA foreign_key_check").all(), []);
  db.prepare("INSERT INTO media_folders(id,site_id,name,name_key) VALUES ('folder-other','other-site','Other','other')").run();
  assert.throws(()=>db.prepare("UPDATE media SET folder_id='folder-other' WHERE id='asset-1'").run(),/MEDIA_FOLDER_SITE_MISMATCH/);
  assert.throws(()=>db.prepare("INSERT INTO media_asset_tags(site_id,asset_id,tag_id) VALUES ('site-default','asset-1','missing-tag')").run(),/FOREIGN KEY/);

  const copiedSlug = db.prepare("SELECT slug FROM pages WHERE id=?").get(parent.id).slug;
  db.prepare("INSERT INTO pages(id,site_id,slug,title) VALUES ('foreign-copy','other-site',?,?)")
    .run(copiedSlug, "Allowed on other site");
  assert.throws(() => db.prepare("INSERT INTO pages(id,site_id,slug,title) VALUES ('local-duplicate','site-default',?,?)")
    .run(copiedSlug, "Disallowed in original site"), /UNIQUE|PAGE_SLUG_RESERVED/);
  assert.deepEqual(db.prepare("PRAGMA foreign_key_check").all(), []);
});

test("replaying the manual chain is rejected before the original data can be rebuilt", t => {
  const db = freshDatabase(t);
  applyFullManualChain(db);
  const original = rows(db, "pages");
  assert.throws(() => db.exec("BEGIN;" + pending[0] + ";COMMIT;"), /already exists/);
  if (db.inTransaction) db.exec("ROLLBACK");
  assert.deepEqual(rows(db, "pages"), original);
  assert.deepEqual(db.prepare("PRAGMA foreign_key_check").all(), []);
});
