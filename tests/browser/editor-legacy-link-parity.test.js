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

test('legacy button and link Inspector keeps safe destinations, accessible labels, Save and Publish isolated',async t=>{
 const state=createEditorState(createDocument());
 const pageId=state.document.activePageId,rootId=activePage(state).rootId;
 execute(state,{type:'element.add',payload:{type:'button',parentId:rootId,props:{text:'Régi gomb',url:'javascript:alert(1)',href:'/p/korabbi',newWindow:false}}});
 const buttonId=state.selection.primaryId;
 execute(state,{type:'element.add',payload:{type:'link',parentId:rootId,props:{text:'Régi link',href:'https://user:pass@evil.invalid/path'}}});
 const linkId=state.selection.primaryId;
 let draft=structuredClone(state.document),published=structuredClone(draft),version=1;
 const saves=[],errors=[];
 const publicDir=resolve(import.meta.dirname,'../../public');
 const server=createServer(async(req,res)=>{
  const u=new URL(req.url,'http://localhost');
  const json=data=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(data))};
  if(u.pathname==='/api/admin/pages')return json({ok:true,data:[{id:pageId,slug:'test',title:'Link teszt',content:draft,revision:version,isPublished:true}]});
  if(u.pathname==='/api/admin/editor'){
   if(req.method==='GET')return json({ok:true,data:{page:{id:pageId,document:draft,publishedRevisionId:'published'},revisions:[{id:'revision-'+version,version}]}});
   let body='';for await(const chunk of req)body+=chunk;const request=JSON.parse(body);
   saves.push(request);draft=structuredClone(request.document);version++;
   if(request.publish)published=structuredClone(draft);
   return json({ok:true,data:{pageId,version,revisionId:'revision-'+version,published:Boolean(request.publish)}});
  }
  if(u.pathname==='/api/public/pages')return json({ok:true,data:{id:pageId,slug:'test',title:'Link teszt',description:'',content:published.pages[pageId]}});
  if(u.pathname==='/api/public/navigation')return json({ok:true,data:{items:[]}});
  if(u.pathname.startsWith('/api/'))return json({ok:true,data:{}});
  const file=resolve(publicDir,'.'+(u.pathname==='/p/test'?'/visual-page.html':u.pathname));
  if(!file.startsWith(publicDir+'/'))return res.writeHead(403).end();
  try{res.setHeader('content-type',{'.js':'text/javascript','.html':'text/html','.css':'text/css'}[extname(file)]||'application/octet-stream');res.end(await readFile(file))}
  catch{res.writeHead(404).end()}
 });
 await new Promise(done=>server.listen(0,'127.0.0.1',done));
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
 t.after(async()=>{await browser.close();await new Promise(done=>server.close(done))});
 const base='http://127.0.0.1:'+server.address().port;
 const editor=await browser.newPage({viewport:{width:1366,height:900}});
 const viewer=await browser.newPage({viewport:{width:1440,height:900}});
 for(const p of [editor,viewer]){p.setDefaultTimeout(8500);p.on('pageerror',e=>errors.push(e.message))}
 const canvas=id=>editor.locator(`.node[data-node-id="${id}"]`);
 const pub=id=>viewer.locator(`[data-node-id="${id}"]`);
 await editor.goto(base+'/editor-v2/index.html');
 await viewer.goto(base+'/p/test');
 await canvas(buttonId).waitFor();await pub(buttonId).waitFor();
 assert.equal(await pub(buttonId).evaluate(e=>e.tagName.toLowerCase()),'div','unsafe button is inert, even with a stale valid href');
 assert.equal(await pub(linkId).evaluate(e=>e.tagName.toLowerCase()),'div','credentialed legacy link is inert');
 await canvas(buttonId).evaluate(el=>el.click());
 if(await editor.locator('#rightDock').evaluate(el=>el.classList.contains('closed')))await editor.locator('#openInspector').click();
 await editor.getByRole('button',{name:'Tartalom és szöveg'}).click();
 const inspector=editor.locator('.legacy-link-inspector');
 await inspector.waitFor();
 assert.equal(await inspector.locator('.property-validation[role="status"]').count(),1,'the unsafe destination is explained');
 assert.equal(saves.length,0,'Inspector selection does not save or publish');
 const url=inspector.getByRole('textbox',{name:'Hivatkozás URL'});
 await url.fill('/p/uj-oldal');await url.press('Tab');
 assert.equal(await inspector.locator('.property-validation[role="status"]').count(),0,'valid URL clears warning');
 await inspector.getByRole('textbox',{name:'Felirat'}).fill('Új gomb');await inspector.getByRole('textbox',{name:'Felirat'}).press('Tab');
 await inspector.getByRole('textbox',{name:'Akadálymentes elnevezés'}).fill('Bemutatkozás megnyitása');
 await inspector.getByRole('textbox',{name:'Akadálymentes elnevezés'}).press('Tab');
 await inspector.getByRole('checkbox',{name:'Hivatkozás új ablakban'}).check();
 assert.match(await canvas(buttonId).textContent(),/Új gomb/);
 assert.equal(await pub(buttonId).evaluate(e=>e.tagName.toLowerCase()),'div','public remains inert until Publish');

 await canvas(linkId).evaluate(el=>el.click());
 await inspector.getByRole('textbox',{name:'Hivatkozás URL'}).fill('#kapcsolat');
 await inspector.getByRole('textbox',{name:'Hivatkozás URL'}).press('Tab');
 assert.equal(await inspector.locator('.property-validation[role="status"]').count(),0);
 assert.equal(saves.length,0);

 await editor.locator('#save').click();
 await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
 assert.equal(saves.at(-1).publish,false);
 assert.equal(draft.pages[pageId].nodes[buttonId].props.url,'/p/uj-oldal');
 assert.equal(draft.pages[pageId].nodes[buttonId].props.href,'/p/uj-oldal','old href alias synchronized');
 await viewer.reload();
 assert.equal(await pub(buttonId).evaluate(e=>e.tagName.toLowerCase()),'div','Save never updates public links');

 await editor.locator('#publish').click();
 await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
 assert.equal(saves.at(-1).publish,true);
 await viewer.reload();
 assert.equal(await pub(buttonId).evaluate(e=>e.tagName.toLowerCase()),'a');
 assert.equal(await pub(buttonId).getAttribute('href'),'/p/uj-oldal');
 assert.equal(await pub(buttonId).getAttribute('target'),'_blank');
 assert.equal(await pub(buttonId).getAttribute('rel'),'noopener noreferrer');
 assert.equal(await pub(buttonId).getAttribute('aria-label'),'Bemutatkozás megnyitása');
 assert.match(await pub(buttonId).textContent(),/Új gomb/);
 assert.equal(await pub(linkId).getAttribute('href'),'#kapcsolat');

 await viewer.setViewportSize({width:390,height:820});
 await editor.locator('.canvas-device-btn[data-device="mobile"]').click();
 assert.equal(await pub(buttonId).getAttribute('href'),'/p/uj-oldal');
 assert.equal(await pub(linkId).getAttribute('href'),'#kapcsolat');
 assert.equal(await canvas(buttonId).count(),1);
 // Clearing must remove both aliases, not revive the stale href on reload.
 await canvas(buttonId).evaluate(el=>el.click());
 await inspector.getByRole('textbox',{name:'Hivatkozás URL'}).fill('');
 await inspector.getByRole('textbox',{name:'Hivatkozás URL'}).press('Tab');
 await editor.locator('#save').click();
 await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
 assert.deepEqual([draft.pages[pageId].nodes[buttonId].props.url,draft.pages[pageId].nodes[buttonId].props.href],['','']);
 await viewer.reload();
 assert.equal(await pub(buttonId).evaluate(e=>e.tagName.toLowerCase()),'a','a saved draft cannot remove the public link');
 assert.deepEqual(errors,[]);
});
