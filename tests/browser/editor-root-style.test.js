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

test('root Inspector appearance matches published canvas only after Publish at desktop and mobile breakpoints',async t=>{
 const model=createEditorState(createDocument()),pageId=model.document.activePageId,rootId=activePage(model).rootId;
 execute(model,{type:'element.add',payload:{type:'text',parentId:rootId,props:{text:'Alapoldal'}}});
 let draft=structuredClone(model.document),published=structuredClone(draft),version=1;
 const posts=[],publicDir=resolve(import.meta.dirname,'../../public');
 const server=createServer(async(req,res)=>{
  const url=new URL(req.url,'http://localhost');
  const json=data=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(data));};
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
  const path=url.pathname==='/p/test'?'/visual-page.html':url.pathname,file=resolve(publicDir,'.'+path);
  if(!file.startsWith(publicDir+'/'))return res.writeHead(403).end();
  try{res.setHeader('content-type',{'.js':'text/javascript','.html':'text/html','.css':'text/css'}[extname(file)]||'application/octet-stream');res.end(await readFile(file))}
  catch{res.writeHead(404).end()}
 });
 await new Promise(done=>server.listen(0,'127.0.0.1',done));
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
 t.after(async()=>{await browser.close();await new Promise(done=>server.close(done))});
 const base='http://127.0.0.1:'+server.address().port;
 const editor=await browser.newPage({viewport:{width:1366,height:900}}),viewer=await browser.newPage({viewport:{width:1366,height:900}});
 editor.setDefaultTimeout(7000);viewer.setDefaultTimeout(7000);
 const errors=[];editor.on('pageerror',e=>errors.push('editor: '+e.message));viewer.on('pageerror',e=>errors.push('public: '+e.message));
 await editor.goto(base+'/editor-v2/index.html');
 await viewer.goto(base+'/p/test');
 const canvas=viewer.locator('#content-canvas');
 const legacyColor=await canvas.evaluate(el=>getComputedStyle(el).backgroundColor);
 const rootNode=editor.locator('.node[data-node-id="'+rootId+'"]');
 await rootNode.evaluate(el=>el.click());
 if(await editor.locator('#rightDock').evaluate(el=>el.classList.contains('closed')))await editor.locator('#openInspector').click();
 const enableRoot=editor.locator('[data-inspector-command="root.appearance.enable"]');
 assert.equal(await enableRoot.getAttribute('data-inspector-key'),'metadata.editorRootVersion');
 const group=async name=>{
  const title=editor.locator('.inspector-group-title').filter({hasText:name});
  await title.waitFor();
  if(!await title.locator('..').evaluate(el=>el.classList.contains('is-open')))await title.click();
 };
 await group('Szülő és elhelyezés');
 await enableRoot.click();
 await editor.locator('.inspector-tabs button').nth(2).click();
 const stateGroup=editor.locator('.inspector-group').filter({hasText:'Rámutatás és fókusz'});
 const stateTitle=stateGroup.locator(':scope > .inspector-group-title');
 if(await stateTitle.getAttribute('aria-expanded')==='false')await stateTitle.click();
 await editor.getByLabel('Állapot előnézete',{exact:true}).selectOption('focus-visible');
 const focusColor=stateGroup.locator('[data-state-property="backgroundColor"] input[type="text"]');
 await focusColor.fill('#5b22aa');await focusColor.press('Tab');
 assert.equal(await rootNode.getAttribute('data-editor-state'),'focus-visible');
 assert.equal(await rootNode.evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(91, 34, 170)','root state preview is active on Canvas');
 await editor.getByLabel('Állapot előnézete',{exact:true}).selectOption('none');
 await editor.locator('.inspector-tabs button').nth(0).click();
 const changeColor=async value=>{
  await group('Háttér');
  const input=editor.locator('[data-property-id="background.color"] input[type="text"]');
  await input.fill(value);await input.press('Tab');
 };
 await changeColor('#123456');
 const rootColor=()=>rootNode.evaluate(el=>getComputedStyle(el).backgroundColor);
 assert.equal(await rootColor(),'rgb(18, 52, 86)');
 await group('Térközök');
 const padding=editor.locator('[data-property-id="spacing.padding"]').getByRole('spinbutton',{name:'Belső térköz – Felül értéke'});
 await padding.fill('24');await padding.press('Tab');
 assert.equal(await rootNode.evaluate(el=>getComputedStyle(el).paddingTop),'24px');
 assert.equal(posts.length,0,'editing root never auto-saves');
 await editor.locator('#save').click();
 await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
 assert.equal(posts.at(-1).publish,false);
 assert.equal(draft.pages[pageId].nodes[rootId].metadata.rootStyleVersion,1);
 assert.equal(draft.pages[pageId].nodes[rootId].states['focus-visible'].desktop.backgroundColor,'#5b22aa');
 assert.equal(published.pages[pageId].nodes[rootId].states?.['focus-visible'],undefined,'root focus state remains draft-only after Save');
 await viewer.reload();
 assert.equal(await canvas.evaluate(el=>getComputedStyle(el).backgroundColor),legacyColor,'Save does not alter published root');
 await editor.locator('.canvas-device-btn[data-device="mobile"]').click();
 await changeColor('#aa4400');
 assert.equal(await rootColor(),'rgb(170, 68, 0)');
 await editor.locator('#undo').click();
 assert.equal(await rootColor(),'rgb(18, 52, 86)');
 await editor.locator('#redo').click();
 assert.equal(await rootColor(),'rgb(170, 68, 0)');
 await editor.locator('#publish').click();
 await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
 assert.equal(posts.at(-1).publish,true);
 assert.equal(published.pages[pageId].nodes[rootId].states['focus-visible'].desktop.backgroundColor,'#5b22aa');
 await viewer.reload();
 assert.equal(await canvas.evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(18, 52, 86)','desktop root appearance is published');
 assert.equal(await canvas.evaluate(el=>getComputedStyle(el).paddingTop),'24px','root padding passes to public renderer');
 assert.equal(await canvas.getAttribute('tabindex'),'-1','root keeps its skip-link-only focus behavior');
 await viewer.keyboard.press('Tab');
 assert.equal(await viewer.locator('.public-skip-link').evaluate(el=>el.matches(':focus-visible')),true,'skip link receives keyboard focus');
 await viewer.keyboard.press('Enter');
 await viewer.waitForFunction(()=>document.getElementById('content-canvas').matches(':focus-visible'));
 assert.equal(await canvas.evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(91, 34, 170)','root focus state applies after keyboard skip-link navigation');
 assert.equal(await canvas.getAttribute('class'),'content-canvas visual-editor-canvas visual-root-authored creator-state-enabled');
 await viewer.setViewportSize({width:390,height:800});await viewer.reload();
 assert.equal(await canvas.evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(170, 68, 0)','mobile root override is published');
 assert.equal(await canvas.evaluate(el=>getComputedStyle(el).paddingTop),'24px','mobile inherits root padding');
 // A viewer may keep the tab open while a separately published revision
 // replaces the authored root with a legacy/template root. A breakpoint change
 // refetches that Page Model without navigating/reloading the tab.
 const authoredPublished=published;
 published=structuredClone(published);
 const legacyRoot=published.pages[pageId].nodes[rootId];
 delete legacyRoot.metadata.rootStyleVersion;
 delete legacyRoot.metadata.editorRootVersion;
 legacyRoot.style={};
 legacyRoot.responsive={desktop:{},tablet:{},mobile:{}};
 const textId=published.pages[pageId].nodes[rootId].children[0];
 published.pages[pageId].nodes[textId].props.text='Új publikált gyökér nélküli változat';
 await viewer.setViewportSize({width:1366,height:900});
 await viewer.getByText('Új publikált gyökér nélküli változat').waitFor();
 assert.equal(await canvas.getAttribute('class'),'content-canvas visual-editor-canvas','the refreshed template has no authored root class');
 assert.equal(await canvas.evaluate(el=>el.style.backgroundColor),'','legacy Page Model must clear previous authored inline background');
 assert.equal(await canvas.evaluate(el=>el.style.paddingTop),'','legacy Page Model must clear previous inline padding while retaining design token variables');
 assert.equal(await canvas.getAttribute('data-node-id'),null,'previous root selector is not retained');
 assert.equal(await canvas.evaluate(el=>getComputedStyle(el).backgroundColor),legacyColor,'desktop template uses its own CSS, not stale authored colors');

 // The opposite transition must still apply new authored root styles.
 published=authoredPublished;
 await viewer.setViewportSize({width:390,height:800});
 await viewer.locator('.visual-root-authored').waitFor();
 assert.equal(await canvas.evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(170, 68, 0)','re-authored mobile revision restores the breakpoint override');
 assert.equal(await canvas.evaluate(el=>getComputedStyle(el).paddingTop),'24px');
 assert.deepEqual(errors,[]);
});
