import assert from 'node:assert/strict';
import test from 'node:test';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, extname } from 'node:path';
import { chromium } from 'playwright';

const id=n=>`00000000-0000-4000-8000-${String(n).padStart(12,'0')}`;
const missing=(rows=[],extra={})=>({mode:'read-only',checked:rows.length,missing:rows,nextCursor:null,complete:true,repairAuthorized:false,...extra});
const orphan=(keys=[],extra={})=>({mode:'read-only',siteId:'site-default',checked:keys.length,unregisteredCandidates:keys,registeredCount:0,nextCursor:null,complete:true,deletionAuthorized:false,...extra});
const row=(n=1)=>({id:id(n),name:`Fájl ${n}.png`,archived:false});
const key=n=>`sites/site-default/media/file-${n}`;
function json(res,data,status=200){res.writeHead(status,{'content-type':'application/json'});res.end(JSON.stringify(data));}
async function fixture(t,handler,width=390){
 const root=resolve(import.meta.dirname,'../../public'),calls=[],errors=[];
 const server=createServer(async(req,res)=>{
  const url=new URL(req.url,'http://localhost');
  if(url.pathname==='/api/admin/media'){
   calls.push({method:req.method,query:url.search,cache:req.headers['cache-control']});
   if(url.searchParams.has('missingAudit')||url.searchParams.has('orphanAudit'))return handler(req,res,url);
   if(url.searchParams.has('id')){res.writeHead(200,{'content-type':'image/png'});return res.end(Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l5sAAAAASUVORK5CYII=','base64'));}
   return json(res,{ok:true,data:{assets:[{id:id(999),name:'Médiatár fixture.png',mimeType:'image/png',sizeBytes:10,altText:''}]}});
  }
  const file=resolve(root,'.'+url.pathname);if(!file.startsWith(root+'/'))return res.writeHead(403).end();
  try{const contents=await readFile(file);res.writeHead(200,{'content-type':{'.html':'text/html','.js':'text/javascript'}[extname(file)]||'application/octet-stream'});res.end(contents);}
  catch{res.writeHead(404).end();}
 });
 await new Promise(done=>server.listen(0,'127.0.0.1',done));
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
 t.after(async()=>{await browser.close();await new Promise(done=>server.close(done));});
 const page=await browser.newPage({viewport:{width,height:900}});page.setDefaultTimeout(5000);page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`http://127.0.0.1:${server.address().port}/admin-media.html`);await page.locator('.tile').waitFor();
 const region=page.getByRole('region',{name:'Fájlok és nyilvántartás ellenőrzése'});
 const panels={missing:region.getByRole('region',{name:'Hiányzó tárolt fájlok'}),orphan:region.getByRole('region',{name:'Nem nyilvántartott fájljelöltek'})};
 const state=(mode,value)=>page.waitForFunction(({mode,value})=>document.querySelector(`[data-audit-mode="${mode}"]`).dataset.state===value,{mode,value});
 const audits=()=>calls.filter(c=>/missingAudit|orphanAudit/.test(c.query));
 return {page,region,panels,state,audits,calls,errors};
}

for(const width of [390,1366])test(`integrity diagnostics start manually and show safe findings without overflow at ${width}px`,async t=>{
 let finish;
 const long=key('a'.repeat(850));
 const f=await fixture(t,(_req,res,url)=>{
  if(url.searchParams.has('missingAudit')){finish=()=>json(res,{ok:true,data:missing([row(),{...row(2),archived:true}])});return;}
  json(res,{ok:true,data:orphan([long])});
 },width);
 assert.equal(f.audits().length,0,'page load must not scan storage');
 assert.match(await f.panels.orphan.textContent(),/folyamatban lévő feltöltés/);
 const start=f.panels.missing.locator('[data-audit-start]');
 await start.focus();await start.press('Enter');
 await f.state('missing','loading');assert.equal(await start.isDisabled(),true);assert.equal(await f.panels.missing.getAttribute('aria-busy'),'true');
 assert.equal(f.audits().length,1,'no automatic pagination or double start');
 finish();await f.state('missing','findings');assert.equal(await f.panels.missing.locator('li').count(),2);
 assert.match(await f.panels.missing.getByRole('status').textContent(),/1. részlet: 2 fájl/);
 assert.match(await f.panels.missing.locator('li').nth(1).textContent(),/Archivált/);
 assert.equal(await start.evaluate(el=>el===document.activeElement),true);
 await f.panels.orphan.getByRole('button',{name:'Nyilvántartás egyeztetése'}).click();await f.state('orphan','findings');
 assert.equal(await f.panels.orphan.locator('li p').textContent(),'Tárolt fájl azonosítója: '+long);
 assert.equal(await f.panels.orphan.locator('a').count(),0,'private object keys must not turn into URLs');
 assert.ok(f.calls.every(c=>c.method==='GET'));assert.deepEqual(f.errors,[]);
 assert.ok(await f.page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await f.region.screenshot({path:`/tmp/media-integrity-${width}.png`});
});

for(const mode of ['missing','orphan'])test(`${mode} pagination is explicit, bounded, encoded and replaces the prior page`,async t=>{
 const cursor=mode==='missing'?id(100):'cursor+/=:-100';
 const f=await fixture(t,(_req,res,url)=>{
  const next=url.searchParams.get(mode==='missing'?'before':'cursor');
  const report=mode==='missing'?(next?missing([row(101)]):missing([row()],{checked:100,complete:false,nextCursor:cursor})):
   next?orphan([key(101)]):orphan([key(1)],{checked:100,registeredCount:99,complete:false,nextCursor:cursor});
  json(res,{ok:true,data:report});
 });
 const panel=f.panels[mode];await panel.locator('[data-audit-start]').click();await f.state(mode,'findings');
 assert.match(await panel.getByRole('status').textContent(),/még nem teljes/);assert.equal(f.audits().length,1);
 const next=panel.getByRole('button',{name:'Következő részlet ellenőrzése'});assert.equal(await next.evaluate(el=>el===document.activeElement),true);
 await next.press('Enter');await f.state(mode,'findings');assert.equal(f.audits().length,2);
 assert.equal(new URLSearchParams(f.audits()[1].query).get(mode==='missing'?'before':'cursor'),cursor);
 assert.match(await panel.getByRole('status').textContent(),/2. részlet: 1 fájl/);assert.equal(await panel.locator('li').count(),1);
 assert.doesNotMatch(await panel.locator('li').textContent(),mode==='missing'?/Fájl 1\.png/:/file-1$/);
 assert.equal(await next.isVisible(),false);assert.ok(f.calls.every(c=>c.method==='GET'));
 await panel.getByRole('button',{name:'Vizsgálat újrakezdése'}).click();await f.state(mode,'findings');
 assert.equal(new URLSearchParams(f.audits()[2].query).has(mode==='missing'?'before':'cursor'),false);
 assert.match(await panel.getByRole('status').textContent(),/1. részlet:/);assert.deepEqual(f.errors,[]);
});

test('a failed next page clears stale findings and retries only the same page on explicit request',async t=>{
 let failed=true;
 const f=await fixture(t,(_req,res,url)=>{
  if(!url.searchParams.has('before'))return json(res,{ok:true,data:missing([row()],{checked:100,complete:false,nextCursor:id(100)})});
  if(failed)return json(res,{ok:false,error:{code:'MEDIA_STORAGE_FAILED'}},503);
  json(res,{ok:true,data:missing([],{checked:10})});
 });
 const panel=f.panels.missing;await panel.locator('[data-audit-start]').click();await f.state('missing','findings');
 await panel.locator('[data-audit-next]').click();await f.state('missing','error');assert.equal(await panel.locator('li').count(),0);
 assert.equal(await f.page.locator('.tile').count(),1);assert.equal(f.audits().length,2,'no auto retry after service error');
 assert.equal(await panel.locator('[data-audit-retry]').evaluate(el=>el===document.activeElement),true);
 failed=false;await panel.getByRole('button',{name:'Részlet újrapróbálása'}).click();await f.state('missing','empty');
 assert.equal(f.audits()[1].query,f.audits()[2].query);assert.match(await panel.getByRole('status').textContent(),/2. részlet: 10 fájl/);
 assert.equal(await panel.locator('[data-audit-next]').isVisible(),false);assert.deepEqual(f.errors,[]);
});

test('invalid, destructive, cross-site and inconsistent diagnostics fail closed',async t=>{
 let payload=missing();
 const f=await fixture(t,(_req,res)=>json(res,{ok:true,data:payload}));
 const cases={missing:[
  {...missing(),repairAuthorized:true}, {...missing(),mode:'write'},missing([row()],{checked:0}),missing([row(),row()]),
  missing([{...row(),id:'invalid'}]),missing([{...row(),archived:'false'}]),missing([],{complete:false,nextCursor:id(100),checked:1}),
  missing([],{complete:true,nextCursor:id(100)})
 ],orphan:[
  {...orphan(),deletionAuthorized:true},orphan([key(1)],{registeredCount:1}),orphan(['sites/other/media/private']),
  orphan([key(1),key(1)]),orphan([key(1)],{siteId:''}),orphan([],{complete:false,nextCursor:'!bad'}),
  orphan([],{checked:101,registeredCount:101}),orphan(['sites/site-default/media/'])
 ]};
 for(const mode of ['missing','orphan'])for(payload of cases[mode]){
  await f.panels[mode].locator('[data-audit-start]').click();await f.state(mode,'error');
  assert.equal(await f.panels[mode].locator('li').count(),0);assert.equal(await f.panels[mode].locator('[data-audit-next]').isVisible(),false);
  assert.match(await f.panels[mode].getByRole('status').textContent(),/nem ellenőrizhető/);
 }
 assert.ok(f.calls.every(c=>c.method==='GET'));assert.deepEqual(f.errors,[]);
});

test('cursor cycles are rejected before another scan can be requested',async t=>{
 const cursor='repeated-cursor';
 const f=await fixture(t,(_req,res)=>json(res,{ok:true,data:orphan([],{checked:100,registeredCount:100,complete:false,nextCursor:cursor})}));
 const panel=f.panels.orphan;await panel.locator('[data-audit-start]').click();await f.state('orphan','empty');
 await panel.locator('[data-audit-next]').click();await f.state('orphan','error');
 assert.equal(f.audits().length,2);assert.equal(await panel.locator('[data-audit-next]').isVisible(),false);
});

test('untrusted names and keys are text, not executable markup or links',async t=>{
 const attack='<img src=x onerror="window.integrityInjected=1">';
 const f=await fixture(t,(_req,res,url)=>json(res,{ok:true,data:url.searchParams.has('missingAudit')?missing([{...row(),name:attack}]):orphan([key(attack)])}));
 for(const mode of ['missing','orphan']){await f.panels[mode].locator('[data-audit-start]').click();await f.state(mode,'findings');assert.match(await f.panels[mode].locator('li').textContent(),/onerror/);}
 assert.equal(await f.region.locator('img,a').count(),0);assert.equal(await f.page.evaluate(()=>window.integrityInjected),undefined);assert.deepEqual(f.errors,[]);
});

test('network failure stays local to its mode and needs a manual retry',async t=>{
 let offline=true;
 const f=await fixture(t,(_req,res,url)=>{
  if(url.searchParams.has('missingAudit')&&offline)return res.destroy();
  json(res,{ok:true,data:url.searchParams.has('missingAudit')?missing():orphan()});
 });
 await f.panels.missing.locator('[data-audit-start]').click();await f.state('missing','error');assert.match(await f.panels.missing.getByRole('status').textContent(),/Kapcsolati hiba/);
 await f.panels.orphan.locator('[data-audit-start]').click();await f.state('orphan','empty');
 assert.equal(await f.page.locator('.tile').count(),1);offline=false;await f.panels.missing.locator('[data-audit-retry]').click();await f.state('missing','empty');
 assert.ok(f.calls.every(c=>c.method==='GET'));assert.deepEqual(f.errors,[]);
});

test('a diagnostic response cannot steal focus from the library search',async t=>{
 let finish;
 const f=await fixture(t,(_req,res)=>{finish=()=>json(res,{ok:true,data:missing()});});
 await f.panels.missing.locator('[data-audit-start]').click();await f.state('missing','loading');
 const search=f.page.getByRole('searchbox',{name:'Keresés a médiafájlok között'});await search.focus();finish();await f.state('missing','empty');
 assert.equal(await search.evaluate(el=>el===document.activeElement),true);
});
