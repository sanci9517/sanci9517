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
const assetId='6b1c2e65-e46e-4764-b234-123456789abc';
const types=['image','gallery','carousel','video'];
const target=(document,pageId,ids,type)=>{const props=document.pages[pageId].nodes[ids[type]].props;return ['gallery','carousel'].includes(type)?props.items[0]:props;};
const keys=type=>type==='video'?['poster','posterAssetId']:['src','assetId'];
async function fixture(t,width){
 const state=createEditorState(createDocument()),pageId=state.document.activePageId,rootId=activePage(state).rootId,ids={};
 const first={src:'/fixture-old.svg',assetId,alt:'Saját képleírás',caption:'Megőrzött képaláírás',fit:'contain',focalX:23,focalY:67};
 const second={src:'/fixture-second.svg',alt:'Másik elem',caption:'Másik felirat',fit:'cover',focalX:50,focalY:50};
 for(const type of types){
  execute(state,{type:'element.add',payload:{type,parentId:rootId,style:{width:'320px'}}});ids[type]=state.selection.primaryId;
  const props=type==='image'?first:type==='video'?{src:'/fixture.webm',poster:'/fixture-old.svg',posterAssetId:assetId,controls:true,muted:true}:{items:[first,second]};
  execute(state,{type:'content.properties.set',payload:{nodeId:ids[type],patch:structuredClone(props)}});
 }
 let draft=structuredClone(state.document),published=structuredClone(draft),version=1;
 const original=structuredClone(draft),posts=[],requests=[],errors=[],root=resolve(import.meta.dirname,'../../public');
 const video=await readFile(new URL('../fixtures/editor-sample.webm',import.meta.url));
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
  if(url.pathname==='/api/admin/media'&&!url.searchParams.has('id'))return json({ok:true,data:{assets:[{id:assetId,name:'Közös kép.svg',mimeType:'image/svg+xml',altText:'Médiatár leírás',previewUrl:'/api/admin/media?id='+assetId}],nextCursor:null}});
  if(url.pathname.endsWith('.svg')||url.pathname.startsWith('/media/')||url.pathname==='/api/admin/media'){
   res.writeHead(200,{'content-type':'image/svg+xml'});return res.end('<svg xmlns="http://www.w3.org/2000/svg" width="4" height="4"><rect width="4" height="4" fill="purple"/></svg>');
  }
  if(url.pathname==='/fixture.webm'){res.writeHead(200,{'content-type':'video/webm'});return res.end(video);}
  if(url.pathname.startsWith('/api/'))return json({ok:true,data:{siteName:'Test'}});
  const file=resolve(root,'.'+(url.pathname==='/p/test'?'/visual-page.html':url.pathname));if(!file.startsWith(root+'/'))return res.writeHead(403).end();
  try{const contents=await readFile(file);res.writeHead(200,{'content-type':{'.html':'text/html','.js':'text/javascript','.css':'text/css'}[extname(file)]||'application/octet-stream'});res.end(contents);}catch{res.writeHead(404).end();}
 });
 await new Promise(done=>server.listen(0,'127.0.0.1',done));
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
 t.after(async()=>{await browser.close();await new Promise(done=>server.close(done));});
 const base='http://127.0.0.1:'+server.address().port;
 const editor=await browser.newPage({viewport:{width,height:900}}),live=await browser.newPage({viewport:{width,height:900}});
 for(const page of [editor,live]){page.setDefaultTimeout(8000);page.setDefaultNavigationTimeout(20000);page.on('pageerror',e=>errors.push(e.message));}
 await editor.goto(base+'/editor-v2/index.html');await live.goto(base+'/p/test');
 const node=(page,type)=>page.locator(`.creator-node[data-node-id="${ids[type]}"]`);
 const media=(page,type)=>['gallery','carousel'].includes(type)?node(page,type).locator(`.creator-${type}>figure`).first().locator('img'):node(page,type).locator(type==='video'?'video':'img');
 const source=async(page,type)=>(await media(page,type).count())?(await media(page,type).getAttribute(type==='video'?'poster':'src')||''):'';
 const select=async type=>{await node(editor,type).evaluate(el=>el.click());if(await editor.locator('#rightDock').evaluate(el=>el.classList.contains('closed')))await editor.locator('#openInspector').click();await editor.locator('.inspector-tabs button').nth(1).click();};
 const scope=type=>['gallery','carousel'].includes(type)?editor.locator('.content-repeater fieldset').first():editor.locator('.element-content-controls');
 const field=type=>scope(type).getByRole('textbox',{name:type==='video'?'Külső borítókép címe':'Külső média címe',exact:true});
 const picker=type=>scope(type).locator(`[data-content-key="${keys(type)[1]}"]`);
 const choose=async type=>{await picker(type).getByRole('button',{name:'Médiatár megnyitása'}).click();await picker(type).getByRole('button',{name:'Közös kép.svg kiválasztása'}).click();};
 const save=async publish=>{await editor.locator(publish?'#publish':'#save').click();try{await editor.waitForFunction(pub=>document.querySelector('#saveStatus').textContent.startsWith(pub?'Publikálva':'Mentve'),publish);}catch(error){throw new Error(await editor.locator('#saveStatus').textContent(),{cause:error});}};
 return {editor,live,source,select,field,picker,choose,save,node,media,scope,errors,posts,requests,original,ids,pageId,draft:()=>draft};
}

for(const width of [390,1366])test(`authored image/gallery/carousel/poster source changes preserve editing and Save/Publish at ${width}px`,async t=>{
 const f=await fixture(t,width);
 for(const type of types){
  await f.select(type);assert.equal(await f.field(type).inputValue(),'/fixture-old.svg');
  assert.equal(await f.source(f.editor,type),'/api/admin/media?id='+assetId);
  await f.picker(type).getByRole('button',{name:'Kép eltávolítása',exact:true}).click();
  assert.equal(await f.source(f.editor,type),'','clearing a persisted dual source cannot resurrect its URL');
  assert.equal(await f.field(type).inputValue(),'');
  assert.equal(await f.picker(type).getByRole('button',{name:'Médiatár megnyitása'}).evaluate(el=>el===document.activeElement),true);
  await f.editor.keyboard.press('Control+z');
  assert.equal(await f.field(type).inputValue(),'/fixture-old.svg');assert.equal(await f.source(f.editor,type),'/api/admin/media?id='+assetId);
  await f.choose(type);assert.equal(await f.field(type).inputValue(),'','asset selection synchronizes the existing URL control');
  await f.field(type).fill('javascript:alert(1)');assert.equal(await f.field(type).getAttribute('aria-invalid'),'true');
  assert.equal(await f.source(f.editor,type),'/api/admin/media?id='+assetId,'invalid input cannot clear a valid reference');
  await f.field(type).press('Escape');assert.equal(await f.field(type).inputValue(),'','Escape restores the companion-updated committed value');
  const url=`/fixture-${width}-${type}.svg`;
  await f.field(type).evaluate((el,url)=>{
   window.__mediaSourceInput=el;el.focus();el.dispatchEvent(new CompositionEvent('compositionstart',{bubbles:true}));
   el.value='/unfinished';el.dispatchEvent(new InputEvent('input',{bubbles:true,isComposing:true,inputType:'insertCompositionText',data:'/unfinished'}));
   window.__finishMediaComposition=()=>{
    el.dispatchEvent(new CompositionEvent('compositionend',{bubbles:true,data:url}));el.value=url;el.setSelectionRange(url.length,url.length);
    el.dispatchEvent(new InputEvent('input',{bubbles:true,isComposing:false,inputType:'insertText',data:url}));
   };
  },url);
  assert.equal(await f.source(f.editor,type),'/api/admin/media?id='+assetId,'unfinished IME must not change a reference');
  await f.editor.evaluate(()=>window.__finishMediaComposition());
  await f.editor.waitForFunction(()=>window.__mediaSourceInput.getAttribute('aria-invalid')!=='true'&&document.querySelector('.element-content-controls .editor-media-selected')===null);
  assert.equal(await f.source(f.editor,type),url);
  assert.equal(await f.field(type).evaluate(el=>el===window.__mediaSourceInput&&el===document.activeElement&&el.selectionStart===el.value.length),true,'URL updates keep the DOM node, caret and focus');
  await f.editor.keyboard.press('Control+z');assert.equal(await f.source(f.editor,type),'/api/admin/media?id='+assetId,'one Undo restores the entire source pair');
  await f.editor.keyboard.press('Control+Shift+z');assert.equal(await f.source(f.editor,type),url);
  assert.equal(f.posts.length,0,'source edits never auto-save or publish');
 }
 await f.save(false);const draft=f.posts.at(-1).document;
 for(const type of types){
  const props=target(draft,f.pageId,f.ids,type),[src,id]=keys(type);assert.equal(props[id],'');assert.equal(props[src],`/fixture-${width}-${type}.svg`);
  if(type==='video')assert.equal(props.src,'/fixture.webm');else{assert.equal(props.alt,'Saját képleírás');assert.equal(props.caption,'Megőrzött képaláírás');}
  if(['gallery','carousel'].includes(type))assert.deepEqual(draft.pages[f.pageId].nodes[f.ids[type]].props.items[1],f.original.pages[f.pageId].nodes[f.ids[type]].props.items[1]);
  await f.live.reload();assert.equal(await f.source(f.live,type),'/media/'+assetId,'Save must leave the published reference intact');
 }
 await f.editor.reload();
 for(const type of types){await f.select(type);assert.equal(await f.field(type).inputValue(),`/fixture-${width}-${type}.svg`);}
 await f.save(true);await f.live.reload();
 for(const type of types)assert.equal(await f.source(f.live,type),`/fixture-${width}-${type}.svg`);
 for(const type of types){await f.select(type);await f.choose(type);await f.picker(type).getByRole('button',{name:'Kép eltávolítása',exact:true}).click();assert.equal(await f.source(f.editor,type),'');}
 await f.save(false);await f.live.reload();
 for(const type of types)assert.equal(await f.source(f.live,type),`/fixture-${width}-${type}.svg`,'removing a draft reference cannot publish');
 const saves=f.posts.length;await f.editor.locator('#publish').click();
 await f.editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.includes('forrás'));
 assert.equal(f.posts.length,saves,'missing image sources still block publication');
 await f.live.reload();for(const type of types)assert.equal(await f.source(f.live,type),`/fixture-${width}-${type}.svg`);
 for(const type of ['image','gallery','carousel']){await f.select(type);await f.field(type).fill(`/fixture-repaired-${type}.svg`);}
 await f.save(true);await f.live.reload();
 assert.equal(await f.source(f.live,'video'),'');
 for(const type of ['image','gallery','carousel'])assert.equal(await f.source(f.live,type),`/fixture-repaired-${type}.svg`);
 assert.ok(f.requests.every(r=>r.method==='GET'||(r.method==='POST'&&r.path==='/api/admin/editor')),'no file-deletion/upload calls');assert.deepEqual(f.errors,[]);
});

test('failed source commits preserve companion controls and the next edit starts from the last successful row',async t=>{
 const f=await fixture(t,1366);
 const results=await f.editor.evaluate(async({document:original,pageId,ids})=>{
  const {renderElementContentControls}=await import('/editor-v2/ui/element-content-controls.js');const results=[];
  for(const type of ['image','gallery','carousel','video'])for(const mode of ['false','throw']){
   const node=structuredClone(original.pages[pageId].nodes[ids[type]]),before=structuredClone(node.props);let reject=true,lastPatch;
   const root=renderElementContentControls(node,{pending:()=>{},apply:patch=>{
    if(reject){if(mode==='throw')throw new Error('Fixture commit rejected');return false;}
    lastPatch=structuredClone(patch);Object.assign(node.props,patch);return true;
   }});window.document.body.append(root);
   const row=['gallery','carousel'].includes(type)?root.querySelector('fieldset'):root;
   const key=type==='video'?'poster':'src',id=type==='video'?'posterAssetId':'assetId';
   const input=row.querySelector(`[data-content-key="${key}"] input`),picker=row.querySelector(`[data-content-key="${id}"]`);
   picker.querySelector('.editor-media-selection button').click();
   const clearRejected=Boolean(picker.querySelector('.editor-media-selected'))&&input.value==='/fixture-old.svg';
   input.value='/fixture-next.svg';input.dispatchEvent(new InputEvent('input',{bubbles:true}));
   const inputRejected=input.getAttribute('aria-invalid')==='true'&&Boolean(picker.querySelector('.editor-media-selected'));
   input.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
   const restored=input.value==='/fixture-old.svg';reject=false;
   input.value='/fixture-next.svg';input.dispatchEvent(new InputEvent('input',{bubbles:true}));
   const value=['gallery','carousel'].includes(type)?node.props.items[0]:node.props;
   results.push({type,mode,clearRejected,inputRejected,restored,source:value[key],id:value[id],preview:!!picker.querySelector('.editor-media-selected'),
    secondPreserved:!before.items||JSON.stringify(before.items[1])===JSON.stringify(node.props.items[1]),patchKeys:Object.keys(lastPatch)});root.remove();
  }return results;
 },{document:f.original,pageId:f.pageId,ids:f.ids});
 for(const result of results){
  assert.equal(result.clearRejected,true,JSON.stringify(result));assert.equal(result.inputRejected,true);assert.equal(result.restored,true);
  assert.equal(result.source,'/fixture-next.svg');assert.equal(result.id,'');assert.equal(result.preview,false);assert.equal(result.secondPreserved,true);
  assert.deepEqual(result.patchKeys,['gallery','carousel'].includes(result.type)?['items']:[result.type==='video'?'poster':'src',result.type==='video'?'posterAssetId':'assetId']);
 }
 assert.equal(f.posts.length,0);assert.deepEqual(f.errors,[]);
});
