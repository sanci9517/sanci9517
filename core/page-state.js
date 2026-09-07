import { pages } from '../data/pages.js';
import { storage } from './storage.js';

const PAGES_KEY = 'page-settings';
const BLOCK_TYPES = new Set(['text', 'game', 'twitch', 'image', 'link', 'stats']);
const ELEMENT_ALIGNS = new Set(['left', 'center', 'right']);
const ELEMENT_WIDTHS = new Set(['full', 'half', 'third', 'quarter', 'auto']);
const BLOCK_WIDTHS = new Set(['full', 'half', 'third', 'quarter', 'auto']);

export function getPages() {
  const saved = storage.get(PAGES_KEY, null);
  if (Array.isArray(saved)) return ensureExistingPages(saved);
  return pages.filter((page) => page.status === 'active').map(normalizePage);
}

export function getPageById(id) { return getPages().find((page) => page.id === id) || null; }
export function getPageByPath(path) { const clean = normalizePath(path); return getPages().find((page) => normalizePath(page.path) === clean) || null; }
export function savePages(nextPages) { if (!Array.isArray(nextPages)) return false; return storage.set(PAGES_KEY, normalizePages(nextPages)); }

export function syncPagesFromNavigation(items) {
  const current = getPages();
  const byPath = new Map(current.map((page) => [normalizePath(page.path), page]));
  const next = current.map(normalizePage);
  const nextPaths = new Set(next.map((page) => normalizePath(page.path)));

  const home = byPath.get('/') || pages.find((page) => page.path === '/' && page.status === 'active');
  if (home && !nextPaths.has('/')) {
    next.unshift(normalizePage(home));
    nextPaths.add('/');
  }

  for (const item of Array.isArray(items) ? items : []) {
    if (item?.type !== 'route') continue;
    const path = normalizePath(item.path);
    if (!path) continue;

    const existing = byPath.get(path);
    if (existing) continue;

    next.push(normalizePage({
      id: createUniquePageId(path, next),
      path,
      title: String(item.label || 'Új oldal').trim() || 'Új oldal',
      status: 'active',
      menu: item.enabled !== false,
      content: '',
      blocks: [],
    }));
    nextPaths.add(path);
  }

  return savePages(next);
}

export function createPage(page = {}) {
  const current = getPages();
  const path = normalizePath(page.path || '/uj-oldal');
  if (current.some((item) => normalizePath(item.path) === path)) return getPageByPath(path);
  const created = normalizePage({
    id: createUniquePageId(path, current),
    path,
    title: String(page.title || 'Új oldal').trim() || 'Új oldal',
    status: 'active',
    menu: page.menu !== false,
    content: '',
    blocks: [],
    ...page,
    path,
  });
  savePages([...current, created]);
  return created;
}

export function deletePage(id) {
  const current = getPages();
  if (getPageByPath('/')?.id === id) return false;
  return savePages(current.filter((page) => page.id !== id));
}

export function movePage(id, direction) {
  const current = getPages();
  const index = current.findIndex((page) => page.id === id);
  const target = index + Number(direction || 0);
  if (index < 0 || target < 0 || target >= current.length) return false;
  [current[index], current[target]] = [current[target], current[index]];
  return savePages(current);
}

function ensureExistingPages(saved) {
  const normalized = normalizePages(saved);
  if (normalized.some((page) => normalizePath(page?.path) === '/')) return normalized;
  const home = pages.find((page) => page.path === '/' && page.status === 'active');
  return home ? [normalizePage(home), ...normalized] : normalized;
}

function normalizePages(list) {
  const seenIds = new Set();
  const seenPaths = new Set();
  const result = [];

  for (const rawPage of list) {
    const page = normalizePage(rawPage);
    const path = normalizePath(page.path);
    if (seenPaths.has(path)) continue;

    let id = String(page.id || createPageId(path));
    if (seenIds.has(id)) id = createUniquePageId(path, result);

    const normalized = { ...page, id, path };
    seenIds.add(id);
    seenPaths.add(path);
    result.push(normalized);
  }

  return result;
}

function normalizePage(page) {
  const path = normalizePath(page?.path || '/');
  return {
    ...page,
    id: String(page?.id || createPageId(path)),
    path,
    title: String(page?.title || 'Új oldal'),
    status: page?.status || 'active',
    content: page?.content || '',
    blocks: Array.isArray(page?.blocks) ? page.blocks.map(normalizeBlock) : [],
  };
}

function normalizeBlock(block) {
  const type = BLOCK_TYPES.has(block?.type) ? block.type : 'text';
  const legacyElement = { id: createElementId(), type, title: String(block?.title || ''), content: String(block?.content || ''), align: 'left', width: 'full' };
  const elements = Array.isArray(block?.elements) && block.elements.length ? block.elements.map(normalizeElement) : [legacyElement];
  return {
    ...block,
    id: String(block?.id || createBlockId()),
    type,
    title: String(block?.title || ''),
    content: String(block?.content || ''),
    width: BLOCK_WIDTHS.has(block?.width) ? block.width : 'full',
    elements,
  };
}

function normalizeElement(element) {
  const type = BLOCK_TYPES.has(element?.type) ? element.type : 'text';
  return {
    ...element,
    id: String(element?.id || createElementId()),
    type,
    title: String(element?.title || ''),
    content: String(element?.content || ''),
    align: ELEMENT_ALIGNS.has(element?.align) ? element.align : 'left',
    width: ELEMENT_WIDTHS.has(element?.width) ? element.width : 'full',
  };
}

function createPageId(path) { return `page-${normalizePath(path).slice(1).replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '') || 'new'}`; }
function createUniquePageId(path, existing = []) {
  const base = createPageId(path);
  const used = new Set(existing.map((page) => String(page?.id || '')));
  if (!used.has(base)) return base;
  let index = 2;
  while (used.has(`${base}-${index}`)) index += 1;
  return `${base}-${index}`;
}
function createBlockId() { return `block-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`; }
function createElementId() { return `element-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`; }
function normalizePath(path) { const clean = String(path || '/').split('?')[0].split('#')[0].trim(); if (!clean) return '/'; const withSlash = clean.startsWith('/') ? clean : `/${clean}`; return withSlash.replace(/\/+$/, '') || '/'; }
