import { pages } from '../data/pages.js';
import { storage } from './storage.js';

const PAGES_KEY = 'page-settings';

export function getPages() {
  const saved = storage.get(PAGES_KEY, null);
  if (Array.isArray(saved)) return ensureExistingPages(saved);
  return pages.filter((page) => page.status === 'active').map(normalizePage);
}

export function getPageById(id) {
  return getPages().find((page) => page.id === id) || null;
}

export function getPageByPath(path) {
  const clean = normalizePath(path);
  return getPages().find((page) => normalizePath(page.path) === clean) || null;
}

export function savePages(nextPages) {
  if (!Array.isArray(nextPages)) return false;
  return storage.set(PAGES_KEY, nextPages.map(normalizePage));
}

export function syncPagesFromNavigation(items) {
  const current = getPages();
  const byPath = new Map(current.map((page) => [normalizePath(page.path), page]));
  const next = [];
  const home = byPath.get('/') || pages.find((page) => page.path === '/' && page.status === 'active');
  if (home) next.push(normalizePage(home));

  for (const item of items) {
    if (item?.type !== 'route' || item?.path === '/') continue;
    const path = normalizePath(item.path);
    if (!path || path === '/') continue;
    const existing = byPath.get(path);
    next.push(existing ? normalizePage(existing) : normalizePage({
      id: createPageId(path), path,
      title: String(item.label || 'Új oldal').trim() || 'Új oldal',
      status: 'active', menu: true, content: '', blocks: [],
    }));
  }
  return savePages(next);
}

function ensureExistingPages(saved) {
  const normalized = saved.map(normalizePage);
  if (normalized.some((page) => normalizePath(page?.path) === '/')) return normalized;
  const home = pages.find((page) => page.path === '/' && page.status === 'active');
  return home ? [normalizePage(home), ...normalized] : normalized;
}

function normalizePage(page) {
  return { ...page, content: page?.content || '', blocks: Array.isArray(page?.blocks) ? page.blocks.map(normalizeBlock) : [] };
}

function normalizeBlock(block) {
  return { id: String(block?.id || createBlockId()), title: String(block?.title || ''), content: String(block?.content || '') };
}

function createPageId(path) {
  return `page-${normalizePath(path).slice(1).replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '') || 'new'}`;
}

function createBlockId() {
  return `block-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizePath(path) {
  const clean = String(path || '/').split('?')[0].split('#')[0].trim();
  if (!clean) return '/';
  const withSlash = clean.startsWith('/') ? clean : `/${clean}`;
  return withSlash.replace(/\/+$/, '') || '/';
}
