import { getSite } from '../data/site.js';
import { renderHome } from '../pages/home.js';
import { renderAdmin } from '../admin/index.js';
import { registerRoute, resolveRoute, initRouter } from './router.js';
import { initNavigation } from '../components/navigation.js';
import { showError } from './ui.js';

registerRoute('/', renderHome);
registerRoute('/admin', renderAdmin);

function renderCurrentRoute() {
  const app = document.querySelector('#app');
  if (!app) return;

  const renderer = resolveRoute();
  if (!renderer) {
    showError(app, 'Az oldal nem található.');
    return;
  }

  try {
    renderer(app, getSite());
  } catch (error) {
    console.error('[Sanci9517] Render error:', error);
    showError(app, 'Az oldal betöltése sikertelen.');
  }
}

function boot() {
  initRouter(renderCurrentRoute);
  initNavigation();
  renderCurrentRoute();
}

window.addEventListener('DOMContentLoaded', boot, { once: true });
