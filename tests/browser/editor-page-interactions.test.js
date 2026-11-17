import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { chromium } from 'playwright';
import { createDocument } from '../../public/editor-v2/core/schema.js';
import { createEditorState, activePage } from '../../public/editor-v2/core/state.js';
import { execute } from '../../public/editor-v2/core/commands.js';

test('EDT-039 typed page actions save as draft, survive reload, and run only after separate Publish', async t => {
  const state=createEditorState(createDocument()), pageId=state.document.activePageId, rootId=activePage(state).rootId;
  execute(state,{type:'element.add',payload:{type:'button',parentId:rootId,name:'Ugrás',style:{width:'220px',height:'60px'}}});
  const buttonId=state.selection.primaryId;
  execute(state,{type:'content.properties.set',payload:{nodeId:buttonId,patch:{text:'Ugrás',href:'',ariaLabel:'Ugrás a tartalomhoz'}}});
  execute(state,{type:'element.add',payload:{type:'tabs',parentId:rootId,name:'Bemutató fülek'}});
  const tabsId=state.selection.primaryId;
  execute(state,{type:'content.properties.set',payload:{nodeId:tabsId,patch:{ariaLabel:'Bemutató',items:[{title:'Első',text:'Első lap'},{title:'Második',text:'Második lap'}]}}});
  execute(state,{type:'element.add',payload:{type:'heading',parentId:rootId,name:'Cél címsor'}});
  const headingId=state.selection.primaryId;
  execute(state,{type:'content.properties.set',payload:{nodeId:headingId,patch:{text:'A tartalom kezdete',level:'2'}}});
  execute(state,{type:'element.add',payload:{type:'accordion',parentId:rootId,name:'Részletek'}});
  const disclosureId=state.selection.primaryId;
  execute(state,{type:'content.properties.set',payload:{nodeId:disclosureId,patch:{ariaLabel:'Részletek',items:[{title:'További információ',text:'Részletes tartalom'}]}}});
  let draft=structuredClone(state.document),published=structuredClone(state.document),revision=1;const posts=[];
  const root=resolve(import.meta.dirname,'../../public');
  const server=createServer(async(req,res)=>{
    const url=new URL(req.url,'http://localhost'),json=data=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(data))};
    if(url.pathname==='/api/admin/editor'){
      if(req.method==='GET')return json({ok:true,data:{page:{id:pageId,document:draft,publishedRevisionId:'published'},revisions:[{id:'revision-'+revision,version:revision}]}});
      let body='';for await(const chunk of req)body+=chunk;const payload=JSON.parse(body);posts.push(payload);draft=structuredClone(payload.document);revision++;if(payload.publish)published=structuredClone(draft);return json({ok:true,data:{pageId,version:revision,revisionId:'revision-'+revision}});
    }
    if(url.pathname==='/api/admin/pages')return json({ok:true,data:[{id:pageId,slug:'page-actions',title:'Page Actions',revision,isPublished:true}]});
    if(url.pathname==='/api/public/pages')return json({ok:true,data:{id:pageId,slug:url.searchParams.get('slug')||'page-actions',title:'Page Actions',content:url.searchParams.get('preview')==='1'?draft.pages[pageId]:published.pages[pageId]}});
    if(url.pathname==='/api/public/navigation')return json({ok:true,data:{items:[]}});
    if(url.pathname==='/api/public/presentation')return json({ok:true,data:{tokens:{}}});
    if(url.pathname.startsWith('/api/'))return json({ok:true,data:{siteName:'Test'}});
    const path=url.pathname.startsWith('/p/')?'/visual-page.html':url.pathname;
    const file=resolve(root,'.'+path);if(!file.startsWith(root+'/'))return res.writeHead(403).end();
    try{res.setHeader('content-type',{'.html':'text/html','.js':'text/javascript','.css':'text/css'}[extname(file)]||'application/octet-stream');res.end(await readFile(file))}catch{return res.writeHead(404).end()}
  });
  await new Promise(done=>server.listen(0,'127.0.0.1',done));
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(process.env.CI?undefined:'/usr/bin/chromium'),args:['--no-sandbox']});
  t.after(async()=>{await browser.close();await new Promise(done=>server.close(done))});
  const base=`http://127.0.0.1:${server.address().port}`,editor=await browser.newPage(),live=await browser.newPage(),errors=[];
  editor.on('pageerror',error=>errors.push('editor: '+error.message));live.on('pageerror',error=>errors.push('public: '+error.message));
  const editorNode=id=>editor.locator(`.node[data-node-id="${id}"]`),liveNode=id=>live.locator(`.creator-node[data-node-id="${id}"]`);
  const selectButton=async()=>{await editorNode(buttonId).waitFor({state:'attached'});await editorNode(buttonId).evaluate(el=>el.click());if(await editor.locator('#rightDock').evaluate(el=>el.classList.contains('closed')))await editor.locator('#openInspector').click();await editor.locator('.inspector-tabs button').nth(1).click()};
  editor.setDefaultTimeout(10000);live.setDefaultTimeout(10000);
  await editor.goto(base+'/editor-v2/index.html');await live.goto(base+'/p/page-actions');
  assert.equal(await liveNode(buttonId).getAttribute('data-page-action'),null,'unconfigured trigger has no action');
  await selectButton();
  const actionControls=editor.locator('.page-interaction-inspector');
  assert.equal(await actionControls.count(),1,'the authored button exposes the Page Action registry');
  await actionControls.getByLabel('Művelet').selectOption('select-tab');
  await actionControls.getByLabel('Cél elem').selectOption(tabsId);
  await actionControls.getByLabel('Kiválasztott fül').selectOption('1');
  await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  await live.reload();assert.equal(await liveNode(buttonId).getAttribute('data-page-action'),null,'Save keeps the action draft-only');
  await editor.reload();await selectButton();
  assert.equal(await editor.locator('.page-interaction-inspector select[aria-label="Művelet"]').inputValue(),'select-tab','reload restores the typed Page Model action');
  const previewPopup=editor.waitForEvent('popup');
  await editor.locator('#preview').click();
  const preview=await previewPopup;
  await preview.waitForLoadState('domcontentloaded');
  preview.setDefaultTimeout(5000);
  const previewResponses=[];
  preview.on('response',response=>previewResponses.push(`${response.status()} ${new URL(response.url()).pathname}${new URL(response.url()).search}`));
  const previewFrame=preview.frameLocator('.preview-viewport');
  const previewNode=id=>previewFrame.locator(`.creator-node[data-node-id="${id}"]`);
  try { await previewNode(buttonId).waitFor({state:'attached'}); }
  catch(error) {
    const state=await preview.evaluate(()=>({url:location.href,body:document.body.innerText,frame:document.querySelector('iframe')?.src}));
    throw new Error(`Editor preview did not render saved draft node: ${error.message}; ${JSON.stringify({state,responses:previewResponses})}`);
  }
  assert.equal(await previewNode(buttonId).getAttribute('data-page-action'),'select-tab','Editor preview renders the saved draft interaction before Publish');
  await previewNode(buttonId).press('Enter');
  assert.equal(await previewNode(tabsId).getByRole('tab').nth(1).getAttribute('aria-selected'),'true','draft preview executes the same accessible action as public output');
  await preview.close();
  await editor.locator('#publish').click();await editor.waitForTimeout(200);assert.equal(await editor.locator('#saveStatus').textContent(),'Publikálva',JSON.stringify({disabled:await editor.locator('#publish').isDisabled(),saveStatus:await editor.locator('#saveStatus').textContent(),warnings:await editor.locator('.editor-publication-warning:visible').allTextContents(),posts:posts.map(post=>({publish:post.publish,errors:post.validationErrors}))}));
  await live.reload();
  assert.equal(await liveNode(buttonId).getAttribute('data-page-action-target'),tabsId);
  await liveNode(buttonId).press('Enter');
  assert.equal(await liveNode(tabsId).getByRole('tab').nth(0).getAttribute('aria-selected'),'false');
  assert.equal(await liveNode(tabsId).getByRole('tab').nth(1).getAttribute('aria-selected'),'true','published action activates the configured tab with native tab semantics');

  await actionControls.getByLabel('Művelet').selectOption('scroll-to');
  await actionControls.getByLabel('Cél elem').selectOption(headingId);
  await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  await live.reload();assert.equal(await liveNode(buttonId).getAttribute('data-page-action'),'select-tab','second Save does not alter the live action');
  await editor.locator('#publish').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent==='Publikálva');
  await live.reload();await live.emulateMedia({reducedMotion:'reduce'});
  await liveNode(headingId).evaluate(el=>{window.__actionScroll=[];el.scrollIntoView=options=>window.__actionScroll.push(options)});
  await liveNode(buttonId).click();
  assert.equal(await live.evaluate(()=>window.__actionScroll.length),1);
  assert.equal(await live.evaluate(()=>window.__actionScroll[0].behavior),'instant','same-page action respects reduced-motion preference');
  await actionControls.getByLabel('Művelet').selectOption('toggle-disclosure');
  await actionControls.getByLabel('Cél elem').selectOption(disclosureId);
  await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  await live.reload();assert.equal(await liveNode(buttonId).getAttribute('data-page-action'),'scroll-to','third Save still leaves the published scroll action unchanged');
  await editor.locator('#publish').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent==='Publikálva');
  await live.reload();await liveNode(buttonId).click();
  assert.equal(await liveNode(disclosureId).locator('.creator-accordion details').first().evaluate(el=>el.open),true,'published page action opens the configured native disclosure');
  assert.deepEqual(errors,[]);
});
