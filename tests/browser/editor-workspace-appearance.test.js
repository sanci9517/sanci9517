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
  assert.deepEqual(saved,{version:1,layout:'inspector',theme:'aurora',density:'compact',accent:'#00a7c8'});
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
