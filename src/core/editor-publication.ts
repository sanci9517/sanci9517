import type { Env } from "../types/env";
import { safeMediaUrl } from "../../public/editor-v2/core/authored-content.js";

const PUBLISHABLE_MEDIA_MIMES=new Set(['image/png','image/jpeg','image/gif','image/webp','audio/mpeg','audio/ogg','audio/wav','video/webm']);
const ROLE_MIMES={
 image:new Set(['image/png','image/jpeg','image/gif','image/webp']),
 audio:new Set(['audio/mpeg','audio/ogg','audio/wav']),
 video:new Set(['video/webm'])
} as const;
type MediaRole=keyof typeof ROLE_MIMES|'any';
const MEDIA_NODE_ROLES:Record<string,MediaRole>={image:'image',audio:'audio',video:'video',gallery:'image',carousel:'image'};
const IMAGE_REFERENCE_KEYS=new Set(['backgroundAssetId','imageAssetId','posterAssetId']);
const ASSET_ID=/^[0-9a-f-]{36}$/i;
const ROUTE_ASSET_ID=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const INVALID_MEDIA_REFERENCE='invalid-media-route';

function localMediaUrlAssetId(value:unknown,allowedOrigins:ReadonlySet<string>):string|null{
 if(typeof value!=='string')return null;
 try{
  const normalized=safeMediaUrl(value);
  let url:URL;
  if(normalized.startsWith('/')){
   if(normalized.startsWith('//')||normalized.startsWith('/\\'))return null;
   url=new URL(normalized,'https://media-reference.invalid');
  }else{
   url=new URL(normalized);
   if(url.protocol!=='https:'||!allowedOrigins.has(url.origin))return null;
  }
  const pathname=url.pathname.replace(/\/+$/,'');
  if(pathname==='/media'||pathname.startsWith('/media/')){
   const match=pathname.match(/^\/media\/([^/]+)$/);
   return match&&ROUTE_ASSET_ID.test(match[1])?match[1].toLowerCase():INVALID_MEDIA_REFERENCE;
  }
  return null;
 }catch{return null;}
}

export function hasAbsoluteMediaLibraryUrl(value:unknown,depth=0):boolean{
 if(depth>24||!value||typeof value!=='object')return false;
 if(Array.isArray(value))return value.some(item=>hasAbsoluteMediaLibraryUrl(item,depth+1));
 for(const [key,item] of Object.entries(value)){
  if((key==='src'||key==='poster'||key==='imageSrc')&&typeof item==='string'){
   const override=key==='poster'?'posterAssetId':key==='imageSrc'?'imageAssetId':'assetId';
   if(!(typeof (value as Record<string,unknown>)[override]==='string'&&ASSET_ID.test((value as Record<string,string>)[override]))){
    try{
     const normalized=safeMediaUrl(item);
     if(normalized.startsWith('https:')){
      const pathname=new URL(normalized).pathname;
      if(pathname==='/media'||pathname.startsWith('/media/'))return true;
     }
    }catch{ /* Invalid sources cannot authorize or require a tenant domain. */ }
   }
  }
  if(item&&typeof item==='object'&&hasAbsoluteMediaLibraryUrl(item,depth+1))return true;
 }
 return false;
}

/** Persist canonical IDs in the live snapshot so D1's existing archive triggers
 * still recognize references if archive and Publish race after validation. */
export function canonicalizePublicationMediaReferences(value:any,allowedOrigins:ReadonlySet<string>,depth=0):any{
 if(depth>24||!value||typeof value!=='object')return value;
 if(Array.isArray(value))return value.map(item=>canonicalizePublicationMediaReferences(item,allowedOrigins,depth+1));
 const result:Record<string,unknown>={...value};
 for(const [key,item] of Object.entries(value)){
  if((key==='assetId'||IMAGE_REFERENCE_KEYS.has(key))&&typeof item==='string'&&ASSET_ID.test(item))result[key]=item.toLowerCase();
  else if((key==='src'||key==='poster'||key==='imageSrc')&&typeof item==='string'){
   const override=key==='poster'?'posterAssetId':key==='imageSrc'?'imageAssetId':'assetId';
   const mediaId=localMediaUrlAssetId(item,allowedOrigins);
   if(!(typeof value[override]==='string'&&ASSET_ID.test(value[override]))&&mediaId&&mediaId!==INVALID_MEDIA_REFERENCE){
    result[key]=safeMediaUrl(item).replace(/(\/media\/)([0-9a-f-]{36})(?=\/*(?:[?#]|$))/i,(_match:string,prefix:string,id:string)=>prefix+id.toLowerCase());
   }
  }else if(item&&typeof item==='object')result[key]=canonicalizePublicationMediaReferences(item,allowedOrigins,depth+1);
 }
 return result;
}

function collectPublicationAssetRoles(value:any,out=new Map<string,Set<MediaRole>>(),inheritedRole:MediaRole='any',depth=0,allowedOrigins:ReadonlySet<string>=new Set()):Map<string,Set<MediaRole>>{
 if(depth>24||!value||typeof value!=='object')return out;
 if(Array.isArray(value)){for(const item of value)collectPublicationAssetRoles(item,out,inheritedRole,depth+1,allowedOrigins);return out;}
 const nodeRole=typeof value.type==='string'?MEDIA_NODE_ROLES[value.type]||inheritedRole:inheritedRole;
 for(const [key,item] of Object.entries(value)){
  if((key==='assetId'||IMAGE_REFERENCE_KEYS.has(key))&&typeof item==='string'&&ASSET_ID.test(item)){
   const role:MediaRole=IMAGE_REFERENCE_KEYS.has(key)?'image':nodeRole;
   const id=item.toLowerCase();
   const roles=out.get(id)||new Set<MediaRole>();roles.add(role);out.set(id,roles);
  }
  if((key==='src'||key==='poster'||key==='imageSrc')&&typeof item==='string'){
   const override=key==='poster'?'posterAssetId':key==='imageSrc'?'imageAssetId':'assetId';
   if(!(typeof value[override]==='string'&&ASSET_ID.test(value[override]))){
    const id=localMediaUrlAssetId(item,allowedOrigins);
    if(id){
     const role:MediaRole=key==='poster'||key==='imageSrc'?'image':nodeRole;
     const roles=out.get(id)||new Set<MediaRole>();roles.add(role);out.set(id,roles);
    }
   }
  }
  if(item&&typeof item==='object'){
   const itemRole=key==='items'&&['gallery','carousel'].includes(value.type)?'image':nodeRole;
   collectPublicationAssetRoles(item,out,itemRole,depth+1,allowedOrigins);
  }
 }
 return out;
}

export function collectPublicationAssetIds(value:any,out=new Set<string>(),depth=0):Set<string>{
 for(const id of collectPublicationAssetRoles(value,new Map(), 'any',depth).keys())out.add(id);
 return out;
}

/** Ensures published media is active, owned by the site, and used only for a compatible element role. */
export async function validatePublicationAssets(db:Env['DB'],siteId:string,document:unknown,allowedOrigins:ReadonlySet<string>=new Set()):Promise<'MEDIA_NOT_FOUND'|null>{
 const requirements=collectPublicationAssetRoles(document,new Map(),'any',0,allowedOrigins),assetIds=[...requirements.keys()];
 for(let offset=0;offset<assetIds.length;offset+=80){
  const chunk=assetIds.slice(offset,offset+80);
  const owned=await db.prepare(`SELECT id,mime_type FROM media WHERE site_id=? AND archived_at IS NULL AND id IN (${chunk.map(()=>'?').join(',')})`).bind(siteId,...chunk).all<{id:string;mime_type:string}>();
  if(owned.results.length!==chunk.length||owned.results.some(asset=>{
   const roles=requirements.get(asset.id)||new Set<MediaRole>(['any']);
   return !PUBLISHABLE_MEDIA_MIMES.has(asset.mime_type)||[...roles].some(role=>role==='any'?!PUBLISHABLE_MEDIA_MIMES.has(asset.mime_type):!ROLE_MIMES[role].has(asset.mime_type));
  }))return 'MEDIA_NOT_FOUND';
 }
 return null;
}
