import {validateAccessibility} from './accessibility.js';
/*
 * Sanci9517 Visual Editor v2 — canonical validation helpers.
 *
 * Validation is shared by the UI, persistence layer and future AI command layer.
 * A document must be structurally valid before it may be saved or published.
 */

import { getNode, validateDocument, normalizeRichText } from './schema.js';
import { validateElementContent as validateStructuredContent,isStructuredType } from './element-content.js?v=20261124-d06-accordion-accessible-group-v1';
import { validateElementContent as validateAuthoredContent } from './authored-content.js?v=20261125-d06-media-reduced-motion-v1';
import {validateStateStyles} from './state-styles.js';
import {MAX_PAGE_HIERARCHY_DEPTH} from './hierarchy-limits.js?v=20261120-d03-tooltip-viewport-bounds-v1';

export function findReachableNodeIds(page) {
  const reachable = new Set();
  if (typeof page?.rootId !== 'string' || !getNode(page, page.rootId)) return reachable;
  // Persisted Page Models are untrusted input. Keep the walk iterative so an
  // unusually deep but otherwise readable tree cannot exhaust the JS stack.
  const pending = [page.rootId];
  while (pending.length) {
    const nodeId = pending.pop();
    if (typeof nodeId !== 'string' || !nodeId || reachable.has(nodeId)) continue;
    const node = getNode(page, nodeId);
    if (!node) continue;
    reachable.add(nodeId);
    const children = Array.isArray(node.children) ? node.children : [];
    // Reverse-push to preserve the recursive walk's insertion order.
    for (let index = children.length - 1; index >= 0; index--) pending.push(children[index]);
  }
  return reachable;
}

// The Editor's layer tree and mutation helpers are intentionally recursive.
// Reject persisted trees before they reach those consumers while allowing
// comfortably more nesting than real page layouts need.
export function validateHierarchy(page) {
  const errors = [];
  if (!page) return ['page is required'];

  const visiting = new Set();
  const visited = new Set();

  let depthErrorReported = false;
  const stack = [{ nodeId: page.rootId, depth: 0, entered: false }];
  while (stack.length) {
    const frame = stack[stack.length - 1];
    const { nodeId } = frame;

    if (!frame.entered) {
      if (typeof nodeId !== 'string' || !nodeId) {
        errors.push('invalid node id in hierarchy');
        stack.pop();
        continue;
      }
      if (visiting.has(nodeId)) {
        errors.push(`cycle detected at node: ${nodeId}`);
        stack.pop();
        continue;
      }
      if (visited.has(nodeId)) {
        stack.pop();
        continue;
      }

      const node = getNode(page, nodeId);
      if (!node) {
        errors.push(`missing node: ${nodeId}`);
        stack.pop();
        continue;
      }

      frame.entered = true;
      frame.children = Array.isArray(node.children) ? node.children : [];
      frame.childIndex = 0;
      frame.siblingIds = new Set();
      visiting.add(nodeId);
      if (frame.depth > MAX_PAGE_HIERARCHY_DEPTH && !depthErrorReported) {
        errors.push(`maximum hierarchy depth exceeded (${MAX_PAGE_HIERARCHY_DEPTH})`);
        depthErrorReported = true;
      }
      if (!Array.isArray(node.children)) errors.push(`invalid children collection at node: ${nodeId}`);
      continue;
    }

    if (frame.childIndex >= frame.children.length) {
      visiting.delete(nodeId);
      visited.add(nodeId);
      stack.pop();
      continue;
    }

    const childId = frame.children[frame.childIndex++];
    if (typeof childId !== 'string' || !childId) {
      errors.push(`invalid child id at node: ${nodeId}`);
      continue;
    }
    if (frame.siblingIds.has(childId)) {
      errors.push(`duplicate child id at node: ${nodeId}`);
      continue;
    }
    frame.siblingIds.add(childId);
    const child = getNode(page, childId);
    if (!child) {
      errors.push(`missing child ${childId} referenced by ${nodeId}`);
      continue;
    }
    if (child.parentId !== nodeId) {
      const declaredParent = typeof child.parentId === 'string' ? child.parentId : '[invalid parent id]';
      errors.push(`parent mismatch: ${childId} declares ${declaredParent}, expected ${nodeId}`);
    }
    stack.push({ nodeId: childId, depth: frame.depth + 1, entered: false });
  }

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

export function validateEditorDocument(document,{allowInvalidPageInteractions=false}={}) {
  const pageErrors = validateDocument(document);
  // Persisted page actions can become unsupported after a schema/registry
  // upgrade. The Editor may opt into loading them for recovery, but all
  // commands, persistence and publication use the strict default.
  const errors = allowInvalidPageInteractions
    ? pageErrors.filter(error => !/: invalid page interaction: /.test(error))
    : pageErrors;
  for (const [pageKey, page] of Object.entries(document?.pages ?? {})) {
    const pageId=typeof page?.id==='string'&&page.id?page.id:pageKey;
    errors.push(...validateHierarchy(page).map((error) => `page ${pageId}: ${error}`));
    if(!page||typeof page!=='object'||Array.isArray(page))continue;
    for (const node of Object.values(page.nodes ?? {})) errors.push(...validateRichTextNode(node).map((error) => `page ${pageId}: ${error}`));
  }
  return [...new Set(errors)];
}

export function assertValidEditorDocument(document,{allowInvalidAuthoredContent=false,allowInvalidPageInteractions=false}={}) {
  for(const page of Object.values(document?.pages||{})){
    if(!page||typeof page!=='object'||Array.isArray(page))continue;
    validateAccessibility(page);
    for(const node of Object.values(page.nodes||{})){
      // Let validateEditorDocument report malformed persisted records through
      // the normal validation path instead of throwing while inspecting them.
      if(!node||typeof node!=='object'||Array.isArray(node))continue;
      if(node.metadata?.structuredContentVersion===1&&isStructuredType(node.type))validateStructuredContent(node.type,node.props?.contentModel);
      if(!allowInvalidAuthoredContent)validateAuthoredContent(node);
      validateStateStyles(node);
    }
  }
  const errors = validateEditorDocument(document,{allowInvalidPageInteractions});
  if (errors.length) {
    throw new Error(`Invalid editor document: ${errors.join('; ')}`);
  }
  return document;
}
