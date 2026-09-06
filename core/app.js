import { site } from '../data/site.js';
import { renderHome } from '../pages/home.js';

const routes = {
  '/': renderHome
};

function getRoute() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  return routes[path] || renderHome;
}

function boot() {
  const app = document.querySelector('#app');
  if (!app) return;
  getRoute()(app, site);
}

window.addEventListener('DOMContentLoaded', boot);
window.addEventListener('popstate', boot);
