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
