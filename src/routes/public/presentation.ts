import {error,ok} from '../../core/response';
import {loadPresentation,defaultPresentation} from '../../core/site-presentation';
import {presentationAccess} from '../admin/presentation';
import type {Env} from '../../types/env';

export async function publicPresentationRoute(request:Request,env:Env,siteId:string){
  if(request.method!=='GET')return error('METHOD_NOT_ALLOWED',405);
  const preview=new URL(request.url).searchParams.get('preview')==='1';
  if(preview){const user=await presentationAccess(request,env,siteId,'editor');if(user instanceof Response)return user}
  try{const document=await loadPresentation(env,siteId);const presentation=preview?document.draft:document.published??defaultPresentation(siteId).draft;return ok({siteId,themeVersion:presentation.themeVersion,revision:preview?document.revision:presentation.revision,tokens:presentation.tokens,status:preview?'draft':'published'})}
  catch{return error('SITE_PRESENTATION_UNAVAILABLE',503)}
}
