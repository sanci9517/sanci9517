import { pages } from '../data/pages.js';
import { storage } from './storage.js';

const PAGES_KEY = 'page-settings';

export function getPages() {
  const saved = storage.get(PAGES_KEY, []);
  return Array.isArray(saved) ? saved : [];
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

export function syncPagesFromNavigation(items) {
  const current = getPages();
  const byPath = new Map(current.map((page) => [normalizePath(page.path), page]));
  const next = [];

  for (const item of items) {
    if (item?.type !== 'route' || item?.path === '/') continue;
    const path = normalizePath(item.path);
    if (!path || path === '/') continue;

    const existing = byPath.get(path);
    next.push(existing || {
      id: createPageId(path),
      path,
      title: String(item.label || 'Új oldal').trim() || 'Új oldal',
      status: 'active',
      menu: true,
      content: '',
    });
  }

  return savePages(next);
}

function createPageId(path) {
  return `page-${normalizePath(path).slice(1).replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '') || 'new'}`;
}

function normalizePath(path) {
  const clean = String(path || '/').split('?')[0].split('#')[0].trim();
  if (!clean) return '/';
  const withSlash = clean.startsWith('/') ? clean : `/${clean}`;
  return withSlash.replace(/\/+$/, '') || '/';
}
