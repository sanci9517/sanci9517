import { site } from '../../data/site.js';
import { navigation } from '../../data/navigation.js';
import { storage } from '../../core/storage.js';
import { navigate } from '../../core/router.js';

const SETTINGS_KEY = 'admin-website-settings';

export function renderWebsiteAdmin(root) {
  const saved = storage.get(SETTINGS_KEY, {});
  const values = {
    brand: saved.brand ?? site.brand,
    description: saved.description ?? site.description,
  };

  root.innerHTML = `
    <div class="admin-page">
      <header class="admin-header">
        <div>
          <span class="admin-kicker">Weboldal</span>
          <h1>Weboldal kezelése</h1>
          <p>Az alapadatokat innen tudod módosítani.</p>
        </div>
        <button class="button button-secondary" type="button" data-admin-back>Vissza</button>
      </header>

      <main class="admin-content admin-editor-layout">
        <section class="admin-card admin-editor-card">
          <span class="admin-card-label">Alapadatok</span>
          <h2>Weboldal adatai</h2>
          <form class="admin-form" data-website-form>
            <label class="admin-form-field">
              <span>Weboldal neve</span>
              <input name="brand" type="text" value="${escapeHtml(values.brand)}" required maxlength="80">
            </label>
            <label class="admin-form-field">
              <span>Leírás</span>
              <textarea name="description" rows="4" maxlength="240" required>${escapeHtml(values.description)}</textarea>
            </label>
            <div class="admin-form-meta">
              <span>Nyelv: <strong>${escapeHtml(site.language)}</strong></span>
              <span data-save-status></span>
            </div>
            <button class="button button-primary" type="submit">Mentés</button>
          </form>
        </section>

        <section class="admin-card admin-editor-card">
          <span class="admin-card-label">Navigáció</span>
          <h2>Menüpontok</h2>
          <div class="admin-menu-preview">
            ${navigation.map((item, index) => `
              <div class="admin-field-row">
                <span><strong>${index + 1}.</strong> ${escapeHtml(item.label)}</span>
                <strong>${item.type === 'external' ? 'Külső link' : escapeHtml(item.path)}</strong>
              </div>
            `).join('')}
          </div>
          <p class="admin-help">A menüpontok szerkesztését külön lépésben készítjük el.</p>
        </section>
      </main>
    </div>
  `;

  root.querySelector('[data-admin-back]')?.addEventListener('click', () => navigate('/admin'));

  root.querySelector('[data-website-form]')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const next = {
      brand: String(formData.get('brand') || '').trim(),
      description: String(formData.get('description') || '').trim(),
    };
    if (!next.brand || !next.description) return;
    storage.set(SETTINGS_KEY, next);
    const status = root.querySelector('[data-save-status]');
    if (status) status.textContent = 'Mentve ✓';
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
