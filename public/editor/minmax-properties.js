(()=>{
  let busy=false;
  const api=()=>window.SanciEditor;
  function node(){const a=api();return a?.state?.selected?.length===1?a.find(a.state.selected[0]):null}
  function esc(v){return String(v??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]))}
  function ensure(){
    const a=api(),n=node(),box=document.getElementById('inspector');
    if(!a||!n||!box||busy)return;
    if(box.querySelector('.minmax-properties'))return;
    const l=n.layout||{};
    const minW=Math.max(1,Number(l.minWidth)||1);
    const minH=Math.max(1,Number(l.minHeight)||1);
    const section=document.createElement('details');
    section.className='inspect-section minmax-properties';
    section.open=true;
    section.innerHTML=`<summary>Mérethatárok</summary><div class="inspect-body"><div class="field"><label>Min. szélesség</label><input data-mm="minWidth" type="number" min="1" step="1" value="${esc(minW)}"></div><div class="field"><label>Min. magasság</label><input data-mm="minHeight" type="number" min="1" step="1" value="${esc(minH)}"></div><small class="mm-help">Minimum: 1 px</small></div>`;
    box.appendChild(section);
    section.querySelector('[data-mm="minWidth"]')?.addEventListener('change',e=>apply('minWidth',e.target.value));
    section.querySelector('[data-mm="minHeight"]')?.addEventListener('change',e=>apply('minHeight',e.target.value));
  }
  function apply(key,raw){
    const a=api(),n=node();if(!a||!n||!a.commit||!a.render)return;
    let value=Number(raw);if(!Number.isFinite(value)||value<1)value=1;value=Math.round(value);
    const old=Math.max(1,Number(n.layout?.[key])||1);
    if(value===old&&Number(n.layout?.[key])===value)return;
    a.commit();n.layout=n.layout||{};n.layout[key]=value;
    if(key==='minWidth'&&Number(n.layout.width)<value)n.layout.width=value;
    if(key==='minHeight'&&Number(n.layout.height)<value)n.layout.height=value;
    const box=document.getElementById('inspector'),scroll=box?.scrollTop||0;
    a.render();
    requestAnimationFrame(()=>{const b=document.getElementById('inspector');if(b)b.scrollTop=scroll});
  }
  function clampNode(n){
    if(!n?.layout)return false;
    let changed=false;
    const minW=Math.max(1,Number(n.layout.minWidth)||1);
    const minH=Math.max(1,Number(n.layout.minHeight)||1);
    if(Number(n.layout.width)<minW){n.layout.width=minW;changed=true}
    if(Number(n.layout.height)<minH){n.layout.height=minH;changed=true}
    return changed;
  }
  function clampResize(){
    const a=api(),s=a?.state;if(!a||!s?.drag||!s.drag.start?.resize||s.drag.nodes?.length!==1)return;
    const n=a.find(s.drag.nodes[0].id);if(!n)return;
    clampNode(n);
    const el=document.querySelector(`[data-id="${CSS.escape(n.id)}"]`);
    if(el){el.style.width=n.layout.width+'px';el.style.height=n.layout.height+'px'}
  }
  function clampInspectorValue(e){
    const input=e.target;
    if(!(input instanceof HTMLInputElement))return;
    const key=input.dataset?.key;
    if(key!=='layout.width'&&key!=='layout.height')return;
    const n=node();if(!n)return;
    let value=Number(input.value);if(!Number.isFinite(value)||value<1)value=1;value=Math.round(value);
    if(key==='layout.width')value=Math.max(value,Math.max(1,Number(n.layout?.minWidth)||1));
    if(key==='layout.height')value=Math.max(value,Math.max(1,Number(n.layout?.minHeight)||1));
    input.value=String(value);
    if(n.layout) n.layout[key==='layout.width'?'width':'height']=value;
  }
  function boot(){
    const style=document.createElement('style');style.textContent='.minmax-properties .mm-help{display:block;margin-top:6px;color:#8d98aa;font-size:10px}';document.head.appendChild(style);
    const observer=new MutationObserver(()=>{if(busy)return;busy=true;requestAnimationFrame(()=>{ensure();busy=false})});
    observer.observe(document.getElementById('inspector')||document.body,{childList:true,subtree:true});
    window.addEventListener('pointermove',()=>setTimeout(clampResize,0),{passive:true});
    window.addEventListener('pointerup',()=>setTimeout(()=>{clampResize();api()?.render?.()},0),{passive:true});
    document.addEventListener('change',clampInspectorValue,true);
    document.addEventListener('blur',clampInspectorValue,true);
    setTimeout(ensure,150);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();