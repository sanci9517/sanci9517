import assert from 'node:assert/strict';
import test from 'node:test';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve,extname} from 'node:path';
import {chromium} from 'playwright';
import {renderScheduleWeek} from '../../public/editor-v2/core/schedule-week.js';
const root=resolve(import.meta.dirname,'../../public');

const week=renderScheduleWeek([{
 id:'fixture-live',title:'Közösségi játékest',platform:'Twitch',
 startsAt:'2026-11-16T12:00:00Z',endsAt:'2026-11-16T15:00:00Z',
 status:'live',url:'https://www.twitch.tv/sanci9517'
}],'2026-11-16',{showTitle:true,showPlatform:true,showTime:true,showEndTime:true,
 showStatus:true,showLink:true,showNotes:false,showArtwork:false},'2026-11-16');

const fixture=[
'<!doctype html><html lang="hu"><head><meta name="viewport" content="width=device-width, initial-scale=1">',
'<link rel="stylesheet" href="/assets/site.css"><link rel="stylesheet" href="/assets/sanci-showcase.css?v=20261116-schedule-cards-v1">',
'<style>.public-page-layout{display:block}.content-page{max-width:1180px;margin:auto}',
'.fixture-root{padding:12px;max-width:1160px;margin:auto}.fixture-hero{min-height:580px;padding:22px;background:linear-gradient(145deg,#0a1020,#341a27);border-radius:20px;display:flex;align-items:flex-end}',
'.fixture-copy{padding:22px;max-width:100%;width:100%;background:rgba(5,9,16,.76);display:flex;flex-direction:column;gap:12px}',
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
'<time class="visual-countdown-clock" datetime="2027-01-01T20:00:00+01:00"><span class="sanci-timer-cell"><span class="sanci-timer-value">01</span><span class="sanci-timer-unit">nap</span></span>',
'<span class="sanci-timer-cell"><span class="sanci-timer-value">03</span><span class="sanci-timer-unit">óra</span></span>',
'<span class="sanci-timer-cell"><span class="sanci-timer-value">25</span><span class="sanci-timer-unit">perc</span></span>',
'<span class="sanci-timer-cell"><span class="sanci-timer-value">12</span><span class="sanci-timer-unit">mp</span></span></time>',
'</div></div><div class="fixture-schedule">'+week+'</div></section></div></div></div>',
'<footer class="footer public-footer"><div class="wrap public-footer-grid">',
'<div class="public-footer-brand"><a class="brand" href="/">SANCI</a><p>Játsszunk egyet.</p></div>',
'<div class="public-footer-column"><strong>Tartalom</strong><a href="/p/twitch">Élő adás</a><a href="/p/youtube">YouTube</a><a href="/p/tiktok">TikTok</a><a href="/p/schedule">Menetrend</a></div>',
'<div class="public-footer-column"><strong>SANCI</strong><a href="/p/community">Közösség</a><a href="/p/about">Rólam</a><a href="/p/contact">Kapcsolat</a><a href="mailto:sandor.bogadi95@gmail.com">E-mail</a></div>',
'</div><div class="wrap footer-row public-footer-bottom"><span>© SANCI9517</span><span>Játék. Kikapcsolódás. Közösség.</span></div></footer>',
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
  if(req.url==='/'){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'}).end(fixture);return}
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
  const scheduleCard=page.locator('.sanci-week-event.is-live');
  assert.equal(await scheduleCard.count(),1,'the schedule component must render its authored live state');
  assert.equal(await scheduleCard.locator('.sanci-week-event-status').textContent(),'Élő');
  const cardPresentation=await scheduleCard.evaluate(el=>({
   radius:parseFloat(getComputedStyle(el).borderTopLeftRadius),
   shadow:getComputedStyle(el).boxShadow,
   linkHeight:el.querySelector('.sanci-week-event-link').getBoundingClientRect().height,
   timeVariant:getComputedStyle(el.querySelector('.sanci-week-event-time')).fontVariantNumeric
  }));
  assert.ok(cardPresentation.radius>=13,'schedule cards use the polished rounded treatment');
  assert.ok(cardPresentation.shadow!=='none','schedule cards retain separation against the weekly grid');
  assert.ok(cardPresentation.linkHeight>=44,'the stream link remains a comfortable touch target');
  assert.equal(cardPresentation.timeVariant,'tabular-nums','stream times align numerically');
  const composition=await page.evaluate(()=>{
   const hero=document.querySelector('[data-sanci-role="hero"]');
   const copy=document.querySelector('[data-sanci-role="hero-copy"]');
   const art=hero.getBoundingClientRect(),panel=copy.getBoundingClientRect();
   return {heroWidth:art.width,heroHeight:art.height,panelWidth:panel.width,
    revealedRight:art.right-panel.right,panelMaxWidth:getComputedStyle(copy).maxWidth};
  });
  if(width>=701){
   assert.ok(composition.panelWidth<=800.5,'desktop hero text panel must preserve the background artwork: '+JSON.stringify(composition));
   assert.ok(composition.panelWidth<composition.heroWidth,'desktop text panel may not cover the entire hero');
  }else{
   assert.ok(composition.panelWidth<=composition.heroWidth,'mobile hero copy must remain within its authored image');
  }
  if(width===1440)assert.ok(composition.revealedRight>=160,'wide composition must visibly reveal the source artwork beside the copy panel');
  if(width===1440){
   await scheduleCard.hover();
   await page.waitForFunction(()=>getComputedStyle(document.querySelector('.sanci-week-event.is-live')).transform!=='none');
   assert.notEqual(await scheduleCard.evaluate(el=>getComputedStyle(el).transform),'none',
    'fine-pointer hover provides a restrained schedule-card lift');
  }
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
  assert.ok(overflow<=2,'horizontal overflow at '+width+'px: '+overflow);
  if(width<=390){
   const footer=await page.evaluate(()=>{
    const columns=document.querySelectorAll('.public-footer-column');
    const grid=document.querySelector('.public-footer-grid');
    const rows=[...columns].map(c=>c.getBoundingClientRect());
    const targets=[...document.querySelectorAll('.public-footer-column a')];
    return {columns:getComputedStyle(grid).gridTemplateColumns.split(' ').length,
      aligned:Math.abs(rows[0].top-rows[1].top)<3,
      eightLinks:targets.length===8,
      minTapHeight:Math.min(...targets.map(a=>a.getBoundingClientRect().height))};
   });
   assert.equal(footer.columns,2,'SANCI mobile footer needs two content columns');
   assert.equal(footer.aligned,true,'footer link groups must share the same row');
   assert.equal(footer.eightLinks,true,'no original destination may disappear');
   assert.ok(footer.minTapHeight>=44,'footer tap targets must be >=44px');
  }
  const supportsSpotlight=await page.evaluate(()=>matchMedia('(hover: hover) and (pointer: fine)').matches&&!matchMedia('(prefers-reduced-motion: reduce)').matches);
  if(supportsSpotlight){
   await page.locator('[data-sanci-role="hero"]').scrollIntoViewIfNeeded();
   const rect=await page.locator('[data-sanci-role="hero"]').boundingBox();
   await page.mouse.move(rect.x+rect.width/2,rect.y+rect.height/2);
   const light=page.locator('.sanci-hero-spotlight');
   assert.equal(await light.count(),1,'fine-pointer hero receives one decorative light layer');
   await page.waitForFunction(()=>document.querySelector('.sanci-hero-spotlight')?.classList.contains('is-active'),null,{timeout:2000});
   await page.waitForTimeout(100);
   const spotlightState=await light.evaluate(el=>({active:el.classList.contains('is-active'),opacity:getComputedStyle(el).opacity,display:getComputedStyle(el).display,media:matchMedia('(hover: hover) and (pointer: fine)').matches}));
   assert.ok(parseFloat(spotlightState.opacity)>.25,'fine-pointer light visibly fades in after pointer entry: '+JSON.stringify(spotlightState));
   await page.mouse.move(0,0);
   await page.waitForFunction(()=>parseFloat(getComputedStyle(document.querySelector('.sanci-hero-spotlight')).opacity)<.01,null,{timeout:2000});
  }else assert.equal(await page.locator('.sanci-hero-spotlight').count(),0,'coarse pointers never receive hover-only decoration');
  assert.deepEqual(errors,[]);
  await page.close();
 }
 const reduced=await browser.newPage({viewport:{width:390,height:850},reducedMotion:'reduce'});
 await reduced.goto(origin+'/');
 await reduced.locator('[data-sanci-role="hero-copy"]').waitFor();
 assert.equal(await reduced.locator('[data-sanci-role="hero-copy"]').evaluate(el=>getComputedStyle(el).animationName),'none');
 assert.equal(await reduced.locator('.sanci-hero-spotlight').count(),0,'reduced-motion visitors are not wired to a hover effect');
 await reduced.locator('.sanci-week-event.is-live').hover();
 assert.equal(await reduced.locator('.sanci-week-event.is-live').evaluate(el=>getComputedStyle(el).transform),'none',
  'reduced-motion visitors do not receive the hover lift');
 await reduced.close();
 const touch=await browser.newPage({viewport:{width:390,height:850},isMobile:true,hasTouch:true});
 await touch.goto(origin+'/');
 await touch.locator('[data-sanci-role="hero-copy"]').waitFor();
 assert.equal(await touch.locator('.sanci-hero-spotlight').count(),0,'touch view has no mouse-only enhancement node');
 await touch.close();
});
