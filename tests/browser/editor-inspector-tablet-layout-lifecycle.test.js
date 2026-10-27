import assert from 'node:assert/strict';
import test from 'node:test';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve,extname} from 'node:path';
import {chromium} from 'playwright';
import {createDocument} from '../../public/editor-v2/core/schema.js';
import {createEditorState} from '../../public/editor-v2/core/state.js';
import {execute} from '../../public/editor-v2/core/commands.js';

test('tablet Flex and Grid child Inspector values save, reload and publish independently',async t=>{
  const model=createEditorState(createDocument()),pageId=model.document.activePageId;
  const rootId=model.document.pages[pageId].rootId;
  execute(model,{type:'element.add',payload:{type:'grid',parentId:rootId}});
  const gridId=model.selection.primaryId;
  execute(model,{type:'style.set',payload:{nodeId:gridId,patch:{display:'grid',gridTemplateColumns:'repeat(2, minmax(0, 1fr))',gridTemplateRows:'repeat(2, minmax(0, 100px))'}}});
  execute(model,{type:'element.add',payload:{type:'text',parentId:gridId,props:{text:'Tablet Grid child'}}});
  const gridChildId=model.selection.primaryId;
  execute(model,{type:'element.add',payload:{type:'flex',parentId:rootId}});
  const flexId=model.selection.primaryId;
  execute(model,{type:'style.set',payload:{nodeId:flexId,patch:{display:'flex',flexDirection:'row'}}});
  execute(model,{type:'element.add',payload:{type:'text',parentId:flexId,props:{text:'Tablet Flex child'}}});
  const flexChildId=model.selection.primaryId;
  let draft=structuredClone(model.document),published=structuredClone(draft),revision=1;
  const posts=[],errors=[],root=resolve(import.meta.dirname,'../../public');
  const server=createServer(async(req,res)=>{
    const url=new URL(req.url,'http://localhost');
    const json=data=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(data))};
    if(url.pathname==='/api/admin/pages')return json({ok:true,data:[{id:pageId,slug:'test',title:'Test',content:draft,revision,isPublished:true}]});
    if(url.pathname==='/api/admin/editor'){
      if(req.method==='GET')return json({ok:true,data:{page:{id:pageId,document:draft,publishedRevisionId:'published'},revisions:[{id:'revision-'+revision,version:revision}]}});
      let body='';for await(const chunk of req)body+=chunk;
      const request=JSON.parse(body);posts.push(request);draft=structuredClone(request.document);revision++;
      if(request.publish)published=structuredClone(draft);
      return json({ok:true,data:{pageId,version:revision,revisionId:'revision-'+revision}});
    }
    if(url.pathname==='/api/public/pages')return json({ok:true,data:{id:pageId,slug:'test',title:'Test',content:published.pages[pageId]}});
    if(url.pathname==='/api/public/navigation')return json({ok:true,data:{items:[]}});
    if(url.pathname==='/api/integrations/twitch/connection')return json({ok:true,data:{connected:false}});
    if(url.pathname.startsWith('/api/'))return json({ok:true,data:{siteName:'Test'}});
    const asset=url.pathname==='/p/test'?'/visual-page.html':url.pathname,file=resolve(root,'.'+asset);
    if(!file.startsWith(root+'/'))return res.writeHead(403).end();
    try{res.setHeader('content-type',{'.html':'text/html','.js':'text/javascript','.css':'text/css'}[extname(file)]||'application/octet-stream');res.end(await readFile(file))}
    catch{res.writeHead(404).end()}
  });
  await new Promise(done=>server.listen(0,'127.0.0.1',done));
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
  t.after(async()=>{await browser.close();await new Promise(done=>server.close(done))});
  const base=`http://127.0.0.1:${server.address().port}`;
  const editor=await browser.newPage({viewport:{width:1366,height:900}}),publicPage=await browser.newPage({viewport:{width:1366,height:900}});
  for(const page of [editor,publicPage]){page.setDefaultTimeout(10000);page.setDefaultNavigationTimeout(15000);page.on('pageerror',error=>errors.push(error.message))}
  const canvas=id=>editor.locator(`.node[data-node-id="${id}"]`),live=id=>publicPage.locator(`[data-node-id="${id}"]`);
  const css=(page,id,key)=>page===editor?canvas(id).evaluate((el,property)=>getComputedStyle(el)[property],key):live(id).evaluate((el,property)=>getComputedStyle(el)[property],key);
  const select=async id=>{await canvas(id).evaluate(el=>el.click());if(await editor.locator('#rightDock').evaluate(el=>el.classList.contains('closed')))await editor.locator('#openInspector').click()};
  const activate=async device=>{
    const button=editor.locator(`.canvas-device-btn[data-device="${device}"]`);
    if(!await button.evaluate(el=>el.classList.contains('active')))await button.click();
    const width={desktop:1366,tablet:768,mobile:390}[device];await publicPage.setViewportSize({width,height:900});
    await publicPage.waitForFunction(({width,ids})=>window.innerWidth===width&&ids.every(id=>document.querySelector(`[data-node-id="${id}"]`)),{width,ids:[flexChildId,gridChildId]});
  };
  const openField=async(propertyId,group,nodeId)=>{
    await select(nodeId);await editor.locator('.inspector-tabs button').first().click();
    const control=editor.locator(`[data-property-id="${propertyId}"]`);
    const groupSection=control.locator('xpath=ancestor::section[contains(@class,"inspector-group")]');
    assert.equal(await groupSection.count(),1,`${propertyId}: Inspector control belongs to a rendered group`);
    const heading=groupSection.locator('.inspector-group-title');if(await heading.getAttribute('aria-expanded')==='false')await heading.click();
    return control;
  };
  const properties=[
    {id:'flex.basis',key:'flexBasis',group:'Flex',node:flexChildId,css:'flexBasis',value:'42%',edit:async field=>{await field.locator('.dimension-controls select:not(.property-token-picker)').selectOption('%');const input=field.locator('.dimension-controls input[type="number"]');await input.fill('42');await input.press('Tab')},verify:async field=>{assert.equal(await field.locator('.dimension-controls input[type="number"]').inputValue(),'42');assert.equal(await field.locator('.dimension-controls select:not(.property-token-picker)').inputValue(),'%')}},
    {id:'flex.grow',key:'flexGrow',group:'Flex',node:flexChildId,css:'flexGrow',value:'2.5',edit:async field=>{const input=field.locator('input[type="number"]');await input.fill('2.5');await input.press('Tab')},verify:async field=>assert.equal(await field.locator('input[type="number"]').inputValue(),'2.5')},
    {id:'flex.shrink',key:'flexShrink',group:'Flex',node:flexChildId,css:'flexShrink',value:'0.5',edit:async field=>{const input=field.locator('input[type="number"]');await input.fill('0.5');await input.press('Tab')},verify:async field=>assert.equal(await field.locator('input[type="number"]').inputValue(),'0.5')},
    {id:'grid.row',key:'gridRow',group:'Grid-gyermek',node:gridChildId,css:'gridRowStart',value:'3',edit:field=>field.locator('select:not(.property-token-picker)').selectOption('3'),verify:async field=>assert.equal(await field.locator('select:not(.property-token-picker)').inputValue(),'3')},
    {id:'grid.column',key:'gridColumn',group:'Grid-gyermek',node:gridChildId,css:'gridColumnStart',value:'2',edit:field=>field.locator('select:not(.property-token-picker)').selectOption('2'),verify:async field=>assert.equal(await field.locator('select:not(.property-token-picker)').inputValue(),'2')}
  ];
  await editor.goto(base+'/editor-v2/index.html');
  await select(flexChildId);await publicPage.goto(base+'/p/test');
  const desktopBaseline=Object.fromEntries(await Promise.all(properties.map(async property=>[property.id,{canvas:await css(editor,property.node,property.css),public:await css(publicPage,property.node,property.css)}])));
  await activate('tablet');
  const tabletPublishedBaseline=Object.fromEntries(await Promise.all(properties.map(async property=>[property.id,await css(publicPage,property.node,property.css)])));
  for(const property of properties){
    const field=await openField(property.id,property.group,property.node);
    assert.equal(await field.getAttribute('data-property-command'),'responsive.set',`${property.id}: tablet command route`);
    assert.equal(await field.getAttribute('data-property-key'),property.key,`${property.id}: tablet Page Model key`);
    await property.edit(field);
    assert.equal(await css(editor,property.node,property.css),property.value,`${property.id}: edit reaches tablet Canvas CSS`);
    assert.equal(await css(publicPage,property.node,property.css),tabletPublishedBaseline[property.id],`${property.id}: edit remains unpublished`);
  }
  await editor.locator('#undo').click();assert.equal(await css(editor,gridChildId,'gridColumnStart'),tabletPublishedBaseline['grid.column'],'Undo restores the inherited Grid column');
  await editor.locator('#redo').click();assert.equal(await css(editor,gridChildId,'gridColumnStart'),'2','Redo restores the tablet Grid column');
  await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.startsWith('Mentve'));
  assert.equal(posts.at(-1).publish,false,'tablet child layout Save remains draft-only');
  for(const property of properties)assert.equal(posts.at(-1).document.pages[pageId].nodes[property.node].responsive.tablet[property.key],property.value,`${property.id}: tablet value is stored in Page Model`);
  await editor.reload({waitUntil:'domcontentloaded'});await activate('tablet');
  for(const property of properties){const field=await openField(property.id,property.group,property.node);await property.verify(field);assert.equal(await css(editor,property.node,property.css),property.value,`${property.id}: tablet value survives Editor reload`)}
  await publicPage.reload({waitUntil:'domcontentloaded'});
  for(const property of properties)assert.equal(await css(publicPage,property.node,property.css),tabletPublishedBaseline[property.id],`${property.id}: draft Save leaves public tablet layout unchanged`);
  await editor.locator('#publish').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent==='Publikálva');
  assert.equal(posts.at(-1).publish,true,'tablet child layout requires explicit Publish');
  await publicPage.reload({waitUntil:'domcontentloaded'});
  for(const property of properties)assert.equal(await css(publicPage,property.node,property.css),property.value,`${property.id}: explicit Publish updates public tablet layout`);
  await activate('desktop');await publicPage.reload({waitUntil:'domcontentloaded'});
  for(const property of properties){
    assert.equal(await css(editor,property.node,property.css),desktopBaseline[property.id].canvas,`${property.id}: tablet override preserves desktop Canvas layout`);
    assert.equal(await css(publicPage,property.node,property.css),desktopBaseline[property.id].public,`${property.id}: tablet Publish preserves desktop public layout`);
  }
  assert.deepEqual(errors,[]);
});
