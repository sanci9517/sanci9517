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
  return {...fixture,page,errors};
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
  const {page,writes,errors}=await openEditor(t,{width:390,height:850,isMobile:true,hasTouch:true});
  await openPreferences(page);
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
