import test from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve,extname} from 'node:path';
import {chromium} from 'playwright';
import {createDocument,createNode} from '../../public/editor-v2/core/schema.js';

test('server-rejected unsupported Publish selects the node, gives recovery guidance, and keeps the saved draft clean',async t=>{
  const document=createDocument(),pageId=document.activePageId,page=document.pages[pageId];
  const input=createNode('input',{id:'planned-publish-input',name:'Tervezett beviteli mező',parentId:page.rootId});
  page.nodes[input.id]=input;page.nodes[page.rootId].children.push(input.id);
  document.revision=2;page.revision=2;
  const draft=structuredClone(document),published=createDocument();
  let version=2,editorGets=0;const posts=[];let rejectUnsupportedPublish=true,releaseStalePublish,resolveThirdPublish;
  const thirdPublishReceived=new Promise(resolve=>{resolveThirdPublish=resolve});
  const stalePublishResponse=new Promise(resolve=>{releaseStalePublish=resolve});
  const publicRoot=resolve(import.meta.dirname,'../../public');
  const server=createServer(async(req,res)=>{
    const url=new URL(req.url,'http://localhost');
    const json=data=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(data))};
    if(url.pathname==='/api/admin/pages')return json({ok:true,data:url.searchParams.get('archived')==='1'?[]:[{id:pageId,slug:'test',title:'Test',content:draft,revision:version,isPublished:true,hasUnpublishedChanges:true,publishedRevisionId:'revision-1'}]});
    if(url.pathname==='/api/admin/editor'){
      if(req.method==='GET'){editorGets++;return json({ok:true,data:{page:{id:pageId,document:draft,publishedRevisionId:'revision-1'},revisions:[{id:'revision-'+version,version},{id:'revision-1',version:1}]}})}
      let body='';for await(const chunk of req)body+=chunk;
      const request=JSON.parse(body);posts.push(request);
      if(posts.length===3)resolveThirdPublish();
      if(rejectUnsupportedPublish&&request.publish){if(posts.length>=3)await stalePublishResponse;else await new Promise(done=>setTimeout(done,75));res.statusCode=409;return json({ok:false,error:{code:'UNSUPPORTED_EDITOR_NODE_TYPE',message:'A beviteli mező elem típusa még nem publikálható.'}})}
      return json({ok:true,data:{pageId,version,revisionId:'revision-'+version}});
    }
    if(url.pathname==='/api/auth/session')return json({ok:true,data:{authenticated:false,user:null}});
    if(url.pathname==='/api/integrations/twitch/connection')return json({ok:true,data:{connected:false}});
    if(url.pathname==='/api/public/pages')return json({ok:true,data:{id:pageId,slug:'test',title:'Test',content:published.pages[pageId]}});
    if(url.pathname.startsWith('/api/'))return json({ok:true,data:{siteName:'Test'}});
    const path=url.pathname==='/p/test'?'/visual-page.html':url.pathname,file=resolve(publicRoot,'.'+path);
    if(!file.startsWith(publicRoot+'/'))return res.writeHead(403).end();
    try{res.setHeader('content-type',{'.html':'text/html','.js':'text/javascript','.css':'text/css'}[extname(file)]||'application/octet-stream');res.end(await readFile(file))}
    catch{return res.writeHead(404).end()}
  });
  await new Promise(done=>server.listen(0,'127.0.0.1',done));
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
  t.after(async()=>{await browser.close();await new Promise(done=>server.close(done))});
  const editor=await browser.newPage({viewport:{width:1366,height:900}}),errors=[],dialogs=[];
  editor.on('pageerror',error=>errors.push(error.message));
  editor.on('dialog',async dialog=>{dialogs.push(dialog.type);await dialog.dismiss()});
  await editor.goto(`http://127.0.0.1:${server.address().port}/editor-v2/index.html`);
  await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent==='Mentve');
  assert.equal(await editor.locator('#publish').isEnabled(),true,'a persisted but unpublished draft remains eligible for a server-side Publish attempt');
  const pageGetsBefore=editorGets,draftBeforePublish=structuredClone(draft),publishedBeforePublish=structuredClone(published),versionBeforePublish=version;
  await editor.locator('#publish').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent.includes('még nem publikálható'));
  assert.equal(posts.length,1);assert.equal(posts[0].publish,true,'the recovery is exercised by the explicit Publish action');
  assert.equal(version,versionBeforePublish,'the server rejection does not advance the saved revision');
  assert.deepEqual(draft,draftBeforePublish,'the rejected request leaves the saved Page Model unchanged');
  assert.deepEqual(published,publishedBeforePublish,'the rejected request leaves the published snapshot unchanged');
  assert.equal(await editor.locator('#leftTabLayers').getAttribute('aria-selected'),'true','the editor opens the Layers recovery path');
  const layer=editor.locator(`#layersTree .layer-row[data-node-id="${input.id}"]`);
  await layer.waitFor();await editor.waitForFunction(id=>document.activeElement?.dataset.nodeId===id,input.id,{timeout:1000});
  assert.match(await layer.getAttribute('class'),/active/,'the unsupported node is selected and focused for correction');
  const guidance=editor.locator('#leftPanelLayers [data-recovery-kind="unsupported-node"]');
  assert.equal(await guidance.getAttribute('role'),'alert');
  assert.match(await guidance.textContent(),/A mentett piszkozat, az élő oldal és a verzió változatlan maradt/);
  assert.match(await guidance.textContent(),/Rétegek panelen jelöld ki, majd töröld vagy cseréld le/);
  assert.equal(await editor.locator('#saveStatus').textContent(),await guidance.textContent(),'the live status region announces the same actionable guidance');
  assert.deepEqual(dialogs,[],'the targeted recovery avoids a blocking generic alert');
  assert.equal(editorGets,pageGetsBefore,'Publish failure does not issue an automatic draft reload');

  assert.equal(await editor.locator('#publish').isEnabled(),true,'a page with unpublished changes may retry Publish');
  await editor.locator('#publish').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent==='Publikálás…');
  await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent.includes('még nem publikálható'));
  assert.equal(posts.length,2,'the explicit retry reaches the same server rejection');
  assert.equal(await editor.locator('#leftPanelLayers [data-recovery-kind="unsupported-node"]').count(),1,
    'repeated server rejection replaces the prior recovery alert instead of stacking duplicate announcements');
  assert.equal(await editor.locator('#leftPanelLayers [data-recovery-kind="unsupported-node"]').textContent(),await guidance.textContent(),
    'the single recovery alert continues to match the live status region');
  assert.deepEqual(dialogs,[],'retrying recovery still avoids a blocking alert');

  const beforeReload=editorGets;
  await editor.locator('#leftTabPages').click();
  await editor.locator('.page-row-select').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent==='Mentve');
  assert.equal(editorGets,beforeReload+1,'the clean saved draft can be reloaded without a false dirty-state confirmation');
  assert.deepEqual(dialogs,[],'reloading after the rejected Publish never prompts to discard nonexistent edits');
  assert.equal(posts.length,2,'neither recovery feedback nor the clean reload silently Saves or Publishes');
  assert.deepEqual(errors,[],'the unsupported legacy node is rendered and recoverable without browser errors');

  // The 409 describes the snapshot sent before the user repaired the draft.
  // A late rejection must not announce an unsupported node that was already
  // removed from the current Page Model.
  await editor.locator('#publish').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent==='Publikálás…');
  await thirdPublishReceived;
  await editor.locator('#leftTabLayers').click();
  await editor.locator(`#layersTree .layer-row[data-node-id="${input.id}"]`).click();
  await editor.evaluate(()=>window.sanciEditor.openPanel('right'));
  const deleteAction=editor.locator('#inspectorBody .danger-action');
  await deleteAction.waitFor();
  await deleteAction.click();
  await editor.waitForFunction(id=>!document.querySelector(`#layersTree .layer-row[data-node-id="${CSS.escape(id)}"]`),input.id);
  releaseStalePublish();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent.includes('piszkozat a publikálási kérés óta módosult'));
  assert.equal(await editor.locator('#leftPanelLayers [data-recovery-kind="unsupported-node"]').count(),0,
    'a stale server rejection must not point to an unsupported node removed after the request was submitted');
  assert.match(await editor.locator('#saveStatus').textContent(),/ellenőrizd a mostani piszkozatot, majd külön próbáld újra/);
  assert.equal(await editor.locator('#publish').isEnabled(),true,'the edited draft remains explicitly publishable after stale rejection feedback');
  assert.deepEqual(dialogs,[],'stale Publish feedback is non-blocking');
});
