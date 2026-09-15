(()=>{
  const api=()=>window.SanciEditor;
  const containerTypes=new Set(['root','section','container','row','columns','grid','stack','flex','group','card']);
  const esc=v=>String(v).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
  const getSelected=()=>{const a=api();return a?.state?.selected?.map(id=>a.find(id)).filter(Boolean)||[]};
  const isContainer=n=>!!n&&containerTypes.has(n.type);
  const walk=(nodes,fn)=>{for(const n of nodes||[]){fn(n);walk(n.children||[],fn)}};
  const parentOf=(id,nodes=api()?.state?.doc?.root?.children)=>{
    for(const n of nodes||[]){
      if((n.children||[]).some(c=>c.id===id))return n;
      const found=parentOf(id,n.children||[]);if(found)return found;
    }
    return null;
  };
  const hasDescendant=(ancestorId,targetId)=>{
    const a=api(),ancestor=a?.find?.(ancestorId);if(!ancestor)return false;
    let hit=false;walk(ancestor.children||[],n=>{if(n.id===targetId)hit=true});return hit;
  };
  const removeFromTree=(id,nodes)=>{
    for(let i=0;i<(nodes||[]).length;i++){
      if(nodes[i].id===id)return nodes.splice(i,1)[0];
      const hit=removeFromTree(id,nodes[i].children||[]);if(hit)return hit;
    }
    return null;
  };
  const absolutePosition=(n,parent)=>{
    let x=Number(n.layout?.x)||0,y=Number(n.layout?.y)||0,p=parent;
    while(p){x+=Number(p.layout?.x)||0;y+=Number(p.layout?.y)||0;p=parentOf(p.id)}
    return {x,y};
  };
  const setRelativePosition=(n,parent)=>{
    const abs=absolutePosition(n,parent);
    const px=Number(parent?.layout?.x)||0,py=Number(parent?.layout?.y)||0;
    n.layout=n.layout||{};n.layout.x=abs.x-px;n.layout.y=abs.y-py;
  };
  const addChildren=()=>{
    const a=api(),sel=getSelected();
    if(!a||!a.state.doc||sel.length<2){a?.show?.('Jelöld ki a szülőt és legalább egy gyermekelemet');return}
    const parent=sel[0],children=sel.slice(1);
    if(!isContainer(parent)){a.show('Az első kijelölt elemnek konténernek kell lennie');return}
    if(children.some(n=>n.id===parent.id)){a.show('A szülő nem lehet saját gyermeke');return}
    if(children.some(n=>n.id===parent.id||hasDescendant(n.id,parent.id))){a.show('Érvénytelen hierarchia: körkörös szülő-gyermek kapcsolat');return}
    if(children.some(n=>hasDescendant(n.id,n.id))){a.show('Érvénytelen elemstruktúra');return}
    a.commit();
    parent.children=parent.children||[];
    children.forEach(child=>{
      const oldParent=parentOf(child.id);
      const removed=removeFromTree(child.id,a.state.doc.root.children);
      if(!removed)return;
      const oldAbs=absolutePosition(removed,oldParent);
      removed.layout=removed.layout||{};
      removed.layout.x=oldAbs.x-(Number(parent.layout?.x)||0);
      removed.layout.y=oldAbs.y-(Number(parent.layout?.y)||0);
      parent.children.push(removed);
    });
    a.state.selected=[parent.id];a.render();a.show(`${children.length} elem a(z) „${parent.name}” gyermekévé vált`);
  };
  const moveOut=()=>{
    const a=api(),sel=getSelected();
    if(!a||!a.state.doc||sel.length!==1){a?.show?.('Egyetlen gyermekelemet jelölj ki');return}
    const child=sel[0],parent=parentOf(child.id);
    if(!parent){a.show('Ez az elem már a gyökérszinten van');return}
    const grand=parentOf(parent.id);
    a.commit();
    const removed=removeFromTree(child.id,parent.children||[]);if(!removed)return;
    const abs=absolutePosition(removed,parent);
    removed.layout=removed.layout||{};
    removed.layout.x=abs.x-(Number(grand?.layout?.x)||0);
    removed.layout.y=abs.y-(Number(grand?.layout?.y)||0);
    (grand?grand.children:a.state.doc.root.children).push(removed);
    a.state.selected=[removed.id];a.render();a.show('Elem kivéve a szülőből');
  };
  const moveToParent=(childId,parentId)=>{
    const a=api(),child=a?.find?.(childId),parent=a?.find?.(parentId);
    if(!child||!parent||child.id===parent.id||!isContainer(parent)||hasDescendant(child.id,parent.id))return false;
    const oldParent=parentOf(child.id),removed=removeFromTree(child.id,a.state.doc.root.children);if(!removed)return false;
    const abs=absolutePosition(removed,oldParent);removed.layout=removed.layout||{};removed.layout.x=abs.x-(Number(parent.layout?.x)||0);removed.layout.y=abs.y-(Number(parent.layout?.y)||0);
    parent.children=parent.children||[];parent.children.push(removed);return true;
  };
  const boot=()=>{
    const toolbar=document.querySelector('.canvas-tools');if(!toolbar||toolbar.dataset.hierarchyReady==='1')return;
    toolbar.dataset.hierarchyReady='1';
    const nest=document.getElementById('nestBtn')||document.createElement('button');nest.id='nestBtn';nest.type='button';nest.textContent='Gyermekbe helyezés';nest.title='Első kijelölt = szülő, a többi = gyermek';nest.onclick=addChildren;
    const out=document.getElementById('unnestBtn')||document.createElement('button');out.id='unnestBtn';out.type='button';out.textContent='Kiemelés';out.title='Kijelölt gyermek kivétele a szülőből';out.onclick=moveOut;
    const anchor=document.getElementById('groupBtn');if(anchor){anchor.before(nest,out)}else{toolbar.append(nest,out)}
    window.SanciHierarchy={parentOf,moveToParent,isContainer,hasDescendant};
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();