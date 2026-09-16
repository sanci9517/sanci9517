/* Sanci9517 Visual Editor v2 — isolated editor state. */

import { cloneDocument, createDocument, getPage } from './schema.js';
import { assertValidEditorDocument } from './validation.js';

export function createEditorState(document = createDocument()) {
  assertValidEditorDocument(document);

  return {
    document: cloneDocument(document),
    selection: { ids: [], primaryId: null },
    viewport: { device: 'desktop', zoom: 1 },
    history: { past: [], future: [], limit: 100 },
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
  const valid = [...new Set(ids)].filter((id) => Boolean(page?.nodes?.[id]));
  state.selection = {
    ids: valid,
    primaryId: valid.includes(primaryId) ? primaryId : (valid.at(-1) ?? null)
  };
}

export function clearSelection(state) {
  state.selection = { ids: [], primaryId: null };
}
