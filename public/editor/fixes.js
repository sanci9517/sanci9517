(()=>{
  const normalizeSearch=v=>String(v??'').toLocaleLowerCase('hu-HU').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
  const oldPopulate=window.populate;
  if(typeof oldPopulate==='function'){
    window.populate=(filter='')=>{
      const q=normalizeSearch(filter);
      oldPopulate('');
      const buttons=[...document.querySelectorAll('.element[data-add]')];
      let count=0;
      buttons.forEach(btn=>{
        const type=normalizeSearch(btn.dataset.add||'');
        const span=normalizeSearch(btn.querySelector('span')?.textContent||'');
        const title=normalizeSearch(btn.title||'');
        const match=!q||`${type} ${span} ${title}`.includes(q);
        btn.hidden=!match;
        if(match)count++;
      });
      const empty=document.getElementById('searchEmpty');
      if(empty)empty.hidden=count!==0||!q;
      document.querySelectorAll('#basic,#layout,#content,#navigation,#forms,#media,#sanci,#advanced').forEach(box=>{
        const details=box.closest('details');
        const visible=[...box.querySelectorAll('.element[data-add]')].some(btn=>!btn.hidden);
        if(details){details.hidden=Boolean(q&&!visible);if(q&&visible)details.open=true;}
      });
    };
  }
})();
