import assert from 'node:assert/strict';
import test from 'node:test';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve,extname} from 'node:path';
import {chromium} from 'playwright';

const root=resolve(import.meta.dirname,'../../public');
const html=`<!doctype html><html lang="hu"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="/assets/site.css"></head>
<body data-sanci-shell="1"><main style="max-width:760px;margin:0 auto;padding:18px;min-width:0">
<h1 style="font-size:24px">SANCI – Következő stream</h1>
<section id="slot" class="visual-countdown" style="width:100%;min-width:0"></section></main>
<script type="module">
import {renderCountdownContent,activateCountdowns} from '/editor-v2/core/countdown-content.js';
const root=document.getElementById('slot');
root.innerHTML=renderCountdownContent({version:1,title:'KÖVETKEZŐ STREAMIG',source:'next-stream',
targetISO:'',finishText:'Az adás kezdése elérkezett.',showSeconds:true});
activateCountdowns(root);
</script></body></html>`;

test('real Chromium renders the schedule-backed timer without phone overflow and with truthful empty state',async t=>{
 const server=createServer(async(req,res)=>{
  if(req.url==='/'||req.url?.startsWith('/clock')){
   res.writeHead(200,{'Content-Type':'text/html','Cache-Control':'no-store'}).end(html);return;
  }
  const path=resolve(root,'.'+new URL(req.url,'http://localhost').pathname);
  if(!path.startsWith(root+'/'))return res.writeHead(403).end();
  try{
   res.writeHead(200,{'Content-Type':{'.css':'text/css','.js':'text/javascript'}[extname(path)]||'application/octet-stream'});
   res.end(await readFile(path));
  }catch{res.writeHead(404).end()}
 });
 await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
 const browser=await chromium.launch({headless:true,
  executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),
  args:['--no-sandbox']});
 t.after(async()=>{await browser.close();await new Promise(ok=>server.close(ok))});
 const origin='http://127.0.0.1:'+server.address().port;
 const start=new Date(Date.now()+180000).toISOString();
 for(const width of [320,390,768,1440]){
  const page=await browser.newPage({viewport:{width,height:840},timezoneId:'Europe/Budapest'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/api/public/schedule?*',route=>route.fulfill({status:200,contentType:'application/json',
   body:JSON.stringify({ok:true,data:[{id:'future',title:'Forti',platform:'Twitch',
    startsAt:start,status:'scheduled',endsAt:null,url:null,notes:'',imageAssetId:null}]})}));
  await page.goto(origin+'/clock',{waitUntil:'load'});
  await page.locator('.sanci-timer-value').first().waitFor();
  assert.equal(await page.locator('.sanci-timer-value').count(),4);
  assert.equal(await page.locator('.visual-countdown-clock').getAttribute('datetime'),start);
  assert.match(await page.locator('.visual-countdown-details').textContent(),/Forti.*Twitch/);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
  assert.ok(overflow<=2,`horizontal overflow at ${width}px: ${overflow}`);
  assert.deepEqual(errors,[]);
  await page.close();
 }
 const empty=await browser.newPage({viewport:{width:390,height:820}});
 await empty.route('**/api/public/schedule?*',route=>route.fulfill({status:200,contentType:'application/json',
  body:JSON.stringify({ok:true,data:[]})}));
 await empty.goto(origin+'/clock');
 await empty.getByText('Még nincs meghirdetett adás.').waitFor();
 assert.equal(await empty.locator('.sanci-timer-value').count(),0);
 assert.match(await empty.locator('.visual-countdown-details').textContent(),/menetrendben/);
 await empty.close();
});
