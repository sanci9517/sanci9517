import assert from 'node:assert/strict';
import test from 'node:test';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';

const read = name => readFileSync(new URL('../scripts/pending/'+name, import.meta.url),'utf8');
const newSql=read('0029_media_archive_casefold_additive_guards.sql');
const statements=[...newSql.matchAll(/^CREATE TRIGGER[\s\S]*?END;/gm)].map(match=>match[0]);
const asset='a1b2c3d4-0000-4000-8000-123456789abc',upper=asset.toUpperCase();

function fixture(){
 const db=new DatabaseSync(':memory:');
 db.exec('PRAGMA foreign_keys=ON');
 db.exec("CREATE TABLE d1_migrations(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT UNIQUE,applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL); INSERT INTO d1_migrations(name) VALUES('0028_media_archive.sql');");
 db.exec('CREATE TABLE media(id TEXT PRIMARY KEY,site_id TEXT NOT NULL,created_at TEXT NOT NULL); CREATE TABLE pages(id TEXT PRIMARY KEY,site_id TEXT NOT NULL,content_json TEXT,published_content_json TEXT); CREATE TABLE editor_revisions(id TEXT PRIMARY KEY,page_id TEXT NOT NULL,document_json TEXT);');
 db.exec(read('0028_media_archive.sql'));
 db.prepare('INSERT INTO media(id,site_id,created_at,archived_at) VALUES(?,?,?,?)').run(asset,'site-a','2026-11-13','2026-11-13');
 return db;
}
function triggers(db){return db.prepare("SELECT name,sql FROM sqlite_master WHERE type='trigger' AND name LIKE 'media_archive_%' ORDER BY name").all();}
const insert='INSERT INTO pages(id,site_id,content_json,published_content_json) VALUES(?,?,?,?)';

// Old 0028 triggers always remain; production rollout never exposes a gap by DROP TRIGGER.
test('additive casefold covers draft, public, update, revision and preserves site scope',()=>{
 assert.equal(statements.length,3,'one independently testable CREATE statement per guard');
 const db=fixture();try{
  const original=triggers(db);
  db.exec(newSql);
  const installed=triggers(db);
  assert.equal(installed.length,6);
  for(const old of original)assert.deepEqual(installed.find(row=>row.name===old.name),old);
  for(const guard of installed.filter(row=>row.name.includes('_casefold_guard')))assert.match(guard.sql,/instr\(lower\(/);
  const add=db.prepare(insert);
  assert.throws(()=>add.run('blocked-draft','site-a',JSON.stringify({assetId:upper}),null),/ARCHIVED_MEDIA_REFERENCE/);
  assert.throws(()=>add.run('blocked-public','site-a',null,JSON.stringify({posterAssetId:upper})),/ARCHIVED_MEDIA_REFERENCE/);
  add.run('safe','site-a','{}',null);
  assert.throws(()=>db.prepare('UPDATE pages SET published_content_json=? WHERE id=?').run(JSON.stringify({imageAssetId:upper}),'safe'),/ARCHIVED_MEDIA_REFERENCE/);
  assert.throws(()=>db.prepare('INSERT INTO editor_revisions(id,page_id,document_json) VALUES(?,?,?)').run('bad','safe',JSON.stringify({backgroundAssetId:upper})),/ARCHIVED_MEDIA_REFERENCE/);
  add.run('foreign','site-b',JSON.stringify({assetId:upper}),null);
  db.prepare('INSERT INTO editor_revisions(id,page_id,document_json) VALUES(?,?,?)').run('foreign','foreign',JSON.stringify({imageAssetId:upper}));
  assert.equal(db.prepare('SELECT COUNT(*) AS n FROM pages').get().n,2);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM d1_migrations WHERE name='0029_media_archive_casefold_additive_guards.sql'").get().n,0,'manual ledger stamp is a separate verified step');
 }finally{db.close();}
});

test('partial application never removes original guards or weakens protection',()=>{
 assert.equal(statements.length,3);
 for(const count of [1,2]){
  const db=fixture();try{
   const original=triggers(db);
   for(const statement of statements.slice(0,count))db.exec(statement);
   const installed=triggers(db);
   assert.equal(installed.length,3+count);
   for(const old of original)assert.deepEqual(installed.find(row=>row.name===old.name),old);
   assert.throws(()=>db.prepare(insert).run('blocked','site-a',JSON.stringify({assetId:upper}),null),/ARCHIVED_MEDIA_REFERENCE/);
   db.prepare(insert).run('safe','site-a','{}',null);
   if(count===2)assert.throws(()=>db.prepare('UPDATE pages SET content_json=? WHERE id=?').run(JSON.stringify({assetId:upper}),'safe'),/ARCHIVED_MEDIA_REFERENCE/);
  }finally{db.close();}
 }
});

test('SQLite atomic rollback returns the exact 0028 triggers on a late failure',()=>{
 const db=fixture();try{
  const before=triggers(db);
  db.exec('BEGIN IMMEDIATE');
  try{
   db.exec(newSql);
   assert.throws(()=>db.exec('INSERT INTO intentionally_missing_table VALUES(1)'),/no such table/);
  }finally{db.exec('ROLLBACK');}
  assert.deepEqual(triggers(db),before);
 }finally{db.close();}
});
