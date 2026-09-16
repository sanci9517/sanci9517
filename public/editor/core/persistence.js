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
  setState('● Oldal betöltése…');
  const current=activePage(E.getState().document);
  const initialActive=current?.id||null;
  const pages=await readJson(await fetch('/api/admin/pages',{credentials:'same-origin',cache:'no-store'}));
  if(!Array.isArray(pages)||!pages.length){setState('✓ Nincs szerveroldali oldal');return}
  const selected=initialActive?pages.find(p=>p.id===initialActive):null;
  const item=selected||pages[0];
  const editorDocument=item?.editorDocument;
  let page;
  if(editorDocument&&Array.isArray(editorDocument.pages)){
   page=editorDocument.pages.find(p=>p.id===item.id)||editorDocument.pages[0];
  }
  page=page||Schema.emptyPage({id:item.id,name:item.title,slug:item.slug});
  const document={schemaVersion:2,type:'sanci-document',pages:[page],activePageId:page.id};
  const validation=Schema.validate(document);
  if(!validation.valid)throw new Error(validation.errors.join(' '));
  E.load(document);
  window.SanciEditorUI?.render();
  setState(`✓ ${page.name||item.title} betöltve D1-ből`);
 }catch(err){setState('⚠ Oldal nem érhető el');console.warn('Sanci9517 persistence load:',err.message)}
}
async function save(publish){if(busy)return;busy=true;setState(publish?'● Publikálás…':'● Mentés…');try{const document=E.getState().document;const page=activePage();if(!page)throw new Error('Nincs aktív oldal.');const validation=Schema.validate(document);if(!validation.valid)throw new Error(validation.errors.join(' '));const result=await request('POST',page.id,{pageId:page.id,document,note:publish?'Publikálás':'Editor mentés',publish});E.getState().dirty=false;setState(`✓ Szerverre mentve · v${result.version}`);toast(publish?'Publikálva és D1-be mentve':'D1-be mentve')}catch(err){setState('⚠ Mentés sikertelen');toast(err.message||'Szerveroldali mentés sikertelen')}finally{busy=false}}
document.addEventListener('DOMContentLoaded',()=>{const saveButton=$('saveBtn'),publishButton=$('publishBtn');saveButton?.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();save(false)},true);publishButton?.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();save(true)},true);setTimeout(load,0)});
window.SanciEditorPersistence={save,load};
})();