import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import test from 'node:test';
const app=readFileSync(new URL('../public/editor-v2/app.js',import.meta.url),'utf8');
function action(start,end,context){runInNewContext(app.slice(app.indexOf(start),app.indexOf(end))+';this.act='+start.match(/function (\w+)/)[1],context);return context.act}
function editor(){
 const statuses=[],alerts=[];const meta={id:'p',slug:'p',isPublished:false,revision:1};const state={document:{revision:1,pages:{p:{id:'p'}}},persistence:{dirty:true,saving:false}};
 const context={state,pages:[meta],page:()=>({id:'p'}),setStatus:m=>statuses.push(m),alert:m=>alerts.push(m),structuredClone,markSaved:(s,v)=>{s.persistence.dirty=false;s.persistence.saving=false;s.persistence.lastSavedRevision=v},render:()=>{},renderPageList:()=>{},$:()=>null,showRevisionConflict:()=>{},api:async()=>({data:{pageId:'p',version:2,revisionId:'r2'}})};
 return {context,statuses,alerts};
}
test('successful publish immediately marks a previously draft page LIVE; subsequent save keeps LIVE with pending draft',async()=>{
 const f=editor();const save=action('async function save(publish=false)','async function unpublishPage()',f.context);
 await save(true);assert.equal(f.context.pages[0].isPublished,true);assert.equal(f.context.pages[0].hasUnpublishedChanges,false);
 assert.equal(f.context.pages[0].publishedSlug,'p');
 f.context.state.document.pages.p.title='New';f.context.state.persistence.dirty=true;await save(false);assert.equal(f.context.pages[0].isPublished,true);assert.equal(f.context.pages[0].hasUnpublishedChanges,true);
});
test('failed publication preserves list publication state and local dirty document',async()=>{
 const f=editor();f.context.api=async()=>{throw Error('offline')};const original=JSON.stringify(f.context.state.document);
 await action('async function save(publish=false)','async function unpublishPage()',f.context)(true);
 assert.equal(f.context.pages[0].isPublished,false);assert.equal(f.context.state.persistence.dirty,true);assert.equal(JSON.stringify(f.context.state.document),original);
});
test('page settings do not replace dirty content or run during an in-flight save',async()=>{
 for(const field of ['dirty','saving']){
  const f=editor();f.context.state.persistence={dirty:false,saving:false,[field]:true};f.context.prompt=()=>assert.fail('must guard before prompting');
  await action('async function editPageMeta(id)','async function duplicatePage(id)',f.context)('p');assert.equal(f.alerts.length,1);
 }
});
test('page list renders LIVE, unpublished draft changes and draft labels from server state',()=>{
 const f=editor();const list={children:[],replaceChildren(){this.children=[]},append(...xs){this.children.push(...xs)}};
 const select={replaceChildren(){},append(){}};f.context.$=id=>id==='#pageList'?list:select;f.context.archivedPages=[];f.context.escapeHtml=x=>x;
 f.context.pages=[{id:'p',title:'Pending',slug:'new',publishedSlug:'old',isPublished:true,hasUnpublishedChanges:true},{id:'live',title:'Live',isPublished:true,hasUnpublishedChanges:false},{id:'draft',title:'Draft',isPublished:false}];
 f.context.document={createElement:()=>({children:[],setAttribute(){},append(...xs){this.children.push(...xs)},innerHTML:''})};
 action('function renderPageList()','function focusScheduleNode()',f.context)();
 assert.match(list.children[0].children[0].innerHTML,/ÉLŐ · MÓDOSÍTOTT PISZKOZAT/);
 assert.match(list.children[0].children[0].innerHTML,/ÉLŐ URL: \/p\/old/);
 assert.match(list.children[1].children[0].innerHTML,/class="page-meta">ÉLŐ<\/small>/);
 assert.match(list.children[2].children[0].innerHTML,/class="page-meta">PISZKOZAT<\/small>/);
});
test('draft parent change enables explicit republish even when content revision did not change',()=>{
 const f=editor();const publish={};const mobilePublish={};const unpublish={};const mobileUnpublish={};
 f.context.pages[0]={id:'p',isPublished:true,hasUnpublishedChanges:true,revision:2,publishedRevisionVersion:2};
 f.context.state.persistence.dirty=false;
 f.context.$=id=>({'#publish':publish,'#mobilePublish':mobilePublish,'#unpublish':unpublish,'#mobileUnpublish':mobileUnpublish})[id];
 action('function syncPublishControls()','function renderRevisionPanel()',f.context)();
 assert.equal(publish.disabled,false);assert.equal(mobilePublish.disabled,false);
 assert.equal(publish.textContent,'Újrapublikálás');
});
test('parent action excludes descendants and submits a draft-only parent change',async()=>{
 const f=editor();const calls=[];let promptText='';
 f.context.pages=[{id:'p',title:'Page',parentPageId:null},{id:'child',title:'Child',parentPageId:'p'},{id:'other',title:'Other',parentPageId:null}];
 f.context.prompt=text=>{promptText=text;return '1'};
 f.context.api=async(path,options)=>{calls.push([path,JSON.parse(options.body)]);return {data:{parentPageId:'other'}}};
 f.context.loadPages=async()=>{};
 await action('async function editPageParent(id)','async function changePageArchive(id,archive)',f.context)('p');
 assert.doesNotMatch(promptText,/Child/);assert.match(promptText,/Other/);
 assert.deepEqual(calls,[['/api/admin/pages',{action:'setParent',id:'p',parentPageId:'other',expectedParentPageId:null}]]);
});
