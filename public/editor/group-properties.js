(()=>{
  let lastSignature='';
  let inspectorScroll=0;
  const esc=v=>String(v??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
  const api=()=>window.SanciEditor;
  const nodes=()=>{const a=api();return a?.state?.selected?.map(id=>a.find(id)).filter(Boolean)||[]};
  const grouped=ns=>ns.length>1&&ns.every(n=>n.groupId)&&new Set(ns.map(n=>n.groupId)).size===1;
  const get=(n,p)=>api()?.getPath?.(n,p);
  const common=(ns,p,f='')=>{const vals=ns.map(n=>get(n,p));const first=vals[0]??f;return{value:first,mixed:vals.some(v=>v!==first)}};
  const input=(label,path,d,type='text',step='')=>`<div class="field"><label>${label}</label><input data-gp="${esc(path)}" type="${type}" ${step?`step="${step}"`:''} value="${d.mixed?'':esc(d.value)}" placeholder="${d.mixed?'Vegyes':''}"></div>`;
  const color=(label,path,d,fallback)=>`<div class="field"><label>${label}</label><div class="gp-color-row"><input data-gp="${esc(path)}" type="text" value="${d.mixed?'':esc(d.value)}" placeholder="${d.mixed?'Vegyes':fallback}"><input class="gp-color-picker" data-gp-color="${esc(path)}" type="color" value="${/^#[0-9a-f]{6}$/i.test(String(d.value||''))?d.value:fallback}" title="Szín kiválasztása"></div></div>`;
  const select=(label,path,d,opts)=>`<div class="field"><label>${label}</label><select data-gp="${esc(path)}"><option value="">${d.mixed?'Vegyes':'Válassz'}</option>${opts.map(([v,t])=>`<option value="${esc(v)}" ${!d.mixed&&String(d.value??'')===v?'selected':''}>${esc(t)}</option>`).join('')}</select></div>`;
  const check=(label,path,d)=>`<label class="gp-row"><input data-gp-bool="${esc(path)}" type="checkbox" ${d.mixed?'':(d.value?'checked':'')}> ${label}${d.mixed?' — Vegyes':''}</label>`;
  const presets={position:[['absolute','Abszolút'],['relative','Relatív'],['static','Normál']],display:[['block','Blokk'],['flex','Flex'],['grid','Rács'],['inline-block','Inline blokk']],border:[['none','Nincs'],['1px solid rgba(255,255,255,.12)','Finom'],['1px solid rgba(255,255,255,.22)','Normál'],['2px solid rgba(255,255,255,.35)','Erős'],['1px solid #ffffff','Világos'],['1px solid #111827','Sötét']],radius:[['0','Nincs'],['6','Enyhe'],['10','Normál'],['16','Kerek'],['24','Erősen kerek']],opacity:[['1','100%'],['0.9','90%'],['0.8','80%'],['0.6','60%'],['0.5','50%']]};
  function rememberScroll(){const box=document.getElementById('inspector');if(box)inspectorScroll=box.scrollTop}
  function restoreScroll(){requestAnimationFrame(()=>{const box=document.getElementById('inspector');if(box)box.scrollTop=inspectorScroll})}
  function arrangeGap(ns,gap){
    if(ns.length<2)return;
    const ordered=ns.slice().sort((a,b)=>(Number(a.layout?.x)||0)-(Number(b.layout?.x)||0));
    const y0=Math.min(...ordered.map(n=>Number(n.layout?.y)||0));
    let x=Number(ordered[0].layout?.x)||0;
    ordered.forEach((n,i)=>{
      n.layout=n.layout||{};
      if(i===0){x=Number(n.layout.x)||0;return}
      const previous=ordered[i-1];
      x+=Math.max(20,Number(previous.layout?.width)||200)+gap;
      n.layout.x=Math.round(x);
      if(!Number.isFinite(Number(n.layout.y)))n.layout.y=y0;
    });
  }
  function render(){
    const box=document.getElementById('inspector');if(!box)return;const ns=nodes(),is=grouped(ns);const sig=is?ns.map(n=>n.id).sort().join('|'):'none';
    if(!is){lastSignature='none';return} if(sig===lastSignature&&box.querySelector('.group-properties')){restoreScroll();return} lastSignature=sig;const l=p=>common(ns,p);
    box.innerHTML=`<div class="group-properties"><div class="group-title">Csoport tulajdonságai</div><div class="group-subtitle">A csoport közös tulajdonságai. A Gap a csoport elemei közötti távolságot vezérli.</div>
      <details class="inspect-section" open><summary>Alap</summary><div class="inspect-body">${input('Név','name',l('name'))}${input('Tartalom','content.text',l('content.text'))}${check('Látható','visible',l('visible',true))}${check('Zárolás','locked',l('locked',false))}</div></details>
      <details class="inspect-section" open><summary>Elrendezés</summary><div class="inspect-body"><div class="field-row">${input('X','layout.x',l('layout.x',0),'number')}${input('Y','layout.y',l('layout.y',0),'number')}</div><div class="field-row">${input('Szélesség','layout.width',l('layout.width',0),'number')}${input('Magasság','layout.height',l('layout.height',0),'number')}</div>${select('Pozicionálás','layout.position',l('layout.position','absolute'),presets.position)}${select('Display','layout.display',l('layout.display','block'),presets.display)}${input('Gap','layout.gap',l('layout.gap',12),'number','1')}${input('Padding','layout.padding',l('layout.padding',12),'number')}</div></details>
      <details class="inspect-section" open><summary>Megjelenés</summary><div class="inspect-body">${color('Szín','style.color',l('style.color','#17202b'),'#17202b')}${color('Háttér','style.background',l('style.background','#000000'),'#000000')}${input('Betűméret','style.fontSize',l('style.fontSize',16),'number')}${input('Betűvastagság','style.fontWeight',l('style.fontWeight',400),'number')}${select('Szegély','style.border',l('style.border','none'),presets.border)}${select('Lekerekítés','style.radius',l('style.radius',8),presets.radius)}${select('Átlátszóság','style.opacity',l('style.opacity',1),presets.opacity)}</div></details>
      <details class="inspect-section"><summary>Reszponzív</summary><div class="inspect-body">${input('Tablet W','responsive.tablet.width',l('responsive.tablet.width',''))}${input('Mobil W','responsive.mobile.width',l('responsive.mobile.width',''))}${check('Mobilon elrejtés','responsive.mobile.hide',l('responsive.mobile.hide',false))}</div></details>
      <details class="inspect-section"><summary>Link & hozzáférhetőség</summary><div class="inspect-body">${input('Link URL','attributes.href',l('attributes.href',''))}${input('Cél','attributes.target',l('attributes.target','_self'))}${input('Alt / ARIA','attributes.alt',l('attributes.alt',''))}${input('ARIA label','attributes.ariaLabel',l('attributes.ariaLabel',''))}</div></details></div>`;
    box.querySelectorAll('[data-gp]').forEach(el=>el.addEventListener('change',()=>apply(el.dataset.gp,el.type==='number'?Number(el.value):el.value)));
    box.querySelectorAll('[data-gp-bool]').forEach(el=>el.addEventListener('change',()=>apply(el.dataset.gpBool,el.checked)));
    box.querySelectorAll('[data-gp-color]').forEach(p=>p.addEventListener('change',()=>{const text=box.querySelector(`[data-gp="${CSS.escape(p.dataset.gpColor)}"]`);if(text){text.value=p.value;apply(p.dataset.gpColor,p.value)}}));
    restoreScroll();
  }
  function apply(path,value){const a=api(),ns=nodes();if(!a||!grouped(ns)||!a.commit||!a.render||!a.setPath)return;rememberScroll();a.commit();if(path==='layout.x'||path==='layout.y'){const axis=path==='layout.x'?'x':'y',current=Math.min(...ns.map(n=>Number(n.layout?.[axis])||0)),delta=Number(value)-current;ns.forEach(n=>{n.layout=n.layout||{};n.layout[axis]=(Number(n.layout[axis])||0)+delta})}else if(path==='layout.width'||path==='layout.height'){const axis=path==='layout.width'?'width':'height',pos=axis==='width'?'x':'y',min=Math.min(...ns.map(n=>Number(n.layout?.[pos])||0)),max=Math.max(...ns.map(n=>(Number(n.layout?.[pos])||0)+(Number(n.layout?.[axis])||0))),old=Math.max(1,max-min),target=Math.max(20,Number(value)||20),scale=target/old;ns.forEach(n=>{n.layout=n.layout||{};const p=Number(n.layout[pos])||0,s=Number(n.layout[axis])||0;n.layout[pos]=min+(p-min)*scale;n.layout[axis]=Math.max(20,s*scale)})}else if(path==='layout.gap'){const gap=Number.isFinite(Number(value))?Number(value):0;ns.forEach(n=>{n.layout=n.layout||{};n.layout.gap=gap});arrangeGap(ns,gap)}else ns.forEach(n=>a.setPath(n,path,value));a.render();if(a.show)a.show(path==='layout.gap'?'Csoport Gap módosítva':'Csoport tulajdonsága módosítva');lastSignature='';setTimeout(()=>{render();restoreScroll()},0)}
  const observer=new MutationObserver(()=>requestAnimationFrame(render));observer.observe(document.getElementById('canvas')||document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});const boot=()=>setTimeout(render,100);if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();