(()=>{
  const btn=document.getElementById('previewBtn');
  if(!btn)return;
  btn.onclick=()=>{
    const select=document.getElementById('pageSelect');
    const slug=select?.selectedOptions?.[0]?.dataset?.slug;
    const pageId=select?.value;
    if(!pageId){
      const toast=document.getElementById('toast');
      if(toast){toast.textContent='Nincs kiválasztott oldal';toast.classList.add('show');}
      return;
    }
    fetch(`/api/admin/editor?pageId=${encodeURIComponent(pageId)}`,{credentials:'include'})
      .then(r=>r.json())
      .then(j=>{
        const s=j?.data?.page?.slug||slug||'';
        if(!s)throw new Error('Az oldal slugja hiányzik');
        window.open('/p/'+encodeURIComponent(s)+'?preview=1','_blank','noopener');
      })
      .catch(e=>{
        const toast=document.getElementById('toast');
        if(toast){toast.textContent=e.message||'Előnézeti hiba';toast.classList.add('show');}
      });
  };
})();
