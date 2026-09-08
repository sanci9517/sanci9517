import { renderAdmin } from './index.js';
import { renderAdminDashboard } from './dashboard.js';

const root = document.querySelector('#app');

if (root) {
  window.__SANCI_ADMIN_NAVIGATE__ = (path) => {
    if (path === '/admin') renderAdminDashboard(root);
  };
  renderAdmin(root);
}
