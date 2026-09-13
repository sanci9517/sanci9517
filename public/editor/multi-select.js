(()=>{
  const selected=new Set();
  const canvas=()=>document.getElementById('canvas');
  const stateLabel=()=>document.getElementById('selectionState');
  const nodeFromEvent=e=>e.target.closest?.('.node[data-id]');
  const paint=()=>{
    const c=canvas();if(!c)return;
    c.querySelectorAll('.node[data-id]').forEach(el=>el.classList.toggle('multi-selected',selected.has(el.dataset.id)));
    const label=stateLabel();
    if(label)label.textContent=selected.size>1?`Kijelölés: ${selected.size} elem`:selected.size===1?'Kijelölés: 1 elem':'Kijelölés: —';
  };
  document.addEventListener('pointerdown',e=>{
    const node=nodeFromEvent(e);
    if(!node){
      if(e.target.closest?.('#canvas')){
        selected.clear();
        paint();
      }
      return;
    }
    if(!(e.ctrlKey||e.metaKey||e.shiftKey))return;
    const id=node.dataset.id;
    e.preventDefault();
    e.stopImmediatePropagation();
    if(selected.has(id))selected.delete(id);else selected.add(id);
    if(selected.size===0)selected.add(id);
    paint();
  },true);
  document.addEventListener('click',e=>{
    const node=nodeFromEvent(e);
    if(!node)return;
    if(e.ctrlKey||e.metaKey||e.shiftKey){
      e.preventDefault();
      e.stopImmediatePropagation();
      return;
    }
    selected.clear();
    selected.add(node.dataset.id);
    paint();
  },true);
  const style=document.createElement('style');
  style.textContent='.node.multi-selected{outline:2px solid #60a5fa!important;outline-offset:3px}.node.multi-selected::after{content:"";position:absolute;inset:-5px;border:1px dashed rgba(96,165,250,.65);pointer-events:none;border-radius:inherit}';
  document.head.appendChild(style);
})();
