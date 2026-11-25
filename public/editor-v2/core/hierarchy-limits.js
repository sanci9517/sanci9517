// Recursive Editor consumers (notably the layer tree) require a bounded page
// model depth. Keep the client and Worker Publish validator on one contract.
export const MAX_PAGE_HIERARCHY_DEPTH = 128;
// Limit per-page work before validators, the layers tree, or renderers traverse
// user-controlled node maps. Count in bounded O(limit) time without allocating
// an Object.keys array for an oversized persisted document.
export const MAX_PAGE_NODE_COUNT = 1000;
// A valid rooted tree with at most MAX_PAGE_NODE_COUNT nodes has at most
// MAX_PAGE_CHILD_REFERENCE_COUNT parent-to-child edges. Bound the untrusted
// child arrays before any validator, renderer, or recovery walk expands them.
export const MAX_PAGE_CHILD_REFERENCE_COUNT = MAX_PAGE_NODE_COUNT - 1;

export function hasExcessPageNodes(nodes) {
  if (!nodes || typeof nodes !== 'object' || Array.isArray(nodes)) return false;
  let count = 0;
  for (const nodeId in nodes) {
    if (Object.prototype.hasOwnProperty.call(nodes, nodeId) && ++count > MAX_PAGE_NODE_COUNT) return true;
  }
  return false;
}

export function hasExcessPageChildReferences(nodes) {
  if (!nodes || typeof nodes !== 'object' || Array.isArray(nodes)) return false;
  let count = 0;
  for (const nodeId in nodes) {
    if (!Object.prototype.hasOwnProperty.call(nodes, nodeId)) continue;
    const node = nodes[nodeId];
    if (!node || typeof node !== 'object' || Array.isArray(node) || !Array.isArray(node.children)) continue;
    if (node.children.length > MAX_PAGE_CHILD_REFERENCE_COUNT - count) return true;
    count += node.children.length;
  }
  return false;
}
