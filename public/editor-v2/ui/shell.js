import {createEventBus} from './events.js';
import {panelRegistry,featureRegistry} from './registry.js';
import {EDITOR_ACTIONS} from './action-catalog.js?v=20261103-canvas-focus-mode';
import {enhanceEditorActionControls} from './action-help.js?v=20261103-canvas-focus-mode';
import {DEFAULT_LEFT_TAB_ORDER,applyWorkspacePreferences,mountWorkspaceAppearance,normalizeLeftTabOrder,readWorkspacePreferences} from './workspace-appearance.js?v=20261108-movable-canvas-safe-floating-dock';

const bus=createEventBus();
const workspace=document.querySelector('.workspace');
const root=document.documentElement;
const editorRoot=document.querySelector('.editor-app');
const panels={left:document.querySelector('#leftDock'),right:document.querySelector('#rightDock')};
const actionControls=enhanceEditorActionControls(document);
const LEFT_TABS=['pages','elements','layers','schedule','navigation'];
const resizeLimits={left:{min:250,max:460},right:{min:260,max:440}};
const STORAGE_KEY='sanci-editor-shell-v2';
const INSPECTOR_TABS=['design','content','advanced'];
const defaults={leftOpen:false,rightOpen:false,leftTab:'pages',leftTabOrder:DEFAULT_LEFT_TAB_ORDER,inspectorTab:'design',panelActive:'left',leftWidth:310,rightWidth:352};
const mobileQuery=window.matchMedia('(max-width: 1024px)');
let dockStorageDurable=true;
const initialAppearance=readWorkspacePreferences();
applyWorkspacePreferences(editorRoot,initialAppearance);
let focusBeforeMobilePanel=null;
let workspaceAppearance=null;
let cancelWorkspaceDrag=()=>{};
let cancelDockResize=()=>{};
let cancelFloatingDockMove=()=>{};
let canvasFocus=false;
let desktopDockSnapshot=null;
let initializingDocks=true;

function readPersisted(){
  try{
    const raw=localStorage.getItem(STORAGE_KEY);
    if(!raw)return {...defaults};
    const value=JSON.parse(raw);
    return {...defaults,...value};
  }catch{dockStorageDurable=false;return {...defaults}}
}

let persisted=normalizeStoredDockState(readPersisted(),{normalizeMobile:false});
if(initialAppearance.layout!=='custom'){
  // Keep the preference's desktop intent even when the current mobile shell
  // presents that layout as canvas-first until the user explicitly opens a dock.
  const initialLayout=resolveWorkspaceLayout(initialAppearance.layout,false);
  persisted.leftOpen=initialLayout.left;
  persisted.rightOpen=initialLayout.right;
}
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
  const serialized=JSON.stringify(persisted);
  try{
    localStorage.setItem(STORAGE_KEY,serialized);
    if(localStorage.getItem(STORAGE_KEY)!==serialized)throw new Error('Workspace storage did not return the saved dock state');
    dockStorageDurable=true;
    return true;
  }catch{
    dockStorageDurable=false;
    workspaceAppearance?.reportDockStorageUnavailable();
    const status=document.querySelector('#workspaceDockStatus');
    if(status)status.textContent='A panelbeállítások csak ebben a munkamenetben érvényesek, mert a tárhelyes mentésük nem ellenőrizhető.';
    return false;
  }
}
function resolveWorkspaceLayout(layout,mobile){
  if(layout==='canvas')return {left:false,right:false};
  if(layout==='inspector')return {left:false,right:true};
  return mobile?{left:false,right:false}:{left:true,right:true};
}
function applyWorkspaceLayout(layout,{save=true}={}){
  if(layout==='custom'){syncMobileBackdrop();return}
  const next=resolveWorkspaceLayout(layout,mobileQuery.matches);
  if(!save||mobileQuery.matches){
    // External appearance changes arrive on the appearance key; the shell
    // key may be unavailable or may have rejected its separate write. A
    // mobile preset is also only a responsive presentation: retain its
    // desktop intent in memory so the next breakpoint restore cannot persist
    // the phone's canvas-first state over the selected desktop layout.
    const desktop=resolveWorkspaceLayout(layout,false);
    persisted.leftOpen=desktop.left;persisted.rightOpen=desktop.right;
    if(desktop.left&&!desktop.right)persisted.panelActive='left';
    else if(desktop.right&&!desktop.left)persisted.panelActive='right';
  }
  const persistPanels=save&&!mobileQuery.matches;
  if(save&&mobileQuery.matches)desktopDockSnapshot=null;
  setPanel('left',next.left,{save:persistPanels});
  setPanel('right',next.right,{save:persistPanels});
  syncMobileBackdrop();
}
function emit(type,payload={}){bus.emit(type,payload)}
function isGroupedPanelMode(){return ['tabbed','floating'].includes(editorRoot?.dataset.workspacePanelMode)}
function syncPanelGroup(){
  if(workspace)workspace.dataset.workspaceActivePanel=persisted.panelActive;
  const groupTabs=document.querySelector('.workspace-panel-group-tabs');
  const grouped=isGroupedPanelMode()&&!mobileQuery.matches;
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
  if(!initializingDocks&&panels.left&&panels.right&&isGroupedPanelMode()&&!mobile){
    if(persisted.panelActive==='left'&&panels.left.classList.contains('closed')&&!panels.right.classList.contains('closed'))persisted.panelActive='right';
    if(persisted.panelActive==='right'&&panels.right.classList.contains('closed')&&!panels.left.classList.contains('closed'))persisted.panelActive='left';
  }
  if(panels.right) {
    const inactiveGroup=isGroupedPanelMode()&&!mobile&&persisted.panelActive!=='right';
    panels.right.inert=canvasFocus||!rightOpen||inactiveGroup;
    panels.right.setAttribute('aria-hidden',String(canvasFocus||!rightOpen||inactiveGroup));
  }
  if(panels.left) {
    const inactiveGroup=isGroupedPanelMode()&&!mobile&&persisted.panelActive!=='left';
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
  updateResizeHandles();
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
    else if(save)persisted[other==='left'?'leftOpen':'rightOpen']=false;
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
  // A deliberate panel choice on the mobile/tablet sheet must replace the
  // temporary desktop snapshot and persist which dock should restore when the
  // viewport returns to desktop. Desktop rail-tab changes still only persist
  // the selected tab, preserving their existing dock-open behavior.
  if(open)setPanel('left',true,{save:save&&mobileQuery.matches,customize:false});
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
function dockIsOnLeft(side){
  const panel=panels[side],canvas=document.querySelector('.canvas-area');
  const panelRect=panel?.getBoundingClientRect(),canvasRect=canvas?.getBoundingClientRect();
  if(panelRect?.width>0&&canvasRect?.width>0){
    if(panelRect.right<=canvasRect.left+1)return true;
    if(panelRect.left>=canvasRect.right-1)return false;
  }
  const order=String(workspace?.dataset.workspaceDockOrder||'left-canvas-right').split('-');
  const panelIndex=order.indexOf(side),canvasIndex=order.indexOf('canvas');
  return panelIndex>=0&&canvasIndex>=0?panelIndex<canvasIndex:side==='left';
}
function updateResizeHandle(side,width){
  const handle=document.querySelector(`.dock-resizer[data-resize="${side}"]`);
  if(!handle)return;
  const limits=resizeBounds(side);
  const panel=panels[side];
  const renderedWidth=!mobileQuery.matches&&!panel?.classList.contains('closed')?panel?.getBoundingClientRect().width:0;
  const value=renderedWidth>0?renderedWidth:clamp(width,limits);
  handle.setAttribute('aria-valuemin',String(limits.min));
  handle.setAttribute('aria-valuemax',String(limits.max));
  handle.setAttribute('aria-valuenow',String(value));
  handle.setAttribute('aria-valuetext',`${new Intl.NumberFormat('hu-HU',{maximumFractionDigits:1}).format(value)} képpont széles`);
}
function resizeBounds(side){
  const limits=resizeLimits[side];
  const bothDesktopDocksOpen=!mobileQuery.matches&&Object.values(panels).every(panel=>panel&&!panel.classList.contains('closed'));
  if(!bothDesktopDocksOpen)return limits;
  // Separate docks share the space left after reserving 400px for the canvas;
  // a tabbed group has only one physical track and can use that whole space.
  // Keep keyboard/pointer bounds aligned with the corresponding CSS grid cap.
  const openTrackCount=isGroupedPanelMode()?1:2;
  const availableTrackWidth=(window.innerWidth-400)/openTrackCount;
  return {...limits,max:Math.max(limits.min,Math.min(limits.max,availableTrackWidth))};
}
function updateResizeHandles(){
  updateResizeHandle('left',persisted.leftWidth);
  updateResizeHandle('right',persisted.rightWidth);
}
function setupFloatingDockMovement(){
  if(!workspace)return ()=>{};
  const status=document.querySelector('#workspaceDockStatus');
  const handles=Array.from(document.querySelectorAll('[data-floating-handle]'));
  let activeCancel=()=>{};
  const supported=()=>!mobileQuery.matches&&editorRoot?.dataset.workspacePanelMode==='floating';
  const clampOffset=(side,x,y)=>{
    const host=panels[side],surface=host?.querySelector('[data-floating-window]');
    if(!host||!surface)return {x:0,y:0};
    const maxX=Math.max(0,host.clientWidth-surface.offsetWidth-16);
    const maxY=Math.max(0,host.clientHeight-surface.offsetHeight-16);
    return {x:Math.max(0,Math.min(maxX,Number.isFinite(x)?x:0)),y:Math.max(0,Math.min(maxY,Number.isFinite(y)?y:0))};
  };
  const currentOffset=side=>{
    const style=getComputedStyle(workspace);
    const x=parseFloat(style.getPropertyValue(`--floating-${side}-x`))||0;
    const y=parseFloat(style.getPropertyValue(`--floating-${side}-y`))||0;
    return clampOffset(side,x,y);
  };
  const setLiveOffset=(side,point)=>{
    workspace.style.setProperty(`--floating-${side}-x`,`${point.x}px`);
    workspace.style.setProperty(`--floating-${side}-y`,`${point.y}px`);
  };
  const announce=message=>{if(status)status.textContent=message};
  const finishCurrent=()=>activeCancel({restore:true});
  for(const handle of handles){
    const side=handle.dataset.floatingHandle;
    if(!['left','right'].includes(side))continue;
    handle.addEventListener('pointerdown',event=>{
      if(!supported()||event.button!==0)return;
      const start=currentOffset(side),pointerId=event.pointerId,startX=event.clientX,startY=event.clientY;
      const onMove=moveEvent=>{
        if(moveEvent.pointerId!==pointerId)return;
        const next=clampOffset(side,start.x+moveEvent.clientX-startX,start.y+moveEvent.clientY-startY);
        setLiveOffset(side,next);
        moveEvent.preventDefault();
      };
      const finish=(finishEvent,{restore=false,commit=false}={})=>{
        if(finishEvent&&finishEvent.pointerId!==pointerId)return;
        window.removeEventListener('pointermove',onMove);
        window.removeEventListener('pointerup',onUp);
        window.removeEventListener('pointercancel',onCancel);
        handle.removeEventListener('lostpointercapture',onLost);
        document.body.classList.remove('moving-floating-dock');
        if(handle.hasPointerCapture?.(pointerId)){try{handle.releasePointerCapture(pointerId)}catch{}}
        if(restore)applyWorkspacePreferences(editorRoot,workspaceAppearance?.value||initialAppearance);
        if(commit){
          const point=currentOffset(side);
          workspaceAppearance?.setFloatingPosition(side,point.x,point.y);
          announce(`A(z) ${side==='left'?'bal':'jobb'} lebegő panel új helye elmentve. A vászon fedetlen maradt.`);
        }
        if(activeCancel===cancel)activeCancel=()=>{};
      };
      const onUp=upEvent=>finish(upEvent,{commit:true});
      const onCancel=cancelEvent=>finish(cancelEvent,{restore:true});
      const onLost=lostEvent=>finish(lostEvent,{restore:true});
      const cancel=({restore=true,announcement='A panel mozgatása megszakadt; az előző hely visszaállt.'}={})=>{
        finish(null,{restore});announce(announcement);
      };
      activeCancel({restore:true,announcement:'A korábbi panelmozgatás megszakadt.'});
      activeCancel=cancel;
      try{handle.setPointerCapture(pointerId)}catch{}
      document.body.classList.add('moving-floating-dock');
      window.addEventListener('pointermove',onMove,{passive:false});
      window.addEventListener('pointerup',onUp);
      window.addEventListener('pointercancel',onCancel);
      handle.addEventListener('lostpointercapture',onLost,{once:true});
      event.preventDefault();
    });
    handle.addEventListener('keydown',event=>{
      if(!supported())return;
      const point=currentOffset(side),step=event.shiftKey?48:16;
      const bounds=clampOffset(side,Number.MAX_SAFE_INTEGER,Number.MAX_SAFE_INTEGER);
      const next={...point};
      if(event.key==='ArrowLeft')next.x=Math.max(0,point.x-step);
      else if(event.key==='ArrowRight')next.x=Math.min(bounds.x,point.x+step);
      else if(event.key==='ArrowUp')next.y=Math.max(0,point.y-step);
      else if(event.key==='ArrowDown')next.y=Math.min(bounds.y,point.y+step);
      else if(event.key==='Home'){next.x=0;next.y=0}
      else if(event.key==='End'){next.x=bounds.x;next.y=bounds.y}
      else return;
      event.preventDefault();
      const clamped=clampOffset(side,next.x,next.y);
      if(workspaceAppearance?.setFloatingPosition(side,clamped.x,clamped.y)){
        announce(`A(z) ${side==='left'?'bal':'jobb'} lebegő panel helye: ${clamped.x} képpont vízszintesen, ${clamped.y} képpont függőlegesen.`);
      }
    });
  }
  const onResize=()=>{
    if(document.body.classList.contains('moving-floating-dock'))finishCurrent();
    for(const side of ['left','right'])setLiveOffset(side,currentOffset(side));
  };
  window.addEventListener('resize',onResize,{passive:true});
  const observer=typeof ResizeObserver==='function'?new ResizeObserver(onResize):null;
  for(const side of ['left','right']){const host=panels[side];if(host)observer?.observe(host)}
  cancelFloatingDockMove=options=>activeCancel(options);
  requestAnimationFrame(onResize);
  return ()=>{finishCurrent();window.removeEventListener('resize',onResize);observer?.disconnect()};
}
function resizeDock(side,startX,startWidth,{pointerId=null,handle=null,dockOnLeft=dockIsOnLeft(side)}={}){
  workspaceAppearance?.remember();
  const limits=resizeLimits[side];
  const widthKey=side==='left'?'leftWidth':'rightWidth';
  const startStoredWidth=clamp(parseFloat(getComputedStyle(root).getPropertyValue(side==='left'?'--left-dock-width':'--right-dock-width'))||startWidth,limits);
  const onMove=event=>{
    if(pointerId!==null&&event.pointerId!==pointerId)return;
    const delta=dockOnLeft?event.clientX-startX:startX-event.clientX;
    const width=clamp(startWidth+delta,resizeBounds(side));
    root.style.setProperty(side==='left'?'--left-dock-width':'--right-dock-width',`${width}px`);
    persisted[side==='left'?'leftWidth':'rightWidth']=width;
    updateResizeHandle(side,width);
    emit('panel:resize',{side,width});
  };
  const finish=(event,{persistChanges=true,announcement=''}={})=>{
    if(event&&pointerId!==null&&event.pointerId!==pointerId)return;
    if(persistChanges){
      persist();
      workspaceAppearance?.setLayout('custom',{rememberChange:false});
    }
    document.body.classList.remove('resizing-dock');
    window.removeEventListener('pointermove',onMove);
    window.removeEventListener('pointerup',finish);
    window.removeEventListener('pointercancel',finish);
    handle?.removeEventListener('lostpointercapture',finish);
    if(pointerId!==null&&handle?.hasPointerCapture?.(pointerId)){
      try{handle.releasePointerCapture(pointerId)}catch{}
    }
    if(cancelDockResize===cancel)cancelDockResize=()=>{};
    if(announcement){const status=document.querySelector('#workspaceDockStatus');if(status)status.textContent=announcement}
  };
  const cancel=({announcement='A másik szerkesztőlapon változott a munkaterület, ezért a panel átméretezése megszakadt.'}={})=>{
    // A narrow desktop can visually cap a panel below its saved preference.
    // Canceling a resize must restore that preference, not replace it with
    // the temporary viewport-constrained width.
    root.style.setProperty(side==='left'?'--left-dock-width':'--right-dock-width',`${startStoredWidth}px`);
    persisted[widthKey]=startStoredWidth;
    updateResizeHandle(side,startStoredWidth);
    finish(null,{persistChanges:false,announcement});
  };
  cancelDockResize=cancel;
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
    const currentWidth=()=>{
      const panel=panels[side];
      const renderedWidth=!mobileQuery.matches&&!panel?.classList.contains('closed')?panel?.getBoundingClientRect().width:0;
      return renderedWidth>0?renderedWidth:clamp(parseFloat(getComputedStyle(root).getPropertyValue(side==='left'?'--left-dock-width':'--right-dock-width'))||limits.min,resizeBounds(side));
    };
    updateResizeHandle(side,currentWidth());
    handle.addEventListener('pointerdown',event=>{
      if(window.matchMedia('(max-width: 1024px)').matches)return;
      const current=currentWidth();
      try{handle.setPointerCapture?.(event.pointerId)}catch{}
      resizeDock(side,event.clientX,current,{pointerId:event.pointerId,handle,dockOnLeft:dockIsOnLeft(side)});
      event.preventDefault();
    });
    handle.addEventListener('keydown',event=>{
      // Dock identity and position are independent: a saved order or tabbed
      // group can move either separator to the opposite side of the canvas.
      const dockOnLeft=dockIsOnLeft(side);
      const increaseKey=dockOnLeft?'ArrowRight':'ArrowLeft';
      const decreaseKey=dockOnLeft?'ArrowLeft':'ArrowRight';
      const step=event.shiftKey?48:16;
      const current=currentWidth();
      let next=current;
      const bounds=resizeBounds(side);
      if(event.key===increaseKey)next=clamp(current+step,bounds);
      else if(event.key===decreaseKey)next=clamp(current-step,bounds);
      else if(event.key==='Home')next=bounds.min;
      else if(event.key==='End')next=bounds.max;
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
  window.addEventListener('resize',updateResizeHandles,{passive:true});
}
function setupDockReordering(){
  if(!workspace)return;
  const canvasArea=document.querySelector('.canvas-area');
  const regions={left:panels.left,canvas:canvasArea,right:panels.right};
  const names={left:'Oldalak és eszközök',canvas:'Vászon',right:'Beállítások'};
  const isDockGroupZone=(sourceId,target,rect,clientX)=>{
    if(sourceId==='canvas'||target===canvasArea||rect.width<=0)return false;
    // MouseEvent.clientX is quantized to a CSS-pixel boundary; keep the
    // inclusive 35%/65% edges stable when DOMRect coordinates are fractional.
    const offset=clientX-rect.left,tolerance=0.5;
    return offset>=rect.width*0.35-tolerance&&offset<=rect.width*0.65+tolerance;
  };
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
    cancelDockResize({announcement:'A képernyőméret változott, ezért a panel átméretezése megszakadt.'});
    cancelFloatingDockMove({announcement:'A képernyőméret változott, ezért a lebegő panel visszaállt az előző helyére.'});
    finishDrag({announcement:'A képernyőméret változott, ezért az átrendezés megszakadt.'});
    if(mobileQuery.matches){
      if(!desktopDockSnapshot)desktopDockSnapshot={left:!panels.left?.classList.contains('closed'),right:!panels.right?.classList.contains('closed'),active:persisted.panelActive};
      const focusedSide=Object.entries(panels).find(([,panel])=>panel?.contains(document.activeElement)&&!panel.classList.contains('closed'))?.[0];
      const keep=focusedSide||(desktopDockSnapshot.right?'right':desktopDockSnapshot.left?'left':null);
      setPanel('left',keep==='left',{save:false,restoreFocus:false});
      setPanel('right',keep==='right',{save:false,restoreFocus:false});
    }else{
      const restore=desktopDockSnapshot||{left:Boolean(persisted.leftOpen),right:Boolean(persisted.rightOpen)};
      const activePanel=desktopDockSnapshot?.active||persisted.panelActive;
      desktopDockSnapshot=null;
      setPanel('left',restore.left,{save:false,restoreFocus:false});
      setPanel('right',restore.right,{save:false,restoreFocus:false});
      // setPanel synchronizes accessibility state after each individual dock.
      // During restoration that intermediate one-dock state must not replace
      // the selected tab from the complete desktop group snapshot.
      if((activePanel==='left'&&restore.left)||(activePanel==='right'&&restore.right))persisted.panelActive=activePanel;
      syncMobileBackdrop();
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
    const position=isDockGroupZone(dragSourceId,target,rect,event.clientX)?'group':ratio<0.5?'before':'after';
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
    const ungrouping=isGroupedPanelMode()&&sourceId!=='canvas'&&target===canvasArea;
    const movingCanvasBesideGroup=isGroupedPanelMode()&&sourceId==='canvas'&&target!==canvasArea;
    const visualOrder=Object.values(regions).filter(Boolean).sort((a,b)=>a.getBoundingClientRect().left-b.getBoundingClientRect().left);
    // In a tabbed view the inactive dock is display:none, so its zero-size
    // rect cannot be used to infer the user's saved three-region order.
    const savedOrder=ungrouping||movingCanvasBesideGroup?String(editorRoot.dataset.workspaceDockOrder||'').split('-').map(id=>regions[id]):[];
    const order=(ungrouping||movingCanvasBesideGroup)&&savedOrder.length===3&&savedOrder.every(Boolean)?savedOrder:visualOrder;
    const sourceIndex=order.indexOf(source),targetIndex=order.indexOf(target);
    if(sourceIndex<0||targetIndex<0){finishDrag({announcement:'Az átrendezés megszakadt.'});return}
    order.splice(sourceIndex,1);
    const rect=target.getBoundingClientRect(),ratio=rect.width?((event.clientX-rect.left)/rect.width):0.5;
    if(isDockGroupZone(sourceId,target,rect,event.clientX)){
      // A custom dock order can put the panel named "right" to the canvas's
      // left (and vice versa). Group where the drop target is actually shown,
      // not where its stable panel id happens to land in the CSS grid.
      const canvasRect=canvasArea.getBoundingClientRect();
      const groupSide=rect.left+rect.width/2<canvasRect.left+canvasRect.width/2?'left':'right';
      const grouped=workspaceAppearance?.setPanelGrouping('tabbed',groupSide);
      if(grouped){setPanel(sourceId,true,{save:true,customize:false});announce(`A(z) ${names[sourceId]} panel a(z) ${names[targetId]} panelfülei közé került. A füles csoport a vászon ${groupSide==='left'?'bal':'jobb'} oldalán marad, a vászon fedetlen.`)}
      else announce('A panelcsoport nem változott.');
      finishDrag();return;
    }
    const before=ratio<0.5;
    if(movingCanvasBesideGroup){
      // A tabbed pair occupies one physical track even though its two panel
      // IDs remain in the persisted three-region order. Move the canvas to
      // either side of that whole pair rather than splitting its future
      // separate-dock order around the hidden panel's zero-size DOM rect.
      const groupIndexes=order.flatMap((region,index)=>region===panels.left||region===panels.right?[index]:[]);
      if(groupIndexes.length!==2){finishDrag({announcement:'A panelcsoport sorrendje nem állítható vissza, ezért az átrendezés megszakadt.'});return}
      const boundary=before?Math.min(...groupIndexes):Math.max(...groupIndexes)+1;
      order.splice(boundary,0,source);
    }else{
      const adjustedTarget=order.indexOf(target);
      order.splice(adjustedTarget+(before?0:1),0,source);
    }
    const value=order.map(item=>item.dataset.workspaceDockId).join('-');
    const changed=ungrouping
      ?workspaceAppearance?.setDockLayout({dockOrder:value,panelMode:'separate'})
      :workspaceAppearance?.setDockOrder(value);
    if(changed){
      // Applying the saved visual preset can select its default panel. When a
      // dock is pulled out of a tab group, keep that dragged dock active so
      // the visible result follows the user's action rather than the preset.
      if(ungrouping)setPanel(sourceId,true,{save:true,customize:false});
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
initializingDocks=false;
syncMobileBackdrop();
showLeftTab(persisted.leftTab,{save:false,open:false});
workspaceAppearance=mountWorkspaceAppearance({documentRef:document,root:editorRoot,onLayoutChange:applyWorkspaceLayout,onExternalChange:({reset=false}={})=>{
  desktopDockSnapshot=null;
  cancelDockResize({announcement:reset?'A másik szerkesztőlapon alaphelyzetbe állították a munkaterületet, ezért a panel átméretezése megszakadt.':'A másik szerkesztőlapon változott a munkaterület, ezért a panel átméretezése megszakadt.'});
  cancelWorkspaceDrag({announcement:reset?'A másik szerkesztőlapon alaphelyzetbe állították a munkaterületet, ezért az átrendezés megszakadt.':'A másik szerkesztőlapon történt változás miatt az átrendezés megszakadt.'});
  cancelFloatingDockMove({announcement:reset?'A másik lapon visszaállították a munkaterületet, ezért a lebegő panel helye megszakadt.':'A másik szerkesztőlapon megváltozott a munkaterület, ezért a panelmozgás megszakadt.'});
},readDockState:()=>persisted,moveDockTab:moveLeftTab,applyDockState:state=>{
  applyDockState(state);
},canPersistDockState:()=>dockStorageDurable,onReset:()=>{
  persisted={...defaults};
  renderLeftTabOrder();
  root.style.setProperty('--left-dock-width',`${defaults.leftWidth}px`);
  root.style.setProperty('--right-dock-width',`${defaults.rightWidth}px`);
  updateResizeHandle('left',defaults.leftWidth);
  updateResizeHandle('right',defaults.rightWidth);
  persist();
  workspaceAppearance?.syncDockControls();
}});
function normalizeStoredDockState(input,{normalizeMobile=true}={}){
  const value=input&&typeof input==='object'&&!Array.isArray(input)?input:{};
  const width=(candidate,limits,fallback)=>Number.isFinite(Number(candidate))?clamp(Number(candidate),limits):fallback;
  const next={leftOpen:value.leftOpen===true,rightOpen:value.rightOpen===true,leftTab:LEFT_TABS.includes(value.leftTab)?value.leftTab:'pages',leftTabOrder:normalizeLeftTabOrder(value.leftTabOrder),inspectorTab:INSPECTOR_TABS.includes(value.inspectorTab)?value.inspectorTab:'design',panelActive:['left','right'].includes(value.panelActive)?value.panelActive:(value.rightOpen===true?'right':'left'),leftWidth:width(value.leftWidth,resizeLimits.left,defaults.leftWidth),rightWidth:width(value.rightWidth,resizeLimits.right,defaults.rightWidth)};
  if(normalizeMobile&&mobileQuery.matches&&next.leftOpen&&next.rightOpen)next.leftOpen=false;
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
  // A shared dock update is the new desktop intent, even if this tab is
  // currently mobile. Keep that full snapshot for the next desktop return;
  // applyDockState below still normalizes the live phone UI to one drawer.
  let incoming;
  try{incoming=event.newValue?JSON.parse(event.newValue):defaults}catch{incoming=defaults}
  if(mobileQuery.matches){
    const desktop=normalizeStoredDockState(incoming,{normalizeMobile:false});
    desktopDockSnapshot={left:desktop.leftOpen,right:desktop.rightOpen,active:desktop.panelActive};
  }else desktopDockSnapshot=null;
  cancelDockResize({announcement:'A másik szerkesztőlapon megváltozott a panelállapot, ezért az átméretezés megszakadt.'});
  cancelWorkspaceDrag({announcement:'A másik szerkesztőlapon megváltozott a panelállapot, ezért az átrendezés megszakadt.'});
  applyDockState(incoming,{save:false});
  workspaceAppearance?.clearExternalDockHistory({reset:event.key===null});
  emit('workspace:external-change',{source:'storage',area:'dock'});
});
cancelWorkspaceDrag=setupDockReordering()||(()=>{});
setupFloatingDockMovement();
document.querySelectorAll('[data-workspace-panel-tab]').forEach(button=>button.addEventListener('click',()=>{
  const side=button.dataset.workspacePanelTab;if(!['left','right'].includes(side))return;
  if(persisted.panelActive===side&&!panels[side]?.classList.contains('closed'))return;
  workspaceAppearance?.remember();persisted.panelActive=side;
  setPanel(side,true,{customize:false});persist();syncMobileBackdrop();
}));
const firstDockPanelControl=panel=>{
  if(!panel||panel.inert||panel.classList.contains('closed'))return null;
  const controls=panel.querySelectorAll('button:not(:disabled),a[href],input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex]:not([tabindex="-1"])');
  return Array.from(controls).find(control=>!control.closest('[hidden],[inert],[aria-hidden="true"]')&&control.getClientRects().length>0)||null;
};
document.querySelector('.workspace-panel-group-tabs')?.addEventListener('keydown',event=>{
  if(event.key==='Tab'&&!event.shiftKey){
    // The right pane follows the canvas in DOM order although its tab is before
    // both. Preserve the tabs pattern by entering the selected pane directly.
    const target=firstDockPanelControl(panels[persisted.panelActive]);
    if(target){event.preventDefault();target.focus({preventScroll:true})}
    return;
  }
  if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
  const tabs=Array.from(document.querySelectorAll('[data-workspace-panel-tab]'));
  const current=tabs.indexOf(event.target.closest('[data-workspace-panel-tab]'));if(current<0)return;
  event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?tabs.length-1:(current+(event.key==='ArrowRight'?1:tabs.length-1))%tabs.length;
  tabs[next]?.click();tabs[next]?.focus({preventScroll:true});
});
workspace?.addEventListener('keydown',event=>{
  if(event.key!=='Tab'||!event.shiftKey||mobileQuery.matches||!isGroupedPanelMode())return;
  const activePanel=panels[persisted.panelActive],firstControl=firstDockPanelControl(activePanel);
  if(!firstControl||event.target!==firstControl)return;
  const activeTab=document.querySelector(`[data-workspace-panel-tab="${persisted.panelActive}"]`);
  if(!activeTab)return;
  // Keep reverse navigation consistent when visual docking order differs from
  // DOM order, and do not pull focus from later controls in the panel.
  event.preventDefault();activeTab.focus({preventScroll:true});
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
    // Opening the temporary mobile menu clears the visible drawer, not the
    // user's saved desktop dock intent. `toggle` is async and may arrive after
    // a new appearance preset was selected from the menu.
    setPanel('left',false,{save:false});setPanel('right',false,{save:false});
  }
});
document.querySelector('#mobileBackdrop')?.addEventListener('click',()=>{
  const openSide=panels.right&&!panels.right.classList.contains('closed')?'right':'left';
  const restore=focusBeforeMobilePanel?.isConnected
    ?focusBeforeMobilePanel
    :document.querySelector(openSide==='right'?'#openInspector':'#editorMenu');
  setPanel('left',false,{customize:true,restoreFocus:false});
  setPanel('right',false,{customize:true,restoreFocus:false});
  if(restore?.isConnected)restore.focus({preventScroll:true});
  focusBeforeMobilePanel=null;
});
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
