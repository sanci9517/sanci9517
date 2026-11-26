import assert from 'node:assert/strict';
import test from 'node:test';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve,extname} from 'node:path';
import {chromium} from 'playwright';
import {createDocument,createNode,NODE_TYPES} from '../../public/editor-v2/core/schema.js';

const root=resolve(import.meta.dirname,'../../public');

test('node clipboard keyboard flow duplicates nested nodes into the draft; Save stays separate from Publish',async t=>{
  const initial=createDocument(),pageId=initial.activePageId,page=initial.pages[pageId];
  const section=createNode(NODE_TYPES.SECTION,{name:'Másolási próba',parentId:page.rootId});
  const copyText=createNode(NODE_TYPES.TEXT,{name:'Beágyazott szöveg',parentId:section.id,props:{text:'Másolatba kerül'}});
  const tabs=createNode(NODE_TYPES.TABS,{name:'Célfülek',parentId:section.id,props:{items:[{title:'Első fül'}]}});
  const actionButton=createNode(NODE_TYPES.BUTTON,{name:'Belső oldalinterakció',parentId:section.id,props:{text:'Fülre ugrás',href:''},metadata:{contentVersion:1}});
  actionButton.interactions=[{schemaVersion:1,event:'click',action:'select-tab',targetId:tabs.id,itemIndex:0}];
  section.children.push(copyText.id,tabs.id,actionButton.id);
  const first=createNode(NODE_TYPES.TEXT,{name:'Első kijelölhető',parentId:page.rootId,props:{text:'Első kijelölhető'}});
  const last=createNode(NODE_TYPES.TEXT,{name:'Utolsó kijelölhető',parentId:page.rootId,props:{text:'Utolsó kijelölhető'}});
  page.nodes[section.id]=section;page.nodes[copyText.id]=copyText;page.nodes[tabs.id]=tabs;page.nodes[actionButton.id]=actionButton;
  page.nodes[first.id]=first;page.nodes[last.id]=last;page.nodes[page.rootId].children.push(first.id,section.id,last.id);
  let draft=structuredClone(initial),published=null,revision=1;const posts=[];
  const server=createServer(async(req,res)=>{
    const url=new URL(req.url,'http://localhost');
    const json=data=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(data))};
    if(url.pathname==='/api/admin/pages')return json({ok:true,data:url.searchParams.get('archived')==='1'?[]:[{id:pageId,slug:'clipboard',title:'Clipboard',content:draft,revision,isPublished:Boolean(published)}]});
    if(url.pathname==='/api/admin/editor'){
      if(req.method==='GET')return json({ok:true,data:{page:{id:pageId,document:draft,publishedRevisionId:published?'published':null},revisions:[{id:'revision-'+revision,version:revision}]}});
      let body='';for await(const chunk of req)body+=chunk;
      const request=JSON.parse(body);posts.push(request);draft=structuredClone(request.document);revision++;
      if(request.publish)published=structuredClone(draft);
      return json({ok:true,data:{pageId,version:revision,revisionId:'revision-'+revision,published:Boolean(request.publish)}});
    }
    if(url.pathname==='/api/public/pages')return json(published?{ok:true,data:{id:pageId,slug:'clipboard',title:'Clipboard',content:published.pages[pageId]}}:{ok:false});
    if(url.pathname==='/api/public/navigation')return json({ok:true,data:{items:[]}});
    if(url.pathname==='/api/integrations/twitch/connection')return json({ok:true,data:{connected:false}});
    if(url.pathname.startsWith('/api/'))return json({ok:true,data:{siteName:'Clipboard test'}});
    const asset=url.pathname==='/p/clipboard'?'/visual-page.html':url.pathname;
    const file=resolve(root,'.'+asset);
    if(!file.startsWith(root+'/')){res.writeHead(403).end();return}
    try{res.setHeader('content-type',{'.html':'text/html','.js':'text/javascript','.css':'text/css'}[extname(file)]||'application/octet-stream');res.end(await readFile(file))}
    catch{res.writeHead(404).end()}
  });
  await new Promise(done=>server.listen(0,'127.0.0.1',done));
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
  t.after(async()=>{await browser.close();await new Promise(done=>server.close(done))});

  const tab=await browser.newPage({viewport:{width:1366,height:900}});tab.setDefaultTimeout(10000);
  const errors=[];tab.on('pageerror',error=>errors.push(error.message));
  await tab.goto(`http://127.0.0.1:${server.address().port}/editor-v2/index.html`);
  await tab.locator('.rail-btn[data-tab="layers"]').click();

  await tab.locator(`#layersTree .layer-row[data-node-id="${section.id}"]`).click();
  assert.equal(await tab.locator('#selection').textContent(),`Kijelölés: ${section.id}`,'layer selection focuses the source before keyboard copy');
  await tab.locator('.more-actions > summary').click();
  await tab.locator('#nodeClipboardMenu > summary').click();
  assert.equal(await tab.locator('#copyNodes').isEnabled(),true,'the pointer copy action is available for a valid selection');
  assert.equal(await tab.locator('#pasteNodes').isEnabled(),false,'paste remains disabled until a same-page clipboard snapshot exists');
  await tab.locator('.more-actions > summary').click();

  // The new keyboard range selection must feed the exact same clipboard path
  // as pointer/modifier selection, including a nested subtree and one undoable
  // draft paste. This catches regressions at the EDT-037/EDT-038 boundary.
  const firstRow=tab.locator(`#layersTree .layer-row[data-node-id="${first.id}"]`);
  const sectionRow=tab.locator(`#layersTree .layer-row[data-node-id="${section.id}"]`);
  await firstRow.click();
  assert.equal(await firstRow.evaluate(row=>document.activeElement===row),true,'clicking a layer keeps keyboard focus on the rerendered row');
  await tab.keyboard.press('Shift+ArrowDown');
  await tab.waitForFunction(({firstId,sectionId})=>{
    const firstRow=document.querySelector(`.layer-row[data-node-id="${CSS.escape(firstId)}"]`);
    const sectionRow=document.querySelector(`.layer-row[data-node-id="${CSS.escape(sectionId)}"]`);
    return firstRow?.getAttribute('aria-pressed')==='true'&&sectionRow?.getAttribute('aria-pressed')==='true'&&document.activeElement===sectionRow;
  },{firstId:first.id,sectionId:section.id});
  await tab.keyboard.press('Control+c');
  await tab.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.includes('2 elem másolva'));
  await tab.keyboard.press('Control+v');
  await tab.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.includes('2 elem beillesztve'));
  const copiedFirstRows=tab.locator(`#layersTree .layer-row strong`);
  assert.equal(await copiedFirstRows.filter({hasText:'Első kijelölhető'}).count(),2,'Shift-selected root siblings are both copied');
  assert.equal(await copiedFirstRows.filter({hasText:'Másolási próba'}).count(),2,'the copied sibling retains its nested subtree root');
  const rangeCopyRows=await tab.locator('#layersTree .layer-row').evaluateAll(rows=>rows.map(row=>({id:row.dataset.nodeId,label:row.querySelector('strong')?.textContent})));
  const clonedSectionId=rangeCopyRows.find(row=>row.id!==first.id&&row.id!==section.id&&row.label==='Másolási próba másolat')?.id;
  assert.ok(clonedSectionId,'the keyboard range clipboard contains the cloned section');
  assert.ok(await tab.locator(`#canvas .node[data-node-id="${clonedSectionId}"]`).getByText('Másolatba kerül',{exact:true}).count(),'the copied section includes its child content');
  assert.equal(posts.length,0,'keyboard range paste stays local until the separate Save action');
  await tab.keyboard.press('Control+z');
  await tab.locator(`#layersTree .layer-row[data-node-id="${clonedSectionId}"]`).waitFor({state:'detached'});
  assert.equal(await copiedFirstRows.filter({hasText:'Első kijelölhető'}).count(),1,'one Undo removes the entire keyboard range paste');
  await tab.keyboard.press('Control+Shift+z');
  await tab.locator(`#layersTree .layer-row[data-node-id="${clonedSectionId}"]`).waitFor({state:'visible'});

  // The multi-selection contract is driven through the actual Layers UI. Select
  // in reverse canvas order to prove clipboard order is deterministic, and
  // ensure one Undo/Redo treats both pasted roots as a single operation.
  await tab.locator(`#layersTree .layer-row[data-node-id="${last.id}"]`).click();
  await tab.locator(`#layersTree .layer-row[data-node-id="${first.id}"]`).click({modifiers:['Control']});
  await tab.keyboard.press('Control+c');
  await tab.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.includes('2 elem másolva'));
  await tab.keyboard.press('Control+v');
  await tab.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.includes('2 elem beillesztve'));
  const copiedFirst=tab.locator('#canvas .page-canvas > .node > .node').filter({hasText:'Első kijelölhető'}).last();
  const copiedLast=tab.locator('#canvas .page-canvas > .node > .node').filter({hasText:'Utolsó kijelölhető'}).last();
  const copiedFirstId=await copiedFirst.getAttribute('data-node-id');
  const copiedLastId=await copiedLast.getAttribute('data-node-id');
  assert.notEqual(copiedFirstId,first.id);
  assert.notEqual(copiedLastId,last.id);
  const directChildIds=await tab.locator('#canvas .page-canvas > .node > .node').evaluateAll(nodes=>nodes.map(node=>node.dataset.nodeId));
  assert.ok(directChildIds.indexOf(copiedFirstId)<directChildIds.indexOf(copiedLastId),'multi-paste follows canvas order, not modifier-click order');
  assert.equal(posts.length,0,'multi-copy/paste remains a local draft change before Save');
  await tab.keyboard.press('Control+z');
  assert.equal(await tab.locator(`#canvas .node[data-node-id="${copiedFirstId}"],#canvas .node[data-node-id="${copiedLastId}"]`).count(),0,
    'one Undo removes every root from the multi-paste batch');
  await tab.keyboard.press('Control+Shift+z');
  await tab.locator(`#canvas .node[data-node-id="${copiedFirstId}"]`).waitFor();
  await tab.locator(`#canvas .node[data-node-id="${copiedLastId}"]`).waitFor();

  await tab.locator(`#layersTree .layer-row[data-node-id="${section.id}"]`).click();
  await tab.keyboard.press('Control+c');
  await tab.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.includes('másolva'));
  await tab.locator('.more-actions > summary').click();
  await tab.locator('#nodeClipboardMenu > summary').click();
  assert.equal(await tab.locator('#pasteNodes').isEnabled(),true,'copy enables the explicit pointer paste action');
  await tab.locator('.more-actions > summary').click();
  await tab.locator(`#layersTree .layer-row[data-node-id="${section.id}"]`).click();
  const copiedRootIdsBeforePaste=await tab.locator('#layersTree .layer-row').evaluateAll(rows=>rows.filter(row=>row.querySelector('strong')?.textContent==='Másolási próba másolat').map(row=>row.dataset.nodeId));
  await tab.keyboard.press('Control+v');
  await tab.waitForFunction(previousIds=>[...document.querySelectorAll('#layersTree .layer-row')]
    .some(row=>row.querySelector('strong')?.textContent==='Másolási próba másolat'&&!previousIds.includes(row.dataset.nodeId)),copiedRootIdsBeforePaste);
  const copiedRootRows=await tab.locator('#layersTree .layer-row').evaluateAll(rows=>rows
    .filter(row=>row.querySelector('strong')?.textContent==='Másolási próba másolat')
    .map(row=>({id:row.dataset.nodeId,label:row.querySelector('strong')?.textContent})));
  const copiedId=copiedRootRows.find(row=>!copiedRootIdsBeforePaste.includes(row.id))?.id;
  assert.ok(copiedId,'the latest paste has a new section root');
  const copiedRoot=tab.locator(`#canvas .node[data-node-id="${copiedId}"]`);
  assert.notEqual(copiedId,section.id);
  assert.match(await copiedRoot.textContent(),/Másolatba kerül/,'paste includes the nested subtree');
  assert.equal(posts.length,0,'copy and paste only change the local editor draft before Save');

  await tab.keyboard.press('Control+z');
  assert.equal(await tab.locator(`#canvas .node[data-node-id="${copiedId}"]`).count(),0,'one Undo removes the complete paste operation');
  await tab.keyboard.press('Control+Shift+z');
  await tab.locator(`#canvas .node[data-node-id="${copiedId}"]`).waitFor();
  await tab.locator('#save').click();
  await tab.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.startsWith('Mentve'));
  assert.equal(posts.at(-1).publish,false);
  assert.equal(published,null,'Save does not publish pasted content');
  assert.ok(draft.pages[pageId].nodes[copiedId]);
  const pastedChildren=draft.pages[pageId].nodes[copiedId].children;
  const pastedTabs=draft.pages[pageId].nodes[pastedChildren[1]];
  const pastedActionButton=draft.pages[pageId].nodes[pastedChildren[2]];
  assert.equal(pastedActionButton.interactions[0].targetId,pastedTabs.id,'copied internal page actions target their copied component');

  await tab.reload();
  await tab.locator(`#canvas .node[data-node-id="${copiedId}"]`).waitFor();
  assert.equal(published,null,'the copied subtree is present in the saved draft only');
  await tab.locator('#publish').click();
  await tab.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent==='Publikálva');
  assert.equal(posts.at(-1).publish,true);
  const publicTab=await browser.newPage({viewport:{width:390,height:844}});
  await publicTab.goto(`http://127.0.0.1:${server.address().port}/p/clipboard`);
  await publicTab.getByText('Másolatba kerül',{exact:true}).last().waitFor();

  // Exercise the mobile long-press selection path and mobile action bar with
  // touch PointerEvents in Chromium. This is automated browser coverage, not
  // the full Editor's deferred physical-device acceptance.
  const postsBeforeMobile=posts.length;
  const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const touch={pointerId:7,pointerType:'touch',isPrimary:true,button:0,buttons:1,clientX:20,clientY:20};
  await mobile.goto(`http://127.0.0.1:${server.address().port}/editor-v2/index.html`);
  const firstTouch=mobile.locator(`#canvas .node[data-node-id="${first.id}"]`);
  await firstTouch.dispatchEvent('pointerdown',touch);
  await mobile.waitForTimeout(500);
  await mobile.locator('#mobileMultiSelectBar:not([hidden])').waitFor();
  await firstTouch.dispatchEvent('pointerup',{...touch,buttons:0});
  const lastTouch=mobile.locator(`#canvas .node[data-node-id="${last.id}"]`);
  await lastTouch.dispatchEvent('pointerdown',touch);
  await lastTouch.dispatchEvent('pointerup',{...touch,buttons:0});
  await mobile.waitForFunction(()=>document.querySelector('#mobileSelectionCount')?.textContent==='2 elem kijelölve');
  assert.equal(await mobile.locator('#mobileCopyNodes').isEnabled(),true,'mobile multi-select exposes its copy action');
  await mobile.locator('#mobileCopyNodes').click();
  await mobile.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.includes('2 elem másolva'));
  assert.equal(await mobile.locator('#mobilePasteNodes').isEnabled(),true,'copy enables the mobile paste action');
  await mobile.locator('#mobilePasteNodes').click();
  await mobile.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.includes('2 elem beillesztve'));
  const mobileClones=mobile.locator('#canvas .page-canvas > .node > .node').filter({hasText:/Első kijelölhető|Utolsó kijelölhető/});
  assert.equal(await mobileClones.count(),7,'mobile paste appends two roots alongside the original, keyboard-range clone and saved desktop copies');
  assert.equal(posts.length,postsBeforeMobile,'mobile copy/paste adds no server write before an explicit Save');
  await mobile.locator('#mobileUndo').click();
  assert.equal(await mobileClones.count(),5,'one mobile Undo removes both pasted roots and keeps the original and desktop copies');
  assert.deepEqual(errors,[]);
});
