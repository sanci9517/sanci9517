import { createDocument, createPage, getNode, NODE_TYPES } from './core/schema.js';
import { createEditorState, activePage, selectedNodes, setSelection, markSaved } from './core/state.js';
import { execute } from './core/commands.js';

let state = null;
let pages = [];
let zoom = 1;
let inspectorTab = 'design';
const $ = (s) => document.querySelector(s);
const canvas = $('#canvas');
const inspector = $('#inspectorBody');
const sizes = { desktop: 1440, tablet: 768, mobile: 390 };

const groups = [
  ['Layout', [['Section', NODE_TYPES.SECTION], ['Container', NODE_TYPES.CONTAINER], ['Stack', NODE_TYPES.STACK], ['Group', NODE_TYPES.GROUP], ['Row', NODE_TYPES.ROW], ['Columns', NODE_TYPES.COLUMNS], ['Flex', NODE_TYPES.FLEX], ['Grid', NODE_TYPES.GRID], ['Slot', NODE_TYPES.SLOT], ['Spacer', NODE_TYPES.SPACER]]],
  ['Szöveg', [['Heading', NODE_TYPES.HEADING], ['Szöveg', NODE_TYPES.TEXT], ['Rich Text', NODE_TYPES.RICHTEXT], ['Link', NODE_TYPES.LINK], ['Gomb', NODE_TYPES.BUTTON], ['Breadcrumb', NODE_TYPES.BREADCRUMB]]],
  ['Média', [['Kép', NODE_TYPES.IMAGE], ['Galéria', NODE_TYPES.GALLERY], ['Videó', NODE_TYPES.VIDEO], ['Audio', NODE_TYPES.AUDIO], ['Ikon', NODE_TYPES.ICON], ['Carousel', NODE_TYPES.CAROUSEL], ['Embed', NODE_TYPES.EMBED], ['Iframe', NODE_TYPES.IFRAME], ['Code', NODE_TYPES.CODE]]],
  ['Tartalom', [['Card', NODE_TYPES.CARD], ['Lista', NODE_TYPES.LIST], ['Táblázat', NODE_TYPES.TABLE], ['Tabs', NODE_TYPES.TABS], ['Accordion', NODE_TYPES.ACCORDION], ['Dropdown', NODE_TYPES.DROPDOWN], ['Pagination', NODE_TYPES.PAGINATION], ['Search', NODE_TYPES.SEARCH], ['Modal', NODE_TYPES.MODAL]]],
  ['Navigáció', [['Navbar', NODE_TYPES.NAVBAR], ['Menu', NODE_TYPES.MENU], ['Sidebar', NODE_TYPES.SIDEBAR], ['Footer', NODE_TYPES.FOOTER]]],
  ['Űrlapok', [['Form', NODE_TYPES.FORM], ['Input', NODE_TYPES.INPUT], ['Textarea', NODE_TYPES.TEXTAREA], ['Checkbox', NODE_TYPES.CHECKBOX], ['Radio', NODE_TYPES.RADIO], ['Select', NODE_TYPES.SELECT], ['Slider', NODE_TYPES.SLIDER], ['File', NODE_TYPES.FILE], ['Submit', NODE_TYPES.SUBMIT]]],
  ['Social / Web', [['Social Links', NODE_TYPES.SOCIAL], ['Discord', NODE_TYPES.DISCORD], ['Twitch', NODE_TYPES.TWITCH], ['YouTube', NODE_TYPES.YOUTUBE], ['TikTok', NODE_TYPES.TIKTOK]]],
  ['Sanci9517', [['Élő állapot', NODE_TYPES.LIVE], ['Countdown', NODE_TYPES.COUNTDOWN], ['Adásrend', NODE_TYPES.SCHEDULE], ['Stream számláló', NODE_TYPES.STREAM_COUNT], ['Követők', NODE_TYPES.FOLLOWERS], ['Feliratkozók', NODE_TYPES.SUBS], ['VOD', NODE_TYPES.VOD], ['Támogatás', NODE_TYPES.SUPPORT], ['Közösség', NODE_TYPES.COMMUNITY], ['Játékkártya', NODE_TYPES.GAME_CARD], ['Játéklista', NODE_TYPES.GAME_LIST], ['Komponens', NODE_TYPES.COMPONENT], ['Egyedi elem', NODE_TYPES.CUSTOM]]]
];

const api = async (url, options = {}) => {
  const response = await fetch(url, { credentials: 'same-origin', headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }, ...options });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.error?.message || data?.message || `API hiba (${response.status})`);
  return data;
};

const page = () => state && activePage(state);
const setStatus = (text) => { $('#saveStatus').textContent = text; };
const canonical = (document, id) => Boolean(document?.type === 'sanci-page-document' && document?.schemaVersion === 1 && document?.activePageId === id && document?.pages?.[id]);

function renderPalette(filter = '') {
  const root = $('#elementList');
  root.replaceChildren();
  const query = filter.trim().toLowerCase();
  for (const [group, items] of groups) {
    const matches = items.filter(([name]) => name.toLowerCase().includes(query));
    if (!matches.length) continue;
    const section = document.createElement('section');
    section.className = 'element-group collapsed';
    const title = document.createElement('button');
    title.type = 'button';
    title.className = 'element-group-title';
    title.innerHTML = `<span>${group}</span><b>${matches.length}</b>`;
    const body = document.createElement('div');
    for (const [name, type] of matches) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'element';
      button.innerHTML = `<i>◇</i><span>${name}</span>`;
      button.onclick = () => {
        const current = page();
        if (!current) return;
        execute(state, { type: 'element.add', payload: { type, name, parentId: state.selection.primaryId || current.rootId, props: { text: name } } });
        render();
      };
      body.append(button);
    }
    title.onclick = () => section.classList.toggle('collapsed');
    section.append(title, body);
    root.append(section);
  }
}

function renderNode(currentPage, id) {
  const node = getNode(currentPage, id);
  if (!node) return null;
  const element = document.createElement('div');
  element.className = `node ${state.selection.ids.includes(id) ? 'selected' : ''}`;
  element.dataset.nodeId = id;
  const head = document.createElement('div');
  head.className = 'node-head';
  head.innerHTML = `<span>${node.name || node.type}</span><small>${node.type}</small>`;
  element.append(head);
  if ([NODE_TYPES.HEADING, NODE_TYPES.TEXT, NODE_TYPES.RICHTEXT, NODE_TYPES.BUTTON, NODE_TYPES.LINK].includes(node.type)) {
    const content = document.createElement('div');
    content.className = 'node-content';
    content.textContent = node.props?.text || node.name;
    element.append(content);
  }
  for (const child of node.children || []) {
    const childElement = renderNode(currentPage, child);
    if (childElement) element.append(childElement);
  }
  element.onclick = (event) => { event.stopPropagation(); setSelection(state, [id]); render(); };
  return element;
}

function renderCanvas() {
  canvas.querySelectorAll('.page-canvas').forEach((item) => item.remove());
  const currentPage = page();
  const device = state?.viewport?.device || 'desktop';
  const width = sizes[device];
  const pageCanvas = document.createElement('div');
  pageCanvas.className = 'page-canvas';
  pageCanvas.style.width = `${width}px`;
  pageCanvas.style.transform = `scale(${zoom})`;
  if (currentPage) pageCanvas.append(renderNode(currentPage, currentPage.rootId));
  canvas.append(pageCanvas);
  $('#canvasEmpty').hidden = Boolean(currentPage);
  $('#canvasMode').textContent = `${device} · ${width}px`;
  $('#zoom').textContent = `${Math.round(zoom * 100)}%`;
}

function inspectorField(labelText, value, onChange) {
  const field = document.createElement('label');
  field.className = 'field';
  const label = document.createElement('span');
  label.textContent = labelText;
  const input = document.createElement('input');
  input.value = value ?? '';
  input.onchange = () => onChange(input.value);
  field.append(label, input);
  return field;
}

function renderInspector() {
  inspector.replaceChildren();
  const nodes = state ? selectedNodes(state) : [];
  if (!nodes.length) {
    inspector.innerHTML = '<div class="inspector-empty"><b>Inspector</b><span>Válassz ki egy elemet a vásznon vagy a Rétegek panelen.</span></div>';
    return;
  }
  const node = nodes[0];
  const header = document.createElement('div');
  header.className = 'inspector-selection';
  header.innerHTML = `<b>${node.name || node.type}</b><small>${node.type}</small>`;
  inspector.append(header);

  if (inspectorTab === 'design') {
    inspector.append(
      inspectorField('Elem neve', node.name, (value) => execute(state, { type: 'element.update', payload: { id: node.id, changes: { name: value } } })),
      inspectorField('Szélesség', node.style?.width || 'auto', (value) => execute(state, { type: 'style.set', payload: { id: node.id, styles: { width: value } } })),
      inspectorField('Magasság', node.style?.height || 'auto', (value) => execute(state, { type: 'style.set', payload: { id: node.id, styles: { height: value } } }))
    );
  } else if (inspectorTab === 'content') {
    inspector.append(
      inspectorField('Szöveg', node.props?.text || '', (value) => execute(state, { type: 'content.set', payload: { id: node.id, content: { text: value } } })),
      inspectorField('Link / URL', node.props?.href || '', (value) => execute(state, { type: 'element.update', payload: { id: node.id, changes: { props: { ...(node.props || {}), href: value } } }))
    );
  } else {
    inspector.append(
      inspectorField('Node ID', node.id, () => {}),
      inspectorField('Típus', node.type, () => {}),
      inspectorField('Szülő ID', node.parentId || '', () => {})
    );
  }
}

function renderLayers() {
  const root = $('#layersTree');
  const currentPage = page();
  if (!root || !currentPage) return;
  root.replaceChildren();
  const walk = (id, depth = 0) => {
    const node = getNode(currentPage, id);
    if (!node) return;
    const row = document.createElement('button');
    row.type = 'button';
    row.className = `layer-row ${state.selection.primaryId === id ? 'active' : ''}`;
    row.style.paddingLeft = `${8 + depth * 14}px`;
    row.innerHTML = `<span>${node.children?.length ? '▸' : '·'}</span><strong>${node.name || node.type}</strong><small>${node.type}</small>`;
    row.onclick = () => { setSelection(state, [id]); render(); };
    root.append(row);
    for (const child of node.children || []) walk(child, depth + 1);
  };
  walk(currentPage.rootId);
}

function renderPageList() {
  const select = $('#pageSelect');
  const list = $('#pageList');
  select.replaceChildren();
  list.replaceChildren();
  for (const item of pages) {
    const option = document.createElement('option');
    option.value = item.id;
    option.textContent = item.title || item.slug;
    option.selected = item.id === page()?.id;
    select.append(option);
    const row = document.createElement('button');
    row.type = 'button';
    row.className = `page-row ${item.id === page()?.id ? 'active' : ''}`;
    row.innerHTML = `<span class="page-icon">▧</span><strong>${item.title || item.slug}</strong><small class="page-meta">${item.isPublished ? 'LIVE' : 'DRAFT'}</small>`;
    row.onclick = () => loadPage(item.id);
    list.append(row);
  }
}

function render() {
  renderCanvas();
  renderInspector();
  renderLayers();
  if (state) {
    $('#selection').textContent = `Kijelölés: ${state.selection.primaryId || '—'}`;
    $('#revision').textContent = `Revision: ${page()?.revision ?? 0}`;
    setStatus(state.persistence.dirty ? 'Nem mentett módosítás' : 'Mentve');
  }
}

async function loadPages() {
  const data = await api('/api/admin/pages');
  if (!Array.isArray(data.data)) throw new Error('Hibás oldallistázó válasz');
  pages = data.data;
  renderPageList();
}

async function loadPage(id) {
  setStatus('Oldal betöltése…');
  const meta = pages.find((item) => item.id === id);
  if (!meta) throw new Error('Az oldal nem található a betöltött listában.');
  // A pages GET már a teljes canonical dokumentumot adja. Ezt használjuk elsődlegesen,
  // így egy régi/migráció alatt álló editor GET nem tudja blokkolni az oldalváltást.
  if (!canonical(meta.content, id)) {
    setStatus('Hiba');
    throw new Error(`Az oldal (${meta.title || meta.slug}) dokumentuma még nem érvényes Editor v2 dokumentum.`);
  }
  state = createEditorState(meta.content);
  markSaved(state);
  renderPageList();
  render();
  setStatus('Mentve');
}

async function createNew() {
  const title = prompt('Új oldal neve', 'Új oldal');
  if (!title) return;
  const slug = prompt('Slug', title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
  if (!slug) return;
  const newPage = createPage({ name: title, slug });
  await api('/api/admin/pages', { method: 'POST', body: JSON.stringify({ id: newPage.id, title, slug, description: '', document: createDocument(newPage) }) });
  await loadPages();
  await loadPage(newPage.id);
}

async function save(publish = false) {
  const currentPage = page();
  if (!currentPage) return;
  setStatus(publish ? 'Publikálás…' : 'Mentés…');
  try {
    await api(`/api/admin/editor?pageId=${encodeURIComponent(currentPage.id)}`, { method: 'POST', body: JSON.stringify({ pageId: currentPage.id, document: state.document, publish, note: publish ? 'Editor v2 publikálás' : 'Editor v2 mentés' }) });
    const index = pages.findIndex((item) => item.id === currentPage.id);
    if (index >= 0) pages[index] = { ...pages[index], content: state.document, isPublished: publish || pages[index].isPublished };
    markSaved(state);
    renderPageList();
    setStatus(publish ? 'Publikálva' : 'Mentve');
  } catch (error) {
    setStatus('Mentési hiba');
    alert(error.message);
  }
}

$('#elementSearch').oninput = (event) => renderPalette(event.target.value);
$('#newPage').onclick = createNew;
$('#newPagePanel').onclick = createNew;
$('#pageSelect').onchange = (event) => loadPage(event.target.value).catch((error) => { setStatus('Hiba'); alert(error.message); });
$('#save').onclick = () => save(false);
$('#publish').onclick = () => save(true);
$('#preview').onclick = () => page() && window.open(`/p/${page().slug}`, '_blank', 'noopener');
$('#undo').onclick = () => { if (state) { execute(state, { type: 'history.undo' }); render(); } };
$('#redo').onclick = () => { if (state) { execute(state, { type: 'history.redo' }); render(); } };
$('#zoomIn').onclick = () => { zoom = Math.min(1.5, zoom + 0.1); render(); };
$('#zoomOut').onclick = () => { zoom = Math.max(0.35, zoom - 0.1); render(); };
$('#fitCanvas').onclick = () => { zoom = Math.max(0.35, Math.min(1.2, (canvas.clientWidth - 120) / sizes[state?.viewport?.device || 'desktop'])); render(); };
document.querySelectorAll('[data-device]').forEach((button) => button.onclick = () => { if (!state) return; state.viewport.device = button.dataset.device; document.querySelectorAll('[data-device]').forEach((item) => item.classList.toggle('active', item === button)); render(); });
document.querySelectorAll('.inspector-tabs button').forEach((button) => button.addEventListener('click', () => { inspectorTab = button.textContent.trim().toLowerCase(); document.querySelectorAll('.inspector-tabs button').forEach((item) => item.classList.toggle('active', item === button)); renderInspector(); }));

renderPalette();
render();
(async () => {
  try {
    await loadPages();
    if (pages[0]) await loadPage(pages[0].id);
    else { state = createEditorState(createDocument(createPage())); render(); setStatus('Nincs oldal'); }
  } catch (error) {
    setStatus('API hiba');
    console.error(error);
    render();
  }
})();
