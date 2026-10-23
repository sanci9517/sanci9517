import {exerciseComposition} from './helpers/composition.js';
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
 const mirror=`.node[data-node-id="${id}"]`;
 await exerciseComposition({page:editor,input:field.getByRole('textbox',{name:'Esemény neve'}),selector:mirror+' .visual-countdown-heading',before:'Élő premier <script>alert(1)</script>',final:'Végleges premier',posts,otherInput:field.locator('input[type="datetime-local"]'),restart:true}).catch(error=>{assert.equal(posts.length,0,'unfinished Countdown composition cannot reach the Editor API');throw error;});
 await setText('Esemény neve','Élő premier <script>alert(1)</script>');
 await exerciseComposition({page:editor,input:field.getByRole('textbox',{name:'Lejáratkor megjelenő üzenet'}),selector:mirror+' .visual-countdown-content',attribute:'data-countdown-finish',before:'Már élőben!',final:'Végleges lejárati üzenet',posts,restart:true,otherInput:field.getByRole('textbox',{name:'Esemény neve'}),attemptBlocked:async()=>{
  await field.locator('input[type="checkbox"]').click();assert.equal(await field.locator('input[type="checkbox"]').isChecked(),true,'blocked toggle restores its view');
  const date=field.locator('input[type="datetime-local"]');
  await date.fill('2031-01-01T12:00');await date.press('Tab');
  assert.equal(await selected.locator('.visual-countdown-clock').getAttribute('datetime'),eventISO,'changing a date cannot discard a pending text composition');
  assert.equal(await date.getAttribute('aria-invalid'),'true');await date.press('Escape');assert.equal(await date.inputValue(),localDate);
 }});
 await setText('Lejáratkor megjelenő üzenet','Már élőben!');
 const beforeGap=await selected.locator('.visual-countdown-clock').getAttribute('datetime');
 await field.locator('input[type="datetime-local"]').fill(gap);await field.locator('input[type="datetime-local"]').press('Tab');
 assert.equal(await field.locator('input[type="datetime-local"]').getAttribute('aria-invalid'),'true','a DST gap must not silently move the event');
 assert.equal(await selected.locator('.visual-countdown-clock').getAttribute('datetime'),beforeGap);
 await editor.keyboard.press('Control+z');assert.equal(await field.locator('input[type="datetime-local"]').inputValue(),gap,'invalid local input survives blocked Undo');
 const title=field.getByRole('textbox',{name:'Esemény neve'});
 await title.focus();await editor.keyboard.press('Control+s');assert.equal(posts.length,0,'text focus cannot forget an invalid date guard');
 await title.fill('Nem menthető cím');
 assert.equal(await selected.locator('.visual-countdown-heading').textContent(),'Élő premier <script>alert(1)</script>','invalid date blocks unrelated model changes');
 assert.equal(await title.getAttribute('aria-invalid'),'true');await title.press('Escape');
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
 if(width===390){
  const recovery=await editor.evaluate(async()=>{
   const {renderCountdownInspector}=await import('/editor-v2/ui/countdown-inspector.js');
   const {defaultCountdownContent}=await import('/editor-v2/core/countdown-content.js');
   const results=[];
   for(const mode of ['false','throw']){
    const original={...defaultCountdownContent(),title:'Mentett cím',targetISO:'2030-12-31T20:30:42.123Z'};
    const node={id:'countdown-recovery',props:{countdown:structuredClone(original)}};let allow=false,accepted,guard;
    const root=renderCountdownInspector(node,next=>{if(!allow){if(mode==='throw')throw Error('Fixture rejection');return false;}if(!guard())return false;accepted=structuredClone(next);return true;},{pending:fn=>{guard=fn;}});
    document.querySelector('#inspectorBody').append(root);
    const title=root.querySelector('[aria-label="Esemény neve"]'),finish=root.querySelector('[aria-label="Lejáratkor megjelenő üzenet"]'),date=root.querySelector('[type="datetime-local"]');
    title.focus();title.value='Elutasított';title.dispatchEvent(new InputEvent('input',{bubbles:true}));
    const rejected=title.hasAttribute('aria-invalid')&&!guard()&&!accepted;
    title.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));const escaped=title.value==='Mentett cím'&&guard();
    allow=true;title.value='Új cím';title.dispatchEvent(new Event('change',{bubbles:true}));
    date.value='2031-01-02T12:00';date.dispatchEvent(new Event('change',{bubbles:true}));
    const dateISO=accepted.targetISO;finish.focus();finish.value='Új üzenet';finish.dispatchEvent(new InputEvent('input',{bubbles:true}));
    const fresh=accepted.title==='Új cím'&&accepted.finishText==='Új üzenet'&&accepted.targetISO===dateISO&&dateISO!==original.targetISO&&guard();
    const unchanged=JSON.stringify(node.props.countdown)===JSON.stringify(original);root.remove();
    const locked=renderCountdownInspector({...node,locked:true},()=>{throw Error('Locked Countdown changed');});document.querySelector('#inspectorBody').append(locked);
    const lockedSafe=[...locked.querySelectorAll('input,select,textarea,button')].every(el=>el.disabled);locked.remove();
    results.push({mode,rejected,escaped,fresh,unchanged,lockedSafe});
   }return results;
  });
  for(const result of recovery)for(const key of ['rejected','escaped','fresh','unchanged','lockedSafe'])assert.equal(result[key],true,JSON.stringify(result));
 }
 assert.deepEqual(errors,[]);
});
