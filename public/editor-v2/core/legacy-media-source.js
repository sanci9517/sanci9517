/* One source contract for legacy Page Model images in Editor and public pages.
 * Media-library image IDs have the same UUID shape as authored content fields.
 * A selected image takes precedence over any older external source URL.
 */
import {safeMediaUrl} from './element-content.js';

const MEDIA_ASSET_ID=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function legacyImageSource(props,{editor=false}={}){
  const id=props?.assetId;
  if(typeof id==='string'&&MEDIA_ASSET_ID.test(id)){
    return editor?'/api/admin/media?id='+encodeURIComponent(id):'/media/'+encodeURIComponent(id);
  }
  return safeMediaUrl(props?.src);
}

/** Same playback flags in legacy Editor Canvas and the published page. */
export function legacyPlaybackSettings(props,{video=false,editor=false}={}){
  const p=props??{},muted=video&&p.muted===true;
  return {
    controls:p.controls!==false,
    loop:p.loop===true,
    muted,
    autoplay:video&&!editor&&p.autoplay===true&&muted,
    poster:video?legacyImageSource({assetId:p.posterAssetId,src:p.poster},{editor}):''
  };
}
