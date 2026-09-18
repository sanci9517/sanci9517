import {createEventBus} from './events.js';
import {panelRegistry,featureRegistry} from './registry.js';

const bus=createEventBus();
const workspace=document.querySelector('.workspace');
const root=document.documentElement;
const panels={left:document.querySelector('#leftDock'),right:document.querySelector('#rightDock')};
const resizeLimits={left:{min:250,max:460},right:{min:260,max:440}};
const STORAGE_KEY='sanci-editor-shell-v2';
const defaults={leftOpen:false,rightOpen:false,leftTab:'pages',leftWidth:310,rightWidth:300};

function readPersisted(){
  try{
    const raw=localStorage.getItem(STORAGE_KEY);
    if(!raw)return {...defaults};
    const value=JSON.parse(raw);
    return {...defaults,...value};
  }catch{return {...defaults}}
}

let persisted=readPersisted();
function persist(){
  try{localStorage.setItem(STORAGE_KEY,JSON.stringify(persisted))}catch{}
}
function emit(type,payload={}){bus.emit(type,payload)}
function syncMobileBackdrop(){
  const backdrop=document.querySelector('#mobileBackdrop');
  if(!backdrop)return;
  const mobile=window.matchMedia('(max-width: 850px)').matches;
  const open=mobile && (!panels.left?.classList.contains('closed') || !panels.right?.classList.contains('closed'));
  backdrop.setAttribute('aria-hidden',String(!open));
}
function setPanel(side,open,{save=true}={}){
  const panel=panels[side];if(!panel)return;
  panel.classList.toggle('closed',!open);
  workspace?.classList.toggle(`${side}-closed`,!open);
  workspace?.classList.toggle(`${side}-open`,open);
  if(side==='right')panel.style.display=open?'block':'none';
  if(save){persisted[side==='left'?'leftOpen':'rightOpen']=open;persist()}
  syncMobileBackdrop();
  emit('panel:change',{side,open});
}
function showLeftTab(tab,{save=true}={}){
  setPanel('left',true,{save:false});
  document.querySelectorAll('.rail-btn').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));
  document.querySelectorAll('[data-content]').forEach(x=>x.classList.toggle('hidden',x.dataset.content!==tab));
  if(save){persisted.leftTab=tab;persist()}
  emit('panel:tab',{tab});
}
function clamp(value,limits){return Math.max(limits.min,Math.min(limits.max,value))}
function resizeDock(side,startX,startWidth){
  const limits=resizeLimits[side];
  const onMove=event=>{
    const delta=side==='left'?event.clientX-startX:startX-event.clientX;
    const width=clamp(startWidth+delta,limits);
    root.style.setProperty(side==='left'?'--left-dock-width':'--right-dock-width',`${width}px`);
    persisted[side==='left'?'leftWidth':'rightWidth']=width;
    emit('panel:resize',{side,width});
  };
  const onUp=()=>{
    persist();
    document.body.classList.remove('resizing-dock');
    window.removeEventListener('pointermove',onMove);
    window.removeEventListener('pointerup',onUp);
  };
  document.body.classList.add('resizing-dock');
  window.addEventListener('pointermove',onMove);
  window.addEventListener('pointerup',onUp,{once:true});
}
function setupResizers(){
  document.querySelectorAll('.dock-resizer').forEach(handle=>handle.addEventListener('pointerdown',event=>{
    if(window.matchMedia('(max-width: 850px)').matches)return;
    const side=handle.dataset.resize;
    const current=parseFloat(getComputedStyle(root).getPropertyValue(side==='left'?'--left-dock-width':'--right-dock-width'))||(side==='left'?310:300);
    handle.setPointerCapture?.(event.pointerId);
    resizeDock(side,event.clientX,current);
    event.preventDefault();
  }));
}

root.style.setProperty('--left-dock-width',`${clamp(Number(persisted.leftWidth),resizeLimits.left)}px`);
root.style.setProperty('--right-dock-width',`${clamp(Number(persisted.rightWidth),resizeLimits.right)}px`);
setPanel('left',Boolean(persisted.leftOpen),{save:false});
setPanel('right',Boolean(persisted.rightOpen),{save:false});
showLeftTab(persisted.leftTab,{save:false});
if(!persisted.leftOpen)setPanel('left',false,{save:false});

document.querySelector('#editorMenu')?.addEventListener('click',()=>{
  if(panels.left?.classList.contains('closed'))showLeftTab(persisted.leftTab||'pages');
  else setPanel('left',false);
});
document.querySelectorAll('[data-collapse]').forEach(b=>b.addEventListener('click',()=>{
  const side=b.dataset.collapse;
  setPanel(side,panels[side]?.classList.contains('closed')??true);
}));
document.querySelector('#openInspector')?.addEventListener('click',()=>setPanel('right',true));
document.querySelector('#mobileBackdrop')?.addEventListener('click',()=>{setPanel('left',false);setPanel('right',false)});
window.addEventListener('resize',syncMobileBackdrop);
window.addEventListener('keydown',event=>{if(event.key==='Escape'){setPanel('left',false);setPanel('right',false)}});

function wireMobileActions(){
  const click=(id,target)=>document.querySelector(id)?.addEventListener('click',()=>document.querySelector(target)?.click());
  click('#mobileFit','#fitCanvas'); click('#mobileZoomOut','#zoomOut'); click('#mobileZoomIn','#zoomIn');
  click('#mobilePreview','#preview'); click('#mobilePublish','#publish');
}
wireMobileActions();
document.querySelectorAll('.rail-btn').forEach(b=>b.addEventListener('click',()=>showLeftTab(b.dataset.tab)));
setupResizers();
window.sanciEditor={version:8,bus,panels:panelRegistry,features:featureRegistry,on:bus.on,emit,openPanel:s=>setPanel(s,true),closePanel:s=>setPanel(s,false),showLeftTab,resizeDock};
featureRegistry.register('shell-runtime',{version:8,persistence:'localStorage',mobileShell:'dedicated'});
syncMobileBackdrop();
emit('shell:ready',{version:8});
