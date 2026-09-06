import { isAdminAuthenticated } from './auth.js';
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
        <p>Az admin felület alapja elkészült. A valódi szerveroldali hitelesítés a következő biztonsági lépésben készül el.</p>
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
        </form>
        <p class="admin-login-note">Ideiglenes fejlesztési belépés: bármilyen kitöltött adatok elfogadottak.</p>
      </main>
    </div>
  `;

  root.querySelector('[data-admin-login]')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const { loginAdmin } = await import('./auth.js');
    const form = new FormData(event.currentTarget);
    loginAdmin(form.get('username'), form.get('password'));
    renderAdmin(root);
  });
}
