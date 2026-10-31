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
const properties=[
  {id:'background.gradient',key:'backgroundImage',value:{desktop:'linear-gradient(135deg, #fb7185 0%, #fbbf24 100%)',mobile:'linear-gradient(135deg, #111827 0%, #475569 100%)'}},
  {id:'background.size',key:'backgroundSize',value:{desktop:'cover',mobile:'contain'}},
  {id:'background.position',key:'backgroundPosition',value:{desktop:'center bottom',mobile:'right center'}},
  {id:'background.repeat',key:'backgroundRepeat',value:{desktop:'repeat-x',mobile:'repeat-y'}}
];
const styleKeys=properties.map(property=>property.key);

test('all editable PARTIAL types preserve responsive background style through Inspector, Canvas, Save and Publish',async t=>{
  const model=createEditorState(createDocument());
  const page=activePage(model),pageId=page.id,rootId=page.rootId;
  const nodes=[{type:NODE_TYPES.ROOT,id:rootId}];
  const authoredTypes=new Set(['heading','text','richtext','link','button']);
  for(const type of Object.values(NODE_TYPES)){
    if(type===NODE_TYPES.ROOT||getElementCapability(type).status!=='PARTIAL')continue;
    execute(model,{type:'element.add',payload:{type,parentId:rootId,authored:authoredTypes.has(type)}});
    const id=model.selection.primaryId;
    if(type==='richtext')execute(model,{type:'richtext.content.set',payload:{nodeId:id,document:plainTextToRichText('Responsive háttérpróba')}});
    else if(authoredTypes.has(type))execute(model,{type:'element.content.set',payload:{nodeId:id,content:'Responsive háttérpróba'}});
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
    if(url.pathname==='/api/admin/pages')return json({ok:true,data:url.searchParams.get('archived')==='1'?[]:[{id:pageId,slug:'inspector-background-partials',title:'Inspector background fixture',content:draft,revision:version,isPublished:false}]});
    if(url.pathname==='/api/admin/editor'){
      if(req.method==='GET')return json({ok:true,data:{page:{id:pageId,document:draft,publishedRevisionId:'published'},revisions:[{id:'revision-'+version,version}]}});
      let body='';for await(const chunk of req)body+=chunk;
      const request=JSON.parse(body);draft=structuredClone(request.document);version++;
      if(request.publish)published=structuredClone(draft);
      return json({ok:true,data:{pageId,version,revisionId:'revision-'+version,published:Boolean(request.publish)}});
    }
    if(url.pathname==='/api/public/pages')return json({ok:true,data:{id:pageId,slug:'inspector-background-partials',title:'Inspector background fixture',description:'',content:published.pages[pageId]}});
    if(url.pathname==='/api/public/navigation')return json({ok:true,data:{items:[]}});
    if(url.pathname==='/api/integrations/twitch/connection')return json({ok:true,data:{connected:false}});
    if(url.pathname.startsWith('/api/'))return json({ok:true,data:{siteName:'Inspector background test'}});
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
  const field=id=>inspector.locator(`[data-property-id="${id}"]`);
  const readCss=node=>node.evaluate(el=>{const css=getComputedStyle(el);return Object.fromEntries(['backgroundImage','backgroundSize','backgroundPosition','backgroundRepeat'].map(key=>[key,css[key]]))});
  const setBackground=async(type,id,device)=>{
    await canvas(id).evaluate(el=>el.click());await editor.locator('.inspector-tabs button').first().click();
    for(const property of properties){
      const control=field(property.id),group=control.locator('xpath=ancestor::section[1]'),title=group.locator(':scope > .inspector-group-title');
      if(await title.getAttribute('aria-expanded')==='false')await title.click();
      assert.equal(await control.getAttribute('data-property-command'),'responsive.set',`${type}: ${device} ${property.id} command`);
      assert.equal(await control.getAttribute('data-property-key'),property.key,`${type}: ${device} ${property.id} Page Model key`);
      await control.locator('select:not(.property-token-picker)').selectOption(property.value[device]);
    }
  };
  const readStored=(nodeId,device,key)=>draft.pages[pageId].nodes[nodeId].responsive?.[device]?.[key];

  await editor.locator('.canvas-device-btn[data-device="desktop"]').click();
  const publicDesktopBaseline=Object.fromEntries(await Promise.all(editableNodes.map(async({id})=>[id,await readCss(publicNode(id))])));
  const canvasDesktopExpected={};
  for(const {type,id} of editableNodes){await setBackground(type,id,'desktop');canvasDesktopExpected[id]=await readCss(canvas(id));}
  await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  for(const {type,id} of editableNodes)for(const property of properties){
    assert.equal(readStored(id,'desktop',property.key),property.value.desktop,`${type}: desktop draft Save stores ${property.key}`);
    assert.equal(published.pages[pageId].nodes[id].responsive?.desktop?.[property.key],undefined,`${type}: desktop Save does not publish ${property.key}`);
  }
  await viewer.reload();for(const {type,id} of editableNodes)assert.deepEqual(await readCss(publicNode(id)),publicDesktopBaseline[id],`${type}: desktop draft Save leaves public background unchanged`);
  await editor.reload({waitUntil:'domcontentloaded'});
  for(const {type,id} of editableNodes){
    await canvas(id).evaluate(el=>el.click());await editor.locator('.inspector-tabs button').first().click();
    for(const property of properties){
      const control=field(property.id),group=control.locator('xpath=ancestor::section[1]'),title=group.locator(':scope > .inspector-group-title');
      if(await title.getAttribute('aria-expanded')==='false')await title.click();
      assert.equal(await control.locator('select:not(.property-token-picker)').inputValue(),property.value.desktop,`${type}: desktop ${property.key} survives Editor reload`);
    }
  }
  await editor.locator('#publish').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));await viewer.reload();
  for(const {type,id} of editableNodes){
    assert.deepEqual(await readCss(publicNode(id)),canvasDesktopExpected[id],`${type}: desktop Publish makes all background CSS match Canvas`);
    for(const property of properties)assert.equal(published.pages[pageId].nodes[id].responsive.desktop[property.key],property.value.desktop,`${type}: desktop Publish stores ${property.key}`);
  }

  await editor.locator('.canvas-device-btn[data-device="mobile"]').click();await viewer.setViewportSize({width:390,height:900});await viewer.reload();
  const publicMobileBaseline=Object.fromEntries(await Promise.all(editableNodes.map(async({id})=>[id,await readCss(publicNode(id))])));
  const canvasMobileExpected={};
  for(const {type,id} of editableNodes){await setBackground(type,id,'mobile');canvasMobileExpected[id]=await readCss(canvas(id));}
  await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  for(const {type,id} of editableNodes)for(const property of properties){
    assert.equal(readStored(id,'mobile',property.key),property.value.mobile,`${type}: mobile draft Save stores ${property.key}`);
    assert.equal(draft.pages[pageId].nodes[id].responsive.desktop[property.key],property.value.desktop,`${type}: mobile Save preserves desktop ${property.key}`);
    assert.equal(published.pages[pageId].nodes[id].responsive.mobile?.[property.key],undefined,`${type}: mobile Save does not publish ${property.key}`);
  }
  await viewer.reload();for(const {type,id} of editableNodes)assert.deepEqual(await readCss(publicNode(id)),publicMobileBaseline[id],`${type}: mobile draft Save leaves public background unchanged`);
  await editor.reload({waitUntil:'domcontentloaded'});await editor.locator('.canvas-device-btn[data-device="mobile"]').click();
  for(const {type,id} of editableNodes){
    await canvas(id).evaluate(el=>el.click());await editor.locator('.inspector-tabs button').first().click();
    for(const property of properties){
      const control=field(property.id),group=control.locator('xpath=ancestor::section[1]'),title=group.locator(':scope > .inspector-group-title');
      if(await title.getAttribute('aria-expanded')==='false')await title.click();
      assert.equal(await control.locator('select:not(.property-token-picker)').inputValue(),property.value.mobile,`${type}: mobile ${property.key} survives Editor reload`);
    }
  }
  await editor.locator('#publish').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));await viewer.reload();
  for(const {type,id} of editableNodes){
    assert.deepEqual(await readCss(publicNode(id)),canvasMobileExpected[id],`${type}: mobile Publish makes background CSS match Canvas`);
    for(const property of properties)assert.equal(published.pages[pageId].nodes[id].responsive.desktop[property.key],property.value.desktop,`${type}: mobile Publish preserves desktop ${property.key}`);
  }
  await viewer.setViewportSize({width:1366,height:900});await viewer.reload();
  for(const {type,id} of editableNodes)assert.deepEqual(await readCss(publicNode(id)),canvasDesktopExpected[id],`${type}: mobile Publish preserves desktop public background`);

  await viewer.setViewportSize({width:390,height:900});await viewer.reload();
  for(const {type,id} of editableNodes){
    await canvas(id).evaluate(el=>el.click());await editor.locator('.inspector-tabs button').first().click();
    for(const property of properties){
      const control=field(property.id),group=control.locator('xpath=ancestor::section[1]'),title=group.locator(':scope > .inspector-group-title');
      if(await title.getAttribute('aria-expanded')==='false')await title.click();
      const reset=group.locator(`.property-reset[data-property-key="${property.key}"]`);
      assert.equal(await reset.count(),1,`${type}: mobile ${property.key} exposes inheritance reset`);
      assert.equal(await reset.getAttribute('data-property-command'),'responsive.set',`${type}: ${property.key} reset uses responsive.set`);
      await reset.click();
    }
    assert.deepEqual(await readCss(canvas(id)),canvasDesktopExpected[id],`${type}: mobile background reset restores desktop CSS`);
  }
  const lastNode=editableNodes.at(-1);
  await editor.locator('#undo').click();
  assert.deepEqual(await readCss(canvas(lastNode.id)),{...canvasDesktopExpected[lastNode.id],backgroundRepeat:canvasMobileExpected[lastNode.id].backgroundRepeat},`${lastNode.type}: Undo restores the final mobile background-repeat value`);
  await editor.locator('#redo').click();
  assert.deepEqual(await readCss(canvas(lastNode.id)),canvasDesktopExpected[lastNode.id],`${lastNode.type}: Redo restores inherited desktop background`);
  await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  for(const {type,id} of editableNodes)for(const property of properties){
    assert.equal(draft.pages[pageId].nodes[id].responsive.mobile[property.key],undefined,`${type}: reset Save removes mobile ${property.key}`);
    assert.equal(published.pages[pageId].nodes[id].responsive.mobile[property.key],property.value.mobile,`${type}: reset Save preserves published mobile ${property.key}`);
  }
  await viewer.reload();for(const {type,id} of editableNodes)assert.deepEqual(await readCss(publicNode(id)),canvasMobileExpected[id],`${type}: reset Save leaves public mobile background unchanged`);
  await editor.locator('#publish').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));await viewer.reload();
  for(const {type,id} of editableNodes){
    assert.deepEqual(await readCss(publicNode(id)),canvasDesktopExpected[id],`${type}: reset Publish restores desktop-inherited background`);
    for(const property of properties)assert.equal(published.pages[pageId].nodes[id].responsive.mobile[property.key],undefined,`${type}: reset Publish removes mobile ${property.key}`);
  }
  assert.deepEqual(editorErrors,[],'opening every PARTIAL background Inspector must not throw');
});
