import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";
import { DatabaseSync } from "node:sqlite";

const migration = readFileSync(new URL("../scripts/pending/0032_forms_service.sql", import.meta.url), "utf8");
const manualManifest = JSON.parse(readFileSync(new URL("../scripts/d1/manual-migrations.json", import.meta.url), "utf8"));
const candidateManifest = JSON.parse(readFileSync(new URL("../scripts/d1/review-only-candidates.json", import.meta.url), "utf8"));

function database() {
  const db = new DatabaseSync(":memory:");
  db.exec("PRAGMA foreign_keys=ON");
  db.exec(`CREATE TABLE sites(id TEXT PRIMARY KEY,name TEXT NOT NULL);
    CREATE TABLE users(id TEXT PRIMARY KEY,email TEXT NOT NULL);
    CREATE TABLE pages(id TEXT PRIMARY KEY,site_id TEXT NOT NULL);
    CREATE TABLE d1_migrations(id INTEGER PRIMARY KEY,name TEXT NOT NULL UNIQUE);
    INSERT INTO sites VALUES('site-a','A'),('site-b','B');
    INSERT INTO users VALUES('owner-a','a@example.test');
    INSERT INTO pages VALUES('page-a','site-a');
    INSERT INTO d1_migrations VALUES(36,'0030_media_library_organization.sql');`);
  return db;
}

test("0032 is hash-pinned in the applied manual registry and absent from review-only candidates", () => {
  const entry = manualManifest.find(candidate => candidate.name === "0032_forms_service.sql");
  assert.ok(entry);
  assert.equal(entry.path, "scripts/pending/0032_forms_service.sql");
  assert.deepEqual(candidateManifest, []);
  assert.equal(createHash("sha256").update(migration).digest("hex"), entry.sha256);
});

test("0032 is additive and preserves existing rows while creating versioned, tenant-scoped Forms tables", () => {
  const db = database();
  try {
    const before = db.prepare("SELECT * FROM sites ORDER BY id").all().map(row => ({ ...row }));
    db.exec("BEGIN;" + migration + ";COMMIT;");
    assert.deepEqual(db.prepare("SELECT * FROM sites ORDER BY id").all().map(row => ({ ...row })), before);
    assert.deepEqual(db.prepare("SELECT id,site_id,name,status,current_version,retention_days FROM forms").all(), []);
    for (const name of ["forms", "form_revisions", "form_submissions", "form_submission_rate_limits"]) {
      assert.ok(db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?").get(name), name);
    }
    db.prepare("INSERT INTO forms(id,site_id,name,created_by,updated_by) VALUES(?,?,?,?,?)")
      .run("form-a", "site-a", "Kapcsolat", "owner-a", "owner-a");
    db.prepare("INSERT INTO form_revisions(site_id,form_id,version,definition_json,created_by) VALUES(?,?,?,?,?)")
      .run("site-a", "form-a", 1, JSON.stringify({ schemaVersion: 1 }), "owner-a");
    db.prepare("UPDATE forms SET published_version=1 WHERE id='form-a' AND site_id='site-a'").run();
    assert.equal(db.prepare("SELECT published_version FROM forms WHERE id='form-a'").get().published_version, 1);
    assert.throws(() => db.prepare("UPDATE forms SET published_version=999 WHERE id='form-a'").run(), /FOREIGN KEY/);
    db.prepare(`INSERT INTO form_submissions
      (id,site_id,form_id,form_version,page_id,values_json,consent_text,consent_version,consent_accepted_at,expires_at)
      VALUES(?,?,?,?,?,?,?,?,?,?)`)
      .run("submission-a", "site-a", "form-a", 1, "page-a", JSON.stringify({ message: "Szia" }), "Adatkezelési hozzájárulás", "policy-v1", "2026-11-25T12:00:00.000Z", "2026-12-25T12:00:00.000Z");
    assert.equal(db.prepare("SELECT status FROM form_submissions WHERE id='submission-a'").get().status, "new");
    assert.throws(() => db.prepare(`INSERT INTO form_submissions
      (id,site_id,form_id,form_version,page_id,values_json,consent_text,consent_version,consent_accepted_at,expires_at)
      VALUES(?,?,?,?,?,?,?,?,?,?)`)
      .run("submission-cross-site", "site-b", "form-a", 1, "page-a", "{}", "Consent", "v1", "2026-11-25", "2026-12-25"), /FOREIGN KEY/);
    assert.deepEqual(db.prepare("PRAGMA foreign_key_check").all(), []);
    assert.equal(db.prepare("PRAGMA quick_check").get().quick_check, "ok");
  } finally {
    db.close();
  }
});
