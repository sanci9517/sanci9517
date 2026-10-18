import assert from 'node:assert/strict';
import test from 'node:test';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve,extname} from 'node:path';
import {chromium} from 'playwright';
import {createDocument} from '../../public/editor-v2/core/schema.js';
import {createEditorState,activePage} from '../../public/editor-v2/core/state.js';
import {execute} from '../../public/editor-v2/core/commands.js';

test('structured Inspector editing survives Save, Publish and public interaction on desktop and mobile',async t=>{
 const model=createEditorState(createDocument()),pageId=model.document.activePageId;
 const root=activePage(model).rootId,ids={};
 for(const type of ['list','table','tabs','accordion','gallery','carousel']){
  execute(model,{type:'element.add',payload:{type,parentId:root,name:type}});
  ids[type]=model.selection.primaryId;
 }
 for(const [type,props] of [
  ['image',{src:'/media/banner.jpg',alt:'Kezdőlap borítókép'}],
  ['video',{src:'/media/trailer.mp4'}],
  ['audio',{src:'/media/theme.mp3'}],
  ['heading',{text:'A fő cím',level:1}],
  ['link',{text:'Megnyitás',href:'/p/about',newWindow:true}]
 ]){
  execute(model,{type:'element.add',payload:{type,parentId:root,props,name:type}});
  ids[type]=model.selection.primaryId;
 }
 execute(model,{type:'element.update',payload:{nodeId:ids.heading,patch:{accessibility:{anchorId:'main-heading',ariaLabel:'Főcím'}}}});
 execute(model,{type:'element.update',payload:{nodeId:ids.link,patch:{states:{hover:{backgroundColor:'#123456',color:'#ffffff'},focus:{outlineColor:'#00ff00'}}}}});
 const img=activePage(model).nodes[ids.gallery];
 execute(model,{type:'element.update',payload:{nodeId:img.id,patch:{props:{...img.props,contentModel:{version:1,items:[{src:'/media/example.jpg',alt:'Próbakép',caption:'Tesztkép'},{src:'/media/second.jpg',alt:'Második kép',caption:'Második kép leírása'}]}}}}});
 let draft=structuredClone(model.document),published=structuredClone(model.document),version=1;
 const posts=[];
 const rootDir=resolve(import.meta.dirname,'../../public');
 const server=createServer(async(req,res)=>{
  const url=new URL(req.url,'http://localhost');
  const json=data=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(data))};
  if(url.pathname==='/api/admin/pages')return json({ok:true,data:url.searchParams.get('archived')==='1'?[]:[{id:pageId,slug:'test',title:'Test',content:draft,revision:version,isPublished:true}]});
  if(url.pathname==='/api/admin/editor'){
   if(req.method==='GET')return json({ok:true,data:{page:{id:pageId,document:draft,publishedRevisionId:'published'},revisions:[{id:'revision-'+version,version}]}});
   let body='';for await(const chunk of req)body+=chunk;
   const request=JSON.parse(body);posts.push(request);draft=structuredClone(request.document);version++;
   if(request.publish)published=structuredClone(draft);
   return json({ok:true,data:{pageId,version,revisionId:'revision-'+version,published:Boolean(request.publish)}});
  }
  if(url.pathname==='/api/public/pages')return json({ok:true,data:{id:pageId,slug:'test',title:'Test',description:'',content:published.pages[pageId]}});
  if(url.pathname==='/api/public/navigation')return json({ok:true,data:{items:[]}});
  if(url.pathname==='/api/integrations/twitch/connection')return json({ok:true,data:{connected:false}});
  if(url.pathname.startsWith('/api/'))return json({ok:true,data:{siteName:'Test'}});
  const path=url.pathname==='/p/test'?'/visual-page.html':url.pathname;
  const file=resolve(rootDir,'.'+path);
  if(!file.startsWith(rootDir+'/'))return res.writeHead(403).end();
  try{res.setHeader('content-type',{'.html':'text/html','.js':'text/javascript','.css':'text/css'}[extname(file)]||'application/octet-stream');res.end(await readFile(file))}
  catch{res.writeHead(404).end()}
 });
 await new Promise(done=>server.listen(0,'127.0.0.1',done));
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
 t.after(async()=>{await browser.close();await new Promise(done=>server.close(done))});
 const base='http://127.0.0.1:'+server.address().port;
 const editor=await browser.newPage({viewport:{width:1366,height:900}}),viewer=await browser.newPage();
 editor.setDefaultTimeout(7000);viewer.setDefaultTimeout(7000);
 const errors=[];editor.on('pageerror',e=>errors.push('editor:'+e.message));viewer.on('pageerror',e=>errors.push('public:'+e.message));
 await editor.goto(base+'/editor-v2/index.html');
 const select=async id=>{
  await editor.locator('.node[data-node-id="'+id+'"]').evaluate(el=>el.click());
  if(await editor.locator('#rightDock').evaluate(el=>el.classList.contains('closed')))await editor.locator('#openInspector').click();
  await editor.locator('.inspector-tabs button').filter({hasText:'Tartalom'}).click();
 };
 await editor.locator('.node[data-node-id="'+ids.list+'"]').evaluate(el=>el.click());
 await editor.locator('.node[data-node-id="'+ids.table+'"]').evaluate(el=>el.dispatchEvent(new MouseEvent('click',{bubbles:true,ctrlKey:true})));
 const multi=editor.locator('.multi-inspector');
 await multi.waitFor({state:'attached'});
 assert.match(await multi.locator('h3').textContent(),/2 elem/);
 await multi.locator('.multi-inspector-field input[type=color]').first().evaluate(el=>{el.value='#112233';el.dispatchEvent(new Event('change',{bubbles:true}))});
 assert.equal(posts.length,0,'bulk edit does not publish or save automatically');
  await select(ids.tabs);
 assert.equal(await editor.locator('.structured-inspector h3').textContent(),'Fülek');
 const first=editor.locator('.structured-item').first();
 await first.locator('input').fill('Bemutatkozás');
 await first.locator('input').press('Tab');
 assert.equal(draft.pages[pageId].nodes[ids.tabs].props.contentModel.items[0].label,'Első fül','draft snapshot is unchanged before Save');
 await editor.locator('#save').click();
 await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
 assert.equal(posts.at(-1).publish,false);
 assert.equal(published.pages[pageId].nodes[ids.tabs].props.contentModel.items[0].label,'Első fül');
 assert.equal(draft.pages[pageId].nodes[ids.tabs].props.contentModel.items[0].label,'Bemutatkozás');
 await editor.locator('#publish').click();
 await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
 assert.equal(posts.at(-1).publish,true);
 await viewer.goto(base+'/p/test');
 const mediaImage=viewer.locator('.visual-editor-node[data-node-id="'+ids.image+'"]');
 assert.equal(await mediaImage.getAttribute('alt'),'Kezdőlap borítókép');
 assert.equal(await viewer.locator('video[data-node-id="'+ids.video+'"][controls]').count(),1);
 assert.equal(await viewer.locator('audio[data-node-id="'+ids.audio+'"][controls]').count(),1);
 assert.equal(await viewer.locator('h1[data-node-id="'+ids.heading+'"]').getAttribute('id'),'main-heading');
 const newTabLink=viewer.locator('a[data-node-id="'+ids.link+'"]');
 assert.equal(await newTabLink.getAttribute('target'),'_blank');
 assert.equal(await newTabLink.getAttribute('rel'),'noopener noreferrer');
 await newTabLink.hover();
 assert.equal(await newTabLink.evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(18, 52, 86)');
 const tabs=viewer.locator('.visual-editor-node[data-node-id="'+ids.tabs+'"]');
 await tabs.locator('[role=tab]').first().waitFor();
 assert.equal(await tabs.locator('[role=tab]').first().textContent(),'Bemutatkozás');
 assert.equal(await tabs.locator('[role=tabpanel]:visible').count(),1);
 await tabs.locator('[role=tab]').first().focus();
 await viewer.keyboard.press('ArrowRight');
 assert.equal(await tabs.locator('[role=tab]').nth(1).getAttribute('aria-selected'),'true');
 assert.equal(await tabs.locator('[role=tabpanel]:visible').count(),1);
 const accordion=viewer.locator('.visual-editor-node[data-node-id="'+ids.accordion+'"]');
 assert.equal(await accordion.locator('details').count(),2);
 await accordion.locator('summary').nth(1).click();
 assert.ok(await accordion.locator('details').nth(1).evaluate(el=>el.open));
 const gallery=viewer.locator('.visual-editor-node[data-node-id="'+ids.gallery+'"]');
 await gallery.locator('.visual-gallery-thumb').first().click();
 assert.ok(await gallery.locator('dialog').evaluate(el=>el.open));
 await gallery.locator('.visual-gallery-next').click();
 assert.equal(await gallery.locator('dialog img').getAttribute('alt'),'Második kép');
 await viewer.keyboard.press('ArrowLeft');
 assert.equal(await gallery.locator('dialog img').getAttribute('alt'),'Próbakép');
 await viewer.keyboard.press('Escape');
 assert.ok(!(await gallery.locator('dialog').evaluate(el=>el.open)));
 const carousel=viewer.locator('.visual-editor-node[data-node-id="'+ids.carousel+'"]');
 assert.equal(await carousel.locator('.visual-carousel-slide:visible').count(),1);
 await carousel.locator('.visual-carousel-next').click();
 assert.equal(await carousel.locator('.visual-carousel-count').textContent(),'2 / 2');
 assert.equal(await carousel.locator('.visual-carousel-slide:visible h3').textContent(),'Második dia');
  assert.equal(await viewer.locator('.visual-editor-node[data-node-id="'+ids.list+'"]').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(17, 34, 51)');
  const list=viewer.locator('.visual-editor-node[data-node-id="'+ids.list+'"]');
 assert.equal(await list.locator('li').count(),3);
 const table=viewer.locator('.visual-editor-node[data-node-id="'+ids.table+'"]');
 assert.equal(await table.locator('th').count(),2);
 await editor.setViewportSize({width:390,height:800});
 await editor.locator('.node[data-node-id="'+ids.tabs+'"]').evaluate(el=>el.click());
 const mobile=editor.locator('.structured-item .structured-action').first();
 await mobile.waitFor({state:'attached'});
 assert.ok(await mobile.evaluate(el=>getComputedStyle(el).minHeight==='44px'));
 assert.deepEqual(errors,[]);
});
