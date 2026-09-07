import { navigate } from '../../core/router.js';
import { getSite, saveSiteSettings } from '../../core/site-state.js';
import { getNavigation, saveNavigation } from '../../core/navigation-state.js';
import { getPages, getPageById, savePages, syncPagesFromNavigation } from '../../core/page-state.js';

export function renderWebsiteAdmin(root) {
  const currentSite = getSite();
  const items = normalizeItems(getNavigation());
  const pages = getPages();
  const selectedPage = pages[0] || null;

  root.innerHTML = `
    <div class="admin-page">
      <header class="admin-header"><div><span class="admin-kicker">Weboldal</span><h1>Weboldal kezelése</h1><p>Alapadatok, oldalak és menüpontok kezelése.</p></div><button class="button button-secondary" type="button" data-admin-back>Vissza</button></header>
      <main class="admin-content admin-editor-layout">
        <section class="admin-card admin-editor-card"><span class="admin-card-label">Alapadatok</span><h2>Weboldal adatai</h2><p class="admin-help">Ezek az adatok jelennek meg a weboldal központi részein.</p>
          <form class="admin-site-form" data-site-form><label class="admin-form-field"><span>Weboldal neve</span><input name="brand" value="${escapeHtml(currentSite.brand)}" maxlength="80" required></label><label class="admin-form-field"><span>Leírás</span><textarea name="description" rows="3" maxlength="240">${escapeHtml(currentSite.description)}</textarea></label><button class="button button-primary" type="submit">Weboldal adatai mentése</button><span class="admin-form-status" data-site-save-status></span></form>
        </section>

        <section class="admin-card admin-editor-card"><span class="admin-card-label">Oldalak</span><h2>Oldal tartalmának szerkesztése</h2><p class="admin-help">Itt az általad létrehozott oldalak és azok tartalmi boxai szerkeszthetők.</p>
          <form class="admin-page-form" data-page-form>${renderPageForm(selectedPage, pages)}</form>
        </section>

        <section class="admin-card admin-editor-card"><div class="admin-card-heading"><div><span class="admin-card-label">Navigáció</span><h2>Menüpontok</h2></div><button class="button button-secondary" type="button" data-add-item>+ Új menüpont</button></div><p class="admin-help">Állítsd be a menüpont nevét, típusát, helyét és láthatóságát.</p><div class="admin-nav-editor" data-nav-editor>${items.map((item, index) => renderItem(item, index)).join('')}</div><div class="admin-form-meta"><span>Menüpontok: <strong data-item-count>${items.length}</strong></span><span data-nav-save-status></span></div><button class="button button-primary" type="button" data-save-navigation>Menüpontok mentése</button></section>
      </main>
    </div>`;

  root.querySelector('[data-admin-back]')?.addEventListener('click', () => navigate('/admin'));
  root.querySelector('[data-site-form]')?.addEventListener('submit', (event) => { event.preventDefault(); const data = new FormData(event.currentTarget); const status = root.querySelector('[data-site-save-status]'); const saved = saveSiteSettings({ brand: String(data.get('brand') || '').trim(), description: String(data.get('description') || '').trim() }); if (status) status.textContent = saved ? 'Mentve ✓' : 'Mentés sikertelen'; });

  bindPageEditor(root);
  root.querySelector('[data-add-item]')?.addEventListener('click', () => { const editor = root.querySelector('[data-nav-editor]'); if (!editor) return; const index = editor.querySelectorAll('[data-nav-item]').length; editor.insertAdjacentHTML('beforeend', renderItem({ label: 'Új menüpont', path: '/uj-oldal', type: 'route', enabled: true }, index)); bindEditor(root); updateCount(root); });
  bindEditor(root);
}

function bindPageEditor(root) {
  const form = root.querySelector('[data-page-form]');
  if (!form) return;
  const select = form.querySelector('[data-page-select]');
  if (select && select.dataset.bound !== 'true') { select.dataset.bound = 'true'; select.addEventListener('change', (event) => { const page = getPageById(event.target.value); form.innerHTML = renderPageForm(page, getPages()); bindPageEditor(root); }); }
  form.querySelector('[data-add-block]')?.addEventListener('click', () => { const list = form.querySelector('[data-block-list]'); if (!list) return; list.insertAdjacentHTML('beforeend', renderBlockForm({ id: createBlockId(), type: 'text', title: 'Új box', content: '' }, list.children.length)); bindBlockControls(form); });
  bindBlockControls(form);
  if (form.dataset.submitBound === 'true') return;
  form.dataset.submitBound = 'true';
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form); const id = String(data.get('id') || ''); const currentPages = getPages(); const index = currentPages.findIndex((page) => page.id === id); if (index < 0) return;
    const blocks = [...form.querySelectorAll('[data-block]')].map((box) => ({ id: box.dataset.block, type: box.querySelector('[name="block-type"]')?.value || 'text', title: box.querySelector('[name="block-title"]')?.value.trim() || 'Box', content: box.querySelector('[name="block-content"]')?.value.trim() || '' }));
    currentPages[index] = { ...currentPages[index], title: String(data.get('title') || '').trim() || currentPages[index].title, content: String(data.get('content') || '').trim(), blocks };
    const status = form.querySelector('[data-page-save-status]'); if (savePages(currentPages)) { if (status) status.textContent = 'Mentve ✓'; } else if (status) status.textContent = 'Mentés sikertelen';
  });
}

function renderPageForm(page, pages) {
  if (!page) return '<p class="admin-help">Még nincs létrehozott oldal. Hozz létre egy „Oldal” típusú menüpontot, majd mentsd el.</p>';
  const blocks = Array.isArray(page.blocks) ? page.blocks : [];
  return `<label class="admin-form-field"><span>Oldal</span><select name="id" data-page-select>${pages.map((item) => `<option value="${escapeHtml(item.id)}" ${item.id === page.id ? 'selected' : ''}>${escapeHtml(item.title)}</option>`).join('')}</select></label><label class="admin-form-field"><span>Oldal címe</span><input name="title" value="${escapeHtml(page.title || '')}" maxlength="100" required></label><label class="admin-form-field"><span>Oldal szövege</span><textarea name="content" rows="6" maxlength="5000" placeholder="Ide írd az oldal fő szövegét...">${escapeHtml(page.content || '')}</textarea></label><div class="admin-block-editor"><div class="admin-card-heading"><div><span class="admin-card-label">Tartalmi boxok</span><h3>Boxok az oldalon</h3></div><button class="button button-secondary" type="button" data-add-block>+ Box hozzáadása</button></div><p class="admin-help">Minden boxnál külön megadhatod a típust. A Fel és Le gombokkal a sorrend is állítható.</p><div class="admin-block-list" data-block-list>${blocks.map(renderBlockForm).join('')}</div></div><div class="admin-form-meta"><span>Elérés: <strong>${escapeHtml(page.path || '/')}</strong></span><span data-page-save-status></span></div><button class="button button-primary" type="submit">Oldal mentése</button>`;
}

function renderBlockForm(block, index) {
  const type = ['text', 'game', 'twitch', 'image', 'link', 'stats'].includes(block?.type) ? block.type : 'text';
  return `<article class="admin-block-item" data-block="${escapeHtml(block.id)}"><div class="admin-block-item-top"><strong class="admin-block-number">Box ${index + 1}</strong><div class="admin-block-actions"><button class="button button-secondary" type="button" data-block-up>↑ Fel</button><button class="button button-secondary" type="button" data-block-down>↓ Le</button><button class="button button-secondary" type="button" data-delete-block>Box törlése</button></div></div><label class="admin-form-field"><span>Box típusa</span><select name="block-type"><option value="text" ${type === 'text' ? 'selected' : ''}>📝 Szöveg</option><option value="game" ${type === 'game' ? 'selected' : ''}>🎮 Játék</option><option value="twitch" ${type === 'twitch' ? 'selected' : ''}>📺 Twitch / stream</option><option value="image" ${type === 'image' ? 'selected' : ''}>🖼️ Kép</option><option value="link" ${type === 'link' ? 'selected' : ''}>🔗 Link / gomb</option><option value="stats" ${type === 'stats' ? 'selected' : ''}>📊 Statisztika</option></select></label><label class="admin-form-field"><span>Box címe</span><input name="block-title" value="${escapeHtml(block.title || '')}" maxlength="100" placeholder="Pl. Legutóbbi adás"></label><label class="admin-form-field"><span>Box szövege / adata</span><textarea name="block-content" rows="5" maxlength="2000" placeholder="A box tartalma...">${escapeHtml(block.content || '')}</textarea></label></article>`;
}

function bindBlockControls(form) {
  form.querySelectorAll('[data-delete-block], [data-block-up], [data-block-down]').forEach((button) => {
    if (button.dataset.bound === 'true') return;
    button.dataset.bound = 'true';
    button.addEventListener('click', () => {
      const block = button.closest('[data-block]');
      if (!block) return;
      if (button.hasAttribute('data-delete-block')) {
        block.remove();
      } else {
        const list = form.querySelector('[data-block-list]');
        if (!list) return;
        const blocks = [...list.querySelectorAll('[data-block]')];
        const index = blocks.indexOf(block);
        const target = button.hasAttribute('data-block-up') ? blocks[index - 1] : blocks[index + 1];
        if (target) button.hasAttribute('data-block-up') ? target.before(block) : target.after(block);
      }
      updateBlockNumbers(form);
    });
  });
}

function updateBlockNumbers(form) {
  form.querySelectorAll('[data-block]').forEach((block, index) => {
    const number = block.querySelector('.admin-block-number');
    if (number) number.textContent = `Box ${index + 1}`;
  });
}

function createBlockId() { return `block-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`; }

function bindEditor(root) {
  root.querySelectorAll('[data-nav-item]').forEach((row) => {
    if (row.dataset.bound === 'true') return; row.dataset.bound = 'true';
    row.querySelector('[data-type]')?.addEventListener('change', (event) => updateTypeFields(row, event.target.value));
    row.querySelector('[name="label"]')?.addEventListener('input', (event) => { const path = row.querySelector('[name="path"]'); if (row.querySelector('[data-type]')?.value !== 'external' && path && !path.dataset.userEdited) path.value = `/${createSlug(event.target.value)}`; });
    row.querySelector('[name="path"]')?.addEventListener('input', (event) => { event.target.dataset.userEdited = 'true'; });
    row.querySelector('[data-up]')?.addEventListener('click', () => moveItem(row, -1, root)); row.querySelector('[data-down]')?.addEventListener('click', () => moveItem(row, 1, root)); row.querySelector('[data-delete]')?.addEventListener('click', () => { row.remove(); updateCount(root); }); updateTypeFields(row, row.querySelector('[data-type]')?.value || 'route');
  });
  const saveButton = root.querySelector('[data-save-navigation]'); if (saveButton?.dataset.bound !== 'true') { saveButton.dataset.bound = 'true'; saveButton.addEventListener('click', saveNavigationFromForm); }
}

function updateTypeFields(row, type) { const external = type === 'external'; const route = row.querySelector('[data-route-fields]'); if (route) route.hidden = external; row.querySelectorAll('[data-external-fields]').forEach((field) => { field.hidden = !external; }); if (!external) { const path = row.querySelector('[name="path"]'); const label = row.querySelector('[name="label"]'); if (path && label && (!path.value.trim() || path.value === '/uj-oldal') ) path.value = `/${createSlug(label.value)}`; } }
function saveNavigationFromForm(event) { const root = event.currentTarget.closest('.admin-page'); const items = [...root.querySelectorAll('[data-nav-item]')].map((row, index) => { const type = row.querySelector('[data-type]')?.value === 'external' ? 'external' : 'route'; const item = { label: row.querySelector('[name="label"]')?.value.trim() || `Menüpont ${index + 1}`, type, enabled: row.querySelector('[name="enabled"]')?.checked ?? true, order: index }; if (type === 'external') { item.url = row.querySelector('[name="url"]')?.value.trim() || ''; item.urlKey = row.querySelector('[name="urlKey"]')?.value.trim() || ''; } else item.path = row.querySelector('[name="path"]')?.value.trim() || `/${createSlug(item.label)}` || '/'; return item; }); const status = root.querySelector('[data-nav-save-status]'); if (!saveNavigation(items)) { if (status) status.textContent = 'Mentés sikertelen'; return; } syncPagesFromNavigation(items); if (status) status.textContent = 'Mentve ✓'; }
function moveItem(row, direction, root) { const rows = [...root.querySelectorAll('[data-nav-item]')], index = rows.indexOf(row), target = rows[index + direction]; if (!target) return; direction < 0 ? target.before(row) : target.after(row); [...root.querySelectorAll('[data-nav-item]')].forEach((item, i) => { const n = item.querySelector('.admin-nav-number'); if (n) n.textContent = `${i + 1}.`; }); }
function updateCount(root) { const count = root.querySelector('[data-item-count]'); if (count) count.textContent = root.querySelectorAll('[data-nav-item]').length; }
function normalizeItems(items) { return [...items].map((item, index) => ({ ...item, enabled: item.enabled !== false, order: item.order ?? index })).sort((a, b) => a.order - b.order); }
function renderItem(item, index) { const external = item.type === 'external'; const url = external ? String(item.url || '') : '', urlKey = external ? String(item.urlKey || '') : ''; const path = external ? '' : String(item.path || `/${createSlug(item.label)}`); return `<article class="admin-nav-item" data-nav-item><div class="admin-nav-item-top"><strong class="admin-nav-number">${index + 1}.</strong><label class="admin-form-field admin-nav-label"><span>Megnevezés</span><input name="label" value="${escapeHtml(item.label || '')}" maxlength="60"></label><label class="admin-form-field admin-nav-type"><span>Típus</span><select name="type" data-type><option value="route" ${!external ? 'selected' : ''}>Oldal</option><option value="external" ${external ? 'selected' : ''}>Külső link</option></select></label><label class="admin-switch"><input name="enabled" type="checkbox" ${item.enabled !== false ? 'checked' : ''}><span>Aktív</span></label></div><div class="admin-nav-fields"><label class="admin-form-field" data-route-fields ${external ? 'hidden' : ''}><span>Elérés</span><input name="path" value="${escapeHtml(path)}" placeholder="/bemutatkozas"></label><label class="admin-form-field" data-external-fields ${!external ? 'hidden' : ''}><span>Link / URL</span><input name="url" value="${escapeHtml(url)}" placeholder="https://pelda.hu"></label><label class="admin-form-field" data-external-fields ${!external ? 'hidden' : ''}><span>URL kulcs</span><input name="urlKey" value="${escapeHtml(urlKey)}" placeholder="pl. twitch"></label></div><div class="admin-nav-actions"><button class="button button-secondary" type="button" data-up>↑ Fel</button><button class="button button-secondary" type="button" data-down>↓ Le</button><button class="button button-secondary" type="button" data-delete>Törlés</button></div></article>`; }
function createSlug(value) { return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); }
function escapeHtml(value) { return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;'); }
