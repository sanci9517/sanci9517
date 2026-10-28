import {canContain,getNode} from './schema.js';

/**
 * Resolve a palette insertion point from the current selection.
 * Containers receive new children at their end; adding beside a selected leaf
 * inserts immediately after it, preserving the visual order of the page flow.
 */
export function resolveElementInsertion(page,selectedNodeId,childType){
  const root=page?.rootId?getNode(page,page.rootId):null;
  if(!root)return null;

  const selected=selectedNodeId?getNode(page,selectedNodeId):null;
  if(selected&&canContain(selected,childType)){
    return {parentId:selected.id,index:selected.children.length};
  }

  if(selected?.parentId){
    const parent=getNode(page,selected.parentId);
    if(parent&&canContain(parent,childType)){
      const selectedIndex=parent.children.indexOf(selected.id);
      return {parentId:parent.id,index:selectedIndex<0?parent.children.length:selectedIndex+1};
    }
  }

  return {parentId:root.id,index:root.children.length};
}
