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

for(const width of [390,1366])test(`Card Inspector IME, sources and Save/Publish isolation at ${width}px`,async t=>{
 const model=createEditorState(createDocument()),pageId=model.document.activePageId,root=activePage(model).rootId;
 execute(model,{type:'element.add',payload:{type:'card',parentId:root}});const cardId=model.selection.primaryId;
 execute(model,{type:'element.add',payload:{type:'text',parentId:cardId,props:{text:'Egyedi belső szöveg'}}});
 const childId=model.selection.primaryId;
 let draft=structuredClone(model.document),published=structuredClone(draft),version=1;
 const posts=[],requests=[],assetRoot=resolve(import.meta.dirname,'../../public');
 const assetId='11111111-2222-4333-8444-555555555555';
 const server=createServer(async(req,res)=>{
  const url=new URL(req.url,'http://localhost');requests.push({method:req.method,path:url.pathname});
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
  if(url.pathname==='/api/admin/media'&&!url.searchParams.has('id'))return json({ok:true,data:{assets:[{id:assetId,name:'Saját Médiatár-kép',altText:'Új leírás',previewUrl:'/api/admin/media?id='+assetId}]}});
  if((url.pathname==='/api/admin/media'&&url.searchParams.get('id')===assetId)||url.pathname.startsWith('/media/')){res.setHeader('content-type','image/png');return res.end(Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l5sAAAAASUVORK5CYII=','base64'))}
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
 const editor=await browser.newPage({viewport:{width,height:900}}),viewer=await browser.newPage({viewport:{width,height:900}});
 editor.setDefaultTimeout(7000);viewer.setDefaultTimeout(7000);
 const errors=[];editor.on('pageerror',e=>errors.push('editor:'+e.message));viewer.on('pageerror',e=>errors.push('public:'+e.message));
 await editor.goto(base+'/editor-v2/index.html');await viewer.goto(base+'/p/test');
 const card=editor.locator('.node[data-node-id="'+cardId+'"]'),publicCard=viewer.locator('.visual-editor-node[data-node-id="'+cardId+'"]');
 await card.evaluate(el=>el.click());
 if(await editor.locator('#rightDock').evaluate(el=>el.classList.contains('closed')))await editor.locator('#openInspector').click();
 await editor.locator('.inspector-tabs button').nth(1).click();
 assert.equal(await editor.locator('.card-content-inspector h3').textContent(),'Kártya tartalma');
 const cardRoutes=await editor.locator('.card-content-inspector [data-inspector-command]').evaluateAll(rows=>rows.map(row=>({command:row.dataset.inspectorCommand,key:row.dataset.inspectorKey})));
 assert.deepEqual(cardRoutes.map(route=>route.key),['props.cardContent.title','props.cardContent.description','props.cardContent.variant','props.cardContent.imageAssetId','props.cardContent.imageSrc','props.cardContent.imageAlt','props.cardContent.actionLabel','props.cardContent.actionHref','props.cardContent.newWindow']);
 assert.ok(cardRoutes.every(route=>route.command==='element.update'),'each Card field exposes its actual element.update route');
 const cardPicker=editor.locator('.card-content-inspector .editor-media-picker'),cardPickerLabel=editor.locator('.card-content-inspector span[id^="card-media-label-"]');
 assert.equal(await cardPicker.getAttribute('role'),'group');assert.equal(await cardPicker.getAttribute('aria-labelledby'),await cardPickerLabel.getAttribute('id'),'Card image picker uses its visible label');
 const field=label=>editor.locator('.card-content-inspector').getByRole('textbox',{name:label});
 const setField=async(label,value)=>{const input=field(label);await input.fill(value);await input.press('Tab');};
 await setField('Kártya címe','Kreatív <img src=x onerror=alert(1)>');
 await setField('Rövid leírás','Bemutatkozó kártya, élő adásokkal.');
 await editor.getByRole('combobox',{name:'Kártya megjelenése'}).selectOption('outline');
 await setField('Kép URL (opcionális)','/media/hero.jpg');
 await setField('Kép leírása','Fénykép a csatornáról');
 await setField('Gomb felirata (opcionális)','További tartalom');
 await setField('Gomb hivatkozása','/p/about');
 await editor.locator('.card-content-inspector input[type="checkbox"]').check();
 assert.equal(posts.length,0,'editing Card content must not call Save or Publish');
 const preview=card.locator('.card-preview');
 assert.match(await preview.textContent(),/Kreatív/);
 assert.match(await preview.textContent(),/További tartalom/);
 await editor.keyboard.press('Control+z');
 assert.equal(await editor.locator('.card-content-inspector input[type="checkbox"]').isChecked(),false);
 await editor.keyboard.press('Control+Shift+z');
 assert.equal(await editor.locator('.card-content-inspector input[type="checkbox"]').isChecked(),true);
 const mirror=`.node[data-node-id="${cardId}"] .card-preview`;
 for(const [label,selector,attribute,before,final] of [
  ['Kártya címe',mirror+' .card-preview-title',undefined,'Kreatív <img src=x onerror=alert(1)>','Végleges kreatív'],
  ['Rövid leírás',mirror+' p',undefined,'Bemutatkozó kártya, élő adásokkal.','Végleges\nleírás'],
  ['Kép leírása',mirror+' img','alt','Fénykép a csatornáról','Végleges képleírás'],
  ['Gomb felirata (opcionális)',mirror+' .card-preview-action',undefined,'További tartalom','Végleges gomb'],
  ['Kép URL (opcionális)',mirror+' img','src','/media/hero.jpg','/media/final.jpg']
 ]){
  await exerciseComposition({page:editor,input:field(label),selector,attribute,before,final,posts,restart:true,otherInput:field('Gomb hivatkozása'),attemptBlocked:async()=>{
   await editor.getByRole('combobox',{name:'Kártya megjelenése'}).selectOption('glass');
   assert.equal(await editor.getByRole('combobox',{name:'Kártya megjelenése'}).inputValue(),'outline');
   await editor.locator('.card-content-inspector input[type="checkbox"]').click();
   assert.equal(await editor.locator('.card-content-inspector input[type="checkbox"]').isChecked(),true);
  }}).catch(error=>{assert.equal(posts.length,0,'unfinished Card composition cannot reach the Editor API');throw error;});
  await setField(label,before);
 }
 const href=field('Gomb hivatkozása');
 await href.evaluate(el=>{el.focus();el.dispatchEvent(new CompositionEvent('compositionstart',{bubbles:true}));el.value='/p/unfinished';el.dispatchEvent(new InputEvent('input',{bubbles:true,isComposing:true}));});
 for(const action of ['#save','#publish']){await editor.locator(action).click();assert.equal(posts.length,0);}
 await field('Kártya címe').focus();await editor.keyboard.press('Control+s');assert.equal(posts.length,0);
 await href.evaluate(el=>{el.focus();el.dispatchEvent(new CompositionEvent('compositionend',{bubbles:true}));el.value='/p/final';el.dispatchEvent(new InputEvent('input',{bubbles:true}));});
 await editor.evaluate(()=>new Promise(resolve=>requestAnimationFrame(resolve)));
 await editor.keyboard.press('Control+z');assert.equal(await href.inputValue(),'/p/about');
 await editor.keyboard.press('Control+Shift+z');assert.equal(await href.inputValue(),'/p/final');
 await setField('Gomb hivatkozása','/p/about');
 await editor.locator('#save').click();
 await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
 assert.equal(posts.at(-1).publish,false);
 await viewer.reload();
 assert.equal(await publicCard.locator('h3').textContent(),'Új kártya','Save does not alter the published Card');
 assert.equal(await publicCard.locator('.visual-card-action').count(),0);
 await editor.locator('#publish').click();
 await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
 assert.equal(posts.at(-1).publish,true);
 await viewer.reload();
 assert.equal(await publicCard.evaluate(el=>el.tagName),'ARTICLE');
 assert.equal(await publicCard.locator('h3').textContent(),'Kreatív <img src=x onerror=alert(1)>');
 assert.equal(await publicCard.locator('h3 img').count(),0,'title must be escaped');
 assert.equal(await publicCard.locator('.visual-card-description').textContent(),'Bemutatkozó kártya, élő adásokkal.');
 assert.equal(await publicCard.locator('.visual-card-media').getAttribute('alt'),'Fénykép a csatornáról');
 const action=publicCard.locator('.visual-card-action');
 assert.equal(await action.getAttribute('href'),'/p/about');
 assert.equal(await action.getAttribute('target'),'_blank');
 assert.equal(await action.getAttribute('rel'),'noopener noreferrer');
 assert.equal(await publicCard.locator('[data-node-id="'+childId+'"]').textContent(),'Egyedi belső szöveg');
 assert.ok((await publicCard.getAttribute('class')).includes('visual-card-outline'));
 await viewer.setViewportSize({width:390,height:800});await viewer.reload();
 assert.ok((await action.boundingBox()).height>=44,'touch-friendly CTA');
 // Reuse the same Media picker as image/gallery, without dropping the existing image description.
 await editor.getByRole('button',{name:'Médiatár megnyitása'}).click();
 await editor.getByRole('button',{name:'Saját Médiatár-kép kiválasztása'}).click();
 assert.equal(await card.locator('.card-preview img').getAttribute('src'),'/api/admin/media?id='+assetId);
 assert.equal(await field('Kép leírása').inputValue(),'Fénykép a csatornáról');
 assert.equal(posts.length,2,'asset selection is a draft edit, not an implicit Save or Publish');
 await exerciseComposition({page:editor,input:field('Kép URL (opcionális)'),selector:mirror+' img',attribute:'src',before:'/api/admin/media?id='+assetId,final:'/media/temporary.jpg',posts});
 assert.equal(await editor.locator('.card-content-inspector .editor-media-selected').count(),0,'live URL commit synchronizes the selected asset view');
 await editor.getByRole('button',{name:'Médiatár megnyitása'}).click();
 await editor.getByRole('button',{name:'Saját Médiatár-kép kiválasztása'}).click();
 assert.equal(await field('Kép URL (opcionális)').inputValue(),'','picker selection clears the committed URL');
 await editor.locator('#save').click();
 await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));
 assert.equal(posts.at(-1).publish,false);
 assert.equal(posts.at(-1).document.pages[pageId].nodes[cardId].props.cardContent.imageAssetId,assetId);
 assert.equal(posts.at(-1).document.pages[pageId].nodes[cardId].props.cardContent.imageSrc,'','choosing an asset clears the old URL in the same command');
 await viewer.reload();
 assert.equal(await publicCard.locator('.visual-card-media').getAttribute('src'),'/media/hero.jpg','Save must not publish the newly selected asset');
 await editor.locator('#publish').click();
 await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));
 await viewer.reload();
 assert.equal(await publicCard.locator('.visual-card-media').getAttribute('src'),'/media/'+assetId);
 // URL, library selection and removal must be explicit, mutually exclusive
 // edits. No old fallback may silently resurface after clearing an asset.
 const saveDraft=async()=>{await editor.locator('#save').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Mentve'));};
 const publishDraft=async()=>{await editor.locator('#publish').click();await editor.waitForFunction(()=>document.querySelector('#saveStatus').textContent.startsWith('Publikálva'));};
 const inspectCard=async()=>{
  await card.evaluate(el=>el.click());
  if(await editor.locator('#rightDock').evaluate(el=>el.classList.contains('closed')))await editor.locator('#openInspector').click();
  await editor.locator('.inspector-tabs button').nth(1).click();
 };
 const chooseAsset=async()=>{await editor.getByRole('button',{name:'Médiatár megnyitása'}).click();await editor.getByRole('button',{name:'Saját Médiatár-kép kiválasztása'}).click();};
 for(const width of [390,1366]){
  await editor.setViewportSize({width,height:900});await viewer.setViewportSize({width,height:900});
  // This is a previously persisted dual-source Card, not a new picker
  // selection. Clearing it must remove the old URL as well as the asset ID.
  const legacySource='/media/legacy-fallback-'+width+'.png';
  draft.pages[pageId].nodes[cardId].props.cardContent.imageSrc=legacySource;
  await editor.reload();await inspectCard();
  assert.equal(await field('Kép URL (opcionális)').inputValue(),legacySource);
  assert.equal(await card.locator('.card-preview img').getAttribute('src'),'/api/admin/media?id='+assetId);
  await editor.getByRole('button',{name:'Kép eltávolítása',exact:true}).click();
  assert.equal(await card.locator('.card-preview img').count(),0,'clearing a persisted dual-source Card cannot reveal the old fallback');
  assert.equal(await field('Kép URL (opcionális)').inputValue(),'');
  await editor.keyboard.press('Control+z');
  assert.equal(await field('Kép URL (opcionális)').inputValue(),legacySource,'Undo preserves the complete previous persisted state');
  assert.equal(await card.locator('.card-preview img').getAttribute('src'),'/api/admin/media?id='+assetId);
  await chooseAsset();
  assert.equal(await field('Kép URL (opcionális)').inputValue(),'');
  assert.equal(await field('Kép leírása').inputValue(),'Fénykép a csatornáról');
  const before=posts.length,external='/media/handwritten-'+width+'.png';
  await setField('Kép URL (opcionális)',external);
  assert.equal(await card.locator('.card-preview img').getAttribute('src'),external,'a handwritten URL must replace the selected asset');
  assert.equal(await editor.getByRole('button',{name:'Kép eltávolítása',exact:true}).count(),0,'URL edit clears the picker selection too');
  await editor.keyboard.press('Control+z');
  assert.equal(await card.locator('.card-preview img').getAttribute('src'),'/api/admin/media?id='+assetId,'one Undo restores the asset and URL together');
  assert.equal(await field('Kép URL (opcionális)').inputValue(),'');
  await editor.keyboard.press('Control+Shift+z');assert.equal(await card.locator('.card-preview img').getAttribute('src'),external);
  assert.equal(posts.length,before,'switching sources and Undo/Redo do not persist or publish');
  await saveDraft();const saved=posts.at(-1).document.pages[pageId].nodes[cardId].props.cardContent;
  assert.equal(saved.imageAssetId,'');assert.equal(saved.imageSrc,external);assert.equal(saved.imageAlt,'Fénykép a csatornáról');
  await viewer.reload();assert.equal(await publicCard.locator('.visual-card-media').getAttribute('src'),'/media/'+assetId,'Save keeps the last published asset');
  await editor.reload();await inspectCard();assert.equal(await field('Kép URL (opcionális)').inputValue(),external);
  assert.equal(await card.locator('.card-preview img').getAttribute('src'),external,'source survives draft reload');
  await publishDraft();await viewer.reload();assert.equal(await publicCard.locator('.visual-card-media').getAttribute('src'),external);
  await viewer.waitForFunction(id=>{const image=document.querySelector('[data-node-id="'+id+'"] .visual-card-media');return image?.complete&&image.naturalWidth>0;},cardId);
  // Seed a previous URL, choose a library image, then remove it. The URL
  // must stay removed; the operation is still an undoable Page Model edit.
  await chooseAsset();assert.equal(await field('Kép URL (opcionális)').inputValue(),'');
  await editor.getByRole('button',{name:'Kép eltávolítása',exact:true}).click();
  assert.equal(await card.locator('.card-preview img').count(),0,'removing an asset must not resurrect a stale URL');
  assert.equal(await field('Kép URL (opcionális)').inputValue(),'');
  await editor.keyboard.press('Control+z');assert.equal(await card.locator('.card-preview img').getAttribute('src'),'/api/admin/media?id='+assetId);
  await editor.keyboard.press('Control+Shift+z');assert.equal(await card.locator('.card-preview img').count(),0);
  await saveDraft();const cleared=posts.at(-1).document.pages[pageId].nodes[cardId].props.cardContent;
  assert.equal(cleared.imageAssetId,'');assert.equal(cleared.imageSrc,'');assert.equal(cleared.imageAlt,'Fénykép a csatornáról');
  await viewer.reload();assert.equal(await publicCard.locator('.visual-card-media').getAttribute('src'),external,'clearing and Save still leave the published image');
  await publishDraft();await viewer.reload();assert.equal(await publicCard.locator('.visual-card-media').count(),0);
  // Leave a published library image as the starting point of the next size.
  await chooseAsset();await publishDraft();await viewer.reload();assert.equal(await publicCard.locator('.visual-card-media').getAttribute('src'),'/media/'+assetId);
 }
 assert.ok(requests.every(req=>req.method==='GET'||(req.method==='POST'&&req.path==='/api/admin/editor')),'image removal never calls a file-delete or upload endpoint');
 if(width===390){
  const recovery=await editor.evaluate(async()=>{
   const {renderCardInspector}=await import('/editor-v2/ui/card-content-inspector.js');
   const {defaultCardContent}=await import('/editor-v2/core/card-content.js');
   const results=[];
   for(const mode of ['false','throw']){
    const original={...defaultCardContent(),title:'Mentett cím',description:'Mentett leírás',imageSrc:'/media/original.jpg',imageAlt:'Saját alt'};
    const node={id:'card-recovery',props:{cardContent:structuredClone(original)}};let allow=false,accepted,guard;
    const root=renderCardInspector(node,next=>{if(!allow){if(mode==='throw')throw Error('Fixture rejection');return false;}accepted=structuredClone(next);return true;},{pending:fn=>{guard=fn;}});
    document.querySelector('#inspectorBody').append(root);
    const input=label=>root.querySelector(`[aria-label="${label}"]`);
    const title=input('Kártya címe');title.focus();title.value='Elutasított';title.dispatchEvent(new InputEvent('input',{bubbles:true}));
    const rejected=title.hasAttribute('aria-invalid')&&!guard()&&!accepted;
    title.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
    const escaped=title.value==='Mentett cím'&&guard();
    allow=true;title.value='Új cím';title.dispatchEvent(new Event('change',{bubbles:true}));
    const description=input('Rövid leírás');description.focus();description.value='Új leírás';description.dispatchEvent(new InputEvent('input',{bubbles:true}));
    const fresh=accepted.title==='Új cím'&&accepted.description==='Új leírás'&&accepted.imageAlt==='Saját alt'&&guard();
    const unchanged=JSON.stringify(node.props.cardContent)===JSON.stringify(original);root.remove();
    const locked=renderCardInspector({...node,locked:true},()=>{throw Error('Locked Card changed');});document.querySelector('#inspectorBody').append(locked);
    const lockedSafe=[...locked.querySelectorAll('input,select,textarea,button')].every(el=>el.disabled);locked.remove();
    results.push({mode,rejected,escaped,fresh,unchanged,lockedSafe});
   }return results;
  });
  for(const result of recovery)for(const key of ['rejected','escaped','fresh','unchanged','lockedSafe'])assert.equal(result[key],true,JSON.stringify(result));
 }
 assert.deepEqual(errors,[]);
});
