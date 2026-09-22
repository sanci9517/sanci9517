import { error, ok } from "../../core/response";
import { getAuthenticatedUser, hasRole } from "../../core/auth/require-auth";
import { normalizeEditorDocument } from "../../core/page-model";
import type { Env } from "../../types/env";

type PageRow={id:string;slug:string;title:string;description:string;published_content_json:string|null;content_json:string;sort_order:number;updated_at:string};
function parse(value:string|null|undefined):any{try{return JSON.parse(value||'{}')}catch{return null}}
function mapPage(row:PageRow,useDraft=false){const raw=parse(useDraft?row.content_json:row.published_content_json);const document=normalizeEditorDocument(raw,row.id,row.title,row.slug,row.description);if(!document)return null;const content=document.pages[row.id];if(!content)return null;return{id:row.id,slug:row.slug,title:row.title,description:row.description,content:{...content,type:'sanci-document'},updatedAt:row.updated_at}}
export async function publicPagesRoute(request:Request,env:Env):Promise<Response>{
 const url=new URL(request.url),slug=url.searchParams.get('slug')?.trim().toLowerCase()||'',explicitPreview=url.searchParams.get('preview')==='1';let useDraft=explicitPreview;
 if(explicitPreview){const user=await getAuthenticatedUser(request,env);if(!user)return error('UNAUTHORIZED',401,'Authentication required');if(!hasRole(user,'editor'))return error('FORBIDDEN',403,'Editor role required')}
 else {const user=await getAuthenticatedUser(request,env);useDraft=Boolean(user&&hasRole(user,'editor'))}
 if(!slug){const result=await env.DB.prepare(`SELECT id,slug,title,description,published_content_json,content_json,sort_order,updated_at FROM pages ${useDraft?'':'WHERE is_published=1'} ORDER BY sort_order ASC LIMIT 100`).all<PageRow>();return ok(result.results.map(r=>mapPage(r,useDraft)).filter(Boolean))}
 const row=await env.DB.prepare(`SELECT id,slug,title,description,published_content_json,content_json,sort_order,updated_at FROM pages WHERE slug=?1 ${useDraft?'':'AND is_published=1'} LIMIT 1`).bind(slug).first<PageRow>();if(!row)return error('PAGE_NOT_FOUND',404);const page=mapPage(row,useDraft);if(!page)return error('PAGE_NOT_CANONICAL',409,'Az oldal dokumentuma nem alakítható canonical Editor v2 Page Modelre.');return ok(page);
}
