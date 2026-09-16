/*
 * Sanci9517 Visual Editor v2 — canonical validation helpers.
 *
 * Validation is shared by the UI, persistence layer and future AI command layer.
 * A document must be structurally valid before it may be saved or published.
 */

import { getNode, validateDocument } from './schema.js';

export function findReachableNodeIds(page) {
  const reachable = new Set();
  if (!page?.rootId || !page.nodes?.[page.rootId]) return reachable;

  const visit = (nodeId) => {
    if (reachable.has(nodeId)) return;
    reachable.add(nodeId);
    for (const childId of page.nodes[nodeId]?.children ?? []) visit(childId);
  };

  visit(page.rootId);
  return reachable;
}

export function validateHierarchy(page) {
  const errors = [];
  if (!page) return ['page is required'];

  const visiting = new Set();
  const visited = new Set();

  const walk = (nodeId) => {
    if (visiting.has(nodeId)) {
      errors.push(`cycle detected at node: ${nodeId}`);
      return;
    }
    if (visited.has(nodeId)) return;

    const node = getNode(page, nodeId);
    if (!node) {
      errors.push(`missing node: ${nodeId}`);
      return;
    }

    visiting.add(nodeId);
    for (const childId of node.children ?? []) {
      const child = getNode(page, childId);
      if (!child) {
        errors.push(`missing child ${childId} referenced by ${nodeId}`);
        continue;
      }
      if (child.parentId !== nodeId) {
        errors.push(`parent mismatch: ${childId} declares ${child.parentId}, expected ${nodeId}`);
      }
      walk(childId);
    }
    visiting.delete(nodeId);
    visited.add(nodeId);
  };

  walk(page.rootId);

  for (const [nodeId, node] of Object.entries(page.nodes ?? {})) {
    if (!visited.has(nodeId)) {
      errors.push(`orphan node: ${nodeId}`);
    }
    if (nodeId === page.rootId && node.parentId !== null) {
      errors.push('root parentId must be null');
    }
    if (nodeId !== page.rootId && !node.parentId) {
      errors.push(`non-root node has no parent: ${nodeId}`);
    }
  }

  return errors;
}

export function validateEditorDocument(document) {
  const errors = validateDocument(document);
  for (const page of Object.values(document?.pages ?? {})) {
    errors.push(...validateHierarchy(page).map((error) => `page ${page.id}: ${error}`));
  }
  return [...new Set(errors)];
}

export function assertValidEditorDocument(document) {
  const errors = validateEditorDocument(document);
  if (errors.length) {
    throw new Error(`Invalid editor document: ${errors.join('; ')}`);
  }
  return document;
}
