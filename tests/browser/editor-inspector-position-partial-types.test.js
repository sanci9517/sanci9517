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
  {id:'position.position',key:'position',type:'select',desktop:'relative',tablet:'absolute',mobile:'relative'},
  {id:'position.x',key:'x',type:'dimension',desktop:'4px',tablet:'12px',mobile:'20px'},
  {id:'position.y',key:'y',type:'dimension',desktop:'2px',tablet:'14px',mobile:'18px'},
  {id:'position.zIndex',key:'zIndex',type:'number',desktop:'3',tablet:'5',mobile:'9'}
];

test('all editable PARTIAL types preserve responsive position fields through Inspector, Canvas, Save and Publish',async t=>{
  const model=createEditorState(createDocument());
  const page=activePage(model),pageId=page.id,rootId=page.rootId;
  const nodes=[{type:NODE_TYPES.ROOT,id:rootId}];
  const authoredTypes=new Set(['heading','text','richtext','link','button']);
  for(const type of Object.values(NODE_TYPES)){
    if(type===NODE_TYPES.ROOT||getElementCapability(type).status!=='PARTIAL')continue;
    execute(model,{type:'element.add',payload:{type,parentId:rootId,authored:authoredTypes.has(type)}});
    const id=model.selection.primaryId;
    if(type==='richtext')execute(model,{type:'richtext.content.set',payload:{nodeId:id,document:plainTextToRichText('Responsive pozíció próba')}});
    else if(authoredTypes.has(type))execute(model,{type:'element.content.set',payload:{nodeId:id,content:'Responsive pozíció próba'}});
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
    if(url.pathname==='/api/admin/pages')return json({ok:true,data:url.searchParams.get('archived')==='1'?[]:[{id:pageId,slug:'inspector-position-partials',title:'Inspector position fixture',content:draft,revision:version,isPublished:false}]});
    if(url.pathname==='/api/admin/editor'){
      if(req.method==='GET')return json({ok:true,data:{page:{id:pageId,document:draft,publishedRevisionId:'published'},revisions:[{id:'revision-'+version,version}]}});
      let body='';for await(const chunk of req)body+=chunk;
      const request=JSON.parse(body);draft=structuredClone(request.document);version++;
      if(request.publish)published=structuredClone(draft);
      return json({ok:true,data:{pageId,version,revisionId:'revision-'+version,published:Boolean(request.publish)}});
    }
    if(url.pathname==='/api/public/pages')return json({ok:true,data:{id:pageId,slug:'inspector-position-partials',title:'Inspector position fixture',description:'',content:published.pages[pageId]}});
    if(url.pathname==='/api/public/navigation')return json({ok:true,data:{items:[]}});
    if(url.pathname==='/api/integrations/twitch/connection')return json({ok:true,data:{connected:false}});
    if(url.pathname.startsWith('/api/'))return json({ok:true,data:{siteName:'Inspector position test'}});
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
  const readCss=node=>node.evaluate(el=>{const css=getComputedStyle(el);return{position:css.position,left:css.left,top:css.top,zIndex:css.zIndex}});
  const widths={desktop:1366,tablet:768,mobile:390};
  const activateEditorDevice=async device=>{
    const button=editor.locator(`.canvas-device-btn[data-device="${device}"]`);
    if(!await button.evaluate(el=>el.classList.contains('active')))await button.click();
  };
  const activateViewerDevice=async device=>{
    const width=widths[device],changed=await viewer.evaluate(next=>window.innerWidth!==next,width);
    const rendered=changed?viewer.waitForResponse(response=>response.url().includes('/api/public/presentation')):null;
    await viewer.setViewportSize({width,height:900});
    if(rendered)await rendered;
    await viewer.waitForFunction(({expected,id})=>window.innerWidth===expected&&document.querySelector(`[data-node-id="${id}"]`)!==null,{expected:width,id:editableNodes[0].id});
  };
  const setPosition=async(type,id,device)=>{
    await canvas(id).evaluate(el=>el.click());await editor.locator('.inspector-tabs button').first().click();
    for(const property of properties){
      const control=field(property.id),group=control.locator('xpath=ancestor::section[1]'),title=group.locator(':scope > .inspector-group-title');
      if(await title.getAttribute('aria-expanded')==='false')await title.click();
      assert.equal(await control.getAttribute('data-property-command'),'responsive.set',`${type}: ${device} ${property.id} command`);
      assert.equal(await control.getAttribute('data-property-key'),property.key,`${type}: ${device} ${property.id} Page Model key`);
      if(property.type==='select')await control.locator('select:not(.property-token-picker)').selectOption(property[device]);
      else if(property.type==='dimension'){
        await control.locator('.dimension-controls select:not(.property-token-picker)').selectOption('px');
        const input=control.locator('.dimension-controls input[type="number"]');await input.fill(property[device].slice(0,-2));await input.press('Tab');
      }else{
        const input=control.locator('input[type="number"]');await input.fill(property[device]);await input.press('Tab');
      }
    }
  };
  const readStored=(nodeId,device,key)=>draft.pages[pageId].nodes[nodeId].responsive?.[device]?.[key];

  await editor.locator('.canvas-device-btn[data-device="desktop"]').click();
  const publicDesktopBaseline=Object.fromEntries(await Promise.all(editableNodes.map(async({id})=>[id,await readCss(publicNode(id))])));
  const canvasDesktopExpected={};
  for(const {type,id} of editableNodes){await setPosition(type,id,'desktop');canvasDesktopExpected[id]=await readCss(canvas(id));}
  await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  for(const {type,id} of editableNodes)for(const property of properties){
    assert.equal(readStored(id,'desktop',property.key),property.desktop,`${type}: desktop draft Save stores ${property.key}`);
    assert.equal(published.pages[pageId].nodes[id].responsive?.desktop?.[property.key],undefined,`${type}: desktop Save does not publish ${property.key}`);
  }
  await viewer.reload();for(const {type,id} of editableNodes)assert.deepEqual(await readCss(publicNode(id)),publicDesktopBaseline[id],`${type}: desktop draft Save leaves public position unchanged`);
  await editor.reload({waitUntil:'domcontentloaded'});
  for(const {type,id} of editableNodes){
    await canvas(id).evaluate(el=>el.click());await editor.locator('.inspector-tabs button').first().click();
    for(const property of properties){
      const control=field(property.id),group=control.locator('xpath=ancestor::section[1]'),title=group.locator(':scope > .inspector-group-title');
      if(await title.getAttribute('aria-expanded')==='false')await title.click();
      if(property.type==='dimension')assert.equal(await control.locator('.dimension-controls input[type="number"]').inputValue(),property.desktop.slice(0,-2),`${type}: desktop ${property.key} survives Editor reload`);
      else assert.equal(await control.locator(property.type==='select'?'select:not(.property-token-picker)':'input[type="number"]').inputValue(),property.desktop,`${type}: desktop ${property.key} survives Editor reload`);
    }
  }
  await editor.locator('#publish').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));await viewer.reload();
  for(const {type,id} of editableNodes){
    assert.deepEqual(await readCss(publicNode(id)),canvasDesktopExpected[id],`${type}: desktop Publish makes position CSS match Canvas`);
    for(const property of properties)assert.equal(published.pages[pageId].nodes[id].responsive.desktop[property.key],property.desktop,`${type}: desktop Publish stores ${property.key}`);
  }

  await activateEditorDevice('tablet');await activateViewerDevice('tablet');await viewer.reload();
  const publicTabletBaseline=Object.fromEntries(await Promise.all(editableNodes.map(async({id})=>[id,await readCss(publicNode(id))])));
  const canvasTabletExpected={};
  for(const {type,id} of editableNodes){await setPosition(type,id,'tablet');canvasTabletExpected[id]=await readCss(canvas(id));}
  await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  for(const {type,id} of editableNodes)for(const property of properties){
    assert.equal(readStored(id,'tablet',property.key),property.tablet,`${type}: tablet draft Save stores ${property.key}`);
    assert.equal(published.pages[pageId].nodes[id].responsive.tablet?.[property.key],undefined,`${type}: tablet Save does not publish ${property.key}`);
  }
  await viewer.reload();for(const {type,id} of editableNodes)assert.deepEqual(await readCss(publicNode(id)),publicTabletBaseline[id],`${type}: tablet draft Save leaves public position unchanged`);
  await editor.reload({waitUntil:'domcontentloaded'});await activateEditorDevice('tablet');
  for(const {type,id} of editableNodes){
    await canvas(id).evaluate(el=>el.click());await editor.locator('.inspector-tabs button').first().click();
    for(const property of properties){
      const control=field(property.id),group=control.locator('xpath=ancestor::section[1]'),title=group.locator(':scope > .inspector-group-title');
      if(await title.getAttribute('aria-expanded')==='false')await title.click();
      if(property.type==='dimension')assert.equal(await control.locator('.dimension-controls input[type="number"]').inputValue(),property.tablet.slice(0,-2),`${type}: tablet ${property.key} survives Editor reload`);
      else assert.equal(await control.locator(property.type==='select'?'select:not(.property-token-picker)':'input[type="number"]').inputValue(),property.tablet,`${type}: tablet ${property.key} survives Editor reload`);
    }
  }
  await editor.locator('#publish').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));await viewer.reload();
  for(const {type,id} of editableNodes){
    assert.deepEqual(await readCss(publicNode(id)),canvasTabletExpected[id],`${type}: tablet Publish makes position CSS match Canvas`);
    for(const property of properties)assert.equal(published.pages[pageId].nodes[id].responsive.tablet[property.key],property.tablet,`${type}: tablet Publish stores ${property.key}`);
  }
  await activateViewerDevice('desktop');await viewer.reload();
  for(const {type,id} of editableNodes)assert.deepEqual(await readCss(publicNode(id)),canvasDesktopExpected[id],`${type}: tablet Publish preserves desktop public position`);

  await activateEditorDevice('mobile');await activateViewerDevice('mobile');await viewer.reload();
  const publicMobileBaseline=Object.fromEntries(await Promise.all(editableNodes.map(async({id})=>[id,await readCss(publicNode(id))])));
  const canvasMobileExpected={};
  for(const {type,id} of editableNodes){await setPosition(type,id,'mobile');canvasMobileExpected[id]=await readCss(canvas(id));}
  await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  for(const {type,id} of editableNodes)for(const property of properties){
    assert.equal(readStored(id,'mobile',property.key),property.mobile,`${type}: mobile draft Save stores ${property.key}`);
    assert.equal(draft.pages[pageId].nodes[id].responsive.desktop[property.key],property.desktop,`${type}: mobile Save preserves desktop ${property.key}`);
    assert.equal(published.pages[pageId].nodes[id].responsive.mobile?.[property.key],undefined,`${type}: mobile Save does not publish ${property.key}`);
  }
  await viewer.reload();for(const {type,id} of editableNodes)assert.deepEqual(await readCss(publicNode(id)),publicMobileBaseline[id],`${type}: mobile draft Save leaves public position unchanged`);
  await editor.reload({waitUntil:'domcontentloaded'});await editor.locator('.canvas-device-btn[data-device="mobile"]').click();
  for(const {type,id} of editableNodes){
    await canvas(id).evaluate(el=>el.click());await editor.locator('.inspector-tabs button').first().click();
    for(const property of properties){
      const control=field(property.id),group=control.locator('xpath=ancestor::section[1]'),title=group.locator(':scope > .inspector-group-title');
      if(await title.getAttribute('aria-expanded')==='false')await title.click();
      if(property.type==='dimension')assert.equal(await control.locator('.dimension-controls input[type="number"]').inputValue(),property.mobile.slice(0,-2),`${type}: mobile ${property.key} survives Editor reload`);
      else assert.equal(await control.locator(property.type==='select'?'select:not(.property-token-picker)':'input[type="number"]').inputValue(),property.mobile,`${type}: mobile ${property.key} survives Editor reload`);
    }
  }
  await editor.locator('#publish').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));await viewer.reload();
  for(const {type,id} of editableNodes){
    assert.deepEqual(await readCss(publicNode(id)),canvasMobileExpected[id],`${type}: mobile Publish makes position CSS match Canvas`);
    for(const property of properties)assert.equal(published.pages[pageId].nodes[id].responsive.desktop[property.key],property.desktop,`${type}: mobile Publish preserves desktop ${property.key}`);
    for(const property of properties)assert.equal(published.pages[pageId].nodes[id].responsive.tablet[property.key],property.tablet,`${type}: mobile Publish preserves tablet ${property.key}`);
  }
  await activateViewerDevice('desktop');await viewer.reload();
  for(const {type,id} of editableNodes)assert.deepEqual(await readCss(publicNode(id)),canvasDesktopExpected[id],`${type}: mobile Publish preserves desktop public position`);
  await activateViewerDevice('tablet');await viewer.reload();
  for(const {type,id} of editableNodes)assert.deepEqual(await readCss(publicNode(id)),canvasTabletExpected[id],`${type}: mobile Publish preserves tablet public position`);

  await activateViewerDevice('mobile');await viewer.reload();
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
    assert.deepEqual(await readCss(canvas(id)),canvasTabletExpected[id],`${type}: mobile position reset restores tablet CSS`);
  }
  const lastNode=editableNodes.at(-1);
  await editor.locator('#undo').click();
  assert.deepEqual(await readCss(canvas(lastNode.id)),{...canvasTabletExpected[lastNode.id],zIndex:'9'},`${lastNode.type}: Undo restores the final mobile z-index override`);
  await editor.locator('#redo').click();
  assert.deepEqual(await readCss(canvas(lastNode.id)),canvasTabletExpected[lastNode.id],`${lastNode.type}: Redo restores inherited tablet position`);
  await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  for(const {type,id} of editableNodes)for(const property of properties){
    assert.equal(draft.pages[pageId].nodes[id].responsive.mobile[property.key],undefined,`${type}: reset Save removes mobile ${property.key}`);
    assert.equal(published.pages[pageId].nodes[id].responsive.mobile[property.key],property.mobile,`${type}: reset Save preserves published mobile ${property.key}`);
  }
  await viewer.reload();for(const {type,id} of editableNodes)assert.deepEqual(await readCss(publicNode(id)),canvasMobileExpected[id],`${type}: reset Save leaves public mobile position unchanged`);
  await activateViewerDevice('tablet');await viewer.reload();
  for(const {type,id} of editableNodes)assert.deepEqual(await readCss(publicNode(id)),canvasTabletExpected[id],`${type}: mobile reset Save preserves public tablet position`);
  await editor.locator('#publish').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));await viewer.reload();
  for(const {type,id} of editableNodes){
    assert.deepEqual(await readCss(publicNode(id)),canvasTabletExpected[id],`${type}: mobile reset Publish restores tablet-inherited position`);
    for(const property of properties)assert.equal(published.pages[pageId].nodes[id].responsive.mobile[property.key],undefined,`${type}: reset Publish removes mobile ${property.key}`);
  }

  await activateEditorDevice('tablet');
  for(const {type,id} of editableNodes){
    await canvas(id).evaluate(el=>el.click());await editor.locator('.inspector-tabs button').first().click();
    for(const property of properties){
      const control=field(property.id),group=control.locator('xpath=ancestor::section[1]'),title=group.locator(':scope > .inspector-group-title');
      if(await title.getAttribute('aria-expanded')==='false')await title.click();
      const reset=group.locator(`.property-reset[data-property-key="${property.key}"]`);
      assert.equal(await reset.count(),1,`${type}: tablet ${property.key} exposes inheritance reset`);
      assert.equal(await reset.getAttribute('data-property-command'),'responsive.set',`${type}: tablet ${property.key} reset uses responsive.set`);
      await reset.click();
    }
    assert.deepEqual(await readCss(canvas(id)),canvasDesktopExpected[id],`${type}: tablet position reset restores desktop CSS`);
  }
  const lastTabletNode=editableNodes.at(-1);
  await editor.locator('#undo').click();
  assert.deepEqual(await readCss(canvas(lastTabletNode.id)),{...canvasDesktopExpected[lastTabletNode.id],zIndex:'5'},`${lastTabletNode.type}: Undo restores final tablet z-index`);
  await editor.locator('#redo').click();
  assert.deepEqual(await readCss(canvas(lastTabletNode.id)),canvasDesktopExpected[lastTabletNode.id],`${lastTabletNode.type}: Redo restores desktop position inheritance`);
  await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  for(const {type,id} of editableNodes)for(const property of properties){
    assert.equal(draft.pages[pageId].nodes[id].responsive.tablet[property.key],undefined,`${type}: tablet reset Save removes ${property.key}`);
    assert.equal(published.pages[pageId].nodes[id].responsive.tablet[property.key],property.tablet,`${type}: tablet reset Save preserves published ${property.key}`);
  }
  await activateViewerDevice('tablet');await viewer.reload();
  for(const {type,id} of editableNodes)assert.deepEqual(await readCss(publicNode(id)),canvasTabletExpected[id],`${type}: tablet reset Save leaves public position unchanged`);
  await editor.locator('#publish').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));await viewer.reload();
  for(const {type,id} of editableNodes){
    assert.deepEqual(await readCss(publicNode(id)),canvasDesktopExpected[id],`${type}: tablet reset Publish restores desktop position`);
    for(const property of properties)assert.equal(published.pages[pageId].nodes[id].responsive.tablet[property.key],undefined,`${type}: tablet reset Publish removes ${property.key}`);
  }
  await activateViewerDevice('mobile');await viewer.reload();
  for(const {type,id} of editableNodes)assert.deepEqual(await readCss(publicNode(id)),canvasDesktopExpected[id],`${type}: tablet reset Publish restores mobile's inherited desktop position`);
  assert.deepEqual(editorErrors,[],'opening every PARTIAL position Inspector must not throw');
});
