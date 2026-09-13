(()=>{
  function bind(){
    const ws=document.querySelector('.workspace');
    const toolbar=document.querySelector('.toolbar');
    if(!ws||!toolbar||document.getElementById('lockBtn'))return;
    const anchor=document.getElementById('ungroupBtn')||document.getElementById('groupBtn');
    if(!anchor)return;
    const b=document.createElement('button');
    b.id='lockBtn';
    b.type='button';
    b.title='Kijelölt elem zárolása / feloldása';
    b.textContent='🔒';
    b.onclick=()=>{
      const api=window.SanciEditor;
      if(!api?.state?.selected?.length)return;
      const nodes=api.state.selected.map(id=>api.find(id)).filter(Boolean);
      if(!nodes.length)return;
      const shouldLock=!nodes.every(n=>n.locked);
      api.commit();
      nodes.forEach(n=>{n.locked=shouldLock});
      api.render();
      api.show(shouldLock?`${nodes.length} elem zárolva`:`${nodes.length} elem feloldva`);
      sync();
    };
    anchor.insertAdjacentElement('afterend',b);
    sync();
  }
  function sync(){
    const b=document.getElementById('lockBtn');
    const api=window.SanciEditor;
    if(!b||!api)return;
    const nodes=(api.state.selected||[]).map(id=>api.find(id)).filter(Boolean);
    const allLocked=nodes.length>0&&nodes.every(n=>n.locked);
    b.textContent=allLocked?'🔓':'🔒';
    b.title=allLocked?'Kijelölt elem feloldása':'Kijelölt elem zárolása';
    b.disabled=!nodes.length;
    b.style.opacity=nodes.length?'1':'.45';
  }
  const style=document.createElement('style');
  style.textContent='#lockBtn{cursor:pointer}#lockBtn:disabled{cursor:not-allowed}';
  document.head.appendChild(style);
  const timer=setInterval(()=>{
    bind();
    sync();
    if(document.getElementById('lockBtn'))clearInterval(timer);
  },250);
})();