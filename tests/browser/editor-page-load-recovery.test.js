import assert from 'node:assert/strict';
import test from 'node:test';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {chromium} from 'playwright';
import {createEditorState} from '../../public/editor-v2/core/state.js';
import {createDocument,createPage,NODE_TYPES} from '../../public/editor-v2/core/schema.js';
import {execute} from '../../public/editor-v2/core/commands.js';

test('failed page selection restores the active page and draft, then retries without Save or Publish',async t=>{
  const pageA=createPage({id:'page-a',name:'A oldal',slug:'a'}),stateA=createEditorState(createDocument(pageA));
  execute(stateA,{type:'element.add',payload:{type:NODE_TYPES.TEXT,props:{text:'Mentett A'}}});
  const nodeA=stateA.selection.primaryId;
  execute(stateA,{type:'element.content.set',payload:{nodeId:nodeA,content:'Mentett A'}});
  const pageB=createPage({id:'page-b',name:'B oldal',slug:'b'}),documentB=createDocument(pageB);
  const invalidDocument={...structuredClone(documentB),activePageId:'missing-page'};
  let pageBAttempts=0;
  const requests=[],root=resolve(import.meta.dirname,'../../public');
  const json=(res,data,status=200)=>{res.writeHead(status,{'content-type':'application/json'});res.end(JSON.stringify(data))};
  const server=createServer(async(req,res)=>{
    const url=new URL(req.url,'http://localhost');
    if(url.pathname==='/api/admin/pages')return json(res,{ok:true,data:url.searchParams.get('archived')==='1'?[]:[
      {id:pageA.id,slug:pageA.slug,title:pageA.name,content:stateA.document,revision:1,isPublished:false},
      {id:pageB.id,slug:pageB.slug,title:pageB.name,content:documentB,revision:1,isPublished:false}
    ]});
    if(url.pathname==='/api/admin/editor'&&req.method==='GET'){
      const id=url.searchParams.get('pageId');requests.push({method:'GET',id});
      if(id===pageA.id)return json(res,{ok:true,data:{page:{id,document:stateA.document,publishedRevisionId:null},revisions:[{id:'a-r1',version:1}]}});
      pageBAttempts++;
      if(pageBAttempts===1)return json(res,{ok:false,error:{message:'A B oldal most nem érhető el.'}},503);
      return json(res,{ok:true,data:{page:{id,document:pageBAttempts===2?invalidDocument:documentB,publishedRevisionId:null},revisions:[{id:'b-r1',version:1}]}});
    }
    if(url.pathname==='/api/admin/editor'&&req.method==='POST'){
      let body='';for await(const chunk of req)body+=chunk;requests.push({method:'POST',body:JSON.parse(body)});
      return json(res,{ok:true,data:{pageId:pageA.id,version:2,revisionId:'a-r2'}});
    }
    if(url.pathname.startsWith('/api/'))return json(res,{ok:true,data:{items:[],tokens:{},siteName:'Teszt'}});
    const file=resolve(root,'.'+url.pathname);if(!file.startsWith(root+'/'))return res.writeHead(403).end();
    try{res.setHeader('content-type',{'.html':'text/html','.js':'text/javascript','.css':'text/css'}[extname(file)]||'application/octet-stream');res.end(await readFile(file))}
    catch{res.writeHead(404).end()}
  });
  await new Promise(done=>server.listen(0,'127.0.0.1',done));
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(process.env.CI?undefined:'/usr/bin/chromium'),args:['--no-sandbox']});
  t.after(async()=>{await browser.close();await new Promise(done=>server.close(done))});
  const editor=await browser.newPage({viewport:{width:1366,height:900}}),dialogs=[],errors=[];
  editor.setDefaultTimeout(10000);editor.on('pageerror',error=>errors.push(error.message));
  editor.on('dialog',async dialog=>{dialogs.push(dialog.type());await dialog.accept()});
  await editor.goto(`http://127.0.0.1:${server.address().port}/editor-v2/index.html`);
  await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent==='Mentve');
  await editor.locator(`.node[data-node-id="${nodeA}"]`).click();
  if(!await editor.locator('#inspectorBody').isVisible())await editor.locator('#openInspector').click();
  await editor.locator('.inspector-tabs button').nth(1).click();
  const textField=editor.locator(`.plain-text-editor[data-text-node-id="${nodeA}"]`);
  await textField.fill('A nem mentett helyi piszkozata');
  const assertActiveDraft=async attempt=>{
    await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent?.includes('betöltési hiba'));
    await editor.waitForFunction(()=>document.querySelector('#pageSelect')?.value==='page-a');
    assert.equal(await textField.inputValue(),'A nem mentett helyi piszkozata',`attempt ${attempt}: the active Inspector draft is retained`);
    assert.match(await editor.locator(`.node[data-node-id="${nodeA}"]`).innerText(),/A nem mentett helyi piszkozata/,`attempt ${attempt}: the Canvas still shows page A`);
    assert.equal(await editor.locator('#pageSelect').inputValue(),'page-a',`attempt ${attempt}: the page selector returns to active page A`);
    assert.equal(requests.some(request=>request.method==='POST'),false,'page-load failure must not Save or Publish the draft');
  };
  await editor.locator('#pageSelect').selectOption(pageB.id);
  await assertActiveDraft('network');
  await editor.locator('#pageSelect').selectOption(pageB.id);
  await assertActiveDraft('malformed-document');
  await editor.locator('#pageSelect').selectOption(pageB.id);
  await editor.waitForFunction(()=>document.querySelector('#saveStatus')?.textContent==='Mentve'&&document.querySelector('#pageSelect')?.value==='page-b');
  assert.equal(await editor.locator('#pageSelect').inputValue(),'page-b','an explicit retry after the failure loads page B');
  assert.doesNotMatch(await editor.locator('.page-canvas').innerText(),/A nem mentett helyi piszkozata/,'the successful retry displays B without leaking A draft content');
  assert.equal(requests.filter(request=>request.method==='GET'&&request.id===pageB.id).length,3);
  assert.equal(requests.filter(request=>request.method==='POST').length,0,'recovery and retry never call Save or Publish implicitly');
  assert.deepEqual(dialogs,['confirm','alert','confirm','alert','confirm']);
  assert.deepEqual(errors,[]);
});
