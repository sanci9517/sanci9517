/* Sanci9517 Visual Editor Core v3
 * Canonical editor runtime: document tree, selection, hierarchy, history,
 * layer order, pointer interaction and validated actions for future AI.
 * Legacy app.js remains responsible for page persistence, element definitions
 * and inspector UI; this file owns editor state transitions and rendering.
 */
(()=>{
  const boot=()=>{
    if(!window.state||!window.find)return;
    const state=window.state;
    const legacy={inspector:window.renderInspector,show:window.show,updateSaveState:window.updateSaveState};
    const containers=new Set(['root','section','container','row','columns','grid','stack','flex','group','card','form','navbar','menu','footer','sidebar','modal','component']);
    const clone=v=>JSON.parse(JSON.stringify(v));
    const walk=(nodes,fn)=>{for(const n of nodes||[]){fn(n);walk(n.children||[],fn)}};
    const all=()=>{const out=[];walk(state.doc?.root?.children,n=>out.push(n));return out};
    const find=id=>all().find(n=>n.id===id);
    const parentOf=(id,nodes=state.doc?.root?.children)=>{for(const n of nodes||[]){if((n.children||[]).some(c=>c.id===id))return n;const p=parentOf(id,n.children||[]);if(p)return p}return null};
    const descendants=id=>{const n=find(id),out=[];walk(n?.children||[],x=>out.push(x));return out};
    const hasDescendant=(a,b)=>descendants(a).some(n=>n.id===b);
    const isContainer=n=>!!n&&containers.has(n.type);
    const selectedNodes=()=>state.selected.map(find).filter(Boolean);
    const escapeHtml=v=>String(v??'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
    const cssId=id=>{try{return CSS.escape(String(id))}catch{return String(id).replace(/[^a-zA-Z0-9_-]/g,'\\$&')}};
    const updateSelection=()=>{const e=document.getElementById('selectionState');if(!e)return;if(!state.selected.length)e.textContent='Kijelölés: —';else if(state.selected.length===1)e.textContent='Kijelölés: '+(find(state.selected[0])?.name||state.selected[0]);else e.textContent=`Kijelölés: ${state.selected.length} elem`};
    const refreshInspector=()=>legacy.inspector?.();
    const refresh=()=>{renderCanvas();renderLayers();refreshInspector();updateSelection();legacy.updateSaveState?.()};

    function renderNode(n){
      const el=document.createElement('div');el.className='node';el.dataset.id=n.id;el.dataset.type=n.type;
      const l=n.layout||{},s=n.style||{};
      Object.assign(el.style,{left:(l.x??0)+'px',top:(l.y??0)+'px',width:(l.width??200)+'px',height:(l.height??80)+'px',position:l.position||'absolute',display:n.visible===false?'none':(l.display||'block'),gap:(l.gap??0)+'px',padding:(l.padding??0)+'px',margin:(l.margin??0)+'px',minWidth:(l.minWidth??0)>0?l.minWidth+'px':'',maxWidth:(l.maxWidth??0)>0?l.maxWidth+'px':'',minHeight:(l.minHeight??0)>0?l.minHeight+'px':'',maxHeight:(l.maxHeight??0)>0?l.maxHeight+'px':'',overflow:l.overflow||'visible',zIndex:String(n.zIndex??1),opacity:String(s.opacity??1),color:s.color||'',background:s.background||'',fontSize:(s.fontSize??16)+'px',fontWeight:String(s.fontWeight??400),lineHeight:String(s.lineHeight??1.4),textAlign:s.textAlign||'left',border:s.border||'none',borderRadius:(s.radius??0)+'px'});
      if(n.locked)el.classList.add('locked');
      const text=String(n.content?.text??n.name??n.type);
      if(['text','paragraph','richtext','heading'].includes(n.type)){el.classList.add(n.type==='heading'?'node-heading':'node-text');el.textContent=text}
      else if(['button','submit'].includes(n.type)){el.classList.add('node-button');el.textContent=text}
      else if(n.type==='badge'){el.classList.add('node-badge');el.textContent=text}
      else if(n.type==='spacer'){el.classList.add('node-spacer');el.textContent='Térköz'}
      else if(['image','video','audio','gallery','carousel'].includes(n.type)){el.classList.add('node-image');el.textContent=n.type.toUpperCase()+(n.attributes?.src?' · '+n.attributes.src:'')}
      else if(n.type==='divider'){el.classList.add('node-divider')}
      else if(isContainer(n)){el.classList.add('node-section');el.innerHTML='<b>'+escapeHtml(text)+'</b>'}
      else{el.classList.add('node-block');el.innerHTML='<b>'+escapeHtml(text)+'</b><small style="display:block;margin-top:6px;opacity:.65">'+escapeHtml(n.type)+'</small>'}
      if(state.selected.includes(n.id))el.classList.add('selected');
      (n.children||[]).forEach(ch=>el.appendChild(renderNode(ch)));
      if(!n.locked){const r=document.createElement('i');r.className='resize';r.dataset.resizeFor=n.id;el.appendChild(r)}
      return el;
    }
    function canvasHeight(){let max=0;walk(state.doc?.root?.children,n=>{const l=n.layout||{};max=Math.max(max,(Number(l.y)||0)+Math.max(20,Number(l.height)||80)+48)});return Math.max(680,Math.ceil(max))}
    function renderCanvas(){const c=document.getElementById('canvas');if(!c||!state.doc)return;c.innerHTML='';c.classList.toggle('grid-on',!!state.grid);(state.doc.root.children||[]).forEach(n=>c.appendChild(renderNode(n)));const h=canvasHeight();c.style.height=h+'px';const stage=document.getElementById('canvasStage');if(stage){stage.style.height=(h+80)+'px';stage.style.width='1120px'}const zoom=document.getElementById('zoomLabel');if(zoom)zoom.textContent=Math.round((state.zoom||1)*100)+'%';c.style.transform=`scale(${state.zoom||1})`;const grid=document.getElementById('gridState');if(grid)grid.textContent=`Rács: ${state.grid?'BE':'KI'}`}
    function layerRow(n,depth){const wrap=document.createElement('div');wrap.className='layer-node';const row=document.createElement('div');row.className='layer hierarchy-layer';row.dataset.nodeId=n.id;row.style.paddingLeft=(10+depth*18)+'px';if(state.selected.includes(n.id))row.classList.add('selected');const has=!!n.children?.length;row.innerHTML=`<span class="layer-name"><span class="hierarchy-arrow">${has?'▾':'•'}</span>${n.locked?'🔒 ':''}${n.visible===false?'🚫 ':''}${escapeHtml(n.name||n.type)}</span><span>${escapeHtml(n.type)}</span>`;row.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();select(n.id,e)});wrap.appendChild(row);if(has){const kids=document.createElement('div');kids.className='layer-children';n.children.forEach(ch=>kids.appendChild(layerRow(ch,depth+1)));wrap.appendChild(kids)}return wrap}
    function renderLayers(){const box=document.getElementById('layers');if(!box||!state.doc)return;box.innerHTML='<div class="panel-head">Oldal szerkezete</div>';(state.doc.root.children||[]).forEach(n=>box.appendChild(layerRow(n,0)))}
    function render(){refresh()}
    function select(id,e={}){const n=find(id);if(!n)return;const multi=!!(e.ctrlKey||e.metaKey);let ids=[id];if(!multi&&n.groupId)ids=all().filter(x=>x.groupId===n.groupId).map(x=>x.id);if(multi){const set=new Set(state.selected);set.has(id)?set.delete(id):set.add(id);state.selected=[...set]}else state.selected=ids;renderCanvas();renderLayers();refreshInspector();updateSelection();return [...state.selected]}
    function selectAdd(id){if(!find(id))return;const set=new Set(state.selected);set.add(id);state.selected=[...set];renderCanvas();renderLayers();refreshInspector();updateSelection();return [...state.selected]}
    function selectRemove(id){state.selected=state.selected.filter(x=>x!==id);renderCanvas();renderLayers();refreshInspector();updateSelection();return [...state.selected]}
    function selectToggle(id){return state.selected.includes(id)?selectRemove(id):selectAdd(id)}
    function clearSelection(){if(!state.selected.length)return;state.selected=[];renderCanvas();renderLayers();refreshInspector();updateSelection()}
    function commit(label='Módosítás'){if(!state.doc)return false;state.history.push(clone(state.doc));if(state.history.length>100)state.history.shift();state.future=[];state.dirty=true;state.lastAction=label;legacy.updateSaveState?.();return true}
    function undo(){if(!state.history.length){legacy.show?.('Nincs visszavonható művelet');return false}state.future.push(clone(state.doc));state.doc=state.history.pop();state.selected=[];refresh();legacy.show?.('Visszavonva');return true}
    function redo(){if(!state.future.length){legacy.show?.('Nincs ismételhető művelet');return false}state.history.push(clone(state.doc));state.doc=state.future.pop();state.selected=[];refresh();legacy.show?.('Ismételve');return true}
    function absolutePosition(node,parent){let x=Number(node?.layout?.x)||0,y=Number(node?.layout?.y)||0,p=parent;while(p){x+=Number(p.layout?.x)||0;y+=Number(p.layout?.y)||0;p=parentOf(p.id)}return{x,y}}
    function localFromAbsolute(pos,parent){if(!parent)return{x:pos.x,y:pos.y};const p=absolutePosition(parent,parentOf(parent.id));return{x:pos.x-p.x,y:pos.y-p.y}}
    function detach(node){const old=parentOf(node.id),source=old?.children||state.doc.root.children,i=source.findIndex(x=>x.id===node.id);if(i<0)return null;source.splice(i,1);return old}
    function moveToParent(childId,parentId){const child=find(childId),parent=find(parentId);if(!child||!parent||child.id===parent.id||!isContainer(parent)||hasDescendant(child.id,parent.id))return false;const old=parentOf(child.id);if(old?.id===parent.id)return true;const pos=absolutePosition(child,old);detach(child);parent.children=parent.children||[];Object.assign(child.layout,localFromAbsolute(pos,parent));parent.children.push(child);return true}
    function addChildren(){if(state.selected.length<2){legacy.show?.('Jelöld ki a szülőt és legalább egy gyermeket');return false}const parent=find(state.selected[0]);if(!isContainer(parent)){legacy.show?.('Az első kijelölt elemnek konténernek kell lennie');return false}const children=state.selected.slice(1).map(find).filter(Boolean);if(children.some(n=>n.id===parent.id||hasDescendant(n.id,parent.id))){legacy.show?.('Érvénytelen hierarchia');return false}commit('hierarchy.nest');children.forEach(n=>moveToParent(n.id,parent.id));state.selected=[parent.id];refresh();legacy.show?.('Hierarchia frissítve');return true}
    function moveOut(){if(state.selected.length!==1){legacy.show?.('Egyetlen gyermekelemet jelölj ki');return false}const child=find(state.selected[0]),parent=child&&parentOf(child.id);if(!child||!parent){legacy.show?.('Ez az elem már a gyökérszinten van');return false}const grand=parentOf(parent.id),pos=absolutePosition(child,parent);commit('hierarchy.unnest');detach(child);const dest=grand?.children||state.doc.root.children;Object.assign(child.layout,localFromAbsolute(pos,grand));dest.push(child);refresh();legacy.show?.('Elem kiemelve');return true}
    function siblings(node){const p=parentOf(node.id);return p?(p.children||[]):(state.doc.root.children||[])}
    function normalizeZ(list){list.forEach((n,i)=>{n.zIndex=(i+1)*10})}
    function layerMove(direction){if(state.selected.length!==1){legacy.show?.('Jelölj ki egy elemet');return false}const n=find(state.selected[0]);if(!n)return false;const list=siblings(n);normalizeZ(list);let index=list.findIndex(x=>x.id===n.id);if(index<0)return false;let target=index;if(direction==='forward')target=index+1;else if(direction==='backward')target=index-1;else if(direction==='front')target=list.length-1;else if(direction==='back')target=0;else return false;if(target<0||target>=list.length||target===index){legacy.show?.('Az elem már ezen a rétegszinten van');return false}commit('layer.'+direction);const [item]=list.splice(index,1);list.splice(target,0,item);normalizeZ(list);refresh();legacy.show?.(direction==='forward'||direction==='front'?'Előrébb':'Hátrébb');return true}
    let drag=null;
    function pointerDown(e,id){if(e.button!==0)return;const n=find(id);if(!n||n.locked)return;const resize=e.target instanceof Element&&e.target.classList.contains('resize');if(e.ctrlKey||e.metaKey){select(id,e);e.preventDefault();return}const ids=n.groupId?all().filter(x=>x.groupId===n.groupId).map(x=>x.id):[id];drag={id,ids,startX:e.clientX,startY:e.clientY,resize,changed:false,nodes:ids.map(x=>{const m=find(x);return{id:x,x:Number(m.layout?.x)||0,y:Number(m.layout?.y)||0,w:Number(m.layout?.width)||200,h:Number(m.layout?.height)||80}})};select(id,e);window.addEventListener('pointermove',pointerMove);window.addEventListener('pointerup',pointerUp,{once:true});e.preventDefault()}
    function pointerMove(e){if(!drag)return;const dx=(e.clientX-drag.startX)/(state.zoom||1),dy=(e.clientY-drag.startY)/(state.zoom||1);if(!drag.changed){if(Math.abs(dx)<2&&Math.abs(dy)<2)return;commit(drag.resize?'resize':'move');drag.changed=true}if(drag.resize&&drag.nodes.length===1){const n=find(drag.nodes[0].id);if(n){n.layout.width=Math.max(20,Math.round(drag.nodes[0].w+dx));n.layout.height=Math.max(20,Math.round(drag.nodes[0].h+dy))}}else drag.nodes.forEach(base=>{const n=find(base.id);if(n){n.layout.x=gridSnap(base.x+dx);n.layout.y=gridSnap(base.y+dy)}});drag.nodes.forEach(base=>{const n=find(base.id),el=n&&document.querySelector(`[data-id="${cssId(n.id)}"]`);if(el){el.style.left=n.layout.x+'px';el.style.top=n.layout.y+'px';el.style.width=n.layout.width+'px';el.style.height=n.layout.height+'px'}});refreshInspector()}
    function pointerUp(){if(!drag)return;const changed=drag.changed;drag=null;window.removeEventListener('pointermove',pointerMove);if(changed)refresh()}
    function gridSnap(v){return state.snap?Math.round(v/8)*8:Math.round(v)}
    function installEvents(){const c=document.getElementById('canvas');if(!c||c.dataset.sanciCore==='3')return;c.dataset.sanciCore='3';c.addEventListener('pointerdown',e=>{const t=e.target instanceof Element?e.target:null;const node=t?.closest('.node');if(!node)return;e.stopImmediatePropagation();pointerDown(e,node.dataset.id)},true);c.addEventListener('click',e=>{const t=e.target instanceof Element?e.target:null;const node=t?.closest('.node');if(node){e.stopImmediatePropagation();select(node.dataset.id,e)}},true);const wrap=document.getElementById('canvasWrap');if(wrap)wrap.addEventListener('click',e=>{const t=e.target instanceof Element?e.target:null;if(t&&!t.closest('.node'))clearSelection()});document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'){e.preventDefault();e.shiftKey?redo():undo()}else if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='y'){e.preventDefault();redo()}else if(e.key==='Escape')clearSelection()})}
    const bind=(id,fn)=>{const el=document.getElementById(id);if(el)el.onclick=fn};
    bind('nestBtn',addChildren);bind('unnestBtn',moveOut);bind('layerForward',()=>layerMove('forward'));bind('layerBackward',()=>layerMove('backward'));bind('layerFront',()=>layerMove('front'));bind('layerBack',()=>layerMove('back'));bind('undo',undo);bind('redo',redo);
    const actions={select:{type:'selection.select',execute:select},clearSelection:{type:'selection.clear',execute:clearSelection},undo:{type:'history.undo',execute:undo},redo:{type:'history.redo',execute:redo},moveToParent:{type:'hierarchy.moveToParent',execute:moveToParent},moveOut:{type:'hierarchy.moveOut',execute:moveOut},layerMove:{type:'layer.move',execute:layerMove}};
    const api={schemaVersion:3,apiVersion:1,state,find,allNodes:all,parentOf,isContainer,hasDescendant,descendants,getSelection:()=>[...state.selected],getSelectedNodes:selectedNodes,select,selectAdd,selectRemove,selectToggle,clearSelection,commit,undo,redo,moveToParent,addChildren,moveOut,layerMove,render,renderCanvas,renderLayers,actions,execute(action,...args){if(typeof action==='string'&&actions[action])return actions[action].execute(...args);if(action?.type){const key=Object.keys(actions).find(k=>actions[k].type===action.type);if(key)return actions[key].execute(...(Array.isArray(action.args)?action.args:[]))}return false},capabilities:{centralSelection:true,hierarchy:true,history:true,layerOrder:true,keyboardHistory:true,validatedActions:true,aiReadyActions:true}};
    window.find=find;window.allNodes=all;window.commit=commit;window.undo=undo;window.redo=redo;window.select=select;window.clearSelection=clearSelection;window.renderCanvas=renderCanvas;window.renderLayers=renderLayers;window.render=render;window.pointerDown=pointerDown;window.SanciEditor=api;window.SanciHierarchy={parentOf,moveToParent,isContainer,hasDescendant,renderLayerTree:renderLayers};installEvents();render();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
