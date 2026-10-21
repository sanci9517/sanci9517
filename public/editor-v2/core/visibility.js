/* Canonical per-device visibility for Editor Canvas and public Page Model. */
export const VISIBILITY_DEVICES=Object.freeze(['desktop','tablet','mobile']);

export function isVisibleOnDevice(node,device='desktop'){
  if(!node)return false;
  // Old persisted Page Models may use a single false value.
  return node?.visibility!==false&&node?.visibility?.[device]!==false;
}

export function normalizeVisibility(value){
  if(value===false)return {desktop:false,tablet:false,mobile:false};
  return Object.fromEntries(VISIBILITY_DEVICES.map(device=>[device,value?.[device]!==false]));
}

export function getNodeVisibilityState(page,nodeId,device='desktop'){
  const node=page?.nodes?.[nodeId];
  if(!node)return {ownVisible:false,effectiveVisible:false,hiddenByAncestorId:null};
  const ownVisible=isVisibleOnDevice(node,device);
  let parentId=node.parentId,hiddenByAncestorId=null;
  const seen=new Set([nodeId]);
  while(parentId&&parentId!==page.rootId&&!seen.has(parentId)){
    seen.add(parentId);
    const parent=page.nodes[parentId];
    if(!parent)break;
    if(!isVisibleOnDevice(parent,device)){hiddenByAncestorId=parentId;break}
    parentId=parent.parentId;
  }
  return {ownVisible,effectiveVisible:ownVisible&&!hiddenByAncestorId,hiddenByAncestorId};
}

/**
 * Traverses only nodes that can actually render on this device. Root itself
 * is a Page Model container and is not a renderable element.
 * Hidden ancestors exclude their entire subtree, including data-driven nodes.
 */
export function collectVisibleDescendants(page,device='desktop'){
  const nodes=page?.nodes??{};
  const visible=[],seen=new Set();
  const visit=id=>{
    if(seen.has(id))return;
    seen.add(id);
    const node=nodes[id];
    if(!isVisibleOnDevice(node,device))return;
    visible.push(node);
    for(const child of node.children??[])visit(child);
  };
  for(const id of nodes[page?.rootId]?.children??[])visit(id);
  return visible;
}
