import assert from 'node:assert/strict';
import test from 'node:test';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, extname } from 'node:path';
import { chromium } from 'playwright';
import { createDocument, NODE_TYPES } from '../../public/editor-v2/core/schema.js';
import { createEditorState } from '../../public/editor-v2/core/state.js';
import { execute } from '../../public/editor-v2/core/commands.js';

const root=resolve(import.meta.dirname,'../../public');

test('actual Inspector keeps unsaved Rich Text through Ctrl+S, reload and separate Publish',async t=>{
  const state=createEditorState(createDocument());
  execute(state,{type:'element.add',payload:{type:NODE_TYPES.RICHTEXT}});
  const nodeId=state.selection.primaryId, pageId=state.document.activePageId;
  execute(state,{type:'richtext.content.set',payload:{nodeId,document:{schemaVersion:1,type:'richtext-document',blocks:[
    {type:'paragraph',children:[{type:'text',text:'Hello world',marks:[]}]},
    {type:'paragraph',children:[{type:'text',text:'Second paragraph',marks:[]}]}
  ]}}});
  execute(state,{type:'element.add',payload:{type:NODE_TYPES.TEXT,parentId:state.document.pages[pageId].rootId}});
  const otherNodeId=state.selection.primaryId;
  let draft=structuredClone(state.document),published=null,version=1;
  const posts=[];
  const server=createServer(async(req,res)=>{
    const url=new URL(req.url,'http://localhost');
    const json=data=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(data))};
    if(url.pathname==='/api/admin/pages')return json({ok:true,data:url.searchParams.get('archived')==='1'?[]:[{id:pageId,slug:'test',title:'Test',description:'',content:draft,revision:version,isPublished:Boolean(published)}]});
    if(url.pathname==='/api/admin/editor'){
      if(req.method==='GET')return json({ok:true,data:{page:{id:pageId,document:draft,publishedRevisionId:published?'published':null},revisions:[{id:'revision-'+version,version}]}});
      let body='';for await(const chunk of req)body+=chunk;
      const request=JSON.parse(body);posts.push(request);
      draft=structuredClone(request.document);version++;
      if(request.publish)published=structuredClone(draft);
      return json({ok:true,data:{pageId,version,revisionId:'revision-'+version,published:Boolean(request.publish)}});
    }
    if(url.pathname==='/api/public/pages')return json(published?{ok:true,data:{id:pageId,slug:'test',title:'Test',description:'',content:published.pages[pageId]}}:{ok:false});
    if(url.pathname==='/api/public/navigation')return json({ok:true,data:{items:[]}});
    if(url.pathname==='/api/integrations/twitch/connection')return json({ok:true,data:{connected:false}});
    if(url.pathname.startsWith('/api/'))return json({ok:true,data:{siteName:'Test'}});
    const asset=url.pathname==='/p/test'?'/visual-page.html':url.pathname;
    const file=resolve(root,'.'+asset);
    if(!file.startsWith(root+'/')){res.writeHead(403).end();return}
    try{res.setHeader('content-type',{'.html':'text/html','.js':'text/javascript','.css':'text/css'}[extname(file)]||'application/octet-stream');res.end(await readFile(file))}
    catch{res.writeHead(404).end()}
  });
  await new Promise(done=>server.listen(0,'127.0.0.1',done));
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
  t.after(async()=>{await browser.close();await new Promise(done=>server.close(done))});
  const base=`http://127.0.0.1:${server.address().port}`;
  const tab=await browser.newPage({viewport:{width:1366,height:900}});
  const openEditor=async()=>{
    await tab.goto(base+'/editor-v2/index.html');
    await tab.locator(`.node[data-node-id="${nodeId}"]`).waitFor();
    await tab.locator(`.node[data-node-id="${nodeId}"]`).evaluate(el=>el.click());
    if(!await tab.locator('#inspectorBody').isVisible())await tab.locator('#openInspector').click();
    await tab.locator('.inspector-tabs button').nth(1).evaluate(el=>el.click());
    await tab.locator('.richtext-editor-surface').waitFor();
  };
  await tab.setViewportSize({width:390,height:800});
  await openEditor();
  const editor=tab.locator('.richtext-editor-surface');
  await editor.evaluate(el=>{el.querySelector('p span').textContent='Hello world fresh';el.dispatchEvent(new InputEvent('input',{bubbles:true,inputType:'insertText'}));el.focus()});
  await tab.locator('.inspector-tabs button').first().evaluate(el=>el.click());
  await tab.locator('.inspector-tabs button').nth(1).evaluate(el=>el.click());
  assert.match(await tab.locator('.richtext-editor-surface').textContent(),/^Hello world freshSecond paragraph$/);
  await tab.locator(`.node[data-node-id="${otherNodeId}"]`).evaluate(el=>el.click());
  await tab.locator(`.node[data-node-id="${nodeId}"]`).evaluate(el=>el.click());
  assert.match(await tab.locator('.richtext-editor-surface').textContent(),/^Hello world freshSecond paragraph$/);
  await tab.locator('.canvas-device-btn[data-device="mobile"]').evaluate(el=>el.click());
  assert.match(await tab.locator('.richtext-editor-surface').textContent(),/^Hello world freshSecond paragraph$/);
  await tab.locator('.canvas-device-btn[data-device="desktop"]').evaluate(el=>el.click());
  await tab.keyboard.press('Control+s');
  await tab.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.startsWith('Mentve'));
  assert.equal(posts.length,1);
  assert.equal(posts[0].publish,false);
  assert.equal(draft.pages[pageId].nodes[nodeId].props.richText.blocks[0].children[0].text,'Hello world fresh');
  assert.equal(published,null);
  await openEditor();
  const selectWorld=()=>tab.locator('.richtext-editor-surface').evaluate(el=>{
    const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let node;while(node=walker.nextNode())if(node.nodeValue.includes('world'))break;
    const start=node.nodeValue.indexOf('world');const range=document.createRange();range.setStart(node,start);range.setEnd(node,start+5);
    const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);
  });
  await selectWorld();
  await tab.locator('.richtext-editor-surface').evaluate(el=>window.__richTextSurface=el);
  for(const mark of ['Félkövér','Dőlt','Aláhúzott']){
    await tab.getByRole('button',{name:mark}).click();
    assert.equal(await tab.evaluate(()=>document.getSelection().toString()),'world');
    assert.equal(await tab.locator('.richtext-editor-surface').evaluate(el=>el===window.__richTextSurface&&el.isConnected&&document.activeElement===el),true);
  }
  await tab.locator('.richtext-editor-surface :is(strong,b)').waitFor();
  await tab.locator('.richtext-editor-surface :is(em,i)').waitFor();
  await tab.locator('.richtext-editor-surface u').waitFor();
  const acrossBlocks=await tab.locator('.richtext-editor-surface').evaluate(el=>{
    const first=[...el.children[0].querySelectorAll('span')].find(span=>span.textContent.includes('Hello')).firstChild;
    const second=el.children[1].querySelector('span').firstChild;
    const range=document.createRange();range.setStart(first,0);range.setEnd(second,second.length);
    const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);
    return selection.toString();
  });
  await tab.evaluate(()=>new Promise(requestAnimationFrame));
  await tab.getByRole('button',{name:'Aláhúzott'}).click();
  assert.equal(await tab.evaluate(()=>document.getSelection().toString()),acrossBlocks);
  const formattedBlocks=await tab.locator('.richtext-editor-surface').evaluate(el=>[...el.children].map(block=>Boolean(block.querySelector('u'))));
  assert.deepEqual(formattedBlocks,[true,true]);
  await selectWorld();
  await tab.locator('.richtext-link-controls input').fill('/p/home');
  await tab.getByRole('button',{name:'Link beállítása'}).click();
  await tab.locator('.richtext-editor-surface a strong').waitFor();
  await tab.keyboard.press('Control+s');
  await tab.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.startsWith('Mentve'));
  assert.equal(published,null);
  assert.equal(posts.at(-1).publish,false);
  await openEditor();
  assert.equal(await tab.locator('.richtext-editor-surface a strong').textContent(),'world');
  await tab.locator('#publish').click();
  await tab.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent==='Publikálva');
  assert.equal(posts.at(-1).publish,true);
  const publicTab=await browser.newPage({viewport:{width:390,height:800}});
  await publicTab.goto(base+'/p/test');
  assert.equal(await publicTab.locator('.visual-text a strong').textContent(),'world');
  assert.match(await publicTab.locator('.visual-text a').getAttribute('href'),/\/p\/home$/);
  await tab.setViewportSize({width:390,height:800});
  await openEditor();
  const urlField=tab.locator('.richtext-link-controls input');
  assert.ok((await urlField.boundingBox()).height>=44);
  await tab.locator('.richtext-editor-surface a strong').evaluate(el=>{
    const text=el.querySelector('span').firstChild;
    const range=document.createRange();range.setStart(text,0);range.setEnd(text,text.nodeValue.length);
    const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);
  });
  await urlField.fill('/p/mobile');
  await tab.getByRole('button',{name:'Link beállítása'}).click();
  assert.equal(await tab.locator('.richtext-editor-surface a').getAttribute('href'),'/p/mobile');
  assert.equal(published.pages[pageId].nodes[nodeId].props.richText.blocks[0].children.find(run=>run.link).link.href,'/p/home');
  const [warning]=await Promise.all([
    tab.waitForEvent('dialog').then(async dialog=>{const message=dialog.message();await dialog.dismiss();return message}),
    tab.locator('#newPage').evaluate(el=>el.click())
  ]);
  assert.match(warning,/Először mentsd/);
  assert.equal(await tab.locator('.richtext-editor-surface a').getAttribute('href'),'/p/mobile');
});
