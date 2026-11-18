import assert from 'node:assert/strict';
import test from 'node:test';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve,extname} from 'node:path';
import {chromium} from 'playwright';
import {createDocument,createNode,NODE_TYPES} from '../../public/editor-v2/core/schema.js';

const root=resolve(import.meta.dirname,'../../public');

test('node clipboard keyboard flow duplicates nested nodes into the draft; Save stays separate from Publish',async t=>{
  const initial=createDocument(),pageId=initial.activePageId,page=initial.pages[pageId];
  const section=createNode(NODE_TYPES.SECTION,{name:'Másolási próba',parentId:page.rootId});
  const copyText=createNode(NODE_TYPES.TEXT,{name:'Beágyazott szöveg',parentId:section.id,props:{text:'Másolatba kerül'}});
  section.children.push(copyText.id);page.nodes[section.id]=section;page.nodes[copyText.id]=copyText;page.nodes[page.rootId].children.push(section.id);
  let draft=structuredClone(initial),published=null,revision=1;const posts=[];
  const server=createServer(async(req,res)=>{
    const url=new URL(req.url,'http://localhost');
    const json=data=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(data))};
    if(url.pathname==='/api/admin/pages')return json({ok:true,data:url.searchParams.get('archived')==='1'?[]:[{id:pageId,slug:'clipboard',title:'Clipboard',content:draft,revision,isPublished:Boolean(published)}]});
    if(url.pathname==='/api/admin/editor'){
      if(req.method==='GET')return json({ok:true,data:{page:{id:pageId,document:draft,publishedRevisionId:published?'published':null},revisions:[{id:'revision-'+revision,version:revision}]}});
      let body='';for await(const chunk of req)body+=chunk;
      const request=JSON.parse(body);posts.push(request);draft=structuredClone(request.document);revision++;
      if(request.publish)published=structuredClone(draft);
      return json({ok:true,data:{pageId,version:revision,revisionId:'revision-'+revision,published:Boolean(request.publish)}});
    }
    if(url.pathname==='/api/public/pages')return json(published?{ok:true,data:{id:pageId,slug:'clipboard',title:'Clipboard',content:published.pages[pageId]}}:{ok:false});
    if(url.pathname==='/api/public/navigation')return json({ok:true,data:{items:[]}});
    if(url.pathname==='/api/integrations/twitch/connection')return json({ok:true,data:{connected:false}});
    if(url.pathname.startsWith('/api/'))return json({ok:true,data:{siteName:'Clipboard test'}});
    const asset=url.pathname==='/p/clipboard'?'/visual-page.html':url.pathname;
    const file=resolve(root,'.'+asset);
    if(!file.startsWith(root+'/')){res.writeHead(403).end();return}
    try{res.setHeader('content-type',{'.html':'text/html','.js':'text/javascript','.css':'text/css'}[extname(file)]||'application/octet-stream');res.end(await readFile(file))}
    catch{res.writeHead(404).end()}
  });
  await new Promise(done=>server.listen(0,'127.0.0.1',done));
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
  t.after(async()=>{await browser.close();await new Promise(done=>server.close(done))});

  const tab=await browser.newPage({viewport:{width:1366,height:900}});tab.setDefaultTimeout(10000);
  const errors=[];tab.on('pageerror',error=>errors.push(error.message));
  await tab.goto(`http://127.0.0.1:${server.address().port}/editor-v2/index.html`);
  await tab.locator('.rail-btn[data-tab="layers"]').click();
  await tab.locator(`#layersTree .layer-row[data-node-id="${section.id}"]`).click();
  assert.equal(await tab.locator('#selection').textContent(),`Kijelölés: ${section.id}`,'layer selection focuses the source before keyboard copy');
  await tab.locator('.more-actions > summary').click();
  await tab.locator('#nodeClipboardMenu > summary').click();
  assert.equal(await tab.locator('#copyNodes').isEnabled(),true,'the pointer copy action is available for a valid selection');
  assert.equal(await tab.locator('#pasteNodes').isEnabled(),false,'paste remains disabled until a same-page clipboard snapshot exists');
  await tab.locator('.more-actions > summary').click();
  await tab.locator(`#layersTree .layer-row[data-node-id="${section.id}"]`).click();
  await tab.keyboard.press('Control+c');
  await tab.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.includes('másolva'));
  await tab.locator('.more-actions > summary').click();
  await tab.locator('#nodeClipboardMenu > summary').click();
  assert.equal(await tab.locator('#pasteNodes').isEnabled(),true,'copy enables the explicit pointer paste action');
  await tab.locator('.more-actions > summary').click();
  await tab.locator(`#layersTree .layer-row[data-node-id="${section.id}"]`).click();
  await tab.keyboard.press('Control+v');
  const copiedRoot=tab.locator('#canvas .page-canvas > .node > .node').last();
  await copiedRoot.waitFor();
  const copiedId=await copiedRoot.getAttribute('data-node-id');
  assert.notEqual(copiedId,section.id);
  assert.match(await copiedRoot.textContent(),/Másolatba kerül/,'paste includes the nested subtree');
  assert.equal(posts.length,0,'copy and paste only change the local editor draft before Save');

  await tab.keyboard.press('Control+z');
  assert.equal(await tab.locator(`#canvas .node[data-node-id="${copiedId}"]`).count(),0,'one Undo removes the complete paste operation');
  await tab.keyboard.press('Control+Shift+z');
  await tab.locator(`#canvas .node[data-node-id="${copiedId}"]`).waitFor();
  await tab.locator('#save').click();
  await tab.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.startsWith('Mentve'));
  assert.equal(posts.at(-1).publish,false);
  assert.equal(published,null,'Save does not publish pasted content');
  assert.ok(draft.pages[pageId].nodes[copiedId]);

  await tab.reload();
  await tab.locator(`#canvas .node[data-node-id="${copiedId}"]`).waitFor();
  assert.equal(published,null,'the copied subtree is present in the saved draft only');
  await tab.locator('#publish').click();
  await tab.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent==='Publikálva');
  assert.equal(posts.at(-1).publish,true);
  const publicTab=await browser.newPage({viewport:{width:390,height:844}});
  await publicTab.goto(`http://127.0.0.1:${server.address().port}/p/clipboard`);
  await publicTab.getByText('Másolatba kerül',{exact:true}).last().waitFor();
  assert.deepEqual(errors,[]);
});
