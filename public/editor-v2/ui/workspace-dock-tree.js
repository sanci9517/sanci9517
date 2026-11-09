const PANEL_SIDES=new Set(['left','right']);
const ID=/^[a-z][a-z\d-]{0,63}$/u;
const MAX_DEPTH=8;
const MAX_NODES=31;

/**
 * Normalize the serializable workspace docking tree. Canvas and both dock
 * panels are required exactly once so malformed imported profiles cannot make
 * an editor surface disappear. Group IDs are stable within one saved tree.
 */
export function normalizeWorkspaceDockTree(value){
  const ids=new Set(),leaves=new Set();let count=0;
  const visit=(node,depth,inTabs=false)=>{
    if(!node||typeof node!=='object'||Array.isArray(node)||depth>MAX_DEPTH||++count>MAX_NODES)return null;
    if(typeof node.id!=='string'||!ID.test(node.id)||ids.has(node.id))return null;
    ids.add(node.id);
    if(node.kind==='canvas'){
      if(inTabs||leaves.has('canvas'))return null;
      leaves.add('canvas');return {id:node.id,kind:'canvas'};
    }
    if(node.kind==='panel'){
      if(!PANEL_SIDES.has(node.side)||leaves.has(node.side))return null;
      leaves.add(node.side);return {id:node.id,kind:'panel',side:node.side};
    }
    if(node.kind!=='split'&&node.kind!=='tabs')return null;
    if(!Array.isArray(node.children)||(node.kind==='split'?node.children.length!==2:node.children.length<2||node.children.length>3))return null;
    if(node.kind==='split'){
      if(!['horizontal','vertical'].includes(node.axis))return null;
      const ratio=Number(node.ratio);if(!Number.isFinite(ratio)||ratio<0.1||ratio>0.9)return null;
      const children=node.children.map(child=>visit(child,depth+1,inTabs));
      return children.some(child=>!child)?null:{id:node.id,kind:'split',axis:node.axis,ratio,children};
    }
    const children=node.children.map(child=>visit(child,depth+1,true));
    if(children.some(child=>!child)||!children.some(child=>child.id===node.activeId))return null;
    return {id:node.id,kind:'tabs',activeId:node.activeId,children};
  };
  const tree=visit(value,0);
  return tree&&leaves.size===3&&['canvas','left','right'].every(leaf=>leaves.has(leaf))?tree:null;
}

export function workspaceDockTreeSignature(tree){
  const normalized=normalizeWorkspaceDockTree(tree);
  return normalized?JSON.stringify(normalized):'';
}

function uniqueNodeId(tree,base){
  const ids=new Set();
  const collect=node=>{ids.add(node.id);node.children?.forEach(collect)};
  collect(tree);
  let candidate=base.slice(0,64),sequence=1;
  while(ids.has(candidate)){const suffix=`-${sequence++}`;candidate=`${base.slice(0,64-suffix.length)}${suffix}`}
  return candidate;
}

/** Move a visible panel beside a leaf or into a panel-only tab group. */
export function moveWorkspaceDockTreeLeaf(value,sourceId,targetId,placement,{axis='horizontal',before=true}={}){
  const tree=normalizeWorkspaceDockTree(value);
  if(!tree||sourceId===targetId||!['before','after','tab'].includes(placement)||!['horizontal','vertical'].includes(axis))return null;
  const find=(node,id)=>node.id===id?node:node.children?.map(child=>find(child,id)).find(Boolean);
  const source=find(tree,sourceId),target=find(tree,targetId);
  if(!source||!target||!['panel','canvas'].includes(source.kind)||!['panel','canvas'].includes(target.kind))return null;
  if(placement==='tab'&&(source.kind!=='panel'||target.kind!=='panel'))return null;
  const remove=node=>{
    if(node.id===sourceId)return null;
    if(!node.children)return node;
    const children=node.children.map(remove).filter(Boolean);
    if(node.kind==='split'&&children.length===1)return children[0];
    if(node.kind==='tabs'&&children.length===1)return children[0];
    if(children.length===node.children.length&&children.every((child,index)=>child===node.children[index]))return node;
    return node.kind==='tabs'?{...node,activeId:children.some(child=>child.id===node.activeId)?node.activeId:children[0].id,children}:{...node,children};
  };
  const remaining=remove(tree);
  if(!remaining)return null;
  let inserted=false;
  const add=node=>{
    if(node.id===targetId){
      inserted=true;
      if(placement==='tab'){
        const children=before?[source,node]:[node,source];
        return {id:uniqueNodeId(remaining,`tabs-${sourceId}-${targetId}`),kind:'tabs',activeId:sourceId,children};
      }
      const children=before?[source,node]:[node,source];
      return {id:uniqueNodeId(remaining,`split-${sourceId}-${targetId}`),kind:'split',axis,ratio:0.5,children};
    }
    if(!node.children)return node;
    return {...node,children:node.children.map(add)};
  };
  const result=add(remaining);
  return inserted?normalizeWorkspaceDockTree(result):null;
}
