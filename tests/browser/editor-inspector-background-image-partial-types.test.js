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
import {getElementCapability} from '../../public/editor-v2/core/capability-matrix.js';
import {listProperties} from '../../public/editor-v2/core/property-registry.js';
import {plainTextToRichText} from '../../public/editor-v2/core/richtext-engine.js';

const publicDir=resolve(import.meta.dirname,'../../public');
const backgroundAssets={
  desktop:{id:'a44f0ce3-6273-4a8f-991e-572c4a89cdd4',name:'Inspector-mátrix asztali háttér.png',color:'#16a34a'},
  tablet:{id:'a44f0ce3-6273-4a8f-991e-572c4a89cdd5',name:'Inspector-mátrix tablet háttér.png',color:'#2563eb'},
  mobile:{id:'a44f0ce3-6273-4a8f-991e-572c4a89cdd6',name:'Inspector-mátrix mobil háttér.png',color:'#db2777'}
};

test('background image media picker reaches Canvas, draft and public renderer for every Inspector-compatible PARTIAL type',async t=>{
  const model=createEditorState(createDocument(undefined,{modern:true}));
  const pageId=model.document.activePageId,rootId=model.document.pages[pageId].rootId;
  const nodes=[{type:NODE_TYPES.ROOT,id:rootId}];
  const authoredTypes=new Set(['heading','text','richtext','link','button']);
  for(const type of Object.values(NODE_TYPES)){
    if(type===NODE_TYPES.ROOT||getElementCapability(type).status!=='PARTIAL')continue;
    execute(model,{type:'element.add',payload:{type,parentId:rootId,authored:authoredTypes.has(type)}});
    const id=model.selection.primaryId;
    if(type==='richtext')execute(model,{type:'richtext.content.set',payload:{nodeId:id,document:plainTextToRichText('Inspector háttér teszt')}});
    else if(authoredTypes.has(type))execute(model,{type:'element.content.set',payload:{nodeId:id,content:'Inspector háttér teszt'}});
    if(type==='button'||type==='link')execute(model,{type:'content.properties.set',payload:{nodeId:id,patch:{href:'https://example.com'}}});
    nodes.push({type,id});
  }
  const applicable=nodes.filter(({type})=>listProperties({nodeType:type}).some(property=>property.id==='background.image'));
  assert.equal(nodes.length,45,'fixture contains root and all 44 editable PARTIAL types');
  assert.equal(applicable.length,45,'all current PARTIAL types register the background image field');

  let draft=structuredClone(model.document),published=structuredClone(draft),version=1;
  const server=createServer(async(req,res)=>{
    const url=new URL(req.url,'http://localhost');
    const json=data=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(data))};
    if(url.pathname==='/api/admin/media'&&!url.searchParams.has('id'))return json({ok:true,data:{assets:Object.values(backgroundAssets).map(asset=>({
      id:asset.id,name:asset.name,mimeType:'image/png',altText:'Teszt háttér',previewUrl:`/api/admin/media?id=${asset.id}`
    })),nextCursor:null}});
    const mediaId=url.pathname==='/api/admin/media'?url.searchParams.get('id'):url.pathname.startsWith('/media/')?url.pathname.slice('/media/'.length):null;
    const asset=Object.values(backgroundAssets).find(candidate=>candidate.id===mediaId);
    if(asset){
      res.setHeader('content-type','image/svg+xml');
      return res.end(`<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><rect width="8" height="8" fill="${asset.color}"/></svg>`);
    }
    if(url.pathname==='/api/admin/pages')return json({ok:true,data:url.searchParams.get('archived')==='1'?[]:[{id:pageId,slug:'inspector-background-image-matrix',title:'Inspector background matrix',content:draft,revision:version,isPublished:true}]});
    if(url.pathname==='/api/admin/editor'){
      if(req.method==='GET')return json({ok:true,data:{page:{id:pageId,document:draft,publishedRevisionId:'published'},revisions:[{id:'revision-'+version,version}]}});
      let body='';for await(const chunk of req)body+=chunk;
      const request=JSON.parse(body);draft=structuredClone(request.document);version++;
      if(request.publish)published=structuredClone(draft);
      return json({ok:true,data:{pageId,version,revisionId:'revision-'+version,published:Boolean(request.publish)}});
    }
    if(url.pathname==='/api/public/pages')return json({ok:true,data:{id:pageId,slug:'inspector-background-image-matrix',title:'Inspector background matrix',description:'',content:published.pages[pageId]}});
    if(url.pathname==='/api/public/navigation')return json({ok:true,data:{items:[]}});
    if(url.pathname==='/api/integrations/twitch/connection')return json({ok:true,data:{connected:false}});
    if(url.pathname.startsWith('/api/'))return json({ok:true,data:{siteName:'Inspector test'}});
    const file=resolve(publicDir,'.'+(url.pathname==='/p/test'?'/visual-page.html':url.pathname));
    if(!file.startsWith(publicDir+'/'))return res.writeHead(403).end();
    try{res.setHeader('content-type',{'.html':'text/html','.js':'text/javascript','.css':'text/css'}[extname(file)]||'application/octet-stream');res.end(await readFile(file))}
    catch{res.writeHead(404).end()}
  });
  await new Promise(done=>server.listen(0,'127.0.0.1',done));
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
  t.after(async()=>{await browser.close();await new Promise(done=>server.close(done))});
  const base=`http://127.0.0.1:${server.address().port}`;
  const editor=await browser.newPage({viewport:{width:1366,height:900}}),viewer=await browser.newPage({viewport:{width:1366,height:900}});
  editor.setDefaultTimeout(20000);viewer.setDefaultTimeout(20000);
  const errors=[];editor.on('pageerror',error=>errors.push(error.message));viewer.on('pageerror',error=>errors.push(error.message));
  await editor.goto(base+'/editor-v2/index.html');await viewer.goto(base+'/p/test');
  if(await editor.locator('#rightDock').evaluate(el=>el.classList.contains('closed')))await editor.locator('#openInspector').click();
  const canvasNode=id=>editor.locator(`.node[data-node-id="${id}"]`);
  const publicNode=id=>id===rootId?viewer.locator(`#content-canvas[data-node-id="${id}"]`):viewer.locator(`.visual-editor-node[data-node-id="${id}"]`);
  const canvasImage=id=>canvasNode(id).evaluate(el=>getComputedStyle(el).backgroundImage);
  const publicImage=id=>publicNode(id).evaluate(el=>getComputedStyle(el).backgroundImage);
  const inspector=editor.locator('#inspectorBody');
  const widths={desktop:1366,tablet:768,mobile:390};
  const activateEditorDevice=async device=>{
    const button=editor.locator(`.canvas-device-btn[data-device="${device}"]`);
    if(!await button.evaluate(el=>el.classList.contains('active')))await button.click();
  };
  const activateViewerDevice=async device=>{
    const width=widths[device],changed=await viewer.evaluate(next=>window.innerWidth!==next,width);
    const rendered=changed?viewer.waitForResponse(response=>response.url().includes('/api/public/presentation')):null;
    await viewer.setViewportSize({width,height:900});
    if(rendered)await rendered;
    await viewer.waitForFunction(({expected,id})=>window.innerWidth===expected&&document.querySelector(`[data-node-id="${id}"]`)!==null,{expected:width,id:rootId});
  };
  const publicBaseline={};
  for(const device of Object.keys(widths)){
    await activateViewerDevice(device);
    publicBaseline[device]=Object.fromEntries(await Promise.all(applicable.map(async({id})=>[id,await publicImage(id)])));
  }
  await activateViewerDevice('desktop');

  for(const {type,id} of applicable){
    const node=canvasNode(id);
    assert.equal(await node.count(),1,`${type}: Canvas renders the fixture node`);
    await node.evaluate(el=>{if(!el.classList.contains('selected'))el.click()});
    const tab=editor.locator('.inspector-tabs button').first();
    if(await tab.getAttribute('aria-selected')!=='true')await tab.click();
    const field=inspector.locator('.typed-inspector-field[data-property-id="background.image"]');
    assert.equal(await field.count(),1,`${type}: image field is present in the actual Inspector`);
    assert.equal(await field.getAttribute('data-property-command'),'responsive.set',`${type}: Inspector uses the registered responsive command`);
    assert.equal(await field.getAttribute('data-property-key'),'backgroundAssetId',`${type}: Inspector writes the registered Page Model key`);
    const group=field.locator('xpath=ancestor::section[1]'),title=group.locator(':scope > .inspector-group-title');
    if(await title.getAttribute('aria-expanded')==='false')await title.click();
    const picker=field.locator('.editor-media-picker');
    await picker.getByRole('button',{name:'Médiatár megnyitása'}).click();
    await picker.locator('[role="region"][aria-label="Médiatár találatok"]').waitFor();
    await picker.getByRole('button',{name:backgroundAssets.desktop.name+' kiválasztása',exact:true}).click();
    assert.ok((await canvasImage(id)).includes(`/api/admin/media?id=${backgroundAssets.desktop.id}`),`${type}: desktop picker selection reaches the authenticated Canvas renderer`);
  }
  for(const device of ['tablet','mobile']){
    await activateEditorDevice(device);
    for(const {type,id} of applicable){
      const node=canvasNode(id);
      await node.evaluate(el=>{if(!el.classList.contains('selected'))el.click()});
      const field=inspector.locator('.typed-inspector-field[data-property-id="background.image"]');
      assert.equal(await field.getAttribute('data-property-command'),'responsive.set',`${type}/${device}: responsive command`);
      assert.equal(await field.getAttribute('data-property-key'),'backgroundAssetId',`${type}/${device}: Page Model key`);
      const group=field.locator('xpath=ancestor::section[1]'),title=group.locator(':scope > .inspector-group-title');
      if(await title.getAttribute('aria-expanded')==='false')await title.click();
      const picker=field.locator('.editor-media-picker');
      await picker.getByRole('button',{name:'Médiatár megnyitása'}).click();
      await picker.locator('[role="region"][aria-label="Médiatár találatok"]').waitFor();
      await picker.getByRole('button',{name:backgroundAssets[device].name+' kiválasztása',exact:true}).click();
      assert.ok((await canvasImage(id)).includes(`/api/admin/media?id=${backgroundAssets[device].id}`),`${type}/${device}: picker selection reaches the authenticated Canvas renderer`);
    }
  }

  // Exercise history on the final type while keeping the all-type route matrix
  // in a single draft and publication lifecycle. Mobile reset cascades to the
  // tablet asset, and Redo restores only the mobile asset.
  const last=applicable.at(-1);
  assert.ok((await canvasImage(last.id)).includes(`/api/admin/media?id=${backgroundAssets.mobile.id}`));
  await editor.locator('#undo').click();
  assert.ok((await canvasImage(last.id)).includes(`/api/admin/media?id=${backgroundAssets.tablet.id}`),`${last.type}: Undo removes mobile override and reveals tablet inheritance`);
  await editor.locator('#redo').click();
  assert.ok((await canvasImage(last.id)).includes(`/api/admin/media?id=${backgroundAssets.mobile.id}`),`${last.type}: Redo restores the mobile selection`);
  await editor.locator('#save').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.startsWith('Mentve'));
  for(const {type,id} of applicable){
    for(const device of Object.keys(widths)){
      assert.equal(draft.pages[pageId].nodes[id].responsive[device].backgroundAssetId,backgroundAssets[device].id,`${type}/${device}: Save persists the selected asset ID`);
      assert.equal(published.pages[pageId].nodes[id].responsive?.[device]?.backgroundAssetId,undefined,`${type}/${device}: draft Save leaves public content unchanged`);
    }
  }
  for(const device of Object.keys(widths)){
    await activateViewerDevice(device);
    for(const {type,id} of applicable)assert.equal(await publicImage(id),publicBaseline[device][id],`${type}/${device}: unsaved publication snapshot stays unchanged`);
  }
  await viewer.reload({waitUntil:'domcontentloaded'});
  await activateViewerDevice('desktop');
  await editor.reload({waitUntil:'domcontentloaded'});
  for(const device of Object.keys(widths)){
    await activateEditorDevice(device);
    for(const {type,id} of applicable){
      await canvasNode(id).evaluate(el=>el.click());
      assert.ok((await canvasImage(id)).includes(`/api/admin/media?id=${backgroundAssets[device].id}`),`${type}/${device}: draft selection survives Editor reload`);
    }
  }
  const previousStatus=await editor.locator('#saveStatus').textContent();
  await editor.locator('#publish').click();
  await editor.waitForFunction(previous=>document.querySelector('#saveStatus')?.textContent!==previous,previousStatus);
  assert.match(await editor.locator('#saveStatus').textContent(),/^Publikálva/,`explicit Publish should succeed: ${await editor.locator('#saveStatus').textContent()}`);
  await viewer.reload();
  for(const {type,id} of applicable){
    for(const device of Object.keys(widths))assert.equal(published.pages[pageId].nodes[id].responsive[device].backgroundAssetId,backgroundAssets[device].id,`${type}/${device}: explicit Publish copies the image ID to the public snapshot`);
  }
  for(const device of Object.keys(widths)){
    await activateViewerDevice(device);
    for(const {type,id} of applicable)assert.ok((await publicImage(id)).includes(`/media/${backgroundAssets[device].id}`),`${type}/${device}: public renderer resolves the image through its public media route`);
  }

  // Removal hides the inherited image at the current breakpoint by writing
  // the explicit `none` value. The separate inheritance reset then removes
  // that override and reveals the next responsive ancestor.
  for(const device of ['mobile','tablet','desktop']){
    await activateEditorDevice(device);
    for(const {type,id} of applicable){
      await canvasNode(id).evaluate(el=>el.click());
      const field=inspector.locator('.typed-inspector-field[data-property-id="background.image"]');
      assert.equal(await field.getAttribute('data-property-command'),'responsive.set',`${type}/${device}: reset command`);
      assert.equal(await field.getAttribute('data-property-key'),'backgroundAssetId',`${type}/${device}: reset Page Model key`);
      const group=field.locator('xpath=ancestor::section[1]'),title=group.locator(':scope > .inspector-group-title');
      if(await title.getAttribute('aria-expanded')==='false')await title.click();
      const picker=field.locator('.editor-media-picker');
      await picker.getByRole('button',{name:'Kép eltávolítása',exact:true}).click();
      for(const asset of Object.values(backgroundAssets))assert.equal((await canvasImage(id)).includes(`/api/admin/media?id=${asset.id}`),false,`${type}/${device}: removing the image hides inherited and explicitly selected assets at this breakpoint`);
    }
    await editor.locator('#save').click();
    await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.startsWith('Mentve'));
    await activateViewerDevice(device);
    for(const {type,id} of applicable){
      assert.equal(draft.pages[pageId].nodes[id].responsive[device].backgroundAssetId,'none',`${type}/${device}: draft Save persists explicit image removal as none`);
      assert.equal(published.pages[pageId].nodes[id].responsive[device].backgroundAssetId,backgroundAssets[device].id,`${type}/${device}: draft image removal does not alter the published asset ID`);
      assert.ok((await publicImage(id)).includes(`/media/${backgroundAssets[device].id}`),`${type}/${device}: removed draft image remains public until Publish`);
    }
    for(const {type,id} of applicable){
      await canvasNode(id).evaluate(el=>el.click());
      const field=inspector.locator('.typed-inspector-field[data-property-id="background.image"]');
      const group=field.locator('xpath=ancestor::section[1]'),title=group.locator(':scope > .inspector-group-title');
      if(await title.getAttribute('aria-expanded')==='false')await title.click();
      const reset=inspector.locator(`.property-reset[data-property-key="backgroundAssetId"]`).filter({hasText:'Öröklés visszaállítása'});
      assert.equal(await reset.count(),1,`${type}/${device}: explicit none remains a resettable responsive override`);
      await reset.click();
      const ancestor=device==='mobile'?'tablet':device==='tablet'?'desktop':null;
      const image=await canvasImage(id);
      if(ancestor)assert.ok(image.includes(`/api/admin/media?id=${backgroundAssets[ancestor].id}`),`${type}/${device}: inheritance reset reveals the ${ancestor} asset`);
      else for(const asset of Object.values(backgroundAssets))assert.equal(image.includes(`/api/admin/media?id=${asset.id}`),false,`${type}/desktop: inheritance reset restores the original base style`);
    }
  }
  const resetHistoryTarget=applicable.at(-1);
  await editor.locator('#undo').click();
  assert.equal(await inspector.locator('.property-reset[data-property-key="backgroundAssetId"]').filter({hasText:'Öröklés visszaállítása'}).count(),1,`${resetHistoryTarget.type}: Undo restores the explicit desktop none override`);
  await editor.locator('#redo').click();
  assert.equal(await inspector.locator('.property-reset[data-property-key="backgroundAssetId"]').filter({hasText:'Öröklés visszaállítása'}).count(),0,`${resetHistoryTarget.type}: Redo removes the desktop override again`);
  const clearedImage=await canvasImage(resetHistoryTarget.id);
  for(const asset of Object.values(backgroundAssets))assert.equal(clearedImage.includes(`/api/admin/media?id=${asset.id}`),false,`${resetHistoryTarget.type}: Redo clears the desktop asset again`);
  await editor.locator('#save').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.startsWith('Mentve'));
  for(const {type,id} of applicable){
    for(const device of Object.keys(widths)){
      assert.equal(draft.pages[pageId].nodes[id].responsive[device].backgroundAssetId,undefined,`${type}/${device}: reset Save removes the draft asset reference`);
      assert.equal(published.pages[pageId].nodes[id].responsive[device].backgroundAssetId,backgroundAssets[device].id,`${type}/${device}: reset Save preserves the published asset`);
    }
  }
  for(const device of Object.keys(widths)){
    await activateViewerDevice(device);
    for(const {type,id} of applicable)assert.ok((await publicImage(id)).includes(`/media/${backgroundAssets[device].id}`),`${type}/${device}: draft reset leaves the published media URL unchanged`);
  }
  await editor.reload({waitUntil:'domcontentloaded'});
  for(const device of Object.keys(widths)){
    await activateEditorDevice(device);
    for(const {type,id} of applicable){
      await canvasNode(id).evaluate(el=>el.click());
      const image=await canvasImage(id);
      for(const asset of Object.values(backgroundAssets))assert.equal(image.includes(`/api/admin/media?id=${asset.id}`),false,`${type}/${device}: cleared draft survives Editor reload`);
    }
  }
  await editor.locator('#publish').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.startsWith('Publikálva'));
  await viewer.reload();
  for(const device of Object.keys(widths)){
    await activateViewerDevice(device);
    for(const {type,id} of applicable)assert.equal(await publicImage(id),publicBaseline[device][id],`${type}/${device}: explicit reset Publish restores the public baseline`);
  }
  assert.deepEqual(errors,[],'media picker and both renderers produce no uncaught browser errors');
});
