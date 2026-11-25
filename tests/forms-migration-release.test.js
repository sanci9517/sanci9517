import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";
import { DatabaseSync } from "node:sqlite";
import { build0032ReleaseStatements, CANDIDATE_SHA256, EXPECTED_OBJECTS, MIGRATION_NAME } from "./review/prepare-0032-release.mjs";

const migration = readFileSync(new URL("../scripts/pending/0032_forms_service.sql", import.meta.url), "utf8");
const statements = build0032ReleaseStatements();

function fixture() {
  const db = new DatabaseSync(":memory:");
  db.exec(`PRAGMA foreign_keys=ON;
    CREATE TABLE sites(id TEXT PRIMARY KEY,name TEXT NOT NULL);
    CREATE TABLE users(id TEXT PRIMARY KEY,email TEXT NOT NULL);
    CREATE TABLE d1_migrations(id INTEGER PRIMARY KEY,name TEXT NOT NULL UNIQUE);
    INSERT INTO sites VALUES('site-a','A');
    INSERT INTO users VALUES('owner-a','a@example.test');`);
  const add = db.prepare("INSERT INTO d1_migrations(name) VALUES(?)");
  for (let index = 1; index < 36; index++) add.run(`historical-${index}.sql`);
  add.run("0030_media_library_organization.sql");
  add.run("0031_media_archive_malformed_json_guard.sql");
  return db;
}

test("0032 release statements are hash-pinned, exact and additive", () => {
  assert.equal(createHash("sha256").update(migration).digest("hex"), CANDIDATE_SHA256);
  assert.equal(statements.length, 9);
  assert.deepEqual(EXPECTED_OBJECTS, [
    "forms", "idx_forms_site_status_updated", "form_revisions", "form_submissions",
    "idx_form_submissions_inbox", "idx_form_submissions_expiry", "form_submission_rate_limits",
    "idx_form_rate_limit_expiry"
  ]);
  assert.ok(statements.slice(0, 8).every(statement => /^CREATE (?:TABLE|INDEX) IF NOT EXISTS/.test(statement)));
  assert.match(statements[8], /INSERT INTO d1_migrations/);
  assert.match(statements[8], /COUNT\(\*\) FROM d1_migrations\)=37/);
  assert.doesNotMatch(statements.join("\n"), /\b(?:DROP\s+TABLE|DELETE\s+FROM|ALTER\s+TABLE)\b/i);
});

test("0032 can resume after interruption, activates only a complete exact schema and is idempotent", () => {
  const db = fixture();
  try {
    const beforeSites = db.prepare("SELECT * FROM sites").all().map(row => ({ ...row }));
    for (const statement of statements.slice(0, 4)) db.exec(statement);
    for (const statement of statements) db.exec(statement);
    assert.deepEqual(db.prepare("SELECT * FROM sites").all().map(row => ({ ...row })), beforeSites);
    const placeholders = EXPECTED_OBJECTS.map(() => "?").join(",");
    const objects = db.prepare(`SELECT name FROM sqlite_master WHERE name IN (${placeholders}) ORDER BY name`)
      .all(...EXPECTED_OBJECTS).map(row => row.name);
    assert.deepEqual(objects, [...EXPECTED_OBJECTS].sort());
    assert.equal(db.prepare("SELECT COUNT(*) AS n FROM d1_migrations WHERE name=?").get(MIGRATION_NAME).n, 1);
    assert.deepEqual(db.prepare("PRAGMA foreign_key_check").all(), []);
    assert.equal(db.prepare("PRAGMA quick_check").get().quick_check, "ok");
    assert.equal(db.prepare("SELECT COUNT(*) AS n FROM forms").get().n, 0);
  } finally { db.close(); }
});

test("0032 ledger activation is blocked without the contiguous 0031 baseline", () => {
  const db = fixture();
  try {
    db.prepare("DELETE FROM d1_migrations WHERE name='0031_media_archive_malformed_json_guard.sql'").run();
    for (const statement of statements) db.exec(statement);
    assert.equal(db.prepare("SELECT COUNT(*) AS n FROM d1_migrations WHERE name=?").get(MIGRATION_NAME).n, 0);
  } finally { db.close(); }
});
