import { getPages, savePages } from '../../core/page-state.js';

const ALIGNS = [['left', 'Balra'], ['center', 'Középre'], ['right', 'Jobbra']];
const WIDTHS = [['full', 'Teljes szélesség'], ['half', 'Fél szélesség'], ['third', 'Harmad szélesség'], ['quarter', 'Negyed szélesség'], ['auto', 'Automatikus']];

function widthControl(savedWidth = 'full', label = 'Elem szélessége', attribute = 'data-layout-width') {
  return `<label class="admin-form-field"><span>${label}</span><select ${attribute}>${WIDTHS.map(([value, text]) => `<option value="${value}" ${value === savedWidth ? 'selected' : ''}>${text}</option>`).join('')}</select></label>`;
}

function alignControl(savedAlign = 'left') {
  return `<label class="admin-form-field"><span>Elem igazítása</span><select data-layout-align>${ALIGNS.map(([value, text]) => `<option value="${value}" ${value === savedAlign ? 'selected' : ''}>${text}</option>`).join('')}</select></label>`;
}

function enhance(root = document) {
  root.querySelectorAll('[data-block]').forEach((block) => {
    if (block.querySelector('[data-box-layout-settings]')) return;
    const controls = document.createElement('div');
    controls.dataset.boxLayoutSettings = 'true';
    controls.className = 'admin-element-layout-settings admin-box-layout-settings';
    const saved = findSavedBlock(block);
    controls.innerHTML = widthControl(saved?.width || 'full', 'Box szélessége', 'data-layout-width');
    const title = block.querySelector('[name="block-title"]');
    (title?.parentElement || block).after(controls);
  });

  root.querySelectorAll('[data-element]').forEach((element) => {
    if (element.querySelector('[data-element-layout-settings]')) return;
    const controls = document.createElement('div');
    controls.dataset.elementLayoutSettings = 'true';
    controls.className = 'admin-element-layout-settings';
    const saved = findSavedElement(element);
    controls.innerHTML = widthControl(saved?.width || 'full') + alignControl(saved?.align || 'left');
    const fields = element.querySelector('[data-element-fields]');
    (fields || element).appendChild(controls);
  });
}

function findSavedBlock(element) {
  const id = element.dataset.block;
  for (const page of getPages()) {
    const found = (page.blocks || []).find((block) => block.id === id);
    if (found) return found;
  }
  return null;
}

function findSavedElement(element) {
  const id = element.dataset.element;
  for (const page of getPages()) for (const block of page.blocks || []) {
    const found = (block.elements || []).find((item) => item.id === id);
    if (found) return found;
  }
  return null;
}

function persistLayout(form) {
  const pages = getPages();
  const pageId = form.querySelector('[name="id"]')?.value;
  const page = pages.find((item) => item.id === pageId);
  if (!page) return;

  const blocksById = new Map();
  form.querySelectorAll('[data-block]').forEach((block) => {
    blocksById.set(block.dataset.block, { width: block.querySelector('[data-layout-width]')?.value || 'full' });
  });

  const elementsById = new Map();
  form.querySelectorAll('[data-element]').forEach((element) => {
    elementsById.set(element.dataset.element, {
      width: element.querySelector('[data-layout-width]')?.value || 'full',
      align: element.querySelector('[data-layout-align]')?.value || 'left',
    });
  });

  page.blocks = (page.blocks || []).map((block) => ({
    ...block,
    ...(blocksById.get(block.id) || {}),
    elements: (block.elements || []).map((element) => ({ ...element, ...(elementsById.get(element.id) || {}) })),
  }));
  savePages(pages);
}

function start() {
  const observer = new MutationObserver(() => enhance(document));
  observer.observe(document.body, { childList: true, subtree: true });
  enhance(document);
  document.addEventListener('submit', (event) => {
    if (event.target.matches('[data-page-form]')) setTimeout(() => persistLayout(event.target), 0);
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
else start();
