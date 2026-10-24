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
const types=['gallery','carousel'];
async function fixture(t,width){
 const state=createEditorState(createDocument()),pageId=state.document.activePageId,rootId=activePage(state).rootId,ids={};
 const items=['center','top','bottom','left','right'].map((focalPoint,index)=>({src:'/fixture-old.svg',alt:'Kép '+index,caption:'Felirat '+index,focalPoint}));
 items.push({src:'/fixture-old.svg',alt:'Vegyes X',focalPoint:'top',focalX:24},{src:'/fixture-old.svg',alt:'Vegyes Y',focalPoint:'right',focalY:68});
 for(const type of types){
  execute(state,{type:'element.add',payload:{type,parentId:rootId,style:{width:'320px'}}});ids[type]=state.selection.primaryId;
  execute(state,{type:'content.properties.set',payload:{nodeId:ids[type],patch:{items:structuredClone(items)}}});
 }
 let draft=structuredClone(state.document),published=structuredClone(draft),version=1;
 const original=structuredClone(draft),posts=[],requests=[],errors=[],root=resolve(import.meta.dirname,'../../public');

 const server=createServer(async(req,res)=>{
  const url=new URL(req.url,'http://localhost');requests.push({path:url.pathname,method:req.method});
  const json=body=>{res.writeHead(200,{'content-type':'application/json'});res.end(JSON.stringify(body));};
  if(url.pathname==='/api/admin/pages')return json({ok:true,data:url.searchParams.has('archived')?[]:[{id:pageId,slug:'test',title:'Test',content:draft,revision:version,isPublished:true}]});
  if(url.pathname==='/api/admin/editor'){
   if(req.method==='GET')return json({ok:true,data:{page:{id:pageId,document:draft,publishedRevisionId:'published'},revisions:[{id:'revision-'+version,version}]}});
   let body='';for await(const chunk of req)body+=chunk;const saved=JSON.parse(body);posts.push(saved);draft=structuredClone(saved.document);version++;
   if(saved.publish)published=structuredClone(draft);
   return json({ok:true,data:{pageId,version,revisionId:'revision-'+version,published:Boolean(saved.publish)}});
  }
  if(url.pathname==='/api/public/pages')return json({ok:true,data:{id:pageId,slug:'test',title:'Test',content:published.pages[pageId]}});
  if(url.pathname==='/api/public/navigation')return json({ok:true,data:{items:[]}});
  if(url.pathname==='/api/integrations/twitch/connection')return json({ok:true,data:{connected:false}});
  if(url.pathname.endsWith('.svg')||url.pathname.startsWith('/media/')||url.pathname==='/api/admin/media'){
   res.writeHead(200,{'content-type':'image/svg+xml'});return res.end('<svg xmlns="http://www.w3.org/2000/svg" width="4" height="4"><rect width="4" height="4" fill="purple"/></svg>');
  }

  if(url.pathname.startsWith('/api/'))return json({ok:true,data:{siteName:'Test'}});
  const file=resolve(root,'.'+(url.pathname==='/p/test'?'/visual-page.html':url.pathname));if(!file.startsWith(root+'/'))return res.writeHead(403).end();
  try{const contents=await readFile(file);res.writeHead(200,{'content-type':{'.html':'text/html','.js':'text/javascript','.css':'text/css'}[extname(file)]||'application/octet-stream'});res.end(contents);}catch{res.writeHead(404).end();}
 });
 await new Promise(done=>server.listen(0,'127.0.0.1',done));
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
 t.after(async()=>{await browser.close();await new Promise(done=>server.close(done));});
 const base='http://127.0.0.1:'+server.address().port;
 const editor=await browser.newPage({viewport:{width,height:900}}),live=await browser.newPage({viewport:{width,height:900}});
 for(const page of [editor,live]){page.setDefaultTimeout(8000);page.on('pageerror',e=>errors.push(e.message));}
 await editor.goto(base+'/editor-v2/index.html');await live.goto(base+'/p/test');
 const node=(page,type)=>page.locator(`.creator-node[data-node-id="${ids[type]}"]`);
 const select=async type=>{await node(editor,type).evaluate(el=>el.click());if(await editor.locator('#rightDock').evaluate(el=>el.classList.contains('closed')))await editor.locator('#openInspector').click();await editor.locator('.inspector-tabs button').nth(1).click();};
 const rows=()=>editor.locator('.content-repeater fieldset');
 const slider=(index,axis)=>rows().nth(index).getByRole('slider',{name:axis==='x'?'Kivágás vízszintesen':'Kivágás függőlegesen',exact:true});
 const save=async publish=>{await editor.locator(publish?'#publish':'#save').click();try{await editor.waitForFunction(pub=>document.querySelector('#saveStatus').textContent.startsWith(pub?'Publikálva':'Mentve'),publish);}catch(error){throw new Error(await editor.locator('#saveStatus').textContent(),{cause:error});}};
 return {editor,live,select,save,node,rows,slider,errors,posts,requests,original,ids,pageId,draft:()=>draft};
}

const expected=[[50,50],[50,0],[50,100],[0,50],[100,50],[24,0],[100,68]];
for(const width of [390,1366])test(`gallery/carousel legacy crop matches Inspector, Canvas and publication at ${width}px`,async t=>{
 const f=await fixture(t,width);
 const position=(page,type,index)=>f.node(page,type).locator('img').nth(index).evaluate(el=>getComputedStyle(el).objectPosition);
 for(const type of types){
  await f.select(type);
  for(const [index,[x,y]] of expected.entries()){
   assert.equal(await position(f.editor,type,index),`${x}% ${y}%`);
   assert.equal(await position(f.live,type,index),`${x}% ${y}%`);
   assert.equal(await f.slider(index,'x').inputValue(),String(x),`${type} row ${index} horizontal Inspector value`);
   assert.equal(await f.slider(index,'y').inputValue(),String(y),`${type} row ${index} vertical Inspector value`);
   assert.equal(await f.rows().nth(index).locator('[data-content-key="focalX"] output').textContent(),`${x}%`);
   assert.equal(await f.rows().nth(index).locator('[data-content-key="focalY"] output').textContent(),`${y}%`);
  }
 }
 assert.equal(f.posts.length,0,'opening crop controls cannot write');
 await f.save(false);
 for(const type of types)assert.deepEqual(f.draft().pages[f.pageId].nodes[f.ids[type]].props.items,f.original.pages[f.pageId].nodes[f.ids[type]].props.items,'read-only crop defaults cannot materialize in saved rows');
 for(const type of types){
  await f.select(type);
  await f.rows().nth(1).getByRole('textbox',{name:'Képaláírás',exact:true}).fill('Csak a felirat változik');
  assert.equal(await position(f.editor,type,1),'50% 0%','an unrelated field preserves the preset');
  await f.slider(1,'x').focus();await f.slider(1,'x').press('ArrowRight');
  assert.equal(await position(f.editor,type,1),'51% 0%','one-axis edit starts at the rendered position and preserves the other axis');
  await f.editor.keyboard.press('Control+z');assert.equal(await position(f.editor,type,1),'50% 0%');
  assert.equal(await f.slider(1,'x').inputValue(),'50');assert.equal(await f.slider(1,'y').inputValue(),'0');
  await f.editor.keyboard.press('Control+Shift+z');assert.equal(await position(f.editor,type,1),'51% 0%');
 }
 await f.save(false);await f.live.reload();
 for(const type of types){
  const rows=f.draft().pages[f.pageId].nodes[f.ids[type]].props.items,original=f.original.pages[f.pageId].nodes[f.ids[type]].props.items;
  assert.equal(rows[1].focalX,51);assert.equal(Object.hasOwn(rows[1],'focalY'),false,'the untouched legacy axis stays absent');
  assert.equal(rows[1].focalPoint,'top');assert.equal(rows[1].caption,'Csak a felirat változik');
  for(const index of [0,2,3,4,5,6])assert.deepEqual(rows[index],original[index],'other images keep their persisted properties');
  assert.equal(await position(f.live,type,1),'50% 0%','Save cannot publish the crop');
 }
 await f.editor.reload();
 for(const type of types){await f.select(type);assert.equal(await f.slider(1,'x').inputValue(),'51');assert.equal(await f.slider(1,'y').inputValue(),'0');}
 await f.save(true);await f.live.reload();
 for(const type of types)for(let index=0;index<expected.length;index++){
  const [x,y]=index===1?[51,0]:expected[index];assert.equal(await position(f.live,type,index),`${x}% ${y}%`);
  assert.equal(await position(f.editor,type,index),`${x}% ${y}%`);
 }
 assert.ok(f.requests.every(r=>r.method==='GET'||(r.method==='POST'&&r.path==='/api/admin/editor')));assert.deepEqual(f.errors,[]);
});

for(const width of [390,1366])test(`gallery source switching and legacy crop edits compose without stale rows at ${width}px`,async t=>{
 const f=await fixture(t,width);
 const image=(page,type)=>f.node(page,type).locator('img').nth(1);
 for(const type of types){
  await f.select(type);
  const url=`/fixture-integrated-${type}.svg`;
  await f.rows().nth(1).getByRole('textbox',{name:'Külső média címe',exact:true}).fill(url);
  assert.equal(await image(f.editor,type).getAttribute('src'),url);
  assert.equal(await f.slider(1,'x').inputValue(),'50');
  assert.equal(await f.slider(1,'y').inputValue(),'0');
  await f.slider(1,'x').focus();await f.slider(1,'x').press('ArrowRight');
  assert.equal(await image(f.editor,type).evaluate(el=>getComputedStyle(el).objectPosition),'51% 0%');
  assert.equal(await image(f.editor,type).getAttribute('src'),url,'crop edit keeps the new source from the live row');
  await f.editor.keyboard.press('Control+z');
  assert.equal(await image(f.editor,type).getAttribute('src'),url);
  assert.equal(await f.slider(1,'x').inputValue(),'50');
  await f.editor.keyboard.press('Control+z');
  assert.equal(await image(f.editor,type).getAttribute('src'),'/fixture-old.svg');
  await f.editor.keyboard.press('Control+Shift+z');await f.editor.keyboard.press('Control+Shift+z');
  assert.equal(await image(f.editor,type).getAttribute('src'),url);
  assert.equal(await f.slider(1,'x').inputValue(),'51');
 }
 assert.equal(f.posts.length,0);
 await f.save(false);await f.live.reload();
 for(const type of types){
  const original=f.original.pages[f.pageId].nodes[f.ids[type]].props.items;
  const rows=f.draft().pages[f.pageId].nodes[f.ids[type]].props.items;
  assert.deepEqual(rows[1],{...original[1],src:`/fixture-integrated-${type}.svg`,assetId:'',focalX:51});
  for(const index of [0,2,3,4,5,6])assert.deepEqual(rows[index],original[index]);
  assert.equal(Object.hasOwn(rows[1],'focalY'),false,'view-only preset defaults are not persisted');
  assert.equal(await image(f.live,type).getAttribute('src'),'/fixture-old.svg','Save leaves the published source unchanged');
 }
 await f.editor.reload();
 for(const type of types){await f.select(type);assert.equal(await f.slider(1,'x').inputValue(),'51');assert.equal(await f.slider(1,'y').inputValue(),'0');}
 await f.save(true);await f.live.reload();
 for(const type of types){
  assert.equal(await image(f.live,type).getAttribute('src'),`/fixture-integrated-${type}.svg`);
  assert.equal(await image(f.live,type).evaluate(el=>getComputedStyle(el).objectPosition),'51% 0%');
 }
 assert.deepEqual(f.errors,[]);
 assert.ok(f.requests.every(r=>r.method==='GET'||(r.method==='POST'&&r.path==='/api/admin/editor')));
});
