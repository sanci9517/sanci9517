import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import test from 'node:test';

// Execute the actual UI action, replacing only browser/network boundaries.
const app=readFileSync(new URL('../public/editor-v2/app.js',import.meta.url),'utf8');
const action=app.slice(app.indexOf('async function changePageArchive('),app.indexOf('async function deletePage('));
function fixture(){
 const requests=[],alerts=[],statuses=[];
 const context={state:{persistence:{dirty:false,saving:false}},flushRichTextDraft:null,pages:[{id:'p',title:'Test'}],archivedPages:[{id:'a',title:'Archived'}],revisionHistory:[{id:'rev'}],
  page:()=>({id:'p'}),alert:message=>alerts.push(message),confirm:()=>true,
  api:async(url,options)=>requests.push({url,...JSON.parse(options.body)}),loadPages:async()=>{},rememberPageId:()=>{},setStatus:message=>statuses.push(message)};
 runInNewContext(action+';this.act=changePageArchive',context);
 return {context,requests,alerts,statuses};
}
test('archive UI blocks dirty documents, pending saves and cancelled confirmation',async()=>{
 for(const field of ['dirty','saving']){const f=fixture();f.context.state.persistence[field]=true;await f.context.act('p',true);assert.equal(f.requests.length,0);assert.equal(f.alerts.length,1)}
 const f=fixture();f.context.confirm=()=>false;await f.context.act('p',true);assert.equal(f.requests.length,0);
 const pending=fixture();pending.context.flushRichTextDraft=()=>{pending.context.state.persistence.dirty=true;return true};await pending.context.act('p',true);assert.equal(pending.requests.length,0);assert.match(pending.alerts[0],/mentsd/);
});
test('archive UI clears the archived active editor only after success; restore never publishes',async()=>{
 const f=fixture();await f.context.act('p',true);assert.deepEqual(f.requests,[{url:'/api/admin/pages',id:'p',action:'archive'}]);assert.equal(f.context.state,null);assert.equal(f.context.revisionHistory.length,0);
 const restored=fixture();await restored.context.act('a',false);assert.deepEqual(restored.requests,[{url:'/api/admin/pages',id:'a',action:'restore'}]);assert.match(restored.statuses.at(-1),/piszkozat/);
 const failed=fixture();const original=failed.context.state;failed.context.api=async()=>{throw Error('PAGE_IN_USE')};await assert.rejects(()=>failed.context.act('p',true),/PAGE_IN_USE/);assert.equal(failed.context.state,original);
});
