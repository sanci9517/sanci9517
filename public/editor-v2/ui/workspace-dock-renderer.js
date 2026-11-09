import {normalizeWorkspaceDockTree} from './workspace-dock-tree.js';

const labels={canvas:'Vászon',left:'Oldalak és eszközök',right:'Beállítások'};

/** Mount a validated tree without replacing the Editor's live panel elements. */
export function mountWorkspaceDockTree({documentRef=globalThis.document,workspace=documentRef?.querySelector('.workspace'),tree=null,onChange=()=>{},mediaQuery=globalThis.matchMedia?.('(min-width: 1025px)')}={}){
  if(!documentRef||!workspace)throw new Error('A document and workspace are required');
  const leaves={canvas:workspace.querySelector('.canvas-area'),left:workspace.querySelector('#leftDock'),right:workspace.querySelector('#rightDock')};
  if(Object.values(leaves).some(node=>!node))throw new Error('The canvas and both dock panels are required');
  let current=normalizeWorkspaceDockTree(tree),host=null,parking=null,markers=null,destroyed=false,canvasFocused=false;

  const preserveOriginalPositions=()=>{
    if(markers)return;
    markers={};
    for(const [key,node] of Object.entries(leaves)){
      const marker=documentRef.createComment(`workspace dock tree: ${key}`);
      node.parentNode?.insertBefore(marker,node);markers[key]=marker;
    }
  };
  const restoreOriginalPositions=()=>{
    if(!markers)return;
    for(const [key,node] of Object.entries(leaves)){
      const marker=markers[key];
      if(marker?.parentNode)marker.parentNode.insertBefore(node,marker);
      marker?.remove();
    }
    markers=null;host?.remove();host=null;parking=null;
    delete workspace.dataset.workspaceDockTreeActive;
  };
  const updateSplit=(split,nextRatio)=>{
    const ratio=Math.max(0.1,Math.min(0.9,nextRatio));
    if(!Number.isFinite(ratio)||ratio===split.ratio)return false;
    const hadFocus=Boolean(documentRef.activeElement?.closest?.(`[data-dock-tree-node="${split.id}"] .workspace-dock-tree-separator`));
    const next=normalizeWorkspaceDockTree(replaceNode(current,split.id,{...split,ratio}));
    if(!next)return false;
    current=next;render();onChange(current);
    if(hadFocus)host?.querySelector(`[data-dock-tree-node="${split.id}"] .workspace-dock-tree-separator`)?.focus({preventScroll:true});
    return true;
  };
  const activateTabs=(tabs,activeId)=>{
    if(activeId===tabs.activeId)return false;
    const next=normalizeWorkspaceDockTree(replaceNode(current,tabs.id,{...tabs,activeId}));
    if(!next)return false;
    current=next;render();onChange(current);return true;
  };
  const build=(node)=>{
    if(node.kind==='canvas')return leaves.canvas;
    if(node.kind==='panel')return leaves[node.side];
    const group=documentRef.createElement('div');
    group.className=`workspace-dock-tree-${node.kind}`;
    group.dataset.dockTreeNode=node.id;
    if(node.kind==='split'){
      group.dataset.dockTreeAxis=node.axis;
      const first=build(node.children[0]),second=build(node.children[1]);
      group.style.setProperty('--dock-split-ratio',String(node.ratio));
      const secondPane=documentRef.createElement('div');secondPane.className='workspace-dock-tree-pane';secondPane.append(second);
      const firstPane=documentRef.createElement('div');firstPane.className='workspace-dock-tree-pane';firstPane.style.flex=`0 0 calc(${node.ratio*100}% - 4px)`;firstPane.append(first);
      group.append(firstPane);
      const separator=documentRef.createElement('button');
      separator.className='workspace-dock-tree-separator';separator.type='button';separator.setAttribute('role','separator');
      separator.setAttribute('aria-orientation',node.axis==='horizontal'?'vertical':'horizontal');
      separator.setAttribute('aria-label',`Munkaterület-panel arányának állítása, ${node.axis==='horizontal'?'vízszintes':'függőleges'} felosztás`);
      separator.setAttribute('aria-valuemin','10');separator.setAttribute('aria-valuemax','90');separator.setAttribute('aria-valuenow',String(Math.round(node.ratio*100)));
      const applyPointer=event=>{
        const rect=group.getBoundingClientRect(),extent=node.axis==='horizontal'?rect.width:rect.height;
        if(extent<=0)return;
        const position=node.axis==='horizontal'?event.clientX-rect.left:event.clientY-rect.top;
        const ratio=Math.round(Math.max(0.1,Math.min(0.9,position/extent))*100)/100;
        if(ratio===node.ratio)return;
        firstPane.style.flex=`0 0 calc(${ratio*100}% - 4px)`;secondPane.style.flex='1 1 0%';
        separator.setAttribute('aria-valuenow',String(Math.round(ratio*100)));
        separator.dataset.pendingRatio=String(ratio);
      };
      separator.addEventListener('pointerdown',event=>{
        if(event.button!==0)return;
        event.preventDefault();separator.setPointerCapture?.(event.pointerId);applyPointer(event);
      });
      separator.addEventListener('pointermove',event=>{if(separator.hasPointerCapture?.(event.pointerId))applyPointer(event)});
      const finishPointer=event=>{
        if(!separator.hasPointerCapture?.(event.pointerId))return;
        separator.releasePointerCapture?.(event.pointerId);
        const ratio=Number(separator.dataset.pendingRatio);delete separator.dataset.pendingRatio;
        if(Number.isFinite(ratio))updateSplit(node,ratio);
      };
      separator.addEventListener('pointerup',finishPointer);separator.addEventListener('pointercancel',finishPointer);
      separator.addEventListener('keydown',event=>{
        const negative=node.axis==='horizontal'?'ArrowLeft':'ArrowUp',positive=node.axis==='horizontal'?'ArrowRight':'ArrowDown';
        const step=event.shiftKey?0.1:0.02;let ratio=node.ratio;
        if(event.key===negative)ratio-=step;else if(event.key===positive)ratio+=step;else if(event.key==='Home')ratio=0.1;else if(event.key==='End')ratio=0.9;else return;
        event.preventDefault();updateSplit(node,Math.round(ratio*100)/100);
      });
      group.append(separator,secondPane);
      return group;
    }
    const tablist=documentRef.createElement('div');tablist.className='workspace-dock-tree-tablist';tablist.setAttribute('role','tablist');tablist.setAttribute('aria-label','Panelcsoport');
    const content=documentRef.createElement('div');content.className='workspace-dock-tree-tabpanels';
    for(const child of node.children){
      const tab=documentRef.createElement('button');tab.type='button';tab.id=`workspace-dock-tree-tab-${node.id}-${child.id}`;tab.setAttribute('role','tab');tab.setAttribute('aria-controls',`workspace-dock-tree-panel-${node.id}-${child.id}`);tab.textContent=labels[child.side]||labels.canvas;
      const selected=child.id===node.activeId;tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1;
      const panel=documentRef.createElement('section');panel.id=`workspace-dock-tree-panel-${node.id}-${child.id}`;panel.setAttribute('role','tabpanel');panel.setAttribute('aria-labelledby',tab.id);panel.hidden=!selected;panel.inert=!selected;panel.append(build(child));
      tab.addEventListener('click',()=>activateTabs(node,child.id));
      tab.addEventListener('keydown',event=>{
        if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
        event.preventDefault();const index=node.children.findIndex(item=>item.id===child.id);
        const nextIndex=event.key==='Home'?0:event.key==='End'?node.children.length-1:(index+(event.key==='ArrowRight'?1:-1)+node.children.length)%node.children.length;
        activateTabs(node,node.children[nextIndex].id);group.querySelector(`#workspace-dock-tree-tab-${node.id}-${node.children[nextIndex].id}`)?.focus();
      });
      tablist.append(tab);content.append(panel);
    }
    group.append(tablist,content);return group;
  };
  const render=()=>{
    if(destroyed)return;
    if(!current||!mediaQuery?.matches){restoreOriginalPositions();return}
    preserveOriginalPositions();
    if(!host){host=documentRef.createElement('div');host.className='workspace-dock-tree-root';host.setAttribute('aria-label','Szerkesztő munkaterület');parking=documentRef.createElement('div');parking.hidden=true;parking.setAttribute('aria-hidden','true');workspace.append(host)}
    host.replaceChildren();
    if(canvasFocused){host.append(leaves.canvas);parking.replaceChildren(leaves.left,leaves.right)}
    else host.append(build(current));
    host.append(parking);
    host.dataset.canvasFocused=String(canvasFocused);
    workspace.dataset.workspaceDockTreeActive='true';
  };
  const setTree=value=>{current=normalizeWorkspaceDockTree(value);render();return Boolean(current)};
  const setCanvasFocus=value=>{canvasFocused=Boolean(value);render()};
  const mediaChange=()=>render();
  mediaQuery?.addEventListener?.('change',mediaChange);render();
  return {get tree(){return current},setTree,setCanvasFocus,render,destroy(){destroyed=true;mediaQuery?.removeEventListener?.('change',mediaChange);restoreOriginalPositions()}};
}

function replaceNode(node,id,replacement){
  if(node.id===id)return replacement;
  if(!node.children)return node;
  return {...node,children:node.children.map(child=>replaceNode(child,id,replacement))};
}
