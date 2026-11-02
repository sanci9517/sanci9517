import {createEventBus} from './events.js';
import {panelRegistry,featureRegistry} from './registry.js';
import {EDITOR_ACTIONS} from './action-catalog.js?v=20261102-workspace-profiles-v2';
import {enhanceEditorActionControls} from './action-help.js?v=20261102-workspace-profiles-v2';
import {applyWorkspacePreferences,mountWorkspaceAppearance,readWorkspacePreferences} from './workspace-appearance.js?v=20261102-workspace-profiles-v2';

const bus=createEventBus();
const workspace=document.querySelector('.workspace');
const root=document.documentElement;
const editorRoot=document.querySelector('.editor-app');
const panels={left:document.querySelector('#leftDock'),right:document.querySelector('#rightDock')};
const actionControls=enhanceEditorActionControls(document);
const resizeLimits={left:{min:250,max:460},right:{min:260,max:440}};
const STORAGE_KEY='sanci-editor-shell-v2';
const defaults={leftOpen:false,rightOpen:false,leftTab:'pages',leftWidth:310,rightWidth:352};
const mobileQuery=window.matchMedia('(max-width: 1024px)');
const initialAppearance=readWorkspacePreferences();
applyWorkspacePreferences(editorRoot,initialAppearance);
let focusBeforeMobilePanel=null;
let workspaceAppearance=null;

function readPersisted(){
  try{
    const raw=localStorage.getItem(STORAGE_KEY);
    if(!raw)return {...defaults};
    const value=JSON.parse(raw);
    return {...defaults,...value};
  }catch{return {...defaults}}
}

let persisted=readPersisted();
if(initialAppearance.layout!=='custom'){
  const initialLayout=resolveWorkspaceLayout(initialAppearance.layout,mobileQuery.matches);
  persisted.leftOpen=initialLayout.left;
  persisted.rightOpen=initialLayout.right;
}
const LEFT_TABS=['pages','elements','layers','schedule','navigation'];
if(!LEFT_TABS.includes(persisted.leftTab))persisted.leftTab='pages';
function persist(){
  try{localStorage.setItem(STORAGE_KEY,JSON.stringify(persisted))}catch{}
}
function resolveWorkspaceLayout(layout,mobile){
  if(layout==='canvas')return {left:false,right:false};
  if(layout==='inspector')return {left:false,right:true};
  return mobile?{left:false,right:false}:{left:true,right:true};
}
function applyWorkspaceLayout(layout){
  if(layout==='custom')return;
  const next=resolveWorkspaceLayout(layout,mobileQuery.matches);
  setPanel('left',next.left,{save:true});
  setPanel('right',next.right,{save:true});
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
  const leftToggle=document.querySelector('#editorMenu');
  leftToggle?.setAttribute('aria-expanded',String(leftOpen));
  if(leftToggle)actionControls.setAction(leftToggle,leftOpen?'closeLeftPanel':'openLeftPanel');
  const rightToggle=document.querySelector('#openInspector');
  rightToggle?.setAttribute('aria-expanded',String(rightOpen));
  if(rightToggle)actionControls.setAction(rightToggle,rightOpen?'closeRightPanel':'openRightPanel');
  const selectedTab=document.querySelector('.rail-btn[aria-selected="true"]')?.dataset.tab;
  const selectedPanel=selectedTab&&document.querySelector(`.dock-content[data-content="${selectedTab}"]`);
  const subtitle=selectedPanel?.querySelector('.panel-subtitle');
  if(subtitle){
    if(!subtitle.dataset.defaultDescription)subtitle.dataset.defaultDescription=subtitle.textContent.trim();
    subtitle.textContent=mobile?(EDITOR_ACTIONS[selectedTab]?.description||subtitle.dataset.defaultDescription):subtitle.dataset.defaultDescription;
  }
}
function setPanel(side,open,{save=true,restoreFocus=true,customize=false}={}){
  const panel=panels[side];if(!panel)return;
  const wasOpen=!panel.classList.contains('closed');
  if(customize&&wasOpen!==open)workspaceAppearance?.remember();
  if(open && mobileQuery.matches){
    const other=side==='left'?'right':'left';
    if(!panels[other]?.classList.contains('closed'))setPanel(other,false,{save,restoreFocus:false});
    if(!wasOpen && document.activeElement instanceof HTMLElement &&
        !panel.contains(document.activeElement))focusBeforeMobilePanel=document.activeElement;
  }
  const wasFocused=panel.contains(document.activeElement);
  panel.classList.toggle('closed',!open);
  workspace?.classList.toggle(`${side}-closed`,!open);
  workspace?.classList.toggle(`${side}-open`,open);
  if(side==='right')panel.style.display=open?'flex':'none';
  if(save){persisted[side==='left'?'leftOpen':'rightOpen']=open;persist()}
  if(customize)workspaceAppearance?.setLayout('custom',{rememberChange:false});
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
function showLeftTab(tab,{save=true,open=true,customize=false}={}){
  if(!LEFT_TABS.includes(tab))return;
  const opensLeft=open&&panels.left?.classList.contains('closed');
  const changesTab=persisted.leftTab!==tab;
  if(customize&&(opensLeft||changesTab))workspaceAppearance?.remember();
  if(open)setPanel('left',true,{save:false,customize:false});
  document.querySelectorAll('.rail-btn').forEach(b=>{const selected=b.dataset.tab===tab;b.classList.toggle('active',selected);b.setAttribute('aria-selected',String(selected));b.tabIndex=selected?0:-1});
  document.querySelectorAll('[data-content]').forEach(x=>x.classList.toggle('hidden',x.dataset.content!==tab));
  syncMobileBackdrop();
  if(save){persisted.leftTab=tab;persist()}
  if(customize&&(opensLeft||changesTab))workspaceAppearance?.setLayout('custom',{rememberChange:false});
  emit('panel:tab',{tab});
}
function clamp(value,limits){return Math.max(limits.min,Math.min(limits.max,value))}
function resizeDock(side,startX,startWidth){
  workspaceAppearance?.remember();
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
    workspaceAppearance?.setLayout('custom',{rememberChange:false});
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
function setupDockReordering(){
  if(!workspace)return;
  const canvasArea=document.querySelector('.canvas-area');
  const regions={left:panels.left,canvas:canvasArea,right:panels.right};
  for(const [id,region] of Object.entries(regions))if(region)region.dataset.workspaceDockId=id;
  const refreshHandles=()=>workspace.querySelectorAll('.dock-heading,.canvas-toolbar').forEach(handle=>handle.setAttribute('draggable',String(!mobileQuery.matches)));
  refreshHandles();
  mobileQuery.addEventListener('change',refreshHandles);
  workspace.addEventListener('dragstart',event=>{
    if(mobileQuery.matches)return;
    const handle=event.target.closest?.('.dock-heading,.canvas-toolbar');
    if(!handle||event.target.closest?.('button,input,select,a')){event.preventDefault();return}
    const source=handle.closest('.left-dock,.right-dock,.canvas-area');
    if(!source||!event.dataTransfer)return;
    event.dataTransfer.setData('text/plain',`sanci-workspace:${source.dataset.workspaceDockId}`);
    event.dataTransfer.effectAllowed='move';
    document.body.classList.add('workspace-reordering');
  });
  workspace.addEventListener('dragover',event=>{
    const transfer=event.dataTransfer;
    if(mobileQuery.matches||!transfer||!Array.from(transfer.types).includes('text/plain'))return;
    event.preventDefault();if(event.dataTransfer)event.dataTransfer.dropEffect='move';
  });
  workspace.addEventListener('drop',event=>{
    document.body.classList.remove('workspace-reordering');
    if(mobileQuery.matches||!event.dataTransfer)return;
    const sourceId=event.dataTransfer.getData('text/plain').replace(/^sanci-workspace:/u,'');
    const source=regions[sourceId];
    const target=event.target.closest?.('.left-dock,.right-dock,.canvas-area');
    const targetId=target?.dataset.workspaceDockId;
    if(!source||!target||!targetId||source===target||!workspace.contains(target))return;
    const order=Object.values(regions).filter(Boolean).sort((a,b)=>a.getBoundingClientRect().left-b.getBoundingClientRect().left);
    const sourceIndex=order.indexOf(source),targetIndex=order.indexOf(target);
    if(sourceIndex<0||targetIndex<0)return;
    order.splice(sourceIndex,1);
    const rect=target.getBoundingClientRect();
    const before=event.clientX<rect.left+rect.width/2;
    const adjustedTarget=order.indexOf(target);
    order.splice(adjustedTarget+(before?0:1),0,source);
    const value=order.map(item=>item.dataset.workspaceDockId).join('-');
    workspaceAppearance?.setDockOrder(value);
  });
  workspace.addEventListener('dragend',()=>document.body.classList.remove('workspace-reordering'));
}

root.style.setProperty('--left-dock-width',`${clamp(Number(persisted.leftWidth),resizeLimits.left)}px`);
root.style.setProperty('--right-dock-width',`${clamp(Number(persisted.rightWidth),resizeLimits.right)}px`);
// A previous desktop session must not cover the mobile canvas on entry.
setPanel('left',!mobileQuery.matches && Boolean(persisted.leftOpen),{save:false});
setPanel('right',!mobileQuery.matches && Boolean(persisted.rightOpen),{save:false});
showLeftTab(persisted.leftTab,{save:false,open:false});
workspaceAppearance=mountWorkspaceAppearance({documentRef:document,root:editorRoot,onLayoutChange:applyWorkspaceLayout,readDockState:()=>persisted,applyDockState:state=>{
  persisted={...persisted,...state};
  root.style.setProperty('--left-dock-width',`${state.leftWidth}px`);
  root.style.setProperty('--right-dock-width',`${state.rightWidth}px`);
  setPanel('left',state.leftOpen,{save:true,customize:false});
  setPanel('right',state.rightOpen,{save:true,customize:false});
  showLeftTab(state.leftTab,{save:true,open:false});
  persist();
},onReset:()=>{
  persisted={...defaults};
  root.style.setProperty('--left-dock-width',`${defaults.leftWidth}px`);
  root.style.setProperty('--right-dock-width',`${defaults.rightWidth}px`);
  persist();
}});
setupDockReordering();

document.querySelector('#editorMenu')?.addEventListener('click',()=>{
  if(panels.left?.classList.contains('closed'))showLeftTab(persisted.leftTab||'pages',{customize:true});
  else setPanel('left',false,{customize:true});
});
document.querySelectorAll('[data-collapse]').forEach(b=>b.addEventListener('click',()=>{
  const side=b.dataset.collapse;
  setPanel(side,panels[side]?.classList.contains('closed')??true,{customize:true});
}));
document.querySelector('#openInspector')?.addEventListener('click',()=>setPanel('right',panels.right?.classList.contains('closed')??true,{customize:true}));
document.querySelector('.more-actions')?.addEventListener('toggle',event=>{
  if(event.target.open && window.matchMedia('(max-width: 1024px)').matches){
    setPanel('left',false);setPanel('right',false);
  }
});
document.querySelector('#mobileBackdrop')?.addEventListener('click',()=>{setPanel('left',false,{customize:true});setPanel('right',false,{customize:true})});
window.addEventListener('resize',syncMobileBackdrop);
window.addEventListener('keydown',event=>{
  if(event.key!=='Escape')return;
  if(document.querySelector('#workspaceAppearanceDialog')?.open)return;
  const menu=document.querySelector('.more-actions');
  if(menu?.open){menu.removeAttribute('open');menu.querySelector('summary')?.focus({preventScroll:true});return}
  setPanel('left',false,{customize:true});setPanel('right',false,{customize:true});
});

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
  b.addEventListener('click',()=>showLeftTab(b.dataset.tab,{customize:true}));
  b.addEventListener('keydown',event=>{
    const index=LEFT_TABS.indexOf(b.dataset.tab);if(index<0)return;
    const rtl=getComputedStyle(b.parentElement).direction==='rtl';
    let next=-1;
    if(event.key==='ArrowRight')next=(index+(rtl?-1:1)+LEFT_TABS.length)%LEFT_TABS.length;
    else if(event.key==='ArrowLeft')next=(index+(rtl?1:-1)+LEFT_TABS.length)%LEFT_TABS.length;
    else if(event.key==='Home')next=0;
    else if(event.key==='End')next=LEFT_TABS.length-1;
    if(next<0)return;
    event.preventDefault();const target=document.querySelector(`.rail-btn[data-tab="${LEFT_TABS[next]}"]`);showLeftTab(LEFT_TABS[next],{customize:true});requestAnimationFrame(()=>target?.focus());
  });
});
setupResizers();
window.sanciEditor={version:9,bus,panels:panelRegistry,features:featureRegistry,on:bus.on,emit,openPanel:s=>setPanel(s,true),closePanel:s=>setPanel(s,false),showLeftTab,resizeDock};
featureRegistry.register('shell-runtime',{version:9,persistence:'localStorage',mobileShell:'bottom-sheet'});
syncMobileBackdrop();
emit('shell:ready',{version:8});
