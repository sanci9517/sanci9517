import { isAdminAuthenticated, loginAdmin } from './auth.js';
import { renderAdminDashboard } from './dashboard.js';

export function renderAdmin(root) {
  if (!isAdminAuthenticated()) {
    renderAdminLogin(root);
    return;
  }

  renderAdminDashboard(root);
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
