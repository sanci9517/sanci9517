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
import {defaultTokens,normalizeTokens,tokenReference} from '../../public/editor-v2/core/design-tokens.js';

test('site styles propagate through linked page fields only after separate publication and detach/restore/conflict remain safe',async t=>{
  const pageModels={},nodeIds={};
  for(const slug of ['one','two']){
    const state=createEditorState(createDocument(createPage({id:slug,slug,name:slug})));state.document.siteId='site-default';
    execute(state,{type:'root.appearance.enable',payload:{nodeId:activePage(state).rootId}});
    execute(state,{type:'element.add',payload:{type:'text',parentId:activePage(state).rootId,props:{text:slug+' linked'},style:{color:tokenReference('colors.primary')}}});nodeIds[slug]=state.selection.primaryId;
    execute(state,{type:'content.properties.set',payload:{nodeId:nodeIds[slug],patch:{}}});
    execute(state,{type:'element.add',payload:{type:'text',parentId:activePage(state).rootId,props:{text:slug+' custom'},style:{color:'#112233'}}});
    execute(state,{type:'content.properties.set',payload:{nodeId:state.selection.primaryId,patch:{}}});pageModels[slug]={draft:structuredClone(state.document),published:structuredClone(state.document),version:1};
  }
  let design={schemaVersion:1,revision:0,draft:{siteId:'site-default',tokens:defaultTokens(),revision:0,status:'draft',updatedAt:new Date().toISOString()},published:null,history:[]};
  const root=resolve(import.meta.dirname,'../../public'),pagePosts=[];
  const server=createServer(async(req,res)=>{
    const url=new URL(req.url,'http://localhost'),json=(data,status=200)=>{res.writeHead(status,{'content-type':'application/json'});res.end(JSON.stringify(data))};
    if(url.pathname==='/api/admin/presentation'){
      if(req.method==='GET')return json({ok:true,data:design});
      let body='';for await(const chunk of req)body+=chunk;const request=JSON.parse(body);
      if(request.expectedRevision!==design.revision)return json({ok:false,error:{message:'REVISION_CONFLICT · a helyi munka megmaradt'}},409);
      const source=request.restoreRevision!==undefined?[design.published,...design.history].find(entry=>entry?.revision===request.restoreRevision):null;
      const tokens=normalizeTokens(source?.tokens||request.tokens),revision=design.revision+1,draft={...design.draft,tokens,revision,updatedAt:new Date().toISOString()};
      design={...design,revision,draft,published:request.publish?{...draft,status:'published'}:design.published,history:[...design.history,design.draft].slice(-20)};return json({ok:true,data:design});
    }
    if(url.pathname==='/api/public/presentation')return json({ok:true,data:{siteId:'site-default',tokens:url.searchParams.get('preview')==='1'?design.draft.tokens:design.published?.tokens||defaultTokens()}});
    if(url.pathname==='/api/admin/pages')return json({ok:true,data:url.searchParams.get('archived')==='1'?[]:Object.entries(pageModels).map(([id,value])=>({id,slug:id,title:id,content:value.draft,revision:value.version,isPublished:true}))});
    if(url.pathname==='/api/admin/editor'){
      if(req.method==='GET'){const id=url.searchParams.get('pageId')||'one',value=pageModels[id];return json({ok:true,data:{page:{id,document:value.draft,publishedRevisionId:'published'},revisions:[{id:'revision-'+value.version,version:value.version}]}})}
      let body='';for await(const chunk of req)body+=chunk;const request=JSON.parse(body),value=pageModels[request.pageId];pagePosts.push(request);value.draft=structuredClone(request.document);value.version++;if(request.publish)value.published=structuredClone(value.draft);return json({ok:true,data:{pageId:request.pageId,version:value.version,revisionId:'revision-'+value.version}});
    }
    if(url.pathname==='/api/public/pages'){const id=url.searchParams.get('slug'),value=pageModels[id];return json({ok:true,data:{id,slug:id,title:id,content:value.published.pages[id]}})}
    if(url.pathname==='/api/public/navigation')return json({ok:true,data:{items:[]}});
    if(url.pathname==='/api/integrations/twitch/connection')return json({ok:true,data:{connected:false}});
    if(url.pathname.startsWith('/api/'))return json({ok:true,data:{siteName:'Test'}});
    const path=url.pathname==='/admin/design'?'/admin-design.html':url.pathname.startsWith('/p/')?'/visual-page.html':url.pathname,file=resolve(root,'.'+path);
    if(!file.startsWith(root+'/'))return res.writeHead(403).end();try{res.setHeader('content-type',{'.html':'text/html','.js':'text/javascript','.css':'text/css'}[extname(file)]||'application/octet-stream');res.end(await readFile(file))}catch{res.writeHead(404).end()}
  });
  await new Promise(done=>server.listen(0,'127.0.0.1',done));
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
  t.after(async()=>{await browser.close();await new Promise(done=>server.close(done))});
  const base=`http://127.0.0.1:${server.address().port}`,brand=await browser.newPage({viewport:{width:1366,height:900}}),editor=await browser.newPage({viewport:{width:1366,height:900}}),one=await browser.newPage(),two=await browser.newPage();
  const errors=[];for(const page of [brand,editor,one,two]){page.setDefaultTimeout(6000);page.on('pageerror',error=>errors.push(error.message))}
  const liveNode=(page,slug)=>page.locator(`.creator-node[data-node-id="${nodeIds[slug]}"]`),color=async locator=>locator.evaluate(el=>getComputedStyle(el).color);
  await editor.goto(base+'/editor-v2/index.html?pageId=one');await brand.goto(base+'/admin/design');await one.goto(base+'/p/one');await two.goto(base+'/p/two');
  await brand.getByLabel('Márkaszín',{exact:true}).fill('#ff6600');await brand.locator('#save').click();await brand.getByText('Piszkozat mentve. Az élő oldalak változatlanok.',{exact:true}).waitFor();
  assert.equal(await color(liveNode(one,'one')),'rgb(112, 71, 235)');assert.equal(await color(liveNode(two,'two')),'rgb(112, 71, 235)');
  await editor.bringToFront();await editor.evaluate(()=>window.dispatchEvent(new Event('focus')));await editor.waitForFunction(id=>getComputedStyle(document.querySelector(`.node[data-node-id="${id}"]`)).color==='rgb(255, 102, 0)',nodeIds.one);
  assert.equal(pagePosts.length,0,'global draft changes do not save or publish pages');
  await brand.locator('#publish').click();await brand.getByText('A közös webhelystílusok publikálva.',{exact:true}).waitFor();await one.reload();await two.reload();
  assert.equal(await color(liveNode(one,'one')),'rgb(255, 102, 0)');assert.equal(await color(liveNode(two,'two')),'rgb(255, 102, 0)');
  assert.equal(await color(one.getByText('one custom',{exact:true})),'rgb(17, 34, 51)');
  await editor.locator(`.node[data-node-id="${nodeIds.one}"]`).evaluate(el=>el.click());await editor.locator('#openInspector').click();
  const typography=editor.locator('.inspector-group-title').filter({hasText:'Tipográfia'});if(await typography.getAttribute('aria-expanded')==='false')await typography.click();
  const picker=editor.locator('[data-property-id="typography.color"] .property-token-picker');assert.equal(await picker.inputValue(),'colors.primary');
  await picker.selectOption('');await editor.locator('#undo').click();assert.equal(await picker.inputValue(),'colors.primary');await editor.locator('#redo').click();assert.equal(await picker.inputValue(),'');
  await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));await editor.locator('#publish').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent==='Publikálva');
  await brand.getByLabel('Márkaszín',{exact:true}).fill('#0088aa');await brand.locator('#publish').click();await brand.getByText('A közös webhelystílusok publikálva.',{exact:true}).waitFor();await one.reload();await two.reload();
  assert.equal(await color(liveNode(one,'one')),'rgb(255, 102, 0)','detached page field stays unchanged');assert.equal(await color(liveNode(two,'two')),'rgb(0, 136, 170)');
  await brand.locator('#history').selectOption('2');await brand.locator('#restore').click();await brand.getByText('Korábbi változat visszaállítva piszkozatként.',{exact:true}).waitFor();assert.equal(await brand.getByLabel('Márkaszín',{exact:true}).inputValue(),'#ff6600');await two.reload();assert.equal(await color(liveNode(two,'two')),'rgb(0, 136, 170)');
  design.revision++;await brand.getByLabel('Márkaszín',{exact:true}).fill('#aabbcc');await brand.locator('#save').click();await brand.locator('#reload').waitFor();assert.equal(await brand.getByLabel('Márkaszín',{exact:true}).inputValue(),'#aabbcc');
  await brand.setViewportSize({width:390,height:800});assert.ok((await brand.locator('#publish').boundingBox()).height>=44);await brand.screenshot({path:'/tmp/creator-ux-p0-brand-kit-mobile.png'});
  assert.deepEqual(errors,[]);
});
