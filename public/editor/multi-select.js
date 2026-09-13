(()=>{
  const selected=new Set();
  const canvas=()=>document.getElementById('canvas');
  const label=()=>document.getElementById('selectionState');
  const nodeFromEvent=e=>{
    const t=e.target;
    return t&&t.closest?t.closest('#canvas .node[data-id]'):null;
  };
  const hasModifier=e=>e.ctrlKey||e.metaKey;
  const paint=()=>{
    const c=canvas();
    if(!c)return;
    c.querySelectorAll('.node[data-id]').forEach(el=>{
      el.classList.toggle('multi-selected',selected.has(el.dataset.id));
    });
    const l=label();
    if(l)l.textContent=selected.size?`Kijelölés: ${selected.size} elem`:'Kijelölés: —';
  };
  const clear=()=>{selected.clear();paint();};

  document.addEventListener('pointerdown',e=>{
    const node=nodeFromEvent(e);

    if(!node){
      if(!hasModifier(e))clear();
      return;
    }

    if(!hasModifier(e))return;

    // Ctrl/Cmd selection belongs entirely to this module.
    // Stop the editor's native single-selection pointer handler.
    e.preventDefault();
    e.stopImmediatePropagation();

    const id=node.dataset.id;
    if(selected.has(id))selected.delete(id);
    else selected.add(id);
    paint();
  },true);

  document.addEventListener('click',e=>{
    const node=nodeFromEvent(e);

    if(node&&hasModifier(e)){
      e.preventDefault();
      e.stopImmediatePropagation();
      paint();
      return;
    }

    if(!node&&!hasModifier(e))clear();
  },true);

  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&selected.size){
      e.preventDefault();
      clear();
    }
  });

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

  const observer=new MutationObserver(()=>paint());
  const start=()=>{
    const c=canvas();
    if(c)observer.observe(c,{childList:true,subtree:true});
    paint();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
