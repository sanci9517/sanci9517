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

for(const width of [390,1366])test(`Social Links IME and publication at ${width}px`,async t=>{
 const model=createEditorState(createDocument()),pageId=model.document.activePageId,root=activePage(model).rootId;
 execute(model,{type:'element.add',payload:{type:'social',parentId:root}});
 const socialId=model.selection.primaryId;
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
 await editor.goto(base+'/editor-v2/index.html');await viewer.goto(base+'/p/test');
 const editorNode=editor.locator('.node[data-node-id="'+socialId+'"]');
 await editorNode.evaluate(el=>el.click());
 if(await editor.locator('#rightDock').evaluate(el=>el.classList.contains('closed')))await editor.locator('#openInspector').click();
 await editor.locator('.inspector-tabs button').nth(1).click();
 const panel=editor.locator('.social-links-inspector');
 await panel.locator('h3').waitFor();
 assert.equal(await panel.locator('h3').textContent(),'Közösségi hivatkozások');
 const add=async()=>panel.getByRole('button',{name:'＋ Új közösségi link'}).click();
 const item=index=>panel.locator('.social-link-item').nth(index);
 const change=async(index,name,value)=>{
  const input=item(index).getByRole('textbox',{name});
  await input.fill(value);await input.press('Tab');
 };
 await add();
 assert.equal(await panel.locator('.social-link-item').count(),1);

 await change(0,'Felirat','Twitch <img src=x onerror=alert(1)>');
 await change(0,'Hivatkozás URL','https://www.twitch.tv/example');
 await add();
 await item(1).getByRole('combobox',{name:'Platform'}).selectOption('discord');
 await change(1,'Felirat','Discord közösség');
 await change(1,'Hivatkozás URL','https://discord.gg/example');
 await item(1).getByRole('checkbox',{name:'Megnyitás új lapon'}).uncheck();
 await panel.getByRole('combobox',{name:'Megjelenés'}).selectOption('cards');
 await panel.getByRole('combobox',{name:'Elrendezés'}).selectOption('grid');
 await panel.getByRole('checkbox',{name:'Ikonok megjelenítése'}).uncheck();
 await item(1).getByRole('button',{name:'↑ Fel'}).click();
 assert.equal(await item(0).getByRole('textbox',{name:'Felirat'}).inputValue(),'Discord közösség');
 assert.equal(await panel.locator('.social-link-item').count(),2);
 assert.equal(await editorNode.locator('.visual-social-link').count(),2);
 assert.equal(posts.length,0,'editing must not save or publish');
 await editor.keyboard.press('Control+z');
 assert.match(await item(0).getByRole('textbox',{name:'Felirat'}).inputValue(),/Twitch/);
 await editor.keyboard.press('Control+Shift+z');
 assert.equal(await item(0).getByRole('textbox',{name:'Felirat'}).inputValue(),'Discord közösség');
 const finalTwitchLabel='Twitch végleges <img src=x onerror=alert(1)>',finalTwitchUrl='https://www.twitch.tv/final';
 const twitchSelector=`.node[data-node-id="${socialId}"] .visual-social-item:nth-child(2)`;
 await exerciseComposition({page:editor,input:item(1).getByRole('textbox',{name:'Felirat'}),selector:twitchSelector+' .visual-social-text',before:'Twitch <img src=x onerror=alert(1)>',final:finalTwitchLabel,posts,otherInput:item(1).getByRole('textbox',{name:'Hivatkozás URL'}),attemptBlocked:async()=>{
  await item(1).getByRole('combobox',{name:'Platform'}).selectOption('website');
  assert.equal(await item(1).getByRole('combobox',{name:'Platform'}).inputValue(),'twitch','blocked platform changes restore the displayed selection');
  await add();assert.equal(await panel.locator('.social-link-item').count(),2,'adding a row cannot discard a pending composition');
 }});
 await exerciseComposition({page:editor,input:item(1).getByRole('textbox',{name:'Hivatkozás URL'}),selector:twitchSelector+' .visual-social-link',attribute:'href',before:'https://www.twitch.tv/example',final:finalTwitchUrl,posts,restart:true});
 // Full-render controls must use the freshly edited row rather than the
 // originally captured items array or its original platform default label.
 await item(1).getByRole('combobox',{name:'Platform'}).selectOption('website');
 assert.equal(await item(1).getByRole('textbox',{name:'Felirat'}).inputValue(),finalTwitchLabel);
 await item(1).getByRole('combobox',{name:'Platform'}).selectOption('twitch');
 await add();assert.equal(await panel.locator('.social-link-item').count(),3);
 await item(2).getByRole('button',{name:'× Törlés'}).click();
 await item(1).getByRole('button',{name:'↑ Fel'}).click();await item(0).getByRole('button',{name:'↓ Le'}).click();
 assert.equal(await item(1).getByRole('textbox',{name:'Felirat'}).inputValue(),finalTwitchLabel);
 assert.equal(await item(1).getByRole('textbox',{name:'Hivatkozás URL'}).inputValue(),finalTwitchUrl);
 await editor.locator('#save').click();
 await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
 assert.equal(posts.at(-1).publish,false);
 assert.equal(draft.pages[pageId].nodes[socialId].props.socialLinks.items.length,2);
 await viewer.reload();
 const nav=viewer.locator('.visual-social-nav');
 assert.equal(await nav.locator('a').count(),0,'Save cannot expose a new published social link');
 assert.match(await nav.textContent(),/Adj hozzá/);
 await editor.reload();await editorNode.evaluate(el=>el.click());
 if(await editor.locator('#rightDock').evaluate(el=>el.classList.contains('closed')))await editor.locator('#openInspector').click();
 await editor.locator('.inspector-tabs button').nth(1).click();
 assert.equal(await item(1).getByRole('textbox',{name:'Felirat'}).inputValue(),finalTwitchLabel);
 assert.equal(await item(1).getByRole('textbox',{name:'Hivatkozás URL'}).inputValue(),finalTwitchUrl);
 await editor.locator('#publish').click();
 await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
 assert.equal(posts.at(-1).publish,true);
 await viewer.reload();
 assert.equal(await nav.locator('a').count(),2);
 assert.equal(await nav.locator('a').first().getAttribute('href'),'https://discord.gg/example');
 assert.equal(await nav.locator('a').first().getAttribute('target'),null);
 const twitch=nav.locator('a').nth(1);
 assert.equal(await twitch.getAttribute('href'),finalTwitchUrl);
 assert.equal(await twitch.getAttribute('target'),'_blank');
 assert.equal(await twitch.getAttribute('rel'),'noopener noreferrer');
 assert.match(await twitch.getAttribute('aria-label'),/új lapon/);
 assert.equal(await twitch.textContent(),finalTwitchLabel);
 assert.equal(await twitch.locator('img,script').count(),0,'labels are escaped');
 assert.ok((await nav.getAttribute('class')).includes('visual-social-cards'));
 assert.ok((await nav.getAttribute('class')).includes('visual-social-grid'));
 assert.equal(await nav.locator('.visual-social-icon').count(),0,'icons can be disabled');
 await viewer.setViewportSize({width:390,height:800});await viewer.reload();
 assert.ok((await nav.locator('a').first().boundingBox()).height>=44,'touch target');
 assert.ok(await viewer.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+2),'no page-wide mobile overflow');
 if(width===390){
  const recovery=await editor.evaluate(async()=>{
   const {renderSocialLinksInspector}=await import('/editor-v2/ui/social-links-inspector.js');
   const {renderEmbedInspector}=await import('/editor-v2/ui/creator-embed-inspector.js');
   const cases=[
    {kind:'social',render:renderSocialLinksInspector,key:'socialLinks',first:'Felirat',second:'Hivatkozás URL',value:{version:1,variant:'pills',layout:'wrap',showIcons:true,items:[{id:'one',platform:'twitch',label:'Mentett cím',href:'https://twitch.tv/one',newWindow:true},{id:'two',platform:'website',label:'Másik sor',href:'https://example.com',newWindow:false}]}},
    {kind:'embed',render:renderEmbedInspector,key:'embedContent',first:'Lejátszó címe',second:'Videó URL vagy azonosító',value:{version:1,provider:'youtube',source:'M7lc1UVf-VE',title:'Mentett cím',ratio:'classic',clickToLoad:true}}
   ];
   const checks=[];
   for(const entry of cases)for(const mode of ['false','throw']){
    const node={id:'recovery-'+entry.kind,props:{[entry.key]:structuredClone(entry.value)}};
    let allow=false,accepted,guard;
    const root=entry.render(node,value=>{if(!allow){if(mode==='throw')throw Error('Fixture rejection');return false;}accepted=structuredClone(value);return true;},{pending:fn=>{guard=fn;}});
    document.querySelector('#inspectorBody').append(root);
    const first=root.querySelector(`[aria-label="${entry.first}"]`),second=root.querySelector(`[aria-label="${entry.second}"]`);
    first.focus();first.value='Elutasított';first.dispatchEvent(new InputEvent('input',{bubbles:true}));
    const rejected=first.getAttribute('aria-invalid')==='true'&&!guard()&&!accepted;
    first.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));const escaped=first.value==='Mentett cím'&&guard();
    allow=true;first.value='Új cím';first.dispatchEvent(new Event('change',{bubbles:true}));
    second.focus();second.value=entry.kind==='social'?'https://twitch.tv/final':'dQw4w9WgXcQ';second.dispatchEvent(new InputEvent('input',{bubbles:true}));
    const current=entry.kind==='social'?accepted.items[0]:accepted;
    const fresh=(current.label||current.title)==='Új cím'&&(current.href||current.source)===second.value&&guard();
    const other=entry.kind!=='social'||JSON.stringify(accepted.items[1])===JSON.stringify(entry.value.items[1]);
    let status=true;
    if(entry.kind==='embed'){
     second.value='not a video';second.dispatchEvent(new InputEvent('input',{bubbles:true}));
     status=!!root.querySelector('.embed-inspector-status.invalid')&&guard();
     second.value='dQw4w9WgXcQ';second.dispatchEvent(new InputEvent('input',{bubbles:true}));status=status&&!root.querySelector('.embed-inspector-status.invalid');
    }
    const unchanged=JSON.stringify(node.props[entry.key])===JSON.stringify(entry.value);root.remove();
    const locked=entry.render({...node,locked:true},()=>{throw Error('Locked fixture changed');});document.querySelector('#inspectorBody').append(locked);
    const lockedSafe=[...locked.querySelectorAll('input,select,button')].every(el=>el.disabled);locked.remove();
    checks.push({kind:entry.kind,mode,rejected,escaped,fresh,other,status,unchanged,lockedSafe});
   }return checks;
  });
  for(const result of recovery)for(const key of ['rejected','escaped','fresh','other','status','unchanged','lockedSafe'])assert.equal(result[key],true,JSON.stringify(result));
 }
 assert.equal(posts.length,2,'control recovery does not trigger extra API writes');
 assert.deepEqual(errors,[]);
});
