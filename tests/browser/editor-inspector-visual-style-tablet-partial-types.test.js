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
const shadows=['0 2px 8px #0003','0 8px 24px #0005','0 16px 48px #0007'];
const opacityValue=value=>String(Number(value.toFixed(2)));
const values={
  desktop:index=>({opacity:opacityValue(0.9-(index%4)*0.1),shadow:shadows[index%shadows.length]}),
  tablet:index=>({opacity:opacityValue(0.45+(index%5)*0.08),shadow:shadows[(index+1)%shadows.length]}),
  mobile:index=>({opacity:opacityValue(0.35+(index%5)*0.09),shadow:shadows[(index+2)%shadows.length]})
};

test('opacity and box shadow preserve tablet Inspector lifecycle across all editable PARTIAL types',async t=>{
  const model=createEditorState(createDocument()),page=activePage(model),pageId=page.id,rootId=page.rootId;
  const nodes=[{type:NODE_TYPES.ROOT,id:rootId}],authoredTypes=new Set(['heading','text','richtext','link','button']);
  for(const type of Object.values(NODE_TYPES)){
    if(type===NODE_TYPES.ROOT||getElementCapability(type).status!=='PARTIAL')continue;
    execute(model,{type:'element.add',payload:{type,parentId:rootId,authored:authoredTypes.has(type)}});
    const id=model.selection.primaryId;
    if(type==='richtext')execute(model,{type:'richtext.content.set',payload:{nodeId:id,document:plainTextToRichText('Tablet átlátszóság és árnyék próba')}});
    else if(authoredTypes.has(type))execute(model,{type:'element.content.set',payload:{nodeId:id,content:'Tablet átlátszóság és árnyék próba'}});
    if(type==='button'||type==='link')execute(model,{type:'content.properties.set',payload:{nodeId:id,patch:{href:'https://example.com'}}});
    nodes.push({type,id});
  }
  assert.equal(nodes.length,45,'fixture includes root and all 44 editable PARTIAL types');
  const editableNodes=nodes.filter(node=>node.type!==NODE_TYPES.ROOT);
  let draft=structuredClone(model.document),published=structuredClone(draft),version=1;
  const errors=[],server=createServer(async(req,res)=>{
    const url=new URL(req.url,'http://localhost');
    const json=data=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(data))};
    if(url.pathname==='/api/admin/pages')return json({ok:true,data:url.searchParams.get('archived')==='1'?[]:[{id:pageId,slug:'visual-style-tablet-partials',title:'Tablet visual style fixture',content:draft,revision:version,isPublished:false}]});
    if(url.pathname==='/api/admin/editor'){
      if(req.method==='GET')return json({ok:true,data:{page:{id:pageId,document:draft,publishedRevisionId:'published'},revisions:[{id:'revision-'+version,version}]}});
      let body='';for await(const chunk of req)body+=chunk;
      const request=JSON.parse(body);draft=structuredClone(request.document);version++;
      if(request.publish)published=structuredClone(draft);
      return json({ok:true,data:{pageId,version,revisionId:'revision-'+version,published:Boolean(request.publish)}});
    }
    if(url.pathname==='/api/public/pages')return json({ok:true,data:{id:pageId,slug:'visual-style-tablet-partials',title:'Tablet visual style fixture',description:'',content:published.pages[pageId]}});
    if(url.pathname==='/api/public/navigation')return json({ok:true,data:{items:[]}});
    if(url.pathname==='/api/integrations/twitch/connection')return json({ok:true,data:{connected:false}});
    if(url.pathname.startsWith('/api/'))return json({ok:true,data:{siteName:'Tablet visual style test'}});
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
  const inspector=editor.locator('#inspectorBody'),opacityField=inspector.locator('[data-property-id="opacity.value"]'),shadowField=inspector.locator('[data-property-id="shadow.box"]');
  const canvas=id=>editor.locator(`.node[data-node-id="${id}"]`),publicNode=id=>viewer.locator(`.visual-editor-node[data-node-id="${id}"]`);
  await viewer.waitForFunction(count=>document.querySelectorAll('.visual-editor-node[data-node-id]').length>=count,editableNodes.length);
  const setDevice=async device=>{
    const button=editor.locator(`.canvas-device-btn[data-device="${device}"]`);
    if(!await button.evaluate(el=>el.classList.contains('active')))await button.click();
    if(await viewer.evaluate(next=>window.innerWidth!==next,widths[device]))await viewer.setViewportSize({width:widths[device],height:900});
  };
  const visual=node=>node.evaluate(el=>({opacity:getComputedStyle(el).opacity,boxShadow:getComputedStyle(el).boxShadow}));
  const stored=(id,device)=>draft.pages[pageId].nodes[id].responsive?.[device];
  const setValues=async(type,id,device,index)=>{
    await canvas(id).evaluate(el=>el.click());await editor.locator('.inspector-tabs button').first().click();
    for(const [field,key] of [[opacityField,'opacity'],[shadowField,'boxShadow']]){
      assert.equal(await field.getAttribute('data-property-command'),'responsive.set',`${type}: ${device} ${key} uses responsive command`);
      assert.equal(await field.getAttribute('data-property-key'),key,`${type}: ${device} ${key} maps to the Page Model`);
      const group=field.locator('xpath=ancestor::section[1]'),title=group.locator(':scope > .inspector-group-title');
      if(await title.getAttribute('aria-expanded')==='false')await title.click();
    }
    const value=values[device](index);
    await opacityField.locator('input[type="number"]').fill(value.opacity);
    await opacityField.locator('input[type="number"]').press('Tab');
    await shadowField.locator('select:not(.property-token-picker)').selectOption(value.shadow);
    const computed=await visual(canvas(id));
    assert.deepEqual(computed,{
      opacity:value.opacity,
      boxShadow:computed.boxShadow
    },`${type}: ${device} Inspector values reach Canvas`);
    return {...value,computed};
  };
  const save=async publish=>{
    await editor.locator(publish?'#publish':'#save').click();
    await editor.waitForFunction(label=>document.querySelector('#saveStatus').textContent.startsWith(label),publish?'Publikálva':'Mentve');
  };

  // Establish a distinct desktop baseline so breakpoint isolation and resets
  // have observable values for every renderer type.
  await setDevice('desktop');
  for(const [index,{type,id}] of editableNodes.entries())await setValues(type,id,'desktop',index);
  await save(false);
  for(const [index,{type,id}] of editableNodes.entries()){
    assert.equal(stored(id,'desktop').opacity,values.desktop(index).opacity,`${type}: desktop opacity is saved`);
    assert.equal(stored(id,'desktop').boxShadow,values.desktop(index).shadow,`${type}: desktop shadow is saved`);
    assert.equal(published.pages[pageId].nodes[id].responsive.desktop?.opacity,undefined,`${type}: desktop Save is not Publish`);
  }
  await save(true);await viewer.reload();
  const desktopPublic=Object.fromEntries(await Promise.all(editableNodes.map(async({id})=>[id,await visual(publicNode(id))])));

  await setDevice('tablet');await viewer.reload();
  const tabletBaseline=Object.fromEntries(await Promise.all(editableNodes.map(async({id})=>[id,await visual(publicNode(id))])));
  const tabletCanvasValues={};
  for(const [index,{type,id}] of editableNodes.entries())tabletCanvasValues[id]=await setValues(type,id,'tablet',index);
  await save(false);
  for(const [index,{type,id}] of editableNodes.entries()){
    assert.equal(stored(id,'tablet').opacity,values.tablet(index).opacity,`${type}: tablet opacity saves independently`);
    assert.equal(stored(id,'tablet').boxShadow,values.tablet(index).shadow,`${type}: tablet shadow saves independently`);
    assert.equal(stored(id,'desktop').opacity,values.desktop(index).opacity,`${type}: tablet Save preserves desktop opacity`);
    assert.equal(published.pages[pageId].nodes[id].responsive.tablet?.opacity,undefined,`${type}: tablet Save stays unpublished`);
  }
  await viewer.reload();
  for(const {type,id} of editableNodes)assert.deepEqual(await visual(publicNode(id)),tabletBaseline[id],`${type}: tablet Save leaves public styles unchanged`);
  await editor.reload({waitUntil:'domcontentloaded'});await setDevice('tablet');
  for(const [index,{type,id}] of editableNodes.entries()){
    await canvas(id).evaluate(el=>el.click());await editor.locator('.inspector-tabs button').first().click();
    assert.equal(await opacityField.locator('input[type="number"]').inputValue(),values.tablet(index).opacity,`${type}: tablet opacity survives Editor reload`);
    assert.equal(await shadowField.locator('select:not(.property-token-picker)').inputValue(),values.tablet(index).shadow,`${type}: tablet shadow survives Editor reload`);
  }
  await save(true);await viewer.reload();
  const tabletPublic=Object.fromEntries(await Promise.all(editableNodes.map(async({id})=>[id,await visual(publicNode(id))])));
  for(const [index,{type,id}] of editableNodes.entries()){
    assert.equal(stored(id,'tablet').opacity,values.tablet(index).opacity,`${type}: tablet Publish stores opacity`);
    assert.equal(stored(id,'tablet').boxShadow,values.tablet(index).shadow,`${type}: tablet Publish stores shadow`);
    assert.equal(tabletPublic[id].opacity,values.tablet(index).opacity,`${type}: tablet Publish reaches public opacity`);
    assert.equal(tabletPublic[id].boxShadow,tabletCanvasValues[id].computed.boxShadow,`${type}: tablet Publish reaches public shadow`);
    assert.notEqual(tabletPublic[id].boxShadow,tabletBaseline[id].boxShadow,`${type}: tablet Publish changes public shadow`);
  }
  await viewer.setViewportSize({width:widths.desktop,height:900});await viewer.reload();
  for(const {type,id} of editableNodes)assert.deepEqual(await visual(publicNode(id)),desktopPublic[id],`${type}: tablet Publish preserves desktop output`);

  // Mobile inherits tablet, then receives its own override. Resetting mobile
  // returns to tablet; resetting tablet returns both narrower breakpoints to
  // desktop, and neither reset is published by Save alone.
  await setDevice('mobile');await viewer.setViewportSize({width:widths.mobile,height:900});await viewer.reload();
  for(const {type,id} of editableNodes)assert.deepEqual(await visual(publicNode(id)),tabletPublic[id],`${type}: mobile inherits tablet styles`);
  const mobileCanvasValues={};
  for(const [index,{type,id}] of editableNodes.entries())mobileCanvasValues[id]=await setValues(type,id,'mobile',index);
  await save(true);await viewer.reload();
  const mobilePublished=Object.fromEntries(await Promise.all(editableNodes.map(async({id})=>[id,await visual(publicNode(id))])));
  for(const [index,{type,id}] of editableNodes.entries()){
    assert.equal(stored(id,'mobile').opacity,values.mobile(index).opacity,`${type}: mobile Publish stores opacity`);
    assert.equal(stored(id,'mobile').boxShadow,values.mobile(index).shadow,`${type}: mobile Publish stores shadow`);
    assert.equal(mobilePublished[id].opacity,values.mobile(index).opacity,`${type}: mobile explicit Publish remains independent`);
    assert.equal(mobilePublished[id].boxShadow,mobileCanvasValues[id].computed.boxShadow,`${type}: mobile Publish renders the selected shadow`);
  }
  for(const {type,id} of editableNodes){
    await canvas(id).evaluate(el=>el.click());await editor.locator('.inspector-tabs button').first().click();
    for(const [field,key] of [[opacityField,'opacity'],[shadowField,'boxShadow']]){
      const group=field.locator('xpath=ancestor::section[1]'),title=group.locator(':scope > .inspector-group-title');
      if(await title.getAttribute('aria-expanded')==='false')await title.click();
      const reset=group.locator(`.property-reset[data-property-key="${key}"]`);
      assert.equal(await reset.count(),1,`${type}: mobile ${key} exposes inheritance reset`);
      await reset.click();
    }
  }
  await save(false);
  for(const {type,id} of editableNodes){
    assert.equal(stored(id,'mobile').opacity,undefined,`${type}: mobile reset Save removes opacity override`);
    assert.deepEqual(await visual(publicNode(id)),mobilePublished[id],`${type}: mobile reset Save preserves public styles`);
  }
  await save(true);await viewer.reload();
  for(const {type,id} of editableNodes)assert.deepEqual(await visual(publicNode(id)),tabletPublic[id],`${type}: mobile reset Publish restores tablet inheritance`);

  await setDevice('tablet');await viewer.setViewportSize({width:widths.tablet,height:900});await viewer.reload();
  for(const {type,id} of editableNodes){
    await canvas(id).evaluate(el=>el.click());await editor.locator('.inspector-tabs button').first().click();
    for(const [field,key] of [[opacityField,'opacity'],[shadowField,'boxShadow']]){
      const group=field.locator('xpath=ancestor::section[1]'),title=group.locator(':scope > .inspector-group-title');
      if(await title.getAttribute('aria-expanded')==='false')await title.click();
      const reset=group.locator(`.property-reset[data-property-key="${key}"]`);
      assert.equal(await reset.count(),1,`${type}: tablet ${key} exposes inheritance reset`);
      await reset.click();
    }
    assert.deepEqual(await visual(canvas(id)),desktopPublic[id],`${type}: tablet reset restores desktop Canvas styles`);
  }
  await save(false);
  for(const {type,id} of editableNodes){
    assert.equal(stored(id,'tablet').opacity,undefined,`${type}: tablet reset Save removes opacity override`);
    assert.equal(stored(id,'tablet').boxShadow,undefined,`${type}: tablet reset Save removes shadow override`);
    assert.deepEqual(await visual(publicNode(id)),tabletPublic[id],`${type}: tablet reset Save preserves published output`);
  }
  await save(true);await viewer.reload();
  for(const {type,id} of editableNodes)assert.deepEqual(await visual(publicNode(id)),desktopPublic[id],`${type}: tablet reset Publish restores desktop styles`);
  await viewer.setViewportSize({width:widths.mobile,height:900});await viewer.reload();
  for(const {type,id} of editableNodes)assert.deepEqual(await visual(publicNode(id)),desktopPublic[id],`${type}: mobile inherits desktop after tablet reset`);
  assert.deepEqual(errors,[],'responsive visual-style lifecycle must not produce Editor page errors');
});
