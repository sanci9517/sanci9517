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
        <h1>Biztonságos belépés</h1>
        <p>Az admin felület csak a szerver által hitelesített tulajdonosi fiókkal érhető el.</p>
        <form data-admin-login>
          <label>Felhasználónév<input name="username" type="text" autocomplete="username" required></label>
          <label>Jelszó<input name="password" type="password" autocomplete="current-password" required></label>
          <button class="button button-primary" type="submit">Belépés</button>
          <p class="admin-login-error" data-admin-login-error hidden></p>
        </form>
      </main>
    </div>
  `;

  const form = root.querySelector('[data-admin-login]');
  const error = root.querySelector('[data-admin-login-error]');
  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);
    const username = String(formData.get('username') || '').trim();
    const password = String(formData.get('password') || '');
    if (button) button.disabled = true;
    if (error) { error.hidden = true; error.textContent = ''; }

    const result = await loginAdmin(username, password);
    if (!result.ok) {
      if (error) { error.textContent = result.error; error.hidden = false; }
      if (button) button.disabled = false;
      return;
    }
    renderAdmin(root);
  });
}
