import {exerciseComposition} from './helpers/composition.js';
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
import {iconById} from '../../public/editor-v2/core/icon-options.js';

test('structured Inspector editing survives Save, Publish and public interaction on desktop and mobile',async t=>{
 const model=createEditorState(createDocument()),pageId=model.document.activePageId;
 const root=activePage(model).rootId,ids={};
 for(const type of ['list','table','tabs','accordion','gallery','carousel']){
  execute(model,{type:'element.add',payload:{type,parentId:root,name:type}});
  ids[type]=model.selection.primaryId;
 }
 for(const type of ['badge','quote','icon']){
  execute(model,{type:'element.add',payload:{type,parentId:root}});
  ids[type]=model.selection.primaryId;
 }
 execute(model,{type:'element.update',payload:{nodeId:ids.quote,patch:{props:{text:'Idézet első változat',attribution:'Készítő'}}}});
 execute(model,{type:'element.update',payload:{nodeId:ids.icon,patch:{props:{icon:'heart',label:'Szív ikon'}}}});
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
  await select(ids.quote);
 await editor.locator('.field textarea').last().fill('Egyedi idézet új változat');
 await editor.locator('.field textarea').last().press('Tab');
 const finalBadge='Végleges címke <img src=x onerror=alert(1)>',finalQuote='Végleges idézet\nMásodik sor',finalAttribution='Új szerző',finalIcon='Egyedi ikon " onload="alert(1)';
 for(const width of [390,1366]){
  await editor.setViewportSize({width,height:900});
  for(const [type,label,part,attribute,before,final] of [
   ['badge','Címke szövege','.basic-element-preview',undefined,width===390?'Címke':finalBadge+' mobil',finalBadge+(width===390?' mobil':'')],
   ['quote','Idézet szövege','.visual-quote p',undefined,width===390?'Egyedi idézet új változat':finalQuote+' mobil',finalQuote+(width===390?' mobil':'')],
   ['quote','Forrás vagy szerző','.visual-quote cite',undefined,width===390?'Készítő':finalAttribution+' mobil',finalAttribution+(width===390?' mobil':'')],
   ['icon','Ikon leírása','.visual-icon','aria-label',width===390?'Szív ikon':finalIcon+' mobil',finalIcon+(width===390?' mobil':'')]
  ]){
   await select(ids[type]);
   const basic=editor.locator('.basic-content-inspector'),input=basic.getByRole('textbox',{name:label,exact:true});
   await exerciseComposition({page:editor,input,selector:`.node[data-node-id="${ids[type]}"] `+part,attribute,before,final,posts,restart:true,attemptBlocked:type==='icon'?async()=>{const picker=basic.getByRole('combobox',{name:'Ikon',exact:true});await picker.selectOption('star');assert.equal(await picker.inputValue(),'heart','a glyph change cannot discard a composing label');}:undefined,otherInput:type==='quote'?basic.getByRole('textbox',{name:label==='Idézet szövege'?'Forrás vagy szerző':'Idézet szövege',exact:true}):undefined}).catch(error=>{assert.equal(posts.length,0,'unfinished basic content composition cannot reach the Editor API');throw error;});
  }
 }
 await select(ids.icon);
 const iconPicker=editor.locator('.basic-content-inspector').getByRole('combobox',{name:'Ikon',exact:true});
 await iconPicker.selectOption('star');
 assert.equal(await editor.locator('.basic-content-inspector').getByRole('textbox',{name:'Ikon leírása'}).inputValue(),finalIcon,'glyph selection preserves the freshly edited accessible label');
 await editor.keyboard.press('Control+z');assert.equal(await iconPicker.inputValue(),'heart');
 await editor.keyboard.press('Control+Shift+z');assert.equal(await iconPicker.inputValue(),'star');
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
 assert.equal(draft.pages[pageId].nodes[ids.badge].props.text,finalBadge);
 assert.equal(draft.pages[pageId].nodes[ids.quote].props.text,finalQuote);
 assert.equal(draft.pages[pageId].nodes[ids.quote].props.attribution,finalAttribution);
 assert.equal(draft.pages[pageId].nodes[ids.icon].props.label,finalIcon);
 assert.equal(draft.pages[pageId].nodes[ids.icon].props.icon,'star');
 await viewer.goto(base+'/p/test');
 assert.equal(await viewer.locator('.visual-badge[data-node-id="'+ids.badge+'"]').textContent(),'Címke','Save cannot expose the new badge');
 assert.match(await viewer.locator('blockquote[data-node-id="'+ids.quote+'"]').textContent(),/Idézet első változat/);
 assert.equal(await viewer.locator('.visual-icon[data-node-id="'+ids.icon+'"]').getAttribute('aria-label'),'Szív ikon');
 await editor.reload();
 for(const [type,label,value] of [['badge','Címke szövege',finalBadge],['quote','Idézet szövege',finalQuote],['quote','Forrás vagy szerző',finalAttribution],['icon','Ikon leírása',finalIcon]]){
  await select(ids[type]);assert.equal(await editor.locator('.basic-content-inspector').getByRole('textbox',{name:label,exact:true}).inputValue(),value);
 }
 await editor.locator('#publish').click();
 await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
 assert.equal(posts.at(-1).publish,true);
 await viewer.goto(base+'/p/test');
 const quote=viewer.locator('blockquote[data-node-id="'+ids.quote+'"]');
 assert.match(await quote.textContent(),/Végleges idézet/);
 assert.equal(await quote.locator('cite').textContent(),finalAttribution);
 assert.equal(await viewer.locator('span.visual-badge[data-node-id="'+ids.badge+'"]').count(),1);
 assert.equal(await viewer.locator('span.visual-icon[data-node-id="'+ids.icon+'"]').getAttribute('aria-label'),finalIcon);
 const publicBadge=viewer.locator('span.visual-badge[data-node-id="'+ids.badge+'"]'),publicIcon=viewer.locator('span.visual-icon[data-node-id="'+ids.icon+'"]');
 assert.equal(await publicBadge.textContent(),finalBadge);assert.equal(await publicBadge.locator('img,script').count(),0);
 assert.equal(await publicIcon.getAttribute('onload'),null);assert.equal(await publicIcon.textContent(),iconById('star').glyph);
 assert.equal(await quote.locator('p').textContent(),finalQuote,'multiline quote is preserved through Save/reload/Publish');
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
 await editor.screenshot({path:'/tmp/creator-ux-p0-structured-desktop.png'});
 await viewer.screenshot({path:'/tmp/creator-ux-p0-public-content.png'});
 await editor.setViewportSize({width:390,height:800});
 await editor.locator('.node[data-node-id="'+ids.tabs+'"]').evaluate(el=>el.click());
 const mobile=editor.locator('.structured-item .structured-action').first();
 await mobile.waitFor({state:'attached'});
 assert.ok(await mobile.evaluate(el=>getComputedStyle(el).minHeight==='44px'));
 await editor.screenshot({path:'/tmp/creator-ux-p0-structured-mobile.png'});
 const recovery=await editor.evaluate(async()=>{
  const {renderBasicContentInspector}=await import('/editor-v2/ui/basic-content-inspector.js');const results=[];
  for(const type of ['badge','quote','icon'])for(const mode of ['false','throw']){
   const original={text:'Mentett szöveg',attribution:'Mentett szerző',icon:'heart',label:'Mentett leírás',unknown:{keep:'same'}};
   const node={id:'basic-recovery',type,props:structuredClone(original)};let allow=false,accepted,guard;
   const root=renderBasicContentInspector(node,next=>{if(!allow){if(mode==='throw')throw Error('Fixture rejection');return false;}accepted=structuredClone(next);return true;},{pending:fn=>{guard=fn;}});
   document.querySelector('#inspectorBody').append(root);
   const input=root.querySelector(type==='quote'?'textarea':'input');const before=input.value;
   input.focus();input.value='Elutasított';input.dispatchEvent(new InputEvent('input',{bubbles:true}));
   const rejected=input.hasAttribute('aria-invalid')&&!guard()&&!accepted;
   input.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));const escaped=input.value===before&&guard();
   allow=true;input.value='Új szöveg';input.dispatchEvent(new Event('change',{bubbles:true}));
   let fresh=(type==='icon'?accepted.label:accepted.text)==='Új szöveg'&&JSON.stringify(accepted.unknown)===JSON.stringify(original.unknown)&&guard();
   if(type==='quote'){
    const source=root.querySelector('input');source.focus();source.value='Új szerző';source.dispatchEvent(new InputEvent('input',{bubbles:true}));fresh=fresh&&accepted.text==='Új szöveg'&&accepted.attribution==='Új szerző';
   }else if(type==='icon'){
    const picker=root.querySelector('select');picker.value='star';picker.dispatchEvent(new Event('change',{bubbles:true}));fresh=fresh&&accepted.icon==='star'&&accepted.label==='Új szöveg';
   }
   const unchanged=JSON.stringify(node.props)===JSON.stringify(original);root.remove();
   const locked=renderBasicContentInspector({...node,locked:true},()=>{throw Error('Locked basic content changed');});document.querySelector('#inspectorBody').append(locked);
   const lockedSafe=[...locked.querySelectorAll('input,textarea,select')].every(el=>el.disabled);locked.remove();
   results.push({type,mode,rejected,escaped,fresh,unchanged,lockedSafe});
  }return results;
 });
 for(const result of recovery)for(const key of ['rejected','escaped','fresh','unchanged','lockedSafe'])assert.equal(result[key],true,JSON.stringify(result));
 assert.deepEqual(errors,[]);
});
