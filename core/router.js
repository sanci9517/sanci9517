import { config } from './config.js';
import { getPageByPath } from '../data/pages.js';

const routes = new Map();

export function registerRoute(path, render) {
  if (!path.startsWith('/')) throw new Error(`Invalid route: ${path}`);
  if (typeof render !== 'function') throw new TypeError(`Invalid renderer for: ${path}`);
  routes.set(normalizeRoutePath(path), render);
}

export function resolveRoute(path = window.location.pathname) {
  return routes.get(getRoutePath(path)) || null;
}

export function resolvePage(path = window.location.pathname) {
  return getPageByPath(getRoutePath(path));
}

export function navigate(path) {
  const target = sitePath(path);
  if (window.location.pathname !== target) window.history.pushState({}, '', target);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export function initRouter(onRouteChange) {
  window.addEventListener('popstate', onRouteChange);
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[data-route]');
    if (!link || event.defaultPrevented || event.button !== 0) return;
    if (link.target === '_blank' || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    navigate(link.getAttribute('href'));
  });
}

export function sitePath(path = '/') {
  const clean = normalizePath(path);
  const base = normalizePath(config.basePath);
  if (clean === base || clean.startsWith(`${base}/`)) return clean === base ? `${base}/` : clean;
  const route = normalizeRoutePath(clean);
  return route === '/' ? `${base}/` : `${base}${route}`;
}

function getRoutePath(path) {
  const clean = normalizePath(path);
  const base = normalizePath(config.basePath);
  if (clean === base) return '/';
  if (clean.startsWith(`${base}/`)) return normalizeRoutePath(clean.slice(base.length));
  return normalizeRoutePath(clean);
}

function normalizeRoutePath(path) {
  const clean = String(path || '/').split('?')[0].split('#')[0];
  return clean.replace(/\/+$/, '') || '/';
}

function normalizePath(path) {
  return normalizeRoutePath(path);
}
