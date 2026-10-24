import assert from 'node:assert/strict';
import test from 'node:test';
import {createDocument, createNode} from '../public/editor-v2/core/schema.js';
import {createElementContent, validateElementContent as validateStructuredContent} from '../public/editor-v2/core/element-content.js';
import {CONTENT_FIELDS, contentProperties} from '../public/editor-v2/core/authored-content.js';
import {getElementContentContract} from '../public/editor-v2/core/content-profiles.js';
import {validatePublishDocument} from '../src/core/editor-validation.ts';
import {createEditorState} from '../public/editor-v2/core/state.js';
import {execute} from '../public/editor-v2/core/commands.js';

// 77.44.7.A: regression evidence for real initial values versus publication gates.
// Do not synthesize initial defaults from Inspector field metadata.
function probe(type, {metadata={}, props={}, visibility}={}) {
  const document=createDocument();
  const page=document.pages[document.activePageId];
  const node=createNode(type, {id:'content_probe',parentId:page.rootId,metadata,props,
    ...(visibility===undefined?{}:{visibility})});
  page.nodes[node.id]=node;
  page.nodes[page.rootId].children.push(node.id);
  return {node, publish:()=>validatePublishDocument(document,page.id)};
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
