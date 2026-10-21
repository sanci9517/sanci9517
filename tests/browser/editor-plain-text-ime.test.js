import assert from 'node:assert/strict';
import test from 'node:test';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve,extname} from 'node:path';
import {chromium} from 'playwright';
import {createDocument,NODE_TYPES} from '../../public/editor-v2/core/schema.js';
import {createEditorState} from '../../public/editor-v2/core/state.js';
import {execute} from '../../public/editor-v2/core/commands.js';

const root=resolve(import.meta.dirname,'../../public');

test('plain text mobile IME final input is the only committed value in Inspector and canvas',async t=>{
  const state=createEditorState(createDocument()),pageId=state.document.activePageId;
  execute(state,{type:'element.add',payload:{type:NODE_TYPES.TEXT,parentId:state.document.pages[pageId].rootId}});
  const nodeId=state.selection.primaryId;
  execute(state,{type:'element.content.set',payload:{nodeId,content:'Base'}});
  const fixture=structuredClone(state.document);
  let draft=structuredClone(fixture),published=null,version=1;
  const posts=[];
  const server=createServer(async(req,res)=>{
    const url=new URL(req.url,'http://localhost');
    const json=data=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(data))};
    if(url.pathname==='/api/admin/pages')
      return json({ok:true,data:url.searchParams.get('archived')==='1'?[]:[{id:pageId,title:'IME text test',slug:'ime-text-test',content:draft,revision:version,isPublished:Boolean(published)}]});
    if(url.pathname==='/api/admin/editor'){
      if(req.method==='GET')return json({ok:true,data:{page:{id:pageId,document:draft,publishedRevisionId:published?'published':null},revisions:[]}});
      let body='';for await(const chunk of req)body+=chunk;
      const payload=JSON.parse(body);posts.push(payload);
      draft=structuredClone(payload.document);version++;
      if(payload.publish)published=structuredClone(draft);
      return json({ok:true,data:{pageId,version,revisionId:'text-ime-'+version,published:Boolean(payload.publish)}});
    }
    if(url.pathname==='/api/public/navigation')return json({ok:true,data:{items:[]}});
    if(url.pathname==='/api/integrations/twitch/connection')return json({ok:true,data:{connected:false}});
    if(url.pathname.startsWith('/api/'))return json({ok:true,data:{siteName:'Test'}});
    const file=resolve(root,'.'+url.pathname);
    if(!file.startsWith(root+'/')){res.writeHead(403).end();return}
    try{res.setHeader('content-type',{'.html':'text/html','.js':'text/javascript','.css':'text/css'}[extname(file)]||'application/octet-stream');res.end(await readFile(file))}
    catch{res.writeHead(404).end()}
  });
  await new Promise(done=>server.listen(0,'127.0.0.1',done));
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
  t.after(async()=>{await browser.close();await new Promise(done=>server.close(done))});
  const base='http://127.0.0.1:'+server.address().port;

  for(const {width,mode} of [{width:390,mode:'inspector'},{width:1366,mode:'inspector'},{width:1366,mode:'canvas'}]){
    draft=structuredClone(fixture);published=null;version=1;posts.length=0;
    const page=await browser.newPage({viewport:{width,height:850}});
    page.setDefaultTimeout(10000);
    const errors=[];page.on('pageerror',error=>errors.push(error.message));
    await page.goto(base+'/editor-v2/index.html');
    const node=page.locator(`.node[data-node-id="${nodeId}"]`);await node.waitFor();
    await node.evaluate(el=>el.click());
    if(mode==='inspector'){
      await page.evaluate(()=>window.sanciEditor?.openPanel?.('right'));
      await page.locator('.inspector-tabs button').nth(1).evaluate(el=>el.click());
    }else await node.locator('.canvas-edit-text').click();
    const source=mode==='inspector'?page.locator('.plain-text-editor'):node.locator('.plain-text-inline-surface');
    await source.waitFor();
    const before=await source.evaluate((el,{nodeId,mode})=>{
      el.focus();
      el.dispatchEvent(new CompositionEvent('compositionstart',{bubbles:true,data:''}));
      if(el instanceof HTMLTextAreaElement)el.value='Vé';else el.textContent='Vé';
      el.dispatchEvent(new InputEvent('input',{bubbles:true,isComposing:true,inputType:'insertCompositionText',data:'Vé'}));
      el.dispatchEvent(new CompositionEvent('compositionend',{bubbles:true,data:'Végleges'}));
      // The final IME replacement is delivered after compositionend, before paint.
      const mirrorBeforeFinal=mode==='inspector'
        ?document.querySelector(`.node[data-node-id="${nodeId}"] > .node-content`)?.textContent:null;
      if(el instanceof HTMLTextAreaElement)el.value='Végleges';else el.textContent='Végleges';
      el.dispatchEvent(new InputEvent('input',{bubbles:true,isComposing:false,inputType:'insertText',data:'Végleges'}));
      return {mirrorBeforeFinal,focused:document.activeElement===el};
    },{nodeId,mode});
    if(mode==='inspector')assert.equal(before.mirrorBeforeFinal,'Base',
      'the canvas must not show an unfinished composition as the saved draft');
    assert.equal(before.focused,true);
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    assert.equal(await node.locator('.plain-text-content-surface').textContent(),'Végleges');
    assert.equal(await source.evaluate(el=>el instanceof HTMLTextAreaElement?el.value:el.textContent),'Végleges');
    assert.equal(posts.length,0,'typing remains a local draft and never calls Publish');
    if(width===1366){
      await page.locator('#save').click();
      await page.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.startsWith('Mentve'));
      assert.equal(posts.length,1);
      assert.equal(posts[0].publish,false,'Save must not Publish');
      assert.equal(draft.pages[pageId].nodes[nodeId].props.text,'Végleges');
      assert.equal(published,null);
      await page.locator('#publish').click();
      await page.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent==='Publikálva');
      assert.equal(posts.at(-1).publish,true);
      assert.equal(published.pages[pageId].nodes[nodeId].props.text,'Végleges');
    }
    assert.deepEqual(errors,[],`no uncaught browser errors in ${mode} at ${width}px`);
    await page.close();
  }
});
