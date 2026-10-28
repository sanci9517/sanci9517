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
