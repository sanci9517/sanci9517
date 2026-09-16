/* Sanci9517 Visual Editor — Inspector draft/apply bridge.
   Keeps the Inspector DOM as a draft until Apply, then commits one canonical model update. */
(function(){
  'use strict';
  function boot(){
    const E=window.SanciEditor;
    const C=window.SanciEditorCanvas;
    const Layers=window.SanciEditorLayers;
    if(!E||!C||!Layers)return setTimeout(boot,50);
    const state=E.getState();
    const box=()=>document.getElementById('inspector');
    const selected=()=>state.selection.length===1?window.SanciEditorState.getNode(state,state.selection[0]):null;
    const value=k=>box()?.querySelector(`[data-key="${k}"]`)?.value ?? '';
    const has=k=>!!box()?.querySelector(`[data-key="${k}"]`);
    const num=k=>Number(value(k))||0;
    function commit(){
      const n=selected();
      if(!n)return;
      const patch={name:value('name'),content:{}};
      ['text','url','src','alt','html'].forEach(k=>{if(has(k))patch.content[k]=value(k)});
      const layout={};
      ['x','y','width','height','padding','margin','gap','minWidth','maxWidth','minHeight','maxHeight'].forEach(k=>{if(has(k))layout[k]=num(k)});
      ['position','display'].forEach(k=>{if(has(k))layout[k]=value(k)});
      const style={};
      ['fontSize','opacity','radius'].forEach(k=>{if(has(k))style[k]=num(k)});
      ['fontWeight','textAlign','border'].forEach(k=>{if(has(k))style[k]=value(k)});
      const visibility=box()?.querySelector('[data-behavior="visibility"]');
      const locked=box()?.querySelector('[data-behavior="locked"]');
      patch.layout=layout;patch.style=style;
      if(visibility)patch.visibility=visibility.checked;
      if(locked)patch.locked=locked.checked;
      const r=E.dispatch({type:'element.update',id:n.id,patch});
      if(!r.ok){window.SanciEditorUI?.toast?.(r.error||'A módosítás nem sikerült');return}
      state.dirty=true;
      C.render(state,document.getElementById('canvas'));
      Layers.render(state,document.getElementById('layers'));
      const fresh=window.SanciEditorState.getNode(state,n.id);
      if(fresh){
        ['name','text','url','src','alt','html'].forEach(k=>{
          const el=box()?.querySelector(`[data-key="${k}"]`);
          if(!el)return;
          if(k==='name')el.value=fresh.name||'';
          else el.value=fresh.content?.[k]||'';
        });
      }
      const t=document.getElementById('toast');
      if(t){t.textContent='Tulajdonságok mentve';t.classList.add('show');clearTimeout(t._timer);t._timer=setTimeout(()=>t.classList.remove('show'),2200)}
    }
    document.addEventListener('click',function(ev){
      const target=ev.target;
      if(!(target instanceof HTMLElement)||target.id!=='inspector')return;
    },true);
    document.addEventListener('click',function(ev){
      const target=ev.target;
      if(!(target instanceof HTMLElement))return;
      if(target.matches('#inspector button')&&target.textContent.trim()==='Alkalmaz'){
        ev.preventDefault();ev.stopImmediatePropagation();commit();
      }
    },true);
  }
  boot();
})();
