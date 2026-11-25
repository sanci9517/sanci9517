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
import {ICON_CHOICES,iconById} from '../../public/editor-v2/core/icon-options.js';
import {renderElementContent} from '../../public/editor-v2/core/element-content.js';
import {authoredNodeHtml} from '../../public/editor-v2/core/authored-content.js';

test('a one-slide authored carousel exposes no-op-free controls and leaves arrow keys to the page',async t=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
 let server,page;
 t.after(async()=>{
  if(server?.listening)server.closeAllConnections();
  await browser.close().catch(()=>{});
  if(server?.listening)await new Promise(done=>server.close(done));
 });
 const markup=authoredNodeHtml({id:'authored-one-slide',type:'carousel',metadata:{contentVersion:1},props:{ariaLabel:'Bevezető kép',items:[
  {src:'/one-slide.jpg',alt:'Egyetlen kép',caption:'Egy kép'}
 ]}});
 const publicRoot=resolve(import.meta.dirname,'../../public');
 server=createServer(async(req,res)=>{
  const url=new URL(req.url,'http://localhost');
  if(url.pathname==='/harness.html'){
   res.setHeader('content-type','text/html; charset=utf-8');
   return res.end(`<!doctype html><main id="page-content">${markup}</main><script type="module" src="/harness.js"></script>`);
  }
  if(url.pathname==='/harness.js'){
   res.setHeader('content-type','text/javascript');
   return res.end("import {initContentInteractions} from '/editor-v2/core/authored-content.js';initContentInteractions(document.querySelector('#page-content'));");
  }
  const file=resolve(publicRoot,'.'+url.pathname);
  if(!file.startsWith(publicRoot+'/'))return res.writeHead(403).end();
  try{res.setHeader('content-type',extname(file)==='.js'?'text/javascript':'application/octet-stream');res.end(await readFile(file))}
  catch{return res.writeHead(404).end()}
 });
 await new Promise(done=>server.listen(0,'127.0.0.1',done));
 page=await browser.newPage({viewport:{width:390,height:844}});
 await page.goto(`http://127.0.0.1:${server.address().port}/harness.html`);
 const region=page.locator('.creator-carousel[role="region"]');
 await region.waitFor();
 assert.equal(await region.getAttribute('aria-label'),'Bevezető kép','the single-slide region retains the Inspector-authored name');
 const regionId=await region.getAttribute('id');
 assert.ok(regionId,'the navigable region has a DOM ID');
 const previous=page.locator('.creator-carousel-controls [data-carousel-step="-1"]');
 const next=page.locator('.creator-carousel-controls [data-carousel-step="1"]');
 assert.equal(await previous.getAttribute('aria-controls'),regionId,'the previous control identifies its carousel region');
 assert.equal(await next.getAttribute('aria-controls'),regionId,'the next control identifies its carousel region');
 assert.equal(await previous.isDisabled(),true,'a one-slide Carousel has no active previous action');
 assert.equal(await next.isDisabled(),true,'a one-slide Carousel has no active next action');
 await page.evaluate(()=>document.addEventListener('keydown',event=>{
  if(event.key==='ArrowRight')window.__singleSlideArrowDefaultPrevented=event.defaultPrevented;
 }));
 await region.focus();await region.press('ArrowRight');
 assert.equal(await page.evaluate(()=>window.__singleSlideArrowDefaultPrevented),false,
  'a one-slide Carousel does not consume a page-level arrow key for an impossible move');
});

test('a multi-slide authored carousel keeps button and keyboard navigation active',async t=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
 let server,page;
 t.after(async()=>{
  if(server?.listening)server.closeAllConnections();
  await browser.close().catch(()=>{});
  if(server?.listening)await new Promise(done=>server.close(done));
 });
 const markup=authoredNodeHtml({id:'authored-two-slides',type:'carousel',metadata:{contentVersion:1},props:{ariaLabel:'Kiemelt képek',items:[
  {src:'/first.jpg',alt:'Első kép'},{src:'/second.jpg',alt:'Második kép'}
 ]}});
 const publicRoot=resolve(import.meta.dirname,'../../public');
 server=createServer(async(req,res)=>{
  const url=new URL(req.url,'http://localhost');
  if(url.pathname==='/harness.html'){
   res.setHeader('content-type','text/html; charset=utf-8');
   return res.end(`<!doctype html><style>.creator-carousel{display:flex;overflow-x:auto;width:300px;scroll-behavior:auto}.creator-carousel figure{box-sizing:border-box;flex:0 0 100%;width:100%;margin:0}.creator-carousel img{display:block;width:100%;height:100px}</style><main id="page-content">${markup}</main><script type="module" src="/harness.js"></script>`);
  }
  if(url.pathname==='/harness.js'){
   res.setHeader('content-type','text/javascript');
   return res.end("import {initContentInteractions} from '/editor-v2/core/authored-content.js';initContentInteractions(document.querySelector('#page-content'));");
  }
  const file=resolve(publicRoot,'.'+url.pathname);
  if(!file.startsWith(publicRoot+'/'))return res.writeHead(403).end();
  try{res.setHeader('content-type',extname(file)==='.js'?'text/javascript':'application/octet-stream');res.end(await readFile(file))}
  catch{return res.writeHead(404).end()}
 });
 await new Promise(done=>server.listen(0,'127.0.0.1',done));
 page=await browser.newPage({viewport:{width:390,height:844}});
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto(`http://127.0.0.1:${server.address().port}/harness.html`);
 const region=page.locator('.creator-carousel[role="region"]');
 await region.waitFor();
 assert.equal(await region.getAttribute('aria-label'),'Kiemelt képek');
 const regionId=await region.getAttribute('id');
 assert.ok(regionId,'the navigable region has a DOM ID');
 assert.equal(await region.locator('figure').count(),2);
 const previous=page.locator('.creator-carousel-controls [data-carousel-step="-1"]');
 const next=page.locator('.creator-carousel-controls [data-carousel-step="1"]');
 assert.equal(await previous.getAttribute('aria-controls'),regionId,'the previous control identifies its carousel region');
 assert.equal(await next.getAttribute('aria-controls'),regionId,'the next control identifies its carousel region');
 assert.equal(await previous.isDisabled(),false,'a multi-slide Carousel keeps previous available');
 assert.equal(await next.isDisabled(),false,'a multi-slide Carousel keeps next available');
 const readLeft=()=>region.evaluate(track=>track.scrollLeft);
 await region.focus();await region.press('ArrowRight');
 assert.ok(await readLeft()>0,'ArrowRight advances the authored carousel');
 await region.press('Home');
 assert.equal(await readLeft(),0,'Home returns to the first authored slide');
 await region.press('End');
 assert.ok(await readLeft()>0,'End advances to the last authored slide');
 await previous.click();
 assert.equal(await readLeft(),0,'the previous button returns to the first authored slide');
 await next.click();
 assert.ok(await readLeft()>0,'the next button advances to the second authored slide');
});

test('single-open authored accordion DOM groups stay isolated for sanitization-colliding node IDs',async t=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
 t.after(()=>browser.close());
 const page=await browser.newPage();
 const html=id=>authoredNodeHtml({id,type:'accordion',metadata:{contentVersion:1},props:{singleOpen:true,openFirst:true,items:[
  {title:'Első',text:'Első tartalom'},{title:'Második',text:'Második tartalom'}
 ]}});
 await page.setContent(`<main>${html('a/b')}${html('a?b')}</main>`);
 const groups=page.locator('.creator-accordion'),first=groups.nth(0),second=groups.nth(1);
 const names=await page.locator('.creator-accordion details').evaluateAll(nodes=>nodes.map(node=>node.getAttribute('name')));
 assert.equal(names.length,4);assert.ok(names.every(Boolean));
 assert.equal(names[0],names[1],'details in one authored widget share a native exclusive group');
 assert.equal(names[2],names[3],'details in the other widget share a native exclusive group');
 assert.notEqual(names[0],names[2],'sanitization-colliding node IDs must map to different native groups');
 await first.locator('summary').nth(1).click();
 assert.equal(await first.locator('details[open]').count(),1,'the first widget enforces its own single-open setting');
 assert.ok(await second.locator('details').first().evaluate(node=>node.open),'opening another widget does not close this widget');
 await second.locator('summary').nth(1).click();
 assert.equal(await second.locator('details[open]').count(),1,'the second widget also enforces its own single-open setting');
 assert.ok(await first.locator('details').nth(1).evaluate(node=>node.open),'opening the second widget does not close the first widget');
});

test('structured accordion exposes its Inspector name as a public accessible group',async t=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
 t.after(()=>browser.close());
 const page=await browser.newPage();
 const model={version:1,items:[{label:'Kérdés',content:'Válasz'}]};
 const named=renderElementContent('accordion',model,'faq',{ariaLabel:'Közösségi & <GYIK>'});
 const fallback=renderElementContent('accordion',model,'faq');
 await page.setContent(`<main>${named}${fallback}</main>`);
 assert.equal(await page.getByRole('group',{name:'Közösségi & <GYIK>'}).count(),1,
  'the actual DOM exposes the escaped Inspector label through the accessible group name');
 assert.equal(await page.getByRole('group',{name:'Részletek'}).count(),1,
  'legacy content has a useful accessible name when its optional label is absent');
 const disclosure=page.getByRole('group',{name:'Közösségi & <GYIK>'});
 const summary=disclosure.locator('summary');
 assert.equal(await summary.count(),1,'the accessible accordion group contains its authored disclosure');
 assert.equal(await disclosure.locator('details[open]').count(),1,'the first valid disclosure keeps its existing initial-open behavior');
 await summary.press('Enter');
 assert.equal(await disclosure.locator('details[open]').count(),0,'the native summary keyboard interaction closes the disclosure');
 await summary.press('Space');
 assert.equal(await disclosure.locator('details[open]').count(),1,'the native summary keyboard interaction reopens the disclosure');
});

test('structured tab ARIA references stay unique across sanitization-colliding node IDs',async t=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
 t.after(()=>browser.close());
 const page=await browser.newPage();
 const model={version:1,items:[{label:'Első',content:'Első tartalom'},{label:'Második',content:'Második tartalom'}]};
 const markup=renderElementContent('tabs',model,'node/a')+renderElementContent('tabs',model,'node?a')+
  renderElementContent('tabs',model,`node/${'x'.repeat(5000)}a`)+renderElementContent('tabs',model,`node/${'x'.repeat(5000)}b`)+
  renderElementContent('tabs',model,'a'.repeat(88))+renderElementContent('tabs',model,'a'.repeat(89));
 await page.setContent(`<main>${markup}</main>`);
 const references=await page.evaluate(()=>[...document.querySelectorAll('[data-structured-tabs]')].map(host=>{
  const tab=host.querySelector('[role="tab"]'),panelId=tab?.getAttribute('aria-controls');
  const panel=panelId?document.getElementById(panelId):null;
  return {tabId:tab?.id,panelId,tabCount:document.querySelectorAll(`#${CSS.escape(tab?.id||'')}`).length,
   panelCount:panelId?document.querySelectorAll(`#${CSS.escape(panelId)}`).length:0,
   panelBelongsToHost:Boolean(panel&&host.contains(panel)),panelLabelsTab:panel?.getAttribute('aria-labelledby')===tab?.id};
 }));
 assert.equal(references.length,6);
 assert.equal(new Set(references.map(({tabId})=>tabId)).size,6,'separate, long, and boundary node IDs produce distinct DOM IDs');
 assert.ok(references.every(({tabId,panelId})=>tabId.length<=100&&panelId.length<=100),'rendered ARIA IDs stay bounded');
 assert.deepEqual(references.map(({tabCount,panelCount,panelBelongsToHost,panelLabelsTab})=>({tabCount,panelCount,panelBelongsToHost,panelLabelsTab})),[
  {tabCount:1,panelCount:1,panelBelongsToHost:true,panelLabelsTab:true},
  {tabCount:1,panelCount:1,panelBelongsToHost:true,panelLabelsTab:true},
  {tabCount:1,panelCount:1,panelBelongsToHost:true,panelLabelsTab:true},
  {tabCount:1,panelCount:1,panelBelongsToHost:true,panelLabelsTab:true},
  {tabCount:1,panelCount:1,panelBelongsToHost:true,panelLabelsTab:true},
  {tabCount:1,panelCount:1,panelBelongsToHost:true,panelLabelsTab:true}
 ],'each public tab controls exactly one panel in its own widget and that panel names its tab');
 const firstWidget=page.locator('[data-structured-tabs]').nth(0),secondWidget=page.locator('[data-structured-tabs]').nth(1);
 await firstWidget.getByRole('tab').first().focus();
 await page.keyboard.press('Tab');
 assert.equal(await firstWidget.locator('[role="tabpanel"]').first().evaluate(el=>document.activeElement===el),true,
  'Tab leaves the first tablist for its selected text-only panel');
 await page.keyboard.press('Tab');
 assert.equal(await secondWidget.getByRole('tab').first().evaluate(el=>document.activeElement===el),true,
  'Tab continues to the next independent widget without trapping or merging tab stops');
 assert.equal(await firstWidget.getByRole('tab').first().getAttribute('aria-selected'),'true');
 assert.equal(await secondWidget.getByRole('tab').first().getAttribute('aria-selected'),'true');
});

test('structured Inspector editing survives Save, Publish and public interaction on desktop and mobile',async t=>{
 const model=createEditorState(createDocument()),pageId=model.document.activePageId;
 const root=activePage(model).rootId,ids={};
 for(const type of ['list','table','tabs','accordion','gallery','carousel']){
  execute(model,{type:'element.add',payload:{type,parentId:root,name:type}});
  ids[type]=model.selection.primaryId;
 }
 execute(model,{type:'element.add',payload:{type:'tabs',parentId:root,name:'secondary-tabs'}});
 ids.secondaryTabs=model.selection.primaryId;
 const secondaryTabsNode=activePage(model).nodes[ids.secondaryTabs];
 execute(model,{type:'element.update',payload:{nodeId:ids.secondaryTabs,patch:{props:{...secondaryTabsNode.props,contentModel:{version:1,items:[
  {label:'Külön csoport első',content:'Külön csoport első tartalma'},
  {label:'Külön csoport második',content:'Külön csoport második tartalma'}
 ]}}}}});
 execute(model,{type:'element.add',payload:{type:'tabs',parentId:root,name:'single-tab'}});
 ids.singleTabs=model.selection.primaryId;
 const singleTabsNode=activePage(model).nodes[ids.singleTabs];
 execute(model,{type:'element.update',payload:{nodeId:ids.singleTabs,patch:{props:{...singleTabsNode.props,contentModel:{version:1,items:[
  {label:'Egyetlen fül',content:'Egyetlen fül tartalma'}
 ]}}}}});
 for(const type of ['badge','quote','icon']){
  execute(model,{type:'element.add',payload:{type,parentId:root}});
  ids[type]=model.selection.primaryId;
 }
 execute(model,{type:'element.update',payload:{nodeId:ids.quote,patch:{props:{text:'Idézet első változat',attribution:'Készítő'}}}});
 execute(model,{type:'element.update',payload:{nodeId:ids.icon,patch:{props:{icon:'heart',label:'Szív ikon'}}}});
  for(const [type,props] of [
  ['image',{src:'/media/banner.jpg',alt:'Kezdőlap borítókép'}],
  ['video',{src:'/media/trailer.mp4'}],
  ['audio',{src:'/media/theme.mp3'}],
  ['heading',{text:'A fő cím',level:1}],
  ['link',{text:'Megnyitás',href:'/p/about',newWindow:true}]
 ]){
  execute(model,{type:'element.add',payload:{type,parentId:root,props,name:type}});
  ids[type]=model.selection.primaryId;
 }
 execute(model,{type:'element.update',payload:{nodeId:ids.heading,patch:{accessibility:{anchorId:'main-heading',ariaLabel:'Főcím'}}}});
 execute(model,{type:'element.update',payload:{nodeId:ids.link,patch:{states:{hover:{backgroundColor:'#123456',color:'#ffffff'},focus:{outlineColor:'#00ff00'}}}}});
 execute(model,{type:'element.add',payload:{type:'list',parentId:root,name:'Régi lista'}});
 ids.legacyList=model.selection.primaryId;
 execute(model,{type:'element.update',payload:{nodeId:ids.legacyList,patch:{props:{...activePage(model).nodes[ids.legacyList].props,
  contentModel:{version:1,ordered:false,items:['Megőrzendő első sor','Sérült sor helyőrzője','Megőrzendő harmadik sor']}}}}});
 const img=activePage(model).nodes[ids.gallery];
 execute(model,{type:'element.update',payload:{nodeId:img.id,patch:{props:{...img.props,contentModel:{version:1,items:[{src:'/media/example.jpg',alt:'Próbakép',caption:'Tesztkép'},{src:'/media/second.jpg',alt:'Második kép',caption:'Második kép leírása'}]}}}}});
 const carouselNode=activePage(model).nodes[ids.carousel];
 execute(model,{type:'element.update',payload:{nodeId:carouselNode.id,patch:{props:{...carouselNode.props,contentModel:{...carouselNode.props.contentModel,items:carouselNode.props.contentModel.items.map((item,index)=>index===0?{...item,src:'/media/carousel.jpg',alt:'Kezdő dia'}:item)}}}}});
 const initialAccessibleNames={table:'Korábbi táblázat',tabs:'Korábbi tartalomfülek',gallery:'Korábbi képtár',carousel:'Korábbi lapozó'};
 for(const [type,label] of Object.entries(initialAccessibleNames)){
  const node=activePage(model).nodes[ids[type]];
  execute(model,{type:'element.update',payload:{nodeId:node.id,patch:{props:{...node.props,ariaLabel:label}}}});
 }
 const expectedModels=Object.fromEntries(['list','table','tabs','accordion','gallery','carousel'].map(type=>[type,structuredClone(activePage(model).nodes[ids[type]].props.contentModel)]));
 expectedModels.secondaryTabs=structuredClone(activePage(model).nodes[ids.secondaryTabs].props.contentModel);
 const initialModels=structuredClone(expectedModels);
 let draft=structuredClone(model.document),published=structuredClone(model.document),version=1;
 const posts=[];
 const rootDir=resolve(import.meta.dirname,'../../public');
 const server=createServer(async(req,res)=>{
  const url=new URL(req.url,'http://localhost');
  const json=data=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(data))};
  if(url.pathname==='/api/admin/pages')return json({ok:true,data:url.searchParams.get('archived')==='1'?[]:[{id:pageId,slug:'test',title:'Test',content:draft,revision:version,isPublished:true}]});
  if(url.pathname==='/api/admin/editor'){
   if(req.method==='GET')return json({ok:true,data:{page:{id:pageId,document:draft,publishedRevisionId:'published'},revisions:[{id:'revision-'+version,version}]}});
   let body='';for await(const chunk of req)body+=chunk;
   const request=JSON.parse(body);posts.push(request);draft=structuredClone(request.document);version++;
   if(request.publish)published=structuredClone(draft);
   return json({ok:true,data:{pageId,version,revisionId:'revision-'+version,published:Boolean(request.publish)}});
  }
  if(url.pathname==='/api/public/pages')return json({ok:true,data:{id:pageId,slug:'test',title:'Test',description:'',content:published.pages[pageId]}});
  if(url.pathname==='/api/public/navigation')return json({ok:true,data:{items:[]}});
  if(url.pathname==='/api/integrations/twitch/connection')return json({ok:true,data:{connected:false}});
  if(url.pathname.startsWith('/api/'))return json({ok:true,data:{siteName:'Test'}});
  const path=url.pathname==='/p/test'?'/visual-page.html':url.pathname;
  const file=resolve(rootDir,'.'+path);
  if(!file.startsWith(rootDir+'/'))return res.writeHead(403).end();
  try{res.setHeader('content-type',{'.html':'text/html','.js':'text/javascript','.css':'text/css'}[extname(file)]||'application/octet-stream');res.end(await readFile(file))}
  catch{res.writeHead(404).end()}
 });
 await new Promise(done=>server.listen(0,'127.0.0.1',done));
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
 t.after(async()=>{await browser.close();await new Promise(done=>server.close(done))});
 const base='http://127.0.0.1:'+server.address().port;
 const editor=await browser.newPage({viewport:{width:1366,height:900}}),viewer=await browser.newPage();
 // Multiple structural field and public-page assertions run at two widths.
 // Leave room for the long serial suite to schedule Chromium interactions.
 editor.setDefaultTimeout(15000);viewer.setDefaultTimeout(15000);
 const errors=[];editor.on('pageerror',e=>errors.push('editor:'+e.message));viewer.on('pageerror',e=>errors.push('public:'+e.message));
 await editor.goto(base+'/editor-v2/index.html');
 const appScriptUrl=new URL(await editor.locator('script[type="module"][src*="/editor-v2/app.js"]').getAttribute('src'),base);
 assert.ok(appScriptUrl.searchParams.get('v'),'the Editor entry module is cache-busted so browsers load updated runtime imports');
 const select=async id=>{
  await editor.locator('.node[data-node-id="'+id+'"]').evaluate(el=>el.click());
  if(await editor.locator('#rightDock').evaluate(el=>el.classList.contains('closed')))await editor.locator('#openInspector').click();
  await editor.locator('.inspector-tabs button').filter({hasText:'Tartalom'}).click();
 };
 await editor.locator('.node[data-node-id="'+ids.list+'"]').evaluate(el=>el.click());
 await editor.locator('.node[data-node-id="'+ids.table+'"]').evaluate(el=>el.dispatchEvent(new MouseEvent('click',{bubbles:true,ctrlKey:true})));
 const multi=editor.locator('.multi-inspector');
 await multi.waitFor({state:'attached'});
 assert.match(await multi.locator('h3').textContent(),/2 elem/);
 await multi.locator('.multi-inspector-field input[type=color]').first().evaluate(el=>{el.value='#112233';el.dispatchEvent(new Event('change',{bubbles:true}))});
 assert.equal(posts.length,0,'bulk edit does not publish or save automatically');
  await select(ids.quote);
 await editor.locator('.field textarea').last().fill('Egyedi idézet új változat');
 await editor.locator('.field textarea').last().press('Tab');
 const finalBadge='Végleges címke <img src=x onerror=alert(1)>',finalQuote='Végleges idézet\nMásodik sor',finalAttribution='Új szerző',finalIcon='Egyedi ikon " onload="alert(1)';
 for(const width of [390,1366]){
  await editor.setViewportSize({width,height:900});
  for(const [type,label,part,attribute,before,final] of [
   ['badge','Címke szövege','.basic-element-preview',undefined,width===390?'Címke':finalBadge+' mobil',finalBadge+(width===390?' mobil':'')],
   ['quote','Idézet szövege','.visual-quote p',undefined,width===390?'Egyedi idézet új változat':finalQuote+' mobil',finalQuote+(width===390?' mobil':'')],
   ['quote','Forrás vagy szerző','.visual-quote cite',undefined,width===390?'Készítő':finalAttribution+' mobil',finalAttribution+(width===390?' mobil':'')],
   ['icon','Ikon leírása','.visual-icon','aria-label',width===390?'Szív ikon':finalIcon+' mobil',finalIcon+(width===390?' mobil':'')]
  ]){
   await select(ids[type]);
   const basic=editor.locator('.basic-content-inspector'),input=basic.getByRole('textbox',{name:label,exact:true});
   const basicRoute=await input.evaluate(el=>{const route=el.closest('[data-inspector-command]');return route&&{command:route.dataset.inspectorCommand,key:route.dataset.inspectorKey}});
   const basicKey=type==='badge'?'props.text':type==='quote'?(label==='Idézet szövege'?'props.text':'props.attribution'):'props.label';
   assert.deepEqual(basicRoute,{command:'element.update',key:basicKey},`${type}.${label} exposes its exact basic content route`);
   await exerciseComposition({page:editor,input,selector:`.node[data-node-id="${ids[type]}"] `+part,attribute,before,final,posts,restart:true,attemptBlocked:type==='icon'?async()=>{const picker=basic.getByRole('combobox',{name:'Ikon',exact:true});await picker.selectOption('star');assert.equal(await picker.inputValue(),'heart','a glyph change cannot discard a composing label');}:undefined,otherInput:type==='quote'?basic.getByRole('textbox',{name:label==='Idézet szövege'?'Forrás vagy szerző':'Idézet szövege',exact:true}):undefined}).catch(error=>{assert.equal(posts.length,0,'unfinished basic content composition cannot reach the Editor API');throw error;});
  }
 }
 const finalAccessibleNames={table:'Játékstatisztikák & <eredmények>',tabs:'Csatorna & <témák>',gallery:'Műhelyem & képei <nyilvános>',carousel:'Kiemelt stream-pillanatok'};
 const accessibleSelectors={table:'.visual-structured-table-scroll',tabs:'[role="tablist"]',gallery:'[role="region"]',carousel:'[role="region"]'};
 for(const [type,previous] of Object.entries(initialAccessibleNames)){
  await select(ids[type]);
  const panel=editor.locator('.structured-inspector'),label=panel.getByRole('textbox',{name:'Akadálymentes elnevezés',exact:true});
  const route=await label.evaluate(el=>{const owner=el.closest('[data-inspector-command]');return {command:owner?.dataset.inspectorCommand,key:owner?.dataset.inspectorKey}});
  assert.deepEqual(route,{command:'element.update',key:'props.ariaLabel'},`${type} accessible name uses the normal Page Model update route`);
  assert.equal(await label.inputValue(),previous,'existing accessible names remain editable without being moved into contentModel');
  const final=finalAccessibleNames[type],target=`.node[data-node-id="${ids[type]}"] ${accessibleSelectors[type]}`;
  await exerciseComposition({page:editor,input:label,selector:target,attribute:'aria-label',before:previous,final,posts,restart:true})
   .catch(error=>{assert.equal(posts.length,0,'unfinished accessible-name composition cannot reach the Editor API');throw error;});
  const canvasRoot=editor.locator(`.node[data-node-id="${ids[type]}"]`),canvas=canvasRoot.locator(accessibleSelectors[type]);
  assert.equal(await canvas.count(),1,`the canvas renders a named structured region; canvas=${await canvasRoot.innerHTML()}`);
  assert.equal(await canvas.getAttribute('aria-label'),final,'the editor canvas exposes the authored accessible name immediately');
  assert.equal(posts.length,0,'accessible-name edits remain a local draft until explicit Save');
 }
 await select(ids.icon);
 const iconPicker=editor.locator('.basic-content-inspector').getByRole('combobox',{name:'Ikon',exact:true});
 assert.deepEqual(await iconPicker.evaluate(el=>{const route=el.closest('[data-inspector-command]');return {command:route?.dataset.inspectorCommand,key:route?.dataset.inspectorKey}}),{command:'element.update',key:'props.icon'});
 for(const width of [390,1366]){
  await editor.setViewportSize({width,height:900});
  assert.deepEqual(await iconPicker.locator('option').evaluateAll(options=>options.map(option=>({id:option.value,label:option.textContent}))),
   ICON_CHOICES.map(({id,label})=>({id,label})),
   'the Icon Inspector exposes exactly the canonical, server-validated icon registry');
  for(const choice of ICON_CHOICES){
   await iconPicker.selectOption(choice.id);
   assert.equal(await editor.locator('.node[data-node-id="'+ids.icon+'"] .visual-icon').textContent(),choice.glyph,
    `selecting ${choice.id} renders the same registered glyph on the canvas at ${width}px`);
  }
 }
 const lastIcon=ICON_CHOICES.at(-1),previousIcon=ICON_CHOICES.at(-2);
 assert.equal(await editor.locator('.basic-content-inspector').getByRole('textbox',{name:'Ikon leírása'}).inputValue(),finalIcon,'glyph selection preserves the freshly edited accessible label');
 await editor.keyboard.press('Control+z');assert.equal(await iconPicker.inputValue(),previousIcon.id);
 await editor.keyboard.press('Control+Shift+z');assert.equal(await iconPicker.inputValue(),lastIcon.id);
  await select(ids.tabs);
 assert.equal(await editor.locator('.structured-inspector h3').textContent(),'Fülek');
 const first=editor.locator('.structured-item').first();
 await first.locator('input').fill('Bemutatkozás');
 await first.locator('input').press('Tab');
 assert.equal(draft.pages[pageId].nodes[ids.tabs].props.contentModel.items[0].label,'Első fül','draft snapshot is unchanged before Save');
 expectedModels.tabs.items[0].label='Bemutatkozás';
 const structuredFields=[
   ['list',0,'Szöveg',null,'.visual-structured-list li:first-child'],
   ['table',0,'Oszlop 1',0,'.visual-structured-table th:first-child'],
   ['table',1,'Oszlop 2',1,'.visual-structured-table tbody tr:first-child td:nth-child(2)'],
   ['tabs',0,'Fül neve','label','[role="tab"]:first-child'],
   ['tabs',0,'Tartalom','content','[role="tabpanel"]:not([hidden])'],
   ['accordion',0,'Cím','label','.visual-structured-accordion details:first-child summary'],
   ['accordion',0,'Tartalom','content','.visual-structured-accordion details:first-child .visual-structured-panel'],
   ['gallery',0,'Kép URL','src','.visual-gallery-thumb:first-child img','src'],
   ['gallery',0,'Kép leírása (alt)','alt','.visual-gallery-thumb:first-child img','alt'],
   ['gallery',0,'Képaláírás','caption','.visual-gallery-thumb:first-child span'],
   ['carousel',0,'Cím','label','.visual-carousel-slide:first-child h3'],
   ['carousel',0,'Tartalom','content','.visual-carousel-slide:first-child p'],
   ['carousel',0,'Kép URL (opcionális)','src','.visual-carousel-slide:first-child img','src'],
   ['carousel',0,'Kép leírása','alt','.visual-carousel-slide:first-child img','alt']
 ];
 for(const width of [390,1366]){
  await editor.setViewportSize({width,height:900});
  for(const [type,rowIndex,label,key,selector,attribute] of structuredFields){
   await select(ids[type]);const panel=editor.locator('.structured-inspector'),row=panel.locator('.structured-item').nth(rowIndex),input=row.getByRole('textbox',{name:label,exact:true});
   const expectedKey=type==='table'?'props.contentModel.rows[][]':type==='list'?'props.contentModel.items[]':`props.contentModel.items[].${key}`;
   const fieldRoute=await input.evaluate(el=>{const route=el.closest('[data-inspector-command]');return route&&{command:route.dataset.inspectorCommand,key:route.dataset.inspectorKey}});
   assert.deepEqual(fieldRoute,{command:'element.update',key:expectedKey},`${type}.${label} exposes its full nested content-model route`);
   const actionRoutes=await panel.locator('button[data-inspector-command]').evaluateAll(buttons=>buttons.map(button=>({command:button.dataset.inspectorCommand,key:button.dataset.inspectorKey})));
   assert.ok(actionRoutes.length>0&&actionRoutes.every(route=>route.command==='element.update'&&route.key===`props.contentModel.${type==='table'?'rows':'items'}`),`${type} structural actions expose their content-model array route`);
   if(type==='list')assert.deepEqual(await panel.getByRole('checkbox',{name:'Számozott lista'}).evaluate(el=>{const route=el.closest('[data-inspector-command]');return {command:route?.dataset.inspectorCommand,key:route?.dataset.inspectorKey}}),{command:'element.update',key:'props.contentModel.ordered'});
   const before=await input.inputValue(),final=key==='src'?`/media/${type}-${width}.svg`:`Végleges ${type} ${String(key)} ${width} <img>`;
   await exerciseComposition({page:editor,input,selector:`.node[data-node-id="${ids[type]}"] `+selector,attribute,before,final,posts,restart:true,attemptBlocked:async()=>{
    const count=await panel.locator('.structured-item').count();
    if(type==='table'){
     const fields=await panel.locator('.structured-input').count();await panel.getByRole('button',{name:'＋ Oszlop',exact:true}).click();assert.equal(await panel.locator('.structured-input').count(),fields);
     await panel.getByRole('button',{name:'− Utolsó oszlop',exact:true}).click();assert.equal(await panel.locator('.structured-input').count(),fields,'the composing column cannot be removed');
     await panel.getByRole('button',{name:'＋ Sor',exact:true}).click();await panel.locator('.structured-item').nth(1).getByRole('button',{name:'Sor törlése',exact:true}).click();
    }else{
     await panel.getByRole('button',{name:'＋ Új elem',exact:true}).click();
     const first=panel.locator('.structured-item').first();await first.getByRole('button',{name:'↓ Le',exact:true}).click();await first.getByRole('button',{name:'× Törlés',exact:true}).click();
     if(type==='list'){const ordered=panel.getByRole('checkbox',{name:'Számozott lista'});await ordered.click();assert.equal(await ordered.isChecked(),false);}
    }
    assert.equal(await panel.locator('.structured-item').count(),count,'structural edits cannot discard a composing row');
   },otherInput:type==='table'?row.getByRole('textbox',{name:label==='Oszlop 1'?'Oszlop 2':'Oszlop 1',exact:true}):['tabs','accordion','carousel'].includes(type)?row.getByRole('textbox',{name:label==='Tartalom'?(type==='tabs'?'Fül neve':'Cím'):'Tartalom',exact:true}):undefined}).catch(error=>{assert.equal(posts.length,0,'unfinished structured content composition cannot reach the Editor API');throw error;});
   if(type==='table')expectedModels.table.rows[rowIndex][key]=final;
   else if(type==='list')expectedModels.list.items[rowIndex]=final;
   else expectedModels[type].items[rowIndex][key]=final;
  }
 }
 const expectFocus=async target=>{
  await target.waitFor();await editor.evaluate(()=>new Promise(resolve=>requestAnimationFrame(resolve)));
  assert.equal(await target.evaluate(el=>el===document.activeElement),true,'keyboard structural action restores the intended Inspector control');
 };
 const keyboard=async button=>{await button.focus();await button.press('Enter');};
 for(const width of [390,1366])for(const type of Object.keys(expectedModels)){
  await editor.setViewportSize({width,height:900});await select(ids[type]);const panel=editor.locator('.structured-inspector'),rows=panel.locator('.structured-item');
  const cell=(row,col=0)=>rows.nth(row).locator('.structured-input input,.structured-input textarea').nth(col);
  if(type==='table'){
   await keyboard(panel.getByRole('button',{name:'＋ Oszlop',exact:true}));await expectFocus(cell(0,2));
   await keyboard(panel.getByRole('button',{name:'− Utolsó oszlop',exact:true}));await expectFocus(cell(0,1));
   await keyboard(panel.getByRole('button',{name:'＋ Sor',exact:true}));await expectFocus(cell(2));
   await keyboard(rows.last().getByRole('button',{name:'Sor törlése',exact:true}));await expectFocus(cell(1));
   await keyboard(rows.last().getByRole('button',{name:'Sor törlése',exact:true}));await expectFocus(cell(0));
   await editor.keyboard.press('Control+z');assert.equal(await rows.count(),2,'the protected header survives deletion of the last data row');
   const originalRow=await cell(1).inputValue();
   await keyboard(rows.first().getByRole('button',{name:'＋ Sor alá',exact:true}));
   await expectFocus(cell(1));assert.equal(await rows.count(),3,'table insert adds a data row under the header');
   await cell(1).fill('Beszúrt próbasor');
   assert.equal(await rows.nth(1).getByRole('button',{name:'↑ Sor fel',exact:true}).isDisabled(),true,
    'the first data row cannot move ahead of the protected header');
   await keyboard(rows.nth(1).getByRole('button',{name:'↓ Sor le',exact:true}));
   await expectFocus(rows.nth(2).getByRole('button',{name:'↑ Sor fel',exact:true}));
   assert.equal(await cell(2).inputValue(),'Beszúrt próbasor','moving down preserves the row cells');
   await keyboard(rows.nth(2).getByRole('button',{name:'↑ Sor fel',exact:true}));
   await expectFocus(rows.nth(1).getByRole('button',{name:'↓ Sor le',exact:true}));
   assert.equal(await cell(1).inputValue(),'Beszúrt próbasor','moving up preserves the row cells');
   await keyboard(rows.nth(1).getByRole('button',{name:'Sor törlése',exact:true}));
   await expectFocus(cell(1));
   assert.equal(await rows.count(),2,'deleting inserted data restores the original row count');
   assert.equal(await cell(1).inputValue(),originalRow,'header and existing data must survive insert/reorder/delete');
  }else{
   const originalCount=expectedModels[type].items.length;
   await keyboard(panel.getByRole('button',{name:'＋ Új elem',exact:true}));await expectFocus(cell(originalCount));
   await keyboard(rows.last().getByRole('button',{name:'× Törlés',exact:true}));await expectFocus(cell(originalCount-1));
   await keyboard(rows.first().getByRole('button',{name:'↓ Le',exact:true}));await expectFocus(rows.nth(1).getByRole('button',{name:originalCount===2?'↑ Fel':'↓ Le',exact:true}));
   await keyboard(rows.nth(1).getByRole('button',{name:'↑ Fel',exact:true}));await expectFocus(rows.first().getByRole('button',{name:'↓ Le',exact:true}));
   if(type==='list'){
    await keyboard(rows.first().getByRole('button',{name:'↓ Le',exact:true}));await expectFocus(rows.nth(1).getByRole('button',{name:'↓ Le',exact:true}));
    await keyboard(rows.nth(1).getByRole('button',{name:'↓ Le',exact:true}));await expectFocus(rows.last().getByRole('button',{name:'↑ Fel',exact:true}));
    await keyboard(rows.last().getByRole('button',{name:'↑ Fel',exact:true}));await expectFocus(rows.nth(1).getByRole('button',{name:'↑ Fel',exact:true}));
    await keyboard(rows.nth(1).getByRole('button',{name:'↑ Fel',exact:true}));await expectFocus(rows.first().getByRole('button',{name:'↓ Le',exact:true}));
    for(const index of [1,0,2]){
     await keyboard(rows.nth(index).getByRole('button',{name:'× Törlés',exact:true}));await expectFocus(cell(Math.min(index,1)));
     await editor.keyboard.press('Control+z');assert.equal(await rows.count(),3,'Undo restores the full original list');
    }
    const ordered=panel.getByRole('checkbox',{name:'Számozott lista'});await ordered.check();await ordered.uncheck();
   }
  }
 }
 // Persist a genuine row insertion and reorder through the separate Save and
 // Publish API calls, rather than undoing every structural change before Save.
 await select(ids.table);
 const tableInspector=editor.locator('.structured-inspector'),tableRows=tableInspector.locator('.structured-item');
 await keyboard(tableRows.last().getByRole('button',{name:'＋ Sor alá',exact:true}));
 assert.equal(await tableRows.count(),3,'insert below existing table data row');
 await tableRows.nth(2).getByRole('textbox',{name:'Oszlop 1',exact:true}).fill('További játék');
 await tableRows.nth(2).getByRole('textbox',{name:'Oszlop 2',exact:true}).fill('77');
 await keyboard(tableRows.nth(2).getByRole('button',{name:'↑ Sor fel',exact:true}));
 assert.equal(await tableRows.nth(1).getByRole('textbox',{name:'Oszlop 1',exact:true}).inputValue(),'További játék');
 await editor.keyboard.press('Control+z');
 assert.equal(await tableRows.nth(2).getByRole('textbox',{name:'Oszlop 1',exact:true}).inputValue(),'További játék',
  'Undo restores the previous table row order');
 await editor.keyboard.press('Control+Shift+z');
 assert.equal(await tableRows.nth(1).getByRole('textbox',{name:'Oszlop 1',exact:true}).inputValue(),'További játék',
  'Redo restores the moved table row without changing its values');
 await keyboard(tableRows.nth(1).getByRole('button',{name:'↓ Sor le',exact:true}));
 assert.equal(await tableRows.nth(2).getByRole('textbox',{name:'Oszlop 2',exact:true}).inputValue(),'77',
  'reordered row keeps the second column on the moved record');
 expectedModels.table.rows.push(['További játék','77']);
 await keyboard(tableInspector.getByRole('button',{name:'＋ Oszlop',exact:true}));
 assert.equal(await tableRows.nth(0).locator('.structured-input').count(),3,'adding a column gives the header a third cell');
 const thirdColumnValues=['Platform','PC','Konzol'];
 const rowCount=await tableRows.count();
 for(let row=0;row<rowCount;row++){
  const third=tableRows.nth(row).getByRole('textbox',{name:'Oszlop 3',exact:true});
  assert.equal(await third.inputValue(),'','new table cells start empty without shifting existing cells');
  await third.fill(thirdColumnValues[row]);
  expectedModels.table.rows[row].push(thirdColumnValues[row]);
 }
 await select(ids.tabs);
 const limited=editor.locator('.structured-item').first().getByRole('textbox',{name:'Fül neve',exact:true});
 await limited.fill('x'.repeat(120));await limited.press('y');assert.equal(await limited.inputValue(),'x'.repeat(120),'native editing stops at the canonical boundary');
 assert.equal(await editor.locator(`.node[data-node-id="${ids.tabs}"] [role="tab"]`).first().textContent(),'x'.repeat(120));
 await editor.keyboard.press('Control+z');assert.equal(await limited.inputValue(),expectedModels.tabs.items[0].label);
 await editor.locator('#save').click();
 await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
 assert.equal(posts.at(-1).publish,false);
 assert.equal(published.pages[pageId].nodes[ids.tabs].props.contentModel.items[0].label,'Első fül');
 assert.equal(draft.pages[pageId].nodes[ids.tabs].props.contentModel.items[0].label,expectedModels.tabs.items[0].label);
 for(const type of Object.keys(expectedModels)){assert.deepEqual(draft.pages[pageId].nodes[ids[type]].props.contentModel,expectedModels[type],'all fresh fields and untouched rows survive structural operations');assert.deepEqual(published.pages[pageId].nodes[ids[type]].props.contentModel,initialModels[type],'Save cannot alter any published structured model');}
 assert.equal(draft.pages[pageId].nodes[ids.badge].props.text,finalBadge);
 assert.equal(draft.pages[pageId].nodes[ids.quote].props.text,finalQuote);
 assert.equal(draft.pages[pageId].nodes[ids.quote].props.attribution,finalAttribution);
 assert.equal(draft.pages[pageId].nodes[ids.icon].props.label,finalIcon);
 assert.equal(draft.pages[pageId].nodes[ids.icon].props.icon,lastIcon.id);
 for(const [type,label] of Object.entries(finalAccessibleNames))assert.equal(draft.pages[pageId].nodes[ids[type]].props.ariaLabel,label,`${type} accessible name is stored in draft props`);
 for(const [type,label] of Object.entries(initialAccessibleNames))assert.equal(published.pages[pageId].nodes[ids[type]].props.ariaLabel,label,`Save must preserve the previously published ${type} accessible name`);
 await viewer.goto(base+'/p/test');
 assert.equal(await viewer.locator('.visual-editor-node[data-node-id="'+ids.table+'"] tbody tr').count(),1,
   'draft Save must not make the new table row public before a separate Publish');
 assert.equal(await viewer.locator('.visual-editor-node[data-node-id="'+ids.table+'"] th').count(),2,
  'draft Save must not expose a new table column before a separate Publish');
 assert.equal(await viewer.locator('.visual-badge[data-node-id="'+ids.badge+'"]').textContent(),'Címke','Save cannot expose the new badge');
 assert.match(await viewer.locator('blockquote[data-node-id="'+ids.quote+'"]').textContent(),/Idézet első változat/);
 assert.equal(await viewer.locator('.visual-icon[data-node-id="'+ids.icon+'"]').getAttribute('aria-label'),'Szív ikon');
 for(const [type,previous] of Object.entries(initialAccessibleNames))
  assert.equal(await viewer.locator(`.visual-editor-node[data-node-id="${ids[type]}"] ${accessibleSelectors[type]}`).getAttribute('aria-label'),previous,`Save alone must not publish the ${type} accessible name`);
 await editor.reload();
 for(const [type,label,value] of [['badge','Címke szövege',finalBadge],['quote','Idézet szövege',finalQuote],['quote','Forrás vagy szerző',finalAttribution],['icon','Ikon leírása',finalIcon]]){
  await select(ids[type]);assert.equal(await editor.locator('.basic-content-inspector').getByRole('textbox',{name:label,exact:true}).inputValue(),value);
 }
 assert.equal(await editor.locator('.basic-content-inspector').getByRole('combobox',{name:'Ikon',exact:true}).inputValue(),lastIcon.id,
  'the last canonical registry choice survives draft Save and Editor reload');
 for(const [type,rowIndex,label,key] of structuredFields){
  await select(ids[type]);const value=type==='table'?expectedModels.table.rows[rowIndex][key]:type==='list'?expectedModels.list.items[rowIndex]:expectedModels[type].items[rowIndex][key];
  assert.equal(await editor.locator('.structured-item').nth(rowIndex).getByRole('textbox',{name:label,exact:true}).inputValue(),value,'saved structured fields survive editor reload');
 }
 for(const [type,label] of Object.entries(finalAccessibleNames)){await select(ids[type]);assert.equal(await editor.locator('.structured-inspector').getByRole('textbox',{name:'Akadálymentes elnevezés',exact:true}).inputValue(),label,`${type} accessible name survives a draft reload`)}
 await select(ids.table);
 assert.deepEqual(await editor.locator('.structured-item').evaluateAll(rows=>rows.map(row=>row.querySelectorAll('.structured-input').length)),[3,3,3],
  'the added table column and every row cell survive Save and a fresh Editor load');
 assert.deepEqual(await editor.locator('.structured-item').evaluateAll(rows=>rows.map(row=>row.querySelectorAll('.structured-input')[2].querySelector('input,textarea').value)),
  thirdColumnValues,'the new column header and data remain attached to their rows after reload');
 await editor.locator('#publish').click();
 await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
 assert.equal(posts.at(-1).publish,true);
 await viewer.goto(base+'/p/test');
 for(const [type,label] of Object.entries(finalAccessibleNames))assert.equal(await viewer.locator(`.visual-editor-node[data-node-id="${ids[type]}"] ${accessibleSelectors[type]}`).getAttribute('aria-label'),label,`separate Publish exposes the ${type} accessible name to the public renderer`);
 assert.equal(await viewer.locator(`.visual-editor-node[data-node-id="${ids.table}"] .visual-structured-table`).getAttribute('aria-label'),finalAccessibleNames.table,
  'the authored table itself has an accessible name in addition to its scroll region');
 assert.equal(await viewer.getByRole('table',{name:finalAccessibleNames.table,exact:true}).count(),1,
  'assistive technology can identify the table by its authored name');
 const publishedSources=await viewer.evaluate(async()=>{
  const {safeMediaUrl,safePublishedMediaUrl,validateElementContent,renderElementContent}=await import('/editor-v2/core/element-content.js');
  const sources=[
   '/api/%61dmin/media?id=00000000-0000-4000-8000-000000000123',
   '/%2fapi%2fadmin%2fmedia?id=00000000-0000-4000-8000-000000000123',
   '/%252fapi%252fadmin%252fmedia?id=00000000-0000-4000-8000-000000000123',
   '/%255capi%255cadmin%255cmedia?id=00000000-0000-4000-8000-000000000123',
   '/%2561pi%252fadmin%252fmedia?id=00000000-0000-4000-8000-000000000123',
   '/%25252561pi%2525252fadmin%2525252fmedia?id=00000000-0000-4000-8000-000000000123'
  ];
  let overNestedRoute='/api/admin/media?id=00000000-0000-4000-8000-000000000123';
  for(let layer=0;layer<11;layer++)overNestedRoute='/'+overNestedRoute.slice(1).replace(/%/g,'%25').replace(/^a/i,'%61');
  sources.push(overNestedRoute);
  return sources.map(src=>{
   const gallery={version:1,items:[{src,alt:'Privát fotó',caption:''}]};
   const carousel={version:1,items:[{src,label:'Dia',content:'Tartalom',alt:'Privát fotó'}]};
   return {src,editorSource:safeMediaUrl(src),publicSource:safePublishedMediaUrl(src),
    galleryError:validateElementContent('gallery',gallery),carouselError:validateElementContent('carousel',carousel),
    galleryHtml:renderElementContent('gallery',gallery,'g-private'),carouselHtml:renderElementContent('carousel',carousel,'c-private')};
  });
 });
 for(const result of publishedSources){
  assert.equal(result.editorSource,result.src,'the authenticated Editor can still inspect the legacy value');
  assert.equal(result.publicSource,'','private preview route is never an accepted public media source');
  assert.equal(result.galleryError,'INVALID_GALLERY_IMAGE');
  assert.equal(result.carouselError,'INVALID_CAROUSEL_IMAGE');
  assert.doesNotMatch(result.galleryHtml,/<img[^>]*src=/);
  assert.doesNotMatch(result.carouselHtml,/<img[^>]*src=/);
  assert.doesNotMatch(result.galleryHtml,/data-lightbox-src=/);
  assert.doesNotMatch(result.carouselHtml,/data-lightbox-src=/);
 }
 for(const [type,rowIndex,label,key,selector,attribute] of structuredFields){
  const value=type==='table'?expectedModels.table.rows[rowIndex][key]:type==='list'?expectedModels.list.items[rowIndex]:expectedModels[type].items[rowIndex][key];
  const target=viewer.locator(`.visual-editor-node[data-node-id="${ids[type]}"] `+selector);
  assert.equal(attribute?await target.getAttribute(attribute):await target.textContent(),value,'published content equals the saved model');
 }
 const quote=viewer.locator('blockquote[data-node-id="'+ids.quote+'"]');
 assert.match(await quote.textContent(),/Végleges idézet/);
 assert.equal(await quote.locator('cite').textContent(),finalAttribution);
 assert.equal(await viewer.locator('span.visual-badge[data-node-id="'+ids.badge+'"]').count(),1);
 assert.equal(await viewer.locator('span.visual-icon[data-node-id="'+ids.icon+'"]').getAttribute('aria-label'),finalIcon);
 const publicBadge=viewer.locator('span.visual-badge[data-node-id="'+ids.badge+'"]'),publicIcon=viewer.locator('span.visual-icon[data-node-id="'+ids.icon+'"]');
 assert.equal(await publicBadge.textContent(),finalBadge);assert.equal(await publicBadge.locator('img,script').count(),0);
 assert.equal(await publicIcon.getAttribute('onload'),null);assert.equal(await publicIcon.textContent(),iconById(lastIcon.id).glyph);
 assert.equal(await quote.locator('p').textContent(),finalQuote,'multiline quote is preserved through Save/reload/Publish');
  const mediaImage=viewer.locator('.visual-editor-node[data-node-id="'+ids.image+'"]');
 assert.equal(await mediaImage.getAttribute('alt'),'Kezdőlap borítókép');
 assert.equal(await viewer.locator('video[data-node-id="'+ids.video+'"][controls]').count(),1);
 assert.equal(await viewer.locator('audio[data-node-id="'+ids.audio+'"][controls]').count(),1);
 assert.equal(await viewer.locator('h1[data-node-id="'+ids.heading+'"]').getAttribute('id'),'main-heading');
 const newTabLink=viewer.locator('a[data-node-id="'+ids.link+'"]');
 assert.equal(await newTabLink.getAttribute('target'),'_blank');
 assert.equal(await newTabLink.getAttribute('rel'),'noopener noreferrer');
 await newTabLink.hover();
 assert.equal(await newTabLink.evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(18, 52, 86)');
 const tabs=viewer.locator('.visual-editor-node[data-node-id="'+ids.tabs+'"]');
 await tabs.locator('[role=tab]').first().waitFor();
 assert.equal(await tabs.locator('[role=tab]').first().textContent(),expectedModels.tabs.items[0].label);
 assert.equal(await tabs.locator('[role=tabpanel]:visible').count(),1);
 await tabs.locator('[role=tab]').first().focus();
 await viewer.keyboard.press('ArrowRight');
 assert.equal(await tabs.locator('[role=tab]').nth(1).getAttribute('aria-selected'),'true');
 assert.equal(await tabs.locator('[role=tabpanel]:visible').count(),1);
 assert.equal(await tabs.locator('[role=tabpanel]:visible').getAttribute('tabindex'),'0');
 await viewer.keyboard.press('Tab');
 assert.equal(await tabs.locator('[role=tabpanel]:visible').evaluate(el=>document.activeElement===el),true,
  'selected text-only tabpanel receives keyboard focus');
 const isolatedTabs=viewer.locator('.visual-editor-node[data-node-id="'+ids.secondaryTabs+'"]');
 await isolatedTabs.getByRole('tab').first().focus();
 await viewer.keyboard.press('ArrowRight');
 assert.equal(await isolatedTabs.getByRole('tab').nth(1).getAttribute('aria-selected'),'true');
 assert.equal(await isolatedTabs.locator('[role="tabpanel"]').nth(1).textContent(),'Külön csoport második tartalma');
 assert.equal(await isolatedTabs.getByRole('tab').nth(1).evaluate(el=>document.activeElement===el),true);
 assert.equal(await tabs.getByRole('tab').nth(1).getAttribute('aria-selected'),'true',
  'navigating a second published tab widget does not change the first widget selection');
 assert.equal(await tabs.locator('[role="tabpanel"]').nth(1).textContent(),expectedModels.tabs.items[1].content,
  'the first widget keeps its own selected panel content');
 const primaryControls=await tabs.getByRole('tab').nth(1).getAttribute('aria-controls');
 const isolatedControls=await isolatedTabs.getByRole('tab').nth(1).getAttribute('aria-controls');
 assert.notEqual(primaryControls,isolatedControls,'independent published widgets expose distinct panel references');
 assert.equal(await tabs.locator('#'+primaryControls).getAttribute('aria-labelledby'),await tabs.getByRole('tab').nth(1).getAttribute('id'));
 assert.equal(await isolatedTabs.locator('#'+isolatedControls).getAttribute('aria-labelledby'),await isolatedTabs.getByRole('tab').nth(1).getAttribute('id'));
 await isolatedTabs.getByRole('tab').first().click();
 assert.equal(await isolatedTabs.getByRole('tab').first().getAttribute('aria-selected'),'true',
  'pointer selection activates only the clicked widget tab');
 assert.equal(await isolatedTabs.locator('[role="tabpanel"]').first().textContent(),'Külön csoport első tartalma');
 assert.equal(await isolatedTabs.getByRole('tab').first().evaluate(el=>document.activeElement===el),true,
  'pointer selection leaves focus on its selected tab');
 const singleTablist=viewer.locator('.visual-editor-node[data-node-id="'+ids.singleTabs+'"]');
 const singleTab=singleTablist.getByRole('tab');
 assert.equal(await singleTab.count(),1,'the authored one-item tab collection remains a valid tablist');
 await singleTab.focus();
 const beforeSingleTabNavigation=await viewer.evaluate(()=>({href:location.href,historyLength:history.length}));
 for(const key of ['ArrowLeft','ArrowRight','Home','End']){
  await viewer.keyboard.press(key);
  assert.equal(await singleTab.getAttribute('aria-selected'),'true',`${key} keeps the only tab selected`);
  assert.equal(await singleTab.evaluate(el=>document.activeElement===el),true,`${key} keeps focus on the only tab`);
 }
 assert.deepEqual(await viewer.evaluate(()=>({href:location.href,historyLength:history.length})),beforeSingleTabNavigation,
  'no-op navigation in a one-tab list does not add redundant URL state or browser history');
 assert.equal(await tabs.getByRole('tab').nth(1).getAttribute('aria-selected'),'true',
  'pointer navigation in the second widget does not change the first widget');
 await tabs.getByRole('tab').first().click();
 assert.equal(await tabs.getByRole('tab').first().getAttribute('aria-selected'),'true');
 assert.equal(await tabs.locator('[role="tabpanel"]').first().textContent(),expectedModels.tabs.items[0].content);
 assert.equal(await isolatedTabs.getByRole('tab').first().getAttribute('aria-selected'),'true',
  'pointer navigation in the first widget does not change the second widget');
 await tabs.getByRole('tab').nth(1).focus();
 await viewer.keyboard.press('ArrowRight');
 assert.equal(await tabs.getByRole('tab').first().getAttribute('aria-selected'),'true');
 assert.equal(await isolatedTabs.getByRole('tab').first().getAttribute('aria-selected'),'true',
  'changing the first published tab widget leaves the second widget selection isolated');
 const accordion=viewer.locator('.visual-editor-node[data-node-id="'+ids.accordion+'"]');
 assert.equal(await accordion.locator('details').count(),2);
 await accordion.locator('summary').nth(1).click();
 assert.ok(await accordion.locator('details').nth(1).evaluate(el=>el.open));
 const gallery=viewer.locator('.visual-editor-node[data-node-id="'+ids.gallery+'"]');
 await gallery.locator('.visual-gallery-thumb').first().click();
 assert.ok(await gallery.locator('dialog').evaluate(el=>el.open));
 await gallery.locator('.visual-gallery-next').click();
 assert.equal(await gallery.locator('dialog img').getAttribute('alt'),'Második kép');
 await viewer.keyboard.press('ArrowLeft');
 assert.equal(await gallery.locator('dialog img').getAttribute('alt'),expectedModels.gallery.items[0].alt);
 await viewer.keyboard.press('Escape');
 assert.ok(!(await gallery.locator('dialog').evaluate(el=>el.open)));
 const singleGalleryMarkup=renderElementContent('gallery',{version:1,items:[{src:'/media/only.jpg',alt:'Egyetlen kép',caption:'Egyetlen képaláírás'}]},'single-gallery-public-probe');
 await viewer.evaluate(markup=>{const wrapper=document.createElement('div');wrapper.id='single-gallery-public-probe';wrapper.innerHTML=markup;document.body.append(wrapper)},singleGalleryMarkup);
 await viewer.evaluate(async()=>{
  const {activateStructuredContent}=await import('/editor-v2/core/element-content.js?v=20261125-d06-carousel-control-relationship-v1');
  activateStructuredContent(document.querySelector('#single-gallery-public-probe'));
 });
 const singleGallery=viewer.locator('#single-gallery-public-probe'),singleThumb=singleGallery.locator('.visual-gallery-thumb');
 await singleThumb.click();
 const singleDialog=singleGallery.locator('dialog');
 assert.ok(await singleDialog.evaluate(el=>el.open));
 assert.equal(await singleDialog.locator('img').getAttribute('alt'),'Egyetlen kép');
 assert.equal(await singleDialog.locator('p').textContent(),'Egyetlen képaláírás');
 for(const key of ['ArrowLeft','ArrowRight']){
  const prevented=await singleDialog.evaluate((dialog,key)=>{
   const event=new KeyboardEvent('keydown',{key,bubbles:true,cancelable:true});dialog.dispatchEvent(event);return event.defaultPrevented;
  },key);
  assert.equal(prevented,false,`${key} remains available when a gallery contains one image`);
  await viewer.keyboard.press(key);
  assert.equal(await singleDialog.locator('img').getAttribute('alt'),'Egyetlen kép');
  assert.equal(await singleDialog.locator('p').textContent(),'Egyetlen képaláírás');
 }
 await viewer.keyboard.press('Escape');
 assert.ok(!(await singleDialog.evaluate(el=>el.open)),'the single-image dialog still closes with Escape');
 assert.equal(await singleThumb.evaluate(el=>document.activeElement===el),true,'closing the dialog restores focus to its thumbnail');
 const carousel=viewer.locator('.visual-editor-node[data-node-id="'+ids.carousel+'"]');
 assert.equal(await carousel.locator('.visual-carousel-slide:visible').count(),1);
 const structuredCarouselId=await carousel.locator('[data-structured-carousel]').getAttribute('id');
 assert.ok(structuredCarouselId,'the published carousel has a stable region ID');
 assert.equal(await carousel.locator('.visual-carousel-prev').getAttribute('aria-controls'),structuredCarouselId,
  'the previous control is programmatically associated with the carousel region');
 assert.equal(await carousel.locator('.visual-carousel-next').getAttribute('aria-controls'),structuredCarouselId,
  'the next control is programmatically associated with the carousel region');
 await carousel.locator('.visual-carousel-next').click();
 assert.equal(await carousel.locator('.visual-carousel-count').textContent(),'2 / 2');
 assert.equal(await carousel.locator('.visual-carousel-slide:visible h3').textContent(),'Második dia');
 const singleSlideMarkup=renderElementContent('carousel',{version:1,items:[{label:'Egy dia',content:'Egyetlen tartalom',src:'',alt:''}]},'one-slide-public-probe');
 await viewer.evaluate(markup=>{const wrapper=document.createElement('div');wrapper.id='one-slide-public-probe';wrapper.innerHTML=markup;document.body.append(wrapper)},singleSlideMarkup);
 await viewer.evaluate(async()=>{
  const {activateStructuredContent}=await import('/editor-v2/core/element-content.js?v=20261125-d06-carousel-control-relationship-v1');
  activateStructuredContent(document.querySelector('#one-slide-public-probe'));
 });
 const singleSlide=viewer.locator('#one-slide-public-probe [data-structured-carousel]');
 const singlePrev=singleSlide.getByRole('button',{name:'Előző dia'}),singleNext=singleSlide.getByRole('button',{name:'Következő dia'});
 assert.equal(await singlePrev.isDisabled(),true,'the public previous control is disabled with one slide');
 assert.equal(await singleNext.isDisabled(),true,'the public next control is disabled with one slide');
 await singleNext.focus();
 assert.notEqual(await singleNext.evaluate(el=>document.activeElement===el),true,'a disabled no-op control is not a keyboard focus stop');
 for(const key of ['ArrowLeft','ArrowRight']){
  const prevented=await singleSlide.evaluate((host,key)=>{
   const event=new KeyboardEvent('keydown',{key,bubbles:true,cancelable:true});host.dispatchEvent(event);return event.defaultPrevented;
  },key);
  assert.equal(prevented,false,`${key} remains available to the surrounding page when only one slide exists`);
 }
 assert.equal(await singleSlide.locator('.visual-carousel-count').textContent(),'1 / 1');
 assert.equal(await singleSlide.locator('.visual-carousel-slide:visible h3').textContent(),'Egy dia');
  assert.equal(await viewer.locator('.visual-editor-node[data-node-id="'+ids.list+'"]').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(17, 34, 51)');
  const list=viewer.locator('.visual-editor-node[data-node-id="'+ids.list+'"]');
 assert.equal(await list.locator('li').count(),3);
 const table=viewer.locator('.visual-editor-node[data-node-id="'+ids.table+'"]');
 assert.equal(await table.locator('th').count(),3,'separate Publish exposes the explicitly saved third header');
 assert.deepEqual(await table.locator('thead th').allTextContents(),[expectedModels.table.rows[0][0],expectedModels.table.rows[0][1],'Platform']);
 assert.equal(await table.locator('tbody tr').count(),2,'published table includes inserted and reordered data');
 assert.deepEqual(await table.locator('tbody tr').last().locator('td').allTextContents(),
  ['További játék','77','Konzol'],'row order and all cells survive Save, reload and separate Publish');
 await select(ids.table);
 await keyboard(tableInspector.getByRole('button',{name:'− Utolsó oszlop',exact:true}));
 assert.deepEqual(await editor.locator('.structured-item').evaluateAll(rows=>rows.map(row=>row.querySelectorAll('.structured-input').length)),[2,2,2],
  'removing the final column keeps every earlier column in place');
 assert.deepEqual(await editor.locator('.structured-item').evaluateAll(rows=>rows.flatMap(row=>Array.from(row.querySelectorAll('.structured-input input,.structured-input textarea'),input=>input.value))),
  [expectedModels.table.rows[0][0],expectedModels.table.rows[0][1],expectedModels.table.rows[1][0],expectedModels.table.rows[1][1],
   expectedModels.table.rows[2][0],expectedModels.table.rows[2][1]],'removing the final column preserves all retained cells');
 await editor.locator('#save').click();
 await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
 assert.equal(posts.at(-1).publish,false,'removing a column persists through Save without implicit Publish');
 assert.deepEqual(draft.pages[pageId].nodes[ids.table].props.contentModel.rows,expectedModels.table.rows.map(row=>row.slice(0,2)));
 assert.deepEqual(published.pages[pageId].nodes[ids.table].props.contentModel.rows,expectedModels.table.rows,
  'the public snapshot keeps the published third column until the separate Publish action');
 await viewer.goto(base+'/p/test');
 assert.equal(await viewer.locator('.visual-editor-node[data-node-id="'+ids.table+'"] th').count(),3,
  'Save of the column removal does not alter the live public table');
 await editor.reload();
 await select(ids.table);
 assert.deepEqual(await editor.locator('.structured-item').evaluateAll(rows=>rows.map(row=>row.querySelectorAll('.structured-input').length)),[2,2,2],
  'the removed column stays removed after Save and a fresh Editor load');
 await editor.locator('#publish').click();
 await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
 assert.equal(posts.at(-1).publish,true,'column removal reaches the public snapshot only on explicit Publish');
 await viewer.goto(base+'/p/test');
 const finalTable=viewer.locator('.visual-editor-node[data-node-id="'+ids.table+'"]');
 assert.deepEqual(await finalTable.locator('thead th').allTextContents(),expectedModels.table.rows[0].slice(0,2));
 assert.deepEqual(await finalTable.locator('tbody tr').last().locator('td').allTextContents(),['További játék','77'],
  'the separately published removal preserves earlier headers, row order, and values');
 await editor.screenshot({path:'/tmp/creator-ux-p0-structured-desktop.png'});
 await viewer.screenshot({path:'/tmp/creator-ux-p0-public-content.png'});
 await editor.setViewportSize({width:390,height:800});
 await editor.locator('.node[data-node-id="'+ids.tabs+'"]').evaluate(el=>el.click());
 const mobile=editor.locator('.structured-item .structured-action').first();
 await mobile.waitFor({state:'attached'});
 assert.ok(await mobile.evaluate(el=>getComputedStyle(el).minHeight==='44px'));
 await editor.screenshot({path:'/tmp/creator-ux-p0-structured-mobile.png'});
 const recovery=await editor.evaluate(async()=>{
  const {renderBasicContentInspector}=await import('/editor-v2/ui/basic-content-inspector.js');const results=[];
  for(const type of ['badge','quote','icon'])for(const mode of ['false','throw']){
   const original={text:'Mentett szöveg',attribution:'Mentett szerző',icon:'heart',label:'Mentett leírás',unknown:{keep:'same'}};
   const node={id:'basic-recovery',type,props:structuredClone(original)};let allow=false,accepted,guard;
   const root=renderBasicContentInspector(node,next=>{if(!allow){if(mode==='throw')throw Error('Fixture rejection');return false;}accepted=structuredClone(next);return true;},{pending:fn=>{guard=fn;}});
   document.querySelector('#inspectorBody').append(root);
   const input=root.querySelector(type==='quote'?'textarea':'input');const before=input.value;
   input.focus();input.value='Elutasított';input.dispatchEvent(new InputEvent('input',{bubbles:true}));
   const rejected=input.hasAttribute('aria-invalid')&&!guard()&&!accepted;
   input.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));const escaped=input.value===before&&guard();
   allow=true;input.value='Új szöveg';input.dispatchEvent(new Event('change',{bubbles:true}));
   let fresh=(type==='icon'?accepted.label:accepted.text)==='Új szöveg'&&JSON.stringify(accepted.unknown)===JSON.stringify(original.unknown)&&guard();
   if(type==='quote'){
    const source=root.querySelector('input');source.focus();source.value='Új szerző';source.dispatchEvent(new InputEvent('input',{bubbles:true}));fresh=fresh&&accepted.text==='Új szöveg'&&accepted.attribution==='Új szerző';
   }else if(type==='icon'){
    const picker=root.querySelector('select');picker.value='star';picker.dispatchEvent(new Event('change',{bubbles:true}));fresh=fresh&&accepted.icon==='star'&&accepted.label==='Új szöveg';
   }
   const unchanged=JSON.stringify(node.props)===JSON.stringify(original);root.remove();
   const locked=renderBasicContentInspector({...node,locked:true},()=>{throw Error('Locked basic content changed');});document.querySelector('#inspectorBody').append(locked);
   const lockedSafe=[...locked.querySelectorAll('input,textarea,select')].every(el=>el.disabled);locked.remove();
   results.push({type,mode,rejected,escaped,fresh,unchanged,lockedSafe});
  }return results;
 });
 for(const result of recovery)for(const key of ['rejected','escaped','fresh','unchanged','lockedSafe'])assert.equal(result[key],true,JSON.stringify(result));
 const legacyIconRecovery=await editor.evaluate(async()=>{
  const {renderBasicContentInspector}=await import('/editor-v2/ui/basic-content-inspector.js');
  const original={icon:'camera',label:'Megőrzendő képleírás'},node={id:'legacy-icon',type:'icon',props:{...original}};
  let calls=0,accepted;
  const panel=renderBasicContentInspector(node,next=>{calls++;accepted=structuredClone(next);return true;});
  const picker=panel.querySelector('select'),notice=panel.querySelector('[role="status"]');
  const opened={selected:picker.value,notice:notice?.textContent,noticeHidden:notice?.hidden,calls,original:structuredClone(node.props)};
  picker.value='sparkles';picker.dispatchEvent(new Event('change',{bubbles:true}));
  return {opened,values:[...picker.options].map(option=>option.value),calls,accepted,noticeHidden:notice.hidden,original:node.props};
 });
 assert.deepEqual(legacyIconRecovery.opened,{selected:'camera',notice:'A korábban mentett ikonazonosító nem támogatott. Válassz egy elérhető ikont a javításhoz; a megnyitás nem módosítja a piszkozatot.',noticeHidden:false,calls:0,original:{icon:'camera',label:'Megőrzendő képleírás'}});
 assert.deepEqual(legacyIconRecovery.values,['camera',...ICON_CHOICES.map(({id})=>id)]);
 assert.equal(legacyIconRecovery.calls,1,'an explicit supported replacement is the only recovery write');
 assert.deepEqual(legacyIconRecovery.accepted,{icon:'sparkles',label:'Megőrzendő képleírás'},'unsupported icon repair preserves the accessible label');
 assert.equal(legacyIconRecovery.noticeHidden,true,'the recovery warning clears only after a valid choice');
 assert.deepEqual(legacyIconRecovery.original,{icon:'camera',label:'Megőrzendő képleírás'},'opening the Inspector never mutates the legacy Page Model');
 const structuredRecovery=await editor.evaluate(async()=>{
  const {renderStructuredInspector}=await import('/editor-v2/ui/structured-inspector.js');
  const {createElementContent}=await import('/editor-v2/core/element-content.js');const results=[];
  for(const type of ['list','table','tabs','accordion','gallery','carousel'])for(const mode of ['false','throw']){
   const node={id:'structured-recovery',type,props:{contentModel:createElementContent(type),unknown:{keep:'same'}}};
   const before=JSON.stringify(node.props);let allow=false,accepted,guard;
   const root=renderStructuredInspector(node,next=>{if(!allow){if(mode==='throw')throw Error('Fixture rejection');return false;}accepted=structuredClone(next);return true;},{pending:fn=>{guard=fn;}});
   document.querySelector('#inspectorBody').append(root);
   const fields=root.querySelectorAll('.structured-item .structured-input input,.structured-item .structured-input textarea'),first=fields[0],second=fields[1],original=first.value;
   first.focus();first.value='Elutasított';first.dispatchEvent(new InputEvent('input',{bubbles:true}));
   const rejected=first.hasAttribute('aria-invalid')&&!guard()&&!accepted;
   first.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));const escaped=first.value===original&&guard();
   allow=true;const final=type==='gallery'?'/media/new.svg':'Új első érték';first.value=final;first.dispatchEvent(new Event('change',{bubbles:true}));
   let fresh=true;
   if(second){
    second.focus();second.value='Új második érték';second.dispatchEvent(new InputEvent('input',{bubbles:true}));
    const saved=type==='table'?accepted.rows[0][0]:type==='list'?accepted.items[0]:type==='gallery'?accepted.items[0].src:accepted.items[0].label;
    fresh=saved===final&&guard();
   }
   const unchanged=JSON.stringify(node.props)===before;root.remove();
   const locked=renderStructuredInspector({...node,locked:true},()=>{throw Error('Locked structured content changed');});document.querySelector('#inspectorBody').append(locked);
   const lockedSafe=[...locked.querySelectorAll('input,textarea,button')].every(el=>el.disabled);locked.remove();
   results.push({type,mode,rejected,escaped,fresh,unchanged,lockedSafe});
  }return results;
 });
 for(const result of structuredRecovery)for(const key of ['rejected','escaped','fresh','unchanged','lockedSafe'])assert.equal(result[key],true,JSON.stringify(result));
 const invalidStructuredRecovery=await editor.evaluate(async()=>{
  const {renderStructuredInspector}=await import('/editor-v2/ui/structured-inspector.js');
  const node={id:'invalid-structured-table',type:'table',props:{contentModel:{version:1,rows:[['Fejléc','Megmaradó adat'],['Rövid sor']]}}};
  const original=structuredClone(node.props);let recovered=null;
  const panel=renderStructuredInspector(node,next=>{recovered=structuredClone(next);return true;});
  document.querySelector('#inspectorBody').append(panel);
  const warning=panel.querySelector('[role="alert"]');
  const editControls=panel.querySelectorAll('.structured-input input,.structured-input textarea,[data-structured-action]:not([data-structured-action="reset-invalid"])');
  const reset=panel.querySelector('[data-structured-action="reset-invalid"]');
  const readOnly=Boolean(warning)&&editControls.length===0&&JSON.stringify(node.props)===JSON.stringify(original);
  reset?.click();
  const result={readOnly,warning:warning?.textContent||'',resetAvailable:Boolean(reset),recovered,recoveredOnlyAfterExplicitAction:Boolean(recovered)};
  panel.remove();return result;
 });
 assert.equal(invalidStructuredRecovery.readOnly,true,'malformed saved rows must not appear editable as default content or be overwritten by a later field edit');
 assert.match(invalidStructuredRecovery.warning,/hibás|sérült|formátum/i);
 assert.equal(invalidStructuredRecovery.resetAvailable,true,'a destructive recovery remains explicit and user controlled');
 assert.equal(invalidStructuredRecovery.recoveredOnlyAfterExplicitAction,true);
 assert.deepEqual(invalidStructuredRecovery.recovered,{version:1,rows:[['Oszlop 1','Oszlop 2'],['Adat 1','Adat 2']]});
 const focusGuards=await editor.evaluate(async()=>{
  const {renderStructuredInspector}=await import('/editor-v2/ui/structured-inspector.js');
  const {createElementContent}=await import('/editor-v2/core/element-content.js');
  const host=document.createElement('div');document.querySelector('#inspectorBody').append(host);
  const outside=document.createElement('button');outside.textContent='Másik vezérlő';document.body.append(outside);
  const frame=()=>new Promise(resolve=>requestAnimationFrame(resolve));
  const make=(id,model=createElementContent('list'),type='list',locked=false)=>({id,type,locked,props:{contentModel:model}});
  const button=kind=>host.querySelector(`[data-structured-action="${kind}"]`);
  const mount=(node,apply)=>{host.replaceChildren(renderStructuredInspector(node,apply));};
  const checks={};let calls=0;
  mount(make('rejected-focus'),()=>{calls++;return false;});button('add').focus();const rejected=button('add');rejected.click();await frame();
  checks.rejected=calls===1&&document.activeElement===rejected&&host.querySelectorAll('.structured-item').length===3;
  const initial=make('focus-fixture');
  const apply=next=>{mount(make(initial.id,next),apply);return true;};
  mount(initial,apply);button('add').focus();button('add').click();outside.focus();await frame();checks.newerFocus=document.activeElement===outside;
  mount(initial,apply);button('add').focus();button('add').click();mount(make('different-node'),()=>true);await frame();checks.differentNode=document.activeElement===document.body;
  mount(initial,apply);button('add').focus();button('add').click();mount(initial,apply);await frame();checks.sameNodeNewRender=document.activeElement===document.body;
  const dock=document.querySelector('#rightDock'),wasClosed=dock.classList.contains('closed');
  mount(initial,apply);button('add').focus();button('add').click();dock.classList.add('closed');await frame();checks.closedPanel=document.activeElement===document.body;dock.classList.toggle('closed',wasClosed);
  mount(initial,apply);outside.focus();button('add').click();await frame();checks.programmatic=document.activeElement===outside;
  mount(initial,apply);button('add').focus();button('add').click();button('add').focus();button('add').click();await frame();
  const last=host.querySelector('.structured-item:last-of-type .structured-input textarea');checks.newestAction=host.querySelectorAll('.structured-item').length===5&&document.activeElement===last;
  calls=0;
  for(const node of [make('locked-focus',undefined,'list',true),make('minimum-list',{version:1,ordered:false,items:['One']}),make('maximum-list',{version:1,ordered:false,items:Array(40).fill('One')}),make('minimum-table',{version:1,rows:[['Header']]},'table'),make('maximum-table',{version:1,rows:[Array(12).fill('Header')]},'table')]){
   mount(node,()=>{calls++;return true;});for(const disabled of host.querySelectorAll('button:disabled'))disabled.click();
  }
  checks.disabled=calls===0;
  const capRows={version:1,rows:Array.from({length:40},(_,i)=>[i===0?'Fejléc':'Sor '+i])};
  mount(make('max-table-rows',capRows,'table'),()=>{calls++;return true;});
  checks.tableRowLimit=button('add-row')?.disabled===true&&
    [...host.querySelectorAll('[data-structured-action="insert-row"]')].length===40&&
    [...host.querySelectorAll('[data-structured-action="insert-row"]')].every(el=>el.disabled);
  host.remove();outside.remove();return checks;
 });
 assert.deepEqual(focusGuards,{rejected:true,newerFocus:true,differentNode:true,sameNodeNewRender:true,closedPanel:true,programmatic:true,newestAction:true,disabled:true,tableRowLimit:true});
 // Simulate an older persisted document with a row shape that the tolerant
 // legacy renderer can display but the Inspector must not silently coerce.
 // Exercise the real draft endpoint and keep Save distinct from Publish.
 draft.pages[pageId].nodes[ids.legacyList].props.contentModel.items[1]=null;
 await editor.reload();
 const postsBeforeInspection=posts.length;
 for(const width of [1366,390]){
  await editor.setViewportSize({width,height:900});await select(ids.legacyList);
  const inspector=editor.locator('.structured-inspector'),warning=inspector.getByRole('alert');
  await warning.waitFor();
  assert.match(await warning.textContent(),/2\. sora/);
  assert.equal(await inspector.locator('.structured-input').count(),0,'malformed legacy rows do not expose lossy normal inputs at '+width+'px');
  const repair=inspector.getByRole('button',{name:'Hibás sorok cseréje alapértékre'});
  assert.equal(await repair.isEnabled(),true);
  assert.equal(posts.length,postsBeforeInspection,'opening recovery never writes or publishes at '+width+'px');
  assert.deepEqual(draft.pages[pageId].nodes[ids.legacyList].props.contentModel.items,
   ['Megőrzendő első sor',null,'Megőrzendő harmadik sor'],'the malformed row remains persisted until explicit repair');
 }
 await select(ids.badge);
 await editor.locator('.basic-content-inspector').getByRole('textbox',{name:'Címke szövege',exact:true}).fill('Nem kapcsolódó mentett módosítás');
 await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
 assert.equal(posts.at(-1).publish,false,'an unrelated Save remains draft-only');
 assert.deepEqual(draft.pages[pageId].nodes[ids.legacyList].props.contentModel.items,
  ['Megőrzendő első sor',null,'Megőrzendő harmadik sor'],'saving another node must preserve the untouched malformed row exactly');
 await editor.reload();await select(ids.legacyList);
 await editor.locator('.structured-inspector').getByRole('alert').waitFor();
 const postsBeforeRepair=posts.length;
 await editor.locator('.structured-inspector').getByRole('button',{name:'Hibás sorok cseréje alapértékre'}).click();
 assert.equal(await editor.locator('.structured-inspector .structured-item textarea').nth(1).inputValue(),'');
 assert.equal(posts.length,postsBeforeRepair,'explicit recovery is still a local draft edit');
 await editor.keyboard.press('Control+z');
 await editor.locator('.structured-inspector').getByRole('alert').waitFor();
 assert.equal(posts.length,postsBeforeRepair,'Undo restores the malformed draft without persisting it');
 await editor.keyboard.press('Control+Shift+z');
 assert.equal(await editor.locator('.structured-inspector .structured-item textarea').nth(1).inputValue(),'','Redo restores only the explicit repair');
 await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
 assert.equal(posts.at(-1).publish,false,'recovered legacy content is saved as a draft first');
 assert.deepEqual(draft.pages[pageId].nodes[ids.legacyList].props.contentModel.items,
  ['Megőrzendő első sor','','Megőrzendő harmadik sor'],'only the malformed row is replaced');
 await editor.reload();await select(ids.legacyList);
 assert.deepEqual(await editor.locator('.structured-inspector .structured-item textarea').evaluateAll(fields=>fields.map(field=>field.value)),
  ['Megőrzendő első sor','','Megőrzendő harmadik sor'],'explicit recovery survives draft reload');
 await viewer.reload();
 const publicLegacy=viewer.locator('.visual-editor-node[data-node-id="'+ids.legacyList+'"]');
 assert.deepEqual(await publicLegacy.locator('li').allTextContents(),
  ['Megőrzendő első sor','Sérült sor helyőrzője','Megőrzendő harmadik sor'],'Save alone leaves the previous published list intact');
 await editor.locator('#publish').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
 assert.equal(posts.at(-1).publish,true,'Publish is the separate publication operation');
 await viewer.reload();
 assert.deepEqual(await viewer.locator('.visual-editor-node[data-node-id="'+ids.legacyList+'"]').locator('li').allTextContents(),
  ['Megőrzendő első sor','','Megőrzendő harmadik sor'],'the repaired model appears publicly only after Publish');
 // A malformed structured table needs the same end-to-end recovery guarantees
 // as the legacy list: opening and unrelated edits cannot coerce stored rows.
 const malformedTable={version:1,rows:[['Fejléc','Megmaradó adat'],[{legacy:{value:'nem szöveg cella'}},'Második sor']]};
 const previousPublishedTable=structuredClone(published.pages[pageId].nodes[ids.table].props.contentModel);
 draft.pages[pageId].nodes[ids.table].props.contentModel=structuredClone(malformedTable);
 await editor.reload();
 const postsBeforeTableInspection=posts.length;
 for(const width of [1366,390]){
  await editor.setViewportSize({width,height:900});await select(ids.table);
  const inspector=editor.locator('.structured-inspector'),warning=inspector.getByRole('alert');
  await warning.waitFor();
  assert.match(await warning.textContent(),/hibás|nem támogatott.*formátum/i,
   'the malformed table warns instead of silently normalizing at '+width+'px');
  assert.equal(await inspector.locator('.structured-input').count(),0,
   'object-valued table cells stay read-only until an explicit repair at '+width+'px');
  assert.deepEqual(draft.pages[pageId].nodes[ids.table].props.contentModel,malformedTable,
   'opening the table Inspector preserves the exact persisted object-valued cells at '+width+'px');
  assert.equal(posts.length,postsBeforeTableInspection,
   'opening table recovery never Saves or Publishes at '+width+'px');
 }
 await select(ids.badge);
 await editor.locator('.basic-content-inspector').getByRole('textbox',{name:'Címke szövege',exact:true}).fill('Táblázat-helyreállítási izolációs mentés');
 const postsBeforeTableUnrelatedSave=posts.length;
 await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
 assert.equal(posts.length,postsBeforeTableUnrelatedSave+1);
 assert.equal(posts.at(-1).publish,false,'an unrelated Save remains draft-only during table recovery');
 assert.deepEqual(draft.pages[pageId].nodes[ids.table].props.contentModel,malformedTable,
  'saving another element preserves the malformed table exactly');
 assert.deepEqual(published.pages[pageId].nodes[ids.table].props.contentModel,previousPublishedTable,
  'an unrelated Save leaves the previously published table untouched');
 await editor.reload();await select(ids.table);
 const recoveryTableInspector=editor.locator('.structured-inspector');
 await recoveryTableInspector.getByRole('alert').waitFor();
 const postsBeforeTableRepair=posts.length;
 const repairTableButton=recoveryTableInspector.getByRole('button',{name:'Hibás sorok cseréje alapértékre'});
 await repairTableButton.focus();
 await editor.keyboard.press('Enter');
 await editor.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>resolve())));
 assert.equal(await editor.evaluate(()=>document.activeElement?.getAttribute('aria-label')),'Oszlop 1',
  'keyboard recovery moves focus to the first repaired table cell instead of losing the active Inspector position');
 const repairedTable={version:1,rows:[['Fejléc','Megmaradó adat'],['Oszlop 1','Oszlop 2']]};
 const editorTable=editor.locator('.node[data-node-id="'+ids.table+'"]');
 assert.equal(await editorTable.locator('thead th[scope="col"]').count(),2,
  'explicit recovery restores a valid two-column header on the Canvas');
 assert.deepEqual(draft.pages[pageId].nodes[ids.table].props.contentModel,malformedTable,
  'explicit recovery remains local until Save');
 assert.equal(posts.length,postsBeforeTableRepair,'repair never autosaves or publishes the table');
 await editor.keyboard.press('Control+z');await recoveryTableInspector.getByRole('alert').waitFor();
 assert.deepEqual(draft.pages[pageId].nodes[ids.table].props.contentModel,malformedTable,
  'Undo restores the malformed local table without changing the server draft');
 assert.equal(posts.length,postsBeforeTableRepair,'Undo and recovery remain local');
 await editor.keyboard.press('Control+Shift+z');
 assert.equal(await editorTable.locator('thead th[scope="col"]').count(),2,
  'Redo restores the explicit table repair');
 await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
 assert.equal(posts.at(-1).publish,false,'the repaired table is first persisted by Save');
 assert.deepEqual(posts.at(-1).document.pages[pageId].nodes[ids.table].props.contentModel,repairedTable,
  'Save stores only the explicit malformed-row replacement and preserves valid table rows');
 assert.deepEqual(published.pages[pageId].nodes[ids.table].props.contentModel,previousPublishedTable,
  'draft Save keeps the previous public table snapshot intact');
 await editor.reload();await select(ids.table);
 assert.deepEqual(await editor.locator('.structured-item').evaluateAll(rows=>rows.map(row=>Array.from(row.querySelectorAll('.structured-input input,.structured-input textarea'),field=>field.value))),
  repairedTable.rows,'table recovery survives a full Editor reload');
 await viewer.reload();
 const unchangedPublicTable=viewer.locator('.visual-editor-node[data-node-id="'+ids.table+'"] .visual-structured-table');
 assert.deepEqual(await unchangedPublicTable.locator('thead th').allTextContents(),previousPublishedTable.rows[0],
  'draft Save keeps the original public table headings');
 assert.deepEqual(await unchangedPublicTable.locator('tbody tr').evaluateAll(rows=>rows.map(row=>Array.from(row.querySelectorAll('td'),cell=>cell.textContent))),
  previousPublishedTable.rows.slice(1),'draft Save keeps every previous public table data row');
 const postsBeforeTablePublish=posts.length;
 await editor.locator('#publish').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
 assert.equal(posts.length,postsBeforeTablePublish+1);
 assert.equal(posts.at(-1).publish,true,'only explicit Publish exposes the recovered table');
 await viewer.reload();
 const publicRepairedTable=viewer.locator('.visual-editor-node[data-node-id="'+ids.table+'"] .visual-structured-table');
 assert.deepEqual(await publicRepairedTable.locator('thead th[scope="col"]').allTextContents(),repairedTable.rows[0],
  'separate Publish exposes exactly the recovered accessible headings');
 assert.deepEqual(await publicRepairedTable.locator('tbody tr').evaluateAll(rows=>rows.map(row=>Array.from(row.querySelectorAll('td'),cell=>cell.textContent))),
  repairedTable.rows.slice(1),'separate Publish exposes repaired data cells in order');
 const postsBeforeMalformedReset=posts.length,publishedGallery=structuredClone(published.pages[pageId].nodes[ids.gallery].props.contentModel);
 draft.pages[pageId].nodes[ids.gallery].props.contentModel={version:1,items:'invalid'};
 await editor.reload();await select(ids.gallery);
 const resetInspector=editor.locator('.structured-inspector');await resetInspector.getByRole('alert').waitFor();
 const resetButton=resetInspector.getByRole('button',{name:'Alapértelmezett tartalom visszaállítása'});
 await resetButton.focus();await editor.keyboard.press('Enter');
 await editor.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>resolve())));
 assert.equal(await editor.evaluate(()=>document.activeElement?.getAttribute('aria-label')),'Kép URL',
  'keyboard reset of a wholly malformed model returns focus to the first default field');
 assert.equal(posts.length,postsBeforeMalformedReset,'malformed-content reset remains a local draft edit');
 assert.deepEqual(published.pages[pageId].nodes[ids.gallery].props.contentModel,publishedGallery,
  'local reset never changes the separately published gallery');
 assert.deepEqual(errors,[]);
});
