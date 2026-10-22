import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";

test("retention state migration is additive, inert and keeps one request per site asset", () => {
 const db=new DatabaseSync(":memory:");
 try {
  db.exec("PRAGMA foreign_keys=ON; CREATE TABLE media(id TEXT PRIMARY KEY); INSERT INTO media VALUES('asset-a');");
  db.exec(readFileSync(new URL("../scripts/pending/media_retention_requests.sql",import.meta.url),"utf8"));
  const insert=db.prepare("INSERT INTO media_retention_requests(id,site_id,asset_id,object_key,not_before) VALUES(?,?,?,?,?)");
  insert.run("req-a","site-default","asset-a","sites/site-default/media/a","2026-11-30 00:00:00");
  const row=db.prepare("SELECT state,attempt_count,not_before FROM media_retention_requests").get();
  assert.deepEqual({...row},{state:"requested",attempt_count:0,not_before:"2026-11-30 00:00:00"});
  assert.throws(()=>insert.run("req-b","site-default","asset-a","sites/site-default/media/a","2026-12-01 00:00:00"),/UNIQUE/);
  assert.throws(()=>insert.run("req-c","site-default","absent","sites/site-default/media/missing","2026-12-01 00:00:00"),/FOREIGN KEY/);
  assert.throws(()=>db.prepare("UPDATE media_retention_requests SET state='unknown'").run(),/CHECK/);
  assert.throws(()=>db.prepare("UPDATE media_retention_requests SET attempt_count=-1").run(),/CHECK/);
  db.exec(readFileSync(new URL("../scripts/pending/media_retention_requests.sql",import.meta.url),"utf8"));
  assert.equal(db.prepare("SELECT COUNT(*) n FROM media_retention_requests").get().n,1);
 } finally { db.close(); }
});
