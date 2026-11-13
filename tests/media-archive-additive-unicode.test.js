import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import {DatabaseSync} from 'node:sqlite';

const read=name=>readFileSync(new URL(name,import.meta.url),'utf8');
const originalSql=read('../scripts/pending/0028_media_archive.sql');
const candidateSql=read('./fixtures/0029_media_archive_unicode_additive.sql');
const statements=[...candidateSql.matchAll(/^CREATE TRIGGER[\s\S]*?END;/gm)].map(match=>match[0]);
const id='a1b2c3d4-0000-4000-8000-123456789abc';
const unicodeId='\\u0061'+id.slice(1);
const encoded=field=>'{'+JSON.stringify(field)+':"'+unicodeId+'"}';
const plain=field=>JSON.stringify({[field]:id});
const uppercase=field=>JSON.stringify({[field]:id.toUpperCase()});
const insert='INSERT INTO pages(id,site_id,content_json,published_content_json) VALUES(?,?,?,?)';

function fixture(){
 const db=new DatabaseSync(':memory:');
 db.exec('PRAGMA foreign_keys=ON');
 db.exec('CREATE TABLE media(id TEXT PRIMARY KEY,site_id TEXT NOT NULL,created_at TEXT NOT NULL);CREATE TABLE pages(id TEXT PRIMARY KEY,site_id TEXT NOT NULL,content_json TEXT,published_content_json TEXT);CREATE TABLE editor_revisions(id TEXT PRIMARY KEY,page_id TEXT NOT NULL,document_json TEXT);CREATE TABLE d1_migrations(name TEXT UNIQUE);');
 db.exec(originalSql);
 db.prepare('INSERT INTO media(id,site_id,created_at,archived_at) VALUES(?,?,?,?)').run(id,'site-a','2026-11-13','2026-11-13');
 db.prepare('INSERT INTO d1_migrations(name) VALUES(?)').run('0028_media_archive.sql');
 return db;
}
function triggers(db){return db.prepare("SELECT name,sql FROM sqlite_master WHERE type='trigger' AND name LIKE 'media_archive_%' ORDER BY name").all();}
function assertArchived(fn){assert.throws(fn,/ARCHIVED_MEDIA_REFERENCE/);}

test('D-06 reproduces Unicode/archive bypass on original 0028 and keeps 0029 purely staged',()=>{
 assert.equal(JSON.parse(encoded('assetId')).assetId,id);
 assert.equal(statements.length,4,'three original write paths plus revision update gap');
 const db=fixture();try{
  // A valid, escaped identifier is invisible to the original raw instr predicate.
  assert.equal(db.prepare(insert).run('old-gap','site-a',encoded('assetId'),null).changes,1);
  assert.equal(db.prepare("SELECT COUNT(*) AS total FROM d1_migrations WHERE name LIKE '0029_%'").get().total,0);
 }finally{db.close();}
});

test('D-06 staged additive guards preserve all original 0028 definitions and block escaped/uppercase JSON',()=>{
 const db=fixture();try{
  const before=triggers(db);db.exec(candidateSql);
  const after=triggers(db);
  assert.equal(before.length,3);assert.equal(after.length,7);
  for(const old of before)assert.deepEqual(after.find(x=>x.name===old.name),old);
  assertArchived(()=>db.prepare(insert).run('draft','site-a',encoded('assetId'),null));
  assertArchived(()=>db.prepare(insert).run('published','site-a',null,encoded('posterAssetId')));
  assertArchived(()=>db.prepare(insert).run('upper','site-a',uppercase('imageAssetId'),null));
  assertArchived(()=>db.prepare(insert).run('plain','site-a',plain('assetId'),null));
  db.prepare(insert).run('safe','site-a','{}',null);
  assertArchived(()=>db.prepare('UPDATE pages SET content_json=? WHERE id=?').run(encoded('backgroundAssetId'),'safe'));
  assertArchived(()=>db.prepare('UPDATE pages SET published_content_json=? WHERE id=?').run(encoded('imageAssetId'),'safe'));
  assertArchived(()=>db.prepare('INSERT INTO editor_revisions(id,page_id,document_json) VALUES(?,?,?)').run('rev1','safe',encoded('assetId')));
  db.prepare('INSERT INTO editor_revisions(id,page_id,document_json) VALUES(?,?,?)').run('rev2','safe','{}');
  assertArchived(()=>db.prepare('UPDATE editor_revisions SET document_json=? WHERE id=?').run(encoded('assetId'),'rev2'));
  db.prepare(insert).run('foreign','site-b',encoded('assetId'),encoded('posterAssetId'));
  db.prepare('INSERT INTO editor_revisions(id,page_id,document_json) VALUES(?,?,?)').run('rev3','foreign',encoded('assetId'));
  db.prepare(insert).run('legacy','site-a','{not-json',null);
  db.prepare(insert).run('unrelated','site-a','{"title":"\\u0062"}',null);
  assert.equal(db.prepare("SELECT COUNT(*) AS total FROM d1_migrations WHERE name LIKE '0029_%'").get().total,0);
 }finally{db.close();}
});

test('D-06 moving site ownership cannot smuggle archived reference into tenant',()=>{
 const db=fixture();try{
  db.exec(candidateSql);
  db.prepare(insert).run('site-change','site-b',encoded('assetId'),null);
  assertArchived(()=>db.prepare("UPDATE pages SET site_id='site-a' WHERE id='site-change'").run());
  db.prepare(insert).run('safe-a','site-a','{}',null);
  db.prepare(insert).run('foreign-b','site-b',encoded('assetId'),null);
  db.prepare('INSERT INTO editor_revisions(id,page_id,document_json) VALUES(?,?,?)').run('rev-move','foreign-b',encoded('assetId'));
  assertArchived(()=>db.prepare("UPDATE editor_revisions SET page_id='safe-a' WHERE id='rev-move'").run());
 }finally{db.close();}
});

test('D-06 partial additive installation never deletes existing 0028 guards',()=>{
 for(const count of [1,2,3,4]){
  const db=fixture();try{
   const before=triggers(db);
   for(const statement of statements.slice(0,count))db.exec(statement);
   const after=triggers(db);assert.equal(after.length,3+count);
   for(const old of before)assert.deepEqual(after.find(x=>x.name===old.name),old);
   assertArchived(()=>db.prepare(insert).run('original','site-a',plain('assetId'),null));
   assertArchived(()=>db.prepare(insert).run('encoded','site-a',encoded('assetId'),null));
  }finally{db.close();}
 }
});

test('D-06 late failed SQL rolls back staged triggers and leaves 0028/ledger unchanged',()=>{
 const db=fixture();try{
  const original=triggers(db);
  db.exec('BEGIN IMMEDIATE');
  try{
   db.exec(candidateSql);
   assert.throws(()=>db.exec('INSERT INTO intentionally_missing_table VALUES(1)'),/no such table/);
  }finally{db.exec('ROLLBACK');}
  assert.deepEqual(triggers(db),original);
  assert.equal(db.prepare('SELECT COUNT(*) AS total FROM d1_migrations').get().total,1);
 }finally{db.close();}
});
