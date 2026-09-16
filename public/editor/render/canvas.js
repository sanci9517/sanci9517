/* Sanci9517 Visual Editor — state-driven canvas renderer foundation. */
(function(){
  const State=window.SanciEditorState;
  if(!State) throw new Error('SanciEditorState missing');
  function renderNode(node,selected){
    const el=document.createElement('div');
    el.className='node';
    el.dataset.nodeId=node.id;
    el.dataset.nodeType=node.type||'element';
    if(selected) el.classList.add('selected');
    el.textContent=node.content?.text ?? node.name ?? node.type ?? 'Elem';
    const s=node.style||{};
    if(s.width!=null) el.style.width=typeof s.width==='number'?s.width+'px':s.width;
    if(s.height!=null) el.style.height=typeof s.height==='number'?s.height+'px':s.height;
    if(s.color) el.style.color=s.color;
    if(s.background) el.style.background=s.background;
    if(s.fontSize) el.style.fontSize=typeof s.fontSize==='number'?s.fontSize+'px':s.fontSize;
    (node.children||[]).forEach(child=>el.appendChild(renderNode(child,selected.has(child.id))));
    return el;
  }
  function render(state,root){
    if(!root)return;
    const selected=new Set(state.selection||[]);
    root.replaceChildren();
    const pageRoot=state.document?.page?.root;
    if(pageRoot)(pageRoot.children||[]).forEach(n=>root.appendChild(renderNode(n,selected)));
  }
  window.SanciEditorCanvas={render,renderNode};
})();
