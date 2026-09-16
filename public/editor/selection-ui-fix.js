(()=>{
  const boot=()=>{
    const canvas=document.getElementById('canvas');
    const wrap=document.getElementById('canvasWrap');
    const clear=()=>window.clearSelection?.();
    if(canvas)canvas.addEventListener('click',e=>{if(!e.target.closest('.node'))clear()},true);
    if(wrap)wrap.addEventListener('click',e=>{if(!e.target.closest('.node'))clear()},true);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();