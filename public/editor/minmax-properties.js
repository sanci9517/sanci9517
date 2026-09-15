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
    section.innerHTML=`<summary>Mérethatárok</summary><div class="inspect-body"><div class="field"><label>Min. szélesség</label><input data-mm="minWidth" type="number" min="1" step="1" value="${esc(Math.max(1,Number(l.minWidth)||1))}"></div><small class="mm-help">Minimum: 1 px</small></div>`;
    box.appendChild(section);
    section.querySelector('[data-mm]')?.addEventListener('change',e=>apply(e.target.value));
  }
  function apply(raw){
    const a=api(),n=node();if(!a||!n||!a.commit||!a.render)return;
    let value=Number(raw);if(!Number.isFinite(value)||value<1)value=1;value=Math.round(value);
    const old=Math.max(1,Number(n.layout?.minWidth)||1);
    if(value===old&&Number(n.layout?.minWidth)===value)return;
    a.commit();n.layout=n.layout||{};n.layout.minWidth=value;
    if(Number(n.layout.width)<value)n.layout.width=value;
    const box=document.getElementById('inspector'),scroll=box?.scrollTop||0;
    a.render();
    requestAnimationFrame(()=>{const b=document.getElementById('inspector');if(b)b.scrollTop=scroll});
  }
  function clampResize(){
    const a=api(),s=a?.state;if(!a||!s?.drag||!s.drag.start?.resize||s.drag.nodes?.length!==1)return;
    const n=a.find(s.drag.nodes[0].id);if(!n)return;
    const min=Math.max(1,Number(n.layout?.minWidth)||1);
    if(Number(n.layout.width)<min)n.layout.width=min;
    const el=document.querySelector(`[data-id="${CSS.escape(n.id)}"]`);
    if(el)el.style.width=n.layout.width+'px';
  }
  function boot(){
    const style=document.createElement('style');style.textContent='.minmax-properties .mm-help{display:block;margin-top:6px;color:#8d98aa;font-size:10px}';document.head.appendChild(style);
    const observer=new MutationObserver(()=>{if(busy)return;busy=true;requestAnimationFrame(()=>{ensure();busy=false})});
    observer.observe(document.getElementById('inspector')||document.body,{childList:true,subtree:true});
    window.addEventListener('pointermove',()=>setTimeout(clampResize,0),{passive:true});
    window.addEventListener('pointerup',()=>setTimeout(()=>{clampResize();api()?.render?.()},0),{passive:true});
    setTimeout(ensure,150);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();