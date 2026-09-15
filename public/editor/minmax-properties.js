(()=>{
  let busy=false;
  const api=()=>window.SanciEditor;
  const node=()=>{const a=api();return a?.state?.selected?.length===1?a.find(a.state.selected[0]):null};
  function ensure(){
    const a=api(),n=node(),box=document.getElementById('inspector');
    if(!a||!n||!box||busy||box.querySelector('.minmax-properties'))return;
    const l=n.layout||{};
    const section=document.createElement('details');
    section.className='inspect-section minmax-properties'; section.open=true;
    section.innerHTML=`<summary>Mérethatárok</summary><div class="inspect-body"><div class="field"><label>Min. szélesség</label><input data-mm="minWidth" type="number" min="1" step="1" value="${Math.max(1,Math.round(Number(l.minWidth)||1))}"></div><div class="field"><label>Min. magasság</label><input data-mm="minHeight" type="number" min="1" step="1" value="${Math.max(1,Math.round(Number(l.minHeight)||1))}"></div><small class="mm-help">Minimum: 1 px</small></div>`;
    box.appendChild(section);
    section.querySelectorAll('[data-mm]').forEach(input=>input.addEventListener('change',e=>apply(e.target.dataset.mm,e.target.value)));
  }
  function apply(key,raw){
    const a=api(),n=node();if(!a||!n||!a.commit||!a.render)return;
    let value=Number(raw);if(!Number.isFinite(value)||value<1)value=1;value=Math.max(1,Math.round(value));
    a.commit();n.layout=n.layout||{};n.layout[key]=value;
    if(key==='minWidth'&&Number(n.layout.width)<value)n.layout.width=value;
    if(key==='minHeight'&&Number(n.layout.height)<value)n.layout.height=value;
    a.render();
  }
  function boot(){
    const style=document.createElement('style');style.textContent='.minmax-properties .mm-help{display:block;margin-top:6px;color:#8d98aa;font-size:10px}';document.head.appendChild(style);
    const observer=new MutationObserver(()=>{if(busy)return;busy=true;requestAnimationFrame(()=>{ensure();busy=false})});
    const target=document.getElementById('inspector');if(target)observer.observe(target,{childList:true,subtree:true});
    setTimeout(ensure,150);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();