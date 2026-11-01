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
const widths={desktop:1366,tablet:768,mobile:390};
const modes=['visible','hidden','auto','scroll'];
const values={
  desktop:index=>modes[index%modes.length],
  tablet:index=>modes[(index+1)%modes.length],
  mobile:index=>modes[(index+2)%modes.length]
};

test('all editable PARTIAL types preserve responsive overflow mode through tablet Save, Publish and inheritance reset',async t=>{
  const model=createEditorState(createDocument());
  const page=activePage(model),pageId=page.id,rootId=page.rootId;
  const nodes=[{type:NODE_TYPES.ROOT,id:rootId}],authoredTypes=new Set(['heading','text','richtext','link','button']);
  for(const type of Object.values(NODE_TYPES)){
    if(type===NODE_TYPES.ROOT||getElementCapability(type).status!=='PARTIAL')continue;
    execute(model,{type:'element.add',payload:{type,parentId:rootId,authored:authoredTypes.has(type)}});
    const id=model.selection.primaryId;
    if(type==='richtext')execute(model,{type:'richtext.content.set',payload:{nodeId:id,document:plainTextToRichText('Tablet túlcsordulás próba')}});
    else if(authoredTypes.has(type))execute(model,{type:'element.content.set',payload:{nodeId:id,content:'Tablet túlcsordulás próba'}});
    if(type==='button'||type==='link')execute(model,{type:'content.properties.set',payload:{nodeId:id,patch:{href:'https://example.com'}}});
    nodes.push({type,id});
  }
  assert.equal(nodes.length,45,'fixture includes root and every editable PARTIAL type');
  const editableNodes=nodes.filter(node=>node.type!==NODE_TYPES.ROOT);
  let draft=structuredClone(model.document),published=structuredClone(draft),version=1;
  const errors=[],server=createServer(async(req,res)=>{
    const url=new URL(req.url,'http://localhost');
    const json=data=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(data))};
    if(url.pathname==='/api/admin/pages')return json({ok:true,data:url.searchParams.get('archived')==='1'?[]:[{id:pageId,slug:'overflow-tablet-partials',title:'Tablet overflow fixture',content:draft,revision:version,isPublished:false}]});
    if(url.pathname==='/api/admin/editor'){
      if(req.method==='GET')return json({ok:true,data:{page:{id:pageId,document:draft,publishedRevisionId:'published'},revisions:[{id:'revision-'+version,version}]}});
      let body='';for await(const chunk of req)body+=chunk;
      const request=JSON.parse(body);draft=structuredClone(request.document);version++;
      if(request.publish)published=structuredClone(draft);
      return json({ok:true,data:{pageId,version,revisionId:'revision-'+version,published:Boolean(request.publish)}});
    }
    if(url.pathname==='/api/public/pages')return json({ok:true,data:{id:pageId,slug:'overflow-tablet-partials',title:'Tablet overflow fixture',description:'',content:published.pages[pageId]}});
    if(url.pathname==='/api/public/navigation')return json({ok:true,data:{items:[]}});
    if(url.pathname==='/api/integrations/twitch/connection')return json({ok:true,data:{connected:false}});
    if(url.pathname.startsWith('/api/'))return json({ok:true,data:{siteName:'Tablet overflow test'}});
    const file=resolve(publicDir,'.'+(url.pathname==='/p/test'?'/visual-page.html':url.pathname));
    if(!file.startsWith(publicDir+'/'))return res.writeHead(403).end();
    try{res.setHeader('content-type',{'.html':'text/html','.js':'text/javascript','.css':'text/css'}[extname(file)]||'application/octet-stream');res.end(await readFile(file))}
    catch{res.writeHead(404).end()}
  });
  await new Promise(done=>server.listen(0,'127.0.0.1',done));
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
  t.after(async()=>{await browser.close();await new Promise(done=>server.close(done))});
  const editor=await browser.newPage({viewport:{width:widths.desktop,height:900}}),viewer=await browser.newPage({viewport:{width:widths.desktop,height:900}});
  editor.setDefaultTimeout(30000);editor.on('pageerror',error=>errors.push(error.message));
  await editor.goto(`http://127.0.0.1:${server.address().port}/editor-v2/index.html`);
  await viewer.goto(`http://127.0.0.1:${server.address().port}/p/test`);
  if(await editor.locator('#rightDock').evaluate(el=>el.classList.contains('closed')))await editor.locator('#openInspector').click();
  const inspector=editor.locator('#inspectorBody'),field=inspector.locator('[data-property-id="layout.overflow"]');
  const canvas=id=>editor.locator(`.node[data-node-id="${id}"]`),publicNode=id=>viewer.locator(`.visual-editor-node[data-node-id="${id}"]`);
  await viewer.waitForFunction(count=>document.querySelectorAll('.visual-editor-node[data-node-id]').length>=count,editableNodes.length);
  const waitForPublicOverflows=async device=>{
    const entries=editableNodes.map(({id},index)=>[id,values[device](index)]);
    await viewer.waitForFunction(entries=>entries.every(([id,expected])=>{
      const node=document.querySelector(`.visual-editor-node[data-node-id="${id}"]`);
      return node&&getComputedStyle(node).overflow===expected;
    }),entries);
  };
  const setDevice=async device=>{
    const button=editor.locator(`.canvas-device-btn[data-device="${device}"]`);
    if(!await button.evaluate(el=>el.classList.contains('active')))await button.click();
    if(await viewer.evaluate(next=>window.innerWidth!==next,widths[device]))await viewer.setViewportSize({width:widths[device],height:900});
  };
  const setOverflow=async(type,id,device,index)=>{
    await canvas(id).evaluate(el=>el.click());await editor.locator('.inspector-tabs button').first().click();
    assert.equal(await field.getAttribute('data-property-command'),'responsive.set',`${type}: ${device} overflow mode command`);
    assert.equal(await field.getAttribute('data-property-key'),'overflow',`${type}: ${device} overflow mode Page Model key`);
    const group=field.locator('xpath=ancestor::section[1]'),title=group.locator(':scope > .inspector-group-title');
    if(await title.getAttribute('aria-expanded')==='false')await title.click();
    await field.locator('select:not(.property-token-picker)').selectOption(values[device](index));
    assert.equal(await canvas(id).evaluate(el=>getComputedStyle(el).overflow),values[device](index),`${type}: ${device} overflow reaches Canvas CSS`);
  };
  const stored=(id,device)=>draft.pages[pageId].nodes[id].responsive?.[device]?.overflow;

  await setDevice('desktop');
  for(const [index,{type,id}] of editableNodes.entries())await setOverflow(type,id,'desktop',index);
  await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  for(const [index,{type,id}] of editableNodes.entries()){
    assert.equal(stored(id,'desktop'),values.desktop(index),`${type}: desktop Save stores its baseline`);
    assert.equal(published.pages[pageId].nodes[id].responsive.desktop?.overflow,undefined,`${type}: desktop Save remains unpublished`);
  }
  await editor.locator('#publish').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
  await viewer.reload();
  await waitForPublicOverflows('desktop');
  for(const [index,{type,id}] of editableNodes.entries()){
    assert.equal(await publicNode(id).evaluate(el=>getComputedStyle(el).overflow),values.desktop(index),`${type}: desktop Publish establishes public baseline`);
  }

  await setDevice('tablet');await viewer.reload();await waitForPublicOverflows('desktop');
  const tabletBaseline=Object.fromEntries(await Promise.all(editableNodes.map(async({id})=>[id,await publicNode(id).evaluate(el=>getComputedStyle(el).overflow)])));
  for(const [index,{type,id}] of editableNodes.entries())await setOverflow(type,id,'tablet',index);
  await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  for(const [index,{type,id}] of editableNodes.entries()){
    assert.equal(stored(id,'tablet'),values.tablet(index),`${type}: tablet Save stores its own Page Model value`);
    assert.equal(draft.pages[pageId].nodes[id].responsive.desktop.overflow,values.desktop(index),`${type}: tablet Save preserves desktop value`);
    assert.equal(published.pages[pageId].nodes[id].responsive.tablet?.overflow,undefined,`${type}: tablet Save does not Publish`);
  }
  await viewer.reload();
  await waitForPublicOverflows('desktop');
  for(const {type,id} of editableNodes)assert.equal(await publicNode(id).evaluate(el=>getComputedStyle(el).overflow),tabletBaseline[id],`${type}: tablet Save leaves public CSS unchanged`);
  await editor.reload({waitUntil:'domcontentloaded'});await setDevice('tablet');
  for(const [index,{type,id}] of editableNodes.entries()){
    await canvas(id).evaluate(el=>el.click());await editor.locator('.inspector-tabs button').first().click();
    assert.equal(await field.locator('select:not(.property-token-picker)').inputValue(),values.tablet(index),`${type}: tablet overflow survives Editor reload`);
  }
  await editor.locator('#publish').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
  await viewer.reload();
  await waitForPublicOverflows('tablet');
  for(const [index,{type,id}] of editableNodes.entries()){
    assert.equal(published.pages[pageId].nodes[id].responsive.tablet.overflow,values.tablet(index),`${type}: tablet Publish persists Page Model overflow`);
    assert.equal(await publicNode(id).evaluate(el=>getComputedStyle(el).overflow),values.tablet(index),`${type}: tablet Publish renders public overflow`);
  }
  await setDevice('desktop');await viewer.reload();await waitForPublicOverflows('desktop');
  for(const [index,{type,id}] of editableNodes.entries())assert.equal(await publicNode(id).evaluate(el=>getComputedStyle(el).overflow),values.desktop(index),`${type}: tablet Publish preserves desktop CSS`);

  await setDevice('mobile');await viewer.reload();await waitForPublicOverflows('tablet');
  for(const [index,{type,id}] of editableNodes.entries())assert.equal(await publicNode(id).evaluate(el=>getComputedStyle(el).overflow),values.tablet(index),`${type}: mobile inherits the published tablet overflow`);
  const mobileBaseline=Object.fromEntries(await Promise.all(editableNodes.map(async({id})=>[id,await publicNode(id).evaluate(el=>getComputedStyle(el).overflow)])));
  for(const [index,{type,id}] of editableNodes.entries())await setOverflow(type,id,'mobile',index);
  await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  for(const [index,{type,id}] of editableNodes.entries()){
    assert.equal(stored(id,'mobile'),values.mobile(index),`${type}: mobile override saves independently`);
    assert.equal(draft.pages[pageId].nodes[id].responsive.tablet.overflow,values.tablet(index),`${type}: mobile Save preserves tablet value`);
    assert.equal(published.pages[pageId].nodes[id].responsive.mobile?.overflow,undefined,`${type}: mobile Save stays unpublished`);
  }
  await viewer.reload();
  for(const {type,id} of editableNodes)assert.equal(await publicNode(id).evaluate(el=>getComputedStyle(el).overflow),mobileBaseline[id],`${type}: mobile Save preserves public inherited overflow`);
  await editor.locator('#publish').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
  await viewer.reload();
  await waitForPublicOverflows('mobile');
  for(const [index,{type,id}] of editableNodes.entries())assert.equal(await publicNode(id).evaluate(el=>getComputedStyle(el).overflow),values.mobile(index),`${type}: explicit mobile Publish applies its own overflow`);

  for(const [index,{type,id}] of editableNodes.entries()){
    await canvas(id).evaluate(el=>el.click());await editor.locator('.inspector-tabs button').first().click();
    const group=field.locator('xpath=ancestor::section[1]'),title=group.locator(':scope > .inspector-group-title');
    if(await title.getAttribute('aria-expanded')==='false')await title.click();
    const reset=group.locator('.property-reset[data-property-key="overflow"]');
    assert.equal(await reset.count(),1,`${type}: mobile overflow exposes its inheritance reset`);
    await reset.click();
    assert.equal(await canvas(id).evaluate(el=>getComputedStyle(el).overflow),values.tablet(index),`${type}: mobile reset inherits tablet in Canvas`);
  }
  const lastNode=editableNodes.at(-1);
  await editor.locator('#undo').click();
  assert.equal(await canvas(lastNode.id).evaluate(el=>getComputedStyle(el).overflow),values.mobile(editableNodes.length-1),`${lastNode.type}: Undo restores mobile overflow mode`);
  await editor.locator('#redo').click();
  assert.equal(await canvas(lastNode.id).evaluate(el=>getComputedStyle(el).overflow),values.tablet(editableNodes.length-1),`${lastNode.type}: Redo restores tablet inheritance`);
  await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  for(const [index,{type,id}] of editableNodes.entries()){
    assert.equal(draft.pages[pageId].nodes[id].responsive.mobile.overflow,undefined,`${type}: mobile reset Save removes mobile override`);
    assert.equal(published.pages[pageId].nodes[id].responsive.mobile.overflow,values.mobile(index),`${type}: mobile reset Save preserves public override`);
  }
  await viewer.reload();
  await waitForPublicOverflows('mobile');
  for(const [index,{type,id}] of editableNodes.entries())assert.equal(await publicNode(id).evaluate(el=>getComputedStyle(el).overflow),values.mobile(index),`${type}: mobile reset Save leaves published overflow intact`);
  await editor.locator('#publish').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
  await viewer.reload();
  await waitForPublicOverflows('tablet');
  for(const [index,{type,id}] of editableNodes.entries())assert.equal(await publicNode(id).evaluate(el=>getComputedStyle(el).overflow),values.tablet(index),`${type}: mobile reset Publish restores tablet overflow`);
  await setDevice('tablet');
  for(const [index,{type,id}] of editableNodes.entries()){
    await canvas(id).evaluate(el=>el.click());await editor.locator('.inspector-tabs button').first().click();
    const group=field.locator('xpath=ancestor::section[1]'),title=group.locator(':scope > .inspector-group-title');
    if(await title.getAttribute('aria-expanded')==='false')await title.click();
    const reset=group.locator('.property-reset[data-property-key="overflow"]');
    assert.equal(await reset.count(),1,`${type}: tablet overflow exposes its inheritance reset`);
    await reset.click();
    assert.equal(await canvas(id).evaluate(el=>getComputedStyle(el).overflow),values.desktop(index),`${type}: tablet reset restores desktop overflow`);
  }
  await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  for(const [index,{type,id}] of editableNodes.entries()){
    assert.equal(draft.pages[pageId].nodes[id].responsive.tablet.overflow,undefined,`${type}: tablet reset Save removes override`);
    assert.equal(published.pages[pageId].nodes[id].responsive.tablet.overflow,values.tablet(index),`${type}: tablet reset Save preserves published value`);
  }
  await viewer.reload();
  await waitForPublicOverflows('tablet');
  for(const [index,{type,id}] of editableNodes.entries())assert.equal(await publicNode(id).evaluate(el=>getComputedStyle(el).overflow),values.tablet(index),`${type}: tablet reset Save leaves public overflow unchanged`);
  await editor.locator('#publish').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
  await viewer.reload();
  await waitForPublicOverflows('desktop');
  for(const [index,{type,id}] of editableNodes.entries())assert.equal(await publicNode(id).evaluate(el=>getComputedStyle(el).overflow),values.desktop(index),`${type}: tablet reset Publish restores desktop overflow`);
  await setDevice('mobile');await viewer.reload();await waitForPublicOverflows('desktop');
  for(const [index,{type,id}] of editableNodes.entries())assert.equal(await publicNode(id).evaluate(el=>getComputedStyle(el).overflow),values.desktop(index),`${type}: mobile inherits desktop after tablet reset Publish`);
  assert.deepEqual(errors,[],'overflow-mode responsive lifecycle must not produce Editor page errors');
});
