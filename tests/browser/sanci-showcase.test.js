import assert from 'node:assert/strict';
import test from 'node:test';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve,extname} from 'node:path';
import {chromium} from 'playwright';
const root=resolve(import.meta.dirname,'../../public');

const fixture=[
'<!doctype html><html lang="hu"><head><meta name="viewport" content="width=device-width, initial-scale=1">',
'<link rel="stylesheet" href="/assets/site.css"><link rel="stylesheet" href="/assets/sanci-showcase.css">',
'<style>.public-page-layout{display:block}.content-page{max-width:1180px;margin:auto}',
'.fixture-root{padding:12px;max-width:1160px;margin:auto}.fixture-hero{min-height:580px;padding:22px;background:linear-gradient(145deg,#0a1020,#341a27);border-radius:20px;display:flex;align-items:flex-end}',
'.fixture-copy{padding:22px;max-width:650px;width:100%;background:rgba(5,9,16,.76);display:flex;flex-direction:column;gap:12px}',
'.fixture-copy h1{font-size:clamp(29px,5vw,65px);line-height:1.07;overflow-wrap:anywhere}',
'.fixture-signature{font-family:"Segoe Script",cursive;font-size:clamp(43px,6vw,69px);font-style:italic;line-height:1.1}',
'.fixture-cta{display:flex;flex-wrap:wrap;gap:8px}.fixture-cta a{padding:13px;background:#162033;color:white;border:1px solid #546076;border-radius:10px}',
'.fixture-feature{padding:30px 12px}',
'@media(max-width:700px){.fixture-hero{min-height:480px;padding:12px}.fixture-copy{padding:17px}.fixture-cta{flex-direction:column}}',
'</style></head><body class="sanci-editorial-page" data-sanci-shell="1" data-sanci-showcase="depth-v2" data-sanci-page="home">',
'<div class="public-page-layout"><main class="content-page"><div class="content-canvas">',
'<div data-node-id="root" class="fixture-root"><section data-node-id="hero" class="fixture-hero"><div data-node-id="copy" class="fixture-copy">',
'<div data-node-id="signature" class="fixture-signature">Sanci</div>',
'<div>SANCI9517 / JÁTÉK ÉS KIKAPCSOLÓDÁS</div><h1 class="visual-heading">JÁTSSZUNK EGYET. A TÖBBI ALAKUL.</h1>',
'<p>Fortnite, Hearthstone és indie kalandok. Néha győzelem, néha teljes káosz.</p>',
'<div class="fixture-cta"><a href="/p/twitch" data-node-id="cta">NÉZD AZ ÉLŐ ADÁST</a><a href="/p/about" data-node-id="about">KI AZ A SANCI?</a></div>',
'</div></section><section data-node-id="feature" class="fixture-feature"><h2>A KÖVETKEZŐ KÖR ITT KEZDŐDIK.</h2>',
'<div data-node-id="clock"><div class="visual-countdown-content" data-countdown-source="next-stream">',
'<strong class="visual-countdown-heading">KÖVETKEZŐ STREAMIG</strong>',
'<time class="visual-countdown-clock"><span class="sanci-timer-cell"><span class="sanci-timer-value">01</span><span class="sanci-timer-unit">nap</span></span>',
'<span class="sanci-timer-cell"><span class="sanci-timer-value">03</span><span class="sanci-timer-unit">óra</span></span>',
'<span class="sanci-timer-cell"><span class="sanci-timer-value">25</span><span class="sanci-timer-unit">perc</span></span>',
'<span class="sanci-timer-cell"><span class="sanci-timer-value">12</span><span class="sanci-timer-unit">mp</span></span></time>',
'</div></div></section></div></div></div>',
'<script type="module">',
'import {decorateSanciShowcase} from "/assets/sanci-showcase.js";',
'const nodes={root:{id:"root",type:"root",children:["hero","feature"]},hero:{id:"hero",type:"container",parentId:"root",children:["copy"],style:{backgroundAssetId:"image"}},',
'copy:{id:"copy",type:"container",parentId:"hero",children:["signature","cta","about"]},signature:{id:"signature",type:"text",parentId:"copy",metadata:{sanciSignature:1}},',
'cta:{id:"cta",type:"button",parentId:"copy"},about:{id:"about",type:"button",parentId:"copy"},',
'feature:{id:"feature",type:"container",parentId:"root",children:["clock"]},clock:{id:"clock",type:"countdown",parentId:"feature",props:{countdown:{source:"next-stream"}}}};',
'decorateSanciShowcase(document.querySelector(".content-canvas"),{nodes,metadata:{sanciSignatureVersion:1}},{slug:"home",enabled:true});',
'</script></body></html>'
].join('');

test('SANCI autograph, CTA symbols and countdown remain responsive and reduced-motion-safe',async t=>{
 const server=createServer(async(req,res)=>{
  if(req.url==='/'){res.writeHead(200,{'Content-Type':'text/html'}).end(fixture);return}
  const url=new URL(req.url,'http://localhost');
  const file=resolve(root,'.'+url.pathname);
  if(!file.startsWith(root+'/')){res.writeHead(403).end();return}
  try{const data=await readFile(file);res.writeHead(200,{'Content-Type':extname(file)==='.css'?'text/css':'text/javascript'}).end(data)}
  catch{res.writeHead(404).end()}
 });
 await new Promise(done=>server.listen(0,'127.0.0.1',done));
 const browser=await chromium.launch({headless:true,
  executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),
  args:['--no-sandbox']});
 t.after(async()=>{await browser.close();await new Promise(done=>server.close(done))});
 const origin='http://127.0.0.1:'+server.address().port;
 for(const width of [320,390,768,1440]){
  const page=await browser.newPage({viewport:{width,height:850}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(origin+'/',{waitUntil:'load'});
  await page.locator('[data-sanci-role="signature"]').waitFor();
  assert.equal(await page.locator('.sanci-cta-symbol').count(),2);
  assert.equal(await page.locator('[data-sanci-role="hero"]').count(),1);
  assert.equal(await page.locator('[data-sanci-role="next-stream"]').count(),1);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
  assert.ok(overflow<=2,'horizontal overflow at '+width+'px: '+overflow);
  assert.deepEqual(errors,[]);
  await page.close();
 }
 const reduced=await browser.newPage({viewport:{width:390,height:850},reducedMotion:'reduce'});
 await reduced.goto(origin+'/');
 await reduced.locator('[data-sanci-role="hero-copy"]').waitFor();
 assert.equal(await reduced.locator('[data-sanci-role="hero-copy"]').evaluate(el=>getComputedStyle(el).animationName),'none');
 await reduced.close();
});