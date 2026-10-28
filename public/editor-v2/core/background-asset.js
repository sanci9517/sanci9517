import {GRADIENTS} from './state-styles.js';

export const MEDIA_ASSET_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function backgroundImageValue(values, {editor=false}={}) {
  const layers=[];
  const id=values?.backgroundAssetId;
  if(typeof id==='string'&&MEDIA_ASSET_ID.test(id)) {
    const path=editor?`/api/admin/media?id=${encodeURIComponent(id)}`:`/media/${encodeURIComponent(id)}`;
    layers.push(`url("${path}")`);
  }
  if(GRADIENTS.includes(values?.backgroundImage)&&values.backgroundImage!=='none')layers.push(values.backgroundImage);
  return layers.join(', ')||'none';
}
