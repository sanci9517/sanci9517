import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve,extname} from 'node:path';
import test from 'node:test';
import {chromium} from 'playwright';
import {createDocument} from '../../public/editor-v2/core/schema.js';
import {EDITOR_ACTIONS} from '../../public/editor-v2/ui/action-catalog.js';

const root=resolve(import.meta.dirname,'../../public');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml'};
function createFixtureServer(){
  const document=createDocument();
  const pageId=document.activePageId;
  const draft=structuredClone(document);
  const editorWrites=[];
  const server=createServer(async(req,res)=>{
    const url=new URL(req.url,'http://localhost');
    const json=data=>{res.setHeader('content-type','application/json; charset=utf-8');res.end(JSON.stringify(data))};
    if(url.pathname==='/api/admin/pages')return json({ok:true,data:[{id:pageId,slug:'editor-proba',title:'Próbaoldal',content:draft,revision:1,isPublished:false}]});
    if(url.pathname==='/api/admin/editor'){
      if(req.method==='GET')return json({ok:true,data:{page:{id:pageId,document:draft,publishedRevisionId:null},revisions:[]}});
      let body='';for await(const chunk of req)body+=chunk;editorWrites.push(JSON.parse(body));
      return json({ok:true,data:{pageId,version:2,revisionId:'test-revision',published:false}});
    }
    if(url.pathname==='/api/integrations/twitch/connection')return json({ok:true,data:{connected:false}});
    if(url.pathname==='/api/public/navigation')return json({ok:true,data:{items:[]}});
    if(url.pathname.startsWith('/api/'))return json({ok:true,data:{}});
    const file=resolve(root,'.'+url.pathname);
    if(!file.startsWith(root+'/')){res.writeHead(403).end();return}
    try{res.setHeader('content-type',mime[extname(file)]||'application/octet-stream');res.end(await readFile(file))}
    catch{res.writeHead(404).end()}
  });
  return {server,editorWrites};
}
async function startBrowser(t){
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
  t.after(()=>browser.close());
  return browser;
}
async function openEditor(t,{width,height,isMobile=false,hasTouch=false}={}){
  const fixture=createFixtureServer();
  await new Promise(done=>fixture.server.listen(0,'127.0.0.1',done));
  t.after(()=>new Promise(done=>fixture.server.close(done)));
  const browser=await startBrowser(t);
  const context=await browser.newContext({viewport:{width,height},isMobile,hasTouch});
  t.after(()=>context.close());
  const page=await context.newPage();page.setDefaultTimeout(8000);
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(`http://127.0.0.1:${fixture.server.address().port}/editor-v2/index.html`,{waitUntil:'load'});
  await page.locator('.page-canvas .node').first().waitFor();
  return {...fixture,page,errors};
}

test('desktop actions show persistent, dismissible plain-language explanations on hover and focus',async t=>{
  const {page,errors}=await openEditor(t,{width:1366,height:900});
  const layers=page.locator('#leftTabLayers');
  assert.equal(await layers.getAttribute('data-editor-icon'),EDITOR_ACTIONS.layers.icon);
  assert.equal(await page.locator('#leftTabNavigation').getAttribute('data-editor-icon'),EDITOR_ACTIONS.navigation.icon);
  assert.notEqual(await layers.getAttribute('data-editor-icon'),await page.locator('#leftTabNavigation').getAttribute('data-editor-icon'));
  const tooltip=page.locator('#editorActionTooltip');
  await layers.hover();
  await tooltip.waitFor({state:'visible'});
  assert.equal((await tooltip.textContent()).trim(),EDITOR_ACTIONS.layers.description);
  assert.equal(await tooltip.evaluate(element=>getComputedStyle(element).pointerEvents),'none','a visible tooltip must not block the Editor controls beneath it');
  assert.ok((await layers.getAttribute('aria-describedby')).split(/\s+/u).includes('editorActionTooltip'));
  const tooltipBox=await tooltip.boundingBox();
  await page.mouse.move(tooltipBox.x+tooltipBox.width/2,tooltipBox.y+tooltipBox.height/2);
  await page.waitForTimeout(500);
  assert.equal(await tooltip.isVisible(),true,'the pointer can move onto and read the explanation');
  await page.locator('#leftTabNavigation').click();
  assert.equal(await page.locator('#leftPanelNavigation').isVisible(),true,'a visible explanation never intercepts another panel action');
  const menu=page.locator('#editorMenu');
  assert.equal(await menu.getAttribute('data-editor-action'),'closeLeftPanel','the menu icon reflects its open panel state');
  assert.equal(await menu.getAttribute('aria-label'),EDITOR_ACTIONS.closeLeftPanel.label);
  await menu.click();
  assert.equal(await menu.getAttribute('data-editor-action'),'openLeftPanel','closing the panel changes back to the open action');
  await menu.click();
  assert.equal(await menu.getAttribute('data-editor-action'),'closeLeftPanel','reopening the panel restores the close action');
  const inspectorToggle=page.locator('#openInspector');
  assert.equal(await inspectorToggle.getAttribute('data-editor-action'),'openRightPanel');
  await inspectorToggle.click();
  assert.equal(await inspectorToggle.getAttribute('data-editor-action'),'closeRightPanel','Inspector toggle explains that it can now close settings');
  await inspectorToggle.click();
  assert.equal(await inspectorToggle.getAttribute('data-editor-action'),'openRightPanel');
  await page.keyboard.press('Escape');
  assert.equal(await tooltip.isVisible(),false,'Escape dismisses the hover explanation');
  assert.ok(!(await layers.getAttribute('aria-describedby')).split(/\s+/u).includes('editorActionTooltip'));

  await page.locator('#save').focus();
  await tooltip.waitFor({state:'visible'});
  assert.equal((await tooltip.textContent()).trim(),EDITOR_ACTIONS.saveDraft.description);
  assert.ok((await page.locator('#save').getAttribute('aria-describedby')).includes('editor-action-description-saveDraft'));
  assert.equal(await page.locator('#save').getAttribute('aria-label'),null,'a visible safe-action label stays visible');
  assert.equal(await page.locator('#publish').getAttribute('aria-label'),null,'Publish stays visibly distinct from Save');
  await page.keyboard.press('Escape');
  assert.equal(await tooltip.isVisible(),false);
  assert.deepEqual(errors,[],'the shell and its icon/help modules produce no browser error');
});

test('mobile touch has a visible contextual explanation and a readable selected panel without hover',async t=>{
  const {page,editorWrites,errors}=await openEditor(t,{width:390,height:850,isMobile:true,hasTouch:true});
  assert.equal(await page.evaluate(()=>matchMedia('(pointer: coarse)').matches),true,'the browser must exercise a real coarse-pointer media context');
  await page.locator('#editorMenu').tap();
  assert.equal(await page.locator('#editorMenu').getAttribute('data-editor-action'),'closeLeftPanel','touch help switches to the actual open-panel action');
  assert.equal(await page.locator('#mobileActionHelp').getAttribute('data-action'),'closeLeftPanel');
  assert.match(await page.locator('#mobileActionHelp').textContent(),/bezárása/u);
  const navigation=page.locator('#leftTabNavigation');
  await navigation.tap();
  assert.equal(await page.locator('#leftPanelNavigation').isVisible(),true);
  assert.match(await page.locator('#leftPanelNavigation .panel-subtitle').textContent(),/Szerkeszd a látogatóknak látható menü piszkozatát/u,
    'the selected mobile sheet says what the panel edits');

  await page.locator('#editorMenu').tap();
  const pan=page.locator('#panTool');
  await pan.tap();
  assert.equal(await pan.getAttribute('data-editor-icon'),EDITOR_ACTIONS.panTool.icon);
  const help=page.locator('#mobileActionHelp');
  assert.equal(await help.isVisible(),true,'touch reveals an inline explanation without hover');
  assert.equal((await help.textContent()).replace(/\s+/gu,' ').trim(),`${EDITOR_ACTIONS.panTool.label}: ${EDITOR_ACTIONS.panTool.description}`);
  assert.equal(await page.locator('#editorActionTooltip').isVisible(),false,'mobile does not depend on a desktop hover bubble');
  const target=await pan.boundingBox();
  assert.ok(target.width>=44&&target.height>=44,'the pan control remains a practical touch target');
  assert.deepEqual(editorWrites,[],'opening panels and reading action help does not save, publish, or mutate the page');
  assert.deepEqual(errors,[],'the touch interaction produces no browser error');
});
