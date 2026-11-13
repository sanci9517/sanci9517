import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import {DatabaseSync} from 'node:sqlite';
import {
 build0029ReleaseSql,FIXTURE_SHA256,EXPECTED_NEW_TRIGGERS,MIGRATION_NAME
} from './review/prepare-0029-release.mjs';

const read=path=>readFileSync(new URL(path,import.meta.url),'utf8');
const original0028=read('../scripts/pending/0028_media_archive.sql');
const fixture0029=read('./fixtures/0029_media_archive_unicode_additive.sql');
const asset='a1b2c3d4-0000-4000-8000-123456789abc';
const escaped='{"assetId":"'+String.fromCharCode(92)+'u0061'+asset.slice(1)+'"}';
const releaseSql=build0029ReleaseSql();

function database(){
 const db=new DatabaseSync(':memory:');
 db.exec('PRAGMA foreign_keys=ON');
 db.exec([
  'CREATE TABLE sites(id TEXT PRIMARY KEY);',
  "INSERT INTO sites(id) VALUES('site-a'),('site-b');",
  'CREATE TABLE media(id TEXT PRIMARY KEY,site_id TEXT NOT NULL REFERENCES sites(id),created_at TEXT NOT NULL);',
  'CREATE TABLE pages(id TEXT PRIMARY KEY,site_id TEXT NOT NULL REFERENCES sites(id),content_json TEXT,published_content_json TEXT);',
  'CREATE TABLE editor_revisions(id TEXT PRIMARY KEY,page_id TEXT REFERENCES pages(id),document_json TEXT);',
  'CREATE TABLE d1_migrations(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL UNIQUE);'
 ].join('\n'));
 db.exec(original0028);
 const ledger=db.prepare('INSERT INTO d1_migrations(name) VALUES(?)');
 for(let i=0;i<33;i++)ledger.run('fixture_earlier_'+String(i).padStart(2,'0'));
 ledger.run('0028_media_archive.sql');
 db.prepare('INSERT INTO media(id,site_id,created_at,archived_at) VALUES(?,?,?,?)')
  .run(asset,'site-a','2026-11-13','2026-11-13');
 return db;
}
function atomic(db,sql){
 db.exec('BEGIN IMMEDIATE');
 try{db.exec(sql);db.exec('COMMIT')}
 catch(error){if(db.isTransaction)db.exec('ROLLBACK');throw error}
}
const archiveGuards=db=>db.prepare(
 "SELECT name,sql FROM sqlite_master WHERE type='trigger' AND name LIKE 'media_archive_%' ORDER BY name"
).all();
const marker=db=>db.prepare("SELECT COUNT(*) AS n FROM d1_migrations WHERE name LIKE '0029_%'").get().n;
const allMigrations=db=>db.prepare("SELECT COUNT(*) AS n FROM d1_migrations").get().n;
const countGuard=db=>db.prepare(
 "SELECT COUNT(*) AS n FROM sqlite_master WHERE name='__d06_0029_release_guard'"
).get().n;

test('D-06 review-only SQL binds to one exact approved source and cannot auto-deploy',()=>{
 assert.equal(createHash('sha256').update(fixture0029).digest('hex'),FIXTURE_SHA256);
 assert.deepEqual([...releaseSql.matchAll(/^CREATE TRIGGER\s+(\w+)/gm)].map(x=>x[1]),
  EXPECTED_NEW_TRIGGERS);
 assert.match(releaseSql,/__d06_0029_release_guard/);
 assert.match(releaseSql,/pragma_foreign_key_check/);
 assert.doesNotMatch(releaseSql,/DROP TRIGGER|DELETE FROM\s+media/i);
 assert.match(releaseSql,new RegExp('INSERT INTO d1_migrations\\(name\\)'));
 assert.equal(MIGRATION_NAME,'0029_media_archive_unicode_additive.sql');
});

test('D-06 successful one-shot commit appends four guards and one ledger marker',()=>{
 const db=database();
 try{
  const old=archiveGuards(db);assert.equal(old.length,3);
  atomic(db,releaseSql);
  assert.equal(marker(db),1);assert.equal(allMigrations(db),35);
  assert.equal(countGuard(db),0);
  const now=archiveGuards(db);assert.equal(now.length,7);
  for(const trigger of old)assert.deepEqual(now.find(x=>x.name===trigger.name),trigger);
  assert.throws(()=>db.prepare(
    'INSERT INTO pages(id,site_id,content_json) VALUES(?,?,?)'
   ).run('bad','site-a',escaped),/ARCHIVED_MEDIA_REFERENCE/);
  db.prepare('INSERT INTO pages(id,site_id,content_json) VALUES(?,?,?)')
   .run('other-tenant','site-b',escaped);
  assert.throws(()=>db.prepare("UPDATE pages SET site_id='site-a' WHERE id='other-tenant'")
   .run(),/ARCHIVED_MEDIA_REFERENCE/);
  assert.equal(db.prepare('PRAGMA quick_check').get().quick_check,'ok');
  assert.equal(db.prepare('PRAGMA foreign_key_check').all().length,0);
 }finally{db.close()}
});

test('D-06 repeated release cannot add a second ledger row or leave a gate table',()=>{
 const db=database();
 try{
  atomic(db,releaseSql);
  assert.throws(()=>atomic(db,releaseSql),/CHECK constraint failed/);
  assert.equal(marker(db),1);assert.equal(allMigrations(db),35);
  assert.equal(archiveGuards(db).length,7);assert.equal(countGuard(db),0);
 }finally{db.close()}
});

test('D-06 unexpected ledger state blocks the complete schema batch',()=>{
 const db=database();
 try{
  db.prepare('INSERT INTO d1_migrations(name) VALUES(?)').run('conflicting_later_migration.sql');
  const before=archiveGuards(db);
  assert.throws(()=>atomic(db,releaseSql),/CHECK constraint failed/);
  assert.deepEqual(archiveGuards(db),before);
  assert.equal(marker(db),0);assert.equal(countGuard(db),0);
 }finally{db.close()}
});

test('D-06 partially installed triggers block one-shot migration without dropping originals',()=>{
 const db=database();
 try{
  db.exec(fixture0029.match(/^CREATE TRIGGER[\s\S]*?END;/m)[0]);
  const before=archiveGuards(db);assert.equal(before.length,4);
  assert.throws(()=>atomic(db,releaseSql),/CHECK constraint failed/);
  assert.deepEqual(archiveGuards(db),before);
  assert.equal(marker(db),0);assert.equal(countGuard(db),0);
 }finally{db.close()}
});

test('D-06 late SQL failure rolls back new triggers, ledger and guard atomically',()=>{
 const db=database();
 try{
  const before=archiveGuards(db);
  const lateFailure=releaseSql.replace(
   'DROP TABLE __d06_0029_release_guard;',
   'INSERT INTO deliberately_missing_d06_table VALUES(1);\nDROP TABLE __d06_0029_release_guard;'
  );
  assert.notEqual(lateFailure,releaseSql);
  assert.throws(()=>atomic(db,lateFailure),/no such table/);
  assert.deepEqual(archiveGuards(db),before);
  assert.equal(marker(db),0);assert.equal(allMigrations(db),34);assert.equal(countGuard(db),0);
  assert.equal(db.prepare('PRAGMA quick_check').get().quick_check,'ok');
  assert.equal(db.prepare('PRAGMA foreign_key_check').all().length,0);
 }finally{db.close()}
});
