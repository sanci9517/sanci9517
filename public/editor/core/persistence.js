/* Sanci9517 Visual Editor — D1 persistence for the canonical page model. */
(function(){
'use strict';
const E=window.SanciEditor,Schema=window.SanciEditorSchema;
if(!E||!Schema)throw new Error('Sanci9517 persistence dependencies missing');
const $=id=>document.getElementById(id);
let busy=false;
const activePage=()=>Schema.activePage(E.getState().document);
function toast(text){const t=$('toast');if(!t)return;t.textContent=text;t.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove('show'),2200)}
function setState(text){const el=$('saveState');if(el)el.textContent=text}
async function readJson(res){let data={};try{data=await res.json()}catch{}if(!res.ok||data.ok===false)throw new Error(data?.error?.message||data?.error||`Szerverhiba (${res.status})`);return data.data??data}
async function request(method,pageId,payload){if(!pageId)throw new Error('Nincs oldalazonosító.');return readJson(await fetch('/api/admin/editor?pageId='+encodeURIComponent(pageId),{method,headers:{'Content-Type':'application/json'},credentials:'same-origin',cache:'no-store',body:payload?JSON.stringify(payload):undefined}))}
async function pagesRequest(method,payload){return readJson(await fetch('/api/admin/pages',{method,headers:{'Content-Type':'application/json'},credentials:'same-origin',cache:'no-store',body:payload?JSON.stringify(payload):undefined}))}
function pageFromServer(item){
 const doc=item?.editorDocument;
 let page=null;
 if(doc&&Array.isArray(doc.pages))page=doc.pages.find(p=>p?.id===item.id)||null;
 if(!page&&doc&&Array.isArray(doc.pages)&&doc.pages.length===1){page=Schema.clone(doc.pages[0]);page.id=item.id;page.name=item.title||page.name;page.slug=item.slug||page.slug}
 if(!page)page=Schema.emptyPage({id:item.id,name:item.title,slug:item.slug});
 page.id=item.id;page.name=item.title||page.name||'Új oldal';page.slug=item.slug||page.slug||'uj-oldal';
 return page;
}
async function load(){
 try{
  setState('● Oldalak és tartalom betöltése…');
  const previous=activePage();
  const previousId=previous?.id||null;
  const pages=await readJson(await fetch('/api/admin/pages',{credentials:'same-origin',cache:'no-store'}));
  if(!Array.isArray(pages)||!pages.length){setState('✓ Nincs szerveroldali oldal');return}
  const loaded=pages.map(pageFromServer);
  const preferred=loaded.find(p=>p.id===previousId);
  const withContent=loaded.find(p=>(p.root?.children||[]).length>0);
  const active=preferred||withContent||loaded[0];
  const document={schemaVersion:Schema.VERSION,type:'sanci-document',pages:loaded,activePageId:active.id};
  const validation=Schema.validate(document);
  if(!validation.valid)throw new Error(validation.errors.join(' '));
  E.load(document);
  window.SanciEditorUI?.render();
  setState(`✓ ${loaded.length} oldal betöltve D1-ből`);
 }catch(err){setState('⚠ Oldalak nem érhetők el');console.warn('Sanci9517 persistence load:',err.message);toast(err.message||'Oldalak betöltése sikertelen')}
}
async function save(publish){
 if(busy)return;busy=true;setState(publish?'● Publikálás…':'● Mentés…');
 try{
  const document=E.getState().document,page=activePage();
  if(!page)throw new Error('Nincs aktív oldal.');
  const validation=Schema.validate(document);
  if(!validation.valid)throw new Error(validation.errors.join(' '));
  const pageDocument={schemaVersion:Schema.VERSION,type:'sanci-document',pages:[Schema.clone(page)],activePageId:page.id};
  const result=await request('POST',page.id,{pageId:page.id,document:pageDocument,note:publish?'Publikálás':'Editor mentés',publish});
  await pagesRequest('PATCH',{id:page.id,title:page.name||'Új oldal'}).catch(()=>null);
  E.getState().dirty=false;
  setState(`✓ Szerverre mentve · v${result.version}`);
  toast(publish?'Publikálva és D1-be mentve':'D1-be mentve');
  return result;
 }catch(err){setState('⚠ Mentés sikertelen');toast(err.message||'Szerveroldali mentés sikertelen');throw err}
 finally{busy=false}
}
async function renamePage(pageId,title){return pagesRequest('PATCH',{id:pageId,title})}
async function deletePage(pageId){return pagesRequest('DELETE',{id:pageId})}
async function refresh(){return load()}
document.addEventListener('DOMContentLoaded',()=>{
 const saveButton=$('saveBtn'),publishButton=$('publishBtn');
 saveButton?.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();save(false).catch(()=>{})},true);
 publishButton?.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();save(true).catch(()=>{})},true);
 setTimeout(load,0);
});
window.SanciEditorPersistence={save,load,refresh,renamePage,deletePage};
})();