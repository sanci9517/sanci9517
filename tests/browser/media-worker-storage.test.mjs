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
import {createDocument,createNode,createPage,NODE_TYPES} from '../../public/editor-v2/core/schema.js';

const root=resolve(import.meta.dirname,'../..');
const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l5sAAAAASUVORK5CYII=','base64');
const digest=bytes=>createHash('sha256').update(Buffer.from(bytes)).digest('hex');

test('real Worker login, image upload, duplicate, Editor background asset lifecycle and non-empty diagnostics with local D1/R2', {timeout:180000},async t=>{
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
 // Reuse the uploaded R2 object in the real Editor over the same Worker,
 // authenticated session, isolated D1 and isolated R2 bindings.
 const pageId=crypto.randomUUID(),fixturePage=createPage({id:pageId,name:'Háttérkép lifecycle',slug:'background-asset-fixture'});
 const targetNode=createNode(NODE_TYPES.TEXT,{name:'Háttér tesztelem',parentId:fixturePage.rootId,props:{text:'Médiatár háttér'},style:{width:'320px',height:'160px'}});
 fixturePage.nodes[targetNode.id]=targetNode;fixturePage.nodes[fixturePage.rootId].children.push(targetNode.id);
 const document=createDocument(fixturePage,{modern:true});
 const created=await context.request.post(base+'/api/admin/pages',{data:{id:pageId,title:fixturePage.name,slug:fixturePage.slug,description:'',document}});
 assert.equal(created.status(),200,'an Admin page is created through the real Worker route');
 assert.ok((await (await context.request.get(base+'/api/admin/pages')).json()).data.some(item=>item.id===pageId),'the Worker lists the created Editor fixture');
 const editor=await context.newPage(),live=await context.newPage();
 for(const browserPage of [editor,live])browserPage.setDefaultTimeout(10000);
 await editor.setViewportSize({width:1280,height:900});
 editor.on('pageerror',e=>errors.push(e.message));live.on('pageerror',e=>errors.push(e.message));
 await editor.goto(base+'/admin/editor?pageId='+encodeURIComponent(pageId));
 const canvasNode=editor.locator(`.node[data-node-id="${targetNode.id}"]`);
 await canvasNode.waitFor();
 await canvasNode.click();
 if(await editor.locator('#rightDock').evaluate(el=>el.classList.contains('closed')))await editor.locator('#openInspector').click();
 await editor.locator('.inspector-tabs button').first().click();
 const backgroundGroup=editor.locator('.inspector-group-title').filter({hasText:'Háttér'});
 if(await backgroundGroup.getAttribute('aria-expanded')==='false')await backgroundGroup.click();
 const backgroundField=editor.locator('.typed-inspector-field[data-property-id="background.image"]');
 await backgroundField.locator('.editor-media-picker').getByRole('button',{name:'Médiatár megnyitása'}).click();
 await backgroundField.locator('[role="region"][aria-label="Médiatár találatok"]').getByRole('button',{name:'isolated-acceptance.png kiválasztása'}).click();
 const canvasBackground=()=>editor.locator(`.node[data-node-id="${targetNode.id}"]`).evaluate(el=>getComputedStyle(el).backgroundImage);
 assert.ok((await canvasBackground()).includes(`/api/admin/media?id=${row.id}`),'the canvas previews the site-scoped asset through the authenticated Worker route');
 await editor.locator('#undo').click();assert.equal(await canvasBackground(),'none');
 await editor.locator('#redo').click();assert.ok((await canvasBackground()).includes(`/api/admin/media?id=${row.id}`));
 const save=async publish=>{
  await editor.locator(publish?'#publish':'#save').click();
  await editor.waitForFunction(pub=>document.querySelector('#saveStatus')?.textContent?.startsWith(pub?'Publikálva':'Mentve'),publish);
 };
 await save(false);
 const stored=(await DB.prepare('SELECT content_json FROM pages WHERE id=?').bind(pageId).first()).content_json;
 assert.equal(JSON.parse(stored).pages[pageId].nodes[targetNode.id].responsive.desktop.backgroundAssetId,row.id,'draft Save persists the asset ID through the real Editor route');
 assert.equal((await context.request.get(base+'/media/'+row.id)).status(),404,'an asset referenced only by a draft is not public');
 await editor.reload();await canvasNode.click();
 assert.ok((await canvasBackground()).includes(`/api/admin/media?id=${row.id}`),'the draft asset remains after a real Editor reload');
 await save(true);
 const publicResponse=await context.request.get(base+'/media/'+row.id);
 assert.equal(publicResponse.status(),200,'explicit Publish activates the public asset route');
 assert.equal(digest(await publicResponse.body()),digest(png),'the Worker returns the exact uploaded bytes');
 await live.goto(base+'/p/'+fixturePage.slug);
 const publicNode=live.locator(`[data-node-id="${targetNode.id}"]`);await publicNode.waitFor();
 assert.ok((await publicNode.evaluate(el=>getComputedStyle(el).backgroundImage)).includes(`/media/${row.id}`),
  'the real public page renderer uses the published R2 asset route');
 const usageAfterPublish=await get('?usage='+row.id);
 assert.equal(usageAfterPublish.complete,true);
 assert.ok(usageAfterPublish.references.some(ref=>ref.source==='published'&&ref.path==='responsive.desktop.backgroundAssetId'));
 await editor.locator('.inspector-tabs button').first().click();
 if(await backgroundGroup.getAttribute('aria-expanded')==='false')await backgroundGroup.click();
 const selectedBackground=editor.locator('.typed-inspector-field[data-property-id="background.image"]');
 await selectedBackground.locator('.editor-media-picker').getByRole('button',{name:'Kép eltávolítása',exact:true}).click();
 assert.equal(await canvasBackground(),'none');
 await save(false);
 assert.equal((await context.request.get(base+'/media/'+row.id)).status(),200,'draft removal retains the current published asset');
 await live.reload();assert.ok((await live.locator(`[data-node-id="${targetNode.id}"]`).evaluate(el=>getComputedStyle(el).backgroundImage)).includes(`/media/${row.id}`),
  'the published page remains unchanged after draft removal');
 await editor.reload();await canvasNode.click();assert.equal(await canvasBackground(),'none','draft removal remains after Editor reload');
 await save(true);
 assert.equal((await context.request.get(base+'/media/'+row.id)).status(),404,'Publish removal revokes public delivery when no published page references the asset');
 await live.reload();assert.equal(await live.locator(`[data-node-id="${targetNode.id}"]`).evaluate(el=>getComputedStyle(el).backgroundImage),'none',
  'the real public page reflects removal only after explicit Publish');
 const usageAfterRemoval=await get('?usage='+row.id);
 assert.equal(usageAfterRemoval.complete,true);
 assert.ok(usageAfterRemoval.references.some(ref=>ref.source==='revision'&&ref.path==='responsive.desktop.backgroundAssetId'),
  'historical revisions keep the asset in use after the published reference is removed');
 const archive=await context.request.patch(base+'/api/admin/media?id='+row.id,{headers:{Origin:base},data:{archived:true}});
 assert.equal(archive.status(),409,'the safe usage report blocks archival while historical versions still reference the asset');
 await scan('missing','empty',1);assert.equal(digest(await(await MEDIA.get(row.object_key)).arrayBuffer()),digest(png),'archive preserves object bytes');
 const orphanKey='sites/site-default/media/isolated-orphan-fixture.png';await MEDIA.put(orphanKey,png);
 const orphanPanel=await scan('orphan','findings',2);assert.match(await orphanPanel.textContent(),/isolated-orphan-fixture/);
 const orphan=await get('?orphanAudit=1');assert.deepEqual(orphan.unregisteredCandidates,[orphanKey]);assert.equal(orphan.deletionAuthorized,false);
 // Remove only this in-memory fixture object, never a remote/production object.
 await MEDIA.delete(row.object_key);
 const missingPanel=await scan('missing','findings',1);assert.match(await missingPanel.textContent(),/isolated-acceptance\.png/);
 const missing=await get('?missingAudit=1');assert.equal(missing.missing[0].id,row.id);assert.equal(missing.missing[0].archived,false);assert.equal(missing.repairAuthorized,false);
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
