import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve,extname} from 'node:path';
import {after,test} from 'node:test';
import {chromium} from 'playwright';
import {createDocument} from '../../public/editor-v2/core/schema.js';
import {LEGACY_WORKSPACE_PREFERENCES_KEY,WORKSPACE_PREFERENCES_KEY} from '../../public/editor-v2/ui/workspace-appearance.js';

const root=resolve(import.meta.dirname,'../../public');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml'};
let browserPromise;
function getBrowser(){
  browserPromise??=chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
  return browserPromise;
}
after(async()=>{
  if(browserPromise)await (await browserPromise).close();
});
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
async function openEditor(t,{width=1366,height=900,isMobile=false,hasTouch=false,blockWorkspaceStorageReads=false,blockShellStorageReads=false,ignoreWorkspacePreferenceWrites=false,initialDockState=null,initialAppearance=null,initialLegacyAppearance=null}={}){
  const fixture=fixtureServer();await new Promise(done=>fixture.server.listen(0,'127.0.0.1',done));
  t.after(()=>new Promise(done=>fixture.server.close(done)));
  const browser=await getBrowser();
  const context=await browser.newContext({viewport:{width,height},isMobile,hasTouch});t.after(()=>context.close());
  if(blockWorkspaceStorageReads||blockShellStorageReads||ignoreWorkspacePreferenceWrites)await context.addInitScript(({blockWorkspaceStorageReads,blockShellStorageReads,ignoreWorkspacePreferenceWrites})=>{
    const getItem=Storage.prototype.getItem;
    const setItem=Storage.prototype.setItem;
    Storage.prototype.getItem=function(key){
      if((blockWorkspaceStorageReads&&(key==='sanci-editor-shell-v2'||key==='sanci-editor-workspace-preferences-v2'||key==='sanci-editor-workspace-preferences-v1'))||(blockShellStorageReads&&key==='sanci-editor-shell-v2'))throw new DOMException('Storage is disabled','SecurityError');
      return getItem.call(this,key);
    };
    Storage.prototype.setItem=function(key,value){
      if(ignoreWorkspacePreferenceWrites&&key==='sanci-editor-workspace-preferences-v2')return;
      return setItem.call(this,key,value);
    };
  },{blockWorkspaceStorageReads,blockShellStorageReads,ignoreWorkspacePreferenceWrites});
  if(initialDockState||initialAppearance||initialLegacyAppearance)await context.addInitScript(({dock,appearance,legacyAppearance})=>{
    if(dock)localStorage.setItem('sanci-editor-shell-v2',JSON.stringify(dock));
    if(appearance)localStorage.setItem('sanci-editor-workspace-preferences-v2',typeof appearance==='string'?appearance:JSON.stringify(appearance));
    if(legacyAppearance)localStorage.setItem('sanci-editor-workspace-preferences-v1',JSON.stringify(legacyAppearance));
  },{dock:initialDockState,appearance:initialAppearance,legacyAppearance:initialLegacyAppearance});
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

async function resizeAndWaitForWorkspaceBreakpoint(page,width,height){
  await page.evaluate(()=>{
    const media=matchMedia('(max-width: 1024px)');
    window.__workspaceBreakpointTransition=new Promise(resolve=>media.addEventListener('change',()=>{
      requestAnimationFrame(()=>requestAnimationFrame(resolve));
    },{once:true}));
  });
  await page.setViewportSize({width,height});
  await page.evaluate(()=>window.__workspaceBreakpointTransition);
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
  try{
    await mobile.page.locator('#workspacePanelMode').selectOption('tabbed');
  }catch(error){
    const state=await mobile.page.evaluate(()=>{
      const select=document.querySelector('#workspacePanelMode');
      const dialog=document.querySelector('#workspaceAppearanceDialog');
      if(!select)return {selectPresent:false,dialogOpen:dialog?.open??false,activeElement:document.activeElement?.id||document.activeElement?.tagName||null};
      const rect=select.getBoundingClientRect(),style=getComputedStyle(select);
      return {
        selectPresent:true,disabled:select.disabled,hidden:select.hidden,inert:select.closest('[inert]')!==null,
        display:style.display,visibility:style.visibility,pointerEvents:style.pointerEvents,
        ariaHidden:select.closest('[aria-hidden="true"]')!==null,
        rect:{x:rect.x,y:rect.y,width:rect.width,height:rect.height},
        dialogOpen:dialog?.open??false,dialogAnimations:[...(dialog?.getAnimations()||[])].map(animation=>animation.playState),
        activeElement:document.activeElement?.id||document.activeElement?.tagName||null
      };
    });
    throw new Error(`${error.message}\nworkspacePanelMode failure state: ${JSON.stringify(state)}`,{cause:error});
  }
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

test('floating panel groups look detached but stay inside a reserved canvas-safe dock track',async t=>{
  const {page,writes,errors}=await openEditor(t,{width:1280,height:900});
  await openPreferences(page);
  await page.locator('#workspaceLayout').selectOption('balanced');
  await page.locator('#workspacePanelMode').selectOption('floating');
  await page.locator('#workspacePanelSide').selectOption('left');
  await page.locator('#closeWorkspaceAppearance').click();
  const tabs=page.locator('.workspace-panel-group-tabs');
  assert.equal(await tabs.isVisible(),true,'the floating group still provides an accessible, switchable panel tablist');
  assert.equal(await page.locator('.workspace').getAttribute('data-workspace-panel-grouped'),'true');
  assert.equal(await page.locator('#leftDock').getAttribute('role'),'tabpanel');
  const geometry=async()=>page.evaluate(()=>{
    const canvas=document.querySelector('.canvas-area').getBoundingClientRect();
    const active=document.querySelector('.workspace').dataset.workspaceActivePanel==='left'?document.querySelector('#leftDock'):document.querySelector('#rightDock');
    const panel=active.getBoundingClientRect();
    const style=getComputedStyle(active);
    return {canvas:{left:canvas.left,right:canvas.right,width:canvas.width},panel:{left:panel.left,right:panel.right,top:panel.top,bottom:panel.bottom},shadow:style.boxShadow,radius:style.borderRadius,scrollWidth:document.documentElement.scrollWidth};
  });
  const left=await geometry();
  assert.ok(left.canvas.width>=400,`floating panel reserves a full canvas track: ${JSON.stringify(left)}`);
  assert.ok(left.panel.right<=left.canvas.left,`left floating card remains in its own grid track: ${JSON.stringify(left)}`);
  assert.ok(left.panel.top>72&&left.panel.bottom<900,'the floating card is visibly inset vertically without becoming an overlay');
  assert.notEqual(left.shadow,'none','the floating card has a distinct raised visual surface');
  assert.match(left.radius,/px/u,'the floating card has rounded window-like corners');
  assert.equal(left.scrollWidth,1280,'the reserved floating lane introduces no horizontal overflow');
  await page.locator('#workspacePanelTabRight').click();
  const right=await geometry();
  assert.ok(right.canvas.width>=400,`switching the floating Inspector keeps the canvas reserved: ${JSON.stringify(right)}`);
  assert.ok(right.panel.right<=right.canvas.left,`the selected floating panel remains on the chosen side: ${JSON.stringify(right)}`);
  assert.equal(await page.locator('#workspacePanelTabRight').getAttribute('aria-selected'),'true');

  await openPreferences(page);
  await page.locator('#workspaceProfileName').fill('Lebegő, vászonbiztos nézet');
  await page.locator('#saveWorkspaceProfile').click();
  const profileId=await page.locator('#workspaceProfile').inputValue();
  assert.ok(profileId,'the floating group is saved with the local workspace profile');
  await page.locator('#closeWorkspaceAppearance').click();
  await page.reload({waitUntil:'load'});
  await page.waitForFunction(()=>document.documentElement.dataset.editorBoot==='ready');
  assert.equal(await page.locator('#workspaceAppearanceDialog').getAttribute('open'),null,'profile reload leaves the appearance dialog closed');
  assert.equal(await page.locator('.editor-app').getAttribute('data-workspace-panel-mode'),'floating','floating mode survives reload');
  const restoredGroup=await page.evaluate(()=>({selected:document.querySelector('#workspacePanelTabRight')?.getAttribute('aria-selected'),active:document.querySelector('.workspace')?.dataset.workspaceActivePanel,stored:JSON.parse(localStorage.getItem('sanci-editor-shell-v2')||'{}'),appearance:JSON.parse(localStorage.getItem('sanci-editor-workspace-appearance-v2')||'{}')}));
  assert.equal(restoredGroup.selected,'true',`the active group panel survives reload: ${JSON.stringify(restoredGroup)}`);
  assert.ok((await geometry()).canvas.width>=400,'the reloaded floating card retains the canvas reservation');

  await resizeAndWaitForWorkspaceBreakpoint(page,390,844);
  await page.waitForFunction(()=>Number(!document.querySelector('#leftDock')?.classList.contains('closed'))+Number(!document.querySelector('#rightDock')?.classList.contains('closed'))===1);
  assert.equal(await page.locator('.workspace-panel-group-tabs').isVisible(),false,'the desktop floating group becomes one mobile drawer instead of an overlay pair');
  assert.equal(await page.evaluate(()=>document.querySelector('.canvas-area').inert),true,'the mobile drawer keeps the canvas behind its safe backdrop');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'floating desktop preference introduces no phone overflow');
  await resizeAndWaitForWorkspaceBreakpoint(page,1280,900);
  await page.waitForFunction(()=>document.querySelector('.workspace')?.dataset.workspacePanelMode==='floating');
  const restored=await geometry();
  assert.ok(restored.canvas.width>=400&&restored.panel.right<=restored.canvas.left,`desktop return restores the floating card in its reserved lane: ${JSON.stringify(restored)}`);
  assert.deepEqual(writes,[],'floating workspace presentation never saves or publishes page content');
  assert.deepEqual(errors,[]);
});

test('floating panel cards preserve their physical dock side across all six orders and desktop widths',async t=>{
  const {page,writes,errors}=await openEditor(t,{width:1280,height:900});
  await openPreferences(page);
  await page.locator('#workspaceLayout').selectOption('balanced');
  await page.locator('#workspacePanelMode').selectOption('floating');
  await page.locator('#closeWorkspaceAppearance').click();
  const orders=['left-canvas-right','canvas-left-right','left-right-canvas','right-left-canvas','right-canvas-left','canvas-right-left'];
  const results=[];
  for(const side of ['left','right']){
    await openPreferences(page);
    await page.locator('#workspacePanelSide').selectOption(side);
    await page.locator('#closeWorkspaceAppearance').click();
    for(const order of orders){
      await openPreferences(page);
      await page.locator('#workspaceDockOrder').selectOption(order);
      await page.locator('#closeWorkspaceAppearance').click();
      for(const width of [1025,1280,1920]){
        await page.setViewportSize({width,height:900});
        await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
        for(const active of ['left','right']){
          await page.locator(active==='left'?'#workspacePanelTabLeft':'#workspacePanelTabRight').click();
          const geometry=await page.evaluate(()=>{
            const canvas=document.querySelector('.canvas-area').getBoundingClientRect();
            const workspace=document.querySelector('.workspace');
            const active=workspace.dataset.workspaceActivePanel;
            const panel=document.querySelector(active==='left'?'#leftDock':'#rightDock');
            const rect=panel.getBoundingClientRect();
            const style=getComputedStyle(panel);
            return {order:workspace.dataset.workspaceDockOrder,side:workspace.dataset.workspacePanelSide,mode:workspace.dataset.workspacePanelMode,active,canvas:{left:canvas.left,right:canvas.right,width:canvas.width},panel:{left:rect.left,right:rect.right,top:rect.top,bottom:rect.bottom},shadow:style.boxShadow,radius:style.borderRadius,scrollWidth:document.documentElement.scrollWidth};
          });
          const key=`${side}/${order}/${width}/${active}`;
          assert.equal(geometry.mode,'floating',`${key}: floating mode persists`);
          assert.equal(geometry.side,side,`${key}: group side persists`);
          assert.equal(geometry.order,order,`${key}: dock order persists`);
          assert.ok(geometry.canvas.width>=400,`${key}: canvas minimum survives: ${JSON.stringify(geometry)}`);
          assert.ok(side==='left'?geometry.panel.right<=geometry.canvas.left:geometry.panel.left>=geometry.canvas.right,`${key}: raised card remains in its own physical track: ${JSON.stringify(geometry)}`);
          assert.ok(geometry.panel.top>72&&geometry.panel.bottom<900,`${key}: card remains visibly inset without covering the shell`);
          assert.notEqual(geometry.shadow,'none',`${key}: floating surface remains visibly raised`);
          assert.match(geometry.radius,/px/u,`${key}: card keeps rounded corners`);
          assert.equal(geometry.scrollWidth,width,`${key}: no document overflow`);
          results.push(key);
        }
      }
    }
  }
  assert.equal(results.length,72,'every side/order/width/tab combination is checked');
  assert.deepEqual(writes,[],'floating panel matrix never writes or publishes page content');
  assert.deepEqual(errors,[]);
});

test('tabbing from the right dock tab enters its active panel before the canvas',async t=>{
  const {page,writes,errors}=await openEditor(t,{width:1280,height:900});
  await openPreferences(page);
  await page.locator('#workspaceLayout').selectOption('balanced');
  await page.locator('#workspacePanelMode').selectOption('tabbed');
  await page.locator('#closeWorkspaceAppearance').click();
  await page.waitForFunction(()=>document.activeElement?.id==='openWorkspaceAppearance');

  const rightTab=page.locator('#workspacePanelTabRight');
  await rightTab.click();
  await rightTab.focus();
  await page.waitForFunction(()=>document.activeElement?.id==='workspacePanelTabRight'&&document.querySelector('#rightDock')?.inert===false);
  await rightTab.press('Tab');

  const focus=await page.evaluate(()=>({
    id:document.activeElement?.id||'',
    inActivePanel:Boolean(document.activeElement?.closest('#rightDock')),
    canvasFocused:document.activeElement?.id==='canvas',
    selected:document.querySelector('#workspacePanelTabRight')?.getAttribute('aria-selected'),
    inactiveInert:document.querySelector('#leftDock')?.inert,
    canvasWidth:document.querySelector('.canvas-area')?.getBoundingClientRect().width,
    pageWidth:document.documentElement.scrollWidth,
  }));
  assert.equal(focus.selected,'true');
  assert.equal(focus.inactiveInert,true);
  assert.equal(focus.canvasFocused,false,'tabbing from an active tab must enter its panel, not skip to the canvas because of DOM order');
  assert.equal(focus.inActivePanel,true,`focus should enter the selected tab panel: ${JSON.stringify(focus)}`);
  assert.ok(focus.canvasWidth>=400&&focus.pageWidth===1280,`the selected group keeps a clear canvas: ${JSON.stringify(focus)}`);
  await page.keyboard.press('Shift+Tab');
  assert.equal(await page.evaluate(()=>document.activeElement?.id),'workspacePanelTabRight','Shift+Tab from the first panel control returns to the active dock tab');
  await page.locator('#workspacePanelTabLeft').click();
  const leftTab=page.locator('#workspacePanelTabLeft');
  await leftTab.focus();
  await leftTab.press('Tab');
  assert.equal(await page.evaluate(()=>Boolean(document.activeElement?.closest('#leftDock'))),true,'the active left tab also enters its own panel instead of following unrelated DOM order');
  assert.equal(await page.locator('#rightDock').evaluate(panel=>panel.inert),true,'switching active tabs keeps the previous panel out of keyboard navigation');
  await page.keyboard.press('Shift+Tab');
  assert.equal(await page.evaluate(()=>document.activeElement?.id),'workspacePanelTabLeft','Shift+Tab from the left panel is consistent with the right panel');
  assert.deepEqual(writes,[],'panel keyboard navigation does not mutate or save page content');
  assert.deepEqual(errors,[]);
});

test('clicking the already active dock tab does not create a no-op workspace history entry',async t=>{
  const {page,writes,errors}=await openEditor(t,{width:1280,height:900});
  await openPreferences(page);
  await page.locator('#workspaceLayout').selectOption('balanced');
  await page.locator('#workspacePanelMode').selectOption('tabbed');
  await page.locator('#workspacePanelSide').selectOption('right');
  await page.waitForFunction(()=>!document.querySelector('#leftDock')?.classList.contains('closed')&&!document.querySelector('#rightDock')?.classList.contains('closed'));
  await page.locator('#closeWorkspaceAppearance').click();
  await page.reload({waitUntil:'load'});
  await page.waitForFunction(()=>document.documentElement.dataset.editorBoot==='ready');

  const activeTab=page.locator('[data-workspace-panel-tab][aria-selected="true"]');
  assert.equal(await activeTab.count(),1,'reload leaves exactly one selected dock tab');
  await activeTab.click();
  await openPreferences(page);
  assert.equal(await page.locator('#undoWorkspaceLayout').isDisabled(),true,'reselecting the open active dock does not add an identical snapshot');
  assert.equal(await page.locator('#redoWorkspaceLayout').isDisabled(),true,'a no-op tab click does not clear or create redo history');
  await page.locator('#closeWorkspaceAppearance').click();
  assert.deepEqual(writes,[],'reselecting an active dock does not change the Page Model');
  assert.deepEqual(errors,[]);
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

test('narrow desktop resize controls track the visible dock width when both panels are canvas-clamped',async t=>{
  const dock={leftOpen:true,rightOpen:true,leftTab:'pages',leftTabOrder:['pages','elements','layers','schedule','navigation'],inspectorTab:'design',panelActive:'left',leftWidth:460,rightWidth:440};
  const appearance={version:2,layout:'balanced',theme:'graphite',density:'comfortable',accent:'#5b8cff',dockOrder:'left-canvas-right',panelMode:'separate',panelSide:'right',profiles:[]};
  const {page,writes,errors}=await openEditor(t,{width:1025,height:900,initialDockState:dock,initialAppearance:appearance});
  const left=page.locator('#leftDock .left-resizer');
  const before=await page.evaluate(()=>({
    actual:document.querySelector('#leftDock').getBoundingClientRect().width,
    value:Number(document.querySelector('#leftDock .left-resizer').getAttribute('aria-valuenow')),
    max:Number(document.querySelector('#leftDock .left-resizer').getAttribute('aria-valuemax')),
    canvas:document.querySelector('.canvas-area').getBoundingClientRect().width
  }));
  assert.ok(before.canvas>=400,`both docks keep the narrow desktop canvas usable: ${JSON.stringify(before)}`);
  assert.ok(Math.abs(before.value-before.actual)<=1,`the separator announces its rendered dock width, not the larger saved preference: ${JSON.stringify(before)}`);
  assert.ok(Math.abs(before.max-before.actual)<=1,`the separator maximum reflects the viewport-clamped dock track: ${JSON.stringify(before)}`);

  await left.focus();
  await page.keyboard.press('ArrowLeft');
  await page.waitForFunction(previous=>Number(document.querySelector('#leftDock .left-resizer')?.getAttribute('aria-valuenow'))<previous,before.value);
  const after=await page.evaluate(()=>({
    actual:document.querySelector('#leftDock').getBoundingClientRect().width,
    value:Number(document.querySelector('#leftDock .left-resizer').getAttribute('aria-valuenow')),
    stored:JSON.parse(localStorage.getItem('sanci-editor-shell-v2'))?.leftWidth,
    canvas:document.querySelector('.canvas-area').getBoundingClientRect().width
  }));
  assert.ok(after.actual<before.actual,`one keyboard step visibly resizes the constrained dock: before=${JSON.stringify(before)} after=${JSON.stringify(after)}`);
  assert.ok(Math.abs(after.value-after.actual)<=1,`the updated separator value follows the actual panel size: ${JSON.stringify(after)}`);
  assert.ok(after.canvas>=400,`resizing never compromises the minimum canvas: ${JSON.stringify(after)}`);
  assert.equal(after.stored,after.actual,'the persisted dock width matches the visible user-selected width');
  assert.deepEqual(writes,[],'adjusting workspace dimensions never Saves or Publishes page content');
  assert.deepEqual(errors,[]);
});

test('single open docks keep the canvas clear at every desktop dock order',async t=>{
  const {page,writes,errors}=await openEditor(t,{width:1025,height:900});
  await openPreferences(page);
  await page.locator('#workspaceLayout').selectOption('balanced');
  await page.evaluate(()=>{
    document.documentElement.style.setProperty('--left-dock-width','460px');
    document.documentElement.style.setProperty('--right-dock-width','440px');
  });
  const orders=['left-canvas-right','canvas-left-right','left-right-canvas','right-left-canvas','right-canvas-left','canvas-right-left'];
  const measured=[];
  for(const width of [1025,1280,1920]){
    await page.setViewportSize({width,height:900});
    for(const order of orders){
      await page.locator('#workspaceDockOrder').selectOption(order);
      await page.locator('#workspaceLayout').selectOption('inspector');
      await page.locator('#closeWorkspaceAppearance').click();
      await page.locator('#workspaceAppearanceDialog[open]').waitFor({state:'hidden'});
      let geometry=await page.evaluate(()=>{
        const rect=selector=>{const value=document.querySelector(selector).getBoundingClientRect();return {left:value.left,right:value.right,width:value.width}};
        return {left:rect('#leftDock'),canvas:rect('.canvas-area'),right:rect('#rightDock'),scrollWidth:document.documentElement.scrollWidth};
      });
      assert.ok(geometry.canvas.width>=400,`${order} keeps at least 400px when only the right Inspector is open at ${width}px: ${JSON.stringify(geometry)}`);
      assert.ok(geometry.right.right<=geometry.canvas.left+0.5||geometry.canvas.right<=geometry.right.left+0.5,`${order} keeps the right Inspector in its own track at ${width}px: ${JSON.stringify(geometry)}`);
      assert.ok(geometry.scrollWidth<=width,`${order} does not overflow with only the right Inspector open at ${width}px`);
      measured.push({width,order,active:'right',canvas:Math.round(geometry.canvas.width)});

      await openPreferences(page);
      await page.locator('#workspaceLayout').selectOption('canvas');
      await page.locator('#closeWorkspaceAppearance').click();
      await page.locator('#workspaceAppearanceDialog[open]').waitFor({state:'hidden'});
      await page.locator('#editorMenu').click();
      await page.waitForFunction(()=>!document.querySelector('#leftDock')?.classList.contains('closed'));
      geometry=await page.evaluate(()=>{
        const rect=selector=>{const value=document.querySelector(selector).getBoundingClientRect();return {left:value.left,right:value.right,width:value.width}};
        return {left:rect('#leftDock'),canvas:rect('.canvas-area'),right:rect('#rightDock'),scrollWidth:document.documentElement.scrollWidth};
      });
      assert.ok(geometry.canvas.width>=400,`${order} keeps at least 400px when only the Pages/tools dock is open at ${width}px: ${JSON.stringify(geometry)}`);
      assert.ok(geometry.left.right<=geometry.canvas.left+0.5||geometry.canvas.right<=geometry.left.left+0.5,`${order} keeps the Pages/tools dock in its own track at ${width}px: ${JSON.stringify(geometry)}`);
      assert.ok(geometry.scrollWidth<=width,`${order} does not overflow with only the Pages/tools dock open at ${width}px`);
      measured.push({width,order,active:'left',canvas:Math.round(geometry.canvas.width)});
      await openPreferences(page);
    }
  }
  t.diagnostic(JSON.stringify({testedCombinations:measured.length,minimumCanvas:Math.min(...measured.map(item=>item.canvas)),widths:[1025,1280,1920]}));
  assert.deepEqual(writes,[],'single-panel docking changes only the workspace shell and never Save or Publish page data');
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

test('saved and imported workspace profiles keep unique local IDs after reload and clock collision',async t=>{
  const fixedTime=1_700_000_000_000;
  const idAt=(sequence)=>`profile-${fixedTime.toString(36)}-${sequence.toString(36)}`;
  const appearance={version:2,layout:'canvas',theme:'graphite',density:'comfortable',accent:'#5b8cff',dockOrder:'left-canvas-right',panelMode:'separate',panelSide:'right',profiles:[{
    id:idAt(1),name:'Korábbi munkaterület',createdAt:fixedTime,
    appearance:{layout:'canvas',theme:'graphite',density:'comfortable',accent:'#5b8cff',dockOrder:'left-canvas-right',panelMode:'separate',panelSide:'right'},
    dock:{leftOpen:false,rightOpen:true,leftTab:'pages',leftTabOrder:['pages','elements','layers','schedule','navigation'],inspectorTab:'design',panelActive:'right',leftWidth:310,rightWidth:352},
  }]};
  const {page,writes,errors}=await openEditor(t);
  await page.evaluate(({key,value})=>localStorage.setItem(key,JSON.stringify(value)),{key:WORKSPACE_PREFERENCES_KEY,value:appearance});
  await page.reload({waitUntil:'load'});
  await page.waitForFunction(()=>document.documentElement.dataset.editorBoot==='ready');
  await openPreferences(page);
  await page.locator('#workspaceProfileName').fill('Mentett nézet');
  await page.evaluate(time=>{window.__restoreDateNow=Date.now;Date.now=()=>time},fixedTime);
  await page.locator('#saveWorkspaceProfile').click();
  await page.evaluate(()=>{if(window.__restoreDateNow)Date.now=window.__restoreDateNow});
  const afterSave=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).profiles.map(profile=>profile.id),WORKSPACE_PREFERENCES_KEY);
  assert.deepEqual(afterSave,[idAt(1),idAt(2)],'save skips a persisted ID from a prior Editor instance');

  await page.reload({waitUntil:'load'});
  await page.waitForFunction(()=>document.documentElement.dataset.editorBoot==='ready');
  await openPreferences(page);
  const transfer={kind:'sanci-editor-workspace-profile',version:1,profile:{id:'profile-portable',name:'Importált nézet',createdAt:1,
    appearance:{layout:'balanced',theme:'aurora',density:'compact',accent:'#00a7c8',dockOrder:'right-canvas-left',panelMode:'tabbed',panelSide:'left'},
    dock:{leftOpen:true,rightOpen:true,leftTab:'layers',leftTabOrder:['pages','elements','layers','schedule','navigation'],inspectorTab:'content',panelActive:'left',leftWidth:320,rightWidth:360}}};
  await page.evaluate(time=>{window.__restoreDateNow=Date.now;Date.now=()=>time},fixedTime);
  await page.locator('#workspaceProfileFile').setInputFiles({name:'import.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(transfer))});
  await page.waitForFunction(()=>{
    const status=document.querySelector('#workspaceAppearanceStatus')?.textContent||'';
    return status.includes('Importált nézet')||status.includes('nem érvényes');
  });
  assert.match(await page.locator('#workspaceAppearanceStatus').textContent(),/Importált nézet.*mentve/iu,'the valid profile transfer is accepted');
  assert.equal(await page.locator('#workspaceProfile option').count(),4,'the third profile receives its own selector entry');
  await page.evaluate(()=>{if(window.__restoreDateNow)Date.now=window.__restoreDateNow});
  const all=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).profiles,WORKSPACE_PREFERENCES_KEY);
  const ids=all.map(profile=>profile.id);
  assert.equal(new Set(ids).size,ids.length,'save and import never leave duplicate IDs in profile state');
  assert.deepEqual(ids,[idAt(1),idAt(2),idAt(3)],'import skips IDs that remain after a reload and sequence reset');
  await page.reload({waitUntil:'load'});
  await page.waitForFunction(()=>document.documentElement.dataset.editorBoot==='ready');
  await openPreferences(page);
  const restored=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).profiles,WORKSPACE_PREFERENCES_KEY);
  assert.deepEqual(restored.map(profile=>profile.id),ids,'all workspace profiles survive schema normalization and another reload');
  assert.deepEqual(writes,[],'workspace profile save/import does not invoke Page Model Save or Publish');
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

test('deleting a workspace profile is undoable, redoable, and independent from the page model',async t=>{
  const {page,writes,errors}=await openEditor(t,{width:1280,height:900});
  await openPreferences(page);
  await page.locator('#workspaceProfileName').fill('Első nézet');
  await page.locator('#saveWorkspaceProfile').click();
  const firstId=await page.locator('#workspaceProfile').inputValue();
  await page.locator('#workspaceProfileName').fill('Második nézet');
  await page.locator('#saveWorkspaceProfile').click();
  const secondId=await page.locator('#workspaceProfile').inputValue();

  await page.locator('#workspaceProfile').selectOption(firstId);
  await page.locator('#deleteWorkspaceProfile').click();
  assert.deepEqual(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).profiles.map(profile=>profile.id),WORKSPACE_PREFERENCES_KEY),[secondId]);
  assert.equal(await page.locator('#deleteWorkspaceProfile').isDisabled(),true,'deletion clears a now-missing profile selection');

  await page.locator('#undoWorkspaceLayout').click();
  assert.deepEqual(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).profiles.map(profile=>profile.id),WORKSPACE_PREFERENCES_KEY),[firstId,secondId],'Undo restores the deleted profile without changing either profile ID');
  await page.locator('#redoWorkspaceLayout').click();
  assert.deepEqual(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).profiles.map(profile=>profile.id),WORKSPACE_PREFERENCES_KEY),[secondId],'Redo removes the same local profile again');
  assert.deepEqual(writes,[],'profile deletion and workspace history never invoke Page Model Save or Publish');
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
    const state={position:target.dataset.dockDropPosition,label:target.dataset.dockDropLabel,labelContent:getComputedStyle(target,'::after').content,labelPointerEvents:getComputedStyle(target,'::after').pointerEvents,outline:style.outlineStyle,shadow:style.boxShadow,active:document.body.classList.contains('workspace-reordering'),canvasWidthBefore,canvasWidthDuring:target.getBoundingClientRect().width,announcement:document.querySelector('#workspaceDockStatus')?.textContent};
    handle.dispatchEvent(new DragEvent('dragend',{bubbles:true,cancelable:true,dataTransfer}));
    return {...state,cleared:!target.hasAttribute('data-dock-drop-position')&&!target.hasAttribute('data-dock-drop-label')&&!document.body.classList.contains('workspace-reordering'),finishedAnnouncement:document.querySelector('#workspaceDockStatus')?.textContent};
  });
  const {canvasWidthBefore,canvasWidthDuring,...previewState}=preview;
  assert.deepEqual(previewState,{position:'after',label:'Utána helyezés',labelContent:'"Utána helyezés"',labelPointerEvents:'none',outline:'solid',shadow:'rgb(91, 140, 255) -4px 0px 0px 0px inset',active:true,cleared:true,announcement:'Cél: Utána helyezés – Vászon.',finishedAnnouncement:'Az átrendezés megszakadt.'},'the current zone and cancellation are announced in plain language');
  assert.equal(preview.announcement,'Cél: Utána helyezés – Vászon.','the hidden live region announces the current target in plain language');
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
  assert.equal(canceled.announcement,'Az átrendezés megszakítva.','Escape explains that the panel move was canceled');
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
    const preview={position:target.dataset.dockDropPosition,label:target.dataset.dockDropLabel,labelContent:getComputedStyle(target,'::after').content,labelPointerEvents:getComputedStyle(target,'::after').pointerEvents,outline:getComputedStyle(target).outlineStyle,widthBefore,widthDuring:canvas.getBoundingClientRect().width,active:document.body.classList.contains('workspace-reordering'),announcement:document.querySelector('#workspaceDockStatus').textContent};
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
  assert.equal(preview.announcement,'Cél: Panelcsoport – Beállítások.','the live region names the grouping action and its target before the drop');
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

test('native mouse drag groups desktop docks without covering the canvas or writing page data',async t=>{
  const {page,writes,errors}=await openEditor(t,{width:1280,height:900});
  await openPreferences(page);
  await page.locator('#workspaceLayout').selectOption('balanced');
  await page.locator('#workspacePanelMode').selectOption('separate');
  await page.waitForFunction(()=>!document.querySelector('#leftDock')?.classList.contains('closed')&&!document.querySelector('#rightDock')?.classList.contains('closed'));
  await page.locator('#closeWorkspaceAppearance').click();

  const source=page.locator('#leftDock .dock-heading:visible').first();
  const target=page.locator('#rightDock');
  const targetBounds=await target.boundingBox();
  assert.ok(targetBounds,'the right dock exposes a real mouse drop target');
  await source.dragTo(target,{targetPosition:{x:targetBounds.width/2,y:Math.min(30,targetBounds.height/2)}});

  const grouped=await page.evaluate(()=>{
    const canvas=document.querySelector('.canvas-area'),left=document.querySelector('#leftDock'),right=document.querySelector('#rightDock');
    const rect=canvas.getBoundingClientRect();
    const active=document.querySelector('.workspace').dataset.workspaceActivePanel;
    const activeDock=active==='left'?left:right;
    return {
      mode:document.querySelector('.editor-app').dataset.workspacePanelMode,
      side:document.querySelector('.editor-app').dataset.workspacePanelSide,
      active,
      previewLabel:document.querySelector('#workspaceDockStatus').textContent,
      canvasWidth:rect.width,
      canvasRight:rect.right,
      groupLeft:activeDock.getBoundingClientRect().left,
      canvasLeft:rect.left,
      inactiveHidden:(active==='left'?getComputedStyle(right).display==='none'||right.getAttribute('aria-hidden')==='true':getComputedStyle(left).display==='none'||left.getAttribute('aria-hidden')==='true'),
      dragFinished:!document.body.classList.contains('workspace-reordering'),
      previewCleared:!document.querySelector('#rightDock').hasAttribute('data-dock-drop-position')&&!document.querySelector('#rightDock').hasAttribute('data-dock-drop-label')
    };
  });

  assert.equal(grouped.mode,'tabbed','the browser-native drop creates the expected panel group');
  assert.equal(grouped.side,'right','the group occupies the target dock track');
  assert.equal(grouped.active,'left','the dragged panel becomes the active group tab');
  assert.match(grouped.previewLabel,/Oldalak és eszközök panel.*panelfülei közé került.*vászon fedetlen/iu,'the native drag announces its grouping result');
  assert.ok(grouped.canvasWidth>=400&&grouped.groupLeft>=grouped.canvasRight,`the active panel has a separate track beyond the entire canvas rectangle: ${JSON.stringify(grouped)}`);
  assert.equal(grouped.inactiveHidden,true,'the inactive grouped dock is removed from visual and keyboard navigation');
  assert.equal(grouped.dragFinished,true,'the native drag lifecycle is cleaned up after drop');
  assert.equal(grouped.previewCleared,true,'the transient drop cue does not remain after a native drop');
  assert.deepEqual(writes,[],'native dock rearrangement never invokes Page Model Save or Publish');
  assert.deepEqual(errors,[]);
});

test('native mouse drag reorders a dock past the canvas edge and persists one undoable workspace change',async t=>{
  const {page,writes,errors}=await openEditor(t,{width:1280,height:900});
  await openPreferences(page);
  await page.locator('#workspaceLayout').selectOption('balanced');
  await page.locator('#workspacePanelMode').selectOption('separate');
  await page.waitForFunction(()=>!document.querySelector('#leftDock')?.classList.contains('closed')&&!document.querySelector('#rightDock')?.classList.contains('closed'));
  await page.locator('#closeWorkspaceAppearance').click();

  const canvas=page.locator('.canvas-area');
  const canvasBounds=await canvas.boundingBox();
  const activePanelBefore=await page.locator('.workspace').getAttribute('data-workspace-active-panel');
  assert.ok(canvasBounds&&canvasBounds.width>=400,'the canvas offers a wide desktop edge drop region');
  await page.locator('#leftDock .dock-heading:visible').first().dragTo(canvas,{targetPosition:{x:canvasBounds.width-4,y:Math.min(30,canvasBounds.height/2)}});

  const reordered=await page.evaluate(()=>{
    const workspace=document.querySelector('.workspace'),canvas=document.querySelector('.canvas-area');
    const rect=canvas.getBoundingClientRect(),left=document.querySelector('#leftDock').getBoundingClientRect(),right=document.querySelector('#rightDock').getBoundingClientRect();
    const saved=JSON.parse(localStorage.getItem('sanci-editor-workspace-preferences-v2'));
    return {
      order:workspace.dataset.workspaceDockOrder,
      savedOrder:saved?.dockOrder,
      active:workspace.dataset.workspaceActivePanel,
      canvasRight:rect.right,
      leftDockLeft:left.left,
      rightDockLeft:right.left,
      canvasWidth:rect.width,
      previewCleared:!document.querySelector('.canvas-area').hasAttribute('data-dock-drop-position')&&!document.querySelector('.canvas-area').hasAttribute('data-dock-drop-label'),
      dragFinished:!document.body.classList.contains('workspace-reordering'),
      announcement:document.querySelector('#workspaceDockStatus').textContent
    };
  });

  assert.equal(reordered.order,'canvas-left-right','the native mouse drop selects the requested after-canvas layout');
  assert.equal(reordered.savedOrder,reordered.order,'the dock order persists in the local allowlisted workspace preferences');
  assert.equal(reordered.active,activePanelBefore,'reordering a dock preserves the active workspace panel instead of changing the user selection');
  assert.ok(reordered.canvasWidth>=400&&reordered.leftDockLeft>=reordered.canvasRight&&reordered.rightDockLeft>reordered.leftDockLeft,`the rearranged regions remain distinct and canvas-safe: ${JSON.stringify(reordered)}`);
  assert.equal(reordered.previewCleared,true,'the transient canvas edge cue is removed after the real drop');
  assert.equal(reordered.dragFinished,true,'the native drag lifecycle ends cleanly');
  assert.match(reordered.announcement,/Oldalak és eszközök panel.*Vászon.*után.*Sorrend:/iu,'the resulting zone and order are announced');

  await openPreferences(page);
  assert.equal(await page.locator('#undoWorkspaceLayout').isEnabled(),true,'the actual mouse reorder creates one workspace Undo entry');
  await page.locator('#undoWorkspaceLayout').click();
  assert.equal(await page.locator('.workspace').getAttribute('data-workspace-dock-order'),'left-canvas-right');
  assert.equal(await page.locator('#redoWorkspaceLayout').isEnabled(),true);
  await page.locator('#redoWorkspaceLayout').click();
  assert.equal(await page.locator('.workspace').getAttribute('data-workspace-dock-order'),'canvas-left-right');
  await page.locator('#closeWorkspaceAppearance').click();
  await page.reload({waitUntil:'load'});
  await page.waitForFunction(()=>document.documentElement.dataset.editorBoot==='ready');
  assert.equal(await page.locator('.workspace').getAttribute('data-workspace-dock-order'),'canvas-left-right','the native drop layout survives a complete editor reload');
  assert.ok(await page.locator('.canvas-area').evaluate(element=>element.getBoundingClientRect().width>=400));
  assert.deepEqual(writes,[],'native dock reordering changes only local workspace preferences and never saves or publishes page data');
  assert.deepEqual(errors,[]);
});

test('native mouse canvas-edge zones move both docks across all six layouts at three desktop widths without covering the canvas',async t=>{
  const {page,writes,errors}=await openEditor(t,{width:1025,height:900});
  await openPreferences(page);
  await page.locator('#workspaceLayout').selectOption('balanced');
  await page.locator('#workspacePanelMode').selectOption('separate');
  await page.evaluate(()=>{
    document.documentElement.style.setProperty('--left-dock-width','460px');
    document.documentElement.style.setProperty('--right-dock-width','440px');
  });
  const orderings=['left-canvas-right','canvas-left-right','left-right-canvas','right-left-canvas','right-canvas-left','canvas-right-left'];
  const viewportWidths=[1025,1280,1920];
  const results=[];

  for(const viewportWidth of viewportWidths){
    if(viewportWidth!==1025)await page.setViewportSize({width:viewportWidth,height:900});
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),viewportWidth,`${viewportWidth}px desktop layout does not overflow before drag`);
    for(const order of orderings){
      for(const sourceId of ['left','right']){
        await page.locator('#workspaceDockOrder').selectOption(order);
        await page.locator('#workspacePanelMode').selectOption('separate');
        await page.locator('#closeWorkspaceAppearance').click();
        const canvas=page.locator('.canvas-area');
        const canvasBounds=await canvas.boundingBox();
        assert.ok(canvasBounds&&canvasBounds.width>=400,`${viewportWidth}px ${order} starts with a usable canvas`);
        const sourceBeforeCanvas=order.split('-').indexOf(sourceId)<order.split('-').indexOf('canvas');
        const dropBeforeCanvas=!sourceBeforeCanvas;
        const source=page.locator(`#${sourceId}Dock .dock-heading:visible`).first();
        await source.dragTo(canvas,{targetPosition:{x:dropBeforeCanvas?4:canvasBounds.width-4,y:Math.min(30,canvasBounds.height/2)}});

        const expected=order.split('-');
        expected.splice(expected.indexOf(sourceId),1);
        const canvasIndex=expected.indexOf('canvas');
        expected.splice(canvasIndex+(dropBeforeCanvas?0:1),0,sourceId);
        const expectedOrder=expected.join('-');
        const moved=await page.evaluate(()=>{
          const workspace=document.querySelector('.workspace'),canvas=document.querySelector('.canvas-area');
          const canvasRect=canvas.getBoundingClientRect();
          const dockRects=['#leftDock','#rightDock'].map(selector=>document.querySelector(selector).getBoundingClientRect());
          return {
            order:workspace.dataset.workspaceDockOrder,
            savedOrder:JSON.parse(localStorage.getItem('sanci-editor-workspace-preferences-v2'))?.dockOrder,
            canvasWidth:canvasRect.width,
            canvasLeft:canvasRect.left,
            canvasRight:canvasRect.right,
            pageWidth:document.documentElement.scrollWidth,
            dockRects:dockRects.map(rect=>({left:rect.left,right:rect.right,width:rect.width})),
            previewCleared:!canvas.hasAttribute('data-dock-drop-position')&&!canvas.hasAttribute('data-dock-drop-label'),
            dragFinished:!document.body.classList.contains('workspace-reordering')
          };
        });
        assert.equal(moved.order,expectedOrder,`${viewportWidth}px ${sourceId} crosses the physical canvas edge from ${order}`);
        assert.equal(moved.savedOrder,expectedOrder,'each actual mouse drop persists the allowlisted workspace order');
        assert.ok(moved.canvasWidth>=400,`${viewportWidth}px ${expectedOrder} reserves at least 400px: ${JSON.stringify(moved)}`);
        assert.equal(moved.pageWidth,viewportWidth,`${viewportWidth}px reordered workspace has no horizontal overflow`);
        assert.ok(moved.dockRects.every(rect=>rect.width>0&&(rect.right<=moved.canvasLeft||rect.left>=moved.canvasRight)),`neither dock overlaps the canvas: ${JSON.stringify(moved)}`);
        assert.equal(moved.previewCleared,true);
        assert.equal(moved.dragFinished,true);

        await openPreferences(page);
        assert.equal(await page.locator('#undoWorkspaceLayout').isEnabled(),true,'a native edge drop creates workspace history');
        await page.locator('#undoWorkspaceLayout').click();
        assert.equal(await page.locator('.workspace').getAttribute('data-workspace-dock-order'),order,'Undo restores the exact starting layout');
        await page.locator('#redoWorkspaceLayout').click();
        assert.equal(await page.locator('.workspace').getAttribute('data-workspace-dock-order'),expectedOrder,'Redo reapplies the physical edge drop');
        results.push({viewportWidth,startingOrder:order,sourceId,edge:dropBeforeCanvas?'before':'after',resultOrder:expectedOrder,canvasWidth:Math.round(moved.canvasWidth)});
      }
    }
  }

  t.diagnostic(JSON.stringify({nativeMouseDrops:results.length,viewportWidths,minimumCanvas:Math.min(...results.map(item=>item.canvasWidth)),results}));
  assert.equal(results.length,36);
  assert.deepEqual(writes,[],'dock placement and its workspace history never call Page Model Save or Publish');
  assert.deepEqual(errors,[]);
});

test('native mouse drag from the canvas toolbar repositions the canvas without covering its editing area',async t=>{
  const {page,writes,errors}=await openEditor(t,{width:1280,height:900});
  await openPreferences(page);
  await page.locator('#workspaceLayout').selectOption('balanced');
  await page.locator('#workspacePanelMode').selectOption('separate');
  await page.waitForFunction(()=>!document.querySelector('#leftDock')?.classList.contains('closed')&&!document.querySelector('#rightDock')?.classList.contains('closed'));
  await page.locator('#closeWorkspaceAppearance').click();

  const cases=[
    {start:'left-canvas-right',target:'left',before:true,expected:'canvas-left-right'},
    {start:'left-canvas-right',target:'right',before:false,expected:'left-right-canvas'},
    {start:'canvas-left-right',target:'right',before:true,expected:'left-canvas-right'},
    {start:'canvas-left-right',target:'left',before:false,expected:'left-canvas-right'},
    {start:'left-right-canvas',target:'right',before:true,expected:'left-canvas-right'},
    {start:'right-left-canvas',target:'left',before:true,expected:'right-canvas-left'},
    {start:'right-canvas-left',target:'right',before:true,expected:'canvas-right-left'},
    {start:'canvas-right-left',target:'left',before:false,expected:'right-left-canvas'}
  ];

  for(const item of cases){
    await openPreferences(page);
    await page.locator('#workspaceDockOrder').selectOption(item.start);
    await page.locator('#closeWorkspaceAppearance').click();
    const source=page.locator('.canvas-toolbar');
    const target=page.locator(`#${item.target}Dock`);
    const sourceBounds=await source.boundingBox(),targetBounds=await target.boundingBox();
    assert.ok(sourceBounds&&targetBounds,`${item.start}: the toolbar and target dock are visible`);
    // The toolbar's right edge is its plain-text device-size label rather than
    // an interactive button, so this is a real, discoverable drag-handle path.
    await source.dragTo(target,{
      sourcePosition:{x:sourceBounds.width-3,y:sourceBounds.height/2},
      targetPosition:{x:item.before?4:targetBounds.width-4,y:Math.min(30,targetBounds.height/2)}
    });
    const moved=await page.evaluate(()=>{
      const workspace=document.querySelector('.workspace'),canvasArea=document.querySelector('.canvas-area'),canvas=document.querySelector('#canvas');
      const rect=canvasArea.getBoundingClientRect(),canvasRect=canvas.getBoundingClientRect();
      return {
        order:workspace.dataset.workspaceDockOrder,
        savedOrder:JSON.parse(localStorage.getItem('sanci-editor-workspace-preferences-v2'))?.dockOrder,
        width:rect.width,
        contentWidth:canvasRect.width,
        leftDock:document.querySelector('#leftDock').getBoundingClientRect().toJSON(),
        rightDock:document.querySelector('#rightDock').getBoundingClientRect().toJSON(),
        canvasArea:{left:rect.left,right:rect.right},
        documentWidth:document.documentElement.scrollWidth,
        previewCleared:!document.querySelector('.workspace [data-dock-drop-position]')&&!document.querySelector('.workspace [data-dock-drop-label]'),
        dragFinished:!document.body.classList.contains('workspace-reordering'),
        announcement:document.querySelector('#workspaceDockStatus').textContent
      };
    });
    assert.equal(moved.order,item.expected,`${item.start}: the canvas toolbar moves before/after ${item.target}: ${JSON.stringify(moved)}`);
    assert.equal(moved.savedOrder,item.expected,'the canvas move stores one allowlisted local workspace order');
    assert.ok(moved.width>=400&&moved.contentWidth>0,`${item.expected}: the editing canvas retains its own visible grid track`);
    assert.ok([moved.leftDock,moved.rightDock].every(dock=>dock.width>0&&(dock.right<=moved.canvasArea.left+0.5||dock.left>=moved.canvasArea.right-0.5)),`${item.expected}: neither desktop panel covers the canvas track: ${JSON.stringify(moved)}`);
    assert.equal(moved.documentWidth,1280,`${item.expected}: dock placement does not create horizontal page overflow`);
    assert.equal(moved.previewCleared,true,'the native drop removes the temporary drop-zone cue');
    assert.equal(moved.dragFinished,true,'the native drag lifecycle returns to its idle state');
    assert.match(moved.announcement,/Vászon panel.*(?:Oldalak és eszközök|Beállítások).*Sorrend:/iu,'the live region explains the resulting canvas order');
  }

  await openPreferences(page);
  assert.equal(await page.locator('#undoWorkspaceLayout').isEnabled(),true,'canvas moves share the workspace-only history');
  await page.locator('#undoWorkspaceLayout').click();
  assert.equal(await page.locator('.workspace').getAttribute('data-workspace-dock-order'),'canvas-right-left');
  await page.locator('#redoWorkspaceLayout').click();
  assert.equal(await page.locator('.workspace').getAttribute('data-workspace-dock-order'),'right-left-canvas');
  await page.locator('#closeWorkspaceAppearance').click();
  await page.reload({waitUntil:'load'});
  await page.waitForFunction(()=>document.documentElement.dataset.editorBoot==='ready');
  assert.equal(await page.locator('.workspace').getAttribute('data-workspace-dock-order'),'right-left-canvas','the canvas placement survives a complete editor reload');
  assert.ok(await page.locator('.canvas-area').evaluate(element=>element.getBoundingClientRect().width>=400));
  assert.deepEqual(writes,[],'canvas rearrangement changes only local workspace presentation, never page Save or Publish');
  assert.deepEqual(errors,[]);
});

test('native canvas drag moves the whole tabbed dock group without splitting its saved panel order',async t=>{
  const {page,writes,errors}=await openEditor(t,{width:1280,height:900});
  const cases=[
    {side:'left',order:'left-canvas-right',sourceSide:'left',before:true,expected:'canvas-left-right'},
    {side:'left',order:'left-canvas-right',sourceSide:'left',before:false,expected:'left-right-canvas'},
    {side:'right',order:'right-canvas-left',sourceSide:'right',before:true,expected:'canvas-right-left'},
    {side:'right',order:'right-canvas-left',sourceSide:'right',before:false,expected:'right-left-canvas'}
  ];
  for(const item of cases){
    await openPreferences(page);
    await page.locator('#workspaceLayout').selectOption('balanced');
    await page.locator('#workspaceDockOrder').selectOption(item.order);
    await page.locator('#workspacePanelMode').selectOption('tabbed');
    await page.locator('#workspacePanelSide').selectOption(item.side);
    await page.waitForFunction(side=>document.querySelector('.editor-app')?.dataset.workspacePanelSide===side&&document.querySelector('.editor-app')?.dataset.workspacePanelMode==='tabbed',item.side);
    await page.locator('#closeWorkspaceAppearance').click();
    await page.locator(`#workspacePanelTab${item.sourceSide==='left'?'Left':'Right'}`).click();
    await page.waitForFunction(side=>document.querySelector('.workspace')?.dataset.workspaceActivePanel===side,item.sourceSide);
    const source=page.locator('.canvas-toolbar'),target=page.locator(`#${item.sourceSide}Dock`);
    const sourceBounds=await source.boundingBox(),targetBounds=await target.boundingBox();
    assert.ok(sourceBounds&&targetBounds,`${item.side}: canvas toolbar and visible group panel are available as drag source and target`);
    await source.dragTo(target,{sourcePosition:{x:sourceBounds.width-3,y:sourceBounds.height/2},targetPosition:{x:item.before?4:targetBounds.width-4,y:Math.min(30,targetBounds.height/2)}});
    const result=await page.evaluate(()=>{
      const workspace=document.querySelector('.workspace'),canvas=document.querySelector('.canvas-area');
      const canvasRect=canvas.getBoundingClientRect();
      return {
        order:workspace.dataset.workspaceDockOrder,
        mode:document.querySelector('.editor-app').dataset.workspacePanelMode,
        side:document.querySelector('.editor-app').dataset.workspacePanelSide,
        canvasWidth:canvasRect.width,
        left:document.querySelector('#leftDock').getBoundingClientRect().toJSON(),
        right:document.querySelector('#rightDock').getBoundingClientRect().toJSON(),
        canvasLeft:canvasRect.left,
        canvasRight:canvasRect.right,
        active:workspace.dataset.workspaceActivePanel,
        dragFinished:!document.body.classList.contains('workspace-reordering')
      };
    });
    assert.equal(result.order,item.expected,`${item.side} group ${item.before?'before':'after'} drop preserves its full saved panel order: ${JSON.stringify(result)}`);
    assert.equal(result.mode,'tabbed','moving the canvas keeps both docks grouped');
    assert.equal(result.side,item.side,'moving the canvas does not move the group to the other physical side');
    assert.ok(result.canvasWidth>=400,`the grouped panels still reserve at least 400px for the canvas: ${JSON.stringify(result)}`);
    assert.ok([result.left,result.right].every(dock=>dock.width===0||dock.right<=result.canvasLeft+0.5||dock.left>=result.canvasRight-0.5),'the dock group does not overlap the canvas');
    assert.equal(result.dragFinished,true,'the native drag lifecycle finishes cleanly');

    await openPreferences(page);
    assert.equal(await page.locator('#undoWorkspaceLayout').isEnabled(),true,'canvas/group reordering has one workspace-only Undo step');
    await page.locator('#undoWorkspaceLayout').click();
    assert.equal(await page.locator('#workspaceDockOrder').inputValue(),item.order,'Undo restores the original complete three-region order');
    assert.equal(await page.locator('#workspacePanelMode').inputValue(),'tabbed','Undo keeps the dock group together');
    await page.locator('#redoWorkspaceLayout').click();
    assert.equal(await page.locator('#workspaceDockOrder').inputValue(),item.expected,'Redo reapplies the complete group/canvas order');
    await page.locator('#closeWorkspaceAppearance').click();
    await page.reload({waitUntil:'load'});
    await page.waitForFunction(expected=>document.querySelector('.workspace')?.dataset.workspaceDockOrder===expected&&document.querySelector('.editor-app')?.dataset.workspacePanelMode==='tabbed',item.expected);
    const restored=await page.evaluate(()=>{
      const canvas=document.querySelector('.canvas-area').getBoundingClientRect();
      return {canvasWidth:canvas.width,canvasLeft:canvas.left,canvasRight:canvas.right,left:document.querySelector('#leftDock').getBoundingClientRect().toJSON(),right:document.querySelector('#rightDock').getBoundingClientRect().toJSON()};
    });
    assert.ok(restored.canvasWidth>=400,`the reloaded workspace keeps at least 400px for the canvas: ${JSON.stringify(restored)}`);
    assert.ok([restored.left,restored.right].every(dock=>dock.width===0||dock.right<=restored.canvasLeft+0.5||dock.left>=restored.canvasRight-0.5),'reloaded group docks stay outside the canvas');
  }
  assert.deepEqual(writes,[],'reordering the canvas beside a tab group never writes page data');
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
  assert.match(result.announcement,/fülei közé került.*vászon bal oldalán marad.*vászon fedetlen/iu);
  assert.equal(result.stalePreview,false);
  assert.equal(result.dragActive,false);
  assert.deepEqual(writes,[],'the reverse grouping direction never writes Page Model, Save, or Publish');
  assert.deepEqual(errors,[]);
});

test('grouping on a reordered dock follows the target physical side of the canvas',async t=>{
  const {page,writes,errors}=await openEditor(t,{width:1280,height:900});
  await openPreferences(page);
  await page.locator('#workspaceLayout').selectOption('balanced');
  await page.locator('#workspacePanelMode').selectOption('separate');
  await page.locator('#workspaceDockOrder').selectOption('right-canvas-left');
  await page.waitForFunction(()=>!document.querySelector('#leftDock')?.classList.contains('closed')&&!document.querySelector('#rightDock')?.classList.contains('closed')&&document.querySelector('.workspace')?.dataset.workspaceDockOrder==='right-canvas-left');
  await page.locator('#closeWorkspaceAppearance').click();

  const result=await page.evaluate(()=>{
    const source=document.querySelector('#leftDock .dock-heading'),target=document.querySelector('#rightDock');
    const rect=target.getBoundingClientRect(),canvas=document.querySelector('.canvas-area'),dataTransfer=new DataTransfer();
    source.dispatchEvent(new DragEvent('dragstart',{bubbles:true,cancelable:true,dataTransfer}));
    target.dispatchEvent(new DragEvent('dragover',{bubbles:true,cancelable:true,dataTransfer,clientX:rect.left+rect.width/2}));
    const preview=target.dataset.dockDropPosition;
    target.dispatchEvent(new DragEvent('drop',{bubbles:true,cancelable:true,dataTransfer,clientX:rect.left+rect.width/2}));
    const group=source.closest('.left-dock,.right-dock').getBoundingClientRect(),canvasRect=canvas.getBoundingClientRect();
    return {preview,mode:document.querySelector('.editor-app').dataset.workspacePanelMode,side:document.querySelector('.editor-app').dataset.workspacePanelSide,groupLeft:group.left,canvasLeft:canvasRect.left,canvasWidth:canvasRect.width,order:document.querySelector('.workspace').dataset.workspaceDockOrder,announcement:document.querySelector('#workspaceDockStatus').textContent};
  });

  assert.equal(result.preview,'group','the target dock center previews grouping');
  assert.equal(result.mode,'tabbed');
  assert.equal(result.side,'left','the saved group side follows the target dock track, not the target panel id');
  assert.ok(result.groupLeft<result.canvasLeft,'the group stays where the dropped-on dock was physically located');
  assert.ok(result.canvasWidth>=400,'grouping in a reordered layout keeps at least 400px of uncovered canvas');
  assert.match(result.announcement,/vászon bal oldalán marad.*vászon fedetlen/iu,'the announcement names the physical target side');
  assert.equal(result.order,'right-canvas-left','grouping retains the user’s selected panel order');
  assert.deepEqual(writes,[],'dock grouping remains presentation-only');
  assert.deepEqual(errors,[]);
});

test('center dock zones preserve the canvas at maximum widths across all desktop orders and drag directions',async t=>{
  const {page,writes,errors}=await openEditor(t,{width:1025,height:900});
  await page.evaluate(()=>{
    const key='sanci-editor-shell-v2';
    const saved=JSON.parse(localStorage.getItem(key)||'{}');
    localStorage.setItem(key,JSON.stringify({...saved,leftWidth:460,rightWidth:440}));
  });
  await page.reload({waitUntil:'load'});
  await page.waitForFunction(()=>document.documentElement.dataset.editorBoot==='ready');
  await openPreferences(page);
  await page.locator('#workspaceLayout').selectOption('balanced');
  await page.locator('#workspacePanelMode').selectOption('separate');
  assert.equal(await page.locator('.editor-app').evaluate(element=>getComputedStyle(element).getPropertyValue('--left-dock-width').trim()),'460px');
  assert.equal(await page.locator('.editor-app').evaluate(element=>getComputedStyle(element).getPropertyValue('--right-dock-width').trim()),'440px');
  await page.waitForFunction(()=>!document.querySelector('#leftDock')?.classList.contains('closed')&&!document.querySelector('#rightDock')?.classList.contains('closed'));
  await page.locator('#closeWorkspaceAppearance').click();

  const orders=['left-canvas-right','canvas-left-right','left-right-canvas','right-left-canvas','right-canvas-left','canvas-right-left'];
  const results=[];
  for(const order of orders){
    for(const [sourceId,targetId] of [['left','right'],['right','left']]){
      await openPreferences(page);
      await page.locator('#workspacePanelMode').selectOption('separate');
      await page.locator('#workspaceDockOrder').selectOption(order);
      await page.waitForFunction(expected=>{
        const workspace=document.querySelector('.workspace');
        return workspace?.dataset.workspacePanelMode==='separate'&&workspace?.dataset.workspaceDockOrder===expected&&
          !document.querySelector('#leftDock')?.classList.contains('closed')&&
          !document.querySelector('#rightDock')?.classList.contains('closed');
      },order);
      await page.locator('#closeWorkspaceAppearance').click();
      await page.waitForFunction(()=>document.querySelector('.workspace')?.dataset.workspacePanelMode==='separate');

      const result=await page.evaluate(({sourceId,targetId})=>{
        const source=document.querySelector(`#${sourceId}Dock .dock-heading`);
        const target=document.querySelector(`#${targetId}Dock`);
        const workspace=document.querySelector('.workspace');
        const canvas=document.querySelector('.canvas-area');
        const modeBefore=workspace.dataset.workspacePanelMode;
        const activeBefore=workspace.dataset.workspaceActivePanel;
        const targetRect=target.getBoundingClientRect();
        const canvasRect=canvas.getBoundingClientRect();
        const point=targetRect.left+targetRect.width/2;
        const targetSide=targetRect.right<=canvasRect.left+0.5?'left':targetRect.left>=canvasRect.right-0.5?'right':'overlap';
        const dataTransfer=new DataTransfer();
        source.dispatchEvent(new DragEvent('dragstart',{bubbles:true,cancelable:true,dataTransfer}));
        target.dispatchEvent(new DragEvent('dragover',{bubbles:true,cancelable:true,dataTransfer,clientX:point}));
        const preview=target.dataset.dockDropPosition;
        const previewLabel=target.dataset.dockDropLabel;
        target.dispatchEvent(new DragEvent('drop',{bubbles:true,cancelable:true,dataTransfer,clientX:point}));
        const group=document.querySelector(`#${sourceId}Dock`).getBoundingClientRect();
        const afterCanvas=canvas.getBoundingClientRect();
        return {
          preview,previewLabel,targetSide,
          modeBefore,activeBefore,mode:document.querySelector('.editor-app').dataset.workspacePanelMode,
          side:document.querySelector('.editor-app').dataset.workspacePanelSide,
          order:workspace.dataset.workspaceDockOrder,
          active:workspace.dataset.workspaceActivePanel,
          groupLeft:group.left,groupRight:group.right,
          canvasLeft:afterCanvas.left,canvasRight:afterCanvas.right,canvasWidth:afterCanvas.width,
          announcement:document.querySelector('#workspaceDockStatus').textContent,
          stalePreview:target.hasAttribute('data-dock-drop-position')||target.hasAttribute('data-dock-drop-label'),
          dragActive:document.body.classList.contains('workspace-reordering')
        };
      },{sourceId,targetId});
      assert.equal(result.preview,'group',`${order}: ${sourceId} → ${targetId} previews its center grouping zone`);
      assert.equal(result.previewLabel,'Panelcsoport',`${order}: the preview explains grouping before the drop`);
      assert.notEqual(result.targetSide,'overlap',`${order}: the target has its own reserved grid track`);
      assert.equal(result.mode,'tabbed',`${order}: the center drop creates a tab group`);
      assert.equal(result.side,result.targetSide,`${order}: the group follows the target's physical canvas side`);
      assert.equal(result.active,sourceId,`${order}: the moved panel becomes active: ${JSON.stringify(result)}`);
      assert.ok(result.canvasWidth>=400,`${order}: the group keeps at least 400 CSS px of uncovered canvas`);
      assert.ok(result.side==='left'?result.groupRight<=result.canvasLeft+0.5:result.groupLeft>=result.canvasRight-0.5,`${order}: the group itself remains outside the canvas`);
      assert.match(result.announcement,new RegExp(`vászon ${result.side==='left'?'bal':'jobb'} oldalán marad.*vászon fedetlen`,'iu'),`${order}: assistive feedback matches the physical side`);
      assert.equal(result.stalePreview,false,`${order}: the temporary zone preview clears after grouping`);
      assert.equal(result.dragActive,false,`${order}: grouping ends the drag lifecycle`);
      await page.locator(`#workspacePanelTab${targetId==='left'?'Left':'Right'}`).click();
      const otherTab=await page.evaluate(()=>{
        const workspace=document.querySelector('.workspace');
        const group=document.querySelector(`#${workspace.dataset.workspaceActivePanel}Dock`);
        const canvas=document.querySelector('.canvas-area');
        const groupRect=group.getBoundingClientRect(),canvasRect=canvas.getBoundingClientRect();
        return {active:workspace.dataset.workspaceActivePanel,side:document.querySelector('.editor-app').dataset.workspacePanelSide,groupLeft:groupRect.left,groupRight:groupRect.right,canvasLeft:canvasRect.left,canvasRight:canvasRect.right,canvasWidth:canvasRect.width,scrollWidth:document.documentElement.scrollWidth};
      });
      assert.equal(otherTab.active,targetId,`${order}: the other panel is keyboard/pointer selectable after grouping`);
      assert.equal(otherTab.side,result.targetSide,`${order}: switching group tabs does not move the group to the panel's ID side`);
      assert.ok(otherTab.canvasWidth>=400,`${order}: maximum saved panel width still leaves a usable canvas after tab switching: ${JSON.stringify(otherTab)}`);
      assert.ok(otherTab.side==='left'?otherTab.groupRight<=otherTab.canvasLeft+0.5:otherTab.groupLeft>=otherTab.canvasRight-0.5,`${order}: the switched panel remains in its reserved physical track`);
      assert.equal(otherTab.scrollWidth,1025,`${order}: the maximum-width group does not create horizontal page overflow`);
      results.push({order,sourceId,targetId,side:result.side,canvasWidth:Math.round(result.canvasWidth),otherTabCanvasWidth:Math.round(otherTab.canvasWidth)});
    }
  }
  assert.equal(results.length,12,'both source/target directions are checked for every supported order');
  assert.deepEqual(writes,[],'dynamic dock targeting remains workspace-only and never saves or publishes the page');
  assert.deepEqual(errors,[]);
  t.diagnostic(JSON.stringify(results));
});

test('live dock-zone previews match applied actions outside, on and inside the group-zone boundaries',async t=>{
  const {page,writes,errors}=await openEditor(t,{width:1280,height:900});
  await openPreferences(page);
  await page.locator('#workspaceLayout').selectOption('balanced');
  await page.locator('#workspacePanelMode').selectOption('separate');
  await page.locator('#workspaceDockOrder').selectOption('left-canvas-right');
  await page.waitForFunction(()=>!document.querySelector('#leftDock')?.classList.contains('closed')&&!document.querySelector('#rightDock')?.classList.contains('closed'));
  await page.locator('#closeWorkspaceAppearance').click();

  const cases=[
    {ratio:0.34,position:'before',label:'Elé helyezés',order:'canvas-left-right',mode:'separate'},
    {ratio:0.35,position:'group',label:'Panelcsoport',order:'left-canvas-right',mode:'tabbed'},
    {ratio:0.50,position:'group',label:'Panelcsoport',order:'left-canvas-right',mode:'tabbed'},
    {ratio:0.65,position:'group',label:'Panelcsoport',order:'left-canvas-right',mode:'tabbed'},
    {ratio:0.66,position:'after',label:'Utána helyezés',order:'canvas-right-left',mode:'separate'}
  ];
  const results=[];
  for(const item of cases){
    await openPreferences(page);
    await page.locator('#workspacePanelMode').selectOption('separate');
    await page.locator('#workspaceDockOrder').selectOption('left-canvas-right');
    await page.waitForFunction(()=>document.querySelector('.workspace')?.dataset.workspacePanelMode==='separate'&&document.querySelector('.workspace')?.dataset.workspaceDockOrder==='left-canvas-right');
    await page.locator('#closeWorkspaceAppearance').click();
    const state=await page.evaluate(({ratio})=>{
      const source=document.querySelector('#leftDock .dock-heading');
      const target=document.querySelector('#rightDock');
      const canvas=document.querySelector('.canvas-area');
      const rect=target.getBoundingClientRect();
      const dataTransfer=new DataTransfer();
      const clientX=rect.left+rect.width*ratio;
      source.dispatchEvent(new DragEvent('dragstart',{bubbles:true,cancelable:true,dataTransfer}));
      const dragOver=new DragEvent('dragover',{bubbles:true,cancelable:true,dataTransfer,clientX});
      target.dispatchEvent(dragOver);
      const preview={position:target.dataset.dockDropPosition,label:target.dataset.dockDropLabel,announcement:document.querySelector('#workspaceDockStatus').textContent,canvasWidth:canvas.getBoundingClientRect().width,actualRatio:(dragOver.clientX-rect.left)/rect.width,requestedRatio:ratio};
      target.dispatchEvent(new DragEvent('drop',{bubbles:true,cancelable:true,dataTransfer,clientX}));
      const canvasRect=canvas.getBoundingClientRect();
      const docks=['#leftDock','#rightDock'].map(selector=>document.querySelector(selector).getBoundingClientRect());
      return {preview,order:document.querySelector('.workspace').dataset.workspaceDockOrder,mode:document.querySelector('.editor-app').dataset.workspacePanelMode,canvasWidth:canvasRect.width,canvasLeft:canvasRect.left,canvasRight:canvasRect.right,pageWidth:document.documentElement.scrollWidth,docks:docks.map(dock=>({left:dock.left,right:dock.right,width:dock.width})),cleared:!target.hasAttribute('data-dock-drop-position')&&!target.hasAttribute('data-dock-drop-label'),dragEnded:!document.body.classList.contains('workspace-reordering')};
    },item);
    assert.equal(state.preview.position,item.position,`${item.ratio}: preview uses the expected inclusive center-zone boundary: ${JSON.stringify(state.preview)}`);
    assert.equal(state.preview.label,item.label,`${item.ratio}: the preview explains the action before the drop`);
    assert.match(state.preview.announcement,new RegExp(`Cél: ${item.label} – Beállítások\\.`,'u'),`${item.ratio}: assistive status describes the exact visible target action`);
    assert.equal(state.order,item.order,`${item.ratio}: dropping applies the action announced by the zone`);
    assert.equal(state.mode,item.mode,`${item.ratio}: grouping is selected only inside its dynamic center zone`);
    assert.ok(state.canvasWidth>=400,`${item.ratio}: the canvas keeps its minimum usable width`);
    assert.equal(state.pageWidth,1280,`${item.ratio}: the dock operation does not introduce horizontal overflow`);
    assert.ok(state.docks.every(dock=>dock.width===0||dock.right<=state.canvasLeft+0.5||dock.left>=state.canvasRight-0.5),`${item.ratio}: dock zones keep panels outside the canvas`);
    assert.equal(state.cleared,true,`${item.ratio}: the temporary preview clears after the drop`);
    assert.equal(state.dragEnded,true,`${item.ratio}: the drag lifecycle is closed after the drop`);
    results.push({ratio:item.ratio,position:state.preview.position,order:state.order,mode:state.mode,canvasWidth:Math.round(state.canvasWidth)});
  }
  assert.deepEqual(writes,[],'dynamic dock zones only change workspace state and never save or publish page data');
  assert.deepEqual(errors,[]);
  t.diagnostic(JSON.stringify(results));
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

test('ungrouping either tabbed dock follows both canvas edges for all saved dock orders and group sides',async t=>{
  const {page,writes,errors}=await openEditor(t,{width:1440,height:900});
  const orders=['left-canvas-right','canvas-left-right','left-right-canvas','right-left-canvas','right-canvas-left','canvas-right-left'];

  await openPreferences(page);
  await page.locator('#workspaceLayout').selectOption('balanced');
  await page.locator('#workspacePanelMode').selectOption('tabbed');
  await page.locator('#closeWorkspaceAppearance').click();

  for(const order of orders){
    await openPreferences(page);
    await page.locator('#workspaceDockOrder').selectOption(order);
    await page.locator('#closeWorkspaceAppearance').click();

    for(const groupSide of ['left','right']){
      await openPreferences(page);
      await page.locator('#workspacePanelSide').selectOption(groupSide);
      await page.locator('#closeWorkspaceAppearance').click();

      for(const sourceId of ['left','right']){
        await page.locator(`#workspacePanelTab${sourceId==='left'?'Left':'Right'}`).click();
        assert.equal(await page.locator('.workspace').getAttribute('data-workspace-active-panel'),sourceId,`${order}/${groupSide}/${sourceId}: the source panel is active before dragging`);
        for(const edge of ['before','after']){
          const expected=order.split('-');
          expected.splice(expected.indexOf(sourceId),1);
          expected.splice(expected.indexOf('canvas')+(edge==='before'?0:1),0,sourceId);
          const result=await page.evaluate(({sourceId,edge})=>{
            const source=document.querySelector(`#${sourceId}Dock .dock-heading`);
            const target=document.querySelector('.canvas-area');
            const rect=target.getBoundingClientRect();
            const dataTransfer=new DataTransfer();
            source.dispatchEvent(new DragEvent('dragstart',{bubbles:true,cancelable:true,dataTransfer}));
            const clientX=rect.left+(edge==='before'?4:rect.width-4);
            target.dispatchEvent(new DragEvent('dragover',{bubbles:true,cancelable:true,dataTransfer,clientX}));
            const preview=target.dataset.dockDropPosition;
            target.dispatchEvent(new DragEvent('drop',{bubbles:true,cancelable:true,dataTransfer,clientX}));
            const canvas=target.getBoundingClientRect();
            const left=document.querySelector('#leftDock').getBoundingClientRect();
            const right=document.querySelector('#rightDock').getBoundingClientRect();
            return {
              preview,
              mode:document.querySelector('.editor-app').dataset.workspacePanelMode,
              side:document.querySelector('.editor-app').dataset.workspacePanelSide,
              order:document.querySelector('.workspace').dataset.workspaceDockOrder,
              active:document.querySelector('.workspace').dataset.workspaceActivePanel,
              canvasWidth:canvas.width,canvasLeft:canvas.left,canvasRight:canvas.right,
              left:left.toJSON(),right:right.toJSON(),
              saved:JSON.parse(localStorage.getItem('sanci-editor-workspace-preferences-v2')),
              dragActive:document.body.classList.contains('workspace-reordering')
            };
          },{sourceId,edge});

          assert.equal(result.preview,edge,`${order}/${groupSide}/${sourceId}/${edge}: the selected edge is previewed`);
          assert.equal(result.mode,'separate',`${order}/${groupSide}/${sourceId}/${edge}: the dock leaves its tab group`);
          assert.equal(result.side,groupSide,`${order}/${groupSide}/${sourceId}/${edge}: the remembered group side remains stable`);
          assert.equal(result.order,expected.join('-'),`${order}/${groupSide}/${sourceId}/${edge}: the dropped panel follows the physical canvas edge`);
          assert.equal(result.active,sourceId,`${order}/${groupSide}/${sourceId}/${edge}: the dragged panel stays selected`);
          assert.equal(result.saved.dockOrder,expected.join('-'));
          assert.equal(result.saved.panelMode,'separate');
          assert.ok(result.canvasWidth>=400,`${order}/${groupSide}/${sourceId}/${edge}: the canvas remains usable: ${JSON.stringify(result)}`);
          assert.ok([result.left,result.right].every(dock=>dock.width===0||dock.right<=result.canvasLeft+0.5||dock.left>=result.canvasRight-0.5),`${order}/${groupSide}/${sourceId}/${edge}: neither dock overlays the canvas`);
          assert.equal(result.dragActive,false,`${order}/${groupSide}/${sourceId}/${edge}: the drop closes its drag lifecycle`);

          await openPreferences(page);
          await page.locator('#undoWorkspaceLayout').click();
          assert.equal(await page.locator('#workspacePanelMode').inputValue(),'tabbed',`${order}/${groupSide}/${sourceId}/${edge}: one Undo restores the group`);
          assert.equal(await page.locator('#workspacePanelSide').inputValue(),groupSide);
          assert.equal(await page.locator('.workspace').getAttribute('data-workspace-active-panel'),sourceId,`${order}/${groupSide}/${sourceId}/${edge}: Undo restores the selected panel too`);
          assert.equal(await page.locator('#workspaceDockOrder').inputValue(),order);
          await page.locator('#closeWorkspaceAppearance').click();
        }
      }
    }
  }

  assert.deepEqual(writes,[],'all 48 drag, undo and restore paths remain workspace-only; Save and Publish are untouched');
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

test('dock drop inside a live panel search does not insert the internal drag payload into the field',async t=>{
  const {page,writes,errors}=await openEditor(t,{width:1366,height:900});
  const search=page.locator('#elementSearch');
  if(await page.locator('#leftDock').evaluate(panel=>panel.classList.contains('closed')))await page.locator('#editorMenu').click();
  const source=page.locator('#rightDock .dock-heading').first();
  if(await page.locator('#rightDock').evaluate(panel=>panel.classList.contains('closed')))await page.locator('#openInspector').click();
  await page.locator('#leftTabElements').click();
  await search.waitFor({state:'visible'});
  await source.waitFor({state:'visible'});
  await search.fill('Keresés maradjon változatlan');
  await source.dragTo(search,{targetPosition:{x:(await search.boundingBox()).width/2,y:12}});
  assert.equal(await search.inputValue(),'Keresés maradjon változatlan','the browser must not apply the default text drop after the workspace handler moves the dock');
  assert.equal(await page.locator('.editor-app').getAttribute('data-workspace-panel-mode'),'tabbed','the dock-zone action still groups the panel');
  assert.deepEqual(writes,[],'dock movement is not a Page Model Save or Publish');
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

test('keyboard dock resizing follows the active panel group track instead of the panel identity',async t=>{
  const {page,writes,errors}=await openEditor(t,{width:1280,height:900});
  await openPreferences(page);
  await page.locator('#workspaceLayout').selectOption('balanced');
  await page.locator('#workspacePanelMode').selectOption('tabbed');
  await page.locator('#workspacePanelSide').selectOption('right');
  await page.locator('#closeWorkspaceAppearance').click();
  await page.locator('#workspacePanelTabLeft').click();

  const left=page.locator('#leftDock .left-resizer');
  assert.equal(await left.getAttribute('aria-valuenow'),'310');
  await left.focus();
  await page.keyboard.press('ArrowLeft');
  assert.equal(await left.getAttribute('aria-valuenow'),'326','the left panel is on the right-side group track, so ArrowLeft must grow it into the canvas: '+JSON.stringify(await page.evaluate(()=>({focus:document.activeElement?.className,activePanel:document.querySelector('.workspace')?.dataset.workspaceActivePanel,side:document.querySelector('.editor-app')?.dataset.workspacePanelSide,leftHidden:document.querySelector('#leftDock')?.getAttribute('aria-hidden'),inert:document.querySelector('#leftDock')?.inert,leftOpen:document.querySelector('#leftDock')?.classList.contains('closed'),value:document.querySelector('.left-resizer')?.getAttribute('aria-valuenow')}))));
  let geometry=await page.evaluate(()=>{
    const panel=document.querySelector('#leftDock').getBoundingClientRect();
    const canvas=document.querySelector('.canvas-area').getBoundingClientRect();
    return {panelLeft:panel.left,panelRight:panel.right,canvasLeft:canvas.left,canvasRight:canvas.right,canvasWidth:canvas.width};
  });
  assert.ok(geometry.panelLeft>=geometry.canvasRight&&geometry.canvasWidth>=400,`the right-side group stays outside the canvas: ${JSON.stringify(geometry)}`);

  await openPreferences(page);
  await page.locator('#workspacePanelSide').selectOption('left');
  await page.locator('#closeWorkspaceAppearance').click();
  await page.locator('#workspacePanelTabRight').click();
  const right=page.locator('#rightDock .right-resizer');
  assert.equal(await right.getAttribute('aria-valuenow'),'352');
  await right.focus();
  await page.keyboard.press('ArrowRight');
  assert.equal(await right.getAttribute('aria-valuenow'),'368','the right panel is on the left-side group track, so ArrowRight must grow it into the canvas');
  geometry=await page.evaluate(()=>{
    const panel=document.querySelector('#rightDock').getBoundingClientRect();
    const canvas=document.querySelector('.canvas-area').getBoundingClientRect();
    return {panelLeft:panel.left,panelRight:panel.right,canvasLeft:canvas.left,canvasRight:canvas.right,canvasWidth:canvas.width};
  });
  assert.ok(geometry.panelRight<=geometry.canvasLeft&&geometry.canvasWidth>=400,`the left-side group stays outside the canvas: ${JSON.stringify(geometry)}`);
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('sanci-editor-shell-v2'))?.rightWidth),368,'the grouped resize persists in the shell width preference');
  await openPreferences(page);
  await page.locator('#undoWorkspaceLayout').click();
  assert.equal(await right.getAttribute('aria-valuenow'),'352','workspace Undo restores the grouped panel width');
  await page.locator('#redoWorkspaceLayout').click();
  assert.equal(await right.getAttribute('aria-valuenow'),'368','workspace Redo reapplies the grouped panel width');
  await page.locator('#closeWorkspaceAppearance').click();
  assert.deepEqual(writes,[],'resizing the tabbed workspace never Save or Publish page content');
  assert.deepEqual(errors,[]);
});

test('a narrow desktop tabbed group uses the width of its single physical track',async t=>{
  const {page,writes,errors}=await openEditor(t,{width:1025,height:900});
  await openPreferences(page);
  await page.locator('#workspaceLayout').selectOption('balanced');
  await page.locator('#workspacePanelMode').selectOption('tabbed');
  await page.locator('#workspacePanelSide').selectOption('right');
  await page.locator('#closeWorkspaceAppearance').click();
  await page.locator('#workspacePanelTabLeft').click();

  const left=page.locator('#leftDock .left-resizer');
  assert.equal(await left.getAttribute('aria-valuemax'),'460','the one right-side group track permits the configured left-panel maximum');
  await left.focus();
  await page.keyboard.press('ArrowLeft');
  assert.equal(await left.getAttribute('aria-valuenow'),'326','the active tabbed dock can grow beyond the two-track limit');
  let geometry=await page.evaluate(()=>{
    const panel=document.querySelector('#leftDock').getBoundingClientRect();
    const canvas=document.querySelector('.canvas-area').getBoundingClientRect();
    return {panelLeft:panel.left,panelRight:panel.right,canvasLeft:canvas.left,canvasRight:canvas.right,canvasWidth:canvas.width};
  });
  assert.ok(geometry.panelLeft>=geometry.canvasRight&&geometry.canvasWidth>=400,`the single right-side group still preserves the canvas floor: ${JSON.stringify(geometry)}`);

  await page.locator('#workspacePanelTabRight').click();
  const right=page.locator('#rightDock .right-resizer');
  assert.equal(await right.getAttribute('aria-valuemax'),'440','the same physical track permits the configured right-panel maximum');
  const rightHandle=await right.boundingBox();
  assert.ok(rightHandle,'the active right panel exposes its desktop resize handle');
  await page.mouse.move(rightHandle.x+rightHandle.width/2,rightHandle.y+rightHandle.height/2);
  await page.mouse.down();
  await page.mouse.move(rightHandle.x+rightHandle.width/2-24,rightHandle.y+rightHandle.height/2);
  await page.mouse.up();
  assert.equal(await right.getAttribute('aria-valuenow'),'376','pointer resizing uses the full single-track budget instead of the two-dock cap');
  geometry=await page.evaluate(()=>{
    const panel=document.querySelector('#rightDock').getBoundingClientRect();
    const canvas=document.querySelector('.canvas-area').getBoundingClientRect();
    return {panelLeft:panel.left,panelRight:panel.right,canvasLeft:canvas.left,canvasRight:canvas.right,canvasWidth:canvas.width};
  });
  assert.ok(geometry.panelLeft>=geometry.canvasRight&&geometry.canvasWidth>=400,`the resized right-side tab remains outside the canvas: ${JSON.stringify(geometry)}`);
  assert.deepEqual(writes,[],'tabbed dock resize bounds do not Save or Publish page content');
  assert.deepEqual(errors,[]);
});

test('keyboard dock resizing follows the physical track after separate docks are reordered',async t=>{
  const {page,writes,errors}=await openEditor(t,{width:1440,height:900});
  await openPreferences(page);
  await page.locator('#workspaceLayout').selectOption('balanced');
  await page.locator('#workspacePanelMode').selectOption('separate');
  await page.locator('#workspaceDockOrder').selectOption('left-right-canvas');
  await page.locator('#closeWorkspaceAppearance').click();

  const right=page.locator('#rightDock .right-resizer');
  assert.equal(await right.getAttribute('aria-valuenow'),'352');
  await right.focus();
  await page.keyboard.press('ArrowRight');
  assert.equal(await right.getAttribute('aria-valuenow'),'368','the right panel is before the canvas, so ArrowRight grows its left-side dock toward the canvas');
  let geometry=await page.evaluate(()=>{
    const panel=document.querySelector('#rightDock').getBoundingClientRect();
    const canvas=document.querySelector('.canvas-area').getBoundingClientRect();
    return {panelLeft:panel.left,panelRight:panel.right,canvasLeft:canvas.left,canvasRight:canvas.right,canvasWidth:canvas.width};
  });
  assert.ok(geometry.panelRight<=geometry.canvasLeft&&geometry.canvasWidth>=400,`the left-side keyboard-resized dock remains outside the canvas: ${JSON.stringify(geometry)}`);

  await openPreferences(page);
  await page.locator('#workspaceDockOrder').selectOption('canvas-right-left');
  await page.locator('#closeWorkspaceAppearance').click();
  const left=page.locator('#leftDock .left-resizer');
  assert.equal(await left.getAttribute('aria-valuenow'),'310');
  await left.focus();
  await page.keyboard.press('ArrowLeft');
  assert.equal(await left.getAttribute('aria-valuenow'),'326','the left panel is after the canvas, so ArrowLeft grows its right-side dock toward the canvas');
  geometry=await page.evaluate(()=>{
    const panel=document.querySelector('#leftDock').getBoundingClientRect();
    const canvas=document.querySelector('.canvas-area').getBoundingClientRect();
    return {panelLeft:panel.left,panelRight:panel.right,canvasLeft:canvas.left,canvasRight:canvas.right,canvasWidth:canvas.width};
  });
  assert.ok(geometry.panelLeft>=geometry.canvasRight&&geometry.canvasWidth>=400,`the right-side keyboard-resized dock remains outside the canvas: ${JSON.stringify(geometry)}`);
  assert.deepEqual(writes,[],'reordered dock keyboard resizing never invokes Page Model Save or Publish');
  assert.deepEqual(errors,[]);
});

test('pointer dock resizing follows the active panel group track instead of the panel identity',async t=>{
  const {page,writes,errors}=await openEditor(t,{width:1280,height:900});
  await openPreferences(page);
  await page.locator('#workspaceLayout').selectOption('balanced');
  await page.locator('#workspacePanelMode').selectOption('tabbed');
  await page.locator('#workspacePanelSide').selectOption('right');
  await page.locator('#closeWorkspaceAppearance').click();
  await page.locator('#workspacePanelTabLeft').click();

  const left=page.locator('#leftDock .left-resizer');
  const rightGroupHandle=await left.boundingBox();
  assert.ok(rightGroupHandle);
  await page.mouse.move(rightGroupHandle.x+rightGroupHandle.width/2,rightGroupHandle.y+rightGroupHandle.height/2);
  await page.mouse.down();
  await page.mouse.move(rightGroupHandle.x+rightGroupHandle.width/2-24,rightGroupHandle.y+rightGroupHandle.height/2);
  await page.mouse.up();
  assert.equal(await left.getAttribute('aria-valuenow'),'334','dragging the left panel group separator toward the canvas grows the right-side dock');
  let geometry=await page.evaluate(()=>{
    const panel=document.querySelector('#leftDock').getBoundingClientRect();
    const canvas=document.querySelector('.canvas-area').getBoundingClientRect();
    return {panelLeft:panel.left,panelRight:panel.right,canvasLeft:canvas.left,canvasRight:canvas.right,canvasWidth:canvas.width};
  });
  assert.ok(geometry.panelLeft>=geometry.canvasRight&&geometry.canvasWidth>=400,`the resized right-side group remains outside the canvas: ${JSON.stringify(geometry)}`);

  await openPreferences(page);
  await page.locator('#workspacePanelSide').selectOption('left');
  await page.locator('#closeWorkspaceAppearance').click();
  await page.locator('#workspacePanelTabRight').click();
  const right=page.locator('#rightDock .right-resizer');
  const leftGroupHandle=await right.boundingBox();
  assert.ok(leftGroupHandle);
  await page.mouse.move(leftGroupHandle.x+leftGroupHandle.width/2,leftGroupHandle.y+leftGroupHandle.height/2);
  await page.mouse.down();
  await page.mouse.move(leftGroupHandle.x+leftGroupHandle.width/2+24,leftGroupHandle.y+leftGroupHandle.height/2);
  await page.mouse.up();
  assert.equal(await right.getAttribute('aria-valuenow'),'376','dragging the right panel group separator toward the canvas grows the left-side dock');
  geometry=await page.evaluate(()=>{
    const panel=document.querySelector('#rightDock').getBoundingClientRect();
    const canvas=document.querySelector('.canvas-area').getBoundingClientRect();
    return {panelLeft:panel.left,panelRight:panel.right,canvasLeft:canvas.left,canvasRight:canvas.right,canvasWidth:canvas.width};
  });
  assert.ok(geometry.panelRight<=geometry.canvasLeft&&geometry.canvasWidth>=400,`the resized left-side group remains outside the canvas: ${JSON.stringify(geometry)}`);
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('sanci-editor-shell-v2'))?.leftWidth),334);
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('sanci-editor-shell-v2'))?.rightWidth),376);
  await openPreferences(page);
  await page.locator('#undoWorkspaceLayout').click();
  assert.equal(await right.getAttribute('aria-valuenow'),'352','workspace Undo restores the pre-drag grouped width');
  await page.locator('#redoWorkspaceLayout').click();
  assert.equal(await right.getAttribute('aria-valuenow'),'376','workspace Redo reapplies the grouped pointer resize');
  await page.locator('#closeWorkspaceAppearance').click();
  assert.deepEqual(writes,[],'grouped pointer resizing never Save or Publish page content');
  assert.deepEqual(errors,[]);
});

test('pointer dock resizing follows the physical track after separate docks are reordered',async t=>{
  const {page,writes,errors}=await openEditor(t,{width:1440,height:900});
  await openPreferences(page);
  await page.locator('#workspaceLayout').selectOption('balanced');
  await page.locator('#workspacePanelMode').selectOption('separate');
  await page.waitForFunction(()=>!document.querySelector('#leftDock')?.classList.contains('closed')&&!document.querySelector('#rightDock')?.classList.contains('closed'));

  await page.locator('#workspaceDockOrder').selectOption('left-right-canvas');
  await page.waitForFunction(()=>document.querySelector('.workspace')?.dataset.workspaceDockOrder==='left-right-canvas');
  await page.locator('#closeWorkspaceAppearance').click();
  const right=page.locator('#rightDock .right-resizer');
  let handle=await right.boundingBox();
  assert.ok(handle);
  await page.mouse.move(handle.x+handle.width/2,handle.y+handle.height/2);
  await page.mouse.down();
  await page.mouse.move(handle.x+handle.width/2+20,handle.y+handle.height/2);
  await page.mouse.up();
  assert.equal(await right.getAttribute('aria-valuenow'),'372','the right panel is before the canvas, so dragging its edge right grows it toward the canvas');
  let geometry=await page.evaluate(()=>{
    const panel=document.querySelector('#rightDock').getBoundingClientRect();
    const canvas=document.querySelector('.canvas-area').getBoundingClientRect();
    return {panelLeft:panel.left,panelRight:panel.right,canvasLeft:canvas.left,canvasRight:canvas.right,canvasWidth:canvas.width};
  });
  assert.ok(geometry.panelRight<=geometry.canvasLeft&&geometry.canvasWidth>=400,`the reordered left-side dock remains outside the canvas: ${JSON.stringify(geometry)}`);

  await openPreferences(page);
  await page.locator('#workspaceDockOrder').selectOption('canvas-right-left');
  await page.waitForFunction(()=>document.querySelector('.workspace')?.dataset.workspaceDockOrder==='canvas-right-left');
  await page.locator('#closeWorkspaceAppearance').click();
  const left=page.locator('#leftDock .left-resizer');
  handle=await left.boundingBox();
  assert.ok(handle);
  await page.mouse.move(handle.x+handle.width/2,handle.y+handle.height/2);
  await page.mouse.down();
  await page.mouse.move(handle.x+handle.width/2-20,handle.y+handle.height/2);
  await page.mouse.up();
  assert.equal(await left.getAttribute('aria-valuenow'),'330','the left panel is after the canvas, so dragging its edge left grows it toward the canvas');
  geometry=await page.evaluate(()=>{
    const panel=document.querySelector('#leftDock').getBoundingClientRect();
    const canvas=document.querySelector('.canvas-area').getBoundingClientRect();
    return {panelLeft:panel.left,panelRight:panel.right,canvasLeft:canvas.left,canvasRight:canvas.right,canvasWidth:canvas.width};
  });
  assert.ok(geometry.panelLeft>=geometry.canvasRight&&geometry.canvasWidth>=400,`the reordered right-side dock remains outside the canvas: ${JSON.stringify(geometry)}`);
  assert.deepEqual(writes,[],'resizing separately reordered panels never invokes Page Model Save or Publish');
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
  assert.equal(await page.locator('#workspaceProfileName').inputValue(),'Importált elrendezés','the imported profile name is ready for an intentional rename');
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

test('profile import, save and rename truncate at Unicode character boundaries',async t=>{
  const {page,writes,errors}=await openEditor(t);
  await openPreferences(page);
  const cases=[
    {id:'profile-unicode-boundary',name:`${'A'.repeat(31)}😀`,expected:'A'.repeat(31),file:'unicode-boundary.json'},
    {id:'profile-unicode-repair',name:`${'B'.repeat(31)}\ud83d`,expected:'B'.repeat(31),file:'legacy-unpaired-surrogate.json'},
  ];
  for(const [index,item] of cases.entries()){
    const transfer={kind:'sanci-editor-workspace-profile',version:1,profile:{
      id:item.id,name:item.name,createdAt:1,
      appearance:{theme:'graphite',layout:'canvas',density:'comfortable',accent:'#5b8cff'},
      dock:{leftOpen:false,rightOpen:false},
    }};
    await page.locator('#workspaceProfileFile').setInputFiles({name:item.file,mimeType:'application/json',buffer:Buffer.from(JSON.stringify(transfer))});
    await page.waitForFunction(count=>document.querySelector('#workspaceProfile')?.options.length===count,index+2);
    const imported=await page.evaluate(({key,index})=>JSON.parse(localStorage.getItem(key)).profiles[index].name,{key:WORKSPACE_PREFERENCES_KEY,index});
    assert.equal(imported,item.expected,`${item.file}: truncation and legacy repair preserve valid code-point boundaries`);
    assert.ok(Array.from(imported).every(character=>{const code=character.codePointAt(0);return code<0xd800||code>0xdfff}),`${item.file}: persisted names contain no isolated UTF-16 surrogate`);
    if(index===cases.length-1)assert.equal(await page.locator('#workspaceProfileName').inputValue(),imported,'the editor field reflects the exact normalized name');
  }
  const savedName=`${'C'.repeat(31)}😀`;
  await page.locator('#workspaceProfileName').fill(savedName);
  await page.locator('#saveWorkspaceProfile').click();
  await page.waitForFunction(()=>document.querySelector('#workspaceProfile')?.options.length===4);
  const savedId=await page.locator('#workspaceProfile').inputValue();
  const storedSaved=await page.evaluate(({key,id})=>JSON.parse(localStorage.getItem(key)).profiles.find(profile=>profile.id===id),{key:WORKSPACE_PREFERENCES_KEY,id:savedId});
  assert.equal(storedSaved.name,'C'.repeat(31),'profile creation keeps the existing UTF-16 limit without splitting an emoji');
  const renamedName=`${'D'.repeat(31)}😀`;
  await page.locator('#workspaceProfileName').fill(renamedName);
  await page.locator('#renameWorkspaceProfile').click();
  const storedRenamed=await page.evaluate(({key,id})=>JSON.parse(localStorage.getItem(key)).profiles.find(profile=>profile.id===id),{key:WORKSPACE_PREFERENCES_KEY,id:savedId});
  assert.equal(storedRenamed.name,'D'.repeat(31),'profile rename uses the same code-point-safe name normalization');
  assert.equal(await page.locator('#workspaceProfileName').inputValue(),storedRenamed.name,'the rename field reflects the persisted normalized value');
  for(const profile of [storedSaved,storedRenamed])assert.ok(Array.from(profile.name).every(character=>{const code=character.codePointAt(0);return code<0xd800||code>0xdfff}),'saved and renamed names do not contain isolated UTF-16 surrogates');
  assert.deepEqual(writes,[],'profile normalization never invokes Page Model Save or Publish');
  assert.deepEqual(errors,[]);
});

test('saved workspace profiles can be renamed with unique names, undo, redo, and cross-tab sync only',async t=>{
  const {page,context,writes,errors}=await openEditor(t,{width:1366,height:900});
  await openPreferences(page);
  await page.locator('#workspaceProfileName').fill('Tartalomszerkesztés');
  await page.locator('#saveWorkspaceProfile').click();
  const firstId=await page.locator('#workspaceProfile').inputValue();
  await page.locator('#workspaceTheme').selectOption('aurora');
  await page.locator('#workspaceProfileName').fill('Áttekintő nézet');
  await page.locator('#saveWorkspaceProfile').click();
  const secondId=await page.locator('#workspaceProfile').inputValue();
  assert.notEqual(firstId,secondId);
  const before=await page.evaluate(({key,id})=>JSON.parse(localStorage.getItem(key)).profiles.find(profile=>profile.id===id),{key:WORKSPACE_PREFERENCES_KEY,id:firstId});

  const second=await context.newPage();
  await second.goto(page.url(),{waitUntil:'load'});
  await second.waitForFunction(()=>document.documentElement.dataset.editorBoot==='ready');
  await openPreferences(second);
  await second.locator('#workspaceProfile').selectOption(firstId);
  assert.equal(await second.locator('#workspaceProfileName').inputValue(),'Tartalomszerkesztés','selecting a saved profile loads its current name into the rename field');
  assert.equal(await second.locator('#renameWorkspaceProfile').isEnabled(),true);

  await page.locator('#workspaceProfile').selectOption(firstId);
  await page.locator('#workspaceProfileName').fill('  Fókuszált tartalom  ');
  await page.locator('#renameWorkspaceProfile').click();
  await page.waitForFunction(id=>[...document.querySelectorAll('#workspaceProfile option')].some(option=>option.value===id&&option.textContent==='Fókuszált tartalom'),firstId);
  await second.waitForFunction(id=>[...document.querySelectorAll('#workspaceProfile option')].some(option=>option.value===id&&option.textContent==='Fókuszált tartalom'),firstId);
  assert.equal(await second.locator('#workspaceProfileName').inputValue(),'Fókuszált tartalom','an externally renamed selected profile refreshes its name field without applying the profile');
  assert.equal(await second.locator('#undoWorkspaceLayout').isDisabled(),true,'external profile rename clears stale workspace history');
  const after=await page.evaluate(({key,id})=>JSON.parse(localStorage.getItem(key)).profiles.find(profile=>profile.id===id),{key:WORKSPACE_PREFERENCES_KEY,id:firstId});
  assert.equal(after.name,'Fókuszált tartalom','profile names are trimmed before persistence');
  assert.equal(after.id,before.id,'renaming never changes the local profile identity');
  assert.equal(after.createdAt,before.createdAt,'renaming preserves profile creation metadata');
  assert.deepEqual(after.appearance,before.appearance,'renaming changes no saved appearance preference');
  assert.deepEqual(after.dock,before.dock,'renaming changes no saved panel state');
  assert.equal(await page.locator('#workspaceAppearanceStatus').textContent(),'„Tartalomszerkesztés” profil neve „Fókuszált tartalom” lett. Visszavonás elérhető.');

  await page.locator('#workspaceProfileName').fill('Áttekintő nézet');
  await page.locator('#renameWorkspaceProfile').click();
  await page.waitForFunction(()=>document.querySelector('#workspaceAppearanceStatus')?.textContent.includes('Már van ilyen nevű profil'));
  assert.equal((await page.evaluate(({key,id})=>JSON.parse(localStorage.getItem(key)).profiles.find(profile=>profile.id===id),{key:WORKSPACE_PREFERENCES_KEY,id:firstId})).name,'Fókuszált tartalom','case-insensitive duplicate names are rejected without altering either profile');

  await page.locator('#undoWorkspaceLayout').click();
  assert.equal(await page.locator('#workspaceProfile option').filter({hasText:'Tartalomszerkesztés'}).count(),1,'Undo restores only the renamed profile name');
  assert.equal(await page.locator('#workspaceProfileName').inputValue(),'Tartalomszerkesztés','Undo also restores the selected profile name in the editable field');
  assert.equal(await page.locator('#workspaceProfile option').filter({hasText:'Áttekintő nézet'}).count(),1,'Undo preserves the other profile');
  await page.locator('#redoWorkspaceLayout').click();
  assert.equal(await page.locator('#workspaceProfile option').filter({hasText:'Fókuszált tartalom'}).count(),1,'Redo reapplies the profile rename');
  assert.equal(await page.locator('#workspaceProfileName').inputValue(),'Fókuszált tartalom','Redo keeps the selected profile name field in sync');
  assert.deepEqual(writes,[],'profile renaming and its history never Save or Publish page content');
  assert.deepEqual(errors,[]);
});

test('mobile workspace profile rename has a touch-sized control and stays page-data independent',async t=>{
  const {page,writes,errors}=await openEditor(t,{width:390,height:844,isMobile:true,hasTouch:true});
  await openPreferences(page);
  await page.locator('#workspaceProfileName').fill('Telefonos munka');
  await page.locator('#saveWorkspaceProfile').tap();
  const id=await page.locator('#workspaceProfile').inputValue();
  const metrics=await page.locator('#renameWorkspaceProfile').evaluate(element=>({height:element.getBoundingClientRect().height,width:element.getBoundingClientRect().width,disabled:element.disabled}));
  assert.ok(metrics.height>=44&&metrics.width>=44,`the rename action remains a usable mobile touch target: ${JSON.stringify(metrics)}`);
  assert.equal(metrics.disabled,false,'the selected mobile profile can be renamed');
  await page.locator('#workspaceProfileName').fill('Zsebes nézet');
  await page.locator('#renameWorkspaceProfile').tap();
  assert.equal(await page.locator('#workspaceProfile option').filter({hasText:'Zsebes nézet'}).count(),1);
  assert.equal(await page.evaluate(({key,id})=>JSON.parse(localStorage.getItem(key)).profiles.find(profile=>profile.id===id)?.name,{key:WORKSPACE_PREFERENCES_KEY,id}),'Zsebes nézet');
  assert.equal(await page.locator('.workspace').evaluate(element=>element.classList.contains('left-open')&&element.classList.contains('right-open')),false,'renaming does not disturb the one-drawer mobile shell');
  assert.deepEqual(writes,[],'mobile profile rename never Save or Publish page content');
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
  assert.equal(staleDrop.announcement,'A másik szerkesztőlapon történt változás miatt az átrendezés megszakadt.','cross-tab invalidation announces why the target is no longer valid');

  const dockStateDrag=await page.evaluate(()=>{
    const handle=document.querySelector('#leftDock .dock-heading'),target=document.querySelector('.canvas-area'),rect=target.getBoundingClientRect(),dataTransfer=new DataTransfer();
    handle.dispatchEvent(new DragEvent('dragstart',{bubbles:true,cancelable:true,dataTransfer}));
    target.dispatchEvent(new DragEvent('dragover',{bubbles:true,cancelable:true,dataTransfer,clientX:rect.left+rect.width-4}));
    window.__workspaceDockTransfer=dataTransfer;
    return {preview:target.dataset.dockDropPosition,active:document.body.classList.contains('workspace-reordering')};
  });
  assert.equal(dockStateDrag.preview,'after');
  assert.equal(dockStateDrag.active,true);
  await second.locator('#closeWorkspaceAppearance').click();
  await second.locator('#openInspector').click();
  await page.waitForFunction(()=>!document.body.classList.contains('workspace-reordering'));
  const dockStateStaleDrop=await page.evaluate(()=>{
    const target=document.querySelector('.canvas-area'),rect=target.getBoundingClientRect(),dataTransfer=window.__workspaceDockTransfer;
    target.dispatchEvent(new DragEvent('drop',{bubbles:true,cancelable:true,dataTransfer,clientX:rect.left+rect.width-4}));
    const state=JSON.parse(localStorage.getItem('sanci-editor-shell-v2'));
    const result={rightOpen:state.rightOpen,preview:target.hasAttribute('data-dock-drop-position'),active:document.body.classList.contains('workspace-reordering'),announcement:document.querySelector('#workspaceDockStatus')?.textContent};
    delete window.__workspaceDockTransfer;
    return result;
  });
  assert.equal(dockStateStaleDrop.rightOpen,false,'the receiving tab applies the external panel state before a stale drag can drop');
  assert.equal(dockStateStaleDrop.preview,false,'external dock-state changes clear the old drop target');
  assert.equal(dockStateStaleDrop.active,false,'external dock-state changes cancel the in-progress interaction');
  assert.equal(dockStateStaleDrop.announcement,'A másik szerkesztőlapon megváltozott a panelállapot, ezért az átrendezés megszakadt.','dock-state storage changes announce why the target is no longer valid');
  await page.bringToFront();
  await openPreferences(page);
  assert.equal(await page.locator('#workspaceLeftTool').isVisible(),true,'the receiving tab keeps its workspace controls available after dock-state cancellation');

  await page.locator('#workspaceLeftTool').selectOption('layers');
  await page.locator('#moveWorkspaceLeftToolUp').click();
  assert.equal(await page.locator('#undoWorkspaceLayout').isEnabled(),true,'the local rail-order change enters only this tab’s workspace history');
  await second.bringToFront();
  await openPreferences(second);
  await second.locator('#workspaceLeftTool').selectOption('navigation');
  await second.locator('#moveWorkspaceLeftToolUp').click();
  await page.waitForFunction(()=>[...document.querySelectorAll('.tool-rail .rail-btn')].map(button=>button.dataset.tab).join(',')==='pages,layers,elements,navigation,schedule');
  assert.equal(await page.locator('#undoWorkspaceLayout').isDisabled(),true,'an external rail-order update clears a history snapshot that could overwrite it');
  assert.match(await page.locator('#workspaceAppearanceStatus').textContent(),/másik szerkesztőlapon megváltozott a panelek állapota/iu);

  await second.locator('#workspaceProfileName').fill('Másik lap nézete');
  await second.locator('#saveWorkspaceProfile').click();
  await page.waitForFunction(()=>document.querySelector('#workspaceProfile')?.options.length===2);
  assert.equal(await page.locator('#workspaceProfile option').last().textContent(),'Másik lap nézete','saved profiles become available in other open tabs');
  assert.equal(await page.locator('#workspaceProfile').inputValue(),'','receiving the profile does not apply it unexpectedly');
  const remoteProfileId=await second.locator('#workspaceProfile').inputValue();
  assert.ok(remoteProfileId,'the creating tab selects its newly saved profile');
  await page.locator('#workspaceProfile').selectOption(remoteProfileId);
  assert.equal(await page.locator('#deleteWorkspaceProfile').isEnabled(),true,'the receiving tab can select the profile shared from another Editor tab');
  await second.locator('#workspaceProfile').selectOption(remoteProfileId);
  await second.locator('#deleteWorkspaceProfile').click();
  await page.waitForFunction(()=>document.querySelector('#workspaceProfile')?.options.length===1);
  assert.equal(await page.locator('#workspaceProfile').inputValue(),'','deleting a selected profile in another tab clears the stale selection');
  assert.equal(await page.locator('#deleteWorkspaceProfile').isEnabled(),false,'a deleted profile cannot remain actionable in the receiving tab');
  assert.equal(await page.locator('#loadWorkspaceProfile').isEnabled(),false,'the receiving tab cannot load a profile deleted by its peer');
  assert.equal(await page.locator('#exportWorkspaceProfile').isEnabled(),false,'the receiving tab cannot export a profile deleted by its peer');
  assert.equal(await page.locator('#undoWorkspaceLayout').isDisabled(),true,'external profile deletion clears history that could resurrect the deleted profile');
  assert.match(await page.locator('#workspaceAppearanceStatus').textContent(),/másik szerkesztőlapon/iu,'the receiving tab explains that its workspace was updated elsewhere');
  await page.bringToFront();
  const resetDrag=await page.evaluate(()=>{
    const handle=document.querySelector('#leftDock .dock-heading'),target=document.querySelector('.canvas-area'),rect=target.getBoundingClientRect(),dataTransfer=new DataTransfer();
    handle.dispatchEvent(new DragEvent('dragstart',{bubbles:true,cancelable:true,dataTransfer}));
    target.dispatchEvent(new DragEvent('dragover',{bubbles:true,cancelable:true,dataTransfer,clientX:rect.left+rect.width-4}));
    window.__workspaceDockTransfer=dataTransfer;
    return {preview:target.hasAttribute('data-dock-drop-position'),active:document.body.classList.contains('workspace-reordering')};
  });
  assert.deepEqual(resetDrag,{preview:true,active:true},'a full storage reset can arrive while a dock drag is active');
  await second.evaluate(()=>localStorage.clear());
  await page.waitForFunction(()=>document.querySelector('.editor-app')?.dataset.workspaceTheme==='graphite'&&document.querySelector('.workspace')?.dataset.workspaceDockOrder==='left-canvas-right'&&document.querySelector('#workspaceProfile')?.options.length===1);
  assert.equal(await page.locator('.workspace').evaluate(element=>element.classList.contains('left-open')||element.classList.contains('right-open')),false,'clearing origin-local storage returns the other tab to a safe default layout');
  const canceledResetDrag=await page.evaluate(()=>{
    const target=document.querySelector('.canvas-area'),rect=target.getBoundingClientRect(),dataTransfer=window.__workspaceDockTransfer;
    target.dispatchEvent(new DragEvent('drop',{bubbles:true,cancelable:true,dataTransfer,clientX:rect.left+rect.width-4}));
    const result={preview:target.hasAttribute('data-dock-drop-position'),active:document.body.classList.contains('workspace-reordering'),dockAnnouncement:document.querySelector('#workspaceDockStatus')?.textContent,appearanceAnnouncement:document.querySelector('#workspaceAppearanceStatus')?.textContent,appearance:document.querySelector('.editor-app')?.dataset.workspaceTheme,order:document.querySelector('.workspace')?.dataset.workspaceDockOrder};
    delete window.__workspaceDockTransfer;
    return result;
  });
  assert.equal(canceledResetDrag.preview,false,'a full reset removes the old dock target');
  assert.equal(canceledResetDrag.active,false,'a full reset cancels the in-progress dock drag');
  assert.equal(canceledResetDrag.appearance,'graphite');
  assert.equal(canceledResetDrag.order,'left-canvas-right');
  assert.match(canceledResetDrag.dockAnnouncement,/alaphelyzetbe állították.*átrendezés megszakadt/iu,'the polite dock announcement explains that another tab reset the workspace');
  assert.match(canceledResetDrag.appearanceAnnouncement,/alaphelyzetbe állították a munkaterületet.*visszavonási előzményt töröltük/iu,'reset feedback must not falsely claim only the tool order changed');
  assert.deepEqual(writes,[],'workspace synchronization never invokes Page Model Save or Publish');
  assert.deepEqual(errors,[]);
});


test('cross-tab appearance changes enforce the same supported-version fallback as editor startup',async t=>{
  const current={version:2,layout:'balanced',theme:'aurora',density:'compact',accent:'#00a7c8',dockOrder:'right-canvas-left',panelMode:'separate',panelSide:'right',profiles:[]};
  const legacy={version:1,layout:'inspector',theme:'sage',density:'comfortable',accent:'#00a7c8'};
  const {page,context,writes,errors}=await openEditor(t,{width:1366,height:900,initialAppearance:current,initialLegacyAppearance:legacy});
  const second=await context.newPage();
  await second.goto(page.url(),{waitUntil:'load'});
  await second.waitForFunction(()=>document.documentElement.dataset.editorBoot==='ready');
  assert.equal(await page.locator('.editor-app').getAttribute('data-workspace-theme'),'aurora','the supported current schema takes precedence at startup');

  await second.evaluate(key=>localStorage.removeItem(key),WORKSPACE_PREFERENCES_KEY);
  await page.waitForFunction(()=>document.querySelector('.editor-app')?.getAttribute('data-workspace-theme')==='sage'&&document.querySelector('.workspace')?.classList.contains('right-open'));
  assert.deepEqual(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),LEGACY_WORKSPACE_PREFERENCES_KEY),legacy,'removing the current record restores the retained supported legacy profile');
  assert.equal(await page.evaluate(key=>localStorage.getItem(key),WORKSPACE_PREFERENCES_KEY),null,'cross-tab recovery leaves the removed current schema absent until an explicit change');

  const unsupported={version:3,layout:'canvas',theme:'ocean',density:'compact',accent:'#00a7c8',dockOrder:'left-right-canvas',panelMode:'tabbed',panelSide:'left',profiles:[]};
  await second.evaluate(({key,value})=>localStorage.setItem(key,JSON.stringify(value)),{key:WORKSPACE_PREFERENCES_KEY,value:unsupported});
  await page.waitForFunction(()=>document.querySelector('.editor-app')?.getAttribute('data-workspace-theme')==='sage');
  assert.deepEqual(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),WORKSPACE_PREFERENCES_KEY),unsupported,'an unknown future schema is preserved and never treated as the current contract');
  assert.equal(await page.locator('#workspaceLayout').inputValue(),'inspector','unsupported cross-tab data does not override the supported legacy fallback');

  const refreshedLegacy={...legacy,theme:'cinder',layout:'canvas'};
  await second.evaluate(({key,value})=>localStorage.setItem(key,JSON.stringify(value)),{key:LEGACY_WORKSPACE_PREFERENCES_KEY,value:refreshedLegacy});
  await page.waitForFunction(()=>document.querySelector('.editor-app')?.getAttribute('data-workspace-theme')==='cinder');
  assert.equal(await page.locator('#workspaceLayout').inputValue(),'canvas','a legacy update still propagates when the stored current schema is unsupported');

  const refreshed={...current,theme:'ocean',layout:'canvas'};
  await second.evaluate(({key,value})=>localStorage.setItem(key,JSON.stringify(value)),{key:WORKSPACE_PREFERENCES_KEY,value:refreshed});
  await page.waitForFunction(()=>document.querySelector('.editor-app')?.getAttribute('data-workspace-theme')==='ocean');
  assert.equal(await page.locator('#workspaceLayout').inputValue(),'canvas','a later supported v2 write becomes authoritative again');
  const lateLegacy={...refreshedLegacy,theme:'sage',layout:'inspector'};
  await second.evaluate(({key,value})=>localStorage.setItem(key,JSON.stringify(value)),{key:LEGACY_WORKSPACE_PREFERENCES_KEY,value:lateLegacy});
  await page.waitForFunction(()=>document.querySelector('.editor-app')?.getAttribute('data-workspace-theme')==='ocean');
  assert.equal(await page.locator('#workspaceLayout').inputValue(),'canvas','a late legacy write cannot replace a supported current workspace');
  assert.deepEqual(writes,[],'schema fallback and cross-tab preference sync never Save or Publish page content');
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
    return {order:document.querySelector('.workspace').dataset.workspaceDockOrder,active:document.body.classList.contains('workspace-reordering'),announcement:document.querySelector('#workspaceDockStatus')?.textContent};
  });
  assert.equal(started.active,true,'desktop drag is active before the responsive boundary changes');
  assert.equal(started.announcement,'Cél: Utána helyezés – Vászon.','the active target is announced before the breakpoint change');
  await resizeAndWaitForWorkspaceBreakpoint(page,390,844);
  await page.waitForFunction(()=>!document.body.classList.contains('workspace-reordering'));
  const late=await page.evaluate(()=>{
    const target=document.querySelector('.canvas-area'),rect=target.getBoundingClientRect(),dataTransfer=window.__workspaceDockTransfer;
    target.dispatchEvent(new DragEvent('drop',{bubbles:true,cancelable:true,dataTransfer,clientX:rect.left+rect.width-4}));
    const result={order:document.querySelector('.workspace').dataset.workspaceDockOrder,preview:target.hasAttribute('data-dock-drop-position'),active:document.body.classList.contains('workspace-reordering'),announcement:document.querySelector('#workspaceDockStatus')?.textContent};
    delete window.__workspaceDockTransfer;
    return result;
  });
  assert.equal(late.order,started.order,'a mobile breakpoint cancels the prior desktop insertion');
  assert.equal(late.preview,false,'responsive change clears desktop-only target styling');
  assert.equal(late.active,false,'mobile mode does not retain desktop drag state');
  assert.equal(late.announcement,'A képernyőméret változott, ezért az átrendezés megszakadt.','the responsive boundary explains why the drag ended');
  assert.ok(!(await page.locator('#leftDock').isVisible()&&await page.locator('#rightDock').isVisible()),'the mobile single-drawer rule remains intact');
  assert.deepEqual(writes,[],'canceling dock interactions never writes page content');
  assert.deepEqual(errors,[]);
});

test('Editor restores a valid legacy workbench after an unsupported v2 record, then migrates the next change',async t=>{
  const {page,writes,errors}=await openEditor(t,{width:1280,height:900,initialAppearance:{version:3,layout:'canvas',theme:'graphite'},initialLegacyAppearance:{version:1,layout:'inspector',theme:'sage',density:'compact',accent:'#00a7c8'}});
  await page.waitForFunction(()=>document.querySelector('.editor-app')?.dataset.workspaceTheme==='sage'&&document.querySelector('.workspace')?.classList.contains('right-open'));
  assert.equal(await page.locator('.editor-app').getAttribute('data-workspace-theme'),'sage','an unsupported current schema falls back to the last valid legacy presentation');
  assert.equal(await page.locator('#workspaceLayout').inputValue(),'inspector','legacy layout preferences remain usable after recovery');
  const restored=await page.evaluate(()=>JSON.parse(localStorage.getItem('sanci-editor-workspace-preferences-v1')));
  assert.equal(restored.theme,'sage','recovery does not destructively rewrite the legacy backup during startup');
  assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('sanci-editor-workspace-preferences-v2'))),{version:3,layout:'canvas',theme:'graphite'},'startup recovery leaves the unsupported current record untouched until an explicit edit');

  await openPreferences(page);
  await page.locator('#workspaceTheme').selectOption('cinder');
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('sanci-editor-workspace-preferences-v2'))?.theme),'cinder','the next explicit change creates a normalized current-version record');
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('sanci-editor-workspace-preferences-v1'))?.theme),'sage','the retained legacy backup remains available for recovery');
  assert.deepEqual(writes,[],'workspace migration never invokes Page Model Save or Publish');
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

test('Editor starts with safe defaults when privacy settings deny workspace storage reads',async t=>{
  const {page,writes,errors}=await openEditor(t,{width:1440,height:900,blockWorkspaceStorageReads:true});
  assert.equal(await page.locator('.editor-app').getAttribute('data-workspace-theme'),'graphite');
  assert.equal(await page.locator('.workspace').evaluate(element=>element.classList.contains('left-open')||element.classList.contains('right-open')),false,'unreadable saved state falls back to the safe canvas-first layout');
  await openPreferences(page);
  await page.locator('#workspaceTheme').selectOption('sage');
  await page.waitForFunction(()=>document.querySelector('#workspaceAppearanceStatus')?.textContent.includes('csak ebben a munkamenetben'));
  assert.equal(await page.locator('.editor-app').getAttribute('data-workspace-theme'),'sage','the user can still customize the current session');
  assert.equal(await page.locator('#save').textContent(),'Mentés');
  assert.equal(await page.locator('#publish').textContent(),'Publikálás');
  assert.deepEqual(writes,[],'a denied workspace read never falls back to Page Model, Save, or Publish writes');
  assert.deepEqual(errors,[],'denied localStorage reads do not prevent Editor startup');
});

test('malformed saved dock values normalize safely at startup without rewriting the original preference',async t=>{
  const storedDock={leftOpen:'false',rightOpen:'false',leftTab:'unknown',leftTabOrder:['unknown'],inspectorTab:'unknown',panelActive:'unknown',leftWidth:999,rightWidth:'not-a-number'};
  const appearance={version:2,layout:'custom',theme:'graphite',density:'comfortable',accent:'#5b8cff',dockOrder:'left-canvas-right',panelMode:'separate',panelSide:'right',profiles:[]};
  const {page,writes,errors}=await openEditor(t,{width:1440,height:900,initialDockState:storedDock,initialAppearance:appearance});

  const state=await page.evaluate(()=>({
    leftOpen:!document.querySelector('#leftDock').classList.contains('closed'),
    rightOpen:!document.querySelector('#rightDock').classList.contains('closed'),
    leftWidth:Number(document.querySelector('.left-resizer').getAttribute('aria-valuenow')),
    rightWidth:Number(document.querySelector('.right-resizer').getAttribute('aria-valuenow')),
    active:document.querySelector('.workspace').dataset.workspaceActivePanel,
    leftTab:document.querySelector('.rail-btn[aria-selected="true"]').dataset.tab,
    stored:JSON.parse(localStorage.getItem('sanci-editor-shell-v2'))
  }));
  assert.deepEqual({leftOpen:state.leftOpen,rightOpen:state.rightOpen,active:state.active,leftTab:state.leftTab},
    {leftOpen:false,rightOpen:false,active:'left',leftTab:'pages'},
    'only boolean true opens a dock and invalid active/tab values fall back to safe defaults');
  assert.equal(state.leftWidth,460,'a numeric saved width is clamped to the supported maximum');
  assert.equal(state.rightWidth,352,'a non-numeric saved width uses the safe default');
  assert.deepEqual(state.stored,storedDock,'startup normalization does not silently rewrite the locally stored source value');
  assert.deepEqual(writes,[],'normalizing presentation-only dock state never saves or publishes page content');
  assert.deepEqual(errors,[],'malformed local dock state does not block Editor startup');
});

test('workspace persistence stays session-only when just the separate dock-state key cannot be read',async t=>{
  const {page,writes,errors}=await openEditor(t,{width:1280,height:900,blockShellStorageReads:true});
  await openPreferences(page);
  await page.locator('#workspaceLayout').selectOption('balanced');
  await page.locator('#workspacePanelMode').selectOption('tabbed');
  await page.waitForFunction(()=>document.querySelector('#workspaceAppearanceStatus')?.textContent.includes('csak ebben a munkamenetben'));
  assert.equal(await page.locator('.workspace').evaluate(element=>element.classList.contains('left-open')&&element.classList.contains('right-open')),true,'the current session remains usable when only the shell state is unreadable');
  assert.equal(await page.evaluate(key=>JSON.parse(localStorage.getItem(key))?.layout,WORKSPACE_PREFERENCES_KEY),'balanced','the appearance key itself can be written even though the separate shell key cannot be read back');
  assert.match(await page.locator('#workspaceAppearanceStatus').textContent(),/panelállapot tárhelyes mentése nem ellenőrizhető/iu,'appearance storage success cannot promise a durable workspace when the separate dock state cannot be verified after reload');

  await page.locator('#closeWorkspaceAppearance').click();
  await page.locator('#workspacePanelTabRight').click();
  assert.equal(await page.locator('#workspacePanelTabRight').getAttribute('aria-selected'),'true','the user can still switch panels in the current session');
  assert.match(await page.locator('#workspaceDockStatus').textContent(),/csak ebben a munkamenetben érvényes/iu,'shell-only state changes also announce their non-durable status outside the settings dialog');
  assert.deepEqual(writes,[],'a partial workspace-storage failure never touches Page Model Save or Publish');
  assert.deepEqual(errors,[]);
});

test('workspace appearance reports session-only when the browser silently ignores its local preference write',async t=>{
  const {page,writes,errors}=await openEditor(t,{width:1280,height:900,ignoreWorkspacePreferenceWrites:true});
  await openPreferences(page);
  await page.locator('#workspaceTheme').selectOption('sage');
  await page.waitForFunction(()=>document.querySelector('#workspaceAppearanceStatus')?.textContent.includes('csak ebben a munkamenetben'));
  assert.equal(await page.locator('.editor-app').getAttribute('data-workspace-theme'),'sage','the current session still applies the requested presentation preference');
  assert.equal(await page.evaluate(key=>localStorage.getItem(key),WORKSPACE_PREFERENCES_KEY),null,'the simulated storage layer silently discards only the appearance write');
  assert.match(await page.locator('#workspaceAppearanceStatus').textContent(),/csak ebben a munkamenetben/iu,'a no-op write is never announced as saved across reloads');
  assert.deepEqual(writes,[],'session-only appearance changes do not Save or Publish page content');
  assert.deepEqual(errors,[],'the no-op browser storage behavior does not prevent Editor use');
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

  await resizeAndWaitForWorkspaceBreakpoint(page,390,844);
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

  await resizeAndWaitForWorkspaceBreakpoint(page,390,844);
  await page.waitForFunction(()=>document.querySelector('#leftDock')?.classList.contains('closed')===false&&document.querySelector('#rightDock')?.classList.contains('closed')===true);
  let mobile=await page.evaluate(()=>({left:!document.querySelector('#leftDock')?.classList.contains('closed'),right:!document.querySelector('#rightDock')?.classList.contains('closed'),scrollWidth:document.documentElement.scrollWidth,innerWidth}));
  assert.deepEqual({left:mobile.left,right:mobile.right},{left:true,right:false},'the panel that contained keyboard focus remains available after crossing the breakpoint');
  assert.ok(mobile.scrollWidth<=mobile.innerWidth);

  await resizeAndWaitForWorkspaceBreakpoint(page,1366,900);
  await page.waitForFunction(()=>document.querySelector('#rightDock')?.classList.contains('closed')===false&&document.querySelector('#leftDock')?.classList.contains('closed')===false);
  assert.equal(await page.locator('#leftDock').isVisible(),true,'the original desktop layout is restored after a temporary responsive switch');

  await resizeAndWaitForWorkspaceBreakpoint(page,390,844);
  await page.waitForFunction(()=>document.querySelector('#leftDock')?.classList.contains('closed')===false&&document.querySelector('#rightDock')?.classList.contains('closed')===true);
  await page.locator('#openInspector').click();
  await page.waitForFunction(()=>document.querySelector('#rightDock')?.classList.contains('closed')===false);
  assert.equal(await page.locator('#leftDock').isVisible(),false,'a deliberate mobile panel choice closes the previous drawer');

  await resizeAndWaitForWorkspaceBreakpoint(page,1366,900);
  await page.waitForFunction(()=>document.querySelector('#rightDock')?.classList.contains('closed')===false&&document.querySelector('#leftDock')?.classList.contains('closed')===true);
  assert.equal(await page.locator('#leftDock').evaluate(element=>element.classList.contains('closed')),true,'a deliberate mobile choice replaces the temporary desktop snapshot (the desktop navigation rail itself remains visible)');
  assert.equal(await page.locator('#rightDock').isVisible(),true);
  assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('sanci-editor-shell-v2'))),{leftOpen:false,rightOpen:true,leftTab:'layers',leftTabOrder:['pages','elements','layers','schedule','navigation'],inspectorTab:'design',panelActive:'right',leftWidth:310,rightWidth:352});
  assert.deepEqual(writes,[],'responsive panel changes never issue page Save or Publish requests');
  assert.deepEqual(errors,[]);
});

test('choosing the balanced workspace on mobile keeps both docks for the next desktop visit',async t=>{
  const {page,writes,errors}=await openEditor(t,{width:390,height:844,isMobile:true,hasTouch:true});
  await openPreferences(page);
  await page.locator('#workspaceLayout').selectOption('balanced');
  assert.equal(await page.locator('.workspace').evaluate(element=>element.classList.contains('left-open')),false,'the narrow viewport stays canvas-first after choosing the desktop balanced preset');
  assert.equal(await page.locator('.workspace').evaluate(element=>element.classList.contains('right-open')),false,'the mobile viewport never overlays the canvas with both docks');
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('sanci-editor-workspace-preferences-v2')).layout),'balanced');
  await page.locator('#closeWorkspaceAppearance').tap();

  await resizeAndWaitForWorkspaceBreakpoint(page,1366,900);
  await page.waitForFunction(()=>!matchMedia('(max-width: 1024px)').matches&&
    document.querySelector('.workspace')?.classList.contains('left-open')&&
    document.querySelector('.workspace')?.classList.contains('right-open'));
  assert.ok(await page.locator('.canvas-area').evaluate(element=>element.getBoundingClientRect().width>=400),'the balanced desktop preset reserves a usable, non-overlapped canvas');

  await resizeAndWaitForWorkspaceBreakpoint(page,390,844);
  await page.waitForFunction(()=>matchMedia('(max-width: 1024px)').matches&&
    Number(!document.querySelector('#leftDock')?.classList.contains('closed'))+
    Number(!document.querySelector('#rightDock')?.classList.contains('closed'))===1);
  await page.locator('#editorMenu').tap();
  await page.waitForFunction(()=>!document.querySelector('#leftDock')?.classList.contains('closed')&&
    document.querySelector('#rightDock')?.classList.contains('closed'));
  assert.deepEqual(await page.evaluate(()=>{
    const shell=JSON.parse(localStorage.getItem('sanci-editor-shell-v2'));
    return {leftOpen:shell.leftOpen,rightOpen:shell.rightOpen};
  }),{leftOpen:true,rightOpen:false},'an explicit mobile drawer choice replaces the desktop preset with the selected panel');
  await resizeAndWaitForWorkspaceBreakpoint(page,1366,900);
  await page.waitForFunction(()=>!matchMedia('(max-width: 1024px)').matches&&
    document.querySelector('.workspace')?.classList.contains('left-open')&&
    !document.querySelector('.workspace')?.classList.contains('right-open'));
  assert.ok(await page.locator('.canvas-area').evaluate(element=>element.getBoundingClientRect().width>=400),'the explicit mobile panel remains docked outside a usable desktop canvas');
  assert.deepEqual(writes,[],'changing the workspace layout remains independent from Page Model Save and Publish');
  assert.deepEqual(errors,[]);
});

test('1024px tablet drawer transitions to a non-overlapping 1025px desktop dock and restores the selected panel',async t=>{
  const {page,writes,errors}=await openEditor(t,{width:1025,height:900});
  await page.locator('#editorMenu').click();
  await page.locator('#openInspector').click();
  await page.waitForFunction(()=>!matchMedia('(max-width: 1024px)').matches&&
    document.querySelector('#leftDock')?.classList.contains('left-dock')&&
    !document.querySelector('#leftDock')?.classList.contains('closed')&&
    !document.querySelector('#rightDock')?.classList.contains('closed'));
  const desktop=await page.evaluate(()=>{
    const canvas=document.querySelector('.canvas-area').getBoundingClientRect();
    const left=document.querySelector('#leftDock').getBoundingClientRect();
    const right=document.querySelector('#rightDock').getBoundingClientRect();
    return {width:innerWidth,canvas:{left:canvas.left,right:canvas.right,width:canvas.width},left:{left:left.left,right:left.right},right:{left:right.left,right:right.right},scrollWidth:document.documentElement.scrollWidth};
  });
  assert.ok(desktop.canvas.width>=400,`1025px desktop keeps a usable canvas: ${JSON.stringify(desktop)}`);
  assert.ok(desktop.left.right<=desktop.canvas.left+0.5||desktop.canvas.right<=desktop.left.left+0.5,`the Pages dock gets its own desktop track: ${JSON.stringify(desktop)}`);
  assert.ok(desktop.right.right<=desktop.canvas.left+0.5||desktop.canvas.right<=desktop.right.left+0.5,`the Inspector gets its own desktop track: ${JSON.stringify(desktop)}`);
  assert.equal(desktop.scrollWidth,1025,'the desktop side of the breakpoint has no horizontal overflow');

  await resizeAndWaitForWorkspaceBreakpoint(page,1024,900);
  await page.waitForFunction(()=>matchMedia('(max-width: 1024px)').matches&&
    Number(!document.querySelector('#leftDock')?.classList.contains('closed'))+
    Number(!document.querySelector('#rightDock')?.classList.contains('closed'))===1);
  const tablet=await page.evaluate(()=>{
    const canvas=document.querySelector('.canvas-area').getBoundingClientRect();
    const left=document.querySelector('#leftDock');
    const right=document.querySelector('#rightDock');
    const open=[left,right].filter(panel=>!panel.classList.contains('closed'));
    const panel=open[0].getBoundingClientRect();
    return {width:innerWidth,active:open[0].id,leftHidden:left.getAttribute('aria-hidden'),rightHidden:right.getAttribute('aria-hidden'),canvasInert:document.querySelector('.canvas-area').inert,canvasWidth:canvas.width,panel:{left:panel.left,right:panel.right,width:panel.width},scrollWidth:document.documentElement.scrollWidth};
  });
  assert.equal(tablet.width,1024);
  assert.equal(tablet.active,'rightDock','the existing Inspector remains the active sheet at the mobile/tablet breakpoint');
  assert.equal(tablet.leftHidden,'true');
  assert.equal(tablet.rightHidden,'false');
  assert.equal(tablet.canvasInert,true,'the single tablet sheet is modal over the canvas');
  assert.ok(tablet.canvasWidth>=400,`the canvas remains present behind the tablet sheet: ${JSON.stringify(tablet)}`);
  assert.ok(tablet.panel.left>=0&&tablet.panel.right<=tablet.width,`the tablet sheet stays within the viewport: ${JSON.stringify(tablet)}`);
  assert.ok(tablet.scrollWidth<=tablet.width,'the tablet sheet does not create horizontal overflow');

  await page.locator('#editorMenu').click();
  await page.waitForFunction(()=>!document.querySelector('#leftDock')?.classList.contains('closed')&&
    document.querySelector('#rightDock')?.classList.contains('closed'));
  assert.deepEqual(await page.evaluate(()=>{
    const shell=JSON.parse(localStorage.getItem('sanci-editor-shell-v2'));
    return {leftOpen:shell.leftOpen,rightOpen:shell.rightOpen,panelActive:shell.panelActive};
  }),{leftOpen:true,rightOpen:false,panelActive:'left'},'choosing the Pages dock from a tablet sheet replaces the stale pre-breakpoint desktop selection');
  await resizeAndWaitForWorkspaceBreakpoint(page,1025,900);
  await page.waitForFunction(()=>!matchMedia('(max-width: 1024px)').matches&&
    !document.querySelector('#leftDock')?.classList.contains('closed')&&
    document.querySelector('#rightDock')?.classList.contains('closed'));
  const restored=await page.evaluate(()=>{
    const canvas=document.querySelector('.canvas-area').getBoundingClientRect();
    const panel=document.querySelector('#leftDock').getBoundingClientRect();
    return {desktop:!matchMedia('(max-width: 1024px)').matches,leftOpen:!document.querySelector('#leftDock').classList.contains('closed'),rightOpen:!document.querySelector('#rightDock').classList.contains('closed'),canvas:{left:canvas.left,right:canvas.right,width:canvas.width},panel:{left:panel.left,right:panel.right},scrollWidth:document.documentElement.scrollWidth};
  });
  assert.deepEqual({desktop:restored.desktop,leftOpen:restored.leftOpen,rightOpen:restored.rightOpen},{desktop:true,leftOpen:true,rightOpen:false},`returning to desktop restores the explicitly selected panel: ${JSON.stringify(restored)}`);
  assert.ok(restored.canvas.width>=400,`returning to desktop reserves canvas and dock tracks: ${JSON.stringify(restored)}`);
  assert.ok(restored.panel.right<=restored.canvas.left+0.5||restored.canvas.right<=restored.panel.left+0.5,`the selected Pages panel does not cover the desktop canvas: ${JSON.stringify(restored)}`);
  assert.equal(restored.scrollWidth,1025);
  assert.deepEqual(writes,[],'switching the viewport and dock sheet never saves or publishes page content');
  assert.deepEqual(errors,[]);
});

test('wide mobile drawer scrim stays behind its panel and closes it from the remaining canvas',async t=>{
  const {page,writes,errors}=await openEditor(t,{width:850,height:900,isMobile:true,hasTouch:true});
  await page.locator('#editorMenu').tap();
  await page.waitForFunction(()=>!document.querySelector('#leftDock')?.classList.contains('closed'));
  const left=await page.evaluate(()=>{
    const panel=document.querySelector('#leftDock').getBoundingClientRect();
    const backdrop=document.querySelector('#mobileBackdrop').getBoundingClientRect();
    return {panelRight:panel.right,backdropWidth:backdrop.width,panelZ:Number(getComputedStyle(document.querySelector('#leftDock')).zIndex),backdropZ:Number(getComputedStyle(document.querySelector('#mobileBackdrop')).zIndex)};
  });
  assert.ok(left.panelRight>0&&left.panelRight<850,`the capped left panel leaves an exposed canvas area: ${JSON.stringify(left)}`);
  assert.equal(left.backdropWidth,850,'the translucent scrim covers the canvas behind the drawer');
  assert.ok(left.panelZ>left.backdropZ,'the open dock remains above the scrim instead of appearing darkened itself');
  await page.mouse.click(700,400);
  await page.waitForFunction(()=>document.querySelector('#leftDock')?.classList.contains('closed'));

  await page.locator('#openInspector').tap();
  await page.waitForFunction(()=>!document.querySelector('#rightDock')?.classList.contains('closed')&&document.querySelector('#leftDock')?.classList.contains('closed'));
  const right=await page.evaluate(()=>{
    const panel=document.querySelector('#rightDock').getBoundingClientRect();
    const backdrop=document.querySelector('#mobileBackdrop').getBoundingClientRect();
    return {panelLeft:panel.left,backdropWidth:backdrop.width,panelZ:Number(getComputedStyle(document.querySelector('#rightDock')).zIndex),backdropZ:Number(getComputedStyle(document.querySelector('#mobileBackdrop')).zIndex)};
  });
  assert.ok(right.panelLeft>0&&right.panelLeft<850,`the capped right panel leaves an exposed canvas area: ${JSON.stringify(right)}`);
  assert.equal(right.backdropWidth,850,'the right drawer scrim covers the canvas behind the panel');
  assert.ok(right.panelZ>right.backdropZ,'the Inspector remains above its scrim');
  await page.mouse.click(100,400);
  await page.waitForFunction(()=>document.querySelector('#rightDock')?.classList.contains('closed'));
  assert.equal(await page.locator('#openInspector').evaluate(element=>document.activeElement===element),true,'closing the wide mobile drawer from the exposed canvas restores focus to the Inspector opener');
  assert.equal(await page.locator('.canvas-area').evaluate(element=>element.inert),false,'closing the scrim releases the canvas for keyboard and touch interaction');
  assert.deepEqual(writes,[],'opening responsive drawers never saves or publishes page content');
  assert.deepEqual(errors,[]);
});

test('mobile drawer scrim returns focus to the latest opener after switching drawer sides',async t=>{
  const {page,writes,errors}=await openEditor(t,{width:850,height:900,isMobile:true,hasTouch:true});
  await page.locator('#editorMenu').tap();
  await page.waitForFunction(()=>!document.querySelector('#leftDock')?.classList.contains('closed'));
  await page.locator('#openInspector').tap();
  await page.waitForFunction(()=>!document.querySelector('#rightDock')?.classList.contains('closed')&&document.querySelector('#leftDock')?.classList.contains('closed'));
  await page.mouse.click(100,400);
  await page.waitForFunction(()=>document.querySelector('#rightDock')?.classList.contains('closed'));
  assert.equal(await page.locator('#openInspector').evaluate(element=>document.activeElement===element),true,'switching to the Inspector makes it the focus-return target for the next scrim close');
  assert.equal(await page.locator('.canvas-area').evaluate(element=>element.inert),false);

  await page.locator('#openInspector').tap();
  await page.waitForFunction(()=>!document.querySelector('#rightDock')?.classList.contains('closed'));
  await page.locator('#editorMenu').tap();
  await page.waitForFunction(()=>!document.querySelector('#leftDock')?.classList.contains('closed')&&document.querySelector('#rightDock')?.classList.contains('closed'));
  await page.mouse.click(700,400);
  await page.waitForFunction(()=>document.querySelector('#leftDock')?.classList.contains('closed'));
  assert.equal(await page.locator('#editorMenu').evaluate(element=>document.activeElement===element),true,'switching to the tool drawer makes its opener the focus-return target for the next scrim close');
  assert.equal(await page.locator('.canvas-area').evaluate(element=>element.inert),false);

  await page.locator('#editorMenu').tap();
  await page.waitForFunction(()=>!document.querySelector('#leftDock')?.classList.contains('closed'));
  await page.locator('#openInspector').tap();
  await page.waitForFunction(()=>!document.querySelector('#rightDock')?.classList.contains('closed')&&document.querySelector('#leftDock')?.classList.contains('closed'));
  await page.locator('#editorMenu').tap();
  await page.waitForFunction(()=>!document.querySelector('#leftDock')?.classList.contains('closed')&&document.querySelector('#rightDock')?.classList.contains('closed'));
  await page.keyboard.press('Escape');
  await page.waitForFunction(()=>document.querySelector('#leftDock')?.classList.contains('closed'));
  assert.equal(await page.locator('#editorMenu').evaluate(element=>document.activeElement===element),true,'switching to the tool drawer also restores its opener when Escape closes it');
  assert.equal(await page.locator('.canvas-area').evaluate(element=>element.inert),false,'Escape releases the canvas after closing the switched drawer');
  assert.deepEqual(writes,[],'switching or closing mobile drawers does not save or publish page content');
  assert.deepEqual(errors,[]);
});

test('mobile drawer close controls keep a 44px touch target on compact phones',async t=>{
  for(const width of [320,390]){
    const {page,writes,errors}=await openEditor(t,{width,height:844,isMobile:true,hasTouch:true});
    for(const side of ['left','right']){
      const opener=page.locator(side==='left'?'#editorMenu':'#openInspector');
      await opener.tap();
      const panel=page.locator(`#${side}Dock`);
      await page.waitForFunction(id=>!document.querySelector(`#${id}`)?.classList.contains('closed'),`${side}Dock`);
      const close=panel.locator('[data-collapse]:visible').first();
      const bounds=await close.boundingBox();
      assert.ok(bounds&&bounds.width>=44&&bounds.height>=44,`${width}px ${side} drawer close control must remain at least 44×44px: ${JSON.stringify(bounds)}`);
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${width}px ${side} drawer keeps the viewport free of horizontal overflow`);
      await close.tap();
      await page.waitForFunction(id=>document.querySelector(`#${id}`)?.classList.contains('closed'),`${side}Dock`);
      assert.equal(await opener.evaluate(element=>document.activeElement===element),true,`${width}px ${side} touch close returns keyboard focus to its opener`);
      await opener.tap();
      await page.waitForFunction(id=>!document.querySelector(`#${id}`)?.classList.contains('closed'),`${side}Dock`);
      await page.keyboard.press('Escape');
      await page.waitForFunction(id=>document.querySelector(`#${id}`)?.classList.contains('closed'),`${side}Dock`);
      assert.equal(await opener.evaluate(element=>document.activeElement===element),true,`${width}px ${side} Escape close returns keyboard focus to its opener`);
    }
    assert.deepEqual(writes,[],`${width}px drawer controls never Save or Publish the page`);
    assert.deepEqual(errors,[],`${width}px drawer controls produce no browser errors`);
  }
});

test('desktop tabbed dock groups become one mobile sheet and restore the exact group on resize',async t=>{
  const {page,writes,errors}=await openEditor(t,{width:1280,height:900});
  for(const [side,active] of [['left','right'],['right','left']]){
    await openPreferences(page);
    await page.locator('#workspaceLayout').selectOption('balanced');
    await page.locator('#workspacePanelMode').selectOption('tabbed');
    await page.locator('#workspacePanelSide').selectOption(side);
    await page.locator('#closeWorkspaceAppearance').click();
    await page.locator(`#workspacePanelTab${active==='left'?'Left':'Right'}`).click();
    await page.waitForFunction(expected=>{
      const workspace=document.querySelector('.workspace');
      return workspace?.dataset.workspacePanelMode==='tabbed'&&workspace?.dataset.workspacePanelSide===expected.side&&workspace?.dataset.workspaceActivePanel===expected.active;
    },{side,active});
    const before=await page.evaluate(active=>({
      shell:localStorage.getItem('sanci-editor-shell-v2'),
      appearance:localStorage.getItem('sanci-editor-workspace-preferences-v2'),
      order:document.querySelector('.workspace').dataset.workspaceDockOrder,
      leftTab:document.querySelector('#workspacePanelTabLeft').getAttribute('aria-selected'),
      rightTab:document.querySelector('#workspacePanelTabRight').getAttribute('aria-selected'),
      canvasWidth:document.querySelector('.canvas-area').getBoundingClientRect().width,
      canvasLeft:document.querySelector('.canvas-area').getBoundingClientRect().left,
      canvasRight:document.querySelector('.canvas-area').getBoundingClientRect().right,
      group:document.querySelector(`#${active}Dock`).getBoundingClientRect().toJSON()
    }),active);
    assert.ok(before.canvasWidth>=400,`${side}: desktop group begins canvas-safe: ${before.canvasWidth}`);
    assert.ok(side==='left'?before.group.right<=before.canvasLeft+0.5:before.group.left>=before.canvasRight-0.5,`${side}: group occupies its physical side before resize: ${JSON.stringify({group:before.group,canvasLeft:before.canvasLeft,canvasRight:before.canvasRight,order:before.order,active})}`);

    await page.setViewportSize({width:390,height:844});
    await page.waitForFunction(()=>{
      const workspace=document.querySelector('.workspace');
      const leftOpen=!document.querySelector('#leftDock')?.classList.contains('closed');
      const rightOpen=!document.querySelector('#rightDock')?.classList.contains('closed');
      return matchMedia('(max-width: 1024px)').matches&&Number(leftOpen)+Number(rightOpen)===1&&
        (leftOpen||rightOpen)&&document.querySelector('.canvas-area')?.inert===true;
    });
    const mobile=await page.evaluate(()=>({
      left:!document.querySelector('#leftDock').classList.contains('closed'),
      right:!document.querySelector('#rightDock').classList.contains('closed'),
      tabDisplay:getComputedStyle(document.querySelector('.workspace-panel-group-tabs')).display,
      groupMode:document.querySelector('.workspace').dataset.workspacePanelMode,
      canvasInert:document.querySelector('.canvas-area').inert,
      scrollWidth:document.documentElement.scrollWidth,
      innerWidth,
      shell:localStorage.getItem('sanci-editor-shell-v2'),
      appearance:localStorage.getItem('sanci-editor-workspace-preferences-v2')
    }));
    assert.ok(Number(mobile.left)+Number(mobile.right)<=1,`${side}: mobile keeps at most one drawer: ${JSON.stringify(mobile)}`);
    assert.equal(mobile.tabDisplay,'none',`${side}: desktop-only group tabs leave the mobile drawer navigation`);
    assert.equal(mobile.groupMode,'tabbed',`${side}: responsive presentation does not rewrite the saved desktop group mode`);
    assert.equal(mobile.canvasInert,true,`${side}: the single drawer protects the canvas from interaction`);
    assert.ok(mobile.scrollWidth<=mobile.innerWidth,`${side}: the mobile workspace has no horizontal overflow`);
    assert.deepEqual({shell:mobile.shell,appearance:mobile.appearance},{shell:before.shell,appearance:before.appearance},`${side}: breakpoint normalization is temporary`);

    await page.setViewportSize({width:1280,height:900});
    await page.waitForFunction(expected=>{
      const workspace=document.querySelector('.workspace');
      return !matchMedia('(max-width: 1024px)').matches&&workspace?.classList.contains('left-open')&&workspace?.classList.contains('right-open')&&
        workspace?.dataset.workspacePanelMode==='tabbed'&&workspace?.dataset.workspacePanelSide===expected.side&&
        workspace?.dataset.workspaceActivePanel===expected.active;
    },{side,active});
    const restored=await page.evaluate(()=>({
      order:document.querySelector('.workspace').dataset.workspaceDockOrder,
      leftTab:document.querySelector('#workspacePanelTabLeft').getAttribute('aria-selected'),
      rightTab:document.querySelector('#workspacePanelTabRight').getAttribute('aria-selected'),
      canvasWidth:document.querySelector('.canvas-area').getBoundingClientRect().width,
      canvasLeft:document.querySelector('.canvas-area').getBoundingClientRect().left,
      canvasRight:document.querySelector('.canvas-area').getBoundingClientRect().right,
      groupSide:document.querySelector('.editor-app').dataset.workspacePanelSide,
      group:document.querySelector(`#${document.querySelector('.workspace').dataset.workspaceActivePanel}Dock`).getBoundingClientRect().toJSON(),
      shell:localStorage.getItem('sanci-editor-shell-v2'),
      appearance:localStorage.getItem('sanci-editor-workspace-preferences-v2')
    }));
    assert.equal(restored.order,before.order,`${side}: desktop dock order restores exactly`);
    assert.equal(restored.leftTab,active==='left'?'true':'false',`${side}: selected left tab restores exactly`);
    assert.equal(restored.rightTab,active==='right'?'true':'false',`${side}: selected right tab restores exactly`);
    assert.equal(restored.groupSide,side,`${side}: dock group returns to its exact side`);
    assert.ok(restored.canvasWidth>=400,`${side}: restored group still leaves 400px of canvas`);
    assert.ok(side==='left'?restored.group.right<=restored.canvasLeft+0.5:restored.group.left>=restored.canvasRight-0.5,`${side}: restored group remains outside the canvas`);
    assert.deepEqual({shell:restored.shell,appearance:restored.appearance},{shell:before.shell,appearance:before.appearance},`${side}: returning to desktop writes no workspace profile`);
  }
  assert.deepEqual(writes,[],'responsive tabbed workspace transitions never Save or Publish the Page Model');
  assert.deepEqual(errors,[]);
});

test('a cross-tab dock update replaces the temporary desktop snapshot made before a mobile breakpoint',async t=>{
  const appearance={version:2,layout:'balanced',theme:'graphite',density:'comfortable',accent:'#5b8cff',dockOrder:'left-canvas-right',panelMode:'tabbed',panelSide:'right',profiles:[]};
  const dock={leftOpen:true,rightOpen:true,leftTab:'pages',leftTabOrder:['pages','elements','layers','schedule','navigation'],inspectorTab:'design',panelActive:'right',leftWidth:310,rightWidth:352};
  const {page,context,writes,errors}=await openEditor(t,{width:1280,height:900,initialDockState:dock,initialAppearance:appearance});
  const second=await context.newPage();
  await second.goto(page.url(),{waitUntil:'load'});
  await second.locator('.page-canvas .node').first().waitFor();

  await resizeAndWaitForWorkspaceBreakpoint(page,390,844);
  await page.waitForFunction(()=>matchMedia('(max-width: 1024px)').matches&&
    document.querySelector('#rightDock')?.classList.contains('closed')===false&&
    document.querySelector('#leftDock')?.classList.contains('closed')===true);

  const remoteDock={...dock,leftOpen:true,rightOpen:false,panelActive:'left'};
  await second.evaluate(value=>localStorage.setItem('sanci-editor-shell-v2',JSON.stringify(value)),remoteDock);
  await page.waitForFunction(()=>document.querySelector('#leftDock')?.classList.contains('closed')===false&&
    document.querySelector('#rightDock')?.classList.contains('closed')===true);

  await resizeAndWaitForWorkspaceBreakpoint(page,1280,900);
  await page.waitForFunction(()=>!matchMedia('(max-width: 1024px)').matches&&
    document.querySelector('.workspace')?.classList.contains('left-open'));
  const restored=await page.evaluate(()=>({
    leftOpen:!document.querySelector('#leftDock').classList.contains('closed'),
    rightOpen:!document.querySelector('#rightDock').classList.contains('closed'),
    active:document.querySelector('.workspace').dataset.workspaceActivePanel,
    stored:JSON.parse(localStorage.getItem('sanci-editor-shell-v2'))
  }));
  assert.deepEqual({leftOpen:restored.leftOpen,rightOpen:restored.rightOpen,active:restored.active},
    {leftOpen:true,rightOpen:false,active:'left'},
    'returning to desktop must respect the latest cross-tab dock state, not the earlier responsive snapshot');
  assert.deepEqual(restored.stored,remoteDock,'responsive restoration must not silently diverge from the latest saved dock state');
  assert.deepEqual(writes,[],'cross-tab responsive synchronization never invokes Page Model Save or Publish');
  assert.deepEqual(errors,[]);
});

test('a cross-tab appearance preset replaces the desktop snapshot while this editor is on mobile',async t=>{
  const appearance={version:2,layout:'balanced',theme:'graphite',density:'comfortable',accent:'#5b8cff',dockOrder:'left-canvas-right',panelMode:'tabbed',panelSide:'right',profiles:[]};
  const dock={leftOpen:true,rightOpen:true,leftTab:'pages',leftTabOrder:['pages','elements','layers','schedule','navigation'],inspectorTab:'design',panelActive:'right',leftWidth:310,rightWidth:352};
  const {page,context,writes,errors}=await openEditor(t,{width:1280,height:900,initialDockState:dock,initialAppearance:appearance});
  const second=await context.newPage();
  await second.goto(page.url(),{waitUntil:'load'});
  await second.locator('.page-canvas .node').first().waitFor();
  await second.evaluate(()=>{
    const setItem=Storage.prototype.setItem;
    Storage.prototype.setItem=function(key,value){
      if(key==='sanci-editor-shell-v2')return;
      return setItem.call(this,key,value);
    };
  });

  await resizeAndWaitForWorkspaceBreakpoint(page,390,844);
  await page.waitForFunction(()=>matchMedia('(max-width: 1024px)').matches&&
    document.querySelector('#rightDock')?.classList.contains('closed')===false);

  await openPreferences(second);
  await second.locator('#workspaceLayout').selectOption('canvas');
  await page.waitForFunction(()=>document.querySelector('.editor-app')?.getAttribute('data-workspace-theme')==='graphite'&&
    document.querySelector('#leftDock')?.classList.contains('closed')&&document.querySelector('#rightDock')?.classList.contains('closed'));
  assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('sanci-editor-shell-v2'))),dock,
    'the fixture leaves the shell key unchanged to isolate the appearance-key storage event');

  await resizeAndWaitForWorkspaceBreakpoint(page,1280,900);
  await page.waitForFunction(()=>!matchMedia('(max-width: 1024px)').matches&&
    document.querySelector('.workspace')?.classList.contains('left-open')===false&&
    document.querySelector('.workspace')?.classList.contains('right-open')===false);
  const restored=await page.evaluate(()=>({
    leftOpen:!document.querySelector('#leftDock').classList.contains('closed'),
    rightOpen:!document.querySelector('#rightDock').classList.contains('closed'),
    layout:document.querySelector('#workspaceLayout')?.value,
    shell:JSON.parse(localStorage.getItem('sanci-editor-shell-v2'))
  }));
  assert.deepEqual({leftOpen:restored.leftOpen,rightOpen:restored.rightOpen,layout:restored.layout},
    {leftOpen:false,rightOpen:false,layout:'canvas'},
    'the latest external appearance preset must take precedence over the old responsive desktop snapshot');
  assert.deepEqual(restored.shell,dock,'receiving a cross-tab preset does not issue a redundant shell-storage write');
  assert.deepEqual(writes,[],'cross-tab appearance presets never invoke Page Model Save or Publish');
  assert.deepEqual(errors,[]);
});

test('a cross-tab desktop profile keeps its complete dock state when applied from another tab on mobile',async t=>{
  const appearance={version:2,layout:'balanced',theme:'graphite',density:'comfortable',accent:'#5b8cff',dockOrder:'left-canvas-right',panelMode:'separate',panelSide:'right',profiles:[]};
  const dock={leftOpen:true,rightOpen:true,leftTab:'pages',leftTabOrder:['pages','elements','layers','schedule','navigation'],inspectorTab:'advanced',panelActive:'right',leftWidth:310,rightWidth:352};
  const {page,context,writes,errors}=await openEditor(t,{width:1280,height:900,initialDockState:dock,initialAppearance:appearance});
  const second=await context.newPage();
  await second.goto(page.url(),{waitUntil:'load'});
  await second.locator('.page-canvas .node').first().waitFor();

  await openPreferences(second);
  await second.locator('#workspaceProfileName').fill('Asztali munkaterület');
  await second.locator('#saveWorkspaceProfile').click();
  const profileId=await second.locator('#workspaceProfile').inputValue();
  assert.ok(profileId,'the second tab saves a desktop profile with both docks open');
  await second.locator('#workspaceLayout').selectOption('canvas');
  await page.waitForFunction(()=>document.querySelector('.editor-app')?.dataset.workspaceTheme==='graphite'&&
    document.querySelector('.workspace')?.dataset.workspaceDockOrder==='left-canvas-right'&&
    document.querySelector('#leftDock')?.classList.contains('closed')&&document.querySelector('#rightDock')?.classList.contains('closed'));

  await resizeAndWaitForWorkspaceBreakpoint(page,390,844);
  await second.locator('#workspaceProfile').selectOption(profileId);
  await second.locator('#loadWorkspaceProfile').click();
  await page.waitForFunction(()=>document.querySelector('.editor-app')?.dataset.workspaceTheme==='graphite'&&
    document.querySelector('#rightDock')?.classList.contains('closed')===false&&
    document.querySelector('#leftDock')?.classList.contains('closed')===true);
  assert.equal(await page.locator('.canvas-area').evaluate(element=>element.inert),true,'a single mobile drawer keeps the canvas behind its backdrop');

  await resizeAndWaitForWorkspaceBreakpoint(page,1280,900);
  await page.waitForFunction(()=>!matchMedia('(max-width: 1024px)').matches&&
    document.querySelector('#leftDock')?.classList.contains('closed')===false&&
    document.querySelector('#rightDock')?.classList.contains('closed')===false);
  const restored=await page.evaluate(()=>({
    leftOpen:!document.querySelector('#leftDock').classList.contains('closed'),
    rightOpen:!document.querySelector('#rightDock').classList.contains('closed'),
    inspectorTab:JSON.parse(localStorage.getItem('sanci-editor-shell-v2'))?.inspectorTab,
    stored:JSON.parse(localStorage.getItem('sanci-editor-shell-v2'))
  }));
  assert.deepEqual(restored,{leftOpen:true,rightOpen:true,inspectorTab:'advanced',stored:dock},'returning to desktop restores the full profile state rather than the one-drawer mobile normalization');
  assert.deepEqual(writes,[],'cross-tab profile application never invokes Page Model Save or Publish');
  assert.deepEqual(errors,[]);
});

test('a cross-tab dock update cancels an in-progress pointer resize before stale width can be saved',async t=>{
  const appearance={version:2,layout:'balanced',theme:'graphite',density:'comfortable',accent:'#5b8cff',dockOrder:'left-canvas-right',panelMode:'separate',panelSide:'right',profiles:[]};
  const dock={leftOpen:true,rightOpen:true,leftTab:'pages',leftTabOrder:['pages','elements','layers','schedule','navigation'],inspectorTab:'design',panelActive:'left',leftWidth:310,rightWidth:352};
  const {page,context,writes,errors}=await openEditor(t,{width:1440,height:900,initialDockState:dock,initialAppearance:appearance});
  const second=await context.newPage();
  await second.goto(page.url(),{waitUntil:'load'});
  await second.locator('.page-canvas .node').first().waitFor();

  const handle=page.locator('#leftDock .left-resizer');
  const box=await handle.boundingBox();
  assert.ok(box,'the receiving editor has a visible desktop resize handle');
  const startX=box.x+box.width/2,startY=box.y+box.height/2;
  await page.mouse.move(startX,startY);
  await page.mouse.down();
  await page.waitForFunction(()=>document.body.classList.contains('resizing-dock'));
  await page.mouse.move(startX+40,startY);
  await page.waitForFunction(()=>document.querySelector('.left-resizer')?.getAttribute('aria-valuenow')==='350');

  const remote={...dock,leftWidth:400,rightWidth:352};
  await second.evaluate(value=>localStorage.setItem('sanci-editor-shell-v2',JSON.stringify(value)),remote);
  await page.waitForFunction(()=>document.querySelector('.left-resizer')?.getAttribute('aria-valuenow')==='400');
  assert.equal(await page.locator('body').evaluate(element=>element.classList.contains('resizing-dock')),false,'a remote workspace update cancels the active local pointer gesture');

  await page.mouse.move(startX+100,startY);
  await page.mouse.up();
  assert.equal(await handle.getAttribute('aria-valuenow'),'400','the canceled pointer cannot overwrite the newer shared width');
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('sanci-editor-shell-v2'))?.leftWidth),400,'the newest cross-tab width remains persisted after the stale pointer is released');
  assert.match(await page.locator('#workspaceDockStatus').textContent(),/másik szerkesztőlapon.*átméretezés megszakadt/iu,'the receiving tab explains why the resize ended');
  assert.deepEqual(writes,[],'cross-tab dock synchronization never saves or publishes page content');
  assert.deepEqual(errors,[]);
});

test('a responsive breakpoint cancels an in-progress dock resize without persisting its temporary width',async t=>{
  const {page,writes,errors}=await openEditor(t,{width:1440,height:900});
  await openPreferences(page);
  await page.locator('#workspaceLayout').selectOption('balanced');
  await page.locator('#closeWorkspaceAppearance').click();
  const handle=page.locator('#leftDock .left-resizer');
  const box=await handle.boundingBox();
  assert.ok(box,'the desktop dock has a reachable resize handle');
  const startX=box.x+box.width/2,startY=box.y+box.height/2;
  await page.mouse.move(startX,startY);
  await page.mouse.down();
  await page.waitForFunction(()=>document.body.classList.contains('resizing-dock'));
  await page.mouse.move(startX+32,startY);
  await page.waitForFunction(()=>document.querySelector('.left-resizer')?.getAttribute('aria-valuenow')==='342');

  await resizeAndWaitForWorkspaceBreakpoint(page,390,844);
  assert.equal(await page.locator('body').evaluate(element=>element.classList.contains('resizing-dock')),false,'the desktop resize ends when the mobile drawer shell takes over');
  await page.mouse.move(startX+100,startY);
  await page.mouse.up();
  assert.equal(await handle.getAttribute('aria-valuenow'),'310','the canceled desktop gesture reverts to its last saved width');

  await resizeAndWaitForWorkspaceBreakpoint(page,1440,900);
  await page.waitForFunction(()=>document.querySelector('#leftDock')?.classList.contains('closed')===false&&document.querySelector('#rightDock')?.classList.contains('closed')===false);
  assert.equal(await handle.getAttribute('aria-valuenow'),'310','desktop restoration does not revive the temporary mobile pointer width');
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('sanci-editor-shell-v2'))?.leftWidth),310,'a breakpoint-only cancellation does not persist an intermediate desktop width');
  assert.match(await page.locator('#workspaceDockStatus').textContent(),/képernyőméret változott.*panel átméretezése megszakadt/iu);
  assert.deepEqual(writes,[],'responsive dock cancellation never saves or publishes page content');
  assert.deepEqual(errors,[]);
});

test('canceling a resize from a viewport-clamped maximum restores the saved desktop preference',async t=>{
  const dock={leftOpen:true,rightOpen:true,leftTab:'pages',leftTabOrder:['pages','elements','layers','schedule','navigation'],inspectorTab:'design',panelActive:'left',leftWidth:460,rightWidth:440};
  const appearance={version:2,layout:'balanced',theme:'graphite',density:'comfortable',accent:'#5b8cff',dockOrder:'left-canvas-right',panelMode:'separate',panelSide:'right',profiles:[]};
  const {page,writes,errors}=await openEditor(t,{width:1025,height:900,initialDockState:dock,initialAppearance:appearance});
  const handle=page.locator('#leftDock .left-resizer');
  const before=await page.evaluate(()=>({
    actual:document.querySelector('#leftDock').getBoundingClientRect().width,
    stored:JSON.parse(localStorage.getItem('sanci-editor-shell-v2'))?.leftWidth
  }));
  assert.equal(before.stored,460);
  assert.equal(before.actual,312.5,'the narrow desktop applies its canvas-safe track cap without replacing the saved preference');

  const box=await handle.boundingBox();
  assert.ok(box,'the constrained desktop splitter remains reachable');
  const x=box.x+box.width/2,y=box.y+box.height/2;
  await page.mouse.move(x,y);
  await page.mouse.down();
  await page.waitForFunction(()=>document.body.classList.contains('resizing-dock'));
  await page.mouse.move(x-16,y);
  await page.waitForFunction(()=>Number(document.querySelector('#leftDock .left-resizer')?.getAttribute('aria-valuenow'))===296.5);

  await resizeAndWaitForWorkspaceBreakpoint(page,390,844);
  assert.equal(await page.locator('body').evaluate(element=>element.classList.contains('resizing-dock')),false,'the viewport change safely cancels the active gesture');
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('sanci-editor-shell-v2'))?.leftWidth),460,'canceling restores the previously saved width instead of committing the temporary cap');
  await page.mouse.up();

  await resizeAndWaitForWorkspaceBreakpoint(page,1025,900);
  const restored=await page.evaluate(()=>({
    actual:document.querySelector('#leftDock').getBoundingClientRect().width,
    value:Number(document.querySelector('#leftDock .left-resizer').getAttribute('aria-valuenow')),
    stored:JSON.parse(localStorage.getItem('sanci-editor-shell-v2'))?.leftWidth,
    canvas:document.querySelector('.canvas-area').getBoundingClientRect().width
  }));
  assert.equal(restored.actual,312.5);
  assert.equal(restored.value,312.5,'the splitter continues to expose the actual viewport-constrained width');
  assert.equal(restored.stored,460,'restoration retains the saved preference for a wider desktop');
  assert.ok(restored.canvas>=400,`the canvas remains usable after restoration: ${JSON.stringify(restored)}`);
  assert.deepEqual(writes,[],'canceling responsive workspace changes never Saves or Publishes page content');
  assert.deepEqual(errors,[]);
});

test('a saved two-dock custom workspace starts canvas-first on mobile and restores on desktop',async t=>{
  const dock={leftOpen:true,rightOpen:true,leftTab:'pages',leftTabOrder:['pages','elements','layers','schedule','navigation'],inspectorTab:'design',panelActive:'left',leftWidth:310,rightWidth:352};
  const appearance={version:2,layout:'custom',theme:'graphite',density:'comfortable',accent:'#5b8cff',dockOrder:'left-canvas-right',panelMode:'tabbed',panelSide:'right',profiles:[]};
  const {page,writes,errors}=await openEditor(t,{width:390,height:844,isMobile:true,hasTouch:true,initialDockState:dock,initialAppearance:appearance});
  await page.waitForFunction(()=>document.documentElement.dataset.editorBoot==='ready');
  const mobile=await page.evaluate(appearanceKey=>({
    left:!document.querySelector('#leftDock').classList.contains('closed'),
    right:!document.querySelector('#rightDock').classList.contains('closed'),
    tabsDisplay:getComputedStyle(document.querySelector('.workspace-panel-group-tabs')).display,
    canvasInert:document.querySelector('.canvas-area').inert,
    dock:JSON.parse(localStorage.getItem('sanci-editor-shell-v2')),
    appearance:JSON.parse(localStorage.getItem(appearanceKey)),
  }),WORKSPACE_PREFERENCES_KEY);
  assert.equal(Number(mobile.left)+Number(mobile.right),0,'mobile startup preserves the canvas-first workspace even when the saved desktop group keeps both panes');
  assert.equal(mobile.tabsDisplay,'none','desktop tab controls are not used as mobile drawer navigation');
  assert.equal(mobile.canvasInert,false,'the canvas remains interactive when no mobile drawer is open');
  assert.deepEqual(mobile.dock,dock,'mobile startup does not rewrite the saved desktop dock state');
  assert.deepEqual(mobile.appearance,appearance,'mobile startup does not rewrite workspace preferences');

  await page.setViewportSize({width:1280,height:900});
  await page.waitForFunction(()=>!matchMedia('(max-width: 1024px)').matches&&
    document.querySelector('.workspace')?.classList.contains('left-open')&&
    document.querySelector('.workspace')?.classList.contains('right-open')&&
    document.querySelector('.workspace')?.dataset.workspacePanelMode==='tabbed');
  assert.equal(await page.locator('#workspacePanelTabLeft').getAttribute('aria-selected'),'true','the exact selected desktop group tab is restored');
  assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('sanci-editor-shell-v2'))),dock);
  assert.deepEqual(writes,[],'responsive startup and restoration never Save or Publish page content');
  assert.deepEqual(errors,[]);
});

test('mobile touch-sized dock-order control keeps one safe drawer and restores the selected desktop order',async t=>{
  const {page,writes,errors}=await openEditor(t,{width:390,height:844,isMobile:true,hasTouch:true});
  await openPreferences(page);
  const order=page.locator('#workspaceDockOrder');
  assert.equal(await order.isVisible(),true,'dock order remains available in the mobile workspace dialog');
  const control=await order.boundingBox();
  assert.ok(control&&control.height>=44,`the native order selector keeps a touch-sized target: ${JSON.stringify(control)}`);
  await order.tap();
  await order.selectOption('right-canvas-left');
  await page.waitForFunction(()=>JSON.parse(localStorage.getItem('sanci-editor-workspace-preferences-v2'))?.dockOrder==='right-canvas-left');
  assert.match(await page.locator('#workspaceAppearanceStatus').textContent(),/Kis képernyőn a mobil fiók elrendezése marad/iu,'the settings explain that desktop ordering does not replace the mobile drawer');
  assert.deepEqual(writes,[],'mobile workspace ordering never invokes the Page Model Save or Publish APIs');
  await page.locator('#closeWorkspaceAppearance').tap();

  await page.locator('#editorMenu').tap();
  await page.waitForFunction(()=>document.querySelector('#leftDock')?.classList.contains('closed')===false);
  await page.locator('#openInspector').tap();
  await page.waitForFunction(()=>document.querySelector('#rightDock')?.classList.contains('closed')===false);
  const drawer=await page.evaluate(()=>({
    left:!document.querySelector('#leftDock').classList.contains('closed'),
    right:!document.querySelector('#rightDock').classList.contains('closed'),
    canvasInert:document.querySelector('.canvas-area').inert,
    scrollWidth:document.documentElement.scrollWidth,
    innerWidth
  }));
  assert.deepEqual({left:drawer.left,right:drawer.right},{left:false,right:true},`mobile panel switching stays a single drawer: ${JSON.stringify(drawer)}`);
  assert.equal(drawer.canvasInert,true,'the visible drawer keeps the background canvas inert');
  assert.ok(drawer.scrollWidth<=drawer.innerWidth,'the mobile layout has no horizontal overflow');
  const mobileStorage=await page.evaluate(()=>({
    shell:localStorage.getItem('sanci-editor-shell-v2'),
    appearance:JSON.parse(localStorage.getItem('sanci-editor-workspace-preferences-v2'))
  }));
  assert.equal(mobileStorage.appearance.dockOrder,'right-canvas-left');

  await page.setViewportSize({width:1025,height:900});
  await page.waitForFunction(()=>!matchMedia('(max-width: 1024px)').matches&&document.querySelector('.workspace')?.dataset.workspaceDockOrder==='right-canvas-left');
  const desktop=await page.evaluate(()=>{
    const rect=selector=>{const value=document.querySelector(selector).getBoundingClientRect();return {left:value.left,right:value.right,width:value.width}};
    const canvas=rect('.canvas-area'),left=rect('#leftDock'),right=rect('#rightDock');
    return {
      order:document.querySelector('.workspace').dataset.workspaceDockOrder,
      canvas,left,right,
      shell:localStorage.getItem('sanci-editor-shell-v2'),
      appearance:localStorage.getItem('sanci-editor-workspace-preferences-v2')
    };
  });
  assert.equal(desktop.order,'right-canvas-left','the saved mobile selector choice becomes the desktop CSS Grid order');
  assert.ok(desktop.canvas.width>=400,`the restored desktop order keeps a usable canvas: ${JSON.stringify(desktop)}`);
  assert.ok([desktop.left,desktop.right].filter(dock=>dock.width>0).every(dock=>dock.right<=desktop.canvas.left+0.5||dock.left>=desktop.canvas.right-0.5),'any open desktop dock stays physically outside the canvas');
  assert.deepEqual({shell:desktop.shell,appearance:desktop.appearance},{shell:mobileStorage.shell,appearance:JSON.stringify(mobileStorage.appearance)},'responsive restoration adds no workspace writes beyond the explicit selection and panel choice');
  assert.deepEqual(writes,[]);
  assert.deepEqual(errors,[]);
});

test('compact phone keeps every desktop dock order reachable without changing the mobile drawer model',async t=>{
  const {page,writes,errors}=await openEditor(t,{width:320,height:568,isMobile:true,hasTouch:true});
  await openPreferences(page);
  const order=page.locator('#workspaceDockOrder');
  assert.equal(await order.isVisible(),true,'the desktop order setting remains reachable on a compact phone');
  assert.equal(await order.isEnabled(),true);
  const bounds=await order.boundingBox();
  assert.ok(bounds&&bounds.width>0&&bounds.height>=44&&bounds.x>=0&&bounds.x+bounds.width<=320,`the touch target fits the compact phone viewport: ${JSON.stringify(bounds)}`);
  const allowed=['left-canvas-right','canvas-left-right','left-right-canvas','right-left-canvas','right-canvas-left','canvas-right-left'];
  assert.deepEqual(await order.locator('option').evaluateAll(options=>options.map(option=>option.value)),allowed,'the compact mobile control exposes exactly the six supported dock orders');
  await order.tap();
  for(const value of [...allowed.slice(1),allowed[0]]){
    await order.selectOption(value);
    await page.waitForFunction(expected=>JSON.parse(localStorage.getItem('sanci-editor-workspace-preferences-v2'))?.dockOrder===expected,value);
    assert.equal(await order.inputValue(),value,`the phone control applies ${value}`);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${value} keeps the compact page free from horizontal overflow`);
  }
  const state=await page.evaluate(()=>({
    order:JSON.parse(localStorage.getItem('sanci-editor-workspace-preferences-v2'))?.dockOrder,
    leftOpen:!document.querySelector('#leftDock').classList.contains('closed'),
    rightOpen:!document.querySelector('#rightDock').classList.contains('closed'),
    canvasInert:document.querySelector('.canvas-area').inert
  }));
  assert.equal(state.order,allowed[0]);
  assert.ok(!(state.leftOpen&&state.rightOpen),'desktop order choices do not open both mobile drawers');
  if(state.leftOpen||state.rightOpen)assert.equal(state.canvasInert,true,'an active compact-phone drawer keeps the page background inert');
  assert.deepEqual(writes,[],'changing desktop layout preferences never Save or Publish page data');
  assert.deepEqual(errors,[]);
});
