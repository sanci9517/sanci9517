import {GRADIENTS} from './state-styles.js';

export const MEDIA_ASSET_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// A legacy `background` shorthand may contain a gradient. Reuse only the
// project's fixed Inspector tokens; never promote arbitrary legacy CSS into
// the editor's image layers or create a Canvas resource request from it.
export function legacyBackgroundGradient(value) {
  return typeof value==='string'&&value!=='none'&&GRADIENTS.includes(value)?value:'';
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
    const gradient=legacyBackgroundGradient(values?.background);
    if(gradient)layers.push(gradient);
  }
  return layers.join(', ')||'none';
}
