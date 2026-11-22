import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import {DatabaseSync} from 'node:sqlite';
import {build0031ReleaseSql,EXPECTED_NEW_TRIGGERS,FIXTURE_SHA256,MIGRATION_NAME} from './review/prepare-0031-release.mjs';

const read=path=>readFileSync(new URL(path,import.meta.url),'utf8');
const old0028=read('../scripts/pending/0028_media_archive.sql');
const old0029=read('./fixtures/0029_media_archive_unicode_additive.sql');
const candidate=read('./fixtures/0031_media_archive_malformed_json_guard.sql');
const id='a1b2c3d4-0000-4000-8000-123456789abc';
const malformed='{"assetId":"'+String.fromCharCode(92)+'u0061'+id.slice(1)+'"';
const releaseSql=build0031ReleaseSql();

function database(){
 const db=new DatabaseSync(':memory:');
 db.exec('PRAGMA foreign_keys=ON');
 db.exec('CREATE TABLE media(id TEXT PRIMARY KEY,site_id TEXT NOT NULL,created_at TEXT NOT NULL);CREATE TABLE pages(id TEXT PRIMARY KEY,site_id TEXT NOT NULL,content_json TEXT,published_content_json TEXT);CREATE TABLE editor_revisions(id TEXT PRIMARY KEY,page_id TEXT NOT NULL,document_json TEXT);CREATE TABLE d1_migrations(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT UNIQUE);');
 db.exec(old0028);db.exec(old0029);
 const marker=db.prepare('INSERT INTO d1_migrations(name) VALUES(?)');
 for(let i=0;i<33;i++)marker.run('fixture-earlier-'+String(i).padStart(2,'0'));
 marker.run('0028_media_archive.sql');marker.run('0029_media_archive_unicode_additive.sql');marker.run('0030_media_library_organization.sql');
 db.prepare('INSERT INTO media(id,site_id,created_at,archived_at) VALUES(?,?,?,?)').run(id,'site-a','2026-11-13','2026-11-13');
 return db;
}
function atomic(db,sql){db.exec('BEGIN IMMEDIATE');try{db.exec(sql);db.exec('COMMIT')}catch(error){if(db.isTransaction)db.exec('ROLLBACK');throw error}}
const triggerRows=db=>db.prepare("SELECT name,sql FROM sqlite_master WHERE type='trigger' AND name LIKE 'media_archive_%' ORDER BY name").all();
const pageInsert='INSERT INTO pages(id,site_id,content_json,published_content_json) VALUES(?,?,?,?)';
const revisionInsert='INSERT INTO editor_revisions(id,page_id,document_json) VALUES(?,?,?)';
const assertGuard=fn=>assert.throws(fn,/ARCHIVED_MEDIA_REFERENCE/);

test('D-06 0031 candidate and one-shot release stay exact, additive and manual-only',()=>{
 assert.equal(createHash('sha256').update(candidate).digest('hex'),FIXTURE_SHA256);
 assert.deepEqual([...releaseSql.matchAll(/^CREATE TRIGGER\s+(\w+)/gm)].map(match=>match[1]),EXPECTED_NEW_TRIGGERS);
 assert.match(releaseSql,/__d06_0031_release_guard/);
 assert.match(releaseSql,/0030_media_library_organization\.sql/);
 assert.doesNotMatch(releaseSql,/DROP\s+TRIGGER|DELETE\s+FROM\s+media|ALTER\s+TABLE/i);
 assert.equal(MIGRATION_NAME,'0031_media_archive_malformed_json_guard.sql');
});

test('D-06 0031 blocks malformed escaped references on every page/revision path, but preserves safe compatibility',()=>{
 const db=database();try{
  const before=triggerRows(db);assert.equal(before.length,7);
  atomic(db,releaseSql);
  const after=triggerRows(db);assert.equal(after.length,11);
  for(const old of before)assert.deepEqual(after.find(row=>row.name===old.name),old);
  assertGuard(()=>db.prepare(pageInsert).run('draft','site-a',malformed,null));
  assertGuard(()=>db.prepare(pageInsert).run('published','site-a',null,malformed));
  db.prepare(pageInsert).run('update-me','site-a','{}',null);
  assertGuard(()=>db.prepare("UPDATE pages SET content_json=? WHERE id='update-me'").run(malformed));
  assertGuard(()=>db.prepare("UPDATE pages SET published_content_json=? WHERE id='update-me'").run(malformed));
  assertGuard(()=>db.prepare(revisionInsert).run('revision-insert','update-me',malformed));
  db.prepare(revisionInsert).run('revision-update','update-me','{}');
  assertGuard(()=>db.prepare("UPDATE editor_revisions SET document_json=? WHERE id='revision-update'").run(malformed));
  db.prepare(pageInsert).run('history-transfer','site-b','{}',null);
  db.prepare(revisionInsert).run('history-malformed','history-transfer',malformed);
  assertGuard(()=>db.prepare("UPDATE pages SET site_id='site-a' WHERE id='history-transfer'").run());
  assert.equal(db.prepare("SELECT site_id FROM pages WHERE id='history-transfer'").get().site_id,'site-b');
  db.prepare(pageInsert).run('other-tenant','site-b',malformed,null);
  db.prepare(revisionInsert).run('other-revision','other-tenant',malformed);
  db.prepare(pageInsert).run('plain-malformed','site-a','{not-json',null);
  assert.equal(db.prepare("SELECT COUNT(*) n FROM d1_migrations WHERE name LIKE '0031_%'").get().n,1);
  assert.equal(db.prepare('SELECT COUNT(*) n FROM d1_migrations').get().n,37);
  assert.equal(db.prepare("SELECT COUNT(*) n FROM sqlite_master WHERE name='__d06_0031_release_guard'").get().n,0);
  assert.equal(db.prepare('PRAGMA foreign_key_check').all().length,0);
  assert.equal(db.prepare('PRAGMA quick_check').get().quick_check,'ok');
 }finally{db.close()}
});

test('D-06 0031 release guard rejects unexpected ledger or partial trigger state atomically',()=>{
 for(const mutate of [db=>db.prepare('INSERT INTO d1_migrations(name) VALUES(?)').run('unexpected.sql'),db=>db.exec(candidate.match(/^CREATE TRIGGER[\s\S]*?END;/m)[0])]){
  const db=database();try{mutate(db);const mutated=triggerRows(db);assert.throws(()=>atomic(db,releaseSql),/CHECK constraint failed/);assert.deepEqual(triggerRows(db),mutated);assert.equal(db.prepare("SELECT COUNT(*) n FROM d1_migrations WHERE name LIKE '0031_%'").get().n,0);assert.equal(db.prepare("SELECT COUNT(*) n FROM sqlite_master WHERE name='__d06_0031_release_guard'").get().n,0);}finally{db.close()}
 }
});
