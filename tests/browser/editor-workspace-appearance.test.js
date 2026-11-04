import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve,extname} from 'node:path';
import test from 'node:test';
import {chromium} from 'playwright';
import {createDocument} from '../../public/editor-v2/core/schema.js';
import {WORKSPACE_PREFERENCES_KEY} from '../../public/editor-v2/ui/workspace-appearance.js';

const root=resolve(import.meta.dirname,'../../public');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml'};
function fixtureServer(){
  const document=createDocument();const pageId=document.activePageId;const draft=structuredClone(document);const writes=[];
  const server=createServer(async(req,res)=>{
    const url=new URL(req.url,'http://localhost');
    const json=value=>{res.setHeader('content-type','application/json; charset=utf-8');res.end(JSON.stringify(value))};
    if(url.pathname==='/api/admin/pages')return json({ok:true,data:[{id:pageId,slug:'proba',title:'Próba',content:draft,revision:1,isPublished:false}]});
    if(url.pathname==='/api/admin/editor'){
      if(req.method==='GET')return json({ok:true,data:{page:{id:pageId,document:draft,publishedRevisionId:null},revisions:[]}});
      let body='';for await(const chunk of req)body+=chunk;writes.push(JSON.parse(body));
      return json({ok:true,data:{pageId,version:2,revisionId:'fixture-revision',published:false}});
    }
    if(url.pathname==='/api/integrations/twitch/connection')return json({ok:true,data:{connected:false}});
    if(url.pathname==='/api/public/navigation')return json({ok:true,data:{items:[]}});
    if(url.pathname.startsWith('/api/'))return json({ok:true,data:{}});
    const file=resolve(root,'.'+url.pathname);
    if(!file.startsWith(root+'/')){res.writeHead(403).end();return}
    try{res.setHeader('content-type',mime[extname(file)]||'application/octet-stream');res.end(await readFile(file))}
    catch{res.writeHead(404).end()}
  });
  return {server,writes};
}
async function openEditor(t,{width=1366,height=900,isMobile=false,hasTouch=false}={}){
  const fixture=fixtureServer();await new Promise(done=>fixture.server.listen(0,'127.0.0.1',done));
  t.after(()=>new Promise(done=>fixture.server.close(done)));
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
  t.after(()=>browser.close());
  const context=await browser.newContext({viewport:{width,height},isMobile,hasTouch});t.after(()=>context.close());
  const page=await context.newPage();page.setDefaultTimeout(8000);page.setDefaultNavigationTimeout(20_000);
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(`http://127.0.0.1:${fixture.server.address().port}/editor-v2/index.html`,{waitUntil:'load'});
  await page.locator('.page-canvas .node').first().waitFor();
  return {...fixture,page,context,errors};
}

async function openPreferences(page){
  const menu=page.locator('.more-actions');
  const button=page.locator('#openWorkspaceAppearance');
  if(!await button.isVisible()){
    await menu.evaluate(element=>{element.open=true});
    await button.waitFor({state:'visible'});
  }
  await button.click();
  await page.locator('#workspaceAppearanceDialog[open]').waitFor();
  await page.waitForFunction(()=>[...(document.querySelector('#workspaceAppearanceDialog')?.getAnimations()||[])].every(animation=>animation.playState==='finished'));
}

test('personal workspace theme, density and panel layout persist locally without changing or sending page content',async t=>{
  const {page,writes,errors}=await openEditor(t);
  await openPreferences(page);
  const dialog=page.locator('#workspaceAppearanceDialog');
  await page.locator('#workspaceLayout').selectOption('inspector');
  await page.locator('#workspaceTheme').selectOption('aurora');
  await page.locator('#workspaceDensity').selectOption('compact');
  await page.locator('#workspaceAccent').evaluate(element=>{element.value='#00a7c8';element.dispatchEvent(new Event('input',{bubbles:true}))});
  assert.equal(await page.locator('.editor-app').getAttribute('data-workspace-theme'),'aurora');
  assert.equal(await page.locator('.editor-app').getAttribute('data-workspace-density'),'compact');
  assert.equal(await page.locator('.editor-app').evaluate(element=>element.style.getPropertyValue('--accent')),'#00a7c8');
  assert.equal(await page.locator('.workspace').evaluate(element=>element.classList.contains('right-open')),true);
  assert.equal(await page.locator('#rightDock').getAttribute('aria-hidden'),'false');
  assert.deepEqual(writes,[],'presentation settings do not Save or Publish the page');
  const saved=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),WORKSPACE_PREFERENCES_KEY);
  assert.deepEqual(saved,{version:2,layout:'inspector',theme:'aurora',density:'compact',accent:'#00a7c8',dockOrder:'left-canvas-right',panelMode:'separate',panelSide:'right',profiles:[]});
  await page.locator('#closeWorkspaceAppearance').click();
  assert.equal(await dialog.isVisible(),false);
  await page.waitForFunction(()=>document.activeElement?.id==='openWorkspaceAppearance');
  assert.equal(await page.locator('#openWorkspaceAppearance').evaluate(element=>document.activeElement===element),true,'closing settings restores focus to its opener');
  await page.reload({waitUntil:'load'});
  assert.equal(await page.locator('.editor-app').getAttribute('data-workspace-theme'),'aurora');
  assert.equal(await page.locator('.workspace').evaluate(element=>element.classList.contains('right-open')),true);
  assert.equal(await page.locator('#save').textContent(),'Mentés');
  assert.equal(await page.locator('#publish').textContent(),'Publikálás');
  await openPreferences(page);
  await page.locator('#resetWorkspaceAppearance').click();
  assert.equal(await page.locator('.editor-app').getAttribute('data-workspace-theme'),'graphite');
  assert.equal(await page.locator('#workspaceLayout').inputValue(),'canvas');
  assert.equal(await page.locator('.workspace').evaluate(element=>element.classList.contains('left-open')),false);
  assert.deepEqual(writes,[]);
  assert.deepEqual(errors,[]);
});

test('five selectable editor designs visibly differ, persist and never alter page data',async t=>{
  const {page,writes,errors}=await openEditor(t);
  await openPreferences(page);
  const themes=['graphite','aurora','ocean','sage','cinder'];
  const colors={},dialogColors={},controlColors={};
  await page.locator('#workspaceTheme').selectOption('aurora');
  for(const theme of themes){
    await page.locator('#workspaceTheme').selectOption(theme);
    assert.equal(await page.locator('.editor-app').getAttribute('data-workspace-theme'),theme);
    colors[theme]=await page.locator('.topbar').evaluate(element=>getComputedStyle(element).backgroundColor);
    dialogColors[theme]=await page.locator('#workspaceAppearanceDialog').evaluate(element=>getComputedStyle(element).backgroundColor);
    controlColors[theme]=await page.locator('#workspaceTheme').evaluate(element=>getComputedStyle(element).backgroundColor);
    assert.ok(colors[theme],theme+' has a visible shell color');
    assert.equal(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).theme,WORKSPACE_PREFERENCES_KEY),theme,theme+' is saved as a local workspace preference');
  }
  assert.equal(new Set(Object.values(colors)).size,themes.length,'each curated design has a distinct toolbar palette');
  assert.equal(new Set(Object.values(dialogColors)).size,themes.length,'the appearance dialog follows each selected design instead of staying in the default graphite skin');
  assert.equal(new Set(Object.values(controlColors)).size,themes.length,'appearance controls remain visually integrated into each design');
  assert.equal(await page.locator('#save').textContent(),'Mentés');
  assert.equal(await page.locator('#publish').textContent(),'Publikálás');
  assert.deepEqual(writes,[],'switching editor design never sends page Save or Publish requests');
  await page.reload({waitUntil:'load'});
  await openPreferences(page);
  assert.equal(await page.locator('#workspaceTheme').inputValue(),'cinder','the selected workbench design survives reload');
  assert.deepEqual(writes,[]);
  assert.deepEqual(errors,[]);
});

test('tabbed desktop panel groups reserve canvas space, restore profiles and fall back to one mobile drawer',async t=>{
  const desktop=await openEditor(t,{width:1025,height:900});
  await openPreferences(desktop.page);
  await desktop.page.locator('#workspaceLayout').selectOption('balanced');
  await desktop.page.locator('#workspacePanelMode').selectOption('tabbed');
  await desktop.page.locator('#closeWorkspaceAppearance').click();
  const tabs=desktop.page.locator('.workspace-panel-group-tabs');
  assert.equal(await tabs.isVisible(),true,'the group selector appears only for the desktop tabbed mode');
  assert.equal(await desktop.page.locator('#workspacePanelTabRight').getAttribute('aria-selected'),'true','the active panel is identified as a selected tab');
  assert.equal(await desktop.page.locator('#rightDock').getAttribute('aria-labelledby'),'workspacePanelTabRight');
  assert.equal(await desktop.page.locator('#leftDock').getAttribute('aria-hidden'),'true','the inactive panel is removed from desktop focus navigation');
  assert.equal(await desktop.page.locator('#leftDock').evaluate(panel=>panel.getBoundingClientRect().width),0,'the inactive dock consumes no hidden overlay space');
  const rightLayout=await desktop.page.evaluate(()=>{
    const canvas=document.querySelector('.canvas-area').getBoundingClientRect();
    const panel=document.querySelector('#rightDock').getBoundingClientRect();
    return {canvasWidth:canvas.width,canvasRight:canvas.right,panelLeft:panel.left,scrollWidth:document.documentElement.scrollWidth};
  });
  assert.ok(rightLayout.canvasWidth>=400,`tabbed dock keeps 400px of editing surface: ${JSON.stringify(rightLayout)}`);
  assert.ok(rightLayout.panelLeft>=rightLayout.canvasRight,'the group reserves a dock track instead of floating over the canvas');
  assert.equal(rightLayout.scrollWidth,1025,'the narrowest desktop tabbed layout has no horizontal overflow');
  await desktop.page.locator('#workspacePanelTabLeft').click();
  assert.equal(await desktop.page.locator('#leftDock').getAttribute('aria-hidden'),'false');
  assert.equal(await desktop.page.locator('#rightDock').getAttribute('aria-hidden'),'true');
  assert.equal(await desktop.page.locator('#workspacePanelTabLeft').getAttribute('aria-selected'),'true');
  await desktop.page.locator('#workspacePanelTabLeft').press('ArrowRight');
  assert.equal(await desktop.page.locator('#workspacePanelTabRight').getAttribute('aria-selected'),'true','arrow-key navigation switches the panel group');
  await openPreferences(desktop.page);
  await desktop.page.locator('#workspacePanelSide').selectOption('left');
  await desktop.page.locator('#closeWorkspaceAppearance').click();
  const leftLayout=await desktop.page.evaluate(()=>{
    const canvas=document.querySelector('.canvas-area').getBoundingClientRect();
    const panel=document.querySelector('#leftDock').getBoundingClientRect();
    return {canvasWidth:canvas.width,canvasLeft:canvas.left,panelRight:panel.right,scrollWidth:document.documentElement.scrollWidth};
  });
  assert.ok(leftLayout.canvasWidth>=400,`left group also preserves the canvas: ${JSON.stringify(leftLayout)}`);
  assert.ok(leftLayout.panelRight<=leftLayout.canvasLeft,'left-side grouping keeps its own reserved track');
  assert.equal(leftLayout.scrollWidth,1025);
  await desktop.page.locator('#workspacePanelTabLeft').click();
  await openPreferences(desktop.page);
  await desktop.page.locator('#workspaceProfileName').fill('Tabbed panel workspace');
  await desktop.page.locator('#saveWorkspaceProfile').click();
  const profileId=await desktop.page.locator('#workspaceProfile').inputValue();
  await desktop.page.locator('#workspacePanelSide').selectOption('right');
  await desktop.page.locator('#workspacePanelMode').selectOption('separate');
  await desktop.page.locator('#undoWorkspaceLayout').click();
  assert.equal(await desktop.page.locator('#workspacePanelMode').inputValue(),'tabbed','workspace Undo restores the prior panel mode');
  await desktop.page.locator('#redoWorkspaceLayout').click();
  assert.equal(await desktop.page.locator('#workspacePanelMode').inputValue(),'separate','workspace Redo restores separate docks');
  await desktop.page.locator('#workspaceProfile').selectOption(profileId);
  await desktop.page.locator('#loadWorkspaceProfile').click();
  assert.equal(await desktop.page.locator('#workspacePanelMode').inputValue(),'tabbed','the saved profile restores its panel-group mode');
  assert.equal(await desktop.page.locator('#workspacePanelSide').inputValue(),'left','the saved profile restores its dock side');
  assert.equal(await desktop.page.locator('#workspacePanelTabLeft').getAttribute('aria-selected'),'true','the saved profile restores its active panel');
  await desktop.page.reload({waitUntil:'load'});
  await desktop.page.waitForFunction(()=>document.documentElement.dataset.editorBoot==='ready');
  assert.equal(await desktop.page.locator('.workspace-panel-group-tabs').isVisible(),true,'the tabbed panel layout survives reload');
  assert.equal(await desktop.page.locator('#workspacePanelTabLeft').getAttribute('aria-selected'),'true','the last selected panel group survives a full reload');
  assert.equal(await desktop.page.evaluate(()=>document.querySelector('.canvas-area').getBoundingClientRect().width>=400),true);
  assert.deepEqual(desktop.writes,[],'changing the panel layout never saves or publishes page content');
  assert.deepEqual(desktop.errors,[]);

  const mobile=await openEditor(t,{width:390,height:844,isMobile:true,hasTouch:true});
  await openPreferences(mobile.page);
  await mobile.page.locator('#workspacePanelMode').selectOption('tabbed');
  assert.equal(await mobile.page.locator('.workspace-panel-group-tabs').isVisible(),false,'phones retain the dedicated single-drawer navigation instead of the desktop group bar');
  await mobile.page.locator('#closeWorkspaceAppearance').click();
  await mobile.page.locator('#openInspector').tap();
  assert.equal(await mobile.page.locator('#rightDock').isVisible(),true);
  assert.equal(await mobile.page.locator('#leftDock').isVisible(),false);
  await mobile.page.locator('#editorMenu').tap();
  assert.equal(await mobile.page.locator('#leftDock').isVisible(),true);
  assert.equal(await mobile.page.locator('#rightDock').isVisible(),false);
  assert.equal(await mobile.page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  assert.deepEqual(mobile.writes,[],'phone drawer switching does not change the Page Model');
  assert.deepEqual(mobile.errors,[]);
});

test('Inspector tab groups survive reload, profile restore, and phone use without page writes',async t=>{
  const desktop=await openEditor(t);
  await desktop.page.locator('#openInspector').click();
  await desktop.page.locator('#inspectorTabAdvanced').click();
  assert.equal(await desktop.page.locator('#inspectorTabAdvanced').getAttribute('aria-selected'),'true');
  assert.equal(await desktop.page.evaluate(()=>JSON.parse(localStorage.getItem('sanci-editor-shell-v2')).inspectorTab),'advanced');
  await desktop.page.locator('#editorMenu').click();
  const rail=desktop.page.locator('.tool-rail');
  assert.equal(await rail.getAttribute('aria-orientation'),'vertical','the left tool group declares its actual vertical layout');
  await desktop.page.locator('#leftTabPages').focus();
  await desktop.page.locator('#leftTabPages').press('ArrowDown');
  assert.equal(await desktop.page.locator('#leftTabElements').getAttribute('aria-selected'),'true','Down moves to the next tab in the vertical group');
  await desktop.page.locator('#leftTabElements').press('ArrowUp');
  assert.equal(await desktop.page.locator('#leftTabPages').getAttribute('aria-selected'),'true','Up moves to the preceding tab');
  await desktop.page.locator('#leftTabPages').press('End');
  assert.equal(await desktop.page.locator('#leftTabNavigation').getAttribute('aria-selected'),'true','End reaches the last tab');
  await openPreferences(desktop.page);
  await desktop.page.locator('#workspaceProfileName').fill('Haladó Inspector');
  await desktop.page.locator('#saveWorkspaceProfile').click();
  await desktop.page.locator('#closeWorkspaceAppearance').click();
  await desktop.page.locator('#inspectorTabContent').click();
  await desktop.page.reload({waitUntil:'domcontentloaded'});
  await desktop.page.waitForFunction(()=>document.documentElement.dataset.editorBoot==='ready');
  assert.equal(await desktop.page.locator('#inspectorTabContent').getAttribute('aria-selected'),'true','the most recently selected Inspector group returns after a full reload');
  assert.equal(await desktop.page.locator('#leftTabNavigation').getAttribute('aria-selected'),'true','the left group selection also returns after reload');
  await openPreferences(desktop.page);
  await desktop.page.locator('#closeWorkspaceAppearance').click();
  await desktop.page.locator('#inspectorTabContent').click();
  await openPreferences(desktop.page);
  await desktop.page.locator('#workspaceProfile').selectOption({label:'Haladó Inspector'});
  await desktop.page.locator('#loadWorkspaceProfile').click();
  assert.equal(await desktop.page.locator('#inspectorTabAdvanced').getAttribute('aria-selected'),'true','a saved workspace profile restores the nested Inspector group');
  await desktop.page.locator('#undoWorkspaceLayout').click();
  assert.equal(await desktop.page.locator('#inspectorTabContent').getAttribute('aria-selected'),'true','workspace Undo restores the prior Inspector group');
  await desktop.page.locator('#redoWorkspaceLayout').click();
  assert.equal(await desktop.page.locator('#inspectorTabAdvanced').getAttribute('aria-selected'),'true','workspace Redo reapplies the Inspector group');
  assert.deepEqual(desktop.writes,[],'Inspector and profile changes never Save or Publish page content');
  assert.deepEqual(desktop.errors,[]);

  const mobile=await openEditor(t,{width:390,height:844,isMobile:true,hasTouch:true});
  await mobile.page.locator('#openInspector').tap();
  await mobile.page.locator('#inspectorTabContent').tap();
  assert.equal(await mobile.page.locator('#inspectorTabContent').getAttribute('aria-selected'),'true','the same Inspector tab group is touch-operable on a phone');
  await mobile.page.reload({waitUntil:'load'});
  await mobile.page.waitForFunction(()=>document.documentElement.dataset.editorBoot==='ready');
  assert.equal(await mobile.page.locator('#inspectorTabContent').getAttribute('aria-selected'),'true','the mobile Inspector selection survives reload');
  assert.ok(await mobile.page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'the saved Inspector tab does not create mobile overflow');
  assert.deepEqual(mobile.writes,[]);
  assert.deepEqual(mobile.errors,[]);
});

test('mobile workspace design choices stay touch-sized, visible and page-data independent',async t=>{
  const {page,writes,errors}=await openEditor(t,{width:390,height:844,isMobile:true,hasTouch:true});
  await openPreferences(page);
  const themes=['graphite','aurora','ocean','sage','cinder'];
  const colors=[];
  for(const theme of themes){
    await page.locator('#workspaceTheme').selectOption(theme);
    colors.push(await page.locator('.topbar').evaluate(element=>getComputedStyle(element).backgroundColor));
    const touchTarget=await page.locator('#workspaceTheme').evaluate(element=>({height:element.getBoundingClientRect().height,width:element.getBoundingClientRect().width}));
    assert.ok(touchTarget.height>=44,'the '+theme+' choice remains a 44px phone touch target');
    assert.ok(touchTarget.width>0,'the theme selector remains visible on the phone');
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'theme selection does not introduce horizontal overflow');
  }
  assert.equal(new Set(colors).size,themes.length,'all five palettes remain visually distinct on mobile');
  assert.deepEqual(writes,[],'changing the mobile editor skin never saves or publishes page content');
  assert.deepEqual(errors,[]);
});

test('manual panel and dock changes become a persistent custom layout without touching the Page Model',async t=>{
  const {page,writes,errors}=await openEditor(t);
  await openPreferences(page);
  await page.locator('#workspaceLayout').selectOption('balanced');
  assert.equal(await page.locator('.workspace').evaluate(element=>element.classList.contains('left-open')),true);
  assert.equal(await page.locator('.workspace').evaluate(element=>element.classList.contains('right-open')),true);
  await page.locator('#closeWorkspaceAppearance').click();
  await page.locator('#openInspector').click();
  assert.equal(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).layout,WORKSPACE_PREFERENCES_KEY),'custom','manual panel changes opt into a custom layout');
  const resized=await page.evaluate(()=>{
    const root=document.documentElement;
    const before=parseFloat(getComputedStyle(root).getPropertyValue('--left-dock-width'));
    window.sanciEditor.resizeDock('left',100,before);
    window.dispatchEvent(new PointerEvent('pointermove',{clientX:150}));
    window.dispatchEvent(new PointerEvent('pointerup'));
    return parseFloat(getComputedStyle(root).getPropertyValue('--left-dock-width'));
  });
  assert.equal(resized,360,'the user-defined dock width is applied through the existing shell resize path');
  await page.reload({waitUntil:'load'});
  assert.equal(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).layout,WORKSPACE_PREFERENCES_KEY),'custom');
  assert.equal(await page.evaluate(()=>parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--left-dock-width'))),360);
  assert.equal(await page.locator('.workspace').evaluate(element=>element.classList.contains('left-open')),true);
  assert.equal(await page.locator('.workspace').evaluate(element=>element.classList.contains('right-open')),false,'the manually closed Inspector remains closed in the custom layout');
  assert.deepEqual(writes,[],'layout selection, resizing and persistence never Save or Publish the page');
  await openPreferences(page);
  await page.locator('#resetWorkspaceAppearance').click();
  assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--left-dock-width').trim()),'310px','workspace reset restores the left dock default');
  assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--right-dock-width').trim()),'352px','workspace reset restores the right dock default');
  assert.deepEqual(await page.evaluate(()=>{const value=JSON.parse(localStorage.getItem('sanci-editor-shell-v2'));return {leftOpen:value.leftOpen,rightOpen:value.rightOpen,leftWidth:value.leftWidth,rightWidth:value.rightWidth}}),{leftOpen:false,rightOpen:false,leftWidth:310,rightWidth:352});
  await page.reload({waitUntil:'load'});
  assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--left-dock-width').trim()),'310px');
  assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--right-dock-width').trim()),'352px');
  assert.equal(await page.locator('.workspace').evaluate(element=>element.classList.contains('left-open')),false);
  assert.equal(await page.locator('.workspace').evaluate(element=>element.classList.contains('right-open')),false);
  assert.deepEqual(writes,[],'reset and its reload never Save or Publish page content');
  assert.deepEqual(errors,[]);
});

test('the overflow menu stays in the responsive shell flow instead of covering Inspector tabs or mobile actions',async t=>{
  const desktop=await openEditor(t,{width:1920,height:1000});
  await desktop.page.locator('#openInspector').click();
  await desktop.page.locator('.more-actions summary').click();
  const desktopGeometry=await desktop.page.evaluate(()=>{
    const top=document.querySelector('.topbar').getBoundingClientRect();
    const menu=document.querySelector('.more-actions-menu').getBoundingClientRect();
    const dock=document.querySelector('#rightDock').getBoundingClientRect();
    const tab=document.querySelector('#inspectorTabContent').getBoundingClientRect();
    const hit=document.elementFromPoint(tab.left+tab.width/2,tab.top+tab.height/2);
    return {top:top.toJSON(),menu:menu.toJSON(),dock:dock.toJSON(),tab:tab.toJSON(),hitId:hit?.id,scrollWidth:document.documentElement.scrollWidth};
  });
  assert.ok(desktopGeometry.menu.bottom<=desktopGeometry.dock.top+1,`the expanded header reserves space before the Inspector: ${JSON.stringify(desktopGeometry)}`);
  assert.equal(desktopGeometry.hitId,'inspectorTabContent','the menu cannot intercept an Inspector tab');
  assert.ok(desktopGeometry.scrollWidth<=1920,'desktop menu stays inside the viewport');
  await desktop.page.locator('#inspectorTabContent').click();
  assert.equal(await desktop.page.locator('#inspectorTabContent').getAttribute('aria-selected'),'true');

  const mobile=await openEditor(t,{width:390,height:850,isMobile:true,hasTouch:true});
  await mobile.page.locator('#openInspector').tap();
  await mobile.page.locator('.more-actions summary').tap();
  await mobile.page.locator('#rightDock').waitFor({state:'hidden'});
  assert.equal(await mobile.page.locator('#rightDock').isVisible(),false,'opening utility actions closes the mobile sheet first');
  assert.equal(await mobile.page.locator('#save').isVisible(),true);
  assert.equal(await mobile.page.locator('#publish').isVisible(),true);
  assert.ok(await mobile.page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'the in-flow touch menu does not create horizontal scrolling');
  await mobile.page.locator('#openWorkspaceAppearance').tap();
  assert.equal(await mobile.page.locator('#workspaceAppearanceDialog').isVisible(),true);
  assert.deepEqual(mobile.writes,[]);
  assert.deepEqual([...desktop.errors,...mobile.errors],[]);
});

test('desktop docks preserve a usable non-overlapped canvas at every dock order and saved maximum widths',async t=>{
  const {page,writes,errors}=await openEditor(t,{width:1025,height:900});
  await openPreferences(page);
  await page.locator('#workspaceLayout').selectOption('balanced');
  await page.evaluate(()=>{
    document.documentElement.style.setProperty('--left-dock-width','460px');
    document.documentElement.style.setProperty('--right-dock-width','440px');
  });
  const oldTrackRule=await page.evaluate(()=>{
    const style=document.createElement('style');
    style.textContent='@media (min-width:1025px){.workspace.left-open.right-open{--left-track:minmax(250px,var(--left-dock-width));--right-track:minmax(260px,var(--right-dock-width))}}';
    document.head.append(style);
    const width=document.querySelector('.canvas-area').getBoundingClientRect().width;
    style.remove();
    return width;
  });
  assert.ok(oldTrackRule<400,`the regression fixture recreates how two saved wide docks used to squeeze the 1025px canvas to ${oldTrackRule}px`);
  const orderings=['left-canvas-right','canvas-left-right','left-right-canvas','right-left-canvas','right-canvas-left','canvas-right-left'];
  const measured=[];
  for(const width of [1025,1100,1280,1440,1920]){
    await page.setViewportSize({width,height:900});
    for(const order of orderings){
      await page.locator('#workspaceDockOrder').selectOption(order);
      const geometry=await page.evaluate(()=>{
        const workspace=document.querySelector('.workspace');
        const rect=selector=>{const value=document.querySelector(selector).getBoundingClientRect();return {left:value.left,right:value.right,width:value.width}};
        const left=rect('#leftDock'),canvas=rect('.canvas-area'),right=rect('#rightDock');
        return {left,canvas,right,order:workspace.dataset.workspaceDockOrder,scrollWidth:document.documentElement.scrollWidth};
      });
      assert.equal(geometry.order,order,`${order} is applied at ${width}px`);
      assert.ok(geometry.canvas.width>=400,`${order} keeps at least 400px of canvas visible at ${width}px with both saved maximum-width docks open: ${JSON.stringify(geometry)}`);
      assert.ok(geometry.left.right<=geometry.canvas.left+0.5||geometry.canvas.right<=geometry.left.left+0.5,`${order} left dock never covers canvas at ${width}px: ${JSON.stringify(geometry)}`);
      assert.ok(geometry.right.right<=geometry.canvas.left+0.5||geometry.canvas.right<=geometry.right.left+0.5,`${order} right dock never covers canvas at ${width}px: ${JSON.stringify(geometry)}`);
      assert.ok(geometry.scrollWidth<=width,`${order} stays within the ${width}px viewport`);
      measured.push({width,order,canvas:Math.round(geometry.canvas.width),left:Math.round(geometry.left.width),right:Math.round(geometry.right.width)});
    }
  }
  t.diagnostic(JSON.stringify({legacyCanvasAt1025:Math.round(oldTrackRule),testedCombinations:measured.length,minimumCanvas:Math.min(...measured.map(item=>item.canvas)),viewportMinimums:[1025,1100,1280,1440,1920].map(width=>({width,canvas:Math.min(...measured.filter(item=>item.width===width).map(item=>item.canvas))}))}));
  assert.deepEqual(writes,[],'opening and arranging desktop panels never Save or Publish page content');
  assert.deepEqual(errors,[]);
});

test('desktop docks can be reordered and local workspace profiles save, reload, undo and redo without page writes',async t=>{
  const {page,writes,errors}=await openEditor(t,{width:1440,height:900});
  await openPreferences(page);
  await page.locator('#workspaceLayout').selectOption('balanced');
  const orderings={
    'left-canvas-right':['leftDock','canvas','rightDock'],
    'canvas-left-right':['canvas','leftDock','rightDock'],
    'left-right-canvas':['leftDock','rightDock','canvas'],
    'right-left-canvas':['rightDock','leftDock','canvas'],
    'right-canvas-left':['rightDock','canvas','leftDock'],
    'canvas-right-left':['canvas','rightDock','leftDock'],
  };
  for(const width of [1025,1280,1920]){
    await page.setViewportSize({width,height:900});
    for(const [order,expected] of Object.entries(orderings)){
      await page.locator('#workspaceDockOrder').selectOption(order);
      const actual=await page.evaluate(()=>{const workspace=document.querySelector('.workspace');return {positions:['leftDock','canvas','rightDock'].map(id=>{const element=document.getElementById(id),rect=element?.getBoundingClientRect();return {id,left:rect?.left||0,width:rect?.width||0,display:element?getComputedStyle(element).display:''}}),order:workspace?.dataset.workspaceDockOrder,areas:getComputedStyle(workspace).gridTemplateAreas,columns:getComputedStyle(workspace).gridTemplateColumns,classes:workspace.className,scrollWidth:document.documentElement.scrollWidth}});
      assert.deepEqual(actual.positions.sort((a,b)=>a.left-b.left).map(item=>item.id),expected,`${order} visually matches its selected dock order at ${width}px: ${JSON.stringify(actual)}`);
      assert.ok(actual.scrollWidth<=width,`${order} stays within the ${width}px viewport`);
    }
  }
  await page.locator('#workspaceDockOrder').selectOption('right-left-canvas');
  await page.locator('#workspaceTheme').selectOption('aurora');
  await page.locator('#workspaceProfileName').fill('Tartalom szerkesztés');
  await page.locator('#saveWorkspaceProfile').click();
  assert.equal(await page.locator('#workspaceProfile option').count(),2);
  assert.equal(await page.locator('#workspaceProfile option').last().textContent(),'Tartalom szerkesztés');
  await page.locator('#workspaceProfileName').fill('tartalom szerkesztés');
  await page.locator('#saveWorkspaceProfile').click();
  assert.match(await page.locator('#workspaceAppearanceStatus').textContent(),/már van ilyen nevű profil/iu,'duplicate profile names are rejected without overwriting the existing layout');
  await page.locator('#workspaceProfileName').fill('<img src=x onerror=alert(1)>');
  await page.locator('#saveWorkspaceProfile').click();
  assert.equal(await page.locator('#workspaceProfile option').count(),3);
  assert.equal(await page.locator('#workspaceProfile option').last().textContent(),'<img src=x onerror=alert(1)>','profile labels are rendered only as text');
  assert.equal(await page.locator('#workspaceProfile option img').count(),0,'saved labels cannot create executable DOM');
  for(let index=0;index<6;index++){
    await page.locator('#workspaceProfileName').fill(`Munkaterület ${index}`);
    await page.locator('#saveWorkspaceProfile').click();
  }
  assert.equal(await page.locator('#workspaceProfile option').count(),9,'the selector contains one placeholder plus at most eight saved profiles');
  await page.locator('#workspaceProfileName').fill('Kilencedik profil');
  await page.locator('#saveWorkspaceProfile').click();
  assert.match(await page.locator('#workspaceAppearanceStatus').textContent(),/legfeljebb nyolc/iu,'profile storage reports its explicit size bound');
  assert.equal(await page.locator('#workspaceProfile option').count(),9);

  await page.locator('#workspaceDockOrder').selectOption('left-right-canvas');
  assert.equal(await page.locator('.editor-app').getAttribute('data-workspace-dock-order'),'left-right-canvas');
  await page.locator('#undoWorkspaceLayout').click();
  assert.equal(await page.locator('.editor-app').getAttribute('data-workspace-dock-order'),'right-left-canvas','workspace Undo restores dock order without using page Undo');
  await page.locator('#redoWorkspaceLayout').click();
  assert.equal(await page.locator('.editor-app').getAttribute('data-workspace-dock-order'),'left-right-canvas','workspace Redo reapplies the dock order');
  await page.locator('#undoWorkspaceLayout').click();
  assert.equal(await page.locator('.editor-app').getAttribute('data-workspace-dock-order'),'right-left-canvas');
  await page.locator('#workspaceTheme').selectOption('graphite');
  await page.locator('#loadWorkspaceProfile').click();
  assert.equal(await page.locator('.editor-app').getAttribute('data-workspace-theme'),'aurora');
  assert.equal(await page.locator('.editor-app').getAttribute('data-workspace-dock-order'),'right-left-canvas');
  await page.reload({waitUntil:'load'});
  assert.equal(await page.locator('.editor-app').getAttribute('data-workspace-theme'),'aurora');
  assert.equal(await page.locator('.workspace').getAttribute('data-workspace-dock-order'),'right-left-canvas');
  assert.deepEqual(writes,[],'profiles and their history never invoke Save or Publish');
  assert.deepEqual(errors,[]);
});

test('mobile profile application keeps the single-drawer model and workspace reset restores saved preferences safely',async t=>{
  const {page,writes,errors}=await openEditor(t,{width:320,height:850,isMobile:true,hasTouch:true});
  await openPreferences(page);
  await page.locator('#workspaceAppearanceDialog').evaluate(async dialog=>Promise.all(dialog.getAnimations().map(animation=>animation.finished)));
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'profile controls stay inside a narrow phone viewport');
  const touchTargets=await page.locator('.workspace-profile-section button:visible').evaluateAll(buttons=>buttons.map(button=>({id:button.id,height:button.getBoundingClientRect().height,cssMin:getComputedStyle(button).minHeight,width:button.getBoundingClientRect().width})));
  assert.ok(touchTargets.every(target=>target.height>=44),`all profile and history controls preserve the 44px touch target: ${JSON.stringify(touchTargets)}`);
  await page.locator('#workspaceLayout').selectOption('balanced');
  await page.locator('#workspaceDockOrder').selectOption('canvas-right-left');
  await page.locator('#workspaceProfileName').fill('Mobil teszt');
  await page.locator('#saveWorkspaceProfile').tap();
  assert.equal(await page.locator('#workspaceProfile option').count(),2);
  const savedProfileId=await page.locator('#workspaceProfile option').nth(1).getAttribute('value');
  await page.evaluate(({key,id})=>{const value=JSON.parse(localStorage.getItem(key));value.profiles.find(profile=>profile.id===id).dock={leftOpen:true,rightOpen:true,leftTab:'layers',leftWidth:400,rightWidth:380};localStorage.setItem(key,JSON.stringify(value))},{key:WORKSPACE_PREFERENCES_KEY,id:savedProfileId});
  await page.reload({waitUntil:'load'});
  await openPreferences(page);
  await page.locator('#workspaceProfile').selectOption(savedProfileId);
  await page.locator('#loadWorkspaceProfile').tap();
  assert.ok(!(await page.locator('#leftDock').isVisible()&&await page.locator('#rightDock').isVisible()),'mobile workspace displays at most one panel drawer');
  assert.deepEqual(await page.evaluate(()=>{const value=JSON.parse(localStorage.getItem('sanci-editor-shell-v2'));return {leftOpen:value.leftOpen,rightOpen:value.rightOpen}}),{leftOpen:false,rightOpen:true},'mobile application normalizes a profile that requests two drawers to one durable active drawer');
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'desktop dock preferences never create mobile horizontal overflow');
  await page.locator('#resetWorkspaceAppearance').tap();
  assert.equal(await page.locator('.editor-app').getAttribute('data-workspace-theme'),'graphite');
  assert.equal(await page.locator('#workspaceDockOrder').inputValue(),'left-canvas-right');
  assert.equal(await page.locator('#workspaceProfile option').count(),1,'reset also clears local named profiles');
  assert.deepEqual(writes,[],'mobile profile controls alter only presentation and shell state');
  assert.deepEqual(errors,[]);
});

test('desktop panel and canvas drag reordering is an accessible-selector peer and never dispatches page writes',async t=>{
  const {page,writes,errors}=await openEditor(t,{width:1440,height:900});
  await openPreferences(page);
  await page.locator('#workspaceLayout').selectOption('balanced');
  await page.waitForFunction(()=>!document.querySelector('#leftDock')?.classList.contains('closed')&&!document.querySelector('#rightDock')?.classList.contains('closed'),'balanced desktop workspace opens both editing docks');
  await page.locator('#workspaceDockOrder').selectOption('left-canvas-right');
  await page.waitForFunction(()=>document.querySelector('.workspace')?.dataset.workspaceDockOrder==='left-canvas-right');
  await page.locator('#closeWorkspaceAppearance').click();
  const preview=await page.evaluate(()=>{
    const handle=document.querySelector('#leftDock .dock-heading');
    const target=document.querySelector('.canvas-area');
    const point=target.getBoundingClientRect();
    const canvasWidthBefore=point.width;
    const clientX=point.left+point.width-4;
    const dataTransfer=new DataTransfer();
    handle.dispatchEvent(new DragEvent('dragstart',{bubbles:true,cancelable:true,dataTransfer}));
    target.dispatchEvent(new DragEvent('dragover',{bubbles:true,cancelable:true,dataTransfer,clientX}));
    const style=getComputedStyle(target);
    const state={position:target.dataset.dockDropPosition,label:target.dataset.dockDropLabel,labelContent:getComputedStyle(target,'::after').content,labelPointerEvents:getComputedStyle(target,'::after').pointerEvents,outline:style.outlineStyle,shadow:style.boxShadow,active:document.body.classList.contains('workspace-reordering'),canvasWidthBefore,canvasWidthDuring:target.getBoundingClientRect().width};
    handle.dispatchEvent(new DragEvent('dragend',{bubbles:true,cancelable:true,dataTransfer}));
    return {...state,cleared:!target.hasAttribute('data-dock-drop-position')&&!target.hasAttribute('data-dock-drop-label')&&!document.body.classList.contains('workspace-reordering')};
  });
  const {canvasWidthBefore,canvasWidthDuring,...previewState}=preview;
  assert.deepEqual(previewState,{position:'after',label:'Utána helyezés',labelContent:'"Utána helyezés"',labelPointerEvents:'none',outline:'solid',shadow:'rgb(91, 140, 255) -4px 0px 0px 0px inset',active:true,cleared:true},'the current zone has a plain-language, non-interactive caption which clears on dragend');
  assert.equal(canvasWidthDuring,canvasWidthBefore,'the zone cue does not shrink or cover the separate canvas track');
  const canceled=await page.evaluate(key=>{
    const workspace=document.querySelector('.workspace');
    const handle=document.querySelector('#leftDock .dock-heading');
    const target=document.querySelector('.canvas-area');
    const point=target.getBoundingClientRect();
    const clientX=point.left+point.width-4;
    const dataTransfer=new DataTransfer();
    handle.dispatchEvent(new DragEvent('dragstart',{bubbles:true,cancelable:true,dataTransfer}));
    target.dispatchEvent(new DragEvent('dragover',{bubbles:true,cancelable:true,dataTransfer,clientX}));
    workspace.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true}));
    const afterEscape={order:workspace.dataset.workspaceDockOrder,saved:localStorage.getItem(key),preview:target.hasAttribute('data-dock-drop-position'),previewLabel:target.hasAttribute('data-dock-drop-label'),dragging:document.body.classList.contains('workspace-reordering'),leftOpen:!document.querySelector('#leftDock').classList.contains('closed'),rightOpen:!document.querySelector('#rightDock').classList.contains('closed')};
    target.dispatchEvent(new DragEvent('drop',{bubbles:true,cancelable:true,dataTransfer,clientX}));
    return {...afterEscape,afterLateDrop:workspace.dataset.workspaceDockOrder,savedAfterLateDrop:localStorage.getItem(key),announcement:document.querySelector('#workspaceDockStatus')?.textContent};
  },WORKSPACE_PREFERENCES_KEY);
  assert.equal(canceled.order,'left-canvas-right');
  assert.equal(canceled.afterLateDrop,canceled.order,'a late drop cannot apply a drag canceled with Escape');
  assert.equal(canceled.savedAfterLateDrop,canceled.saved,'an ignored drop does not persist workspace changes');
  assert.equal(canceled.preview,false,'Escape clears the temporary target marker');
  assert.equal(canceled.previewLabel,false,'Escape clears the explanatory drop-zone label too');
  assert.equal(canceled.dragging,false,'Escape exits reordering mode');
  assert.equal(canceled.leftOpen,true,'Escape cancels the drag without collapsing the page tools dock');
  assert.equal(canceled.rightOpen,true,'Escape cancels the drag without collapsing the Inspector');
  assert.equal(canceled.announcement,'','a canceled move is not announced as completed');
  const result=await page.evaluate(key=>{
    const workspace=document.querySelector('.workspace');
    const handle=document.querySelector('#leftDock .dock-heading');
    const target=document.querySelector('.canvas-area');
    const point=target.getBoundingClientRect();
    const clientX=point.left+point.width-4;
    const dataTransfer=new DataTransfer();
    handle.dispatchEvent(new DragEvent('dragstart',{bubbles:true,cancelable:true,dataTransfer}));
    target.dispatchEvent(new DragEvent('dragover',{bubbles:true,cancelable:true,dataTransfer,clientX}));
    target.dispatchEvent(new DragEvent('drop',{bubbles:true,cancelable:true,dataTransfer,clientX}));
    handle.dispatchEvent(new DragEvent('dragend',{bubbles:true,cancelable:true,dataTransfer}));
    return {order:workspace.dataset.workspaceDockOrder,areas:getComputedStyle(workspace).gridTemplateAreas,left:document.querySelector('#leftDock').getBoundingClientRect().left,canvas:target.getBoundingClientRect().left,dragHint:handle.getAttribute('draggable'),saved:JSON.parse(localStorage.getItem(key))?.dockOrder,preview:target.hasAttribute('data-dock-drop-position'),dragging:document.body.classList.contains('workspace-reordering'),announcement:document.querySelector('#workspaceDockStatus')?.textContent};
  },WORKSPACE_PREFERENCES_KEY);
  assert.equal(result.order,'canvas-left-right');
  assert.ok(result.left>result.canvas,'dropping the panel after the canvas moves its dock slot after the canvas');
  assert.match(result.areas,/"canvas left right"/u);
  assert.equal(result.dragHint,'true','desktop dock title is draggable');
  assert.equal(result.saved,'canvas-left-right','the drag operation persists only the local workspace preference');
  assert.equal(result.preview,false,'dropping clears the temporary target marker');
  assert.equal(result.dragging,false,'dropping and dragend leave no drag interaction state');
  assert.match(result.announcement,/Oldalak és eszközök panel.*Vászon.*után.*Sorrend:/iu,'the result is announced for assistive technology');
  assert.deepEqual(writes,[],'desktop workspace drag never invokes Page Model Save or Publish');
  assert.deepEqual(errors,[]);
});

test('dropping a dock onto another dock creates an undoable canvas-safe tab group',async t=>{
  const {page,writes,errors}=await openEditor(t,{width:1440,height:900});
  await openPreferences(page);
  await page.locator('#workspaceLayout').selectOption('balanced');
  await page.locator('#workspacePanelMode').selectOption('separate');
  await page.waitForFunction(()=>!document.querySelector('#leftDock')?.classList.contains('closed')&&!document.querySelector('#rightDock')?.classList.contains('closed'));
  await page.locator('#closeWorkspaceAppearance').click();

  const result=await page.evaluate(()=>{
    const source=document.querySelector('#leftDock .dock-heading');
    const target=document.querySelector('#rightDock');
    const rect=target.getBoundingClientRect(),canvas=document.querySelector('.canvas-area');
    const widthBefore=canvas.getBoundingClientRect().width,dataTransfer=new DataTransfer();
    source.dispatchEvent(new DragEvent('dragstart',{bubbles:true,cancelable:true,dataTransfer}));
    target.dispatchEvent(new DragEvent('dragover',{bubbles:true,cancelable:true,dataTransfer,clientX:rect.left+rect.width/2}));
    const preview={position:target.dataset.dockDropPosition,label:target.dataset.dockDropLabel,labelContent:getComputedStyle(target,'::after').content,labelPointerEvents:getComputedStyle(target,'::after').pointerEvents,outline:getComputedStyle(target).outlineStyle,widthBefore,widthDuring:canvas.getBoundingClientRect().width,active:document.body.classList.contains('workspace-reordering')};
    target.dispatchEvent(new DragEvent('drop',{bubbles:true,cancelable:true,dataTransfer,clientX:rect.left+rect.width/2}));
    const left=document.querySelector('#leftDock'),right=document.querySelector('#rightDock');
    return {preview,grouped:{
      mode:document.querySelector('.editor-app').dataset.workspacePanelMode,
      side:document.querySelector('.editor-app').dataset.workspacePanelSide,
      active:document.querySelector('.workspace').dataset.workspaceActivePanel,
      selected:document.querySelector('#workspacePanelTabLeft').getAttribute('aria-selected'),
      tabsVisible:getComputedStyle(document.querySelector('.workspace-panel-group-tabs')).display!=='none',
      leftVisible:getComputedStyle(left).display!=='none'&&!left.classList.contains('closed'),
      rightHidden:getComputedStyle(right).display==='none',
      canvas:canvas.getBoundingClientRect().width,
      canvasLeft:canvas.getBoundingClientRect().left,
      groupLeft:left.getBoundingClientRect().left,
      order:document.querySelector('.workspace').dataset.workspaceDockOrder,
      announcement:document.querySelector('#workspaceDockStatus').textContent,
      stalePreview:target.hasAttribute('data-dock-drop-position')||target.hasAttribute('data-dock-drop-label'),
      dragActive:document.body.classList.contains('workspace-reordering')
    }};
  });
  const {preview,grouped}=result;
  assert.equal(preview.position,'group');
  assert.equal(preview.label,'Panelcsoport');
  assert.equal(preview.labelContent,'"Panelcsoport"');
  assert.equal(preview.labelPointerEvents,'none');
  assert.equal(preview.outline,'solid');
  assert.equal(preview.widthDuring,preview.widthBefore,'the central panel zone previews grouping without taking canvas width');
  assert.equal(preview.active,true);
  assert.equal(grouped.mode,'tabbed');
  assert.equal(grouped.side,'right');
  assert.equal(grouped.active,'left');
  assert.equal(grouped.selected,'true');
  assert.equal(grouped.tabsVisible,true);
  assert.equal(grouped.leftVisible,true);
  assert.equal(grouped.rightHidden,true,'the inactive group panel leaves layout and keyboard focus');
  assert.ok(grouped.canvas>=400&&grouped.groupLeft>grouped.canvasLeft,'the dock group occupies its own right-side grid track');
  assert.equal(grouped.order,'left-canvas-right','the side target retains the current three-region ordering');
  assert.match(grouped.announcement,/fülei közé került.*vászon fedetlen/iu);
  assert.equal(grouped.stalePreview,false);
  assert.equal(grouped.dragActive,false);

  await openPreferences(page);
  assert.equal(await page.locator('#undoWorkspaceLayout').isEnabled(),true,'grouping joins workspace Undo history');
  await page.locator('#undoWorkspaceLayout').click();
  assert.equal(await page.locator('#workspacePanelMode').inputValue(),'separate');
  assert.equal(await page.locator('.workspace-panel-group-tabs').isVisible(),false,'Undo restores independent dock panels');
  await page.locator('#redoWorkspaceLayout').click();
  assert.equal(await page.locator('#workspacePanelMode').inputValue(),'tabbed');
  assert.equal(await page.locator('#workspacePanelSide').inputValue(),'right');
  await page.locator('#workspaceProfileName').fill('Jobb oldali csoport');
  await page.locator('#saveWorkspaceProfile').click();
  await page.locator('#closeWorkspaceAppearance').click();
  await page.reload({waitUntil:'load'});
  await page.waitForFunction(()=>document.documentElement.dataset.editorBoot==='ready');
  assert.equal(await page.locator('.editor-app').getAttribute('data-workspace-panel-mode'),'tabbed','the dock target persists across reload');
  assert.equal(await page.locator('.editor-app').getAttribute('data-workspace-panel-side'),'right');
  assert.equal(await page.locator('.workspace').evaluate(element=>element.dataset.workspaceActivePanel),'left');
  assert.ok(await page.locator('.canvas-area').evaluate(element=>element.getBoundingClientRect().width>=400));
  assert.deepEqual(writes,[],'dock grouping changes only shell/workspace state, never Page Model Save or Publish');
  assert.deepEqual(errors,[]);
});

test('dropping the right dock into the left dock center keeps the group on the left track',async t=>{
  const {page,writes,errors}=await openEditor(t,{width:1280,height:900});
  await openPreferences(page);
  await page.locator('#workspaceLayout').selectOption('balanced');
  await page.locator('#workspacePanelMode').selectOption('separate');
  await page.waitForFunction(()=>!document.querySelector('#leftDock')?.classList.contains('closed')&&!document.querySelector('#rightDock')?.classList.contains('closed'));
  await page.locator('#closeWorkspaceAppearance').click();

  const result=await page.evaluate(()=>{
    const source=document.querySelector('#rightDock .dock-heading');
    const target=document.querySelector('#leftDock');
    const rect=target.getBoundingClientRect(),canvas=document.querySelector('.canvas-area'),dataTransfer=new DataTransfer();
    const canvasBefore=canvas.getBoundingClientRect().width;
    source.dispatchEvent(new DragEvent('dragstart',{bubbles:true,cancelable:true,dataTransfer}));
    target.dispatchEvent(new DragEvent('dragover',{bubbles:true,cancelable:true,dataTransfer,clientX:rect.left+rect.width/2}));
    const preview=target.dataset.dockDropPosition,label=target.dataset.dockDropLabel;
    target.dispatchEvent(new DragEvent('drop',{bubbles:true,cancelable:true,dataTransfer,clientX:rect.left+rect.width/2}));
    const left=document.querySelector('#leftDock'),right=document.querySelector('#rightDock');
    return {
      preview,label,
      mode:document.querySelector('.editor-app').dataset.workspacePanelMode,
      side:document.querySelector('.editor-app').dataset.workspacePanelSide,
      active:document.querySelector('.workspace').dataset.workspaceActivePanel,
      leftSelected:document.querySelector('#workspacePanelTabLeft').getAttribute('aria-selected'),
      rightSelected:document.querySelector('#workspacePanelTabRight').getAttribute('aria-selected'),
      leftHidden:getComputedStyle(left).display==='none',
      rightVisible:getComputedStyle(right).display!=='none'&&!right.classList.contains('closed'),
      canvasBefore,
      canvasAfter:canvas.getBoundingClientRect().width,
      canvasLeft:canvas.getBoundingClientRect().left,
      groupLeft:right.getBoundingClientRect().left,
      groupWidth:right.getBoundingClientRect().width,
      order:document.querySelector('.workspace').dataset.workspaceDockOrder,
      announcement:document.querySelector('#workspaceDockStatus').textContent,
      stalePreview:target.hasAttribute('data-dock-drop-position')||target.hasAttribute('data-dock-drop-label'),
      dragActive:document.body.classList.contains('workspace-reordering')
    };
  });

  assert.equal(result.preview,'group');
  assert.equal(result.label,'Panelcsoport','the target preview names the grouping action');
  assert.equal(result.mode,'tabbed');
  assert.equal(result.side,'left');
  assert.equal(result.active,'right');
  assert.equal(result.leftSelected,'false');
  assert.equal(result.rightSelected,'true');
  assert.equal(result.leftHidden,true);
  assert.equal(result.rightVisible,true);
  assert.ok(result.canvasAfter>=result.canvasBefore,'grouping on the left must not squeeze or cover the canvas');
  assert.ok(result.canvasAfter>=400&&result.groupWidth>0&&result.groupLeft<result.canvasLeft,'the active right panel occupies the group’s left-side grid track');
  assert.equal(result.order,'left-canvas-right');
  assert.match(result.announcement,/fülei közé került.*bal oldalon.*vászon fedetlen/iu);
  assert.equal(result.stalePreview,false);
  assert.equal(result.dragActive,false);
  assert.deepEqual(writes,[],'the reverse grouping direction never writes Page Model, Save, or Publish');
  assert.deepEqual(errors,[]);
});

test('dropping a dock from a tab group onto the canvas edge separates and reorders it as one undoable change',async t=>{
  const {page,writes,errors}=await openEditor(t,{width:1280,height:900});
  await openPreferences(page);
  await page.locator('#workspaceLayout').selectOption('balanced');
  await page.locator('#workspacePanelMode').selectOption('tabbed');
  await page.locator('#workspacePanelSide').selectOption('right');
  await page.waitForFunction(()=>!document.querySelector('#leftDock')?.classList.contains('closed')&&!document.querySelector('#rightDock')?.classList.contains('closed'));
  await page.locator('#closeWorkspaceAppearance').click();
  await page.reload({waitUntil:'load'});
  await page.waitForFunction(()=>document.documentElement.dataset.editorBoot==='ready');
  await page.locator('#workspacePanelTabRight').click();
  await page.reload({waitUntil:'load'});
  await page.waitForFunction(()=>document.documentElement.dataset.editorBoot==='ready');

  const result=await page.evaluate(()=>{
    const source=document.querySelector('#rightDock .dock-heading'),target=document.querySelector('.canvas-area'),canvas=target;
    const rect=target.getBoundingClientRect(),canvasBefore=canvas.getBoundingClientRect().width,dataTransfer=new DataTransfer();
    source.dispatchEvent(new DragEvent('dragstart',{bubbles:true,cancelable:true,dataTransfer}));
    target.dispatchEvent(new DragEvent('dragover',{bubbles:true,cancelable:true,dataTransfer,clientX:rect.left+rect.width*0.2}));
    const preview=target.dataset.dockDropPosition,label=target.dataset.dockDropLabel;
    target.dispatchEvent(new DragEvent('drop',{bubbles:true,cancelable:true,dataTransfer,clientX:rect.left+rect.width*0.2}));
    return {
      preview,label,
      mode:document.querySelector('.editor-app').dataset.workspacePanelMode,
      side:document.querySelector('.editor-app').dataset.workspacePanelSide,
      active:document.querySelector('.workspace').dataset.workspaceActivePanel,
      order:document.querySelector('.workspace').dataset.workspaceDockOrder,
      canvasBefore,
      canvasAfter:canvas.getBoundingClientRect().width,
      canvasLeft:canvas.getBoundingClientRect().left,
      leftRight:document.querySelector('#leftDock').getBoundingClientRect().right,
      rightRight:document.querySelector('#rightDock').getBoundingClientRect().right,
      leftVisible:getComputedStyle(document.querySelector('#leftDock')).display!=='none'&&!document.querySelector('#leftDock').classList.contains('closed'),
      rightVisible:getComputedStyle(document.querySelector('#rightDock')).display!=='none'&&!document.querySelector('#rightDock').classList.contains('closed'),
      announcement:document.querySelector('#workspaceDockStatus').textContent,
      previewCleared:!target.hasAttribute('data-dock-drop-position')&&!target.hasAttribute('data-dock-drop-label'),
      dragFinished:!document.body.classList.contains('workspace-reordering'),
      saved:JSON.parse(localStorage.getItem('sanci-editor-workspace-preferences-v2'))
    };
  });

  assert.equal(result.preview,'before','the canvas edge keeps the existing before/after target affordance');
  assert.equal(result.label,'Elé helyezés','a drop zone explains the result without relying on color alone');
  assert.equal(result.mode,'separate','dropping a tabbed panel on the canvas removes it from its group');
  assert.equal(result.side,'right','the remembered group side remains available if the user groups the panels again');
  assert.equal(result.active,'right','the moved source dock remains active');
  assert.equal(result.order,'left-right-canvas','the source becomes a separate dock before the canvas');
  assert.ok(result.canvasAfter>=400&&result.leftRight<=result.canvasLeft&&result.rightRight<=result.canvasLeft,'separating the docks retains a 400px canvas after both panels without overlap');
  assert.equal(result.leftVisible,true);
  assert.equal(result.rightVisible,true);
  assert.match(result.announcement,/Beállítások panel külön dokkolóként a vászon elé került.*vászon fedetlen/iu);
  assert.equal(result.previewCleared,true);
  assert.equal(result.dragFinished,true);
  assert.deepEqual(result.saved,{version:2,layout:'balanced',theme:'graphite',density:'comfortable',accent:'#5b8cff',dockOrder:'left-right-canvas',panelMode:'separate',panelSide:'right',profiles:[]});

  await openPreferences(page);
  assert.equal(await page.locator('#undoWorkspaceLayout').isEnabled(),true,'ungrouping and reordering share one workspace history entry');
  await page.locator('#undoWorkspaceLayout').click();
  assert.equal(await page.locator('#workspacePanelMode').inputValue(),'tabbed','one Undo restores the grouped mode and previous order together');
  assert.equal(await page.locator('#workspacePanelSide').inputValue(),'right');
  assert.equal(await page.locator('.workspace').getAttribute('data-workspace-dock-order'),'left-canvas-right');
  assert.equal(await page.locator('#undoWorkspaceLayout').isDisabled(),true,'the combined change contributes exactly one Undo entry');
  await page.locator('#redoWorkspaceLayout').click();
  assert.equal(await page.locator('#workspacePanelMode').inputValue(),'separate');
  assert.equal(await page.locator('.workspace').getAttribute('data-workspace-dock-order'),'left-right-canvas');
  assert.equal(await page.locator('#closeWorkspaceAppearance').isVisible(),true);
  await page.locator('#closeWorkspaceAppearance').click();
  await page.reload({waitUntil:'load'});
  await page.waitForFunction(()=>document.documentElement.dataset.editorBoot==='ready');
  assert.equal(await page.locator('.editor-app').getAttribute('data-workspace-panel-mode'),'separate','the ungrouped layout persists after reload');
  assert.equal(await page.locator('.workspace').getAttribute('data-workspace-dock-order'),'left-right-canvas');
  assert.ok(await page.locator('.canvas-area').evaluate(element=>element.getBoundingClientRect().width>=400));
  assert.equal(await page.locator('#save').textContent(),'Mentés');
  assert.equal(await page.locator('#publish').textContent(),'Publikálás');
  assert.deepEqual(writes,[],'dock ungrouping and workspace history never Save or Publish the Page Model');
  assert.deepEqual(errors,[]);
});

test('dropping the canvas onto a dock center reorders regions instead of grouping a panel',async t=>{
  const {page,writes,errors}=await openEditor(t,{width:1440,height:900});
  await openPreferences(page);
  await page.locator('#workspaceLayout').selectOption('balanced');
  await page.locator('#workspacePanelMode').selectOption('separate');
  await page.locator('#closeWorkspaceAppearance').click();

  const result=await page.evaluate(()=>{
    const source=document.querySelector('.canvas-toolbar'),target=document.querySelector('#rightDock'),rect=target.getBoundingClientRect(),dataTransfer=new DataTransfer();
    source.dispatchEvent(new DragEvent('dragstart',{bubbles:true,cancelable:true,dataTransfer}));
    target.dispatchEvent(new DragEvent('dragover',{bubbles:true,cancelable:true,dataTransfer,clientX:rect.left+rect.width/2}));
    const preview=target.dataset.dockDropPosition;
    target.dispatchEvent(new DragEvent('drop',{bubbles:true,cancelable:true,dataTransfer,clientX:rect.left+rect.width/2}));
    return {preview,mode:document.querySelector('.editor-app').dataset.workspacePanelMode,order:document.querySelector('.workspace').dataset.workspaceDockOrder,announcement:document.querySelector('#workspaceDockStatus').textContent};
  });

  assert.equal(result.preview,'after','the canvas keeps the existing edge-ordering interpretation at the dock center');
  assert.equal(result.mode,'separate','only dock-to-dock drops may create a tab group');
  assert.equal(result.order,'left-right-canvas');
  assert.match(result.announcement,/Vászon.*Beállítások.*után/iu);
  assert.deepEqual(writes,[]);
  assert.deepEqual(errors,[]);
});

test('left tool rail order is customizable, undoable, profile-aware and keyboard navigable',async t=>{
  const {page,writes,errors}=await openEditor(t,{width:1366,height:900});
  await openPreferences(page);
  const rail=page.locator('.tool-rail');
  const order=()=>rail.locator('.rail-btn').evaluateAll(buttons=>buttons.map(button=>button.dataset.tab));
  assert.deepEqual(await order(),['pages','elements','layers','schedule','navigation']);
  await page.locator('#workspaceLeftTool').selectOption('layers');
  assert.equal(await page.locator('#moveWorkspaceLeftToolUp').isDisabled(),false);
  await page.locator('#moveWorkspaceLeftToolUp').click();
  assert.deepEqual(await order(),['pages','layers','elements','schedule','navigation']);
  assert.equal(await rail.locator('.rail-btn.active').getAttribute('data-tab'),'pages','reordering does not change the selected tool');
  assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('sanci-editor-shell-v2')).leftTabOrder),['pages','layers','elements','schedule','navigation']);
  assert.equal(await rail.locator('.rail-btn[data-tab="layers"]').getAttribute('aria-posinset'),'2');
  assert.equal(await rail.locator('.rail-btn[data-tab="layers"]').getAttribute('aria-setsize'),'5');
  await page.locator('#undoWorkspaceLayout').click();
  assert.deepEqual(await order(),['pages','elements','layers','schedule','navigation'],'workspace Undo restores only the rail order');
  await page.locator('#redoWorkspaceLayout').click();
  assert.deepEqual(await order(),['pages','layers','elements','schedule','navigation'],'workspace Redo reapplies the rail order');
  await page.locator('#workspaceProfileName').fill('Saját eszközsorrend');
  await page.locator('#saveWorkspaceProfile').click();
  const profileId=await page.locator('#workspaceProfile').inputValue();
  await page.locator('#workspaceLeftTool').selectOption('navigation');
  await page.locator('#moveWorkspaceLeftToolUp').click();
  await page.locator('#moveWorkspaceLeftToolUp').click();
  assert.deepEqual(await order(),['pages','layers','navigation','elements','schedule']);
  await page.locator('#workspaceProfile').selectOption(profileId);
  await page.locator('#loadWorkspaceProfile').click();
  assert.deepEqual(await order(),['pages','layers','elements','schedule','navigation'],'saved profiles restore the user tool order');
  await page.locator('#closeWorkspaceAppearance').click();
  await page.locator('#leftTabPages').focus();
  await page.locator('#leftTabPages').press('ArrowUp');
  assert.equal(await rail.locator('.rail-btn[aria-selected="true"]').getAttribute('data-tab'),'navigation','vertical keyboard navigation follows the personalized order');
  await page.reload({waitUntil:'load'});
  assert.deepEqual(await order(),['pages','layers','elements','schedule','navigation'],'rail order survives reload');
  assert.deepEqual(writes,[],'tool ordering, profile and workspace history never submit page content');
  assert.deepEqual(errors,[]);
});

test('phone left tool ordering preserves touch targets, the one-drawer workspace and zero page writes',async t=>{
  const {page,writes,errors}=await openEditor(t,{width:320,height:850,isMobile:true,hasTouch:true});
  await openPreferences(page);
  await page.locator('#workspaceLeftTool').selectOption('navigation');
  const buttons=page.locator('#moveWorkspaceLeftToolUp,#moveWorkspaceLeftToolDown');
  const sizes=await buttons.evaluateAll(items=>items.map(item=>({id:item.id,height:item.getBoundingClientRect().height,disabled:item.disabled})));
  assert.ok(sizes.every(item=>item.height>=44),`reorder controls remain touchable at phone width: ${JSON.stringify(sizes)}`);
  await page.locator('#moveWorkspaceLeftToolUp').tap();
  assert.deepEqual(await page.locator('.tool-rail .rail-btn').evaluateAll(items=>items.map(item=>item.dataset.tab)),['pages','elements','layers','navigation','schedule']);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'tool ordering does not introduce horizontal scrolling');
  assert.ok(!(await page.locator('#leftDock').isVisible()&&await page.locator('#rightDock').isVisible()),'the mobile shell keeps at most one active drawer');
  assert.deepEqual(writes,[],'the mobile rail preference never changes the page');
  assert.deepEqual(errors,[]);
});

test('desktop dock separators resize by keyboard, announce width and finish interrupted pointer drags safely',async t=>{
  const {page,writes,errors}=await openEditor(t,{width:1440,height:900});
  await openPreferences(page);
  await page.locator('#workspaceLayout').selectOption('balanced');
  await page.locator('#closeWorkspaceAppearance').click();
  await page.locator('#workspaceAppearanceDialog[open]').waitFor({state:'hidden'});
  await page.locator('.more-actions').evaluate(element=>element.removeAttribute('open'));
  // Wait for the browser's native-dialog focus restoration to settle before
  // exercising the next, unrelated keyboard target.
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));

  const left=page.locator('.left-resizer');
  assert.equal(await left.getAttribute('role'),'separator');
  assert.equal(await left.getAttribute('aria-orientation'),'vertical');
  assert.equal(await left.getAttribute('aria-controls'),'leftDock');
  assert.equal(await left.getAttribute('aria-valuenow'),'310');
  await left.focus();
  const focusState=await left.evaluate(element=>({focused:document.activeElement===element,active:document.activeElement?.id||document.activeElement?.className||document.activeElement?.tagName,dockHidden:element.closest('.dock')?.getAttribute('aria-hidden'),disabled:element.disabled,display:getComputedStyle(element).display,visibility:getComputedStyle(element).visibility,rect:element.getBoundingClientRect().toJSON()}));
  assert.equal(focusState.focused,true,'the separator receives keyboard focus after leaving workspace preferences: '+JSON.stringify(focusState));
  await page.keyboard.press('ArrowRight');
  assert.equal(await left.getAttribute('aria-valuenow'),'326','the left separator follows the physical arrow direction');
  assert.match(await left.getAttribute('aria-valuetext'),/326 képpont/u);
  assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--left-dock-width').trim()),'326px');
  await left.focus();
  await page.keyboard.press('Shift+ArrowLeft');
  assert.equal(await left.getAttribute('aria-valuenow'),'278','Shift applies a larger precision-friendly step');
  await page.keyboard.press('Home');
  assert.equal(await left.getAttribute('aria-valuenow'),'250','Home clamps at the documented minimum');
  await page.keyboard.press('End');
  assert.equal(await left.getAttribute('aria-valuenow'),'460','End clamps at the documented maximum');

  const right=page.locator('.right-resizer');
  assert.equal(await right.getAttribute('aria-valuenow'),'352');
  await right.focus();
  await page.keyboard.press('ArrowLeft');
  assert.equal(await right.getAttribute('aria-valuenow'),'368','the right separator grows toward the canvas');
  await page.keyboard.press('Shift+ArrowRight');
  assert.equal(await right.getAttribute('aria-valuenow'),'320');

  for(const width of [1025,1280,1920]){
    await page.setViewportSize({width,height:900});
    const hitAreas=await page.evaluate(()=>['left','right'].map(side=>{
      const panel=document.querySelector(side==='left'?'#leftDock':'#rightDock');
      const handle=panel.querySelector('.dock-resizer');
      const panelRect=panel.getBoundingClientRect(),handleRect=handle.getBoundingClientRect();
      return {side,inside:handleRect.left>=panelRect.left&&handleRect.right<=panelRect.right&&handleRect.top>=panelRect.top&&handleRect.bottom<=panelRect.bottom,target:document.elementFromPoint(handleRect.left+handleRect.width/2,handleRect.top+handleRect.height/2)?.classList.contains('dock-resizer')};
    }));
    assert.ok(hitAreas.every(area=>area.inside&&area.target),`both complete resize targets remain reachable at ${width}px: ${JSON.stringify(hitAreas)}`);
  }
  await page.setViewportSize({width:1440,height:900});

  const leftPoint=await left.boundingBox();
  assert.ok(leftPoint,'the left resize handle is present in the desktop shell');
  const leftStart=leftPoint.x+leftPoint.width/2;
  const leftY=leftPoint.y+leftPoint.height/2;
  const leftHit=await page.evaluate(({x,y})=>{const parent=document.querySelector('#leftDock').getBoundingClientRect(),handle=document.querySelector('.left-resizer').getBoundingClientRect();return {target:document.elementFromPoint(x,y)?.className,parent:parent.toJSON(),handle:handle.toJSON(),clipped:handle.left<parent.left||handle.right>parent.right,width:getComputedStyle(document.querySelector('.left-resizer')).width,display:getComputedStyle(document.querySelector('.left-resizer')).display,media:matchMedia('(max-width: 1024px)').matches}},{x:leftStart,y:leftY});
  assert.equal(leftHit.clipped,false,`the complete resize target stays inside its overflow-clipped dock: ${JSON.stringify(leftHit)}`);
  assert.match(String(leftHit.target),/left-resizer/u,`the visible resize handle receives pointer input: ${JSON.stringify(leftHit)}`);
  await page.mouse.move(leftStart,leftY);
  await page.mouse.down();
  await page.waitForFunction(()=>document.body.classList.contains('resizing-dock'));
  await page.mouse.move(leftStart-110,leftY);
  await page.waitForFunction(()=>document.querySelector('.left-resizer')?.getAttribute('aria-valuenow')==='350');
  await page.mouse.up();
  await page.waitForFunction(()=>!document.body.classList.contains('resizing-dock'));
  assert.equal(await page.locator('.left-resizer').getAttribute('aria-valuenow'),'350','a real pointer drag updates and announces the dock width');
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('sanci-editor-shell-v2'))?.leftWidth),350,'pointerup persists the final width');

  const rightPoint=await right.boundingBox();
  assert.ok(rightPoint,'the right resize handle is present in the desktop shell');
  const rightStart=rightPoint.x+rightPoint.width/2;
  const rightY=rightPoint.y+rightPoint.height/2;
  await page.mouse.move(rightStart,rightY);
  await page.mouse.down();
  await page.waitForFunction(()=>document.body.classList.contains('resizing-dock'));
  await page.mouse.move(rightStart-20,rightY);
  await page.waitForFunction(()=>document.querySelector('.right-resizer')?.getAttribute('aria-valuenow')==='340');
  await right.dispatchEvent('pointercancel',{pointerId:1,bubbles:true,cancelable:true});
  await page.waitForFunction(()=>!document.body.classList.contains('resizing-dock'));
  assert.equal(await right.getAttribute('aria-valuenow'),'340','a real pointercancel keeps the partial drag width');
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('sanci-editor-shell-v2'))?.rightWidth),340,'pointercancel persists the partial width');
  await page.mouse.up();

  const lostPoint=await left.boundingBox();
  const lostStart=lostPoint.x+lostPoint.width/2;
  const lostY=lostPoint.y+lostPoint.height/2;
  await page.mouse.move(lostStart,lostY);
  await page.mouse.down();
  await page.waitForFunction(()=>document.body.classList.contains('resizing-dock'));
  await page.mouse.move(lostStart+12,lostY);
  await page.waitForFunction(()=>document.querySelector('.left-resizer')?.getAttribute('aria-valuenow')==='362');
  await left.evaluate(handle=>handle.dispatchEvent(new PointerEvent('lostpointercapture',{bubbles:true,pointerId:1})));
  await page.waitForFunction(()=>!document.body.classList.contains('resizing-dock'));
  assert.equal(await left.getAttribute('aria-valuenow'),'362','lost pointer capture keeps and announces the last usable width');
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('sanci-editor-shell-v2'))?.leftWidth),362,'lostpointercapture persists partial progress');
  await page.mouse.up();
  await openPreferences(page);
  await page.locator('#undoWorkspaceLayout').click();
  assert.equal(await left.getAttribute('aria-valuenow'),'350','workspace Undo restores the pre-drag width after lostpointercapture');
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('sanci-editor-shell-v2'))?.leftWidth),350,'Undo persists the prior local shell width');
  await page.locator('#redoWorkspaceLayout').click();
  assert.equal(await left.getAttribute('aria-valuenow'),'362','workspace Redo reapplies the pointer-resized width');
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('sanci-editor-shell-v2'))?.leftWidth),362,'Redo persists the resized local shell width');
  await page.locator('#closeWorkspaceAppearance').click();
  await page.reload({waitUntil:'load'});
  assert.equal(await page.locator('.left-resizer').getAttribute('aria-valuenow'),'362','keyboard and pointer widths survive reload');
  assert.equal(await page.locator('.right-resizer').getAttribute('aria-valuenow'),'340','the interrupted right-panel width survives reload');
  assert.deepEqual(writes,[],'resizing changes only presentation state and never saves or publishes the page');
  assert.deepEqual(errors,[]);
});

test('workspace profile export/import uses bounded allowlisted JSON, supports undo and never writes page data',async t=>{
  const {page,writes,errors}=await openEditor(t,{width:1366,height:900});
  await openPreferences(page);
  await page.locator('#workspaceProfileName').fill('Kiinduló nézet');
  await page.locator('#saveWorkspaceProfile').click();
  const originalId=await page.locator('#workspaceProfile').inputValue();
  assert.ok(originalId);
  assert.equal(await page.locator('#exportWorkspaceProfile').isEnabled(),true);
  const downloadPromise=page.waitForEvent('download');
  await page.locator('#exportWorkspaceProfile').click();
  const download=await downloadPromise;
  assert.equal(download.suggestedFilename(),'sanci-workspace-kiindulo-nezet.json');
  const exportPath=await download.path();
  const exported=JSON.parse(await readFile(exportPath,'utf8'));
  assert.equal(exported.kind,'sanci-editor-workspace-profile');
  assert.equal(exported.version,1);
  assert.deepEqual(Object.keys(exported.profile).sort(),['appearance','createdAt','dock','id','name']);

  const imported={...exported,profile:{...exported.profile,id:originalId,name:'Importált elrendezés',customCss:'body{display:none}',script:'alert(1)',appearance:{...exported.profile.appearance,theme:'aurora',customCss:'body{display:none}'}}};
  const chooserPromise=page.waitForEvent('filechooser');
  await page.locator('#importWorkspaceProfile').click();
  const chooser=await chooserPromise;
  await chooser.setFiles({name:'workspace-profile.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(imported))});
  await page.waitForFunction(()=>document.querySelector('#workspaceProfile')?.options.length===3);
  const importedId=await page.locator('#workspaceProfile').inputValue();
  assert.notEqual(importedId,originalId,'imported profiles receive a fresh local identifier');
  assert.equal(await page.locator('#workspaceProfile option').last().textContent(),'Importált elrendezés');
  assert.equal(await page.locator('.editor-app').getAttribute('data-workspace-theme'),'graphite','import stores a profile without unexpectedly applying it');
  const stored=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),WORKSPACE_PREFERENCES_KEY);
  const savedImported=stored.profiles.find(profile=>profile.id===importedId);
  assert.equal(savedImported.appearance.theme,'aurora');
  assert.equal('customCss' in savedImported,false);
  assert.equal('script' in savedImported,false);
  await page.locator('#undoWorkspaceLayout').click();
  assert.equal(await page.locator('#workspaceProfile option').count(),2,'profile import is part of local workspace Undo history');
  await page.locator('#redoWorkspaceLayout').click();
  assert.equal(await page.locator('#workspaceProfile option').count(),3,'workspace Redo restores the imported profile');

  const duplicate={...exported,profile:{...exported.profile,name:'KIINDULÓ NÉZET'}};
  await page.locator('#workspaceProfileFile').setInputFiles({name:'duplicate.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(duplicate))});
  await page.waitForFunction(()=>document.querySelector('#workspaceAppearanceStatus')?.textContent.includes('Már van ilyen nevű profil'));
  assert.equal(await page.locator('#workspaceProfile option').count(),3,'duplicate names never overwrite a local profile');
  await page.locator('#workspaceProfileFile').setInputFiles({name:'oversized.json',mimeType:'application/json',buffer:Buffer.alloc(16_385,0x20)});
  await page.waitForFunction(()=>document.querySelector('#workspaceAppearanceStatus')?.textContent.includes('túl nagy'));
  assert.equal(await page.locator('#workspaceProfile option').count(),3,'oversized files are rejected before JSON parsing');
  await page.locator('#workspaceProfileFile').setInputFiles({name:'unsupported.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({...exported,version:999}))});
  await page.waitForFunction(()=>document.querySelector('#workspaceAppearanceStatus')?.textContent.includes('nem érvényes'));
  assert.equal(await page.locator('#workspaceProfile option').count(),3,'unsupported file versions cannot mutate local profiles');
  assert.deepEqual(writes,[],'profile file transfer and workspace history never Save or Publish page content');
  assert.deepEqual(errors,[]);
});

test('open editor tabs synchronize saved appearance, dock state and profiles without retaining stale undo or touching page data',async t=>{
  const {page,context,writes,errors}=await openEditor(t,{width:1366,height:900});
  const second=await context.newPage();
  await second.goto(page.url(),{waitUntil:'load'});
  await second.locator('.page-canvas .node').first().waitFor();
  await openPreferences(page);
  await openPreferences(second);
  await page.locator('#workspaceTheme').selectOption('aurora');
  await second.waitForFunction(()=>document.querySelector('.editor-app')?.dataset.workspaceTheme==='aurora');

  await page.locator('#workspaceLayout').selectOption('balanced');
  await second.waitForFunction(()=>document.querySelector('.workspace')?.classList.contains('left-open')&&document.querySelector('.workspace')?.classList.contains('right-open'));
  assert.equal(await second.locator('#workspaceLayout').inputValue(),'balanced','the second editor tab adopts the persisted layout');
  assert.equal(await second.locator('#undoWorkspaceLayout').isDisabled(),true,'external workspace changes clear history based on stale state');
  assert.match(await second.locator('#workspaceAppearanceStatus').textContent(),/másik szerkesztőlapon/iu,'the receiving tab explains why its local history was cleared');

  await page.locator('#closeWorkspaceAppearance').click();
  const activeDrag=await page.evaluate(()=>{
    const handle=document.querySelector('#leftDock .dock-heading'),target=document.querySelector('.canvas-area'),rect=target.getBoundingClientRect(),dataTransfer=new DataTransfer();
    handle.dispatchEvent(new DragEvent('dragstart',{bubbles:true,cancelable:true,dataTransfer}));
    target.dispatchEvent(new DragEvent('dragover',{bubbles:true,cancelable:true,dataTransfer,clientX:rect.left+rect.width-4}));
    window.__workspaceDockTransfer=dataTransfer;
    return {order:document.querySelector('.workspace').dataset.workspaceDockOrder,preview:target.dataset.dockDropPosition,active:document.body.classList.contains('workspace-reordering')};
  });
  assert.equal(activeDrag.preview,'after');
  assert.equal(activeDrag.active,true);
  await second.locator('#workspaceDockOrder').selectOption('canvas-right-left');
  await page.waitForFunction(()=>document.querySelector('.workspace')?.dataset.workspaceDockOrder==='canvas-right-left');
  assert.equal(await page.locator('#workspaceDockOrder').inputValue(),'canvas-right-left','the dock-order preference is shared across open tabs');
  const staleDrop=await page.evaluate(()=>{
    const target=document.querySelector('.canvas-area'),rect=target.getBoundingClientRect(),dataTransfer=window.__workspaceDockTransfer;
    target.dispatchEvent(new DragEvent('drop',{bubbles:true,cancelable:true,dataTransfer,clientX:rect.left+rect.width-4}));
    const result={order:document.querySelector('.workspace').dataset.workspaceDockOrder,preview:target.hasAttribute('data-dock-drop-position'),active:document.body.classList.contains('workspace-reordering'),announcement:document.querySelector('#workspaceDockStatus')?.textContent,saved:JSON.parse(localStorage.getItem('sanci-editor-workspace-preferences-v2'))?.dockOrder};
    delete window.__workspaceDockTransfer;
    return result;
  });
  assert.equal(staleDrop.order,'canvas-right-left','the external order wins over a drag started from stale geometry');
  assert.equal(staleDrop.saved,'canvas-right-left','a canceled cross-tab drag does not persist a stale order');
  assert.equal(staleDrop.preview,false,'external workspace changes clear the old drop target');
  assert.equal(staleDrop.active,false,'external workspace changes cancel the in-progress interaction');
  assert.equal(staleDrop.announcement,'','a canceled drag is not announced as a completed move');
  await openPreferences(page);

  await page.locator('#workspaceLeftTool').selectOption('layers');
  await page.locator('#moveWorkspaceLeftToolUp').click();
  assert.equal(await page.locator('#undoWorkspaceLayout').isEnabled(),true,'the local rail-order change enters only this tab’s workspace history');
  await second.locator('#workspaceLeftTool').selectOption('navigation');
  await second.locator('#moveWorkspaceLeftToolUp').click();
  await page.waitForFunction(()=>[...document.querySelectorAll('.tool-rail .rail-btn')].map(button=>button.dataset.tab).join(',')==='pages,layers,elements,navigation,schedule');
  assert.equal(await page.locator('#undoWorkspaceLayout').isDisabled(),true,'an external rail-order update clears a history snapshot that could overwrite it');
  assert.match(await page.locator('#workspaceAppearanceStatus').textContent(),/másik szerkesztőlapon megváltozott az eszközök sorrendje/iu);

  await second.locator('#workspaceProfileName').fill('Másik lap nézete');
  await second.locator('#saveWorkspaceProfile').click();
  await page.waitForFunction(()=>document.querySelector('#workspaceProfile')?.options.length===2);
  assert.equal(await page.locator('#workspaceProfile option').last().textContent(),'Másik lap nézete','saved profiles become available in other open tabs');
  assert.equal(await page.locator('#workspaceProfile').inputValue(),'','receiving the profile does not apply it unexpectedly');
  await second.evaluate(()=>localStorage.clear());
  await page.waitForFunction(()=>document.querySelector('.editor-app')?.dataset.workspaceTheme==='graphite'&&document.querySelector('.workspace')?.dataset.workspaceDockOrder==='left-canvas-right'&&document.querySelector('#workspaceProfile')?.options.length===1);
  assert.equal(await page.locator('.workspace').evaluate(element=>element.classList.contains('left-open')||element.classList.contains('right-open')),false,'clearing origin-local storage returns the other tab to a safe default layout');
  assert.deepEqual(writes,[],'workspace synchronization never invokes Page Model Save or Publish');
  assert.deepEqual(errors,[]);
});


test('desktop dock drag cancels when the viewport switches to the mobile drawer shell',async t=>{
  const {page,writes,errors}=await openEditor(t,{width:1440,height:900});
  await openPreferences(page);
  await page.locator('#workspaceLayout').selectOption('balanced');
  await page.locator('#closeWorkspaceAppearance').click();
  const started=await page.evaluate(()=>{
    const handle=document.querySelector('#leftDock .dock-heading'),target=document.querySelector('.canvas-area'),rect=target.getBoundingClientRect(),dataTransfer=new DataTransfer();
    handle.dispatchEvent(new DragEvent('dragstart',{bubbles:true,cancelable:true,dataTransfer}));
    target.dispatchEvent(new DragEvent('dragover',{bubbles:true,cancelable:true,dataTransfer,clientX:rect.left+rect.width-4}));
    window.__workspaceDockTransfer=dataTransfer;
    return {order:document.querySelector('.workspace').dataset.workspaceDockOrder,active:document.body.classList.contains('workspace-reordering')};
  });
  assert.equal(started.active,true,'desktop drag is active before the responsive boundary changes');
  await page.setViewportSize({width:390,height:844});
  await page.waitForFunction(()=>!document.body.classList.contains('workspace-reordering'));
  const late=await page.evaluate(()=>{
    const target=document.querySelector('.canvas-area'),rect=target.getBoundingClientRect(),dataTransfer=window.__workspaceDockTransfer;
    target.dispatchEvent(new DragEvent('drop',{bubbles:true,cancelable:true,dataTransfer,clientX:rect.left+rect.width-4}));
    const result={order:document.querySelector('.workspace').dataset.workspaceDockOrder,preview:target.hasAttribute('data-dock-drop-position'),active:document.body.classList.contains('workspace-reordering')};
    delete window.__workspaceDockTransfer;
    return result;
  });
  assert.equal(late.order,started.order,'a mobile breakpoint cancels the prior desktop insertion');
  assert.equal(late.preview,false,'responsive change clears desktop-only target styling');
  assert.equal(late.active,false,'mobile mode does not retain desktop drag state');
  assert.ok(!(await page.locator('#leftDock').isVisible()&&await page.locator('#rightDock').isVisible()),'the mobile single-drawer rule remains intact');
  assert.deepEqual(writes,[],'canceling dock interactions never writes page content');
  assert.deepEqual(errors,[]);
});

test('workspace appearance and dock settings report session-only changes when browser storage is blocked',async t=>{
  const {page,writes,errors}=await openEditor(t,{width:1440,height:900});
  await openPreferences(page);
  await page.evaluate(key=>{
    const original=Storage.prototype.setItem;
    Storage.prototype.setItem=function(name,value){if(name===key)throw new DOMException('Storage is disabled','SecurityError');return original.call(this,name,value)};
  },WORKSPACE_PREFERENCES_KEY);

  await page.locator('#workspaceTheme').selectOption('ocean');
  assert.equal(await page.locator('.editor-app').getAttribute('data-workspace-theme'),'ocean','a session-only theme still takes effect');
  await page.waitForFunction(()=>document.querySelector('#workspaceAppearanceStatus')?.textContent.includes('csak ebben a munkamenetben'));
  assert.match(await page.locator('#workspaceAppearanceStatus').textContent(),/böngésző tárhelye nem használható/iu);

  await page.locator('#workspaceLayout').selectOption('balanced');
  await page.waitForFunction(()=>document.querySelector('#workspaceAppearanceStatus')?.textContent.includes('csak ebben a munkamenetben'));
  assert.equal(await page.locator('.workspace').evaluate(element=>element.classList.contains('left-open')&&element.classList.contains('right-open')),true,'the session-only layout remains usable');

  await page.locator('#workspaceDockOrder').selectOption('canvas-right-left');
  await page.waitForFunction(()=>document.querySelector('#workspaceAppearanceStatus')?.textContent.includes('csak ebben a munkamenetben'));
  assert.equal(await page.locator('.workspace').getAttribute('data-workspace-dock-order'),'canvas-right-left','the session-only dock order still applies');
  await page.locator('#undoWorkspaceLayout').click();
  await page.waitForFunction(()=>document.querySelector('#workspaceAppearanceStatus')?.textContent.includes('visszavontad'));
  assert.match(await page.locator('#workspaceAppearanceStatus').textContent(),/csak ebben a munkamenetben/iu,'Undo reports that its result is not durable');
  await page.locator('#redoWorkspaceLayout').click();
  await page.waitForFunction(()=>document.querySelector('#workspaceAppearanceStatus')?.textContent.includes('újra alkalmaztad'));
  assert.match(await page.locator('#workspaceAppearanceStatus').textContent(),/csak ebben a munkamenetben/iu,'Redo reports that its result is not durable');

  assert.equal(await page.evaluate(key=>localStorage.getItem(key),WORKSPACE_PREFERENCES_KEY),null,'blocked storage does not claim that settings were persisted');
  assert.deepEqual(writes,[],'local workspace settings never Save or Publish page content');
  assert.deepEqual(errors,[]);
});

test('profile import explains when browser storage is unavailable instead of claiming the profile was saved',async t=>{
  const {page,writes,errors}=await openEditor(t,{width:390,height:844,isMobile:true,hasTouch:true});
  await openPreferences(page);
  await page.evaluate(key=>{
    const original=Storage.prototype.setItem;
    Storage.prototype.setItem=function(name,value){if(name===key)throw new DOMException('Storage is full','QuotaExceededError');return original.call(this,name,value)};
  },WORKSPACE_PREFERENCES_KEY);
  await page.locator('#workspaceProfileName').fill('Csak munkamenetes mentés');
  await page.locator('#saveWorkspaceProfile').tap();
  await page.waitForFunction(()=>document.querySelector('#workspaceAppearanceStatus')?.textContent.includes('csak ebben a munkamenetben'));
  assert.equal(await page.locator('#workspaceProfile option').count(),2,'manual profile creation also remains honest when storage is blocked');
  assert.equal(await page.evaluate(key=>localStorage.getItem(key),WORKSPACE_PREFERENCES_KEY),null);
  const transfer={kind:'sanci-editor-workspace-profile',version:1,profile:{id:'profile-transfer-source',name:'Átmeneti telefonos nézet',createdAt:1,appearance:{layout:'balanced',theme:'aurora',density:'comfortable',accent:'#00a7c8',dockOrder:'right-canvas-left'},dock:{leftOpen:true,rightOpen:false,leftTab:'layers',leftWidth:310,rightWidth:352}}};
  await page.locator('#workspaceProfileFile').setInputFiles({name:'temporary-profile.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(transfer))});
  await page.waitForFunction(()=>document.querySelector('#workspaceAppearanceStatus')?.textContent.includes('csak ebben a munkamenetben'));
  assert.equal(await page.locator('#workspaceProfile option').count(),3,'the safe in-memory profile remains available for the current Editor session');
  assert.equal(await page.evaluate(key=>localStorage.getItem(key),WORKSPACE_PREFERENCES_KEY),null,'failed browser persistence does not claim durable storage');
  assert.deepEqual(writes,[],'a failed profile persistence attempt never writes Page Model data');
  assert.deepEqual(errors,[]);
});

test('desktop canvas focus temporarily hides both docks, preserves the exact saved workspace and restores both panels',async t=>{
  const {page,writes,errors}=await openEditor(t,{width:1440,height:900});
  await page.locator('#editorMenu').click();
  await page.locator('#openInspector').click();
  assert.equal(await page.locator('#leftDock').isVisible(),true);
  assert.equal(await page.locator('#rightDock').isVisible(),true);
  const saved=await page.evaluate(()=>({shell:localStorage.getItem('sanci-editor-shell-v2'),appearance:localStorage.getItem('sanci-editor-workspace-preferences-v2')}));
  const before=await page.locator('.canvas-area').evaluate(element=>element.getBoundingClientRect().width);

  await page.locator('#focusCanvas').click();
  assert.equal(await page.locator('.workspace').evaluate(element=>element.classList.contains('canvas-focus')),true);
  assert.equal(await page.locator('#leftDock').evaluate(element=>getComputedStyle(element).display),'none');
  assert.equal(await page.locator('#rightDock').evaluate(element=>getComputedStyle(element).display),'none');
  assert.equal(await page.locator('#leftDock').getAttribute('aria-hidden'),'true');
  assert.equal(await page.locator('#rightDock').getAttribute('aria-hidden'),'true');
  assert.equal(await page.locator('#leftDock').evaluate(element=>element.inert),true);
  assert.equal(await page.locator('#rightDock').evaluate(element=>element.inert),true);
  assert.equal(await page.locator('#focusCanvas').getAttribute('aria-pressed'),'true');
  assert.equal(await page.locator('#focusCanvas').getAttribute('data-editor-action'),'restoreCanvasFocus');
  assert.ok(await page.locator('.canvas-area').evaluate(element=>element.getBoundingClientRect().width)>before,'hiding dock columns gives the canvas the reclaimed desktop space');
  assert.deepEqual(await page.evaluate(()=>({shell:localStorage.getItem('sanci-editor-shell-v2'),appearance:localStorage.getItem('sanci-editor-workspace-preferences-v2')})),saved,'focus mode is temporary and does not rewrite workspace preferences');
  assert.deepEqual(writes,[],'canvas focus never saves or publishes page content');

  await page.locator('#focusCanvas').click();
  assert.equal(await page.locator('.workspace').evaluate(element=>element.classList.contains('canvas-focus')),false);
  assert.equal(await page.locator('#leftDock').isVisible(),true,'the open Pages dock is restored');
  assert.equal(await page.locator('#rightDock').isVisible(),true,'the open Inspector is restored');
  assert.equal(await page.locator('#focusCanvas').getAttribute('aria-pressed'),'false');
  assert.equal(await page.locator('#focusCanvas').getAttribute('data-editor-action'),'focusCanvas');
  assert.deepEqual(await page.evaluate(()=>({shell:localStorage.getItem('sanci-editor-shell-v2'),appearance:localStorage.getItem('sanci-editor-workspace-preferences-v2')})),saved);
  assert.equal(await page.locator('#save').textContent(),'Mentés');
  assert.equal(await page.locator('#publish').textContent(),'Publikálás');
  assert.deepEqual(writes,[]);
  assert.deepEqual(errors,[]);
});

test('mobile canvas focus is touch-sized, releases the canvas from the panel backdrop and restores the prior drawer',async t=>{
  const {page,writes,errors}=await openEditor(t,{width:390,height:844,isMobile:true,hasTouch:true});
  await page.locator('#editorMenu').tap();
  assert.equal(await page.locator('#leftDock').isVisible(),true);
  const saved=await page.evaluate(()=>({shell:localStorage.getItem('sanci-editor-shell-v2'),appearance:localStorage.getItem('sanci-editor-workspace-preferences-v2')}));
  const button=page.locator('#mobileCanvasFocus');
  const geometry=await button.evaluate(element=>{const rect=element.getBoundingClientRect();return {width:rect.width,height:rect.height}});
  assert.ok(geometry.width>=44&&geometry.height>=44,`the mobile focus action remains a minimum 44px touch target: ${JSON.stringify(geometry)}`);
  await button.tap();
  assert.equal(await page.locator('.workspace').evaluate(element=>element.classList.contains('canvas-focus')),true);
  assert.equal(await page.locator('#leftDock').evaluate(element=>getComputedStyle(element).display),'none');
  assert.equal(await page.locator('#rightDock').evaluate(element=>getComputedStyle(element).display),'none');
  assert.equal(await page.locator('.canvas-area').evaluate(element=>element.inert),false,'the previous mobile backdrop no longer blocks the canvas');
  assert.equal(await button.getAttribute('aria-pressed'),'true');
  assert.equal(await button.getAttribute('data-editor-action'),'restoreCanvasFocus');
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'focus mode keeps the 390px phone viewport free of horizontal overflow');
  assert.deepEqual(await page.evaluate(()=>({shell:localStorage.getItem('sanci-editor-shell-v2'),appearance:localStorage.getItem('sanci-editor-workspace-preferences-v2')})),saved);
  assert.deepEqual(writes,[]);

  await button.tap();
  assert.equal(await page.locator('.workspace').evaluate(element=>element.classList.contains('canvas-focus')),false);
  assert.equal(await page.locator('#leftDock').isVisible(),true,'the prior mobile drawer returns without changing its saved layout');
  assert.equal(await page.locator('#leftDock').getAttribute('aria-hidden'),'false');
  assert.equal(await page.locator('.canvas-area').evaluate(element=>element.inert),true,'the modal drawer resumes blocking the canvas until dismissed');
  assert.deepEqual(await page.evaluate(()=>({shell:localStorage.getItem('sanci-editor-shell-v2'),appearance:localStorage.getItem('sanci-editor-workspace-preferences-v2')})),saved);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await button.tap();
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('.workspace').evaluate(element=>element.classList.contains('canvas-focus')),false,'Escape also exits the temporary focus mode');
  assert.equal(await page.locator('#leftDock').isVisible(),true,'Escape restores the prior drawer instead of closing and saving it');
  assert.deepEqual(await page.evaluate(()=>({shell:localStorage.getItem('sanci-editor-shell-v2'),appearance:localStorage.getItem('sanci-editor-workspace-preferences-v2')})),saved);
  assert.deepEqual(writes,[],'the mobile action never invokes Save or Publish');
  assert.deepEqual(errors,[]);
});

test('desktop dock layout normalizes to one mobile drawer during resize and restores the desktop layout',async t=>{
  const {page,writes,errors}=await openEditor(t,{width:1366,height:900});
  await page.locator('#editorMenu').click();
  await page.locator('#openInspector').click();
  assert.equal(await page.locator('#leftDock').isVisible(),true);
  assert.equal(await page.locator('#rightDock').isVisible(),true);
  const saved=await page.evaluate(()=>({shell:localStorage.getItem('sanci-editor-shell-v2'),appearance:localStorage.getItem('sanci-editor-workspace-preferences-v2')}));

  await page.setViewportSize({width:390,height:844});
  await page.waitForFunction(()=>document.querySelector('.workspace')?.matches('.left-open,.right-open'));
  const mobile=await page.evaluate(()=>({left:!document.querySelector('#leftDock')?.classList.contains('closed'),right:!document.querySelector('#rightDock')?.classList.contains('closed'),leftHidden:document.querySelector('#leftDock')?.getAttribute('aria-hidden'),rightHidden:document.querySelector('#rightDock')?.getAttribute('aria-hidden'),canvasInert:document.querySelector('.canvas-area')?.inert,scrollWidth:document.documentElement.scrollWidth,innerWidth}));
  assert.ok(Number(mobile.left)+Number(mobile.right)<=1,`a viewport resize never leaves overlapping mobile drawers open: ${JSON.stringify(mobile)}`);
  assert.equal(mobile.right,true,'the right-side Inspector is the deterministic choice when both desktop panels are open and focus remains on the top toolbar');
  assert.equal(mobile.leftHidden,'true');
  assert.equal(mobile.rightHidden,'false');
  assert.equal(mobile.canvasInert,true,'the active drawer still protects its controls from the background canvas');
  assert.ok(mobile.scrollWidth<=mobile.innerWidth,'switching to a single mobile sheet never creates horizontal overflow');
  assert.deepEqual(await page.evaluate(()=>({shell:localStorage.getItem('sanci-editor-shell-v2'),appearance:localStorage.getItem('sanci-editor-workspace-preferences-v2')})),saved,'responsive normalization is temporary and does not overwrite the desktop profile');

  await page.setViewportSize({width:1366,height:900});
  await page.waitForFunction(()=>document.querySelector('#leftDock')?.classList.contains('closed')===false&&document.querySelector('#rightDock')?.classList.contains('closed')===false);
  assert.equal(await page.locator('#leftDock').getAttribute('aria-hidden'),'false');
  assert.equal(await page.locator('#rightDock').getAttribute('aria-hidden'),'false');
  assert.deepEqual(await page.evaluate(()=>({shell:localStorage.getItem('sanci-editor-shell-v2'),appearance:localStorage.getItem('sanci-editor-workspace-preferences-v2')})),saved,'returning to desktop restores both saved panels without a storage write');
  assert.deepEqual(writes,[],'responsive dock changes never Save or Publish the page');
  assert.deepEqual(errors,[]);
});

test('responsive dock resize keeps the focused panel and honors an explicit mobile panel change',async t=>{
  const {page,writes,errors}=await openEditor(t,{width:1366,height:900});
  await page.locator('#editorMenu').click();
  await page.locator('#openInspector').click();
  await page.locator('#leftTabLayers').click();
  assert.equal(await page.locator('#leftTabLayers').evaluate(element=>document.activeElement===element),true);

  await page.setViewportSize({width:390,height:844});
  await page.waitForFunction(()=>document.querySelector('#leftDock')?.classList.contains('closed')===false);
  let mobile=await page.evaluate(()=>({left:!document.querySelector('#leftDock')?.classList.contains('closed'),right:!document.querySelector('#rightDock')?.classList.contains('closed'),scrollWidth:document.documentElement.scrollWidth,innerWidth}));
  assert.deepEqual({left:mobile.left,right:mobile.right},{left:true,right:false},'the panel that contained keyboard focus remains available after crossing the breakpoint');
  assert.ok(mobile.scrollWidth<=mobile.innerWidth);

  await page.setViewportSize({width:1366,height:900});
  await page.waitForFunction(()=>document.querySelector('#rightDock')?.classList.contains('closed')===false);
  assert.equal(await page.locator('#leftDock').isVisible(),true,'the original desktop layout is restored after a temporary responsive switch');

  await page.setViewportSize({width:390,height:844});
  await page.waitForFunction(()=>document.querySelector('#leftDock')?.classList.contains('closed')===false);
  await page.locator('#openInspector').click();
  await page.waitForFunction(()=>document.querySelector('#rightDock')?.classList.contains('closed')===false);
  assert.equal(await page.locator('#leftDock').isVisible(),false,'a deliberate mobile panel choice closes the previous drawer');

  await page.setViewportSize({width:1366,height:900});
  await page.waitForFunction(()=>document.querySelector('#rightDock')?.classList.contains('closed')===false);
  assert.equal(await page.locator('#leftDock').evaluate(element=>element.classList.contains('closed')),true,'a deliberate mobile choice replaces the temporary desktop snapshot (the desktop navigation rail itself remains visible)');
  assert.equal(await page.locator('#rightDock').isVisible(),true);
  assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('sanci-editor-shell-v2'))),{leftOpen:false,rightOpen:true,leftTab:'layers',leftTabOrder:['pages','elements','layers','schedule','navigation'],inspectorTab:'design',panelActive:'right',leftWidth:310,rightWidth:352});
  assert.deepEqual(writes,[],'responsive panel changes never issue page Save or Publish requests');
  assert.deepEqual(errors,[]);
});
