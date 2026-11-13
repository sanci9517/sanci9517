import assert from 'node:assert/strict';
import test from 'node:test';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';

const oldSql=readFileSync(new URL('../scripts/pending/0028_media_archive.sql',import.meta.url),'utf8');
const candidate=readFileSync(new URL('./fixtures/media-archive-casefold-0029.sql',import.meta.url),'utf8');
const migrationName='0029_media_archive_casefold_guards.sql';

function fixture(){
 const db=new DatabaseSync(':memory:');
 db.exec('PRAGMA foreign_keys=ON');
 db.exec("CREATE TABLE d1_migrations(id INTEGER PRIMARY KEY,name TEXT,applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP);INSERT INTO d1_migrations(name) VALUES('0028_media_archive.sql');");
 db.exec('CREATE TABLE media(id TEXT PRIMARY KEY,site_id TEXT NOT NULL,created_at TEXT NOT NULL);CREATE TABLE pages(id TEXT PRIMARY KEY,site_id TEXT NOT NULL,content_json TEXT,published_content_json TEXT);CREATE TABLE editor_revisions(id TEXT PRIMARY KEY,page_id TEXT NOT NULL,document_json TEXT);');
 db.exec(oldSql);
 return db;
}
const triggers=db=>db.prepare("SELECT name,sql FROM sqlite_master WHERE type='trigger' AND name LIKE 'media_archive_%' ORDER BY name").all();
const ledger=db=>db.prepare('SELECT name FROM d1_migrations ORDER BY id').all().map(row=>row.name);
function atomic(db,sql=candidate){
 db.exec('BEGIN IMMEDIATE');
 try { db.exec(sql); db.exec('COMMIT'); }
 catch(error){db.exec('ROLLBACK');throw error;}
}

test('0029 candidate refuses missing 0028 ledger without any persistent schema or ledger mutation',()=>{
 const db=fixture();
 try{
  const before=triggers(db);db.exec("DELETE FROM d1_migrations WHERE name='0028_media_archive.sql'");
  assert.throws(()=>atomic(db),/CHECK constraint failed/);
  assert.deepEqual(triggers(db),before);
  assert.deepEqual(ledger(db),[]);
  assert.equal(db.prepare("SELECT COUNT(*) n FROM sqlite_master WHERE name='__media_0029_casefold_guard'").get().n,0);
 }finally{db.close();}
});

test('0029 candidate refuses preexisting ledger marker and altered triggers before dropping anything',()=>{
 const db=fixture();
 try{
  const original=triggers(db);
  db.exec("INSERT INTO d1_migrations(name) VALUES('0029_media_archive_casefold_guards.sql')");
  assert.throws(()=>atomic(db),/CHECK constraint failed/);
  assert.deepEqual(triggers(db),original);
  assert.equal(ledger(db).filter(x=>x===migrationName).length,1);
  db.exec("DELETE FROM d1_migrations WHERE name='0029_media_archive_casefold_guards.sql'");
  db.exec('DROP TRIGGER media_archive_revisions_insert_guard');
  db.exec("CREATE TRIGGER media_archive_revisions_insert_guard BEFORE INSERT ON editor_revisions BEGIN SELECT 1; END");
  const altered=triggers(db);
  assert.throws(()=>atomic(db),/CHECK constraint failed/);
  assert.deepEqual(triggers(db),altered);
  assert.deepEqual(ledger(db),['0028_media_archive.sql']);
 }finally{db.close();}
});

test('0029 candidate and ledger commit atomically and block mixed-case archived references within site',()=>{
 const db=fixture();
 try{
  atomic(db);
  assert.deepEqual(ledger(db),['0028_media_archive.sql',migrationName]);
  assert.equal(triggers(db).length,3);
  for(const row of triggers(db))assert.match(row.sql,/instr\(lower\(/);
  assert.equal(db.prepare("SELECT COUNT(*) n FROM sqlite_master WHERE name='__media_0029_casefold_guard'").get().n,0);
  const id='a1b2c3d4-0000-4000-8000-123456789abc';
  const upper=id.toUpperCase();
  db.prepare('INSERT INTO media(id,site_id,created_at,archived_at) VALUES(?,?,?,?)').run(id,'site-a','2026-11-13','2026-11-13');
  const insert=db.prepare('INSERT INTO pages(id,site_id,content_json,published_content_json) VALUES(?,?,?,?)');
  assert.throws(()=>insert.run('draft','site-a',JSON.stringify({assetId:upper}),null),/ARCHIVED_MEDIA_REFERENCE/);
  assert.throws(()=>insert.run('published','site-a','{}',JSON.stringify({posterAssetId:upper})),/ARCHIVED_MEDIA_REFERENCE/);
  insert.run('safe','site-a','{}',null);
  assert.throws(()=>db.prepare("UPDATE pages SET content_json=? WHERE id='safe'").run(JSON.stringify({imageAssetId:upper})),/ARCHIVED_MEDIA_REFERENCE/);
  assert.throws(()=>db.prepare("UPDATE pages SET published_content_json=? WHERE id='safe'").run(JSON.stringify({backgroundAssetId:upper})),/ARCHIVED_MEDIA_REFERENCE/);
  assert.throws(()=>db.prepare('INSERT INTO editor_revisions(id,page_id,document_json) VALUES(?,?,?)').run('bad','safe',JSON.stringify({src:'/media/'+upper})),/ARCHIVED_MEDIA_REFERENCE/);
  insert.run('other-site','site-b',JSON.stringify({assetId:upper}),null);
  db.prepare('INSERT INTO editor_revisions(id,page_id,document_json) VALUES(?,?,?)').run('other-site-revision','other-site',JSON.stringify({assetId:upper}));
  assert.equal(db.prepare('SELECT COUNT(*) n FROM pages').get().n,2);
  assert.equal(db.prepare('SELECT COUNT(*) n FROM editor_revisions').get().n,1);
  assert.throws(()=>atomic(db),/CHECK constraint failed/,'re-apply must not remove current guards');
  assert.deepEqual(ledger(db),['0028_media_archive.sql',migrationName]);
 }finally{db.close();}
});

test('0029 candidate transaction rollback restores exact old triggers and ledger after late error',()=>{
 const db=fixture();
 try{
  const original=triggers(db);
  db.exec('BEGIN IMMEDIATE');
  try{
   db.exec(candidate);
   assert.deepEqual(ledger(db),['0028_media_archive.sql',migrationName]);
   assert.throws(()=>db.exec('INSERT INTO intentionally_missing_table(value) VALUES(1)'),/no such table/);
  }finally{db.exec('ROLLBACK');}
  assert.deepEqual(triggers(db),original);
  assert.deepEqual(ledger(db),['0028_media_archive.sql']);
  assert.equal(db.prepare("SELECT COUNT(*) n FROM sqlite_master WHERE name='__media_0029_casefold_guard'").get().n,0);
 }finally{db.close();}
});


test('0029 blocks archived UUIDs hidden inside JSON Unicode escapes across every stored document snapshot',()=>{
 const db=fixture();
 try{
  atomic(db);
  const id='a1b2c3d4-0000-4000-8000-123456789abc';
  const escaped='\\u0061'+id.slice(1); // decoded JSON string is the lowercase archived ID
  const encoded=key=>'{' + JSON.stringify(key) + ':"' + escaped + '"}';
  assert.equal(JSON.parse(encoded('assetId')).assetId,id);
  db.prepare('INSERT INTO media(id,site_id,created_at,archived_at) VALUES(?,?,?,?)').run(id,'site-a','2026-11-13','2026-11-13');
  const insert=db.prepare('INSERT INTO pages(id,site_id,content_json,published_content_json) VALUES(?,?,?,?)');
  assert.throws(()=>insert.run('escaped-draft','site-a',encoded('assetId'),null),/ARCHIVED_MEDIA_REFERENCE/);
  assert.throws(()=>insert.run('escaped-published','site-a','{}',encoded('posterAssetId')),/ARCHIVED_MEDIA_REFERENCE/);
  insert.run('safe','site-a','{}',null);
  assert.throws(()=>db.prepare("UPDATE pages SET content_json=? WHERE id='safe'").run(encoded('backgroundAssetId')),/ARCHIVED_MEDIA_REFERENCE/);
  assert.throws(()=>db.prepare("UPDATE pages SET published_content_json=? WHERE id='safe'").run(encoded('imageAssetId')),/ARCHIVED_MEDIA_REFERENCE/);
  assert.throws(()=>db.prepare('INSERT INTO editor_revisions(id,page_id,document_json) VALUES(?,?,?)').run('escaped-revision','safe',encoded('assetId')),/ARCHIVED_MEDIA_REFERENCE/);
  // Valid unrelated Unicode escapes are not blocked, nor are cross-site IDs.
  insert.run('unrelated','site-a','{"title":"\\u0062"}',null);
  insert.run('other-site','site-b',encoded('assetId'),null);
  assert.equal(db.prepare('SELECT COUNT(*) AS n FROM pages').get().n,3);
  assert.deepEqual(ledger(db),['0028_media_archive.sql',migrationName]);
 } finally {db.close();}
});
