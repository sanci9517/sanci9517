import assert from 'node:assert/strict';
import test from 'node:test';
import {createDocument,NODE_TYPES} from '../core/schema.js';
import {createEditorState,activePage} from '../core/state.js';
import {execute} from '../core/commands.js';
import {resolveElementInsertion} from '../core/element-insertion.js';

test('new palette items go into a selected container and beside a selected leaf',()=>{
  const state=createEditorState(createDocument());
  let page=activePage(state);
  const rootId=page.rootId;
  execute(state,{type:'element.add',payload:{type:NODE_TYPES.SECTION,parentId:rootId}});
  const sectionId=state.selection.primaryId;
  execute(state,{type:'element.add',payload:{type:NODE_TYPES.HEADING,parentId:sectionId}});
  const firstId=state.selection.primaryId;
  execute(state,{type:'element.add',payload:{type:NODE_TYPES.TEXT,parentId:sectionId}});
  const lastId=state.selection.primaryId;

  assert.deepEqual(resolveElementInsertion(page,sectionId,NODE_TYPES.TEXT),{parentId:sectionId,index:2});
  const insertion=resolveElementInsertion(page,firstId,NODE_TYPES.TEXT);
  assert.deepEqual(insertion,{parentId:sectionId,index:1});
  execute(state,{type:'element.add',payload:{type:NODE_TYPES.TEXT,...insertion}});
  const insertedId=state.selection.primaryId;
  page=activePage(state);
  assert.deepEqual(page.nodes[sectionId].children,[firstId,insertedId,lastId]);

  execute(state,{type:'history.undo'});
  assert.deepEqual(activePage(state).nodes[sectionId].children,[firstId,lastId]);
  execute(state,{type:'history.redo'});
  assert.deepEqual(activePage(state).nodes[sectionId].children,[firstId,insertedId,lastId]);
});

test('no selection or an incompatible parent falls back to the root append position',()=>{
  const state=createEditorState(createDocument());
  const page=activePage(state);
  const rootId=page.rootId;
  assert.deepEqual(resolveElementInsertion(page,null,NODE_TYPES.TEXT),{parentId:rootId,index:0});
  execute(state,{type:'element.add',payload:{type:NODE_TYPES.TEXT,parentId:rootId}});
  const selectedId=state.selection.primaryId;
  assert.deepEqual(resolveElementInsertion(activePage(state),selectedId,NODE_TYPES.SECTION),{parentId:rootId,index:1});
});

test('palette insertion cannot mutate a locked container and bubbles after its locked subtree',()=>{
  const state=createEditorState(createDocument());
  let page=activePage(state);
  const rootId=page.rootId;
  execute(state,{type:'element.add',payload:{type:NODE_TYPES.SECTION,parentId:rootId}});
  const lockedSectionId=state.selection.primaryId;
  execute(state,{type:'element.add',payload:{type:NODE_TYPES.HEADING,parentId:lockedSectionId}});
  const headingId=state.selection.primaryId;
  execute(state,{type:'element.lock.set',payload:{nodeId:lockedSectionId,locked:true}});

  const before=structuredClone(state.document);
  assert.deepEqual(resolveElementInsertion(activePage(state),lockedSectionId,NODE_TYPES.TEXT),{parentId:rootId,index:1});
  assert.deepEqual(resolveElementInsertion(activePage(state),headingId,NODE_TYPES.TEXT),{parentId:rootId,index:1});
  assert.throws(()=>execute(state,{type:'element.add',payload:{type:NODE_TYPES.TEXT,parentId:lockedSectionId}}),/locked node/);
  assert.deepEqual(state.document,before,'a direct command cannot bypass the locked destination');

  const insertion=resolveElementInsertion(activePage(state),lockedSectionId,NODE_TYPES.TEXT);
  execute(state,{type:'element.add',payload:{type:NODE_TYPES.TEXT,...insertion}});
  page=activePage(state);
  const insertedId=state.selection.primaryId;
  assert.deepEqual(page.nodes[rootId].children,[lockedSectionId,insertedId]);
  assert.deepEqual(page.nodes[lockedSectionId].children,[headingId]);
  execute(state,{type:'history.undo'});
  assert.deepEqual(state.document,before,'undo removes only the unlocked sibling insertion');
});

function lockedParentFixture({groupChildren=false}={}){
  const state=createEditorState(createDocument());
  const rootId=activePage(state).rootId;
  execute(state,{type:'element.add',payload:{type:NODE_TYPES.SECTION,parentId:rootId}});
  const lockedParentId=state.selection.primaryId;
  execute(state,{type:'element.add',payload:{type:NODE_TYPES.HEADING,parentId:lockedParentId}});
  const firstChildId=state.selection.primaryId;
  execute(state,{type:'element.add',payload:{type:NODE_TYPES.TEXT,parentId:lockedParentId}});
  const secondChildId=state.selection.primaryId;
  let groupId=null;
  if(groupChildren){
    execute(state,{type:'hierarchy.group',payload:{nodeIds:[firstChildId,secondChildId]}});
    groupId=state.selection.primaryId;
  }
  execute(state,{type:'element.lock.set',payload:{nodeId:lockedParentId,locked:true}});
  execute(state,{type:'element.add',payload:{type:NODE_TYPES.BUTTON,parentId:rootId}});
  return {state,rootId,lockedParentId,firstChildId,secondChildId,groupId,externalId:state.selection.primaryId};
}

test('all hierarchy commands preserve a locked parent child list',()=>{
  const cases=[
    ['delete a child',(f)=>({type:'element.delete',payload:{nodeId:f.firstChildId}})],
    ['reparent a child out',(f)=>({type:'hierarchy.reparent',payload:{nodeId:f.firstChildId,parentId:f.rootId}})],
    ['reorder a child',(f)=>({type:'hierarchy.reorder',payload:{nodeId:f.firstChildId,index:1}})],
    ['reparent a new child in',(f)=>({type:'hierarchy.reparent',payload:{nodeId:f.externalId,parentId:f.lockedParentId}})],
    ['duplicate a child in',(f)=>({type:'element.duplicate',payload:{nodeId:f.externalId,parentId:f.lockedParentId}})],
    ['group children',(f)=>({type:'hierarchy.group',payload:{nodeIds:[f.firstChildId,f.secondChildId]}})],
    ['ungroup inside',(f)=>({type:'hierarchy.ungroup',payload:{nodeId:f.groupId}}),'groupChildren']
  ];

  for(const [label,actionFactory,option] of cases){
    const f=lockedParentFixture({groupChildren:option==='groupChildren'});
    const before=structuredClone(f.state.document);
    const historyBefore=f.state.history.past.length;
    assert.throws(()=>execute(f.state,actionFactory(f)),/locked/i,label);
    assert.deepEqual(f.state.document,before,`${label} must leave the Page Model untouched`);
    assert.equal(f.state.history.past.length,historyBefore,`${label} must not create an undo entry`);
  }
});

test('hierarchy reparent and reorder reject a locked source node atomically',()=>{
  for(const type of ['hierarchy.reparent','hierarchy.reorder']){
    const state=createEditorState(createDocument()),rootId=activePage(state).rootId;
    execute(state,{type:'element.add',payload:{type:NODE_TYPES.SECTION,parentId:rootId}});const targetParentId=state.selection.primaryId;
    execute(state,{type:'element.add',payload:{type:NODE_TYPES.TEXT,parentId:rootId}});const lockedNodeId=state.selection.primaryId;
    execute(state,{type:'element.lock.set',payload:{nodeId:lockedNodeId,locked:true}});
    const before=structuredClone(state.document),historyBefore=state.history.past.length;
    const payload=type==='hierarchy.reparent'?{nodeId:lockedNodeId,parentId:targetParentId}:{nodeId:lockedNodeId,index:0};
    assert.throws(()=>execute(state,{type,payload}),/locked/i,`${type} cannot move a locked source`);
    assert.deepEqual(state.document,before,`${type} rejection must preserve the Page Model`);
    assert.equal(state.history.past.length,historyBefore,`${type} rejection must not add history`);
  }
});
