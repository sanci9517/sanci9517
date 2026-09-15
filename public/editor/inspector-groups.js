(()=>{
  const inspector=()=>document.getElementById('inspector');
  const key=d=>d.dataset.inspectorKey||d.querySelector('summary')?.textContent.trim()||'';
  const states=new Map();
  let restoring=false;
  let observer=null;
  const remember=()=>{
    const box=inspector();
    if(!box)return;
    box.querySelectorAll(':scope > details.inspect-section').forEach(d=>states.set(key(d),d.open));
  };
  const restore=()=>{
    const box=inspector();
    if(!box||restoring)return;
    restoring=true;
    box.querySelectorAll(':scope > details.inspect-section').forEach(d=>{
      const k=key(d);
      if(states.has(k))d.open=states.get(k);
    });
    restoring=false;
  };
  document.addEventListener('toggle',e=>{
    const d=e.target;
    if(!(d instanceof HTMLDetailsElement)||!d.classList.contains('inspect-section')||restoring)return;
    states.set(key(d),d.open);
  },true);
  const boot=()=>{
    const box=inspector();
    if(!box)return;
    remember();
    observer=new MutationObserver(()=>requestAnimationFrame(restore));
    observer.observe(box,{childList:true,subtree:true});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
