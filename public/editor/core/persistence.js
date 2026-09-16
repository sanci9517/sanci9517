/* Sanci9517 Visual Editor — server persistence adapter. */
(function(){
'use strict';
const E=window.SanciEditor,Schema=window.SanciEditorSchema;
if(!E||!Schema) throw new Error('Sanci9517 persistence dependencies missing');
const $=id=>document.getElementById(id);
let busy=false;
function activePage(){return Schema.activePage(E.getState().document)}
function toast(text){const t=$('toast');if(!t)return;t.textContent=text;t.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove('show'),2200)}
function setState(text){const el=$('saveState');if(el)el.textContent=text}
async function readJson(res){let data={};try{data=await res.json()}catch{}if(!res.ok||data.ok===false)throw new Error(data?.error?.message||data?.error||`Szerverhiba (${res.status})`);return data.data??data}
async function request(method,pageId,payload){if(!pageId)throw new Error('Nincs oldalazonosító.');const url='/api/admin/editor?pageId='+encodeURIComponent(pageId);return readJson(await fetch(url,{method,headers:{'Content-Type':'application/json'},credentials:'same-origin',cache:'no-store',body:payload?JSON.stringify(payload):undefined}))}
async function load(){
 try{
  setState('● Oldalak betöltése…');
  const initialActive=Schema.activePage(E.getState().document)?.id||null;
  const pages=await readJson(await fetch('/api/admin/pages',{credentials:'same-origin',cache:'no-store'}));
  if(!Array.isArray(pages)||!pages.length){setState('✓ Nincs szerveroldali oldal');return}
  const byId=new Map();
  pages.forEach(item=>{const document=item.editorDocument;if(!document||!Array.isArray(document.pages))return;document.pages.forEach(page=>byId.set(page.id,page))});
  const loaded=pages.map(item=>byId.get(item.id)||Schema.emptyPage({id:item.id,name:item.title,slug:item.slug}));
  const activeId=loaded.some(p=>p.id===initialActive)?initialActive:loaded[0].id;
  const document={schemaVersion:2,type:'sanci-document',pages:loaded,activePageId:activeId};
  const validation=Schema.validate(document);
  if(!validation.valid)throw new Error(validation.errors.join(' '));
  E.load(document);
  window.SanciEditorUI?.render();
  setState(`✓ ${loaded.length} oldal és tartalom betöltve`);
 }catch(err){setState('⚠ Oldalak nem érhetők el');console.warn('Sanci9517 persistence load:',err.message)}
}
async function save(publish){if(busy)return;busy=true;setState(publish?'● Publikálás…':'● Mentés…');try{const document=E.getState().document;const page=activePage();if(!page)throw new Error('Nincs aktív oldal.');const validation=Schema.validate(document);if(!validation.valid)throw new Error(validation.errors.join(' '));const result=await request('POST',page.id,{pageId:page.id,document,note:publish?'Publikálás':'Editor mentés',publish});E.getState().dirty=false;setState(`✓ Szerverre mentve · v${result.version}`);toast(publish?'Publikálva és D1-be mentve':'D1-be mentve')}catch(err){setState('⚠ Mentés sikertelen');toast(err.message||'Szerveroldali mentés sikertelen')}finally{busy=false}}
document.addEventListener('DOMContentLoaded',()=>{const saveButton=$('saveBtn'),publishButton=$('publishBtn');saveButton?.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();save(false)},true);publishButton?.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();save(true)},true);setTimeout(load,0)});
window.SanciEditorPersistence={save,load};
})();