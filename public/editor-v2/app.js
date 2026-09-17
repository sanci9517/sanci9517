import { createDocument, getPage, getNode, getChildren, NODE_TYPES } from './core/schema.js';
import { createEditorState, activePage, selectedNodes, setSelection, clearSelection, markSaved } from './core/state.js';
import { execute } from './core/commands.js';

const state = createEditorState(createDocument());
const canvas = document.querySelector('#canvas');
const inspector = document.querySelector('#inspectorBody');
const selectionLabel = document.querySelector('#selection');
const revisionLabel = document.querySelector('#revision');
const saveStatus = document.querySelector('#saveStatus');
const zoomLabel = document.querySelector('#zoom');
let zoom = 1;

const palette = [
  ['Alap', [
    ['Section', NODE_TYPES.SECTION], ['Container', NODE_TYPES.CONTAINER], ['Stack', NODE_TYPES.STACK], ['Group', NODE_TYPES.GROUP],
    ['Cím', NODE_TYPES.HEADING], ['Szöveg', NODE_TYPES.TEXT], ['Gomb', NODE_TYPES.BUTTON], ['Link', NODE_TYPES.LINK]
  ]],
  ['Elrendezés', [['Flex', NODE_TYPES.FLEX], ['Grid', NODE_TYPES.GRID], ['Sor', NODE_TYPES.ROW], ['Oszlopok', NODE_TYPES.COLUMNS], ['Spacer', NODE_TYPES.SPACER]]],
  ['Média', [['Kép', NODE_TYPES.IMAGE], ['Videó', NODE_TYPES.VIDEO], ['Galéria', NODE_TYPES.GALLERY], ['Embed', NODE_TYPES.EMBED], ['Iframe', NODE_TYPES.IFRAME]]],
  ['Sanci9517', [['Twitch', NODE_TYPES.TWITCH], ['YouTube', NODE_TYPES.YOUTUBE], ['TikTok', NODE_TYPES.TIKTOK], ['Discord', NODE_TYPES.DISCORD], ['Adásrend', NODE_TYPES.SCHEDULE], ['VOD', NODE_TYPES.VOD], ['Támogatás', NODE_TYPES.SUPPORT], ['Közösség', NODE_TYPES.COMMUNITY], ['Élő állapot', NODE_TYPES.LIVE], ['Visszaszámláló', NODE_TYPES.COUNTDOWN]]]
];

function renderPalette(filter = '') {
  const root = document.querySelector('#elementList');
  root.replaceChildren();
  for (const [group, items] of palette) {
    const matches = items.filter(([name]) => name.toLowerCase().includes(filter.toLowerCase()));
    if (!matches.length) continue;
    const section = document.createElement('section'); section.className = 'element-group';
    const title = document.createElement('h3'); title.textContent = group; section.append(title);
    for (const [name, type] of matches) {
      const button = document.createElement('button'); button.className = 'element'; button.textContent = name;
      button.onclick = () => addElement(type, name); section.append(button);
    }
    root.append(section);
  }
}

function addElement(type, name) {
  const page = activePage(state);
  const parentId = state.selection.primaryId || page.rootId;
  execute(state, { type: 'element.add', payload: { type, name, parentId, props: { text: name } } });
  render();
}

function renderNode(page, nodeId) {
  const node = getNode(page, nodeId); if (!node) return null;
  const el = document.createElement('div');
  el.className = `node ${node.type}${state.selection.ids.includes(node.id) ? ' selected' : ''}`;
  el.dataset.nodeId = node.id;
  const label = document.createElement('div'); label.className = 'node-label'; label.textContent = `${node.name} · ${node.type}`; el.append(label);
  const content = document.createElement('div'); content.className = 'node-content';
  if ([NODE_TYPES.HEADING, NODE_TYPES.TEXT, NODE_TYPES.BUTTON, NODE_TYPES.LINK].includes(node.type)) content.textContent = node.props.text || node.name;
  else content.textContent = node.children.length ? '' : node.name;
  el.append(content);
  for (const childId of node.children) { const child = renderNode(page, childId); if (child) el.append(child); }
  el.onclick = (event) => { event.stopPropagation(); setSelection(state, [node.id]); render(); };
  return el;
}

function renderCanvas() {
  const page = activePage(state); canvas.replaceChildren();
  const pageCanvas = document.createElement('div'); pageCanvas.className = 'page-canvas'; pageCanvas.style.transform = `scale(${zoom})`; pageCanvas.style.transformOrigin = 'top center';
  pageCanvas.append(renderNode(page, page.rootId)); canvas.append(pageCanvas);
  canvas.onclick = () => { clearSelection(state); render(); };
}

function renderInspector() {
  const nodes = selectedNodes(state); inspector.replaceChildren();
  if (!nodes.length) { inspector.textContent = 'Válassz ki egy elemet.'; return; }
  const node = nodes[0];
  const title = document.createElement('div'); title.className = 'field'; title.textContent = `${node.name} · ${node.type}`; inspector.append(title);
  for (const [labelText, key, value] of [['Név','name',node.name],['Szöveg','text',node.props.text || '']]) {
    const field = document.createElement('div'); field.className = 'field'; const label = document.createElement('label'); label.textContent = labelText; const input = document.createElement('input'); input.value = value;
    input.onchange = () => { if (key === 'name') execute(state, { type:'element.update', payload:{ id:node.id, changes:{name:input.value} } }); else execute(state,{type:'content.set',payload:{id:node.id,content:{text:input.value}}}); render(); }; field.append(label,input); inspector.append(field);
  }
}

function render() {
  renderCanvas(); renderInspector();
  selectionLabel.textContent = `Kijelölés: ${state.selection.primaryId || '—'}`;
  revisionLabel.textContent = `Revision: ${activePage(state).revision}`;
  saveStatus.textContent = state.persistence.dirty ? 'Nem mentett módosítás' : 'Mentve';
  zoomLabel.textContent = `${Math.round(zoom * 100)}%`;
}

document.querySelector('#elementSearch').oninput = (e) => renderPalette(e.target.value);
document.querySelector('#undo').onclick = () => { execute(state,{type:'history.undo'}); render(); };
document.querySelector('#redo').onclick = () => { execute(state,{type:'history.redo'}); render(); };
document.querySelector('#zoomIn').onclick = () => { zoom=Math.min(1.5,zoom+.1); render(); };
document.querySelector('#zoomOut').onclick = () => { zoom=Math.max(.5,zoom-.1); render(); };
for (const button of document.querySelectorAll('[data-device]')) button.onclick = () => { state.viewport.device = button.dataset.device; render(); };
document.querySelector('#save').onclick = () => { markSaved(state); render(); };
document.querySelector('#preview').onclick = () => window.open(`/p/${activePage(state).slug}`, '_blank', 'noopener');
document.querySelector('#publish').onclick = () => { alert('A publikálási API bekötése a következő persistence/publish lépésben történik.'); };
document.querySelector('#newPage').onclick = () => alert('Az oldal CRUD bekötése a Page lifecycle lépésben következik.');

renderPalette(); render();
