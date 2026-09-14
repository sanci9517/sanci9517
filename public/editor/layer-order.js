(()=>{
  const controlId='layer-order-controls';
  let observing=false;
  const selectedNodes=()=>Array.isArray(state.selected)?state.selected.map(id=>find(id)).filter(Boolean):[];
  const getNode=()=>{const nodes=selectedNodes();return nodes.length===1?nodes[0]:null};
  const getGroup=()=>{const n=getNode();return n?.groupId||null};
  const relevantNodes=()=>{
    const group=getGroup();
    return allNodes().filter(n=>group?n.groupId===group:!n.groupId);
  };
  const ensureZ=()=>{
    const nodes=relevantNodes();
    const unique=new Set(nodes.map(n=>Number(n.zIndex)));
    if(nodes.length&&(!nodes.every(n=>Number.isFinite(Number(n.zIndex)))||unique.size!==nodes.length)){
      nodes.forEach((n,i)=>{n.zIndex=100+i});
    }
  };
  const move=(direction)=>{
    const n=getNode();
    if(!n)return;
    const nodes=relevantNodes();
    if(!nodes.some(x=>x.id===n.id))return;
    ensureZ();
    const ordered=[...nodes].sort((a,b)=>(Number(a.zIndex)||0)-(Number(b.zIndex)||0));
    const index=ordered.findIndex(x=>x.id===n.id);
    if(index<0)return;
    if((direction==='forward'&&index===ordered.length-1)||(direction==='backward'&&index===0)){
      show(direction==='forward'?'Már a legelöl lévő réteg':'Már a leghátsó réteg');
      return;
    }
    commit();
    if(direction==='forward'||direction==='backward'){
      const other=ordered[index+(direction==='forward'?1:-1)];
      const z=n.zIndex;n.zIndex=other.zIndex;other.zIndex=z;
    }else if(direction==='front'){
      n.zIndex=Math.max(...ordered.map(x=>Number(x.zIndex)||100))+1;
    }else if(direction==='back'){
      n.zIndex=Math.min(...ordered.map(x=>Number(x.zIndex)||100))-1;
    }
    render();
    show(direction==='forward'?'Előrébb':direction==='backward'?'Hátrébb':direction==='front'?'Legelőre':'Leghátra');
  };
  const makeButton=(label,action,title)=>{
    const b=document.createElement('button');
    b.type='button';b.className='btn';b.textContent=label;b.title=title;b.style.width='100%';b.style.marginTop='6px';
    b.addEventListener('click',()=>move(action));return b;
  };
  const inject=()=>{
    if(observing)return;
    const box=document.getElementById('inspector');
    if(!box)return;
    const n=getNode();
    const old=document.getElementById(controlId);
    if(old)old.remove();
    if(!n)return;
    observing=true;
    const section=document.createElement('section');section.id=controlId;section.style.marginTop='14px';section.style.paddingTop='12px';section.style.borderTop='1px solid rgba(255,255,255,.12)';
    const title=document.createElement('div');title.textContent='Rétegsorrend';title.style.fontWeight='700';title.style.marginBottom='4px';section.appendChild(title);
    const info=document.createElement('div');info.textContent='Z-index: '+String(n.zIndex??'automatikus');info.style.opacity='.7';info.style.fontSize='12px';section.appendChild(info);
    section.appendChild(makeButton('↑ Előrébb','forward','Egy réteggel előrébb'));
    section.appendChild(makeButton('↓ Hátrébb','backward','Egy réteggel hátrébb'));
    section.appendChild(makeButton('⇧ Legelőre','front','Legfelső réteg'));
    section.appendChild(makeButton('⇩ Leghátra','back','Leghátsó réteg'));
    box.appendChild(section);
    requestAnimationFrame(()=>{observing=false});
  };
  const start=()=>{
    const box=document.getElementById('inspector');
    if(!box)return setTimeout(start,100);
    new MutationObserver(()=>inject()).observe(box,{childList:true,subtree:false});
    inject();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
