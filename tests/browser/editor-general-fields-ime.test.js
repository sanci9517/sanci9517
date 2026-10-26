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
import {SCHEDULE_EMPTY_TEXT_MAX} from '../../public/editor-v2/core/schedule-schema.js';

for(const width of [390,1366])test(`general Inspector name and Schedule empty text composition at ${width}px`,async t=>{
 const model=createEditorState(createDocument()),pageId=model.document.activePageId;
 execute(model,{type:'element.add',payload:{type:'schedule',parentId:activePage(model).rootId}});
 const id=model.selection.primaryId;
 execute(model,{type:'element.update',payload:{nodeId:id,patch:{name:'Mentett elem'}}});
 execute(model,{type:'schedule.config.set',payload:{nodeId:id,patch:{statuses:['completed'],emptyText:'Mentett adásrend'}}});
 let draft=structuredClone(model.document),published=structuredClone(draft),version=1;
 const posts=[],errors=[],dialogs=[],publicDir=resolve(import.meta.dirname,'../../public');
 const server=createServer(async(req,res)=>{
  const url=new URL(req.url,'http://localhost'),json=data=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(data));};
  if(url.pathname==='/api/admin/pages')return json({ok:true,data:url.searchParams.get('archived')==='1'?[]:[{id:pageId,slug:'test',title:'Test',content:draft,revision:version,isPublished:true}]});
  if(url.pathname==='/api/admin/editor'){
   if(req.method==='GET')return json({ok:true,data:{page:{id:pageId,document:draft,publishedRevisionId:'published'},revisions:[{id:'revision-'+version,version}]}});
   let body='';for await(const chunk of req)body+=chunk;const request=JSON.parse(body);posts.push(request);draft=structuredClone(request.document);version++;
   if(request.publish)published=structuredClone(draft);return json({ok:true,data:{pageId,version,revisionId:'revision-'+version,published:Boolean(request.publish)}});
  }
  if(url.pathname==='/api/public/pages')return json({ok:true,data:{id:pageId,slug:'test',title:'Test',content:published.pages[pageId]}});
  if(url.pathname==='/api/public/schedule')return json({ok:true,data:[]});
  if(url.pathname==='/api/public/navigation')return json({ok:true,data:{items:[]}});
  if(url.pathname==='/api/integrations/twitch/connection')return json({ok:true,data:{connected:false}});
  if(url.pathname.startsWith('/api/'))return json({ok:true,data:{siteName:'Test'}});
  const file=resolve(publicDir,'.'+(url.pathname==='/p/test'?'/visual-page.html':url.pathname));if(!file.startsWith(publicDir+'/'))return res.writeHead(403).end();
  try{res.setHeader('content-type',{'.html':'text/html','.js':'text/javascript','.css':'text/css'}[extname(file)]||'application/octet-stream');res.end(await readFile(file));}catch{res.writeHead(404).end();}
 });
 await new Promise(done=>server.listen(0,'127.0.0.1',done));
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
 t.after(async()=>{await browser.close();await new Promise(done=>server.close(done));});
 const base='http://127.0.0.1:'+server.address().port,editor=await browser.newPage({viewport:{width,height:900}}),viewer=await browser.newPage({viewport:{width,height:900}});
 for(const page of [editor,viewer]){page.setDefaultTimeout(7000);page.setDefaultNavigationTimeout(12000);page.on('pageerror',error=>errors.push(error.message));}
 editor.on('dialog',async dialog=>{dialogs.push(dialog.message());await dialog.dismiss();});
 await editor.goto(base+'/editor-v2/index.html');await viewer.goto(base+'/p/test');
 await editor.locator(`.node[data-node-id="${id}"]`).evaluate(el=>el.click());
 if(await editor.locator('#rightDock').evaluate(el=>el.classList.contains('closed')))await editor.locator('#openInspector').click();
 const group=editor.locator('.schedule-inspector .inspector-group-title');if(await group.getAttribute('aria-expanded')==='false')await group.click();
 const name=()=>editor.getByRole('textbox',{name:'Elem neve',exact:true}),empty=()=>editor.getByRole('textbox',{name:'Üres állapot szövege',exact:true});
 const nameContract=editor.locator('.field[data-property-id="advanced.nodeName"]');
 assert.equal(await nameContract.getAttribute('data-property-command'),'element.update');
 assert.equal(await nameContract.getAttribute('data-property-key'),'name');
 const scheduleRoutes=await editor.locator('.schedule-inspector [data-inspector-command]').evaluateAll(rows=>rows.map(row=>({command:row.dataset.inspectorCommand,key:row.dataset.inspectorKey})));
 assert.deepEqual(scheduleRoutes.map(route=>route.key),['mode','order','limit','statuses','showTitle','showPlatform','showTime','showEndTime','showStatus','showNotes','showLink','emptyText']);
 assert.ok(scheduleRoutes.every(route=>route.command==='schedule.config.set'),'each Schedule Inspector field exposes its actual config command');
 const headSelector=`.node[data-node-id="${id}"] > .node-head > span`,emptySelector=`.node[data-node-id="${id}"] .schedule-preview-empty`;
 await exerciseComposition({page:editor,input:name(),selector:headSelector,before:'Mentett elem',final:'Végleges belső név',posts,restart:true,otherInput:empty()});
 await exerciseComposition({page:editor,input:empty(),selector:emptySelector,before:'Mentett adásrend',final:'Végleges üres adásrend',posts,restart:true,otherInput:name()});
 await editor.locator('.inspector-tabs button').nth(1).click();
 if(await group.getAttribute('aria-expanded')==='false')await group.click();
 await exerciseComposition({page:editor,input:empty(),selector:emptySelector,before:'Végleges üres adásrend',final:'Tartalom fül végleges szövege',posts,restart:true});
 await editor.keyboard.press('Control+z');assert.equal(await empty().inputValue(),'Végleges üres adásrend');
 await editor.locator('.inspector-tabs button').nth(0).click();
 if(await group.getAttribute('aria-expanded')==='false')await group.click();
 assert.equal(posts.length,0);
 await name().evaluate(el=>{el.focus();el.dispatchEvent(new CompositionEvent('compositionstart',{bubbles:true}));el.value='Csak compositionend';el.dispatchEvent(new CompositionEvent('compositionend',{bubbles:true}));});
 await editor.waitForFunction(selector=>document.querySelector(selector).textContent==='Csak compositionend',headSelector);
 await editor.keyboard.press('Control+z');assert.equal(await name().inputValue(),'Végleges belső név');
 for(const invalid of ['   ','x'.repeat(SCHEDULE_EMPTY_TEXT_MAX+1)]){
  await empty().fill(invalid);assert.equal(await empty().getAttribute('aria-invalid'),'true');
  await name().focus();
  for(const action of ['#save','#publish']){await editor.locator(action).click();assert.equal(posts.length,0,'invalid Schedule text remains guarded after focus moves');}
  assert.equal(await editor.locator(emptySelector).textContent(),'Végleges üres adásrend');
  await empty().press('Escape');assert.equal(await empty().inputValue(),'Végleges üres adásrend');
 }
 await editor.locator('.schedule-inspector [data-inspector-key="mode"] select').selectOption('all');
 await editor.locator('.schedule-inspector [data-inspector-key="order"] select').selectOption('desc');
 const scheduleLimit=editor.locator('.schedule-inspector [data-inspector-key="limit"] input');await scheduleLimit.fill('12');await scheduleLimit.press('Tab');
 await editor.locator('.schedule-inspector [data-inspector-key="statuses"] input[data-status="scheduled"]').evaluate(el=>el.click());
 await editor.locator('.schedule-inspector [data-inspector-key="showTitle"] input').evaluate(el=>el.click());
 const save=async publish=>{await editor.locator(publish?'#publish':'#save').click();await editor.waitForFunction(pub=>document.querySelector('#saveStatus').textContent.startsWith(pub?'Publikálva':'Mentve'),publish);};
 await save(false);
 assert.equal(draft.pages[pageId].nodes[id].name,'Végleges belső név');assert.equal(draft.pages[pageId].nodes[id].props.schedule.emptyText,'Végleges üres adásrend');
 assert.equal(draft.pages[pageId].nodes[id].props.schedule.mode,'all');assert.equal(draft.pages[pageId].nodes[id].props.schedule.order,'desc');
 assert.equal(draft.pages[pageId].nodes[id].props.schedule.limit,12);assert.deepEqual(draft.pages[pageId].nodes[id].props.schedule.statuses,['scheduled','completed']);
 assert.equal(draft.pages[pageId].nodes[id].props.schedule.showTitle,false);
 await viewer.reload();assert.equal(await viewer.locator('.visual-schedule-empty').textContent(),'Mentett adásrend','Save preserves the public snapshot');
 await save(true);await viewer.reload();assert.equal(await viewer.locator('.visual-schedule-empty').textContent(),'Végleges üres adásrend','Publish updates the public empty text');
 assert.equal(await viewer.getByText('Végleges belső név',{exact:true}).count(),0,'internal node names are not public content');
 await editor.locator('.inspector-lock-toggle').check();assert.equal(await name().isEditable(),false);assert.equal(await empty().isEditable(),false);
 await editor.locator('.inspector-tabs button').nth(1).click();assert.equal(await empty().isEditable(),false);
 assert.deepEqual(errors,[]);assert.deepEqual(dialogs,[]);
 await editor.screenshot({path:`/tmp/editor-general-fields-ime-${width}.png`,fullPage:true});
});
