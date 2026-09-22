/*
 * Sanci9517 Visual Editor v2 — canonical command engine.
 *
 * UI, future AI and integrations must use these structured mutations instead
 * of changing the Page Model directly. Validation and history stay centralized.
 */

import { canContain, cloneDocument, createEmptyRichText, createNode, getNode, normalizeRichText } from './schema.js';
import { assertValidEditorDocument } from './validation.js';
import { activePage, clearSelection, setSelection } from './state.js';

function requirePage(state) {
  const page = activePage(state);
  if (!page) throw new Error('Active page not found');
  return page;
}

function requireNode(state, nodeId, { allowLocked = false } = {}) {
  const page = requirePage(state);
  const node = getNode(page, nodeId);
  if (!node) throw new Error(`Node not found: ${nodeId}`);
  if (!allowLocked && node.locked) throw new Error(`Node is locked: ${nodeId}`);
  return { page, node };
}

function snapshot(state) {
  return cloneDocument(state.document);
}

function record(state, before, action) {
  if (state.history.transaction) {
    state.history.transaction.actions.push(action);
    return;
  }

  state.history.past.push({
    action,
    before,
    after: cloneDocument(state.document),
    timestamp: Date.now()
  });
  if (state.history.past.length > state.history.limit) state.history.past.shift();
  state.history.future = [];
  state.persistence.dirty = true;
  state.persistence.error = null;
}

function commit(state, action, mutate) {
  const before = snapshot(state);
  try {
    mutate(state);
    assertValidEditorDocument(state.document);
    record(state, before, action);
    return state;
  } catch (error) {
    state.document = before;
    throw error;
  }
}

function collectDescendants(page, nodeId, result = new Set()) {
  if (result.has(nodeId)) return result;
  result.add(nodeId);
  for (const childId of page.nodes[nodeId]?.children ?? []) collectDescendants(page, childId, result);
  return result;
}

function removeFromParent(page, nodeId) {
  const node = page.nodes[nodeId];
  if (node?.parentId && page.nodes[node.parentId]) {
    page.nodes[node.parentId].children = page.nodes[node.parentId].children.filter((id) => id !== nodeId);
  }
}

function insertChild(parent, nodeId, index) {
  const safeIndex = Number.isInteger(index)
    ? Math.max(0, Math.min(index, parent.children.length))
    : parent.children.length;
  parent.children.splice(safeIndex, 0, nodeId);
}

function bumpRevision(document) {
  document.revision = (document.revision ?? 0) + 1;
  const page = document.pages?.[document.activePageId];
  if (page) page.revision = (page.revision ?? 0) + 1;
}

export const commands = Object.freeze({
  'selection.set': (state, { ids = [], primaryId } = {}) => {
    setSelection(state, ids, primaryId ?? ids.at(-1) ?? null);
    return state;
  },

  'selection.clear': (state) => {
    clearSelection(state);
    return state;
  },

  'element.add': (state, { type, parentId, props = {}, style = {}, name } = {}) => commit(
    state,
    { type: 'element.add', payload: { type, parentId } },
    (draft) => {
      if (!type) throw new Error('Element type is required');
      const page = requirePage(draft);
      const selectedParent = draft.selection.primaryId ? getNode(page, draft.selection.primaryId) : null;
      const parent = getNode(page, parentId ?? selectedParent?.id ?? page.rootId);
      if (!parent || !canContain(parent, type)) throw new Error('Invalid parent for element');
      const nodeProps = structuredClone(props);
      if (type === 'richtext' && !nodeProps.richText) {
        nodeProps.richText = createEmptyRichText();
      }
      const node = createNode(type, {
        props: nodeProps,
        style: structuredClone(style),
        name: name ?? type,
        parentId: parent.id
      });
      page.nodes[node.id] = node;
      parent.children.push(node.id);
      setSelection(draft, [node.id], node.id);
      bumpRevision(draft.document);
    }
  ),

  'element.update': (state, { nodeId, patch = {} } = {}) => commit(
    state,
    { type: 'element.update', payload: { nodeId, patch: structuredClone(patch) } },
    (draft) => {
      const { node } = requireNode(draft, nodeId);
      const safePatch = { ...patch };
      delete safePatch.id;
      delete safePatch.parentId;
      delete safePatch.children;
      Object.assign(node, structuredClone(safePatch));
      bumpRevision(draft.document);
    }
  ),

  'element.content.set': (state, { nodeId, content = '' } = {}) => commit(
    state,
    { type: 'element.content.set', payload: { nodeId, content: String(content) } },
    (draft) => {
      const { node } = requireNode(draft, nodeId);
      if (node.type === 'richtext') throw new Error('Use richtext.content.set for Rich Text');
      const value = String(content);
      const textTypes = new Set(['heading', 'text', 'button', 'link']);
      node.props = {
        ...node.props,
        ...(textTypes.has(node.type) ? { text: value, content: value } : { content: value })
      };
      bumpRevision(draft.document);
    }
  ),

  'richtext.content.set': (state, { nodeId, document } = {}) => commit(
    state,
    { type: 'richtext.content.set', payload: { nodeId, document: structuredClone(document) } },
    (draft) => {
      const { node } = requireNode(draft, nodeId);
      if (node.type !== 'richtext') throw new Error('richtext.content.set requires a Rich Text node');
      node.props = { ...node.props, richText: normalizeRichText(document) };
      bumpRevision(draft.document);
    }
  ),

  'style.set': (state, { nodeId, patch = {} } = {}) => commit(
    state,
    { type: 'style.set', payload: { nodeId, patch: structuredClone(patch) } },
    (draft) => {
      const { node } = requireNode(draft, nodeId);
      node.style = { ...node.style, ...structuredClone(patch) };
      bumpRevision(draft.document);
    }
  ),

  'responsive.set': (state, { nodeId, device = 'desktop', patch = {} } = {}) => commit(
    state,
    { type: 'responsive.set', payload: { nodeId, device, patch: structuredClone(patch) } },
    (draft) => {
      const { node } = requireNode(draft, nodeId);
      if (!['desktop', 'tablet', 'mobile'].includes(device)) throw new Error(`Invalid responsive device: ${device}`);
      node.responsive[device] = { ...(node.responsive[device] ?? {}), ...structuredClone(patch) };
      bumpRevision(draft.document);
    }
  ),

  'element.visibility.set': (state, { nodeId, device = 'desktop', visible = true } = {}) => commit(
    state,
    { type: 'element.visibility.set', payload: { nodeId, device, visible } },
    (draft) => {
      const { node } = requireNode(draft, nodeId);
      if (!['desktop', 'tablet', 'mobile'].includes(device)) throw new Error(`Invalid responsive device: ${device}`);
      node.visibility[device] = Boolean(visible);
      bumpRevision(draft.document);
    }
  ),

  'element.lock.set': (state, { nodeId, locked = true } = {}) => commit(
    state,
    { type: 'element.lock.set', payload: { nodeId, locked } },
    (draft) => {
      const { node } = requireNode(draft, nodeId, { allowLocked: true });
      node.locked = Boolean(locked);
      bumpRevision(draft.document);
    }
  ),

  'element.duplicate': (state, { nodeId, parentId, index } = {}) => commit(
    state,
    { type: 'element.duplicate', payload: { nodeId, parentId, index } },
    (draft) => {
      const page = requirePage(draft);
      const { node } = requireNode(draft, nodeId);
      const sourceIds = [...collectDescendants(page, nodeId)];
      const idMap = new Map(sourceIds.map((id) => [id, createNode('custom').id]));
      const newRootId = idMap.get(nodeId);
      const targetParent = getNode(page, parentId ?? node.parentId ?? page.rootId);
      if (!targetParent || !canContain(targetParent, node.type)) throw new Error('Invalid duplicate target');

      for (const sourceId of sourceIds) {
        const source = page.nodes[sourceId];
        const copy = structuredClone(source);
        copy.id = idMap.get(sourceId);
        copy.parentId = sourceId === nodeId ? targetParent.id : idMap.get(source.parentId);
        copy.children = source.children.map((childId) => idMap.get(childId));
        copy.name = `${source.name} másolat`;
        page.nodes[copy.id] = copy;
      }
      insertChild(targetParent, newRootId, index);
      setSelection(draft, [newRootId], newRootId);
      bumpRevision(draft.document);
    }
  ),

  'element.delete': (state, { nodeId } = {}) => commit(
    state,
    { type: 'element.delete', payload: { nodeId } },
    (draft) => {
      const page = requirePage(draft);
      const { node } = requireNode(draft, nodeId);
      if (node.id === page.rootId) throw new Error('Root cannot be deleted');
      const descendants = collectDescendants(page, nodeId);
      removeFromParent(page, nodeId);
      for (const id of descendants) delete page.nodes[id];
      draft.selection.ids = draft.selection.ids.filter((id) => !descendants.has(id));
      if (descendants.has(draft.selection.primaryId)) draft.selection.primaryId = draft.selection.ids.at(-1) ?? null;
      bumpRevision(draft.document);
    }
  ),

  'hierarchy.group': (state, { nodeIds } = {}) => commit(
    state,
    { type: 'hierarchy.group', payload: { nodeIds: [...(nodeIds ?? state.selection.ids)] } },
    (draft) => {
      const page = requirePage(draft);
      const ids = [...new Set(Array.isArray(nodeIds) ? nodeIds : draft.selection.ids)];
      if (ids.length < 2) throw new Error('Group requires at least two nodes');

      const nodes = ids.map((id) => {
        const node = getNode(page, id);
        if (!node) throw new Error(`Node not found: ${id}`);
        if (node.id === page.rootId) throw new Error('Root cannot be grouped');
        if (node.locked) throw new Error(`Node is locked: ${id}`);
        return node;
      });

      const parentId = nodes[0].parentId;
      if (!parentId) throw new Error('Selected nodes must share a parent');
      const parent = getNode(page, parentId);
      if (!parent || !canContain(parent, 'group')) throw new Error('Invalid group parent');

      if (nodes.some((node) => node.parentId !== parentId)) {
        throw new Error('Selected nodes must share the same parent');
      }

      const selected = new Set(ids);
      const orderedIds = parent.children.filter((id) => selected.has(id));
      if (orderedIds.length !== ids.length) throw new Error('Invalid group selection');

      const firstIndex = parent.children.indexOf(orderedIds[0]);
      const group = createNode('group', {
        name: 'Csoport',
        parentId: parent.id,
        children: [...orderedIds]
      });

      page.nodes[group.id] = group;
      parent.children = parent.children.filter((id) => !selected.has(id));
      insertChild(parent, group.id, firstIndex);

      for (const nodeId of orderedIds) page.nodes[nodeId].parentId = group.id;

      setSelection(draft, [group.id], group.id);
      bumpRevision(draft.document);
    }
  ),

  'hierarchy.ungroup': (state, { nodeId } = {}) => commit(
    state,
    { type: 'hierarchy.ungroup', payload: { nodeId: nodeId ?? state.selection.primaryId } },
    (draft) => {
      const page = requirePage(draft);
      const targetId = nodeId ?? draft.selection.primaryId;
      if (!targetId) throw new Error('Ungroup requires a selected group');

      const group = getNode(page, targetId);
      if (!group) throw new Error(`Node not found: ${targetId}`);
      if (group.type !== 'group') throw new Error('Ungroup requires a GROUP node');
      if (group.locked) throw new Error(`Node is locked: ${targetId}`);
      if (!group.parentId) throw new Error('Group has no parent');

      const parent = getNode(page, group.parentId);
      if (!parent) throw new Error('Group parent not found');

      const childIds = [...group.children];
      const children = childIds.map((childId) => {
        const child = getNode(page, childId);
        if (!child) throw new Error(`Node not found: ${childId}`);
        if (child.locked) throw new Error(`Node is locked: ${childId}`);
        return child;
      });

      const groupIndex = parent.children.indexOf(group.id);
      if (groupIndex < 0) throw new Error('Group is not present in its parent');

      parent.children = parent.children.filter((id) => id !== group.id);
      for (const child of children) child.parentId = parent.id;
      parent.children.splice(groupIndex, 0, ...childIds);
      delete page.nodes[group.id];

      setSelection(draft, childIds, childIds.at(-1) ?? null);
      bumpRevision(draft.document);
    }
  ),

  'hierarchy.reparent': (state, { nodeId, parentId, index } = {}) => commit(
    state,
    { type: 'hierarchy.reparent', payload: { nodeId, parentId, index } },
    (draft) => {
      const page = requirePage(draft);
      const { node } = requireNode(draft, nodeId);
      const newParent = getNode(page, parentId);
      if (!newParent || !canContain(newParent, node.type)) throw new Error('Invalid reparent target');
      if (node.id === page.rootId) throw new Error('Root cannot be reparented');
      let cursor = newParent;
      while (cursor) {
        if (cursor.id === node.id) throw new Error('Cannot reparent a node into its own descendant');
        cursor = cursor.parentId ? page.nodes[cursor.parentId] : null;
      }
      removeFromParent(page, nodeId);
      node.parentId = newParent.id;
      insertChild(newParent, nodeId, index);
      bumpRevision(draft.document);
    }
  ),

  'hierarchy.reorder': (state, { nodeId, index } = {}) => commit(
    state,
    { type: 'hierarchy.reorder', payload: { nodeId, index } },
    (draft) => {
      const page = requirePage(draft);
      const { node } = requireNode(draft, nodeId);
      if (!node.parentId) throw new Error('Node has no reorderable parent');
      const parent = getNode(page, node.parentId);
      if (!parent) throw new Error('Parent not found');
      removeFromParent(page, nodeId);
      insertChild(parent, nodeId, index);
      bumpRevision(draft.document);
    }
  ),

  'history.undo': (state) => {
    const entry = state.history.past.pop();
    if (!entry) return state;
    state.history.future.push(entry);
    state.document = cloneDocument(entry.before);
    state.persistence.dirty = true;
    return state;
  },

  'history.redo': (state) => {
    const entry = state.history.future.pop();
    if (!entry) return state;
    state.history.past.push(entry);
    state.document = cloneDocument(entry.after);
    state.persistence.dirty = true;
    return state;
  }
});

export function beginTransaction(state, label = 'Transaction') {
  if (state.history.transaction) throw new Error('A history transaction is already active');
  state.history.transaction = {
    label,
    before: snapshot(state),
    actions: [],
    startedAt: Date.now()
  };
  return state;
}

export function commitTransaction(state) {
  const transaction = state.history.transaction;
  if (!transaction) throw new Error('No active history transaction');
  state.history.transaction = null;
  if (!transaction.actions.length) return state;

  state.history.past.push({
    action: { type: 'transaction', label: transaction.label, actions: transaction.actions },
    before: transaction.before,
    after: cloneDocument(state.document),
    timestamp: Date.now()
  });
  if (state.history.past.length > state.history.limit) state.history.past.shift();
  state.history.future = [];
  state.persistence.dirty = true;
  state.persistence.error = null;
  return state;
}

export function rollbackTransaction(state) {
  const transaction = state.history.transaction;
  if (!transaction) throw new Error('No active history transaction');
  state.history.transaction = null;
  state.document = cloneDocument(transaction.before);
  return state;
}

export function execute(state, action) {
  if (!action || typeof action.type !== 'string') throw new Error('Invalid command');
  const handler = commands[action.type];
  if (!handler) throw new Error(`Unknown command: ${action.type}`);
  state.runtime.activeCommand = action.type;
  try {
    const result = handler(state, action.payload ?? {});
    assertValidEditorDocument(state.document);
    state.runtime.activeCommand = null;
    return result;
  } catch (error) {
    state.runtime.activeCommand = null;
    state.runtime.lastError = error instanceof Error ? error.message : String(error);
    throw error;
  }
}

export function executeBatch(state, actions, { label = 'Batch', atomic = true } = {}) {
  if (!Array.isArray(actions)) throw new Error('actions must be an array');
  if (state.history.transaction) throw new Error('A history transaction is already active');

  const before = snapshot(state);
  const historyStart = state.history.past.length;
  const transaction = {
    label,
    before,
    actions: [],
    startedAt: Date.now()
  };
  state.history.transaction = transaction;

  try {
    for (const action of actions) {
      execute(state, action);
      if (state.history.past.length > historyStart) {
        state.history.past.splice(historyStart);
      }
    }

    state.history.transaction = null;
    state.history.past.splice(historyStart);

    if (transaction.actions.length) {
      state.history.past.push({
        action: { type: 'transaction', label: transaction.label, actions: transaction.actions },
        before: transaction.before,
        after: cloneDocument(state.document),
        timestamp: Date.now()
      });
      if (state.history.past.length > state.history.limit) state.history.past.shift();
      state.history.future = [];
      state.persistence.dirty = true;
      state.persistence.error = null;
    }

    return state;
  } catch (error) {
    state.history.transaction = null;
    if (atomic) {
      state.document = cloneDocument(before);
      state.history.past.splice(historyStart);
      state.history.future = [];
      state.persistence.dirty = true;
    }
    throw error;
  }
}
