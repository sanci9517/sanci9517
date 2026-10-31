import assert from 'node:assert/strict';
import test from 'node:test';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve,extname} from 'node:path';
import {chromium} from 'playwright';
import {NODE_TYPES,createDocument} from '../../public/editor-v2/core/schema.js';
import {createEditorState} from '../../public/editor-v2/core/state.js';
import {execute} from '../../public/editor-v2/core/commands.js';
import {getElementCapability} from '../../public/editor-v2/core/capability-matrix.js';
import {plainTextToRichText} from '../../public/editor-v2/core/richtext-engine.js';

const publicDir=resolve(import.meta.dirname,'../../public');
const desktopColor='#16a34a';
const tabletColor='#c026d3';
const desktopFocusColor='#1d4ed8';
const tabletFocusColor='#0ea5e9';

test('editable PARTIAL types preserve tablet hover and accessible focus-visible state through Inspector, Canvas, Save and Publish',async t=>{
  const model=createEditorState(createDocument()),pageId=model.document.activePageId;
  const rootId=model.document.pages[pageId].rootId;
  const nodes=[{type:NODE_TYPES.ROOT,id:rootId}];
  const authoredTypes=new Set(['heading','text','richtext','link','button']);
  for(const type of Object.values(NODE_TYPES)){
    if(type===NODE_TYPES.ROOT||getElementCapability(type).status!=='PARTIAL')continue;
    execute(model,{type:'element.add',payload:{type,parentId:rootId,authored:authoredTypes.has(type)}});
    const id=model.selection.primaryId;
    execute(model,{type:'style.set',payload:{nodeId:id,patch:{minHeight:'30px',padding:'4px'}}});
    execute(model,{type:'states.set',payload:{nodeId:id,state:'hover',device:'desktop',patch:{backgroundColor:desktopColor}}});
    execute(model,{type:'states.set',payload:{nodeId:id,state:'focus-visible',device:'desktop',patch:{backgroundColor:desktopFocusColor}}});
    if(type==='richtext')execute(model,{type:'richtext.content.set',payload:{nodeId:id,document:plainTextToRichText('Tablet state próba')}});
    else if(authoredTypes.has(type))execute(model,{type:'element.content.set',payload:{nodeId:id,content:'Tablet state próba'}});
    if(type==='button'||type==='link')execute(model,{type:'content.properties.set',payload:{nodeId:id,patch:{href:'https://example.com'}}});
    nodes.push({type,id});
  }
  assert.equal(nodes.length,45,'fixture contains root plus every editable PARTIAL type');
  const editableNodes=nodes.filter(node=>node.type!==NODE_TYPES.ROOT);
  let draft=structuredClone(model.document),published=structuredClone(draft),revision=1;
  const posts=[],editorErrors=[];
  const server=createServer(async(req,res)=>{
    const url=new URL(req.url,'http://localhost');
    const json=data=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(data))};
    if(url.pathname==='/api/admin/pages')return json({ok:true,data:url.searchParams.get('archived')==='1'?[]:[{id:pageId,slug:'tablet-hover-partials',title:'Tablet hover fixtures',content:draft,revision,isPublished:true}]});
    if(url.pathname==='/api/admin/editor'){
      if(req.method==='GET')return json({ok:true,data:{page:{id:pageId,document:draft,publishedRevisionId:'published'},revisions:[{id:'revision-'+revision,version:revision}]}});
      let body='';for await(const chunk of req)body+=chunk;
      const request=JSON.parse(body);posts.push(request);draft=structuredClone(request.document);revision++;
      if(request.publish)published=structuredClone(draft);
      return json({ok:true,data:{pageId,version:revision,revisionId:'revision-'+revision,published:Boolean(request.publish)}});
    }
    if(url.pathname==='/api/public/pages')return json({ok:true,data:{id:pageId,slug:'tablet-hover-partials',title:'Tablet hover fixtures',description:'',content:published.pages[pageId]}});
    if(url.pathname==='/api/public/navigation')return json({ok:true,data:{items:[]}});
    if(url.pathname==='/api/integrations/twitch/connection')return json({ok:true,data:{connected:false}});
    if(url.pathname.startsWith('/api/'))return json({ok:true,data:{siteName:'Tablet state test'}});
    const file=resolve(publicDir,'.'+(url.pathname==='/p/test'?'/visual-page.html':url.pathname));
    if(!file.startsWith(publicDir+'/'))return res.writeHead(403).end();
    try{res.setHeader('content-type',{'.html':'text/html','.js':'text/javascript','.css':'text/css'}[extname(file)]||'application/octet-stream');res.end(await readFile(file))}
    catch{res.writeHead(404).end()}
  });
  await new Promise(done=>server.listen(0,'127.0.0.1',done));
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
  t.after(async()=>{await browser.close();await new Promise(done=>server.close(done))});
  const editor=await browser.newPage({viewport:{width:1366,height:900}}),viewer=await browser.newPage({viewport:{width:1366,height:900}});
  editor.setDefaultTimeout(30000);editor.on('pageerror',error=>editorErrors.push(error.message));
  await editor.goto(`http://127.0.0.1:${server.address().port}/editor-v2/index.html`);
  await viewer.goto(`http://127.0.0.1:${server.address().port}/p/test`);
  if(await editor.locator('#rightDock').evaluate(el=>el.classList.contains('closed')))await editor.locator('#openInspector').click();
  const inspector=editor.locator('#inspectorBody');
  const canvas=id=>editor.locator(`.node[data-node-id="${id}"]`);
  const publicNode=id=>viewer.locator(`.visual-editor-node[data-node-id="${id}"]`);
  await viewer.waitForFunction(count=>document.querySelectorAll('.visual-editor-node[data-node-id]').length>=count,editableNodes.length);
  const focusableNodes=[];
  for(const node of editableNodes){
    const hidden=await publicNode(node.id).getAttribute('aria-hidden')==='true';
    if(hidden){
      assert.equal(await publicNode(node.id).getAttribute('tabindex'),null,`${node.type}: aria-hidden content is not added to keyboard navigation`);
      continue;
    }
    focusableNodes.push(node);
  }
  const activateEditorDevice=async device=>{
    const button=editor.locator(`.canvas-device-btn[data-device="${device}"]`);
    if(!await button.evaluate(el=>el.classList.contains('active')))await button.click();
  };
  const activateViewerDevice=async device=>{
    const width={desktop:1366,tablet:768,mobile:390}[device];
    const changed=await viewer.evaluate(next=>window.innerWidth!==next,width);
    const rendered=changed?viewer.waitForResponse(response=>response.url().includes('/api/public/presentation')):null;
    await viewer.setViewportSize({width,height:900});
    if(rendered)await rendered;
    await viewer.waitForFunction(({expected,id})=>window.innerWidth===expected&&document.querySelector(`[data-node-id="${id}"]`)!==null,{expected:width,id:editableNodes[0].id});
  };
  const openTabletStateColor=async(id,state)=>{
    await canvas(id).evaluate(el=>el.click());
    await editor.locator('.inspector-tabs button').nth(2).click();
    let group=editor.locator('.inspector-group').filter({hasText:'Rámutatás és fókusz'});
    let title=group.locator(':scope > .inspector-group-title');
    if(await title.getAttribute('aria-expanded')==='false')await title.click();
    let stateSelect=group.getByLabel('Állapot előnézete',{exact:true});
    if(await stateSelect.inputValue()!==state)await stateSelect.selectOption(state);
    group=editor.locator('.inspector-group').filter({hasText:'Rámutatás és fókusz'});
    title=group.locator(':scope > .inspector-group-title');
    if(await title.getAttribute('aria-expanded')==='false')await title.click();
    return group.locator('[data-state-property="backgroundColor"]');
  };
  const editTabletStateColor=async({type,id},state,color)=>{
    const field=await openTabletStateColor(id,state);
    assert.equal(await field.getAttribute('data-property-command'),'states.set',`${type}: ${state} background uses the shared state command`);
    assert.equal(await field.getAttribute('data-property-key'),'backgroundColor',`${type}: ${state} background maps to its Page Model key`);
    const input=field.locator('input[type="text"]');
    await input.fill(color);await input.press('Tab');
    assert.equal(await canvas(id).getAttribute('data-editor-state'),state,`${type}: tablet ${state} preview is marked on Canvas`);
    const expected=state==='hover'?'rgb(192, 38, 211)':'rgb(14, 165, 233)';
    assert.equal(await canvas(id).evaluate(el=>getComputedStyle(el).backgroundColor),expected,`${type}: tablet ${state} preview reaches Canvas CSS`);
  };
  const readStateColor=async(id,state)=>{
    if(state==='hover')await publicNode(id).hover();else await publicNode(id).focus();
    return publicNode(id).evaluate(el=>getComputedStyle(el).backgroundColor);
  };
  const assertPublicColors=async(state,expected,label)=>{
    const nodes=state==='focus-visible'?focusableNodes:editableNodes;
    for(const {type,id} of nodes)assert.equal(await readStateColor(id,state),expected,`${type}: ${label}`);
    if(state==='focus-visible')for(const {type,id} of editableNodes.filter(node=>!focusableNodes.includes(node)))
      assert.equal(await publicNode(id).getAttribute('tabindex'),null,`${type}: aria-hidden content remains outside keyboard navigation after ${label}`);
  };

  await activateEditorDevice('tablet');await activateViewerDevice('tablet');
  for(const node of editableNodes){
    await editTabletStateColor(node,'hover',tabletColor);
    await editTabletStateColor(node,'focus-visible',tabletFocusColor);
  }
  await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  assert.equal(posts.at(-1).publish,false,'tablet state Save remains draft-only');
  for(const {type,id} of editableNodes){
    assert.equal(draft.pages[pageId].nodes[id].states.hover.tablet.backgroundColor,tabletColor,`${type}: tablet hover value is in the saved draft`);
    assert.equal(draft.pages[pageId].nodes[id].states['focus-visible'].tablet.backgroundColor,tabletFocusColor,`${type}: tablet focus-visible value is in the saved draft`);
    assert.equal(published.pages[pageId].nodes[id].states.hover.tablet?.backgroundColor,undefined,`${type}: tablet hover Save does not publish`);
    assert.equal(published.pages[pageId].nodes[id].states['focus-visible'].tablet?.backgroundColor,undefined,`${type}: tablet focus-visible Save does not publish`);
    assert.equal(published.pages[pageId].nodes[id].states.hover.desktop.backgroundColor,desktopColor,`${type}: tablet Save keeps the desktop publication`);
    assert.equal(published.pages[pageId].nodes[id].states['focus-visible'].desktop.backgroundColor,desktopFocusColor,`${type}: tablet Save keeps desktop focus-visible publication`);
  }
  await editor.reload({waitUntil:'domcontentloaded'});await activateEditorDevice('tablet');
  const reloadedHover=await openTabletStateColor(editableNodes[0].id,'hover');
  assert.equal(await reloadedHover.locator('input[type="text"]').inputValue(),tabletColor,'tablet hover Inspector restores its saved value after Editor reload');
  const reloadedFocus=await openTabletStateColor(editableNodes[0].id,'focus-visible');
  assert.equal(await reloadedFocus.locator('input[type="text"]').inputValue(),tabletFocusColor,'tablet focus Inspector restores its saved value after Editor reload');
  await activateViewerDevice('tablet');
  await assertPublicColors('hover','rgb(22, 163, 74)','tablet draft Save leaves the public hover state unchanged');
  await assertPublicColors('focus-visible','rgb(29, 78, 216)','tablet draft Save leaves the public focus-visible state unchanged');

  await editor.locator('#publish').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
  await viewer.reload();
  await assertPublicColors('hover','rgb(192, 38, 211)','tablet Publish renders hover background on every PARTIAL type');
  await assertPublicColors('focus-visible','rgb(14, 165, 233)','tablet Publish renders focus-visible background on every PARTIAL type');
  await activateViewerDevice('desktop');
  await assertPublicColors('hover','rgb(22, 163, 74)','tablet Publish preserves desktop hover background');
  await assertPublicColors('focus-visible','rgb(29, 78, 216)','tablet Publish preserves desktop focus-visible background');
  await activateViewerDevice('mobile');
  await assertPublicColors('hover','rgb(192, 38, 211)','mobile inherits the published tablet hover background');
  await assertPublicColors('focus-visible','rgb(14, 165, 233)','mobile inherits the published tablet focus-visible background');

  await activateEditorDevice('tablet');
  for(const state of ['hover','focus-visible'])for(const {type,id} of editableNodes){
    const field=await openTabletStateColor(id,state),reset=editor.locator('.property-reset[data-property-key="backgroundColor"]').filter({hasText:'Állapotérték öröklésének visszaállítása'});
    assert.equal(await field.getAttribute('data-property-command'),'states.set',`${type}: tablet ${state} reset stays on the shared state command`);
    assert.equal(await reset.count(),1,`${type}: tablet ${state} override exposes an inheritance reset`);
    await reset.click();
    const expected=state==='hover'?'rgb(22, 163, 74)':'rgb(29, 78, 216)';
    assert.equal(await canvas(id).evaluate(el=>getComputedStyle(el).backgroundColor),expected,`${type}: reset Canvas preview inherits desktop ${state} color`);
  }
  const lastNode=editableNodes.at(-1);
  await editor.locator('#undo').click();
  assert.equal(await canvas(lastNode.id).evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(14, 165, 233)','Undo restores the final tablet focus-visible override');
  await editor.locator('#redo').click();
  assert.equal(await canvas(lastNode.id).evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(29, 78, 216)','Redo restores desktop focus-visible inheritance');
  await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  for(const {type,id} of editableNodes){
    assert.equal(draft.pages[pageId].nodes[id].states.hover.tablet.backgroundColor,undefined,`${type}: reset Save removes the tablet hover override`);
    assert.equal(draft.pages[pageId].nodes[id].states['focus-visible'].tablet.backgroundColor,undefined,`${type}: reset Save removes the tablet focus-visible override`);
    assert.equal(published.pages[pageId].nodes[id].states.hover.tablet.backgroundColor,tabletColor,`${type}: reset Save preserves the published tablet hover state`);
    assert.equal(published.pages[pageId].nodes[id].states['focus-visible'].tablet.backgroundColor,tabletFocusColor,`${type}: reset Save preserves published tablet focus-visible state`);
  }
  await activateViewerDevice('tablet');await viewer.reload();
  await assertPublicColors('hover','rgb(192, 38, 211)','tablet reset Save leaves the published hover style unchanged');
  await assertPublicColors('focus-visible','rgb(14, 165, 233)','tablet reset Save leaves the published focus-visible style unchanged');
  await editor.locator('#publish').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
  await viewer.reload();
  await assertPublicColors('hover','rgb(22, 163, 74)','tablet reset Publish returns every type to desktop hover inheritance');
  await assertPublicColors('focus-visible','rgb(29, 78, 216)','tablet reset Publish returns every type to desktop focus-visible inheritance');
  await activateViewerDevice('mobile');
  await assertPublicColors('hover','rgb(22, 163, 74)','mobile inherits desktop after the tablet hover override is published as reset');
  await assertPublicColors('focus-visible','rgb(29, 78, 216)','mobile inherits desktop after the tablet focus-visible override is published as reset');
  assert.deepEqual(editorErrors,[],'all PARTIAL state Inspector controls open without browser errors');
});
