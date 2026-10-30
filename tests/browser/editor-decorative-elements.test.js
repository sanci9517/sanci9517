import assert from 'node:assert/strict';
import test from 'node:test';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve,extname} from 'node:path';
import {chromium} from 'playwright';
import {createDocument,createNode} from '../../public/editor-v2/core/schema.js';
import {createEditorState,activePage} from '../../public/editor-v2/core/state.js';
import {execute} from '../../public/editor-v2/core/commands.js';
import {tokenReference} from '../../public/editor-v2/core/design-tokens.js';

test('partial palette types and Divider/Spacer Inspector edits become public only after Publish',async t=>{
 const model=createEditorState(createDocument()),pageId=model.document.activePageId,root=activePage(model).rootId;
 execute(model,{type:'element.add',payload:{type:'divider',parentId:root}});const dividerId=model.selection.primaryId;
 execute(model,{type:'element.add',payload:{type:'spacer',parentId:root}});const spacerId=model.selection.primaryId;
 const legacyDividerId='legacy-divider-fixture';
 const legacyDivider=createNode('divider',{id:legacyDividerId,parentId:root,name:'Régi elválasztóvonal'});
 legacyDivider.style.border='7px solid red';
 legacyDivider.style.background='#f00';
 activePage(model).nodes[legacyDividerId]=legacyDivider;
 activePage(model).nodes[root].children.push(legacyDividerId);
 const unsafeBackground=createNode('divider',{id:'legacy-background-url',parentId:root,name:'Régi háttér'});
 unsafeBackground.style.background='u\\72l("https://legacy-background.invalid/pixel.png")';
 activePage(model).nodes[unsafeBackground.id]=unsafeBackground;
 activePage(model).nodes[root].children.push(unsafeBackground.id);
 const legacyGradient='linear-gradient(135deg, #7047eb 0%, #17b8a6 100%)';
 const computedGradient=value=>value.replace(/#[\da-f]{6}/gi,hex=>{const color=hex.slice(1);return`rgb(${parseInt(color.slice(0,2),16)}, ${parseInt(color.slice(2,4),16)}, ${parseInt(color.slice(4,6),16)})`});
 const legacyGradientId='legacy-background-gradient';
 const legacyGradientNode=createNode('divider',{id:legacyGradientId,parentId:root,name:'Régi átmenetes háttér'});
 legacyGradientNode.style.background=legacyGradient;
 activePage(model).nodes[legacyGradientId]=legacyGradientNode;
 activePage(model).nodes[root].children.push(legacyGradientId);
 const legacyTokenId='legacy-background-token';
 const legacyTokenNode=createNode('divider',{id:legacyTokenId,parentId:root,name:'Régi márka-token háttér'});
 legacyTokenNode.style.background=tokenReference('colors.primary');
 activePage(model).nodes[legacyTokenId]=legacyTokenNode;
 activePage(model).nodes[root].children.push(legacyTokenId);
 const legacySpacerId='legacy-spacer-fixture';
 const legacySpacer=createNode('spacer',{id:legacySpacerId,parentId:root,name:'Régi üres térköz'});
 activePage(model).nodes[legacySpacerId]=legacySpacer;
 activePage(model).nodes[root].children.push(legacySpacerId);
 execute(model,{type:'element.add',payload:{type:'image',parentId:root,props:{src:'/fixture.svg',alt:'Feliratos kép',caption:'Képaláírás'}}});
 const captionedImageId=model.selection.primaryId;
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
  if(url.pathname==='/api/public/presentation')return json({ok:true,data:{tokens:{colors:{primary:'#1266cc'}}}});
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
 await Promise.all([editor.route('https://legacy-background.invalid/**',route=>route.abort()),viewer.route('https://legacy-background.invalid/**',route=>route.abort())]);
 editor.setDefaultTimeout(7000);viewer.setDefaultTimeout(7000);
 const errors=[];editor.on('pageerror',e=>errors.push('editor: '+e.message));viewer.on('pageerror',e=>errors.push('public: '+e.message));
 const editorExternal=[];editor.on('request',request=>{if(request.url().includes('legacy-background.invalid'))editorExternal.push(request.url())});
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
 const selectStyle=async id=>{
  await canvasNode(id).evaluate(el=>el.click());
  if(await editor.locator('#rightDock').evaluate(el=>el.classList.contains('closed')))await editor.locator('#openInspector').click();
  await editor.locator('.inspector-tabs button').first().click();
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
 const paletteColors={divider:'#3b82f6',panel:'#ef4444',overlay:'#10b981',absolute:'#f59e0b',sticky:'#8b5cf6',badge:'#ec4899',quote:'#14b8a6',tooltip:'#f97316'};
 const asRgb=hex=>{const value=hex.slice(1);return `rgb(${parseInt(value.slice(0,2),16)}, ${parseInt(value.slice(2,4),16)}, ${parseInt(value.slice(4,6),16)})`};
 for(const [type,nodeId] of Object.entries(paletteAddedNodeIds)){
  await selectStyle(nodeId);
  const background=editor.locator('.typed-inspector-field[data-property-id="background.color"]');
  assert.equal(await background.getAttribute('data-property-command'),'responsive.set',`${type}: shared background field exposes its command route`);
  assert.equal(await background.getAttribute('data-property-key'),'backgroundColor',`${type}: shared background field exposes its Page Model key`);
  const input=background.locator('input[type="color"]'),previous=await canvasNode(nodeId).evaluate(el=>getComputedStyle(el).backgroundColor);
  await input.evaluate((el,value)=>{el.value=value;el.dispatchEvent(new Event('change',{bubbles:true}))},paletteColors[type]);
  const next=await canvasNode(nodeId).evaluate(el=>getComputedStyle(el).backgroundColor);
  assert.equal(next,asRgb(paletteColors[type]),`${type}: Inspector background color reaches Canvas`);
  await editor.locator('#undo').click();
  assert.equal(await canvasNode(nodeId).evaluate(el=>getComputedStyle(el).backgroundColor),previous,`${type}: background edit is undoable`);
  await editor.locator('#redo').click();
  assert.equal(await canvasNode(nodeId).evaluate(el=>getComputedStyle(el).backgroundColor),next,`${type}: background edit is redoable`);
 }
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
  assert.equal(draft.pages[pageId].nodes[nodeId].responsive.desktop.backgroundColor,paletteColors[type],`Save persists the ${type} Inspector background edit`);
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
 for(const [type,nodeId] of Object.entries(paletteAddedNodeIds)){
  assert.equal(await publicNode(nodeId).count(),1,`palette-created ${type} appears publicly only after Publish`);
  assert.equal(await publicNode(nodeId).evaluate(el=>getComputedStyle(el).backgroundColor),asRgb(paletteColors[type]),`published ${type} preserves Inspector background color`);
 }
 assert.equal(await publicNode(dividerId).evaluate(el=>getComputedStyle(el).borderTopWidth),'6px');
 assert.equal(await publicNode(dividerId).evaluate(el=>getComputedStyle(el).borderTopStyle),'dashed');
 assert.equal(await publicNode(dividerId).evaluate(el=>getComputedStyle(el).borderTopColor),'rgb(34, 170, 102)');
 assert.equal(await publicNode(spacerId).evaluate(el=>getComputedStyle(el).height),'120px');
 await publicNode(tooltipId).locator('button').focus();
 assert.equal(await publicNode(tooltipId).getByRole('tooltip').textContent(),'További információ erről az elemről.','tooltip content and its required description reach the public page');
 await viewer.setViewportSize({width:390,height:800});await viewer.reload();
 assert.equal(await publicNode(spacerId).evaluate(el=>getComputedStyle(el).height),'40px','mobile spacer keeps its own height');

 // Versionless Divider nodes remain legacy-compatible, while shared
 // responsive border edits must still win over the legacy public fallback.
 await editor.locator('.canvas-device-btn[data-device="desktop"]').click();
 await viewer.setViewportSize({width:1366,height:900});
 await viewer.reload();
 await viewer.waitForFunction(id=>document.querySelector(`.visual-editor-node[data-node-id="${id}"]`),legacyDividerId);
 assert.equal(draft.pages[pageId].nodes[legacyDividerId].metadata.decorativeVersion,undefined,'fixture remains a versionless legacy Divider');
 const borderOf=element=>element.evaluate(el=>{const css=getComputedStyle(el);return{width:css.borderTopWidth,style:css.borderTopStyle,color:css.borderTopColor}});
 const originalBorder={width:'7px',style:'solid',color:'rgb(255, 0, 0)'};
 assert.deepEqual(await borderOf(canvasNode(legacyDividerId)),originalBorder,'legacy border shorthand remains visible in the Canvas');
 assert.deepEqual(await borderOf(publicNode(legacyDividerId)),originalBorder,'legacy published border remains unchanged before Inspector edits');
 assert.equal(await canvasNode(legacyDividerId).evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(255, 0, 0)','legacy literal background color is visible on Canvas');
 assert.equal(await publicNode(legacyDividerId).evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(255, 0, 0)','legacy literal background color remains visible publicly');
 assert.equal(await canvasNode(legacyGradientId).evaluate(el=>getComputedStyle(el).backgroundImage),computedGradient(legacyGradient),'allowlisted legacy gradient is visible on Canvas');
 assert.equal(await publicNode(legacyGradientId).evaluate(el=>getComputedStyle(el).backgroundImage),computedGradient(legacyGradient),'allowlisted legacy gradient is visible publicly');
 assert.equal(await canvasNode(legacyTokenId).evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(18, 102, 204)','exact Brand Kit color token resolves on Canvas');
 assert.equal(await publicNode(legacyTokenId).evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(18, 102, 204)','exact Brand Kit color token resolves publicly');
 for(const [device,width] of [['tablet',768],['mobile',390],['desktop',1366]]){
  await editor.locator(`.canvas-device-btn[data-device="${device}"]`).click();
  await viewer.setViewportSize({width,height:900});await viewer.reload();
  assert.equal(await canvasNode(legacyGradientId).evaluate(el=>getComputedStyle(el).backgroundImage),computedGradient(legacyGradient),`${device} Canvas preserves the legacy gradient`);
  assert.equal(await publicNode(legacyGradientId).evaluate(el=>getComputedStyle(el).backgroundImage),computedGradient(legacyGradient),`${device} public page preserves the legacy gradient`);
  assert.equal(await canvasNode(legacyTokenId).evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(18, 102, 204)',`${device} Canvas resolves the Brand Kit background token`);
  assert.equal(await publicNode(legacyTokenId).evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(18, 102, 204)',`${device} public page resolves the Brand Kit background token`);
 }
 assert.deepEqual(editorExternal,[],'escaped legacy URL must not cause a new Canvas resource request');
 await selectStyle(legacyDividerId);
 const backgroundField=editor.locator('[data-property-id="background.color"]');
 const backgroundGroup=backgroundField.locator('xpath=ancestor::section[1]'),backgroundTitle=backgroundGroup.locator(':scope > .inspector-group-title');
 if(await backgroundTitle.getAttribute('aria-expanded')==='false')await backgroundTitle.click();
 await backgroundField.locator('input[type="color"]').evaluate(input=>{input.value='#0000ff';input.dispatchEvent(new Event('change',{bubbles:true}))});
 assert.equal(await canvasNode(legacyDividerId).evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(0, 0, 255)','Inspector color overrides legacy background on Canvas');
 const legacyBorderGroup=editor.locator('.inspector-group').filter({hasText:'Szegély'});
 const legacyBorderTitle=legacyBorderGroup.locator(':scope > .inspector-group-title');
 if(await legacyBorderTitle.getAttribute('aria-expanded')==='false')await legacyBorderTitle.click();
 const legacyBorderStyle=legacyBorderGroup.locator('[data-property-id="border.style"]');
 const legacyBorderWidth=legacyBorderGroup.locator('[data-property-id="border.width"]');
 const legacyBorderColor=legacyBorderGroup.locator('[data-property-id="border.color"]');
 assert.equal(await legacyBorderStyle.getAttribute('data-property-command'),'responsive.set');
 assert.equal(await legacyBorderWidth.getAttribute('data-property-key'),'borderWidth');
 assert.equal(await legacyBorderColor.getAttribute('data-property-key'),'borderColor');
 await legacyBorderStyle.locator('select:not(.property-token-picker)').selectOption('solid');
 const legacyWidthInput=legacyBorderWidth.locator('.dimension-controls input[type="number"]');
 await legacyWidthInput.fill('4');
 await legacyWidthInput.press('Tab');
 await legacyBorderColor.locator('input[type="color"]').evaluate(input=>{input.value='#e11d48';input.dispatchEvent(new Event('change',{bubbles:true}))});
 assert.deepEqual(await canvasNode(legacyDividerId).evaluate(el=>{const css=getComputedStyle(el);return{width:css.borderTopWidth,style:css.borderTopStyle,color:css.borderTopColor}}),{width:'4px',style:'solid',color:'rgb(225, 29, 72)'},'legacy Divider Inspector border edit reaches Canvas');
 const legacyPublicBaseline=await publicNode(legacyDividerId).evaluate(el=>{const css=getComputedStyle(el);return{width:css.borderTopWidth,style:css.borderTopStyle,color:css.borderTopColor}});
 await editor.locator('#save').click();
 await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
 assert.equal(draft.pages[pageId].nodes[legacyDividerId].responsive.desktop.borderColor,'#e11d48');
 await viewer.reload();
 await viewer.waitForFunction(id=>document.querySelector(`.visual-editor-node[data-node-id="${id}"]`),legacyDividerId);
 assert.deepEqual(await publicNode(legacyDividerId).evaluate(el=>{const css=getComputedStyle(el);return{width:css.borderTopWidth,style:css.borderTopStyle,color:css.borderTopColor}}),legacyPublicBaseline,'legacy Divider draft Save leaves public CSS unchanged');
 assert.equal(await publicNode(legacyDividerId).evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(255, 0, 0)','draft Save does not publish the Inspector color');
 await editor.locator('#publish').click();
 await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
 await viewer.reload();
 await viewer.waitForFunction(id=>document.querySelector(`.visual-editor-node[data-node-id="${id}"]`),legacyDividerId);
 assert.deepEqual(await publicNode(legacyDividerId).evaluate(el=>{const css=getComputedStyle(el);return{width:css.borderTopWidth,style:css.borderTopStyle,color:css.borderTopColor}}),{width:'4px',style:'solid',color:'rgb(225, 29, 72)'},'legacy Divider explicit Publish preserves its shared responsive border edits');
 assert.equal(await publicNode(legacyDividerId).evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(0, 0, 255)','explicit Publish applies the Inspector background color');

 // A canonical responsive gradient overrides the safe legacy fallback. Save
 // keeps it private, Publish makes it public, and an explicit `none` removes it.
 await selectStyle(legacyGradientId);
 const gradientField=editor.locator('[data-property-id="background.gradient"]');
 const gradientGroup=gradientField.locator('xpath=ancestor::section[1]'),gradientTitle=gradientGroup.locator(':scope > .inspector-group-title');
 if(await gradientTitle.getAttribute('aria-expanded')==='false')await gradientTitle.click();
 assert.equal(await gradientField.getAttribute('data-property-command'),'responsive.set');
 assert.equal(await gradientField.getAttribute('data-property-key'),'backgroundImage');
 const gradientSelect=gradientField.locator('select:not(.property-token-picker)');
 const inspectorGradient='linear-gradient(135deg, #111827 0%, #475569 100%)';
 await gradientSelect.selectOption(inspectorGradient);
 assert.equal(await canvasNode(legacyGradientId).evaluate(el=>getComputedStyle(el).backgroundImage),computedGradient(inspectorGradient),'Inspector gradient replaces the legacy Canvas fallback');
 assert.equal(await publicNode(legacyGradientId).evaluate(el=>getComputedStyle(el).backgroundImage),computedGradient(legacyGradient),'unsaved gradient remains absent from the public page');
 await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
 assert.equal(draft.pages[pageId].nodes[legacyGradientId].responsive.desktop.backgroundImage,inspectorGradient);
 await viewer.reload();assert.equal(await publicNode(legacyGradientId).evaluate(el=>getComputedStyle(el).backgroundImage),computedGradient(legacyGradient),'draft Save does not publish the gradient');
 await editor.locator('#publish').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
 await viewer.reload();assert.equal(await publicNode(legacyGradientId).evaluate(el=>getComputedStyle(el).backgroundImage),computedGradient(inspectorGradient),'Publish applies the Inspector gradient');
 await gradientSelect.selectOption('none');
 assert.equal(await canvasNode(legacyGradientId).evaluate(el=>getComputedStyle(el).backgroundImage),'none','explicit Inspector none suppresses the legacy fallback on Canvas');
 await editor.locator('#publish').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
 await viewer.reload();assert.equal(await publicNode(legacyGradientId).evaluate(el=>getComputedStyle(el).backgroundImage),'none','explicit Inspector none suppresses the legacy fallback publicly');

 await editor.locator('.canvas-device-btn[data-device="tablet"]').click();
 await viewer.setViewportSize({width:768,height:900});await viewer.reload();
 assert.equal(await canvasNode(legacyDividerId).evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(0, 0, 255)','tablet Canvas inherits the desktop override');
 assert.equal(await publicNode(legacyDividerId).evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(0, 0, 255)','tablet public page inherits the desktop override');
 await editor.locator('.canvas-device-btn[data-device="mobile"]').click();
 await viewer.setViewportSize({width:390,height:800});await viewer.reload();
 await selectStyle(legacyDividerId);
 const mobileBackground=editor.locator('[data-property-id="background.color"]');
 const mobileBackgroundTitle=mobileBackground.locator('xpath=ancestor::section[1]').locator(':scope > .inspector-group-title');
 if(await mobileBackgroundTitle.getAttribute('aria-expanded')==='false')await mobileBackgroundTitle.click();
 await mobileBackground.locator('input[type="color"]').evaluate(input=>{input.value='#00ff00';input.dispatchEvent(new Event('change',{bubbles:true}))});
 assert.equal(await canvasNode(legacyDividerId).evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(0, 255, 0)','mobile override reaches Canvas');
 await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));await viewer.reload();
 assert.equal(await publicNode(legacyDividerId).evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(0, 0, 255)','mobile draft does not alter published color');
 await editor.locator('#publish').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));await viewer.reload();
 assert.equal(await publicNode(legacyDividerId).evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(0, 255, 0)','mobile color reaches published page after Publish');
 await editor.locator('.property-reset[title^="mobile nézet"][data-property-key="backgroundColor"]').click();
 assert.equal(await canvasNode(legacyDividerId).evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(0, 0, 255)','mobile reset restores inherited desktop color');
 await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));await viewer.reload();
 assert.equal(await publicNode(legacyDividerId).evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(0, 255, 0)','mobile reset remains draft until Publish');
 await editor.locator('#publish').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));await viewer.reload();
 assert.equal(await publicNode(legacyDividerId).evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(0, 0, 255)','published reset restores inherited desktop color');
 await editor.locator('.canvas-device-btn[data-device="desktop"]').click();await viewer.setViewportSize({width:1366,height:900});await viewer.reload();

 // Captioned legacy images render as a figure. Its fallback margin must not
 // override the shared responsive Inspector margin after explicit Publish.
 await selectStyle(captionedImageId);
 const imageMargin=editor.locator('.typed-inspector-field[data-property-id="spacing.margin"]');
 assert.equal(await imageMargin.getAttribute('data-property-command'),'responsive.set');
 assert.equal(await imageMargin.getAttribute('data-property-key'),'margin');
 const marginGroup=imageMargin.locator('xpath=ancestor::section[1]'),marginTitle=marginGroup.locator(':scope > .inspector-group-title');
 if(await marginTitle.getAttribute('aria-expanded')==='false')await marginTitle.click();
 const imageMarginTop=imageMargin.locator('.typed-box-side input[type="number"]').first();
 await imageMarginTop.fill('16');await imageMarginTop.press('Tab');
 assert.equal(await canvasNode(captionedImageId).evaluate(el=>getComputedStyle(el).marginTop),'16px','captioned image Inspector margin reaches the Canvas');
 const publicImageMargin=publicNode(captionedImageId);
 assert.equal(await publicImageMargin.evaluate(el=>el.tagName.toLowerCase()),'figure','legacy image caption renders a public figure');
 const publicImageMarginBaseline=await publicImageMargin.evaluate(el=>getComputedStyle(el).marginTop);
 await editor.locator('#save').click();
 await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
 assert.equal(draft.pages[pageId].nodes[captionedImageId].responsive.desktop.margin,'16px 0 0 0','draft Save stores the Inspector margin');
 await viewer.reload();
 assert.equal(await publicNode(captionedImageId).evaluate(el=>getComputedStyle(el).marginTop),publicImageMarginBaseline,'draft Save leaves published figure margin unchanged');
 await editor.locator('#publish').click();
 await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
 await viewer.reload();
 assert.equal(await publicNode(captionedImageId).evaluate(el=>getComputedStyle(el).marginTop),'16px','captioned image explicit Publish preserves its shared responsive Inspector margin');

 // Versionless Spacer fallback height must yield to a responsive Inspector
 // height instead of its historical 60px placeholder minimum.
 await selectStyle(legacySpacerId);
 const legacySpacerHeight=editor.locator('.typed-inspector-field[data-property-id="size.height"]');
 assert.equal(await legacySpacerHeight.getAttribute('data-property-command'),'responsive.set');
 assert.equal(await legacySpacerHeight.getAttribute('data-property-key'),'height');
 const legacySpacerGroup=legacySpacerHeight.locator('xpath=ancestor::section[1]'),legacySpacerTitle=legacySpacerGroup.locator(':scope > .inspector-group-title');
 if(await legacySpacerTitle.getAttribute('aria-expanded')==='false')await legacySpacerTitle.click();
 await legacySpacerHeight.locator('.dimension-controls select').selectOption('px');
 const legacySpacerHeightInput=legacySpacerHeight.locator('.dimension-controls input[type="number"]');
 await legacySpacerHeightInput.fill('40');await legacySpacerHeightInput.press('Tab');
 assert.equal(await canvasNode(legacySpacerId).evaluate(el=>getComputedStyle(el).height),'40px','versionless Spacer Inspector height reaches Canvas');
 const legacySpacerPublicBaseline=await publicNode(legacySpacerId).evaluate(el=>getComputedStyle(el).height);
 await editor.locator('#save').click();
 await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
 assert.equal(draft.pages[pageId].nodes[legacySpacerId].responsive.desktop.height,'40px','draft Save stores legacy Spacer Inspector height');
 await viewer.reload();
 assert.equal(await publicNode(legacySpacerId).evaluate(el=>getComputedStyle(el).height),legacySpacerPublicBaseline,'draft Save leaves legacy Spacer publication unchanged');
 await editor.locator('#publish').click();
 await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
 await viewer.reload();
 assert.equal(await publicNode(legacySpacerId).evaluate(el=>getComputedStyle(el).height),'40px','legacy Spacer explicit Publish honors the shared Inspector height');
 assert.deepEqual(errors,[]);
});
