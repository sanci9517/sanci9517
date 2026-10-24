import type {Env} from '../types/env';
import {createSitePresentation,type SitePresentation} from './domain/contracts';
import {defaultTokens,normalizeTokens} from '../../public/editor-v2/core/design-tokens.js';
import {DEFAULT_SITE_ID} from './site-context';

export type PresentationDocument={schemaVersion:1;revision:number;draft:SitePresentation;published:SitePresentation|null;history:SitePresentation[]};
export const PRESENTATION_KEY='design-system';
function scoped(env:Env,siteId:string){if(!siteId?.trim())throw new Error('SITE_CONTEXT_INVALID');if(siteId!==DEFAULT_SITE_ID&&env.SITE_SCOPED_SETTINGS_ENABLED!=='enabled')throw new Error('SITE_PRESENTATION_UNAVAILABLE');return env.SITE_SCOPED_SETTINGS_ENABLED==='enabled'}
export function defaultPresentation(siteId:string):PresentationDocument{return {schemaVersion:1,revision:0,draft:{...createSitePresentation(siteId),tokens:defaultTokens()},published:null,history:[]}}
export async function loadPresentation(env:Env,siteId:string):Promise<PresentationDocument>{
  const useScoped=scoped(env,siteId);
  const row=await env.DB.prepare(useScoped?'SELECT value_json FROM site_scoped_settings WHERE site_id=? AND key=? LIMIT 1':'SELECT value_json FROM site_settings WHERE key=? LIMIT 1').bind(...(useScoped?[siteId,PRESENTATION_KEY]:[PRESENTATION_KEY])).first<{value_json:string}>();
  if(!row)return defaultPresentation(siteId);
  const value=JSON.parse(row.value_json) as PresentationDocument;
  if(value.schemaVersion!==1||!Number.isInteger(value.revision)||value.revision<0||value.draft?.siteId!==siteId||(value.published&&value.published.siteId!==siteId))throw new Error('SITE_PRESENTATION_INVALID');
  value.draft.tokens=normalizeTokens(value.draft.tokens);if(value.published)value.published.tokens=normalizeTokens(value.published.tokens);
  value.history=Array.isArray(value.history)?value.history.slice(-20):[];
  for(const entry of value.history){if(entry.siteId!==siteId)throw new Error('SITE_PRESENTATION_INVALID');entry.tokens=normalizeTokens(entry.tokens)}return value;
}
export async function savePresentation(env:Env,siteId:string,userId:string,body:{expectedRevision:unknown;tokens:unknown;publish?:unknown;restorePublished?:unknown;restoreRevision?:unknown}):Promise<PresentationDocument|null>{
  const useScoped=scoped(env,siteId),expected=body.expectedRevision;
  if(!Number.isInteger(expected)||Number(expected)<0)throw new Error('EXPECTED_REVISION_REQUIRED');
  const current=await loadPresentation(env,siteId);if(current.revision!==expected)return null;
  const source=body.restoreRevision!==undefined?[current.published,...current.history].find(entry=>entry?.revision===body.restoreRevision):current.published;
  if(body.restoreRevision!==undefined&&!source)throw new Error('PRESENTATION_REVISION_NOT_FOUND');
  const tokens=body.restorePublished===true||body.restoreRevision!==undefined?(source?.tokens??defaultTokens()):normalizeTokens(body.tokens);
  const now=new Date().toISOString(),revision=current.revision+1;
  const draft:SitePresentation={...current.draft,tokens,revision,updatedAt:now,status:'draft'};
  const published=body.publish===true?{...draft,status:'published' as const}:current.published;
  const next:PresentationDocument={schemaVersion:1,revision,draft,published,history:[...current.history,current.draft].slice(-20)},json=JSON.stringify(next);
  // Compare-and-swap also covers the first insert; a concurrent writer cannot
  // overwrite a newly-created row with expectedRevision=0.
  const mutation=useScoped?
    env.DB.prepare(`INSERT INTO site_scoped_settings(site_id,key,value_json,updated_at) SELECT ?,?,?,CURRENT_TIMESTAMP WHERE ?=0 OR EXISTS(SELECT 1 FROM site_scoped_settings WHERE site_id=? AND key=? AND json_extract(value_json,'$.revision')=?) ON CONFLICT(site_id,key) DO UPDATE SET value_json=excluded.value_json,updated_at=CURRENT_TIMESTAMP WHERE json_extract(site_scoped_settings.value_json,'$.revision')=?`).bind(siteId,PRESENTATION_KEY,json,expected,siteId,PRESENTATION_KEY,expected,expected):
    env.DB.prepare(`INSERT INTO site_settings(key,value_json,updated_at) SELECT ?,?,CURRENT_TIMESTAMP WHERE ?=0 OR EXISTS(SELECT 1 FROM site_settings WHERE key=? AND json_extract(value_json,'$.revision')=?) ON CONFLICT(key) DO UPDATE SET value_json=excluded.value_json,updated_at=CURRENT_TIMESTAMP WHERE json_extract(site_settings.value_json,'$.revision')=?`).bind(PRESENTATION_KEY,json,expected,PRESENTATION_KEY,expected,expected);
  const result=await env.DB.batch([mutation,env.DB.prepare('INSERT INTO audit_log(id,user_id,action,entity_type,entity_id,metadata_json) SELECT ?,?,?,?,?,? WHERE changes()=1').bind(crypto.randomUUID(),userId,body.publish===true?'presentation.publish':body.restorePublished===true?'presentation.restore':'presentation.save','site_presentation',siteId,JSON.stringify({revision,published:body.publish===true}))]);
  return Number(result[0]?.meta?.changes||0)===1?next:null;
}
