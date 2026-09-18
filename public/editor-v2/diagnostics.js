/*
 * Sanci9517 Visual Editor v2 — diagnostics observer.
 * Transient UI/runtime diagnostics only. It never becomes a second editor state,
 * command or Page Model.
 */
const MAX_ENTRIES=100;
const entries=[];
const listeners=new Set();

function codeFor(source,severity='error'){
  const prefix={boot:'BOOT',runtime:'RUNTIME',command:'CMD',api:'API',validation:'VALID',ui:'UI',save:'SAVE'}[source]||'RUNTIME';
  const letter=severity==='warning'?'W':'E';
  return 'SANCI-'+prefix+'-'+letter+String(entries.length+1).padStart(4,'0');
}
function normalize(input){
  const source=input.source||'runtime';
  const severity=input.severity||'error';
  const error=input.error;
  const message=input.message||error?.message||String(error||'Ismeretlen hiba');
  return {id:crypto.randomUUID?.()||String(Date.now())+'-'+String(Math.random()),code:input.code||codeFor(source,severity),severity,source,message,file:input.file||'',line:input.line||0,column:input.column||0,context:input.context||'',timestamp:new Date().toISOString()};
}
function notify(){for(const listener of listeners){try{listener(entries.slice())}catch{}}}
function add(input={}){
  const entry=normalize(input);
  entries.unshift(entry);
  if(entries.length>MAX_ENTRIES)entries.length=MAX_ENTRIES;
  render();
  notify();
  return entry;
}
function clear(){entries.length=0;render();notify()}
function esc(value){return String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]))}
function render(){
  const badge=document.querySelector('#diagnosticsBadge');
  const panel=document.querySelector('#diagnosticsPanel');
  const list=document.querySelector('#diagnosticsList');
  if(!badge||!panel||!list)return;
  const count=entries.length;
  badge.textContent=count?'🔴 '+count+' hiba':'✓ 0 hiba';
  badge.classList.toggle('has-errors',count>0);
  list.replaceChildren();
  if(!count){list.innerHTML='<div class="diagnostics-empty">Nincs rögzített editorhiba.</div>';return}
  for(const item of entries){
    const row=document.createElement('article');
    row.className='diagnostic-item '+item.severity;
    row.innerHTML='<div class="diagnostic-head"><strong>'+esc(item.code)+'</strong><span>'+esc(item.source)+'</span></div><div class="diagnostic-message">'+esc(item.message)+'</div>'+(item.file?'<div class="diagnostic-location">'+esc(item.file)+':'+(item.line||0)+':'+(item.column||0)+'</div>':'')+'<details><summary>Technikai részletek</summary><pre>'+esc(JSON.stringify(item,null,2))+'</pre></details>';
    list.append(row);
  }
}
function open(){const panel=document.querySelector('#diagnosticsPanel');if(panel)panel.hidden=false}
function close(){const panel=document.querySelector('#diagnosticsPanel');if(panel)panel.hidden=true}
function copy(){
  const text=entries.map(item=>'['+item.code+'] '+item.message+(item.file?' — '+item.file+':'+item.line+':'+item.column:'')).join('\n');
  navigator.clipboard?.writeText(text);
}
function init(){
  const root=document.createElement('div');
  root.innerHTML='<button id="diagnosticsBadge" class="diagnostics-badge" type="button" title="Editor hibakereső">✓ 0 hiba</button><aside id="diagnosticsPanel" class="diagnostics-panel" hidden><header><div><strong>Editor hibakereső</strong><small>Automatikus hibajelentés</small></div><div class="diagnostics-actions">'+''+'<button id="diagnosticsCopy" type="button">Másolás</button><button id="diagnosticsClear" type="button">Törlés</button><button id="diagnosticsClose" type="button" aria-label="Bezárás">×</button></div></header><div id="diagnosticsList" class="diagnostics-list"></div></aside>';
  document.body.append(...root.children);
  document.querySelector('#diagnosticsBadge').onclick=open;
  document.querySelector('#diagnosticsClose').onclick=close;
  document.querySelector('#diagnosticsClear').onclick=clear;
  document.querySelector('#diagnosticsCopy').onclick=copy;
  const early=window.__sanciEditorEarlyErrors||[];
  delete window.__sanciEditorEarlyErrors;
  for(const item of early)add(item);
  window.addEventListener('error',event=>{
    if(event.target instanceof HTMLScriptElement)return;
    add({source:'runtime',message:event.message||'Ismeretlen JavaScript hiba',file:event.filename,line:event.lineno,column:event.colno,error:event.error});
  });
  window.addEventListener('unhandledrejection',event=>{
    add({source:'runtime',message:'Nem kezelt Promise hiba: '+(event.reason instanceof Error?event.reason.message:String(event.reason)),error:event.reason});
  });
  render();
}
export const diagnostics=Object.freeze({init,add,clear,open,close,subscribe(listener){listeners.add(listener);return()=>listeners.delete(listener)},get entries(){return entries.slice()}});
