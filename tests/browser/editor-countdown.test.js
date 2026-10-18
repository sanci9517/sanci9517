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

test('Countdown Inspector edits deadline, renders live public output and respects draft vs Publish',async t=>{
 const model=createEditorState(createDocument()),pageId=model.document.activePageId,root=activePage(model).rootId;
 execute(model,{type:'element.add',payload:{type:'countdown',parentId:root}});
 const id=model.selection.primaryId;
 const eventISO='2030-12-31T20:30:00.000Z';
 let draft=structuredClone(model.document),published=structuredClone(draft),version=1;
 const posts=[],assetRoot=resolve(import.meta.dirname,'../../public');
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
  const path=url.pathname==='/p/test'?'/visual-page.html':url.pathname,file=resolve(assetRoot,'.'+path);
  if(!file.startsWith(assetRoot+'/'))return res.writeHead(403).end();
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
 await editor.goto(base+'/editor-v2/index.html');await viewer.goto(base+'/p/test');
 const selected=editor.locator('.node[data-node-id="'+id+'"]');
 await selected.evaluate(el=>el.click());
 if(await editor.locator('#rightDock').evaluate(el=>el.classList.contains('closed')))await editor.locator('#openInspector').click();
 await editor.locator('.inspector-tabs button').nth(1).click();
 assert.equal(await editor.locator('.countdown-inspector h3').textContent(),'Visszaszámláló');
 const field=editor.locator('.countdown-inspector');
 const setText=async(name,value)=>{const input=field.getByRole('textbox',{name});await input.fill(value);await input.press('Tab')};
 await setText('Esemény neve','Élő premier <script>alert(1)</script>');
 await setText('Lejáratkor megjelenő üzenet','Már élőben!');
 const localDate=await editor.evaluate(iso=>{
  const d=new Date(iso),pad=x=>String(x).padStart(2,'0');
  return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())+'T'+pad(d.getHours())+':'+pad(d.getMinutes());
 },eventISO);
 await field.locator('input[type="datetime-local"]').fill(localDate);
 await field.locator('input[type="datetime-local"]').press('Tab');
 assert.equal(posts.length,0,'Inspector change never saves');
 assert.match(await selected.locator('.visual-countdown-clock').textContent(),/nap/);
 assert.equal(await selected.locator('.visual-countdown-heading').textContent(),'Élő premier <script>alert(1)</script>');
 await field.locator('input[type="checkbox"]').uncheck();
 await editor.locator('#undo').click();
 assert.equal(await field.locator('input[type="checkbox"]').isChecked(),true);
 await editor.locator('#redo').click();
 assert.equal(await field.locator('input[type="checkbox"]').isChecked(),false);
 await editor.locator('#save').click();
 await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
 assert.equal(posts.at(-1).publish,false);
 assert.equal(draft.pages[pageId].nodes[id].props.countdown.targetISO,eventISO);
 await viewer.reload();
 assert.match(await viewer.locator('.visual-countdown-clock').textContent(),/Állíts be egy időpontot/,'Save cannot alter the previously published unconfigured Countdown');
 await editor.locator('#publish').click();
 await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
 assert.equal(posts.at(-1).publish,true);
 await viewer.reload();
 const clock=viewer.locator('.visual-countdown-clock');
 assert.match(await clock.textContent(),/nap/);
 assert.doesNotMatch(await clock.textContent(),/ mp/,'seconds may be hidden');
 assert.equal(await clock.getAttribute('datetime'),eventISO);
 assert.equal(await viewer.locator('.visual-countdown-heading').textContent(),'Élő premier <script>alert(1)</script>');
 assert.equal(await viewer.locator('.visual-countdown-heading script').count(),0,'public text escaped');
 await viewer.setViewportSize({width:390,height:800});await viewer.reload();
 assert.ok((await clock.boundingBox()).width>50);
 assert.deepEqual(errors,[]);
});
