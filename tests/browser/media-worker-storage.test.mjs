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
 const cleanups=[];
 // Node test-context after hooks run in registration order, so keep dependent
 // resources in one stack and tear them down in reverse acquisition order.
 t.after(async()=>{
  const failures=[];
  for(const cleanup of cleanups.reverse())try{await cleanup()}catch(error){failures.push(error)}
  if(failures.length)throw new AggregateError(failures,'media storage fixture cleanup failed');
 });
 const mf=new Miniflare(convertV4MiniflareOptions({modules:true,script:'',d1Databases:{DB:'media-acceptance-local'},r2Buckets:{MEDIA:'media-acceptance-local'}}));
 cleanups.push(()=>mf.dispose());
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
  DB.prepare("INSERT INTO sites(id,slug,name) VALUES('site-secondary','secondary-fixture','Secondary isolated media fixture')"),
  DB.prepare("INSERT INTO users(id,email,display_name,role,password_hash,password_salt) VALUES('fixture-user','media@example.invalid','Fixture','admin',?,?)").bind(await hashPassword(password,salt),bytesToBase64(salt)),
  DB.prepare("INSERT INTO site_memberships(site_id,user_id,role,status) VALUES('site-default','fixture-user','admin','active')"),
  DB.prepare("INSERT INTO site_domains(hostname,site_id,status,verified_at,verification_method) VALUES('127.0.0.1','site-default','verified','2026-01-01','fixture')"),
  DB.prepare("INSERT INTO site_domains(hostname,site_id,status,verified_at,verification_method) VALUES('secondary.fixture','site-secondary','verified','2026-01-01','fixture')")
 ]);
 const publicRoot=resolve(root,'public');
 const env={DB,MEDIA,SITE_MEMBERSHIP_ENFORCEMENT:'enabled',SITE_SCOPED_SETTINGS_ENABLED:'enabled',SITE_HOST_BINDINGS:JSON.stringify({'127.0.0.1':'site-default','secondary.fixture':'site-secondary'}),ASSETS:{async fetch(request){
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
 await new Promise((resolve,reject)=>{
  server.once('error',reject);
  server.listen(0,'127.0.0.1',resolve);
 });
 cleanups.push(async()=>{await new Promise((resolve,reject)=>server.close(error=>error?reject(error):resolve()));await Promise.all(pending)});
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
 cleanups.push(()=>browser.close());
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
 const ctaNode=createNode(NODE_TYPES.BUTTON,{name:'Publikált CTA',parentId:fixturePage.rootId,metadata:{contentVersion:1},props:{text:'Publikált CTA',href:'/p/fixture-target'}});
 fixturePage.nodes[targetNode.id]=targetNode;fixturePage.nodes[ctaNode.id]=ctaNode;fixturePage.nodes[fixturePage.rootId].children.push(targetNode.id,ctaNode.id);
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
 const draftUsage=await get('?usage='+row.id);
 assert.ok(draftUsage.references.some(ref=>ref.source==='draft'&&ref.path==='responsive.desktop.backgroundAssetId'),
  'the real Worker usage index identifies the saved-but-unpublished background as a draft reference');
 const beforeDraftArchive=await snapshot();
 const pageBeforeDraftArchive=await DB.prepare('SELECT content_json,published_content_json,published_revision_id,is_published FROM pages WHERE id=?').bind(pageId).first();
 const draftArchiveTile=page.locator('.tile').filter({hasText:'isolated-acceptance.png'});
 await draftArchiveTile.waitFor();
 const draftArchiveButton=draftArchiveTile.getByRole('button',{name:'Médiafájl archiválása',exact:true});
 const draftArchiveCallIndex=calls.length;
 await draftArchiveButton.click();
 assert.equal(calls.length,draftArchiveCallIndex,'the first draft-only archive click only arms confirmation');
 const draftArchiveResponse=page.waitForResponse(response=>{
  const url=new URL(response.url());
  return url.pathname==='/api/admin/media'&&url.searchParams.get('id')===row.id&&response.request().method()==='PATCH';
 });
 await draftArchiveTile.getByRole('button',{name:'Archiválás megerősítése',exact:true}).click();
 const rejectedDraftArchive=await draftArchiveResponse;
 assert.equal(rejectedDraftArchive.status(),409,'the real Worker refuses to archive an asset referenced only by the current saved draft');
 assert.equal((await rejectedDraftArchive.json()).error.code,'MEDIA_ASSET_IN_USE');
 await draftArchiveTile.getByText(/A médiafájlra oldal vagy korábbi verzió hivatkozik/).waitFor();
 assert.deepEqual(await snapshot(),beforeDraftArchive,'a draft-only archive rejection preserves the D1 media row, retention ledger and exact R2 bytes');
 assert.deepEqual(await DB.prepare('SELECT content_json,published_content_json,published_revision_id,is_published FROM pages WHERE id=?').bind(pageId).first(),
  pageBeforeDraftArchive,'a denied archive leaves both the saved draft and its published snapshot unchanged');
 assert.ok(calls.slice(draftArchiveCallIndex).some(call=>call.method==='GET'&&call.query.includes('usage='+row.id)),
  'the Media Library refreshes site-scoped usage after the Worker refuses the draft-only archive');
 await editor.reload();await canvasNode.click();
 assert.ok((await canvasBackground()).includes(`/api/admin/media?id=${row.id}`),'the draft asset remains after a real Editor reload');
 await save(true);
 const publicResponse=await context.request.get(base+'/media/'+row.id);
 assert.equal(publicResponse.status(),200,'explicit Publish activates the public asset route');
 const publishedBytes=await publicResponse.body();
 assert.equal(digest(publishedBytes),digest(png),'the Worker returns the exact uploaded bytes');
 const workerFetch=(url,init={})=>worker.fetch(new Request(url,init),env,{waitUntil(p){pending.push(p)}});
 const primaryPublishedBytes=digest(publishedBytes);
 const otherSitePublic=await workerFetch('http://secondary.fixture/media/'+row.id);
 assert.equal(otherSitePublic.status,404,'a verified second site cannot fetch an asset referenced only by the primary site');
 assert.notEqual(otherSitePublic.status,421,'the 404 proves secondary.fixture resolves to its independently seeded site');
 assert.notEqual(digest(await otherSitePublic.arrayBuffer()),digest(png),'cross-site denial never returns the primary site R2 bytes');
 const crossSiteCookie=(await context.cookies(base)).map(cookie=>cookie.name+'='+cookie.value).join('; ');
 const beforeCrossSiteAttempts=await snapshot();
 const crossSiteHeaders={cookie:crossSiteCookie,'content-type':'application/json'};
 for(const [method,path,body] of [
  ['GET','/api/admin/media?id='+encodeURIComponent(row.id)],
  ['GET','/api/admin/media?usage='+encodeURIComponent(row.id)],
  ['PATCH','/api/admin/media',{id:row.id,archived:true}],
  ['PATCH','/api/admin/media',{id:row.id,archived:false}]
 ]){
  const denied=await workerFetch('http://secondary.fixture'+path,{method,headers:crossSiteHeaders,...(body?{body:JSON.stringify(body)}:{})});
  assert.equal(denied.status,403,`${method} ${path} remains unavailable to the primary site's authenticated admin from another site`);
 }
 assert.deepEqual(await snapshot(),beforeCrossSiteAttempts,'cross-site admin reads and archive toggles do not mutate the primary D1/R2 fixture');
 const sameSiteStillServes=await context.request.get(base+'/media/'+row.id);
 assert.equal(sameSiteStillServes.status(),200,'site isolation does not disrupt the same-site published media route');
 assert.equal(digest(await sameSiteStillServes.body()),primaryPublishedBytes,'same-site delivery keeps the exact published bytes');
 const publicTrailingSlashResponse=await context.request.get(base+'/media/'+row.id+'/');
 assert.equal(publicTrailingSlashResponse.status(),200,'the actual Worker route preserves renderer-valid trailing-slash media URLs');
 assert.equal(digest(await publicTrailingSlashResponse.body()),digest(png),'the normalized Worker route returns the same exact uploaded bytes');
 await live.goto(base+'/p/'+fixturePage.slug);
 const publicNode=live.locator(`[data-node-id="${targetNode.id}"]`);await publicNode.waitFor();
 assert.ok((await publicNode.evaluate(el=>getComputedStyle(el).backgroundImage)).includes(`/media/${row.id}`),
  'the real public page renderer uses the published R2 asset route');
 const publicCta=live.locator(`[data-node-id="${ctaNode.id}"]`);await publicCta.waitFor();
 assert.equal(await publicCta.getAttribute('href'),'/p/fixture-target','the live snapshot contains the valid authored CTA');
 assert.equal((await publicCta.textContent()).trim(),'Publikált CTA');
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
 const archiveTile=page.locator('.tile').filter({hasText:'isolated-acceptance.png'});
 await archiveTile.waitFor();
 const archiveButton=archiveTile.getByRole('button',{name:'Médiafájl archiválása',exact:true});
 const beforeArchive=await snapshot(),archiveCallIndex=calls.length;
 await archiveButton.click();
 assert.equal(calls.length,archiveCallIndex,'the first archive click only arms confirmation');
 const archiveResponse=page.waitForResponse(response=>{
  const url=new URL(response.url());
  return url.pathname==='/api/admin/media'&&url.searchParams.get('id')===row.id&&response.request().method()==='PATCH';
 });
 await archiveTile.getByRole('button',{name:'Archiválás megerősítése',exact:true}).click();
 assert.equal((await archiveResponse).status(),409,'the real Worker rejects the archive while a historical revision references the asset');
 await archiveTile.getByText(/A médiafájlra oldal vagy korábbi verzió hivatkozik/).waitFor();
 const historyLinks=archiveTile.getByRole('link',{name:/Korábbi verzió/});
 await historyLinks.first().waitFor();
 assert.ok(await historyLinks.count()>=1,'the UI exposes the historical Editor revision that blocks archiving');
 await page.waitForFunction(()=>document.querySelector('.tile .media-usage')?.hidden===false,
  null,{timeout:10000});
 assert.deepEqual(await snapshot(),beforeArchive,'the real Media Library archive denial leaves D1 rows and R2 bytes unchanged');
 assert.ok(calls.some(call=>call.method==='GET'&&call.query.includes('usage='+row.id)),
  'the real Media Library has loaded the site-scoped usage report while the Worker refuses current-draft and historical archive attempts');
 // An image with no draft, published, revision, or schedule references can
 // complete the positive archive/restore path through the real Media Library.
 // Seed only this synthetic site-owned fixture row/object in Miniflare so the
 // existing Editor asset remains covered by the historical-reference guard.
 const restoreId=crypto.randomUUID(),restoreKey=`sites/site-default/media/${restoreId}.png`;
 await MEDIA.put(restoreKey,png,{httpMetadata:{contentType:'image/png'}});
 await DB.prepare('INSERT INTO media(id,site_id,object_key,original_name,mime_type,size_bytes,alt_text) VALUES(?,?,?,?,?,?,?)')
  .bind(restoreId,'site-default',restoreKey,'archive-restore-acceptance.png','image/png',png.length,'site-owned archive fixture').run();
 const restoreRowBefore=await DB.prepare('SELECT * FROM media WHERE id=?').bind(restoreId).first();
 const restoreObjectBefore=await MEDIA.get(restoreKey);
 assert.ok(restoreRowBefore&&restoreObjectBefore,'the isolated site-owned image fixture exists before archive');
 assert.equal(restoreRowBefore.site_id,'site-default');
 const restoreBytesDigest=digest(await restoreObjectBefore.arrayBuffer());
 assert.equal(restoreBytesDigest,digest(png));
 const restoreTile=page.locator('.tile').filter({hasText:'archive-restore-acceptance.png'});
 await page.locator('#mediaState').selectOption('active');await restoreTile.waitFor();
 const unusedUsage=await get('?usage='+restoreId);
 assert.equal(unusedUsage.complete,true,'the real Worker completes the site-scoped usage scan before positive archive');
 assert.deepEqual(unusedUsage.references,[],'the fixture image has no draft, published, revision, or schedule references');
 const restorePublicBefore=await context.request.get(base+'/media/'+restoreId);
 assert.equal(restorePublicBefore.status(),404,'an unreferenced site-owned image is not publicly served');
 const restoreArchiveButton=restoreTile.getByRole('button',{name:'Médiafájl archiválása',exact:true});
 const callsBeforeArming=calls.length;
 await restoreArchiveButton.click();
 assert.ok(calls.slice(callsBeforeArming).every(call=>call.method!=='PATCH'||!call.query.includes('id='+restoreId)),
  'the first archive click only arms confirmation; it does not mutate this media row');
 const restoreArchiveResponse=page.waitForResponse(response=>{
  const url=new URL(response.url());
  return url.pathname==='/api/admin/media'&&url.searchParams.get('id')===restoreId&&response.request().method()==='PATCH';
 });
 await restoreTile.getByRole('button',{name:'Archiválás megerősítése',exact:true}).click();
 assert.equal((await restoreArchiveResponse).status(),200,'the actual Worker archives a confirmed, unused site-owned image');
 await restoreTile.waitFor({state:'detached'});
 const archivedRow=await DB.prepare('SELECT * FROM media WHERE id=?').bind(restoreId).first();
 const archivedObject=await MEDIA.get(restoreKey);
 assert.equal(archivedRow.id,restoreId,'archive retains the original D1 media row and asset ID');
 assert.equal(archivedRow.site_id,'site-default');assert.ok(archivedRow.archived_at,'the same row records its archived state');
 assert.equal(archivedRow.object_key,restoreRowBefore.object_key);
 assert.ok(archivedObject,'archive retains the site-owned object in R2');
 assert.equal(digest(await archivedObject.arrayBuffer()),restoreBytesDigest,'archive retains the exact R2 image bytes');
 assert.equal((await DB.prepare('SELECT COUNT(*) n FROM media_retention_requests WHERE asset_id=?').bind(restoreId).first()).n,0,
  'archive does not create a destructive retention request');
 const archivedPreview=await context.request.get(base+'/api/admin/media?id='+restoreId);
 assert.equal(archivedPreview.status(),200,'the site admin can still verify retained bytes through the private preview while archived');
 assert.equal(digest(await archivedPreview.body()),restoreBytesDigest,'the archived private preview serves the exact retained bytes');
 assert.equal((await context.request.get(base+'/media/'+restoreId)).status(),404,'archiving does not publish an unreferenced image');
 await page.locator('#mediaState').selectOption('archived');await restoreTile.waitFor();
 const restoreButton=restoreTile.getByRole('button',{name:'Médiafájl visszaállítása',exact:true});
 // R2 can become unavailable after an item was safely archived. Exercise the
 // real UI failure path using only the synthetic in-memory Miniflare object:
 // the failed restore must keep the same D1 row archived and leave the tile
 // repairable instead of optimistically removing it from the list.
 await MEDIA.delete(restoreKey);
 const missingRestoreResponse=page.waitForResponse(response=>{
  const url=new URL(response.url());
  return url.pathname==='/api/admin/media'&&url.searchParams.get('id')===restoreId&&response.request().method()==='PATCH';
 });
 await restoreButton.click();
 const missingRestore=await missingRestoreResponse;
 assert.equal(missingRestore.status(),409,'the UI surfaces the Worker refusal when an archived media object is missing');
 assert.equal((await missingRestore.json()).error.code,'MEDIA_OBJECT_MISSING');
 await restoreTile.waitFor({state:'attached'});
 await restoreTile.getByText('A tárolt médiafájl hiányzik. Nem lehet visszaállítani.',{exact:true}).waitFor();
 const stillArchived=await DB.prepare('SELECT * FROM media WHERE id=?').bind(restoreId).first();
 assert.ok(stillArchived.archived_at,'a failed UI restore cannot clear D1 archive state');
 assert.equal(await MEDIA.get(restoreKey),null,'the synthetic missing object remains absent after the failed restore');
 assert.equal((await DB.prepare('SELECT COUNT(*) n FROM media_retention_requests WHERE asset_id=?').bind(restoreId).first()).n,0,
  'a missing-object restore failure does not create a destructive retention request');
 assert.equal((await context.request.get(base+'/media/'+restoreId)).status(),404,
  'a failed restore never grants public access');
 await MEDIA.put(restoreKey,png,{httpMetadata:{contentType:'image/png'}});
 const restoreResponse=page.waitForResponse(response=>{
  const url=new URL(response.url());
  return url.pathname==='/api/admin/media'&&url.searchParams.get('id')===restoreId&&response.request().method()==='PATCH';
 });
 await restoreButton.click();
 assert.equal((await restoreResponse).status(),200,'the actual Worker restores the archived image after checking R2');
 await restoreTile.waitFor({state:'detached'});
 const restoredRow=await DB.prepare('SELECT * FROM media WHERE id=?').bind(restoreId).first();
 const restoredObject=await MEDIA.get(restoreKey);
 assert.equal(restoredRow.id,restoreId,'restore keeps the same media ID');
 assert.equal(restoredRow.site_id,'site-default');assert.equal(restoredRow.archived_at,null,'restore clears archive state on the existing row');
 assert.equal(restoredRow.object_key,restoreRowBefore.object_key,'restore preserves the original R2 key');
 assert.ok(restoredObject,'restore leaves the retained image object available');
 assert.equal(digest(await restoredObject.arrayBuffer()),restoreBytesDigest,'restore preserves the exact image bytes');
 await page.locator('#mediaState').selectOption('active');await restoreTile.waitFor();
 const restoredPreview=await context.request.get(base+'/api/admin/media?id='+restoreId);
 assert.equal(restoredPreview.status(),200,'the restored image is available again through its authenticated private preview');
 assert.equal(digest(await restoredPreview.body()),restoreBytesDigest);
 assert.equal((await context.request.get(base+'/media/'+restoreId)).status(),404,
  'restore does not publish the image; public delivery still needs an explicit page Publish');
 // A malformed persisted/API draft must remain repairable without bypassing the server Publish guard.
 const publicationBefore=await DB.prepare('SELECT content_json,published_content_json,published_revision_id,is_published FROM pages WHERE id=?').bind(pageId).first();
 assert.equal(publicationBefore.is_published,1);
 const invalidDraft=JSON.parse(publicationBefore.content_json);
 invalidDraft.pages[pageId].nodes[ctaNode.id].props.href={toString:null};
 const revisionBefore=Number((await DB.prepare('SELECT COALESCE(MAX(version),0) version FROM editor_revisions WHERE page_id=?').bind(pageId).first()).version);
 const invalidSave=await context.request.post(base+'/api/admin/editor?pageId='+encodeURIComponent(pageId),{data:{pageId,document:invalidDraft,publish:false,expectedVersion:revisionBefore,expectedParentPageId:null,note:'invalid CTA draft regression'}});
 assert.equal(invalidSave.status(),200,'Save retains an invalid legacy/API draft without publishing it');
 const invalidSaveBody=await invalidSave.json();assert.equal(invalidSaveBody.data.published,false);
 const savedDraftRow=await DB.prepare('SELECT content_json,published_content_json,published_revision_id,is_published FROM pages WHERE id=?').bind(pageId).first();
 assert.deepEqual(JSON.parse(savedDraftRow.content_json).pages[pageId].nodes[ctaNode.id].props.href,{toString:null});
 assert.equal(savedDraftRow.published_content_json,publicationBefore.published_content_json,'draft Save preserves the published snapshot');
 assert.equal(savedDraftRow.published_revision_id,publicationBefore.published_revision_id);
 await editor.reload();
 await editor.waitForFunction(()=>{const button=document.querySelector('#publish');return button&&!button.disabled&&button.textContent?.trim()==='Újrapublikálás'});
 const malformedPublishCalls=calls.length;
 await editor.locator('#publish').click();
 await editor.waitForTimeout(250);
 const invalidPublishStatus=(await editor.locator('#saveStatus').textContent()||'').trim();
 assert.match(invalidPublishStatus,/Javítsd a jelzett mezőt|cél|hivatkoz/i,`the invalid CTA is blocked with guidance; got: ${invalidPublishStatus}`);
 assert.equal(calls.slice(malformedPublishCalls).filter(call=>call.path==='/api/admin/editor'&&call.method==='POST').length,0,'local Publish does not POST malformed CTA data');
 const revisionBeforeRejectedPublish=Number((await DB.prepare('SELECT COALESCE(MAX(version),0) version FROM editor_revisions WHERE page_id=?').bind(pageId).first()).version);
 const invalidPublish=await context.request.post(base+'/api/admin/editor?pageId='+encodeURIComponent(pageId),{data:{pageId,document:JSON.parse(savedDraftRow.content_json),publish:true,expectedVersion:revisionBeforeRejectedPublish,expectedParentPageId:null,note:'invalid CTA publish regression'}});
 assert.equal(invalidPublish.status(),409,'the Worker independently rejects malformed authored content');
 assert.equal((await invalidPublish.json()).error.code,'INCOMPLETE_EDITOR_CONTENT');
 const afterRejectedPublish=await DB.prepare('SELECT content_json,published_content_json,published_revision_id,is_published FROM pages WHERE id=?').bind(pageId).first();
 assert.deepEqual(afterRejectedPublish,savedDraftRow,'rejected Publish performs no published-page mutation');
 assert.equal(Number((await DB.prepare('SELECT COALESCE(MAX(version),0) version FROM editor_revisions WHERE page_id=?').bind(pageId).first()).version),revisionBeforeRejectedPublish);
 await live.reload();
 const unchangedLiveCta=live.locator(`[data-node-id="${ctaNode.id}"]`);await unchangedLiveCta.waitFor();
 assert.equal(await unchangedLiveCta.getAttribute('href'),'/p/fixture-target','the valid prior CTA remains live');
 assert.deepEqual(errors,[],'malformed persisted CTA content does not crash the Editor or public renderer');
 await scan('missing','empty',2);assert.equal(digest(await(await MEDIA.get(row.object_key)).arrayBuffer()),digest(png),'archive preserves object bytes');
 const orphanKey='sites/site-default/media/isolated-orphan-fixture.png';await MEDIA.put(orphanKey,png);
 const orphanPanel=await scan('orphan','findings',3);assert.match(await orphanPanel.textContent(),/isolated-orphan-fixture/);
 const orphan=await get('?orphanAudit=1');assert.deepEqual(orphan.unregisteredCandidates,[orphanKey]);assert.equal(orphan.deletionAuthorized,false);
 // Remove only this in-memory fixture object, never a remote/production object.
 await MEDIA.delete(row.object_key);
 const missingPanel=await scan('missing','findings',2);assert.match(await missingPanel.textContent(),/isolated-acceptance\.png/);
 const missing=await get('?missingAudit=1');assert.equal(missing.missing[0].id,row.id);assert.equal(missing.missing[0].archived,false);assert.equal(missing.repairAuthorized,false);
 assert.equal((await DB.prepare('SELECT COUNT(*) n FROM media').first()).n,2,'diagnostics never remove either media registry entry');
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
