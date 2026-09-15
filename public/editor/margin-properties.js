(()=>{
  const inspector=()=>document.getElementById('inspector');
  const api=()=>window.SanciEditor;
  const selected=()=>{const a=api();return a?.state?.selected?.length===1?a.find(a.state.selected[0]):null};
  const findLayoutSection=()=>[...document.querySelectorAll('#inspector > details.inspect-section')].find(d=>d.querySelector('summary')?.textContent.trim()==='Elrendezés');
  const normalize=v=>{const n=Number(v);return Number.isFinite(n)?Math.round(n):0};
  const add=()=>{
    const section=findLayoutSection();
    const n=selected();
    if(!section||!n||section.querySelector('.margin-property'))return;
    const body=section.querySelector('.inspect-body');
    if(!body)return;
    const field=document.createElement('div');
    field.className='field margin-property';
    field.innerHTML='<label>Margin</label><input data-margin-key="layout.margin" type="number" step="1" value="'+normalize(n.layout?.margin??0)+'"><small class="margin-help">Külső térköz, px.</small>';
    const input=field.querySelector('input');
    input.addEventListener('change',()=>{
      const a=api(),node=selected();
      if(!a||!node)return;
      const value=normalize(input.value);
      if(typeof a.commit==='function')a.commit();
      node.layout=node.layout||{};
      node.layout.margin=value;
      input.value=String(value);
      if(typeof a.render==='function')a.render();
    });
    body.appendChild(field);
  };
  const boot=()=>{
    const box=inspector();
    if(!box)return;
    const style=document.createElement('style');
    style.textContent='.margin-property .margin-help{display:block;margin-top:4px;color:#8d98aa;font-size:10px}';
    document.head.appendChild(style);
    new MutationObserver(()=>requestAnimationFrame(add)).observe(box,{childList:true,subtree:true});
    add();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();