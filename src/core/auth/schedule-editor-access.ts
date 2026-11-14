import { error } from "../response";
import { getAuthenticatedUser,hasRole,type AuthUser } from "./require-auth";
import { requireSiteGrant } from "./site-access";
import { DEFAULT_SITE_ID } from "../site-context";
import type { Env } from "../../types/env";

// Schedule administration must use the same fail-closed site membership gate
// as Pages, the visual Editor, navigation and the private Media library.
// The historical global editor role applies only on the original site while
// multi-tenant membership enforcement is not yet enabled.
export async function requireScheduleEditorAccess(
  request:Request,env:Env,siteId:string
):Promise<AuthUser|Response>{
  if(!siteId||!siteId.trim())return error("SITE_CONTEXT_INVALID",403);
  if(env.SITE_MEMBERSHIP_ENFORCEMENT==="enabled"){
    const grant=await requireSiteGrant(request,env,siteId,"editor");
    return grant instanceof Response?grant:grant.user;
  }
  if(siteId!==DEFAULT_SITE_ID)return error("SITE_ACCESS_DENIED",403);
  const user=await getAuthenticatedUser(request,env);
  if(!user)return error("UNAUTHORIZED",401,"Authentication required");
  return hasRole(user,"editor")?user:error("FORBIDDEN",403,"Editor role required");
}
