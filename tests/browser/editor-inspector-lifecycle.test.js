import assert from 'node:assert/strict';
import test from 'node:test';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve, extname} from 'node:path';
import {chromium} from 'playwright';
import {createDocument, NODE_TYPES} from '../../public/editor-v2/core/schema.js';
import {createEditorState} from '../../public/editor-v2/core/state.js';
import {execute} from '../../public/editor-v2/core/commands.js';
import {listProperties} from '../../public/editor-v2/core/property-registry.js';

const root=resolve(import.meta.dirname,'../../public');
const inspectorBackgroundAssetId='a44f0ce3-6273-4a8f-991e-572c4a89cdd1';
const inspectorMobileBackgroundAssetId='a44f0ce3-6273-4a8f-991e-572c4a89cdd2';
const inspectorTabletBackgroundAssetId='a44f0ce3-6273-4a8f-991e-572c4a89cdd3';

test('real Inspector layout survives selection, undo, save/reload and separate publish with canvas/public parity',async t=>{
  const model=createEditorState(createDocument());
  const pageId=model.document.activePageId;
  const rootId=model.document.pages[pageId].rootId;
  execute(model,{type:'element.add',payload:{type:NODE_TYPES.GRID,parentId:model.document.pages[pageId].rootId}});
  const gridId=model.selection.primaryId;
  execute(model,{type:'element.update',payload:{nodeId:gridId,patch:{name:'<img src=x onerror=alert(1)>'}}});
  execute(model,{type:'element.add',payload:{type:NODE_TYPES.TEXT,parentId:gridId,props:{text:'Grid item'}}});
  const itemId=model.selection.primaryId;
  execute(model,{type:'element.add',payload:{type:NODE_TYPES.FLEX,parentId:model.document.pages[pageId].rootId}});
  const flexId=model.selection.primaryId;
  execute(model,{type:'element.add',payload:{type:NODE_TYPES.TEXT,parentId:flexId,props:{text:'Flex item'}}});
  const flexItemId=model.selection.primaryId;
  execute(model,{type:'element.add',payload:{type:NODE_TYPES.TEXT,parentId:model.document.pages[pageId].rootId,props:{text:'Offset item'}}});
  const offsetId=model.selection.primaryId;
  execute(model,{type:'element.add',payload:{type:NODE_TYPES.BUTTON,parentId:rootId,authored:true,props:{text:'Default CTA',href:'#default-cta'}}});
  const buttonId=model.selection.primaryId;
  execute(model,{type:'element.add',payload:{type:NODE_TYPES.LINK,parentId:rootId,authored:true,props:{text:'Default link',href:'/default-link'}}});
  const linkId=model.selection.primaryId;
  execute(model,{type:'element.add',payload:{type:NODE_TYPES.TEXT,parentId:rootId,name:'Inspector fallback'}});
  const fallbackTextId=model.selection.primaryId;
  execute(model,{type:'element.add',payload:{type:NODE_TYPES.HEADING,parentId:rootId,props:{text:'Inspector heading'}}});
  const headingId=model.selection.primaryId;
  let draft=structuredClone(model.document), published=null, version=1;
  const posts=[];
  const server=createServer(async(req,res)=>{
    const url=new URL(req.url,'http://localhost');
    const json=data=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(data))};
    if(url.pathname==='/api/admin/media'&&!url.searchParams.has('id'))return json({ok:true,data:{assets:[{
      id:inspectorBackgroundAssetId,name:'Inspector háttér.png',mimeType:'image/png',altText:'Dekoratív teszt-háttér',
      previewUrl:`/api/admin/media?id=${inspectorBackgroundAssetId}`
    },{
      id:inspectorMobileBackgroundAssetId,name:'Mobil Inspector háttér.png',mimeType:'image/png',altText:'Mobil teszt-háttér',
      previewUrl:`/api/admin/media?id=${inspectorMobileBackgroundAssetId}`
    },{
      id:inspectorTabletBackgroundAssetId,name:'Tablet Inspector háttér.png',mimeType:'image/png',altText:'Tablet teszt-háttér',
      previewUrl:`/api/admin/media?id=${inspectorTabletBackgroundAssetId}`
    }],nextCursor:null}});
    const mediaId=url.pathname==='/api/admin/media'?url.searchParams.get('id'):url.pathname.startsWith('/media/')?url.pathname.slice('/media/'.length):null;
    if([inspectorBackgroundAssetId,inspectorMobileBackgroundAssetId,inspectorTabletBackgroundAssetId].includes(mediaId)){
      const fill=mediaId===inspectorMobileBackgroundAssetId?'#db2777':mediaId===inspectorTabletBackgroundAssetId?'#2563eb':'#16a34a';
      res.setHeader('content-type','image/svg+xml');return res.end(`<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><rect width="8" height="8" fill="${fill}"/></svg>`);
    }
    if(url.pathname==='/api/admin/pages')return json({ok:true,data:url.searchParams.get('archived')==='1'?[]:[{id:pageId,slug:'test',title:'Test',content:draft,revision:version,isPublished:Boolean(published)}]});
    if(url.pathname==='/api/admin/editor'){
      if(req.method==='GET')return json({ok:true,data:{page:{id:pageId,document:draft,publishedRevisionId:published?'published':null},revisions:[{id:'revision-'+version,version}]}});
      let body='';for await(const chunk of req)body+=chunk;
      const request=JSON.parse(body);posts.push(request);draft=structuredClone(request.document);version++;
      if(request.publish)published=structuredClone(draft);
      return json({ok:true,data:{pageId,version,revisionId:'revision-'+version}});
    }
    if(url.pathname==='/api/public/pages')return json(published?{ok:true,data:{id:pageId,slug:'test',title:'Test',content:published.pages[pageId]}}:{ok:false});
    if(url.pathname==='/api/public/navigation')return json({ok:true,data:{items:[]}});
    if(url.pathname==='/api/integrations/twitch/connection')return json({ok:true,data:{connected:false}});
    if(url.pathname.startsWith('/api/'))return json({ok:true,data:{siteName:'Test'}});
    const asset=url.pathname==='/p/test'?'/visual-page.html':url.pathname;
    const file=resolve(root,'.'+asset);
    if(!file.startsWith(root+'/')){res.writeHead(403).end();return}
    try{res.setHeader('content-type',{'.html':'text/html','.js':'text/javascript','.css':'text/css'}[extname(file)]||'application/octet-stream');res.end(await readFile(file))}
    catch{res.writeHead(404).end()}
  });
  await new Promise(done=>server.listen(0,'127.0.0.1',done));
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
  t.after(async()=>{await browser.close();await new Promise(done=>server.close(done))});
  const base=`http://127.0.0.1:${server.address().port}`;
  const editor=await browser.newPage({viewport:{width:1366,height:900}});
  editor.setDefaultTimeout(15000);
  editor.setDefaultNavigationTimeout(20000);
  const errors=[];
  editor.on('pageerror',error=>errors.push(error.message));
  await editor.goto(base+'/editor-v2/index.html');
  const select=async id=>{
    await editor.locator(`.node[data-node-id="${id}"]`).evaluate(el=>{if(!el.classList.contains('selected'))el.click()});
    if(await editor.locator('#rightDock').evaluate(el=>el.classList.contains('closed')))await editor.locator('#openInspector').click();
  };
  const field=id=>editor.locator(`.typed-inspector-field[data-property-id="${id}"]`);
  const assertRegisteredRoute=async id=>{
    const property=listProperties().find(candidate=>candidate.id===id);
    assert.ok(property,`${id}: property is registered`);
    assert.equal(await field(id).getAttribute('data-property-command'),property.command,`${id}: rendered Inspector command matches the registry`);
    assert.equal(await field(id).getAttribute('data-property-key'),property.key,`${id}: rendered Inspector key matches the registry`);
  };
  // Authored defaults are visible in the style Inspector even before users
  // persist an explicit style override. Merely selecting a node stays pure.
  await select(buttonId);
  const inspectorTablist=editor.locator('.inspector-tabs');
  const inspectorTabs=inspectorTablist.locator('[role="tab"]');
  const inspectorTabPanel=editor.locator('#inspectorBody');
  assert.equal(await inspectorTablist.getAttribute('role'),'tablist');
  assert.equal(await inspectorTabs.count(),3);
  assert.equal(await inspectorTabPanel.getAttribute('role'),'tabpanel');
  for(let index=0;index<3;index++)assert.equal(await inspectorTabs.nth(index).getAttribute('aria-controls'),'inspectorBody');
  assert.equal(await inspectorTabs.nth(0).getAttribute('aria-selected'),'true');
  assert.equal(await inspectorTabs.nth(0).getAttribute('tabindex'),'0');
  assert.equal(await inspectorTabPanel.getAttribute('aria-labelledby'),await inspectorTabs.nth(0).getAttribute('id'));
  await inspectorTabs.nth(0).focus();
  await inspectorTabs.nth(0).press('ArrowRight');
  assert.equal(await inspectorTabs.nth(1).getAttribute('aria-selected'),'true','Right Arrow activates the next Inspector tab');
  assert.equal(await inspectorTabPanel.getAttribute('aria-labelledby'),await inspectorTabs.nth(1).getAttribute('id'));
  await inspectorTabs.nth(1).press('End');
  assert.equal(await inspectorTabs.nth(2).getAttribute('aria-selected'),'true','End activates the final Inspector tab');
  await inspectorTabs.nth(2).press('ArrowLeft');
  assert.equal(await inspectorTabs.nth(1).getAttribute('aria-selected'),'true','Left Arrow returns to the preceding Inspector tab');
  await inspectorTabs.nth(1).press('Home');
  assert.equal(await inspectorTabs.nth(0).getAttribute('aria-selected'),'true','Home restores the first Inspector tab');
  const inspectorDisclosure=editor.locator('#inspectorBody .inspector-group-title[role="button"]').first();
  const inspectorPanelId=await inspectorDisclosure.getAttribute('aria-controls');
  assert.ok(inspectorPanelId,'Inspector accordion identifies the content it controls');
  assert.match(inspectorPanelId,/^inspector-group-content-\d+$/);
  const inspectorPanel=editor.locator('#'+inspectorPanelId);
  assert.equal(await inspectorDisclosure.getAttribute('aria-expanded'),'false');
  assert.equal(await inspectorPanel.isVisible(),false,'closed Inspector content stays hidden');
  await inspectorDisclosure.click();
  assert.equal(await inspectorDisclosure.getAttribute('aria-expanded'),'true');
  assert.equal(await inspectorPanel.isVisible(),true,'the controlled Inspector content becomes visible');
  await inspectorDisclosure.focus();
  await inspectorDisclosure.press('Enter');
  assert.equal(await inspectorDisclosure.getAttribute('aria-expanded'),'false','Enter closes the Inspector accordion');
  await inspectorDisclosure.press(' ');
  assert.equal(await inspectorDisclosure.getAttribute('aria-expanded'),'true','Space opens the Inspector accordion');
  const button=editor.locator(`.node[data-node-id="${buttonId}"]`);
  assert.equal(await button.evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(112, 71, 235)');
  assert.equal(await field('background.color').locator('input[aria-label$="HEX"]').inputValue(),'#7047eb');
  assert.equal(await field('typography.color').locator('input[aria-label$="HEX"]').inputValue(),'#ffffff');
  assert.deepEqual(await field('spacing.padding').locator('.typed-box-side input[type="number"]').evaluateAll(inputs=>inputs.map(input=>input.value)),['12','18','12','18']);
  assert.equal(await field('radius.all').locator('.dimension-controls input[type="number"]').inputValue(),'10');
  assert.deepEqual(draft.pages[pageId].nodes[buttonId].style,{},'opening Inspector defaults must not materialize style data');
  assert.deepEqual(draft.pages[pageId].nodes[buttonId].responsive,{desktop:{},tablet:{},mobile:{}},'reading defaults must not create responsive overrides');
  // Multi-element Inspector: shared dimensions apply atomically to both nodes,
  // keep focus after rerender, and remain undoable as a single operation.
  await select(flexId);
  await editor.locator(`.node[data-node-id="${offsetId}"]`).evaluate(el=>el.dispatchEvent(new MouseEvent('click',{bubbles:true,ctrlKey:true})));
  assert.equal(await editor.locator('.multi-inspector').count(),1,'multi-selection exposes shared Inspector');
  const multiFieldRoutes=await editor.locator('.multi-inspector-field').evaluateAll(rows=>rows.map(row=>({id:row.dataset.propertyId,command:row.dataset.propertyCommand,key:row.dataset.propertyKey})));
  assert.ok(multiFieldRoutes.length>0,'shared Inspector exposes route metadata for each control');
  for(const route of multiFieldRoutes){
    assert.equal(route.command,'responsive.set',`${route.id}: shared Inspector exposes the actual command route`);
    assert.equal(route.key,route.id,`${route.id}: shared Inspector exposes the Page Model key`);
  }
  const sharedWidth=editor.locator('.multi-inspector-field[data-property-id="width"] input');
  await sharedWidth.fill('240');
  await sharedWidth.dispatchEvent('change');
  assert.equal(await editor.locator('.multi-inspector-field[data-property-id="minWidth"] input').count(),1,'multi Inspector provides responsive minimum width');
  assert.equal(await editor.locator('.multi-inspector-field[data-property-id="maxWidth"] input').count(),1,'multi Inspector provides responsive maximum width');
  assert.equal(await editor.locator('.multi-inspector-field[data-property-id="minHeight"] input').count(),1,'multi Inspector provides responsive minimum height');
  assert.equal(await editor.locator('.multi-inspector-field[data-property-id="maxHeight"] input').count(),1,'multi Inspector provides responsive maximum height');
  await editor.waitForFunction(()=>document.activeElement?.closest('.multi-inspector-field')?.dataset.propertyId==='width');
  for(const id of [flexId,offsetId]){
    assert.equal(await editor.locator(`.node[data-node-id="${id}"]`).evaluate(el=>getComputedStyle(el).width),'240px','shared width reaches all selected elements');
  }
  await editor.locator('#undo').click();
  const minWidth=editor.locator('.multi-inspector-field[data-property-id="minWidth"] input');
  await minWidth.fill('120');
  await minWidth.dispatchEvent('change');
  for(const id of [flexId,offsetId]){
    assert.equal(await editor.locator(`.node[data-node-id="${id}"]`).evaluate(el=>getComputedStyle(el).minWidth),'120px','shared responsive minimum width reaches both canvas nodes');
  }
  await editor.locator('#undo').click();
  // Invalid shared dimensions must be rejected before they enter the Page Model.
  await sharedWidth.fill('2001');
  await sharedWidth.dispatchEvent('change');
  for(const id of [flexId,offsetId]){
    assert.notEqual(await editor.locator(`.node[data-node-id="${id}"]`).evaluate(el=>getComputedStyle(el).width),'2001px','invalid shared width rejected');
  }
  await select(gridId);
  // Searching a section heading reveals its controls rather than an empty section.
  const search=editor.locator('.inspector-search input[type=search]');
  const group=editor.locator('.inspector-group').filter({has:editor.locator('.typed-inspector-field')}).first();
  const titleText=(await group.locator(':scope > .inspector-group-title').textContent()).replace(/\s+/g,' ').trim();
  await search.fill(titleText);
  assert.ok(await group.locator('.typed-inspector-field:not([hidden])').count()>0,'group heading search must show the controls');
  assert.ok(Number((await editor.locator('.inspector-search-status').innerText()).match(/\d+/)?.[0])>0,'search result count must include controls revealed by heading match');
  await search.press('Escape');
  assert.equal(await search.inputValue(),'','Escape clears the active Inspector search');
  assert.equal(await search.evaluate(el=>document.activeElement===el),true,'Escape retains search focus');
  assert.ok(await group.locator('.typed-inspector-field:not([hidden])').count()>0,'cleared search restores controls');
  assert.equal(await editor.locator(`.node[data-node-id="${gridId}"] > .node-head img`).count(),0);
  assert.equal(await editor.locator(`.layer-row[data-node-id="${gridId}"] img`).count(),0);
  await editor.locator('.inspector-group-title[aria-expanded="false"]').evaluateAll(elements=>elements.forEach(el=>el.click()));
  await field('layout.display').locator('select:not(.property-token-picker)').selectOption('grid');
  // Inspector controls rerender after every change. Keyboard focus must
  // return to the same typed control, rather than vanish into the document.
  const displaySelect=field('layout.display').locator('select:not(.property-token-picker)');
  await displaySelect.evaluate(select=>{
    select.focus();
    select.dispatchEvent(new Event('change',{bubbles:true}));
  });
  await editor.waitForFunction(()=>document.activeElement?.closest('.typed-inspector-field')?.dataset.propertyId==='layout.display');
  assert.equal(await editor.evaluate(()=>document.activeElement?.tagName),'SELECT','the re-rendered typed select should retain focus');

  await editor.locator('.inspector-tabs button').first().click();
  if(await editor.locator('.inspector-group-title[aria-expanded="false"]').filter({hasText:'Grid'}).count())await editor.locator('.inspector-group-title').filter({hasText:'Grid'}).click();
  await field('grid.columns').locator('select:not(.property-token-picker)').selectOption('repeat(2, minmax(0, 1fr))');
  assert.equal(await editor.locator(`.node[data-node-id="${gridId}"]`).evaluate(el=>getComputedStyle(el).display),'grid');
  // Editor chrome must not consume a grid cell.
  assert.equal(await editor.locator(`.node[data-node-id="${gridId}"] > .node-head`).evaluate(el=>getComputedStyle(el).position),'absolute');
  await select(itemId);
  await editor.locator('.inspector-tabs button').first().click();
  await editor.locator('.inspector-group-title[aria-expanded="false"]').filter({hasText:'Grid-gyermek'}).click();
  await field('grid.column').locator('select:not(.property-token-picker)').selectOption('2');
  if(await editor.locator('.inspector-group-title[aria-expanded="false"]').filter({hasText:'Méret'}).count())await editor.locator('.inspector-group-title').filter({hasText:'Méret'}).click();
  await field('size.minWidth').locator('input[type="number"]').fill('80');
  assert.equal(await field('size.minWidth').getAttribute('data-property-command'),'responsive.set');
  assert.equal(await field('size.minWidth').getAttribute('data-property-key'),'minWidth');
  await field('size.minWidth').locator('input').press('Tab');
  await editor.locator('.inspector-tabs button').first().click();
  await field('radius.topLeft').locator('input[type="number"]').fill('12');
  assert.equal(await field('radius.topLeft').getAttribute('data-property-command'),'responsive.set');
  assert.equal(await field('radius.topLeft').getAttribute('data-property-key'),'borderTopLeftRadius');
  await field('radius.topLeft').locator('input').press('Tab');
  const item=editor.locator(`.node[data-node-id="${itemId}"]`);
  const css=()=>item.evaluate(el=>{const style=getComputedStyle(el);return {column:style.gridColumnStart,minWidth:style.minWidth,radius:style.borderTopLeftRadius}});
  assert.deepEqual(await css(),{column:'2',minWidth:'80px',radius:'12px'});
  await editor.locator('#undo').click();
  assert.equal((await css()).radius,'0px');
  await editor.locator('#redo').click();
  assert.equal((await css()).radius,'12px');
  await field('spacing.padding').locator('.property-preset').filter({hasText:'Kártya · 16/24'}).click();
  assert.equal(await field('spacing.padding').locator('.property-preset').filter({hasText:'Kártya · 16/24'}).getAttribute('aria-pressed'),'true');
  await field('background.color').locator('.property-preset').filter({hasText:'Kék'}).click();
  assert.equal(await field('background.color').locator('.property-preset').filter({hasText:'Kék'}).getAttribute('aria-pressed'),'true');
  await field('typography.fontSize').locator('.property-preset').filter({hasText:'Címsor · 32'}).click();
  assert.equal(await field('typography.fontSize').locator('.property-preset').filter({hasText:'Címsor · 32'}).getAttribute('aria-pressed'),'true');
  const presetStyle=()=>item.evaluate(el=>{const style=getComputedStyle(el);return {paddingTop:style.paddingTop,paddingRight:style.paddingRight,backgroundColor:style.backgroundColor,fontSize:style.fontSize}});
  assert.deepEqual(await presetStyle(),{paddingTop:'16px',paddingRight:'24px',backgroundColor:'rgb(37, 99, 235)',fontSize:'32px'});
  await editor.locator('#undo').click();assert.equal((await presetStyle()).fontSize,'16px');
  await editor.locator('#redo').click();assert.equal((await presetStyle()).fontSize,'32px');
  const alignment=()=>item.evaluate(el=>getComputedStyle(el).textAlign);
  const inheritedAlignment=await alignment();
  await field('typography.textAlign').locator('select:not(.property-token-picker)').selectOption('center');
  assert.equal(await alignment(),'center','Inspector text alignment reaches the real Canvas node');
  await editor.locator('#undo').click();assert.equal(await alignment(),inheritedAlignment,'Undo restores the prior text alignment');
  await editor.locator('#redo').click();assert.equal(await alignment(),'center','Redo restores the Inspector text alignment');
  // Locking is read-only throughout the Inspector, including typed controls,
  // presets, token bindings and legacy content. Navigation and help stay usable.
  assert.equal(await editor.locator('.inspector-actions .danger-action').getAttribute('data-inspector-command'),'element.delete');
  assert.equal(await editor.locator('.inspector-actions .danger-action').getAttribute('data-inspector-node-id'),itemId);
  assert.ok(JSON.parse(await editor.locator('.inspector-actions .danger-action').getAttribute('data-inspector-keys')).includes(`nodes.${itemId}`));
  assert.ok(JSON.parse(await editor.locator('.inspector-actions .danger-action').getAttribute('data-inspector-keys')).includes(`nodes.${gridId}.children`));
  assert.equal(await editor.locator('.inspector-lock-toggle').getAttribute('data-inspector-command'),'element.lock.set');
  assert.equal(await editor.locator('.inspector-lock-toggle').getAttribute('data-inspector-key'),'locked');
  await editor.locator('.inspector-lock-toggle').check();
  assert.match(await editor.locator('.inspector-locked-note').textContent(),/Stílus fülön/);
  assert.equal(await field('background.color').locator('input[type="color"]').isDisabled(),true);
  assert.equal(await field('spacing.padding').locator('input').first().isDisabled(),true);
  assert.equal(await field('spacing.padding').locator('.property-preset').first().isDisabled(),true);
  assert.equal(await field('typography.fontSize').locator('.property-token-picker').isDisabled(),true);
  assert.equal(await editor.locator('.geometry-presets button').first().isDisabled(),true);
  assert.equal(await editor.locator('.inspector-actions .danger-action').isDisabled(),true);
  assert.equal(await editor.getByLabel('Beállítás keresése').isEnabled(),true);
  const colorHelpToggle=field('background.color').locator('.property-info-toggle');
  const colorHelp=field('background.color').locator('.property-help');
  assert.equal(await colorHelpToggle.getAttribute('aria-controls'),await colorHelp.getAttribute('id'),'the explanation disclosure points to its help text');
  assert.equal(await colorHelp.isVisible(),false,'explanation starts collapsed');
  await colorHelpToggle.click();
  assert.equal(await colorHelpToggle.getAttribute('aria-expanded'),'true');
  assert.equal(await colorHelp.isVisible(),true,'expanded explanation is available to keyboard and assistive technology');
  assert.deepEqual(await presetStyle(),{paddingTop:'16px',paddingRight:'24px',backgroundColor:'rgb(37, 99, 235)',fontSize:'32px'});
  await editor.locator('.inspector-tabs button').nth(1).click();
  assert.match(await editor.locator('.inspector-locked-note').textContent(),/Zárolt elem/);
  assert.equal(await editor.getByLabel('Szöveg tartalma').isDisabled(),true);
  await editor.locator('.inspector-tabs button').first().click();
  await editor.locator('.inspector-lock-toggle').uncheck();
  assert.equal(await field('background.color').locator('input[type="color"]').isEnabled(),true);
  await select(gridId);await select(itemId);
  assert.equal(await field('radius.topLeft').locator('input[type="number"]').inputValue(),'12');
  assert.equal(await field('radius.topLeft').locator('select:not(.property-token-picker)').inputValue(),'px');
  await select(flexId);
  await field('layout.display').locator('select:not(.property-token-picker)').selectOption('flex');
  await editor.locator('.inspector-tabs button').first().click();
  if(await editor.locator('.inspector-group-title[aria-expanded="false"]').filter({hasText:'Flex'}).count())await editor.locator('.inspector-group-title').filter({hasText:'Flex'}).click();
  await field('flex.direction').locator('select:not(.property-token-picker)').selectOption('column');
  await select(flexItemId);
  await editor.locator('.inspector-group-title[aria-expanded="false"]').filter({hasText:'Flex-gyermek'}).click();
  await field('flex.basis').locator('select:not(.property-token-picker)').selectOption('%');
  await field('flex.basis').locator('input[type="number"]').fill('30');
  await field('flex.basis').locator('input').press('Tab');
  await field('size.maxWidth').locator('input[type="number"]').fill('120');
  await field('size.maxWidth').locator('input').press('Tab');
  const flexCss=()=>editor.locator(`.node[data-node-id="${flexItemId}"]`).evaluate(el=>{const style=getComputedStyle(el);return {basis:style.flexBasis,maxWidth:style.maxWidth}});
  assert.deepEqual(await flexCss(),{basis:'30%',maxWidth:'120px'});
  await editor.locator('#save').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.startsWith('Mentve'));
  assert.equal(posts.at(-1).publish,false);
  assert.equal(published,null);
  await editor.reload();await select(itemId);
  assert.deepEqual(await css(),{column:'2',minWidth:'80px',radius:'12px'});
  assert.equal(await alignment(),'center','saved text alignment survives Editor reload');
  await editor.locator('#publish').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent==='Publikálva');
  assert.equal(posts.at(-1).publish,true);
  const publicPage=await browser.newPage({viewport:{width:1366,height:900}});
  publicPage.setDefaultTimeout(15000);
  publicPage.setDefaultNavigationTimeout(20000);
  publicPage.on('pageerror',error=>errors.push(error.message));
  await publicPage.goto(base+'/p/test');
  await publicPage.locator('.visual-card > .visual-text').first().waitFor();
  assert.equal(await publicPage.locator(`[data-node-id="${itemId}"]`).evaluate(el=>getComputedStyle(el).textAlign),'center',
    'the separately published public snapshot uses the same Inspector text alignment');
  // Content properties use specialized editor controls, but their registry
  // IDs, commands and keys must still describe the real Page Model route.
  const saveContentProperty=async publish=>{
    const response=editor.waitForResponse(r=>new URL(r.url()).pathname==='/api/admin/editor'&&r.request().method()==='POST');
    await editor.locator(publish?'#publish':'#save').click();
    await response;
    await editor.waitForFunction(pub=>pub?document.querySelector('#saveStatus')?.textContent==='Publikálva':document.querySelector('#saveStatus')?.textContent?.startsWith('Mentve'),publish);
  };
  await select(fallbackTextId);await editor.locator('.inspector-tabs button').nth(1).click();
  assert.equal(await editor.locator('.plain-text-content[data-property-id="content.text"] textarea').inputValue(),'Inspector fallback',
    'plain-text Inspector uses the same node-name fallback as the Canvas');
  await select(itemId);await editor.locator('.inspector-tabs button').nth(1).click();
  const textContract=editor.locator('.plain-text-content[data-property-id="content.text"]');
  assert.equal(await textContract.getAttribute('data-property-command'),'element.content.set');
  assert.equal(await textContract.getAttribute('data-property-key'),'text');
  const textInput=textContract.locator('textarea');
  const publicText=()=>publicPage.locator(`[data-node-id="${itemId}"]`).innerText();
  const originalPublicText=await publicText();
  await textInput.fill('Registry-alapú szöveg');
  assert.equal(await editor.locator(`.node[data-node-id="${itemId}"] > .node-content`).innerText(),'Registry-alapú szöveg');
  await editor.locator('#undo').click();assert.equal(await textInput.inputValue(),'Grid item');
  await editor.locator('#redo').click();assert.equal(await textInput.inputValue(),'Registry-alapú szöveg');
  await saveContentProperty(false);
  assert.equal(posts.at(-1).document.pages[pageId].nodes[itemId].props.text,'Registry-alapú szöveg');
  await editor.reload();await select(itemId);await editor.locator('.inspector-tabs button').nth(1).click();
  assert.equal(await editor.locator('.plain-text-content[data-property-id="content.text"] textarea').inputValue(),'Registry-alapú szöveg');
  await publicPage.reload();assert.equal(await publicText(),originalPublicText,'draft text remains unpublished');
  await saveContentProperty(true);await publicPage.reload();
  assert.equal(await publicText(),'Registry-alapú szöveg','Publish sends registry-backed text to the public renderer');

  const exerciseContentTextType=async(nodeId,updatedText)=>{
    await select(nodeId);await editor.locator('.inspector-tabs button').nth(1).click();
    const textControl=editor.locator(`.plain-text-content[data-property-id="content.text"] textarea[data-text-node-id="${nodeId}"]`);
    assert.equal(await textControl.locator('xpath=..').getAttribute('data-property-command'),'element.content.set');
    assert.equal(await textControl.locator('xpath=..').getAttribute('data-property-key'),'text');
    const canvasText=()=>editor.locator(`.node[data-node-id="${nodeId}"] > .node-content`);
    const publicNode=()=>publicPage.locator(`[data-node-id="${nodeId}"]`);
    const originalText=await publicNode().innerText();
    await textControl.fill(updatedText);
    assert.equal(await canvasText().innerText(),updatedText);
    assert.equal(await canvasText().evaluate(el=>getComputedStyle(el).whiteSpace),'pre-wrap',`${nodeId}: Canvas preserves multiline plain text visibly`);
    await editor.locator('#undo').click();
    await editor.waitForFunction(id=>document.querySelector(`.plain-text-content[data-property-id="content.text"] textarea[data-text-node-id="${id}"]`)?.value!==undefined,nodeId);
    assert.notEqual(await textControl.inputValue(),updatedText,'Undo restores the previous text for each applicable node type');
    await editor.locator('#redo').click();assert.equal(await textControl.inputValue(),updatedText);
    await saveContentProperty(false);
    assert.equal(posts.at(-1).document.pages[pageId].nodes[nodeId].props.text,updatedText);
    await editor.reload();await select(nodeId);await editor.locator('.inspector-tabs button').nth(1).click();
    assert.equal(await editor.locator(`.plain-text-content[data-property-id="content.text"] textarea[data-text-node-id="${nodeId}"]`).inputValue(),updatedText);
    await publicPage.reload();assert.equal(await publicNode().innerText(),originalText,'draft content.text remains unpublished');
    await saveContentProperty(true);await publicPage.reload();
    assert.equal(await publicNode().innerText(),updatedText,'Publish exposes content.text for every registered node type');
    assert.equal(await publicNode().evaluate(el=>getComputedStyle(el).whiteSpace),'pre-wrap',`${nodeId}: published plain text preserves multiline visual layout`);
  };
  await exerciseContentTextType(headingId,'Címsor első sora\nCímsor második sora');
  await exerciseContentTextType(buttonId,'Gomb első sora\nGomb második sora');
  await exerciseContentTextType(linkId,'Link első sora\nLink második sora');

  // Plain content is literal user-authored text: intentional boundary
  // whitespace and an empty value survive command, draft Save/reload, and
  // the separate Publish action. The Inspector contract mirrors this route.
  await select(itemId);await editor.locator('.inspector-tabs button').nth(1).click();
  const literalText='  var(--creator-colors-primary, #7047eb)\n második sor  ';
  const literalInput=editor.locator('.plain-text-content[data-property-id="content.text"] textarea');
  await literalInput.fill(literalText);
  assert.equal(await literalInput.inputValue(),literalText);
  assert.equal(await editor.locator(`.node[data-node-id="${itemId}"] > .node-content`).textContent(),literalText);
  assert.equal(await editor.locator(`.node[data-node-id="${itemId}"] > .node-content`).evaluate(el=>getComputedStyle(el).whiteSpace),'pre-wrap',
    'Canvas preserves authored line breaks and boundary spaces visually');
  assert.equal(await editor.locator(`.node[data-node-id="${itemId}"] > .node-content`).innerText(),literalText,
    'Canvas-visible text matches the Inspector value including its hard line break');
  await saveContentProperty(false);
  assert.equal(posts.at(-1).document.pages[pageId].nodes[itemId].props.text,literalText);
  await editor.reload();await select(itemId);await editor.locator('.inspector-tabs button').nth(1).click();
  assert.equal(await editor.locator('.plain-text-content[data-property-id="content.text"] textarea').inputValue(),literalText);
  await saveContentProperty(true);await publicPage.reload();
  assert.equal(await publicPage.locator(`[data-node-id="${itemId}"]`).textContent(),literalText);
  assert.equal(await publicPage.locator(`[data-node-id="${itemId}"]`).evaluate(el=>getComputedStyle(el).whiteSpace),'pre-wrap',
    'published plain text preserves authored line breaks and boundary spaces visually');
  assert.equal(await publicPage.locator(`[data-node-id="${itemId}"]`).innerText(),literalText,
    'publicly rendered text matches the Canvas and Inspector including its hard line break');

  await select(itemId);await editor.locator('.inspector-tabs button').nth(1).click();
  await editor.locator('.plain-text-content[data-property-id="content.text"] textarea').fill('');
  await saveContentProperty(false);
  assert.equal(posts.at(-1).document.pages[pageId].nodes[itemId].props.text,'');
  await editor.reload();await select(itemId);await editor.locator('.inspector-tabs button').nth(1).click();
  assert.equal(await editor.locator('.plain-text-content[data-property-id="content.text"] textarea').inputValue(),'');
  await saveContentProperty(true);await publicPage.reload();
  assert.equal(await publicPage.locator(`[data-node-id="${itemId}"]`).textContent(),'');

  await select(buttonId);await editor.locator('.inspector-tabs button').nth(1).click();
  const hrefContract=editor.locator('.content-schema-field[data-property-id="content.href"]');
  assert.equal(await hrefContract.getAttribute('data-property-command'),'content.properties.set');
  assert.equal(await hrefContract.getAttribute('data-property-key'),'href');
  const hrefInput=hrefContract.locator('input[aria-label="Hivatkozás"]');
  await editor.locator(`.plain-text-content[data-property-id="content.text"] textarea[data-text-node-id="${buttonId}"]`).fill('Érvényes, még nem mentett CTA-felirat');
  await editor.waitForFunction(()=>!document.querySelector('#publish').disabled);
  const hrefErrorId=await hrefInput.getAttribute('aria-describedby');
  assert.ok(hrefErrorId,'content property input points to its validation feedback');
  assert.equal(await editor.locator(`#${hrefErrorId}`).count(),1,'described validation target exists uniquely in the Inspector');
  const readButtonHref=el=>(el.matches('a')?el:el.querySelector('a'))?.getAttribute('href')??el.getAttribute('href');
  const publicButtonHref=()=>publicPage.locator(`[data-node-id="${buttonId}"]`).evaluate(readButtonHref);
  const postsBeforeInvalidHref=posts.length;
  const draftHrefBeforeInvalid=draft.pages[pageId].nodes[buttonId].props.href;
  const publishedHrefBeforeInvalid=published.pages[pageId].nodes[buttonId].props.href;
  await hrefInput.fill('javascript:alert(1)');
  assert.equal(await hrefInput.getAttribute('aria-invalid'),'true','unsafe link values remain marked invalid');
  const hrefValidation=editor.locator(`#${hrefErrorId}`);
  assert.match(await hrefValidation.textContent(),/hivatkozás|URL|biztonság/i,'unsafe link feedback is associated with its control');
  await editor.locator('#save').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent.includes('Javítsd a jelzett mezőt'));
  assert.equal(posts.length,postsBeforeInvalidHref,'Save is blocked while the content href is invalid');
  assert.equal(draft.pages[pageId].nodes[buttonId].props.href,draftHrefBeforeInvalid,'blocked Save does not persist the older Page Model value');
  assert.equal(published.pages[pageId].nodes[buttonId].props.href,publishedHrefBeforeInvalid,'blocked Save leaves the published href unchanged');
  assert.equal(await hrefInput.inputValue(),'javascript:alert(1)','Save rejection preserves the invalid value for correction');
  await editor.locator('#publish').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent.includes('Javítsd a jelzett mezőt'));
  assert.equal(posts.length,postsBeforeInvalidHref,'Publish is blocked while the content href is invalid');
  assert.equal(published.pages[pageId].nodes[buttonId].props.href,publishedHrefBeforeInvalid,'blocked Publish leaves the public snapshot unchanged');
  assert.equal(await hrefInput.getAttribute('aria-invalid'),'true','the invalid href remains associated with its error after both blocked actions');
  await hrefInput.fill('#default-cta');
  assert.equal(await hrefInput.getAttribute('aria-invalid'),null,'correcting the link clears its invalid state');
  const originalHref=await publicButtonHref();
  await hrefInput.fill('/p/registry-link');
  assert.equal(await hrefInput.inputValue(),'/p/registry-link');
  await editor.locator('#undo').click();assert.equal(await hrefContract.locator('input[aria-label="Hivatkozás"]').inputValue(),'#default-cta');
  await editor.locator('#redo').click();assert.equal(await editor.locator('.content-schema-field[data-property-id="content.href"] input[aria-label="Hivatkozás"]').inputValue(),'/p/registry-link');
  await saveContentProperty(false);
  assert.equal(posts.at(-1).document.pages[pageId].nodes[buttonId].props.href,'/p/registry-link');
  await editor.reload();await select(buttonId);await editor.locator('.inspector-tabs button').nth(1).click();
  assert.equal(await editor.locator('.content-schema-field[data-property-id="content.href"] input[aria-label="Hivatkozás"]').inputValue(),'/p/registry-link');
  await publicPage.reload();assert.equal(await publicButtonHref(),originalHref,'draft link target remains unpublished');
  await saveContentProperty(true);await publicPage.reload();
  assert.equal(await publicButtonHref(),'/p/registry-link','Publish sends registry-backed link target to the public renderer');

  await select(linkId);await editor.locator('.inspector-tabs button').nth(1).click();
  const linkHrefContract=editor.locator('.content-schema-field[data-property-id="content.href"]');
  assert.equal(await linkHrefContract.getAttribute('data-property-command'),'content.properties.set');
  assert.equal(await linkHrefContract.getAttribute('data-property-key'),'href');
  const linkHrefInput=linkHrefContract.locator('input[aria-label="Hivatkozás"]');
  const publicLinkHref=()=>publicPage.locator(`[data-node-id="${linkId}"]`).evaluate(readButtonHref);
  const originalLinkHref=await publicLinkHref();
  await linkHrefInput.fill('/p/registry-text-link');
  assert.equal(await linkHrefInput.inputValue(),'/p/registry-text-link');
  await editor.locator('#undo').click();assert.equal(await linkHrefContract.locator('input[aria-label="Hivatkozás"]').inputValue(),'/default-link');
  await editor.locator('#redo').click();assert.equal(await editor.locator('.content-schema-field[data-property-id="content.href"] input[aria-label="Hivatkozás"]').inputValue(),'/p/registry-text-link');
  await saveContentProperty(false);
  assert.equal(posts.at(-1).document.pages[pageId].nodes[linkId].props.href,'/p/registry-text-link');
  await editor.reload();await select(linkId);await editor.locator('.inspector-tabs button').nth(1).click();
  assert.equal(await editor.locator('.content-schema-field[data-property-id="content.href"] input[aria-label="Hivatkozás"]').inputValue(),'/p/registry-text-link');
  await publicPage.reload();assert.equal(await publicLinkHref(),originalLinkHref,'draft link-element target remains unpublished');
  await saveContentProperty(true);await publicPage.reload();
  assert.equal(await publicLinkHref(),'/p/registry-text-link','Publish sends registry-backed link-element target to the public renderer');

  // The registry-backed background asset control must use the shared Media
  // picker and carry the same responsive asset ID through Canvas, draft Save,
  // reload and the separate public Publish route.
  const backgroundImage=()=>item.evaluate(el=>getComputedStyle(el).backgroundImage);
  const publishedBackgroundImage=()=>publicPage.locator(`[data-node-id="${itemId}"]`).evaluate(el=>getComputedStyle(el).backgroundImage);
  await select(itemId);
  await editor.locator('.inspector-tabs button').first().click();
  const backgroundGroup=editor.locator('.inspector-group-title').filter({hasText:'Háttér'});
  if(await backgroundGroup.getAttribute('aria-expanded')==='false')await backgroundGroup.click();
  const backgroundImageField=field('background.image');
  const backgroundImagePicker=backgroundImageField.locator('.editor-media-picker');
  const backgroundImageLabel=backgroundImageField.locator('.property-heading > label');
  const backgroundImageOpen=backgroundImagePicker.locator('button[aria-controls]');
  const backgroundImageValidation=backgroundImageField.locator('.property-validation');
  assert.equal(await backgroundImagePicker.getAttribute('role'),'group','background media exposes a named control group');
  assert.equal(await backgroundImagePicker.getAttribute('aria-labelledby'),await backgroundImageLabel.getAttribute('id'),'the media group uses its Inspector field label');
  assert.equal(await backgroundImageLabel.getAttribute('for'),null,'the media group label does not target a nonexistent form control');
  assert.equal(await backgroundImageOpen.getAttribute('aria-describedby'),await backgroundImageValidation.getAttribute('id'),'the primary media control is associated with validation feedback');
  assert.equal(await backgroundImageOpen.getAttribute('aria-required'),'true','the media selection contract is announced');
  assert.equal(await backgroundImage(), 'none', 'no image asset is applied before selection');
  assert.equal(await publishedBackgroundImage(), 'none', 'the initial public snapshot has no background asset');
  await backgroundImagePicker.getByRole('button',{name:'Médiatár megnyitása'}).click();
  await backgroundImagePicker.locator('[role="region"][aria-label="Médiatár találatok"]').waitFor();
  await backgroundImagePicker.getByRole('button',{name:'Inspector háttér.png kiválasztása',exact:true}).click();
  assert.ok((await backgroundImage()).includes(`/api/admin/media?id=${inspectorBackgroundAssetId}`),
    'the selected asset previews through the authenticated Canvas media route');
  await editor.locator('#undo').click();
  assert.equal(await backgroundImage(),'none','Undo removes the pending background asset selection');
  await editor.locator('#redo').click();
  assert.ok((await backgroundImage()).includes(`/api/admin/media?id=${inspectorBackgroundAssetId}`),
    'Redo restores the same background asset reference');
  await editor.locator('#save').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.startsWith('Mentve'));
  assert.equal(posts.at(-1).publish,false,'saving a background asset selection does not publish it');
  assert.equal(posts.at(-1).document.pages[pageId].nodes[itemId].responsive.desktop.backgroundAssetId,inspectorBackgroundAssetId,
    'the asset ID is saved in the current desktop responsive style');
  await editor.reload();await select(itemId);
  assert.ok((await backgroundImage()).includes(`/api/admin/media?id=${inspectorBackgroundAssetId}`),
    'the selected asset remains in the Canvas after Editor reload');
  await publicPage.reload();
  assert.equal(await publishedBackgroundImage(),'none','draft Save keeps the previous public background unchanged');
  await editor.locator('#publish').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent==='Publikálva');
  assert.equal(posts.at(-1).publish,true,'only explicit Publish makes the background asset public');
  await publicPage.reload();
  assert.ok((await publishedBackgroundImage()).includes(`/media/${inspectorBackgroundAssetId}`),
    'Publish resolves the asset ID through the public media route');
  await editor.locator('.inspector-tabs button').first().click();
  if(await backgroundGroup.getAttribute('aria-expanded')==='false')await backgroundGroup.click();
  await field('background.image').locator('.editor-media-picker').getByRole('button',{name:'Kép eltávolítása',exact:true}).click();
  assert.equal(await backgroundImage(),'none','removal clears the current Canvas background reference');
  await editor.locator('#save').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.startsWith('Mentve'));
  assert.equal(posts.at(-1).publish,false,'removing a background in the draft does not publish');
  await editor.reload();await select(itemId);
  assert.equal(await backgroundImage(),'none','draft removal survives Editor reload');
  await publicPage.reload();
  assert.ok((await publishedBackgroundImage()).includes(`/media/${inspectorBackgroundAssetId}`),
    'draft removal keeps the previously published asset live');
  await editor.locator('#publish').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent==='Publikálva');
  await publicPage.reload();
  assert.equal(await publishedBackgroundImage(),'none','explicit Publish removes the public background asset reference');
  const publicCss=()=>publicPage.locator('.visual-card > .visual-text').first().evaluate(el=>{const style=getComputedStyle(el);return {column:style.gridColumnStart,minWidth:style.minWidth,radius:style.borderTopLeftRadius}});
  await select(itemId);
  assert.deepEqual(await publicCss(),await css());
  assert.deepEqual(await publicPage.locator('.visual-card > .visual-text').first().evaluate(el=>{const style=getComputedStyle(el);return {paddingTop:style.paddingTop,paddingRight:style.paddingRight,backgroundColor:style.backgroundColor,fontSize:style.fontSize}}),await presetStyle());
  assert.deepEqual(await publicPage.locator('.visual-card:nth-child(2) > .visual-text').evaluate(el=>{const style=getComputedStyle(el);return {basis:style.flexBasis,maxWidth:style.maxWidth}}),await flexCss());
  // A second Inspector field follows its own full route. Changing the color
  // must reach Canvas, remain one undoable command, persist as a draft, and
  // update the live page only after the separate Publish action.
  const backgroundColor=()=>item.evaluate(el=>getComputedStyle(el).backgroundColor);
  await assertRegisteredRoute('background.color');
  assert.equal(await backgroundColor(),'rgb(37, 99, 235)');
  await field('background.color').locator('input[type="color"]').evaluate(input=>{
    input.value='#dc2626';input.dispatchEvent(new Event('change',{bubbles:true}));
  });
  assert.equal(await backgroundColor(),'rgb(220, 38, 38)','Inspector color reaches the Canvas node');
  await editor.locator('#undo').click();
  assert.equal(await backgroundColor(),'rgb(37, 99, 235)','Undo restores the previous Inspector color');
  await editor.locator('#redo').click();
  assert.equal(await backgroundColor(),'rgb(220, 38, 38)','Redo restores the selected Inspector color');
  await editor.locator('#save').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.startsWith('Mentve'));
  assert.equal(posts.at(-1).publish,false,'saving a color edit must not publish');
  await editor.reload();await select(itemId);
  assert.equal(await backgroundColor(),'rgb(220, 38, 38)','saved Inspector color survives Editor reload');
  await publicPage.reload();
  assert.equal(await publicPage.locator(`[data-node-id="${itemId}"]`).evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(37, 99, 235)',
    'draft Save leaves the prior published Inspector color live');
  await editor.locator('#publish').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent==='Publikálva');
  assert.equal(posts.at(-1).publish,true,'only explicit Publish sends the new color live');
  await publicPage.reload();
  assert.equal(await publicPage.locator(`[data-node-id="${itemId}"]`).evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(220, 38, 38)',
    'the separately published Inspector color reaches the public renderer');
  // Typography size already appears in the initial style snapshot; also
  // verify a later Inspector preset edit keeps Save separate from Publish.
  await editor.locator('.inspector-tabs button').first().click();
  const typographyHeading=editor.locator('.inspector-group-title').filter({hasText:'Tipográfia'});
  if(await typographyHeading.getAttribute('aria-expanded')==='false')await typographyHeading.click();
  const fontSize=()=>item.evaluate(el=>getComputedStyle(el).fontSize);
  await assertRegisteredRoute('typography.fontSize');
  assert.equal(await fontSize(),'32px','the initial published Inspector font size is 32px');
  await field('typography.fontSize').locator('.property-preset').filter({hasText:'Nagy · 48'}).click();
  assert.equal(await fontSize(),'48px','the font-size preset reaches Canvas');
  await editor.locator('#undo').click();
  assert.equal(await fontSize(),'32px','Undo restores the previous Inspector font size');
  await editor.locator('#redo').click();
  assert.equal(await fontSize(),'48px','Redo restores the selected Inspector font size');
  await editor.locator('#save').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.startsWith('Mentve'));
  assert.equal(posts.at(-1).publish,false,'saving a font-size edit must not publish');
  await editor.reload();await select(itemId);
  assert.equal(await fontSize(),'48px','saved Inspector font size survives Editor reload');
  await publicPage.reload();
  assert.equal(await publicPage.locator(`[data-node-id="${itemId}"]`).evaluate(el=>getComputedStyle(el).fontSize),'32px',
    'draft Save preserves the previous published font size');
  await editor.locator('#publish').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent==='Publikálva');
  assert.equal(posts.at(-1).publish,true,'only explicit Publish sends the new font size live');
  await publicPage.reload();
  assert.equal(await publicPage.locator(`[data-node-id="${itemId}"]`).evaluate(el=>getComputedStyle(el).fontSize),'48px',
    'the separately published font size reaches the public renderer');
  // Edit a field after a live snapshot exists: Save updates only the draft,
  // reload retains it, and only the separate Publish changes the public CSS.
  await editor.locator('.inspector-tabs button').first().click();
  const typographyTitle=editor.locator('.inspector-group-title').filter({hasText:'Tipográfia'});
  if(await typographyTitle.getAttribute('aria-expanded')==='false')await typographyTitle.click();
  await assertRegisteredRoute('typography.textAlign');
  await field('typography.textAlign').locator('select:not(.property-token-picker)').selectOption('right');
  assert.equal(await alignment(),'right');
  await editor.locator('#save').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.startsWith('Mentve'));
  assert.equal(posts.at(-1).publish,false,'text alignment Save must not publish');
  await editor.reload();await select(itemId);
  assert.equal(await alignment(),'right','draft text alignment survives reload');
  await publicPage.reload();
  assert.equal(await publicPage.locator(`[data-node-id="${itemId}"]`).evaluate(el=>getComputedStyle(el).textAlign),'center',
    'the previous published text alignment remains live after draft Save');
  await editor.locator('#publish').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent==='Publikálva');
  assert.equal(posts.at(-1).publish,true,'only the explicit Publish sends the new text alignment live');
  await publicPage.reload();
  assert.equal(await publicPage.locator(`[data-node-id="${itemId}"]`).evaluate(el=>getComputedStyle(el).textAlign),'right',
    'the separately published text alignment reaches the public renderer');
  // Responsive box spacing also gets a complete route through the existing
  // typed preset: Canvas, Undo/Redo, draft persistence, and explicit Publish.
  await editor.locator('.inspector-tabs button').first().click();
  const spacingTitle=editor.locator('.inspector-group-title').filter({hasText:'Térközök'});
  if(await spacingTitle.getAttribute('aria-expanded')==='false')await spacingTitle.click();
  await assertRegisteredRoute('spacing.padding');
  const padding=()=>item.evaluate(el=>{const style=getComputedStyle(el);return {top:style.paddingTop,right:style.paddingRight}});
  assert.deepEqual(await padding(),{top:'16px',right:'24px'},'initial published padding preset is intact');
  await field('spacing.padding').locator('.property-preset').filter({hasText:'XL · 32'}).click();
  assert.deepEqual(await padding(),{top:'32px',right:'32px'},'padding preset reaches the Canvas node');
  await editor.locator('#undo').click();
  assert.deepEqual(await padding(),{top:'16px',right:'24px'},'Undo restores the previous padding');
  await editor.locator('#redo').click();
  assert.deepEqual(await padding(),{top:'32px',right:'32px'},'Redo restores the selected padding');
  await editor.locator('#save').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.startsWith('Mentve'));
  assert.equal(posts.at(-1).publish,false,'saving padding must not publish');
  await editor.reload();await select(itemId);
  assert.deepEqual(await padding(),{top:'32px',right:'32px'},'saved padding survives Editor reload');
  await publicPage.reload();
  assert.deepEqual(await publicPage.locator(`[data-node-id="${itemId}"]`).evaluate(el=>{const style=getComputedStyle(el);return {top:style.paddingTop,right:style.paddingRight}}),
    {top:'16px',right:'24px'},'draft Save leaves the previous published padding live');
  await editor.locator('#publish').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent==='Publikálva');
  assert.equal(posts.at(-1).publish,true,'only explicit Publish sends the new padding live');
  await publicPage.reload();
  assert.deepEqual(await publicPage.locator(`[data-node-id="${itemId}"]`).evaluate(el=>{const style=getComputedStyle(el);return {top:style.paddingTop,right:style.paddingRight}}),
    {top:'32px',right:'32px'},'the separately published padding reaches the public renderer');
  // The typed minimum-width dimension follows the same draft/publication
  // boundary after a public value already exists.
  await editor.locator('.inspector-tabs button').first().click();
  const sizeTitle=editor.locator('.inspector-group-title').filter({hasText:'Méret'});
  if(await sizeTitle.getAttribute('aria-expanded')==='false')await sizeTitle.click();
  const minWidthCss=()=>item.evaluate(el=>getComputedStyle(el).minWidth);
  await assertRegisteredRoute('size.minWidth');
  assert.equal(await minWidthCss(),'80px','the previously published minimum width is 80px');
  const minWidthNumberInput=field('size.minWidth').locator('input[type="number"]');
  await minWidthNumberInput.fill('160');
  await minWidthNumberInput.press('Tab');
  assert.equal(await minWidthCss(),'160px','the typed minimum width reaches Canvas');
  await editor.locator('#undo').click();
  assert.equal(await minWidthCss(),'80px','Undo restores the prior minimum width');
  await editor.locator('#redo').click();
  assert.equal(await minWidthCss(),'160px','Redo restores the selected minimum width');
  await editor.locator('#save').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.startsWith('Mentve'));
  assert.equal(posts.at(-1).publish,false,'saving minimum width must not publish');
  await editor.reload();await select(itemId);
  assert.equal(await minWidthCss(),'160px','saved minimum width survives Editor reload');
  await publicPage.reload();
  assert.equal(await publicPage.locator(`[data-node-id="${itemId}"]`).evaluate(el=>getComputedStyle(el).minWidth),'80px',
    'draft Save leaves the previous published minimum width live');
  await editor.locator('#publish').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent==='Publikálva');
  assert.equal(posts.at(-1).publish,true,'only explicit Publish sends the new minimum width live');
  await publicPage.reload();
  assert.equal(await publicPage.locator(`[data-node-id="${itemId}"]`).evaluate(el=>getComputedStyle(el).minWidth),'160px',
    'the separately published minimum width reaches the public renderer');
  // Unitless line-height is a typography value distinct from font size; keep
  // its authored multiplier and its public computed result in sync.
  await editor.locator('.inspector-tabs button').first().click();
  const typographyGroup=editor.locator('.inspector-group-title').filter({hasText:'Tipográfia'});
  if(await typographyGroup.getAttribute('aria-expanded')==='false')await typographyGroup.click();
  const lineHeightCss=()=>item.evaluate(el=>getComputedStyle(el).lineHeight);
  await assertRegisteredRoute('typography.lineHeight');
  const lineHeightInput=field('typography.lineHeight').locator('input[type="number"]');
  assert.deepEqual(await lineHeightInput.evaluate(input=>({min:input.min,max:input.max,step:input.step,inputMode:input.inputMode})),
    {min:'0.5',max:'5',step:'any',inputMode:'decimal'},'line-height native validity accepts every decimal allowed by the shared contract');
  const publishedLineHeight=await lineHeightCss();
  await field('typography.lineHeight').locator('.property-preset').filter({hasText:'Cím · 1.25'}).click();
  assert.equal(await lineHeightInput.inputValue(),'1.25','line-height preset establishes a known numeric value');
  await lineHeightInput.press('ArrowUp');
  assert.equal(await lineHeightInput.inputValue(),'1.35',
    'line-height ArrowUp uses the declared 0.1 keyboard increment despite native step=any');
  await lineHeightInput.press('ArrowDown');
  assert.equal(await lineHeightInput.inputValue(),'1.25','line-height ArrowDown restores the prior value');
  await editor.locator('#undo').click();
  await editor.locator('#undo').click();
  await editor.locator('#undo').click();
  assert.equal(await lineHeightCss(),publishedLineHeight,'undo restores the inherited line-height after keyboard increment checks');
  await field('typography.lineHeight').locator('.property-preset').filter({hasText:'Laza · 1.75'}).click();
  const draftLineHeight=await lineHeightCss();
  assert.notEqual(draftLineHeight,publishedLineHeight,'line-height preset changes the Canvas computed style');
  assert.equal(draftLineHeight,'84px','1.75 line-height at the published 48px font resolves to 84px');
  await editor.locator('#undo').click();
  assert.equal(await lineHeightCss(),publishedLineHeight,'Undo restores the prior line-height');
  await editor.locator('#redo').click();
  assert.equal(await lineHeightCss(),draftLineHeight,'Redo restores the selected line-height');
  await editor.locator('#save').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.startsWith('Mentve'));
  assert.equal(posts.at(-1).publish,false,'saving line-height must not publish');
  await editor.reload();await select(itemId);
  assert.equal(await lineHeightCss(),draftLineHeight,'saved line-height survives Editor reload');
  await publicPage.reload();
  assert.equal(await publicPage.locator(`[data-node-id="${itemId}"]`).evaluate(el=>getComputedStyle(el).lineHeight),publishedLineHeight,
    'draft Save leaves the previous published line-height live');
  await editor.locator('#publish').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent==='Publikálva');
  assert.equal(posts.at(-1).publish,true,'only explicit Publish sends the new line-height live');
  await publicPage.reload();
  assert.equal(await publicPage.locator(`[data-node-id="${itemId}"]`).evaluate(el=>getComputedStyle(el).lineHeight),draftLineHeight,
    'the separately published line-height reaches the public renderer');
  // Exercise the remaining primary typography controls through the identical
  // real Inspector → Canvas → draft → public boundary, rather than relying on
  // the initial style snapshot alone.
  const verifyInspectorFieldLifecycle=async({propertyId,cssProperty,label,groupName='Tipográfia',nodeId=itemId,publicMatches=(canvasValue,publicValue)=>canvasValue===publicValue,expectedCommand,expectedKey,edit})=>{
    const openGroup=async()=>{
      await editor.locator('.inspector-tabs button').first().click();
      const group=editor.locator('.inspector-group-title').filter({hasText:groupName});
      if(await group.getAttribute('aria-expanded')==='false')await group.click();
    };
    const canvasNode=()=>editor.locator(`.node[data-node-id="${nodeId}"]`);
    const publicNode=()=>publicPage.locator(`[data-node-id="${nodeId}"]`);
    const canvasValue=()=>canvasNode().evaluate((el,key)=>getComputedStyle(el)[key],cssProperty);
    const publicValue=async()=>{await publicNode().waitFor({state:'attached'});return publicNode().evaluate((el,key)=>getComputedStyle(el)[key],cssProperty)};
    await select(nodeId);
    await openGroup();
    const previous=await canvasValue();
    const previousPublic=await publicValue();
    const inspectorField=field(propertyId);
    assert.equal(await inspectorField.count(),1,`${label}: Inspector exposes the expected field`);
    const registeredProperty=listProperties().find(property=>property.id===propertyId);
    assert.ok(registeredProperty,`${label}: lifecycle field belongs to the canonical property registry`);
    assert.equal(await inspectorField.getAttribute('data-property-command'),expectedCommand||registeredProperty.command,`${label}: Inspector exposes the actual command route`);
    assert.equal(await inspectorField.getAttribute('data-property-key'),expectedKey||registeredProperty.key,`${label}: Inspector exposes the actual property key`);
    await edit(inspectorField);
    const next=await canvasValue();
    assert.notEqual(next,previous,`${label}: Inspector edit changes Canvas CSS`);
    await editor.locator('#undo').click();
    assert.equal(await canvasValue(),previous,`${label}: Undo restores the prior Canvas CSS`);
    await editor.locator('#redo').click();
    assert.equal(await canvasValue(),next,`${label}: Redo restores the Inspector CSS`);
    await editor.locator('#save').click();
    await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.startsWith('Mentve'));
    assert.equal(posts.at(-1).publish,false,`${label}: draft Save does not publish`);
    // Verify persistence after the document/app are ready without making the
    // roundtrip depend on every nonessential resource firing a window load.
    await editor.reload({waitUntil:'domcontentloaded'});await select(nodeId);await openGroup();
    assert.equal(await canvasValue(),next,`${label}: draft value survives Editor reload`);
    await publicPage.reload({waitUntil:'domcontentloaded'});
    assert.equal(await publicValue(),previousPublic,`${label}: public value stays unchanged after draft Save`);
    // Publishing is a fetch-based Save action, not a document navigation.
    // Do not make the click wait for unrelated page-load signals; the status,
    // request payload and public CSS assertions below verify completion.
    await editor.locator('#publish').click({noWaitAfter:true});
    await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent==='Publikálva');
    assert.equal(posts.at(-1).publish,true,`${label}: only explicit Publish publishes`);
    await publicPage.reload({waitUntil:'domcontentloaded'});
    assert.equal(publicMatches(next,await publicValue()),true,`${label}: explicit Publish updates public CSS`);
  };
  await verifyInspectorFieldLifecycle({
    propertyId:'typography.fontFamily',cssProperty:'fontFamily',label:'font family',
    edit:control=>control.locator('select:not(.property-token-picker)').selectOption('Georgia')
  });
  await verifyInspectorFieldLifecycle({
    propertyId:'typography.fontWeight',cssProperty:'fontWeight',label:'font weight',
    edit:control=>control.locator('select:not(.property-token-picker)').selectOption('700')
  });
  await verifyInspectorFieldLifecycle({
    propertyId:'typography.fontStyle',cssProperty:'fontStyle',label:'font style',
    edit:control=>control.locator('select:not(.property-token-picker)').selectOption('italic')
  });
  await verifyInspectorFieldLifecycle({
    propertyId:'typography.letterSpacing',cssProperty:'letterSpacing',label:'letter spacing',
    edit:async control=>{const input=control.locator('.dimension-controls input[type="number"]');await input.fill('1');await input.press('Tab')}
  });
  await verifyInspectorFieldLifecycle({
    propertyId:'typography.textTransform',cssProperty:'textTransform',label:'text transform',
    edit:control=>control.locator('select:not(.property-token-picker)').selectOption('uppercase')
  });
  await verifyInspectorFieldLifecycle({
    propertyId:'typography.textDecoration',cssProperty:'textDecoration',label:'text decoration',
    edit:control=>control.locator('select:not(.property-token-picker)').selectOption('underline')
  });
  await verifyInspectorFieldLifecycle({
    propertyId:'typography.color',cssProperty:'color',label:'text color',
    edit:control=>control.locator('input[type="color"]').evaluate(input=>{
      input.value='#c026d3';input.dispatchEvent(new Event('change',{bubbles:true}));
    })
  });
  await verifyInspectorFieldLifecycle({
    propertyId:'typography.textWrap',cssProperty:'textWrap',label:'text wrapping',
    edit:control=>control.locator('select:not(.property-token-picker)').selectOption('nowrap')
  });
  await verifyInspectorFieldLifecycle({
    propertyId:'typography.overflowWrap',cssProperty:'overflowWrap',label:'long word wrapping',
    edit:control=>control.locator('select:not(.property-token-picker)').selectOption('break-word')
  });
  await verifyInspectorFieldLifecycle({
    propertyId:'typography.wordSpacing',cssProperty:'wordSpacing',label:'word spacing',
    edit:async control=>{const input=control.locator('.dimension-controls input[type="number"]');await input.fill('2');await input.press('Tab')}
  });
  await verifyInspectorFieldLifecycle({
    propertyId:'typography.textIndent',cssProperty:'textIndent',label:'first line indent',
    edit:async control=>{const input=control.locator('.dimension-controls input[type="number"]');await input.fill('12');await input.press('Tab')}
  });
  await verifyInspectorFieldLifecycle({
    propertyId:'typography.textShadow',cssProperty:'textShadow',label:'text shadow',
    edit:control=>control.locator('select:not(.property-token-picker)').selectOption('0 2px 8px #0006')
  });
  await verifyInspectorFieldLifecycle({
    propertyId:'border.style',cssProperty:'borderTopStyle',label:'border style',groupName:'Szegély',
    edit:control=>control.locator('select:not(.property-token-picker)').selectOption('solid')
  });
  await verifyInspectorFieldLifecycle({
    propertyId:'border.width',cssProperty:'borderTopWidth',label:'border width',groupName:'Szegély',
    edit:async control=>{const input=control.locator('.dimension-controls input[type="number"]');await input.fill('2');await input.press('Tab')}
  });
  await verifyInspectorFieldLifecycle({
    propertyId:'border.color',cssProperty:'borderTopColor',label:'border color',groupName:'Szegély',
    edit:control=>control.locator('input[type="color"]').evaluate(input=>{
      input.value='#0f766e';input.dispatchEvent(new Event('change',{bubbles:true}));
    })
  });
  await verifyInspectorFieldLifecycle({
    propertyId:'radius.topLeft',cssProperty:'borderTopLeftRadius',label:'top left radius',groupName:'Lekerekítés',
    expectedCommand:'responsive.set',expectedKey:'borderTopLeftRadius',
    edit:async control=>{const input=control.locator('.dimension-controls input[type="number"]');await input.fill('22');await input.press('Tab')}
  });
  await verifyInspectorFieldLifecycle({
    propertyId:'radius.topRight',cssProperty:'borderTopRightRadius',label:'top right radius',groupName:'Lekerekítés',
    expectedCommand:'responsive.set',expectedKey:'borderTopRightRadius',
    edit:async control=>{const input=control.locator('.dimension-controls input[type="number"]');await input.fill('18');await input.press('Tab')}
  });
  await verifyInspectorFieldLifecycle({
    propertyId:'radius.all',cssProperty:'borderBottomLeftRadius',label:'all-corner radius',groupName:'Lekerekítés',
    expectedCommand:'responsive.set',expectedKey:'borderRadius',
    edit:async control=>{const input=control.locator('.dimension-controls input[type="number"]');await input.fill('10');await input.press('Tab')}
  });
  await verifyInspectorFieldLifecycle({
    propertyId:'radius.bottomLeft',cssProperty:'borderBottomLeftRadius',label:'bottom left radius',groupName:'Lekerekítés',
    expectedCommand:'responsive.set',expectedKey:'borderBottomLeftRadius',
    edit:async control=>{const input=control.locator('.dimension-controls input[type="number"]');await input.fill('14');await input.press('Tab')}
  });
  await verifyInspectorFieldLifecycle({
    propertyId:'radius.bottomRight',cssProperty:'borderBottomRightRadius',label:'bottom right radius',groupName:'Lekerekítés',
    expectedCommand:'responsive.set',expectedKey:'borderBottomRightRadius',
    edit:async control=>{const input=control.locator('.dimension-controls input[type="number"]');await input.fill('16');await input.press('Tab')}
  });
  await verifyInspectorFieldLifecycle({
    propertyId:'shadow.box',cssProperty:'boxShadow',label:'box shadow',groupName:'Árnyék',
    edit:control=>control.locator('select:not(.property-token-picker)').selectOption('0 2px 8px #0003')
  });
  await verifyInspectorFieldLifecycle({
    propertyId:'opacity.value',cssProperty:'opacity',label:'opacity',groupName:'Átlátszóság',
    edit:async control=>{const input=control.locator('input[type="number"]');await input.fill('0.75');await input.press('Tab')}
  });
  await verifyInspectorFieldLifecycle({
    propertyId:'background.gradient',cssProperty:'backgroundImage',label:'background gradient',groupName:'Háttér',
    edit:control=>control.locator('select:not(.property-token-picker)').selectOption('linear-gradient(135deg, #7047eb 0%, #17b8a6 100%)')
  });
  await verifyInspectorFieldLifecycle({
    propertyId:'background.size',cssProperty:'backgroundSize',label:'background image size',groupName:'Háttér',
    edit:control=>control.locator('select:not(.property-token-picker)').selectOption('contain')
  });
  await verifyInspectorFieldLifecycle({
    propertyId:'background.position',cssProperty:'backgroundPosition',label:'background image position',groupName:'Háttér',
    edit:control=>control.locator('select:not(.property-token-picker)').selectOption('center top')
  });
  await verifyInspectorFieldLifecycle({
    propertyId:'background.repeat',cssProperty:'backgroundRepeat',label:'background image repeat',groupName:'Háttér',
    edit:control=>control.locator('select:not(.property-token-picker)').selectOption('repeat-x')
  });
  await verifyInspectorFieldLifecycle({
    propertyId:'flex.direction',cssProperty:'flexDirection',label:'flex direction',groupName:'Flex',nodeId:flexId,
    edit:control=>control.locator('select:not(.property-token-picker)').selectOption('row')
  });
  await verifyInspectorFieldLifecycle({
    propertyId:'flex.justify',cssProperty:'justifyContent',label:'flex main-axis alignment',groupName:'Flex',nodeId:flexId,
    edit:control=>control.locator('select:not(.property-token-picker)').selectOption('center')
  });
  await verifyInspectorFieldLifecycle({
    propertyId:'flex.align',cssProperty:'alignItems',label:'flex cross-axis alignment',groupName:'Flex',nodeId:flexId,
    edit:control=>control.locator('select:not(.property-token-picker)').selectOption('center')
  });
  await verifyInspectorFieldLifecycle({
    propertyId:'flex.wrap',cssProperty:'flexWrap',label:'flex wrapping',groupName:'Flex',nodeId:flexId,
    edit:control=>control.locator('select:not(.property-token-picker)').selectOption('wrap')
  });
  await verifyInspectorFieldLifecycle({
    propertyId:'flex.gap',cssProperty:'gap',label:'flex gap',groupName:'Flex',nodeId:flexId,
    edit:async control=>{const input=control.locator('.dimension-controls input[type="number"]');await input.fill('24');await input.press('Tab')}
  });
  await verifyInspectorFieldLifecycle({
    propertyId:'flex.basis',cssProperty:'flexBasis',label:'flex basis',groupName:'Flex',nodeId:flexItemId,
    expectedCommand:'responsive.set',expectedKey:'flexBasis',
    edit:async control=>{const input=control.locator('.dimension-controls input[type="number"]');await input.fill('45');await input.press('Tab')}
  });
  await verifyInspectorFieldLifecycle({
    propertyId:'flex.grow',cssProperty:'flexGrow',label:'flex grow',groupName:'Flex',nodeId:flexItemId,
    expectedCommand:'responsive.set',expectedKey:'flexGrow',
    edit:async control=>{const input=control.locator('input[type="number"]');assert.deepEqual(await input.evaluate(el=>({min:el.min,max:el.max,step:el.step,inputMode:el.inputMode})),{min:'0',max:'100',step:'any',inputMode:'decimal'},'flex growth accepts its declared non-integer range');await input.fill('1.5');await input.press('Tab')}
  });
  await verifyInspectorFieldLifecycle({
    propertyId:'flex.shrink',cssProperty:'flexShrink',label:'flex shrink',groupName:'Flex',nodeId:flexItemId,
    expectedCommand:'responsive.set',expectedKey:'flexShrink',
    edit:async control=>{const input=control.locator('input[type="number"]');await input.fill('0');await input.press('Tab')}
  });
  await verifyInspectorFieldLifecycle({
    propertyId:'flex.alignSelf',cssProperty:'alignSelf',label:'flex item alignment',groupName:'Flex',nodeId:flexItemId,
    edit:control=>control.locator('select:not(.property-token-picker)').selectOption('center')
  });
  await verifyInspectorFieldLifecycle({
    propertyId:'filter.effect',cssProperty:'filter',label:'visual filter',groupName:'Szűrők',
    edit:control=>control.locator('select:not(.property-token-picker)').selectOption('grayscale(1)')
  });
  await verifyInspectorFieldLifecycle({
    propertyId:'animation.transition',cssProperty:'transition',label:'state transition',groupName:'Animáció',
    edit:control=>control.locator('select:not(.property-token-picker)').selectOption('all 180ms ease')
  });
  await verifyInspectorFieldLifecycle({
    propertyId:'transform.rotate',cssProperty:'rotate',label:'rotation',groupName:'Transzformáció',
    edit:async control=>{const input=control.locator('.dimension-controls input[type="number"]');assert.deepEqual(await input.evaluate(el=>({min:el.min,max:el.max,step:el.step})),{min:'-360',max:'360',step:'any'},'rotation input mirrors its signed range');await input.fill('18');await input.press('Tab')}
  });
  await verifyInspectorFieldLifecycle({
    propertyId:'transform.scale',cssProperty:'scale',label:'visual scale',groupName:'Transzformáció',
    edit:async control=>{const input=control.locator('input[type="number"]');assert.deepEqual(await input.evaluate(el=>({min:el.min,max:el.max,step:el.step,inputMode:el.inputMode})),{min:'0.1',max:'4',step:'any',inputMode:'decimal'},'scale native validity accepts every decimal allowed by its validator');await input.fill('1.2');await input.press('ArrowUp');assert.equal(await input.inputValue(),'1.3','scale ArrowUp follows its 0.1 keyboard increment');await input.press('Tab')}
  });
  await verifyInspectorFieldLifecycle({
    propertyId:'grid.row',cssProperty:'gridRowStart',label:'grid row placement',groupName:'Grid-gyermek',nodeId:itemId,
    expectedCommand:'responsive.set',expectedKey:'gridRow',
    edit:control=>control.locator('select:not(.property-token-picker)').selectOption('2')
  });
  await verifyInspectorFieldLifecycle({
    propertyId:'grid.column',cssProperty:'gridColumnStart',label:'grid column placement',groupName:'Grid-gyermek',nodeId:itemId,
    expectedCommand:'responsive.set',expectedKey:'gridColumn',
    edit:control=>control.locator('select:not(.property-token-picker)').selectOption('3')
  });
  await verifyInspectorFieldLifecycle({
    propertyId:'grid.columns',cssProperty:'gridTemplateColumns',label:'grid columns',groupName:'Grid',nodeId:gridId,
    publicMatches:(canvasValue,publicValue)=>canvasValue.trim().split(/\s+/).length===publicValue.trim().split(/\s+/).length,
    edit:control=>control.locator('select:not(.property-token-picker)').selectOption('repeat(3, minmax(0, 1fr))')
  });
  await verifyInspectorFieldLifecycle({
    propertyId:'grid.rows',cssProperty:'gridTemplateRows',label:'grid rows',groupName:'Grid',nodeId:gridId,
    publicMatches:(canvasValue,publicValue)=>canvasValue.trim().split(/\s+/).length===publicValue.trim().split(/\s+/).length,
    edit:control=>control.locator('select:not(.property-token-picker)').selectOption('repeat(2, minmax(0, 1fr))')
  });
  await verifyInspectorFieldLifecycle({
    propertyId:'grid.rowGap',cssProperty:'rowGap',label:'grid row gap',groupName:'Grid',nodeId:gridId,
    edit:async control=>{const input=control.locator('.dimension-controls input[type="number"]');await input.fill('12');await input.press('Tab')}
  });
  await verifyInspectorFieldLifecycle({
    propertyId:'grid.columnGap',cssProperty:'columnGap',label:'grid column gap',groupName:'Grid',nodeId:gridId,
    edit:async control=>{const input=control.locator('.dimension-controls input[type="number"]');await input.fill('18');await input.press('Tab')}
  });
  await verifyInspectorFieldLifecycle({
    propertyId:'size.maxWidth',cssProperty:'maxWidth',label:'maximum width',groupName:'Méret',
    expectedCommand:'responsive.set',expectedKey:'maxWidth',
    edit:async control=>{const input=control.locator('.dimension-controls input[type="number"]');await input.fill('420');await input.press('Tab')}
  });
  await verifyInspectorFieldLifecycle({
    propertyId:'size.minHeight',cssProperty:'minHeight',label:'minimum height',groupName:'Méret',
    expectedCommand:'responsive.set',expectedKey:'minHeight',
    edit:async control=>{const input=control.locator('.dimension-controls input[type="number"]');await input.fill('96');await input.press('Tab')}
  });
  await verifyInspectorFieldLifecycle({
    propertyId:'size.maxHeight',cssProperty:'maxHeight',label:'maximum height',groupName:'Méret',
    expectedCommand:'responsive.set',expectedKey:'maxHeight',
    edit:async control=>{const input=control.locator('.dimension-controls input[type="number"]');await input.fill('240');await input.press('Tab')}
  });
  await verifyInspectorFieldLifecycle({
    propertyId:'spacing.margin',cssProperty:'marginTop',label:'outer spacing',groupName:'Térközök',
    edit:async control=>{const input=control.locator('.typed-box-side').first().locator('input[type="number"]');await input.fill('14');await input.press('Tab')}
  });
  await verifyInspectorFieldLifecycle({
    propertyId:'layout.display',cssProperty:'display',label:'display mode',groupName:'Elrendezés',
    edit:control=>control.locator('select:not(.property-token-picker)').selectOption('flex')
  });
  await verifyInspectorFieldLifecycle({
    propertyId:'layout.overflow',cssProperty:'overflow',label:'overflow mode',groupName:'Elrendezés',
    edit:control=>control.locator('select:not(.property-token-picker)').selectOption('hidden')
  });
  await verifyInspectorFieldLifecycle({
    propertyId:'size.aspectRatio',cssProperty:'aspectRatio',label:'aspect ratio',groupName:'Méret',
    edit:control=>control.locator('select:not(.property-token-picker)').selectOption('16 / 9')
  });
  await verifyInspectorFieldLifecycle({
    propertyId:'size.width',cssProperty:'width',label:'geometry width',groupName:'Geometria',
    expectedCommand:'responsive.set',expectedKey:'width',
    edit:async control=>{
      const input=control.locator('input[type="number"]');
      assert.deepEqual(await input.evaluate(el=>({min:el.min,max:el.max,step:el.step})),{min:'0',max:'',step:'any'},'width input advertises its non-negative range');
      await control.locator('select:not(.property-token-picker)').selectOption('px');
      await input.fill('333');await input.press('Tab');
    }
  });
  await verifyInspectorFieldLifecycle({
    propertyId:'size.height',cssProperty:'height',label:'geometry height',groupName:'Geometria',
    expectedCommand:'responsive.set',expectedKey:'height',
    edit:async control=>{
      await control.locator('select:not(.property-token-picker)').selectOption('px');
      const input=control.locator('input[type="number"]');await input.fill('177');await input.press('Tab');
    }
  });
  await verifyInspectorFieldLifecycle({
    propertyId:'position.x',cssProperty:'left',label:'geometry X position',groupName:'Geometria',
    expectedCommand:'responsive.set',expectedKey:'x',
    edit:async control=>{
      const input=control.locator('input[type="number"]');
      assert.equal(await input.getAttribute('min'),null,'signed canvas offsets must not receive a positive minimum');
      await control.locator('select:not(.property-token-picker)').selectOption('px');
      await input.fill('42');await input.press('Tab');
    }
  });
  await verifyInspectorFieldLifecycle({
    propertyId:'position.y',cssProperty:'top',label:'geometry Y position',groupName:'Geometria',
    expectedCommand:'responsive.set',expectedKey:'y',
    edit:async control=>{
      await control.locator('select:not(.property-token-picker)').selectOption('px');
      const input=control.locator('input[type="number"]');await input.fill('27');await input.press('Tab');
    }
  });
  await verifyInspectorFieldLifecycle({
    propertyId:'position.position',cssProperty:'position',label:'position mode',groupName:'Geometria',
    expectedCommand:'responsive.set',expectedKey:'position',
    edit:control=>control.locator('select:not(.property-token-picker)').selectOption('absolute')
  });
  await verifyInspectorFieldLifecycle({
    propertyId:'position.zIndex',cssProperty:'zIndex',label:'stacking order',groupName:'Pozíció',
    edit:async control=>{const input=control.locator('input[type="number"]');assert.deepEqual(await input.evaluate(el=>({min:el.min,max:el.max,step:el.step,inputMode:el.inputMode})),{min:'-9999',max:'9999',step:'any',inputMode:'decimal'},'z-index native validity preserves its signed integer contract');await input.fill('-12');await input.press('ArrowUp');assert.equal(await input.inputValue(),'-11','z-index ArrowUp uses its declared integer increment');await input.press('Tab')}
  });
  // A dragged/offset static node is rendered with the same relative CSS on
  // canvas and public page. The Inspector also makes leaving the artboard
  // explicit and offers a scoped recovery action.
  await select(offsetId);
  if(await editor.locator('.inspector-group-title[aria-expanded="false"]').filter({hasText:'Geometria'}).count())await editor.locator('.inspector-group-title').filter({hasText:'Geometria'}).click();
  const offsetX=field('position.x').locator('input[type="number"]');
  await offsetX.fill('-96');await offsetX.press('Tab');
  assert.equal(await editor.locator(`.node[data-node-id="${offsetId}"]`).evaluate(el=>el.classList.contains('outside-artboard')),true);
  assert.match(await editor.locator('.layout-warning').first().textContent(),/fehér vásznon kívül/);
  await editor.getByRole('button',{name:'Eltolás visszaállítása ebben a nézetben'}).click();
  assert.equal(await editor.locator(`.node[data-node-id="${offsetId}"]`).evaluate(el=>el.classList.contains('outside-artboard')),false);
  await offsetX.fill('72');await offsetX.press('Tab');
  assert.deepEqual(await editor.locator(`.node[data-node-id="${offsetId}"]`).evaluate(el=>{const style=getComputedStyle(el);return {position:style.position,left:style.left}}),{position:'relative',left:'72px'});
  await editor.locator('#save').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.startsWith('Mentve'));
  assert.equal(posts.at(-1).publish,false);
  await publicPage.reload();
  assert.notEqual(await publicPage.locator(`[data-node-id="${offsetId}"]`).evaluate(el=>getComputedStyle(el).left),'72px','draft offset stays private before Publish');
  await editor.locator('#publish').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent==='Publikálva');
  await publicPage.reload();
  assert.deepEqual(await publicPage.locator(`[data-node-id="${offsetId}"]`).evaluate(el=>{const style=getComputedStyle(el);return {position:style.position,left:style.left}}),{position:'relative',left:'72px'});
  // An unsatisfied publication-only requirement may remain visible after a
  // refused Publish, but it must not prevent a draft-only save.
  const beforePublicationNote=posts.length;
  const publicBeforeNote=JSON.stringify(published);
  await editor.locator('#inspectorBody').evaluate(host=>{
    const note=document.createElement('p');
    note.className='property-validation';
    note.dataset.validationKind='publication';
    note.setAttribute('role','alert');
    note.textContent='A publikálás előtt hiányzó kötelező tartalom.';
    host.prepend(note);
  });
  await editor.locator('#save').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.startsWith('Mentve'));
  assert.equal(posts.length,beforePublicationNote+1,'draft save may proceed despite publication-only warning');
  assert.equal(posts.at(-1).publish,false,'saving after a failed Publish never implicitly republishes');
  assert.equal(JSON.stringify(published),publicBeforeNote,'draft save must not alter live content');
  // A real mobile viewport edits only its own override; the published page stays unchanged.
  await editor.setViewportSize({width:390,height:800});
  if(await editor.locator('#rightDock').evaluate(el=>el.classList.contains('closed')))
    await editor.locator('#openInspector').click();
  const spacingHeading=editor.locator('.inspector-group-title').filter({hasText:'Térközök'});
  if(await spacingHeading.getAttribute('aria-expanded')==='false')await spacingHeading.click();
  // Changing a breakpoint must never consume a pending invalid typed edit:
  // the click may already have moved DOM focus away from the Inspector field.
  const paddingTopEditor=field('spacing.padding').locator('.typed-box-entry input').first();
  await paddingTopEditor.fill('-7');
  await paddingTopEditor.dispatchEvent('change');
  assert.match(await field('spacing.padding').locator('.property-validation').textContent(),/negatív|belső|padding/i);
  // A category filter and closed accordion must not trap a validation error
  // after Save blurs the field. The existing right dock should lead to it.
  const spacingTitleInvalid=editor.locator('.inspector-group-title').filter({hasText:'Térközök'});
  if(await spacingTitleInvalid.getAttribute('aria-expanded')==='true')await spacingTitleInvalid.click();
  await editor.locator('.inspector-category-nav button[data-inspector-category="surface"]').click();
  assert.equal(await field('spacing.padding').isVisible(),false,'surface filter hides the invalid spacing input before Save');
  const pendingInvalidPosts=posts.length;
  const publishedBeforeInvalid=JSON.stringify(published);
  // Clicking Save intentionally blurs the invalid input. The application
  // must inspect unresolved Inspector validation, not only activeElement.
  await editor.locator('#save').click();
  await editor.waitForFunction(()=>document.activeElement?.getAttribute('aria-label')==='Belső térköz – Felül értéke');
  assert.equal(await field('spacing.padding').isVisible(),true,'Save reveals the invalid field');
  assert.equal(await spacingTitleInvalid.getAttribute('aria-expanded'),'true','Save expands the invalid group');
  assert.equal(await editor.locator('.inspector-category-nav button[data-inspector-category="all"]').getAttribute('aria-pressed'),'true','Save resets the category filter to show the error');
  assert.equal(await editor.locator('#rightDock').getAttribute('aria-hidden'),'false','Inspector must be accessible while the error is shown');
  assert.equal(posts.length,pendingInvalidPosts,'blurred invalid padding must not produce a draft save request');
  assert.equal(JSON.stringify(published),publishedBeforeInvalid,'previous public snapshot stays untouched');
  assert.equal(await field('spacing.padding').locator('.typed-box-entry input').first().inputValue(),'-7');
  await editor.locator('#publish').evaluate(button=>{
    const wasDisabled=button.disabled;
    button.disabled=false;
    button.click();
    button.disabled=wasDisabled;
  });
  assert.equal(posts.length,pendingInvalidPosts,'desktop Publish must not send a request for a blurred invalid Inspector field');
  assert.match(await editor.locator('#saveStatus').textContent(),/Javítsd a jelzett mezőt/);
  // The focused field may be lost when Save/Publish is triggered from a
  // toolbar. Invalid input must never commit or publish the older model.
  const writesBeforeInvalid=posts.length;
  await editor.keyboard.press('Control+s');
  assert.equal(posts.length,writesBeforeInvalid,'Ctrl+S must not send a revision with an invalid Inspector field');
  assert.match(await editor.locator('#saveStatus').textContent(),/Javítsd a jelzett mezőt/);
  await editor.locator('#mobilePublish').evaluate(button=>{
    const wasDisabled=button.disabled;
    button.disabled=false;
    button.click();
    button.disabled=wasDisabled;
  });
  assert.equal(posts.length,writesBeforeInvalid,'Publish must also reject an invalid field even if action is invoked');
  await editor.locator('.canvas-device-btn[data-device="mobile"]').evaluate(el=>el.click());
  assert.equal(await editor.locator('.canvas-device-btn[data-device="desktop"]').getAttribute('class').then(x=>x.includes('active')),true,'invalid Inspector input must keep desktop editor state');
  assert.equal(await editor.locator('.canvas-device-btn[data-device="mobile"]').getAttribute('class').then(x=>x.includes('active')),false,'invalid Inspector input must not activate mobile');
  assert.equal(await field('spacing.padding').locator('.typed-box-entry input').first().inputValue(),'-7','unsaved invalid value stays available for correction');
  await field('spacing.padding').locator('.typed-box-entry input').first().fill('16');
  await field('spacing.padding').locator('.typed-box-entry input').first().dispatchEvent('change');
  assert.equal(await field('spacing.padding').locator('.property-validation').textContent(),'');
  await editor.locator('.canvas-device-btn[data-device="mobile"]').evaluate(el=>el.click());
  assert.equal(await editor.locator('.canvas-device-btn[data-device="mobile"]').getAttribute('class').then(x=>x.includes('active')),true,'valid corrected field allows mobile breakpoint');

  await select(itemId);
  // Geometry was previously only resettable one property at a time. Its
  // breakpoint-local width now shares the atomic group reset contract.
  const geometryHeading=editor.locator('.inspector-group-title').filter({hasText:'Geometria'});
  if(await geometryHeading.getAttribute('aria-expanded')==='false')await geometryHeading.click();
  const widthUnit=field('size.width').locator('select:not(.property-token-picker)');
  await widthUnit.selectOption('px');
  const mobileWidth=field('size.width').locator('input[type="number"]');
  await mobileWidth.fill('260');
  await mobileWidth.press('Tab');
  assert.equal(await field('size.width').locator('.responsive-origin').textContent(),'Saját érték · Mobil');
  const geometryGroup=field('size.width').locator('xpath=ancestor::section[contains(@class,"inspector-group")]');
  assert.equal(await geometryGroup.locator('.group-responsive-reset').count(),1);
  await geometryGroup.locator('.group-responsive-reset').click();
  assert.notEqual(await field('size.width').locator('.responsive-origin').getAttribute('data-kind'),'own','reset width must no longer have a mobile override');
  await editor.locator('#mobileUndo').click();
  assert.equal(await field('size.width').locator('input[type="number"]').inputValue(),'260');
  await geometryGroup.locator('.group-responsive-reset').click();
  assert.notEqual(await field('size.width').locator('.responsive-origin').getAttribute('data-kind'),'own','reset width must no longer have a mobile override');
  assert.equal(await field('radius.topLeft').locator('.responsive-origin').textContent(),'Örökölt · Asztali','mobile radius must identify desktop inheritance');
  await editor.locator('.inspector-group-title').filter({hasText:'Lekerekítés'}).click();
  assert.ok((await field('radius.topLeft').locator('input').boundingBox()).height>=44);
  await field('radius.topLeft').locator('input[type="number"]').fill('6');
  await field('radius.topLeft').locator('input').press('Tab');
  assert.equal((await css()).radius,'6px');
  assert.equal(await field('radius.topLeft').locator('.responsive-origin').textContent(),'Saját érték · Mobil','new override must be marked local');
  await editor.locator('.inspector-lock-toggle').check();
  assert.equal(await field('radius.topLeft').locator('input[type="number"]').isDisabled(),true);
  assert.equal(await editor.locator('.property-reset').filter({hasText:'Öröklés visszaállítása'}).first().isDisabled(),true);
  assert.equal(await field('radius.topLeft').locator('xpath=ancestor::section[contains(@class,"inspector-group")]').locator('.group-responsive-reset').isDisabled(),true,'locked node cannot reset group');
  await editor.locator('.inspector-lock-toggle').uncheck();
  const radiusGroup=field('radius.topLeft').locator('xpath=ancestor::section[contains(@class,"inspector-group")]');
  const bulkReset=radiusGroup.locator('.group-responsive-reset');
  assert.equal(await bulkReset.isEnabled(),true);
  assert.match(await bulkReset.textContent(),/Saját értékek visszaállítása/);
  await bulkReset.click();
  assert.equal((await css()).radius,'22px');
  assert.equal(await field('radius.topLeft').locator('.responsive-origin').textContent(),'Örökölt · Asztali','bulk reset restores desktop origin');
  await editor.locator('#mobileUndo').click();
  assert.equal((await css()).radius,'6px');
  await editor.keyboard.press('Control+s');
  await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.startsWith('Mentve'));
  assert.equal(posts.at(-1).publish,false);
  const preResizeText=await publicPage.locator('.visual-card > .visual-text').first().elementHandle();
  await publicPage.setViewportSize({width:390,height:800});
  await publicPage.waitForFunction(previous=>{const current=document.querySelector('.visual-card > .visual-text');return current&&current!==previous},preResizeText);
  await publicPage.waitForFunction(()=>getComputedStyle(document.querySelector('.visual-card > .visual-text')).borderTopLeftRadius==='22px');
  assert.equal((await publicCss()).radius,'22px','mobile draft Save must preserve the previously published inherited radius');
  await editor.locator('#publish').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent==='Publikálva');
  assert.equal(posts.at(-1).publish,true,'mobile radius override is published only through explicit Publish');
  await publicPage.reload();
  await publicPage.waitForFunction(()=>getComputedStyle(document.querySelector('.visual-card > .visual-text')).borderTopLeftRadius==='6px');
  assert.equal((await publicCss()).radius,'6px','published mobile radius override reaches the public renderer');
  // The shared Media picker must write background assets to the active mobile
  // breakpoint and keep that asset independent from the desktop snapshot.
  const mobileBackgroundImageField=field('background.image');
  await assertRegisteredRoute('background.image');
  const mobileBackgroundHeading=editor.locator('.inspector-group-title').filter({hasText:'Háttér'});
  if(await mobileBackgroundHeading.getAttribute('aria-expanded')==='false')await mobileBackgroundHeading.click();
  const mobileBackgroundPicker=mobileBackgroundImageField.locator('.editor-media-picker');
  const priorPublishedMobileBackground=await publishedBackgroundImage();
  await publicPage.setViewportSize({width:1366,height:900});await publicPage.reload();
  const priorPublishedDesktopBackground=await publishedBackgroundImage();
  await publicPage.setViewportSize({width:390,height:800});await publicPage.reload();
  await mobileBackgroundPicker.getByRole('button',{name:'Médiatár megnyitása'}).click();
  await mobileBackgroundPicker.locator('[role="region"][aria-label="Médiatár találatok"]').waitFor();
  await mobileBackgroundPicker.getByRole('button',{name:'Mobil Inspector háttér.png kiválasztása'}).click();
  assert.ok((await backgroundImage()).includes(`/api/admin/media?id=${inspectorMobileBackgroundAssetId}`),'mobile media selection previews through the authenticated Canvas route');
  await editor.locator('#mobileUndo').click();
  assert.equal((await backgroundImage()).includes(`/api/admin/media?id=${inspectorMobileBackgroundAssetId}`),false,'mobile Undo removes only the pending asset override');
  await editor.locator('#mobileRedo').click();
  assert.ok((await backgroundImage()).includes(`/api/admin/media?id=${inspectorMobileBackgroundAssetId}`),'mobile Redo restores the same asset override');
  assert.equal(await publishedBackgroundImage(),priorPublishedMobileBackground,'the previously published mobile background remains unchanged while the new asset is a draft');
  await editor.locator('#save').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.startsWith('Mentve'));
  assert.equal(posts.at(-1).publish,false,'mobile background Save remains draft-only');
  assert.equal(posts.at(-1).document.pages[pageId].nodes[itemId].responsive.mobile.backgroundAssetId,inspectorMobileBackgroundAssetId,'mobile asset ID is saved only to the mobile Page Model override');
  assert.notEqual(posts.at(-1).document.pages[pageId].nodes[itemId].responsive.desktop.backgroundAssetId,inspectorMobileBackgroundAssetId,'mobile asset selection does not replace the desktop asset');
  await editor.reload({waitUntil:'domcontentloaded'});await select(itemId);
  const mobileDeviceButton=editor.locator('.canvas-device-btn[data-device="mobile"]');
  if(!await mobileDeviceButton.evaluate(el=>el.classList.contains('active')))await mobileDeviceButton.evaluate(el=>el.click());
  const reloadedMobileBackgroundHeading=editor.locator('.inspector-group-title').filter({hasText:'Háttér'});
  if(await reloadedMobileBackgroundHeading.getAttribute('aria-expanded')==='false')await reloadedMobileBackgroundHeading.click();
  assert.ok((await backgroundImage()).includes(`/api/admin/media?id=${inspectorMobileBackgroundAssetId}`),'mobile background selection survives Editor reload');
  await publicPage.reload();
  assert.equal(await publishedBackgroundImage(),priorPublishedMobileBackground,'draft mobile image remains unpublished');
  await editor.locator('#publish').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent==='Publikálva');
  await publicPage.reload();
  assert.ok((await publishedBackgroundImage()).includes(`/media/${inspectorMobileBackgroundAssetId}`),'separate Publish exposes the mobile asset through the public media route');
  await mobileBackgroundPicker.getByRole('button',{name:'Kép eltávolítása',exact:true}).click();
  assert.equal((await backgroundImage()).includes(`/api/admin/media?id=${inspectorMobileBackgroundAssetId}`),false,'mobile removal clears the current Canvas asset override');
  await editor.locator('#save').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.startsWith('Mentve'));
  assert.equal(posts.at(-1).publish,false,'mobile asset removal remains draft-only');
  assert.notEqual(posts.at(-1).document.pages[pageId].nodes[itemId].responsive.mobile.backgroundAssetId,inspectorMobileBackgroundAssetId,'draft removal clears only the mobile asset ID');
  await editor.reload({waitUntil:'domcontentloaded'});await select(itemId);
  const mobileAfterRemovalButton=editor.locator('.canvas-device-btn[data-device="mobile"]');
  if(!await mobileAfterRemovalButton.evaluate(el=>el.classList.contains('active')))await mobileAfterRemovalButton.evaluate(el=>el.click());
  const removedMobileBackgroundHeading=editor.locator('.inspector-group-title').filter({hasText:'Háttér'});
  if(await removedMobileBackgroundHeading.getAttribute('aria-expanded')==='false')await removedMobileBackgroundHeading.click();
  assert.equal((await backgroundImage()).includes(`/api/admin/media?id=${inspectorMobileBackgroundAssetId}`),false,'mobile asset removal survives Editor reload');
  await publicPage.reload();
  assert.ok((await publishedBackgroundImage()).includes(`/media/${inspectorMobileBackgroundAssetId}`),'draft removal keeps the previously published mobile asset live');
  await editor.locator('#publish').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent==='Publikálva');
  await publicPage.reload();
  assert.equal(await publishedBackgroundImage(),priorPublishedDesktopBackground,'explicit Publish removes the mobile asset and restores inherited desktop background');
  const desktopDeviceButton=editor.locator('.canvas-device-btn[data-device="desktop"]');
  if(!await desktopDeviceButton.evaluate(el=>el.classList.contains('active')))await desktopDeviceButton.evaluate(el=>el.click());
  await publicPage.setViewportSize({width:1366,height:900});
  await publicPage.reload();
  assert.equal(await publishedBackgroundImage(),priorPublishedDesktopBackground,'published mobile asset does not change the independent desktop background');
  const tabletDeviceButton=editor.locator('.canvas-device-btn[data-device="tablet"]');
  if(!await tabletDeviceButton.evaluate(el=>el.classList.contains('active')))await tabletDeviceButton.evaluate(el=>el.click());
  await publicPage.setViewportSize({width:768,height:900});await publicPage.reload();
  const priorPublishedTabletBackground=await publishedBackgroundImage();
  assert.equal(priorPublishedTabletBackground,priorPublishedDesktopBackground,'tablet initially inherits the independent desktop background');
  const tabletBackgroundPicker=field('background.image').locator('.editor-media-picker');
  await tabletBackgroundPicker.getByRole('button',{name:'Médiatár megnyitása'}).click();
  await tabletBackgroundPicker.locator('[role="region"][aria-label="Médiatár találatok"]').waitFor();
  await tabletBackgroundPicker.getByRole('button',{name:'Tablet Inspector háttér.png kiválasztása',exact:true}).click();
  assert.ok((await backgroundImage()).includes(`/api/admin/media?id=${inspectorTabletBackgroundAssetId}`),'tablet media selection previews through the authenticated Canvas route');
  await editor.locator('#mobileUndo').click();
  assert.equal((await backgroundImage()).includes(`/api/admin/media?id=${inspectorTabletBackgroundAssetId}`),false,'tablet Undo removes only the pending asset override');
  await editor.locator('#mobileRedo').click();
  assert.ok((await backgroundImage()).includes(`/api/admin/media?id=${inspectorTabletBackgroundAssetId}`),'tablet Redo restores the same asset override');
  assert.equal(await publishedBackgroundImage(),priorPublishedTabletBackground,'published tablet background remains unchanged while its new asset is a draft');
  await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.startsWith('Mentve'));
  assert.equal(posts.at(-1).publish,false,'tablet background Save remains draft-only');
  const savedTabletAssetNode=posts.at(-1).document.pages[pageId].nodes[itemId].responsive.tablet;
  assert.equal(savedTabletAssetNode.backgroundAssetId,inspectorTabletBackgroundAssetId,'tablet asset ID is saved only in the tablet Page Model override');
  assert.notEqual(posts.at(-1).document.pages[pageId].nodes[itemId].responsive.desktop.backgroundAssetId,inspectorTabletBackgroundAssetId,'tablet asset selection does not replace desktop asset');
  assert.notEqual(posts.at(-1).document.pages[pageId].nodes[itemId].responsive.mobile.backgroundAssetId,inspectorTabletBackgroundAssetId,'tablet asset selection does not replace mobile asset');
  await editor.reload({waitUntil:'domcontentloaded'});await select(itemId);
  const tabletReloadButton=editor.locator('.canvas-device-btn[data-device="tablet"]');
  if(!await tabletReloadButton.evaluate(el=>el.classList.contains('active')))await tabletReloadButton.evaluate(el=>el.click());
  const reloadedTabletAssetHeading=editor.locator('.inspector-group-title').filter({hasText:'Háttér'});if(await reloadedTabletAssetHeading.getAttribute('aria-expanded')==='false')await reloadedTabletAssetHeading.click();
  assert.ok((await backgroundImage()).includes(`/api/admin/media?id=${inspectorTabletBackgroundAssetId}`),'tablet background asset survives Editor reload');
  await publicPage.reload();assert.equal(await publishedBackgroundImage(),priorPublishedTabletBackground,'draft tablet asset remains unpublished');
  await editor.locator('#publish').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent==='Publikálva');
  await publicPage.reload();
  assert.ok((await publishedBackgroundImage()).includes(`/media/${inspectorTabletBackgroundAssetId}`),'separate Publish exposes the tablet asset through the public media route');
  const publishedTabletAssetBackground=await publishedBackgroundImage();
  await tabletBackgroundPicker.getByRole('button',{name:'Kép eltávolítása',exact:true}).click();
  assert.equal((await backgroundImage()).includes(`/api/admin/media?id=${inspectorTabletBackgroundAssetId}`),false,'tablet removal clears the current Canvas asset override');
  await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.startsWith('Mentve'));
  assert.equal(posts.at(-1).publish,false,'tablet asset removal remains draft-only');
  assert.notEqual(posts.at(-1).document.pages[pageId].nodes[itemId].responsive.tablet.backgroundAssetId,inspectorTabletBackgroundAssetId,'draft removal clears only the tablet asset ID');
  await editor.reload({waitUntil:'domcontentloaded'});await select(itemId);
  const tabletAfterRemovalButton=editor.locator('.canvas-device-btn[data-device="tablet"]');
  if(!await tabletAfterRemovalButton.evaluate(el=>el.classList.contains('active')))await tabletAfterRemovalButton.evaluate(el=>el.click());
  const removedTabletBackgroundHeading=editor.locator('.inspector-group-title').filter({hasText:'Háttér'});if(await removedTabletBackgroundHeading.getAttribute('aria-expanded')==='false')await removedTabletBackgroundHeading.click();
  assert.equal((await backgroundImage()).includes(`/api/admin/media?id=${inspectorTabletBackgroundAssetId}`),false,'tablet asset removal survives Editor reload');
  await publicPage.reload();assert.equal(await publishedBackgroundImage(),publishedTabletAssetBackground,'draft tablet removal keeps the published tablet asset live');
  await editor.locator('#publish').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent==='Publikálva');
  await publicPage.reload();assert.equal(await publishedBackgroundImage(),priorPublishedDesktopBackground,'publishing tablet removal restores inherited desktop background');
  await publicPage.setViewportSize({width:390,height:800});await publicPage.reload();
  assert.equal(await publishedBackgroundImage(),priorPublishedDesktopBackground,'tablet asset selection and removal leave the independent mobile background unchanged');
  await publicPage.setViewportSize({width:1366,height:900});await publicPage.reload();
  assert.equal(await publishedBackgroundImage(),priorPublishedDesktopBackground,'tablet asset selection and removal leave the independent desktop background unchanged');
  assert.deepEqual(errors,[]);
});
