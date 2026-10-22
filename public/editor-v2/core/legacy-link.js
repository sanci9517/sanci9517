/* A single URL contract for legacy button/link Inspector and public HTML.
 * The shared rich-text URL validator already covers internal, anchor, HTTP(S)
 * and mailto URLs while rejecting credentials and unsafe protocols.
 */
import {validatedLinkHref} from './richtext-links.js';

export function safeLegacyLinkHref(value){
  if(value==null||String(value).trim()==='')return '';
  try{return validatedLinkHref(value)}catch{return ''}
}

export function legacyLinkHref(props){
  return safeLegacyLinkHref(props?.url||props?.href);
}

export function legacyLinkUpdate(props,href){
  // Both legacy properties have been used historically. Keeping only one
  // makes stale fallback values reappear when the Inspector URL is cleared.
  const value=String(href??'').trim();
  return {...(props||{}),url:value,href:value};
}
