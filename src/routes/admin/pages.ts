import { error, ok } from "../../core/response";
import { getAuthenticatedUser, hasRole } from "../../core/auth/require-auth";
import type { Env } from "../../types/env";

type PageRow = { id:string; slug:string; title:string; description:string; content_json:string; is_published:number; created_at:string; updated_at:string };
type PageBody = { id?:unknown; slug?:unknown; title?:unknown; description?:unknown; document?:unknown; isPublished?:unknown };
function parse(value:string):unknown{try{return JSON.parse(value)}catch{return {}}}
function canonical(value:unknown,id:string):boolean{const document:any=value;const page=document?.pages?.[id];return Boolean(document&&document.type==='sanci-page-document'&&document.schemaVersion===1&&document.activePageId===id&&page&&page.id===id&&page.rootId&&page.nodes&&typeof page.nodes==='object')}
function serialize(row:PageRow,includeContent=true){return{id:row.id,slug:row.slug,title:row.title,description:row.description,...(includeContent?{content:parse(row.content_json)}:{}),isPublished:Boolean(row.is_published),createdAt:row.created_at,updatedAt:row.updated_at}}
function validSlug(value:string){return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)}
async function audit(env:Env,userId:string,action:string,id:string,metadata:unknown){await env.DB.prepare(`INSERT INTO audit_log (id,user_id,action,entity_type,entity_id,metadata_json) VALUES (?,?,?,?,?,?)`).bind(crypto.randomUUID(),userId,action,"page",id,JSON.stringify(metadata)).run()}
export async function adminPagesRoute(request:Request,env:Env):Promise<Response>{
 const user=await getAuthenticatedUser(request,env);if(!user)return error("UNAUTHORIZED",401,"Authentication required");if(!hasRole(user,"editor"))return error("FORBIDDEN",403,"Editor role required");
 if(request.method==='GET'){const metaOnly=new URL(request.url).searchParams.get('meta')==='1';const rows=await env.DB.prepare(`SELECT id,slug,title,description,content_json,is_published,created_at,updated_at FROM pages ORDER BY updated_at DESC,title ASC`).all<PageRow>();return ok(rows.results.map(r=>serialize(r,!metaOnly)))}
 let body:PageBody;try{body=await request.json() as PageBody}catch{return error("INVALID_JSON",400)}
 if(request.method==='DELETE'){const id=typeof body.id==='string'?body.id:'';if(!id)return error("INVALID_PAGE_ID",400);const count=await env.DB.prepare(`SELECT COUNT(*) AS count FROM pages`).first<{count:number}>();if(Number(count?.count||0)<=1)return error("LAST_PAGE",409,"Az utolsó oldal nem törölhető.");const result=await env.DB.prepare("DELETE FROM pages WHERE id=?").bind(id).run();if(!result.meta.changes)return error("PAGE_NOT_FOUND",404);await audit(env,user.id,"page.delete",id,{});return ok({id,deleted:true})}
 if(request.method==='PATCH'){const id=typeof body.id==='string'?body.id:'';const title=typeof body.title==='string'?body.title.trim():'';if(!id)return error("INVALID_PAGE_ID",400);if(!title||title.length>160)return error("INVALID_PAGE_TITLE",400);const existing=await env.DB.prepare(`SELECT id,slug,title,description,content_json,is_published,created_at,updated_at FROM pages WHERE id=? LIMIT 1`).bind(id).first<PageRow>();if(!existing)return error("PAGE_NOT_FOUND",404);await env.DB.prepare("UPDATE pages SET title=?,updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(title,id).run();await audit(env,user.id,"page.rename",id,{oldTitle:existing.title,title});return ok(serialize({...existing,title},true))}
 if(request.method!=='POST')return error("METHOD_NOT_ALLOWED",405);
 const title=typeof body.title==='string'?body.title.trim():'';const slug=typeof body.slug==='string'?body.slug.trim().toLowerCase():'';const description=typeof body.description==='string'?body.description.trim():'';const id=typeof body.id==='string'?body.id.trim():crypto.randomUUID();const document=body.document;
 if(!title||title.length>160||!validSlug(slug)||slug.length>80||description.length>500)return error("INVALID_PAGE",400);
 if(!canonical(document,id))return error("INVALID_EDITOR_DOCUMENT",400,"Az új oldalnak Editor v2 Page Model dokumentumot kell tartalmaznia.");
 let contentJson:string;try{contentJson=JSON.stringify(document);if(contentJson.length>180000)return error("PAGE_TOO_LARGE",400)}catch{return error("INVALID_CONTENT",400)}
 const isPublished=body.isPublished===true;
 try{await env.DB.prepare(`INSERT INTO pages (id,slug,title,description,content_json,published_content_json,is_published,updated_at) VALUES (?,?,?,?,?,?,?,CURRENT_TIMESTAMP)`).bind(id,slug,title,description,contentJson,isPublished?contentJson:null,isPublished?1:0).run()}catch(e){if(String(e).toLowerCase().includes('unique'))return error("SLUG_EXISTS",409,"Slug already exists");throw e}
 await env.DB.prepare(`INSERT INTO editor_revisions (id,page_id,version,document_json,created_by,note) VALUES (?,?,?,?,?,?)`).bind(crypto.randomUUID(),id,1,contentJson,user.id,'Oldal létrehozva az Editor v2-ben').run();
 await audit(env,user.id,"page.create",id,{slug,title});return ok({id,slug,title,description,content:document,isPublished,version:1});
}
