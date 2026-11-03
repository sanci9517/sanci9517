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
  const page=await context.newPage();page.setDefaultTimeout(8000);
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(`http://127.0.0.1:${fixture.server.address().port}/editor-v2/index.html`,{waitUntil:'load'});
  await page.locator('.page-canvas .node').first().waitFor();
  return {...fixture,page,context,errors};
}

async function openPreferences(page){
  await page.locator('.more-actions summary').click();
  await page.locator('#openWorkspaceAppearance').click();
  await page.locator('#workspaceAppearanceDialog[open]').waitFor();
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
  assert.deepEqual(saved,{version:2,layout:'inspector',theme:'aurora',density:'compact',accent:'#00a7c8',dockOrder:'left-canvas-right',profiles:[]});
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
  await page.locator('#closeWorkspaceAppearance').click();
  const result=await page.evaluate(key=>{
    const handle=document.querySelector('#leftDock .dock-heading');
    const target=document.querySelector('.canvas-area');
    const point=target.getBoundingClientRect();
    const clientX=point.left+point.width-4;
    const dataTransfer=new DataTransfer();
    handle.dispatchEvent(new DragEvent('dragstart',{bubbles:true,cancelable:true,dataTransfer}));
    target.dispatchEvent(new DragEvent('dragover',{bubbles:true,cancelable:true,dataTransfer,clientX}));
    target.dispatchEvent(new DragEvent('drop',{bubbles:true,cancelable:true,dataTransfer,clientX}));
    handle.dispatchEvent(new DragEvent('dragend',{bubbles:true,cancelable:true,dataTransfer}));
    const workspace=document.querySelector('.workspace');
    return {order:workspace.dataset.workspaceDockOrder,areas:getComputedStyle(workspace).gridTemplateAreas,left:document.querySelector('#leftDock').getBoundingClientRect().left,canvas:target.getBoundingClientRect().left,dragHint:handle.getAttribute('draggable'),saved:JSON.parse(localStorage.getItem(key))?.dockOrder};
  },WORKSPACE_PREFERENCES_KEY);
  assert.equal(result.order,'canvas-left-right');
  assert.ok(result.left>result.canvas,'dropping the panel after the canvas moves its dock slot after the canvas');
  assert.match(result.areas,/"canvas left right"/u);
  assert.equal(result.dragHint,'true','desktop dock title is draggable');
  assert.equal(result.saved,'canvas-left-right','the drag operation persists only the local workspace preference');
  assert.deepEqual(writes,[],'desktop workspace drag never invokes Page Model Save or Publish');
  assert.deepEqual(errors,[]);
});

test('desktop dock separators resize by keyboard, announce width and finish interrupted pointer drags safely',async t=>{
  const {page,writes,errors}=await openEditor(t,{width:1440,height:900});
  await openPreferences(page);
  await page.locator('#workspaceLayout').selectOption('balanced');
  await page.locator('#closeWorkspaceAppearance').click();
  await page.locator('#workspaceAppearanceDialog[open]').waitFor({state:'hidden'});
  await page.locator('.more-actions').evaluate(element=>element.removeAttribute('open'));

  const left=page.locator('.left-resizer');
  assert.equal(await left.getAttribute('role'),'separator');
  assert.equal(await left.getAttribute('aria-orientation'),'vertical');
  assert.equal(await left.getAttribute('aria-controls'),'leftDock');
  assert.equal(await left.getAttribute('aria-valuenow'),'310');
  await left.focus();
  assert.equal(await left.evaluate(element=>document.activeElement===element),true,'the separator receives keyboard focus after leaving workspace preferences');
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
  await page.locator('.more-actions summary').click();
  await page.locator('#openWorkspaceAppearance').click();
  await page.locator('#workspaceAppearanceDialog[open]').waitFor();
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

  await second.locator('#workspaceDockOrder').selectOption('canvas-right-left');
  await page.waitForFunction(()=>document.querySelector('.workspace')?.dataset.workspaceDockOrder==='canvas-right-left');
  assert.equal(await page.locator('#workspaceDockOrder').inputValue(),'canvas-right-left','the dock-order preference is shared across open tabs');

  await second.locator('#workspaceProfileName').fill('Másik lap nézete');
  await second.locator('#saveWorkspaceProfile').click();
  await page.waitForFunction(()=>document.querySelector('#workspaceProfile')?.options.length===2);
  assert.equal(await page.locator('#workspaceProfile option').last().textContent(),'Másik lap nézete','saved profiles become available in other open tabs');
  assert.equal(await page.locator('#workspaceProfile').inputValue(),'','receiving the profile does not apply it unexpectedly');
  assert.deepEqual(writes,[],'workspace synchronization never invokes Page Model Save or Publish');
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
