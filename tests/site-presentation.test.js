import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {hashSessionToken} from '../src/core/auth/session.ts';
import {adminPresentationRoute} from '../src/routes/admin/presentation.ts';
import {publicPresentationRoute} from '../src/routes/public/presentation.ts';
import {defaultTokens} from '../public/editor-v2/core/design-tokens.js';

async function fixture(t,{scoped=true,memberships=true}={}){
  const db=new DatabaseSync(':memory:');t.after(()=>db.close());
  db.exec(`CREATE TABLE sites(id TEXT PRIMARY KEY,status TEXT);CREATE TABLE users(id TEXT PRIMARY KEY,email TEXT,display_name TEXT,role TEXT,is_active INTEGER);CREATE TABLE sessions(token_hash TEXT,user_id TEXT,expires_at TEXT);CREATE TABLE site_memberships(site_id TEXT,user_id TEXT,role TEXT,status TEXT,PRIMARY KEY(site_id,user_id));CREATE TABLE site_settings(key TEXT PRIMARY KEY,value_json TEXT,updated_at TEXT);CREATE TABLE site_scoped_settings(site_id TEXT,key TEXT,value_json TEXT,updated_at TEXT,PRIMARY KEY(site_id,key));CREATE TABLE audit_log(id TEXT PRIMARY KEY,user_id TEXT,action TEXT,entity_type TEXT,entity_id TEXT,metadata_json TEXT);INSERT INTO sites VALUES('site-default','active'),('other','active');INSERT INTO users VALUES('admin','admin@test','Admin','admin',1),('other-admin','other@test','Other','admin',1),('editor','editor@test','Editor','editor',1),('viewer','viewer@test','Viewer','viewer',1);INSERT INTO site_memberships VALUES('site-default','admin','admin','active'),('other','other-admin','admin','active'),('site-default','editor','editor','active'),('site-default','viewer','viewer','active');INSERT INTO site_settings VALUES('site','{"siteName":"Untouched"}','2026-10-18');`);
  for(const id of ['admin','other-admin','editor','viewer'])db.prepare('INSERT INTO sessions VALUES(?,?,?)').run(await hashSessionToken(id),id,'2999-01-01T00:00:00Z');
  const env={...(scoped?{SITE_SCOPED_SETTINGS_ENABLED:'enabled'}:{}),...(memberships?{SITE_MEMBERSHIP_ENFORCEMENT:'enabled'}:{}),DB:{prepare(sql){const statement=db.prepare(sql);let args=[];return {bind(...values){args=values;return this},async first(){return statement.get(...args)||null},run(){return {meta:{changes:Number(statement.run(...args).changes)}}}}},async batch(statements){db.exec('BEGIN');try{const result=statements.map(statement=>statement.run());db.exec('COMMIT');return result}catch(error){db.exec('ROLLBACK');throw error}}}};
  const request=(path,method='GET',body,user='admin')=>new Request('https://creator.test'+path,{method,headers:{...(user?{Cookie:'sanci9517_session='+user}:{}),...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{})});
  const admin=(body,user='admin',site='site-default')=>adminPresentationRoute(request('/api/admin/presentation',body?'PUT':'GET',body,user),env,site);
  const live=(preview=false,user='',site='site-default')=>publicPresentationRoute(request('/api/public/presentation'+(preview?'?preview=1':''),'GET',undefined,user),env,site);
  return {db,env,admin,live};
}

test('Brand Kit draft, published snapshot and restoration remain separate and revision guarded',async t=>{
  const {admin,live,db}=await fixture(t);const tokens=defaultTokens();tokens.colors.primary='#aabbcc';
  assert.equal((await (await live()).json()).data.tokens.colors.primary,'#7047eb');
  let result=await admin({expectedRevision:0,tokens,publish:false});assert.equal(result.status,200);assert.equal((await result.json()).data.revision,1);
  assert.equal((await (await live()).json()).data.tokens.colors.primary,'#7047eb');
  assert.equal((await (await live(true,'editor')).json()).data.tokens.colors.primary,'#aabbcc');
  result=await admin({expectedRevision:1,tokens,publish:true});assert.equal(result.status,200);assert.equal((await result.json()).data.published.status,'published');
  assert.equal((await (await live()).json()).data.tokens.colors.primary,'#aabbcc');
  const newer=structuredClone(tokens);newer.colors.primary='#123456';await admin({expectedRevision:2,tokens:newer});
  assert.equal((await admin({expectedRevision:2,tokens})).status,409);
  result=await admin({expectedRevision:3,restoreRevision:1});const restored=(await result.json()).data;assert.equal(restored.draft.tokens.colors.primary,'#aabbcc');assert.equal(restored.published.revision,2);
  assert.equal((await admin({expectedRevision:4,restoreRevision:1,publish:true})).status,400);
  assert.equal(db.prepare('SELECT value_json FROM site_settings WHERE key=\'site\'').get().value_json,'{"siteName":"Untouched"}');
});

test('Brand Kit access uses the existing roles and verified site context, with no cross-site draft leak',async t=>{
  const {admin,live}=await fixture(t);const tokens=defaultTokens();
  for(const user of ['', 'viewer','editor'])assert.equal((await admin({expectedRevision:0,tokens},user)).status,user?403:401);
  assert.equal((await live(true)).status,401);assert.equal((await live(true,'viewer')).status,403);
  assert.equal((await admin(undefined,'admin','other')).status,403);
  assert.equal((await admin({expectedRevision:0,tokens,siteId:'other'})).status,400);
  const other=defaultTokens();other.colors.primary='#cc0000';await admin({expectedRevision:0,tokens:other,publish:true},'other-admin','other');
  assert.equal((await (await live(false,'','other')).json()).data.tokens.colors.primary,'#cc0000');
  assert.equal((await (await live()).json()).data.tokens.colors.primary,'#7047eb');
  assert.equal((await live(true,'editor','other')).status,403);
});

test('the first-write race commits one version and one audit, while unsafe token values never persist',async t=>{
  const {admin,db}=await fixture(t),tokens=defaultTokens();
  const responses=await Promise.all([admin({expectedRevision:0,tokens}),admin({expectedRevision:0,tokens})]);assert.deepEqual(responses.map(response=>response.status).sort(),[200,409]);
  assert.equal(db.prepare('SELECT count(*) AS count FROM audit_log').get().count,1);
  const invalid=defaultTokens();invalid.colors.primary='url(javascript:alert(1))';assert.equal((await admin({expectedRevision:1,tokens:invalid})).status,400);
  invalid.colors.primary='var(--creator-colors-text)';assert.equal((await admin({expectedRevision:1,tokens:invalid})).status,400,'token references cannot form cycles');
  assert.equal((await admin({tokens})).status,428);
  assert.equal((await (await admin()).json()).data.revision,1);
});

test('legacy default-site storage works without a migration and never falls back for another site',async t=>{
  const {admin,live,db}=await fixture(t,{scoped:false,memberships:false}),tokens=defaultTokens();
  const result=await admin({expectedRevision:0,tokens,publish:true});assert.equal(result.status,200);
  assert.equal(db.prepare('SELECT count(*) AS count FROM site_settings').get().count,2);
  assert.equal(db.prepare('SELECT count(*) AS count FROM site_scoped_settings').get().count,0);
  assert.equal((await live(false,'','other')).status,503);
  assert.equal((await admin(undefined,'admin','other')).status,403);
});

test('corrupt or mismatched stored presentation fails closed and history stays bounded',async t=>{
  const {admin,live,db}=await fixture(t),tokens=defaultTokens();
  for(let revision=0;revision<23;revision++)assert.equal((await admin({expectedRevision:revision,tokens})).status,200);
  const document=(await (await admin()).json()).data;assert.equal(document.history.length,20);
  db.prepare('UPDATE site_scoped_settings SET value_json=? WHERE site_id=? AND key=?').run(JSON.stringify({...document,draft:{...document.draft,siteId:'other'}}),'site-default','design-system');
  assert.equal((await live()).status,503);assert.equal((await admin()).status,503);
});
