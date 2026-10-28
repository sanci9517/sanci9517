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

for(const width of [390,1366])test(`accessibility Inspector IME validation and public attributes at ${width}px`,async t=>{
 const state=createEditorState(createDocument()),pageId=state.document.activePageId,rootId=activePage(state).rootId,ids={};
 for(const kind of ['legacy','authored','aliases','collision']){
  execute(state,{type:'element.add',payload:{type:'text',parentId:rootId,authored:kind==='authored',props:{text:kind}}});ids[kind]=state.selection.primaryId;
  execute(state,{type:'accessibility.set',payload:{nodeId:ids[kind],patch:{label:'Mentett '+kind,id:'old-'+kind,lang:'hu'}}});
 }
 execute(state,{type:'element.update',payload:{nodeId:ids.aliases,patch:{accessibility:{label:'Régi kanonikus',id:'old-canonical',ariaLabel:'Örökölt felirat',anchorId:'legacy-anchor',lang:'hu'}}}});
 execute(state,{type:'accessibility.set',payload:{nodeId:rootId,patch:{label:'Mentett gyökér',lang:'hu'}}});
 let draft=structuredClone(state.document),published=structuredClone(draft),revision=1;
 const original=structuredClone(draft),posts=[],errors=[],dialogs=[],publicDir=resolve(import.meta.dirname,'../../public');
 const server=createServer(async(req,res)=>{
  const url=new URL(req.url,'http://localhost'),json=data=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(data));};
  if(url.pathname==='/api/admin/pages')return json({ok:true,data:url.searchParams.get('archived')==='1'?[]:[{id:pageId,slug:'test',title:'Test',content:draft,revision,isPublished:true}]});
  if(url.pathname==='/api/admin/editor'){
   if(req.method==='GET')return json({ok:true,data:{page:{id:pageId,document:draft,publishedRevisionId:'published'},revisions:[{id:'revision-'+revision,version:revision}]}});
   let body='';for await(const chunk of req)body+=chunk;const request=JSON.parse(body);posts.push(request);draft=structuredClone(request.document);revision++;
   if(request.publish)published=structuredClone(draft);return json({ok:true,data:{pageId,version:revision,revisionId:'revision-'+revision,published:Boolean(request.publish)}});
  }
  if(url.pathname==='/api/public/pages')return json({ok:true,data:{id:pageId,slug:'test',title:'Test',content:published.pages[pageId]}});
  if(url.pathname==='/api/public/navigation')return json({ok:true,data:{items:[]}});
  if(url.pathname==='/api/integrations/twitch/connection')return json({ok:true,data:{connected:false}});
  if(url.pathname.startsWith('/api/'))return json({ok:true,data:{siteName:'Test'}});
  const file=resolve(publicDir,'.'+(url.pathname==='/p/test'?'/visual-page.html':url.pathname));if(!file.startsWith(publicDir+'/'))return res.writeHead(403).end();
  try{res.setHeader('content-type',{'.html':'text/html','.js':'text/javascript','.css':'text/css'}[extname(file)]||'application/octet-stream');res.end(await readFile(file));}catch{res.writeHead(404).end();}
 });
 await new Promise(done=>server.listen(0,'127.0.0.1',done));
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
 t.after(async()=>{await browser.close();await new Promise(done=>server.close(done));});
 const base='http://127.0.0.1:'+server.address().port,editor=await browser.newPage({viewport:{width,height:900}}),viewer=await browser.newPage({viewport:{width,height:900}});
 for(const page of [editor,viewer]){page.setDefaultTimeout(7000);page.on('pageerror',error=>errors.push(error.message));}
 editor.on('dialog',async dialog=>{dialogs.push(dialog.message());await dialog.dismiss();});
 await editor.goto(base+'/editor-v2/index.html');await viewer.goto(base+'/p/test');
 const canvas=id=>editor.locator(`.node[data-node-id="${id}"]`),live=id=>viewer.locator(`[data-node-id="${id}"]`);
 const select=async id=>{await canvas(id).evaluate(el=>el.click());if(await editor.locator('#rightDock').evaluate(el=>el.classList.contains('closed')))await editor.locator('#openInspector').click();await editor.locator('.inspector-tabs button').nth(2).click();const group=editor.locator('.inspector-group-title').filter({hasText:'Akadálymentesség és láthatóság'});if(await group.getAttribute('aria-expanded')==='false')await group.click();};
 const accessibilityGroup=()=>editor.locator('.inspector-group').filter({hasText:'Akadálymentesség és láthatóság'});
 const label='Képernyőolvasó elnevezés',anchor='Oldalbeli hivatkozási azonosító',lang='Tartalom nyelve (pl. hu)';
 const field=name=>editor.getByRole('textbox',{name,exact:true});
 for(const kind of ['legacy','authored']){
  await select(ids[kind]);
  assert.deepEqual(await accessibilityGroup().locator('[data-inspector-command]').evaluateAll(controls=>controls.map(control=>[control.dataset.inspectorCommand,control.dataset.inspectorKey])),[
   ['accessibility.set','accessibility.label'],['accessibility.set','accessibility.id'],['accessibility.set','accessibility.lang'],
   ['element.visibility.set','visibility.desktop'],['element.visibility.set','visibility.tablet'],['element.visibility.set','visibility.mobile']
  ],'accessibility and responsive visibility controls expose their actual command and Page Model key');
  for(const [name,attribute,before,final] of [[label,'aria-label','Mentett '+kind,'Végleges '+kind+' " onload="alert(1) lang="zz"'],[anchor,'id','old-'+kind,'new-'+kind],[lang,'lang','hu','ja']]){
   await exerciseComposition({page:editor,input:field(name),selector:`.node[data-node-id="${ids[kind]}"]`,attribute,before,final,posts,restart:true,otherInput:field(name===label?lang:label)}).catch(error=>{assert.equal(posts.length,0,'unfinished accessibility input cannot reach the Editor API');throw error;});
  }
 }
 assert.equal(posts.length,0);
 await select(ids.legacy);
 const keepId='new-legacy';
 for(const invalid of ['1-invalid','old-collision']){
  await field(anchor).evaluate(el=>{window.__invalidAccessibility=el;});await field(anchor).fill(invalid);
  assert.equal(await field(anchor).getAttribute('aria-invalid'),'true');assert.equal(await canvas(ids.legacy).getAttribute('id'),keepId);
  assert.equal(await field(anchor).evaluate(el=>el===window.__invalidAccessibility),true);
  await field(label).focus();await editor.keyboard.press('Control+s');assert.equal(posts.length,0,'another field cannot forget an invalid anchor');
  const visible=editor.getByRole('checkbox',{name:'Látható: mobile',exact:true});await visible.click();assert.equal(await visible.isChecked(),true,'blocked visibility restores its UI state');
  await editor.locator('.inspector-tabs button').nth(1).click();assert.equal(await field(anchor).inputValue(),invalid,'tab changes cannot discard the invalid candidate');
  for(const action of ['#save','#publish']){await editor.locator(action).click();assert.equal(posts.length,0);}
  await field(anchor).press('Escape');assert.equal(await field(anchor).inputValue(),keepId);
 }
 await field(lang).fill('h');await editor.waitForFunction(()=>document.querySelector('input[aria-label="Tartalom nyelve (pl. hu)"]')?.getAttribute('aria-invalid')==='true');assert.equal(await field(lang).getAttribute('aria-invalid'),'true');
 await field(label).focus();await editor.locator('#save').click();assert.equal(posts.length,0);
 await field(lang).fill('ja');assert.equal(await field(lang).getAttribute('aria-invalid'),null);assert.equal(await canvas(ids.legacy).getAttribute('lang'),'ja');
 await select(ids.aliases);assert.equal(await field(label).inputValue(),'Örökölt felirat');assert.equal(await field(anchor).inputValue(),'legacy-anchor');
 await select(rootId);assert.equal(await editor.getByRole('textbox',{name:anchor,exact:true}).count(),0,'the root technical ID has no editable field');
 for(const [name,attribute,before,final] of [[label,'aria-label','Mentett gyökér','Oldal leírása'],[lang,'lang','hu','de']]){
  await exerciseComposition({page:editor,input:field(name),selector:`.node[data-node-id="${rootId}"]`,attribute,before,final,posts,restart:true,otherInput:field(name===label?lang:label)});
 }
 const save=async publish=>{await editor.locator(publish?'#publish':'#save').click();await editor.waitForFunction(pub=>document.querySelector('#saveStatus').textContent.startsWith(pub?'Publikálva':'Mentve'),publish);};
 await save(false);
 assert.deepEqual(draft.pages[pageId].nodes[ids.aliases].accessibility,original.pages[pageId].nodes[ids.aliases].accessibility,'opening legacy fields cannot normalize the stored snapshot');
 await viewer.reload();assert.equal(await live(ids.legacy).getAttribute('id'),'old-legacy');assert.equal(await viewer.locator('#content-canvas').getAttribute('aria-label'),'Mentett gyökér','Save cannot alter published root attributes');
 await select(ids.aliases);await field(label).fill('Új örökölt felirat');
 assert.equal(await canvas(ids.aliases).getAttribute('aria-label'),'Új örökölt felirat');assert.equal(await canvas(ids.aliases).getAttribute('id'),'legacy-anchor','only the edited alias is replaced');
 await editor.keyboard.press('Control+z');assert.equal(await field(label).inputValue(),'Örökölt felirat');assert.equal(await canvas(ids.aliases).getAttribute('aria-label'),'Örökölt felirat');
 await editor.keyboard.press('Control+Shift+z');assert.equal(await field(label).inputValue(),'Új örökölt felirat');
 await field(anchor).fill('new-alias');assert.equal(await canvas(ids.aliases).getAttribute('id'),'new-alias');
 await save(false);const alias=draft.pages[pageId].nodes[ids.aliases].accessibility;
 assert.equal(Object.hasOwn(alias,'ariaLabel'),false);assert.equal(Object.hasOwn(alias,'anchorId'),false);
 await editor.reload();
 for(const kind of ['legacy','authored','aliases']){
  await select(ids[kind]);assert.equal(await field(anchor).inputValue(),kind==='aliases'?'new-alias':'new-'+kind);
  assert.equal(await field(label).inputValue(),kind==='aliases'?'Új örökölt felirat':'Végleges '+kind+' " onload="alert(1) lang="zz"');
 }
 await save(true);await viewer.reload();
 for(const kind of ['legacy','authored','aliases']){
  assert.equal(await live(ids[kind]).getAttribute('id'),kind==='aliases'?'new-alias':'new-'+kind);
  assert.equal(await live(ids[kind]).getAttribute('aria-label'),kind==='aliases'?'Új örökölt felirat':'Végleges '+kind+' " onload="alert(1) lang="zz"');
  assert.equal(await live(ids[kind]).getAttribute('lang'),kind==='aliases'?'hu':'ja');assert.equal(await live(ids[kind]).getAttribute('onload'),null);
 }
 assert.equal(await viewer.locator('#content-canvas').getAttribute('aria-label'),'Oldal leírása');assert.equal(await viewer.locator('#content-canvas').getAttribute('lang'),'de');assert.equal(await viewer.locator('#content-canvas').getAttribute('id'),'content-canvas');
 assert.deepEqual(draft.pages[pageId].nodes[ids.collision],original.pages[pageId].nodes[ids.collision],'unrelated nodes remain byte-equivalent in the fixture document');
 await select(rootId);await field(label).fill('');await field(lang).fill('');await save(true);await viewer.reload();
 assert.equal(await viewer.locator('#content-canvas').getAttribute('aria-label'),null);assert.equal(await viewer.locator('#content-canvas').getAttribute('lang'),null);assert.equal(await viewer.locator('#content-canvas').getAttribute('id'),'content-canvas');
 if(width===390){
  const recovery=await editor.evaluate(async()=>{
   const {renderAccessibilityFields}=await import('/editor-v2/ui/accessibility-fields.js');
   const {normalizeAccessibility}=await import('/editor-v2/core/accessibility.js');const results=[];
   for(const mode of ['false','throw']){
    const original={label:'Mentett cím',id:'old-id',lang:'hu'},node={id:'recovery-a11y',type:'text',props:{},accessibility:structuredClone(original)};
    let accepted=structuredClone(original),allow=false,calls=0,guard;const occupied={other:{id:'other',accessibility:{id:'taken'}}};
    const root=renderAccessibilityFields(node,patch=>{calls++;if(!allow){if(mode==='throw')throw Error('Fixture rejection');return false;}accepted=normalizeAccessibility({...node,accessibility:accepted},patch,occupied);return true;},{nodes:()=>occupied,pending:fn=>{guard=fn;}});
    document.querySelector('#inspectorBody').append(root);const first=root.querySelector('[aria-label="Képernyőolvasó elnevezés"]'),anchor=root.querySelector('[aria-label="Oldalbeli hivatkozási azonosító"]');
    first.focus();first.value='Elutasított';first.dispatchEvent(new InputEvent('input',{bubbles:true}));const rejected=first.hasAttribute('aria-invalid')&&!guard()&&accepted.label==='Mentett cím';
    first.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));const escaped=first.value==='Mentett cím'&&guard();
    allow=true;first.value='Új cím';first.dispatchEvent(new Event('change',{bubbles:true}));const beforeCalls=calls;
    anchor.focus();anchor.value='taken';anchor.dispatchEvent(new InputEvent('input',{bubbles:true}));const localValidation=calls===beforeCalls&&anchor.hasAttribute('aria-invalid');
    delete occupied.other;anchor.dispatchEvent(new InputEvent('input',{bubbles:true}));const fresh=accepted.label==='Új cím'&&accepted.id==='taken'&&guard();
    const unchanged=JSON.stringify(node.accessibility)===JSON.stringify(original);root.remove();
    const locked=renderAccessibilityFields({...node,locked:true},()=>{throw Error('Locked a11y changed');});document.querySelector('#inspectorBody').append(locked);
    const lockedSafe=[...locked.querySelectorAll('input')].every(input=>input.disabled);locked.remove();
    const pageRoot=renderAccessibilityFields({...node,type:'root'},()=>true);const protectedRoot=pageRoot.querySelectorAll('input').length===2&&!pageRoot.querySelector('[aria-label="Oldalbeli hivatkozási azonosító"]');
    results.push({mode,rejected,escaped,localValidation,fresh,unchanged,lockedSafe,protectedRoot});
   }return results;
  });
  for(const result of recovery)for(const key of ['rejected','escaped','localValidation','fresh','unchanged','lockedSafe','protectedRoot'])assert.equal(result[key],true,JSON.stringify(result));
 }
 assert.deepEqual(errors,[]);assert.deepEqual(dialogs,[],'invalid candidates stay local without command alerts');
});
