(()=>{
  const key=d=>d.querySelector('summary')?.textContent.trim()||'';
  const states=new Map();
  let applying=false;
  const inspector=()=>document.getElementById('inspector');
  const remember=()=>{
    const box=inspector();
    if(!box)return;
    box.querySelectorAll(':scope > details.inspect-section').forEach(d=>states.set(key(d),d.open));
  };
  const compact=()=>{
    const box=inspector();
    if(!box||applying)return;
    applying=true;
    box.querySelectorAll(':scope > details.inspect-section').forEach(d=>{
      const k=key(d);
      d.open=states.has(k)?states.get(k):false;
    });
    applying=false;
  };
  document.addEventListener('toggle',e=>{
    const d=e.target;
    if(!(d instanceof HTMLDetailsElement)||!d.classList.contains('inspect-section')||applying)return;
    states.set(key(d),d.open);
  },true);
  const mo=new MutationObserver(()=>requestAnimationFrame(compact));
  const boot=()=>{
    const box=inspector();
    if(!box)return;
    mo.observe(box,{childList:true,subtree:true});
    compact();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
