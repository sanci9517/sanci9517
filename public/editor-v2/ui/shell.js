import {createEventBus} from './events.js';
import {panelRegistry,featureRegistry} from './registry.js';

const bus=createEventBus();
const workspace=document.querySelector('.workspace');
const root=document.documentElement;
const panels={left:document.querySelector('#leftDock'),right:document.querySelector('#rightDock')};
const resizeLimits={left:{min:250,max:460},right:{min:260,max:440}};
const STORAGE_KEY='sanci-editor-shell-v2';
const defaults={leftOpen:false,rightOpen:false,leftTab:'pages',leftWidth:310,rightWidth:352};
const mobileQuery=window.matchMedia('(max-width: 1024px)');
let focusBeforeMobilePanel=null;

function readPersisted(){
  try{
    const raw=localStorage.getItem(STORAGE_KEY);
    if(!raw)return {...defaults};
    const value=JSON.parse(raw);
    return {...defaults,...value};
  }catch{return {...defaults}}
}

let persisted=readPersisted();
const LEFT_TABS=['pages','elements','layers','schedule','navigation'];
if(!LEFT_TABS.includes(persisted.leftTab))persisted.leftTab='pages';
function persist(){
  try{localStorage.setItem(STORAGE_KEY,JSON.stringify(persisted))}catch{}
}
function emit(type,payload={}){bus.emit(type,payload)}
function syncMobileBackdrop(){
  const mobile=mobileQuery.matches;
  const leftOpen=!panels.left?.classList.contains('closed');
  const rightOpen=!panels.right?.classList.contains('closed');
  const open=mobile && (leftOpen||rightOpen);
  const backdrop=document.querySelector('#mobileBackdrop');
  backdrop?.setAttribute('aria-hidden',String(!open));
  // Keep the hidden mobile drawer and background canvas out of keyboard
  // navigation. On desktop, the collapsed left rail remains interactive.
  if(panels.left) {
    panels.left.inert=mobile&&!leftOpen;
    panels.left.setAttribute('aria-hidden',String(mobile&&!leftOpen));
  }
  if(panels.right) {
    panels.right.inert=!rightOpen;
    panels.right.setAttribute('aria-hidden',String(!rightOpen));
  }
  const canvasArea=document.querySelector('.canvas-area');
  if(canvasArea)canvasArea.inert=open;
  document.querySelector('#editorMenu')?.setAttribute('aria-expanded',String(leftOpen));
  document.querySelector('#openInspector')?.setAttribute('aria-expanded',String(rightOpen));
}
function setPanel(side,open,{save=true,restoreFocus=true}={}){
  const panel=panels[side];if(!panel)return;
  const wasOpen=!panel.classList.contains('closed');
  if(open && mobileQuery.matches){
    const other=side==='left'?'right':'left';
    if(!panels[other]?.classList.contains('closed'))setPanel(other,false,{save:false,restoreFocus:false});
    if(!wasOpen && document.activeElement instanceof HTMLElement &&
        !panel.contains(document.activeElement))focusBeforeMobilePanel=document.activeElement;
  }
  const wasFocused=panel.contains(document.activeElement);
  panel.classList.toggle('closed',!open);
  workspace?.classList.toggle(`${side}-closed`,!open);
  workspace?.classList.toggle(`${side}-open`,open);
  if(side==='right')panel.style.display=open?'flex':'none';
  if(save){persisted[side==='left'?'leftOpen':'rightOpen']=open;persist()}
  syncMobileBackdrop();
  if(mobileQuery.matches && open && !wasOpen){
    requestAnimationFrame(()=>{
      if(!panel.classList.contains('closed')){
        panel.querySelector('[data-collapse]')?.focus({preventScroll:true});
      }
    });
  }
  if(mobileQuery.matches && !open && wasOpen && restoreFocus && wasFocused &&
     focusBeforeMobilePanel?.isConnected){
    focusBeforeMobilePanel.focus({preventScroll:true});
  }
  emit('panel:change',{side,open});
}
function showLeftTab(tab,{save=true,open=true}={}){
  if(!LEFT_TABS.includes(tab))return;
  if(open)setPanel('left',true,{save:false});
  document.querySelectorAll('.rail-btn').forEach(b=>{const selected=b.dataset.tab===tab;b.classList.toggle('active',selected);b.setAttribute('aria-selected',String(selected));b.tabIndex=selected?0:-1});
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
    if(window.matchMedia('(max-width: 1024px)').matches)return;
    const side=handle.dataset.resize;
    const current=parseFloat(getComputedStyle(root).getPropertyValue(side==='left'?'--left-dock-width':'--right-dock-width'))||(side==='left'?310:300);
    handle.setPointerCapture?.(event.pointerId);
    resizeDock(side,event.clientX,current);
    event.preventDefault();
  }));
}

root.style.setProperty('--left-dock-width',`${clamp(Number(persisted.leftWidth),resizeLimits.left)}px`);
root.style.setProperty('--right-dock-width',`${clamp(Number(persisted.rightWidth),resizeLimits.right)}px`);
// A previous desktop session must not cover the mobile canvas on entry.
setPanel('left',!mobileQuery.matches && Boolean(persisted.leftOpen),{save:false});
setPanel('right',!mobileQuery.matches && Boolean(persisted.rightOpen),{save:false});
showLeftTab(persisted.leftTab,{save:false,open:false});

document.querySelector('#editorMenu')?.addEventListener('click',()=>{
  if(panels.left?.classList.contains('closed'))showLeftTab(persisted.leftTab||'pages');
  else setPanel('left',false);
});
document.querySelectorAll('[data-collapse]').forEach(b=>b.addEventListener('click',()=>{
  const side=b.dataset.collapse;
  setPanel(side,panels[side]?.classList.contains('closed')??true);
}));
document.querySelector('#openInspector')?.addEventListener('click',()=>setPanel('right',panels.right?.classList.contains('closed')??true));
document.querySelector('.more-actions')?.addEventListener('toggle',event=>{
  if(event.target.open && window.matchMedia('(max-width: 1024px)').matches){
    setPanel('left',false);setPanel('right',false);
  }
});
document.querySelector('#mobileBackdrop')?.addEventListener('click',()=>{setPanel('left',false);setPanel('right',false)});
window.addEventListener('resize',syncMobileBackdrop);
window.addEventListener('keydown',event=>{if(event.key==='Escape'){setPanel('left',false);setPanel('right',false)}});

function wireMobileActions(){
  const click=(id,target)=>document.querySelector(id)?.addEventListener('click',()=>document.querySelector(target)?.click());
  click('#mobileUndo','#undo'); click('#mobileRedo','#redo');
  click('#mobileFit','#fitCanvas'); click('#mobileZoomOut','#zoomOut'); click('#mobileZoomIn','#zoomIn');
  click('#mobilePreview','#preview');
  // app.js already owns #mobilePublish and #mobileUnpublish. Forwarding
  // #mobilePublish to #publish caused two asynchronous publish requests.
}
wireMobileActions();
document.querySelectorAll('.rail-btn').forEach(b=>{
  b.addEventListener('click',()=>showLeftTab(b.dataset.tab));
  b.addEventListener('keydown',event=>{
    const index=LEFT_TABS.indexOf(b.dataset.tab);if(index<0)return;
    const rtl=getComputedStyle(b.parentElement).direction==='rtl';
    let next=-1;
    if(event.key==='ArrowRight')next=(index+(rtl?-1:1)+LEFT_TABS.length)%LEFT_TABS.length;
    else if(event.key==='ArrowLeft')next=(index+(rtl?1:-1)+LEFT_TABS.length)%LEFT_TABS.length;
    else if(event.key==='Home')next=0;
    else if(event.key==='End')next=LEFT_TABS.length-1;
    if(next<0)return;
    event.preventDefault();const target=document.querySelector(`.rail-btn[data-tab="${LEFT_TABS[next]}"]`);showLeftTab(LEFT_TABS[next]);requestAnimationFrame(()=>target?.focus());
  });
});
setupResizers();
window.sanciEditor={version:9,bus,panels:panelRegistry,features:featureRegistry,on:bus.on,emit,openPanel:s=>setPanel(s,true),closePanel:s=>setPanel(s,false),showLeftTab,resizeDock};
featureRegistry.register('shell-runtime',{version:9,persistence:'localStorage',mobileShell:'bottom-sheet'});
syncMobileBackdrop();
emit('shell:ready',{version:8});
