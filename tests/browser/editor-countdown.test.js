import assert from 'node:assert/strict';
import test from 'node:test';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve,extname} from 'node:path';
import {chromium} from 'playwright';
import {createDocument} from '../../public/editor-v2/core/schema.js';
import {createEditorState,activePage} from '../../public/editor-v2/core/state.js';
import {execute} from '../../public/editor-v2/core/commands.js';
import {normalizeCountdownContent} from '../../public/editor-v2/core/countdown-content.js';

for(const [width,timezoneId,gap,overlapISO,overlapLocal] of [[390,'Europe/Budapest','2030-03-31T02:30','2030-10-27T01:30:42.123Z','2030-10-27T02:30:42.123'],[1366,'America/New_York','2030-03-10T02:30','2030-11-03T06:30:42.123Z','2030-11-03T01:30:42.123']])test(`Countdown local-time validation and publication at ${width}px in ${timezoneId}`,async t=>{
 const model=createEditorState(createDocument()),pageId=model.document.activePageId,root=activePage(model).rootId;
 execute(model,{type:'element.add',payload:{type:'countdown',parentId:root}});
 const id=model.selection.primaryId;
 const eventISO='2030-12-31T20:30:42.123Z';
 let draft=structuredClone(model.document),published=structuredClone(draft),version=1;
 const posts=[],assetRoot=resolve(import.meta.dirname,'../../public');
 const server=createServer(async(req,res)=>{
  const url=new URL(req.url,'http://localhost');
  const json=data=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(data))};
  if(url.pathname==='/api/admin/pages')return json({ok:true,data:url.searchParams.get('archived')==='1'?[]:[{id:pageId,slug:'test',title:'Test',content:draft,revision:version,isPublished:true}]});
  if(url.pathname==='/api/admin/editor'){
   if(req.method==='GET')return json({ok:true,data:{page:{id:pageId,document:draft,publishedRevisionId:'published'},revisions:[{id:'revision-'+version,version}]}});
   let body='';for await(const chunk of req)body+=chunk;
   const request=JSON.parse(body);posts.push(request);
   if(request.publish){try{normalizeCountdownContent(request.document.pages[pageId].nodes[id].props.countdown);}catch(error){res.statusCode=400;return json({ok:false,error:{code:'INVALID_COUNTDOWN_CONTENT',message:error.message}});}}
   draft=structuredClone(request.document);version++;
   if(request.publish)published=structuredClone(draft);
   return json({ok:true,data:{pageId,version,revisionId:'revision-'+version,published:Boolean(request.publish)}});
  }
  if(url.pathname==='/api/public/pages')return json({ok:true,data:{id:pageId,slug:'test',title:'Test',description:'',content:published.pages[pageId]}});
  if(url.pathname==='/api/public/navigation')return json({ok:true,data:{items:[]}});
  if(url.pathname==='/api/integrations/twitch/connection')return json({ok:true,data:{connected:false}});
  if(url.pathname.startsWith('/api/'))return json({ok:true,data:{siteName:'Test'}});
  const path=url.pathname==='/p/test'?'/visual-page.html':url.pathname,file=resolve(assetRoot,'.'+path);
  if(!file.startsWith(assetRoot+'/'))return res.writeHead(403).end();
  try{res.setHeader('content-type',{'.html':'text/html','.js':'text/javascript','.css':'text/css'}[extname(file)]||'application/octet-stream');res.end(await readFile(file))}
  catch{res.writeHead(404).end()}
 });
 await new Promise(done=>server.listen(0,'127.0.0.1',done));
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
 t.after(async()=>{await browser.close();await new Promise(done=>server.close(done))});
 const base='http://127.0.0.1:'+server.address().port;
 const editor=await browser.newPage({viewport:{width,height:900},timezoneId}),viewer=await browser.newPage({viewport:{width,height:900},timezoneId});
 editor.setDefaultTimeout(7000);viewer.setDefaultTimeout(7000);
 const errors=[];editor.on('pageerror',e=>errors.push('editor:'+e.message));viewer.on('pageerror',e=>errors.push('public:'+e.message));
 await editor.goto(base+'/editor-v2/index.html');await viewer.goto(base+'/p/test');
 const selected=editor.locator('.node[data-node-id="'+id+'"]');
 await selected.evaluate(el=>el.click());
 if(await editor.locator('#rightDock').evaluate(el=>el.classList.contains('closed')))await editor.locator('#openInspector').click();
 await editor.locator('.inspector-tabs button').nth(1).click();
 assert.equal(await editor.locator('.countdown-inspector h3').textContent(),'Visszaszámláló');
 const field=editor.locator('.countdown-inspector');
 const setText=async(name,value)=>{const input=field.getByRole('textbox',{name});await input.fill(value);await input.press('Tab')};
 await setText('Esemény neve','Élő premier <script>alert(1)</script>');
 await setText('Lejáratkor megjelenő üzenet','Már élőben!');
 const localDate=await editor.evaluate(iso=>{
  const d=new Date(iso),pad=x=>String(x).padStart(2,'0');
  return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())+'T'+pad(d.getHours())+':'+pad(d.getMinutes())+':42.123';
 },eventISO);
 await field.locator('input[type="datetime-local"]').fill(localDate);
 await field.locator('input[type="datetime-local"]').press('Tab');
 const beforeGap=await selected.locator('.visual-countdown-clock').getAttribute('datetime');
 await field.locator('input[type="datetime-local"]').fill(gap);await field.locator('input[type="datetime-local"]').press('Tab');
 assert.equal(await field.locator('input[type="datetime-local"]').getAttribute('aria-invalid'),'true','a DST gap must not silently move the event');
 assert.equal(await selected.locator('.visual-countdown-clock').getAttribute('datetime'),beforeGap);
 await editor.keyboard.press('Control+z');assert.equal(await field.locator('input[type="datetime-local"]').inputValue(),gap,'invalid local input survives blocked Undo');
 for(const action of ['#save','#publish']){await editor.locator(action).click();assert.equal(posts.length,0,'invalid local time blocks all API writes');}
 await field.locator('input[type="datetime-local"]').fill(localDate);await field.locator('input[type="datetime-local"]').press('Tab');
 assert.equal(posts.length,0,'Inspector change never saves');
 assert.match(await selected.locator('.visual-countdown-clock').textContent(),/nap/);
 assert.equal(await selected.locator('.visual-countdown-heading').textContent(),'Élő premier <script>alert(1)</script>');
 await field.locator('input[type="checkbox"]').uncheck();
 await editor.keyboard.press('Control+z');
 assert.equal(await field.locator('input[type="checkbox"]').isChecked(),true);
 await editor.keyboard.press('Control+Shift+z');
 assert.equal(await field.locator('input[type="checkbox"]').isChecked(),false);
 await editor.locator('#save').click();
 await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
 assert.equal(posts.at(-1).publish,false);
 assert.equal(draft.pages[pageId].nodes[id].props.countdown.targetISO,eventISO);
 await viewer.reload();
 assert.match(await viewer.locator('.visual-countdown-clock').textContent(),/Állíts be egy időpontot/,'Save cannot alter the previously published unconfigured Countdown');
 await editor.locator('#publish').click();
 await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
 assert.equal(posts.at(-1).publish,true);
 await viewer.reload();
 const clock=viewer.locator('.visual-countdown-clock');
 assert.match(await clock.textContent(),/nap/);
 assert.doesNotMatch(await clock.textContent(),/ mp/,'seconds may be hidden');
 assert.equal(await clock.getAttribute('datetime'),eventISO);
 assert.equal(await viewer.locator('.visual-countdown-heading').textContent(),'Élő premier <script>alert(1)</script>');
 assert.equal(await viewer.locator('.visual-countdown-heading script').count(),0,'public text escaped');
 await viewer.setViewportSize({width:390,height:800});await viewer.reload();
 assert.ok((await clock.boundingBox()).width>50);
 // A loaded deadline retains its seconds/milliseconds even after an unchanged change event.
 await editor.reload();await selected.evaluate(el=>el.click());
 if(await editor.locator('#rightDock').evaluate(el=>el.classList.contains('closed')))await editor.locator('#openInspector').click();
 await editor.locator('.inspector-tabs button').nth(1).click();
 const date=field.locator('input[type="datetime-local"]');
 assert.equal(await date.inputValue(),localDate);await date.focus();await date.dispatchEvent('change');
 await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
 assert.equal(posts.at(-1).document.pages[pageId].nodes[id].props.countdown.targetISO,eventISO);
 // Load a server draft at the later instant of an autumn overlap. Merely
 // focusing/saving it must not choose the earlier occurrence of the same clock time.
 draft.pages[pageId].nodes[id].props.countdown.targetISO=overlapISO;
 await editor.reload();await selected.evaluate(el=>el.click());
 if(await editor.locator('#rightDock').evaluate(el=>el.classList.contains('closed')))await editor.locator('#openInspector').click();
 await editor.locator('.inspector-tabs button').nth(1).click();
 assert.equal(await date.inputValue(),overlapLocal);await date.focus();await date.dispatchEvent('change');
 await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
 assert.equal(posts.at(-1).document.pages[pageId].nodes[id].props.countdown.targetISO,overlapISO,'unchanged overlap preserves the saved offset occurrence');
 const writes=posts.length;await date.fill('2101-01-01T12:00');await date.press('Tab');
 assert.equal(await date.getAttribute('aria-invalid'),'true');
 for(const action of ['#save','#publish']){await editor.locator(action).click();assert.equal(posts.length,writes);}
 await date.press('Escape');assert.equal(await date.inputValue(),overlapLocal);assert.equal(await date.getAttribute('aria-invalid'),null);
 assert.equal(await editor.locator('#rightDock').evaluate(el=>el.classList.contains('closed')),false,'Escape repairs the field without closing the mobile panel');
 await viewer.reload();assert.equal(await clock.getAttribute('datetime'),eventISO,'draft edits cannot change the published instant');
 await date.fill('');await date.press('Tab');await editor.locator('#save').click();
 await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
 assert.equal(posts.at(-1).document.pages[pageId].nodes[id].props.countdown.targetISO,'','an incomplete draft remains saveable');
 const emptyWrites=posts.length;await editor.locator('#publish').click();
 await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent==='Mentési hiba');
 assert.equal(posts.length,emptyWrites+1);assert.equal(posts.at(-1).publish,true,'the existing server publication guard rejects an incomplete draft');
 await viewer.reload();assert.equal(await clock.getAttribute('datetime'),eventISO);
 assert.deepEqual(errors,[]);
});
