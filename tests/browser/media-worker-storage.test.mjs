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
const wav=Buffer.alloc(44+4000);
wav.write('RIFF',0);wav.writeUInt32LE(wav.length-8,4);wav.write('WAVEfmt ',8);wav.writeUInt32LE(16,16);
wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);wav.writeUInt32LE(8000,24);wav.writeUInt32LE(16000,28);
wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(wav.length-44,40);
// Reuse the repository's tiny, procedurally generated, known-playable VP9 fixture.
const webm=readFileSync(resolve(import.meta.dirname,'../fixtures/editor-sample.webm'));
const digest=bytes=>createHash('sha256').update(Buffer.from(bytes)).digest('hex');

test('real Worker Media Library upload and Editor image/audio/video Save-reload-Publish lifecycle with local D1/R2', {timeout:240000},async t=>{
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
 // A verified second site owns real playable D1/R2 rows in this fixture. Its
 // files must not leak into either the primary Media Library or its Editor
 // asset picker, even though both requests share the same authenticated cookie.
 const foreignPlayableAssets=[];
 for(const fixture of [
  {name:'secondary-private-audio.wav',mimeType:'audio/wav',bytes:wav,type:NODE_TYPES.AUDIO},
  {name:'secondary-private-video.webm',mimeType:'video/webm',bytes:webm,type:NODE_TYPES.VIDEO}
 ]){
  const id=crypto.randomUUID(),extension=fixture.mimeType==='audio/wav'?'wav':'webm';
  const key=`sites/site-secondary/media/${id}.${extension}`;
  await MEDIA.put(key,fixture.bytes,{httpMetadata:{contentType:fixture.mimeType}});
  await DB.prepare('INSERT INTO media(id,site_id,object_key,original_name,mime_type,size_bytes,alt_text) VALUES(?,?,?,?,?,?,?)')
   .bind(id,'site-secondary',key,fixture.name,fixture.mimeType,fixture.bytes.length,'secondary-site private fixture').run();
  foreignPlayableAssets.push({...fixture,id});
  assert.equal((await context.request.get(base+'/api/admin/media?id='+id)).status(),404,
   'the primary site admin cannot privately fetch another site playable asset');
  assert.equal((await context.request.get(base+'/media/'+id)).status(),404,
   'another site playable asset remains unpublished and inaccessible');
 }
 await page.reload();
 for(const foreign of foreignPlayableAssets)assert.equal(await page.locator('.tile').filter({hasText:foreign.name}).count(),0,
  'the real Media Library excludes playable files owned by the verified secondary site');
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
 const restoredPickerNode=editor.locator(`.node[data-node-id="${targetNode.id}"]`);
 await restoredPickerNode.evaluate(element=>element.click());
 if(await editor.locator('#rightDock').evaluate(el=>el.classList.contains('closed')))await editor.locator('#openInspector').click();
 await editor.locator('.inspector-tabs button').first().click();
 if(await backgroundGroup.getAttribute('aria-expanded')==='false')await backgroundGroup.click();
 const restorePicker=editor.locator('.typed-inspector-field[data-property-id="background.image"] .editor-media-picker');
 await restorePicker.getByRole('button',{name:'Médiatár megnyitása'}).click();
 await restorePicker.getByRole('region',{name:'Médiatár találatok'}).waitFor();
 await editor.waitForFunction(()=>document.querySelector('.editor-media-current')?.getAttribute('aria-busy')==='false');
 assert.equal(await restorePicker.getByRole('button',{name:'archive-restore-acceptance.png kiválasztása'}).count(),0,
  'the real Inspector picker excludes a D1-archived asset even while the Admin Media Library lists archived rows');
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
 await restorePicker.getByRole('button',{name:'Médiatár bezárása'}).click();
 await restorePicker.getByRole('button',{name:'Médiatár megnyitása'}).click();
 await editor.waitForFunction(()=>document.querySelector('.editor-media-current')?.getAttribute('aria-busy')==='false');
 const restoredChoice=restorePicker.getByRole('button',{name:'archive-restore-acceptance.png kiválasztása',exact:true});
 await restoredChoice.waitFor();
 const editorContentBeforeRestoreSelection=(await DB.prepare('SELECT content_json,published_content_json,published_revision_id FROM pages WHERE id=?').bind(pageId).first());
 const publishedBackgroundBeforeRestore=await live.locator(`[data-node-id="${targetNode.id}"]`).evaluate(el=>getComputedStyle(el).backgroundImage);
 assert.equal(publishedBackgroundBeforeRestore,'none','the prior explicit Publish removed the original image before this restore lifecycle');
 await restoredChoice.click();
 assert.ok((await restoredPickerNode.evaluate(el=>getComputedStyle(el).backgroundImage)).includes('/api/admin/media?id='+restoreId),
  'the same restored media ID is selectable in the real Editor and previews privately on its Canvas');
 const editorContentAfterRestoreSelection=await DB.prepare('SELECT content_json,published_content_json,published_revision_id FROM pages WHERE id=?').bind(pageId).first();
 assert.deepEqual(editorContentAfterRestoreSelection,editorContentBeforeRestoreSelection,
  'selecting the restored media remains local until the user explicitly saves the draft');
 await save(false);
 const restoredDraft=await DB.prepare('SELECT content_json,published_content_json,published_revision_id,is_published FROM pages WHERE id=?').bind(pageId).first();
 assert.equal(JSON.parse(restoredDraft.content_json).pages[pageId].nodes[targetNode.id].responsive.desktop.backgroundAssetId,restoreId,
  'explicit Save persists the restored asset ID in the draft');
 assert.equal(restoredDraft.is_published,1,'draft Save keeps the existing page published');
 assert.equal(restoredDraft.published_content_json,editorContentBeforeRestoreSelection.published_content_json,
  'Save keeps the published snapshot separate from the restored asset draft');
 assert.equal(JSON.parse(restoredDraft.published_content_json).pages[pageId].nodes[targetNode.id].responsive.desktop.backgroundAssetId,'none',
  'the unchanged published snapshot still reflects the prior explicit image removal');
 assert.equal((await context.request.get(base+'/media/'+restoreId)).status(),404,
  'Save does not publish the restored asset');
 await live.reload();
 try{
  await live.waitForFunction(nodeId=>{
   const node=document.querySelector(`[data-node-id="${nodeId}"]`);
   return Boolean(node&&getComputedStyle(node).backgroundImage==='none');
  },targetNode.id,{timeout:15000});
 }catch(error){
  const state=await live.evaluate(nodeId=>{
   const node=document.querySelector(`[data-node-id="${nodeId}"]`);
   return {url:location.href,node:node?.outerHTML.slice(0,1000),background:node?getComputedStyle(node).backgroundImage:null};
  },targetNode.id);
  const publicResponse=await context.request.get(base+'/api/public/pages?slug=fixture'),publicPayload=await publicResponse.json();
  throw new Error(`Public Save isolation changed the previous no-background snapshot: ${JSON.stringify({state,publicStatus:publicResponse.status(),publishedAssetId:publicPayload.data?.content?.nodes?.[targetNode.id]?.responsive?.desktop?.backgroundAssetId})}`,{cause:error});
 }
 assert.equal(await live.locator(`[data-node-id="${targetNode.id}"]`).evaluate(el=>getComputedStyle(el).backgroundImage),'none',
  'the public page remains on its previous no-background snapshot after Save');
 await editor.reload();await restoredPickerNode.click();
 assert.ok((await restoredPickerNode.evaluate(el=>getComputedStyle(el).backgroundImage)).includes('/api/admin/media?id='+restoreId),
  'Editor reload restores the same saved restored-asset selection');
 const restoredPreview=await context.request.get(base+'/api/admin/media?id='+restoreId);
 assert.equal(restoredPreview.status(),200,'the restored image is available again through its authenticated private preview');
 assert.equal(digest(await restoredPreview.body()),restoreBytesDigest);
 assert.equal((await context.request.get(base+'/media/'+restoreId)).status(),404,
  'restore does not publish the image; public delivery still needs an explicit page Publish');
 await save(true);
 const restoredPublication=await DB.prepare('SELECT published_content_json,published_revision_id FROM pages WHERE id=?').bind(pageId).first();
 assert.equal(JSON.parse(restoredPublication.published_content_json).pages[pageId].nodes[targetNode.id].responsive.desktop.backgroundAssetId,restoreId,
  'the separate Publish moves the restored asset ID into the live snapshot');
 const restoredPublicResponse=await context.request.get(base+'/media/'+restoreId);
 assert.equal(restoredPublicResponse.status(),200,'the separate Publish grants public delivery to the restored asset');
 assert.equal(digest(await restoredPublicResponse.body()),restoreBytesDigest,'the published restored asset serves the exact retained bytes');
 await live.reload();
 assert.ok((await live.locator(`[data-node-id="${targetNode.id}"]`).evaluate(el=>getComputedStyle(el).backgroundImage)).includes('/media/'+restoreId),
  'the public page displays the restored asset only after the separate Publish');
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
 assert.equal((await DB.prepare('SELECT COUNT(*) n FROM media WHERE site_id=?').bind('site-default').first()).n,2,
  'diagnostics never remove either primary-site media registry entry');
 assert.equal((await DB.prepare('SELECT COUNT(*) n FROM media WHERE site_id=?').bind('site-secondary').first()).n,2,
  'primary-site diagnostics neither remove nor absorb the verified secondary-site media rows');
 assert.ok(await MEDIA.head(orphanKey),'diagnostics never delete the unregistered candidate');
 assert.equal((await DB.prepare('SELECT COUNT(*) n FROM media_retention_requests').first()).n,0);
 const requestIndex=calls.length;
 const refresh=page.waitForResponse(r=>r.url().includes('retentionStatus=1')&&r.request().method()==='GET');
 await page.getByRole('region',{name:'Adatmegőrzési kérelmek',exact:true}).getByRole('button',{name:'Állapot frissítése',exact:true}).click();
 assert.equal((await refresh).status(),200);
 await page.waitForFunction(()=>document.querySelector('#mediaRetentionPanel').dataset.state==='empty');
 assert.ok(calls.slice(requestIndex).every(x=>x.method==='GET'),'status refresh has no write requests');
 // D-06 plan coverage: the actual Media Library UI must persist supported
 // audio and video files to the same site-scoped D1/R2 pipeline. Before a
 // page explicitly publishes a reference, both stay private to the admin.
 const playableAssets=[];
 for(const fixture of [
  {name:'isolated-audio.wav',mimeType:'audio/wav',bytes:wav,icon:'🔊',label:'Hangfájl',type:NODE_TYPES.AUDIO},
  {name:'isolated-video.webm',mimeType:'video/webm',bytes:webm,icon:'🎬',label:'Videófájl',type:NODE_TYPES.VIDEO}
 ]){
  await page.locator('#imageInput').setInputFiles({name:fixture.name,mimeType:fixture.mimeType,buffer:fixture.bytes});
  const uploadResponse=page.waitForResponse(response=>{
   const url=new URL(response.url());
   return url.pathname==='/api/admin/media'&&response.request().method()==='POST';
  });
  await page.getByRole('button',{name:'Feltöltés a médiatárba',exact:true}).click();
  const uploadedResponse=await uploadResponse;
  assert.equal(uploadedResponse.status(),201,`${fixture.mimeType} upload reaches the real Worker from the Media Library UI`);
  const uploaded=(await uploadedResponse.json()).data;
  assert.equal(uploaded.mimeType,fixture.mimeType);
  const tile=page.locator('.tile').filter({hasText:fixture.name});
  await tile.waitFor();
  const mediaLink=tile.locator('a');
  assert.equal(await mediaLink.locator('img').count(),0,'playable files use a semantic media icon instead of an image preview');
  await mediaLink.getByLabel(fixture.label,{exact:true}).waitFor();
  assert.equal((await mediaLink.textContent()).trim(),fixture.icon);
  const row=await DB.prepare('SELECT * FROM media WHERE id=?').bind(uploaded.id).first();
  assert.equal(row.site_id,'site-default');assert.equal(row.mime_type,fixture.mimeType);
  assert.equal(row.size_bytes,fixture.bytes.length);
  assert.match(row.object_key,new RegExp('^sites/site-default/media/'));
  assert.equal(row.archived_at,null);
  const stored=await MEDIA.get(row.object_key);
  assert.ok(stored,'the accepted playable media object is present in the isolated R2 bucket');
  assert.equal(digest(await stored.arrayBuffer()),digest(fixture.bytes),'the R2 object retains the exact upload bytes');
  const privatePreview=await context.request.get(base+'/api/admin/media?id='+uploaded.id);
  assert.equal(privatePreview.status(),200,'site admin can preview the playable media privately');
  assert.equal(privatePreview.headers()['content-type'],fixture.mimeType);
  assert.equal(digest(await privatePreview.body()),digest(fixture.bytes));
  assert.equal((await context.request.get(base+'/media/'+uploaded.id)).status(),404,
   'uploaded audio/video remains private until a separate published page reference exists');
  playableAssets.push({...fixture,id:uploaded.id});
 }
 // The original image object was intentionally removed above to test missing
 // object diagnostics. Give the poster lifecycle its own active, private image
 // fixture so that an earlier negative storage test cannot poison this one.
 const posterId=crypto.randomUUID(),posterKey=`sites/site-default/media/${posterId}.png`;
 await MEDIA.put(posterKey,png,{httpMetadata:{contentType:'image/png'}});
 await DB.prepare('INSERT INTO media(id,site_id,object_key,original_name,mime_type,size_bytes,alt_text) VALUES(?,?,?,?,?,?,?)')
  .bind(posterId,'site-default',posterKey,'isolated-video-poster.png','image/png',png.length,'isolated video poster fixture').run();
 // Connect real uploads to the actual authored-content Inspector, then verify
 // draft persistence/reload independently from public publication. The image
 // background fixture above keeps its existing archive/history assertions.
 const playablePageId=crypto.randomUUID(),playableSlug='playable-media-'+crypto.randomUUID().replaceAll('-','');
 const playablePage=createPage({id:playablePageId,name:'Audio és videó lifecycle',slug:playableSlug});
 const playableNodes=new Map();
 for(const fixture of playableAssets){
  const props=fixture.type===NODE_TYPES.VIDEO
   ?{src:'',assetId:'',poster:'',posterAssetId:'',controls:true,loop:false,muted:true,autoplay:false}
   :{src:'',assetId:'',controls:true,loop:false};
  const node=createNode(fixture.type,{name:fixture.type===NODE_TYPES.VIDEO?'Publikált videó':'Publikált hang',parentId:playablePage.rootId,
   props,metadata:{contentVersion:1},style:{width:'320px',height:fixture.type===NODE_TYPES.VIDEO?'240px':'80px'}});
  playablePage.nodes[node.id]=node;playablePage.nodes[playablePage.rootId].children.push(node.id);playableNodes.set(fixture.type,node);
 }
 const playableDocument=createDocument(playablePage,{modern:true});
 const playableCreated=await context.request.post(base+'/api/admin/pages',{data:{id:playablePageId,title:playablePage.name,slug:playablePage.slug,description:'',document:playableDocument}});
 assert.equal(playableCreated.status(),200,'the actual Worker accepts a fresh playable-media Editor draft');
 const playableEditor=await context.newPage(),playableLive=await context.newPage();
 for(const browserPage of [playableEditor,playableLive])browserPage.setDefaultTimeout(10000);
 await playableLive.addInitScript(()=>{
  window.__mutedVideoAutoplayObserved=false;
  // The synthetic VP9 is intentionally short. Record its real autoplay `play`
  // event before navigation rather than racing its 800 ms completion below.
  document.addEventListener('play',event=>{
   const video=event.target;
   if(video instanceof HTMLVideoElement&&video.autoplay&&video.muted)window.__mutedVideoAutoplayObserved=true;
  },true);
 });
 playableEditor.on('pageerror',e=>errors.push(e.message));playableLive.on('pageerror',e=>errors.push(e.message));
 // A 720×450 CSS-pixel viewport is the repository's established effective
 // 200% zoom / short-desktop scenario (1440×900 physical baseline). Keep the
 // real authored media picker, poster, Save, reload, and Publish lifecycle in
 // this compact shell instead of testing ownership only at a roomy desktop.
 await playableEditor.setViewportSize({width:720,height:450});
 await playableEditor.goto(base+'/admin/editor?pageId='+encodeURIComponent(playablePageId));
 assert.equal(await playableEditor.evaluate(()=>[innerWidth,innerHeight].join('×')),'720×450',
  'the real media lifecycle runs at the established effective 200% zoom / short viewport');
 assert.ok(await playableEditor.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),
  'the real Editor shell and Inspector do not introduce horizontal page overflow at the compact viewport');
 const selectPlayable=async node=>{
  // Use the same delegated node-selection event as the existing Chromium
  // Editor tests; native media controls and canvas overlays can intercept a
  // pointer click even though the persisted node and Inspector are healthy.
  await playableEditor.locator(`.node[data-node-id="${node.id}"]`).evaluate(element=>element.click());
  if(await playableEditor.locator('#rightDock').evaluate(el=>el.classList.contains('closed')))await playableEditor.locator('#openInspector').click();
  await playableEditor.locator('.inspector-tabs button').nth(1).click();
 };
 for(const fixture of playableAssets){
  const node=playableNodes.get(fixture.type),canvas=playableEditor.locator(`.node[data-node-id="${node.id}"]`);
  await selectPlayable(node);
  const sourceField=playableEditor.locator('#inspectorBody [data-content-key="assetId"]');
  const picker=sourceField.locator('.editor-media-picker');
  const openPicker=picker.getByRole('button',{name:'Médiatár megnyitása'});
  const pickerButtonBox=await openPicker.boundingBox();
  assert.ok(pickerButtonBox?.height>=44,
   'the real authored-media picker retains the minimum touch target at the compact viewport');
  await openPicker.click();
  const choices=picker.getByRole('region',{name:'Médiatár találatok'});
  const foreign=foreignPlayableAssets.find(asset=>asset.type===fixture.type);
  assert.ok(foreign,'the fixture includes a same-type foreign playable asset for each Editor picker check');
  assert.equal(await choices.getByRole('button',{name:foreign.name+' kiválasztása',exact:true}).count(),0,
   'the real Editor asset picker excludes a same-type playable asset owned by another site');
  await choices.getByRole('button',{name:fixture.name+' kiválasztása'}).click();
  const media=canvas.locator(fixture.type===NODE_TYPES.VIDEO?'video':'audio');
  assert.equal(await media.getAttribute('src'),'/api/admin/media?id='+fixture.id,
   `${fixture.mimeType} selection changes the authored Canvas to the authenticated private asset URL`);
  if(fixture.type===NODE_TYPES.VIDEO){
   const posterField=playableEditor.locator('#inspectorBody [data-content-key="posterAssetId"]');
   const posterPicker=posterField.locator('.editor-media-picker');
   await posterPicker.getByRole('button',{name:'Médiatár megnyitása'}).click();
   const posterChoices=posterPicker.getByRole('region',{name:'Médiatár találatok'});
   await posterChoices.getByRole('button',{name:'isolated-video-poster.png kiválasztása',exact:true}).click();
   assert.equal(await posterPicker.getByRole('button',{name:'isolated-video.webm kiválasztása',exact:true}).count(),0,
    'the video poster picker excludes playable video uploads and offers only image assets');
   assert.equal(await media.getAttribute('poster'),'/api/admin/media?id='+posterId,
    'a site-owned image selection previews privately as the authored video poster');
   const unsaved=JSON.parse((await DB.prepare('SELECT content_json FROM pages WHERE id=?').bind(playablePageId).first()).content_json)
    .pages[playablePageId].nodes[node.id].props;
   assert.equal(unsaved.assetId,'','choosing a video source remains a local Editor edit until Save');
   assert.equal(unsaved.posterAssetId,'','choosing its image poster also remains local until Save');
   assert.equal((await context.request.get(base+'/media/'+posterId)).status(),404,
    'the private poster preview does not grant public delivery before Publish');
   // Controls-free video is only valid as a muted autoplay background. Configure
   // that real authored-content Inspector state, while keeping the Canvas
   // preview non-autoplaying until the separate public renderer is reached.
   const autoplay=playableEditor.locator('#inspectorBody [data-content-key="autoplay"] input[type="checkbox"]');
   const muted=playableEditor.locator('#inspectorBody [data-content-key="muted"] input[type="checkbox"]');
   const controls=playableEditor.locator('#inspectorBody [data-content-key="controls"] input[type="checkbox"]');
   await autoplay.check();
   await controls.uncheck();
   assert.equal(await autoplay.isChecked(),true,'the authored video Inspector keeps the explicit autoplay choice');
   assert.equal(await muted.isChecked(),true,'controls-free video remains explicitly muted');
   assert.equal(await controls.isChecked(),false,'the authored video can hide controls only in its muted-autoplay mode');
   assert.equal(await media.getAttribute('muted'),'','the Editor Canvas preserves the muted preview contract');
   assert.equal(await media.getAttribute('controls'),null,'the Editor Canvas reflects the authored controls-free mode');
   assert.equal(await media.getAttribute('autoplay'),null,'the Editor Canvas never starts authored autoplay inside the Editor');
  }else{
   const loop=playableEditor.locator('#inspectorBody [data-content-key="loop"] input[type="checkbox"]');
   await loop.check();
   assert.equal(await loop.isChecked(),true,'the real audio Inspector enables repeat playback');
   assert.equal(await media.getAttribute('loop'),'','audio repeat updates the Canvas immediately');
   assert.equal(JSON.parse((await DB.prepare('SELECT content_json FROM pages WHERE id=?').bind(playablePageId).first()).content_json)
    .pages[playablePageId].nodes[node.id].props.loop,false,
    'audio loop remains a private Editor edit until the explicit draft Save');
  }
  assert.equal(JSON.parse((await DB.prepare('SELECT content_json FROM pages WHERE id=?').bind(playablePageId).first()).content_json)
   .pages[playablePageId].nodes[node.id].props.assetId,'',
   'choosing a playable asset remains local until the user explicitly saves the draft');
 }
 const savePlayable=async publish=>{
  await playableEditor.locator(publish?'#publish':'#save').click();
  await playableEditor.waitForFunction(pub=>document.querySelector('#saveStatus')?.textContent?.startsWith(pub?'Publikálva':'Mentve'),publish);
 };
 await savePlayable(false);
 for(const fixture of playableAssets){
  const node=playableNodes.get(fixture.type),saved=(await DB.prepare('SELECT content_json FROM pages WHERE id=?').bind(playablePageId).first()).content_json;
  assert.equal(JSON.parse(saved).pages[playablePageId].nodes[node.id].props.assetId,fixture.id,
   'draft Save persists the exact site-scoped playable media ID');
  assert.equal((await context.request.get(base+'/media/'+fixture.id)).status(),404,
   'draft Save does not publish a playable media object');
 }
 const savedVideoDraft=JSON.parse((await DB.prepare('SELECT content_json FROM pages WHERE id=?').bind(playablePageId).first()).content_json)
  .pages[playablePageId].nodes[playableNodes.get(NODE_TYPES.VIDEO).id].props;
 assert.equal(savedVideoDraft.posterAssetId,posterId,'draft Save persists the independent site-scoped poster image ID');
 assert.equal(savedVideoDraft.controls,false,'draft Save persists the controls-free video mode');
 assert.equal(savedVideoDraft.muted,true,'draft Save persists the required muted autoplay state');
 assert.equal(savedVideoDraft.autoplay,true,'draft Save persists the authored autoplay state');
 const savedAudioDraft=JSON.parse((await DB.prepare('SELECT content_json FROM pages WHERE id=?').bind(playablePageId).first()).content_json)
  .pages[playablePageId].nodes[playableNodes.get(NODE_TYPES.AUDIO).id].props;
 assert.equal(savedAudioDraft.loop,true,'draft Save persists the authored audio repeat setting');
 assert.equal(savedAudioDraft.controls,true,'draft Save preserves accessible native audio controls');
 assert.ok((await get('?usage='+posterId)).references.some(ref=>ref.source==='draft'&&ref.path.includes('posterAssetId')),
  'the Worker usage index identifies the video poster as a draft-only image reference');
 assert.equal((await context.request.get(base+'/media/'+posterId)).status(),404,
  'saving a video poster reference does not publish its image');
 await playableEditor.reload();
 for(const fixture of playableAssets){
  const node=playableNodes.get(fixture.type),canvas=playableEditor.locator(`.node[data-node-id="${node.id}"]`);
  await selectPlayable(node);
  const picker=playableEditor.locator('#inspectorBody [data-content-key="assetId"] .editor-media-picker');
  try{await picker.locator('.editor-media-selected').waitFor({timeout:4000})}
  catch(error){
   const persisted=(await DB.prepare('SELECT content_json FROM pages WHERE id=?').bind(playablePageId).first()).content_json;
   const savedId=JSON.parse(persisted).pages[playablePageId].nodes[node.id].props.assetId;
   const inspector=(await playableEditor.locator('#inspectorBody').innerText()).replace(/\s+/g,' ').slice(0,1000);
   const canvasMarkup=(await canvas.innerHTML()).slice(0,700);
   throw new Error(`Reload did not restore the ${fixture.mimeType} picker selection; saved asset=${savedId}; inspector=${inspector}; canvas=${canvasMarkup}`,{cause:error});
  }
  assert.equal(await picker.locator('.editor-media-selected').getAttribute('aria-label'),fixture.label==='Videófájl'?'Kiválasztott videó':'Kiválasztott hang',
   'Editor reload restores an accessible playable-asset selection');
  assert.equal(await canvas.locator(fixture.type===NODE_TYPES.VIDEO?'video':'audio').getAttribute('src'),
   '/api/admin/media?id='+fixture.id,'Editor reload restores the private preview source');
  if(fixture.type===NODE_TYPES.AUDIO){
   assert.equal(await playableEditor.locator('#inspectorBody [data-content-key="loop"] input[type="checkbox"]').isChecked(),true,
    'Editor reload restores the authored audio repeat setting');
   assert.equal(await canvas.locator('audio').getAttribute('loop'),'',
    'Editor reload preserves repeat playback in the private Canvas preview');
  }
  if(fixture.type===NODE_TYPES.VIDEO){
   const posterPicker=playableEditor.locator('#inspectorBody [data-content-key="posterAssetId"] .editor-media-picker');
   await posterPicker.locator('.editor-media-selected').waitFor();
   const posterPreview=await context.request.get(base+'/api/admin/media?id='+posterId);
   assert.equal(posterPreview.status(),200,'the saved site-owned poster remains privately readable after Editor reload');
   assert.equal(digest(await posterPreview.body()),digest(png),'the reloaded private poster preview preserves the exact uploaded image bytes');
   assert.equal(await posterPicker.locator('.editor-media-selected').getAttribute('alt'),'Kiválasztott kép',
    'Editor reload restores the selected site-owned poster image');
   assert.equal(await playableEditor.locator('#inspectorBody [data-content-key="autoplay"] input[type="checkbox"]').isChecked(),true,
    'Editor reload restores the authored autoplay setting');
   assert.equal(await playableEditor.locator('#inspectorBody [data-content-key="muted"] input[type="checkbox"]').isChecked(),true,
    'Editor reload restores the required muted state');
   assert.equal(await playableEditor.locator('#inspectorBody [data-content-key="controls"] input[type="checkbox"]').isChecked(),false,
    'Editor reload restores the controls-free mode');
   assert.equal(await canvas.locator('video').getAttribute('poster'),'/api/admin/media?id='+posterId,
    'Editor reload keeps the poster on the authenticated private preview route');
   assert.equal(await canvas.locator('video').getAttribute('autoplay'),null,
    'a reloaded Editor draft still does not autoplay inside the design surface');
  }
 }
 await savePlayable(true);
 await playableLive.goto(base+'/p/'+playableSlug);
 for(const fixture of playableAssets){
  const node=playableNodes.get(fixture.type),publicMedia=await context.request.get(base+'/media/'+fixture.id);
  assert.equal(publicMedia.status(),200,'only the explicit separate Publish activates public delivery');
  assert.equal(publicMedia.headers()['content-type'],fixture.mimeType,'published playable media keeps its validated MIME type');
  assert.equal(digest(await publicMedia.body()),digest(fixture.bytes),'published R2 delivery preserves the exact uploaded playable bytes');
  const media=playableLive.locator(`[data-node-id="${node.id}"]`).locator(fixture.type===NODE_TYPES.VIDEO?'video':'audio');
  await media.waitFor();
  assert.equal(await media.getAttribute('src'),'/media/'+fixture.id,'the public renderer uses only the public media route');
  if(fixture.type===NODE_TYPES.VIDEO){
   const posterResponse=await context.request.get(base+'/media/'+posterId);
   assert.equal(posterResponse.status(),200,'the separate Publish grants public delivery to the referenced video poster');
   assert.equal(posterResponse.headers()['content-type'],'image/png','the published poster preserves its validated image MIME type');
   assert.equal(digest(await posterResponse.body()),digest(png),'published poster delivery preserves the exact uploaded D1/R2-linked image bytes');
   assert.equal(await media.getAttribute('poster'),'/media/'+posterId,'the public video uses the published poster route, not the private Admin preview');
   assert.equal(await media.getAttribute('autoplay'),'','the separate Publish renders the authored autoplay attribute publicly');
   assert.equal(await media.getAttribute('muted'),'','public autoplay is muted');
   assert.equal(await media.getAttribute('controls'),null,'the published background video remains controls-free');
   await playableLive.waitForFunction(()=>window.__mutedVideoAutoplayObserved===true,null,{timeout:8000});
   const autoplayState=await media.evaluate(element=>({autoplay:element.autoplay,muted:element.muted,controls:element.controls}));
   assert.deepEqual(autoplayState,{autoplay:true,muted:true,controls:false},
    'the published muted video has the expected background attributes');
   assert.ok((await get('?usage='+posterId)).references.some(ref=>ref.source==='published'&&ref.path.includes('posterAssetId')),
    'the Worker usage index identifies the published video poster reference');
  }else{
   assert.equal(await media.getAttribute('controls'),'','the published audio keeps native playback controls');
   assert.equal(await media.getAttribute('loop'),'','the separate Publish exposes the authored repeat setting');
   assert.equal(await media.getAttribute('autoplay'),null,'the audio repeat setting does not implicitly enable autoplay');
  }
  const playback=await media.evaluate(async element=>{
   if(element.readyState<1)await new Promise((resolve,reject)=>{element.addEventListener('loadedmetadata',resolve,{once:true});element.addEventListener('error',reject,{once:true})});
   element.muted=true;await element.play();
   if(element instanceof HTMLAudioElement&&element.loop)await new Promise(resolve=>setTimeout(resolve,Math.min(600,Math.max(300,element.duration*2500))));
   const result={playing:!element.paused,duration:element.duration,readyState:element.readyState,loop:element.loop,ended:element.ended};element.pause();return result;
  });
  assert.equal(playback.playing,true,`${fixture.mimeType} remains playable after publication`);
  assert.ok(playback.duration>0);assert.ok(playback.readyState>=2);
  if(fixture.type===NODE_TYPES.AUDIO){
   assert.equal(playback.loop,true,'public audio retains the authored loop property');
   assert.equal(playback.ended,false,'the published audio continues playing after more than one track duration');
  }
 }
 assert.deepEqual((await DB.prepare('PRAGMA foreign_key_check').all()).results,[]);
 assert.equal(await DB.prepare('PRAGMA quick_check').first('quick_check'),'ok');
 assert.deepEqual(errors,[]);
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'390px layout must not overflow');
 await page.screenshot({path:'/tmp/media-worker-storage-390.png',fullPage:true});
});
