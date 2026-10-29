import type { Env } from "../types/env";

const PUBLISHABLE_MEDIA_MIMES=new Set(['image/png','image/jpeg','image/gif','image/webp','audio/mpeg','audio/ogg','audio/wav','video/webm']);

export function collectPublicationAssetIds(value:any,out=new Set<string>(),depth=0):Set<string>{
 if(depth>24||!value||typeof value!=='object')return out;
 if(Array.isArray(value)){for(const item of value)collectPublicationAssetIds(item,out,depth+1);return out;}
 for(const key of ['assetId','backgroundAssetId','imageAssetId','posterAssetId'])if(typeof value[key]==='string'&&/^[0-9a-f-]{36}$/i.test(value[key]))out.add(value[key]);
 for(const item of Object.values(value))collectPublicationAssetIds(item,out,depth+1);
 return out;
}

/** Ensures all media referenced by a published document is active, publishable, and owned by its site. */
export async function validatePublicationAssets(db:Env['DB'],siteId:string,document:unknown):Promise<'MEDIA_NOT_FOUND'|null>{
 const assetIds=[...collectPublicationAssetIds(document)];
 for(let offset=0;offset<assetIds.length;offset+=80){
  const chunk=assetIds.slice(offset,offset+80);
  const owned=await db.prepare(`SELECT id,mime_type FROM media WHERE site_id=? AND archived_at IS NULL AND id IN (${chunk.map(()=>'?').join(',')})`).bind(siteId,...chunk).all<{id:string;mime_type:string}>();
  if(owned.results.length!==chunk.length||owned.results.some(asset=>!PUBLISHABLE_MEDIA_MIMES.has(asset.mime_type)))return 'MEDIA_NOT_FOUND';
 }
 return null;
}
