import {VIEWPORTS,resolveResponsiveValue,hasResponsiveOverride} from '../core/responsive.js';

/**
 * Present the origin of a responsive Inspector value without creating a
 * second style resolver. Only the canonical Page Model is authoritative.
 */
const NAMES=Object.freeze({desktop:'Asztali',tablet:'Tablet',mobile:'Mobil'});
export function describeResponsiveOrigin(responsive,key,device,{hasBaseStyle=false}={}){
  if(!VIEWPORTS.includes(device))throw new Error('Ismeretlen szerkesztési nézet.');
  const resolved=resolveResponsiveValue(responsive,key,device);
  const own=hasResponsiveOverride(responsive,key,device)&&resolved.source===device;
  if(own)return {kind:'own',source:device,label:'Saját érték · '+NAMES[device]};
  if(resolved.source)return {kind:'inherited',source:resolved.source,label:'Örökölt · '+NAMES[resolved.source]};
  return {kind:'base',source:null,label:hasBaseStyle?'Alapstílus':'Alapértelmezett'};
}
