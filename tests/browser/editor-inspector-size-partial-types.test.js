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
const dimensionKeys=['width','height','minWidth','maxWidth','minHeight','maxHeight'];
const values={
  desktop:{width:'300px',height:'180px',minWidth:'100px',maxWidth:'700px',minHeight:'50px',maxHeight:'500px'},
  mobile:{width:'320px',height:'200px',minWidth:'120px',maxWidth:'360px',minHeight:'90px',maxHeight:'400px'}
};

test('all editable PARTIAL types preserve responsive size fields across Inspector, Canvas, Save and Publish',async t=>{
  const model=createEditorState(createDocument());
  const page=activePage(model),pageId=page.id,rootId=page.rootId;
  const nodes=[{type:NODE_TYPES.ROOT,id:rootId}];
  const authoredTypes=new Set(['heading','text','richtext','link','button']);
  for(const type of Object.values(NODE_TYPES)){
    if(type===NODE_TYPES.ROOT||getElementCapability(type).status!=='PARTIAL')continue;
    execute(model,{type:'element.add',payload:{type,parentId:rootId,authored:authoredTypes.has(type)}});
    const id=model.selection.primaryId;
    if(type==='richtext')execute(model,{type:'richtext.content.set',payload:{nodeId:id,document:plainTextToRichText('Responsive méret teszt')}});
    else if(authoredTypes.has(type))execute(model,{type:'element.content.set',payload:{nodeId:id,content:'Responsive méret teszt'}});
    if(type==='button'||type==='link')execute(model,{type:'content.properties.set',payload:{nodeId:id,patch:{href:'https://example.com'}}});
    nodes.push({type,id});
  }
  assert.equal(nodes.length,45,'fixture contains root plus every editable PARTIAL type');
  const editableNodes=nodes.filter(node=>node.type!==NODE_TYPES.ROOT);
  let draft=structuredClone(model.document),published=structuredClone(draft),version=1;
  const editorErrors=[];
  const server=createServer(async(req,res)=>{
    const url=new URL(req.url,'http://localhost');
    const json=data=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(data))};
    if(url.pathname==='/api/admin/pages')return json({ok:true,data:url.searchParams.get('archived')==='1'?[]:[{id:pageId,slug:'inspector-size-partials',title:'Inspector size fixture',content:draft,revision:version,isPublished:false}]});
    if(url.pathname==='/api/admin/editor'){
      if(req.method==='GET')return json({ok:true,data:{page:{id:pageId,document:draft,publishedRevisionId:'published'},revisions:[{id:'revision-'+version,version}]}});
      let body='';for await(const chunk of req)body+=chunk;
      const request=JSON.parse(body);draft=structuredClone(request.document);version++;
      if(request.publish)published=structuredClone(draft);
      return json({ok:true,data:{pageId,version,revisionId:'revision-'+version,published:Boolean(request.publish)}});
    }
    if(url.pathname==='/api/public/pages')return json({ok:true,data:{id:pageId,slug:'inspector-size-partials',title:'Inspector size fixture',description:'',content:published.pages[pageId]}});
    if(url.pathname==='/api/public/navigation')return json({ok:true,data:{items:[]}});
    if(url.pathname==='/api/integrations/twitch/connection')return json({ok:true,data:{connected:false}});
    if(url.pathname.startsWith('/api/'))return json({ok:true,data:{siteName:'Inspector size test'}});
    const file=resolve(publicDir,'.'+(url.pathname==='/p/test'?'/visual-page.html':url.pathname));
    if(!file.startsWith(publicDir+'/'))return res.writeHead(403).end();
    try{res.setHeader('content-type',{'.html':'text/html','.js':'text/javascript','.css':'text/css'}[extname(file)]||'application/octet-stream');res.end(await readFile(file))}
    catch{res.writeHead(404).end()}
  });
  await new Promise(done=>server.listen(0,'127.0.0.1',done));
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
  t.after(async()=>{await browser.close();await new Promise(done=>server.close(done))});
  const editor=await browser.newPage({viewport:{width:1366,height:900}}),viewer=await browser.newPage({viewport:{width:1366,height:900}});
  editor.setDefaultTimeout(30000);
  editor.on('pageerror',error=>editorErrors.push(error.message));
  await editor.goto(`http://127.0.0.1:${server.address().port}/editor-v2/index.html`);
  await viewer.goto(`http://127.0.0.1:${server.address().port}/p/test`);
  if(await editor.locator('#rightDock').evaluate(el=>el.classList.contains('closed')))await editor.locator('#openInspector').click();
  const inspector=editor.locator('#inspectorBody');
  const canvas=id=>editor.locator(`.node[data-node-id="${id}"]`);
  const publicNode=id=>viewer.locator(`.visual-editor-node[data-node-id="${id}"]`);
  await viewer.waitForFunction(count=>document.querySelectorAll('.visual-editor-node[data-node-id]').length>=count,editableNodes.length);
  const field=key=>inspector.locator(`[data-property-id="size.${key}"]`);
  const readCss=node=>node.evaluate(el=>{const css=getComputedStyle(el);return{width:css.width,height:css.height,minWidth:css.minWidth,maxWidth:css.maxWidth,minHeight:css.minHeight,maxHeight:css.maxHeight}});
  const setSize=async(type,id,device)=>{
    await canvas(id).evaluate(el=>el.click());
    await editor.locator('.inspector-tabs button').first().click();
    for(const key of dimensionKeys){
      const control=field(key),group=control.locator('xpath=ancestor::section[1]'),title=group.locator(':scope > .inspector-group-title');
      if(await title.getAttribute('aria-expanded')==='false')await title.click();
      assert.equal(await control.getAttribute('data-property-command'),'responsive.set',`${type}: ${device} size.${key} command`);
      assert.equal(await control.getAttribute('data-property-key'),key,`${type}: ${device} size.${key} Page Model key`);
      await control.locator('.dimension-controls select:not(.property-token-picker)').selectOption('px');
      const input=control.locator('.dimension-controls input[type="number"]');
      await input.fill(values[device][key].slice(0,-2));await input.press('Tab');
    }
    assert.deepEqual(await readCss(canvas(id)),values[device],`${type}: ${device} Inspector size values reach Canvas CSS`);
  };

  await editor.locator('.canvas-device-btn[data-device="desktop"]').click();
  const publicDesktopBaseline=Object.fromEntries(await Promise.all(editableNodes.map(async({id})=>[id,await readCss(publicNode(id))])));
  for(const {type,id} of editableNodes)await setSize(type,id,'desktop');
  await editor.locator('#save').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  for(const {type,id} of editableNodes){
    for(const key of dimensionKeys){
      assert.equal(draft.pages[pageId].nodes[id].responsive.desktop[key],values.desktop[key],`${type}: desktop draft Save stores size.${key}`);
      assert.equal(published.pages[pageId].nodes[id].responsive?.desktop?.[key],undefined,`${type}: desktop Save does not publish size.${key}`);
    }
  }
  await viewer.reload();
  for(const {type,id} of editableNodes)assert.deepEqual(await readCss(publicNode(id)),publicDesktopBaseline[id],`${type}: draft Save leaves desktop public CSS unchanged`);
  await editor.reload({waitUntil:'domcontentloaded'});
  for(const {type,id} of editableNodes){
    await canvas(id).evaluate(el=>el.click());
    await editor.locator('.inspector-tabs button').first().click();
    for(const key of dimensionKeys){
      assert.equal(await field(key).locator('.dimension-controls input[type="number"]').inputValue(),values.desktop[key].slice(0,-2),`${type}: desktop size.${key} survives Editor reload`);
      assert.equal(await field(key).locator('.dimension-controls select:not(.property-token-picker)').inputValue(),'px',`${type}: desktop size.${key} unit survives Editor reload`);
    }
  }
  await editor.locator('#publish').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
  await viewer.reload();
  for(const {type,id} of editableNodes){
    assert.deepEqual(await readCss(publicNode(id)),values.desktop,`${type}: explicit Publish renders desktop size CSS`);
    for(const key of dimensionKeys)assert.equal(published.pages[pageId].nodes[id].responsive.desktop[key],values.desktop[key],`${type}: desktop Publish stores size.${key}`);
  }

  await editor.locator('.canvas-device-btn[data-device="mobile"]').click();
  await viewer.setViewportSize({width:390,height:900});await viewer.reload();
  const publicMobileBaseline=Object.fromEntries(await Promise.all(editableNodes.map(async({id})=>[id,await readCss(publicNode(id))])));
  for(const {type,id} of editableNodes)await setSize(type,id,'mobile');
  await editor.locator('#save').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  for(const {type,id} of editableNodes){
    for(const key of dimensionKeys){
      assert.equal(draft.pages[pageId].nodes[id].responsive.mobile[key],values.mobile[key],`${type}: mobile draft Save stores size.${key}`);
      assert.equal(draft.pages[pageId].nodes[id].responsive.desktop[key],values.desktop[key],`${type}: mobile Save preserves desktop size.${key}`);
      assert.equal(published.pages[pageId].nodes[id].responsive.mobile?.[key],undefined,`${type}: mobile Save does not publish size.${key}`);
    }
  }
  await viewer.reload();
  for(const {type,id} of editableNodes)assert.deepEqual(await readCss(publicNode(id)),publicMobileBaseline[id],`${type}: mobile draft Save preserves public CSS`);
  await editor.reload({waitUntil:'domcontentloaded'});
  await editor.locator('.canvas-device-btn[data-device="mobile"]').click();
  for(const {type,id} of editableNodes){
    await canvas(id).evaluate(el=>el.click());
    await editor.locator('.inspector-tabs button').first().click();
    for(const key of dimensionKeys){
      assert.equal(await field(key).locator('.dimension-controls input[type="number"]').inputValue(),values.mobile[key].slice(0,-2),`${type}: mobile size.${key} survives Editor reload`);
      assert.equal(await field(key).locator('.dimension-controls select:not(.property-token-picker)').inputValue(),'px',`${type}: mobile size.${key} unit survives Editor reload`);
    }
  }
  await editor.locator('#publish').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
  await viewer.reload();
  for(const {type,id} of editableNodes){
    assert.deepEqual(await readCss(publicNode(id)),values.mobile,`${type}: explicit Publish renders mobile size CSS`);
    for(const key of dimensionKeys)assert.equal(published.pages[pageId].nodes[id].responsive.desktop[key],values.desktop[key],`${type}: mobile Publish preserves desktop size.${key}`);
  }
  await viewer.setViewportSize({width:1366,height:900});await viewer.reload();
  for(const {type,id} of editableNodes)assert.deepEqual(await readCss(publicNode(id)),values.desktop,`${type}: mobile Publish preserves desktop public CSS`);

  await viewer.setViewportSize({width:390,height:900});await viewer.reload();
  for(const {type,id} of editableNodes){
    await canvas(id).evaluate(el=>el.click());
    await editor.locator('.inspector-tabs button').first().click();
    for(const key of dimensionKeys){
      const control=field(key),group=control.locator('xpath=ancestor::section[1]'),title=group.locator(':scope > .inspector-group-title');
      if(await title.getAttribute('aria-expanded')==='false')await title.click();
      const reset=group.locator(`.property-reset[data-property-key="${key}"]`);
      assert.equal(await reset.count(),1,`${type}: mobile size.${key} exposes inheritance reset`);
      assert.equal(await reset.getAttribute('data-property-command'),'responsive.set',`${type}: mobile size.${key} reset uses responsive.set`);
      await reset.click();
    }
    assert.deepEqual(await readCss(canvas(id)),values.desktop,`${type}: mobile size resets restore inherited desktop Canvas CSS`);
  }
  const lastNode=editableNodes.at(-1);
  await editor.locator('#undo').click();
  assert.deepEqual(await readCss(canvas(lastNode.id)),{...values.desktop,maxHeight:values.mobile.maxHeight},`${lastNode.type}: Undo restores the final mobile max-height override`);
  await editor.locator('#redo').click();
  assert.deepEqual(await readCss(canvas(lastNode.id)),values.desktop,`${lastNode.type}: Redo restores inherited desktop dimensions`);
  await editor.locator('#save').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  for(const {type,id} of editableNodes){
    for(const key of dimensionKeys){
      assert.equal(draft.pages[pageId].nodes[id].responsive.mobile[key],undefined,`${type}: reset Save removes mobile size.${key}`);
      assert.equal(published.pages[pageId].nodes[id].responsive.mobile[key],values.mobile[key],`${type}: reset Save preserves published mobile size.${key}`);
    }
  }
  await viewer.reload();
  for(const {type,id} of editableNodes)assert.deepEqual(await readCss(publicNode(id)),values.mobile,`${type}: reset Save leaves public mobile CSS unchanged`);
  await editor.locator('#publish').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
  await viewer.reload();
  for(const {type,id} of editableNodes){
    assert.deepEqual(await readCss(publicNode(id)),values.desktop,`${type}: reset Publish restores inherited desktop sizes on mobile`);
    for(const key of dimensionKeys)assert.equal(published.pages[pageId].nodes[id].responsive.mobile[key],undefined,`${type}: reset Publish removes mobile size.${key}`);
  }
  assert.deepEqual(editorErrors,[],'opening every PARTIAL size Inspector must not throw');
});
