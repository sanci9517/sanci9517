import { site } from '../../data/site.js';
import { navigation } from '../../data/navigation.js';
import { siteUrl } from '../../core/config.js';
import { navigate } from '../../core/router.js';

export function renderWebsiteAdmin(root) {
  root.innerHTML = `
    <div class="admin-page">
      <header class="admin-header">
        <div>
          <span class="admin-kicker">Weboldal</span>
          <h1>Weboldal kezelése</h1>
          <p>A weboldal jelenlegi felépítése és beállításai.</p>
        </div>
        <button class="button button-secondary" type="button" data-admin-back>Vissza</button>
      </header>

      <main class="admin-content">
        <section class="admin-card admin-editor-card">
          <span class="admin-card-label">Alapadatok</span>
          <h2>Weboldal adatai</h2>
          <div class="admin-field-list">
            <div class="admin-field-row">
              <span>Technikai név</span>
              <strong>${site.brand}</strong>
            </div>
            <div class="admin-field-row">
              <span>Nyelv</span>
              <strong>${site.language}</strong>
            </div>
            <div class="admin-field-row admin-field-row-column">
              <span>Leírás</span>
              <strong>${site.description}</strong>
            </div>
          </div>
        </section>

        <section class="admin-card admin-editor-card">
          <span class="admin-card-label">Navigáció</span>
          <h2>Menüpontok</h2>
          <div class="admin-menu-preview">
            ${navigation.map((item, index) => `
              <div class="admin-field-row">
                <span>${index + 1}. ${item.label}</span>
                <strong>${item.type === 'external' ? 'Külső link' : siteUrl(item.path)}</strong>
              </div>
            `).join('')}
          </div>
        </section>

        <section class="admin-card admin-info-card">
          <span class="admin-card-label">Szerkesztési mód</span>
          <h2>Grafikus vezérlés előkészítve</h2>
          <p>Itt fogjuk később szerkeszteni a weboldal nevét, leírását, menüjét és megjelenését. A mentés és a valódi módosítás a következő lépésben kerül be.</p>
        </section>
      </main>
    </div>
  `;

  root.querySelector('[data-admin-back]')?.addEventListener('click', () => {
    navigate('/admin');
  });
}
