import assert from 'node:assert/strict';
import test from 'node:test';
import {CONTENT_PROFILES,hasContentProfile,getElementContentContract} from '../public/editor-v2/core/content-profiles.js';
import {createDocument,createNode,NODE_TYPES} from '../public/editor-v2/core/schema.js';
import {validatePublishDocument} from '../src/core/editor-validation.ts';
import {createEditorState} from '../public/editor-v2/core/state.js';
import {execute} from '../public/editor-v2/core/commands.js';

function documentWith(type,metadata={},props={}){
 const document=createDocument(),page=document.pages[document.activePageId];
 const node=createNode(type,{id:'probe',parentId:page.rootId,metadata,props});page.nodes[node.id]=node;page.nodes[page.rootId].children.push(node.id);
 return {document,node,check:()=>validatePublishDocument(document,page.id)};
}
test('existing versioned profiles map to their actual storage and validation without migration',()=>{
 for(const profile of Object.values(CONTENT_PROFILES)){
  const type=profile.id==='authored-v1'?'text':profile.id==='structured-v1'?'table':profile.types[0];
  const node={type,metadata:profile.marker?{[profile.marker]:1}:{},props:{}};const original=structuredClone(node);
  assert.equal(hasContentProfile(node,profile.id),true,profile.id);
  const contract=getElementContentContract(node);assert.ok(contract.profiles.some(p=>p.id===profile.id));
  assert.equal(contract.acceptance,'NOT_CERTIFIED');assert.ok(profile.storage&&profile.validation);assert.ok(Object.isFrozen(profile));assert.ok(Object.isFrozen(contract.profiles));
  assert.deepEqual(node,original);
  if(profile.marker){node.metadata[profile.marker]='1';assert.equal(hasContentProfile(node,profile.id),false);node.metadata[profile.marker]=2;assert.equal(hasContentProfile(node,profile.id),false);}
 }
 assert.equal(hasContentProfile({type:'text',metadata:{structuredContentVersion:1}},'structured-v1'),false);
 assert.equal(hasContentProfile({type:'text',metadata:{codeSnippetVersion:1}},'code-v1'),false);
 for(const id of ['constructor','__proto__','toString','unknown'])assert.equal(hasContentProfile({},id),false);
 assert.equal(getElementContentContract({type:'image'}).profiles[0].id,'legacy-or-unrecognized-version');
 const authored=getElementContentContract({type:'image',metadata:{contentVersion:1}});assert.ok(authored.fields.some(f=>f.key==='alt'));assert.ok(Object.isFrozen(authored.fields));assert.ok(Object.isFrozen(authored.fields[0]));assert.deepEqual(getElementContentContract({type:'image'}).fields,[]);
 assert.deepEqual(getElementContentContract({type:'constructor',metadata:{contentVersion:1}}).fields,[]);
});
test('element.add assigns version markers from the same profile declarations used by publication',()=>{
 for(const profile of Object.values(CONTENT_PROFILES)){
  const type=profile.id==='authored-v1'?'text':profile.id==='structured-v1'?'table':profile.types?.[0];
  assert.ok(Object.values(NODE_TYPES).includes(type),`${profile.id} has an Editor node type`);
  const state=createEditorState();
  execute(state,{type:'element.add',payload:{type,authored:profile.id==='authored-v1'}});
  const page=state.document.pages[state.document.activePageId];
  const node=page.nodes[state.selection.primaryId];
  assert.ok(hasContentProfile(node,profile.id),`${profile.id} is enabled on newly added ${type}`);
  assert.ok(getElementContentContract(node).profiles.some(candidate=>candidate.id===profile.id));
 }
 const authoredStructure=createEditorState();
 execute(authoredStructure,{type:'element.add',payload:{type:'section',authored:true}});
 const page=authoredStructure.document.pages[authoredStructure.document.activePageId];
 assert.equal(page.nodes[authoredStructure.selection.primaryId].metadata.contentVersion,1,'authored structural nodes retain their existing version gate');
});
test('versioned code and structured validation stay active while legacy documents remain compatible',()=>{
 const legacy=documentWith('code');assert.equal(legacy.check(),null);
 legacy.node.metadata.codeSnippetVersion=1;assert.equal(legacy.check(),'INVALID_CODE_SNIPPET');
 legacy.node.metadata.contentVersion=1;assert.equal(legacy.check(),'INVALID_CODE_SNIPPET','authored marker must not bypass a second active validator');
 const table=documentWith('table');assert.equal(table.check(),null);
 table.node.metadata.structuredContentVersion=1;assert.ok(table.check());
 table.node.props.contentModel={version:1,rows:[['Value']]};assert.equal(table.check(),null);
});
test('authored media and versioned legacy media retain their distinct publication requirements',()=>{
 const old=documentWith('image');assert.equal(old.check(),null);
 old.node.metadata.editorContentVersion=1;assert.equal(old.check(),'INVALID_MEDIA_SOURCE');
 const authored=documentWith('image',{contentVersion:1});assert.equal(authored.check(),'INCOMPLETE_EDITOR_CONTENT');
 const mixed={type:'image',metadata:{contentVersion:1,editorContentVersion:1}};
 assert.deepEqual(getElementContentContract(mixed).profiles.map(p=>p.id),['authored-v1','media-v1']);
});

test('published Inspector style values use the registry while untouched legacy styles stay compatible',()=>{
 const state=createEditorState();
 execute(state,{type:'element.add',payload:{type:'text'}});
 const page=state.document.pages[state.document.activePageId],node=page.nodes[state.selection.primaryId];
 execute(state,{type:'responsive.set',payload:{nodeId:node.id,device:'desktop',patch:{fontSize:'32px'}}});
 assert.equal(validatePublishDocument(state.document,page.id),null);
 node.responsive.desktop.fontSize='javascript:alert(1)';
 assert.equal(validatePublishDocument(state.document,page.id),'INVALID_INSPECTOR_STYLE');
 execute(state,{type:'responsive.set',payload:{nodeId:node.id,device:'desktop',patch:{fontSize:undefined}}});
 assert.equal(validatePublishDocument(state.document,page.id),null,'reset removes its tracked local override');

 const legacy=documentWith('text');
 legacy.node.style={fontSize:'legacy-token(large)'};
 assert.equal(legacy.check(),null,'older unversioned content does not gain a new publish gate');
});
