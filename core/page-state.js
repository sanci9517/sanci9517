import { pages } from '../data/pages.js';
import { storage } from './storage.js';

const PAGES_KEY = 'page-settings';

export function getPages() {
  const saved = storage.get(PAGES_KEY, null);
  if (!Array.isArray(saved)) return pages;

  const savedById = new Map(saved.map((page) => [page.id, page]));
  const merged = pages.map((page) => ({
    ...page,
    ...(savedById.get(page.id) || {}),
  }));

  const builtInIds = new Set(pages.map((page) => page.id));
  const customPages = saved.filter((page) => page?.id && !builtInIds.has(page.id));

  return [...merged, ...customPages];
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
  return storage.set(PAGES_KEY, nextPages);
}

function normalizePath(path) {
  const clean = String(path || '/').split('?')[0].split('#')[0].trim();
  if (!clean) return '/';
  const withSlash = clean.startsWith('/') ? clean : `/${clean}`;
  return withSlash.replace(/\/+$/, '') || '/';
}
