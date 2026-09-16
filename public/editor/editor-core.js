/*
 * Sanci9517 Visual Editor Core v1
 *
 * Architecture rules:
 * - Document tree is the source of truth.
 * - Selection is one central state shared by Canvas and Layers.
 * - Layers are a view of the document hierarchy, never a second model.
 * - History stores document snapshots at action boundaries.
 * - AI integration later uses these same stable node/action APIs.
 *
 * This module intentionally sits on top of the existing editor while the
 * older feature modules are retired. It does not change the saved document
 * schema, so existing pages remain compatible.
 */
(()=>{
  const boot=()=>{
    if(!window.state||!window.find||!window.render)return;
    const state=window.state;
    const original={
      render:window.render,
      renderCanvas:window.renderCanvas,
      renderInspector:window.renderInspector,
      show:window.show,
      commit:window.commit,
      updateSelectionState:window.updateSelectionState
    };

    const walk=(nodes,fn)=>{for(const n of nodes||[]){fn(n);walk(n.children||[],fn)}};
    const parentOf=(id,nodes=state.doc?.root?.children)=>{
      for(const n of nodes||[]){
        if((n.children||[]).some(c=>c.id===id))return n;
        const p=parentOf(id,n.children||[]);if(p)return p;
      }
      return null;
    };
    const isContainer=n=>!!n&&new Set(['root','section','container','row','columns','grid','stack','flex','group','card']).has(n.type);
    const descendants=(id)=>{const n=window.find(id);const out=[];walk(n?.children||[],x=>out.push(x));return out};
    const isDescendant=(ancestorId,targetId)=>descendants(ancestorId).some(n=>n.id===targetId);
    const absolutePosition=(n,parent)=>{
      let x=Number(n?.layout?.x)||0,y=Number(n?.layout?.y)||0,p=parent;
      while(p){x+=Number(p.layout?.x)||0;y+=Number(p.layout?.y)||0;p=parentOf(p.id)}
      return {x,y};
    };
    const localFromAbsolute=(abs,parent)=>({x:abs.x-(Number(parent?.layout?.x)||0),y:abs.y-(Number(parent?.layout?.y)||0)});

    function selection(ids,mode='replace'){
      const valid=[...new Set((ids||[]).filter(id=>window.find(id)))];
      if(mode==='add')state.selected=[...new Set([...state.selected,...valid])];
      else if(mode==='remove')state.selected=state.selected.filter(id=>!valid.includes(id));
      else if(mode==='toggle'){
        const s=new Set(state.selected);valid.forEach(id=>s.has(id)?s.delete(id):s.add(id));state.selected=[...s];
      }else state.selected=valid;
      original.renderCanvas?.();original.renderInspector?.();renderLayers();original.updateSelectionState?.();
      return state.selected;
    }
    const select=(id,e={})=>selection([id],e.ctrlKey||e.metaKey?'toggle':'replace');
    const clearSelection=()=>selection([],'replace');

    /* One authoritative layer renderer. */
    function renderLayers(){
      const box=document.getElementById('layers');if(!box||!state.doc)return;
      box.innerHTML='<div class="panel-head">Oldal szerkezete</div>';
      const make=(n,depth=0)=>{
        const wrap=document.createElement('div');wrap.className='layer-node';
        const row=document.createElement('div');row.className='layer hierarchy-layer';row.dataset.nodeId=n.id;
        row.style.paddingLeft=(10+depth*18)+'px';
        if(state.selected.includes(n.id))row.classList.add('selected');
        const has=!!n.children?.length;
        row.innerHTML=`<span class="layer-name"><span class="hierarchy-arrow">${has?'▾':'•'}</span>${n.locked?'🔒 ':''}${n.hidden?'👁‍🗨 ':''}${escapeHtml(n.name)}</span><span>${escapeHtml(n.type)}</span>`;
        row.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();select(n.id,e)});
        wrap.appendChild(row);
        if(has){const kids=document.createElement('div');kids.className='layer-children';n.children.forEach(ch=>kids.appendChild(make(ch,depth+1)));wrap.appendChild(kids)}
        return wrap;
      };
      (state.doc.root.children||[]).forEach(n=>box.appendChild(make(n)));
    }
    const escapeHtml=v=>String(v??'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));

    /* Canvas uses the same selection engine. Capture phase prevents a parent
       DOM node from stealing an event that originated on a child. */
    const canvas=document.getElementById('canvas');
    if(canvas&&!canvas.dataset.coreSelectionReady){
      canvas.dataset.coreSelectionReady='1';
      canvas.addEventListener('pointerdown',e=>{
        const target=e.target instanceof Element?e.target:null;
        const node=target?.closest?.('.node');if(!node||!canvas.contains(node))return;
        const id=node.dataset.id;if(!id)return;
        e.stopImmediatePropagation();
        const syntheticTarget=e.target;
        const eventForDrag=e;
        const n=window.find(id);if(!n||n.locked)return;
        const resize=syntheticTarget?.classList?.contains('resize');
        if(typeof window.pointerDown==='function'){
          /* Temporarily make the resize hit look like the owning node while
             retaining the original event coordinates/modifier keys. */
          if(resize)Object.defineProperty(e,'target',{configurable:true,value:node});
          window.pointerDown(eventForDrag,id);
        }else select(id,e);
      },true);
      canvas.addEventListener('click',e=>{
        const target=e.target instanceof Element?e.target:null;
        const node=target?.closest?.('.node');if(!node||!canvas.contains(node))return;
        e.stopImmediatePropagation();select(node.dataset.id,e);
      },true);
    }

    /* White canvas area = clear selection. */
    const wrap=document.getElementById('canvasWrap');
    if(wrap&&!wrap.dataset.coreClearReady){
      wrap.dataset.coreClearReady='1';
      wrap.addEventListener('click',e=>{if(!(e.target instanceof Element)?.closest?.('.node'))clearSelection()},true);
    }

    /* Correct, hierarchy-aware nesting. */
    const moveToParent=(childId,parentId)=>{
      const child=window.find(childId),parent=window.find(parentId);
      if(!child||!parent||child.id===parent.id||!isContainer(parent)||isDescendant(child.id,parent.id))return false;
      const oldParent=parentOf(child.id);if(oldParent?.id===parent.id)return true;
      const abs=absolutePosition(child,oldParent);
      const source=oldParent?.children||state.doc.root.children;
      const index=source.findIndex(n=>n.id===child.id);if(index<0)return false;
      source.splice(index,1);parent.children=parent.children||[];
      const local=localFromAbsolute(abs,parent);child.layout=child.layout||{};child.layout.x=local.x;child.layout.y=local.y;
      parent.children.push(child);return true;
    };
    const addChildren=()=>{
      const selected=state.selected.map(id=>window.find(id)).filter(Boolean);
      if(selected.length<2){original.show?.('Jelöld ki a szülőt és legalább egy gyermekelemet');return}
      const parent=selected[0];if(!isContainer(parent)){original.show?.('Az első kijelölt elemnek konténernek kell lennie');return}
      const children=selected.slice(1);if(children.some(n=>n.id===parent.id||isDescendant(n.id,parent.id))){original.show?.('Érvénytelen hierarchia: körkörös kapcsolat');return}
      window.commit();children.forEach(n=>moveToParent(n.id,parent.id));selection([parent.id]);original.show?.(`${children.length} elem a(z) „${parent.name}” gyermekévé vált`);
    };
    const moveOut=()=>{
      if(state.selected.length!==1){original.show?.('Egyetlen gyermekelemet jelölj ki');return}
      const child=window.find(state.selected[0]),parent=parentOf(child?.id);if(!child||!parent){original.show?.('Ez az elem már a gyökérszinten van');return}
      const grand=parentOf(parent.id);const abs=absolutePosition(child,parent);window.commit();
      const source=parent.children||[],i=source.findIndex(n=>n.id===child.id);if(i<0)return;source.splice(i,1);
      const dest=grand?.children||state.doc.root.children;child.layout=child.layout||{};const local=localFromAbsolute(abs,grand);child.layout.x=local.x;child.layout.y=local.y;dest.push(child);
      selection([child.id]);original.show?.('Elem kiemelve a szülőből');
    };

    /* History is exposed through one stable API. */
    const undo=()=>{
      if(!state.history.length){original.show?.('Nincs visszavonható művelet');return false}
      state.future.push(JSON.parse(JSON.stringify(state.doc)));state.doc=state.history.pop();state.selected=[];original.render?.();return true;
    };
    const redo=()=>{
      if(!state.future.length){original.show?.('Nincs ismételhető művelet');return false}
      state.history.push(JSON.parse(JSON.stringify(state.doc)));state.doc=state.future.pop();state.selected=[];original.render?.();return true;
    };

    /* Layer order is model data, not DOM order. */
    const siblingNodes=n=>{const p=parentOf(n.id);return p?(p.children||[]):(state.doc?.root?.children||[])};
    const ensureZ=nodes=>{const bad=nodes.some(n=>!Number.isFinite(Number(n.zIndex)));if(bad)nodes.forEach((n,i)=>n.zIndex=i+1)};
    const layerMove=(direction)=>{
      if(state.selected.length!==1){original.show?.('Jelölj ki egy elemet');return false}
      const n=window.find(state.selected[0]);if(!n)return false;const siblings=siblingNodes(n);ensureZ(siblings);
      const ordered=[...siblings].sort((a,b)=>(Number(a.zIndex)||0)-(Number(b.zIndex)||0));const i=ordered.findIndex(x=>x.id===n.id);
      if(direction==='forward'&&i<ordered.length-1){window.commit();const o=ordered[i+1];[n.zIndex,o.zIndex]=[o.zIndex,n.zIndex]}
      else if(direction==='backward'&&i>0){window.commit();const o=ordered[i-1];[n.zIndex,o.zIndex]=[o.zIndex,n.zIndex]}
      else if(direction==='front'){window.commit();n.zIndex=Math.max(...ordered.map(x=>Number(x.zIndex)||0))+1}
      else if(direction==='back'){window.commit();n.zIndex=Math.min(...ordered.map(x=>Number(x.zIndex)||0))-1}
      else {original.show?.(direction==='forward'?'Már a legelőrébb lévő réteg':'Már a leghátrébb lévő réteg');return false}
      original.render?.();return true;
    };

    /* Public, AI-ready editor contract. Future agents use this API rather
       than touching DOM internals. */
    window.SanciEditor={
      state,find,parentOf,isContainer,hasDescendant:isDescendant,
      select,selectAdd:id=>selection([id],'add'),selectRemove:id=>selection([id],'remove'),selectToggle:id=>selection([id],'toggle'),clearSelection,
      getSelection:()=>[...state.selected],getSelectedNodes:()=>state.selected.map(id=>window.find(id)).filter(Boolean),
      render:original.render,renderCanvas:original.renderCanvas,renderInspector:original.renderInspector,renderLayers,
      commit:window.commit,undo,redo,moveToParent,addChildren,moveOut,layerMove,
      actions:{select,clearSelection,moveToParent,moveOut,layerMove},
      schemaVersion:1
    };
    window.select=select;window.clearSelection=clearSelection;window.renderLayers=renderLayers;window.undo=undo;window.redo=redo;
    window.SanciHierarchy={parentOf,moveToParent,isContainer,hasDescendant:isDescendant,renderLayerTree:renderLayers};
    if(document.getElementById('nestBtn'))document.getElementById('nestBtn').onclick=addChildren;
    if(document.getElementById('unnestBtn'))document.getElementById('unnestBtn').onclick=moveOut;
    renderLayers();original.updateSelectionState?.();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
