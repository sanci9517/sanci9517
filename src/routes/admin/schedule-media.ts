import { error,ok } from "../../core/response";
import { requireScheduleEditorAccess } from "../../core/auth/schedule-editor-access";

import { getCanonicalSiteContext } from "../../core/site-context";
import { scheduleArtworkJSON,scheduleArtworkKey,validScheduleArtworkId,SCHEDULE_ARTWORK_ACTIVE_IMAGE_RECHECK,SCHEDULE_ARTWORK_COMMIT_AUDIT_GUARD,SCHEDULE_ARTWORK_CLEAR_AUDIT_GUARD } from "../../core/schedule-artwork.ts";
import type { Env } from "../../types/env";

type Payload = { itemId?: unknown; assetId?: unknown };

export async function adminScheduleMediaRoute(request:Request,env:Env):Promise<Response> {
  const {siteId}=getCanonicalSiteContext();
  const access=await requireScheduleEditorAccess(request,env,siteId);
  if(access instanceof Response)return access;
  const user=access;
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
      ${SCHEDULE_ARTWORK_ACTIVE_IMAGE_RECHECK}
      ON CONFLICT(key) DO UPDATE SET value_json=excluded.value_json,updated_at=CURRENT_TIMESTAMP`)
      .bind(key,scheduleArtworkJSON(normalizedAssetId),scheduleId,siteId,normalizedAssetId,siteId):
    env.DB.prepare("DELETE FROM site_settings WHERE key=?").bind(key);
  // The batch is transactional: audit is committed only if the event still
  // exists and, when attaching an image, the actual sidecar and active image
  // satisfy the same commit-time preconditions as the UPSERT. An advisory
  // preflight must never produce a success audit record on a failed write.
  const auditWhere=normalizedAssetId?SCHEDULE_ARTWORK_COMMIT_AUDIT_GUARD:SCHEDULE_ARTWORK_CLEAR_AUDIT_GUARD;
  const auditBind=normalizedAssetId?
    [normalizedAssetId,scheduleId,siteId,scheduleArtworkJSON(normalizedAssetId)]:
    [scheduleId,siteId];
  const audit=env.DB.prepare(`INSERT INTO audit_log (id,user_id,action,entity_type,entity_id,metadata_json)
    SELECT ?,?,?,?,?,? WHERE ${auditWhere}`)
    .bind(crypto.randomUUID(),user.id,"schedule.artwork.update","schedule_item",scheduleId,
      JSON.stringify({siteId,assetId:normalizedAssetId}),...auditBind);
  const results=await env.DB.batch([statement,audit]);
  // A vanished event or archived image produces no association and no false
  // audit entry. A cleared-but-already-absent sidecar is an idempotent success
  // only while the requested schedule event itself still exists.
  if((normalizedAssetId && Number(results?.[0]?.meta?.changes??0)!==1) ||
    Number(results?.[1]?.meta?.changes??0)!==1)
    return error("SCHEDULE_ARTWORK_CONFLICT",409,"The event or image changed; refresh before retrying.");
  return ok({itemId:scheduleId,imageAssetId:normalizedAssetId});
}
