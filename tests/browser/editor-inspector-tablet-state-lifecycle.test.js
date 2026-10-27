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

test('tablet hover Inspector state saves, publishes, resets, and inherits independently',async t=>{
  const model=createEditorState(createDocument()),pageId=model.document.activePageId;
  const rootId=model.document.pages[pageId].rootId;
  execute(model,{type:'element.add',payload:{type:'text',parentId:rootId,props:{text:'Tablet interactive state fixture'}}});
  const nodeId=model.selection.primaryId;
  execute(model,{type:'style.set',payload:{nodeId,patch:{backgroundColor:'#e2e8f0'}}});
  execute(model,{type:'states.set',payload:{nodeId,state:'hover',device:'desktop',patch:{backgroundColor:'#16a34a'}}});
  let draft=structuredClone(model.document),published=structuredClone(draft),revision=1;
  const posts=[],errors=[],publicDir=resolve(import.meta.dirname,'../../public');
  const server=createServer(async(req,res)=>{
    const url=new URL(req.url,'http://localhost');
    const json=data=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(data))};
    if(url.pathname==='/api/admin/pages')return json({ok:true,data:[{id:pageId,slug:'tablet-hover',title:'Tablet hover',content:draft,revision,isPublished:true}]});
    if(url.pathname==='/api/admin/editor'){
      if(req.method==='GET')return json({ok:true,data:{page:{id:pageId,document:draft,publishedRevisionId:'published'},revisions:[{id:'revision-'+revision,version:revision}]}});
      let body='';for await(const chunk of req)body+=chunk;
      const request=JSON.parse(body);posts.push(request);draft=structuredClone(request.document);revision++;
      if(request.publish)published=structuredClone(draft);
      return json({ok:true,data:{pageId,version:revision,revisionId:'revision-'+revision}});
    }
    if(url.pathname==='/api/public/pages')return json({ok:true,data:{id:pageId,slug:'tablet-hover',title:'Tablet hover',description:'',content:published.pages[pageId]}});
    if(url.pathname==='/api/public/navigation')return json({ok:true,data:{items:[]}});
    if(url.pathname==='/api/integrations/twitch/connection')return json({ok:true,data:{connected:false}});
    if(url.pathname.startsWith('/api/'))return json({ok:true,data:{siteName:'Test'}});
    const route=url.pathname==='/p/test'?'/visual-page.html':url.pathname,file=resolve(publicDir,'.'+route);
    if(!file.startsWith(publicDir+'/'))return res.writeHead(403).end();
    try{res.setHeader('content-type',{'.html':'text/html','.js':'text/javascript','.css':'text/css'}[extname(file)]||'application/octet-stream');res.end(await readFile(file))}
    catch{res.writeHead(404).end()}
  });
  await new Promise(done=>server.listen(0,'127.0.0.1',done));
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
  t.after(async()=>{await browser.close();await new Promise(done=>server.close(done))});
  const base=`http://127.0.0.1:${server.address().port}`;
  const editor=await browser.newPage({viewport:{width:1366,height:900}}),viewer=await browser.newPage({viewport:{width:1366,height:900}});
  for(const page of [editor,viewer]){page.setDefaultTimeout(10000);page.setDefaultNavigationTimeout(15000);page.on('pageerror',error=>errors.push(error.message))}
  const canvas=()=>editor.locator(`.node[data-node-id="${nodeId}"]`),publicNode=()=>viewer.locator(`.visual-editor-node[data-node-id="${nodeId}"]`);
  const reloadViewer=async()=>{const rendered=viewer.waitForResponse(response=>response.url().includes('/api/public/presentation'));await viewer.reload({waitUntil:'domcontentloaded'});await rendered};
  const setViewerWidth=async width=>{await viewer.setViewportSize({width,height:900});await reloadViewer()};
  const activateEditor=async device=>{const button=editor.locator(`.canvas-device-btn[data-device="${device}"]`);if(!await button.evaluate(el=>el.classList.contains('active')))await button.click()};
  const selectNode=async()=>{await canvas().evaluate(el=>el.click());if(await editor.locator('#rightDock').evaluate(el=>el.classList.contains('closed')))await editor.locator('#openInspector').click()};
  const openHoverColor=async()=>{
    await selectNode();await editor.locator('.inspector-tabs button').nth(2).click();
    let group=editor.locator('.inspector-group').filter({hasText:'Rámutatás és fókusz'}),title=group.locator(':scope > .inspector-group-title');
    if(await title.getAttribute('aria-expanded')==='false')await title.click();
    await editor.getByLabel('Állapot előnézete',{exact:true}).selectOption('hover');
    group=editor.locator('.inspector-group').filter({hasText:'Rámutatás és fókusz'});title=group.locator(':scope > .inspector-group-title');
    if(await title.getAttribute('aria-expanded')==='false')await title.click();
    return group.locator('[data-state-property="backgroundColor"]');
  };
  const publicHoverColor=async()=>{await publicNode().hover();return publicNode().evaluate(el=>getComputedStyle(el).backgroundColor)};

  await editor.goto(base+'/editor-v2/index.html');await selectNode();await viewer.goto(base+'/p/test');
  const tabletButton=editor.locator('.canvas-device-btn[data-device="tablet"]');await tabletButton.click();
  const field=await openHoverColor();
  assert.equal(await field.getAttribute('data-property-command'),'states.set','tablet hover exposes the state command route');
  assert.equal(await field.getAttribute('data-property-key'),'backgroundColor','tablet hover exposes the backgroundColor Page Model key');
  assert.equal(await canvas().evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(22, 163, 74)','tablet Canvas initially inherits the desktop hover state');
  const tabletColor='#c026d3',input=field.locator('input[type="text"]');await input.fill(tabletColor);await input.press('Tab');
  assert.equal(await canvas().evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(192, 38, 211)','tablet hover override reaches Canvas preview');
  await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  assert.equal(posts.at(-1).publish,false,'tablet hover Save remains draft-only');
  assert.equal(draft.pages[pageId].nodes[nodeId].states.hover.tablet.backgroundColor,tabletColor,'tablet hover value is saved to the draft Page Model');
  assert.equal(published.pages[pageId].nodes[nodeId].states.hover.tablet?.backgroundColor,undefined,'draft Save leaves tablet published state unchanged');
  assert.equal(published.pages[pageId].nodes[nodeId].states.hover.desktop.backgroundColor,'#16a34a','draft Save preserves published desktop state');
  await editor.reload({waitUntil:'domcontentloaded'});await activateEditor('tablet');
  const reloadedField=await openHoverColor();
  assert.equal(await reloadedField.locator('input[type="text"]').inputValue(),tabletColor,'tablet hover value survives Editor reload');
  await setViewerWidth(768);
  assert.equal(await publicHoverColor(),'rgb(22, 163, 74)','tablet draft stays unpublished and inherits the desktop public hover state');
  await editor.locator('#publish').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
  await reloadViewer();
  assert.equal(published.pages[pageId].nodes[nodeId].states.hover.tablet.backgroundColor,tabletColor,'explicit Publish stores the tablet hover state');
  assert.equal(await publicHoverColor(),'rgb(192, 38, 211)','published tablet hover reaches the public CSS');
  await setViewerWidth(1366);assert.equal(await publicHoverColor(),'rgb(22, 163, 74)','tablet Publish preserves the independent desktop hover state');
  await setViewerWidth(390);assert.equal(await publicHoverColor(),'rgb(192, 38, 211)','mobile hover inherits the tablet state');

  const resetField=await openHoverColor(),reset=editor.locator('.property-reset').filter({hasText:'Állapotérték öröklésének visszaállítása'});
  assert.equal(await reset.count(),1,'tablet hover override exposes a reset-to-inheritance action');
  assert.equal(await reset.getAttribute('data-property-command'),'states.set');assert.equal(await reset.getAttribute('data-property-key'),'backgroundColor');
  await reset.click();assert.equal(await canvas().evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(22, 163, 74)','reset restores inherited desktop hover on Canvas');
  await editor.locator('#undo').click();assert.equal(await canvas().evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(192, 38, 211)','Undo restores the tablet hover override');
  await editor.locator('#redo').click();assert.equal(await canvas().evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(22, 163, 74)','Redo restores tablet inheritance');
  await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  assert.equal(posts.at(-1).publish,false,'tablet state reset Save remains draft-only');
  assert.equal(draft.pages[pageId].nodes[nodeId].states.hover.tablet.backgroundColor,undefined,'reset removes the tablet hover override from the draft');
  assert.equal(await publicHoverColor(),'rgb(192, 38, 211)','published tablet hover remains until reset Publish');
  await editor.locator('#publish').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
  await setViewerWidth(768);assert.equal(await publicHoverColor(),'rgb(22, 163, 74)','published tablet reset inherits desktop hover');
  await setViewerWidth(390);assert.equal(await publicHoverColor(),'rgb(22, 163, 74)','mobile inherits desktop after tablet reset is published');
  assert.deepEqual(errors,[],'tablet state lifecycle produces no browser errors');
});
