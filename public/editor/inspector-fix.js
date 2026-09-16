/* Sanci9517 Visual Editor — Inspector draft/apply bridge.
   The Inspector is a draft form. Apply commits the complete draft in ONE canonical update.
   Draft values survive editor re-renders until Apply or selection changes. */
(function(){
  'use strict';
  function boot(){
    const E=window.SanciEditor;
    const C=window.SanciEditorCanvas;
    const Layers=window.SanciEditorLayers;
    const S=window.SanciEditorState;
    if(!E||!C||!Layers||!S)return setTimeout(boot,50);
    const state=E.getState();
    const box=()=>document.getElementById('inspector');
    const selected=()=>state.selection.length===1?S.getNode(state,state.selection[0]):null;
    const drafts=new Map();
    let restoring=false;

    const keys=['name','text','url','src','alt','html','x','y','width','height','padding','margin','gap','minWidth','maxWidth','minHeight','maxHeight','position','display','fontSize','fontWeight','textAlign','opacity','radius','border'];
    const value=k=>box()?.querySelector(`[data-key="${k}"]`)?.value ?? '';
    const has=k=>!!box()?.querySelector(`[data-key="${k}"]`);
    const num=k=>Number(value(k))||0;

    function captureDraft(){
      if(restoring)return;
      const n=selected();
      if(!n||!box())return;
      const d=drafts.get(n.id)||{};
      keys.forEach(k=>{if(has(k))d[k]=value(k)});
      const visibility=box().querySelector('[data-behavior="visibility"]');
      const locked=box().querySelector('[data-behavior="locked"]');
      if(visibility)d.visibility=visibility.checked;
      if(locked)d.locked=locked.checked;
      drafts.set(n.id,d);
    }

    function modelValues(n){
      return {
        name:n.name||'',
        text:n.content?.text||'',url:n.content?.url||'',src:n.content?.src||'',alt:n.content?.alt||'',html:n.content?.html||'',
        x:n.layout?.x??0,y:n.layout?.y??0,width:n.layout?.width??300,height:n.layout?.height??100,
        padding:n.layout?.padding??0,margin:n.layout?.margin??0,gap:n.layout?.gap??0,
        minWidth:n.layout?.minWidth??0,maxWidth:n.layout?.maxWidth??0,minHeight:n.layout?.minHeight??0,maxHeight:n.layout?.maxHeight??0,
        position:n.layout?.position||'absolute',display:n.layout?.display||'block',
        fontSize:n.style?.fontSize??16,fontWeight:n.style?.fontWeight??400,textAlign:n.style?.textAlign||'left',
        opacity:n.style?.opacity??1,radius:n.style?.radius??0,border:n.style?.border||'none',
        visibility:n.visibility!==false,locked:!!n.locked
      };
    }

    function restoreDraft(){
      const n=selected();
      if(!n||!box())return;
      const d=drafts.get(n.id);
      if(!d)return;
      const model=modelValues(n);
      restoring=true;
      try{
        keys.forEach(k=>{
          const el=box().querySelector(`[data-key="${k}"]`);
          if(el&&d[k]!==undefined)el.value=String(d[k]);
        });
        const visibility=box().querySelector('[data-behavior="visibility"]');
        const locked=box().querySelector('[data-behavior="locked"]');
        if(visibility&&d.visibility!==undefined)visibility.checked=!!d.visibility;
        if(locked&&d.locked!==undefined)locked.checked=!!d.locked;
      }finally{restoring=false}
    }

    function commit(){
      const n=selected();
      if(!n)return;
      captureDraft();
      const d=drafts.get(n.id)||{};
      const patch={name:d.name!==undefined?d.name:value('name'),content:{}};
      ['text','url','src','alt','html'].forEach(k=>{if(has(k))patch.content[k]=d[k]!==undefined?d[k]:value(k)});
      const layout={};
      ['x','y','width','height','padding','margin','gap','minWidth','maxWidth','minHeight','maxHeight'].forEach(k=>{if(has(k))layout[k]=Number(d[k]!==undefined?d[k]:value(k))||0});
      ['position','display'].forEach(k=>{if(has(k))layout[k]=d[k]!==undefined?d[k]:value(k)});
      const style={};
      ['fontSize','opacity','radius'].forEach(k=>{if(has(k))style[k]=Number(d[k]!==undefined?d[k]:value(k))||0});
      ['fontWeight','textAlign','border'].forEach(k=>{if(has(k))style[k]=d[k]!==undefined?d[k]:value(k)});
      const visibility=box()?.querySelector('[data-behavior="visibility"]');
      const locked=box()?.querySelector('[data-behavior="locked"]');
      patch.layout=layout;patch.style=style;
      patch.visibility=visibility?visibility.checked:(d.visibility!==undefined?d.visibility:n.visibility!==false);
      patch.locked=locked?locked.checked:(d.locked!==undefined?d.locked:!!n.locked);

      const r=E.dispatch({type:'element.update',id:n.id,patch});
      if(!r.ok){window.SanciEditorUI?.toast?.(r.error||'A módosítás nem sikerült');return}
      drafts.delete(n.id);

      /* E.dispatch emits a canonical state change. app.js may rebuild the Inspector here. */
      const fresh=S.getNode(state,n.id);
      if(fresh){
        const m=modelValues(fresh);
        restoring=true;
        try{
          keys.forEach(k=>{const el=box()?.querySelector(`[data-key="${k}"]`);if(el)el.value=String(m[k]??'')});
          const vi=box()?.querySelector('[data-behavior="visibility"]');
          const li=box()?.querySelector('[data-behavior="locked"]');
          if(vi)vi.checked=m.visibility;if(li)li.checked=m.locked;
        }finally{restoring=false}
      }
      C.render(state,document.getElementById('canvas'));
      Layers.render(state,document.getElementById('layers'));
      const t=document.getElementById('toast');
      if(t){t.textContent='Tulajdonságok mentve';t.classList.add('show');clearTimeout(t._timer);t._timer=setTimeout(()=>t.classList.remove('show'),2200)}
    }

    document.addEventListener('input',function(ev){
      const target=ev.target;
      if(!(target instanceof HTMLInputElement||target instanceof HTMLTextAreaElement||target instanceof HTMLSelectElement))return;
      if(target.closest('#inspector')&&!restoring)captureDraft();
    },true);
    document.addEventListener('change',function(ev){
      const target=ev.target;
      if(target instanceof HTMLElement&&target.closest('#inspector')&&!restoring)captureDraft();
    },true);

    const observer=new MutationObserver(()=>{restoreDraft()});
    const observe=()=>{const b=box();if(b){observer.disconnect();observer.observe(b,{childList:true,subtree:true});restoreDraft()}else setTimeout(observe,100)};
    observe();

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
