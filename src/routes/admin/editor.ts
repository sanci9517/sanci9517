import { error, ok } from "../../core/response";
import { getAuthenticatedUser, hasRole } from "../../core/auth/require-auth";
import { requireSiteGrant } from "../../core/auth/site-access";
import type { AuthUser } from "../../core/auth/require-auth";
import { normalizeEditorDocument } from "../../core/page-model";
import { validatePublishDocument } from "../../core/editor-validation";
import type { Env } from "../../types/env";
import { auditStatement } from "../../core/audit";
import { DEFAULT_SITE_ID } from "../../core/site-context";

type PageRow={id:string;slug:string;title:string;description:string;content_json:string;is_published:number;published_revision_id:string|null;updated_at:string};
function parse(value:string):any{try{return JSON.parse(value)}catch{return {}}}
function collectAssetIds(value:any,out=new Set<string>(),depth=0):Set<string>{if(depth>24||!value||typeof value!=='object')return out;if(Array.isArray(value)){for(const item of value)collectAssetIds(item,out,depth+1);return out}for(const key of ['assetId','backgroundAssetId'])if(typeof value[key]==='string'&&/^[0-9a-f-]{36}$/i.test(value[key]))out.add(value[key]);for(const item of Object.values(value))collectAssetIds(item,out,depth+1);return out}
function canonical(document:any,pageId:string){const page=document?.pages?.[pageId];return Boolean(document&&document.type==='sanci-page-document'&&document.schemaVersion===1&&document.activePageId===pageId&&page?.id===pageId&&page.rootId&&page.nodes&&typeof page.nodes==='object')}
async function adminEditorRouteImpl(request:Request,env:Env,siteId:string):Promise<Response>{
 if(!siteId||!siteId.trim())return error('SITE_CONTEXT_INVALID',403);
 let user:AuthUser;
 if(env.SITE_MEMBERSHIP_ENFORCEMENT==='enabled'){
  const grant=await requireSiteGrant(request,env,siteId,'editor');if(grant instanceof Response)return grant;user=grant.user;
 }else{
  if(siteId!==DEFAULT_SITE_ID)return error('SITE_ACCESS_DENIED',403);
  const legacyUser=await getAuthenticatedUser(request,env);if(!legacyUser)return error('UNAUTHORIZED',401,'Authentication required');if(!hasRole(legacyUser,'editor'))return error('FORBIDDEN',403,'Editor role required');user=legacyUser;
 }
 const url=new URL(request.url),pageId=url.searchParams.get('pageId')||'';
 if(request.method==='GET'&&!pageId)return error('INVALID_PAGE_ID',400);
 if(request.method==='GET'){
  const row=await env.DB.prepare(`SELECT id,slug,title,description,content_json,is_published,published_revision_id,updated_at FROM pages WHERE id=? AND site_id=? AND archived_at IS NULL LIMIT 1`).bind(pageId,siteId).first<PageRow>();if(!row)return error('PAGE_NOT_FOUND',404);
  const document=normalizeEditorDocument(parse(row.content_json),row.id,row.title,row.slug,row.description);if(!document)return error('PAGE_NOT_MIGRATED',409,'Az oldal dokumentuma nem alakítható Editor v2 Page Modelre.');
  const revisions=await env.DB.prepare(`SELECT er.id,er.version,er.note,er.created_by,er.created_at FROM editor_revisions er INNER JOIN pages p ON p.id=er.page_id WHERE er.page_id=? AND p.site_id=? ORDER BY er.version DESC LIMIT 30`).bind(pageId,siteId).all();return ok({page:{id:row.id,slug:row.slug,title:row.title,description:row.description,isPublished:Boolean(row.is_published),updatedAt:row.updated_at,publishedRevisionId:row.published_revision_id,document},revisions:revisions.results});
 }
 if(request.method==='POST'){
  let body:any;try{body=await request.json()}catch{return error('INVALID_JSON',400)}const id=typeof body.pageId==='string'?body.pageId:pageId;if(!id|| (pageId&&pageId!==id))return error('INVALID_PAGE_ID',400);
  const action=typeof body.action==='string'?body.action:'';if(action==='unpublish'){const current=await env.DB.prepare('SELECT is_published,published_revision_id FROM pages WHERE id=? AND site_id=? AND archived_at IS NULL LIMIT 1').bind(id,siteId).first<{is_published:number;published_revision_id:string|null}>();if(!current)return error('PAGE_NOT_FOUND',404);if(!current.is_published)return ok({pageId:id,published:false,changed:false});const results=await env.DB.batch([env.DB.prepare('UPDATE pages SET is_published=0,updated_at=CURRENT_TIMESTAMP WHERE id=? AND site_id=? AND is_published=1 AND published_revision_id IS ?').bind(id,siteId,current.published_revision_id),env.DB.prepare('INSERT INTO audit_log (id,user_id,action,entity_type,entity_id,metadata_json) SELECT ?,?,?,?,?,? WHERE changes()=1').bind(crypto.randomUUID(),user.id,'page.unpublish','page',id,'{}')]);if(Number(results[0]?.meta?.changes||0)!==1)return error('REVISION_CONFLICT',409,'Az oldal publikált állapota időközben módosult. Töltsd újra az oldalt.');return ok({pageId:id,published:false,changed:true,savedAt:new Date().toISOString()})}
  const document=body.document;if(!document||!canonical(document,id))return error('INVALID_EDITOR_DOCUMENT',400,'A mentett dokumentumnak az Editor v2 Page Modelt kell követnie.');
  const row=await env.DB.prepare('SELECT id FROM pages WHERE id=? AND site_id=? AND archived_at IS NULL LIMIT 1').bind(id,siteId).first<{id:string}>();if(!row)return error('PAGE_NOT_FOUND',404);
  const latest=await env.DB.prepare('SELECT COALESCE(MAX(version),0) AS version FROM editor_revisions WHERE page_id=?').bind(id).first<{version:number}>();const currentVersion=Number(latest?.version||0);const expectedVersion=body.expectedVersion===undefined?null:Number(body.expectedVersion);if(expectedVersion===null)return error('EXPECTED_VERSION_REQUIRED',428,'A mentéshez szükséges a betöltött oldal verziója. Töltsd újra az oldalt.');if(expectedVersion!==null&&(!Number.isInteger(expectedVersion)||expectedVersion!==currentVersion))return error('REVISION_CONFLICT',409,'Az oldal időközben módosult. Töltsd újra az oldalt a legfrissebb verzióval.');const version=currentVersion+1;const revId=crypto.randomUUID();const publish=body.publish===true;const note=typeof body.note==='string'?body.note.slice(0,200):publish?'Publikálás':'Editor mentés';const persistedDocument={...document,revision:version,pages:{...document.pages,[id]:{...document.pages[id],revision:version}}};const json=JSON.stringify(persistedDocument);if(json.length>180000)return error('DOCUMENT_TOO_LARGE',400);if(publish){const validationError=validatePublishDocument(document,id);if(validationError)return error(validationError,409,'A dokumentum publikálás előtt nem felel meg az Editor v2 Page Model ellenőrzésnek.');const assetIds=[...collectAssetIds(document)];for(let offset=0;offset<assetIds.length;offset+=80){const chunk=assetIds.slice(offset,offset+80);const owned=await env.DB.prepare(`SELECT id,mime_type FROM media WHERE site_id=? AND id IN (${chunk.map(()=>'?').join(',')})`).bind(siteId,...chunk).all<{id:string;mime_type:string}>();if(owned.results.length!==chunk.length||owned.results.some(asset=>!['image/png','image/jpeg','image/gif','image/webp'].includes(asset.mime_type)))return error('MEDIA_NOT_FOUND',409,'A közzétett oldal valamelyik kiválasztott kép nem érhető el ehhez a webhelyhez.')}}
  const expectedParentPageId=body.expectedParentPageId===undefined?null:body.expectedParentPageId;
  if(publish&&!(expectedParentPageId===null||typeof expectedParentPageId==='string'))return error('INVALID_PAGE_PARENT',400);
  const statements=[
   env.DB.prepare(`INSERT INTO editor_revisions (id,page_id,version,document_json,created_by,note) SELECT ?,?,?,?,?,? WHERE (SELECT COALESCE(MAX(version),0) FROM editor_revisions WHERE page_id=?)=? AND EXISTS (SELECT 1 FROM pages WHERE id=? AND site_id=?${publish?' AND parent_page_id IS ?':''})`).bind(revId,id,version,json,user.id,note,id,expectedVersion,id,siteId,...(publish?[expectedParentPageId]:[])),
   env.DB.prepare(`UPDATE pages SET content_json=?,updated_at=CURRENT_TIMESTAMP WHERE id=? AND site_id=? AND EXISTS (SELECT 1 FROM editor_revisions WHERE id=?)`).bind(json,id,siteId,revId)
  ];
  if(publish){
   // The entire D1 batch commits together. Reclaiming an alias owned by this
   // page, recording its old live slug, and switching the snapshot are atomic.
   statements.push(
    env.DB.prepare(`DELETE FROM page_slug_redirects WHERE site_id=? AND page_id=? AND from_slug=(SELECT slug FROM pages WHERE id=? AND site_id=?) AND EXISTS (SELECT 1 FROM editor_revisions WHERE id=?)`).bind(siteId,id,id,siteId,revId),
    env.DB.prepare(`INSERT INTO page_slug_redirects (site_id,from_slug,page_id) SELECT site_id,published_slug,id FROM pages WHERE id=? AND site_id=? AND published_slug IS NOT NULL AND published_slug<>slug AND EXISTS (SELECT 1 FROM editor_revisions WHERE id=?)`).bind(id,siteId,revId),
    env.DB.prepare(`UPDATE pages SET published_content_json=?,published_revision_id=?,published_parent_page_id=parent_page_id,published_slug=slug,published_title=title,published_description=description,published_at=CURRENT_TIMESTAMP,is_published=1,updated_at=CURRENT_TIMESTAMP WHERE id=? AND site_id=? AND EXISTS (SELECT 1 FROM editor_revisions WHERE id=?)`).bind(json,revId,id,siteId,revId),
    env.DB.prepare('INSERT INTO audit_log (id,user_id,action,entity_type,entity_id,metadata_json) SELECT ?,?,?,?,?,? WHERE EXISTS (SELECT 1 FROM editor_revisions WHERE id=?)').bind(crypto.randomUUID(),user.id,'page.publish','page',id,JSON.stringify({version,revisionId:revId}),revId)
   );
  }
  const results=await env.DB.batch(statements);
  if(Number(results[0]?.meta?.changes||0)!==1)return error('REVISION_CONFLICT',409,'Az oldal időközben módosult. Töltsd újra az oldalt.');
  return ok({pageId:id,version,revisionId:revId,published:publish,savedAt:new Date().toISOString()});
 }
 if(request.method==='PUT'){
  let body:any;try{body=await request.json()}catch{return error('INVALID_JSON',400)}const id=typeof body.pageId==='string'?body.pageId:pageId;if(!id|| (pageId&&pageId!==id))return error('INVALID_PAGE_ID',400);const owner=await env.DB.prepare('SELECT id FROM pages WHERE id=? AND site_id=? AND archived_at IS NULL LIMIT 1').bind(id,siteId).first<{id:string}>();if(!owner)return error('PAGE_NOT_FOUND',404);const version=Number(body.version);const expectedVersion=body.expectedVersion===undefined?null:Number(body.expectedVersion);if(expectedVersion===null)return error('EXPECTED_VERSION_REQUIRED',428,'A visszaállításhoz szükséges a betöltött oldal verziója. Töltsd újra az oldalt.');if(!id||!Number.isInteger(version)||version<1)return error('INVALID_REVISION',400);const rev=await env.DB.prepare('SELECT document_json FROM editor_revisions WHERE page_id=? AND version=? LIMIT 1').bind(id,version).first<{document_json:string}>();if(!rev)return error('REVISION_NOT_FOUND',404);const document=normalizeEditorDocument(parse(rev.document_json),id);if(!document)return error('INVALID_REVISION',400,'A kiválasztott verzió nem Editor v2 dokumentum.');const latest=await env.DB.prepare('SELECT COALESCE(MAX(version),0) AS version FROM editor_revisions WHERE page_id=?').bind(id).first<{version:number}>();const currentVersion=Number(latest?.version||0);if(expectedVersion!==null&&(!Number.isInteger(expectedVersion)||expectedVersion!==currentVersion))return error('REVISION_CONFLICT',409,'Az oldal időközben módosult. Töltsd újra az oldalt a legfrissebb verzióval.');const next=currentVersion+1;const persistedDocument={...document,revision:next,pages:{...document.pages,[id]:{...document.pages[id],revision:next}}};const json=JSON.stringify(persistedDocument);const rollbackId=crypto.randomUUID();const results=await env.DB.batch([env.DB.prepare(`INSERT INTO editor_revisions (id,page_id,version,document_json,created_by,note) SELECT ?,?,?,?,?,? WHERE (SELECT COALESCE(MAX(version),0) FROM editor_revisions WHERE page_id=?)=?`).bind(rollbackId,id,next,json,user.id,`Rollback from v${version}`,id,expectedVersion),env.DB.prepare('UPDATE pages SET content_json=?,updated_at=CURRENT_TIMESTAMP WHERE id=? AND site_id=? AND EXISTS (SELECT 1 FROM editor_revisions WHERE id=?)').bind(json,id,siteId,rollbackId),env.DB.prepare('INSERT INTO audit_log (id,user_id,action,entity_type,entity_id,metadata_json) SELECT ?,?,?,?,?,? WHERE EXISTS (SELECT 1 FROM editor_revisions WHERE id=?)').bind(crypto.randomUUID(),user.id,'page.rollback','page',id,JSON.stringify({version:next,revisionId:rollbackId,restoredFrom:version}),rollbackId)]);if(Number(results[0]?.meta?.changes||0)!==1)return error('REVISION_CONFLICT',409,'Az oldal időközben módosult. Töltsd újra az oldalt.');return ok({pageId:id,version:next,revisionId:rollbackId,restoredFrom:version});
 }
 return error('METHOD_NOT_ALLOWED',405);
}

export async function adminEditorRoute(request:Request,env:Env,siteId:string=DEFAULT_SITE_ID):Promise<Response>{
 try{return await adminEditorRouteImpl(request,env,siteId)}catch(e){
  if(String(e).includes('INVALID_PUBLISHED_PAGE_PARENT'))return error('INVALID_PUBLISHED_PAGE_PARENT',409,'A szülőoldalt előbb publikálni kell.');
  if(String(e).includes('PAGE_HAS_PUBLISHED_CHILDREN'))return error('PAGE_HAS_PUBLISHED_CHILDREN',409,'Előbb a publikált gyermekoldalakat kell áthelyezni vagy visszavonni.');
  if(String(e).includes('PAGE_HIERARCHY_CYCLE'))return error('PAGE_HIERARCHY_CYCLE',409,'A publikált oldalhierarchiában ciklus keletkezne.');
  if(String(e).includes('PAGE_SLUG_RESERVED')||String(e).toLowerCase().includes('unique'))return error('SLUG_RESERVED',409,'A slug egy másik oldal élő vagy korábbi URL-je. Válassz másikat.');
  if(String(e).includes('PAGE_ARCHIVED'))return error('PAGE_ARCHIVED',409,'Az oldal archiválva van. Először állítsd vissza piszkozatként.');
  throw e;
 }
}
