import assert from 'node:assert/strict';
import test from 'node:test';

import { createDocument, NODE_TYPES } from '../core/schema.js';
import { assertValidEditorDocument } from '../core/validation.js';
import { createEditorState, activePage } from '../core/state.js';
import { beginTransaction, commitTransaction, execute, executeBatch, rollbackTransaction } from '../core/commands.js';

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
  assert.equal(state.document.revision, 1);
  assert.equal(state.persistence.dirty, true);
  assertValidEditorDocument(state.document);
});

test('content, style and responsive commands mutate only through the command engine', () => {
  const state = createEditorState();
  execute(state, { type: 'element.add', payload: { type: NODE_TYPES.TEXT } });
  const id = state.selection.primaryId;

  execute(state, { type: 'element.content.set', payload: { nodeId: id, content: 'Sanci' } });
  execute(state, { type: 'style.set', payload: { nodeId: id, patch: { color: '#fff', fontSize: '24px' } } });
  execute(state, { type: 'responsive.set', payload: { nodeId: id, device: 'mobile', patch: { fontSize: '18px' } } });

  const node = activePage(state).nodes[id];
  assert.equal(node.props.content, 'Sanci');
  assert.equal(node.style.color, '#fff');
  assert.equal(node.responsive.mobile.fontSize, '18px');
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
  assert.deepEqual(page.nodes[page.rootId].children, [first]);
  assertValidEditorDocument(state.document);
});

test('reorder changes sibling order without changing parent', () => {
  const state = createEditorState();
  execute(state, { type: 'element.add', payload: { type: NODE_TYPES.SECTION } });
  const first = state.selection.primaryId;
  execute(state, { type: 'element.add', payload: { type: NODE_TYPES.SECTION } });
  const second = state.selection.primaryId;
  execute(state, { type: 'hierarchy.reorder', payload: { nodeId: first, index: 1 } });
  assert.deepEqual(activePage(state).nodes[activePage(state).rootId].children, [second, first]);
  assert.equal(activePage(state).nodes[first].parentId, activePage(state).rootId);
  assertValidEditorDocument(state.document);
});

test('duplicate copies an entire subtree with new ids', () => {
  const state = createEditorState();
  execute(state, { type: 'element.add', payload: { type: NODE_TYPES.SECTION } });
  const section = state.selection.primaryId;
  execute(state, { type: 'element.add', payload: { type: NODE_TYPES.TEXT } });
  const text = state.selection.primaryId;
  execute(state, { type: 'hierarchy.reparent', payload: { nodeId: text, parentId: section } });
  execute(state, { type: 'element.duplicate', payload: { nodeId: section } });

  const page = activePage(state);
  const duplicate = page.nodes[state.selection.primaryId];
  assert.notEqual(duplicate.id, section);
  assert.equal(duplicate.parentId, page.rootId);
  assert.equal(duplicate.children.length, 1);
  assert.notEqual(duplicate.children[0], text);
  assert.equal(page.nodes[duplicate.children[0]].parentId, duplicate.id);
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

test('locked elements reject mutation but can be explicitly unlocked', () => {
  const state = createEditorState();
  execute(state, { type: 'element.add', payload: { type: NODE_TYPES.TEXT } });
  const id = state.selection.primaryId;
  execute(state, { type: 'element.lock.set', payload: { nodeId: id, locked: true } });
  assert.throws(() => execute(state, { type: 'element.content.set', payload: { nodeId: id, content: 'blocked' } }));
  execute(state, { type: 'element.lock.set', payload: { nodeId: id, locked: false } });
  execute(state, { type: 'element.content.set', payload: { nodeId: id, content: 'allowed' } });
  assert.equal(activePage(state).nodes[id].props.content, 'allowed');
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

test('batch commands are grouped into one undo entry', () => {
  const state = createEditorState();
  executeBatch(state, [
    { type: 'element.add', payload: { type: NODE_TYPES.SECTION } },
    { type: 'element.add', payload: { type: NODE_TYPES.TEXT } }
  ], { label: 'Create section and text' });
  assert.equal(state.history.past.length, 1);
  assert.equal(activePage(state).nodes[activePage(state).rootId].children.length, 1);
  execute(state, { type: 'history.undo' });
  assert.equal(Object.keys(activePage(state).nodes).length, 1);
  execute(state, { type: 'history.redo' });
  assert.equal(Object.keys(activePage(state).nodes).length, 3);
  assertValidEditorDocument(state.document);
});

test('manual transaction can be committed or rolled back', () => {
  const state = createEditorState();
  beginTransaction(state, 'manual');
  execute(state, { type: 'element.add', payload: { type: NODE_TYPES.SECTION } });
  commitTransaction(state);
  assert.equal(state.history.past.length, 1);

  const before = structuredClone(state.document);
  beginTransaction(state, 'rollback');
  execute(state, { type: 'element.add', payload: { type: NODE_TYPES.TEXT } });
  rollbackTransaction(state);
  assert.deepEqual(state.document, before);
  assertValidEditorDocument(state.document);
});

test('unknown command fails without corrupting the document', () => {
  const state = createEditorState();
  const before = structuredClone(state.document);
  assert.throws(() => execute(state, { type: 'does.not.exist' }));
  assert.deepEqual(state.document, before);
  assert.equal(state.runtime.activeCommand, null);
  assertValidEditorDocument(state.document);
});
