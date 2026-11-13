import assert from "node:assert/strict";
import {test} from "node:test";
import {DatabaseSync} from "node:sqlite";
import {readFileSync} from "node:fs";
import {retentionQueries} from "../src/core/media-retention-queries.js";
import "./media-reference-sql.test.js";

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

test("retention request rejects mixed-case references in draft, published snapshots and revisions",()=>{
 const db=new DatabaseSync(":memory:");
 try {
  db.exec("PRAGMA foreign_keys=ON");
  db.exec("CREATE TABLE media(id TEXT PRIMARY KEY,site_id TEXT NOT NULL,object_key TEXT NOT NULL,archived_at TEXT);CREATE TABLE pages(id TEXT PRIMARY KEY,site_id TEXT,content_json TEXT,published_content_json TEXT);CREATE TABLE editor_revisions(id TEXT PRIMARY KEY,page_id TEXT,document_json TEXT);");
  db.exec(readFileSync(new URL("../scripts/pending/media_retention_requests.sql",import.meta.url),"utf8"));
  const id="a1b2c3d4-0000-4000-8000-123456789abc";
  const upper=id.toUpperCase();
  const request=db.prepare(retentionQueries.request);
  const args=["req-uppercase","2026-12-12",id,"site-a"];
  db.prepare("INSERT INTO media VALUES(?,?,?,?)").run(id,"site-a","sites/site-a/media/retention-case","2026-11-12");
  db.prepare("INSERT INTO pages VALUES(?,?,?,?)").run("page-a","site-a",JSON.stringify({imageAssetId:upper}),null);
  assert.equal(request.run(...args).changes,0,"uppercase draft UUID cannot bypass the last SQL reference guard");
  db.prepare("UPDATE pages SET content_json=NULL,published_content_json=? WHERE id='page-a'")
    .run(JSON.stringify({posterAssetId:upper}));
  assert.equal(request.run(...args).changes,0,"uppercase published poster ID cannot be scheduled for retention");
  db.prepare("UPDATE pages SET published_content_json=NULL WHERE id='page-a'").run();
  db.prepare("INSERT INTO editor_revisions VALUES(?,?,?)")
    .run("revision-a","page-a",JSON.stringify({backgroundAssetId:upper}));
  assert.equal(request.run(...args).changes,0,"uppercase historical revision UUID must also block retention");
  db.prepare("DELETE FROM editor_revisions").run();
  db.prepare("INSERT INTO pages VALUES(?,?,?,?)").run("page-b","site-b",JSON.stringify({imageAssetId:upper}),null);
  assert.equal(request.run(...args).changes,1,"another site's identical uppercase UUID must not block this site after clearing its own references");
  assert.equal(db.prepare("SELECT COUNT(*) AS total FROM media_retention_requests").get().total,1);
 } finally {db.close();}
});


test("retention request rejects Unicode-escaped UUID references and respects site ownership",()=>{
 const db=new DatabaseSync(":memory:");
 try{
  db.exec("CREATE TABLE media(id TEXT PRIMARY KEY,site_id TEXT NOT NULL,object_key TEXT NOT NULL,archived_at TEXT);CREATE TABLE pages(id TEXT PRIMARY KEY,site_id TEXT,content_json TEXT,published_content_json TEXT);CREATE TABLE editor_revisions(id TEXT PRIMARY KEY,page_id TEXT,document_json TEXT);");
  db.exec(readFileSync(new URL("../scripts/pending/media_retention_requests.sql",import.meta.url),"utf8"));
  const id="a1b2c3d4-0000-4000-8000-123456789abc";
  const escaped=String.fromCharCode(92)+"u0061"+id.slice(1);
  const raw=key=>"{"+JSON.stringify(key)+":\""+escaped+"\"}";
  assert.equal(JSON.parse(raw("assetId")).assetId,id);
  db.prepare("INSERT INTO media VALUES(?,?,?,?)").run(id,"site-a","sites/site-a/media/unicode","2026-11-13");
  const request=db.prepare(retentionQueries.request);
  const args=["req-unicode","2026-12-13",id,"site-a"];
  db.prepare("INSERT INTO pages VALUES(?,?,?,?)").run("p","site-a",raw("assetId"),null);
  assert.equal(request.run(...args).changes,0,"encoded draft ID blocks retention");
  db.prepare("UPDATE pages SET content_json='{}',published_content_json=? WHERE id='p'").run(raw("posterAssetId"));
  assert.equal(request.run(...args).changes,0,"encoded published poster blocks retention");
  db.exec("UPDATE pages SET published_content_json=NULL WHERE id='p'");
  db.prepare("INSERT INTO editor_revisions VALUES(?,?,?)").run("rev","p",raw("backgroundAssetId"));
  assert.equal(request.run(...args).changes,0,"encoded revision ID blocks retention");
  db.exec("DELETE FROM editor_revisions");
  db.prepare("UPDATE pages SET content_json=? WHERE id='p'").run("{\"label\":\"\\u0062\"}");
  db.prepare("INSERT INTO pages VALUES(?,?,?,?)").run("foreign","site-b",raw("assetId"),null);
  assert.equal(request.run(...args).changes,1,"unrelated escape and foreign site must not block own retention");
 }finally{db.close();}
});
