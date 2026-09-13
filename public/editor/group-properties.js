(() => {
  let lastSignature = '';

  const esc = value => String(value ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  const api = () => window.SanciEditor;
  const selectedNodes = () => {
    const a = api();
    if (!a?.state || !a?.find) return [];
    return a.state.selected.map(id => a.find(id)).filter(Boolean);
  };
  const isGrouped = nodes => nodes.length > 1 && nodes.every(n => n.groupId) && new Set(nodes.map(n => n.groupId)).size === 1;

  function common(nodes, path, fallback='') {
    const a = api();
    if (!a?.getPath || !nodes.length) return { value:fallback, mixed:false };
    const values = nodes.map(n => a.getPath(n, path));
    const first = values[0];
    return { value:first ?? fallback, mixed:values.some(v => v !== first) };
  }

  function valueInput(label, path, data, type='text', step='') {
    const shown = data.mixed ? '' : data.value;
    return `<div class="field"><label>${label}</label><input data-gp="${esc(path)}" data-gp-type="${type}" type="${type}" ${step?`step="${step}"`:''} value="${esc(shown)}" placeholder="${data.mixed?'Vegyes':''}">${data.mixed?'<div class="mixed">Vegyes értékek – az új érték minden elemre rákerül.</div>':''}</div>`;
  }

  function selectInput(label,path,data,options){
    const current = data.mixed ? '' : String(data.value ?? '');
    return `<div class="field"><label>${label}</label><select data-gp="${esc(path)}"><option value="" ${data.mixed?'selected':''}>${data.mixed?'Vegyes':''}</option>${options.map(([v,t])=>`<option value="${esc(v)}" ${current===v?'selected':''}>${esc(t)}</option>`).join('')}</select></div>`;
  }

  function render() {
    const inspector = document.getElementById('inspector');
    if (!inspector) return;
    const nodes = selectedNodes();
    const grouped = isGrouped(nodes);
    const signature = grouped ? nodes.map(n=>n.id).sort().join(',') : 'none';
    if (signature === lastSignature) return;
    lastSignature = signature;
    if (!grouped) return;

    const opacity = common(nodes,'style.opacity',1);
    const color = common(nodes,'style.color','');
    const background = common(nodes,'style.background','transparent');
    const fontSize = common(nodes,'style.fontSize',16);
    const fontWeight = common(nodes,'style.fontWeight',400);
    const border = common(nodes,'style.border','none');
    const radius = common(nodes,'style.radius',8);
    const padding = common(nodes,'layout.padding',12);
    const display = common(nodes,'layout.display','block');
    const position = common(nodes,'layout.position','absolute');
    const locked = common(nodes,'locked',false);
    const visible = common(nodes,'visible',true);

    inspector.innerHTML = `
      <div class="group-properties">
        <div class="group-title">Csoport tulajdonságai</div>
        <div class="group-subtitle">${nodes.length} elem egy csoportban. A lenti módosítások egységesen minden csoporttagra érvényesek.</div>
        <details class="inspect-section" open><summary>Megjelenés</summary><div class="inspect-body">
          ${valueInput('Szín','style.color',color)}
          ${valueInput('Háttér','style.background',background)}
          ${valueInput('Átlátszóság','style.opacity',opacity,'number','0.05')}
          ${valueInput('Betűméret','style.fontSize',fontSize,'number','1')}
          ${valueInput('Betűvastagság','style.fontWeight',fontWeight,'number','100')}
          ${valueInput('Szegély','style.border',border)}
          ${valueInput('Lekerekítés','style.radius',radius,'number','1')}
          ${valueInput('Padding','layout.padding',padding,'number','1')}
        </div></details>
        <details class="inspect-section" open><summary>Elrendezés</summary><div class="inspect-body">
          ${selectInput('Pozicionálás','layout.position',position,[['absolute','Absolute'],['relative','Relative'],['normal','Normal']])}
          ${selectInput('Display','layout.display',display,[['block','Block'],['flex','Flex'],['grid','Grid'],['inline-block','Inline-block']])}
        </div></details>
        <details class="inspect-section" open><summary>Állapot</summary><div class="inspect-body">
          <label class="gp-row"><input data-gp-bool="visible" type="checkbox" ${visible.mixed?'':(visible.value!==false?'checked':'')}> Látható</label>
          <label class="gp-row"><input data-gp-bool="locked" type="checkbox" ${locked.mixed?'':(locked.value?'checked':'')}> Zárolás</label>
        </div></details>
      </div>`;

    inspector.querySelectorAll('[data-gp]').forEach(input => input.addEventListener('change', () => {
      const a = api();
      if (!a) return;
      let value = input.value;
      if (input.type === 'number') value = Number(value);
      apply(input.dataset.gp, value);
    }));
    inspector.querySelectorAll('[data-gp-bool]').forEach(input => input.addEventListener('change', () => apply(input.dataset.gpBool,input.checked)));
  }

  function apply(path,value) {
    const a = api();
    if (!a?.state || !a?.find || !a?.commit || !a?.setPath || !a?.render) return;
    const nodes = selectedNodes();
    if (!isGrouped(nodes)) return;
    a.commit();
    nodes.forEach(n => a.setPath(n,path,value));
    a.render();
    if (typeof a.show === 'function') a.show('Csoport tulajdonsága módosítva');
    lastSignature = '';
    render();
  }

  const observer = new MutationObserver(() => render());
  observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
  const boot = () => setTimeout(render,80);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
