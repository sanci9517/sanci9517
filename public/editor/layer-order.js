(()=>{
  const controlId='layer-order-controls';
  const getNode=()=>Array.isArray(state.selected)&&state.selected.length===1?find(state.selected[0]):null;
  const getGroup=()=>{const n=getNode();return n?.groupId||null};
  const relevantNodes=()=>{
    const group=getGroup();
    return allNodes().filter(n=>group?n.groupId===group:!n.groupId);
  };
  const normalize=()=>{
    const nodes=relevantNodes();
    nodes.forEach((n,i)=>{n.zIndex=i+1});
  };
  const move=(direction)=>{
    const n=getNode();
    if(!n)return;
    const nodes=relevantNodes();
    const index=nodes.findIndex(x=>x.id===n.id);
    if(index<0)return;
    commit();
    if(direction==='forward'&&index<nodes.length-1){
      const other=nodes[index+1];
      const z=n.zIndex??index+1;n.zIndex=other.zIndex??index+2;other.zIndex=z;
    }else if(direction==='backward'&&index>0){
      const other=nodes[index-1];
      const z=n.zIndex??index+1;n.zIndex=other.zIndex??index;other.zIndex=z;
    }else if(direction==='front'){
      const max=Math.max(0,...nodes.map(x=>Number(x.zIndex)||0));n.zIndex=max+1;
    }else if(direction==='back'){
      const min=Math.min(1,...nodes.map(x=>Number(x.zIndex)||1));n.zIndex=Math.max(1,min-1);
    }else{state.history.pop();state.dirty=true;updateSaveState();return}
    normalize();
    render();
    show(direction==='forward'?'Előrébb':direction==='backward'?'Hátrébb':direction==='front'?'Legelőre':'Leghátra');
  };
  const makeButton=(label,action,title)=>{
    const b=document.createElement('button');
    b.type='button';b.className='btn';b.textContent=label;b.title=title;b.style.width='100%';b.style.marginTop='6px';
    b.addEventListener('click',()=>move(action));return b;
  };
  const inject=()=>{
    const box=document.getElementById('inspector');
    if(!box)return;
    const n=getNode();
    const old=document.getElementById(controlId);
    if(old)old.remove();
    if(!n)return;
    const section=document.createElement('section');section.id=controlId;section.style.marginTop='14px';section.style.paddingTop='12px';section.style.borderTop='1px solid rgba(255,255,255,.12)';
    const title=document.createElement('div');title.textContent='Rétegsorrend';title.style.fontWeight='700';title.style.marginBottom='4px';section.appendChild(title);
    const info=document.createElement('div');info.textContent='Z-index: '+String(n.zIndex??1);info.style.opacity='.7';info.style.fontSize='12px';section.appendChild(info);
    section.appendChild(makeButton('↑ Előrébb','forward','Egy réteggel előrébb'));
    section.appendChild(makeButton('↓ Hátrébb','backward','Egy réteggel hátrébb'));
    section.appendChild(makeButton('⇧ Legelőre','front','Legfelső réteg'));
    section.appendChild(makeButton('⇩ Leghátra','back','Leghátsó réteg'));
    box.appendChild(section);
  };
  const start=()=>{
    const box=document.getElementById('inspector');
    if(!box)return setTimeout(start,100);
    new MutationObserver(inject).observe(box,{childList:true,subtree:false});
    inject();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
