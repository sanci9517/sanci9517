import { site } from '../data/site.js';
import { renderHome } from '../pages/home.js';
import { registerRoute, resolveRoute, initRouter } from './router.js';
import { showError } from './ui.js';

registerRoute('/', renderHome);

function renderCurrentRoute() {
  const app = document.querySelector('#app');
  if (!app) return;

  const renderer = resolveRoute();
  if (!renderer) {
    showError(app, 'Az oldal nem található.');
    return;
  }

  try {
    renderer(app, site);
  } catch (error) {
    console.error('[Sanci9517] Render error:', error);
    showError(app, 'Az oldal betöltése sikertelen.');
  }
}

function boot() {
  initRouter(renderCurrentRoute);
  renderCurrentRoute();
}

window.addEventListener('DOMContentLoaded', boot, { once: true });
