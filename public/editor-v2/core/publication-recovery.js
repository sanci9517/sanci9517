import {getChildren} from './schema.js';
import {getElementCapability} from './capability-matrix.js';

/** Find the first node the server will reject, following visible layer order. */
export function firstUnsupportedPublicationNode(page){
  if(!page||typeof page.rootId!=='string')return null;
  const visited=new Set([page.rootId]);
  const pending=[...getChildren(page,page.rootId)].reverse();
  while(pending.length){
    const node=pending.pop();
    if(!node||visited.has(node.id))continue;
    visited.add(node.id);
    if(getElementCapability(node.type).public!=='PARTIAL')return {id:node.id,type:node.type,name:typeof node.name==='string'?node.name:''};
    const children=getChildren(page,node.id);
    for(let index=children.length-1;index>=0;index--)pending.push(children[index]);
  }
  return null;
}

export function unsupportedPublicationMessage(node){
  const label=node?.name?.trim()||node?.type||'ismeretlen elem';
  return `A „${label}” elem típusa még nem publikálható. A mentett piszkozat, az élő oldal és a verzió változatlan maradt. A Rétegek panelen jelöld ki, majd töröld vagy cseréld le az elemet; utána külön publikálj.`;
}
