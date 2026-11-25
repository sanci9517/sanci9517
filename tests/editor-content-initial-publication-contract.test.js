import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import {createDocument, createNode} from '../public/editor-v2/core/schema.js';
import {createElementContent, validateElementContent as validateStructuredContent} from '../public/editor-v2/core/element-content.js';
import {CONTENT_FIELDS, contentProperties, getPublicationContentIssue, getPublicationContentGuidance} from '../public/editor-v2/core/authored-content.js';
import {getElementContentContract} from '../public/editor-v2/core/content-profiles.js';
import {validatePublishDocument} from '../src/core/editor-validation.ts';
import {createEditorState} from '../public/editor-v2/core/state.js';
import {execute} from '../public/editor-v2/core/commands.js';
import {firstUnsupportedPublicationNode,unsupportedPublicationMessage} from '../public/editor-v2/core/publication-recovery.js';

test('Publish actions start disabled until a loaded page establishes publish eligibility',()=>{
  const html=readFileSync(new URL('../public/editor-v2/index.html',import.meta.url),'utf8');
  assert.match(html,/<button id="publish"[^>]*\sdisabled(?:\s|>)/,'desktop Publish must not silently accept clicks before Editor initialization');
  assert.match(html,/<button id="mobilePublish"[^>]*\sdisabled(?:\s|>)/,'mobile Publish must use the same initialized-page guard');
});

// 77.44.7.A: regression evidence for real initial values versus publication gates.
// Do not synthesize initial defaults from Inspector field metadata.
function probe(type, {metadata={}, props={}, visibility}={}) {
  const document=createDocument();
  const page=document.pages[document.activePageId];
  const node=createNode(type, {id:'content_probe',parentId:page.rootId,metadata,props,
    ...(visibility===undefined?{}:{visibility})});
  page.nodes[node.id]=node;
  page.nodes[page.rootId].children.push(node.id);
  return {document,node, publish:()=>validatePublishDocument(document,page.id)};
}

test('initial schema values do not invent authored content or field-level defaults',()=>{
  for(const type of ['heading','text','link','button','image','video','audio','gallery','carousel','table','code']){
    const node=createNode(type);
    assert.deepEqual(node.props,{},type);
    assert.equal(node.metadata.contentVersion,undefined,type);
    const contract=getElementContentContract(node);
    assert.deepEqual(contract.fields,[],type);
  }
  assert.ok(Object.hasOwn(CONTENT_FIELDS,'heading'));
  assert.equal(createNode('schedule').props.schedule.version,1);
});

test('server publication gates for visible explicitly authored elements are preserved',()=>{
  const cases=[
    ['heading',{},'INCOMPLETE_EDITOR_CONTENT'],
    ['button',{text:'Megnyitás'},'INCOMPLETE_EDITOR_CONTENT'],
    ['link',{text:'Tovább'},'INCOMPLETE_EDITOR_CONTENT'],
    ['image',{alt:'Leírás'},'INCOMPLETE_EDITOR_CONTENT'],
    ['video',{},'INCOMPLETE_EDITOR_CONTENT'],
    ['audio',{},'INCOMPLETE_EDITOR_CONTENT'],
    ['gallery',{},'INCOMPLETE_EDITOR_CONTENT'],
    ['carousel',{},'INCOMPLETE_EDITOR_CONTENT'],
    ['table',{},'INCOMPLETE_EDITOR_CONTENT'],
    ['list',{},'INCOMPLETE_EDITOR_CONTENT'],
    ['tabs',{},'INCOMPLETE_EDITOR_CONTENT'],
    ['accordion',{},'INCOMPLETE_EDITOR_CONTENT'],
    ['tooltip',{},'INCOMPLETE_EDITOR_CONTENT']
  ];
  for(const [type,props,expected] of cases){
    const {publish}=probe(type,{metadata:{contentVersion:1},props});
    assert.equal(publish(),expected,type);
  }
});

test('server publication rejects unknown node types even when a client bypasses the disabled palette',()=>{
  for(const type of ['input','__proto__','unknown-block']){
    const {document,publish}=probe(type);
    const before=structuredClone(document);
    assert.equal(publish(),'UNSUPPORTED_EDITOR_NODE_TYPE',type);
    assert.deepEqual(document,before,`${type}: rejected Publish must leave the draft Page Model untouched`);
  }
  assert.equal(probe('text',{metadata:{contentVersion:1},props:{text:'Szerkeszthető szöveg'}}).publish(),null,
    'a currently supported node still reaches the existing content-specific publication gates');
  assert.equal(probe('form').publish(),null,
    'the shipped first-party Form is a supported Page Model node and its empty configuration is publishable');
});

test('server publication bounds child references before authored-content traversal and preserves the draft',()=>{
  const {document,publish}=probe('text',{metadata:{contentVersion:1},props:{text:'Kész szöveg'}});
  const page=document.pages[document.activePageId],root=page.nodes[page.rootId];
  root.children=Array.from({length:100_000},()=> 'content_probe');
  const before=JSON.stringify(document);
  assert.equal(publish(),'EDITOR_CHILD_REFERENCE_LIMIT_EXCEEDED');
  assert.equal(JSON.stringify(document),before,'oversized imported child arrays stay unchanged and are never publishable');
});

test('unsupported Publish recovery skips supported Forms and finds the first unknown child without looping on malformed cycles',()=>{
  const {document}=probe('text',{metadata:{contentVersion:1},props:{text:'Kész szöveg'}});
  const page=document.pages[document.activePageId],supported=page.nodes[page.rootId].children[0];
  const form=createNode('form',{id:'planned_form',name:'Feliratkozási űrlap',parentId:supported});
  page.nodes[form.id]=form;page.nodes[supported].children.push(form.id);
  const unknown=createNode('container',{id:'legacy_unknown',name:'Régi elem'});
  unknown.type='legacy-widget';unknown.parentId=page.rootId;page.nodes[unknown.id]=unknown;page.nodes[page.rootId].children.push(unknown.id);
  assert.deepEqual(firstUnsupportedPublicationNode(page),{id:'legacy_unknown',type:'legacy-widget',name:'Régi elem'},
    'recovery skips the supported Form and identifies the first server-rejected item');
  page.nodes[form.id].children.push(supported);
  assert.deepEqual(firstUnsupportedPublicationNode(page),{id:'legacy_unknown',type:'legacy-widget',name:'Régi elem'},
    'cycle protection does not lose the unknown node or loop forever');
  assert.match(unsupportedPublicationMessage(firstUnsupportedPublicationNode(page)),/még nem publikálható/);
  assert.match(unsupportedPublicationMessage(firstUnsupportedPublicationNode(page)),/Rétegek panelen/);
  assert.equal(firstUnsupportedPublicationNode({}),null);
});

test('unsupported Publish guidance never invokes malformed saved name/type conversions',()=>{
  assert.match(unsupportedPublicationMessage({name:{toString:null},type:'form'}),/„form” elem típusa még nem publikálható/,
    'a malformed name falls back to the known safe node type');
  assert.match(unsupportedPublicationMessage({name:'',type:{toString:null}}),/„ismeretlen elem” elem típusa még nem publikálható/,
    'an unknown non-string type is never interpolated as an object');
  const long=unsupportedPublicationMessage({name:`  ${'A'.repeat(400)}\n  B  `,type:'form'});
  const short=unsupportedPublicationMessage({name:'A',type:'form'});
  assert.ok(long.length<=short.length+120,'the recovery label is capped at 120 code points even when imported data contains a huge name');
  assert.doesNotMatch(long,/\n|\u0000/,'recovery copy collapses controls and whitespace');
});

test('real content defaults are view-only and are not persisted into empty nodes',()=>{
  const node=createNode('image',{metadata:{contentVersion:1}});
  const snapshot=structuredClone(node);
  const resolved=contentProperties(node);
  assert.equal(resolved.fit,'cover');
  assert.equal(resolved.loading,'lazy');
  assert.equal(resolved.focalX,50);
  assert.equal(resolved.focalY,50);
  assert.deepEqual(node,snapshot);
  assert.equal(Object.hasOwn(node.props,'fit'),false);
});

test('legacy and versioned structured content remain independently gated',()=>{
  assert.equal(probe('gallery').publish(),null);
  const legacy=probe('gallery',{metadata:{structuredContentVersion:1}});
  assert.equal(legacy.publish(),'INVALID_STRUCTURED_CONTENT');
  const gallery=createElementContent('gallery');
  assert.equal(validateStructuredContent('gallery',gallery),'INVALID_GALLERY_IMAGE');
  const versioned=probe('gallery',{metadata:{structuredContentVersion:1},props:{contentModel:gallery}});
  assert.equal(versioned.publish(),'INVALID_GALLERY_IMAGE');
  const carousel=createElementContent('carousel');
  assert.equal(validateStructuredContent('carousel',carousel),null);
  const valid=probe('carousel',{metadata:{structuredContentVersion:1},props:{contentModel:carousel}});
  assert.equal(valid.publish(),null);
});

test('versioned media must satisfy their own server gate without changing legacy behavior',()=>{
  assert.equal(probe('image').publish(),null);
  assert.equal(probe('image',{metadata:{editorContentVersion:1}}).publish(),'INVALID_MEDIA_SOURCE');
  assert.equal(probe('image',{metadata:{editorContentVersion:1},props:{src:'/photo.png'}}).publish(),'IMAGE_ALT_REQUIRED');
  assert.equal(probe('image',{metadata:{editorContentVersion:1},props:{src:'/photo.png',alt:'Fotó'}}).publish(),null);
});

test('canonical element.add supplies real initial content and version gates',()=>{
  const cases=[
    ['badge','basicContentVersion','text','Címke'],
    ['quote','basicContentVersion','text','Ide írd az idézetet'],
    ['icon','basicContentVersion','icon','star'],
    ['list','structuredContentVersion','contentModel',undefined],
    ['gallery','structuredContentVersion','contentModel',undefined],
    ['carousel','structuredContentVersion','contentModel',undefined],
    ['code','codeSnippetVersion','codeSnippet',undefined],
    ['image','editorContentVersion','src',undefined]
  ];
  for(const [type,marker,key,expected] of cases){
    const state=createEditorState();
    execute(state,{type:'element.add',payload:{type}});
    const page=state.document.pages[state.document.activePageId];
    const node=page.nodes[state.selection.primaryId];
    assert.equal(node.metadata[marker],1,type);
    if(expected!==undefined)assert.equal(node.props[key],expected,type);
    else if(type!=='image')assert.ok(node.props[key],type);
    const contract=getElementContentContract(node);
    assert.ok(contract.profiles.some(profile=>profile.marker===marker),type);
    if(type==='gallery')assert.equal(validatePublishDocument(state.document,page.id),'INVALID_GALLERY_IMAGE');
    if(type==='image')assert.equal(validatePublishDocument(state.document,page.id),'INVALID_MEDIA_SOURCE');
    if(type==='code')assert.equal(validatePublishDocument(state.document,page.id),'INVALID_CODE_SNIPPET');
    if(type==='list'||type==='carousel'||type==='badge'||type==='quote'||type==='icon')
      assert.equal(validatePublishDocument(state.document,page.id),null,type);
  }
});

test('canonical schedule element.add preserves normalized defaults and is publishable',()=>{
  const state=createEditorState();
  execute(state,{type:'element.add',payload:{type:'schedule'}});
  const page=state.document.pages[state.document.activePageId];
  const node=page.nodes[state.selection.primaryId];
  assert.deepEqual(node.props.schedule,createNode('schedule').props.schedule);
  assert.equal(validatePublishDocument(state.document,page.id),null);

  const partial=createEditorState();
  execute(partial,{type:'element.add',payload:{type:'schedule',props:{schedule:{mode:'next'}}}});
  const partialPage=partial.document.pages[partial.document.activePageId];
  const partialNode=partialPage.nodes[partial.selection.primaryId];
  assert.equal(partialNode.props.schedule.mode,'next');
  assert.equal(partialNode.props.schedule.version,1);
  assert.equal(validatePublishDocument(partial.document,partialPage.id),null);
});

test('authored element.add does not inherit legacy content markers or invented media source',()=>{
  for(const type of ['heading','image','gallery','carousel','button']){
    const state=createEditorState();
    execute(state,{type:'element.add',payload:{type,authored:true}});
    const page=state.document.pages[state.document.activePageId];
    const node=page.nodes[state.selection.primaryId];
    assert.equal(node.metadata.contentVersion,1,type);
    assert.equal(node.metadata.editorContentVersion,undefined,type);
    assert.equal(node.metadata.structuredContentVersion,undefined,type);
    assert.equal(validatePublishDocument(state.document,page.id),'INCOMPLETE_EDITOR_CONTENT',type);
  }
});

test('Inspector publication issue reader mirrors real server required-content gate',()=>{
 const cases=[
  ['heading',{},'A címsor nem lehet üres.'],
  ['button',{text:'Megnyitás'},'Adj meg hivatkozási célt. Művelet nélküli gomb nem publikálható.'],
  ['image',{src:'/photo.png'},'Adj meg képleírást, vagy jelöld a képet díszítőnek.'],
  ['image',{src:'/photo.png',alt:'Kép'},null],
  ['audio',{src:'/sound.ogg',controls:false},'A hanglejátszó vezérlőit nem rejtheted el.'],
  ['text',{text:'Szöveg'},null]
 ];
 for(const [type,props,expected] of cases){
  const {node,publish}=probe(type,{metadata:{contentVersion:1},props});
  const before=structuredClone(node);
  assert.equal(getPublicationContentIssue(node),expected,type);
  assert.deepEqual(node,before,type);
  assert.equal(publish(),expected?'INCOMPLETE_EDITOR_CONTENT':null,type);
 }
 assert.equal(getPublicationContentIssue(createNode('heading')),null,'legacy nodes are not silently migrated');
});

test('publication guidance uses the same required-field rule as server publication',()=>{
 const cases=[
  ['heading',{},'text'],
  ['button',{text:'Megnyitás'},'href'],
  ['image',{},'src'],
  ['image',{src:'/image.png'},'alt'],
  ['audio',{src:'/audio.ogg',controls:false},'controls'],
  ['video',{src:'/video.webm',controls:false},'controls'],
  ['gallery',{},'items'],
  ['carousel',{},'items'],
  ['tabs',{},'items'],
  ['accordion',{},'items'],
  ['dropdown',{},'items'],
  ['table',{},'rows'],
  ['list',{},'items'],
  ['tooltip',{},'text'],
  ['tooltip',{text:'Mi ez?'},'description'],
 ];
 for(const [type,props,fieldKey] of cases){
  const {node,publish}=probe(type,{metadata:{contentVersion:1},props});
  const original=structuredClone(node);
  const guidance=getPublicationContentGuidance(node);
  assert.ok(guidance,type);
  assert.equal(guidance.fieldKey,fieldKey,type);
  assert.equal(guidance.message,getPublicationContentIssue(node),type);
  assert.equal(Object.isFrozen(guidance),true,type);
  assert.equal(publish(),'INCOMPLETE_EDITOR_CONTENT',type);
  assert.deepEqual(node,original,type);
 }
 const complete=probe('heading',{metadata:{contentVersion:1},props:{text:'Valódi címsor'}});
 assert.equal(getPublicationContentGuidance(complete.node),null);
 assert.equal(getPublicationContentGuidance(createNode('heading')),null);
});


test('publication guidance rejects malformed media-library IDs before source-validity guidance',()=>{
 const badId='not-a-media-uuid';
 const cases=[
  ['image',{assetId:badId,src:'/image.png',alt:'Leírás'},'assetId'],
  ['video',{src:'/video.webm',posterAssetId:badId},'posterAssetId'],
  ['gallery',{items:[{assetId:badId,src:'/gallery.png',alt:'Leírás',caption:''}]},'items'],
  ['carousel',{items:[{assetId:badId,src:'/carousel.png',alt:'Leírás',caption:'Felirat'}]},'items']
 ];
 for(const [type,props,fieldKey] of cases){
  const {node,publish}=probe(type,{metadata:{contentVersion:1},props});
  const before=structuredClone(node);
  const guidance=getPublicationContentGuidance(node);
  assert.ok(guidance,type);
  assert.equal(guidance.fieldKey,fieldKey,type);
  assert.match(guidance.message,/azonosító.*érvénytelen/,type);
  assert.equal(publish(),'INCOMPLETE_EDITOR_CONTENT',type);
  assert.deepEqual(node,before,type);
 }
});

test('weekly Schedule remains an Editor-owned v1 document and passes server publish validation',()=>{
  const state=createEditorState();
  execute(state,{type:'element.add',payload:{type:'schedule',props:{schedule:{
    mode:'week',limit:50,statuses:['scheduled','live','completed','cancelled'],
    showStatus:true,showNotes:true,showEndTime:true
  }}}});
  const page=state.document.pages[state.document.activePageId];
  const node=page.nodes[state.selection.primaryId];
  assert.equal(node.props.schedule.mode,'week');
  assert.equal(node.props.schedule.version,1);
  assert.deepEqual(node.props.schedule.statuses,['scheduled','live','completed','cancelled']);
  assert.equal(validatePublishDocument(state.document,page.id),null);
  // A bogus mode must continue to fail without changing the persisted document.
  const invalid=structuredClone(state.document);
  invalid.pages[page.id].nodes[node.id].props.schedule.mode='invalid-mode';
  assert.equal(validatePublishDocument(invalid,page.id),'INVALID_SCHEDULE_CONFIG');
});
