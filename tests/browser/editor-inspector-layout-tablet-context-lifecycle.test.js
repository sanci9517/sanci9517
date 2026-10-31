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

const publicDir=resolve(import.meta.dirname,'../../public');
const flexContainer={
  'flex.direction':'column','flex.justify':'center','flex.align':'flex-end','flex.wrap':'wrap','flex.gap':'14px'
};
const gridContainer={
  'grid.columns':'repeat(3, minmax(0, 1fr))','grid.rows':'repeat(2, minmax(0, 1fr))',
  'flex.gap':'12px','grid.rowGap':'18px','grid.columnGap':'24px'
};
const flexItem={'flex.grow':'2','flex.shrink':'0.5','flex.basis':'42%','flex.alignSelf':'center'};
const gridItem={'grid.column':'2','grid.row':'2','flex.alignSelf':'flex-end'};
const containerCss=['display','flexDirection','justifyContent','alignItems','flexWrap','gap','gridTemplateColumns','gridTemplateRows','rowGap','columnGap'];
const itemCss=['flexGrow','flexShrink','flexBasis','alignSelf','gridColumnStart','gridRowStart'];
const styleFor=(mode)=>mode==='flex'
  ?{display:'flex',flexDirection:'row',justifyContent:'flex-start',alignItems:'stretch',flexWrap:'nowrap',gap:'8px'}
  :{display:'grid',gridTemplateColumns:'repeat(2, minmax(0, 1fr))',gridTemplateRows:'auto',gap:'8px'};

 test('tablet Flex/Grid Inspector contexts preserve all shared layout types through Save, Publish and reset',async t=>{
  const model=createEditorState(createDocument()),page=activePage(model),pageId=page.id,rootId=page.rootId;
  const layouts=[];
  const authoredTypes=new Set(['heading','text','richtext','link','button']);
  for(let index=0;index<LAYOUT_TYPES.length;index++){
    const type=LAYOUT_TYPES[index];
    assert.equal(getElementCapability(type).status,'PARTIAL',`${type}: shared layout type remains editable`);
    execute(model,{type:'element.add',payload:{type,parentId:rootId,authored:authoredTypes.has(type)}});
    const containerId=model.selection.primaryId,desktopMode=index%2===0?'flex':'grid';
    execute(model,{type:'style.set',payload:{nodeId:containerId,patch:styleFor(desktopMode)}});
    execute(model,{type:'element.add',payload:{type:NODE_TYPES.TEXT,parentId:containerId,authored:true}});
    const childId=model.selection.primaryId;
    execute(model,{type:'element.content.set',payload:{nodeId:childId,content:`${type} tablet child`}});
    layouts.push({type,containerId,childId,desktopMode,tabletMode:desktopMode==='flex'?'grid':'flex'});
  }
  assert.equal(layouts.length,LAYOUT_TYPES.length,'every shared layout type is included');
  let draft=structuredClone(model.document),published=structuredClone(draft),version=1;
  const errors=[],server=createServer(async(req,res)=>{
    const url=new URL(req.url,'http://localhost');
    const json=value=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(value))};
    if(url.pathname==='/api/admin/pages')return json({ok:true,data:url.searchParams.get('archived')==='1'?[]:[{id:pageId,slug:'layout-tablet-contexts',title:'Tablet layout contexts',content:draft,revision:version,isPublished:false}]});
    if(url.pathname==='/api/admin/editor'){
      if(req.method==='GET')return json({ok:true,data:{page:{id:pageId,document:draft,publishedRevisionId:'published'},revisions:[{id:'revision-'+version,version}]}});
      let body='';for await(const chunk of req)body+=chunk;
      const request=JSON.parse(body);draft=structuredClone(request.document);version++;
      if(request.publish)published=structuredClone(draft);
      return json({ok:true,data:{pageId,version,revisionId:'revision-'+version,published:Boolean(request.publish)}});
    }
    if(url.pathname==='/api/public/pages')return json({ok:true,data:{id:pageId,slug:'layout-tablet-contexts',title:'Tablet layout contexts',description:'',content:published.pages[pageId]}});
    if(url.pathname==='/api/public/navigation')return json({ok:true,data:{items:[]}});
    if(url.pathname==='/api/integrations/twitch/connection')return json({ok:true,data:{connected:false}});
    if(url.pathname.startsWith('/api/'))return json({ok:true,data:{siteName:'Tablet layout test'}});
    const file=resolve(publicDir,'.'+(url.pathname==='/p/test'?'/visual-page.html':url.pathname));
    if(!file.startsWith(publicDir+'/'))return res.writeHead(403).end();
    try{res.setHeader('content-type',{'.html':'text/html','.js':'text/javascript','.css':'text/css'}[extname(file)]||'application/octet-stream');res.end(await readFile(file))}
    catch{res.writeHead(404).end()}
  });
  await new Promise(done=>server.listen(0,'127.0.0.1',done));
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
  t.after(async()=>{await browser.close();await new Promise(done=>server.close(done))});
  const editor=await browser.newPage({viewport:{width:1366,height:900}}),viewer=await browser.newPage({viewport:{width:1366,height:900}});
  editor.setDefaultTimeout(30000);viewer.setDefaultTimeout(30000);editor.on('pageerror',error=>errors.push(error.message));
  await editor.goto(`http://127.0.0.1:${server.address().port}/editor-v2/index.html`);
  await viewer.goto(`http://127.0.0.1:${server.address().port}/p/test`);
  if(await editor.locator('#rightDock').evaluate(el=>el.classList.contains('closed')))await editor.locator('#openInspector').click();
  const inspector=editor.locator('#inspectorBody');
  const canvas=id=>editor.locator(`.node[data-node-id="${id}"]`),publicNode=id=>viewer.locator(`.visual-editor-node[data-node-id="${id}"]`);
  await viewer.waitForFunction(count=>document.querySelectorAll('.visual-editor-node[data-node-id]').length>=count,layouts.length*2);
  const groupId=id=>({
    'layout.display':'display','flex.direction':'flexDirection','flex.justify':'justifyContent','flex.align':'alignItems','flex.wrap':'flexWrap','flex.gap':'gap',
    'grid.columns':'gridTemplateColumns','grid.rows':'gridTemplateRows','grid.rowGap':'rowGap','grid.columnGap':'columnGap',
    'flex.grow':'flexGrow','flex.shrink':'flexShrink','flex.basis':'flexBasis','flex.alignSelf':'alignSelf','grid.column':'gridColumn','grid.row':'gridRow'
  })[id];
  const field=id=>inspector.locator(`[data-property-id="${id}"]`);
  const openField=async id=>{
    const control=field(id),group=control.locator('xpath=ancestor::section[1]'),title=group.locator(':scope > .inspector-group-title');
    if(await title.getAttribute('aria-expanded')==='false')await title.click();
    assert.equal(await control.getAttribute('data-property-command'),'responsive.set',`${id}: responsive Inspector command`);
    assert.equal(await control.getAttribute('data-property-key'),groupId(id),`${id}: Page Model key`);
    return control;
  };
  const setValue=async(id,value)=>{
    const control=await openField(id);
    if(['flex.gap','grid.rowGap','grid.columnGap','flex.basis'].includes(id)){
      const match=String(value).match(/^(.+?)(px|%)$/);assert.ok(match,`${id}: supported tablet dimension`);
      await control.locator('.dimension-controls select:not(.property-token-picker)').selectOption(match[2]);
      const input=control.locator('.dimension-controls input[type="number"]');await input.fill(match[1]);await input.press('Tab');
    }else if(id==='flex.grow'||id==='flex.shrink'){
      const input=control.locator('input[type="number"]');await input.fill(String(value));await input.press('Tab');
    }else await control.locator('select:not(.property-token-picker)').selectOption(String(value));
  };
  const activate=async device=>{
    const button=editor.locator(`.canvas-device-btn[data-device="${device}"]`);
    if(!await button.evaluate(el=>el.classList.contains('active')))await button.click();
    await viewer.setViewportSize({width:{desktop:1366,tablet:768,mobile:390}[device],height:900});
  };
  const readCss=(node,keys)=>node.evaluate((el,names)=>{
    const css=getComputedStyle(el);
    return Object.fromEntries(names.map(key=>{
      const value=css[key];
      // The Canvas and public page have different available widths: assert fr track count here,
      // and exact authored template values independently from the Page Model below.
      return [key,['gridTemplateColumns','gridTemplateRows'].includes(key)?String(value).trim().split(/\s+/).length:value];
    }));
  },keys);
  const snapshot=async()=>{
    const result={};
    for(const layout of layouts){
      result[layout.containerId]=await readCss(canvas(layout.containerId),containerCss);
      result[layout.childId]=await readCss(canvas(layout.childId),itemCss);
    }
    return result;
  };
  const assertPublicMatches=async(expected,label)=>{
    for(const layout of layouts){
      assert.deepEqual(await readCss(publicNode(layout.containerId),containerCss),expected[layout.containerId],`${layout.type}: ${label} public container matches Canvas`);
      assert.deepEqual(await readCss(publicNode(layout.childId),itemCss),expected[layout.childId],`${layout.type}: ${label} public child matches Canvas`);
    }
  };
  const desktopBaseline=await snapshot();
  const tabletContainerBaseline={};
  await activate('tablet');
  await viewer.reload();
  for(const layout of layouts){
    tabletContainerBaseline[layout.containerId]=await readCss(publicNode(layout.containerId),containerCss);
    await canvas(layout.containerId).evaluate(el=>el.click());await editor.locator('.inspector-tabs button').first().click();
    await setValue('layout.display',layout.tabletMode);
    const values=layout.tabletMode==='flex'?flexContainer:gridContainer;
    for(const [id,value] of Object.entries(values))await setValue(id,value);
    await canvas(layout.childId).evaluate(el=>el.click());await editor.locator('.inspector-tabs button').first().click();
    const itemValues=layout.tabletMode==='flex'?flexItem:gridItem;
    for(const [id,value] of Object.entries(itemValues))await setValue(id,value);
  }
  const tabletCanvas=await snapshot();
  await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  for(const layout of layouts){
    const container=draft.pages[pageId].nodes[layout.containerId],child=draft.pages[pageId].nodes[layout.childId];
    assert.equal(container.responsive.tablet.display,layout.tabletMode,`${layout.type}: tablet display draft Save`);
    assert.equal(container.style.display,layout.desktopMode,`${layout.type}: tablet Save preserves desktop base display`);
    for(const [id,value] of Object.entries(layout.tabletMode==='flex'?flexContainer:gridContainer))assert.equal(container.responsive.tablet[groupId(id)],value,`${layout.type}: tablet ${id} Save`);
    for(const [id,value] of Object.entries(layout.tabletMode==='flex'?flexItem:gridItem))assert.equal(child.responsive.tablet[groupId(id)],value,`${layout.type}: tablet child ${id} Save`);
    assert.equal(published.pages[pageId].nodes[layout.containerId].responsive?.tablet?.display,undefined,`${layout.type}: tablet Save does not Publish`);
    assert.deepEqual(await readCss(publicNode(layout.containerId),containerCss),tabletContainerBaseline[layout.containerId],`${layout.type}: tablet draft Save leaves public CSS unchanged`);
  }
  await editor.reload({waitUntil:'domcontentloaded'});await activate('tablet');
  for(const layout of layouts){
    await canvas(layout.containerId).evaluate(el=>el.click());await editor.locator('.inspector-tabs button').first().click();
    const fieldId=layout.tabletMode==='flex'?'flex.direction':'grid.columns',containerField=await openField(fieldId);
    assert.equal(await containerField.locator('select:not(.property-token-picker)').inputValue(),(layout.tabletMode==='flex'?flexContainer:gridContainer)[fieldId],`${layout.type}: tablet Inspector reload`);
    await canvas(layout.childId).evaluate(el=>el.click());await editor.locator('.inspector-tabs button').first().click();
    const itemFieldId=layout.tabletMode==='flex'?'flex.basis':'grid.column',itemField=await openField(itemFieldId);
    if(itemFieldId==='flex.basis')assert.equal(await itemField.locator('.dimension-controls input[type="number"]').inputValue(),'42',`${layout.type}: tablet Flex child reload`);
    else assert.equal(await itemField.locator('select:not(.property-token-picker)').inputValue(),'2',`${layout.type}: tablet Grid child reload`);
  }
  await editor.locator('#publish').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
  await viewer.reload();await assertPublicMatches(tabletCanvas,'tablet Publish');
  await activate('desktop');await viewer.reload();await assertPublicMatches(desktopBaseline,'tablet Publish preserves desktop');
  await activate('mobile');await viewer.reload();await assertPublicMatches(tabletCanvas,'tablet Publish is inherited by mobile without a mobile override');

  await activate('tablet');await viewer.reload();
  const resetContainerKeys=layout=>Object.keys(layout.tabletMode==='flex'?flexContainer:gridContainer);
  const resetItemKeys=layout=>Object.keys(layout.tabletMode==='flex'?flexItem:gridItem);
  for(const layout of layouts){
    await canvas(layout.containerId).evaluate(el=>el.click());await editor.locator('.inspector-tabs button').first().click();
    for(const id of resetContainerKeys(layout)){
      const control=await openField(id),key=await control.getAttribute('data-property-key'),reset=inspector.locator(`.property-reset[data-property-key="${key}"]`);
      assert.equal(await reset.count(),1,`${layout.type}: tablet ${id} has a scoped inheritance reset`);await reset.click();
    }
    await canvas(layout.childId).evaluate(el=>el.click());await editor.locator('.inspector-tabs button').first().click();
    for(const id of resetItemKeys(layout)){
      const control=await openField(id),key=await control.getAttribute('data-property-key'),reset=inspector.locator(`.property-reset[data-property-key="${key}"]`);
      assert.equal(await reset.count(),1,`${layout.type}: tablet child ${id} has a scoped inheritance reset`);
      if(layout===layouts.at(-1)&&id==='flex.alignSelf'){
        await reset.click();
        assert.equal(await canvas(layout.childId).evaluate(el=>getComputedStyle(el).alignSelf),'auto','tablet item reset inherits the desktop alignment');
        await editor.locator('#undo').click();
        assert.equal(await canvas(layout.childId).evaluate(el=>getComputedStyle(el).alignSelf),'center','Undo restores the final tablet item alignment');
        await editor.locator('#redo').click();
        assert.equal(await canvas(layout.childId).evaluate(el=>getComputedStyle(el).alignSelf),'auto','Redo restores inherited item alignment');
      }else await reset.click();
    }
    await canvas(layout.containerId).evaluate(el=>el.click());await editor.locator('.inspector-tabs button').first().click();
    const display=await openField('layout.display'),key=await display.getAttribute('data-property-key'),reset=inspector.locator(`.property-reset[data-property-key="${key}"]`);
    assert.equal(await reset.count(),1,`${layout.type}: tablet display has a scoped inheritance reset`);await reset.click();
  }
  const resetTabletCanvas=await snapshot();
  for(const layout of layouts)assert.equal(resetTabletCanvas[layout.containerId].display,desktopBaseline[layout.containerId].display,`${layout.type}: resetting tablet display inherits desktop mode`);
  await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  for(const layout of layouts){
    const container=draft.pages[pageId].nodes[layout.containerId],child=draft.pages[pageId].nodes[layout.childId];
    for(const id of [...resetContainerKeys(layout),'layout.display'])assert.equal(container.responsive.tablet[groupId(id)],undefined,`${layout.type}: reset Save removes tablet ${id}`);
    for(const id of resetItemKeys(layout))assert.equal(child.responsive.tablet[groupId(id)],undefined,`${layout.type}: reset Save removes tablet child ${id}`);
    assert.equal(published.pages[pageId].nodes[layout.containerId].responsive.tablet.display,layout.tabletMode,`${layout.type}: reset Save leaves published tablet mode intact`);
  }
  await viewer.reload();await assertPublicMatches(tabletCanvas,'tablet reset Save leaves published output unchanged');
  await editor.locator('#publish').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
  await viewer.reload();await assertPublicMatches(desktopBaseline,'tablet reset Publish restores inherited desktop layout');
  await activate('mobile');await viewer.reload();await assertPublicMatches(desktopBaseline,'tablet reset Publish removes tablet fallback from mobile');
  assert.deepEqual(errors,[],'all 18 tablet layout contexts remain free of uncaught browser errors');
});
