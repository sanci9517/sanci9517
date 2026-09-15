(()=>{
  const api=()=>window.SanciEditor;
  const inspector=()=>document.getElementById('inspector');
  const selected=()=>{const a=api();return a?.state?.selected?.length===1?a.find(a.state.selected[0]):null};
  const findLayoutSection=()=>[...document.querySelectorAll('#inspector > details.inspect-section')].find(d=>d.querySelector('summary')?.textContent.trim()==='Elrendezés');
  const values=['block','flex','grid','inline-block'];
  const labels={block:'Block',flex:'Flex',grid:'Grid','inline-block':'Inline block'};
  const add=()=>{
    const section=findLayoutSection(),n=selected();
    if(!section||!n||section.querySelector('.display-property'))return;
    const body=section.querySelector('.inspect-body');
    if(!body)return;
    const field=document.createElement('div');
    field.className='field display-property';
    const current=values.includes(n.layout?.display)?n.layout.display:'block';
    field.innerHTML='<label>Display</label><select data-display-key="layout.display">'+values.map(v=>'<option value="'+v+'"'+(v===current?' selected':'')+'>'+labels[v]+'</option>').join('')+'</select><small class="display-help">A Display az elem saját elrendezési módját állítja. A Flex és Grid akkor láthatóan hatásos, ha az elemnek vannak gyermekelemei.</small>';
    const input=field.querySelector('select');
    input.addEventListener('change',()=>{
      const a=api(),node=selected();
      if(!a||!node)return;
      const value=values.includes(input.value)?input.value:'block';
      if(typeof a.commit==='function')a.commit();
      node.layout=node.layout||{};
      node.layout.display=value;
      if(typeof a.render==='function')a.render();
    });
    body.appendChild(field);
  };
  const boot=()=>{
    const box=inspector();
    if(!box)return;
    const style=document.createElement('style');
    style.textContent='.display-property .display-help{display:block;margin-top:4px;color:#8d98aa;font-size:10px;line-height:1.4}.display-property select{width:100%;box-sizing:border-box}';
    document.head.appendChild(style);
    new MutationObserver(()=>requestAnimationFrame(add)).observe(box,{childList:true,subtree:true});
    add();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();