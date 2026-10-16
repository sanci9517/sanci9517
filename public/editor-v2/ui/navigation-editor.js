const $ = selector => document.querySelector(selector);
const list = $('#navigationItemList');
const status = $('#navigationStatus');
if (list && status) {
  const state = { tree: { schemaVersion: 1, items: [] }, pages: [], revision: 0, publishedRevision: 0, dirty: false, busy: false };
  const request = async (method = 'GET', body) => {
    const response = await fetch('/api/admin/navigation', { method, credentials: 'same-origin', cache: 'no-store', headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
    let payload = {};
    try { payload = await response.json(); } catch {}
    if (!response.ok || payload.ok === false) {
      const error = new Error(payload?.error?.message || `Szerverhiba (${response.status})`);
      error.code = payload?.error?.code;
      throw error;
    }
    return payload.data;
  };
  const pageMap = () => new Map(state.pages.map(page => [page.id, page]));
  const titleFor = item => item.label || (item.type === 'page' ? (pageMap().get(item.pageId)?.title || pageMap().get(item.pageId)?.slug || 'Hiányzó oldal') : item.url);
  const clone = value => JSON.parse(JSON.stringify(value));
  const siblingList = parentPath => parentPath.reduce((items, index) => items[index]?.children || [], state.tree.items);
  function setDirty() { state.dirty = true; render(); }
  function button(text, label, action, disabled = false) {
    const element = document.createElement('button');
    element.type = 'button'; element.textContent = text; element.setAttribute('aria-label', label); element.title = label; element.disabled = disabled || state.busy;
    element.addEventListener('click', action); return element;
  }
  function renderItems(items, parentPath = [], depth = 0) {
    const group = document.createElement('ul'); group.className = 'navigation-tree-list';
    items.forEach((item, index) => {
      const path = [...parentPath, index]; const row = document.createElement('li'); row.className = 'navigation-tree-item';
      const title = document.createElement('strong'); title.className = 'navigation-item-title'; title.textContent = titleFor(item);
      const detail = document.createElement('small'); detail.textContent = item.type === 'page' ? (pageMap().get(item.pageId)?.isPublished ? 'Oldal' : 'Piszkozat oldal') : 'Külső hivatkozás';
      const heading = document.createElement('div'); heading.className = 'navigation-item-heading'; heading.style.setProperty('--tree-depth', String(depth)); heading.append(title, detail);
      const actions = document.createElement('div'); actions.className = 'navigation-item-controls';
      actions.append(
        button('↑', 'Mozgatás feljebb', () => move(path, -1), index === 0),
        button('↓', 'Mozgatás lejjebb', () => move(path, 1), index === items.length - 1),
        button('→', 'Beágyazás az előző menüpont alá', () => nest(path), index === 0 || path.length >= 5),
        button('←', 'Visszaemelés a főszintre', () => outdent(path), parentPath.length === 0),
        button('Név', 'Menüpont felirata', () => editLabel(item)),
        button('Törlés', 'Menüpont törlése', () => { if (confirm('Törlöd ezt a menüpontot és az almenüit?')) remove(path); })
      );
      row.append(heading, actions);
      if (item.children?.length) row.append(renderItems(item.children, path, depth + 1));
      group.append(row);
    });
    return group;
  }
  function render() {
    list.replaceChildren();
    if (!state.tree.items.length) { const empty = document.createElement('p'); empty.className = 'navigation-tree-empty'; empty.textContent = 'A menü üres. Adj hozzá oldalt vagy külső hivatkozást.'; list.append(empty); }
    else list.append(renderItems(state.tree.items));
    $('#navigationSave').disabled = state.busy || !state.dirty;
    $('#navigationPublish').disabled = state.busy || state.dirty || state.revision === state.publishedRevision;
    $('#navigationAddPage').disabled = state.busy || !$('#navigationPageSelect').value;
    $('#navigationAddExternal').disabled = state.busy;
    $('#navigationReload').hidden = !state.conflict;
  }
  function editLabel(item) {
    const current = item.label || (item.type === 'page' ? pageMap().get(item.pageId)?.title || '' : item.url || '');
    const value = prompt('Navigációs felirat', current);
    if (value === null) return;
    const label = value.trim();
    if (item.type === 'external' && !label) { status.textContent = 'A külső hivatkozás felirata kötelező.'; return; }
    item.label = label || undefined; setDirty();
  }
  function move(path, delta) {
    const siblings = siblingList(path.slice(0, -1)); const index = path[path.length - 1];
    const target = index + delta; if (target < 0 || target >= siblings.length) return;
    [siblings[index], siblings[target]] = [siblings[target], siblings[index]]; setDirty();
  }
  function nest(path) {
    const siblings = siblingList(path.slice(0, -1)); const index = path[path.length - 1]; if (index < 1) return;
    const [item] = siblings.splice(index, 1); siblings[index - 1].children.push(item); setDirty();
  }
  function outdent(path) {
    const parentPath = path.slice(0, -1); if (!parentPath.length) return;
    const parentSiblings = siblingList(parentPath.slice(0, -1)); const parentIndex = parentPath[parentPath.length - 1];
    const children = parentSiblings[parentIndex]?.children; if (!children) return;
    const [item] = children.splice(path[path.length - 1], 1); parentSiblings.splice(parentIndex + 1, 0, item); setDirty();
  }
  function remove(path) {
    const siblings = siblingList(path.slice(0, -1)); siblings.splice(path[path.length - 1], 1); setDirty();
  }
  function addPage() {
    const select = $('#navigationPageSelect'); const pageId = select.value; const page = pageMap().get(pageId); if (!page) return;
    state.tree.items.push({ id: `nav-${crypto.randomUUID()}`, type: 'page', pageId, children: [] });
    select.value = ''; setDirty();
  }
  function addExternal() {
    const label = prompt('Menüpont felirata:'); if (label === null) return;
    const url = prompt('Külső HTTPS hivatkozás:'); if (url === null) return;
    state.tree.items.push({ id: `nav-${crypto.randomUUID()}`, type: 'external', label: label.trim(), url: url.trim(), children: [] }); setDirty();
  }
  async function load() {
    state.busy = true; render(); status.textContent = 'Navigáció betöltése…';
    try {
      const data = await request();
      if (!data.draft || data.draft.schemaVersion !== 1 || !Array.isArray(data.draft.items)) throw new Error('A szerver navigációs adata nem olvasható. A piszkozatot nem írtuk felül.');
      state.tree = data.draft; state.pages = data.pages || [];
      state.revision = Number(data.revision || 1); state.publishedRevision = Number(data.publishedRevision || 0); state.dirty = false; state.conflict = false;
      const select = $('#navigationPageSelect'); select.replaceChildren(new Option('Válassz oldalt…', ''));
      for (const page of state.pages) { const option = new Option(`${page.title} · ${page.isPublished ? 'publikált' : 'piszkozat'}`, page.id); select.append(option); }
      status.textContent = `Betöltve · piszkozat v${state.revision} · publikált v${state.publishedRevision}`;
    } catch (error) { status.textContent = error.message; }
    finally { state.busy = false; render(); }
  }
  async function save() {
    state.busy = true; state.conflict = false; status.textContent = 'Piszkozat mentése…'; render();
    try {
      const data = await request('PUT', { tree: state.tree, expectedRevision: state.revision });
      state.tree = data.draft; state.revision = data.revision; state.publishedRevision = data.publishedRevision; state.dirty = false;
      status.textContent = `Piszkozat mentve · v${state.revision}`;
    } catch (error) { state.conflict = error.code === 'REVISION_CONFLICT'; status.textContent = error.message; }
    finally { state.busy = false; render(); }
  }
  async function publish() {
    state.busy = true; state.conflict = false; status.textContent = 'Navigáció publikálása…'; render();
    try {
      const data = await request('POST', { action: 'publish', expectedRevision: state.revision });
      state.publishedRevision = data.publishedRevision; status.textContent = `Navigáció publikálva · v${state.publishedRevision}`;
    } catch (error) { state.conflict = error.code === 'REVISION_CONFLICT'; status.textContent = error.message; }
    finally { state.busy = false; render(); }
  }
  $('#navigationPageSelect')?.addEventListener('change', render);
  $('#navigationAddPage')?.addEventListener('click', addPage);
  $('#navigationAddExternal')?.addEventListener('click', addExternal);
  $('#navigationSave')?.addEventListener('click', save);
  $('#navigationPublish')?.addEventListener('click', publish);
  $('#navigationReload')?.addEventListener('click', () => { if (state.dirty && !confirm('A helyi navigációs módosítások elvesznek. Betöltöd a szerver legfrissebb verzióját?')) return; load(); });
  load();
}
