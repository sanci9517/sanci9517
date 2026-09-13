(()=>{
  const selected=new Set();
  const canvas=()=>document.getElementById('canvas');
  const label=()=>document.getElementById('selectionState');
  const getNode=e=>{
    const t=e.target;
    return t&&typeof t.closest==='function'?t.closest('#canvas .node[data-id]'):null;
  };
  const paint=()=>{
    const c=canvas();
    if(!c)return;
    c.querySelectorAll('.node[data-id]').forEach(el=>{
      el.classList.toggle('multi-selected',selected.has(el.dataset.id));
    });
    const l=label();
    if(l)l.textContent=selected.size>0?`Kijelölés: ${selected.size} elem`:'Kijelölés: —';
  };
  const clear=()=>{
    if(!selected.size){paint();return;}
    selected.clear();
    paint();
  };
  const hasModifier=e=>e.ctrlKey||e.metaKey;

  // Modifier selection is handled before the editor's own pointerdown handler.
  document.addEventListener('pointerdown',e=>{
    const node=getNode(e);
    if(!node){
      if(!hasModifier(e)&&!e.shiftKey)clear();
      return;
    }
    if(!hasModifier(e)&&!e.shiftKey)return;

    e.preventDefault();
    e.stopImmediatePropagation();
    const id=node.dataset.id;
    if(selected.has(id))selected.delete(id);else selected.add(id);
    paint();
  },true);

  // A normal click starts a fresh selection. A blank click clears everything.
  document.addEventListener('click',e=>{
    const node=getNode(e);
    if(node){
      if(hasModifier(e)||e.shiftKey){
        e.preventDefault();
        e.stopImmediatePropagation();
        paint();
        return;
      }
      clear();
      return;
    }
    if(!hasModifier(e)&&!e.shiftKey)clear();
  },true);

  // Prevent the editor's single-selection class from making an old multi-selection look active.
  const style=document.createElement('style');
  style.textContent=`
    #canvas .node.multi-selected{
      outline:2px solid #60a5fa!important;
      outline-offset:3px;
    }
    #canvas .node.multi-selected::after{
      content:"";
      position:absolute;
      inset:-5px;
      border:1px dashed rgba(96,165,250,.65);
      pointer-events:none;
      border-radius:inherit;
    }
  `;
  document.head.appendChild(style);
})();
