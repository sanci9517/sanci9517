import assert from 'node:assert/strict';
import test from 'node:test';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';

const read = name => readFileSync(new URL('../scripts/pending/'+name,import.meta.url),'utf8');

function fixture(){
 const db=new DatabaseSync(':memory:');
 db.exec("PRAGMA foreign_keys=ON");
 db.exec("CREATE TABLE d1_migrations(id INTEGER PRIMARY KEY,name TEXT NOT NULL);INSERT INTO d1_migrations(name) VALUES('0028_media_archive.sql');");
 db.exec("CREATE TABLE media(id TEXT PRIMARY KEY,site_id TEXT NOT NULL,created_at TEXT NOT NULL);CREATE TABLE pages(id TEXT PRIMARY KEY,site_id TEXT NOT NULL,content_json TEXT,published_content_json TEXT);CREATE TABLE editor_revisions(id TEXT PRIMARY KEY,page_id TEXT NOT NULL,document_json TEXT);");
 db.exec(read('0028_media_archive.sql'));
 return db;
}

test('manual-only casefold guard upgrade requires verified 0028 lineage and keeps the old migration immutable',()=>{
 const db=fixture();
 try{
  db.exec("DELETE FROM d1_migrations WHERE name='0028_media_archive.sql'");
  assert.throws(()=>db.exec(read('0029_media_archive_casefold_guards.sql')),/CHECK constraint failed/);
  const names=db.prepare("SELECT name FROM sqlite_master WHERE type='trigger' AND name LIKE 'media_archive_%' ORDER BY name").all().map(x=>x.name);
  assert.deepEqual(names,['media_archive_pages_insert_guard','media_archive_pages_update_guard','media_archive_revisions_insert_guard']);
  db.exec("DROP TABLE IF EXISTS __media_0029_casefold_guard");
 }finally{db.close();}
});

test('casefold archive triggers reject uppercase draft, publication, revision and update references without cross-site leaks',()=>{
 const db=fixture();
 try{
  db.exec(read('0029_media_archive_casefold_guards.sql'));
  const checks=db.prepare("SELECT name,sql FROM sqlite_master WHERE type='trigger' AND name LIKE 'media_archive_%'").all();
  assert.equal(checks.length,3);
  for(const trigger of checks)assert.match(trigger.sql,/instr\(lower\(/);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM d1_migrations WHERE name='0029_media_archive_casefold_guards.sql'").get().n,1,'0029 ledger marker commits with new triggers');
  const id='a1b2c3d4-0000-4000-8000-123456789abc';
  const upper=id.toUpperCase();
  db.prepare("INSERT INTO media(id,site_id,created_at,archived_at) VALUES(?,?,?,?)")
    .run(id,'site-a','2026-10-21','2026-11-12');
  const add=db.prepare("INSERT INTO pages(id,site_id,content_json,published_content_json) VALUES(?,?,?,?)");
  assert.throws(()=>add.run('upper-draft','site-a',JSON.stringify({assetId:upper}),null),/ARCHIVED_MEDIA_REFERENCE/);
  assert.throws(()=>add.run('upper-public','site-a',null,JSON.stringify({posterAssetId:upper})),/ARCHIVED_MEDIA_REFERENCE/);
  add.run('safe','site-a','{}',null);
  const update=db.prepare("UPDATE pages SET published_content_json=? WHERE id='safe'");
  assert.throws(()=>update.run(JSON.stringify({backgroundAssetId:upper})),/ARCHIVED_MEDIA_REFERENCE/);
  const revision=db.prepare("INSERT INTO editor_revisions(id,page_id,document_json) VALUES(?,?,?)");
  assert.throws(()=>revision.run('invalid','safe',JSON.stringify({imageAssetId:upper})),/ARCHIVED_MEDIA_REFERENCE/);
  add.run('other-site','site-b',JSON.stringify({assetId:upper}),null);
  revision.run('other-site-revision','other-site',JSON.stringify({assetId:upper}));
  assert.equal(db.prepare('SELECT COUNT(*) AS n FROM pages').get().n,2);
  assert.equal(db.prepare('SELECT COUNT(*) AS n FROM editor_revisions').get().n,1);
 }finally{db.close();}
});

test('offline atomic rollback restores exact original triggers if the migration batch later fails',()=>{
 const db=fixture();
 try{
  const stmt=db.prepare("SELECT name,sql FROM sqlite_master WHERE type='trigger' AND name LIKE 'media_archive_%' ORDER BY name");
  const original=stmt.all();
  db.exec('BEGIN IMMEDIATE');
  try{
   db.exec(read('0029_media_archive_casefold_guards.sql'));
   assert.throws(()=>db.exec('INSERT INTO a_missing_table(value) VALUES(1)'),/no such table/);
  }finally{db.exec('ROLLBACK');}
  assert.deepEqual(stmt.all(),original,'rollback must restore the original D1 0028 guards without partial replacement');
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM d1_migrations WHERE name='0029_media_archive_casefold_guards.sql'").get().n,0,'rollback restores the ledger marker too');
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM sqlite_master WHERE type='table' AND name='__media_0029_casefold_guard'").get().n,0);
 }finally{db.close();}
});


test('replaying 0029 fails closed and does not overwrite upgraded trigger definitions',()=>{
 const db=fixture();
 try{
  db.exec(read('0029_media_archive_casefold_guards.sql'));
  const query="SELECT name,sql FROM sqlite_master WHERE type='trigger' AND name LIKE 'media_archive_%' ORDER BY name";
  const before=db.prepare(query).all();
  db.exec('BEGIN IMMEDIATE');
  try{assert.throws(()=>db.exec(read('0029_media_archive_casefold_guards.sql')),/CHECK constraint failed/);}
  finally{db.exec('ROLLBACK');}
  assert.deepEqual(db.prepare(query).all(),before);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM d1_migrations WHERE name='0029_media_archive_casefold_guards.sql'").get().n,1);
 }finally{db.close();}
});
