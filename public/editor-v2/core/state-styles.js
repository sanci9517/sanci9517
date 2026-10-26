import {getProperty,listProperties} from './property-registry.js?v=20261025-content-property-route-contract';
import {normalizeInspectorValue} from './property-values.js';
import {resolveResponsiveValue,normalizeResponsive} from './responsive.js';

export const STATE_PROPERTY_IDS=Object.freeze(['typography.color','background.color','background.gradient','border.color','shadow.box','opacity.value','typography.textDecoration','typography.fontWeight','transform.rotate','transform.scale']);
export const GRADIENTS=Object.freeze(['none','linear-gradient(135deg, #7047eb 0%, #17b8a6 100%)','linear-gradient(135deg, #111827 0%, #475569 100%)','linear-gradient(135deg, #fb7185 0%, #fbbf24 100%)','linear-gradient(180deg, #ffffff 0%, #e0e7ff 100%)']);
export function normalizeStatePatch(node,state,device,patch){
  if(!['hover','focus-visible'].includes(state)||!['desktop','tablet','mobile'].includes(device))throw new Error('Érvénytelen állapot vagy nézet.');
  const responsive={...node.states?.[state],...normalizeResponsive(node.states?.[state])};
  for(const [key,value] of Object.entries(patch||{})){
    const property=STATE_PROPERTY_IDS.map(getProperty).find(item=>item?.key===key);if(!property)throw new Error('Ez a mező nem használható interaktív állapotban.');
    if(value===undefined)delete responsive[device][key];else responsive[device][key]=normalizeInspectorValue(property,value);
  }
  return {...node.states,[state]:responsive};
}
export function validateStateStyles(node){
  if(node.metadata?.stateVersion!==1)return;
  for(const state of ['hover','focus-visible'])for(const device of ['desktop','tablet','mobile'])normalizeStatePatch(node,state,device,node.states?.[state]?.[device]||{});
}
function stateDeclarations(responsive,device){
  let declarations='';
  for(const id of STATE_PROPERTY_IDS){const property=getProperty(id);if(!property)continue;const value=resolveResponsiveValue(responsive,property.key,device).value;if(value===undefined)continue;
    try{const normalized=normalizeInspectorValue(property,value);const key=property.key.replace(/[A-Z]/g,char=>'-'+char.toLowerCase());declarations+=`${key}:${normalized}!important;`}catch{}
  }
  return declarations;
}
export function hasStateStyles(node,state,device='desktop'){
  if(!['hover','focus-visible'].includes(state)||!['desktop','tablet','mobile'].includes(device))return false;
  if(state==='focus-visible'&&typeof node?.states?.focus?.outlineColor==='string'&&/^#(?:[a-f0-9]{3}|[a-f0-9]{6})$/i.test(node.states.focus.outlineColor))return true;
  if(node?.metadata?.stateVersion!==1)return false;
  return stateDeclarations(node.states?.[state],device)!=='';
}
export function buildStateStyles(page,device='desktop'){
  let css='';
  for(const node of Object.values(page?.nodes||{})){
    if(node.metadata?.stateVersion!==1||!/^[-\w]+$/.test(node.id))continue;
    for(const state of ['hover','focus-visible']){
      const declarations=stateDeclarations(node.states?.[state],device);
      if(declarations){const selector=`.creator-state-enabled[data-node-id="${node.id}"]`;css+=`${selector}:${state},${selector}[data-editor-state="${state}"]{${declarations}}`;}
    }
  }
  return css;
}
export function applyStateStyles(root,page,device){
  let sheet=root.querySelector(':scope > style[data-creator-states]');if(!sheet){sheet=document.createElement('style');sheet.dataset.creatorStates='1';root.append(sheet)}sheet.textContent=buildStateStyles(page,device);
}
