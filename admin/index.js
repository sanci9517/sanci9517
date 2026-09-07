import { isAdminAuthenticated, loginAdmin } from './auth.js';
import { renderAdminDashboard } from './dashboard.js';

const ADMIN_STYLESHEET_ID = 'sanci-admin-styles';

export function renderAdmin(root) {
  ensureAdminStyles();

  if (!isAdminAuthenticated()) {
    renderAdminLogin(root);
    return;
  }

  renderAdminDashboard(root);
}

function ensureAdminStyles() {
  if (document.getElementById(ADMIN_STYLESHEET_ID)) return;

  const stylesheet = document.createElement('link');
  stylesheet.id = ADMIN_STYLESHEET_ID;
  stylesheet.rel = 'stylesheet';
  stylesheet.href = 'styles/admin.css';
  document.head.appendChild(stylesheet);
}

function renderAdminLogin(root) {
  root.innerHTML = `
    <div class="admin-page admin-login-page">
      <main class="admin-login-card">
        <span class="admin-kicker">Admin</span>
        <h1>Belépés</h1>
        <p>Az admin felület jelenleg fejlesztési módban működik.</p>
        <form data-admin-login>
          <label>
            Felhasználónév
            <input name="username" type="text" autocomplete="username" required>
          </label>
          <label>
            Jelszó
            <input name="password" type="password" autocomplete="current-password" required>
          </label>
          <button class="button button-primary" type="submit">Belépés</button>
          <p class="admin-login-error" data-admin-login-error hidden></p>
        </form>
      </main>
    </div>
  `;

  const form = root.querySelector('[data-admin-login]');
  const error = root.querySelector('[data-admin-login-error]');

  form?.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const username = String(formData.get('username') || '').trim();
    const password = String(formData.get('password') || '');

    if (!loginAdmin(username, password)) {
      if (error) {
        error.textContent = 'Add meg a felhasználónevet és a jelszót.';
        error.hidden = false;
      }
      return;
    }

    renderAdmin(root);
  });
}
