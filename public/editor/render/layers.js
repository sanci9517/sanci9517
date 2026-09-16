/* Sanci9517 Visual Editor — state-driven hierarchy/layers renderer foundation. */
(function(){
  function renderNode(node,selected){
    const row=document.createElement('div');
    row.className='layer';
    row.dataset.nodeId=node.id;
    if(selected.has(node.id))row.classList.add('selected');
    const name=document.createElement('span');
    name.className='layer-name';
    name.textContent=node.name||node.type||'Elem';
    row.appendChild(name);
    const children=node.children||[];
    if(children.length){
      const wrap=document.createElement('div');
      wrap.className='layer-children';
      children.forEach(child=>wrap.appendChild(renderNode(child,selected)));
      row.appendChild(wrap);
    }
    return row;
  }
  function render(state,root){
    if(!root)return;
    const selected=new Set(state.selection||[]);
    root.replaceChildren();
    const pageRoot=state.document?.page?.root;
    (pageRoot?.children||[]).forEach(n=>root.appendChild(renderNode(n,selected)));
  }
  window.SanciEditorLayers={render,renderNode};
})();
