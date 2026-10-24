// Offline acceptance: actual Worker + native local D1/R2, with synthetic data only.
import assert from 'node:assert/strict';
import test from 'node:test';
import {createServer} from 'node:http';
import {readFile, stat} from 'node:fs/promises';
import {existsSync, readFileSync} from 'node:fs';
import {resolve, extname} from 'node:path';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {Miniflare, convertV4MiniflareOptions} from 'miniflare';
import {chromium} from 'playwright';
import worker from '../../src/index.ts';
import {hashPassword, generateSalt, bytesToBase64} from '../../src/core/auth/password.ts';

const root=resolve(import.meta.dirname,'../..');
const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l5sAAAAASUVORK5CYII=','base64');
const digest=bytes=>createHash('sha256').update(Buffer.from(bytes)).digest('hex');

test('real Worker login, image upload, duplicate, archive and non-empty diagnostics with local D1/R2', {timeout:90000},async t=>{
 const mf=new Miniflare(convertV4MiniflareOptions({modules:true,script:'',d1Databases:{DB:'media-acceptance-local'},r2Buckets:{MEDIA:'media-acceptance-local'}}));
 t.after(()=>mf.dispose());
 const DB=await mf.getD1Database('DB'), MEDIA=await mf.getR2Bucket('MEDIA');
 // This committed evidence contains DDL only, not production business rows.
 const schema=JSON.parse(readFileSync(resolve(root,'docs/evidence/d1-ledger-preflight.json'),'utf8')).result[0].results;
 for(const kind of ['table','index','trigger','view'])for(const row of schema.filter(x=>x.type===kind&&!x.name.startsWith('_cf_')))await DB.prepare(row.sql).run();
 const retention=JSON.parse(execFileSync('python3',['-c',`import sqlite3,json
from pathlib import Path
buffer=''; result=[]
for line in Path('scripts/pending/media_retention_requests.sql').read_text().splitlines(True):
 buffer+=line
 if sqlite3.complete_statement(buffer): result.append(buffer); buffer=''
assert not buffer.strip()
print(json.dumps(result))`],{cwd:root,encoding:'utf8'}));
 for(const sql of retention)await DB.prepare(sql).run();
 const password=crypto.randomUUID(), salt=generateSalt();
 await DB.batch([
  DB.prepare("INSERT INTO sites(id,slug,name) VALUES('site-default','fixture','Isolated media fixture')"),
  DB.prepare("INSERT INTO users(id,email,display_name,role,password_hash,password_salt) VALUES('fixture-user','media@example.invalid','Fixture','admin',?,?)").bind(await hashPassword(password,salt),bytesToBase64(salt)),
  DB.prepare("INSERT INTO site_memberships(site_id,user_id,role,status) VALUES('site-default','fixture-user','admin','active')"),
  DB.prepare("INSERT INTO site_domains(hostname,site_id,status,verified_at,verification_method) VALUES('127.0.0.1','site-default','verified','2026-01-01','fixture')")
 ]);
 const publicRoot=resolve(root,'public');
 const env={DB,MEDIA,SITE_MEMBERSHIP_ENFORCEMENT:'enabled',SITE_SCOPED_SETTINGS_ENABLED:'enabled',SITE_HOST_BINDINGS:'{"127.0.0.1":"site-default"}',ASSETS:{async fetch(request){
  const file=resolve(publicRoot,'.'+new URL(request.url).pathname);
  if(!file.startsWith(publicRoot+'/'))return new Response('Not found',{status:404});
  try{if(!(await stat(file)).isFile())return new Response('Not found',{status:404});return new Response(await readFile(file),{headers:{'Content-Type':({'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml'})[extname(file)]||'application/octet-stream'}})}catch{return new Response('Not found',{status:404})}
 }}};
 const calls=[], pending=[];
 const server=createServer(async(req,res)=>{
  try{
   const bytes=[];for await(const part of req)bytes.push(part);
   const url='http://127.0.0.1:'+server.address().port+req.url;
   calls.push({method:req.method,path:new URL(url).pathname,query:new URL(url).search});
   const response=await worker.fetch(new Request(url,{method:req.method,headers:req.headers,...(['GET','HEAD'].includes(req.method)?{}:{body:Buffer.concat(bytes)})}),env,{waitUntil(p){pending.push(p)}});
   res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
  }catch{res.writeHead(500);res.end('Fixture request failed')}
 });
 await new Promise(done=>server.listen(0,'127.0.0.1',done));
 t.after(async()=>{await new Promise(done=>server.close(done));await Promise.all(pending)});
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
 t.after(()=>browser.close());
 const context=await browser.newContext({viewport:{width:390,height:900}}), page=await context.newPage();
 page.setDefaultTimeout(10000);
 const base='http://127.0.0.1:'+server.address().port;
 const login=await context.request.post(base+'/api/auth/login',{data:{email:'media@example.invalid',password}});
 assert.equal(login.status(),200,'actual password login must succeed');
 assert.equal((await login.json()).data.authenticated,true);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'/admin/media');
 await page.locator('#imageInput').setInputFiles({name:'isolated-acceptance.png',mimeType:'image/png',buffer:png});
 await page.getByRole('button',{name:'Feltöltés a médiatárba',exact:true}).click();
 await page.getByText('A médiafájl sikeresen bekerült a privát médiatárba.',{exact:true}).waitFor();
 await page.locator('.tile img').waitFor();
 await page.waitForFunction(()=>{const image=document.querySelector('.tile img');return image?.complete&&image.naturalWidth===1});
 assert.equal((await DB.prepare('SELECT COUNT(*) n FROM media').first()).n,1);
 const row=await DB.prepare('SELECT * FROM media').first();
 assert.equal(digest(await (await MEDIA.get(row.object_key)).arrayBuffer()),digest(png));
 const get=async query=>{const r=await context.request.get(base+'/api/admin/media'+query);assert.equal(r.status(),200);return (await r.json()).data};
 const scan=async(mode,state,checked)=>{
  const panel=page.locator('[data-audit-mode="'+mode+'"]');await panel.locator('[data-audit-start]').click();
  await page.waitForFunction(({mode,state})=>document.querySelector('[data-audit-mode="'+mode+'"]').dataset.state===state,{mode,state});
  assert.match(await panel.getByRole('status').textContent(),new RegExp(checked+' fájl ellenőrizve'));
  return panel;
 };
 await scan('missing','empty',1);await scan('orphan','empty',1);
 const snapshot=async()=>({rows:(await DB.prepare('SELECT * FROM media ORDER BY id').all()).results,retention:(await DB.prepare('SELECT * FROM media_retention_requests').all()).results,objects:(await MEDIA.list()).objects.map(x=>({key:x.key,size:x.size})),content:digest(await(await MEDIA.get(row.object_key)).arrayBuffer())});
 const before=await snapshot();
 await scan('missing','empty',1);await scan('orphan','empty',1);
 assert.deepEqual(await snapshot(),before,'read-only diagnostics preserve stored rows and bytes');
 await page.locator('#imageInput').setInputFiles({name:'duplicate.png',mimeType:'image/png',buffer:png});
 const duplicateResponse=page.waitForResponse(r=>r.url().includes('/api/admin/media?name=')&&r.request().method()==='POST');
 await page.getByRole('button',{name:'Feltöltés a médiatárba',exact:true}).click();
 const duplicate=await(await duplicateResponse).json();assert.equal(duplicate.data.duplicate,true);assert.equal(duplicate.data.id,row.id);
 assert.deepEqual(await snapshot(),before,'duplicate upload must reuse one D1 row and one R2 object');
 const archive=await context.request.patch(base+'/api/admin/media?id='+row.id,{headers:{Origin:base},data:{archived:true}});
 assert.equal(archive.status(),200);assert.equal((await archive.json()).data.archived,true);
 await scan('missing','empty',1);assert.equal(digest(await(await MEDIA.get(row.object_key)).arrayBuffer()),digest(png),'archive preserves object bytes');
 const orphanKey='sites/site-default/media/isolated-orphan-fixture.png';await MEDIA.put(orphanKey,png);
 const orphanPanel=await scan('orphan','findings',2);assert.match(await orphanPanel.textContent(),/isolated-orphan-fixture/);
 const orphan=await get('?orphanAudit=1');assert.deepEqual(orphan.unregisteredCandidates,[orphanKey]);assert.equal(orphan.deletionAuthorized,false);
 // Remove only this in-memory fixture object, never a remote/production object.
 await MEDIA.delete(row.object_key);
 const missingPanel=await scan('missing','findings',1);assert.match(await missingPanel.textContent(),/isolated-acceptance\.png/);
 const missing=await get('?missingAudit=1');assert.equal(missing.missing[0].id,row.id);assert.equal(missing.missing[0].archived,true);assert.equal(missing.repairAuthorized,false);
 assert.equal((await DB.prepare('SELECT COUNT(*) n FROM media').first()).n,1,'diagnostics never remove the registry entry');
 assert.ok(await MEDIA.head(orphanKey),'diagnostics never delete the unregistered candidate');
 assert.equal((await DB.prepare('SELECT COUNT(*) n FROM media_retention_requests').first()).n,0);
 const requestIndex=calls.length;
 const refresh=page.waitForResponse(r=>r.url().includes('retentionStatus=1')&&r.request().method()==='GET');
 await page.getByRole('region',{name:'Adatmegőrzési kérelmek',exact:true}).getByRole('button',{name:'Állapot frissítése',exact:true}).click();
 assert.equal((await refresh).status(),200);
 await page.waitForFunction(()=>document.querySelector('#mediaRetentionPanel').dataset.state==='empty');
 assert.ok(calls.slice(requestIndex).every(x=>x.method==='GET'),'status refresh has no write requests');
 assert.deepEqual((await DB.prepare('PRAGMA foreign_key_check').all()).results,[]);
 assert.equal(await DB.prepare('PRAGMA quick_check').first('quick_check'),'ok');
 assert.deepEqual(errors,[]);
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'390px layout must not overflow');
 await page.screenshot({path:'/tmp/media-worker-storage-390.png',fullPage:true});
});
