(()=>{
  const selected=new Set();
  const canvas=()=>document.getElementById('canvas');
  const stateLabel=()=>document.getElementById('selectionState');
  const nodeFromEvent=e=>e.target.closest?.('.node[data-id]');
  const paint=()=>{
    const c=canvas();if(!c)return;
    c.querySelectorAll('.node[data-id]').forEach(el=>el.classList.toggle('multi-selected',selected.has(el.dataset.id)));
    const label=stateLabel();
    if(label&&selected.size>1)label.textContent=`Kijelölés: ${selected.size} elem`;
  };
  document.addEventListener('click',e=>{
    const node=nodeFromEvent(e);if(!node)return;
    if(!(e.ctrlKey||e.metaKey||e.shiftKey)){
      selected.clear();
      return;
    }
    e.preventDefault();e.stopImmediatePropagation();
    const id=node.dataset.id;
    if(selected.has(id))selected.delete(id);else selected.add(id);
    if(selected.size===0){selected.add(id)}
    paint();
  },true);
  const style=document.createElement('style');
  style.textContent='.node.multi-selected{outline:2px solid #60a5fa!important;outline-offset:3px}.node.multi-selected::after{content:"";position:absolute;inset:-5px;border:1px dashed rgba(96,165,250,.65);pointer-events:none;border-radius:inherit}';
  document.head.appendChild(style);
})();
