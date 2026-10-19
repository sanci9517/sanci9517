import {hasResponsiveOverride,VIEWPORTS} from '../core/responsive.js';

/**
 * Reset just this Inspector group for the current breakpoint.
 * Returns canonical Editor commands; Undo grouping belongs to executeBatch.
 */
export function responsiveGroupResetActions(node,properties,device){
  if(!node?.id||node.locked||!VIEWPORTS.includes(device))return [];
  const seen=new Set(),actions=[];
  for(const property of properties||[]){
    if(!property?.responsive)continue;
    const key=property.key||property.id?.split('.')[1];
    if(!key||seen.has(key)||!hasResponsiveOverride(node.responsive,key,device))continue;
    seen.add(key);
    actions.push({type:'responsive.set',payload:{nodeId:node.id,device,patch:{[key]:undefined}}});
  }
  return actions;
}
