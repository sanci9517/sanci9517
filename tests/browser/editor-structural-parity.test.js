import test from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve,extname} from 'node:path';
import {chromium} from 'playwright';
import {createDocument,createPage} from '../../public/editor-v2/core/schema.js';
import {createEditorState,activePage} from '../../public/editor-v2/core/state.js';
import {execute} from '../../public/editor-v2/core/commands.js';
import {STRUCTURAL_TYPES,contentTag} from '../../public/editor-v2/core/authored-content.js';

test('each authored structural type preserves its semantics and responsive layout through focused Ctrl+S, Undo/Redo and Publish',async t=>{
  const models={};
  for(const type of STRUCTURAL_TYPES){
    const state=createEditorState(createDocument(createPage({id:type,name:type,slug:type}),{modern:true}));
    execute(state,{type:'style.set',payload:{nodeId:activePage(state).rootId,patch:{width:'320px',height:'360px',minHeight:'360px',padding:'12px'}}});
    execute(state,{type:'element.add',payload:{type,parentId:activePage(state).rootId,authored:true}});const id=state.selection.primaryId;
    execute(state,{type:'element.add',payload:{type:'text',parentId:id,authored:true,props:{text:'Megőrzött tartalom'}}});const childId=state.selection.primaryId;
    // Older snapshots can carry both legacy and current accessibility keys.
    execute(state,{type:'element.update',payload:{nodeId:id,patch:{accessibility:{
      id:'modern-'+type,anchorId:'legacy-'+type,label:'Inspector '+type,ariaLabel:'Régi címke '+type
    }}}});
    models[type]={id,childId,tag:contentTag(activePage(state).nodes[id]),draft:structuredClone(state.document),published:structuredClone(state.document),version:1};
  }
  const root=resolve(import.meta.dirname,'../../public');let posts=0;
  const server=createServer(async(req,res)=>{
    const url=new URL(req.url,'http://localhost'),json=data=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(data))};
    if(url.pathname==='/api/admin/pages')return json({ok:true,data:url.searchParams.get('archived')==='1'?[]:Object.entries(models).map(([id,value])=>({id,slug:id,title:id,content:value.draft,revision:value.version,isPublished:true}))});
    if(url.pathname==='/api/admin/editor'){
      if(req.method==='GET'){const id=url.searchParams.get('pageId'),value=models[id];return json({ok:true,data:{page:{id,document:value.draft,publishedRevisionId:'published'},revisions:[{id:'rev-'+value.version,version:value.version}]}})}
      let body='';for await(const chunk of req)body+=chunk;const request=JSON.parse(body),value=models[request.pageId];value.draft=structuredClone(request.document);value.version++;posts++;if(request.publish)value.published=structuredClone(value.draft);return json({ok:true,data:{pageId:request.pageId,version:value.version,revisionId:'rev-'+value.version}});
    }
    if(url.pathname==='/api/public/pages'){const id=url.searchParams.get('slug');return json({ok:true,data:{id,title:id,slug:id,content:models[id].published.pages[id]}})}
    if(url.pathname==='/api/public/navigation')return json({ok:true,data:{items:[]}});
    if(url.pathname==='/api/integrations/twitch/connection')return json({ok:true,data:{connected:false}});
    if(url.pathname.startsWith('/api/'))return json({ok:true,data:{siteName:'Test'}});
    const file=resolve(root,'.'+(url.pathname.startsWith('/p/')?'/visual-page.html':url.pathname));if(!file.startsWith(root+'/'))return res.writeHead(403).end();
    try{res.setHeader('content-type',{'.html':'text/html','.js':'text/javascript','.css':'text/css'}[extname(file)]||'application/octet-stream');res.end(await readFile(file))}catch{res.writeHead(404).end()}
  });
  await new Promise(done=>server.listen(0,'127.0.0.1',done));
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});t.after(async()=>{await browser.close();await new Promise(done=>server.close(done))});
  const base=`http://127.0.0.1:${server.address().port}`,editor=await browser.newPage({viewport:{width:1440,height:900}}),live=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];
  for(const page of [editor,live]){page.setDefaultTimeout(6000);page.on('pageerror',error=>errors.push(error.message))}
  const measure=el=>{const style=getComputedStyle(el);return Object.fromEntries(['display','position','width','height','minHeight','padding','borderRadius','backgroundColor','color','flexDirection','gap','gridTemplateColumns'].map(key=>[key,style[key]]))};
  for(const type of STRUCTURAL_TYPES){
    const {id}=models[type];await editor.goto(base+'/editor-v2/index.html?pageId='+type);const source=editor.locator(`.node[data-node-id="${id}"]`);await source.evaluate(el=>el.click());if(await editor.locator('#rightDock').evaluate(el=>el.classList.contains('closed')))await editor.locator('#openInspector').click();
    const title=editor.locator('.inspector-group-title').filter({hasText:'Lekerekítés'});if(await title.getAttribute('aria-expanded')==='false')await title.click();
    const before=await source.evaluate(el=>getComputedStyle(el).borderRadius),input=editor.locator('[data-property-id="radius.all"] input[type=number]');await input.fill('12');await input.press('Control+s');await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
    assert.equal(models[type].published.pages[type].nodes[id].responsive.desktop.borderRadius,undefined,type+' draft isolation');
    await editor.locator('#undo').click();assert.equal(await source.evaluate(el=>getComputedStyle(el).borderRadius),before,type+' undo');await editor.locator('#redo').click();assert.equal(await source.evaluate(el=>getComputedStyle(el).borderRadius),'12px');
    await editor.locator('#publish').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent==='Publikálva');await editor.reload();assert.equal(await source.evaluate(el=>getComputedStyle(el).borderRadius),'12px',type+' reload');
    for(const [device,width] of [['desktop',1440],['tablet',768],['mobile',390]]){
      await editor.locator(`.canvas-device-btn[data-device="${device}"]`).click();await live.setViewportSize({width,height:900});await live.goto(base+'/p/'+type);const target=live.locator(`[data-node-id="${id}"]`);await target.waitFor();
      assert.equal(await source.getAttribute('id'),'legacy-'+type,type+'/'+device+' canvas legacy anchor');
      assert.equal(await target.getAttribute('id'),'legacy-'+type,type+'/'+device+' public legacy anchor');
      assert.equal(await source.getAttribute('aria-label'),'Régi címke '+type,type+'/'+device+' canvas label');
      assert.equal(await target.getAttribute('aria-label'),'Régi címke '+type,type+'/'+device+' public label');
      assert.equal(await target.evaluate(el=>el.outerHTML.split(' id=').length-1),1,type+'/'+device+' one anchor only');
      assert.equal(await target.evaluate(el=>el.tagName.toLowerCase()),models[type].tag,type+' semantics');assert.deepEqual(await target.evaluate(measure),await source.evaluate(measure),type+'/'+device);assert.match(await target.textContent(),/Megőrzött tartalom/);
    }
  }
  // Inspector visibility is a per-device decision. The public subtree is not
  // removed until Publish, while the Canvas must keep it editable as a ghost.
  const hiddenType=STRUCTURAL_TYPES[0],{id:hiddenId,childId}=models[hiddenType];
  await editor.goto(base+'/editor-v2/index.html?pageId='+hiddenType);
  await editor.locator('.canvas-device-btn[data-device="mobile"]').click();
  const parent=editor.locator(`.node[data-node-id="${hiddenId}"]`),child=editor.locator(`.node[data-node-id="${childId}"]`);
  await parent.evaluate(el=>el.click());
  if(await editor.locator('#rightDock').evaluate(el=>el.classList.contains('closed')))await editor.locator('#openInspector').click();
  await editor.getByRole('button',{name:'Haladó beállítások'}).click();
  const mobileToggle=editor.getByRole('checkbox',{name:'Látható: mobile'});
  await mobileToggle.uncheck();
  assert.equal(await parent.getAttribute('data-visibility'),'hidden','hidden parent stays selectable on Canvas');
  assert.equal(await parent.locator(':scope > .node-head > .node-visibility-indicator').count(),1,'Canvas explicitly marks the hidden element');
  assert.equal(await child.getAttribute('data-visibility'),'hidden','hidden parent marks its descendants');
  await editor.locator('#undo').click();
  assert.equal(await parent.getAttribute('data-visibility'),null,'undo restores Canvas visibility');
  await editor.locator('#redo').click();
  assert.equal(await parent.getAttribute('data-visibility'),'hidden','redo restores Canvas hidden marker');
  await child.evaluate(el=>el.click());
  assert.equal(await editor.getByRole('checkbox',{name:'Látható: mobile'}).isChecked(),true,'child retains its independent visibility');
  assert.match(await editor.locator('.visibility-inspector-note').textContent(),/szülőelem rejtett/,'Inspector explains inherited hiding');
  await parent.evaluate(el=>el.click());
  await editor.locator('#save').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
  assert.equal(models[hiddenType].draft.pages[hiddenType].nodes[hiddenId].visibility.mobile,false);
  assert.equal(models[hiddenType].published.pages[hiddenType].nodes[hiddenId].visibility.mobile,true,'Save does not publish the hidden subtree');
  await live.setViewportSize({width:390,height:900});await live.goto(base+'/p/'+hiddenType);
  assert.equal(await live.locator(`[data-node-id="${hiddenId}"]`).count(),1,'published mobile page is unchanged after Save');
  await editor.locator('#publish').click();
  await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent==='Publikálva');
  await live.reload();
  assert.equal(await live.locator(`[data-node-id="${hiddenId}"]`).count(),0,'published mobile hides the parent');
  assert.equal(await live.locator(`[data-node-id="${childId}"]`).count(),0,'published mobile hides the nested child');
  for(const width of [768,1440]){
    await live.setViewportSize({width,height:900});await live.reload();
    assert.equal(await live.locator(`[data-node-id="${hiddenId}"]`).count(),1,width+' other viewport still shows the element');
  }
  await editor.reload();
  await editor.locator('.canvas-device-btn[data-device="mobile"]').click();
  assert.equal(await parent.getAttribute('data-visibility'),'hidden','reload preserves hidden Canvas marker');
  assert.equal(posts,STRUCTURAL_TYPES.length*2+2);assert.deepEqual(errors,[]);
});
