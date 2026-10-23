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
function json(res,body,status=200){res.writeHead(status,{'content-type':'application/json'});res.end(JSON.stringify(body));}

async function fixture(t,onStatus,width=390){
 const root=resolve(import.meta.dirname,'../../public'),calls=[],pageErrors=[];
 let statusCalls=0;
 const server=createServer(async(req,res)=>{
  const url=new URL(req.url,'http://localhost');
  calls.push({path:url.pathname,query:url.search,method:req.method});
  if(url.pathname==='/api/admin/media'){
   if(req.method!=='GET')return json(res,{ok:false},405);
   if(url.searchParams.has('retentionStatus'))return onStatus(req,res,++statusCalls);
   return json(res,{ok:true,data:{assets:[{id:id(1001),name:'Fixture.png',mimeType:'image/png',sizeBytes:20,altText:'',previewUrl:'/image.png'}]}});
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

for(const width of [390,1366])test(`read-only retention loading, empty, all states and local dates at ${width}px`,async t=>{
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
 assert.equal(await f.panel.getByRole('button').count(),1,'read-only view must not expose write actions');
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
