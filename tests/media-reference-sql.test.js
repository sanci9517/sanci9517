import assert from 'node:assert/strict';
import test from 'node:test';
import {DatabaseSync} from 'node:sqlite';
import {mediaReferenceSql} from '../src/core/media-reference-sql.js';

const asset='a1b2c3d4-0000-4000-8000-123456789abc';
const escaped='\\u0061'+asset.slice(1);
const encoded=(field='assetId')=>'{' + JSON.stringify(field) + ':"' + escaped + '"}';
function fixture(){
 const db=new DatabaseSync(':memory:');
 db.exec('CREATE TABLE media(id TEXT PRIMARY KEY,site_id TEXT,archived_at TEXT);CREATE TABLE pages(id TEXT PRIMARY KEY,site_id TEXT,content_json TEXT,published_content_json TEXT,is_published INTEGER,archived_at TEXT);CREATE TABLE editor_revisions(id TEXT PRIMARY KEY,page_id TEXT,document_json TEXT);');
 db.prepare('INSERT INTO media(id,site_id) VALUES(?,?)').run(asset,'site-a');
 return db;
}
test('reference SQL rejects unsafe expressions and detects JSON Unicode escapes without cross-site leakage',()=>{
 const db=fixture();try{
  assert.throws(()=>mediaReferenceSql('DROP TABLE media','?'),/Invalid/);
  assert.throws(()=>mediaReferenceSql('content_json',asset),/Invalid/);
  assert.equal(JSON.parse(encoded()).assetId,asset);
  const q='SELECT id FROM pages WHERE site_id=? AND '+mediaReferenceSql('content_json','?')+' ORDER BY id';
  const insert=db.prepare('INSERT INTO pages(id,site_id,content_json) VALUES(?,?,?)');
  insert.run('escaped','site-a',encoded());
  insert.run('plain','site-a',JSON.stringify({posterAssetId:asset.toUpperCase()}));
  insert.run('other','site-a','{"title":"\\u0062"}');
  insert.run('foreign','site-b',encoded());
  assert.deepEqual(db.prepare(q).all('site-a',asset,asset).map(x=>x.id),['escaped','plain']);
  insert.run('nested','site-a','{"nodes":{"photo":{"assetId":"'+escaped+'"}}}');
  assert.deepEqual(db.prepare(q).all('site-a',asset,asset).map(x=>x.id),['escaped','nested','plain']);
 }finally{db.close();}
});
test('last SQL archive predicate blocks escaped references but permits references in other sites',()=>{
 const db=fixture();try{
  const ins=db.prepare('INSERT INTO pages(id,site_id,content_json) VALUES(?,?,?)');
  ins.run('cross','site-b',encoded());ins.run('live','site-a',encoded());
  const sql='UPDATE media SET archived_at=CURRENT_TIMESTAMP WHERE id=? AND site_id=? AND archived_at IS NULL AND NOT EXISTS (SELECT 1 FROM pages p WHERE p.site_id=? AND ('+mediaReferenceSql('p.content_json','?')+' OR '+mediaReferenceSql('p.published_content_json','?')+'))';
  const stmt=db.prepare(sql);
  assert.equal(stmt.run(asset,'site-a','site-a',asset,asset,asset,asset).changes,0);
  db.exec("DELETE FROM pages WHERE id='live'");
  assert.equal(stmt.run(asset,'site-a','site-a',asset,asset,asset,asset).changes,1);
 }finally{db.close();}
});
test('retention-style correlated predicate decodes references and tolerates malformed legacy documents',()=>{
 const db=fixture();try{
  db.prepare('INSERT INTO pages(id,site_id,content_json) VALUES(?,?,?)').run('p','site-a',encoded());
  const sql='SELECT m.id FROM media m WHERE m.site_id=? AND NOT EXISTS(SELECT 1 FROM pages p WHERE p.site_id=m.site_id AND '+mediaReferenceSql('p.content_json','m.id')+')';
  assert.equal(db.prepare(sql).all('site-a').length,0);
  db.exec('DELETE FROM pages');
  db.prepare('INSERT INTO pages(id,site_id,content_json) VALUES(?,?,?)').run('legacy','site-a','not-json');
  assert.equal(db.prepare(sql).all('site-a').length,1);
 }finally{db.close();}
});
