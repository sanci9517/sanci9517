/*
 * Sanci9517 Visual Editor v2 — diagnostics observer.
 * Transient UI/runtime diagnostics only. It never becomes a second editor state,
 * command or Page Model.
 */
const MAX_ENTRIES=100;
const entries=[];
const listeners=new Set();
const SOURCES=Object.freeze({boot:'BOOT',runtime:'RUNTIME',command:'CMD',api:'API',validation:'VALID',ui:'UI',save:'SAVE',verify:'VERIFY'});

function codeFor(source,severity='error'){
  const prefix=SOURCES[source]||'RUNTIME';
  const letter=severity==='warning'?'W':'E';
  return 'SANCI-'+prefix+'-'+letter+'001';
}
function safeText(value,max=320){
  return String(value??'').replace(/[\u0000-\u001f\u007f-\u009f]+/g,' ').replace(/\bBearer\s+[A-Za-z0-9._~+/-]+=*/gi,'Bearer [redacted]').replace(/\b((?:access|refresh|id)?[_-]?(?:token|secret|password|authorization|cookie|csrf|api[_-]?key|client[_-]?secret))\b\s*[:=]\s*["']?[^&\s"'<>]+/gi,'$1=[redacted]').replace(/([?&](?:code|state|token|secret|key|email|password|signature|sig)=)[^&#\s]+/gi,'$1[redacted]').replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,'[redacted-email]').replace(/\b(?:\+?\d[\d .()/-]{7,}\d)\b/g,'[redacted-phone]').slice(0,max);
}
function safeLocation(value){
  const text=safeText(value,500);if(!text)return '';
  const absoluteUrl=/^[a-z][a-z\d+.-]*:\/\//i.test(text);
  try{const url=new URL(text,globalThis.location?.origin||'https://editor.invalid');const parts=url.pathname.split('/').filter(Boolean);return (absoluteUrl?parts.slice(-3):parts.slice(-2)).join('/')+(url.search?'?[redacted]':'')}catch{return text.split(/[?#]/,1)[0].split(/[\\/]/).filter(Boolean).slice(-2).join('/')}
}
function safeContext(value){
  if(typeof value!=='string')return safeText(value,160);
  try{const url=new URL(value,globalThis.location?.origin||'https://editor.invalid');return safeText(url.pathname+(url.search?'?[redacted]':''),160)}catch{return safeText(value,160)}
}
function normalize(input){
  if(!input||typeof input!=='object'||Array.isArray(input))input={};
  const source=Object.hasOwn(SOURCES,input.source)?input.source:'runtime';
  const severity=input.severity==='warning'?'warning':'error';
  const message=safeText(input.message||input.error?.message||'Ismeretlen hiba');
  const suppliedCode=typeof input.code==='string'&&/^SANCI-[A-Z0-9-]{1,56}$/.test(input.code)?input.code:'';
  return {id:globalThis.crypto?.randomUUID?.()||String(Date.now())+'-'+String(Math.random()),code:suppliedCode||codeFor(source,severity),severity,source,message,file:safeLocation(input.file),line:Number.isInteger(input.line)&&input.line>0?Math.min(input.line,10000000):0,column:Number.isInteger(input.column)&&input.column>0?Math.min(input.column,10000000):0,context:safeContext(input.context),timestamp:new Date().toISOString()};
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
function verify(condition,{code,message,context=''}={}){if(condition)return true;add({source:'verify',...(code?{code}:{}),message:message||'A művelet elvárt eredménye nem jött létre.',context});return false}
function esc(value){return String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]))}
function render(){
  if(typeof document==='undefined')return;
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
export const diagnostics=Object.freeze({init,add,clear,verify,open,close,subscribe(listener){listeners.add(listener);return()=>listeners.delete(listener)},get entries(){return entries.slice()}});
