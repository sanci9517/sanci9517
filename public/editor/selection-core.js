(()=>{
  const nodeFromEvent=e=>e.target?.closest?.('.node[data-id]');
  const nodes=()=>document.querySelectorAll('.node[data-id]');
  const clearVisual=()=>nodes().forEach(n=>n.classList.remove('selected','multi-selected'));
  const paintLabel=()=>{
    const label=document.getElementById('selectionState');
    if(!label)return;
    const count=document.querySelectorAll('.node.multi-selected').length;
    label.textContent=count>1?`Kijelölés: ${count} elem`:count===1?'Kijelölés: 1 elem':'Kijelölés: —';
  };
  document.addEventListener('pointerdown',e=>{
    const node=nodeFromEvent(e);
    const additive=e.ctrlKey||e.metaKey||e.shiftKey;
    if(!node){
      if(!additive){
        clearVisual();
        document.getElementById('canvas')?.click();
        paintLabel();
      }
      return;
    }
    if(!additive)return;
    e.preventDefault();
    e.stopImmediatePropagation();
    const current=document.querySelector('.node.selected');
    if(current)current.classList.remove('selected'),current.classList.add('multi-selected');
    if(node.classList.contains('multi-selected'))node.classList.remove('multi-selected');
    else node.classList.add('multi-selected');
    paintLabel();
  },true);
  document.addEventListener('click',e=>{
    const node=nodeFromEvent(e);
    const additive=e.ctrlKey||e.metaKey||e.shiftKey;
    if(node&&additive){e.preventDefault();e.stopImmediatePropagation();return;}
    if(!node&&!additive){clearVisual();paintLabel();}
    if(node&&!additive){clearVisual();}
  },true);
})();
