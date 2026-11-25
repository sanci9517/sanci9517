import assert from "node:assert/strict";
import test from "node:test";
import { DatabaseSync } from "node:sqlite";
import { purgeExpiredFormData } from "../src/core/forms-retention.ts";

function makeDb() {
  const db = new DatabaseSync(":memory:");
  db.exec(`CREATE TABLE form_submissions(id TEXT PRIMARY KEY, expires_at TEXT NOT NULL);
    CREATE TABLE form_submission_rate_limits(
      site_id TEXT NOT NULL,form_id TEXT NOT NULL,client_hash TEXT NOT NULL,window_start INTEGER NOT NULL,expires_at INTEGER NOT NULL
    );`);
  const env = { DB: { prepare(sql) {
    let parameters = [];
    return {
      bind(...values) { parameters = values; return this; },
      async run() { const result = db.prepare(sql).run(...parameters); return { meta: { changes: Number(result.changes) } }; }
    };
  } } };
  return { db, env };
}

test("retention purges old submissions and rate buckets in bounded resumable batches", async t => {
  const { db, env } = makeDb();
  t.after(() => db.close());
  const insertSubmission = db.prepare("INSERT INTO form_submissions(id,expires_at) VALUES(?,?)");
  const insertRate = db.prepare("INSERT INTO form_submission_rate_limits(site_id,form_id,client_hash,window_start,expires_at) VALUES(?,?,?,?,?)");
  for (let index = 0; index < 1_005; index++) {
    insertSubmission.run(`expired-${index}`, "2000-01-01 00:00:00");
    insertRate.run("site-a", "form-a", `hash-${index}`, index, 100);
  }
  insertSubmission.run("kept", "2999-01-01 00:00:00");
  insertRate.run("site-a", "form-a", "future-hash", 5_000, 9_999_999_999);

  const first = await purgeExpiredFormData(env, 1_000);
  assert.deepEqual(first, { submissionsDeleted: 1_000, rateLimitsDeleted: 1_000, batchSize: 100, maxBatches: 10 });
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM form_submissions").get().n, 6);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM form_submission_rate_limits").get().n, 6);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM form_submissions WHERE id='kept'").get().n, 1);

  const second = await purgeExpiredFormData(env, 1_000);
  assert.deepEqual(second, { submissionsDeleted: 5, rateLimitsDeleted: 5, batchSize: 100, maxBatches: 10 });
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM form_submissions WHERE id!='kept'").get().n, 0);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM form_submission_rate_limits WHERE expires_at>1000").get().n, 1);
});
