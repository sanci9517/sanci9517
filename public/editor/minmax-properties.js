(()=>{
  let busy=false;
  const api=()=>window.SanciEditor;
  const node=()=>{const a=api();return a?.state?.selected?.length===1?a.find(a.state.selected[0]):null};
  const normalize=v=>{const n=Number(v);return Number.isFinite(n)?Math.max(1,Math.round(n)):1};
  function ensure(){
    const a=api(),n=node(),box=document.getElementById('inspector');
    if(!a||!n||!box||busy||box.querySelector('.minmax-properties'))return;
    const l=n.layout||{};
    const section=document.createElement('details');
    section.className='inspect-section minmax-properties'; section.open=true;
    section.innerHTML=`<summary>Mérethatárok</summary><div class="inspect-body"><div class="field"><label>Min. szélesség</label><input data-mm="minWidth" type="number" min="1" step="1" value="${normalize(l.minWidth||1)}"></div><div class="field"><label>Min. magasság</label><input data-mm="minHeight" type="number" min="1" step="1" value="${normalize(l.minHeight||1)}"></div><small class="mm-help">Minimum: 1 px</small></div>`;
    box.appendChild(section);
    section.querySelectorAll('[data-mm]').forEach(input=>{
      input.addEventListener('input',()=>{
        if(input.value!==''&&Number(input.value)<1)input.value='1';
      });
      input.addEventListener('change',()=>apply(input.dataset.mm,input.value));
      input.addEventListener('blur',()=>{if(input.value===''||Number(input.value)<1)input.value='1';});
    });
  }
  function apply(key,raw){
    const a=api(),n=node();if(!a||!n||!a.commit)return;
    const value=normalize(raw);
    a.commit();
    n.layout=n.layout||{};
    n.layout[key]=value;
    if(key==='minWidth'&&Number(n.layout.width)<value)n.layout.width=value;
    if(key==='minHeight'&&Number(n.layout.height)<value)n.layout.height=value;
    const el=document.querySelector(`[data-id="${CSS.escape(n.id)}"]`);
    if(el){el.style.width=Number(n.layout.width)+'px';el.style.height=Number(n.layout.height)+'px';el.style.minWidth=value+'px';el.style.minHeight=value+'px';}
  }
  function boot(){
    const style=document.createElement('style');style.textContent='.minmax-properties .mm-help{display:block;margin-top:6px;color:#8d98aa;font-size:10px}';document.head.appendChild(style);
    const observer=new MutationObserver(()=>{if(busy)return;busy=true;requestAnimationFrame(()=>{ensure();busy=false})});
    const target=document.getElementById('inspector');if(target)observer.observe(target,{childList:true,subtree:true});
    setTimeout(ensure,150);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();