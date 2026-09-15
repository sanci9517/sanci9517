(()=>{
  let busy=false;
  const api=()=>window.SanciEditor;
  const esc=v=>String(v??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
  function node(){const a=api();return a?.state?.selected?.length===1?a.find(a.state.selected[0]):null}
  function ensure(){
    const a=api(),n=node(),box=document.getElementById('inspector');
    if(!a||!n||!box||busy)return;
    if(box.querySelector('.minmax-properties'))return;
    const l=n.layout||{};
    const section=document.createElement('details');
    section.className='inspect-section minmax-properties';
    section.open=true;
    section.innerHTML=`<summary>Mérethatárok</summary><div class="inspect-body"><div class="field-row"><div class="field"><label>Min. szélesség</label><input data-mm="minWidth" type="number" min="0" step="1" value="${esc(l.minWidth??0)}"></div><div class="field"><label>Max. szélesség</label><input data-mm="maxWidth" type="number" min="0" step="1" value="${esc(l.maxWidth??0)}"></div></div><small class="mm-help">0 = nincs korlátozás</small></div>`;
    box.appendChild(section);
    section.querySelectorAll('[data-mm]').forEach(input=>input.addEventListener('change',()=>apply(input.dataset.mm,input.value)));
  }
  function apply(key,raw){
    const a=api(),n=node();if(!a||!n||!a.commit||!a.render)return;
    let value=Number(raw);if(!Number.isFinite(value)||value<0)value=0;value=Math.round(value);
    const old=n.layout?.[key]??0;
    if(value===old)return;
    a.commit();n.layout=n.layout||{};
    if(key==='minWidth'){
      n.layout.minWidth=value;
      if(value>0&&Number(n.layout.maxWidth)>0&&Number(n.layout.maxWidth)<value)n.layout.maxWidth=value;
      if(value>0&&Number(n.layout.width)<value)n.layout.width=value;
    }else{
      n.layout.maxWidth=value;
      if(value>0&&Number(n.layout.minWidth)>value)n.layout.minWidth=value;
      if(value>0&&Number(n.layout.width)>value)n.layout.width=value;
    }
    const box=document.getElementById('inspector'),scroll=box?.scrollTop||0;
    a.render();
    requestAnimationFrame(()=>{const b=document.getElementById('inspector');if(b)b.scrollTop=scroll});
  }
  function boot(){
    const style=document.createElement('style');style.textContent='.minmax-properties .mm-help{display:block;margin-top:6px;color:#8d98aa;font-size:10px}';document.head.appendChild(style);
    const observer=new MutationObserver(()=>{if(busy)return;busy=true;requestAnimationFrame(()=>{ensure();busy=false})});
    observer.observe(document.getElementById('inspector')||document.body,{childList:true,subtree:true});
    setTimeout(ensure,150);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();