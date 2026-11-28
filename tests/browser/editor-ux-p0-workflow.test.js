import assert from 'node:assert/strict';
import test from 'node:test';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve,extname} from 'node:path';
import {chromium} from 'playwright';
import {createDocument} from '../../public/editor-v2/core/schema.js';

const root=resolve(import.meta.dirname,'../../public');

test('empty Rich Text has direct desktop and mobile editing, typed presets, Save and separate Publish',async t=>{
  const original=createDocument();
  const pageId=original.activePageId;
  let draft=structuredClone(original),published=null,version=1;
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
      return json({ok:true,data:{pageId,version,revisionId:'revision-'+version,published:Boolean(request.publish)}});
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
  const tab=await browser.newPage({viewport:{width:1366,height:900}});
  tab.setDefaultTimeout(7000);
  const errors=[];tab.on('pageerror',e=>errors.push(e.message));
  await tab.goto(base+'/editor-v2/index.html');
  assert.equal(await tab.evaluate(async()=>{const {richTextEditorToDocument}=await import('/editor-v2/core/richtext-engine.js');const host=document.createElement('div');host.append(document.createTextNode('Beillesztett szöveg'),document.createElement('p'));return richTextEditorToDocument(host).blocks[0].children[0].text}),'Beillesztett szöveg');
  await tab.locator('.page-canvas .node').first().waitFor();
  await tab.locator('#zoomOut').click();
  const scaledArtboard=await tab.locator('#canvas').evaluate(el=>{const frame=el.querySelector('.page-canvas-frame'),page=el.querySelector('.page-canvas');return {frameWidth:frame.getBoundingClientRect().width,pageWidth:page.getBoundingClientRect().width,layoutWidth:el.scrollWidth,viewportWidth:el.clientWidth}});
  assert.ok(Math.abs(scaledArtboard.frameWidth-scaledArtboard.pageWidth)<1);
  assert.ok(scaledArtboard.frameWidth<1440);
  assert.ok(scaledArtboard.layoutWidth<1440,'scaled canvas should not retain a 1440px unscaled layout footprint');
  await tab.locator('#canvas').evaluate(el=>el.scrollTo({left:el.scrollWidth,top:el.scrollHeight,behavior:'instant'}));
  await tab.locator('#fitCanvas').click();
  const fittedArtboard=await tab.locator('#canvas').evaluate(el=>{const frame=el.querySelector('.page-canvas-frame'),rect=frame.getBoundingClientRect(),canvas=el.getBoundingClientRect();return {left:rect.left,canvasLeft:canvas.left,scrollLeft:el.scrollLeft,scrollTop:el.scrollTop,visible:rect.right>canvas.left&&rect.left<canvas.right}});
  assert.equal(fittedArtboard.scrollLeft,0);assert.equal(fittedArtboard.scrollTop,0);assert.equal(fittedArtboard.visible,true);
  for(let index=0;index<8;index++)await tab.locator('#zoomIn').click();
  const canvas=tab.locator('#canvas'),panNode=tab.locator('.page-canvas .node').first();
  await canvas.evaluate(el=>el.scrollTo({left:0,top:0,behavior:'instant'}));
  const panBefore=await canvas.evaluate(el=>({left:el.scrollLeft,top:el.scrollTop,maxLeft:el.scrollWidth-el.clientWidth,maxTop:el.scrollHeight-el.clientHeight,touchAction:getComputedStyle(el).touchAction}));
  assert.ok(panBefore.maxLeft>40&&panBefore.maxTop>20,'the zoomed canvas exposes horizontal and vertical overflow for panning');
  const nodeBeforePan=await panNode.evaluate(el=>({left:getComputedStyle(el).left,top:getComputedStyle(el).top,selected:el.classList.contains('selected')}));
  const modelBeforePan=JSON.stringify(draft),postsBeforePan=posts.length;
  await tab.locator('#panTool').click();
  const panMode=await canvas.evaluate(el=>({active:el.classList.contains('pan-tool-active'),touchAction:getComputedStyle(el).touchAction}));
  assert.equal(panMode.active,true,'Pan mode applies the viewport-only gesture state');
  assert.equal(panMode.touchAction,'none','touch pan disables browser page-gesture takeover on the canvas');
  const interactiveCanvasControl=await canvas.evaluate(el=>{const button=document.createElement('button');button.id='canvasPanInteractiveProbe';button.type='button';button.textContent='Vászon vezérlő';button.style.cssText='position:absolute;left:12px;top:12px;z-index:10';button.dataset.activations='0';button.addEventListener('click',()=>button.dataset.activations=String(Number(button.dataset.activations)+1));el.append(button);el.scrollTo({left:0,top:0,behavior:'instant'});return {left:el.scrollLeft,top:el.scrollTop}});
  const interactiveButton=tab.locator('#canvasPanInteractiveProbe'),interactiveBox=await interactiveButton.boundingBox();assert.ok(interactiveBox,'an interactive canvas child is available as a no-pan target');
  await tab.mouse.move(interactiveBox.x+interactiveBox.width/2,interactiveBox.y+interactiveBox.height/2);await tab.mouse.down();await tab.mouse.move(interactiveBox.x+interactiveBox.width/2-36,interactiveBox.y+interactiveBox.height/2-24,{steps:4});await tab.mouse.up();
  assert.deepEqual(await canvas.evaluate(el=>({left:el.scrollLeft,top:el.scrollTop,panning:el.classList.contains('is-panning')})),{...interactiveCanvasControl,panning:false},'dragging an interactive canvas control never starts viewport panning or steals its pointer');
  await interactiveButton.click();assert.equal(await interactiveButton.getAttribute('data-activations'),'1','interactive controls remain clickable while Pan mode is selected');
  const panStart=await canvas.evaluate(el=>{
    const viewport=el.getBoundingClientRect(),artboard=el.querySelector('.page-canvas').getBoundingClientRect();
    const left=Math.max(viewport.left+8,artboard.left+8),right=Math.min(viewport.right-8,artboard.right-8);
    const top=Math.max(viewport.top+8,artboard.top+8),bottom=Math.min(viewport.bottom-8,artboard.bottom-8);
    return {x:left+(right-left)/2,y:top+(bottom-top)/2};
  });
  assert.equal(await canvas.evaluate((el,{x,y})=>{const target=document.elementFromPoint(x,y);return Boolean(target?.closest('button,input,select,textarea,summary,a,video,audio,[contenteditable]:not([contenteditable="false"])'))},panStart),false,'the Pan drag uses visible, non-interactive artboard space rather than a text/control surface');
  await tab.mouse.move(panStart.x,panStart.y);
  await tab.mouse.down();
  await tab.mouse.move(panStart.x-56,panStart.y-32,{steps:5});
  await tab.mouse.up();
  const panAfter=await canvas.evaluate(el=>({left:el.scrollLeft,top:el.scrollTop,cursor:getComputedStyle(el).cursor,panning:el.classList.contains('is-panning')}));
  const expectedPanLeft=Math.min(56,panBefore.maxLeft),expectedPanTop=Math.min(32,panBefore.maxTop);
  assert.ok(panAfter.left>=panBefore.left+expectedPanLeft-2,`dragging left pans the overflowing canvas by the full available distance (before=${panBefore.left}, max=${panBefore.maxLeft}, after=${panAfter.left})`);
  assert.ok(panAfter.top>=panBefore.top+expectedPanTop-2,`dragging up pans the overflowing canvas by the full available distance (before=${panBefore.top}, max=${panBefore.maxTop}, after=${panAfter.top})`);
  assert.equal(panAfter.cursor,'grab');assert.equal(panAfter.panning,false,'pointerup restores the Pan cursor');
  assert.deepEqual(await panNode.evaluate(el=>({left:getComputedStyle(el).left,top:getComputedStyle(el).top,selected:el.classList.contains('selected')})),nodeBeforePan,'panning over a node does not move or select it');
  assert.equal(JSON.stringify(draft),modelBeforePan,'viewport pan never changes the draft Page Model');
  assert.equal(posts.length,postsBeforePan,'viewport pan does not call Save or Publish');assert.equal(published,null);
  await tab.locator('#selectTool').click();
  assert.equal(await canvas.evaluate(el=>({active:el.classList.contains('pan-tool-active'),cursor:getComputedStyle(el).cursor})).then(value=>value.active),false);
  assert.equal(await canvas.evaluate(el=>getComputedStyle(el).cursor),'default','Select mode restores its cursor');
  await tab.locator('#panTool').click();
  await canvas.evaluate(el=>el.addEventListener('pointerdown',event=>{el.dataset.panTestPointerId=String(event.pointerId)},{capture:true,once:true}));
  const canvasBox=await canvas.boundingBox();assert.ok(canvasBox);
  await tab.mouse.move(canvasBox.x+5,canvasBox.y+5);await tab.mouse.down();
  await tab.waitForFunction(()=>document.querySelector('#canvas')?.classList.contains('is-panning'));
  await canvas.evaluate(el=>el.dispatchEvent(new PointerEvent('pointercancel',{bubbles:true,pointerId:Number(el.dataset.panTestPointerId),button:0,buttons:0,isPrimary:true})));
  await tab.mouse.up();
  assert.equal(await canvas.evaluate(el=>({panning:el.classList.contains('is-panning'),cursor:getComputedStyle(el).cursor})).then(value=>value.panning),false,'pointercancel releases the temporary panning state');
  assert.equal(await canvas.evaluate(el=>getComputedStyle(el).cursor),'grab','pointercancel retains the selected Pan tool');
  const panKeyboard=await canvas.evaluate(el=>({shortcuts:el.getAttribute('aria-keyshortcuts'),description:el.getAttribute('aria-description'),left:el.scrollLeft,top:el.scrollTop}));
  assert.match(panKeyboard.shortcuts,/Shift\+ArrowRight/);assert.match(panKeyboard.description,/48.*Shift\+nyíllal 160/u);
  await canvas.focus();await tab.keyboard.press('ArrowRight');await tab.keyboard.press('Shift+ArrowDown');
  const keyboardPanAfter=await canvas.evaluate(el=>({left:el.scrollLeft,top:el.scrollTop}));
  assert.equal(keyboardPanAfter.left,panKeyboard.left+48,'Arrow pans the viewport by a deterministic 48px without changing node coordinates');
  assert.equal(keyboardPanAfter.top,panKeyboard.top+160,'Shift+Arrow uses the documented 160px viewport step');
  assert.equal(JSON.stringify(draft),modelBeforePan,'keyboard pan leaves the Page Model unchanged');
  assert.equal(posts.length,postsBeforePan,'keyboard pan never saves or publishes');
  await tab.locator('#selectTool').click();
  await tab.locator('.canvas-device-btn[data-device="mobile"]').click();
  const mobileArtboard=await tab.locator('#canvas').evaluate(el=>({pageWidth:el.querySelector('.page-canvas').getBoundingClientRect().width,frameWidth:el.querySelector('.page-canvas-frame').getBoundingClientRect().width,scrollWidth:el.scrollWidth,clientWidth:el.clientWidth}));
  assert.ok(Math.abs(mobileArtboard.pageWidth-mobileArtboard.frameWidth)<1);
  assert.ok(mobileArtboard.scrollWidth<=mobileArtboard.clientWidth+2,'mobile artboard fit must not leave unscaled horizontal canvas overflow');
  await tab.setViewportSize({width:1366,height:900});
  await tab.locator('.canvas-device-btn[data-device="desktop"]').click();
  await tab.locator('.rail-btn[data-tab="elements"]').click();
  await tab.locator('.element-group-title').filter({hasText:'Szöveg'}).click();
  assert.equal(await tab.locator('#elementList .element:disabled').count()>0,true);
  await tab.locator('#elementList .element').filter({hasText:'Rich Text'}).click();
  const inline=tab.getByRole('textbox',{name:'Rich Text közvetlen szerkesztése'});
  await inline.waitFor();
  assert.equal(await inline.evaluate(el=>document.activeElement===el),true);
  assert.equal(await inline.textContent(),'');
  assert.equal(await tab.locator('.richtext-empty .canvas-edit-richtext:not(.canvas-format-richtext)').count(),0);
  await inline.type('Első közvetlen tartalom');
  await tab.screenshot({path:'/tmp/creator-ux-p0-desktop.png'});
  await tab.locator('.canvas-format-richtext').click();
  await tab.locator('.richtext-toolbar').waitFor();
  await tab.locator('.richtext-editor-help summary').click();
  assert.match(await tab.locator('.richtext-editor-help').textContent(),/képlet nem fut le/,'the editor should explain Office import limits and Save/Publish behavior');
  assert.match(await tab.locator('.richtext-editor-help').textContent(),/Publikálás/);
  await tab.locator('#save').click();
  await tab.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.startsWith('Mentve'));
  assert.equal(posts.at(-1).publish,false);
  assert.equal(published,null);
  const richId=Object.values(draft.pages[pageId].nodes).find(n=>n.type==='richtext').id;
  assert.equal(draft.pages[pageId].nodes[richId].props.richText.blocks[0].children[0].text,'Első közvetlen tartalom');
  await tab.reload();
  const rich=tab.locator(`.node[data-node-id="${richId}"]`);
  await rich.waitFor();
  assert.match(await rich.locator('.node-content').textContent(),/Első közvetlen tartalom/);
  await rich.getByRole('button',{name:'Tartalom szerkesztése'}).click();
  await inline.waitFor();
  await inline.press('End');await inline.type(' frissítve');
  await tab.locator('.inspector-tabs button').first().click();
  assert.equal(await tab.locator('.inspector-group.is-open').count(),0,'Inspector groups should start collapsed for a compact first view');
  const inspectorSearch=tab.getByRole('searchbox',{name:'Beállítás keresése'});
  await inspectorSearch.fill('betűméret');
  assert.equal(await tab.locator('.typed-inspector-field[data-property-id="typography.fontSize"]').isVisible(),true,'search should find and reveal the matching typography control');
  assert.equal(await tab.locator('.typed-inspector-field[data-property-id="size.width"]').isVisible(),false,'search should hide unrelated controls');
  assert.match(await tab.locator('.inspector-search-status').textContent(),/találat/);
  await inspectorSearch.fill('');
  const fontSizeControl=tab.locator('.typed-inspector-field[data-property-id="typography.fontSize"]');
  const typographyGroup=tab.locator('.inspector-group').filter({has:fontSizeControl});
  const groupTitle=typographyGroup.locator(':scope > .inspector-group-title');
  assert.equal(await groupTitle.getAttribute('aria-expanded'),'false','clearing Inspector search restores the group state from before the search');
  await groupTitle.click();
  assert.equal(await groupTitle.getAttribute('aria-expanded'),'true','the group can still be opened manually after search');
  await inspectorSearch.fill('betűméret');
  await inspectorSearch.fill('');
  assert.equal(await groupTitle.getAttribute('aria-expanded'),'true','clearing a later search preserves a group the user had opened');
  await groupTitle.click();
  assert.equal(await groupTitle.getAttribute('aria-expanded'),'false','the user can close the restored group state');
  const displayControl=tab.locator('.typed-inspector-field[data-property-id="layout.display"]');
  assert.equal(await displayControl.locator('.property-presets').count(),0,'select values should not also appear as duplicate preset chips');
  await groupTitle.click();
  await fontSizeControl.getByRole('button',{name:'Betűméret magyarázata'}).click();
  assert.equal(await fontSizeControl.locator('.property-help').isVisible(),true);
  assert.match(await fontSizeControl.locator('.property-help').textContent(),/px|rem/);
  for(const [id,value,cssName,expected] of [
    ['typography.fontStyle','italic','fontStyle','italic'],
    ['typography.textTransform','uppercase','textTransform','uppercase'],
    ['typography.textDecoration','underline','textDecorationLine','underline']
  ]){
    await tab.locator(`.typed-inspector-field[data-property-id="${id}"] select`).selectOption(value);
    assert.equal(await tab.locator(`.node[data-node-id="${richId}"]`).evaluate((el,key)=>getComputedStyle(el)[key],cssName),expected,`${id} should update the real canvas style`);
  }
  await tab.locator('.inspector-group-title').filter({hasText:'Geometria'}).click();
  const widthControl=tab.locator('.typed-inspector-field[data-property-id="size.width"]');
  assert.deepEqual(await widthControl.locator('select option').evaluateAll(options=>options.map(option=>option.value)),['','auto','px','%','vw','rem']);
  assert.match(await widthControl.locator('.property-unit-hint').textContent(),/megváltoztathatja/);
  await widthControl.locator('select:not(.property-token-picker)').selectOption('px');
  await widthControl.locator('input[type="number"]').fill('320');
  await widthControl.locator('input[type="number"]').press('Tab');
  assert.equal(await tab.locator(`.node[data-node-id="${richId}"]`).evaluate(el=>getComputedStyle(el).width),'320px');
  for(const [label,values] of [['Szélesség',['auto','320px','480px','50%','66.6667%','75%','100%','768px','1024px','1200px']],['Magasság',['auto','120px','240px','400px','50vh','100vh']]]){
    for(const value of values){
      const button=tab.locator(`.geometry-presets[aria-label="${label} gyorsbeállítások"] button[data-value="${value}"]`);
      await button.click();
      assert.equal(await button.getAttribute('aria-pressed'),'true');
      assert.equal(await tab.locator('.property-validation:not(:empty)').count(),0);
    }
  }
  await tab.locator('.geometry-presets[aria-label="Szélesség gyorsbeállítások"] button[data-value="50%"]').click();
  assert.equal(await tab.locator(`.node[data-node-id="${richId}"]`).evaluate(el=>getComputedStyle(el).width), '720px');
  assert.equal(await tab.locator('.geometry-presets[aria-label="Szélesség gyorsbeállítások"] button[data-value="50%"]').getAttribute('aria-pressed'),'true');
  await tab.locator('#undo').click();
  assert.notEqual(await tab.locator(`.node[data-node-id="${richId}"]`).evaluate(el=>getComputedStyle(el).width),'720px');
  await tab.locator('#redo').click();
  assert.equal(await tab.locator(`.node[data-node-id="${richId}"]`).evaluate(el=>getComputedStyle(el).width),'720px');
  // Resize starts only from the explicit handle.  It must change dimensions
  // without also invoking the canvas drag handler and moving the element.
  const resizeTarget=tab.locator(`.node[data-node-id="${richId}"]`);
  const beforeResize=await resizeTarget.evaluate(el=>({
    width:Math.round(el.getBoundingClientRect().width),
    height:Math.round(el.getBoundingClientRect().height),
    left:getComputedStyle(el).left,
    top:getComputedStyle(el).top
  }));
  const resizeHandle=resizeTarget.getByRole('button',{name:'Elem átméretezése'});
  await resizeHandle.scrollIntoViewIfNeeded();
  const resizeBox=await resizeHandle.boundingBox();
  assert.ok(resizeBox,'the selected element exposes an explicit resize handle');
  await tab.mouse.move(resizeBox.x+resizeBox.width/2,resizeBox.y+resizeBox.height/2);
  await tab.mouse.down();
  await tab.mouse.move(resizeBox.x+resizeBox.width/2+56,resizeBox.y+resizeBox.height/2+44,{steps:8});
  await tab.mouse.up();
  const afterResize=await resizeTarget.evaluate(el=>({
    width:Math.round(el.getBoundingClientRect().width),
    height:Math.round(el.getBoundingClientRect().height),
    left:getComputedStyle(el).left,
    top:getComputedStyle(el).top
  }));
  assert.ok(afterResize.width>=beforeResize.width+50,'the resize handle should increase the real canvas width: '+JSON.stringify({beforeResize,afterResize,resizeBox}));
  assert.ok(afterResize.height>=beforeResize.height+38,'the resize handle should increase the real canvas height: '+JSON.stringify({beforeResize,afterResize,resizeBox}));
  assert.equal(afterResize.left,beforeResize.left,'resize must not also drag the element horizontally');
  assert.equal(afterResize.top,beforeResize.top,'resize must not also drag the element vertically');
  await tab.locator('#save').click();
  await tab.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.startsWith('Mentve'));
  assert.equal(published,null);
  assert.equal(draft.pages[pageId].nodes[richId].responsive.desktop.width,`${afterResize.width}px`,'the resized desktop width is stored in the responsive model');
  assert.equal(draft.pages[pageId].nodes[richId].responsive.desktop.height,`${afterResize.height}px`,'the resized desktop height is stored in the responsive model');
  await tab.locator('.rail-btn[data-tab="elements"]').click();
  await tab.locator('.element-group-title').filter({hasText:'Szöveg'}).click();
  await tab.locator('#elementList .element').filter({hasText:'Rich Text'}).click();
  await inline.waitFor();
  assert.equal(await inline.textContent(),'');
  await tab.locator('#save').click();
  await tab.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.startsWith('Mentve'));
  await tab.locator('#publish').click();
  await tab.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent==='Publikálva');
  assert.equal(posts.at(-1).publish,true);
  const publicTab=await browser.newPage({viewport:{width:1366,height:900}});
  await publicTab.goto(base+'/p/test');
  await publicTab.locator('.visual-text').first().waitFor();
  assert.match(await publicTab.locator('.visual-text').first().textContent(),/Első közvetlen tartalom frissítve/);
  assert.equal(await publicTab.locator('.visual-text').first().evaluate(el=>getComputedStyle(el).fontStyle),'italic');
  assert.equal(await publicTab.locator('.visual-text').first().evaluate(el=>getComputedStyle(el).textTransform),'uppercase');
  assert.equal(await publicTab.locator('.visual-text').first().evaluate(el=>getComputedStyle(el).textDecorationLine),'underline');
  assert.equal(await publicTab.locator('.visual-text').last().textContent(),'');
  await tab.setViewportSize({width:390,height:800});
  await tab.locator(`.node[data-node-id="${richId}"] .canvas-edit-richtext`).evaluate(el=>el.click());
  const mobileEditor=tab.locator('.richtext-editor-surface');
  await mobileEditor.waitFor();
  await tab.waitForFunction(()=>{const el=document.querySelector('.richtext-editor-surface');return el&&document.activeElement===el});
  assert.equal(await tab.locator('#rightDock').evaluate(el=>el.classList.contains('closed')),false);
  const mobileToolbarMetrics=await tab.locator('.richtext-toolbar').evaluate(toolbar=>{const toolbarRect=toolbar.getBoundingClientRect();return {width:toolbar.clientWidth,scrollWidth:toolbar.scrollWidth,controls:[...toolbar.querySelectorAll('button,select,input')].filter(el=>el.getClientRects().length).map(el=>{const rect=el.getBoundingClientRect();return {left:rect.left,right:rect.right,width:rect.width}}),dock:document.querySelector('#rightDock .dock-content').clientWidth}});
  assert.ok(mobileToolbarMetrics.scrollWidth<=mobileToolbarMetrics.width+1,'mobile text toolbar must wrap instead of widening the Inspector');
  assert.ok(mobileToolbarMetrics.controls.every(control=>control.width>0&&control.left>=0&&control.right<=390),'all mobile formatting controls should remain visible and tappable');
  await tab.screenshot({path:'/tmp/creator-ux-p0-mobile.png'});
  await mobileEditor.press('End');await mobileEditor.type(' mobil');
  await tab.locator('#save').click();
  await tab.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.startsWith('Mentve'));
  assert.equal(posts.at(-1).publish,false);
  assert.match(draft.pages[pageId].nodes[richId].props.richText.blocks[0].children[0].text,/mobil$/);
  assert.doesNotMatch(published.pages[pageId].nodes[richId].props.richText.blocks[0].children[0].text,/mobil$/);
  await tab.locator('#rightDock [data-collapse="right"]').click();
  // Pointer drags against the desktop artboard need a desktop-sized browser.
  // The preceding Rich Text controls were intentionally tested at 390px.
  await tab.setViewportSize({width:1366,height:900});
  await tab.locator('.canvas-device-btn[data-device="desktop"]').click();
  assert.equal(await tab.locator('.canvas-device-btn[data-device="desktop"]').evaluate(el=>el.classList.contains('active')),true,'a valid saved draft and collapsed Inspector must allow desktop breakpoint switching');
  const canvasBounds=await tab.locator('.page-canvas').evaluate((pageEl,id)=>{const page=pageEl.getBoundingClientRect(),node=pageEl.querySelector(`.node[data-node-id="${CSS.escape(id)}"]`)?.getBoundingClientRect();return {left:page.left,right:page.right,nodeLeft:node?.left,nodeTop:node?.top,height:node?.height}},richId);
  const content=tab.locator(`.node[data-node-id="${richId}"]`).first();
  const dragStartX=Math.max(canvasBounds.left+8,canvasBounds.nodeLeft+5);
  // The draggable target is the entire Rich Text element box, not its
  // inner text content, which may sit entirely above the visible viewport.
  const dragStartY=Math.max(110,Math.min(740,canvasBounds.nodeTop+canvasBounds.height/2));
  assert.ok(dragStartY>canvasBounds.nodeTop&&dragStartY<canvasBounds.nodeTop+canvasBounds.height,
    'drag must start inside the visible portion of the Rich Text node');
  const dragOutsideX=Math.max(8,canvasBounds.left-24);
  await tab.mouse.move(dragStartX,dragStartY);await tab.mouse.down();await tab.mouse.move(dragOutsideX,dragStartY,{steps:8});await tab.mouse.up();
  const outsideDebug=await tab.locator(`.node[data-node-id="${richId}"]`).evaluate(el=>{
    const p=document.querySelector('.page-canvas'),n=el.getBoundingClientRect(),b=p.getBoundingClientRect();
    const current=document.querySelector('.canvas-device-btn.active');
    return {outside:el.classList.contains('outside-artboard'),pos:{left:getComputedStyle(el).left,top:getComputedStyle(el).top},
      node:{left:n.left,right:n.right,top:n.top,bottom:n.bottom},canvas:{left:b.left,right:b.right,top:b.top,bottom:b.bottom},
      activeDevice:current?.dataset.device,tool:document.querySelector('#selectTool')?.className};
  });
  assert.equal(outsideDebug.outside,true,'drag outside artboard diagnostics: '+JSON.stringify(outsideDebug));
  assert.equal(await tab.locator(`.node[data-node-id="${richId}"]`).evaluate(el=>el.classList.contains('outside-artboard')),true,'an intentionally out-of-artboard element should be identified');
  assert.ok(await tab.locator('.page-canvas-frame').evaluate(frame=>frame.getBoundingClientRect().width)>await tab.locator('.page-canvas').evaluate(el=>el.getBoundingClientRect().width),'workspace should expand to keep the out-of-artboard element reachable');
  const outsideRect=await content.boundingBox();
  const returnY=Math.max(110,Math.min(740,outsideRect.y+outsideRect.height/2));
  assert.ok(returnY>outsideRect.y&&returnY<outsideRect.y+outsideRect.height,
    'return drag must also begin within the visible portion of the node');
  await tab.mouse.move(Math.max(8,outsideRect.x+8),returnY);
  await tab.mouse.down();
  await tab.mouse.move(canvasBounds.left+90,returnY,{steps:8});
  await tab.mouse.up();
  assert.equal(await tab.locator(`.node[data-node-id="${richId}"]`).evaluate(el=>el.classList.contains('outside-artboard')),false,'the same element can be dragged back onto the artboard');
  await tab.locator(`.node[data-node-id="${richId}"]`).getByRole('button',{name:'Tartalom szerkesztése'}).click();
  await tab.locator('.canvas-format-richtext').click();
  const structuredEditor=tab.locator('.richtext-editor-surface');await structuredEditor.waitFor();
  await structuredEditor.evaluate(el=>{
    const range=document.createRange();range.selectNodeContents(el);const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);
    const clipboard=new DataTransfer();clipboard.setData('text/html','<h2 style="text-align:center">Word cím</h2><p><strong>Félkövér</strong> <span style="background-color:#ffee99">kiemelés</span></p><table><tr><th>Mező</th><th>Érték</th></tr><tr><td>Excel</td><td>100</td></tr></table><script>window.__officePasteXss=1</script>');clipboard.setData('text/plain','Word cím');
    el.dispatchEvent(new ClipboardEvent('paste',{clipboardData:clipboard,bubbles:true,cancelable:true}));
  });
  await tab.waitForFunction(()=>document.querySelector('.richtext-editor-surface')?.querySelector('table td')?.textContent==='Excel');
  assert.equal(await structuredEditor.locator('h2').textContent(),'Word cím');
  assert.equal(await structuredEditor.locator('table tr').count(),2);
  assert.equal(await tab.evaluate(()=>window.__officePasteXss),undefined);
  await structuredEditor.evaluate(el=>{const range=document.createRange();range.setStart(el,0);range.setEnd(el,2);const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range)});
  const richToolbar=tab.locator('.richtext-toolbar');
  await richToolbar.getByRole('combobox',{name:'Betűcsalád'}).selectOption('Georgia');
  assert.match(await structuredEditor.locator('h2 span').evaluate(el=>getComputedStyle(el).fontFamily),/Georgia/,'a multi-block selection should update every selected block through the model');
  await structuredEditor.locator('p').evaluate(el=>{const range=document.createRange();range.selectNodeContents(el);const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range)});
  await tab.getByRole('button',{name:'Félkövér'}).click();
  const richFontSize=richToolbar.getByRole('spinbutton',{name:'Betűméret képpontban'});await richFontSize.fill('24');await richFontSize.press('Tab');
  await richToolbar.getByRole('tab',{name:'Bekezdés',exact:true}).click();
  await richToolbar.getByRole('combobox',{name:'Bekezdés igazítása'}).selectOption('justify');
  assert.equal(await structuredEditor.locator('p').evaluate(el=>el.style.textAlign),'justify');
  assert.equal(await structuredEditor.locator('p strong').count(),2,'the selected paragraph should be formatted as a single structured selection');
  await tab.locator('#save').click();await tab.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.startsWith('Mentve'));
  assert.equal(posts.at(-1).publish,false,'Office paste and Save do not publish');
  const importedDoc=draft.pages[pageId].nodes[richId].props.richText;
  assert.deepEqual(importedDoc.blocks.map(block=>block.type),['heading','paragraph','table']);
  assert.equal(importedDoc.blocks[1].align,'justify');
  assert.deepEqual(importedDoc.blocks[1].children[0].styles,{fontSize:'24px',fontFamily:'Georgia'});
  assert.ok(importedDoc.blocks[1].children[0].marks.includes('bold'));
  assert.equal(importedDoc.blocks[0].children[0].styles.fontFamily,'Georgia');
  assert.equal(importedDoc.blocks[2].rows[1].cells[0].children[0].text,'Excel');
  assert.doesNotMatch(JSON.stringify(published.pages[pageId].nodes[richId].props.richText),/Word cím|Excel/,'separately published content remains unchanged');
  assert.deepEqual(errors,[]);
});
