/* Sanci9517 Visual Editor — structured state canvas renderer. */
(function(){
  const Schema=window.SanciEditorSchema;
  const labels={section:'Szakasz',container:'Konténer',text:'Szöveg',heading:'Címsor',paragraph:'Bekezdés',button:'Gomb',image:'Kép',card:'Kártya',group:'Csoport'};
  function px(v){return typeof v==='number'?v+'px':v==null?'':String(v)}
  function renderNode(node,selected){
    const el=document.createElement('div');el.className='node';el.dataset.nodeId=node.id;el.dataset.nodeType=node.type||'element';
    if(selected.has(node.id))el.classList.add('selected');if(node.locked)el.classList.add('locked');if(node.visibility===false)el.classList.add('hidden-node');
    const l=node.layout||{},s=node.style||{};if((l.position||'absolute')==='absolute'){el.style.position='absolute';el.style.left=px(l.x||0);el.style.top=px(l.y||0)}else el.style.position=l.position;
    if(l.width!=null)el.style.width=px(l.width);if(l.height!=null)el.style.height=px(l.height);if(l.padding!=null)el.style.padding=px(l.padding);if(l.margin!=null)el.style.margin=px(l.margin);if(l.display)el.style.display=l.display;
    if(s.color)el.style.color=s.color;if(s.background)el.style.background=s.background;if(s.fontSize)el.style.fontSize=px(s.fontSize);if(s.fontWeight)el.style.fontWeight=s.fontWeight;if(s.textAlign)el.style.textAlign=s.textAlign;if(s.border)el.style.border=s.border;if(s.radius!=null)el.style.borderRadius=px(s.radius);if(s.opacity!=null)el.style.opacity=s.opacity;
    const label=labels[node.type]||node.name||node.type;const text=node.content?.text??node.name??label;
    if(['section','container','row','columns','grid','stack','flex','group','card'].includes(node.type)){const title=document.createElement('span');title.className='node-label';title.textContent=node.name||label;el.appendChild(title)}else{const content=document.createElement('span');content.className='node-content';content.textContent=text;el.appendChild(content)}
    if(node.children?.length){const wrap=document.createElement('div');wrap.className='node-children';node.children.forEach(child=>wrap.appendChild(renderNode(child,selected)));el.appendChild(wrap)}
    if(!node.locked){const handle=document.createElement('i');handle.className='resize';handle.dataset.resize=node.id;el.appendChild(handle)}
    return el;
  }
  function render(state,root){if(!root)return;const selected=new Set(state.selection||[]);root.replaceChildren();const pageRoot=Schema.activePage(state.document)?.root;if(pageRoot)(pageRoot.children||[]).forEach(n=>root.appendChild(renderNode(n,selected)))}
  window.SanciEditorCanvas={render,renderNode};
})();
