import assert from 'node:assert/strict';
import test from 'node:test';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve,extname} from 'node:path';
import {chromium} from 'playwright';
import {createDocument,createNode,NODE_TYPES} from '../../public/editor-v2/core/schema.js';
import {createEditorState,activePage} from '../../public/editor-v2/core/state.js';
import {execute} from '../../public/editor-v2/core/commands.js';

const publicRoot=resolve(import.meta.dirname,'../../public');

for(const width of [390,1366])test(`selected Canvas element can be moved and undone with the keyboard at ${width}px without implicit publishing`,async t=>{
  const state=createEditorState(createDocument()),page=activePage(state),pageId=page.id,rootId=page.rootId;
  execute(state,{type:'element.add',payload:{type:NODE_TYPES.TEXT,parentId:rootId}});
  const movableId=state.selection.primaryId,movable=page.nodes[movableId];
  execute(state,{type:'element.update',payload:{nodeId:movableId,patch:{name:'Mozgatható cím'}}});
  const activeDevice=width<=850?'mobile':'desktop';
  execute(state,{type:'responsive.set',payload:{nodeId:movableId,device:activeDevice,patch:{x:'12px',y:'24px'}}});
  const locked=createNode(NODE_TYPES.TEXT,{name:'Zárolt cím',parentId:rootId,locked:true});
  page.nodes[locked.id]=locked;page.nodes[rootId].children.push(locked.id);
  execute(state,{type:'selection.set',payload:{ids:[movableId],primaryId:movableId}});

  let draft=structuredClone(state.document),published=structuredClone(draft),revision=1;
  const writes=[],errors=[],htmlRoot=publicRoot;
  const server=createServer(async(req,res)=>{
    const url=new URL(req.url,'http://localhost');
    const json=data=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(data));};
    if(url.pathname==='/api/admin/pages')return json({ok:true,data:[{id:pageId,slug:'keyboard-move',title:'Billentyűzetes mozgatás',content:draft,revision,isPublished:true}]});
    if(url.pathname==='/api/admin/editor'){
      if(req.method==='GET')return json({ok:true,data:{page:{id:pageId,document:draft,publishedRevisionId:'published'},revisions:[{id:'revision-'+revision,version:revision}]}});
      let body='';for await(const chunk of req)body+=chunk;
      const request=JSON.parse(body);writes.push(request);draft=structuredClone(request.document);revision++;
      if(request.publish)published=structuredClone(draft);
      return json({ok:true,data:{pageId,version:revision,revisionId:'revision-'+revision,published:Boolean(request.publish)}});
    }
    if(url.pathname==='/api/public/pages')return json({ok:true,data:{id:pageId,slug:'keyboard-move',title:'Billentyűzetes mozgatás',content:published.pages[pageId]}});
    if(url.pathname==='/api/public/navigation')return json({ok:true,data:{items:[]}});
    if(url.pathname==='/api/public/schedule')return json({ok:true,data:[]});
    if(url.pathname==='/api/integrations/twitch/connection')return json({ok:true,data:{connected:false}});
    if(url.pathname.startsWith('/api/'))return json({ok:true,data:{siteName:'SANCI9517'}});
    const asset=url.pathname==='/p/keyboard-move'?'/visual-page.html':url.pathname,file=resolve(htmlRoot,'.'+asset);
    if(!file.startsWith(htmlRoot+'/'))return res.writeHead(403).end();
    try{res.setHeader('content-type',{'.html':'text/html','.js':'text/javascript','.css':'text/css'}[extname(file)]||'application/octet-stream');res.end(await readFile(file))}
    catch{res.writeHead(404).end()}
  });
  await new Promise(done=>server.listen(0,'127.0.0.1',done));
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
  t.after(async()=>{await browser.close();await new Promise(done=>server.close(done))});
  const editor=await browser.newPage({viewport:{width,height:900}});
  editor.setDefaultTimeout(15000);editor.on('pageerror',error=>errors.push(error.message));
  await editor.goto(`http://127.0.0.1:${server.address().port}/editor-v2/index.html`);
  await editor.locator(`.node[data-node-id="${movableId}"]`).waitFor();
  await editor.waitForFunction(()=>typeof window.sanciEditor?.showLeftTab==='function'&&document.querySelector('#saveStatus')?.textContent==='Mentve');
  if(width<=850){await editor.locator('.canvas-device-btn[data-device="mobile"]').click();await editor.locator(`.node[data-node-id="${movableId}"][data-device="mobile"]`).waitFor();}
  await editor.evaluate(()=>window.sanciEditor.showLeftTab('layers',{save:false}));
  await editor.locator(`.layer-row[data-node-id="${movableId}"]`).click();
  const move=editor.locator(`.canvas-keyboard-move[data-node-id="${movableId}"]`);
  await move.waitFor({state:'visible'});
  assert.equal(await move.getAttribute('aria-label'),'Mozgatható cím elem mozgatása');
  assert.match(await move.getAttribute('aria-keyshortcuts'),/ArrowLeft.*Shift\+ArrowDown/);
  assert.match(await move.getAttribute('aria-description'),/1 képpont.*10 képpont/);
  assert.equal(await editor.locator(`.canvas-keyboard-move[data-node-id="${rootId}"]`).count(),0,'the page root cannot be moved as a content element');

  const geometry=async()=>editor.locator(`.node[data-node-id="${movableId}"]`).evaluate(el=>({x:el.style.left,y:el.style.top}));
  assert.deepEqual(await geometry(),{x:'12px',y:'24px'});
  if(width<=850){await editor.locator('#editorMenu').click();await editor.waitForFunction(()=>document.querySelector('.canvas-area')?.inert===false)}
  await move.press('ArrowRight');
  await editor.waitForFunction(id=>document.querySelector(`.node[data-node-id="${CSS.escape(id)}"]`)?.style.left==='13px',movableId);
  assert.equal(await editor.evaluate(()=>document.activeElement?.classList.contains('canvas-keyboard-move')),true,'a rerender keeps focus on the move control');
  await editor.keyboard.press('Shift+ArrowDown');
  await editor.waitForFunction(id=>document.querySelector(`.node[data-node-id="${CSS.escape(id)}"]`)?.style.top==='34px',movableId);
  assert.deepEqual(await geometry(),{x:'13px',y:'34px'},'Shift+arrow uses a 10 CSS-pixel step at every canvas zoom');
  assert.equal(writes.length,0,'movement changes the local Page Model and does not autosave or publish');

  await editor.keyboard.press('Control+z');
  await editor.waitForFunction(id=>document.querySelector(`.node[data-node-id="${CSS.escape(id)}"]`)?.style.left==='12px'&&document.querySelector(`.node[data-node-id="${CSS.escape(id)}"]`)?.style.top==='24px',movableId);
  assert.equal(writes.length,0,'Undo remains local');
  await editor.keyboard.press('Control+Shift+z');
  await editor.waitForFunction(id=>document.querySelector(`.node[data-node-id="${CSS.escape(id)}"]`)?.style.left==='13px'&&document.querySelector(`.node[data-node-id="${CSS.escape(id)}"]`)?.style.top==='34px',movableId);
  assert.equal(writes.length,0,'Redo remains local');

  const publicBefore=await editor.evaluate(async()=>fetch('/api/public/pages').then(response=>response.json()));
  assert.deepEqual({x:publicBefore.data.content.nodes[movableId].responsive[activeDevice].x,y:publicBefore.data.content.nodes[movableId].responsive[activeDevice].y},{x:'12px',y:'24px'},'the public page remains at the last published position before Save and Publish');
  await editor.locator('#save').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.startsWith('Mentve'));
  assert.equal(writes.length,1);assert.equal(writes[0].publish,false,'Save submits a draft only');
  assert.deepEqual({x:draft.pages[pageId].nodes[movableId].responsive[activeDevice].x,y:draft.pages[pageId].nodes[movableId].responsive[activeDevice].y},{x:'13px',y:'34px'});
  assert.deepEqual({x:published.pages[pageId].nodes[movableId].responsive[activeDevice].x,y:published.pages[pageId].nodes[movableId].responsive[activeDevice].y},{x:'12px',y:'24px'},'draft Save leaves the published revision unchanged');
  await editor.reload();
  await editor.locator(`.node[data-node-id="${movableId}"]`).waitFor();
  if(width<=850){await editor.locator('.canvas-device-btn[data-device="mobile"]').click();await editor.locator(`.node[data-node-id="${movableId}"][data-device="mobile"]`).waitFor()}
  assert.deepEqual(await geometry(),{x:'13px',y:'34px'},'Save and reload preserve responsive geometry');
  const publicAfterSave=await editor.evaluate(async()=>fetch('/api/public/pages').then(response=>response.json()));
  assert.deepEqual({x:publicAfterSave.data.content.nodes[movableId].responsive[activeDevice].x,y:publicAfterSave.data.content.nodes[movableId].responsive[activeDevice].y},{x:'12px',y:'24px'},'the public model is unchanged after draft Save');

  await editor.locator('#publish').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.includes('Publikálva'));
  assert.equal(writes.length,2);assert.equal(writes[1].publish,true,'publishing is a separate explicit action');
  assert.deepEqual({x:published.pages[pageId].nodes[movableId].responsive[activeDevice].x,y:published.pages[pageId].nodes[movableId].responsive[activeDevice].y},{x:'13px',y:'34px'});
  const publicAfterPublish=await editor.evaluate(async()=>fetch('/api/public/pages').then(response=>response.json()));
  assert.deepEqual({x:publicAfterPublish.data.content.nodes[movableId].responsive[activeDevice].x,y:publicAfterPublish.data.content.nodes[movableId].responsive[activeDevice].y},{x:'13px',y:'34px'},'only explicit Publish updates the public page');

  await editor.evaluate(()=>window.sanciEditor.showLeftTab('layers',{save:false}));
  await editor.locator(`.layer-row[data-node-id="${locked.id}"]`).click();
  assert.equal(await editor.locator(`.layer-row[data-node-id="${locked.id}"]`).evaluate(row=>row.classList.contains('locked')),true);
  assert.equal(await editor.locator(`.canvas-keyboard-move[data-node-id="${locked.id}"]`).count(),0,'locked elements never render a move control');
  const lockedBefore={x:locked.responsive.desktop.x||'0px',y:locked.responsive.desktop.y||'0px'};
  await editor.locator(`.layer-row[data-node-id="${locked.id}"]`).focus();
  await editor.keyboard.press('ArrowLeft');
  assert.deepEqual({x:locked.responsive.desktop.x||'0px',y:locked.responsive.desktop.y||'0px'},lockedBefore,'layer-list navigation cannot move a locked canvas element');
  assert.deepEqual(errors,[]);
});
