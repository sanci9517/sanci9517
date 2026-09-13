(() => {
  let lastSignature = '';
  const esc = v => String(v ?? '').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
  const api = () => window.SanciEditor;
  const nodes = () => { const a=api(); return a?.state?.selected?.map(id=>a.find(id)).filter(Boolean)||[]; };
  const grouped = ns => ns.length>1 && ns.every(n=>n.groupId) && new Set(ns.map(n=>n.groupId)).size===1;
  const get = (n,p) => api()?.getPath?.(n,p);
  const common = (ns,p,f='') => { const vals=ns.map(n=>get(n,p)); const first=vals[0]??f; return {value:first,mixed:vals.some(v=>v!==first)}; };
  const input = (label,path,d,type='text',step='') => `<div class="field"><label>${label}</label><input data-gp="${esc(path)}" type="${type}" ${step?`step="${step}"`:''} value="${d.mixed?'':esc(d.value)}" placeholder="${d.mixed?'Vegyes':''}">${d.mixed?'<div class="gp-mixed">Vegyes értékek</div>':''}</div>`;
  const select = (label,path,d,opts) => `<div class="field"><label>${label}</label><select data-gp="${esc(path)}"><option value="">${d.mixed?'Vegyes':'Válassz'}</option>${opts.map(([v,t])=>`<option value="${esc(v)}" ${!d.mixed&&String(d.value??'')===v?'selected':''}>${esc(t)}</option>`).join('')}</select></div>`;
  const check = (label,path,d) => `<label class="gp-row"><input data-gp-bool="${esc(path)}" type="checkbox" ${d.mixed?'':(d.value?'checked':'')}> ${label}${d.mixed?' — Vegyes':''}</label>`;

  function render(){
    const box=document.getElementById('inspector'); if(!box)return;
    const ns=nodes(), is=grouped(ns), sig=is?ns.map(n=>n.id).sort().join('|'):'none';
    if(sig===lastSignature)return; lastSignature=sig;
    if(!is)return;
    const l=p=>common(ns,p), s=p=>common(ns,p);
    box.innerHTML=`<div class="group-properties"><div class="group-title">Csoport tulajdonságai</div><div class="group-subtitle">Ugyanaz a tulajdonság-panel, mint egy elemnél. A közös módosítás minden csoporttagra érvényes.</div>
      <details class="inspect-section" open><summary>Alap</summary><div class="inspect-body">${input('Név','name',l('name'))}${input('Tartalom','content.text',l('content.text'))}${check('Látható','visible',l('visible',true))}${check('Zárolás','locked',l('locked',false))}</div></details>
      <details class="inspect-section" open><summary>Elrendezés</summary><div class="inspect-body"><div class="field-row">${input('X','layout.x',l('layout.x',0),'number')}${input('Y','layout.y',l('layout.y',0),'number')}</div><div class="field-row">${input('Szélesség','layout.width',l('layout.width',0),'number')}${input('Magasság','layout.height',l('layout.height',0),'number')}</div>${select('Pozicionálás','layout.position',l('layout.position','absolute'),[['absolute','Absolute'],['relative','Relative'],['normal','Normal']])}${select('Display','layout.display',l('layout.display','block'),[['block','Block'],['flex','Flex'],['grid','Grid'],['inline-block','Inline-block']])}${input('Gap','layout.gap',l('layout.gap',12),'number')}${input('Padding','layout.padding',l('layout.padding',12),'number')}</div></details>
      <details class="inspect-section" open><summary>Megjelenés</summary><div class="inspect-body">${input('Szín','style.color',l('style.color',''))}${input('Háttér','style.background',l('style.background','transparent'))}${input('Betűméret','style.fontSize',l('style.fontSize',16),'number')}${input('Betűvastagság','style.fontWeight',l('style.fontWeight',400),'number')}${input('Szegély','style.border',l('style.border','none'))}${input('Lekerekítés','style.radius',l('style.radius',8),'number')}${input('Átlátszóság','style.opacity',l('style.opacity',1),'number','0.05')}</div></details>
      <details class="inspect-section"><summary>Reszponzív</summary><div class="inspect-body">${input('Tablet W','responsive.tablet.width',l('responsive.tablet.width',''))}${input('Mobil W','responsive.mobile.width',l('responsive.mobile.width',''))}${check('Mobilon elrejtés','responsive.mobile.hide',l('responsive.mobile.hide',false))}</div></details>
      <details class="inspect-section"><summary>Link & hozzáférhetőség</summary><div class="inspect-body">${input('Link URL','attributes.href',l('attributes.href',''))}${input('Cél','attributes.target',l('attributes.target','_self'))}${input('Alt / ARIA','attributes.alt',l('attributes.alt',''))}${input('ARIA label','attributes.ariaLabel',l('attributes.ariaLabel',''))}</div></details></div>`;
    box.querySelectorAll('[data-gp]').forEach(el=>el.addEventListener('change',()=>apply(el.dataset.gp,el.type==='number'?Number(el.value):el.value)));
    box.querySelectorAll('[data-gp-bool]').forEach(el=>el.addEventListener('change',()=>apply(el.dataset.gpBool,el.checked)));
  }

  function apply(path,value){
    const a=api(), ns=nodes(); if(!a||!grouped(ns)||!a.commit||!a.render||!a.setPath)return;
    a.commit();
    if(path==='layout.x'||path==='layout.y'){
      const axis=path==='layout.x'?'x':'y', current=Math.min(...ns.map(n=>Number(n.layout?.[axis])||0)), delta=Number(value)-current;
      ns.forEach(n=>{n.layout=n.layout||{};n.layout[axis]=(Number(n.layout[axis])||0)+delta});
    } else if(path==='layout.width'||path==='layout.height'){
      const axis=path==='layout.width'?'width':'height', pos=axis==='width'?'x':'y', min=Math.min(...ns.map(n=>Number(n.layout?.[pos])||0)), max=Math.max(...ns.map(n=>(Number(n.layout?.[pos])||0)+(Number(n.layout?.[axis])||0))), old=Math.max(1,max-min), target=Math.max(20,Number(value)||20), scale=target/old;
      ns.forEach(n=>{n.layout=n.layout||{};const p=Number(n.layout[pos])||0,s=Number(n.layout[axis])||0;n.layout[pos]=min+(p-min)*scale;n.layout[axis]=Math.max(20,s*scale)});
    } else ns.forEach(n=>a.setPath(n,path,value));
    a.render(); if(a.show)a.show('Csoport tulajdonsága módosítva'); lastSignature=''; setTimeout(render,0);
  }

  const observer=new MutationObserver(()=>requestAnimationFrame(render));
  observer.observe(document.getElementById('canvas')||document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
  const boot=()=>setTimeout(render,100); if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
