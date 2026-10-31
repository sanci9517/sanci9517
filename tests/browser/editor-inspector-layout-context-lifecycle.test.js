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
import {LAYOUT_TYPES} from '../../public/editor-v2/core/layout-types.js';
import {plainTextToRichText} from '../../public/editor-v2/core/richtext-engine.js';

const publicDir=resolve(import.meta.dirname,'../../public');
const flexContainer={
  'flex.direction':'column','flex.justify':'space-between','flex.align':'center','flex.wrap':'wrap','flex.gap':'16px'
};
const gridContainer={
  'grid.columns':'repeat(2, minmax(0, 1fr))','grid.rows':'repeat(2, minmax(0, 1fr))','flex.gap':'12px',
  'grid.rowGap':'18px','grid.columnGap':'24px'
};
const flexItem={'flex.grow':'2','flex.shrink':'0.5','flex.basis':'42%','flex.alignSelf':'center'};
const gridItem={'grid.column':'2','grid.row':'2','flex.alignSelf':'flex-end'};
const containerKeys=['display','flexDirection','justifyContent','alignItems','flexWrap','gap','gridTemplateColumns','gridTemplateRows','rowGap','columnGap'];
const itemKeys=['flexGrow','flexShrink','flexBasis','alignSelf','gridColumnStart','gridRowStart'];

test('contextual Flex/Grid Inspector fields preserve responsive container and item layouts through Save and Publish',async t=>{
  const model=createEditorState(createDocument());
  const page=activePage(model),pageId=page.id,rootId=page.rootId;
  const nodes=[{type:NODE_TYPES.ROOT,id:rootId}],layouts=[];
  const authoredTypes=new Set(['heading','text','richtext','link','button']);
  for(let index=0;index<LAYOUT_TYPES.length;index++){
    const type=LAYOUT_TYPES[index];
    if(getElementCapability(type).status!=='PARTIAL')continue;
    execute(model,{type:'element.add',payload:{type,parentId:rootId,authored:authoredTypes.has(type)}});
    const containerId=model.selection.primaryId;
    execute(model,{type:'element.add',payload:{type:'text',parentId:containerId,authored:true}});
    const childId=model.selection.primaryId;
    execute(model,{type:'element.content.set',payload:{nodeId:childId,content:`${type} layout child`}});
    const desktopMode=index%2===0?'flex':'grid';
    layouts.push({type,containerId,childId,desktopMode,mobileMode:desktopMode==='flex'?'grid':'flex'});
    nodes.push({type,id:containerId},{type:'text',id:childId});
  }
  assert.equal(layouts.length,LAYOUT_TYPES.length,'every shared layout container type is exercised');
  let draft=structuredClone(model.document),published=structuredClone(draft),version=1;
  const editorErrors=[];
  const server=createServer(async(req,res)=>{
    const url=new URL(req.url,'http://localhost');
    const json=data=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(data))};
    if(url.pathname==='/api/admin/pages')return json({ok:true,data:url.searchParams.get('archived')==='1'?[]:[{id:pageId,slug:'inspector-layout-contexts',title:'Inspector layout context fixture',content:draft,revision:version,isPublished:false}]});
    if(url.pathname==='/api/admin/editor'){
      if(req.method==='GET')return json({ok:true,data:{page:{id:pageId,document:draft,publishedRevisionId:'published'},revisions:[{id:'revision-'+version,version}]}});
      let body='';for await(const chunk of req)body+=chunk;
      const request=JSON.parse(body);draft=structuredClone(request.document);version++;
      if(request.publish)published=structuredClone(draft);
      return json({ok:true,data:{pageId,version,revisionId:'revision-'+version,published:Boolean(request.publish)}});
    }
    if(url.pathname==='/api/public/pages')return json({ok:true,data:{id:pageId,slug:'inspector-layout-contexts',title:'Inspector layout context fixture',description:'',content:published.pages[pageId]}});
    if(url.pathname==='/api/public/navigation')return json({ok:true,data:{items:[]}});
    if(url.pathname==='/api/integrations/twitch/connection')return json({ok:true,data:{connected:false}});
    if(url.pathname.startsWith('/api/'))return json({ok:true,data:{siteName:'Inspector layout context test'}});
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
  await viewer.waitForFunction(count=>document.querySelectorAll('.visual-editor-node[data-node-id]').length>=count,layouts.length*2);
  const field=id=>inspector.locator(`[data-property-id="${id}"]`);
  const cssProps=(node,keys)=>node.evaluate((el,names)=>{const css=getComputedStyle(el);return Object.fromEntries(names.map(key=>{
    const value=css[key];
    // Canvas and published pages have different available widths; compare grid track count,
    // while the exact authored template value is asserted against the saved Page Model.
    return [key,['gridTemplateColumns','gridTemplateRows'].includes(key)?String(value).trim().split(/\s+/).length:value];
  }));},keys);
  const stored=(nodeId,device,key)=>draft.pages[pageId].nodes[nodeId].responsive?.[device]?.[key];
  const openField=async(id)=>{
    const control=field(id),group=control.locator('xpath=ancestor::section[1]'),title=group.locator(':scope > .inspector-group-title');
    if(await title.getAttribute('aria-expanded')==='false')await title.click();
    assert.equal(await control.getAttribute('data-property-command'),'responsive.set',`${id} command contract`);
    const expectedKey={
      'layout.display':'display','flex.direction':'flexDirection','flex.justify':'justifyContent','flex.align':'alignItems','flex.wrap':'flexWrap','flex.gap':'gap',
      'grid.columns':'gridTemplateColumns','grid.rows':'gridTemplateRows','grid.rowGap':'rowGap','grid.columnGap':'columnGap',
      'flex.grow':'flexGrow','flex.shrink':'flexShrink','flex.basis':'flexBasis','flex.alignSelf':'alignSelf','grid.column':'gridColumn','grid.row':'gridRow'
    }[id];
    assert.equal(await control.getAttribute('data-property-key'),expectedKey,`${id} Page Model key contract`);
    return control;
  };
  const setResponsiveValue=async(id,value)=>{
    const control=await openField(id);
    if(id==='flex.gap'||id==='grid.rowGap'||id==='grid.columnGap'||id==='flex.basis'){
      const match=String(value).match(/^(.+?)(px|%|rem|em)$/);
      assert.ok(match,`${id} test dimension has a supported unit`);
      await control.locator('.dimension-controls select:not(.property-token-picker)').selectOption(match[2]);
      const input=control.locator('.dimension-controls input[type="number"]');await input.fill(match[1]);await input.press('Tab');
    }else if(id==='flex.grow'||id==='flex.shrink'){
      const input=control.locator('input[type="number"]');await input.fill(String(value));await input.press('Tab');
    }else{
      const select=control.locator('select:not(.property-token-picker)');
      const options=await select.locator('option').evaluateAll(items=>items.map(item=>item.value));
      assert.ok(options.includes(String(value)),`${id} declares the selected option ${value}; actual options: ${options.join(', ')}`);
      await select.selectOption(String(value));
    }
  };
  const setContainer=async(layout,device)=>{
    await canvas(layout.containerId).evaluate(el=>el.click());await editor.locator('.inspector-tabs button').first().click();
    await setResponsiveValue('layout.display',layout[`${device}Mode`]);
    const values=layout[`${device}Mode`]==='flex'?flexContainer:gridContainer;
    for(const [id,value] of Object.entries(values))await setResponsiveValue(id,value);
  };
  const setItem=async(layout,device)=>{
    await canvas(layout.childId).evaluate(el=>el.click());await editor.locator('.inspector-tabs button').first().click();
    const values=layout[`${device}Mode`]==='flex'?flexItem:gridItem;
    for(const [id,value] of Object.entries(values))await setResponsiveValue(id,value);
  };
  const captureDevice=async(device)=>{
    const result={};
    for(const layout of layouts){
      result[layout.containerId]=await cssProps(canvas(layout.containerId),containerKeys);
      result[layout.childId]=await cssProps(canvas(layout.childId),itemKeys);
    }
    return result;
  };
  const assertPublicMatches=async(expected,label)=>{
    for(const layout of layouts){
      assert.deepEqual(await cssProps(publicNode(layout.containerId),containerKeys),expected[layout.containerId],`${layout.type}: ${label} public container CSS matches Canvas`);
      assert.deepEqual(await cssProps(publicNode(layout.childId),itemKeys),expected[layout.childId],`${layout.type}: ${label} public item CSS matches Canvas`);
    }
  };

  await editor.locator('.canvas-device-btn[data-device="desktop"]').click();
  for(const layout of layouts){await setContainer(layout,'desktop');await setItem(layout,'desktop');}
  const canvasDesktop=await captureDevice('desktop');
  await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  for(const layout of layouts){
    const container=draft.pages[pageId].nodes[layout.containerId],child=draft.pages[pageId].nodes[layout.childId];
    assert.equal(container.responsive.desktop.display,layout.desktopMode,`${layout.type}: desktop display Save`);
    const containerValues=layout.desktopMode==='flex'?flexContainer:gridContainer;
    const itemValues=layout.desktopMode==='flex'?flexItem:gridItem;
    for(const [id,value] of Object.entries(containerValues))assert.equal(container.responsive.desktop[({
      'flex.direction':'flexDirection','flex.justify':'justifyContent','flex.align':'alignItems','flex.wrap':'flexWrap','flex.gap':'gap',
      'grid.columns':'gridTemplateColumns','grid.rows':'gridTemplateRows','grid.rowGap':'rowGap','grid.columnGap':'columnGap'
    })[id]],value,`${layout.type}: desktop ${id} persists`);
    for(const [id,value] of Object.entries(itemValues))assert.equal(child.responsive.desktop[({
      'flex.grow':'flexGrow','flex.shrink':'flexShrink','flex.basis':'flexBasis','flex.alignSelf':'alignSelf','grid.column':'gridColumn','grid.row':'gridRow'
    })[id]],value,`${layout.type}: desktop child ${id} persists`);
    assert.equal(published.pages[pageId].nodes[layout.containerId].responsive?.desktop?.display,undefined,`${layout.type}: desktop Save does not publish display`);
  }
  await viewer.reload();
  for(const layout of layouts){
    assert.notDeepEqual(await cssProps(publicNode(layout.containerId),containerKeys),canvasDesktop[layout.containerId],`${layout.type}: draft Save does not change public container`);
  }
  await editor.reload({waitUntil:'domcontentloaded'});
  for(const layout of layouts){
    await canvas(layout.containerId).evaluate(el=>el.click());await editor.locator('.inspector-tabs button').first().click();
    const display=await openField('layout.display');assert.equal(await display.locator('select:not(.property-token-picker)').inputValue(),layout.desktopMode,`${layout.type}: desktop display reloads`);
    await canvas(layout.childId).evaluate(el=>el.click());await editor.locator('.inspector-tabs button').first().click();
    const itemId=layout.desktopMode==='flex'?'flex.basis':'grid.column';
    const itemField=await openField(itemId);
    if(itemId==='flex.basis')assert.equal(await itemField.locator('.dimension-controls input[type="number"]').inputValue(),'42',`${layout.type}: desktop flex item reloads`);
    else assert.equal(await itemField.locator('select:not(.property-token-picker)').inputValue(),'2',`${layout.type}: desktop grid item reloads`);
  }
  await editor.locator('#publish').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
  await viewer.reload();await assertPublicMatches(canvasDesktop,'desktop publish');
  for(const layout of layouts)for(const property of Object.keys(layout.desktopMode==='flex'?flexContainer:gridContainer)){
    const key=({'flex.direction':'flexDirection','flex.justify':'justifyContent','flex.align':'alignItems','flex.wrap':'flexWrap','flex.gap':'gap','grid.columns':'gridTemplateColumns','grid.rows':'gridTemplateRows','grid.rowGap':'rowGap','grid.columnGap':'columnGap'})[property];
    assert.equal(published.pages[pageId].nodes[layout.containerId].responsive.desktop[key],(layout.desktopMode==='flex'?flexContainer:gridContainer)[property],`${layout.type}: desktop Publish stores ${property}`);
  }

  await editor.locator('.canvas-device-btn[data-device="mobile"]').click();await viewer.setViewportSize({width:390,height:900});await viewer.reload();
  const publicMobileBaseline={};
  for(const layout of layouts){
    publicMobileBaseline[layout.containerId]=await cssProps(publicNode(layout.containerId),containerKeys);
    publicMobileBaseline[layout.childId]=await cssProps(publicNode(layout.childId),itemKeys);
  }
  for(const layout of layouts){await setContainer(layout,'mobile');await setItem(layout,'mobile');}
  const canvasMobile=await captureDevice('mobile');
  await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  for(const layout of layouts){
    const container=draft.pages[pageId].nodes[layout.containerId],child=draft.pages[pageId].nodes[layout.childId];
    assert.equal(container.responsive.mobile.display,layout.mobileMode,`${layout.type}: mobile display draft Save`);
    assert.equal(container.responsive.desktop.display,layout.desktopMode,`${layout.type}: mobile Save preserves desktop mode`);
    assert.equal(published.pages[pageId].nodes[layout.containerId].responsive.mobile?.display,undefined,`${layout.type}: mobile Save does not publish display`);
    const itemKey=layout.mobileMode==='flex'?'flexBasis':'gridColumn';
    assert.equal(child.responsive.mobile[itemKey],layout.mobileMode==='flex'?'42%':'2',`${layout.type}: mobile child mode-specific field saves`);
    assert.equal(child.responsive.desktop[layout.desktopMode==='flex'?'flexBasis':'gridColumn'],layout.desktopMode==='flex'?'42%':'2',`${layout.type}: mobile Save preserves desktop child placement`);
  }
  await viewer.reload();
  for(const layout of layouts){
    assert.deepEqual(await cssProps(publicNode(layout.containerId),containerKeys),publicMobileBaseline[layout.containerId],`${layout.type}: mobile draft Save leaves public container unchanged`);
    assert.deepEqual(await cssProps(publicNode(layout.childId),itemKeys),publicMobileBaseline[layout.childId],`${layout.type}: mobile draft Save leaves public child unchanged`);
  }
  await editor.reload({waitUntil:'domcontentloaded'});await editor.locator('.canvas-device-btn[data-device="mobile"]').click();
  for(const layout of layouts){
    await canvas(layout.containerId).evaluate(el=>el.click());await editor.locator('.inspector-tabs button').first().click();
    const containerProperty=layout.mobileMode==='flex'?'flex.direction':'grid.columns';
    const containerField=await openField(containerProperty);
    assert.equal(await containerField.locator('select:not(.property-token-picker)').inputValue(),(layout.mobileMode==='flex'?flexContainer:gridContainer)[containerProperty],`${layout.type}: mobile container mode-specific value reloads`);
    await canvas(layout.childId).evaluate(el=>el.click());await editor.locator('.inspector-tabs button').first().click();
    const childProperty=layout.mobileMode==='flex'?'flex.basis':'grid.column';
    const childField=await openField(childProperty);
    if(childProperty==='flex.basis')assert.equal(await childField.locator('.dimension-controls input[type="number"]').inputValue(),'42',`${layout.type}: mobile flex child reloads`);
    else assert.equal(await childField.locator('select:not(.property-token-picker)').inputValue(),'2',`${layout.type}: mobile grid child reloads`);
  }
  await editor.locator('#publish').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
  await viewer.reload();await assertPublicMatches(canvasMobile,'mobile publish');
  await viewer.setViewportSize({width:1366,height:900});await viewer.reload();await assertPublicMatches(canvasDesktop,'mobile publish preserves desktop layout');

  await viewer.setViewportSize({width:390,height:900});await viewer.reload();
  for(const layout of layouts){
    const resetContainerValues=Object.keys(layout.mobileMode==='flex'?flexContainer:gridContainer);
    await canvas(layout.containerId).evaluate(el=>el.click());await editor.locator('.inspector-tabs button').first().click();
    for(const id of resetContainerValues){
      const control=await openField(id),key=await control.getAttribute('data-property-key');
      const reset=inspector.locator(`.property-reset[data-property-key="${key}"]`);
      assert.equal(await reset.count(),1,`${layout.type}: mobile ${id} exposes inheritance reset`);await reset.click();
    }
    const resetItemValues=Object.keys(layout.mobileMode==='flex'?flexItem:gridItem);
    await canvas(layout.childId).evaluate(el=>el.click());await editor.locator('.inspector-tabs button').first().click();
    for(const id of resetItemValues){
      const control=await openField(id),key=await control.getAttribute('data-property-key');
      const reset=inspector.locator(`.property-reset[data-property-key="${key}"]`);
      assert.equal(await reset.count(),1,`${layout.type}: mobile child ${id} exposes inheritance reset`);await reset.click();
    }
    if(layout===layouts.at(-1)){
      assert.equal(await canvas(layout.childId).evaluate(el=>getComputedStyle(el).alignSelf),'flex-end','mobile reset inherits the desktop item alignment');
      await editor.locator('#undo').click();
      assert.equal(await canvas(layout.childId).evaluate(el=>getComputedStyle(el).alignSelf),'center','Undo restores the final responsive item alignment');
      await editor.locator('#redo').click();
      assert.equal(await canvas(layout.childId).evaluate(el=>getComputedStyle(el).alignSelf),'flex-end','Redo restores inherited item alignment');
    }
    await canvas(layout.containerId).evaluate(el=>el.click());await editor.locator('.inspector-tabs button').first().click();
    const display=await openField('layout.display'),displayReset=inspector.locator('.property-reset[data-property-key="display"]');
    assert.equal(await displayReset.count(),1,`${layout.type}: mobile display exposes inheritance reset`);await displayReset.click();
  }
  await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  for(const layout of layouts){
    const node=draft.pages[pageId].nodes[layout.containerId],child=draft.pages[pageId].nodes[layout.childId];
    for(const id of Object.keys(layout.mobileMode==='flex'?flexContainer:gridContainer)){
      const key=({'layout.display':'display','flex.direction':'flexDirection','flex.justify':'justifyContent','flex.align':'alignItems','flex.wrap':'flexWrap','flex.gap':'gap','grid.columns':'gridTemplateColumns','grid.rows':'gridTemplateRows','grid.rowGap':'rowGap','grid.columnGap':'columnGap'})[id];
      assert.equal(node.responsive.mobile[key],undefined,`${layout.type}: reset Save removes mobile ${id}`);
    }
    for(const id of Object.keys(layout.mobileMode==='flex'?flexItem:gridItem)){
      const key=({'flex.grow':'flexGrow','flex.shrink':'flexShrink','flex.basis':'flexBasis','flex.alignSelf':'alignSelf','grid.column':'gridColumn','grid.row':'gridRow'})[id];
      assert.equal(child.responsive.mobile[key],undefined,`${layout.type}: child reset Save removes mobile ${id}`);
    }
    assert.equal(published.pages[pageId].nodes[layout.containerId].responsive.mobile.display,layout.mobileMode,`${layout.type}: reset Save preserves published mobile layout`);
  }
  await viewer.reload();await assertPublicMatches(canvasMobile,'reset Save leaves public mobile layout unchanged');
  await editor.locator('#publish').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
  await viewer.reload();await assertPublicMatches(canvasDesktop,'reset Publish restores inherited desktop layout');
  assert.deepEqual(editorErrors,[],'all layout-context Inspector transitions remain error-free');
});
