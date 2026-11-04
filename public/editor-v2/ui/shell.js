import {createEventBus} from './events.js';
import {panelRegistry,featureRegistry} from './registry.js';
import {EDITOR_ACTIONS} from './action-catalog.js?v=20261103-canvas-focus-mode';
import {enhanceEditorActionControls} from './action-help.js?v=20261103-canvas-focus-mode';
import {DEFAULT_LEFT_TAB_ORDER,applyWorkspacePreferences,mountWorkspaceAppearance,normalizeLeftTabOrder,readWorkspacePreferences} from './workspace-appearance.js?v=20261104-cross-tab-reset-announcement';

const bus=createEventBus();
const workspace=document.querySelector('.workspace');
const root=document.documentElement;
const editorRoot=document.querySelector('.editor-app');
const panels={left:document.querySelector('#leftDock'),right:document.querySelector('#rightDock')};
const actionControls=enhanceEditorActionControls(document);
const LEFT_TABS=['pages','elements','layers','schedule','navigation'];
const resizeLimits={left:{min:250,max:460},right:{min:260,max:440}};
const STORAGE_KEY='sanci-editor-shell-v2';
const defaults={leftOpen:false,rightOpen:false,leftTab:'pages',leftTabOrder:DEFAULT_LEFT_TAB_ORDER,inspectorTab:'design',panelActive:'left',leftWidth:310,rightWidth:352};
const mobileQuery=window.matchMedia('(max-width: 1024px)');
const initialAppearance=readWorkspacePreferences();
applyWorkspacePreferences(editorRoot,initialAppearance);
let focusBeforeMobilePanel=null;
let workspaceAppearance=null;
let cancelWorkspaceDrag=()=>{};
let canvasFocus=false;
let desktopDockSnapshot=null;

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
const INSPECTOR_TABS=['design','content','advanced'];
if(!LEFT_TABS.includes(persisted.leftTab))persisted.leftTab='pages';
persisted.leftTabOrder=normalizeLeftTabOrder(persisted.leftTabOrder);
if(!INSPECTOR_TABS.includes(persisted.inspectorTab))persisted.inspectorTab='design';
if(!['left','right'].includes(persisted.panelActive))persisted.panelActive=persisted.rightOpen?'right':'left';
function renderLeftTabOrder(){
  const rail=document.querySelector('.tool-rail');
  if(!rail)return;
  for(const [index,tab] of persisted.leftTabOrder.entries()){
    const button=rail.querySelector(`.rail-btn[data-tab="${tab}"]`);
    if(button){button.setAttribute('aria-posinset',String(index+1));button.setAttribute('aria-setsize',String(persisted.leftTabOrder.length));rail.append(button)}
  }
}
renderLeftTabOrder();
function persist(){
  try{localStorage.setItem(STORAGE_KEY,JSON.stringify(persisted))}catch{}
}
function resolveWorkspaceLayout(layout,mobile){
  if(layout==='canvas')return {left:false,right:false};
  if(layout==='inspector')return {left:false,right:true};
  return mobile?{left:false,right:false}:{left:true,right:true};
}
function applyWorkspaceLayout(layout,{save=true}={}){
  if(layout==='custom'){syncMobileBackdrop();return}
  const next=resolveWorkspaceLayout(layout,mobileQuery.matches);
  setPanel('left',next.left,{save});
  setPanel('right',next.right,{save});
  syncMobileBackdrop();
}
function emit(type,payload={}){bus.emit(type,payload)}
function syncPanelGroup(){
  if(workspace)workspace.dataset.workspaceActivePanel=persisted.panelActive;
  const groupTabs=document.querySelector('.workspace-panel-group-tabs');
  const grouped=editorRoot?.dataset.workspacePanelMode==='tabbed'&&!mobileQuery.matches;
  if(groupTabs)groupTabs.hidden=!grouped||(!persisted.leftOpen&&!persisted.rightOpen);
  for(const [side,panel] of Object.entries(panels)){
    if(grouped){panel?.setAttribute('role','tabpanel');panel?.setAttribute('aria-labelledby',side==='left'?'workspacePanelTabLeft':'workspacePanelTabRight')}
    else{panel?.removeAttribute('role');panel?.removeAttribute('aria-labelledby')}
  }
  document.querySelectorAll('[data-workspace-panel-tab]').forEach(button=>{
    const selected=button.dataset.workspacePanelTab===persisted.panelActive;
    button.setAttribute('aria-selected',String(selected));button.tabIndex=selected?0:-1;
  });
}
function syncMobileBackdrop(){
  const mobile=mobileQuery.matches;
  const leftOpen=!panels.left?.classList.contains('closed');
  const rightOpen=!panels.right?.classList.contains('closed');
  const open=mobile && !canvasFocus && (leftOpen||rightOpen);
  const backdrop=document.querySelector('#mobileBackdrop');
  backdrop?.setAttribute('aria-hidden',String(!open));
  // Keep the hidden mobile drawer and background canvas out of keyboard
  // navigation. On desktop, the collapsed left rail remains interactive.
  if(panels.left&&panels.right&&editorRoot?.dataset.workspacePanelMode==='tabbed'&&!mobile){
    if(persisted.panelActive==='left'&&panels.left.classList.contains('closed')&&!panels.right.classList.contains('closed'))persisted.panelActive='right';
    if(persisted.panelActive==='right'&&panels.right.classList.contains('closed')&&!panels.left.classList.contains('closed'))persisted.panelActive='left';
  }
  if(panels.right) {
    const inactiveGroup=editorRoot?.dataset.workspacePanelMode==='tabbed'&&!mobile&&persisted.panelActive!=='right';
    panels.right.inert=canvasFocus||!rightOpen||inactiveGroup;
    panels.right.setAttribute('aria-hidden',String(canvasFocus||!rightOpen||inactiveGroup));
  }
  if(panels.left) {
    const inactiveGroup=editorRoot?.dataset.workspacePanelMode==='tabbed'&&!mobile&&persisted.panelActive!=='left';
    panels.left.inert=canvasFocus||(mobile&&!leftOpen)||inactiveGroup;
    panels.left.setAttribute('aria-hidden',String(canvasFocus||(mobile&&!leftOpen)||inactiveGroup));
  }
  syncPanelGroup();
  const canvasArea=document.querySelector('.canvas-area');
  if(canvasArea)canvasArea.inert=open;
  const leftToggle=document.querySelector('#editorMenu');
  leftToggle?.setAttribute('aria-expanded',String(leftOpen&&!canvasFocus));
  if(leftToggle)actionControls.setAction(leftToggle,leftOpen&&!canvasFocus?'closeLeftPanel':'openLeftPanel');
  const rightToggle=document.querySelector('#openInspector');
  rightToggle?.setAttribute('aria-expanded',String(rightOpen&&!canvasFocus));
  if(rightToggle)actionControls.setAction(rightToggle,rightOpen&&!canvasFocus?'closeRightPanel':'openRightPanel');
  const selectedTab=document.querySelector('.rail-btn[aria-selected="true"]')?.dataset.tab;
  const selectedPanel=selectedTab&&document.querySelector(`.dock-content[data-content="${selectedTab}"]`);
  const subtitle=selectedPanel?.querySelector('.panel-subtitle');
  if(subtitle){
    if(!subtitle.dataset.defaultDescription)subtitle.dataset.defaultDescription=subtitle.textContent.trim();
    subtitle.textContent=mobile?(EDITOR_ACTIONS[selectedTab]?.description||subtitle.dataset.defaultDescription):subtitle.dataset.defaultDescription;
  }
}
function setCanvasFocus(open){
  const next=Boolean(open);
  if(!workspace||next===canvasFocus)return false;
  canvasFocus=next;
  workspace.classList.toggle('canvas-focus',canvasFocus);
  syncMobileBackdrop();
  document.querySelectorAll('[data-editor-action="focusCanvas"],[data-editor-action="restoreCanvasFocus"]').forEach(button=>{
    button.setAttribute('aria-pressed',String(canvasFocus));
    actionControls.setAction(button,canvasFocus?'restoreCanvasFocus':'focusCanvas');
  });
  return true;
}
function setPanel(side,open,{save=true,restoreFocus=true,customize=false}={}){
  const panel=panels[side];if(!panel)return;
  if(save&&mobileQuery.matches)desktopDockSnapshot=null;
  const wasOpen=!panel.classList.contains('closed');
  if(customize&&wasOpen!==open)workspaceAppearance?.remember();
  if(open && mobileQuery.matches){
    const other=side==='left'?'right':'left';
    if(!panels[other]?.classList.contains('closed'))setPanel(other,false,{save,restoreFocus:false});
    if(!wasOpen && document.activeElement instanceof HTMLElement &&
        !panel.contains(document.activeElement))focusBeforeMobilePanel=document.activeElement;
  }
  if(open&&save)persisted.panelActive=side;
  const wasFocused=panel.contains(document.activeElement);
  panel.classList.toggle('closed',!open);
  workspace?.classList.toggle(`${side}-closed`,!open);
  workspace?.classList.toggle(`${side}-open`,open);
  if(side==='right')panel.style.display=open?'flex':'none';
  if(save){persisted[side==='left'?'leftOpen':'rightOpen']=open;
    if(!open&&persisted.panelActive===side&&!(panels[side==='left'?'right':'left']?.classList.contains('closed'))){persisted.panelActive=side==='left'?'right':'left'}
    persist()}
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
function setInspectorTab(tab,{save=true,notify=true}={}){
  if(!INSPECTOR_TABS.includes(tab))return false;
  persisted.inspectorTab=tab;
  if(save)persist();
  if(notify)emit('panel:inspector-tab',{tab});
  return true;
}
function moveLeftTab(tab,direction){
  const order=normalizeLeftTabOrder(persisted.leftTabOrder),index=order.indexOf(tab),target=index+direction;
  if(index<0||target<0||target>=order.length)return false;
  workspaceAppearance?.remember();
  [order[index],order[target]]=[order[target],order[index]];
  persisted.leftTabOrder=order;
  renderLeftTabOrder();persist();
  workspaceAppearance?.setLayout('custom',{rememberChange:false});
  workspaceAppearance?.syncDockControls();
  emit('panel:tab-order',{order:[...order]});
  return true;
}
function clamp(value,limits){return Math.max(limits.min,Math.min(limits.max,value))}
function updateResizeHandle(side,width){
  const handle=document.querySelector(`.dock-resizer[data-resize="${side}"]`);
  if(!handle)return;
  const limits=resizeLimits[side];
  handle.setAttribute('aria-valuemin',String(limits.min));
  handle.setAttribute('aria-valuemax',String(limits.max));
  handle.setAttribute('aria-valuenow',String(Math.round(width)));
  handle.setAttribute('aria-valuetext',`${Math.round(width)} képpont széles`);
}
function resizeDock(side,startX,startWidth,{pointerId=null,handle=null}={}){
  workspaceAppearance?.remember();
  const limits=resizeLimits[side];
  const onMove=event=>{
    if(pointerId!==null&&event.pointerId!==pointerId)return;
    const delta=side==='left'?event.clientX-startX:startX-event.clientX;
    const width=clamp(startWidth+delta,limits);
    root.style.setProperty(side==='left'?'--left-dock-width':'--right-dock-width',`${width}px`);
    persisted[side==='left'?'leftWidth':'rightWidth']=width;
    updateResizeHandle(side,width);
    emit('panel:resize',{side,width});
  };
  const finish=event=>{
    if(event&&pointerId!==null&&event.pointerId!==pointerId)return;
    persist();
    workspaceAppearance?.setLayout('custom',{rememberChange:false});
    document.body.classList.remove('resizing-dock');
    window.removeEventListener('pointermove',onMove);
    window.removeEventListener('pointerup',finish);
    window.removeEventListener('pointercancel',finish);
    handle?.removeEventListener('lostpointercapture',finish);
    if(pointerId!==null&&handle?.hasPointerCapture?.(pointerId)){
      try{handle.releasePointerCapture(pointerId)}catch{}
    }
  };
  document.body.classList.add('resizing-dock');
  window.addEventListener('pointermove',onMove);
  window.addEventListener('pointerup',finish);
  window.addEventListener('pointercancel',finish);
  handle?.addEventListener('lostpointercapture',finish,{once:true});
}
function setupResizers(){
  document.querySelectorAll('.dock-resizer').forEach(handle=>{
    const side=handle.dataset.resize;
    const limits=resizeLimits[side];
    if(!limits)return;
    handle.setAttribute('role','separator');
    handle.setAttribute('aria-orientation','vertical');
    handle.setAttribute('aria-controls',side==='left'?'leftDock':'rightDock');
    handle.tabIndex=0;
    const currentWidth=()=>clamp(parseFloat(getComputedStyle(root).getPropertyValue(side==='left'?'--left-dock-width':'--right-dock-width'))||limits.min,limits);
    updateResizeHandle(side,currentWidth());
    handle.addEventListener('pointerdown',event=>{
      if(window.matchMedia('(max-width: 1024px)').matches)return;
      const current=currentWidth();
      try{handle.setPointerCapture?.(event.pointerId)}catch{}
      resizeDock(side,event.clientX,current,{pointerId:event.pointerId,handle});
      event.preventDefault();
    });
    handle.addEventListener('keydown',event=>{
      const rtl=getComputedStyle(workspace||root).direction==='rtl';
      const increaseKey=side==='left'?(rtl?'ArrowLeft':'ArrowRight'):(rtl?'ArrowRight':'ArrowLeft');
      const decreaseKey=side==='left'?(rtl?'ArrowRight':'ArrowLeft'):(rtl?'ArrowLeft':'ArrowRight');
      const step=event.shiftKey?48:16;
      const current=currentWidth();
      let next=current;
      if(event.key===increaseKey)next=clamp(current+step,limits);
      else if(event.key===decreaseKey)next=clamp(current-step,limits);
      else if(event.key==='Home')next=limits.min;
      else if(event.key==='End')next=limits.max;
      else return;
      event.preventDefault();
      if(next===current)return;
      workspaceAppearance?.remember();
      root.style.setProperty(side==='left'?'--left-dock-width':'--right-dock-width',`${next}px`);
      persisted[side==='left'?'leftWidth':'rightWidth']=next;
      updateResizeHandle(side,next);
      persist();
      workspaceAppearance?.setLayout('custom',{rememberChange:false});
      emit('panel:resize',{side,width:next,source:'keyboard'});
    });
  });
}
function setupDockReordering(){
  if(!workspace)return;
  const canvasArea=document.querySelector('.canvas-area');
  const regions={left:panels.left,canvas:canvasArea,right:panels.right};
  const names={left:'Oldalak és eszközök',canvas:'Vászon',right:'Beállítások'};
  const liveStatus=document.querySelector('#workspaceDockStatus');
  let dragSourceId=null;
  const announce=message=>{if(liveStatus&&liveStatus.textContent!==message)liveStatus.textContent=message;};
  for(const [id,region] of Object.entries(regions))if(region)region.dataset.workspaceDockId=id;
  const clearDropPreview=()=>workspace.querySelectorAll('[data-dock-drop-position]').forEach(region=>{
    region.removeAttribute('data-dock-drop-position');
    region.removeAttribute('data-dock-drop-label');
  });
  const finishDrag=({announcement}={})=>{
    const wasDragging=Boolean(dragSourceId);
    clearDropPreview();document.body.classList.remove('workspace-reordering');dragSourceId=null;
    if(wasDragging&&announcement)announce(announcement);
  };
  const refreshHandles=()=>workspace.querySelectorAll('.dock-heading,.canvas-toolbar').forEach(handle=>handle.setAttribute('draggable',String(!mobileQuery.matches)));
  const restoreResponsiveDockLayout=()=>{
    finishDrag({announcement:'A képernyőméret változott, ezért az átrendezés megszakadt.'});
    if(mobileQuery.matches){
      if(!desktopDockSnapshot)desktopDockSnapshot={left:!panels.left?.classList.contains('closed'),right:!panels.right?.classList.contains('closed')};
      const focusedSide=Object.entries(panels).find(([,panel])=>panel?.contains(document.activeElement)&&!panel.classList.contains('closed'))?.[0];
      const keep=focusedSide||(desktopDockSnapshot.right?'right':desktopDockSnapshot.left?'left':null);
      setPanel('left',keep==='left',{save:false,restoreFocus:false});
      setPanel('right',keep==='right',{save:false,restoreFocus:false});
    }else{
      const restore=desktopDockSnapshot||{left:Boolean(persisted.leftOpen),right:Boolean(persisted.rightOpen)};
      desktopDockSnapshot=null;
      setPanel('left',restore.left,{save:false,restoreFocus:false});
      setPanel('right',restore.right,{save:false,restoreFocus:false});
    }
    refreshHandles();
  };
  refreshHandles();
  mobileQuery.addEventListener('change',restoreResponsiveDockLayout);
  workspace.addEventListener('dragstart',event=>{
    if(mobileQuery.matches){finishDrag();return}
    const handle=event.target.closest?.('.dock-heading,.canvas-toolbar');
    if(!handle||event.target.closest?.('button,input,select,a')){event.preventDefault();finishDrag();return}
    const source=handle.closest('.left-dock,.right-dock,.canvas-area');
    if(!source||!event.dataTransfer){finishDrag();return}
    dragSourceId=source.dataset.workspaceDockId;
    event.dataTransfer.setData('text/plain',`sanci-workspace:${source.dataset.workspaceDockId}`);
    event.dataTransfer.effectAllowed='move';
    clearDropPreview();
    document.body.classList.add('workspace-reordering');
    announce(`${names[dragSourceId]} panel áthelyezése. Válassz célzónát a másik panelen vagy a vásznon.`);
  });
  workspace.addEventListener('dragover',event=>{
    const transfer=event.dataTransfer;
    if(mobileQuery.matches||!transfer||!Array.from(transfer.types).includes('text/plain')||!dragSourceId){clearDropPreview();return}
    const target=event.target.closest?.('.left-dock,.right-dock,.canvas-area');
    const targetId=target?.dataset.workspaceDockId;
    if(!target||!targetId||targetId===dragSourceId||!workspace.contains(target)){
      clearDropPreview();announce('Nincs kiválasztott célzóna.');return;
    }
    event.preventDefault();transfer.dropEffect='move';
    const rect=target.getBoundingClientRect(),ratio=rect.width?((event.clientX-rect.left)/rect.width):0.5;
    const position=dragSourceId!=='canvas'&&target!==canvasArea&&ratio>=0.35&&ratio<=0.65?'group':ratio<0.5?'before':'after';
    if(target.dataset.dockDropPosition===position)return;
    clearDropPreview();target.dataset.dockDropPosition=position;
    target.dataset.dockDropLabel=position==='group'?'Panelcsoport':position==='before'?'Elé helyezés':'Utána helyezés';
    announce(`Cél: ${target.dataset.dockDropLabel} – ${names[targetId]}.`);
  });
  workspace.addEventListener('drop',event=>{
    if(mobileQuery.matches||!event.dataTransfer){finishDrag({announcement:'Az átrendezés megszakadt.'});return}
    const sourceId=event.dataTransfer.getData('text/plain').replace(/^sanci-workspace:/u,'');
    if(!dragSourceId||sourceId!==dragSourceId){finishDrag({announcement:'Az átrendezés megszakadt.'});return}
    const source=regions[sourceId];
    const target=event.target.closest?.('.left-dock,.right-dock,.canvas-area');
    const targetId=target?.dataset.workspaceDockId;
    if(!source||!target||!targetId||source===target||!workspace.contains(target)){finishDrag({announcement:'Az átrendezés megszakadt.'});return}
    const ungrouping=editorRoot?.dataset.workspacePanelMode==='tabbed'&&sourceId!=='canvas'&&target===canvasArea;
    const visualOrder=Object.values(regions).filter(Boolean).sort((a,b)=>a.getBoundingClientRect().left-b.getBoundingClientRect().left);
    // In a tabbed view the inactive dock is display:none, so its zero-size
    // rect cannot be used to infer the user's saved three-region order.
    const savedOrder=ungrouping?String(editorRoot.dataset.workspaceDockOrder||'').split('-').map(id=>regions[id]):[];
    const order=ungrouping&&savedOrder.length===3&&savedOrder.every(Boolean)?savedOrder:visualOrder;
    const sourceIndex=order.indexOf(source),targetIndex=order.indexOf(target);
    if(sourceIndex<0||targetIndex<0){finishDrag({announcement:'Az átrendezés megszakadt.'});return}
    order.splice(sourceIndex,1);
    const rect=target.getBoundingClientRect(),ratio=rect.width?((event.clientX-rect.left)/rect.width):0.5;
    if(sourceId!=='canvas'&&target!==canvasArea&&ratio>=0.35&&ratio<=0.65){
      const grouped=workspaceAppearance?.setPanelGrouping('tabbed',targetId);
      if(grouped){setPanel(sourceId,true,{save:true,customize:false});announce(`A(z) ${names[sourceId]} panel a(z) ${names[targetId]} panelfülei közé került. A füles csoport a(z) ${targetId==='left'?'bal':'jobb'} oldalon marad, a vászon fedetlen.`)}
      else announce('A panelcsoport nem változott.');
      finishDrag();return;
    }
    const before=ratio<0.5;
    const adjustedTarget=order.indexOf(target);
    order.splice(adjustedTarget+(before?0:1),0,source);
    const value=order.map(item=>item.dataset.workspaceDockId).join('-');
    const changed=ungrouping
      ?workspaceAppearance?.setDockLayout({dockOrder:value,panelMode:'separate'})
      :workspaceAppearance?.setDockOrder(value);
    if(changed){
      const namesInOrder=order.map(item=>names[item.dataset.workspaceDockId]||'Panel').join(', ');
      announce(ungrouping
        ?`A(z) ${names[sourceId]} panel külön dokkolóként a vászon ${before?'elé':'után'} került. A vászon fedetlen. Sorrend: ${namesInOrder}.`
        :`A(z) ${names[sourceId]} panel ${before?'a(z) '+names[targetId]+' elé':'a(z) '+names[targetId]+' után'} került. Sorrend: ${namesInOrder}.`);
    }else{
      announce('A panelek elrendezése nem változott.');
    }
    finishDrag();
  });
  workspace.addEventListener('dragend',()=>finishDrag({announcement:'Az átrendezés megszakadt.'}));
  workspace.addEventListener('keydown',event=>{
    if(event.key!=='Escape'||!dragSourceId)return;
    event.preventDefault();event.stopPropagation();finishDrag({announcement:'Az átrendezés megszakítva.'});
  });
  return finishDrag;
}

root.style.setProperty('--left-dock-width',`${clamp(Number(persisted.leftWidth),resizeLimits.left)}px`);
root.style.setProperty('--right-dock-width',`${clamp(Number(persisted.rightWidth),resizeLimits.right)}px`);
// A previous desktop session must not cover the mobile canvas on entry.
setPanel('left',!mobileQuery.matches && Boolean(persisted.leftOpen),{save:false});
setPanel('right',!mobileQuery.matches && Boolean(persisted.rightOpen),{save:false});
showLeftTab(persisted.leftTab,{save:false,open:false});
workspaceAppearance=mountWorkspaceAppearance({documentRef:document,root:editorRoot,onLayoutChange:applyWorkspaceLayout,onExternalChange:({reset=false}={})=>cancelWorkspaceDrag({announcement:reset?'A másik szerkesztőlapon alaphelyzetbe állították a munkaterületet, ezért az átrendezés megszakadt.':'A másik szerkesztőlapon történt változás miatt az átrendezés megszakadt.'}),readDockState:()=>persisted,moveDockTab:moveLeftTab,applyDockState:state=>{
  applyDockState(state);
},onReset:()=>{
  persisted={...defaults};
  renderLeftTabOrder();
  root.style.setProperty('--left-dock-width',`${defaults.leftWidth}px`);
  root.style.setProperty('--right-dock-width',`${defaults.rightWidth}px`);
  updateResizeHandle('left',defaults.leftWidth);
  updateResizeHandle('right',defaults.rightWidth);
  persist();
  workspaceAppearance?.syncDockControls();
}});
function normalizeStoredDockState(input){
  const value=input&&typeof input==='object'&&!Array.isArray(input)?input:{};
  const width=(candidate,limits,fallback)=>Number.isFinite(Number(candidate))?clamp(Number(candidate),limits):fallback;
  const next={leftOpen:value.leftOpen===true,rightOpen:value.rightOpen===true,leftTab:LEFT_TABS.includes(value.leftTab)?value.leftTab:'pages',leftTabOrder:normalizeLeftTabOrder(value.leftTabOrder),inspectorTab:INSPECTOR_TABS.includes(value.inspectorTab)?value.inspectorTab:'design',panelActive:['left','right'].includes(value.panelActive)?value.panelActive:(value.rightOpen?'right':'left'),leftWidth:width(value.leftWidth,resizeLimits.left,defaults.leftWidth),rightWidth:width(value.rightWidth,resizeLimits.right,defaults.rightWidth)};
  if(mobileQuery.matches&&next.leftOpen&&next.rightOpen)next.leftOpen=false;
  return next;
}
function applyDockState(state,{save=true}={}){
  const next=normalizeStoredDockState(state);
  persisted={...persisted,...next};
  renderLeftTabOrder();
  root.style.setProperty('--left-dock-width',`${next.leftWidth}px`);
  root.style.setProperty('--right-dock-width',`${next.rightWidth}px`);
  updateResizeHandle('left',next.leftWidth);
  updateResizeHandle('right',next.rightWidth);
  setPanel('left',next.leftOpen,{save:false,customize:false});
  setPanel('right',next.rightOpen,{save:false,customize:false});
  showLeftTab(next.leftTab,{save:false,open:false});
  setInspectorTab(next.inspectorTab,{save:false});
  persisted.panelActive=next.panelActive;
  syncMobileBackdrop();
  workspaceAppearance?.syncDockControls();
  if(save)persist();
}
window.addEventListener('storage',event=>{
  if(event.key!==null&&event.key!==STORAGE_KEY)return;
  try{if(event.storageArea&&event.storageArea!==window.localStorage)return}catch{return}
  cancelWorkspaceDrag({announcement:'A másik szerkesztőlapon megváltozott a panelállapot, ezért az átrendezés megszakadt.'});
  let next;
  try{next=event.newValue?JSON.parse(event.newValue):defaults}catch{next=defaults}
  applyDockState(next,{save:false});
  workspaceAppearance?.clearExternalDockHistory({reset:event.key===null});
  emit('workspace:external-change',{source:'storage',area:'dock'});
});
cancelWorkspaceDrag=setupDockReordering()||(()=>{});
document.querySelectorAll('[data-workspace-panel-tab]').forEach(button=>button.addEventListener('click',()=>{
  const side=button.dataset.workspacePanelTab;if(!['left','right'].includes(side))return;
  workspaceAppearance?.remember();persisted.panelActive=side;
  setPanel(side,true,{customize:false});persist();syncMobileBackdrop();
}));
document.querySelector('.workspace-panel-group-tabs')?.addEventListener('keydown',event=>{
  if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
  const tabs=Array.from(document.querySelectorAll('[data-workspace-panel-tab]'));
  const current=tabs.indexOf(event.target.closest('[data-workspace-panel-tab]'));if(current<0)return;
  event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?tabs.length-1:(current+(event.key==='ArrowRight'?1:tabs.length-1))%tabs.length;
  tabs[next]?.click();tabs[next]?.focus({preventScroll:true});
});

document.querySelector('#editorMenu')?.addEventListener('click',()=>{
  if(canvasFocus){setCanvasFocus(false);showLeftTab(persisted.leftTab||'pages',{customize:true});return}
  if(panels.left?.classList.contains('closed'))showLeftTab(persisted.leftTab||'pages',{customize:true});
  else setPanel('left',false,{customize:true});
});
document.querySelectorAll('[data-collapse]').forEach(b=>b.addEventListener('click',()=>{
  const side=b.dataset.collapse;
  setPanel(side,panels[side]?.classList.contains('closed')??true,{customize:true});
}));
document.querySelector('#openInspector')?.addEventListener('click',()=>{
  if(canvasFocus){setCanvasFocus(false);setPanel('right',true,{customize:true});return}
  setPanel('right',panels.right?.classList.contains('closed')??true,{customize:true});
});
document.querySelectorAll('[data-editor-action="focusCanvas"],[data-editor-action="restoreCanvasFocus"]').forEach(button=>button.addEventListener('click',()=>setCanvasFocus(!canvasFocus)));
document.querySelector('#openWorkspaceAppearance')?.addEventListener('click',()=>{if(canvasFocus)setCanvasFocus(false)});
document.querySelector('.more-actions')?.addEventListener('toggle',event=>{
  if(event.target.open && !canvasFocus && window.matchMedia('(max-width: 1024px)').matches){
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
  if(canvasFocus){setCanvasFocus(false);return}
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
    const index=persisted.leftTabOrder.indexOf(b.dataset.tab);if(index<0)return;
    let next=-1;
    if(event.key==='ArrowDown')next=(index+1)%persisted.leftTabOrder.length;
    else if(event.key==='ArrowUp')next=(index+persisted.leftTabOrder.length-1)%persisted.leftTabOrder.length;
    else if(event.key==='Home')next=0;
    else if(event.key==='End')next=persisted.leftTabOrder.length-1;
    if(next<0)return;
    event.preventDefault();const nextTab=persisted.leftTabOrder[next],target=document.querySelector(`.rail-btn[data-tab="${nextTab}"]`);showLeftTab(nextTab,{customize:true});requestAnimationFrame(()=>target?.focus());
  });
});
setupResizers();
window.sanciEditor={version:9,bus,panels:panelRegistry,features:featureRegistry,on:bus.on,emit,openPanel:s=>setPanel(s,true),closePanel:s=>setPanel(s,false),showLeftTab,setInspectorTab,resizeDock};
featureRegistry.register('shell-runtime',{version:9,persistence:'localStorage',mobileShell:'bottom-sheet'});
syncMobileBackdrop();
emit('shell:ready',{version:8});
