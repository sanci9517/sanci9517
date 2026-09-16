/* Sanci9517 Visual Editor — atomic inspector Apply bridge. */
(function(){
  'use strict';
  function boot(){
    const E=window.SanciEditor;
    const S=window.SanciEditorState;
    const inspector=document.getElementById('inspector');
    if(!E||!S||!inspector)return;
    inspector.addEventListener('click',function(event){
      const button=event.target.closest('button.btn.primary');
      if(!button)return;
      event.preventDefault();
      event.stopPropagation();
      const selected=E.getState().selection||[];
      if(selected.length!==1)return;
      const id=selected[0];
      const value=key=>inspector.querySelector(`[data-key="${key}"]`)?.value??'';
      const has=key=>Boolean(inspector.querySelector(`[data-key="${key}"]`));
      const content={};
      ['text','url','src','alt','html'].forEach(key=>{if(has(key))content[key]=value(key)});
      const layout={};
      ['x','y','width','height','padding','margin','gap','minWidth','maxWidth','minHeight','maxHeight'].forEach(key=>{if(has(key))layout[key]=Number(value(key))||0});
      ['position','display'].forEach(key=>{if(has(key))layout[key]=value(key)});
      const style={};
      ['fontSize','opacity','radius'].forEach(key=>{if(has(key))style[key]=Number(value(key))});
      ['fontWeight','textAlign','border'].forEach(key=>{if(has(key))style[key]=value(key)});
      const visibility=inspector.querySelector('[data-behavior="visibility"]');
      const locked=inspector.querySelector('[data-behavior="locked"]');
      const result=E.dispatch({
        type:'element.update',
        id,
        patch:{
          name:value('name'),
          content,
          layout,
          style,
          ...(visibility?{visibility:visibility.checked}:{}),
          ...(locked?{locked:locked.checked}:{})
        }
      });
      if(!result.ok){
        const toast=document.getElementById('toast');
        if(toast){toast.textContent=result.error||'A művelet nem hajtható végre';toast.classList.add('show');}
        return;
      }
      E.getState().dirty=true;
      const toast=document.getElementById('toast');
      if(toast){toast.textContent='Tulajdonságok mentve';toast.classList.add('show');clearTimeout(boot.timer);boot.timer=setTimeout(()=>toast.classList.remove('show'),2200)}
    },true);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
