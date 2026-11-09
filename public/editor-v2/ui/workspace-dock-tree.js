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
