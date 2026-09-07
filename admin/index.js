import { checkAdminSession, loginAdmin } from './auth.js';
import { getAdminSettings } from './backend.js';
import { hydrateAdminStorage } from '../core/storage.js';
import { renderAdminDashboard } from './dashboard.js';

const ADMIN_STYLESHEET_ID = 'sanci-admin-styles';
const ADMIN_SYNC_STATUS_ID = 'sanci-admin-sync-status';

export function renderAdmin(root) {
  ensureAdminStyles();
  ensureAdminSyncStatus();
  renderAdminLoading(root);
  checkAdminSession().then(async (session) => {
    if (!session.authenticated) {
      renderAdminLogin(root);
      return;
    }
    document.body.dataset.adminAuthenticated = 'true';
    try {
      const remote = await getAdminSettings();
      hydrateAdminStorage(remote.settings || {});
    } catch (error) {
      console.warn('[Sanci9517] Admin state hydration failed:', error);
    }
    renderAdminDashboard(root);
  });
}

function ensureAdminStyles() {
  if (document.getElementById(ADMIN_STYLESHEET_ID)) return;
  const stylesheet = document.createElement('link');
  stylesheet.id = ADMIN_STYLESHEET_ID;
  stylesheet.rel = 'stylesheet';
  stylesheet.href = 'styles/admin.css';
  document.head.appendChild(stylesheet);
}

function ensureAdminSyncStatus() {
  let status = document.getElementById(ADMIN_SYNC_STATUS_ID);
  if (status) return status;
  status = document.createElement('div');
  status.id = ADMIN_SYNC_STATUS_ID;
  status.className = 'admin-sync-status';
  status.hidden = true;
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  document.body.appendChild(status);
  window.addEventListener('sanci:remote-save', (event) => {
    const detail = event.detail || {};
    if (detail.status === 'saving') {
      status.hidden = false;
      status.dataset.state = 'saving';
      status.textContent = 'Mentés a szerverre…';
      return;
    }
    status.hidden = false;
    status.dataset.state = detail.status;
    status.textContent = detail.status === 'saved'
      ? 'Szerverre mentve ✓'
      : `Szervermentés sikertelen: ${detail.error || 'ismeretlen hiba'}`;
    if (detail.status === 'saved') window.setTimeout(() => { status.hidden = true; }, 2200);
  });
  return status;
}

function renderAdminLoading(root) {
  root.innerHTML = `
    <div class="admin-page admin-login-page">
      <main class="admin-login-card">
        <span class="admin-kicker">Admin</span>
        <h1>Hitelesítés</h1>
        <p>A szerver ellenőrzi az admin munkamenetet…</p>
      </main>
    </div>
  `;
}

function renderAdminLogin(root) {
  document.body.dataset.adminAuthenticated = 'false';
  const syncStatus = document.getElementById(ADMIN_SYNC_STATUS_ID);
  if (syncStatus) syncStatus.hidden = true;
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
    document.body.dataset.adminAuthenticated = 'true';
    try {
      const remote = await getAdminSettings();
      hydrateAdminStorage(remote.settings || {});
    } catch (hydrationError) {
      console.warn('[Sanci9517] Admin state hydration failed after login:', hydrationError);
    }
    renderAdminDashboard(root);
  });
}
