/*
 * Sanci9517 Visual Editor v2 — command engine.
 *
 * UI, future AI and integrations must use these structured mutations instead
 * of changing the Page Model directly. This keeps validation, history and
 * audit compatibility in one place.
 */

import {
  canContain,
  cloneDocument,
  createNode,
  getNode,
  validateDocument
} from './schema.js';
import { activePage, clearSelection, setSelection } from './state.js';

function requirePage(state) {
  const page = activePage(state);
  if (!page) throw new Error('Active page not found');
  return page;
}

function requireNode(state, nodeId) {
  const page = requirePage(state);
  const node = getNode(page, nodeId);
  if (!node) throw new Error(`Node not found: ${nodeId}`);
  if (node.locked) throw new Error(`Node is locked: ${nodeId}`);
  return { page, node };
}

function snapshot(state) {
  return cloneDocument(state.document);
}

function record(state, before, action) {
  state.history.past.push({
    action,
    before,
    after: cloneDocument(state.document),
    timestamp: Date.now()
  });
  if (state.history.past.length > state.history.limit) state.history.past.shift();
  state.history.future = [];
  state.persistence.dirty = true;
  state.runtime.lastError = null;
}

function commit(state, action, mutate) {
  const before = snapshot(state);
  mutate(state);
  const errors = validateDocument(state.document);
  if (errors.length) {
    state.document = before;
    throw new Error(`Command rejected: ${errors.join('; ')}`);
  }
  record(state, before, action);
  return state;
}

export const commands = Object.freeze({
  'selection.set': (state, { ids, primaryId }) => {
    setSelection(state, ids ?? [], primaryId ?? ids?.at(-1) ?? null);
    return state;
  },

  'selection.clear': (state) => {
    clearSelection(state);
    return state;
  },

  'element.add': (state, { type, parentId, props = {}, name } = {}) => commit(
    state,
    { type: 'element.add', payload: { type, parentId } },
    (draft) => {
      const page = requirePage(draft);
      const parent = getNode(page, parentId ?? page.rootId);
      if (!parent || !canContain(parent, type)) throw new Error('Invalid parent for element');

      const node = createNode(type, { props, name: name ?? type, parentId: parent.id });
      page.nodes[node.id] = node;
      parent.children.push(node.id);
      setSelection(draft, [node.id], node.id);
    }
  ),

  'element.update': (state, { nodeId, patch = {} } = {}) => commit(
    state,
    { type: 'element.update', payload: { nodeId, patch } },
    (draft) => {
      const { node } = requireNode(draft, nodeId);
      Object.assign(node, patch);
      node.id = nodeId;
    }
  ),

  'element.content.set': (state, { nodeId, content = '' } = {}) => commit(
    state,
    { type: 'element.content.set', payload: { nodeId } },
    (draft) => {
      const { node } = requireNode(draft, nodeId);
      node.props = { ...node.props, content };
    }
  ),

  'element.delete': (state, { nodeId } = {}) => commit(
    state,
    { type: 'element.delete', payload: { nodeId } },
    (draft) => {
      const page = requirePage(draft);
      const { node } = requireNode(draft, nodeId);
      if (node.id === page.rootId) throw new Error('Root cannot be deleted');

      const descendants = new Set();
      const visit = (id) => {
        descendants.add(id);
        for (const childId of page.nodes[id]?.children ?? []) visit(childId);
      };
      visit(nodeId);

      if (node.parentId) {
        const parent = page.nodes[node.parentId];
        parent.children = parent.children.filter((id) => id !== nodeId);
      }
      for (const id of descendants) delete page.nodes[id];

      draft.selection.ids = draft.selection.ids.filter((id) => !descendants.has(id));
      if (descendants.has(draft.selection.primaryId)) draft.selection.primaryId = draft.selection.ids.at(-1) ?? null;
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

      const oldParent = node.parentId ? page.nodes[node.parentId] : null;
      if (oldParent) oldParent.children = oldParent.children.filter((id) => id !== nodeId);

      node.parentId = newParent.id;
      const safeIndex = Number.isInteger(index)
        ? Math.max(0, Math.min(index, newParent.children.length))
        : newParent.children.length;
      newParent.children.splice(safeIndex, 0, nodeId);
    }
  ),

  'history.undo': (state) => {
    const entry = state.history.past.pop();
    if (!entry) return state;
    state.history.future.push({ ...entry, before: entry.after, after: entry.before });
    state.document = cloneDocument(entry.before);
    state.persistence.dirty = true;
    return state;
  },

  'history.redo': (state) => {
    const entry = state.history.future.pop();
    if (!entry) return state;
    state.history.past.push({ ...entry, before: entry.after, after: entry.before });
    state.document = cloneDocument(entry.after);
    state.persistence.dirty = true;
    return state;
  }
});

export function execute(state, action) {
  if (!action || typeof action.type !== 'string') throw new Error('Invalid command');
  const handler = commands[action.type];
  if (!handler) throw new Error(`Unknown command: ${action.type}`);

  state.runtime.activeCommand = action.type;
  try {
    const result = handler(state, action.payload ?? {});
    state.runtime.activeCommand = null;
    return result;
  } catch (error) {
    state.runtime.activeCommand = null;
    state.runtime.lastError = error instanceof Error ? error.message : String(error);
    throw error;
  }
}
