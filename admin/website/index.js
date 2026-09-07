import { navigate } from '../../core/router.js';
import { getSite, saveSiteSettings } from '../../core/site-state.js';
import { getNavigation, saveNavigation } from '../../core/navigation-state.js';

export function renderWebsiteAdmin(root) {
  const currentSite = getSite();
  const items = normalizeItems(getNavigation());

  root.innerHTML = `
    <div class="admin-page">
      <header class="admin-header">
        <div>
          <span class="admin-kicker">Weboldal</span>
          <h1>Weboldal kezelése</h1>
          <p>Alapadatok és menüpontok kezelése.</p>
        </div>
        <button class="button button-secondary" type="button" data-admin-back>Vissza</button>
      </header>

      <main class="admin-content admin-editor-layout">
        <section class="admin-card admin-editor-card">
          <span class="admin-card-label">Alapadatok</span>
          <h2>Weboldal adatai</h2>
          <p class="admin-help">Ezek az adatok jelennek meg a weboldal központi részein.</p>
          <form class="admin-site-form" data-site-form>
            <label class="admin-form-field"><span>Weboldal neve</span><input name="brand" value="${escapeHtml(currentSite.brand)}" maxlength="80" required></label>
            <label class="admin-form-field"><span>Leírás</span><textarea name="description" rows="3" maxlength="240">${escapeHtml(currentSite.description)}</textarea></label>
            <button class="button button-primary" type="submit">Weboldal adatai mentése</button>
            <span class="admin-form-status" data-site-save-status></span>
          </form>
        </section>

        <section class="admin-card admin-editor-card">
          <div class="admin-card-heading">
            <div>
              <span class="admin-card-label">Navigáció</span>
              <h2>Menüpontok</h2>
            </div>
            <button class="button button-secondary" type="button" data-add-item>+ Új menüpont</button>
          </div>
          <p class="admin-help">Állítsd be a menüpont nevét, típusát, helyét és láthatóságát.</p>
          <div class="admin-nav-editor" data-nav-editor>
            ${items.map((item, index) => renderItem(item, index)).join('')}
          </div>
          <div class="admin-form-meta">
            <span>Menüpontok: <strong data-item-count>${items.length}</strong></span>
            <span data-nav-save-status></span>
          </div>
          <button class="button button-primary" type="button" data-save-navigation>Menüpontok mentése</button>
        </section>
      </main>
    </div>
  `;

  root.querySelector('[data-admin-back]')?.addEventListener('click', () => navigate('/admin'));
  root.querySelector('[data-site-form]')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const status = root.querySelector('[data-site-save-status]');
    const saved = saveSiteSettings({ brand: String(data.get('brand') || '').trim(), description: String(data.get('description') || '').trim() });
    if (status) status.textContent = saved ? 'Mentve ✓' : 'Mentés sikertelen';
  });

  root.querySelector('[data-add-item]')?.addEventListener('click', () => {
    const editor = root.querySelector('[data-nav-editor]');
    if (!editor) return;
    const index = editor.querySelectorAll('[data-nav-item]').length;
    editor.insertAdjacentHTML('beforeend', renderItem({ label: 'Új menüpont', path: '/uj-oldal', type: 'route', enabled: true }, index));
    bindEditor(root);
    updateCount(root);
  });

  bindEditor(root);
}

function bindEditor(root) {
  root.querySelectorAll('[data-nav-item]').forEach((row) => {
    if (row.dataset.bound === 'true') return;
    row.dataset.bound = 'true';
    row.querySelector('[data-type]')?.addEventListener('change', (event) => updateTypeFields(row, event.target.value));
    row.querySelector('[data-up]')?.addEventListener('click', () => moveItem(row, -1, root));
    row.querySelector('[data-down]')?.addEventListener('click', () => moveItem(row, 1, root));
    row.querySelector('[data-delete]')?.addEventListener('click', () => { row.remove(); updateCount(root); });
    updateTypeFields(row, row.querySelector('[data-type]')?.value || 'route');
  });
  const saveButton = root.querySelector('[data-save-navigation]');
  if (saveButton?.dataset.bound !== 'true') {
    saveButton.dataset.bound = 'true';
    saveButton.addEventListener('click', saveNavigationFromForm);
  }
}

function updateTypeFields(row, type) {
  const external = type === 'external';
  const route = row.querySelector('[data-route-fields]');
  if (route) route.hidden = external;
  row.querySelectorAll('[data-external-fields]').forEach((field) => { field.hidden = !external; });
}

function saveNavigationFromForm(event) {
  const root = event.currentTarget.closest('.admin-page');
  const rows = [...root.querySelectorAll('[data-nav-item]')];
  const items = rows.map((row, index) => {
    const type = row.querySelector('[data-type]')?.value === 'external' ? 'external' : 'route';
    const item = {
      label: row.querySelector('[name="label"]')?.value.trim() || `Menüpont ${index + 1}`,
      type,
      enabled: row.querySelector('[name="enabled"]')?.checked ?? true,
      order: index,
    };
    if (type === 'external') {
      item.url = row.querySelector('[name="url"]')?.value.trim() || '';
      item.urlKey = row.querySelector('[name="urlKey"]')?.value.trim() || '';
    } else {
      item.path = row.querySelector('[name="path"]')?.value.trim() || '/';
    }
    return item;
  });
  const status = root.querySelector('[data-nav-save-status]');
  if (saveNavigation(items)) status.textContent = 'Mentve ✓';
  else status.textContent = 'Mentés sikertelen';
}

function moveItem(row, direction, root) {
  const rows = [...root.querySelectorAll('[data-nav-item]')];
  const index = rows.indexOf(row);
  const target = rows[index + direction];
  if (!target) return;
  direction < 0 ? target.before(row) : target.after(row);
  [...root.querySelectorAll('[data-nav-item]')].forEach((item, itemIndex) => { const number = item.querySelector('.admin-nav-number'); if (number) number.textContent = `${itemIndex + 1}.`; });
}

function updateCount(root) {
  const count = root.querySelector('[data-item-count]');
  if (count) count.textContent = root.querySelectorAll('[data-nav-item]').length;
}

function normalizeItems(items) {
  return [...items].map((item, index) => ({ ...item, enabled: item.enabled !== false, order: item.order ?? index })).sort((a, b) => a.order - b.order);
}

function renderItem(item, index) {
  const external = item.type === 'external';
  const url = external ? String(item.url || '') : '';
  const urlKey = external ? String(item.urlKey || '') : '';
  return `
    <article class="admin-nav-item" data-nav-item>
      <div class="admin-nav-item-top">
        <strong class="admin-nav-number">${index + 1}.</strong>
        <label class="admin-form-field admin-nav-label"><span>Megnevezés</span><input name="label" value="${escapeHtml(item.label || '')}" maxlength="60"></label>
        <label class="admin-form-field admin-nav-type"><span>Típus</span><select name="type" data-type><option value="route" ${!external ? 'selected' : ''}>Oldal</option><option value="external" ${external ? 'selected' : ''}>Külső link</option></select></label>
        <label class="admin-switch"><input name="enabled" type="checkbox" ${item.enabled !== false ? 'checked' : ''}><span>Aktív</span></label>
      </div>
      <div class="admin-nav-fields">
        <label class="admin-form-field" data-route-fields><span>Útvonal</span><input name="path" value="${escapeHtml(item.path || '/')}" placeholder="/bemutatkozas"></label>
        <label class="admin-form-field" data-external-fields><span>Link / URL</span><input name="url" value="${escapeHtml(url)}" placeholder="https://pelda.hu"></label>
        <label class="admin-form-field" data-external-fields><span>URL kulcs</span><input name="urlKey" value="${escapeHtml(urlKey)}" placeholder="pl. twitch"></label>
      </div>
      <div class="admin-nav-actions">
        <button class="button button-secondary" type="button" data-up>↑ Fel</button>
        <button class="button button-secondary" type="button" data-down>↓ Le</button>
        <button class="button button-secondary" type="button" data-delete>Törlés</button>
      </div>
    </article>
  `;
}

function escapeHtml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}
