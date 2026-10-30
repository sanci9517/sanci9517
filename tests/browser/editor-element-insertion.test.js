import assert from 'node:assert/strict';
import test from 'node:test';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve,extname} from 'node:path';
import {chromium} from 'playwright';
import {createDocument,NODE_TYPES} from '../../public/editor-v2/core/schema.js';
import {createEditorState} from '../../public/editor-v2/core/state.js';
import {execute} from '../../public/editor-v2/core/commands.js';

test('palette items are inserted beside the selected item in canvas flow and saved in that order',async t=>{
  const document=createDocument(),pageId=document.activePageId,rootId=document.pages[pageId].rootId;
  let draft=structuredClone(document),published=null,version=1;
  const posts=[],root=resolve(import.meta.dirname,'../../public');
  const server=createServer(async(req,res)=>{
    const url=new URL(req.url,'http://localhost');
    const json=data=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(data))};
    if(url.pathname==='/api/admin/pages')return json({ok:true,data:url.searchParams.get('archived')==='1'?[]:[{id:pageId,slug:'test',title:'Test',content:draft,revision:version,isPublished:Boolean(published)}]});
    if(url.pathname==='/api/admin/editor'){
      if(req.method==='GET')return json({ok:true,data:{page:{id:pageId,document:draft,publishedRevisionId:published?'published':null},revisions:[{id:'revision-'+version,version}]}});
      let body='';for await(const chunk of req)body+=chunk;
      const request=JSON.parse(body);posts.push(request);draft=structuredClone(request.document);version++;
      if(request.publish)published=structuredClone(draft);
      return json({ok:true,data:{pageId,version,revisionId:'revision-'+version,published:Boolean(request.publish)}});
    }
    if(url.pathname==='/api/public/pages')return json(published?{ok:true,data:{id:pageId,slug:'test',title:'Test',content:published.pages[pageId]}}:{ok:false});
    if(url.pathname==='/api/public/navigation')return json({ok:true,data:{items:[]}});
    if(url.pathname==='/api/integrations/twitch/connection')return json({ok:true,data:{connected:false}});
    if(url.pathname.startsWith('/api/'))return json({ok:true,data:{siteName:'Test'}});
    const asset=url.pathname==='/p/test'?'/visual-page.html':url.pathname,file=resolve(root,'.'+asset);
    if(!file.startsWith(root+'/')){res.writeHead(403).end();return}
    try{res.setHeader('content-type',{'.html':'text/html','.js':'text/javascript','.css':'text/css'}[extname(file)]||'application/octet-stream');res.end(await readFile(file))}
    catch{res.writeHead(404).end()}
  });
  await new Promise(done=>server.listen(0,'127.0.0.1',done));
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
  t.after(async()=>{await browser.close();await new Promise(done=>server.close(done))});
  const tab=await browser.newPage({viewport:{width:1366,height:900}});tab.setDefaultTimeout(7000);
  const errors=[];tab.on('pageerror',error=>errors.push(error.message));
  await tab.goto(`http://127.0.0.1:${server.address().port}/editor-v2/index.html`);
  await tab.locator('.node[data-node-id="'+rootId+'"] > .node-head').waitFor();
  await tab.locator('.rail-btn[data-tab="elements"]').click();
  const textGroup=tab.locator('.element-group-title').filter({hasText:'Szöveg'});
  const groupBodyId=await textGroup.getAttribute('aria-controls');
  assert.ok(groupBodyId,'palette group disclosure should identify its controlled list');
  assert.equal(await textGroup.getAttribute('aria-expanded'),'false');
  assert.equal(await tab.locator('#'+groupBodyId).isVisible(),false);
  await textGroup.click();
  assert.equal(await textGroup.getAttribute('aria-expanded'),'true');
  assert.equal(await tab.locator('#'+groupBodyId).isVisible(),true);
  const textInfo=tab.locator('.element-row').filter({has:tab.locator('.element span').getByText('Szöveg',{exact:true})}).locator('.element-info');
  const descriptionId=await textInfo.getAttribute('aria-controls');
  assert.ok(descriptionId,'palette help disclosure should identify its description');
  assert.equal(await textInfo.getAttribute('aria-expanded'),'false');
  assert.equal(await tab.locator('#'+descriptionId).isVisible(),false);
  await textInfo.click();
  assert.equal(await textInfo.getAttribute('aria-expanded'),'true');
  assert.equal(await tab.locator('#'+descriptionId).isVisible(),true);
  assert.match(await tab.locator('#'+descriptionId).textContent(),/Inspector:/);
  await textInfo.click();
  assert.equal(await textInfo.getAttribute('aria-expanded'),'false');
  assert.equal(await tab.locator('#'+descriptionId).isVisible(),false);
  const palette=tab.locator('#elementList .element');
  await palette.filter({hasText:'Szöveg'}).click();
  const rootNode=tab.locator('.page-canvas .node[data-node-id="'+rootId+'"]');
  const findChild=async type=>{const id=await tab.waitForFunction(({rootId,type})=>{const root=document.querySelector('.page-canvas .node[data-node-id="'+rootId+'"]');return [...(root?.children||[])].find(node=>node.matches('.node')&&node.querySelector(':scope > .node-head small')?.textContent===type)?.dataset.nodeId||false},{rootId,type});return tab.locator('.node[data-node-id="'+id+'"]')};
  const first=await findChild('text');const firstId=await first.getAttribute('data-node-id');
  await palette.filter({hasText:'Heading'}).click();
  const heading=await findChild('heading');const headingId=await heading.getAttribute('data-node-id');
  await first.click();
  await palette.filter({has:tab.locator('span').getByText('Link',{exact:true})}).click();
  const link=await findChild('link');const linkId=await link.getAttribute('data-node-id');
  const canvasState=await tab.locator('.page-canvas .node[data-node-id="'+rootId+'"]').evaluate(el=>[...el.children].filter(child=>child.matches('.node')).map(child=>({id:child.dataset.nodeId,top:child.getBoundingClientRect().top,bottom:child.getBoundingClientRect().bottom})));
  assert.deepEqual(canvasState.map(item=>item.id),[firstId,linkId,headingId],'new node should be inserted immediately after the selected canvas item');
  assert.ok(canvasState[0].bottom<=canvasState[1].top+1&&canvasState[1].bottom<=canvasState[2].top+1,'normal-flow elements should not overlap on the canvas');
  const assertDeviceSelection=async selected=>{
    for(const device of ['desktop','tablet','mobile']){
      const expected=String(device===selected);
      assert.equal(await tab.locator('.top-center [data-device="'+device+'"]').getAttribute('aria-pressed'),expected,'top preview control should expose '+device+' selection');
      assert.equal(await tab.locator('.canvas-device-btn[data-device="'+device+'"]').getAttribute('aria-pressed'),expected,'canvas preview control should expose '+device+' selection');
    }
  };
  assert.equal(await tab.locator('.top-center').getAttribute('role'),'group');
  assert.equal(await tab.locator('.top-center').getAttribute('aria-label'),'Előnézeti eszközméret');
  assert.equal(await tab.locator('.canvas-devices').getAttribute('role'),'group');
  assert.equal(await tab.locator('.canvas-devices').getAttribute('aria-label'),'Vászon előnézeti eszközmérete');
  const selectTool=tab.locator('#selectTool'),panTool=tab.locator('#panTool');
  assert.equal(await selectTool.getAttribute('aria-pressed'),'true');
  assert.equal(await panTool.getAttribute('aria-pressed'),'false');
  assert.equal(await selectTool.locator('xpath=..').getAttribute('role'),'group');
  assert.equal(await selectTool.locator('xpath=..').getAttribute('aria-label'),'Vászon eszközei');
  await panTool.click();
  assert.equal(await selectTool.getAttribute('aria-pressed'),'false');
  assert.equal(await panTool.getAttribute('aria-pressed'),'true');
  await selectTool.click();
  assert.equal(await selectTool.getAttribute('aria-pressed'),'true');
  assert.equal(await panTool.getAttribute('aria-pressed'),'false');
  await assertDeviceSelection('desktop');
  await tab.locator('.canvas-device-btn[data-device="mobile"]').click();
  await assertDeviceSelection('mobile');
  const mobileState=await rootNode.evaluate(el=>[...el.children].filter(child=>child.matches('.node')).map(child=>({id:child.dataset.nodeId,top:child.getBoundingClientRect().top,bottom:child.getBoundingClientRect().bottom})));
  assert.deepEqual(mobileState.map(item=>item.id),[firstId,linkId,headingId]);
  assert.ok(mobileState[0].bottom<=mobileState[1].top+1&&mobileState[1].bottom<=mobileState[2].top+1,'normal-flow elements should not overlap in the mobile canvas');
  await tab.locator('#save').click();
  await tab.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.startsWith('Mentve'));
  assert.equal(posts.at(-1)?.publish,false,'Save keeps publishing separate');
  assert.deepEqual(draft.pages[pageId].nodes[rootId].children,[firstId,linkId,headingId]);
  assert.equal(published,null);
  assert.deepEqual(errors,[]);
});

test('palette insertion beside a locked container preserves its locked subtree',async t=>{
  const seed=createEditorState(createDocument()),pageId=seed.document.activePageId,rootId=seed.document.pages[pageId].rootId;
  execute(seed,{type:'element.add',payload:{type:NODE_TYPES.SECTION,parentId:rootId}});
  const lockedId=seed.selection.primaryId;
  execute(seed,{type:'element.add',payload:{type:NODE_TYPES.HEADING,parentId:lockedId}});
  const headingId=seed.selection.primaryId;
  execute(seed,{type:'element.add',payload:{type:NODE_TYPES.TEXT,parentId:lockedId}});
  const textId=seed.selection.primaryId;
  execute(seed,{type:'element.add',payload:{type:NODE_TYPES.BUTTON,parentId:lockedId}});
  const buttonId=seed.selection.primaryId;
  execute(seed,{type:'element.add',payload:{type:NODE_TYPES.IMAGE,parentId:lockedId}});
  const imageId=seed.selection.primaryId;
  execute(seed,{type:'hierarchy.group',payload:{nodeIds:[headingId,textId]}});
  const groupId=seed.selection.primaryId;
  execute(seed,{type:'element.lock.set',payload:{nodeId:lockedId,locked:true}});
  let draft=structuredClone(seed.document),version=1;
  const posts=[],root=resolve(import.meta.dirname,'../../public');
  const server=createServer(async(req,res)=>{
    const url=new URL(req.url,'http://localhost');
    const json=data=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(data))};
    if(url.pathname==='/api/admin/pages')return json({ok:true,data:url.searchParams.get('archived')==='1'?[]:[{id:pageId,slug:'test',title:'Test',content:draft,revision:version,isPublished:false}]});
    if(url.pathname==='/api/admin/editor'){
      if(req.method==='GET')return json({ok:true,data:{page:{id:pageId,document:draft},revisions:[{id:'revision-'+version,version}]}});
      let body='';for await(const chunk of req)body+=chunk;
      const request=JSON.parse(body);posts.push(request);draft=structuredClone(request.document);version++;
      return json({ok:true,data:{pageId,version,revisionId:'revision-'+version,published:false}});
    }
    if(url.pathname==='/api/public/pages')return json({ok:false});
    if(url.pathname==='/api/public/navigation')return json({ok:true,data:{items:[]}});
    if(url.pathname==='/api/integrations/twitch/connection')return json({ok:true,data:{connected:false}});
    if(url.pathname.startsWith('/api/'))return json({ok:true,data:{siteName:'Test'}});
    const file=resolve(root,'.'+url.pathname);
    if(!file.startsWith(root+'/')){res.writeHead(403).end();return}
    try{res.setHeader('content-type',{'.html':'text/html','.js':'text/javascript','.css':'text/css'}[extname(file)]||'application/octet-stream');res.end(await readFile(file))}
    catch{res.writeHead(404).end()}
  });
  await new Promise(done=>server.listen(0,'127.0.0.1',done));
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
  t.after(async()=>{await browser.close();await new Promise(done=>server.close(done))});
  const tab=await browser.newPage({viewport:{width:1366,height:900}});tab.setDefaultTimeout(7000);
  const errors=[];tab.on('pageerror',error=>errors.push(error.message));
  await tab.goto(`http://127.0.0.1:${server.address().port}/editor-v2/index.html`);
  await tab.locator(`.node[data-node-id="${lockedId}"]`).waitFor();
  await tab.locator('.rail-btn[data-tab="layers"]').click();
  const groupRow=tab.locator(`.layer-row[data-node-id="${groupId}"]`),buttonRow=tab.locator(`.layer-row[data-node-id="${buttonId}"]`),imageRow=tab.locator(`.layer-row[data-node-id="${imageId}"]`);
  const lockedRow=tab.locator(`.layer-row[data-node-id="${lockedId}"]`);await lockedRow.click();
  await tab.locator('#openInspector').click();
  const lockToggle=tab.locator('.inspector-lock-toggle');
  assert.equal(await lockToggle.isChecked(),true,'Inspector reflects the locked Page Model state');
  await lockToggle.uncheck();
  assert.equal(await lockedRow.evaluate(row=>row.classList.contains('locked')),false,'unlock updates the layer row immediately');
  assert.equal(await lockedRow.evaluate(row=>row.draggable),true,'unlock restores the drag affordance');
  await tab.locator('.inspector-lock-toggle').check();
  assert.equal(await lockedRow.evaluate(row=>row.classList.contains('locked')),true,'relocking persists in the current Editor model');
  assert.equal(await lockedRow.evaluate(row=>row.draggable),false,'relocking removes the drag affordance');
  assert.equal(await groupRow.evaluate(row=>row.draggable),false,'group rows under a locked parent cannot be dragged');
  await groupRow.click();
  assert.equal(await tab.locator('#ungroupSelection').isDisabled(),true,'a group inside a locked parent cannot be ungrouped');
  assert.equal(await buttonRow.evaluate(row=>row.draggable),false,'children of a locked parent cannot be dragged into or out of its fixed child list');
  await buttonRow.click();
  assert.equal(await tab.locator('.danger-action').isDisabled(),true,'a child cannot be deleted from a locked parent');
  await imageRow.click({modifiers:['Control']});
  assert.equal(await tab.locator('#groupSelection').isDisabled(),true,'siblings under a locked parent cannot be grouped');
  const dropAccepted=await buttonRow.evaluate((source,rootId)=>{
    const target=document.querySelector(`.layer-row[data-node-id="${rootId}"]`),dataTransfer=new DataTransfer();
    source.dispatchEvent(new DragEvent('dragstart',{bubbles:true,cancelable:true,dataTransfer}));
    const over=new DragEvent('dragover',{bubbles:true,cancelable:true,dataTransfer});target.dispatchEvent(over);
    target.dispatchEvent(new DragEvent('drop',{bubbles:true,cancelable:true,dataTransfer}));
    return over.defaultPrevented;
  },rootId);
  assert.equal(dropAccepted,false,'layer drag preview refuses to move a child out of a locked parent');
  await tab.locator(`.layer-row[data-node-id="${lockedId}"]`).click();
  await tab.locator('.rail-btn[data-tab="elements"]').click();
  await tab.locator('.element-group-title').filter({hasText:'Szöveg'}).click();
  await tab.locator('#elementList .element').filter({hasText:'Szöveg'}).click();
  await tab.waitForFunction(({rootId,lockedId})=>{
    const root=document.querySelector(`.page-canvas .node[data-node-id="${rootId}"]`);
    const locked=document.querySelector(`.node[data-node-id="${lockedId}"]`);
    return [...(root?.children||[])].filter(child=>child.matches('.node')).length===2&&[...(locked?.children||[])].filter(child=>child.matches('.node')).length===3;
  },{rootId,lockedId});
  const rootChildren=await tab.locator(`.page-canvas .node[data-node-id="${rootId}"]`).evaluate(el=>[...el.children].filter(child=>child.matches('.node')).map(child=>({id:child.dataset.nodeId,top:child.getBoundingClientRect().top,bottom:child.getBoundingClientRect().bottom})));
  const insertedId=rootChildren[1].id;
  assert.deepEqual(rootChildren.map(item=>item.id),[lockedId,insertedId]);
  assert.ok(rootChildren[0].bottom<=rootChildren[1].top+1,'new element must follow the locked section without overlapping it');
  assert.deepEqual(draft.pages[pageId].nodes[lockedId].children,[groupId,buttonId,imageId]);
  assert.deepEqual(draft.pages[pageId].nodes[groupId].children,[headingId,textId]);
  await tab.locator('#save').click();
  await tab.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.startsWith('Mentve'));
  assert.equal(posts.at(-1)?.publish,false,'adding beside a locked node remains a draft until explicit Publish');
  assert.deepEqual(draft.pages[pageId].nodes[rootId].children,[lockedId,insertedId]);
  assert.deepEqual(draft.pages[pageId].nodes[lockedId].children,[groupId,buttonId,imageId]);
  assert.deepEqual(draft.pages[pageId].nodes[groupId].children,[headingId,textId]);
  assert.deepEqual(errors,[]);
});

test('a nested locked ancestor disables descendant editing until the ancestor is unlocked',async t=>{
  const seed=createEditorState(createDocument()),pageId=seed.document.activePageId,rootId=seed.document.pages[pageId].rootId;
  execute(seed,{type:'element.add',payload:{type:NODE_TYPES.SECTION,parentId:rootId}});const lockedId=seed.selection.primaryId;
  execute(seed,{type:'element.add',payload:{type:NODE_TYPES.SECTION,parentId:lockedId}});const innerId=seed.selection.primaryId;
  execute(seed,{type:'element.add',payload:{type:NODE_TYPES.TEXT,parentId:innerId}});const textId=seed.selection.primaryId;
  execute(seed,{type:'element.lock.set',payload:{nodeId:lockedId,locked:true}});
  let draft=structuredClone(seed.document),version=1;
  const root=resolve(import.meta.dirname,'../../public');
  const server=createServer(async(req,res)=>{
    const url=new URL(req.url,'http://localhost'),json=data=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(data))};
    if(url.pathname==='/api/admin/pages')return json({ok:true,data:[{id:pageId,slug:'locked-ancestor',title:'Locked ancestor',content:draft,revision:version,isPublished:false}]});
    if(url.pathname==='/api/admin/editor'){
      if(req.method==='GET')return json({ok:true,data:{page:{id:pageId,document:draft},revisions:[{id:'rev-'+version,version}]}});
      let body='';for await(const chunk of req)body+=chunk;const request=JSON.parse(body);draft=structuredClone(request.document);version++;
      return json({ok:true,data:{pageId,version,revisionId:'rev-'+version,published:false}});
    }
    if(url.pathname==='/api/public/pages')return json({ok:false});
    if(url.pathname==='/api/public/navigation')return json({ok:true,data:{items:[]}});
    if(url.pathname==='/api/integrations/twitch/connection')return json({ok:true,data:{connected:false}});
    if(url.pathname.startsWith('/api/'))return json({ok:true,data:{siteName:'Test'}});
    const file=resolve(root,'.'+url.pathname);if(!file.startsWith(root+'/'))return res.writeHead(403).end();
    try{res.setHeader('content-type',{'.html':'text/html','.js':'text/javascript','.css':'text/css'}[extname(file)]||'application/octet-stream');res.end(await readFile(file))}catch{return res.writeHead(404).end()}
  });
  await new Promise(done=>server.listen(0,'127.0.0.1',done));
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
  t.after(async()=>{await browser.close();await new Promise(done=>server.close(done))});
  const tab=await browser.newPage({viewport:{width:1366,height:900}});tab.setDefaultTimeout(7000);const errors=[];tab.on('pageerror',error=>errors.push(error.message));
  await tab.goto(`http://127.0.0.1:${server.address().port}/editor-v2/index.html?pageId=${pageId}`);await tab.locator(`.node[data-node-id="${textId}"]`).waitFor();
  await tab.locator('.rail-btn[data-tab="layers"]').click();
  const outer=tab.locator(`.layer-row[data-node-id="${lockedId}"]`),inner=tab.locator(`.layer-row[data-node-id="${innerId}"]`),leaf=tab.locator(`.layer-row[data-node-id="${textId}"]`);
  assert.equal(await inner.evaluate(row=>row.draggable),false,'all descendants of a locked node are immovable');
  assert.equal(await leaf.evaluate(row=>row.draggable),false,'nested descendants inherit the locked state');
  assert.equal(await leaf.evaluate(row=>row.classList.contains('locked-ancestor')),true,'the layer tree identifies inherited lock state');
  assert.equal(await tab.locator(`.layer-visibility-toggle[data-node-id="${textId}"]`).isDisabled(),true,'visibility cannot be changed below a locked ancestor');
  assert.equal(await tab.locator(`.layer-rename[data-node-id="${textId}"]`).isDisabled(),true,'a descendant cannot be renamed below a locked ancestor');
  await leaf.click();await tab.locator('#openInspector').click();
  assert.match(await tab.locator('.inspector-locked-note').textContent(),/zárolt tároló része/i);
  assert.equal(await tab.getByRole('textbox',{name:'Elem neve',exact:true}).isDisabled(),true,'Inspector mutation controls are read-only');
  assert.equal(await tab.locator('.inspector-lock-toggle').isDisabled(),true,'a child cannot bypass its locked ancestor by changing its own lock');
  assert.equal(await tab.locator('.danger-action').isDisabled(),true,'a nested descendant cannot be deleted');
  assert.equal(await tab.locator(`.node[data-node-id="${textId}"] .canvas-edit-text`).count(),0,'Canvas editing affordances are hidden');
  await tab.locator('.rail-btn[data-tab="elements"]').click();await tab.locator('.element-group-title').filter({hasText:'Szöveg'}).click();await tab.locator('#elementList .element').filter({hasText:'Szöveg'}).click();
  const rootChildren=await tab.locator(`.page-canvas .node[data-node-id="${rootId}"]`).evaluate(root=>[...root.children].filter(child=>child.matches('.node')).map(child=>child.dataset.nodeId));
  assert.equal(rootChildren.length,2,'the palette inserts beside the complete locked ancestor subtree');assert.equal(rootChildren[0],lockedId);
  assert.deepEqual(draft.pages[pageId].nodes[lockedId].children,[innerId],'palette insertion preserves all descendants of the locked ancestor');
  await tab.locator('.rail-btn[data-tab="layers"]').click();
  await outer.click();
  assert.equal(await tab.locator('.inspector-lock-toggle').isDisabled(),false,'the ancestor can be unlocked directly');
  await tab.locator('.inspector-lock-toggle').uncheck();
  assert.equal(await leaf.evaluate(row=>row.draggable),true,'unlocking the ancestor restores descendant hierarchy actions');
  assert.equal(await leaf.evaluate(row=>row.classList.contains('locked-ancestor')),false);
  assert.equal(await tab.locator(`.layer-visibility-toggle[data-node-id="${textId}"]`).isDisabled(),false,'unlocking the ancestor restores descendant visibility actions');
  assert.equal(await tab.locator(`.layer-rename[data-node-id="${textId}"]`).isDisabled(),false,'unlocking the ancestor restores descendant rename actions');
  assert.deepEqual(errors,[]);
});

test('layer visibility control follows the responsive command and keeps Save separate from Publish',async t=>{
  const seed=createEditorState(createDocument()),pageId=seed.document.activePageId,rootId=seed.document.pages[pageId].rootId;
  execute(seed,{type:'element.add',payload:{type:NODE_TYPES.SECTION,parentId:rootId}});const sectionId=seed.selection.primaryId;
  execute(seed,{type:'element.add',payload:{type:NODE_TYPES.TEXT,parentId:sectionId}});const textId=seed.selection.primaryId;
  let draft=structuredClone(seed.document),published=structuredClone(seed.document),version=1;
  const root=resolve(import.meta.dirname,'../../public');
  const server=createServer(async(req,res)=>{
    const url=new URL(req.url,'http://localhost'),json=data=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(data))};
    if(url.pathname==='/api/admin/pages')return json({ok:true,data:[{id:pageId,slug:'visibility',title:'Visibility',content:draft,revision:version,isPublished:true}]});
    if(url.pathname==='/api/admin/editor'){
      if(req.method==='GET')return json({ok:true,data:{page:{id:pageId,document:draft,publishedRevisionId:'published'},revisions:[{id:'rev-'+version,version}]}});
      let body='';for await(const chunk of req)body+=chunk;const request=JSON.parse(body);draft=structuredClone(request.document);version++;if(request.publish)published=structuredClone(draft);
      return json({ok:true,data:{pageId,version,revisionId:'rev-'+version,published:Boolean(request.publish)}});
    }
    if(url.pathname==='/api/public/pages')return json({ok:true,data:{id:pageId,slug:'visibility',title:'Visibility',content:published.pages[pageId]}});
    if(url.pathname==='/api/public/navigation')return json({ok:true,data:{items:[]}});
    if(url.pathname==='/api/integrations/twitch/connection')return json({ok:true,data:{connected:false}});
    if(url.pathname.startsWith('/api/'))return json({ok:true,data:{siteName:'Test'}});
    const file=resolve(root,'.'+(url.pathname==='/p/visibility'?'/visual-page.html':url.pathname));if(!file.startsWith(root+'/'))return res.writeHead(403).end();
    try{res.setHeader('content-type',{'.html':'text/html','.js':'text/javascript','.css':'text/css'}[extname(file)]||'application/octet-stream');res.end(await readFile(file))}catch{return res.writeHead(404).end()}
  });
  await new Promise(done=>server.listen(0,'127.0.0.1',done));
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
  t.after(async()=>{await browser.close();await new Promise(done=>server.close(done))});
  const tab=await browser.newPage({viewport:{width:1366,height:900}});tab.setDefaultTimeout(7000);const errors=[];tab.on('pageerror',error=>errors.push(error.message));
  await tab.goto(`http://127.0.0.1:${server.address().port}/editor-v2/index.html?pageId=${pageId}`);await tab.locator(`.node[data-node-id="${sectionId}"]`).waitFor();
  await tab.locator('.rail-btn[data-tab="layers"]').click();
  const toggle=tab.locator(`.layer-visibility-toggle[data-node-id="${sectionId}"]`);
  assert.equal(await toggle.getAttribute('data-device'),'desktop');assert.equal(await toggle.getAttribute('aria-pressed'),'true');
  await tab.locator('.canvas-device-btn[data-device="mobile"]').click();
  const mobileToggle=tab.locator(`.layer-visibility-toggle[data-node-id="${sectionId}"]`);
  assert.equal(await mobileToggle.getAttribute('data-device'),'mobile');await mobileToggle.click();
  assert.equal(await tab.locator(`.node[data-node-id="${sectionId}"]`).getAttribute('data-visibility'),'hidden');
  assert.equal(draft.pages[pageId].nodes[sectionId].visibility.mobile,true,'visibility remains unsaved before Save');
  await tab.locator('#save').click();await tab.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.startsWith('Mentve'));
  assert.equal(draft.pages[pageId].nodes[sectionId].visibility.mobile,false);assert.equal(published.pages[pageId].nodes[sectionId].visibility.mobile,true,'Save keeps public output unchanged');
  await tab.locator(`.layer-visibility-toggle[data-node-id="${sectionId}"]`).click();
  assert.equal(draft.pages[pageId].nodes[sectionId].visibility.mobile,false,'the inverse change remains a draft');
  await tab.locator('#publish').click();await tab.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.startsWith('Publikálva'));
  assert.equal(published.pages[pageId].nodes[sectionId].visibility.mobile,true,'explicit Publish publishes the shown state');
  assert.deepEqual(errors,[]);
});

test('Layers hierarchy reparent works with desktop drag and touch long-press, with history parity',async t=>{
  const seed=createEditorState(createDocument()),pageId=seed.document.activePageId,rootId=seed.document.pages[pageId].rootId;
  execute(seed,{type:'element.add',payload:{type:NODE_TYPES.SECTION,parentId:rootId}});const sectionId=seed.selection.primaryId;
  execute(seed,{type:'element.add',payload:{type:NODE_TYPES.TEXT,parentId:rootId}});const textId=seed.selection.primaryId;
  let draft=structuredClone(seed.document),version=1;
  const root=resolve(import.meta.dirname,'../../public');
  const server=createServer(async(req,res)=>{
    const url=new URL(req.url,'http://localhost'),json=data=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(data))};
    if(url.pathname==='/api/admin/pages')return json({ok:true,data:[{id:pageId,slug:'hierarchy',title:'Hierarchy',content:draft,revision:version,isPublished:false}]});
    if(url.pathname==='/api/admin/editor'){
      if(req.method==='GET')return json({ok:true,data:{page:{id:pageId,document:draft},revisions:[{id:'rev-'+version,version}]}});
      let body='';for await(const chunk of req)body+=chunk;const request=JSON.parse(body);draft=structuredClone(request.document);version++;
      return json({ok:true,data:{pageId,version,revisionId:'rev-'+version,published:false}});
    }
    if(url.pathname==='/api/public/pages')return json({ok:false});
    if(url.pathname==='/api/public/navigation')return json({ok:true,data:{items:[]}});
    if(url.pathname==='/api/integrations/twitch/connection')return json({ok:true,data:{connected:false}});
    if(url.pathname.startsWith('/api/'))return json({ok:true,data:{siteName:'Test'}});
    const file=resolve(root,'.'+url.pathname);if(!file.startsWith(root+'/'))return res.writeHead(403).end();
    try{res.setHeader('content-type',{'.html':'text/html','.js':'text/javascript','.css':'text/css'}[extname(file)]||'application/octet-stream');res.end(await readFile(file))}catch{return res.writeHead(404).end()}
  });
  await new Promise(done=>server.listen(0,'127.0.0.1',done));
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
  t.after(async()=>{await browser.close();await new Promise(done=>server.close(done))});
  const tab=await browser.newPage({viewport:{width:1366,height:900}});tab.setDefaultTimeout(7000);const errors=[];tab.on('pageerror',error=>errors.push(error.message));
  await tab.goto(`http://127.0.0.1:${server.address().port}/editor-v2/index.html?pageId=${pageId}`);await tab.locator(`.node[data-node-id="${textId}"]`).waitFor();
  await tab.locator('.rail-btn[data-tab="layers"]').click();await tab.locator(`.layer-row[data-node-id="${textId}"]`).waitFor();
  const source=tab.locator(`.layer-row[data-node-id="${textId}"]`),target=tab.locator(`.layer-row[data-node-id="${sectionId}"]`);
  await source.click();
  assert.equal(await tab.locator('#moveLayerUp').isDisabled(),false,'selected sibling can move up');
  assert.equal(await tab.locator('#moveLayerDown').isDisabled(),true,'last sibling cannot move down');
  assert.equal(await tab.locator('#indentLayer').isDisabled(),false,'compatible previous sibling can contain the selected layer');
  assert.equal(await tab.locator('#outdentLayer').isDisabled(),true,'root-level layer cannot be outdented');
  const originalIndent=await source.evaluate(row=>row.style.paddingLeft);
  await tab.locator('#indentLayer').click();assert.notEqual(await source.evaluate(row=>row.style.paddingLeft),originalIndent,'keyboard-accessible layer action nests into previous container');
  assert.equal(await tab.locator('#outdentLayer').isDisabled(),false,'nested layer can be outdented');
  await tab.locator('#outdentLayer').click();assert.equal(await source.evaluate(row=>row.style.paddingLeft),originalIndent,'outdent restores the root-level hierarchy');
  await tab.locator('#moveLayerUp').click();
  const rowOrder=()=>tab.locator('#layersTree .layer-row').evaluateAll(rows=>rows.map(row=>row.dataset.nodeId));
  assert.deepEqual((await rowOrder()).filter(id=>id!==rootId),[textId,sectionId],'move up reorders siblings through the canonical command');
  await tab.locator('#moveLayerDown').click();assert.deepEqual((await rowOrder()).filter(id=>id!==rootId),[sectionId,textId],'move down restores sibling order');
  await tab.locator('#undo').click();await tab.locator('#redo').click();
  const desktopDrop=await source.evaluate((row,{targetId})=>{
    const target=document.querySelector(`.layer-row[data-node-id="${targetId}"]`),dataTransfer=new DataTransfer();
    row.dispatchEvent(new DragEvent('dragstart',{bubbles:true,cancelable:true,dataTransfer}));
    const over=new DragEvent('dragover',{bubbles:true,cancelable:true,dataTransfer});target.dispatchEvent(over);
    target.dispatchEvent(new DragEvent('drop',{bubbles:true,cancelable:true,dataTransfer}));return over.defaultPrevented;
  },{targetId:sectionId});
  assert.equal(desktopDrop,true,'desktop drag accepts a valid reparent destination');
  const nestedText=()=>tab.locator(`.page-canvas .node[data-node-id="${sectionId}"] > .node[data-node-id="${textId}"]`);
  await tab.waitForFunction(({sectionId,textId})=>document.querySelector(`.page-canvas .node[data-node-id="${sectionId}"] > .node[data-node-id="${textId}"]`)!==null,{sectionId,textId});
  assert.equal(await nestedText().count(),1,'desktop drag reparents in the Canvas');
  await tab.locator('#undo').click();assert.equal(await nestedText().count(),0,'Undo restores the original sibling relationship');
  assert.equal(await tab.locator(`.page-canvas .node[data-node-id="${rootId}"] > .node[data-node-id="${textId}"]`).count(),1);
  await tab.locator('#redo').click();assert.equal(await nestedText().count(),1,'Redo reapplies the reparent');
  await tab.locator('#undo').click();
  await tab.setViewportSize({width:390,height:844});
  if(await tab.locator('#leftDock').evaluate(panel=>panel.classList.contains('closed')))await tab.locator('#editorMenu').click();
  await tab.locator('.rail-btn[data-tab="layers"]').click();
  assert.equal(await source.isVisible(),true,JSON.stringify(await tab.evaluate(()=>({left:document.querySelector('#leftDock')?.className,layerTab:[...document.querySelectorAll('.rail-btn')].find(b=>b.dataset.tab==='layers')?.className,content:document.querySelector('[data-content="layers"]')?.className,workspace:document.querySelector('.workspace')?.className,hidden:document.querySelector('.layer-row')?.getAttribute('hidden')}))));
  assert.equal(await target.isVisible(),true,JSON.stringify(await target.evaluate(row=>({cls:row.className,style:row.getAttribute('style'),rect:row.getBoundingClientRect().toJSON(),parent:row.parentElement?.outerHTML.slice(0,1000)}))));
  const mobileDrop=await source.evaluate(async(row,{targetId})=>{
    const handle=row.querySelector('.layer-drag-handle'),target=document.querySelector(`.layer-row[data-node-id="${targetId}"]`),box=target.getBoundingClientRect();
    const down=new PointerEvent('pointerdown',{pointerType:'touch',pointerId:41,clientX:row.getBoundingClientRect().x+10,clientY:row.getBoundingClientRect().y+10,bubbles:true,cancelable:true});handle.dispatchEvent(down);
    await new Promise(resolve=>setTimeout(resolve,500));
    const x=box.x+box.width/2,y=box.y+box.height/2;
    handle.dispatchEvent(new PointerEvent('pointermove',{pointerType:'touch',pointerId:41,clientX:x,clientY:y,bubbles:true,cancelable:true}));
    const preview=target.classList.contains('mobile-drag-over');
    handle.dispatchEvent(new PointerEvent('pointerup',{pointerType:'touch',pointerId:41,clientX:x,clientY:y,bubbles:true,cancelable:true}));
    return preview;
  },{targetId:sectionId});
  assert.equal(mobileDrop,true,'touch long-press previews a valid destination and commits on release');
  assert.equal(await nestedText().count(),1,'touch reparent updates the Canvas');
  await tab.locator('#save').click();await tab.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.startsWith('Mentve'));
  assert.deepEqual(draft.pages[pageId].nodes[sectionId].children,[textId],'touch reparent persists through Save');
  assert.equal(draft.pages[pageId].nodes[textId].parentId,sectionId);
  await tab.keyboard.press('Control+z');assert.equal(await nestedText().count(),0,'touch reparent remains undoable after Save');
  assert.deepEqual(errors,[]);
});
