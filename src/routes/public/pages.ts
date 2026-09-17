import { error, ok } from "../../core/response";
import { getAuthenticatedUser, hasRole } from "../../core/auth/require-auth";
import type { Env } from "../../types/env";

type PageRow={id:string;slug:string;title:string;description:string;published_content_json:string|null;content_json:string;updated_at:string};
function parse(value:string|null|undefined):any{try{return JSON.parse(value||'{}')}catch{return null}}
function pageModel(value:string|null|undefined,pageId:string){
 const document=parse(value);
 if(!document||document.type!=='sanci-page-document'||document.schemaVersion!==1||document.activePageId!==pageId)return null;
 const page=document.pages?.[pageId];
 if(!page||page.id!==pageId||!page.rootId||!page.nodes||typeof page.nodes!=='object')return null;
 return page;
}
function mapPage(row:PageRow,preview=false){
 const content=pageModel(preview?row.content_json:row.published_content_json,row.id);
 if(!content)return null;
 return{id:row.id,slug:row.slug,title:row.title,description:row.description,content:{...content,type:'sanci-document'},updatedAt:row.updated_at};
}
export async function publicPagesRoute(request:Request,env:Env):Promise<Response>{
 const url=new URL(request.url),slug=url.searchParams.get('slug')?.trim().toLowerCase()||'',preview=url.searchParams.get('preview')==='1';
 if(preview){const user=await getAuthenticatedUser(request,env);if(!user)return error('UNAUTHORIZED',401,'Authentication required');if(!hasRole(user,'editor'))return error('FORBIDDEN',403,'Editor role required')}
 if(!slug){const result=await env.DB.prepare(`SELECT id,slug,title,description,published_content_json,content_json,updated_at FROM pages ${preview?'':'WHERE is_published=1'} ORDER BY updated_at DESC,title ASC LIMIT 100`).all<PageRow>();const pages=result.results.map(r=>mapPage(r,preview)).filter(Boolean);return ok(pages)}
 const row=await env.DB.prepare(`SELECT id,slug,title,description,published_content_json,content_json,updated_at FROM pages WHERE slug=?1 ${preview?'':'AND is_published=1'} LIMIT 1`).bind(slug).first<PageRow>();
 if(!row)return error('PAGE_NOT_FOUND',404);
 const page=mapPage(row,preview);if(!page)return error('PAGE_NOT_CANONICAL',409,'Az oldal még nincs canonical Editor v2 Page Modelre migrálva.');return ok(page);
}
