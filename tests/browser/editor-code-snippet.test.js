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

test('Code Inspector and public Code copy use inert content, mobile layout and independent Save/Publish',async t=>{
 const model=createEditorState(createDocument()),pageId=model.document.activePageId,root=activePage(model).rootId;
 execute(model,{type:'element.add',payload:{type:'code',parentId:root}});
 const codeId=model.selection.primaryId;
 let draft=structuredClone(model.document),published=structuredClone(draft),version=1;
 const posts=[],assetRoot=resolve(import.meta.dirname,'../../public');
 const server=createServer(async(req,res)=>{
  const url=new URL(req.url,'http://localhost');
  const json=data=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(data))};
  if(url.pathname==='/api/admin/pages')return json({ok:true,data:url.searchParams.get('archived')==='1'?[]:[{id:pageId,slug:'test',title:'Test',content:draft,revision:version,isPublished:true}]});
  if(url.pathname==='/api/admin/editor'){
   if(req.method==='GET')return json({ok:true,data:{page:{id:pageId,document:draft,publishedRevisionId:'published'},revisions:[{id:'revision-'+version,version}]}});
   let raw='';for await(const chunk of req)raw+=chunk;
   const request=JSON.parse(raw);posts.push(request);draft=structuredClone(request.document);version++;
   if(request.publish)published=structuredClone(draft);
   return json({ok:true,data:{pageId,version,revisionId:'revision-'+version,published:Boolean(request.publish)}});
  }
  if(url.pathname==='/api/public/pages')return json({ok:true,data:{id:pageId,slug:'test',title:'Test',description:'',content:published.pages[pageId]}});
  if(url.pathname==='/api/public/navigation')return json({ok:true,data:{items:[]}});
  if(url.pathname==='/api/integrations/twitch/connection')return json({ok:true,data:{connected:false}});
  if(url.pathname.startsWith('/api/'))return json({ok:true,data:{siteName:'Test'}});
  const asset=url.pathname==='/p/test'?'/visual-page.html':url.pathname,file=resolve(assetRoot,'.'+asset);
  if(!file.startsWith(assetRoot+'/')){res.writeHead(403).end();return}
  try{res.setHeader('content-type',{'.html':'text/html','.js':'text/javascript','.css':'text/css'}[extname(file)]||'application/octet-stream');res.end(await readFile(file))}
  catch{res.writeHead(404).end()}
 });
 await new Promise(done=>server.listen(0,'127.0.0.1',done));
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
 t.after(async()=>{await browser.close();await new Promise(done=>server.close(done))});
 const base='http://127.0.0.1:'+server.address().port;
 const editor=await browser.newPage({viewport:{width:1366,height:900}}),viewer=await browser.newPage({viewport:{width:1366,height:900}});
 editor.setDefaultTimeout(7000);viewer.setDefaultTimeout(7000);
 const errors=[];editor.on('pageerror',e=>errors.push('editor:'+e.message));viewer.on('pageerror',e=>errors.push('public:'+e.message));
 await viewer.addInitScript(()=>{
  Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{window.__copiedCode=text;}}});
 });
 await editor.goto(base+'/editor-v2/index.html');await viewer.goto(base+'/p/test');
 const snippet='Write-Host "<script>alert(1)</script>"\nGet-Process | Select-Object -First 3';
 const node=editor.locator('.node[data-node-id="'+codeId+'"]');
 await node.evaluate(el=>el.click());
 if(await editor.locator('#rightDock').evaluate(el=>el.classList.contains('closed')))await editor.locator('#openInspector').click();
 await editor.locator('.inspector-tabs button').nth(1).click();
 const inspector=editor.locator('.code-snippet-inspector');
 assert.equal(await inspector.locator('h3').textContent(),'Kód- és parancsblokk');
 const change=async(name,value)=>{
  const input=inspector.getByRole('textbox',{name});
  await input.fill(value);await input.press('Tab');
 };
 await change('Blokk címe','OBS parancsok <svg onload=alert(1)>');
 await inspector.getByRole('combobox',{name:'Kód nyelve'}).selectOption('powershell');
 await inspector.getByRole('combobox',{name:'Színséma'}).selectOption('light');
 await inspector.getByRole('checkbox',{name:'Sorszámok mutatása'}).check();
 await inspector.getByRole('checkbox',{name:'Hosszú sorok tördelése'}).check();
 await change('Kód vagy parancs szövege',snippet);
 assert.match(await node.locator('.visual-code-line').first().textContent(),/<script>alert/);
 assert.equal(await node.locator('.visual-code-figure script').count(),0,'no script execution in canvas');
 assert.equal(posts.length,0,'Code Inspector never auto-saves');
 await editor.locator('#undo').click();
 assert.equal(await inspector.getByRole('textbox',{name:'Kód vagy parancs szövege'}).inputValue(),'');
 await editor.locator('#redo').click();
 assert.equal(await inspector.getByRole('textbox',{name:'Kód vagy parancs szövege'}).inputValue(),snippet);
 await editor.locator('#save').click();
 await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
 assert.equal(posts.at(-1).publish,false);
 assert.equal(draft.pages[pageId].nodes[codeId].props.codeSnippet.language,'powershell');
 await viewer.reload();
 const publicNode=viewer.locator('.visual-code-container[data-node-id="'+codeId+'"]');
 assert.equal(await publicNode.locator('code').textContent(),'','draft Save must not update published source');
 await editor.locator('#publish').click();
 await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
 assert.equal(posts.at(-1).publish,true);
 await viewer.reload();
 const figure=publicNode.locator('.visual-code-figure');
 assert.ok((await figure.getAttribute('class')).includes('visual-code-light'));
 assert.ok((await figure.getAttribute('class')).includes('visual-code-wrap'));
 assert.ok((await figure.getAttribute('class')).includes('visual-code-numbered'));
 assert.equal(await figure.locator('code').textContent(),snippet);
 assert.equal(await figure.locator('script,svg').count(),0,'authored code is inert escaped text');
 assert.equal(await figure.locator('.visual-code-line').count(),2);
 await figure.locator('.visual-code-copy').click();
 assert.equal(await viewer.evaluate(()=>window.__copiedCode),snippet);
 assert.match(await figure.locator('.visual-code-copy').textContent(),/Másolva/);
 await viewer.setViewportSize({width:390,height:800});await viewer.reload();
 const bounds=await figure.boundingBox();
 assert.ok(bounds.width<=390&&bounds.width>180,'code container fits narrow screens');
 assert.equal(await figure.locator('pre').evaluate(el=>getComputedStyle(el).whiteSpace),'pre-wrap');
 assert.ok(await viewer.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+2),'code scroll never overflows the mobile page');
 assert.deepEqual(errors,[]);
});
