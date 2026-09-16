/* Sanci9517 Visual Editor — structured hierarchy/layers renderer. */
(function(){
  const Schema=window.SanciEditorSchema;
  function renderNode(node,selected,depth=0){
    const row=document.createElement('div');row.className='layer';row.dataset.nodeId=node.id;row.dataset.depth=depth;
    if(selected.has(node.id))row.classList.add('selected');if(node.locked)row.classList.add('locked');
    const name=document.createElement('button');name.type='button';name.className='layer-name';name.textContent=node.name||node.type||'Elem';name.style.paddingLeft=(8+depth*16)+'px';row.appendChild(name);
    const children=node.children||[];
    if(children.length){const wrap=document.createElement('div');wrap.className='layer-children';children.forEach(child=>wrap.appendChild(renderNode(child,selected,depth+1)));row.appendChild(wrap)}
    return row;
  }
  function render(state,root){if(!root)return;const selected=new Set(state.selection||[]);root.replaceChildren();const pageRoot=Schema.activePage(state.document)?.root;(pageRoot?.children||[]).forEach(n=>root.appendChild(renderNode(n,selected,0)))}
  window.SanciEditorLayers={render,renderNode};
})();
