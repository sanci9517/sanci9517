(()=>{
  const btn=document.getElementById('previewBtn');
  if(!btn)return;
  btn.onclick=()=>{
    const pageId=document.getElementById('pageSelect')?.value;
    if(!pageId){
      const toast=document.getElementById('toast');
      if(toast){toast.textContent='Nincs kiválasztott oldal';toast.classList.add('show');}
      return;
    }
    window.open('/editor/preview.html?pageId='+encodeURIComponent(pageId),'_blank','noopener');
  };
})();
