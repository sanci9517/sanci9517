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

/**
 * Legacy image appearance shares the authored image vocabulary, while keeping
 * old objectFit, focalPoint and loading defaults. Return only allowlisted CSS
 * values: these are written into both DOM style and published inline styles.
 */
const IMAGE_FITS=new Set(['cover','contain','fill','none','scale-down']);
const IMAGE_RATIOS=new Set(['auto','16 / 9','4 / 3','1 / 1','3 / 4']);
const LEGACY_FOCAL_POINTS={center:[50,50],top:[50,0],bottom:[50,100],left:[0,50],right:[100,50]};
const focal=(value,fallback)=>{
  if(value===null||value===undefined||value==='')return fallback;
  // Persisted legacy documents may contain non-numeric JSON values. Never
  // coerce booleans, arrays, objects or whitespace into a valid focal point.
  if(typeof value!=='number'&&typeof value!=='string')return fallback;
  // Only plain decimal text is valid. Number() also accepts hexadecimal,
  // binary and octal strings, which are not Inspector percentage values.
  if(typeof value==='string'&&!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(value.trim()))return fallback;
  const parsed=Number(value);
  return Number.isFinite(parsed)?Math.max(0,Math.min(100,Math.round(parsed))):fallback;
};

export function legacyImagePresentation(props){
  const p=props??{},fit=IMAGE_FITS.has(p.objectFit)?p.objectFit:(IMAGE_FITS.has(p.fit)?p.fit:'cover');
  const ratio=IMAGE_RATIOS.has(p.ratio)?p.ratio:'auto';
  // Never read inherited Object.prototype keys as preset coordinates.
  const preset=typeof p.focalPoint==='string'&&Object.hasOwn(LEGACY_FOCAL_POINTS,p.focalPoint)
    ?LEGACY_FOCAL_POINTS[p.focalPoint]:LEGACY_FOCAL_POINTS.center;
  const [oldX,oldY]=preset;
  const focalX=focal(p.focalX,oldX),focalY=focal(p.focalY,oldY);
  const decorative=p.decorative===true;
  return {
    fit,ratio,focalX,focalY,objectPosition:`${focalX}% ${focalY}%`,
    loading:p.loading==='eager'?'eager':'lazy',
    alt:decorative?'':String(p.alt??''),
    decorative
  };
}
