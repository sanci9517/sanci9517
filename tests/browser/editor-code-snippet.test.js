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

for(const width of [390,1366])test(`Code Inspector IME, inert copy and independent Save/Publish at ${width}px`,async t=>{
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
 const editor=await browser.newPage({viewport:{width,height:900}}),viewer=await browser.newPage({viewport:{width,height:900}});
 editor.setDefaultTimeout(7000);viewer.setDefaultTimeout(7000);
 const errors=[];editor.on('pageerror',e=>errors.push('editor:'+e.message));viewer.on('pageerror',e=>errors.push('public:'+e.message));
 await viewer.addInitScript(()=>{
  Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{window.__copiedCode=text;}}});
 });
 await editor.goto(base+'/editor-v2/index.html');await viewer.goto(base+'/p/test');
 let snippet='Write-Host "<script>alert(1)</script>"\nGet-Process | Select-Object -First 3';
 const node=editor.locator('.node[data-node-id="'+codeId+'"]');
 await node.evaluate(el=>el.click());
 if(await editor.locator('#rightDock').evaluate(el=>el.classList.contains('closed')))await editor.locator('#openInspector').click();
 await editor.locator('.inspector-tabs button').nth(1).click();
 const inspector=editor.locator('.code-snippet-inspector');
 assert.equal(await inspector.locator('h3').textContent(),'Kód- és parancsblokk');
 const codeRoutes=await inspector.locator('[data-inspector-command]').evaluateAll(rows=>rows.map(row=>({command:row.dataset.inspectorCommand,key:row.dataset.inspectorKey})));
 assert.deepEqual(codeRoutes.map(route=>route.key),['props.codeSnippet.title','props.codeSnippet.language','props.codeSnippet.theme','props.codeSnippet.showLineNumbers','props.codeSnippet.wrapLines','props.codeSnippet.code']);
 assert.ok(codeRoutes.every(route=>route.command==='element.update'),'each Code field exposes its actual element.update route');
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
 await editor.keyboard.press('Control+z');
 assert.equal(await inspector.getByRole('textbox',{name:'Kód vagy parancs szövege'}).inputValue(),'');
 await editor.keyboard.press('Control+Shift+z');
 assert.equal(await inspector.getByRole('textbox',{name:'Kód vagy parancs szövege'}).inputValue(),snippet);
 const source=inspector.getByRole('textbox',{name:'Kód vagy parancs szövege'});
 const compose=async(name,before,final,selector,restart=false)=>{
  const input=inspector.getByRole('textbox',{name});
  await input.evaluate(el=>{
   el.focus();window.__codeImeInput=el;
   el.dispatchEvent(new CompositionEvent('compositionstart',{bubbles:true}));el.value='Félkész IME';
   el.dispatchEvent(new InputEvent('input',{bubbles:true,isComposing:true,data:'Félkész IME'}));
  });
  assert.equal(await node.locator(selector).textContent(),before,'unfinished composition cannot change the Canvas');
  await editor.keyboard.press('Control+s');await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.includes('Javítsd'));
  for(const action of ['#save','#publish']){await editor.locator(action).click();assert.equal(posts.length,0,'unfinished composition blocks every API write');}
  assert.equal(await input.evaluate(el=>el===window.__codeImeInput),true,'blocked Save cannot discard the composing field');
  await input.focus();
  if(restart){
   await input.evaluate(el=>{
    el.dispatchEvent(new CompositionEvent('compositionend',{bubbles:true,data:'Korábbi végleges'}));
    el.dispatchEvent(new CompositionEvent('compositionstart',{bubbles:true}));el.value='Újabb félkész';
    el.dispatchEvent(new InputEvent('input',{bubbles:true,isComposing:true,data:'Újabb félkész'}));
   });
   await editor.evaluate(()=>new Promise(resolve=>requestAnimationFrame(resolve)));
   assert.equal(await node.locator(selector).textContent(),before,'an older composition callback cannot commit a newer unfinished candidate');
   await editor.keyboard.press('Control+s');assert.equal(posts.length,0);
  }
  const immediate=await input.evaluate((el,{final,selector,codeId})=>{
   el.dispatchEvent(new CompositionEvent('compositionend',{bubbles:true,data:final}));
   el.value=final;el.setSelectionRange(final.length,final.length);
   el.dispatchEvent(new InputEvent('input',{bubbles:true,isComposing:false,data:final}));
   return document.querySelector(`[data-node-id="${codeId}"] ${selector}`).textContent;
  },{final,selector,codeId});
  assert.equal(immediate,before,'the late final input remains pending until the next animation frame');
  await editor.waitForFunction(({selector,final,codeId})=>document.querySelector(`[data-node-id="${codeId}"] ${selector}`).textContent===final,{selector,final,codeId});
  assert.equal(await input.evaluate(el=>el===window.__codeImeInput&&el===document.activeElement&&el.selectionStart===el.value.length),true,'finalization keeps DOM identity, caret and focus');
  await editor.keyboard.press('Control+z');assert.equal(await node.locator(selector).textContent(),before,'one Undo reverts the complete composition');
  await editor.keyboard.press('Control+Shift+z');assert.equal(await node.locator(selector).textContent(),final);
  assert.equal(posts.length,0);
 };
 const finalTitle='OBS végleges cím <svg onload=alert(1)>';
 await compose('Blokk címe','OBS parancsok <svg onload=alert(1)>',finalTitle,'.visual-code-title');
 const finalCode=snippet.replace('Write-Host','Write-Host "Végleges 完了";');
 await compose('Kód vagy parancs szövege',snippet,finalCode,'pre code',true);snippet=finalCode;
 await source.evaluate(el=>{
  el.focus();el.dispatchEvent(new CompositionEvent('compositionstart',{bubbles:true}));el.value='Elvetett kód';
  el.dispatchEvent(new InputEvent('input',{bubbles:true,isComposing:true}));
  el.dispatchEvent(new CompositionEvent('compositionend',{bubbles:true}));
  el.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
 });
 await editor.evaluate(()=>new Promise(resolve=>requestAnimationFrame(resolve)));
 assert.equal(await source.inputValue(),snippet);assert.equal(await node.locator('pre code').textContent(),snippet);
 assert.equal(await editor.locator('#rightDock').evaluate(el=>el.classList.contains('closed')),false,'Escape cancels the pending candidate without closing the Inspector');
 await source.focus();await source.press('Control+End');await source.pressSequentially(' #OK');
 assert.equal(await node.locator('pre code').textContent(),snippet+' #OK');
 await editor.keyboard.press('Control+z');assert.equal(await node.locator('pre code').textContent(),snippet,'ordinary typing coalesces into one Undo');
 await editor.keyboard.press('Control+Shift+z');snippet+=' #OK';
 assert.equal(await node.locator('pre code').textContent(),snippet);
 await editor.locator('#save').click();
 await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
 assert.equal(posts.at(-1).publish,false);
 assert.equal(draft.pages[pageId].nodes[codeId].props.codeSnippet.language,'powershell');
 assert.equal(draft.pages[pageId].nodes[codeId].props.codeSnippet.title,finalTitle);
 assert.equal(draft.pages[pageId].nodes[codeId].props.codeSnippet.code,snippet);
 assert.equal(draft.pages[pageId].nodes[codeId].props.codeSnippet.theme,'light');
 assert.equal(draft.pages[pageId].nodes[codeId].props.codeSnippet.showLineNumbers,true);
  await viewer.reload({waitUntil:'domcontentloaded'});
 const publicNode=viewer.locator('.visual-code-container[data-node-id="'+codeId+'"]');
 assert.equal(await publicNode.locator('code').textContent(),'','draft Save must not update published source');
 await editor.reload({waitUntil:'domcontentloaded'});await node.evaluate(el=>el.click());
 if(await editor.locator('#rightDock').evaluate(el=>el.classList.contains('closed')))await editor.locator('#openInspector').click();
 await editor.locator('.inspector-tabs button').nth(1).click();
 assert.equal(await source.inputValue(),snippet);assert.equal(await inspector.getByRole('textbox',{name:'Blokk címe'}).inputValue(),finalTitle);
 await editor.locator('#publish').click();
 await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
 assert.equal(posts.at(-1).publish,true);
 await viewer.reload({waitUntil:'domcontentloaded'});
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
 await viewer.setViewportSize({width:390,height:800});await viewer.reload({waitUntil:'domcontentloaded'});
 const bounds=await figure.boundingBox();
 assert.ok(bounds.width<=390&&bounds.width>180,'code container fits narrow screens');
 assert.equal(await figure.locator('pre').evaluate(el=>getComputedStyle(el).whiteSpace),'pre-wrap');
 assert.ok(await viewer.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+2),'code scroll never overflows the mobile page');
 const rejected=await editor.evaluate(async()=>{
  const {renderCodeSnippetInspector}=await import('/editor-v2/ui/code-snippet-inspector.js');
  const {defaultCodeSnippet}=await import('/editor-v2/core/code-snippet.js');
  const snapshot={...defaultCodeSnippet(),title:'Mentett cím',code:'Mentett forrás'};
  const testNode={id:'code-commit-fixture',props:{codeSnippet:structuredClone(snapshot)}};
  let allow=false,guard,accepted;
  const root=renderCodeSnippetInspector(testNode,value=>{if(!allow)return false;accepted=structuredClone(value);return true;},{pending:fn=>{guard=fn;}});
  document.querySelector('#inspectorBody').append(root);
  const code=root.querySelector('textarea'),title=root.querySelector('input[type="text"]');
  code.focus();code.value='Elutasított forrás';code.dispatchEvent(new InputEvent('input',{bubbles:true}));
  const rejected=code.getAttribute('aria-invalid')==='true'&&!guard()&&!accepted;
  code.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
  const escaped=code.value==='Mentett forrás'&&guard();
  allow=true;code.value='Jóváhagyott forrás';code.dispatchEvent(new InputEvent('input',{bubbles:true}));
  title.focus();title.value='Új cím';title.dispatchEvent(new Event('change',{bubbles:true}));
  const recovery=accepted.code==='Jóváhagyott forrás'&&accepted.title==='Új cím'&&guard();
  const unchanged=JSON.stringify(testNode.props.codeSnippet)===JSON.stringify(snapshot);
  root.remove();
  const locked=renderCodeSnippetInspector({...testNode,locked:true},()=>{throw Error('Locked fixture changed');});
  document.querySelector('#inspectorBody').append(locked);
  const lockedSafe=[...locked.querySelectorAll('input,select,textarea')].every(el=>el.disabled);locked.remove();
  return {rejected,escaped,recovery,unchanged,lockedSafe};
 });
 assert.deepEqual(rejected,{rejected:true,escaped:true,recovery:true,unchanged:true,lockedSafe:true});
 assert.equal(posts.length,2,'local control guards cannot send any extra Save/Publish requests');
 assert.deepEqual(errors,[]);
});
