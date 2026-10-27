import assert from 'node:assert/strict';
import test from 'node:test';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve,extname} from 'node:path';
import {chromium} from 'playwright';
import {NODE_TYPES,createDocument} from '../../public/editor-v2/core/schema.js';
import {createEditorState,activePage} from '../../public/editor-v2/core/state.js';
import {execute} from '../../public/editor-v2/core/commands.js';
import {getElementCapability} from '../../public/editor-v2/core/capability-matrix.js';
import {plainTextToRichText} from '../../public/editor-v2/core/richtext-engine.js';

const publicDir=resolve(import.meta.dirname,'../../public');

test('all PARTIAL types preserve mobile all-corner radius through Save, Publish and inheritance reset',async t=>{
  const model=createEditorState(createDocument());
  const page=activePage(model),pageId=page.id,rootId=page.rootId;
  const nodes=[{type:NODE_TYPES.ROOT,id:rootId}];
  const authoredTypes=new Set(['heading','text','richtext','link','button']);
  for(const type of Object.values(NODE_TYPES)){
    if(type===NODE_TYPES.ROOT||getElementCapability(type).status!=='PARTIAL')continue;
    execute(model,{type:'element.add',payload:{type,parentId:rootId,authored:authoredTypes.has(type)}});
    const id=model.selection.primaryId;
    if(type==='richtext')execute(model,{type:'richtext.content.set',payload:{nodeId:id,document:plainTextToRichText('Lekerekítés próba')}});
    else if(authoredTypes.has(type))execute(model,{type:'element.content.set',payload:{nodeId:id,content:'Lekerekítés próba'}});
    if(type==='button'||type==='link')execute(model,{type:'content.properties.set',payload:{nodeId:id,patch:{href:'https://example.com'}}});
    nodes.push({type,id});
  }
  let draft=structuredClone(model.document),published=structuredClone(draft),version=1;
  const editableNodes=nodes.filter(({type})=>type!=='root');
  assert.equal(editableNodes.length,44,'fixture includes all editable non-root PARTIAL types');
  const server=createServer(async(req,res)=>{
    const url=new URL(req.url,'http://localhost');
    const json=data=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(data))};
    if(url.pathname==='/api/admin/pages')return json({ok:true,data:url.searchParams.get('archived')==='1'?[]:[{id:pageId,slug:'inspector-partial-radius',title:'Inspector radius fixture',content:draft,revision:version,isPublished:false}]});
    if(url.pathname==='/api/admin/editor'){
      if(req.method==='GET')return json({ok:true,data:{page:{id:pageId,document:draft,publishedRevisionId:'published'},revisions:[{id:'revision-'+version,version}]}});
      let body='';for await(const chunk of req)body+=chunk;
      const request=JSON.parse(body);draft=structuredClone(request.document);version++;
      if(request.publish)published=structuredClone(draft);
      return json({ok:true,data:{pageId,version,revisionId:'revision-'+version,published:Boolean(request.publish)}});
    }
    if(url.pathname==='/api/public/pages')return json({ok:true,data:{id:pageId,slug:'inspector-partial-radius',title:'Inspector radius fixture',description:'',content:published.pages[pageId]}});
    if(url.pathname==='/api/public/navigation')return json({ok:true,data:{items:[]}});
    if(url.pathname==='/api/integrations/twitch/connection')return json({ok:true,data:{connected:false}});
    if(url.pathname.startsWith('/api/'))return json({ok:true,data:{siteName:'Inspector test'}});
    const file=resolve(publicDir,'.'+(url.pathname==='/p/test'?'/visual-page.html':url.pathname));
    if(!file.startsWith(publicDir+'/'))return res.writeHead(403).end();
    try{res.setHeader('content-type',{'.html':'text/html','.js':'text/javascript','.css':'text/css'}[extname(file)]||'application/octet-stream');res.end(await readFile(file))}
    catch{res.writeHead(404).end()}
  });
  await new Promise(done=>server.listen(0,'127.0.0.1',done));
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
  t.after(async()=>{await browser.close();await new Promise(done=>server.close(done))});
  const editor=await browser.newPage({viewport:{width:1366,height:900}});
  const viewer=await browser.newPage({viewport:{width:1366,height:900}});
  editor.setDefaultTimeout(30000);
  const errors=[];editor.on('pageerror',error=>errors.push(error.message));
  await editor.goto(`http://127.0.0.1:${server.address().port}/editor-v2/index.html`);
  await viewer.goto(`http://127.0.0.1:${server.address().port}/p/test`);
  if(await editor.locator('#rightDock').evaluate(el=>el.classList.contains('closed')))await editor.locator('#openInspector').click();
  const inspector=editor.locator('#inspectorBody');
  const publicNode=id=>viewer.locator(`.visual-editor-node[data-node-id="${id}"]`);

  await editor.locator('.canvas-device-btn[data-device="mobile"]').click();
  await viewer.setViewportSize({width:390,height:900});
  await viewer.reload();
  const mobileBaseline=Object.fromEntries(await Promise.all(editableNodes.map(async({id})=>[id,await publicNode(id).evaluate(el=>getComputedStyle(el).borderTopLeftRadius)])));
  const values=editableNodes.map((_,index)=>String(8+(index%5)*2));
  for(const [index,{type,id}] of editableNodes.entries()){
    const canvasNode=editor.locator(`.node[data-node-id="${id}"]`);
    await canvasNode.evaluate(el=>el.click());
    await editor.locator('.inspector-tabs button').first().click();
    const field=inspector.locator('[data-property-id="radius.all"]');
    assert.equal(await field.getAttribute('data-property-command'),'responsive.set',`${type}: all-corner radius command`);
    assert.equal(await field.getAttribute('data-property-key'),'borderRadius',`${type}: all-corner radius model key`);
    const group=field.locator('xpath=ancestor::section[1]'),title=group.locator(':scope > .inspector-group-title');
    if(await title.getAttribute('aria-expanded')==='false')await title.click();
    const input=field.locator('.dimension-controls input[type="number"]');
    await input.fill(values[index]);await input.press('Tab');
    assert.equal(await canvasNode.evaluate(el=>getComputedStyle(el).borderTopLeftRadius),`${values[index]}px`,`${type}: mobile radius edit reaches Canvas`);
  }
  await editor.locator('#save').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  for(const [index,{type,id}] of editableNodes.entries()){
    assert.equal(draft.pages[pageId].nodes[id].responsive.mobile.borderRadius,`${values[index]}px`,`${type}: Save stores mobile all-corner radius`);
    assert.equal(published.pages[pageId].nodes[id].responsive.mobile?.borderRadius,undefined,`${type}: Save leaves mobile radius unpublished`);
  }
  await viewer.reload();
  for(const {type,id} of editableNodes)assert.equal(await publicNode(id).evaluate(el=>getComputedStyle(el).borderTopLeftRadius),mobileBaseline[id],`${type}: draft Save leaves public mobile radius unchanged`);
  await editor.reload({waitUntil:'domcontentloaded'});
  await editor.locator('.canvas-device-btn[data-device="mobile"]').click();
  for(const [index,{type,id}] of editableNodes.entries()){
    await editor.locator(`.node[data-node-id="${id}"]`).evaluate(el=>el.click());
    await editor.locator('.inspector-tabs button').first().click();
    assert.equal(await inspector.locator('[data-property-id="radius.all"] input[type="number"]').inputValue(),values[index],`${type}: radius survives Editor reload`);
  }
  await editor.locator('#publish').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
  await viewer.reload();
  for(const [index,{type,id}] of editableNodes.entries())assert.equal(await publicNode(id).evaluate(el=>getComputedStyle(el).borderTopLeftRadius),`${values[index]}px`,`${type}: explicit Publish applies mobile radius`);

  await viewer.setViewportSize({width:1366,height:900});
  await viewer.reload();
  const desktopBaseline=Object.fromEntries(await Promise.all(editableNodes.map(async({id})=>[id,await publicNode(id).evaluate(el=>getComputedStyle(el).borderTopLeftRadius)])));
  await editor.locator('.canvas-device-btn[data-device="desktop"]').click();
  const desktopCanvasBaseline={};
  for(const {id} of editableNodes){
    const canvasNode=editor.locator(`.node[data-node-id="${id}"]`);
    await canvasNode.evaluate(el=>el.click());
    desktopCanvasBaseline[id]=await canvasNode.evaluate(el=>getComputedStyle(el).borderTopLeftRadius);
  }
  await editor.locator('.canvas-device-btn[data-device="mobile"]').click();
  await viewer.setViewportSize({width:390,height:900});
  await viewer.reload();
  for(const {type,id} of editableNodes){
    const canvasNode=editor.locator(`.node[data-node-id="${id}"]`);
    await canvasNode.evaluate(el=>el.click());
    await editor.locator('.inspector-tabs button').first().click();
    const field=inspector.locator('[data-property-id="radius.all"]');
    const group=field.locator('xpath=ancestor::section[1]'),title=group.locator(':scope > .inspector-group-title');
    if(await title.getAttribute('aria-expanded')==='false')await title.click();
    const reset=group.locator('.property-reset[data-property-key="borderRadius"]');
    assert.equal(await reset.count(),1,`${type}: mobile radius inheritance reset exists`);
    await reset.click();
    assert.equal(await canvasNode.evaluate(el=>getComputedStyle(el).borderTopLeftRadius),desktopCanvasBaseline[id],`${type}: reset restores inherited desktop Canvas radius`);
  }
  await editor.locator('#save').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  for(const {type,id} of editableNodes){
    assert.equal(draft.pages[pageId].nodes[id].responsive.mobile.borderRadius,undefined,`${type}: reset Save removes mobile radius override`);
    assert.equal(published.pages[pageId].nodes[id].responsive.mobile.borderRadius,`${values[editableNodes.findIndex(node=>node.id===id)]}px`,`${type}: reset Save preserves public mobile radius`);
  }
  await viewer.reload();
  for(const [index,{type,id}] of editableNodes.entries())assert.equal(await publicNode(id).evaluate(el=>getComputedStyle(el).borderTopLeftRadius),`${values[index]}px`,`${type}: radius reset Save leaves public mobile CSS unchanged`);
  await editor.locator('#publish').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
  await viewer.reload();
  for(const {type,id} of editableNodes){
    assert.equal(await publicNode(id).evaluate(el=>getComputedStyle(el).borderTopLeftRadius),desktopBaseline[id],`${type}: reset Publish restores desktop radius on mobile`);
    assert.equal(published.pages[pageId].nodes[id].responsive.mobile.borderRadius,undefined,`${type}: reset Publish removes public mobile radius override`);
  }
  await viewer.setViewportSize({width:1366,height:900});
  await viewer.reload();
  for(const {type,id} of editableNodes)assert.equal(await publicNode(id).evaluate(el=>getComputedStyle(el).borderTopLeftRadius),desktopBaseline[id],`${type}: mobile reset Publish preserves desktop radius`);
  assert.deepEqual(errors,[],'radius lifecycle must not produce Editor page errors');
});
