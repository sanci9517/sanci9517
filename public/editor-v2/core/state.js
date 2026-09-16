/* Sanci9517 Visual Editor v2 — isolated editor state. */

import { cloneDocument, createDocument, getPage } from './schema.js';
import { assertValidEditorDocument } from './validation.js';

export const HISTORY_LIMIT = 100;

export function createEditorState(document = createDocument()) {
  assertValidEditorDocument(document);

  return {
    document: cloneDocument(document),
    selection: { ids: [], primaryId: null },
    viewport: { device: 'desktop', zoom: 1 },
    history: {
      past: [],
      future: [],
      limit: HISTORY_LIMIT,
      transaction: null
    },
    persistence: {
      dirty: false,
      saving: false,
      lastSavedRevision: document.revision ?? 0,
      error: null,
      conflict: null
    },
    recovery: { available: false, key: null },
    ui: { panel: 'inspector', commandPalette: false },
    runtime: { activeCommand: null, lastError: null }
  };
}

export function cloneState(state) {
  return structuredClone(state);
}

export function activePage(state) {
  return getPage(state.document, state.document.activePageId);
}

export function selectedNodes(state) {
  const page = activePage(state);
  if (!page) return [];
  return state.selection.ids.map((id) => page.nodes[id]).filter(Boolean);
}

export function setSelection(state, ids, primaryId = ids.at(-1) ?? null) {
  const page = activePage(state);
  const valid = [...new Set(Array.isArray(ids) ? ids : [])].filter((id) => Boolean(page?.nodes?.[id]));
  state.selection = {
    ids: valid,
    primaryId: valid.includes(primaryId) ? primaryId : (valid.at(-1) ?? null)
  };
}

export function clearSelection(state) {
  state.selection = { ids: [], primaryId: null };
}

export function markSaved(state, revision = state.document.revision ?? 0) {
  state.persistence.dirty = false;
  state.persistence.saving = false;
  state.persistence.error = null;
  state.persistence.lastSavedRevision = revision;
}
