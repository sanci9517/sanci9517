import { error,ok } from "../../core/response";
import { getAuthenticatedUser,hasRole } from "../../core/auth/require-auth";
import { auditStatement } from "../../core/audit";
import { getCanonicalSiteContext } from "../../core/site-context";
import { scheduleArtworkJSON,scheduleArtworkKey,validScheduleArtworkId } from "../../core/schedule-artwork";
import type { Env } from "../../types/env";

type Payload = { itemId?: unknown; assetId?: unknown };

export async function adminScheduleMediaRoute(request:Request,env:Env):Promise<Response> {
  const {siteId}=getCanonicalSiteContext();
  const user=await getAuthenticatedUser(request,env);
  if(!user)return error("UNAUTHORIZED",401,"Authentication required");
  if(!hasRole(user,"editor"))return error("FORBIDDEN",403,"Editor role required");
  if(request.method!=="PUT")return error("METHOD_NOT_ALLOWED",405);
  const url=new URL(request.url);
  if(request.headers.get("Origin")!==url.origin||request.headers.get("Sec-Fetch-Site")==="cross-site")
    return error("INVALID_ORIGIN",403);
  const contentType=request.headers.get("Content-Type")||"";
  if(!/^application\/json(?:\s*;|\s*$)/i.test(contentType))return error("INVALID_CONTENT_TYPE",415);
  let body:Payload;
  try{body=(await request.json()) as Payload;}catch{return error("INVALID_JSON",400);}
  if(!body||typeof body!=="object"||Array.isArray(body))return error("INVALID_SCHEDULE_ARTWORK",400);
  const itemId=body.itemId;
  const assetId=body.assetId===null||body.assetId===""?null:body.assetId;
  if(!validScheduleArtworkId(itemId)||(assetId!==null&&!validScheduleArtworkId(assetId)))return error("INVALID_SCHEDULE_ARTWORK",400);
  const scheduleId=itemId.toLowerCase(),normalizedAssetId=assetId===null?null:assetId.toLowerCase();
  const event=await env.DB.prepare("SELECT id FROM schedule_items WHERE site_id=? AND id=? LIMIT 1").bind(siteId,scheduleId).first<{id:string}>();
  if(!event)return error("SCHEDULE_ITEM_NOT_FOUND",404);
  if(normalizedAssetId){
    const asset=await env.DB.prepare(
      "SELECT id FROM media WHERE site_id=? AND id=? AND archived_at IS NULL AND mime_type IN ('image/png','image/jpeg','image/webp','image/gif') LIMIT 1"
    ).bind(siteId,normalizedAssetId).first<{id:string}>();
    if(!asset)return error("SCHEDULE_ARTWORK_NOT_FOUND",409,"Choose an active image from this site's media library.");
  }
  const key=scheduleArtworkKey(siteId,scheduleId),statement=normalizedAssetId?
    env.DB.prepare(`INSERT INTO site_settings (key,value_json,updated_at)
      SELECT ?,?,CURRENT_TIMESTAMP WHERE EXISTS (SELECT 1 FROM schedule_items WHERE id=? AND site_id=?)
      ON CONFLICT(key) DO UPDATE SET value_json=excluded.value_json,updated_at=CURRENT_TIMESTAMP`)
      .bind(key,scheduleArtworkJSON(normalizedAssetId),scheduleId,siteId):
    env.DB.prepare("DELETE FROM site_settings WHERE key=?").bind(key);
  await env.DB.batch([
    statement,
    auditStatement(env,user.id,"schedule.artwork.update","schedule_item",scheduleId,
      {siteId,assetId:normalizedAssetId})
  ]);
  return ok({itemId:scheduleId,imageAssetId:normalizedAssetId});
}
