const routes = new Map();

export function registerRoute(path, render) {
  if (!path.startsWith('/')) throw new Error(`Invalid route: ${path}`);
  if (typeof render !== 'function') throw new TypeError(`Invalid renderer for: ${path}`);
  routes.set(normalizePath(path), render);
}

export function resolveRoute(path = window.location.pathname) {
  return routes.get(normalizePath(path)) || null;
}

export function navigate(path) {
  const target = normalizePath(path);
  if (window.location.pathname !== target) {
    window.history.pushState({}, '', target);
  }
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

function normalizePath(path) {
  const clean = String(path || '/').split('?')[0].split('#')[0];
  return clean.replace(/\/+$/, '') || '/';
}
