import { error, ok } from "../../core/response";
import { getAuthenticatedUser, hasRole } from "../../core/auth/require-auth";
import type { Env } from "../../types/env";

type PageRow={id:string;slug:string;title:string;description:string;content_json:string;is_published:number;updated_at:string};
function parse(value:string):any{try{return JSON.parse(value)}catch{return {}}}
function isCanonicalDocument(document:any,pageId:string){
 const page=document?.pages?.[pageId];
 return Boolean(document&&document.type==='sanci-page-document'&&document.schemaVersion===1&&document.activePageId===pageId&&page&&page.id===pageId&&page.rootId&&page.nodes&&typeof page.nodes==='object');
}
export async function adminEditorRoute(request:Request,env:Env):Promise<Response>{
 const user=await getAuthenticatedUser(request,env);if(!user)return error('UNAUTHORIZED',401,'Authentication required');if(!hasRole(user,'editor'))return error('FORBIDDEN',403,'Editor role required');
 const url=new URL(request.url),pageId=url.searchParams.get('pageId')||'';if(!pageId)return error('INVALID_PAGE_ID',400);
 if(request.method==='GET'){
  const page=await env.DB.prepare(`SELECT id,slug,title,description,content_json,is_published,updated_at FROM pages WHERE id=? LIMIT 1`).bind(pageId).first<PageRow>();if(!page)return error('PAGE_NOT_FOUND',404);
  const document=parse(page.content_json);if(!isCanonicalDocument(document,page.id))return error('PAGE_NOT_MIGRATED',409,'Az oldal még nincs az új Editor v2 Page Modelre migrálva.');
  const revisions=await env.DB.prepare(`SELECT id,version,note,created_by,created_at FROM editor_revisions WHERE page_id=? ORDER BY version DESC LIMIT 30`).bind(pageId).all();
  return ok({page:{id:page.id,slug:page.slug,title:page.title,description:page.description,isPublished:Boolean(page.is_published),updatedAt:page.updated_at,document},revisions:revisions.results});
 }
 if(request.method==='POST'){
  let body:any;try{body=await request.json()}catch{return error('INVALID_JSON',400)}
  const id=typeof body.pageId==='string'?body.pageId:pageId,document=body.document;if(!id||!document||typeof document!=='object')return error('INVALID_EDITOR_DOCUMENT',400);if(!isCanonicalDocument(document,id))return error('INVALID_EDITOR_DOCUMENT',400,'A mentett dokumentumnak az új Editor v2 Page Modelt kell követnie.');
  const page=await env.DB.prepare('SELECT id FROM pages WHERE id=? LIMIT 1').bind(id).first<{id:string}>();if(!page)return error('PAGE_NOT_FOUND',404);
  const json=JSON.stringify(document);if(json.length>180000)return error('DOCUMENT_TOO_LARGE',400);
  const latest=await env.DB.prepare('SELECT COALESCE(MAX(version),0) AS version FROM editor_revisions WHERE page_id=?').bind(id).first<{version:number}>();const version=Number(latest?.version||0)+1;const revId=crypto.randomUUID();const publish=body.publish===true;const note=typeof body.note==='string'?body.note.slice(0,200):publish?'Publikálás':'Editor mentés';
  const statements=[env.DB.prepare(`UPDATE pages SET content_json=?,updated_at=CURRENT_TIMESTAMP WHERE id=?`).bind(json,id),env.DB.prepare(`INSERT INTO editor_revisions (id,page_id,version,document_json,created_by,note) VALUES (?,?,?,?,?,?)`).bind(revId,id,version,json,user.id,note)];
  if(publish)statements.push(env.DB.prepare(`UPDATE pages SET published_content_json=?,is_published=1,updated_at=CURRENT_TIMESTAMP WHERE id=?`).bind(json,id));
  await env.DB.batch(statements);return ok({pageId:id,version,revisionId:revId,published:publish,savedAt:new Date().toISOString()});
 }
 if(request.method==='PUT'){
  let body:any;try{body=await request.json()}catch{return error('INVALID_JSON',400)}const id=typeof body.pageId==='string'?body.pageId:pageId;const version=Number(body.version);if(!id||!Number.isInteger(version)||version<1)return error('INVALID_REVISION',400);
  const rev=await env.DB.prepare('SELECT document_json FROM editor_revisions WHERE page_id=? AND version=? LIMIT 1').bind(id,version).first<{document_json:string}>();if(!rev)return error('REVISION_NOT_FOUND',404);const document=parse(rev.document_json);if(!isCanonicalDocument(document,id))return error('INVALID_REVISION',400,'A kiválasztott verzió nem Editor v2 dokumentum.');
  const latest=await env.DB.prepare('SELECT COALESCE(MAX(version),0) AS version FROM editor_revisions WHERE page_id=?').bind(id).first<{version:number}>();const next=Number(latest?.version||0)+1;
  await env.DB.batch([env.DB.prepare('UPDATE pages SET content_json=?,updated_at=CURRENT_TIMESTAMP WHERE id=?').bind(rev.document_json,id),env.DB.prepare(`INSERT INTO editor_revisions (id,page_id,version,document_json,created_by,note) VALUES (?,?,?,?,?,?)`).bind(crypto.randomUUID(),id,next,rev.document_json,user.id,`Rollback from v${version}`)]);return ok({pageId:id,version:next,restoredFrom:version});
 }
 return error('METHOD_NOT_ALLOWED',405);
}
