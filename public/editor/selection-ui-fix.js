(()=>{
  const boot=()=>{
    const canvas=document.getElementById('canvas');
    const wrap=document.getElementById('canvasWrap');
    if(canvas){
      canvas.addEventListener('click',e=>{
        if(!e.target.closest('.node')){
          window.clearSelection?.();
          if(window.SanciEditor?.clearSelection) window.SanciEditor.clearSelection();
        }
      },true);
    }
    if(wrap){
      wrap.addEventListener('click',e=>{
        if(!e.target.closest('.node')){
          window.clearSelection?.();
          window.SanciEditor?.clearSelection?.();
        }
      },true);
    }
    const sync=()=>window.SanciHierarchy?.renderLayerTree?.();
    sync();
    const box=document.getElementById('layers');
    if(box){
      let scheduled=false;
      new MutationObserver(()=>{
        if(scheduled)return;
        scheduled=true;
        requestAnimationFrame(()=>{scheduled=false;sync()});
      }).observe(box,{childList:true,subtree:true});
    }
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();