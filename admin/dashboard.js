import { logoutAdmin } from './auth.js';
import { renderWebsiteAdmin } from './website/index.js';
import './website/layout-enhancer.js';

const adminModules = [
  { id: 'website', title: 'Weboldal', description: 'Oldalak, menü és megjelenés kezelése.', icon: '⌂' },
  { title: 'Twitch', description: 'Csatorna, élő adás és Twitch-beállítások.', icon: '◈' },
  { title: 'Tartalom', description: 'Szövegek, oldaltartalmak és frissítések.', icon: '✎' },
  { title: 'Média', description: 'Képek, videók és feltöltött anyagok kezelése.', icon: '▣' },
  { title: 'Beállítások', description: 'Rendszer- és weboldalbeállítások.', icon: '⚙' },
];

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
        <section class="admin-module-grid" aria-label="Admin modulok">
          ${adminModules.map((module) => `
            <button class="admin-module-card" type="button" ${module.id ? `data-admin-module="${module.id}"` : 'disabled'}>
              <div class="admin-module-icon" aria-hidden="true">${module.icon}</div>
              <div>
                <h2>${module.title}</h2>
                <p>${module.description}</p>
              </div>
              <span class="admin-module-arrow" aria-hidden="true">${module.id ? '→' : '•'}</span>
            </button>
          `).join('')}
        </section>
      </main>
    </div>
  `;

  root.querySelector('[data-admin-module="website"]')?.addEventListener('click', () => {
    renderWebsiteAdmin(root);
  });

  root.querySelector('[data-admin-logout]')?.addEventListener('click', async () => {
    const button = root.querySelector('[data-admin-logout]');
    if (button) button.disabled = true;
    await logoutAdmin();
    window.location.href = './';
  });
}
