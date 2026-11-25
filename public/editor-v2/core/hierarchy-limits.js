// Recursive Editor consumers (notably the layer tree) require a bounded page
// model depth. Keep the client and Worker Publish validator on one contract.
export const MAX_PAGE_HIERARCHY_DEPTH = 128;
// Limit per-page work before validators, the layers tree, or renderers traverse
// user-controlled node maps. Count in bounded O(limit) time without allocating
// an Object.keys array for an oversized persisted document.
export const MAX_PAGE_NODE_COUNT = 1000;

export function hasExcessPageNodes(nodes) {
  if (!nodes || typeof nodes !== 'object' || Array.isArray(nodes)) return false;
  let count = 0;
  for (const nodeId in nodes) {
    if (Object.prototype.hasOwnProperty.call(nodes, nodeId) && ++count > MAX_PAGE_NODE_COUNT) return true;
  }
  return false;
}
