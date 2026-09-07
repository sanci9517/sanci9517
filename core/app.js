import { renderHome } from '../pages/home.js';
import { renderGenericPage } from '../pages/generic.js';
import { renderAdmin } from '../admin/index.js';
import { registerRoute, resolveRoute, initRouter } from './router.js';
import { initNavigation } from '../components/navigation.js';
import { showError } from './ui.js';
import { getSite } from './site-state.js';
import { getNavigation } from './navigation-state.js';
import { getPageByPath } from './page-state.js';
import { config } from './config.js';

registerRoute('/', renderHome);
registerRoute('/admin', renderAdmin);

function renderCurrentRoute() {
  const app = document.querySelector('#app');
  if (!app) return;

  const renderer = resolveRoute();
  const site = getSite();

  if (renderer) {
    try {
      renderer(app, site);
    } catch (error) {
      console.error('[Sanci9517] Render error:', error);
      showError(app, 'Az oldal betöltése sikertelen.');
    }
    return;
  }

  const path = getCurrentRoutePath();
  const item = getNavigation().find((entry) => entry.type === 'route' && normalizePath(entry.path) === path && entry.enabled !== false);
  const page = getPageByPath(path);

  if (item || page) {
    renderGenericPage(app, site, {
      ...(page || {}),
      title: page?.title || item?.label || 'Új oldal',
      path,
    });
    return;
  }

  showError(app, 'Az oldal nem található.');
}

function getCurrentRoutePath() {
  const pathname = normalizePath(window.location.pathname);
  const base = normalizePath(config.basePath);
  if (pathname === base) return '/';
  if (pathname.startsWith(`${base}/`)) return normalizePath(pathname.slice(base.length));
  return pathname;
}

function normalizePath(path) {
  const clean = String(path || '/').split('?')[0].split('#')[0];
  return clean.replace(/\/+$/, '') || '/';
}

function boot() {
  initRouter(renderCurrentRoute);
  initNavigation();
  renderCurrentRoute();
}

window.addEventListener('DOMContentLoaded', boot, { once: true });
