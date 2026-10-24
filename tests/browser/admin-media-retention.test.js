import assert from 'node:assert/strict';
import test from 'node:test';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, extname } from 'node:path';
import { chromium } from 'playwright';

const id=n=>`00000000-0000-4000-8000-${String(n).padStart(12,'0')}`;
const request=(state='requested',n=1)=>({id:id(n),assetId:id(1000+n),state,requestedAt:'2026-10-23 10:00:00',notBefore:'2026-11-23T10:00:00.000Z',updatedAt:'2026-10-23T12:00:00+02:00',attemptCount:0,permanentDeletionAuthorized:false});
const data=(requests=[],complete=true)=>({migrationActive:true,requests,complete,permanentDeletionAuthorized:false});
function loseResponse(res){
 // Deliver headers and a partial body first: a pre-response socket close lets Chromium
 // transparently retry a transport request before fetch observes a response.
 res.writeHead(200,{'content-type':'application/json','content-length':'999'});res.write('{"ok":');setTimeout(()=>res.destroy(),20);
}
function json(res,body,status=200){res.writeHead(status,{'content-type':'application/json'});res.end(JSON.stringify(body));}

async function fixture(t,onStatus,width=390,{onMedia,archived=false}={}){
 const root=resolve(import.meta.dirname,'../../public'),calls=[],pageErrors=[];
 let statusCalls=0;
 const server=createServer(async(req,res)=>{
  const url=new URL(req.url,'http://localhost');
  calls.push({path:url.pathname,query:url.search,method:req.method,origin:req.headers.origin,fetchSite:req.headers["sec-fetch-site"]});
  if(url.pathname==='/api/admin/media'){
   if(url.searchParams.has('retentionStatus'))return onStatus(req,res,++statusCalls);
   if(onMedia && (req.method!=='GET'||url.searchParams.has('deletePreflight')))return onMedia(req,res,url);
   if(req.method!=='GET')return json(res,{ok:false},405);
   return json(res,{ok:true,data:{assets:[{id:id(1001),name:'Fixture.png',mimeType:'image/png',sizeBytes:20,altText:'',archivedAt:archived?'2026-10-01 10:00:00':null,previewUrl:'/image.png'}]}});
  }
  if(url.pathname==='/image.png'){res.writeHead(200,{'content-type':'image/png'});return res.end(Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l5sAAAAASUVORK5CYII=','base64'));}
  const file=resolve(root,'.'+url.pathname);
  if(!file.startsWith(root+'/'))return res.writeHead(403).end();
  try{const contents=await readFile(file);res.writeHead(200,{'content-type':{'.html':'text/html','.js':'text/javascript'}[extname(file)]||'application/octet-stream'});res.end(contents);}
  catch{res.writeHead(404).end();}
 });
 await new Promise(done=>server.listen(0,'127.0.0.1',done));
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
 t.after(async()=>{await browser.close();await new Promise(done=>server.close(done));});
 const page=await browser.newPage({viewport:{width,height:900},timezoneId:'Europe/Budapest'});page.setDefaultTimeout(5000);
 page.on('pageerror',e=>pageErrors.push(e.message));
 await page.goto(`http://127.0.0.1:${server.address().port}/admin-media.html`);
 const panel=page.getByRole('region',{name:'Adatmegőrzési kérelmek'});
 const refresh=panel.getByRole('button',{name:'Állapot frissítése'});
 const state=async wanted=>page.waitForFunction(w=>document.querySelector('#mediaRetentionPanel').dataset.state===w,wanted);
 return {page,panel,refresh,state,calls,pageErrors,statusCount:()=>statusCalls};
}

for(const width of [390,1366])test(`retention loading, empty, all states and local dates at ${width}px`,async t=>{
 let finish;
 const f=await fixture(t,(_req,res,n)=>{if(n===1){finish=()=>json(res,{ok:true,data:data()});return;}json(res,{ok:true,data:data(['requested','quarantined','revalidated','cancelled','deleted','blocked'].map((s,i)=>request(s,i+1)))});},width);
 await f.page.locator('.tile').waitFor();
 assert.equal(await f.refresh.isDisabled(),true);
 assert.match(await f.panel.getByRole('status').textContent(),/betöltése/);
 assert.equal(await f.panel.getAttribute('aria-busy'),'true');
 finish();await f.state('empty');
 assert.equal(await f.panel.getByRole('status').textContent(),'Nincs adatmegőrzési kérelem.');
 await f.refresh.focus();await f.refresh.press('Enter');await f.state('ready');
 assert.equal(await f.panel.locator('.retention-card').count(),6);
 for(const label of ['Kérelem rögzítve','Várakozási idő','Újraellenőrizve','Visszavonva','Törölve','Elakadt'])await f.panel.getByText(label,{exact:true}).waitFor();
 const first=f.panel.locator('.retention-card').first();
 assert.equal(await first.locator('time').first().getAttribute('datetime'),'2026-10-23T10:00:00.000Z');
 assert.match(await first.locator('time').first().textContent(),/12:00/);
 assert.equal(await f.refresh.evaluate(el=>el===document.activeElement),true);
 assert.equal(await f.panel.getAttribute('aria-busy'),'false');
 assert.equal(await f.panel.getByRole('button',{name:'Kérelem visszavonása',exact:true}).count(),4,'only cancellable states expose a confirmation action');
 assert.ok(f.calls.every(c=>c.method==='GET'),'opening/refreshing status only reads');
 assert.equal(f.statusCount(),2);
 assert.deepEqual(f.pageErrors,[]);
 assert.ok(await f.page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'retention panel must not overflow');
 await f.page.screenshot({path:`/tmp/media-retention-${width}.png`,fullPage:true});
});

test('refresh failures remove stale results, keep library usable, and require explicit retry',async t=>{
 const f=await fixture(t,(_req,res,n)=>{
  if(n===1)return json(res,{ok:true,data:data([request()])});
  if(n===2)return json(res,{ok:false,error:{code:'RETENTION_MIGRATION_NOT_ACTIVE'}},503);
  return json(res,{ok:true,data:data()});
 });
 await f.state('ready');await f.refresh.click();await f.state('error');
 assert.equal(await f.panel.locator('.retention-card').count(),0);
 assert.match(await f.panel.getByRole('status').textContent(),/jelenleg nem érhetők el/);
 assert.equal(await f.page.locator('.tile').count(),1,'independent status failure must preserve asset library');
 assert.equal(f.statusCount(),2,'error must not auto-retry');
 await f.refresh.click();await f.state('empty');assert.equal(f.statusCount(),3);
 assert.ok(f.calls.every(c=>c.method==='GET'));assert.deepEqual(f.pageErrors,[]);
});

test('incomplete first hundred is labelled as partial',async t=>{
 const f=await fixture(t,(_req,res)=>json(res,{ok:true,data:data(Array.from({length:100},(_,i)=>request('requested',i+1)),false)}));
 await f.state('ready');assert.equal(await f.panel.locator('.retention-card').count(),100);
 assert.equal(await f.panel.locator('.retention-notice').textContent(),'Az első 100 kérelem látható; a lista nem teljes.');
 assert.equal(await f.panel.locator('.retention-notice').isVisible(),true);
 assert.ok(f.calls.every(c=>c.method==='GET'));
});

test('invalid, dangerous or inconsistent responses fail closed without stale rows or HTML injection',async t=>{
 let payload=data([request()]);
 const f=await fixture(t,(_req,res)=>json(res,{ok:true,data:payload}));await f.state('ready');
 const cases=[
  {...data(),migrationActive:false}, {...data(),permanentDeletionAuthorized:true},
  data([request('unexpected')]), {...data(),complete:undefined}, data([],false),
  data([{...request(),requestedAt:'2026-02-30 10:00:00'}]), data([request(),request()]),
  data([{...request(),permanentDeletionAuthorized:true}]),
  data([{...request(),assetId:'<img src=x onerror="window.retentionInjected=1">'}])
 ];
 for(payload of cases){await f.refresh.click();await f.state('error');assert.equal(await f.panel.locator('.retention-card').count(),0);assert.match(await f.panel.getByRole('status').textContent(),/nem ellenőrizhetők/);}
 assert.equal(await f.page.evaluate(()=>window.retentionInjected),undefined);
 assert.ok(f.calls.every(c=>c.method==='GET'));assert.deepEqual(f.pageErrors,[]);
});

test('network failure is visible, does not break the library, and permits manual recovery',async t=>{
 let offline=true;
 const f=await fixture(t,(_req,res)=>offline?res.destroy():json(res,{ok:true,data:data()}));
 await f.state('error');assert.match(await f.panel.getByRole('status').textContent(),/Ellenőrizd a kapcsolatot/);
 await f.page.locator('.tile').waitFor();offline=false;await f.refresh.click();await f.state('empty');
 assert.ok(f.calls.every(c=>c.method==='GET'));assert.deepEqual(f.pageErrors,[]);
});


const preview=()=>({assetId:id(1001),archived:true,objectPresent:true,references:0,usageComplete:true,eligibleForRetention:true,
 retentionMigrationActive:true,existingRetentionRequest:null,retentionRequestAvailable:true,permanentDeletionAuthorized:false,
 retentionPreview:{assetId:id(1001),siteId:'site-default',objectKey:'sites/site-default/media/fixture',state:'requested',notBefore:'2026-11-23T10:00:00.000Z',finalDeletionAuthorized:false},retentionPreviewReason:null});
const created=()=>({id:id(1),assetId:id(1001),state:'requested',notBefore:request().notBefore,created:true,permanentDeletionAuthorized:false});
const mutations=f=>f.calls.filter(c=>c.method!=='GET');
const action=f=>f.page.getByRole('group',{name:'Fixture.png adatmegőrzése'});

for(const width of [390,1366])test(`archived request needs preflight and explicit confirmation, prevents double submit at ${width}px`,async t=>{
 let rows=[],finish;
 const f=await fixture(t,(_req,res)=>json(res,{ok:true,data:data(rows)}),width,{archived:true,onMedia:(req,res)=>{
  if(req.method==='GET')return json(res,{ok:true,data:preview()});
  finish=()=>{rows=[request()];json(res,{ok:true,data:created()},201);};
 }});
 await f.state('empty');const group=action(f),check=group.getByRole('button',{name:'Adatmegőrzés előellenőrzése'});
 await check.click();const confirm=group.getByRole('button',{name:'Kérelem rögzítésének megerősítése'});
 await confirm.waitFor();assert.equal(mutations(f).length,0);
 assert.match(await group.getByRole('status').textContent(),/automatikus törlés nem indul/);
 assert.equal(await f.page.getByRole('button',{name:'Médiafájl visszaállítása',exact:true}).isDisabled(),true);
 assert.equal(await confirm.evaluate(el=>el===document.activeElement),true);
 await group.getByRole('button',{name:'Mégse',exact:true}).click();assert.equal(mutations(f).length,0);
 assert.equal(await check.evaluate(el=>el===document.activeElement),true);
 await check.click();await confirm.click();await f.page.waitForFunction(()=>document.querySelector('.retention-action [role=status]').textContent.includes('újbóli'));
 await f.page.waitForTimeout(30);assert.equal(mutations(f).length,1);
 assert.equal(await confirm.isDisabled(),true);assert.equal(await group.getByRole('button',{name:'Mégse'}).isDisabled(),true);
 finish();await f.state('ready');await group.getByText('Kérelem rögzítve. A fájl változatlanul megmaradt.',{exact:true}).waitFor();
 assert.equal(mutations(f).length,1);const sent=mutations(f)[0];assert.equal(sent.method,'POST');assert.match(sent.query,/retentionRequest=1/);
 assert.ok(sent.origin.startsWith('http://127.0.0.1:'));assert.equal(sent.fetchSite,'same-origin');
 assert.equal(await f.panel.locator('.retention-card').count(),1);assert.equal(await check.isEnabled(),true);
 assert.ok(await f.page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.deepEqual(f.pageErrors,[]);
 await group.screenshot({path:`/tmp/media-retention-request-${width}.png`});
});

test('preflight blocks unsafe, unavailable, existing and malformed cases and never writes',async t=>{
 let payload=preview();
 const f=await fixture(t,(_req,res)=>json(res,{ok:true,data:data()}),390,{archived:true,onMedia:(_req,res)=>json(res,{ok:true,data:payload})});
 await f.state('empty');const group=action(f),check=group.getByRole('button',{name:'Adatmegőrzés előellenőrzése'});
 const cases=[
  {...preview(),retentionMigrationActive:false,retentionRequestAvailable:false},
  {...preview(),retentionRequestAvailable:false,retentionPreview:null,retentionPreviewReason:'ASSET_IN_USE',references:1,eligibleForRetention:false},
  {...preview(),retentionRequestAvailable:false,retentionPreview:null,retentionPreviewReason:'USAGE_INCOMPLETE',usageComplete:false,eligibleForRetention:false},
  {...preview(),permanentDeletionAuthorized:true}, {...preview(),assetId:id(555)},
  {...preview(),retentionPreview:{...preview().retentionPreview,finalDeletionAuthorized:true}},
  {...preview(),retentionPreview:null}, {...preview(),objectPresent:false},
  {...preview(),retentionPreview:{...preview().retentionPreview,notBefore:'2026-02-30T10:00:00.000Z'}},
  ...['requested','quarantined','revalidated','blocked','cancelled','deleted'].map(state=>({...preview(),retentionRequestAvailable:false,existingRetentionRequest:{id:id(1),state,notBefore:request().notBefore}}))
 ];
 for(payload of cases){await check.click();await f.page.waitForFunction(()=>!document.querySelector('.retention-action>button').disabled);assert.equal(await group.getByRole('button',{name:'Kérelem rögzítésének megerősítése'}).count(),0);}
 assert.equal(mutations(f).length,0);assert.deepEqual(f.pageErrors,[]);
});

test('lost create response is reconciled with GET and never automatically posted again',async t=>{
 let rows=[];
 const f=await fixture(t,(_req,res)=>json(res,{ok:true,data:data(rows)}),390,{archived:true,onMedia:(req,res)=>{
  if(req.method==='GET')return json(res,{ok:true,data:rows.length?{...preview(),retentionRequestAvailable:false,existingRetentionRequest:{id:id(1),state:'requested',notBefore:request().notBefore}}:preview()});
  rows=[request()];loseResponse(res);
 }});
 await f.state('empty');const group=action(f),check=group.getByRole('button',{name:'Adatmegőrzés előellenőrzése'});
 await check.click();await group.getByRole('button',{name:'Kérelem rögzítésének megerősítése'}).click();await f.state('ready');
 assert.match(await group.getByRole('status').textContent(),/eredménye bizonytalan/);assert.equal(mutations(f).length,1);
 await check.click();await group.getByText(/már tartozik kérelem/).waitFor();assert.equal(mutations(f).length,1);assert.equal(await group.getByRole('button',{name:'Kérelem rögzítésének megerősítése'}).count(),0);
});

test('changed precondition or invalid mutation acknowledgement needs fresh preflight',async t=>{
 let malformed=false;
 const f=await fixture(t,(_req,res)=>json(res,{ok:true,data:data()}),390,{archived:true,onMedia:(req,res)=>{
  if(req.method==='GET')return json(res,{ok:true,data:preview()});
  if(malformed)return json(res,{ok:true,data:{...created(),permanentDeletionAuthorized:true}});
  json(res,{ok:false,error:{code:'RETENTION_PRECONDITION_CHANGED'}},409);
 }});
 await f.state('empty');const group=action(f),check=group.getByRole('button',{name:'Adatmegőrzés előellenőrzése'});
 for(const expected of [/előfeltételek megváltoztak/,/válasza nem ellenőrizhető/]){
  await check.click();await group.getByRole('button',{name:'Kérelem rögzítésének megerősítése'}).click();
  await f.page.waitForFunction(()=>!document.querySelector('.retention-action>button').disabled);
  assert.match(await group.getByRole('status').textContent(),expected);assert.equal(await group.getByRole('button',{name:'Kérelem rögzítésének megerősítése'}).count(),0);malformed=true;
 }
 assert.equal(mutations(f).length,2);assert.deepEqual(f.pageErrors,[]);
});

test('cancellation needs confirmation, locks controls and handles idempotent success without file deletion',async t=>{
 let rows=[request()],finish;
 const f=await fixture(t,(_req,res)=>json(res,{ok:true,data:data(rows)}),390,{onMedia:(_req,res)=>{
  finish=()=>{rows=[request('cancelled')];json(res,{ok:true,data:{id:id(1),state:'cancelled',changed:false,permanentDeletionAuthorized:false}});};
 }});
 await f.state('ready');const cancel=f.panel.getByRole('button',{name:'Kérelem visszavonása',exact:true});
 await cancel.click();await f.panel.getByRole('button',{name:'Mégse'}).click();assert.equal(mutations(f).length,0);
 await cancel.click();const confirm=f.panel.getByRole('button',{name:'Visszavonás megerősítése'});await confirm.click();
 await f.page.waitForFunction(()=>document.querySelector('#mediaRetentionPanel> [role=status]').textContent==='Kérelem visszavonása…');
 assert.equal(await f.refresh.isDisabled(),true);assert.equal(await confirm.isDisabled(),true);
 assert.equal(mutations(f).length,1);const sent=mutations(f)[0];assert.equal(sent.method,'DELETE');assert.match(sent.query,/retentionRequest=1&requestId=/);assert.doesNotMatch(sent.query,/[?&]id=/);
 finish();await f.state('ready');await f.panel.getByText('Visszavonva',{exact:true}).waitFor();assert.equal(await cancel.count(),0);
 assert.match(await f.panel.getByRole('status').textContent(),/médiafájl megmaradt/);assert.equal(await f.refresh.evaluate(el=>el===document.activeElement),true);
 assert.equal(mutations(f).length,1);assert.deepEqual(f.pageErrors,[]);
});

test('lost cancellation response refreshes status once without retrying the mutation',async t=>{
 let rows=[request()];
 const f=await fixture(t,(_req,res)=>json(res,{ok:true,data:data(rows)}),390,{onMedia:(_req,res)=>{rows=[request('cancelled')];loseResponse(res);}});
 await f.state('ready');await f.panel.getByRole('button',{name:'Kérelem visszavonása',exact:true}).click();
 await f.panel.getByRole('button',{name:'Visszavonás megerősítése'}).click();
 await f.panel.getByText('Visszavonva',{exact:true}).waitFor();
 assert.match(await f.panel.getByRole('status').textContent(),/nem ismétlődik meg automatikusan/);assert.equal(mutations(f).length,1);assert.equal(f.statusCount(),2);
});

test('detached preflight cannot create confirmation controls or a request',async t=>{
 let finish;
 const f=await fixture(t,(_req,res)=>json(res,{ok:true,data:data()}),390,{archived:true,onMedia:(_req,res)=>{finish=()=>json(res,{ok:true,data:preview()});}});
 await f.state('empty');await action(f).getByRole('button',{name:'Adatmegőrzés előellenőrzése'}).click();
 await f.page.getByRole('combobox',{name:'Médiatár nézet'}).selectOption('archived');
 await f.page.waitForFunction(()=>!document.querySelector('.retention-action>button').disabled);
 finish();await f.page.waitForTimeout(80);
 assert.equal(await f.page.getByRole('button',{name:'Kérelem rögzítésének megerősítése'}).count(),0);assert.equal(mutations(f).length,0);assert.deepEqual(f.pageErrors,[]);
});


test('cancellation rejects conflicts and invalid acknowledgements, and clears stale rows if refresh fails',async t=>{
 let invalidResponse=false,unavailable=false;
 const f=await fixture(t,(_req,res)=>unavailable?json(res,{ok:false,error:{code:'RETENTION_MIGRATION_NOT_ACTIVE'}},503):json(res,{ok:true,data:data([request()])}),390,{onMedia:(_req,res)=>{
  if(invalidResponse){unavailable=true;return json(res,{ok:true,data:{id:id(99),state:'cancelled',changed:true,permanentDeletionAuthorized:false}});}
  json(res,{ok:false,error:{code:'RETENTION_STATE_CONFLICT'}},409);
 }});
 await f.state('ready');
 for(const expected of [/állapota megváltozott/,/válasza nem ellenőrizhető/]){
  await f.panel.getByRole('button',{name:'Kérelem visszavonása',exact:true}).click();
  await f.panel.getByRole('button',{name:'Visszavonás megerősítése'}).click();
  await f.state(invalidResponse?'error':'ready');assert.match(await f.panel.getByRole('status').textContent(),expected);invalidResponse=true;
 }
 assert.equal(await f.panel.locator('.retention-card').count(),0);assert.equal(mutations(f).length,2);
 unavailable=false;await f.refresh.click();await f.state('ready');assert.deepEqual(f.pageErrors,[]);
});
