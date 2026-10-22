import assert from "node:assert/strict";
import {test} from "node:test";
import {DatabaseSync} from "node:sqlite";
import {readFileSync} from "node:fs";
import {retentionQueries} from "../src/core/media-retention-queries.js";

test("retention SQL cannot schedule referenced assets and cancellation is tenant-scoped",()=>{
 const db=new DatabaseSync(":memory:");
 try {
  db.exec("PRAGMA foreign_keys=ON");
  db.exec("CREATE TABLE media(id TEXT PRIMARY KEY,site_id TEXT NOT NULL,object_key TEXT NOT NULL,archived_at TEXT);CREATE TABLE pages(id TEXT PRIMARY KEY,site_id TEXT,content_json TEXT,published_content_json TEXT);CREATE TABLE editor_revisions(id TEXT PRIMARY KEY,page_id TEXT,document_json TEXT);");
  db.exec(readFileSync(new URL("../scripts/pending/media_retention_requests.sql",import.meta.url),"utf8"));
  db.prepare("INSERT INTO media VALUES(?,?,?,?)").run("asset-a","site-a","sites/site-a/media/a","2026-10-22");
  const request=db.prepare(retentionQueries.request);
  const args=["req-a","2026-11-22","asset-a","site-a"];
  db.prepare("INSERT INTO pages VALUES(?,?,?,?)").run("p","site-a","asset-a",null);
  assert.equal(request.run(...args).changes,0);
  db.exec("DELETE FROM pages");
  db.prepare("INSERT INTO pages VALUES(?,?,?,?)").run("p","site-a",null,null);
  db.prepare("INSERT INTO editor_revisions VALUES(?,?,?)").run("r","p","asset-a");
  assert.equal(request.run(...args).changes,0);
  db.exec("DELETE FROM editor_revisions");
  assert.equal(request.run(...args).changes,1);
  assert.equal(request.run("req-b","2026-11-22","asset-a","site-b").changes,0);
  assert.equal(db.prepare(retentionQueries.cancel).run("req-a","site-b").changes,0);
  assert.equal(db.prepare(retentionQueries.cancel).run("req-a","site-a").changes,1);
  assert.equal(db.prepare(retentionQueries.cancel).run("req-a","site-a").changes,0);
  assert.equal(db.prepare(retentionQueries.get).get("req-a","site-a").state,"cancelled");
  assert.equal(db.prepare(retentionQueries.get).get("req-a","site-b"),undefined);
 } finally {db.close();}
});
