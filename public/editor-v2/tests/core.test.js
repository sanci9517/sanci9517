import assert from 'node:assert/strict';
import test from 'node:test';

import { createDocument, NODE_TYPES } from '../core/schema.js';
import { assertValidEditorDocument } from '../core/validation.js';
import { createEditorState, activePage } from '../core/state.js';
import { beginTransaction, commitTransaction, execute, executeBatch, rollbackTransaction } from '../core/commands.js';
import { getProperty, listProperties, listPropertyGroups } from '../core/property-registry.js';
import { hasResponsiveOverride, resolveResponsiveValue, setResponsiveValue } from '../core/responsive.js';

test('new document is structurally valid', () => {
  const document = createDocument();
  assertValidEditorDocument(document);
  assert.equal(document.pages[document.activePageId].nodes[document.pages[document.activePageId].rootId].children.length, 0);
});

test('property registry exposes extensible inspector groups and properties', () => {
  assert.ok(listPropertyGroups().some((group) => group.id === 'typography'));
  assert.ok(listPropertyGroups().some((group) => group.id === 'responsive'));
  assert.equal(getProperty('size.width').responsive, true);
  assert.equal(getProperty('content.text').command, 'element.update');
  assert.ok(listProperties({ group: 'size' }).some((property) => property.id === 'size.width'));
});

test('responsive values inherit from wider viewports and can be overridden/reset', () => {
  let responsive = setResponsiveValue({}, 'width', 'desktop', '1200px');
  responsive = setResponsiveValue(responsive, 'width', 'tablet', '90%');
  assert.deepEqual(resolveResponsiveValue(responsive, 'width', 'desktop'), { value: '1200px', source: 'desktop', inherited: false });
  assert.deepEqual(resolveResponsiveValue(responsive, 'width', 'tablet'), { value: '90%', source: 'tablet', inherited: false });
  assert.deepEqual(resolveResponsiveValue(responsive, 'width', 'mobile'), { value: '90%', source: 'tablet', inherited: true });
  assert.equal(hasResponsiveOverride(responsive, 'width', 'mobile'), false);
  responsive = setResponsiveValue(responsive, 'width', 'mobile', '100%');
  assert.deepEqual(resolveResponsiveValue(responsive, 'width', 'mobile'), { value: '100%', source: 'mobile', inherited: false });
  responsive = setResponsiveValue(responsive, 'width', 'mobile', undefined);
  assert.deepEqual(resolveResponsiveValue(responsive, 'width', 'mobile'), { value: '90%', source: 'tablet', inherited: true });
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

test('Rich Text creates canonical structured content and accepts valid updates', () => {
  const state = createEditorState();
  execute(state, { type: 'element.add', payload: { type: NODE_TYPES.RICHTEXT } });
  const id = state.selection.primaryId;
  const node = activePage(state).nodes[id];

  assert.equal(node.type, NODE_TYPES.RICHTEXT);
  assert.equal(node.props.richText.type, 'richtext-document');
  assert.equal(node.props.richText.schemaVersion, 1);
  assert.equal(node.props.richText.blocks[0].type, 'paragraph');

  const richText = {
    schemaVersion: 1,
    type: 'richtext-document',
    blocks: [
      {
        type: 'heading',
        level: 2,
        children: [{ type: 'text', text: 'Sanci9517', marks: ['bold'] }]
      },
      {
        type: 'paragraph',
        children: [{
          type: 'text',
          text: 'Twitch',
          marks: ['italic'],
          link: { href: 'https://www.twitch.tv/sanci9517', target: '_blank' }
        }]
      },
      {
        type: 'bulleted-list',
        items: [{ children: [{ type: 'text', text: 'Fortnite', marks: [] }] }]
      },
      {
        type: 'quote',
        children: [{ type: 'text', text: 'Stream', marks: ['underline'] }]
      },
      {
        type: 'code',
        children: [{ type: 'text', text: 'const sanci = true;', marks: ['code'] }]
      }
    ]
  };

  execute(state, { type: 'richtext.content.set', payload: { nodeId: id, document: richText } });

  const updated = activePage(state).nodes[id].props.richText;
  assert.equal(updated.blocks[0].level, 2);
  assert.equal(updated.blocks[0].children[0].marks[0], 'bold');
  assert.equal(updated.blocks[1].children[0].link.href, 'https://www.twitch.tv/sanci9517');
  assert.equal(updated.blocks[2].items[0][0].text, 'Fortnite');
  assert.equal(updated.blocks[3].children[0].marks[0], 'underline');
  assert.equal(updated.blocks[4].children[0].marks[0], 'code');
  assert.equal(state.persistence.dirty, true);
  assert.equal(state.document.revision, 2);
  assertValidEditorDocument(state.document);
});

test('invalid Rich Text is rejected and the document rolls back exactly', () => {
  const state = createEditorState();
  execute(state, { type: 'element.add', payload: { type: NODE_TYPES.RICHTEXT } });
  const id = state.selection.primaryId;
  const before = structuredClone(state.document);
  const historyBefore = state.history.past.length;

  assert.throws(() => execute(state, {
    type: 'richtext.content.set',
    payload: {
      nodeId: id,
      document: {
        schemaVersion: 1,
        type: 'richtext-document',
        blocks: [{
          type: 'paragraph',
          children: [{ type: 'text', text: 'Hiba', marks: ['unknown-mark'] }]
        }]
      }
    }
  }));

  assert.deepEqual(state.document, before);
  assert.equal(state.history.past.length, historyBefore);
  assertValidEditorDocument(state.document);
});

test('Rich Text Undo and Redo restore the exact structured document', () => {
  const state = createEditorState();
  execute(state, { type: 'element.add', payload: { type: NODE_TYPES.RICHTEXT } });
  const id = state.selection.primaryId;
  const richText = {
    schemaVersion: 1,
    type: 'richtext-document',
    blocks: [{
      type: 'paragraph',
      children: [{ type: 'text', text: 'Első változat', marks: ['bold'] }]
    }]
  };

  execute(state, { type: 'richtext.content.set', payload: { nodeId: id, document: richText } });
  const afterSet = structuredClone(state.document);

  execute(state, { type: 'history.undo' });
  const undone = activePage(state).nodes[id];
  assert.deepEqual(undone.props.richText, {
    schemaVersion: 1,
    type: 'richtext-document',
    blocks: [{ type: 'paragraph', children: [{ type: 'text', text: '', marks: [] }] }]
  });

  execute(state, { type: 'history.redo' });
  assert.deepEqual(state.document, afterSet);
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
  execute(state, { type: 'element.add', payload: { type: NODE_TYPES.CONTAINER, parentId: activePage(state).rootId } });
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
  const rootId = activePage(state).rootId;
  execute(state, { type: 'element.add', payload: { type: NODE_TYPES.SECTION, parentId: rootId } });
  const first = state.selection.primaryId;
  execute(state, { type: 'element.add', payload: { type: NODE_TYPES.SECTION, parentId: rootId } });
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
  execute(state, { type: 'element.add', payload: { type: NODE_TYPES.TEXT, parentId: section } });
  const text = state.selection.primaryId;
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
  const rootId = activePage(state).rootId;
  executeBatch(state, [
    { type: 'element.add', payload: { type: NODE_TYPES.SECTION, parentId: rootId } },
    { type: 'element.add', payload: { type: NODE_TYPES.TEXT, parentId: rootId } }
  ], { label: 'Create section and text' });
  assert.equal(state.history.past.length, 1);
  assert.equal(activePage(state).nodes[activePage(state).rootId].children.length, 2);
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
