import assert from "node:assert/strict";
import {test} from "node:test";
import {DatabaseSync} from "node:sqlite";
import {readFileSync} from "node:fs";
import {retentionQueries} from "../src/core/media-retention-queries.js";
import "./media-reference-sql.test.js";
import "./media-archive-additive-unicode.test.js";
import "./d1-0029-release-batch.test.js";

test("retention SQL cannot schedule referenced assets and cancellation is tenant-scoped",()=>{
 const db=new DatabaseSync(":memory:");
 try {
  db.exec("PRAGMA foreign_keys=ON");
  db.exec("CREATE TABLE media(id TEXT PRIMARY KEY,site_id TEXT NOT NULL,object_key TEXT NOT NULL,archived_at TEXT);CREATE TABLE pages(id TEXT PRIMARY KEY,site_id TEXT,content_json TEXT,published_content_json TEXT);CREATE TABLE editor_revisions(id TEXT PRIMARY KEY,page_id TEXT,document_json TEXT);CREATE TABLE schedule_items(id TEXT PRIMARY KEY,site_id TEXT NOT NULL);CREATE TABLE site_settings(key TEXT PRIMARY KEY,value_json TEXT NOT NULL);");
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
  db.exec("CREATE TABLE media(id TEXT PRIMARY KEY,site_id TEXT NOT NULL,object_key TEXT NOT NULL,archived_at TEXT);CREATE TABLE pages(id TEXT PRIMARY KEY,site_id TEXT,content_json TEXT,published_content_json TEXT);CREATE TABLE editor_revisions(id TEXT PRIMARY KEY,page_id TEXT,document_json TEXT);CREATE TABLE schedule_items(id TEXT PRIMARY KEY,site_id TEXT NOT NULL);CREATE TABLE site_settings(key TEXT PRIMARY KEY,value_json TEXT NOT NULL);");
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
  db.exec("CREATE TABLE media(id TEXT PRIMARY KEY,site_id TEXT NOT NULL,object_key TEXT NOT NULL,archived_at TEXT);CREATE TABLE pages(id TEXT PRIMARY KEY,site_id TEXT,content_json TEXT,published_content_json TEXT);CREATE TABLE editor_revisions(id TEXT PRIMARY KEY,page_id TEXT,document_json TEXT);CREATE TABLE schedule_items(id TEXT PRIMARY KEY,site_id TEXT NOT NULL);CREATE TABLE site_settings(key TEXT PRIMARY KEY,value_json TEXT NOT NULL);");
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

test("retention cannot queue archived Schedule cover assets when their same-site sidecar still exists",()=>{
 const db=new DatabaseSync(":memory:");
 try{
  db.exec("CREATE TABLE media(id TEXT PRIMARY KEY,site_id TEXT NOT NULL,object_key TEXT NOT NULL,archived_at TEXT);CREATE TABLE pages(id TEXT PRIMARY KEY,site_id TEXT,content_json TEXT,published_content_json TEXT);CREATE TABLE editor_revisions(id TEXT PRIMARY KEY,page_id TEXT,document_json TEXT);CREATE TABLE schedule_items(id TEXT PRIMARY KEY,site_id TEXT NOT NULL);CREATE TABLE site_settings(key TEXT PRIMARY KEY,value_json TEXT NOT NULL);");
  db.exec(readFileSync(new URL("../scripts/pending/media_retention_requests.sql",import.meta.url),"utf8"));
  const asset="a1b2c3d4-0000-4000-8000-123456789abc";
  const event="1d084f6e-12f2-45f7-9154-007bdb0b1833";
  const key="schedule-artwork:site-a:"+event;
  db.prepare("INSERT INTO media VALUES(?,?,?,?)")
    .run(asset,"site-a","sites/site-a/media/legacy-cover","2026-11-14");
  db.prepare("INSERT INTO schedule_items VALUES (?,?)").run(event,"site-a");
  const sidecar=db.prepare("INSERT INTO site_settings(key,value_json) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value_json=excluded.value_json");
  const request=db.prepare(retentionQueries.request);
  const args=["request-schedule","2026-12-14",asset,"site-a"];
  const escaped=String.fromCharCode(92)+"u0061"+asset.slice(1);
  for(const json of [
    JSON.stringify({assetId:asset}),
    JSON.stringify({assetId:asset.toUpperCase()}),
    '{"assetId":"'+escaped+'"}',
    '{  "assetId" : "'+asset+'" }'
  ]){
    sidecar.run(key,json);
    assert.equal(request.run(...args).changes,0,"live schedule reference must block retention even on legacy archived media");
  }
  sidecar.run(key,'{"assetId":');
  assert.equal(request.run(...args).changes,1,"unrecognizable malformed JSON is not a valid reference");
  assert.equal(db.prepare(retentionQueries.cancel).run("request-schedule","site-a").changes,1);
  db.prepare("DELETE FROM media_retention_requests").run();
  db.prepare("DELETE FROM site_settings WHERE key=?").run(key);
  const foreign="3f7a0000-0000-4000-8000-000000000002";
  db.prepare("INSERT INTO schedule_items VALUES (?,?)").run(foreign,"site-b");
  sidecar.run("schedule-artwork:site-b:"+foreign,JSON.stringify({assetId:asset}));
  assert.equal(request.run(...args).changes,1,"a different tenant's schedule event cannot lock this site's retention");
 }finally{db.close();}
});
