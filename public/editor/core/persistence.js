/* Sanci9517 Visual Editor — server persistence adapter. */
(function(){
'use strict';
const E=window.SanciEditor,Schema=window.SanciEditorSchema;
if(!E||!Schema) throw new Error('SanciEditor persistence dependencies missing');
const $=id=>document.getElementById(id);
let busy=false;
function activePage(){return Schema.activePage(E.getState().document)}
function toast(text){const t=$('toast');if(!t)return;t.textContent=text;t.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove('show'),2200)}
function setState(text){const el=$('saveState');if(el)el.textContent=text}
async function request(method,payload){const page=activePage();if(!page)throw new Error('Nincs aktív oldal.');const url='/api/admin/editor?pageId='+encodeURIComponent(page.id);const res=await fetch(url,{method,headers:{'Content-Type':'application/json'},credentials:'same-origin',body:payload?JSON.stringify(payload):undefined});let data={};try{data=await res.json()}catch{}if(!res.ok||data.ok===false)throw new Error(data?.error?.message||data?.error||`Mentési hiba (${res.status})`);return data.data??data}
async function loadServerDocument(){
 const res=await fetch('/api/admin/pages',{credentials:'same-origin',cache:'no-store'});
 let data={};try{data=await res.json()}catch{}
 if(!res.ok||data.ok===false)throw new Error(data?.error?.message||data?.error||`Oldalak betöltési hiba (${res.status})`);
 const pages=Array.isArray(data.data)?data.data:[];
 if(!pages.length)return null;
 const documents=[];
 for(const page of pages){
  const r=await fetch('/api/admin/editor?pageId='+encodeURIComponent(page.id),{credentials:'same-origin',cache:'no-store'});
  let d={};try{d=await r.json()}catch{}
  if(!r.ok||d.ok===false)continue;
  const doc=d.data?.draft||d.data?.page?.document;
  if(doc&&Array.isArray(doc.pages))documents.push(doc);
 }
 if(!documents.length)return null;
 documents.sort((a,b)=>(b.pages?.length||0)-(a.pages?.length||0));
 return documents[0];
}
async function save(publish){if(busy)return;busy=true;setState(publish?'● Publikálás…':'● Mentés…');try{const result=await request('POST',{pageId:activePage().id,document:E.getState().document,note:publish?'Publikálás':'Editor mentés',publish});E.getState().dirty=false;setState(`✓ Szerverre mentve · v${result.version}`);toast(publish?'Publikálva és D1-be mentve':'D1-be mentve')}catch(err){setState('⚠ Mentés sikertelen');toast(err.message||'Szerveroldali mentés sikertelen')}finally{busy=false}}
async function load(){try{setState('● Szerver betöltése…');const document=await loadServerDocument();if(document&&document.pages){E.load(document);window.SanciEditorUI?.render();setState('✓ Szerverről betöltve');return}setState('✓ Új dokumentum');}catch(err){setState('⚠ Szerver nem érhető el');console.warn('Sanci9517 persistence load:',err.message)}}
document.addEventListener('DOMContentLoaded',()=>{const saveButton=$('saveBtn'),publishButton=$('publishBtn');saveButton?.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();save(false)},true);publishButton?.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();save(true)},true);setTimeout(load,0)});
window.SanciEditorPersistence={save,load};
})();