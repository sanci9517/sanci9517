import assert from 'node:assert/strict';
import test from 'node:test';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve,extname} from 'node:path';
import {chromium} from 'playwright';
import {createDocument} from '../../public/editor-v2/core/schema.js';
import {createEditorState,activePage} from '../../public/editor-v2/core/state.js';
import {execute} from '../../public/editor-v2/core/commands.js';

test('Inspector color keeps independent desktop/tablet/mobile values through draft Save and explicit Publish',async t=>{
  const model=createEditorState(createDocument()),pageId=model.document.activePageId;
  execute(model,{type:'element.add',payload:{type:'text',parentId:activePage(model).rootId,props:{text:'Breakpoint sample'}}});
  const nodeId=model.selection.primaryId;
  execute(model,{type:'responsive.set',payload:{nodeId,device:'desktop',patch:{backgroundColor:'#2563eb'}}});
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
    const path=url.pathname==='/p/test'?'/visual-page.html':url.pathname,file=resolve(root,'.'+path);
    if(!file.startsWith(root+'/'))return res.writeHead(403).end();
    try{res.setHeader('content-type',{'.html':'text/html','.js':'text/javascript','.css':'text/css'}[extname(file)]||'application/octet-stream');res.end(await readFile(file))}
    catch{res.writeHead(404).end()}
  });
  await new Promise(done=>server.listen(0,'127.0.0.1',done));
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
  t.after(async()=>{await browser.close();await new Promise(done=>server.close(done))});
  const base=`http://127.0.0.1:${server.address().port}`;
  const editor=await browser.newPage({viewport:{width:1366,height:900}}),publicPage=await browser.newPage({viewport:{width:1366,height:900}});
  for(const page of [editor,publicPage]){page.setDefaultTimeout(7000);page.setDefaultNavigationTimeout(12000);page.on('pageerror',error=>errors.push(error.message))}
  const canvas=()=>editor.locator(`.node[data-node-id="${nodeId}"]`),live=()=>publicPage.locator(`[data-node-id="${nodeId}"]`);
  const color=target=>target().evaluate(el=>getComputedStyle(el).backgroundColor);
  const select=async()=>{await canvas().evaluate(el=>el.click());if(await editor.locator('#rightDock').evaluate(el=>el.classList.contains('closed')))await editor.locator('#openInspector').click()};
  const activate=async(device,width)=>{await editor.locator(`.canvas-device-btn[data-device="${device}"]`).click();await publicPage.setViewportSize({width,height:900})};
  const field=()=>editor.locator('.typed-inspector-field[data-property-id="background.color"]');
  const setColor=async value=>field().locator('input[type="color"]').evaluate((input,next)=>{input.value=next;input.dispatchEvent(new Event('change',{bubbles:true}))},value);
  const save=async publish=>{await editor.locator(publish?'#publish':'#save').click();await editor.waitForFunction(p=>document.querySelector('#saveStatus')?.textContent?.startsWith(p?'Publikálva':'Mentve'),publish)};
  await editor.goto(base+'/editor-v2/index.html');await select();await publicPage.goto(base+'/p/test');
  await editor.locator('.inspector-tabs button').first().click();
  const heading=editor.locator('.inspector-group-title').filter({hasText:'Háttér'});if(await heading.getAttribute('aria-expanded')==='false')await heading.click();
  const breakpoints=[['desktop',1366,'#dc2626','rgb(220, 38, 38)'],['tablet',768,'#16a34a','rgb(22, 163, 74)'],['mobile',390,'#9333ea','rgb(147, 51, 234)']];
  for(const [device,width,hex,rgb] of breakpoints){
    await activate(device,width);await setColor(hex);
    assert.equal(await color(canvas),rgb,`${device} Inspector edit reaches Canvas CSS`);
    assert.equal(await color(live),'rgb(37, 99, 235)',`${device} draft remains unpublished`);
  }
  assert.equal(posts.length,0,'editing breakpoint variants does not save automatically');
  await save(false);assert.equal(posts.at(-1).publish,false);
  await editor.reload();await select();
  for(const [device,width,,rgb] of breakpoints){
    await activate(device,width);await publicPage.reload();
    assert.equal(await color(canvas),rgb,`${device} override survives Editor reload`);
    assert.equal(await color(live),'rgb(37, 99, 235)',`${device} public snapshot stays unchanged after Save`);
  }
  await save(true);assert.equal(posts.at(-1).publish,true);
  for(const [device,width,,rgb] of breakpoints){
    await activate(device,width);await publicPage.reload();
    assert.equal(await color(canvas),rgb,`${device} Canvas keeps its own published value`);
    assert.equal(await color(live),rgb,`${device} public renderer receives its own published value`);
  }
  await activate('mobile',390);await editor.locator('.inspector-tabs button').first().click();
  const resetHeading=editor.locator('.inspector-group-title').filter({hasText:'Háttér'});if(await resetHeading.getAttribute('aria-expanded')==='false')await resetHeading.click();
  await editor.locator('.property-reset[title^="mobile nézet"]').filter({hasText:'Öröklés visszaállítása'}).click();
  assert.equal(await color(canvas),'rgb(22, 163, 74)','mobile reset inherits tablet value');
  await editor.locator('#undo').click();assert.equal(await color(canvas),'rgb(147, 51, 234)','Undo restores mobile override');
  await editor.locator('#redo').click();assert.equal(await color(canvas),'rgb(22, 163, 74)','Redo restores tablet inheritance');
  await save(false);assert.equal(await color(live),'rgb(147, 51, 234)','reset remains a draft until Publish');
  await save(true);await publicPage.reload();
  assert.equal(await color(live),'rgb(22, 163, 74)','published mobile reset inherits tablet color');
  await activate('tablet',768);assert.equal(await color(live),'rgb(22, 163, 74)','tablet override remains intact after mobile reset');
  await activate('desktop',1366);assert.equal(await color(live),'rgb(220, 38, 38)','desktop override remains intact after mobile reset');
  assert.deepEqual(errors,[]);
});
