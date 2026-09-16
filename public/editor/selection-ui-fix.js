(()=>{
  const boot=()=>{
    const canvas=document.getElementById('canvas');
    const wrap=document.getElementById('canvasWrap');
    const clear=()=>{window.clearSelection?.();window.SanciEditor?.clearSelection?.()};
    if(canvas)canvas.addEventListener('click',e=>{if(!e.target.closest('.node'))clear()},true);
    if(wrap)wrap.addEventListener('click',e=>{if(!e.target.closest('.node'))clear()},true);
    const sync=()=>window.SanciHierarchy?.renderLayerTree?.();
    sync();
    const box=document.getElementById('layers');
    if(box){
      let rendering=false,scheduled=false;
      const observer=new MutationObserver(()=>{
        if(rendering||scheduled)return;
        scheduled=true;
        requestAnimationFrame(()=>{
          scheduled=false;
          if(rendering)return;
          rendering=true;
          observer.disconnect();
          sync();
          observer.observe(box,{childList:true,subtree:true});
          rendering=false;
        });
      });
      observer.observe(box,{childList:true,subtree:true});
    }
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();