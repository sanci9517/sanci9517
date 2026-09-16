/* Sanci9517 Visual Editor Core v2
 * Single source of truth: document tree, selection, hierarchy, history and layer order.
 * Preserves the existing document schema and exposes validated actions for future AI.
 */
(()=>{
  const boot=()=>{
    if(!window.state||!window.find)return;
    const state=window.state;
    const legacy={inspector:window.renderInspector,show:window.show};
    const containers=new Set(['root','section','container','row','columns','grid','stack','flex','group','card']);
    const clone=v=>JSON.parse(JSON.stringify(v));
    const walk=(nodes,fn)=>{for(const n of nodes||[]){fn(n);walk(n.children||[],fn)}};
    const all=()=>{const a=[];walk(state.doc?.root?.children,n=>a.push(n));return a};
    const find=id=>all().find(n=>n.id===id);
    const parentOf=(id,nodes=state.doc?.root?.children)=>{for(const n of nodes||[]){if((n.children||[]).some(c=>c.id===id))return n;const p=parentOf(id,n.children||[]);if(p)return p}return null};
    const descendants=id=>{const a=[];const n=find(id);walk(n?.children||[],x=>a.push(x));return a};
    const hasDescendant=(a,b)=>descendants(a).some(n=>n.id===b);
    const isContainer=n=>!!n&&containers.has(n.type);
    const esc=v=>String(v??'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
    const selectedNodes=()=>state.selected.map(find).filter(Boolean);
    const updateSelection=()=>{const e=document.getElementById('selectionState');if(!e)return;e.textContent=!state.selected.length?'Kijelölés: —':state.selected.length===1?'Kijelölés: '+(find(state.selected[0])?.name||state.selected[0]):`Kijelölés: ${state.selected.length} elem`};
    function renderNode(n){
      const el=document.createElement('div');el.className='node';el.dataset.id=n.id;el.dataset.type=n.type;
      const l=n.layout||{},s=n.style||{};
      Object.assign(el.style,{left:(l.x||0)+'px',top:(l.y||0)+'px',width:(l.width||200)+'px',height:(l.height||80)+'px',position:l.position||'absolute',display:n.visible===false?'none':(l.display||'block'),gap:(l.gap??0)+'px',padding:(l.padding??0)+'px',margin:(l.margin??0)+'px',overflow:l.overflow||'visible',zIndex:String(n.zIndex??1),opacity:String(s.opacity??1),color:s.color||'',background:s.background||'',fontSize:(s.fontSize||16)+'px',fontWeight:String(s.fontWeight||400),lineHeight:String(s.lineHeight||1.4),textAlign:s.textAlign||'left',border:s.border||'none',borderRadius:(s.radius||0)+'px'});
      if(n.locked)el.classList.add('locked');
      const text=String(n.content?.text??n.name);
      if(['text','paragraph','richtext','heading'].includes(n.type)){el.classList.add(n.type==='heading'?'node-heading':'node-text');el.textContent=text}
      else if(['button','submit'].includes(n.type)){el.classList.add('node-button');el.textContent=text}
      else if(n.type==='badge'){el.classList.add('node-badge');el.textContent=text}
      else if(n.type==='spacer'){el.classList.add('node-spacer');el.textContent='Térköz'}
      else if(['image','video','audio','gallery','carousel'].includes(n.type)){el.classList.add('node-image');el.textContent=n.type.toUpperCase()}
      else if(n.type==='divider'){el.classList.add('node-divider')}
      else if(isContainer(n)){el.classList.add('node-section');el.innerHTML='<b>'+esc(text)+'</b>'}
      else{el.classList.add('node-block');el.innerHTML='<b>'+esc(text)+'</b><small style="display:block;margin-top:6px;opacity:.65">'+esc(n.type)+'</small>'}
      if(state.selected.includes(n.id))el.classList.add('selected');
      if(!n.locked){const r=document.createElement('i');r.className='resize';el.appendChild(r)}
      (n.children||[]).forEach(ch=>el.appendChild(renderNode(ch)));
      return el;
    }
    function canvasHeight(){let m=0;walk(state.doc?.root?.children,n=>{const l=n.layout||{};m=Math.max(m,(Number(l.y)||0)+Math.max(20,Number(l.height)||80)+48)});return Math.max(680,Math.ceil(m))}
    function renderCanvas(){const c=document.getElementById('canvas');if(!c||!state.doc)return;c.innerHTML='';c.classList.toggle('grid-on',!!state.grid);(state.doc.root.children||[]).forEach(n=>c.appendChild(renderNode(n)));const h=canvasHeight();c.style.height=h+'px';const stage=document.getElementById('canvasStage');if(stage){stage.style.height=(h+80)+'px';stage.style.width='1120px'}const z=document.getElementById('zoomLabel');if(z)z.textContent=Math.round(state.zoom*100)+'%';c.style.transform=`scale(${state.zoom})`;const g=document.getElementById('gridState');if(g)g.textContent=`Grid: ${state.grid?'ON':'OFF'}`}
    function renderLayers(){
      const box=document.getElementById('layers');if(!box||!state.doc)return;box.innerHTML='<div class="panel-head">Oldal szerkezete</div>';
      const make=(n,d=0)=>{const wrap=document.createElement('div');wrap.className='layer-node';const row=document.createElement('div');row.className='layer hierarchy-layer';row.dataset.nodeId=n.id;row.style.paddingLeft=(10+d*18)+'px';if(state.selected.includes(n.id))row.classList.add('selected');const has=!!n.children?.length;row.innerHTML=`<span class="layer-name"><span class="hierarchy-arrow">${has?'▾':'•'}</span>${n.locked?'🔒 ':''}${n.visible===false?'🚫 ':''}${esc(n.name)}</span><span>${esc(n.type)}</span>`;row.onclick=e=>{e.preventDefault();e.stopPropagation();select(n.id,e)};wrap.appendChild(row);if(has){const kids=document.createElement('div');kids.className='layer-children';n.children.forEach(ch=>kids.appendChild(make(ch,d+1)));wrap.appendChild(kids)}return wrap};(state.doc.root.children||[]).forEach(n=>box.appendChild(make(n)));
    }
    function render(){renderCanvas();renderLayers();legacy.inspector?.();updateSelection()}
    function select(id,e={}){if(!find(id))return;const multi=e.ctrlKey||e.metaKey;if(multi){const s=new Set(state.selected);s.has(id)?s.delete(id):s.add(id);state.selected=[...s]}else state.selected=[id];renderCanvas();renderLayers();legacy.inspector?.();updateSelection();return state.selected}
    function selectMode(id,mode){if(!find(id))return;const s=new Set(state.selected);if(mode==='remove')s.delete(id);else if(mode==='toggle'){s.has(id)?s.delete(id):s.add(id)}else s.add(id);state.selected=[...s];renderCanvas();renderLayers();legacy.inspector?.();updateSelection();return state.selected}
    function clearSelection(){state.selected=[];renderCanvas();renderLayers();legacy.inspector?.();updateSelection()}
    function commit(){if(!state.doc)return;state.history.push(clone(state.doc));if(state.history.length>80)state.history.shift();state.future=[];state.dirty=true;window.updateSaveState?.()}
    function undo(){if(!state.history.length){legacy.show?.('Nincs visszavonható művelet');return false}state.future.push(clone(state.doc));state.doc=state.history.pop();state.selected=[];render();legacy.show?.('Visszavonva');return true}
    function redo(){if(!state.future.length){legacy.show?.('Nincs ismételhető művelet');return false}state.history.push(clone(state.doc));state.doc=state.future.pop();state.selected=[];render();legacy.show?.('Ismételve');return true}
    function abs(node,parent){let x=Number(node.layout?.x)||0,y=Number(node.layout?.y)||0,p=parent;while(p){x+=Number(p.layout?.x)||0;y+=Number(p.layout?.y)||0;p=parentOf(p.id)}return{x,y}}
    const local=(p,parent)=>({x:p.x-(Number(parent?.layout?.x)||0),y:p.y-(Number(parent?.layout?.y)||0)});
    function moveToParent(childId,parentId){const child=find(childId),parent=find(parentId);if(!child||!parent||child.id===parent.id||!isContainer(parent)||hasDescendant(child.id,parent.id))return false;const old=parentOf(child.id);if(old?.id===parent.id)return true;const source=old?.children||state.doc.root.children,i=source.findIndex(x=>x.id===child.id);if(i<0)return false;const p=abs(child,old);source.splice(i,1);parent.children=parent.children||[];Object.assign(child.layout,local(p,parent));parent.children.push(child);return true}
    function addChildren(){const a=selectedNodes();if(a.length<2){legacy.show?.('Jelöld ki a szülőt és legalább egy gyermeket');return false}if(!isContainer(a[0])){legacy.show?.('Az első kijelölt elemnek konténernek kell lennie');return false}if(a.slice(1).some(n=>n.id===a[0].id||hasDescendant(n.id,a[0].id))){legacy.show?.('Érvénytelen hierarchia');return false}commit();a.slice(1).forEach(n=>moveToParent(n.id,a[0].id));state.selected=[a[0].id];render();legacy.show?.('Hierarchia frissítve');return true}
    function moveOut(){if(state.selected.length!==1){legacy.show?.('Egyetlen gyermekelemet jelölj ki');return false}const child=find(state.selected[0]),parent=child&&parentOf(child.id);if(!child||!parent){legacy.show?.('Ez az elem már a gyökérszinten van');return false}const grand=parentOf(parent.id),p=abs(child,parent),source=parent.children||[],i=source.findIndex(x=>x.id===child.id);if(i<0)return false;commit();source.splice(i,1);const dest=grand?.children||state.doc.root.children;Object.assign(child.layout,local(p,grand));dest.push(child);state.selected=[child.id];render();legacy.show?.('Elem kiemelve');return true}
    function siblings(n){const p=parentOf(n.id);return p?(p.children||[]):state.doc.root.children||[]}
    function layerMove(dir){if(state.selected.length!==1){legacy.show?.('Jelölj ki egy elemet');return false}const n=find(state.selected[0]);if(!n)return false;const list=siblings(n);list.forEach((x,i)=>{if(!Number.isFinite(Number(x.zIndex)))x.zIndex=i+1});const ordered=[...list].sort((a,b)=>Number(a.zIndex)-Number(b.zIndex));const i=ordered.findIndex(x=>x.id===n.id);let j=i;if(dir==='forward')j=i+1;if(dir==='backward')j=i-1;if(dir==='front')j=ordered.length-1;if(dir==='back')j=0;if(j===i||j<0||j>=ordered.length){legacy.show?.('Az elem már ezen a rétegszinten van');return false}commit();const other=ordered[j];[n.zIndex,other.zIndex]=[other.zIndex,n.zIndex];render();legacy.show?.(dir==='forward'||dir==='front'?'Előrébb':'Hátrébb');return true}
    let drag=null;
    function pointerDown(e,id){if(e.button!==0)return;const n=find(id);if(!n||n.locked)return;const resize=e.target?.classList?.contains('resize');if(e.ctrlKey||e.metaKey){select(id,e);e.preventDefault();return}commit();const l=n.layout||{};drag={id,startX:e.clientX,startY:e.clientY,resize,x:Number(l.x)||0,y:Number(l.y)||0,w:Number(l.width)||200,h:Number(l.height)||80};select(id);window.addEventListener('pointermove',pointerMove);window.addEventListener('pointerup',pointerUp,{once:true});e.preventDefault()}
    function pointerMove(e){if(!drag)return;const n=find(drag.id);if(!n)return;const dx=(e.clientX-drag.startX)/state.zoom,dy=(e.clientY-drag.startY)/state.zoom;if(drag.resize){n.layout.width=Math.max(20,Math.round(drag.w+dx));n.layout.height=Math.max(20,Math.round(drag.h+dy))}else{const snap=v=>state.snap?Math.round(v/8)*8:Math.round(v);n.layout.x=snap(drag.x+dx);n.layout.y=snap(drag.y+dy)}const el=document.querySelector(`[data-id="${CSS.escape(n.id)}"]`);if(el){el.style.left=n.layout.x+'px';el.style.top=n.layout.y+'px';el.style.width=n.layout.width+'px';el.style.height=n.layout.height+'px'}legacy.inspector?.()}
    function pointerUp(){if(drag){drag=null;render()}}
    function installEvents(){const c=document.getElementById('canvas');if(!c||c.dataset.sanciCore==='2')return;c.dataset.sanciCore='2';c.addEventListener('pointerdown',e=>{const t=e.target instanceof Element?e.target:null;const node=t?.closest('.node');if(!node||!c.contains(node))return;e.stopImmediatePropagation();pointerDown(e,node.dataset.id)},true);c.addEventListener('click',e=>{const t=e.target instanceof Element?e.target:null;const node=t?.closest('.node');if(node&&c.contains(node)){e.stopImmediatePropagation();select(node.dataset.id,e)}else if(t===c)clearSelection()},true)}
    const bind=(id,fn)=>{const e=document.getElementById(id);if(e)e.onclick=fn};
    bind('nestBtn',addChildren);bind('unnestBtn',moveOut);bind('layerForward',()=>layerMove('forward'));bind('layerBackward',()=>layerMove('backward'));bind('layerFront',()=>layerMove('front'));bind('layerBack',()=>layerMove('back'));bind('undo',undo);bind('redo',redo);
    window.find=find;window.allNodes=all;window.commit=commit;window.undo=undo;window.redo=redo;window.select=select;window.clearSelection=clearSelection;window.renderCanvas=renderCanvas;window.renderLayers=renderLayers;window.render=render;window.pointerDown=pointerDown;
    window.SanciEditor={schemaVersion:2,state,find,allNodes,parentOf,isContainer,hasDescendant,select,selectAdd:id=>selectMode(id,'add'),selectRemove:id=>selectMode(id,'remove'),selectToggle:id=>selectMode(id,'toggle'),clearSelection,getSelection:()=>[...state.selected],getSelectedNodes:selectedNodes,commit,undo,redo,moveToParent,addChildren,moveOut,layerMove,render,renderCanvas,renderLayers,actions:{select,clearSelection,undo,redo,moveToParent,moveOut,layerMove},capabilities:{centralSelection:true,hierarchy:true,history:true,layerOrder:true,aiReadyActions:true}};
    window.SanciHierarchy={parentOf,moveToParent,isContainer,hasDescendant,renderLayerTree:renderLayers};
    installEvents();render();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
