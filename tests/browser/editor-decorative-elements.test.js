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

test('partial palette types and Divider/Spacer Inspector edits become public only after Publish',async t=>{
 const model=createEditorState(createDocument()),pageId=model.document.activePageId,root=activePage(model).rootId;
 execute(model,{type:'element.add',payload:{type:'divider',parentId:root}});const dividerId=model.selection.primaryId;
 execute(model,{type:'element.add',payload:{type:'spacer',parentId:root}});const spacerId=model.selection.primaryId;
 let draft=structuredClone(model.document),published=structuredClone(draft),version=1;
 const posts=[],assetRoot=resolve(import.meta.dirname,'../../public');
 const server=createServer(async(req,res)=>{
  const url=new URL(req.url,'http://localhost');
  const json=data=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(data));};
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
  const path=url.pathname==='/p/test'?'/visual-page.html':url.pathname,file=resolve(assetRoot,'.'+path);
  if(!file.startsWith(assetRoot+'/'))return res.writeHead(403).end();
  try{res.setHeader('content-type',{'.html':'text/html','.js':'text/javascript','.css':'text/css'}[extname(file)]||'application/octet-stream');res.end(await readFile(file))}
  catch{res.writeHead(404).end()}
 });
 await new Promise(done=>server.listen(0,'127.0.0.1',done));
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
 t.after(async()=>{await browser.close();await new Promise(done=>server.close(done))});
 const base='http://127.0.0.1:'+server.address().port;
 const editor=await browser.newPage({viewport:{width:1366,height:900}}),viewer=await browser.newPage({viewport:{width:1366,height:900}});
 editor.setDefaultTimeout(7000);viewer.setDefaultTimeout(7000);
 const errors=[];editor.on('pageerror',e=>errors.push('editor: '+e.message));viewer.on('pageerror',e=>errors.push('public: '+e.message));
 await editor.goto(base+'/editor-v2/index.html');await viewer.goto(base+'/p/test');
 await editor.locator('.rail-btn[data-tab="elements"]').click();
 const paletteLayout=editor.locator('.element-group').filter({has:editor.locator('.element-group-title').filter({hasText:'Layout'})});
 await paletteLayout.locator('.element-group-title').click();
 const dividerEntry=paletteLayout.locator('button.element').filter({hasText:'Divider'});
 assert.equal(await dividerEntry.count(),1,'implemented Divider is available in the Layout palette');
 const nodeIdsBeforePaletteAdd=await editor.locator('.node[data-node-id]').evaluateAll(nodes=>nodes.map(node=>node.dataset.nodeId));
 await dividerEntry.click();
 const paletteAddedNodeId=await editor.locator('.node[data-node-id]').evaluateAll((nodes,before)=>nodes.map(node=>node.dataset.nodeId).find(id=>!before.includes(id)),nodeIdsBeforePaletteAdd);
 assert.ok(paletteAddedNodeId,'palette selection creates a Canvas node');
 assert.equal(await editor.locator(`.node[data-node-id="${paletteAddedNodeId}"]`).count(),1,'the newly created node is visible on Canvas');
 const canvasNode=id=>editor.locator('.node[data-node-id="'+id+'"]');
 const publicNode=id=>viewer.locator('.visual-editor-node[data-node-id="'+id+'"]');
 const paletteAddedNodeIds={divider:paletteAddedNodeId};
 for(const [type,groupName,label] of [
  ['panel','Layout','Panel'],['overlay','Layout','Overlay'],['absolute','Layout','Absolute'],['sticky','Layout','Sticky'],
  ['badge','Szöveg','Badge/Tag'],['quote','Szöveg','Quote'],['tooltip','Szöveg','Tooltip']
 ]){
  await canvasNode(dividerId).evaluate(el=>el.click());
  const group=editor.locator('.element-group').filter({has:editor.locator('.element-group-title').filter({hasText:groupName})});
  if(await group.evaluate(el=>el.classList.contains('collapsed')))await group.locator('.element-group-title').click();
  const entry=group.locator('button.element').filter({hasText:label});
  assert.equal(await entry.count(),1,`${label} has one honest partial-capability palette entry`);
  assert.equal(await entry.isEnabled(),true,`${label} can be added because its Inspector, Canvas and public capability is partial`);
  const before=await editor.locator('.node[data-node-id]').evaluateAll(nodes=>nodes.map(node=>node.dataset.nodeId));
  await entry.click();
  const newId=await editor.locator('.node[data-node-id]').evaluateAll((nodes,existing)=>nodes.map(node=>node.dataset.nodeId).find(id=>!existing.includes(id)),before);
  assert.ok(newId,`${label} palette entry creates a Canvas Page Model node`);
  paletteAddedNodeIds[type]=newId;
 }
 const select=async id=>{
  await canvasNode(id).evaluate(el=>el.click());
  if(await editor.locator('#rightDock').evaluate(el=>el.classList.contains('closed')))await editor.locator('#openInspector').click();
  await editor.locator('.inspector-tabs button').nth(1).click();
 };
 const tooltipId=paletteAddedNodeIds.tooltip;
 await select(tooltipId);
 const tooltipDescription=editor.locator('.content-schema-field[data-content-key="description"]');
 assert.equal(await tooltipDescription.getAttribute('data-inspector-command'),'content.properties.set');
 assert.equal(await tooltipDescription.getAttribute('data-inspector-key'),'props.description');
 await editor.locator('#publish').click();
 await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.includes('Tooltip: Felirat és magyarázat is szükséges.'));
 assert.equal(posts.length,0,'the incomplete palette tooltip is guided and blocked from Publish');
 const tooltipDescriptionText=tooltipDescription.locator('textarea');
 await tooltipDescriptionText.fill('További információ erről az elemről.');
 assert.equal(await canvasNode(tooltipId).locator('.creator-tooltip [role="tooltip"]').textContent(),'További információ erről az elemről.','tooltip description Inspector edit reaches Canvas');
 await select(dividerId);
 const controls=editor.locator('.decorative-inspector');
 assert.equal(await controls.locator('h3').textContent(),'Elválasztóvonal');
 const assertRoute=async(control,key)=>{
  assert.equal(await control.getAttribute('data-inspector-command'),'element.update',`${key}: Divider exposes the actual command route`);
  assert.equal(await control.getAttribute('data-inspector-key'),`props.decoration.${key}`,`${key}: Divider exposes the Page Model path`);
 };
 const thickness=controls.getByRole('spinbutton',{name:'Elválasztóvonal vastagsága'});
 await assertRoute(thickness,'thickness');await thickness.fill('6');await thickness.press('Tab');
 const style=controls.getByRole('combobox',{name:'Elválasztóvonal mintázata'});
 await assertRoute(style,'lineStyle');await style.selectOption('dashed');
 const color=controls.locator('input[type="color"]');await assertRoute(color,'color');
 await color.evaluate(el=>{el.value='#22aa66';el.dispatchEvent(new Event('change',{bubbles:true}))});
 assert.equal(await canvasNode(dividerId).locator('.divider-preview').evaluate(el=>getComputedStyle(el).borderTopWidth),'6px');
 assert.equal(await canvasNode(dividerId).locator('.divider-preview').evaluate(el=>getComputedStyle(el).borderTopColor),'rgb(34, 170, 102)');
 await select(spacerId);
 assert.equal(await editor.locator('.decorative-inspector h3').textContent(),'Üres térköz');
 const spacerHeight=editor.locator('.decorative-inspector .typed-inspector-field[data-property-id="size.height"]');
 assert.equal(await spacerHeight.getAttribute('data-property-command'),'responsive.set','spacer exposes its actual responsive command route');
 assert.equal(await spacerHeight.getAttribute('data-property-key'),'height','spacer exposes the Page Model height key');
 const editHeight=async value=>{
  const input=editor.locator('.decorative-inspector input[type="number"]');
  await input.fill(value);await input.press('Tab');
 };
 await editHeight('120');
 assert.equal(await canvasNode(spacerId).evaluate(el=>getComputedStyle(el).height),'120px');
 await editor.locator('.canvas-device-btn[data-device="mobile"]').click();
 await editHeight('40');
 assert.equal(await canvasNode(spacerId).evaluate(el=>getComputedStyle(el).height),'40px');
 await editor.locator('#undo').click();
 assert.equal(await canvasNode(spacerId).evaluate(el=>getComputedStyle(el).height),'120px');
 await editor.locator('#redo').click();
 assert.equal(await canvasNode(spacerId).evaluate(el=>getComputedStyle(el).height),'40px');
 assert.equal(posts.length,0,'Inspector editing must not save automatically');
 await editor.locator('#save').click();
 await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
 assert.equal(posts.at(-1).publish,false);
 for(const [type,nodeId] of Object.entries(paletteAddedNodeIds)){
  assert.equal(draft.pages[pageId].nodes[nodeId].type,type,`Save persists the palette-created ${type} Page Model node`);
  assert.equal(published.pages[pageId].nodes[nodeId],undefined,`draft Save leaves palette-created ${type} unpublished`);
 }
 await viewer.reload();
 for(const [type,nodeId] of Object.entries(paletteAddedNodeIds))assert.equal(await publicNode(nodeId).count(),0,`palette-created ${type} stays private after Save`);
 assert.equal(await publicNode(dividerId).evaluate(el=>getComputedStyle(el).borderTopWidth),'2px','Save does not change live divider');
 assert.equal(await publicNode(spacerId).evaluate(el=>getComputedStyle(el).height),'64px','Save does not change live spacer');
 await editor.locator('#publish').click();
 await editor.waitForTimeout(300);
 assert.equal(posts.at(-1).publish,true,`explicit Publish is sent; UI status: ${await editor.locator('#saveStatus').textContent()}`);
 assert.equal(posts.at(-1).publish,true);
 for(const [type,nodeId] of Object.entries(paletteAddedNodeIds))assert.equal(published.pages[pageId].nodes[nodeId].type,type,`explicit Publish copies palette-created ${type} to the live snapshot`);
 await viewer.reload();
 for(const [type,nodeId] of Object.entries(paletteAddedNodeIds))assert.equal(await publicNode(nodeId).count(),1,`palette-created ${type} appears publicly only after Publish`);
 assert.equal(await publicNode(dividerId).evaluate(el=>getComputedStyle(el).borderTopWidth),'6px');
 assert.equal(await publicNode(dividerId).evaluate(el=>getComputedStyle(el).borderTopStyle),'dashed');
 assert.equal(await publicNode(dividerId).evaluate(el=>getComputedStyle(el).borderTopColor),'rgb(34, 170, 102)');
 assert.equal(await publicNode(spacerId).evaluate(el=>getComputedStyle(el).height),'120px');
 await publicNode(tooltipId).locator('button').focus();
 assert.equal(await publicNode(tooltipId).getByRole('tooltip').textContent(),'További információ erről az elemről.','tooltip content and its required description reach the public page');
 await viewer.setViewportSize({width:390,height:800});await viewer.reload();
 assert.equal(await publicNode(spacerId).evaluate(el=>getComputedStyle(el).height),'40px','mobile spacer keeps its own height');
 assert.deepEqual(errors,[]);
});
