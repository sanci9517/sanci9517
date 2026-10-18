/* WEB-011 77.44 — canonical, versioned static content for Editor and public renderer.
   This module has no DOM dependencies. Only explicit new/edited nodes opt into v1. */
export const STRUCTURED_TYPES=Object.freeze(['list','table','tabs','accordion','gallery']);
export const isStructuredType=type=>STRUCTURED_TYPES.includes(type);
const text=(v,max=2000)=>String(v??'').slice(0,max);
export function safeMediaUrl(value){
 const raw=String(value??'').trim();
 if(!raw||raw.startsWith('//')||/[\u0000-\u001f\u007f\\]/.test(raw)||!(/^(https?:\/\/|\/(?!\/))/.test(raw)))return '';
 try{const url=new URL(raw,'https://sanci.invalid');return ['http:','https:'].includes(url.protocol)&&!url.username&&!url.password?raw:''}catch{return ''}
}
export function createElementContent(type){
 switch(type){
 case 'list':return {version:1,items:['Első pont','Második pont','Harmadik pont'],ordered:false};
 case 'table':return {version:1,rows:[['Oszlop 1','Oszlop 2'],['Adat 1','Adat 2']]};
 case 'tabs':return {version:1,items:[{label:'Első fül',content:'Első fül tartalma'},{label:'Második fül',content:'Második fül tartalma'}]};
 case 'accordion':return {version:1,items:[{label:'Első kérdés',content:'Első válasz'},{label:'Második kérdés',content:'Második válasz'}]};
 case 'gallery':return {version:1,items:[{src:'',alt:'',caption:''}]};
 default:throw Error('Unsupported structured element');
 }
}
export function normalizeElementContent(type,value){
 if(!isStructuredType(type))throw Error('Unsupported structured element');
 if(!value||typeof value!=='object'||value.version!==1||!Array.isArray(value.items??value.rows))throw Error('Invalid structured content');
 if(type==='table'){
  if(!value.rows.length||value.rows.length>40)throw Error('Table must have 1–40 rows');
  const width=value.rows[0]?.length;
  if(!Number.isInteger(width)||width<1||width>12)throw Error('Table must have 1–12 columns');
  return {version:1,rows:value.rows.map(row=>{if(!Array.isArray(row)||row.length!==width)throw Error('Table width mismatch');return row.map(cell=>text(cell,500))})};
 }
 if(!value.items.length||value.items.length>40)throw Error('Element must have 1–40 items');
 if(type==='list'){
  return {version:1,ordered:Boolean(value.ordered),items:value.items.map(item=>text(item,800))};
 }
 if(type==='gallery'){
  return {version:1,items:value.items.map(item=>({src:text(item?.src,2048).trim(),alt:text(item?.alt,250),caption:text(item?.caption,500)}))};
 }
 return {version:1,items:value.items.map(item=>({label:text(item?.label,120),content:text(item?.content,3000)}))};
}
export function validateElementContent(type,value){
 let model;try{model=normalizeElementContent(type,value)}catch{return 'INVALID_STRUCTURED_CONTENT'}
 if(type==='gallery'){
  for(const item of model.items){
   if(!safeMediaUrl(item.src))return 'INVALID_GALLERY_IMAGE';
   if(!item.alt.trim())return 'GALLERY_ALT_REQUIRED';
  }
 }
 if(type==='tabs'||type==='accordion'){
  if(model.items.some(item=>!item.label.trim()||!item.content.trim()))return 'INCOMPLETE_INTERACTIVE_CONTENT';
 }
 if(type==='table'&&model.rows.some(row=>row.every(cell=>!cell.trim())))return 'EMPTY_TABLE_ROW';
 return null;
}
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const idSafe=v=>String(v??'node').replace(/[^a-zA-Z0-9_-]/g,'-').slice(0,100);
export function renderElementContent(type,value,nodeId){
 let m;try{m=normalizeElementContent(type,value)}catch{return '<div class="visual-structured-error">A tartalom hiányos</div>'}
 if(type==='list'){
  const tag=m.ordered?'ol':'ul';return `<${tag} class="visual-structured-list">${m.items.map(i=>`<li>${esc(i)}</li>`).join('')}</${tag}>`;
 }
 if(type==='table')return `<div class="visual-structured-table-scroll" tabindex="0" role="region" aria-label="Táblázat"><table class="visual-structured-table"><thead><tr>${m.rows[0].map(v=>`<th scope="col">${esc(v)}</th>`).join('')}</tr></thead><tbody>${m.rows.slice(1).map(row=>`<tr>${row.map(v=>`<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
 if(type==='accordion')return `<div class="visual-structured-accordion">${m.items.map((item,i)=>`<details${i===0?' open':''}><summary>${esc(item.label)}</summary><div class="visual-structured-panel">${esc(item.content)}</div></details>`).join('')}</div>`;
 if(type==='tabs'){
  const prefix='tab-'+idSafe(nodeId);
  return `<div class="visual-structured-tabs" data-structured-tabs><div role="tablist" aria-label="Tartalomfülek">${m.items.map((item,i)=>`<button type="button" role="tab" id="${prefix}-t${i}" aria-controls="${prefix}-p${i}" aria-selected="${i===0}" tabindex="${i===0?0:-1}">${esc(item.label)}</button>`).join('')}</div>${m.items.map((item,i)=>`<div role="tabpanel" id="${prefix}-p${i}" aria-labelledby="${prefix}-t${i}"${i===0?'':' hidden'} class="visual-structured-panel">${esc(item.content)}</div>`).join('')}</div>`;
 }
 return `<div class="visual-structured-gallery" data-structured-gallery>${m.items.map((item,i)=>{const url=safeMediaUrl(item.src);return url?`<button type="button" class="visual-gallery-thumb" data-gallery-index="${i}" aria-label="Kép megnyitása: ${esc(item.alt)}"><img src="${esc(url)}" alt="${esc(item.alt)}" loading="lazy">${item.caption?`<span>${esc(item.caption)}</span>`:''}</button>`:`<div class="visual-gallery-empty">Kép URL megadása szükséges</div>`}).join('')}<dialog class="visual-gallery-dialog" aria-label="Galéria nagyított képe"><button type="button" class="visual-gallery-close" aria-label="Bezárás">×</button><img alt=""><p></p></dialog></div>`;
}
export function activateStructuredContent(root){
 for(const host of root.querySelectorAll('[data-structured-tabs]')){
  if(host.dataset.activated)return;host.dataset.activated='1';
  const tabs=[...host.querySelectorAll('[role="tab"]')],panels=[...host.querySelectorAll('[role="tabpanel"]')];
  const select=index=>{tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;panels[i].hidden=i!==index});tabs[index]?.focus()};
  tabs.forEach((tab,i)=>{
   tab.addEventListener('click',()=>select(i));
   tab.addEventListener('keydown',e=>{
    const next=e.key==='ArrowRight'?(i+1)%tabs.length:e.key==='ArrowLeft'?(i+tabs.length-1)%tabs.length:e.key==='Home'?0:e.key==='End'?tabs.length-1:null;
    if(next!==null){e.preventDefault();select(next)}
   });
  });
 }
 for(const host of root.querySelectorAll('[data-structured-gallery]')){
  if(host.dataset.activated)return;host.dataset.activated='1';
  const dialog=host.querySelector('dialog'),big=dialog?.querySelector('img'),caption=dialog?.querySelector('p'),close=dialog?.querySelector('.visual-gallery-close');
  if(!dialog||typeof dialog.showModal!=='function')continue;
  let lastButton=null;
  host.querySelectorAll('.visual-gallery-thumb').forEach(button=>button.addEventListener('click',()=>{
   lastButton=button;const img=button.querySelector('img');big.src=img.src;big.alt=img.alt;caption.textContent=button.querySelector('span')?.textContent||'';dialog.showModal();close.focus();
  }));
  close.addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
  dialog.addEventListener('close',()=>{big.removeAttribute('src');lastButton?.focus()});
 }
}
