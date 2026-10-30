import type { Env } from "../types/env";

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

function collectPublicationAssetRoles(value:any,out=new Map<string,Set<MediaRole>>(),inheritedRole:MediaRole='any',depth=0):Map<string,Set<MediaRole>>{
 if(depth>24||!value||typeof value!=='object')return out;
 if(Array.isArray(value)){for(const item of value)collectPublicationAssetRoles(item,out,inheritedRole,depth+1);return out;}
 const nodeRole=typeof value.type==='string'?MEDIA_NODE_ROLES[value.type]||inheritedRole:inheritedRole;
 for(const [key,item] of Object.entries(value)){
  if((key==='assetId'||IMAGE_REFERENCE_KEYS.has(key))&&typeof item==='string'&&ASSET_ID.test(item)){
   const role:MediaRole=IMAGE_REFERENCE_KEYS.has(key)?'image':nodeRole;
   const roles=out.get(item)||new Set<MediaRole>();roles.add(role);out.set(item,roles);
  }
  if(item&&typeof item==='object'){
   const itemRole=key==='items'&&['gallery','carousel'].includes(value.type)?'image':nodeRole;
   collectPublicationAssetRoles(item,out,itemRole,depth+1);
  }
 }
 return out;
}

export function collectPublicationAssetIds(value:any,out=new Set<string>(),depth=0):Set<string>{
 for(const id of collectPublicationAssetRoles(value,new Map(), 'any',depth).keys())out.add(id);
 return out;
}

/** Ensures published media is active, owned by the site, and used only for a compatible element role. */
export async function validatePublicationAssets(db:Env['DB'],siteId:string,document:unknown):Promise<'MEDIA_NOT_FOUND'|null>{
 const requirements=collectPublicationAssetRoles(document),assetIds=[...requirements.keys()];
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
