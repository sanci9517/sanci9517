(()=>{
  let busy=false;
  const api=()=>window.SanciEditor;
  const node=()=>{const a=api();return a?.state?.selected?.length===1?a.find(a.state.selected[0]):null};
  const normalize=v=>{const n=Number(v);return Number.isFinite(n)?Math.max(1,Math.round(n)):1};
  function ensure(){
    const a=api(),n=node(),box=document.getElementById('inspector');
    if(!a||!n||!box||busy||box.querySelector('.minmax-properties'))return;
    const section=document.createElement('details');
    section.className='inspect-section minmax-properties'; section.open=true;
    section.innerHTML='<summary>Mérethatárok</summary><div class="inspect-body"><div class="field"><label>Min. szélesség</label><div class="mm-fixed">1 px</div></div><div class="field"><label>Min. magasság</label><div class="mm-fixed">1 px</div></div><small class="mm-help">A méret minimuma mindkét irányban 1 px. Maximum nincs.</small></div>';
    box.appendChild(section);
  }
  function clampDimensionInputs(e){
    const input=e.target;
    if(!(input instanceof HTMLInputElement))return;
    const key=input.dataset?.key;
    if(key!=='layout.width'&&key!=='layout.height')return;
    if(input.value===''||Number(input.value)<1||!Number.isFinite(Number(input.value)))input.value='1';
  }
  function resizeCapture(e){
    const a=api(),d=a?.state?.drag;
    if(!a||!d||!d.start?.resize||d.nodes?.length!==1||!a.find)return;
    const n=a.find(d.nodes[0].id);if(!n)return;
    e.stopImmediatePropagation();
    const zoom=Number(a.state.zoom)||1;
    const dx=(e.clientX-d.start.x)/zoom;
    const dy=(e.clientY-d.start.y)/zoom;
    n.layout=n.layout||{};
    n.layout.width=Math.max(1,Math.round(d.nodes[0].w+dx));
    n.layout.height=Math.max(1,Math.round(d.nodes[0].h+dy));
    const el=document.querySelector(`[data-id="${CSS.escape(n.id)}"]`);
    if(el){el.style.width=n.layout.width+'px';el.style.height=n.layout.height+'px';}
  }
  function boot(){
    const style=document.createElement('style');style.textContent='.minmax-properties .mm-help{display:block;margin-top:6px;color:#8d98aa;font-size:10px}.minmax-properties .mm-fixed{padding:8px 10px;border-radius:6px;background:rgba(255,255,255,.04);color:#cbd3df;font-size:12px}.minmax-properties .field{margin-bottom:8px}';document.head.appendChild(style);
    document.addEventListener('input',clampDimensionInputs,true);
    document.addEventListener('change',clampDimensionInputs,true);
    window.addEventListener('pointermove',resizeCapture,true);
    const observer=new MutationObserver(()=>{if(busy)return;busy=true;requestAnimationFrame(()=>{ensure();busy=false})});
    const target=document.getElementById('inspector');if(target)observer.observe(target,{childList:true,subtree:true});
    setTimeout(ensure,150);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();