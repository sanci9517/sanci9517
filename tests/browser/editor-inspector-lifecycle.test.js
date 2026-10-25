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

const root=resolve(import.meta.dirname,'../../public');

test('real Inspector layout survives selection, undo, save/reload and separate publish with canvas/public parity',async t=>{
  const model=createEditorState(createDocument());
  const pageId=model.document.activePageId;
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
  let draft=structuredClone(model.document), published=null, version=1;
  const posts=[];
  const server=createServer(async(req,res)=>{
    const url=new URL(req.url,'http://localhost');
    const json=data=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(data))};
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
  editor.setDefaultTimeout(5000);
  const errors=[];
  editor.on('pageerror',error=>errors.push(error.message));
  await editor.goto(base+'/editor-v2/index.html');
  const select=async id=>{
    await editor.locator(`.node[data-node-id="${id}"]`).evaluate(el=>el.click());
    if(await editor.locator('#rightDock').evaluate(el=>el.classList.contains('closed')))await editor.locator('#openInspector').click();
  };
  const field=id=>editor.locator(`.typed-inspector-field[data-property-id="${id}"]`);
  // Multi-element Inspector: shared dimensions apply atomically to both nodes,
  // keep focus after rerender, and remain undoable as a single operation.
  await select(flexId);
  await editor.locator(`.node[data-node-id="${offsetId}"]`).evaluate(el=>el.dispatchEvent(new MouseEvent('click',{bubbles:true,ctrlKey:true})));
  assert.equal(await editor.locator('.multi-inspector').count(),1,'multi-selection exposes shared Inspector');
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
  await field('size.minWidth').locator('input').press('Tab');
  await editor.locator('.inspector-tabs button').first().click();
  await field('radius.topLeft').locator('input[type="number"]').fill('12');
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
  await editor.locator('.inspector-lock-toggle').check();
  assert.match(await editor.locator('.inspector-locked-note').textContent(),/Stílus fülön/);
  assert.equal(await field('background.color').locator('input[type="color"]').isDisabled(),true);
  assert.equal(await field('spacing.padding').locator('input').first().isDisabled(),true);
  assert.equal(await field('spacing.padding').locator('.property-preset').first().isDisabled(),true);
  assert.equal(await field('typography.fontSize').locator('.property-token-picker').isDisabled(),true);
  assert.equal(await editor.locator('.geometry-presets button').first().isDisabled(),true);
  assert.equal(await editor.locator('.inspector-actions .danger-action').isDisabled(),true);
  assert.equal(await editor.getByLabel('Beállítás keresése').isEnabled(),true);
  await field('background.color').locator('.property-info-toggle').click();
  assert.equal(await field('background.color').locator('.property-info-toggle').getAttribute('aria-expanded'),'true');
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
  publicPage.on('pageerror',error=>errors.push(error.message));
  await publicPage.goto(base+'/p/test');
  await publicPage.locator('.visual-card > .visual-text').first().waitFor();
  assert.equal(await publicPage.locator(`[data-node-id="${itemId}"]`).evaluate(el=>getComputedStyle(el).textAlign),'center',
    'the separately published public snapshot uses the same Inspector text alignment');
  const publicCss=()=>publicPage.locator('.visual-card > .visual-text').first().evaluate(el=>{const style=getComputedStyle(el);return {column:style.gridColumnStart,minWidth:style.minWidth,radius:style.borderTopLeftRadius}});
  await select(itemId);
  assert.deepEqual(await publicCss(),await css());
  assert.deepEqual(await publicPage.locator('.visual-card > .visual-text').first().evaluate(el=>{const style=getComputedStyle(el);return {paddingTop:style.paddingTop,paddingRight:style.paddingRight,backgroundColor:style.backgroundColor,fontSize:style.fontSize}}),await presetStyle());
  assert.deepEqual(await publicPage.locator('.visual-card:nth-child(2) > .visual-text').evaluate(el=>{const style=getComputedStyle(el);return {basis:style.flexBasis,maxWidth:style.maxWidth}}),await flexCss());
  // A second Inspector field follows its own full route. Changing the color
  // must reach Canvas, remain one undoable command, persist as a draft, and
  // update the live page only after the separate Publish action.
  const backgroundColor=()=>item.evaluate(el=>getComputedStyle(el).backgroundColor);
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
  const publishedLineHeight=await lineHeightCss();
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
  const verifyInspectorFieldLifecycle=async({propertyId,cssProperty,label,groupName='Tipográfia',edit})=>{
    const openGroup=async()=>{
      await editor.locator('.inspector-tabs button').first().click();
      const group=editor.locator('.inspector-group-title').filter({hasText:groupName});
      if(await group.getAttribute('aria-expanded')==='false')await group.click();
    };
    const canvasValue=()=>item.evaluate((el,key)=>getComputedStyle(el)[key],cssProperty);
    const publicValue=()=>publicPage.locator(`[data-node-id="${itemId}"]`).evaluate((el,key)=>getComputedStyle(el)[key],cssProperty);
    await openGroup();
    const previous=await canvasValue();
    const previousPublic=await publicValue();
    const inspectorField=field(propertyId);
    assert.equal(await inspectorField.count(),1,`${label}: Inspector exposes the expected field`);
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
    await editor.reload();await select(itemId);await openGroup();
    assert.equal(await canvasValue(),next,`${label}: draft value survives Editor reload`);
    await publicPage.reload();
    assert.equal(await publicValue(),previousPublic,`${label}: public value stays unchanged after draft Save`);
    await editor.locator('#publish').click();
    await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent==='Publikálva');
    assert.equal(posts.at(-1).publish,true,`${label}: only explicit Publish publishes`);
    await publicPage.reload();
    assert.equal(await publicValue(),next,`${label}: explicit Publish updates public CSS`);
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
    propertyId:'radius.topRight',cssProperty:'borderTopRightRadius',label:'top right radius',groupName:'Lekerekítés',
    edit:async control=>{const input=control.locator('.dimension-controls input[type="number"]');await input.fill('18');await input.press('Tab')}
  });
  await verifyInspectorFieldLifecycle({
    propertyId:'shadow.box',cssProperty:'boxShadow',label:'box shadow',groupName:'Árnyék',
    edit:control=>control.locator('select:not(.property-token-picker)').selectOption('0 2px 8px #0003')
  });
  await verifyInspectorFieldLifecycle({
    propertyId:'opacity.value',cssProperty:'opacity',label:'opacity',groupName:'Átlátszóság',
    edit:async control=>{const input=control.locator('input[type="number"]');await input.fill('0.75');await input.press('Tab')}
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
  assert.equal((await css()).radius,'12px');
  assert.equal(await field('radius.topLeft').locator('.responsive-origin').textContent(),'Örökölt · Asztali','bulk reset restores desktop origin');
  await editor.locator('#mobileUndo').click();
  assert.equal((await css()).radius,'6px');
  await editor.keyboard.press('Control+s');
  await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.startsWith('Mentve'));
  assert.equal(posts.at(-1).publish,false);
  const preResizeText=await publicPage.locator('.visual-card > .visual-text').first().elementHandle();
  await publicPage.setViewportSize({width:390,height:800});
  await publicPage.waitForFunction(previous=>{const current=document.querySelector('.visual-card > .visual-text');return current&&current!==previous},preResizeText);
  await publicPage.waitForFunction(()=>getComputedStyle(document.querySelector('.visual-card > .visual-text')).borderTopLeftRadius==='12px');
  assert.equal((await publicCss()).radius,'12px','mobile draft Save must preserve the previously published inherited radius');
  await editor.locator('#publish').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent==='Publikálva');
  assert.equal(posts.at(-1).publish,true,'mobile radius override is published only through explicit Publish');
  await publicPage.reload();
  await publicPage.waitForFunction(()=>getComputedStyle(document.querySelector('.visual-card > .visual-text')).borderTopLeftRadius==='6px');
  assert.equal((await publicCss()).radius,'6px','published mobile radius override reaches the public renderer');
  assert.deepEqual(errors,[]);
});
