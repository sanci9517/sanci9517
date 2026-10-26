import assert from 'node:assert/strict';
import test from 'node:test';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {chromium} from 'playwright';
import {createDocument} from '../../public/editor-v2/core/schema.js';
import {createEditorState,activePage} from '../../public/editor-v2/core/state.js';
import {execute} from '../../public/editor-v2/core/commands.js';

for(const width of [390,1366])test(`multi-selection validates, saves and publishes its ${width===390?'mobile':'desktop'} breakpoint`,async t=>{
 const device=width===390?'mobile':'desktop';
 let document=createDocument();const id=document.activePageId,slug='new-'+ 'long-path-'.repeat(7)+'end',publishedSlug='old-'+ 'long-path-'.repeat(7)+'end';
 const model=createEditorState(document);const ids=[];for(let i=0;i<2;i++){execute(model,{type:'element.add',payload:{type:'text',parentId:activePage(model).rootId,props:{text:`Multi item ${i+1}`}}});ids.push(model.selection.primaryId);}document=model.document;let draft=structuredClone(document),published=structuredClone(document);const posts=[];
 const root=resolve(import.meta.dirname,'../../public'),errors=[];
 const server=createServer(async(req,res)=>{
  const url=new URL(req.url,'http://localhost');
  const json=data=>{res.setHeader('content-type','application/json');res.end(JSON.stringify({ok:true,data}));};
  if(url.pathname==='/api/admin/pages')return json(url.searchParams.has('archived')?[]:[{id,slug,publishedSlug,title:'URL test',content:draft,isPublished:true,hasUnpublishedChanges:true,revision:1}]);
  if(url.pathname==='/api/admin/editor'&&req.method==='POST'){
   let body='';for await(const chunk of req)body+=chunk;const request=JSON.parse(body);posts.push(request);draft=structuredClone(request.document);
   for(const nodeId of ids)assert.equal(draft.pages[id].nodes[nodeId].responsive[device].width,'120px');
   if(request.publish)published=structuredClone(draft);
   return json({pageId:id,version:posts.length+1,revisionId:'r'+(posts.length+1)});
  }
  if(url.pathname==='/api/admin/editor')return json({page:{id,document:draft,publishedRevisionId:'r1'},revisions:[{id:'r1',version:1}]});
  if(url.pathname==='/api/public/pages')return json({id,slug:publishedSlug,title:'URL test',content:published.pages[id]});
  if(url.pathname==='/api/public/navigation')return json({items:[]});
  if(url.pathname.startsWith('/api/'))return json({});
  const path=url.pathname===`/p/${publishedSlug}`?'/visual-page.html':url.pathname,file=resolve(root,'.'+path);if(!file.startsWith(root+'/'))return res.writeHead(403).end();
  try{res.setHeader('content-type',{'.html':'text/html','.js':'text/javascript','.css':'text/css'}[extname(file)]||'application/octet-stream');res.end(await readFile(file));}catch{res.writeHead(404).end();}
 });
 await new Promise(done=>server.listen(0,'127.0.0.1',done));
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 t.after(async()=>{await browser.close();await new Promise(done=>server.close(done));});
 const page=await browser.newPage({viewport:{width,height:900}}),viewer=await browser.newPage({viewport:{width,height:900}});page.setDefaultTimeout(7000);viewer.setDefaultTimeout(7000);page.on('pageerror',e=>errors.push(e.message));viewer.on('pageerror',e=>errors.push(e.message));
 await page.goto(`http://127.0.0.1:${server.address().port}/editor-v2/index.html`);
 await page.locator(`.canvas-device-btn[data-device="${device}"]`).click();
 await viewer.goto(`http://127.0.0.1:${server.address().port}/p/${publishedSlug}`);
 const liveWidth=nodeId=>viewer.locator(`[data-node-id="${nodeId}"]`).evaluate(el=>getComputedStyle(el).width);
 const liveBackground=nodeId=>viewer.locator(`[data-node-id="${nodeId}"]`).evaluate(el=>getComputedStyle(el).backgroundColor);
 const previousWidths=await Promise.all(ids.map(nodeId=>liveWidth(nodeId)));
 await page.locator(`.node[data-node-id="${ids[0]}"]`).waitFor();
 await page.locator(`.node[data-node-id="${ids[0]}"]`).evaluate(el=>el.dispatchEvent(new MouseEvent('click',{bubbles:true})));
 await page.locator(`.node[data-node-id="${ids[1]}"]`).evaluate(el=>el.dispatchEvent(new MouseEvent('click',{bubbles:true,ctrlKey:true})));
 if(await page.locator('#rightDock').evaluate(el=>el.classList.contains('closed')))await page.locator('#openInspector').click();
 const input=page.locator('.multi-inspector [data-property-id="width"] input');await input.fill('2001');
 assert.equal(await input.getAttribute('aria-invalid'),'true');
 await input.press('Control+s');assert.equal(posts.length,0);assert.match(await page.locator('#saveStatus').textContent(),/Javítsd/);
 await page.locator('#save').evaluate(el=>el.click());await page.locator('#publish').evaluate(el=>el.click());assert.equal(posts.length,0);assert.deepEqual(draft.pages[id].nodes[ids[0]].responsive[device],{},'invalid width blocks Save and Publish');
 await input.fill('120');await input.press('Control+s');await page.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));assert.equal(posts.length,1);assert.equal(posts.at(-1).publish,false);
 for(const nodeId of ids){
  assert.equal(draft.pages[id].nodes[nodeId].responsive[device].width,'120px','multi-edit is saved for every selected Page Model node at its active breakpoint');
  assert.equal(draft.pages[id].nodes[nodeId].responsive[device==='mobile'?'desktop':'mobile'].width,undefined,'multi-edit does not write another breakpoint');
 }
 await viewer.reload();for(let i=0;i<ids.length;i++)assert.equal(await liveWidth(ids[i]),previousWidths[i],'draft Save leaves the published snapshot unchanged');
 await page.locator('#publish').click();await page.waitForFunction(()=>document.querySelector('#saveStatus').textContent==='Publikálva');assert.equal(posts.at(-1).publish,true);
 await viewer.reload();for(const nodeId of ids)assert.equal(await liveWidth(nodeId),'120px','explicit Publish updates both selected nodes in the public renderer');
 const priorBackgrounds=await Promise.all(ids.map(nodeId=>liveBackground(nodeId)));
 const background=page.locator('.multi-inspector-field[data-property-id="backgroundColor"]');
 assert.equal(await background.getAttribute('data-property-command'),'responsive.set');assert.equal(await background.getAttribute('data-property-key'),'backgroundColor');
 await background.locator('input[type="color"]').evaluate(input=>{input.value='#dc2626';input.dispatchEvent(new Event('change',{bubbles:true}))});
 for(const nodeId of ids)assert.equal(await page.locator(`.node[data-node-id="${nodeId}"]`).evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(220, 38, 38)','multi color command reaches each selected Canvas node');
 await page.locator('#save').click();await page.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));assert.equal(posts.at(-1).publish,false);
 for(const nodeId of ids)assert.equal(draft.pages[id].nodes[nodeId].responsive[device].backgroundColor,'#dc2626','multi-color draft is written to every selected node at the active breakpoint');
 await viewer.reload();for(let i=0;i<ids.length;i++)assert.equal(await liveBackground(ids[i]),priorBackgrounds[i],'background color remains draft-only');
 await page.locator('#publish').click();await page.waitForFunction(()=>document.querySelector('#saveStatus').textContent==='Publikálva');assert.equal(posts.at(-1).publish,true);
 await viewer.reload();for(const nodeId of ids)assert.equal(await liveBackground(nodeId),'rgb(220, 38, 38)','explicit Publish updates both selected nodes background');
 assert.deepEqual(errors,[]);
});
