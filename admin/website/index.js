import { navigate } from '../../core/router.js';
import { getSite } from '../../core/site-state.js';
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
          <div class="admin-menu-preview">
            <div class="admin-field-row"><span>Név</span><strong>${escapeHtml(currentSite.brand)}</strong></div>
            <div class="admin-field-row"><span>Leírás</span><strong>${escapeHtml(currentSite.description)}</strong></div>
          </div>
        </section>

        <section class="admin-card admin-editor-card">
          <div class="admin-card-heading">
            <div>
              <span class="admin-card-label">Navigáció</span>
              <h2>Menüpontok</h2>
            </div>
            <button class="button button-secondary" type="button" data-add-item>+ Új</button>
          </div>

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

    row.querySelector('[data-type]')?.addEventListener('change', (event) => {
      const external = event.target.value === 'external';
      row.querySelector('[data-route-fields]').hidden = external;
      row.querySelectorAll('[data-external-fields]').forEach((field) => { field.hidden = !external; });
    });

    row.querySelector('[data-up]')?.addEventListener('click', () => moveItem(row, -1, root));
    row.querySelector('[data-down]')?.addEventListener('click', () => moveItem(row, 1, root));
    row.querySelector('[data-delete]')?.addEventListener('click', () => { row.remove(); updateCount(root); });
  });

  const saveButton = root.querySelector('[data-save-navigation]');
  if (saveButton?.dataset.bound !== 'true') {
    saveButton.dataset.bound = 'true';
    saveButton.addEventListener('click', saveNavigationFromForm);
  }
}

function saveNavigationFromForm(event) {
  const root = event.currentTarget.closest('.admin-page');
  const rows = [...root.querySelectorAll('[data-nav-item]')];
  const items = rows.map((row, index) => {
    const type = row.querySelector('[data-type]')?.value || 'route';
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
  if (saveNavigation(items)) {
    status.textContent = 'Mentve ✓';
    setTimeout(() => navigate('/'), 350);
  } else {
    status.textContent = 'Mentés sikertelen';
  }
}

function moveItem(row, direction, root) {
  const rows = [...root.querySelectorAll('[data-nav-item]')];
  const index = rows.indexOf(row);
  const target = rows[index + direction];
  if (!target) return;
  direction < 0 ? target.before(row) : target.after(row);
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
  return `
    <article class="admin-nav-item" data-nav-item>
      <div class="admin-nav-item-top">
        <strong>${index + 1}.</strong>
        <label class="admin-form-field admin-nav-label"><span>Megnevezés</span><input name="label" value="${escapeHtml(item.label)}" maxlength="60"></label>
        <label class="admin-form-field admin-nav-type"><span>Típus</span><select name="type" data-type><option value="route" ${!external ? 'selected' : ''}>Oldal</option><option value="external" ${external ? 'selected' : ''}>Külső link</option></select></label>
        <label class="admin-switch"><input name="enabled" type="checkbox" ${item.enabled !== false ? 'checked' : ''}><span>Aktív</span></label>
      </div>
      <div class="admin-nav-fields">
        <label class="admin-form-field" data-route-fields ${external ? 'hidden' : ''}><span>Útvonal</span><input name="path" value="${escapeHtml(item.path || '/')}" placeholder="/bemutatkozas"></label>
        <label class="admin-form-field" data-external-fields ${!external ? 'hidden' : ''}><span>URL</span><input name="url" value="${escapeHtml(item.url || '')}" placeholder="https://..."></label>
        <label class="admin-form-field" data-external-fields ${!external ? 'hidden' : ''}><span>URL kulcs</span><input name="urlKey" value="${escapeHtml(item.urlKey || '')}" placeholder="twitch"></label>
      </div>
      <div class="admin-nav-actions"><button class="button button-secondary" type="button" data-up>↑</button><button class="button button-secondary" type="button" data-down>↓</button><button class="button button-secondary" type="button" data-delete>Törlés</button></div>
    </article>
  `;
}

function escapeHtml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}
