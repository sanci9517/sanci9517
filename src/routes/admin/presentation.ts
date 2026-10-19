import {error,ok} from '../../core/response';
import {getAuthenticatedUser,hasRole,type AuthUser} from '../../core/auth/require-auth';
import {requireSiteGrant} from '../../core/auth/site-access';
import {DEFAULT_SITE_ID} from '../../core/site-context';
import {loadPresentation,savePresentation} from '../../core/site-presentation';
import type {Env} from '../../types/env';

export async function presentationAccess(request:Request,env:Env,siteId:string,role:'admin'|'editor'='admin'):Promise<AuthUser|Response>{
  if(!siteId?.trim())return error('SITE_CONTEXT_INVALID',403);
  if(env.SITE_MEMBERSHIP_ENFORCEMENT==='enabled'){const grant=await requireSiteGrant(request,env,siteId,role);return grant instanceof Response?grant:grant.user}
  if(siteId!==DEFAULT_SITE_ID)return error('SITE_ACCESS_DENIED',403);
  const user=await getAuthenticatedUser(request,env);if(!user)return error('UNAUTHORIZED',401);if(!hasRole(user,role))return error('FORBIDDEN',403);return user;
}
export async function adminPresentationRoute(request:Request,env:Env,siteId:string){
  const user=await presentationAccess(request,env,siteId);if(user instanceof Response)return user;
  try{
    if(request.method==='GET')return ok(await loadPresentation(env,siteId));
    if(request.method!=='PUT')return error('METHOD_NOT_ALLOWED',405);
    let body;try{body=await request.json() as any}catch{return error('INVALID_JSON',400)}
    if(!body||typeof body!=='object'||Array.isArray(body)||JSON.stringify(body).length>16000)return error('INVALID_PRESENTATION',400);
    if(Object.keys(body).some(key=>!['expectedRevision','tokens','publish','restorePublished','restoreRevision'].includes(key)))return error('INVALID_PRESENTATION',400);
    if(body.publish!==undefined&&typeof body.publish!=='boolean')return error('INVALID_PRESENTATION',400);
    if(body.restorePublished!==undefined&&typeof body.restorePublished!=='boolean')return error('INVALID_PRESENTATION',400);
    if(body.restoreRevision!==undefined&&(!Number.isInteger(body.restoreRevision)||body.restoreRevision<0))return error('INVALID_PRESENTATION',400);
    if(body.publish===true&&(body.restorePublished===true||body.restoreRevision!==undefined))return error('INVALID_PRESENTATION',400,'A visszaállítás csak piszkozat lehet.');
    const result=await savePresentation(env,siteId,user.id,body);return result?ok(result):error('REVISION_CONFLICT',409,'A stíluskészlet időközben változott. A helyi munka megmaradt; töltsd be és hasonlítsd össze a friss verziót.');
  }catch(cause){const message=cause instanceof Error?cause.message:String(cause);if(message==='SITE_PRESENTATION_UNAVAILABLE'||message==='SITE_PRESENTATION_INVALID'||/SQLITE|D1_|database|no such table/i.test(message))return error('SITE_PRESENTATION_UNAVAILABLE',503);if(message==='EXPECTED_REVISION_REQUIRED')return error(message,428);return error('INVALID_PRESENTATION',400,message)}
}
