import assert from 'node:assert/strict';
import test from 'node:test';

import { createDocument, NODE_TYPES } from '../core/schema.js';
import { assertValidEditorDocument } from '../core/validation.js';
import { createEditorState, activePage } from '../core/state.js';
import { execute } from '../core/commands.js';

test('new document is structurally valid', () => {
  const document = createDocument();
  assertValidEditorDocument(document);
  assert.equal(document.pages[document.activePageId].nodes[document.pages[document.activePageId].rootId].children.length, 0);
});

test('element add creates a real parent-child relationship', () => {
  const state = createEditorState();
  const page = activePage(state);
  execute(state, { type: 'element.add', payload: { type: NODE_TYPES.SECTION } });
  const section = page.nodes[state.selection.primaryId];
  assert.equal(section.parentId, page.rootId);
  assert.deepEqual(page.nodes[page.rootId].children, [section.id]);
  assertValidEditorDocument(state.document);
});

test('reparent moves the node and preserves hierarchy invariants', () => {
  const state = createEditorState();
  execute(state, { type: 'element.add', payload: { type: NODE_TYPES.SECTION } });
  const first = state.selection.primaryId;
  execute(state, { type: 'element.add', payload: { type: NODE_TYPES.CONTAINER } });
  const second = state.selection.primaryId;
  execute(state, { type: 'hierarchy.reparent', payload: { nodeId: second, parentId: first } });
  const page = activePage(state);
  assert.equal(page.nodes[second].parentId, first);
  assert.deepEqual(page.nodes[first].children, [second]);
  assertValidEditorDocument(state.document);
});

test('invalid reparent rolls back the mutation', () => {
  const state = createEditorState();
  execute(state, { type: 'element.add', payload: { type: NODE_TYPES.SECTION } });
  const first = state.selection.primaryId;
  execute(state, { type: 'element.add', payload: { type: NODE_TYPES.TEXT } });
  const text = state.selection.primaryId;
  const before = structuredClone(state.document);
  assert.throws(() => execute(state, {
    type: 'hierarchy.reparent',
    payload: { nodeId: first, parentId: text }
  }));
  assert.deepEqual(state.document, before);
  assertValidEditorDocument(state.document);
});

test('undo and redo restore exact document snapshots', () => {
  const state = createEditorState();
  const initial = structuredClone(state.document);
  execute(state, { type: 'element.add', payload: { type: NODE_TYPES.SECTION } });
  assert.notDeepEqual(state.document, initial);
  execute(state, { type: 'history.undo' });
  assert.deepEqual(state.document, initial);
  execute(state, { type: 'history.redo' });
  assert.equal(Object.keys(activePage(state).nodes).length, 2);
  assertValidEditorDocument(state.document);
});
