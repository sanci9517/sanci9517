(()=>{
  const inspector=()=>document.getElementById('inspector');
  let scrollTop=0;
  let restoreTimer=0;
  const remember=()=>{const b=inspector();if(b)scrollTop=b.scrollTop};
  const restore=()=>{clearTimeout(restoreTimer);restoreTimer=setTimeout(()=>{const b=inspector();if(!b)return;b.scrollTop=scrollTop;b.querySelectorAll('.inspect-section').forEach(d=>{if(!d.dataset.userCollapsed)d.open=true});},0)};
  document.addEventListener('click',e=>{const b=inspector();if(!b||!b.contains(e.target))return;remember();restore();},true);
  document.addEventListener('change',e=>{const b=inspector();if(!b||!b.contains(e.target))return;remember();restore();},true);
  const addPickers=()=>{
    const b=inspector();if(!b)return;
    b.querySelectorAll('input[data-key="style.color"],input[data-key="style.background"]').forEach(text=>{
      if(text.nextElementSibling?.matches('input.editor-color-picker'))return;
      const picker=document.createElement('input');picker.type='color';picker.className='editor-color-picker';
      picker.value=/^#[0-9a-f]{6}$/i.test(text.value)?text.value:'#000000';
      picker.title='Szín kiválasztása';
      picker.addEventListener('input',()=>{text.value=picker.value;text.dispatchEvent(new Event('change',{bubbles:true}))});
      text.insertAdjacentElement('afterend',picker);
    });
  };
  const mo=new MutationObserver(()=>{addPickers();restore()});
  window.addEventListener('DOMContentLoaded',()=>{const b=inspector();if(b)mo.observe(b,{childList:true,subtree:true});addPickers()});
  addPickers();
})();
