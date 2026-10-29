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
  if(selected&&!selected.locked&&canContain(selected,childType)){
    return {parentId:selected.id,index:selected.children.length};
  }

  // A locked node cannot receive a child or have its child order changed.
  // When the direct parent is locked, bubble the insertion anchor up until
  // the new node can sit beside that locked subtree in the nearest unlocked
  // container, preserving its visual position in the page flow.
  let anchor=selected;
  while(anchor?.parentId){
    const parent=getNode(page,anchor.parentId);
    if(!parent)break;
    if(!parent.locked&&canContain(parent,childType)){
      const index=parent.children.indexOf(anchor.id);
      return {parentId:parent.id,index:index<0?parent.children.length:index+1};
    }
    anchor=parent;
  }

  return root.locked?null:{parentId:root.id,index:root.children.length};
}
