import assert from 'node:assert/strict';
import test from 'node:test';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve,extname} from 'node:path';
import {chromium} from 'playwright';
import {createDocument,createPage} from '../../public/editor-v2/core/schema.js';
import {createEditorState,activePage} from '../../public/editor-v2/core/state.js';
import {execute} from '../../public/editor-v2/core/commands.js';

for(const width of [390,1366])test(`layer rename pending draft survives save, publish and selection at ${width}px`,async t=>{
 const model=createEditorState(createDocument()),pageId=model.document.activePageId;
 execute(model,{type:'element.add',payload:{type:'schedule',parentId:activePage(model).rootId}});
 const id=model.selection.primaryId;
 execute(model,{type:'element.update',payload:{nodeId:id,patch:{name:'Mentett elem'}}});
 execute(model,{type:'schedule.config.set',payload:{nodeId:id,patch:{statuses:['completed'],emptyText:'Mentett adásrend'}}});
 execute(model,{type:'element.add',payload:{type:'text',parentId:activePage(model).rootId}});
 const textId=model.selection.primaryId;
 execute(model,{type:'selection.set',payload:{ids:[id],primaryId:id}});
 const otherPage=createPage({name:'Másik',slug:'other'}),otherDocument=createDocument(otherPage);
 let draft=structuredClone(model.document),published=structuredClone(draft),version=2,hold=false,releaseResponse=null,onRequest=()=>{};
 let holdLoad=false,releaseLoad=null,onLoad=()=>{},holdRollback=false,releaseRollback=null,onRollback=()=>{},rollbackRequests=0;
 t.after(()=>{releaseResponse?.();releaseLoad?.();releaseRollback?.()});
 const posts=[],errors=[],publicDir=resolve(import.meta.dirname,'../../public');
 const server=createServer(async(req,res)=>{
  const url=new URL(req.url,'http://localhost'),json=data=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(data));};
  if(url.pathname==='/api/admin/pages')return json({ok:true,data:url.searchParams.get('archived')==='1'?[]:[{id:pageId,slug:'test',title:'Test',content:draft,revision:version,isPublished:true},{id:otherPage.id,slug:'other',title:'Másik',content:otherDocument,revision:1,isPublished:false}]});
  if(url.pathname==='/api/admin/editor'){
   if(req.method==='GET'){
    if(url.searchParams.get('pageId')===otherPage.id){if(holdLoad){holdLoad=false;await new Promise(resolve=>{releaseLoad=resolve;onLoad()});releaseLoad=null}return json({ok:true,data:{page:{id:otherPage.id,document:otherDocument},revisions:[{id:'other-revision',version:1}]}})}
    return json({ok:true,data:{page:{id:pageId,document:draft,publishedRevisionId:'published'},revisions:[{id:'revision-'+version,version},{id:'revision-old',version:1}]}});
   }
   if(req.method==='PUT'){rollbackRequests++;if(holdRollback){holdRollback=false;await new Promise(resolve=>{releaseRollback=resolve;onRollback()});releaseRollback=null}return json({ok:true,data:{}})}
   let body='';for await(const chunk of req)body+=chunk;const request=JSON.parse(body);posts.push(request);draft=structuredClone(request.document);version++;
   if(hold){hold=false;await new Promise(resolve=>{releaseResponse=resolve;onRequest()});releaseResponse=null}
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
 const base='http://127.0.0.1:'+server.address().port,mobile=width<=850,contextOptions={viewport:{width,height:900},isMobile:mobile,hasTouch:mobile},editor=await browser.newPage(contextOptions);
 for(const page of [editor]){page.setDefaultTimeout(7000);page.setDefaultNavigationTimeout(12000);page.on('pageerror',error=>errors.push(error.message));}
 await editor.goto(base+'/editor-v2/index.html');
 await editor.locator(`.node[data-node-id="${id}"]`).evaluate(el=>el.click());
 if(await editor.locator('.rail-btn[data-tab="layers"]').isVisible())await editor.locator('.rail-btn[data-tab="layers"]').click();else await editor.evaluate(()=>{window.sanciEditor.showLeftTab('layers');window.sanciEditor.openPanel('left')});
 const row=editor.locator(`.layer-row[data-node-id="${id}"]`), field=editor.getByRole('textbox',{name:'Réteg neve',exact:true});
 const open=async()=>{if(mobile)await editor.locator(`.layer-rename[data-node-id="${id}"]`).tap();else {await row.focus();await row.press('F2');}};
 await open();await field.fill('Mentés billentyűvel');await field.press('Control+s');
 await editor.waitForFunction(()=>document.querySelector('#revision')?.textContent?.includes('3'));
 assert.equal(posts.length,1);assert.equal(posts[0].document.pages[pageId].nodes[id].name,'Mentés billentyűvel');assert.equal(posts[0].publish,false);assert.equal(published.pages[pageId].nodes[id].name,'Mentett elem');
 await open();await field.fill('Kijelölés után is megmarad');
 await editor.locator('.layer-row').first().click();
 assert.equal(await row.locator('strong').textContent(),'Kijelölés után is megmarad');assert.equal(posts.length,1);
 await open();await field.fill('   ');
 const selectedBefore=await editor.locator('.layer-row.active').getAttribute('data-node-id');
 await editor.locator(`.node[data-node-id="${textId}"]`).dispatchEvent('dblclick');
 assert.equal(await editor.locator('.layer-row.active').getAttribute('data-node-id'),selectedBefore,'invalid rename prevents the Canvas double-click from changing selection');
 assert.equal(await field.getAttribute('aria-invalid'),'true');
 if(mobile){
  await editor.locator(`.layer-row[data-node-id="${textId}"]`).dispatchEvent('pointerdown',{pointerType:'touch',clientX:10,clientY:10});
  await editor.waitForTimeout(550);
  assert.equal(await editor.locator('#mobileMultiSelectBar').isHidden(),true,'invalid rename prevents mobile long-press selection');
  assert.equal(await editor.locator('.layer-row.active').getAttribute('data-node-id'),selectedBefore);
 }
 await editor.locator('#unpublish').evaluate(button=>button.click());
 assert.equal(posts.length,1,'invalid pending rename blocks Unpublish before its request');
 await editor.locator('#save').click();
 assert.equal(posts.length,1,'invalid pending rename blocks Save');assert.equal(await field.getAttribute('aria-invalid'),'true');
 await field.fill('Félkész IME');await field.evaluate(input=>{input.dispatchEvent(new CompositionEvent('compositionstart',{bubbles:true}));input.dispatchEvent(new InputEvent('input',{bubbles:true,isComposing:true}));});
 await editor.locator('#save').click();assert.equal(posts.length,1,'active composition blocks Save');assert.equal(await field.count(),1);
 await field.evaluate(input=>{input.dispatchEvent(new CompositionEvent('compositionend',{bubbles:true}));input.value='Publikált név';input.dispatchEvent(new InputEvent('input',{bubbles:true,isComposing:false}));});
 await editor.evaluate(()=>new Promise(resolve=>requestAnimationFrame(resolve)));
 await editor.locator('#publish').click();await editor.waitForFunction(()=>document.querySelector('#revision')?.textContent?.includes('4'));
 assert.equal(posts.length,2);assert.equal(posts[1].publish,true);assert.equal(posts[1].document.pages[pageId].nodes[id].name,'Publikált név');assert.equal(published.pages[pageId].nodes[id].name,'Publikált név');
 hold=true;const requestStarted=new Promise(resolve=>{onRequest=resolve});
 await open();await field.fill('Első mentési változat');await field.press('Control+s');await requestStarted;
 await open();await field.fill('Mentés közben szerkesztve');releaseResponse();
 await editor.waitForFunction(()=>document.querySelector('#revision')?.textContent?.includes('5'));
 assert.equal(posts[2].document.pages[pageId].nodes[id].name,'Első mentési változat');
 assert.equal(await row.locator('strong').textContent(),'Mentés közben szerkesztve','the later edit survives the earlier save response');
 assert.match(await editor.locator('#saveStatus').textContent(),/további helyi módosítások/);
 await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#revision')?.textContent?.includes('6'));
 assert.equal(posts[3].document.pages[pageId].nodes[id].name,'Mentés közben szerkesztve');
 holdLoad=true;const loadStarted=new Promise(resolve=>{onLoad=resolve});
 await editor.locator('#pageSelect').evaluate((select,id)=>{select.value=id;select.dispatchEvent(new Event('change',{bubbles:true}))},otherPage.id);await loadStarted;
 await open();await field.fill('Betöltés közbeni név');releaseLoad();
 await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.includes('betöltése megszakadt'));
 assert.equal(await row.locator('strong').textContent(),'Betöltés közbeni név','an in-flight page load cannot discard a later rename');
 await open();await field.fill('Visszaállítás előtt mentendő');
 await editor.locator('.revision-restore').last().evaluate(button=>button.click());
 assert.equal(rollbackRequests,0,'rollback waits until the pending layer rename is saved');
 assert.match(await editor.locator('#saveStatus').textContent(),/Előbb mentsd a rétegnév/);
 await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#revision')?.textContent?.includes('7'));
 holdRollback=true;const rollbackStarted=new Promise(resolve=>{onRollback=resolve});
 editor.once('dialog',dialog=>dialog.accept());await editor.locator('.revision-restore').last().evaluate(button=>button.click());await rollbackStarted;
 await open();await field.fill('Visszaállítás közbeni név');releaseRollback();
 await editor.waitForFunction(()=>!document.querySelector('#revisionConflict')?.hidden);
 assert.equal(await row.locator('strong').textContent(),'Visszaállítás közbeni név','rollback response preserves a later pending rename');
 assert.deepEqual(errors,[]);
});
