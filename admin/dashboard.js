import { logoutAdmin } from './auth.js';
import { getAdminAudit, getAdminSettings, saveAdminSettings } from './backend.js';
import { renderWebsiteAdmin } from './website/index.js';
import './website/layout-enhancer.js';

const adminModules = [
  { id: 'website', title: 'Weboldal', description: 'Oldalak, menü és megjelenés kezelése.', icon: '⌂' },
  { title: 'Twitch', description: 'Csatorna, élő adás és Twitch-beállítások.', icon: '◈' },
  { title: 'Tartalom', description: 'Szövegek, oldaltartalmak és frissítések.', icon: '✎' },
  { title: 'Média', description: 'Képek, videók és feltöltött anyagok kezelése.', icon: '▣' },
  { id: 'settings', title: 'Beállítások', description: 'Rendszer- és weboldalbeállítások.', icon: '⚙' },
];

export function renderAdminDashboard(root) {
  root.innerHTML = `
    <div class="admin-page">
      <header class="admin-header">
        <div><span class="admin-kicker">Admin</span><h1>Vezérlőpult</h1><p>A weboldal kezelési felülete.</p></div>
        <button class="button button-secondary" type="button" data-admin-logout>Kijelentkezés</button>
      </header>
      <main class="admin-content">
        <section class="admin-module-grid" aria-label="Admin modulok">
          ${adminModules.map((module) => `<button class="admin-module-card" type="button" ${module.id ? `data-admin-module="${module.id}"` : 'disabled'}><div class="admin-module-icon" aria-hidden="true">${module.icon}</div><div><h2>${module.title}</h2><p>${module.description}</p></div><span class="admin-module-arrow" aria-hidden="true">${module.id ? '→' : '•'}</span></button>`).join('')}
        </section>
      </main>
    </div>`;

  root.querySelector('[data-admin-module="website"]')?.addEventListener('click', () => renderWebsiteAdmin(root));
  root.querySelector('[data-admin-module="settings"]')?.addEventListener('click', () => renderAdminSettings(root));
  root.querySelector('[data-admin-logout]')?.addEventListener('click', async () => {
    const button = root.querySelector('[data-admin-logout]');
    if (button) button.disabled = true;
    await logoutAdmin();
    window.location.href = './';
  });
}

async function renderAdminSettings(root) {
  root.innerHTML = `<div class="admin-page"><header class="admin-header"><div><span class="admin-kicker">Beállítások</span><h1>Rendszerbeállítások</h1><p>A módosítások közvetlenül a védett admin backendben kerülnek mentésre.</p></div><button class="button button-secondary" type="button" data-settings-back>Vissza</button></header><main class="admin-content"><section class="admin-card admin-editor-card"><span class="admin-card-label">Backend</span><h2>Állapot</h2><p class="admin-help" data-settings-state>Beállítások betöltése…</p><form data-settings-form hidden><label class="admin-form-field"><span>Weboldal neve</span><input name="brand" maxlength="80"></label><label class="admin-form-field"><span>Leírás</span><textarea name="description" rows="3" maxlength="240"></textarea></label><button class="button button-primary" type="submit">Mentés a szerverre</button><span class="admin-form-status" data-settings-status></span></form></section><section class="admin-card admin-editor-card"><span class="admin-card-label">Audit</span><h2>Admin műveletek</h2><div class="admin-audit-list" data-audit-list>Betöltés…</div></section></main></div>`;

  root.querySelector('[data-settings-back]')?.addEventListener('click', () => renderAdminDashboard(root));
  try {
    const [settingsData, auditData] = await Promise.all([getAdminSettings(), getAdminAudit()]);
    const settings = settingsData.settings || {};
    const form = root.querySelector('[data-settings-form]');
    if (form) {
      form.querySelector('[name="brand"]').value = String(settings.brand || '');
      form.querySelector('[name="description"]').value = String(settings.description || '');
      form.hidden = false;
      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const data = new FormData(form);
        const status = root.querySelector('[data-settings-status]');
        try {
          await saveAdminSettings({ brand: String(data.get('brand') || '').trim(), description: String(data.get('description') || '').trim() });
          if (status) status.textContent = 'Szerverre mentve ✓';
        } catch (error) { if (status) status.textContent = error.message; }
      });
    }
    const state = root.querySelector('[data-settings-state]');
    if (state) state.textContent = 'Kapcsolat rendben – D1 backend aktív.';
    const audit = root.querySelector('[data-audit-list]');
    if (audit) audit.innerHTML = (auditData.audit || []).length ? auditData.audit.map(row => `<article><strong>${escapeHtml(row.action)}</strong><span>${escapeHtml(row.created_at)}</span><small>${escapeHtml(row.details || '')}</small></article>`).join('') : '<p class="admin-help">Még nincs naplózott admin művelet.</p>';
  } catch (error) {
    const state = root.querySelector('[data-settings-state]');
    if (state) state.textContent = `Backend hiba: ${error.message}`;
  }
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
}
