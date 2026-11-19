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
  let text='A hibaüzenet nem olvasható.';
  try{text=String(value??'')}catch{}
  return text.replace(/[\u0000-\u001f\u007f-\u009f]+/g,' ').replace(/\bBearer\s+[A-Za-z0-9._~+/-]+=*/gi,'Bearer [redacted]').replace(/\b((?:access|refresh|id)?[_-]?(?:token|secret|password|authorization|cookie|csrf|api[_-]?key|client[_-]?secret))\b\s*[:=]\s*["']?[^&\s"'<>]+/gi,'$1=[redacted]').replace(/([?&](?:code|state|token|secret|key|email|password|signature|sig)=)[^&#\s]+/gi,'$1[redacted]').replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,'[redacted-email]').replace(/\b(?:\+?\d[\d .()/-]{7,}\d)\b/g,'[redacted-phone]').slice(0,max);
}
function readField(value,key){try{return value?.[key]}catch{return undefined}}
function safeErrorMessage(value){const message=readField(value,'message');if(typeof message==='string'&&message)return message;if(value==null)return 'Ismeretlen hiba';if(['string','number','boolean','bigint','symbol'].includes(typeof value))return safeText(value);return 'A hibaüzenet nem olvasható.'}
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
  const candidateSource=readField(input,'source');
  const source=typeof candidateSource==='string'&&Object.hasOwn(SOURCES,candidateSource)?candidateSource:'runtime';
  const severity=readField(input,'severity')==='warning'?'warning':'error';
  const message=safeText(readField(input,'message')||safeErrorMessage(readField(input,'error'))||'Ismeretlen hiba');
  const candidateCode=readField(input,'code');
  const suppliedCode=typeof candidateCode==='string'&&/^SANCI-[A-Z0-9-]{1,56}$/.test(candidateCode)?candidateCode:'';
  const file=readField(input,'file'),line=readField(input,'line'),column=readField(input,'column'),context=readField(input,'context');
  return {id:globalThis.crypto?.randomUUID?.()||String(Date.now())+'-'+String(Math.random()),code:suppliedCode||codeFor(source,severity),severity,source,message,file:safeLocation(file),line:Number.isInteger(line)&&line>0?Math.min(line,10000000):0,column:Number.isInteger(column)&&column>0?Math.min(column,10000000):0,context:safeContext(context),timestamp:new Date().toISOString()};
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
function exportPayload(){
  return {
    format:'sanci9517-editor-diagnostics',
    schemaVersion:1,
    exportedAt:new Date().toISOString(),
    entries:entries.map(({id,code,severity,source,message,file,line,column,context,timestamp})=>({id,code,severity,source,message,file,line,column,context,timestamp}))
  };
}
function download(){
  const status=document.querySelector('#diagnosticsCopyStatus');
  if(!status)return false;
  if(!entries.length){status.textContent='Nincs letölthető diagnosztikai adat.';return false}
  let objectUrl='';
  try{
    const payload=exportPayload();
    const blob=new Blob([JSON.stringify(payload,null,2)+'\n'],{type:'application/json'});
    objectUrl=URL.createObjectURL(blob);
    const link=document.createElement('a');
    link.href=objectUrl;
    link.download='sanci9517-editor-diagnostics-'+new Date().toISOString().replace(/[:.]/g,'-')+'.json';
    link.hidden=true;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(()=>URL.revokeObjectURL(objectUrl),1000);
    status.textContent='Biztonságos diagnosztikai JSON letöltése elindult. A fájl a rögzített, redaktált hibákat tartalmazza.';
    return true;
  }catch{
    if(objectUrl){try{URL.revokeObjectURL(objectUrl)}catch{}}
    status.textContent='A diagnosztikai export nem tölthető le ebben a böngészőben. A hibaüzeneteket a panelen továbbra is megtekintheted.';
    return false;
  }
}
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
async function copy(){
  const status=document.querySelector('#diagnosticsCopyStatus');
  if(!status)return false;
  const text=entries.map(item=>'['+item.code+'] '+item.message+(item.file?' — '+item.file+':'+item.line+':'+item.column:'')).join('\n');
  if(!text){status.textContent='Nincs másolható diagnosztikai adat.';return false}
  try{
    if(typeof navigator==='undefined'||typeof navigator.clipboard?.writeText!=='function')throw new Error('clipboard unavailable');
    await navigator.clipboard.writeText(text);
    status.textContent='A biztonságos diagnosztika a vágólapra másolva.';
    return true;
  }catch{
    status.textContent='A vágólap nem érhető el. Engedélyezd a hozzáférést, vagy másold ki kézzel a diagnosztikai bejegyzéseket.';
    return false;
  }
}
function init(){
  const root=document.createElement('div');
  root.innerHTML='<button id="diagnosticsBadge" class="diagnostics-badge" type="button" title="Editor hibakereső">✓ 0 hiba</button><aside id="diagnosticsPanel" class="diagnostics-panel" hidden><header><div><strong>Editor hibakereső</strong><small>Automatikus hibajelentés</small></div><div class="diagnostics-actions"><button id="diagnosticsCopy" type="button">Másolás</button><button id="diagnosticsExport" type="button">JSON letöltése</button><button id="diagnosticsClear" type="button">Törlés</button><button id="diagnosticsClose" type="button" aria-label="Bezárás">×</button></div></header><p class="diagnostics-export-notice">A letöltés csak redaktált hibakódot, üzenetet és technikai útvonalat tartalmaz; tokeneket, teljes URL-paramétereket vagy nyers stack trace-t nem.</p><p id="diagnosticsCopyStatus" class="diagnostics-copy-status" role="status" aria-live="polite"></p><div id="diagnosticsList" class="diagnostics-list"></div></aside>';
  document.body.append(...root.children);
  document.querySelector('#diagnosticsBadge').onclick=open;
  document.querySelector('#diagnosticsClose').onclick=close;
  document.querySelector('#diagnosticsClear').onclick=clear;
  document.querySelector('#diagnosticsCopy').onclick=copy;
  document.querySelector('#diagnosticsExport').onclick=download;
  const early=window.__sanciEditorEarlyErrors||[];
  delete window.__sanciEditorEarlyErrors;
  for(const item of early)add(item);
  window.addEventListener('error',event=>{
    if(event.target instanceof HTMLScriptElement)return;
    add({source:'runtime',message:event.message||'Ismeretlen JavaScript hiba',file:event.filename,line:event.lineno,column:event.colno,error:event.error});
  });
  window.addEventListener('unhandledrejection',event=>{
    const reason=readField(event,'reason');
    add({source:'runtime',message:'Nem kezelt Promise hiba: '+safeErrorMessage(reason),error:reason});
  });
  render();
}
export const diagnostics=Object.freeze({init,add,clear,verify,open,close,exportPayload,download,subscribe(listener){listeners.add(listener);return()=>listeners.delete(listener)},get entries(){return entries.slice()}});
