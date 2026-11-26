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
  execute(state,{type:'element.add',payload:{type:NODE_TYPES.TEXT,parentId:rootId,name:'Backspace cél'}});
  const backspaceId=state.selection.primaryId;
  execute(state,{type:'element.add',payload:{type:NODE_TYPES.TEXT,parentId:rootId,name:'Delete cél'}});
  const deleteId=state.selection.primaryId;
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

  const backspaceRow=editor.locator(`.layer-row[data-node-id="${backspaceId}"]`);
  await backspaceRow.click();await backspaceRow.focus();await editor.keyboard.press('F2');
  const rename=editor.locator('#layersTree .layer-rename-editor input');
  await rename.waitFor({state:'visible'});await rename.press('Backspace');
  assert.equal(await editor.locator(`.layer-row[data-node-id="${backspaceId}"]`).count(),1,'Backspace stays in the focused layer-name input instead of deleting its element');
  assert.equal(await rename.count(),1);
  await rename.press('Escape');await backspaceRow.waitFor({state:'visible'});
  const lockedRow=editor.locator(`.layer-row[data-node-id="${locked.id}"]`);
  await lockedRow.focus();await editor.keyboard.press('Control+Space');
  await editor.keyboard.press('Delete');
  assert.equal(await backspaceRow.count(),1,'a mixed selection containing a locked element is rejected atomically');
  assert.equal(await lockedRow.count(),1);assert.equal(await backspaceRow.getAttribute('aria-selected'),'true');
  assert.equal(writes.length,2,'a rejected mixed selection cannot write to the draft or public page');
  await backspaceRow.click();
  await backspaceRow.focus();await editor.keyboard.press('Backspace');
  await editor.locator(`.layer-row[data-node-id="${backspaceId}"]`).waitFor({state:'detached'});
  assert.equal(writes.length,2,'Backspace deletion is local to the draft');
  await editor.keyboard.press('Control+z');await backspaceRow.waitFor({state:'visible'});
  assert.equal(await editor.locator(`.layer-row[data-node-id="${backspaceId}"]`).getAttribute('aria-selected'),'true','Undo restores the deleted node and its selection');

  const rootRow=editor.locator(`.layer-row[data-node-id="${rootId}"]`);
  await backspaceRow.focus();await editor.keyboard.press('Home');
  await rootRow.waitFor();await editor.keyboard.press('Delete');
  assert.equal(await rootRow.count(),1,'Delete never removes the page root');
  assert.equal(writes.length,2);

  const movableRow=editor.locator(`.layer-row[data-node-id="${movableId}"]`),deleteRow=editor.locator(`.layer-row[data-node-id="${deleteId}"]`);
  await movableRow.click();await deleteRow.focus();await editor.keyboard.press('Control+Space');
  assert.equal(await movableRow.getAttribute('aria-selected'),'true');assert.equal(await deleteRow.getAttribute('aria-selected'),'true');
  assert.match(await deleteRow.getAttribute('aria-keyshortcuts'),/Delete Backspace/,'the layer row announces its deletion alternatives');
  assert.match(await deleteRow.getAttribute('aria-description'),/Delete vagy Backspace.*zárolt/i,'assistive technology explains the deletion guard');
  await editor.keyboard.press('Delete');
  await editor.locator(`.layer-row[data-node-id="${movableId}"]`).waitFor({state:'detached'});
  await editor.locator(`.layer-row[data-node-id="${deleteId}"]`).waitFor({state:'detached'});
  assert.equal(await editor.evaluate(()=>document.activeElement?.dataset.nodeId),rootId,'deleting a focused layer range moves focus to its surviving parent');
  assert.equal(writes.length,2,'multi-delete does not save or publish');
  await editor.keyboard.press('Control+z');
  await editor.locator(`.layer-row[data-node-id="${movableId}"]`).waitFor({state:'visible'});
  await editor.locator(`.layer-row[data-node-id="${deleteId}"]`).waitFor({state:'visible'});
  assert.equal(await movableRow.getAttribute('aria-selected'),'true');assert.equal(await deleteRow.getAttribute('aria-selected'),'true','Undo restores the complete multi-selection');
  await editor.keyboard.press('Control+Shift+z');
  await editor.locator(`.layer-row[data-node-id="${movableId}"]`).waitFor({state:'detached'});
  await editor.locator(`.layer-row[data-node-id="${deleteId}"]`).waitFor({state:'detached'});
  await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.startsWith('Mentve'));
  assert.equal(writes.length,3);assert.equal(writes[2].publish,false,'Save stores keyboard deletion only as a draft');
  assert.equal(draft.pages[pageId].nodes[movableId],undefined);assert.equal(draft.pages[pageId].nodes[deleteId],undefined);
  assert.ok(published.pages[pageId].nodes[movableId]);assert.ok(published.pages[pageId].nodes[deleteId],'Save leaves both published elements intact');
  await editor.reload();
  assert.equal(await editor.locator(`.layer-row[data-node-id="${movableId}"]`).count(),0,'the saved draft deletion survives reload');
  assert.equal((await editor.evaluate(async()=>fetch('/api/public/pages').then(response=>response.json()))).data.content.nodes[movableId].id,movableId,'the live page is not altered by draft reload');
  await editor.locator('#publish').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.includes('Publikálva'));
  assert.equal(writes.length,4);assert.equal(writes[3].publish,true,'only explicit Publish applies the deletions to the public revision');
  assert.equal(published.pages[pageId].nodes[movableId],undefined);assert.equal(published.pages[pageId].nodes[deleteId],undefined);
  await editor.locator(`.layer-row[data-node-id="${locked.id}"]`).focus();await editor.keyboard.press('Backspace');
  assert.equal(await editor.locator(`.layer-row[data-node-id="${locked.id}"]`).count(),1,'a locked selected element cannot be removed by Backspace');
  assert.equal(writes.length,4,'a rejected locked-element deletion cannot submit a write');
  assert.deepEqual(errors,[]);
});

for(const width of [390,1366])test(`selected Canvas element can be resized and clamped with the keyboard at ${width}px without implicit publishing`,async t=>{
  const state=createEditorState(createDocument()),page=activePage(state),pageId=page.id,rootId=page.rootId;
  execute(state,{type:'element.add',payload:{type:NODE_TYPES.TEXT,parentId:rootId}});
  const resizeId=state.selection.primaryId,resizeNode=page.nodes[resizeId];
  execute(state,{type:'element.update',payload:{nodeId:resizeId,patch:{name:'Méretezhető cím'}}});
  for(const device of ['desktop','mobile'])execute(state,{type:'responsive.set',payload:{nodeId:resizeId,device,patch:{x:'12px',y:'24px',width:'120px',height:'80px'}}});
  const minimum=createNode(NODE_TYPES.TEXT,{name:'Minimum méret',parentId:rootId});
  page.nodes[minimum.id]=minimum;page.nodes[rootId].children.push(minimum.id);
  for(const device of ['desktop','mobile'])execute(state,{type:'responsive.set',payload:{nodeId:minimum.id,device,patch:{width:'25px',height:'25px'}}});
  const locked=createNode(NODE_TYPES.TEXT,{name:'Zárolt méret',parentId:rootId,locked:true});
  page.nodes[locked.id]=locked;page.nodes[rootId].children.push(locked.id);
  execute(state,{type:'selection.set',payload:{ids:[resizeId],primaryId:resizeId}});

  let draft=structuredClone(state.document),published=structuredClone(draft),revision=1;
  const lockedSizeBefore=structuredClone(draft.pages[pageId].nodes[locked.id].responsive);
  const writes=[],errors=[],htmlRoot=publicRoot;
  const server=createServer(async(req,res)=>{
    const url=new URL(req.url,'http://localhost');
    const json=data=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(data));};
    if(url.pathname==='/api/admin/pages')return json({ok:true,data:[{id:pageId,slug:'keyboard-resize',title:'Billentyűzetes méretezés',content:draft,revision,isPublished:true}]});
    if(url.pathname==='/api/admin/editor'){
      if(req.method==='GET')return json({ok:true,data:{page:{id:pageId,document:draft,publishedRevisionId:'published'},revisions:[{id:'revision-'+revision,version:revision}]}});
      let body='';for await(const chunk of req)body+=chunk;
      const request=JSON.parse(body);writes.push(request);draft=structuredClone(request.document);revision++;
      if(request.publish)published=structuredClone(draft);
      return json({ok:true,data:{pageId,version:revision,revisionId:'revision-'+revision,published:Boolean(request.publish)}});
    }
    if(url.pathname==='/api/public/pages')return json({ok:true,data:{id:pageId,slug:'keyboard-resize',title:'Billentyűzetes méretezés',content:published.pages[pageId]}});
    if(url.pathname==='/api/public/navigation')return json({ok:true,data:{items:[]}});
    if(url.pathname==='/api/public/schedule')return json({ok:true,data:[]});
    if(url.pathname==='/api/integrations/twitch/connection')return json({ok:true,data:{connected:false}});
    if(url.pathname.startsWith('/api/'))return json({ok:true,data:{siteName:'SANCI9517'}});
    const asset=url.pathname==='/p/keyboard-resize'?'/visual-page.html':url.pathname,file=resolve(htmlRoot,'.'+asset);
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
  await editor.locator(`.node[data-node-id="${resizeId}"]`).waitFor();
  await editor.waitForFunction(()=>typeof window.sanciEditor?.showLeftTab==='function'&&document.querySelector('#saveStatus')?.textContent==='Mentve');
  const activeDevice=width<=850?'mobile':'desktop';
  if(activeDevice==='mobile'){await editor.locator('.canvas-device-btn[data-device="mobile"]').click();await editor.locator(`.node[data-node-id="${resizeId}"][data-device="mobile"]`).waitFor();}
  await editor.evaluate(()=>window.sanciEditor.showLeftTab('layers',{save:false}));
  await editor.locator(`.layer-row[data-node-id="${resizeId}"]`).click();
  const handle=editor.locator(`.canvas-resize-handle[data-node-id="${resizeId}"]`);
  await handle.waitFor({state:'visible'});
  assert.equal(await handle.getAttribute('aria-label'),'Méretezhető cím elem átméretezése');
  assert.match(await handle.getAttribute('aria-keyshortcuts'),/ArrowLeft.*Shift\+ArrowDown/);
  assert.match(await handle.getAttribute('aria-description'),/szélesség.*magasság.*24 képpont/);
  const handleBounds=await handle.boundingBox();
  assert.ok(handleBounds.width>=24,`the touch target is at least 24 CSS pixels (got ${handleBounds.width.toFixed(2)}px)`);
  assert.equal(await editor.locator(`.canvas-resize-handle[data-node-id="${rootId}"]`).count(),0,'the page root cannot be resized');
  const size=async id=>editor.locator(`.node[data-node-id="${id}"]`).evaluate(el=>({width:el.style.width,height:el.style.height}));
  assert.deepEqual(await size(resizeId),{width:'120px',height:'80px'});
  if(activeDevice==='mobile'){await editor.locator('#editorMenu').click();await editor.waitForFunction(()=>document.querySelector('.canvas-area')?.inert===false)}
  await handle.focus();
  await editor.keyboard.press('ArrowRight');
  await editor.waitForFunction(id=>document.querySelector(`.node[data-node-id="${CSS.escape(id)}"]`)?.style.width==='121px',resizeId);
  await editor.keyboard.press('Shift+ArrowDown');
  await editor.waitForFunction(id=>document.querySelector(`.node[data-node-id="${CSS.escape(id)}"]`)?.style.height==='90px',resizeId);
  await editor.keyboard.press('Control+ArrowRight');
  assert.deepEqual(await size(resizeId),{width:'121px',height:'90px'},'system-modified keys are not intercepted');
  await editor.keyboard.press('Shift+ArrowLeft');
  await editor.keyboard.press('ArrowUp');
  assert.deepEqual(await size(resizeId),{width:'111px',height:'89px'},'arrows resize the matching dimension by 1px or 10px');
  assert.equal(await editor.evaluate(()=>document.activeElement?.classList.contains('canvas-resize-handle')),true,'a rerender preserves focus on the resize handle');
  assert.match(await editor.locator('#saveStatus').textContent(),/Nem mentett módosítás.*méret: 111 × 89 px/,'the live region announces the draft size');
  assert.equal(writes.length,0,'keyboard resizing changes only the local Page Model');
  await editor.keyboard.press('Control+z');
  await editor.waitForFunction(id=>document.querySelector(`.node[data-node-id="${CSS.escape(id)}"]`)?.style.width==='120px'&&document.querySelector(`.node[data-node-id="${CSS.escape(id)}"]`)?.style.height==='80px',resizeId);
  await editor.keyboard.press('Control+Shift+z');
  await editor.waitForFunction(id=>document.querySelector(`.node[data-node-id="${CSS.escape(id)}"]`)?.style.width==='111px'&&document.querySelector(`.node[data-node-id="${CSS.escape(id)}"]`)?.style.height==='89px',resizeId);
  assert.equal(writes.length,0,'Undo and Redo remain local');

  const publicBefore=await editor.evaluate(async()=>fetch('/api/public/pages').then(response=>response.json()));
  assert.deepEqual({width:publicBefore.data.content.nodes[resizeId].responsive[activeDevice].width,height:publicBefore.data.content.nodes[resizeId].responsive[activeDevice].height},{width:'120px',height:'80px'},'the published page remains unchanged before explicit Save and Publish');
  await editor.locator('#save').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.startsWith('Mentve'));
  assert.equal(writes.length,1);assert.equal(writes[0].publish,false,'Save submits a draft only');
  assert.deepEqual({width:draft.pages[pageId].nodes[resizeId].responsive[activeDevice].width,height:draft.pages[pageId].nodes[resizeId].responsive[activeDevice].height},{width:'111px',height:'89px'});
  assert.deepEqual({width:published.pages[pageId].nodes[resizeId].responsive[activeDevice].width,height:published.pages[pageId].nodes[resizeId].responsive[activeDevice].height},{width:'120px',height:'80px'},'draft Save leaves the published revision unchanged');
  await editor.reload();
  await editor.locator(`.node[data-node-id="${resizeId}"]`).waitFor();
  if(activeDevice==='mobile'){await editor.locator('.canvas-device-btn[data-device="mobile"]').click();await editor.locator(`.node[data-node-id="${resizeId}"][data-device="mobile"]`).waitFor();}
  assert.deepEqual(await size(resizeId),{width:'111px',height:'89px'},'Save and reload preserve active responsive dimensions');
  await editor.locator('#publish').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.includes('Publikálva'));
  assert.equal(writes.length,2);assert.equal(writes[1].publish,true,'publishing is a separate explicit action');
  assert.deepEqual({width:published.pages[pageId].nodes[resizeId].responsive[activeDevice].width,height:published.pages[pageId].nodes[resizeId].responsive[activeDevice].height},{width:'111px',height:'89px'});

  await editor.evaluate(()=>window.sanciEditor.showLeftTab('layers',{save:false}));
  await editor.locator(`.layer-row[data-node-id="${minimum.id}"]`).click();
  const minimumHandle=editor.locator(`.canvas-resize-handle[data-node-id="${minimum.id}"]`);
  await minimumHandle.waitFor({state:'visible'});
  if(activeDevice==='mobile'){await editor.locator('#editorMenu').click();await editor.waitForFunction(()=>document.querySelector('.canvas-area')?.inert===false)}
  await minimumHandle.focus();
  await editor.keyboard.press('ArrowLeft');await editor.keyboard.press('ArrowUp');
  await editor.keyboard.press('ArrowLeft');await editor.keyboard.press('ArrowUp');
  assert.deepEqual(await size(minimum.id),{width:'24px',height:'24px'},'width and height clamp at the 24px minimum');
  await editor.evaluate(()=>window.sanciEditor.showLeftTab('layers',{save:false}));
  await editor.locator(`.layer-row[data-node-id="${locked.id}"]`).click();
  assert.equal(await editor.locator(`.canvas-resize-handle[data-node-id="${locked.id}"]`).count(),0,'locked nodes do not expose a resize control');
  await editor.locator(`.layer-row[data-node-id="${locked.id}"]`).focus();await editor.keyboard.press('ArrowLeft');
  await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.startsWith('Mentve'));
  assert.equal(writes.length,3);assert.equal(writes[2].publish,false);
  assert.deepEqual({width:draft.pages[pageId].nodes[minimum.id].responsive[activeDevice].width,height:draft.pages[pageId].nodes[minimum.id].responsive[activeDevice].height},{width:'24px',height:'24px'});
  assert.deepEqual({width:published.pages[pageId].nodes[minimum.id].responsive[activeDevice].width,height:published.pages[pageId].nodes[minimum.id].responsive[activeDevice].height},{width:'25px',height:'25px'},'the clamped dimensions stay unpublished until another explicit Publish');
  assert.deepEqual(draft.pages[pageId].nodes[locked.id].responsive,lockedSizeBefore,'a locked node keeps its original responsive dimensions');
  assert.deepEqual(errors,[]);
});
