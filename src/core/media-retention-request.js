import { retentionTransition } from "./media-retention-policy.js";

// No R2 deletion is possible through this service. Caller must supply
// a transactionally safe, authorized persistence adapter.
export async function prepareRetentionRequest({asset,usage,objectPresent,now,days=30}) {
  if (!asset || typeof asset.id!=="string" || typeof asset.site_id!=="string" ||
      typeof asset.object_key!=="string" ||
      !asset.object_key.startsWith("sites/"+encodeURIComponent(asset.site_id)+"/media/") ||
      asset.object_key.length <= ("sites/"+encodeURIComponent(asset.site_id)+"/media/").length ||
      !Number.isInteger(days) || days<1 || days>365 ||
      !(now instanceof Date) || !Number.isFinite(now.getTime()))
    return {ok:false,reason:"INVALID_REQUEST"};
  const verdict=retentionTransition("requested","quarantined",{
    archived:Boolean(asset.archived_at),
    usageComplete:usage?.complete===true,
    referenceCount:Array.isArray(usage?.references)?usage.references.length:undefined,
    objectPresent
  });
  if (!verdict.allowed) return {ok:false,reason:verdict.reason};
  const notBefore=new Date(now.getTime()+days*86400000);
  if (!Number.isFinite(notBefore.getTime())) return {ok:false,reason:"INVALID_REQUEST"};
  return {ok:true,value:{
    siteId:asset.site_id,assetId:asset.id,objectKey:asset.object_key,
    state:"requested",notBefore:notBefore.toISOString(),
    finalDeletionAuthorized:false
  }};
}

export function prepareRetentionCancellation(request) {
  if (!request || typeof request.id!=="string" || !request.id ||
      typeof request.site_id!=="string" || !request.site_id)
    return {ok:false,reason:"INVALID_REQUEST"};
  const verdict=retentionTransition(request.state,"cancelled");
  if (!verdict.allowed) return {ok:false,reason:verdict.reason};
  return {ok:true,value:{id:request.id,siteId:request.site_id,nextState:"cancelled",finalDeletionAuthorized:false}};
}
