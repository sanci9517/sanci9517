const FORMAT = 'sanci-editor-node-clipboard';

function selectedAncestor(page, node, selected) {
  let parentId = node?.parentId;
  while (parentId) {
    if (selected.has(parentId)) return true;
    parentId = page.nodes[parentId]?.parentId ?? null;
  }
  return false;
}

function hasLockedAncestor(page, node) {
  let current = node;
  while (current) {
    if (current.locked) return true;
    current = current.parentId ? page.nodes[current.parentId] : null;
  }
  return false;
}

/** Snapshot selected top-level subtrees for the editor's page-scoped clipboard. */
export function createNodeClipboard(page, nodeIds) {
  if (!page?.id || !page?.rootId || !page?.nodes || !Array.isArray(nodeIds)) {
    throw new Error('Érvénytelen oldal vagy kijelölés a másoláshoz.');
  }
  const selected = new Set(nodeIds.filter((id) => typeof id === 'string' && page.nodes[id]));
  if (!selected.size || selected.has(page.rootId)) throw new Error('Jelölj ki legalább egy másolható elemet.');
  if ([...selected].some((id) => hasLockedAncestor(page, page.nodes[id]))) {
    throw new Error('A zárolt vagy zárolt őselem alatti elemek nem másolhatók.');
  }

  const roots = [...selected]
    .filter((id) => !selectedAncestor(page, page.nodes[id], selected));
  if (!roots.length) throw new Error('A kijelölt elemek nem másolhatók.');

  // Follow canvas/layer order, rather than modifier-key selection order.
  const rootSet = new Set(roots);
  const orderedRoots = [];
  const visitOrder = (id) => {
    if (rootSet.has(id)) orderedRoots.push(id);
    for (const childId of page.nodes[id]?.children ?? []) visitOrder(childId);
  };
  visitOrder(page.rootId);

  const nodes = {};
  const visitSubtree = (id) => {
    if (nodes[id]) return;
    const node = page.nodes[id];
    if (!node || hasLockedAncestor(page, node)) throw new Error('A kijelölés zárolt vagy hiányzó elemet tartalmaz.');
    nodes[id] = structuredClone(node);
    for (const childId of node.children ?? []) visitSubtree(childId);
  };
  for (const id of orderedRoots) visitSubtree(id);

  return structuredClone({ format: FORMAT, version: 1, pageId: page.id, rootIds: orderedRoots, nodes });
}

export function isNodeClipboardForPage(clipboard, pageId) {
  return clipboard?.format === FORMAT && clipboard.version === 1 && clipboard.pageId === pageId &&
    Array.isArray(clipboard.rootIds) && clipboard.rootIds.length > 0 &&
    clipboard.nodes && typeof clipboard.nodes === 'object' && !Array.isArray(clipboard.nodes);
}
