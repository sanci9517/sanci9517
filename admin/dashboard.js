import { logoutAdmin } from './auth.js';

export function renderAdminDashboard(root) {
  root.innerHTML = `
    <div class="admin-page">
      <header class="admin-header">
        <div>
          <span class="admin-kicker">Admin</span>
          <h1>Vezérlőpult</h1>
          <p>A weboldal kezelési felülete.</p>
        </div>
        <button class="button button-secondary" type="button" data-admin-logout>Kijelentkezés</button>
      </header>

      <main class="admin-content">
        <section class="admin-card">
          <span class="admin-card-label">Rendszer</span>
          <h2>Admin alapok elkészültek</h2>
          <p>A későbbi modulok innen lesznek elérhetők: weboldal, Twitch, tartalom, média és beállítások.</p>
        </section>
      </main>
    </div>
  `;

  root.querySelector('[data-admin-logout]')?.addEventListener('click', () => {
    logoutAdmin();
    window.location.href = './';
  });
}
