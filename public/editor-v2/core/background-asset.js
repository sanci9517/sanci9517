import {GRADIENTS} from './state-styles.js';
import {parseTokenReference} from './design-tokens.js';

export const MEDIA_ASSET_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const LEGACY_BACKGROUND_COLOR_TOKENS=new Set(['colors.primary','colors.text','colors.surface','colors.border']);

// A legacy `background` shorthand may contain a gradient. Reuse only the
// project's fixed Inspector tokens; never promote arbitrary legacy CSS into
// the editor's image layers or create a Canvas resource request from it.
export function legacyBackgroundGradient(value) {
  return typeof value==='string'&&value!=='none'&&GRADIENTS.includes(value)?value:'';
}

// Promote a compound legacy shorthand only when every image layer matches an
// existing Inspector gradient and an optional final color is a literal HEX or
// an exact Brand Kit reference. This intentionally excludes URLs, arbitrary
// CSS functions, escapes, comments, and position/size shorthand.
export function legacyBackgroundCompound(value) {
  if(typeof value!=='string'||value.length>2048)return null;
  const parts=[];
  let depth=0,start=0;
  for(let i=0;i<value.length;i++) {
    const char=value[i];
    if(char==='\\'||char==='"'||char==="'"||char===';'||/[\u0000-\u001f\u007f]/.test(char))return null;
    if(char==='/'&&value[i+1]==='*')return null;
    if(char==='(') {
      if(++depth>4)return null;
    } else if(char===')') {
      if(--depth<0)return null;
    } else if(char===','&&depth===0) {
      parts.push(value.slice(start,i).trim());start=i+1;
    }
  }
  if(depth!==0)return null;
  parts.push(value.slice(start).trim());
  if(parts.length<2||parts.some(part=>!part))return null;

  let color='';
  const final=parts.at(-1);
  const tokenId=parseTokenReference(final);
  if(LEGACY_BACKGROUND_COLOR_TOKENS.has(tokenId)||/^#(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i.test(final))color=final;
  const gradients=color?parts.slice(0,-1):parts;
  if(!gradients.length||!gradients.every(part=>legacyBackgroundGradient(part)))return null;
  return {image:gradients.join(', '),color};
}

// Only literal, resource-free colors are promoted from a legacy background
// shorthand. Complex CSS retains its existing public behavior.
export function legacyBackgroundColor(value) {
  if (typeof value !== 'string') return '';
  const text=value.trim();
  if (!text || /^(?:inherit|initial|unset|revert|revert-layer)$/i.test(text)) return '';
  if(LEGACY_BACKGROUND_COLOR_TOKENS.has(parseTokenReference(text)))return text;
  if (!/^(?:#[0-9a-f]{3}(?:[0-9a-f]|[0-9a-f]{3}|[0-9a-f]{5})?|[a-z]+|(?:rgba?|hsla?)\([\d\s.,%+\/-]+\))$/i.test(text)) return '';
  if (typeof globalThis.CSS?.supports === 'function' && !globalThis.CSS.supports('background-color',text)) return '';
  return text;
}

export function backgroundImageValue(values, {editor=false,legacyBackground=true}={}) {
  const layers=[];
  const id=values?.backgroundAssetId;
  if(typeof id==='string'&&MEDIA_ASSET_ID.test(id)) {
    const path=editor?`/api/admin/media?id=${encodeURIComponent(id)}`:`/media/${encodeURIComponent(id)}`;
    layers.push(`url("${path}")`);
  }
  const hasCanonicalImage=values?.backgroundImage!==undefined&&values.backgroundImage!==null&&values.backgroundImage!=='';
  if(GRADIENTS.includes(values?.backgroundImage)&&values.backgroundImage!=='none')layers.push(values.backgroundImage);
  else if(!hasCanonicalImage&&legacyBackground) {
    const compound=legacyBackgroundCompound(values?.background);
    if(compound)layers.push(compound.image);
    else {
      const gradient=legacyBackgroundGradient(values?.background);
      if(gradient)layers.push(gradient);
    }
  }
  return layers.join(', ')||'none';
}
