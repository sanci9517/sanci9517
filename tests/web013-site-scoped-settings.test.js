import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { hashSessionToken } from '../src/core/auth/session.ts';
import { adminSettingsRoute } from '../src/routes/admin/settings.ts';
import { publicSiteSettingsRoute } from '../src/routes/public/site-settings.ts';

const migration = readFileSync(new URL('../scripts/pending/0027_site_scoped_settings.sql', import.meta.url), 'utf8');

async function fixture(t, { installed = true, enabled = true } = {}) {
  const db = new DatabaseSync(':memory:');
  t.after(() => db.close());
  db.exec(`
    PRAGMA foreign_keys=ON;
    CREATE TABLE sites(id TEXT PRIMARY KEY,status TEXT NOT NULL);
    CREATE TABLE users(id TEXT PRIMARY KEY,email TEXT,display_name TEXT,role TEXT,is_active INTEGER);
    CREATE TABLE sessions(token_hash TEXT,user_id TEXT,expires_at TEXT);
    CREATE TABLE site_settings(key TEXT PRIMARY KEY,value_json TEXT,updated_at TEXT);
    CREATE TABLE audit_log(id TEXT PRIMARY KEY,user_id TEXT,action TEXT,entity_type TEXT,entity_id TEXT,metadata_json TEXT);
    CREATE TABLE pages(id TEXT PRIMARY KEY,site_id TEXT,title TEXT);
    INSERT INTO sites VALUES ('site-default','active'),('another','active');
    INSERT INTO users VALUES ('admin','admin@example.test','Owner','admin',1),
      ('viewer','viewer@example.test','Viewer','viewer',1);
    INSERT INTO site_settings VALUES ('site','{"siteName":"Existing brand","tagline":"Legacy"}','2026-10-16');
    INSERT INTO pages VALUES ('old-page','site-default','Untouched');
  `);
  if (installed) db.exec(migration);
  for (const name of ['admin','viewer']) {
    db.prepare('INSERT INTO sessions VALUES (?,?,?)').run(await hashSessionToken(name),name,'2999-01-01T00:00:00.000Z');
  }
  const env = {
    ...(enabled ? { SITE_SCOPED_SETTINGS_ENABLED:'enabled' } : {}),
    DB: {
      prepare(sql) {
        const stmt = db.prepare(sql);
        let args = [];
        return {
          bind(...v) { args = v; return this; },
          async first() { return stmt.get(...args) ?? null; },
          run() { return { meta: { changes: Number(stmt.run(...args).changes) } }; }
        };
      },
      async batch(statements) {
        db.exec('BEGIN');
        try { const r=statements.map(s=>s.run()); db.exec('COMMIT'); return r; }
        catch(e) {db.exec('ROLLBACK'); throw e;}
      }
    }
  };
  const get = (id='admin') => adminSettingsRoute(new Request('https://example.test/api/admin/settings',
    { headers: id ? { Cookie:`sanci9517_session=${id}` } : {} }),env);
  const put = (settings,id='admin') => adminSettingsRoute(new Request('https://example.test/api/admin/settings',
    { method:'PUT',headers:{'Content-Type':'application/json',...(id?{Cookie:`sanci9517_session=${id}`}:{})},body:JSON.stringify(settings) }),env);
  return {db,env,get,put};
}

test('additive migration copies legacy default settings and leaves all existing data', async t => {
  const {db}=await fixture(t);
  const original=db.prepare('SELECT key,value_json,updated_at FROM site_settings').get();
  const seeded=db.prepare("SELECT site_id,key,value_json,updated_at FROM site_scoped_settings WHERE site_id='site-default'").get();
  assert.equal(seeded.key,original.key);
  assert.equal(seeded.value_json,original.value_json);
  assert.equal(seeded.updated_at,original.updated_at);
  assert.deepEqual(db.prepare('SELECT id,site_id,title FROM pages').all().map(x=>({...x})),[
    {id:'old-page',site_id:'site-default',title:'Untouched'}
  ]);
  assert.deepEqual(db.prepare('PRAGMA foreign_key_check').all(),[]);
});

test('public scoped settings remain isolated and never leak default-site branding', async t => {
  const {db,env}=await fixture(t);
  const def=await publicSiteSettingsRoute(env,'site-default','Sanci9517');
  assert.deepEqual(await def.json(),{siteName:'Existing brand',tagline:'Legacy'});
  const other=await publicSiteSettingsRoute(env,'another','Other creator');
  assert.deepEqual(await other.json(),{siteName:'Other creator',tagline:''});
  db.prepare("INSERT INTO site_scoped_settings(site_id,key,value_json) VALUES ('another','site',?)")
    .run(JSON.stringify({siteName:'Other brand',tagline:'Custom'}));
  assert.deepEqual(await (await publicSiteSettingsRoute(env,'another','Other creator')).json(),
    {siteName:'Other brand',tagline:'Custom'});
  assert.equal((await (await publicSiteSettingsRoute(env,'site-default')).json()).siteName,'Existing brand');
});

test('authenticated settings writes update only tenant storage and do not auto-publish pages', async t => {
  const {db,env,get,put}=await fixture(t);
  assert.equal((await get()).status,200);
  assert.equal((await put({siteName:'My new site',tagline:'Updated'})).status,200);
  assert.deepEqual((await (await get()).json()).data,{siteName:'My new site',tagline:'Updated'});
  assert.deepEqual(await (await publicSiteSettingsRoute(env,'site-default')).json(),
    {siteName:'My new site',tagline:'Updated'});
  assert.equal(JSON.parse(db.prepare("SELECT value_json FROM site_settings WHERE key='site'").get().value_json).siteName,
    'Existing brand');
  assert.equal(db.prepare("SELECT title FROM pages WHERE id='old-page'").get().title,'Untouched');
  assert.equal(db.prepare('SELECT COUNT(*) AS n FROM audit_log').get().n,1);
  assert.equal((await put({siteName:'Denied',tagline:''},'viewer')).status,403);
  assert.equal((await put({siteName:'',tagline:'Invalid'})).status,400);
  assert.equal(db.prepare('SELECT COUNT(*) AS n FROM audit_log').get().n,1);
});

test('enabled mode fails closed on missing schema while disabled mode keeps legacy behavior', async t => {
  const missing=await fixture(t,{installed:false,enabled:true});
  const pub=await publicSiteSettingsRoute(missing.env,'site-default','Sanci9517');
  assert.equal(pub.status,503);
  assert.equal((await missing.get()).status,503);
  assert.equal((await missing.put({siteName:'No',tagline:'Not saved'})).status,503);
  const legacy=await fixture(t,{installed:false,enabled:false});
  assert.equal((await legacy.get()).status,200);
  assert.equal((await legacy.put({siteName:'Legacy works',tagline:'Default'})).status,200);
  assert.equal((await (await publicSiteSettingsRoute(legacy.env,'another','Other')).json()).siteName,'Other');
  assert.equal(JSON.parse(legacy.db.prepare("SELECT value_json FROM site_settings WHERE key='site'").get().value_json).siteName,
    'Legacy works');
});
