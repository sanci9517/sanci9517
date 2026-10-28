import assert from 'node:assert/strict';
import test from 'node:test';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve,extname} from 'node:path';
import {chromium} from 'playwright';
import {createDocument} from '../../public/editor-v2/core/schema.js';

test('palette items are inserted beside the selected item in canvas flow and saved in that order',async t=>{
  const document=createDocument(),pageId=document.activePageId,rootId=document.pages[pageId].rootId;
  let draft=structuredClone(document),published=null,version=1;
  const posts=[],root=resolve(import.meta.dirname,'../../public');
  const server=createServer(async(req,res)=>{
    const url=new URL(req.url,'http://localhost');
    const json=data=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(data))};
    if(url.pathname==='/api/admin/pages')return json({ok:true,data:url.searchParams.get('archived')==='1'?[]:[{id:pageId,slug:'test',title:'Test',content:draft,revision:version,isPublished:Boolean(published)}]});
    if(url.pathname==='/api/admin/editor'){
      if(req.method==='GET')return json({ok:true,data:{page:{id:pageId,document:draft,publishedRevisionId:published?'published':null},revisions:[{id:'revision-'+version,version}]}});
      let body='';for await(const chunk of req)body+=chunk;
      const request=JSON.parse(body);posts.push(request);draft=structuredClone(request.document);version++;
      if(request.publish)published=structuredClone(draft);
      return json({ok:true,data:{pageId,version,revisionId:'revision-'+version,published:Boolean(request.publish)}});
    }
    if(url.pathname==='/api/public/pages')return json(published?{ok:true,data:{id:pageId,slug:'test',title:'Test',content:published.pages[pageId]}}:{ok:false});
    if(url.pathname==='/api/public/navigation')return json({ok:true,data:{items:[]}});
    if(url.pathname==='/api/integrations/twitch/connection')return json({ok:true,data:{connected:false}});
    if(url.pathname.startsWith('/api/'))return json({ok:true,data:{siteName:'Test'}});
    const asset=url.pathname==='/p/test'?'/visual-page.html':url.pathname,file=resolve(root,'.'+asset);
    if(!file.startsWith(root+'/')){res.writeHead(403).end();return}
    try{res.setHeader('content-type',{'.html':'text/html','.js':'text/javascript','.css':'text/css'}[extname(file)]||'application/octet-stream');res.end(await readFile(file))}
    catch{res.writeHead(404).end()}
  });
  await new Promise(done=>server.listen(0,'127.0.0.1',done));
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
  t.after(async()=>{await browser.close();await new Promise(done=>server.close(done))});
  const tab=await browser.newPage({viewport:{width:1366,height:900}});tab.setDefaultTimeout(7000);
  const errors=[];tab.on('pageerror',error=>errors.push(error.message));
  await tab.goto(`http://127.0.0.1:${server.address().port}/editor-v2/index.html`);
  await tab.locator('.node[data-node-id="'+rootId+'"] > .node-head').waitFor();
  await tab.locator('.rail-btn[data-tab="elements"]').click();
  await tab.locator('.element-group-title').filter({hasText:'Szöveg'}).click();
  const palette=tab.locator('#elementList .element');
  await palette.filter({hasText:'Szöveg'}).click();
  const rootNode=tab.locator('.page-canvas .node[data-node-id="'+rootId+'"]');
  const findChild=async type=>{const id=await tab.waitForFunction(({rootId,type})=>{const root=document.querySelector('.page-canvas .node[data-node-id="'+rootId+'"]');return [...(root?.children||[])].find(node=>node.matches('.node')&&node.querySelector(':scope > .node-head small')?.textContent===type)?.dataset.nodeId||false},{rootId,type});return tab.locator('.node[data-node-id="'+id+'"]')};
  const first=await findChild('text');const firstId=await first.getAttribute('data-node-id');
  await palette.filter({hasText:'Heading'}).click();
  const heading=await findChild('heading');const headingId=await heading.getAttribute('data-node-id');
  await first.click();
  await palette.filter({has:tab.locator('span').getByText('Link',{exact:true})}).click();
  const link=await findChild('link');const linkId=await link.getAttribute('data-node-id');
  const canvasState=await tab.locator('.page-canvas .node[data-node-id="'+rootId+'"]').evaluate(el=>[...el.children].filter(child=>child.matches('.node')).map(child=>({id:child.dataset.nodeId,top:child.getBoundingClientRect().top,bottom:child.getBoundingClientRect().bottom})));
  assert.deepEqual(canvasState.map(item=>item.id),[firstId,linkId,headingId],'new node should be inserted immediately after the selected canvas item');
  assert.ok(canvasState[0].bottom<=canvasState[1].top+1&&canvasState[1].bottom<=canvasState[2].top+1,'normal-flow elements should not overlap on the canvas');
  await tab.locator('.canvas-device-btn[data-device="mobile"]').click();
  const mobileState=await rootNode.evaluate(el=>[...el.children].filter(child=>child.matches('.node')).map(child=>({id:child.dataset.nodeId,top:child.getBoundingClientRect().top,bottom:child.getBoundingClientRect().bottom})));
  assert.deepEqual(mobileState.map(item=>item.id),[firstId,linkId,headingId]);
  assert.ok(mobileState[0].bottom<=mobileState[1].top+1&&mobileState[1].bottom<=mobileState[2].top+1,'normal-flow elements should not overlap in the mobile canvas');
  await tab.locator('#save').click();
  await tab.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.startsWith('Mentve'));
  assert.equal(posts.at(-1)?.publish,false,'Save keeps publishing separate');
  assert.deepEqual(draft.pages[pageId].nodes[rootId].children,[firstId,linkId,headingId]);
  assert.equal(published,null);
  assert.deepEqual(errors,[]);
});
