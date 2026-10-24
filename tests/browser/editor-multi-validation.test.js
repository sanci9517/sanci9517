import assert from 'node:assert/strict';
import test from 'node:test';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {chromium} from 'playwright';
import {createDocument} from '../../public/editor-v2/core/schema.js';
import {createEditorState,activePage} from '../../public/editor-v2/core/state.js';
import {execute} from '../../public/editor-v2/core/commands.js';

for(const width of [390,1366])test(`multi-selection rejects invalid values and saves repaired values at ${width}px`,async t=>{
 let document=createDocument();const id=document.activePageId,slug='new-'+ 'long-path-'.repeat(7)+'end',publishedSlug='old-'+ 'long-path-'.repeat(7)+'end';
 const model=createEditorState(document);const ids=[];for(let i=0;i<2;i++){execute(model,{type:'element.add',payload:{type:'text',parentId:activePage(model).rootId}});ids.push(model.selection.primaryId);}document=model.document;let posts=0;
 const root=resolve(import.meta.dirname,'../../public'),errors=[];
 const server=createServer(async(req,res)=>{
  const url=new URL(req.url,'http://localhost');
  const json=data=>{res.setHeader('content-type','application/json');res.end(JSON.stringify({ok:true,data}));};
  if(url.pathname==='/api/admin/pages')return json(url.searchParams.has('archived')?[]:[{id,slug,publishedSlug,title:'URL test',content:document,isPublished:true,hasUnpublishedChanges:true,revision:1}]);
  if(url.pathname==='/api/admin/editor'&&req.method==='POST'){posts++;let body='';for await(const chunk of req)body+=chunk;const saved=JSON.parse(body).document;for(const nodeId of ids)assert.equal(saved.pages[id].nodes[nodeId].responsive.desktop.width,'120px');return json({pageId:id,version:2,revisionId:'r2'});}
  if(url.pathname==='/api/admin/editor')return json({page:{id,document,publishedRevisionId:'r1'},revisions:[{id:'r1',version:1}]});
  if(url.pathname.startsWith('/api/'))return json({});
  const file=resolve(root,'.'+url.pathname);if(!file.startsWith(root+'/'))return res.writeHead(403).end();
  try{res.setHeader('content-type',{'.html':'text/html','.js':'text/javascript','.css':'text/css'}[extname(file)]||'application/octet-stream');res.end(await readFile(file));}catch{res.writeHead(404).end();}
 });
 await new Promise(done=>server.listen(0,'127.0.0.1',done));
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 t.after(async()=>{await browser.close();await new Promise(done=>server.close(done));});
 const page=await browser.newPage({viewport:{width,height:900}});page.setDefaultTimeout(7000);page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`http://127.0.0.1:${server.address().port}/editor-v2/index.html`);
 await page.locator(`.node[data-node-id="${ids[0]}"]`).waitFor();
 await page.locator(`.node[data-node-id="${ids[0]}"]`).evaluate(el=>el.dispatchEvent(new MouseEvent('click',{bubbles:true})));
 await page.locator(`.node[data-node-id="${ids[1]}"]`).evaluate(el=>el.dispatchEvent(new MouseEvent('click',{bubbles:true,ctrlKey:true})));
 if(await page.locator('#rightDock').evaluate(el=>el.classList.contains('closed')))await page.locator('#openInspector').click();
 const input=page.locator('.multi-inspector [data-property-id="width"] input');await input.fill('2001');
 assert.equal(await input.getAttribute('aria-invalid'),'true');
 await input.press('Control+s');assert.equal(posts,0);assert.match(await page.locator('#saveStatus').textContent(),/Javítsd/);
 await page.locator('#save').evaluate(el=>el.click());await page.locator('#publish').evaluate(el=>el.click());assert.equal(posts,0);
 await input.fill('120');await input.press('Control+s');await page.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));assert.equal(posts,1);
 assert.deepEqual(errors,[]);
});
