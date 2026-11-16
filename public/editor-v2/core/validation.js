import {validateAccessibility} from './accessibility.js';
/*
 * Sanci9517 Visual Editor v2 — canonical validation helpers.
 *
 * Validation is shared by the UI, persistence layer and future AI command layer.
 * A document must be structurally valid before it may be saved or published.
 */

import { getNode, validateDocument, normalizeRichText } from './schema.js';
import { validateElementContent as validateStructuredContent,isStructuredType } from './element-content.js?v=20261115-d04-tab-id-bound-v1';
import { validateElementContent as validateAuthoredContent } from './authored-content.js?v=20261116-d02-private-media-link-guard-v1';
import {validateStateStyles} from './state-styles.js';

export function findReachableNodeIds(page) {
  const reachable = new Set();
  if (typeof page?.rootId !== 'string' || !getNode(page, page.rootId)) return reachable;

  const visit = (nodeId) => {
    if (typeof nodeId !== 'string' || !nodeId) return;
    if (!getNode(page, nodeId)) return;
    if (reachable.has(nodeId)) return;
    reachable.add(nodeId);
    const children = getNode(page, nodeId)?.children;
    if (Array.isArray(children)) for (const childId of children) visit(childId);
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
    if (typeof nodeId !== 'string' || !nodeId) {
      errors.push('invalid node id in hierarchy');
      return;
    }

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
    if (!Array.isArray(node.children)) {
      errors.push(`invalid children collection at node: ${nodeId}`);
    }
    const siblingIds = new Set();
    for (const childId of Array.isArray(node.children) ? node.children : []) {
      if (typeof childId !== 'string' || !childId) {
        errors.push(`invalid child id at node: ${nodeId}`);
        continue;
      }
      if (siblingIds.has(childId)) {
        errors.push(`duplicate child id at node: ${nodeId}`);
        continue;
      }
      siblingIds.add(childId);
      const child = getNode(page, childId);
      if (!child) {
        errors.push(`missing child ${childId} referenced by ${nodeId}`);
        continue;
      }
      if (child.parentId !== nodeId) {
        const declaredParent = typeof child.parentId === 'string' ? child.parentId : '[invalid parent id]';
        errors.push(`parent mismatch: ${childId} declares ${declaredParent}, expected ${nodeId}`);
      }
      walk(childId);
    }
    visiting.delete(nodeId);
    visited.add(nodeId);
  };

  walk(page.rootId);

  for (const [nodeId, node] of Object.entries(page.nodes ?? {})) {
    if (!node || typeof node !== 'object' || Array.isArray(node)) {
      errors.push(`invalid node record: ${nodeId}`);
      continue;
    }
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

export function validateRichTextNode(node) {
  if (node?.type !== 'richtext') return [];
  try { normalizeRichText(node.props?.richText); return []; }
  catch (error) { return [`invalid richtext node ${node.id}: ${error instanceof Error ? error.message : String(error)}`]; }
}

export function validateEditorDocument(document) {
  const errors = validateDocument(document);
  for (const [pageKey, page] of Object.entries(document?.pages ?? {})) {
    const pageId=typeof page?.id==='string'&&page.id?page.id:pageKey;
    errors.push(...validateHierarchy(page).map((error) => `page ${pageId}: ${error}`));
    if(!page||typeof page!=='object'||Array.isArray(page))continue;
    for (const node of Object.values(page.nodes ?? {})) errors.push(...validateRichTextNode(node).map((error) => `page ${pageId}: ${error}`));
  }
  return [...new Set(errors)];
}

export function assertValidEditorDocument(document) {
  for(const page of Object.values(document?.pages||{})){
    if(!page||typeof page!=='object'||Array.isArray(page))continue;
    validateAccessibility(page);
    for(const node of Object.values(page.nodes||{})){
      // Let validateEditorDocument report malformed persisted records through
      // the normal validation path instead of throwing while inspecting them.
      if(!node||typeof node!=='object'||Array.isArray(node))continue;
      if(node.metadata?.structuredContentVersion===1&&isStructuredType(node.type))validateStructuredContent(node.type,node.props?.contentModel);
      validateAuthoredContent(node);
      validateStateStyles(node);
    }
  }
  const errors = validateEditorDocument(document);
  if (errors.length) {
    throw new Error(`Invalid editor document: ${errors.join('; ')}`);
  }
  return document;
}
