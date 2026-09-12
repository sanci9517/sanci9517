(()=>{
  const inspector=()=>document.getElementById('inspector');
  let scrollTop=0;
  const remember=()=>{const b=inspector();if(b)scrollTop=b.scrollTop};
  const restore=()=>{requestAnimationFrame(()=>{const b=inspector();if(!b)return;b.scrollTop=scrollTop;b.querySelectorAll('.inspect-section').forEach(d=>{if(!d.dataset.userCollapsed)d.open=true})})};
  const valueFor=el=>el.type==='checkbox'?el.checked:el.type==='number'?Number(el.value):el.value;
  const originalSetField=window.setField;
  const applyField=(el,value=valueFor(el))=>{
    if(typeof originalSetField!=='function')return;
    const oldInspector=window.renderInspector;
    try{window.renderInspector=()=>{};originalSetField(el.dataset.key,value)}finally{window.renderInspector=oldInspector}
    restore();
  };
  const presetMap={
    'layout.position':[['Abszolút','absolute'],['Relatív','relative'],['Normál','static']],
    'layout.display':[['Blokk','block'],['Flex','flex'],['Rács','grid'],['Inline blokk','inline-block']],
    'layout.gap':[['Nincs','0'],['Kicsi','8'],['Normál','12'],['Közepes','16'],['Nagy','24'],['Extra nagy','32']],
    'layout.padding':[['Nincs','0'],['Kicsi','8'],['Normál','12'],['Közepes','16'],['Nagy','24'],['Extra nagy','32']],
    'style.fontSize':[['Kicsi','14'],['Normál','16'],['Közepes','20'],['Címsor','32'],['Nagy címsor','48'],['Óriás','64']],
    'style.fontWeight':[['Normál','400'],['Közepesen vastag','500'],['Félkövér','600'],['Erős','700'],['Extra erős','800']],
    'style.border':[['Nincs','none'],['Finom','1px solid rgba(255,255,255,.12)'],['Normál','1px solid rgba(255,255,255,.22)'],['Erős','2px solid rgba(255,255,255,.35)'],['Világos','1px solid #ffffff'],['Sötét','1px solid #111827']],
    'style.radius':[['Nincs','0'],['Enyhe','6'],['Normál','10'],['Kerek','16'],['Erősen kerek','24']],
    'style.opacity':[['100%','1'],['90%','0.9'],['80%','0.8'],['60%','0.6'],['50%','0.5']],
    'responsive.tablet.width':[['Mobilhoz közeli','768'],['Tablet','900'],['Széles tablet','1024']],
    'responsive.mobile.width':[['Keskeny','360'],['Normál','390'],['Nagy mobil','430']]
  };
  const addPreset=input=>{
    if(!input?.dataset?.key||input.dataset.key.startsWith('style.color')||input.dataset.key==='style.background')return;
    const opts=presetMap[input.dataset.key];if(!opts||input.parentElement.querySelector(':scope > .editor-preset'))return;
    const sel=document.createElement('select');sel.className='editor-preset';sel.title='Előkészített érték';
    sel.innerHTML='<option value="">Preset…</option>'+opts.map(([label,val])=>`<option value="${val}">${label}</option>`).join('');
    sel.addEventListener('change',()=>{if(!sel.value)return;input.value=sel.value;applyField(input);sel.value=''});
    input.parentElement.appendChild(sel);
  };
  const addPickers=()=>{
    const b=inspector();if(!b)return;
    b.querySelectorAll('input[data-key="style.color"],input[data-key="style.background"]').forEach(text=>{
      if(text.nextElementSibling?.matches('input.editor-color-picker'))return;
      const picker=document.createElement('input');picker.type='color';picker.className='editor-color-picker';picker.value=/^#[0-9a-f]{6}$/i.test(text.value)?text.value:'#000000';picker.title='Szín kiválasztása';
      picker.addEventListener('change',()=>{text.value=picker.value;applyField(text)});text.insertAdjacentElement('afterend',picker);
    });
    b.querySelectorAll('[data-key]').forEach(addPreset);
  };
  document.addEventListener('click',e=>{const b=inspector();if(!b||!b.contains(e.target))return;remember();restore()},true);
  document.addEventListener('change',e=>{
    const b=inspector();if(!b||!b.contains(e.target))return;
    if(e.target.matches('[data-key]')){e.stopImmediatePropagation();remember();applyField(e.target);return}
    remember();restore();
  },true);
  const mo=new MutationObserver(()=>{addPickers();restore()});
  window.addEventListener('DOMContentLoaded',()=>{const b=inspector();if(b)mo.observe(b,{childList:true,subtree:true});addPickers()});
  addPickers();
})();
