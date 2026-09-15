(()=>{
  const api=()=>window.SanciEditor;
  const containerTypes=new Set(['section','container','row','columns','grid','stack','flex','group','card']);
  const esc=v=>String(v).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
  const getSelected=()=>{const a=api();return a?.state?.selected?.map(id=>a.find(id)).filter(Boolean)||[]};
  const isContainer=n=>!!n&&containerTypes.has(n.type);
  const parentOf=(id,nodes=api()?.state?.doc?.root?.children)=>{
    let found=null;
    (nodes||[]).some(n=>{
      if((n.children||[]).some(c=>c.id===id)){found=n;return true}
      found=parentOf(id,n.children||[]);return !!found
    });
    return found;
  };
  const removeFromTree=(id,nodes)=>{
    for(let i=0;i<(nodes||[]).length;i++){
      if(nodes[i].id===id)return nodes.splice(i,1)[0];
      const hit=removeFromTree(id,nodes[i].children||[]);
      if(hit)return hit;
    }
    return null;
  };
  const addChildren=()=>{
    const a=api(),sel=getSelected();
    if(!a||!a.state.doc||sel.length<2){a?.show?.('Jelöld ki a szülőt és legalább egy gyermekelemet');return}
    const parent=sel[0],children=sel.slice(1);
    if(!isContainer(parent)){a.show('Az első kijelölt elemnek konténernek kell lennie');return}
    if(children.some(n=>n.id===parent.id)){a.show('A szülő nem lehet saját gyermeke');return}
    if(children.some(n=>{let p=parentOf(parent.id);while(p){if(p.id===n.id)return true;p=parentOf(p.id)}return false})){a.show('Érvénytelen hierarchia: a szülő egyik kijelölt gyermekének leszármazottja');return}
    a.commit();
    parent.children=parent.children||[];
    const px=Number(parent.layout?.x)||0,py=Number(parent.layout?.y)||0;
    children.forEach(child=>{
      const currentParent=parentOf(child.id);
      const removed=removeFromTree(child.id,a.state.doc.root.children);
      if(!removed)return;
      removed.layout=removed.layout||{};
      removed.layout.x=(Number(removed.layout.x)||0)-px;
      removed.layout.y=(Number(removed.layout.y)||0)-py;
      parent.children.push(removed);
    });
    a.state.selected=[parent.id];
    a.render();
    a.show(`${children.length} elem a(z) „${parent.name}” gyermekévé vált`);
  };
  const moveOut=()=>{
    const a=api(),sel=getSelected();
    if(!a||!a.state.doc||sel.length!==1){a?.show?.('Egyetlen gyermekelemet jelölj ki');return}
    const child=sel[0],parent=parentOf(child.id);
    if(!parent){a.show('Ez az elem már a gyökérszinten van');return}
    const grand=parentOf(parent.id);
    a.commit();
    const removed=removeFromTree(child.id,parent.children||[]);
    if(!removed)return;
    const base=grand||{layout:{x:0,y:0},children:a.state.doc.root.children};
    removed.layout=removed.layout||{};
    removed.layout.x=(Number(removed.layout.x)||0)+(Number(parent.layout?.x)||0)-(Number(base.layout?.x)||0);
    removed.layout.y=(Number(removed.layout.y)||0)+(Number(parent.layout?.y)||0)-(Number(base.layout?.y)||0);
    (grand?grand.children:a.state.doc.root.children).push(removed);
    a.state.selected=[removed.id];
    a.render();
    a.show('Elem kivéve a szülőből');
  };
  const boot=()=>{
    const toolbar=document.querySelector('.canvas-tools');
    if(!toolbar||toolbar.querySelector('#nestBtn'))return;
    const nest=document.createElement('button');
    nest.id='nestBtn';nest.type='button';nest.textContent='Gyermekbe helyezés';nest.title='Első kijelölt = szülő, a többi = gyermek';nest.addEventListener('click',addChildren);
    const out=document.createElement('button');
    out.id='unnestBtn';out.type='button';out.textContent='Kiemelés';out.title='Kijelölt gyermek kivétele a szülőből';out.addEventListener('click',moveOut);
    const anchor=document.getElementById('groupBtn');
    if(anchor){anchor.before(nest,out)}else{toolbar.append(nest,out)}
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();