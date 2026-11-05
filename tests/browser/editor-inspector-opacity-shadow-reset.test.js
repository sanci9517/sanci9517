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

const publicDir=resolve(import.meta.dirname,'../../public');
const initialMobileShadow='0 12px 32px #0008';

test('all PARTIAL types reset mobile opacity and shadow through the Inspector without merging Save and Publish',async t=>{
  const model=createEditorState(createDocument());
  const page=activePage(model),pageId=page.id,rootId=page.rootId;
  const nodes=[{type:NODE_TYPES.ROOT,id:rootId}];
  for(const type of Object.values(NODE_TYPES)){
    if(type===NODE_TYPES.ROOT||getElementCapability(type).status!=='PARTIAL')continue;
    execute(model,{type:'element.add',payload:{type,parentId:rootId}});
    const id=model.selection.primaryId;
    page.nodes[id].responsive={
      ...(page.nodes[id].responsive||{}),
      desktop:{...(page.nodes[id].responsive?.desktop||{}),opacity:'0.92',boxShadow:'0 4px 12px #0004'},
      mobile:{...(page.nodes[id].responsive?.mobile||{}),opacity:'0.68',boxShadow:initialMobileShadow}
    };
    nodes.push({type,id});
  }
  const editableNodes=nodes.slice(1);
  assert.equal(editableNodes.length,44,'all editable PARTIAL types are covered');
  let draft=structuredClone(model.document),published=structuredClone(draft),revision=1;
  const server=createServer(async(req,res)=>{
    const url=new URL(req.url,'http://localhost');
    const json=data=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(data))};
    if(url.pathname==='/api/admin/pages')return json({ok:true,data:[{id:pageId,slug:'inspector-opacity-shadow-reset',title:'Inspector reset fixture',content:draft,revision,isPublished:false}]});
    if(url.pathname==='/api/admin/editor'){
      if(req.method==='GET')return json({ok:true,data:{page:{id:pageId,document:draft,publishedRevisionId:'published'},revisions:[{id:'revision-'+revision,version:revision}]}});
      let body='';for await(const chunk of req)body+=chunk;
      const request=JSON.parse(body);draft=structuredClone(request.document);revision++;
      if(request.publish)published=structuredClone(draft);
      return json({ok:true,data:{pageId,version:revision,revisionId:'revision-'+revision,published:Boolean(request.publish)}});
    }
    if(url.pathname==='/api/public/pages')return json({ok:true,data:{id:pageId,slug:'inspector-opacity-shadow-reset',title:'Inspector reset fixture',description:'',content:published.pages[pageId]}});
    if(url.pathname==='/api/public/navigation')return json({ok:true,data:{items:[]}});
    if(url.pathname==='/api/integrations/twitch/connection')return json({ok:true,data:{connected:false}});
    if(url.pathname.startsWith('/api/'))return json({ok:true,data:{siteName:'Inspector reset test'}});
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
  editor.on('pageerror',error=>assert.fail(`Editor page error: ${error.message}`));
  await editor.goto(`http://127.0.0.1:${server.address().port}/editor-v2/index.html`);
  await viewer.goto(`http://127.0.0.1:${server.address().port}/p/test`);
  if(await editor.locator('#rightDock').evaluate(el=>el.classList.contains('closed')))await editor.locator('#openInspector').click();
  const inspector=editor.locator('#inspectorBody');
  const publicNode=id=>viewer.locator(`.visual-editor-node[data-node-id="${id}"]`);
  const visual=node=>node.evaluate(el=>({opacity:getComputedStyle(el).opacity,boxShadow:getComputedStyle(el).boxShadow}));
  await viewer.waitForFunction(expected=>document.querySelectorAll('.visual-editor-node[data-node-id]').length>=expected,editableNodes.length);
  const desktopBaseline=Object.fromEntries(await Promise.all(editableNodes.map(async({id})=>[id,await visual(publicNode(id))])));
  await viewer.setViewportSize({width:390,height:900});
  await viewer.reload();
  await viewer.waitForFunction(expected=>document.querySelectorAll('.visual-editor-node[data-node-id]').length>=expected,editableNodes.length);
  const mobileBaseline=Object.fromEntries(await Promise.all(editableNodes.map(async({id})=>[id,await visual(publicNode(id))])));
  await editor.locator('.canvas-device-btn[data-device="mobile"]').click();

  const mobileValues=Object.fromEntries(editableNodes.map(({id},index)=>[id,{opacity:(0.45+(index%5)*0.08).toFixed(2),shadow:['0 2px 8px #0003','0 8px 24px #0005','0 16px 48px #0007'][index%3]}]));
  const mobileCanvasValues={};
  for(const [index,{type,id}] of editableNodes.entries()){
    const canvasNode=editor.locator(`.node[data-node-id="${id}"]`);
    await canvasNode.evaluate(el=>el.click());
    await editor.locator('.inspector-tabs button').first().click();
    const opacityField=inspector.locator('[data-property-id="opacity.value"]');
    const shadowField=inspector.locator('[data-property-id="shadow.box"]');
    assert.equal(await opacityField.getAttribute('data-property-command'),'responsive.set',`${type}: opacity command route`);
    assert.equal(await opacityField.getAttribute('data-property-key'),'opacity',`${type}: opacity Page Model key`);
    assert.equal(await shadowField.getAttribute('data-property-command'),'responsive.set',`${type}: shadow command route`);
    assert.equal(await shadowField.getAttribute('data-property-key'),'boxShadow',`${type}: shadow Page Model key`);
    for(const field of [opacityField,shadowField]){
      const group=field.locator('xpath=ancestor::section[1]'),title=group.locator(':scope > .inspector-group-title');
      if(await title.getAttribute('aria-expanded')==='false')await title.click();
    }
    await opacityField.locator('input[type="number"]').fill(mobileValues[id].opacity);
    await opacityField.locator('input[type="number"]').press('Tab');
    await shadowField.locator('select:not(.property-token-picker)').selectOption(mobileValues[id].shadow);
    mobileCanvasValues[id]=await visual(canvasNode);
    assert.equal(mobileCanvasValues[id].opacity,mobileValues[id].opacity,`${type}: mobile opacity reaches Canvas`);
    assert.notEqual(mobileCanvasValues[id].boxShadow,mobileBaseline[id].boxShadow,`${type}: mobile shadow reaches Canvas`);
  }
  await editor.locator('#save').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  for(const {type,id} of editableNodes){
    const mobile=draft.pages[pageId].nodes[id].responsive.mobile;
    assert.equal(mobile.opacity,mobileValues[id].opacity,`${type}: draft Save stores mobile opacity`);
    assert.equal(mobile.boxShadow,mobileValues[id].shadow,`${type}: draft Save stores mobile shadow`);
    assert.equal(published.pages[pageId].nodes[id].responsive.mobile.opacity,'0.68',`${type}: Save does not publish opacity`);
    assert.equal(published.pages[pageId].nodes[id].responsive.mobile.boxShadow,initialMobileShadow,`${type}: Save does not publish shadow`);
  }
  await viewer.reload();
  for(const {type,id} of editableNodes)assert.deepEqual(await visual(publicNode(id)),mobileBaseline[id],`${type}: Save leaves public styles unchanged`);

  await editor.reload({waitUntil:'domcontentloaded'});
  await editor.locator('.canvas-device-btn[data-device="mobile"]').click();
  for(const {type,id} of editableNodes){
    await editor.locator(`.node[data-node-id="${id}"]`).evaluate(el=>el.click());
    await editor.locator('.inspector-tabs button').first().click();
    assert.equal(await inspector.locator('[data-property-id="opacity.value"] input[type="number"]').inputValue(),mobileValues[id].opacity,`${type}: saved opacity survives Editor reload`);
    assert.equal(await inspector.locator('[data-property-id="shadow.box"] select:not(.property-token-picker)').inputValue(),mobileValues[id].shadow,`${type}: saved shadow survives Editor reload`);
  }
  await editor.locator('#publish').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
  await viewer.reload();
  for(const {type,id} of editableNodes)assert.deepEqual(await visual(publicNode(id)),mobileCanvasValues[id],`${type}: explicit Publish applies mobile styles`);

  // Reset only the mobile overrides; the already-published mobile values stay
  // public until this separate Publish action follows the draft Save.
  await viewer.setViewportSize({width:1366,height:900});
  await viewer.reload();
  const publishedDesktop=Object.fromEntries(await Promise.all(editableNodes.map(async({id})=>[id,await visual(publicNode(id))])));
  await viewer.setViewportSize({width:390,height:900});
  await viewer.reload();
  await editor.reload({waitUntil:'domcontentloaded'});
  await editor.locator('.canvas-device-btn[data-device="mobile"]').click();
  for(const {type,id} of editableNodes){
    await editor.locator(`.node[data-node-id="${id}"]`).evaluate(el=>el.click());
    await editor.locator('.inspector-tabs button').first().click();
    for(const [propertyId,key] of [['opacity.value','opacity'],['shadow.box','boxShadow']]){
      const field=inspector.locator(`[data-property-id="${propertyId}"]`);
      const group=field.locator('xpath=ancestor::section[1]'),title=group.locator(':scope > .inspector-group-title');
      if(await title.getAttribute('aria-expanded')==='false')await title.click();
      const reset=group.locator(`.property-reset[data-property-key="${key}"]`);
      assert.equal(await reset.count(),1,`${type}: mobile ${key} exposes reset`);
      assert.equal(await reset.getAttribute('data-property-command'),'responsive.set',`${type}: reset keeps responsive command route`);
      await reset.click();
    }
    assert.deepEqual(await visual(editor.locator(`.node[data-node-id="${id}"]`)),desktopBaseline[id],`${type}: reset restores inherited Canvas styles`);
  }
  await editor.locator('#save').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  for(const {type,id} of editableNodes){
    assert.equal(draft.pages[pageId].nodes[id].responsive.mobile.opacity,undefined,`${type}: reset Save removes mobile opacity`);
    assert.equal(draft.pages[pageId].nodes[id].responsive.mobile.boxShadow,undefined,`${type}: reset Save removes mobile shadow`);
    assert.equal(published.pages[pageId].nodes[id].responsive.mobile.opacity,mobileValues[id].opacity,`${type}: reset Save keeps published opacity`);
    assert.equal(published.pages[pageId].nodes[id].responsive.mobile.boxShadow,mobileValues[id].shadow,`${type}: reset Save keeps published shadow`);
  }
  await viewer.reload();
  for(const {type,id} of editableNodes)assert.deepEqual(await visual(publicNode(id)),mobileCanvasValues[id],`${type}: reset Save leaves published mobile CSS unchanged`);
  await editor.locator('#publish').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
  await viewer.reload();
  for(const {type,id} of editableNodes){
    assert.deepEqual(await visual(publicNode(id)),desktopBaseline[id],`${type}: reset Publish restores desktop inheritance on mobile`);
    assert.equal(published.pages[pageId].nodes[id].responsive.mobile.opacity,undefined,`${type}: reset Publish removes mobile opacity`);
    assert.equal(published.pages[pageId].nodes[id].responsive.mobile.boxShadow,undefined,`${type}: reset Publish removes mobile shadow`);
  }
  await viewer.setViewportSize({width:1366,height:900});
  await viewer.reload();
  for(const {type,id} of editableNodes)assert.deepEqual(await visual(publicNode(id)),publishedDesktop[id],`${type}: reset Publish preserves desktop CSS`);
});
