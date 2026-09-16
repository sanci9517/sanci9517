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
async function readJson(res){let data={};try{data=await res.json()}catch{}if(!res.ok||data.ok===false)throw new Error(data?.error?.message||data?.error||`Szerverhiba (${res.status})`);return data.data??data}
async function request(method,payload){const page=activePage();if(!page)throw new Error('Nincs aktív oldal.');const url='/api/admin/editor?pageId='+encodeURIComponent(page.id);return readJson(await fetch(url,{method,headers:{'Content-Type':'application/json'},credentials:'same-origin',cache:'no-store',body:payload?JSON.stringify(payload):undefined}))}
function pageFromContent(item){
  const content=item?.content;
  if(content?.pages&&Array.isArray(content.pages)){
    return content.pages.find(p=>p?.id===item.id)||content.pages[0]||null;
  }
  if(content?.page?.id===item.id)return content.page;
  if(content?.id===item.id&&content?.root)return content;
  return null;
}
function makePage(item){
  const existing=pageFromContent(item);
  if(existing?.id===item.id)return existing;
  return Schema.emptyPage({id:item.id,name:item.title,slug:item.slug});
}
async function load(){
  try{
    setState('● Oldalak betöltése…');
    const current=activePage();
    const currentId=current?.id||null;
    const pages=await readJson(await fetch('/api/admin/pages',{credentials:'same-origin',cache:'no-store'}));
    if(!Array.isArray(pages)||!pages.length){setState('✓ Nincs szerveroldali oldal');return}
    let currentDocument=null;
    if(currentId&&pages.some(p=>p.id===currentId)){
      try{
        const result=await request('GET');
        currentDocument=result.draft||result.page?.document||null;
      }catch(err){console.warn('Sanci9517 active page draft load:',err.message)}
    }
    const sourcePages=pages.map(makePage);
    const draftPages=Array.isArray(currentDocument?.pages)?currentDocument.pages:[];
    const merged=sourcePages.map(page=>page.id===currentId
      ? (draftPages.find(p=>p.id===page.id)||page)
      : page);
    const document={schemaVersion:2,type:'sanci-document',pages:merged,activePageId:merged.some(p=>p.id===currentId)?currentId:merged[0].id};
    E.load(document);
    window.SanciEditorUI?.render();
    setState(`✓ ${merged.length} oldal betöltve`);
  }catch(err){
    setState('⚠ Oldalak nem érhetők el');
    console.warn('Sanci9517 persistence load:',err.message)
  }
}
async function save(publish){if(busy)return;busy=true;setState(publish?'● Publikálás…':'● Mentés…');try{const document=E.getState().document;const page=activePage();if(!page)throw new Error('Nincs aktív oldal.');const result=await request('POST',{pageId:page.id,document,note:publish?'Publikálás':'Editor mentés',publish});E.getState().dirty=false;setState(`✓ Szerverre mentve · v${result.version}`);toast(publish?'Publikálva és D1-be mentve':'D1-be mentve')}catch(err){setState('⚠ Mentés sikertelen');toast(err.message||'Szerveroldali mentés sikertelen')}finally{busy=false}}
document.addEventListener('DOMContentLoaded',()=>{const saveButton=$('saveBtn'),publishButton=$('publishBtn');saveButton?.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();save(false)},true);publishButton?.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();save(true)},true);setTimeout(load,0)});
window.SanciEditorPersistence={save,load};
})();