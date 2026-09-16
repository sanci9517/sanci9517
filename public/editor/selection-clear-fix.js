/* Blank-area selection clearing: final capture-phase guard after editor interaction handlers. */
(()=>{
 const start=()=>{
  const clear=()=>{
   const s=window.state;
   if(!s||!Array.isArray(s.selected)||!s.selected.length)return;
   s.selected=[];
   window.render?.();
  };
  document.addEventListener('pointerdown',e=>{
   const t=e.target instanceof Element?e.target:null;
   if(!t||t.closest('#layers,.canvas-tools,.topbar,.bottom,.panel,.node,button,input,select,textarea,a,[contenteditable="true"]'))return;
   if(t.closest('#canvas,#canvasWrap,.canvas-stage,.canvas-area')){
    clear();
    e.stopImmediatePropagation();
   }
  },true);
  document.addEventListener('keydown',e=>{
   if(e.key==='Escape'){
    e.preventDefault();
    clear();
   }
  },true);
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
