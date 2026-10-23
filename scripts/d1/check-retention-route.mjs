// OFFLINE ONLY: no HTTP requests or production D1 bindings.
// Restore a trusted protected export in memory, exercise the actual Worker GET
// with a local ephemeral session, and roll back all local setup mutations.
// Never prints a cookie, token, user ID, email, or production row contents.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import worker from '../../src/index.ts';
import { hashSessionToken, generateSessionToken } from '../../src/core/auth/session.ts';
const [backupPath,reportPath]=process.argv.slice(2);
if (!backupPath || !reportPath) throw new Error('Usage: node --experimental-loader ./tests/ts-extension-loader.mjs scripts/d1/check-retention-route.mjs <protected-backup.sql> <new-report.json>');
const db=new DatabaseSync(':memory:',{enableForeignKeyConstraints:false});
db.exec(readFileSync(backupPath,'utf8'));
db.exec('PRAGMA foreign_keys=ON');
assert.deepEqual(db.prepare('PRAGMA foreign_key_check').all(),[]);
const tables=db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name").all().map(r=>r.name);
const snapshot=()=>Object.fromEntries(tables.map(t=>[t,createHash('sha256').update(JSON.stringify(db.prepare('SELECT * FROM "'+t.replaceAll('"','""')+'" ORDER BY 1').all())).digest('hex')]));
const original=snapshot();
const member=db.prepare("SELECT m.user_id,m.role FROM site_memberships m JOIN users u ON u.id=m.user_id JOIN sites s ON s.id=m.site_id WHERE m.site_id='site-default' AND m.status='active' AND m.role IN ('editor','admin') AND u.is_active=1 AND s.status='active' LIMIT 1").get();
assert.ok(member,'No existing authorized member in local backup');
let sqlReads=0,r2Calls=0;
const env={SITE_MEMBERSHIP_ENFORCEMENT:'enabled',SITE_SCOPED_SETTINGS_ENABLED:'enabled',
 MEDIA:new Proxy({}, {get(){r2Calls++;throw new Error('R2 must not be called by status GET')}}),
 ASSETS:{fetch(){throw new Error('Status API must not request static assets')}},
 DB:{prepare(sql){
  assert.match(sql,/^\s*SELECT\b/i,'Worker GET must stay read-only');sqlReads++;
  const stmt=db.prepare(sql);let args=[];
  return {bind(...v){args=v;return this},async first(){return stmt.get(...args)||null},async all(){return {results:stmt.all(...args)}}};
 }}};
const url='https://sanci9517-streamer-brand.sandor-bogadi95.workers.dev/api/admin/media?retentionStatus=1';
const call=token=>worker.fetch(new Request(url,{headers:token?{Cookie:'sanci9517_session='+token}:{}}),env,{waitUntil(){throw new Error('No background mutation allowed')}});
const report={kind:'local-full-worker-authenticated-rehearsal',production_http_acceptance:false,production_writes:0};
db.exec('BEGIN');
try {
 const token=generateSessionToken();
 db.prepare('INSERT INTO sessions(id,user_id,token_hash,expires_at) VALUES(?,?,?,?)').run(crypto.randomUUID(),member.user_id,await hashSessionToken(token),'2999-01-01T00:00:00.000Z');
 const allowed=await call(token);assert.equal(allowed.status,200);
 const body=await allowed.json();assert.equal(body.ok,true);assert.equal(body.data.migrationActive,true);assert.ok(Array.isArray(body.data.requests));assert.equal(body.data.requests.length,0);assert.equal(body.data.permanentDeletionAuthorized,false);
 report.authenticated_status=200;report.migrationActive=true;report.requestCount=0;report.permanentDeletionAuthorized=false;
 const noSession=await call();assert.equal(noSession.status,401);report.unauthenticated_status=401;
 db.prepare("UPDATE site_memberships SET role='viewer' WHERE site_id='site-default' AND user_id=?").run(member.user_id);
 const viewer=await call(token);assert.equal(viewer.status,403);report.viewer_status=403;
 db.prepare("UPDATE site_memberships SET status='revoked' WHERE site_id='site-default' AND user_id=?").run(member.user_id);
 const revoked=await call(token);assert.equal(revoked.status,403);report.revoked_status=403;
 report.select_operations=sqlReads;report.r2_operations=r2Calls;assert.equal(r2Calls,0);
} finally {db.exec('ROLLBACK')}
assert.deepEqual(snapshot(),original,'Local setup transaction must leave all original rows unchanged');
assert.equal(db.prepare('SELECT COUNT(*) n FROM media_retention_requests').get().n,0);
report.local_setup_rolled_back=true;report.all_original_local_data_preserved=true;report.ledger_records=db.prepare('SELECT COUNT(*) n FROM d1_migrations').get().n;
writeFileSync(reportPath,JSON.stringify(report,null,2)+'\n',{mode:0o600,flag:'wx'});
console.log(JSON.stringify(report));db.close();
