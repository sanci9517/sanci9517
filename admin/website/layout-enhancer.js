import { getPages, savePages } from '../../core/page-state.js';

const ALIGNS = [['left', 'Balra'], ['center', 'Középre'], ['right', 'Jobbra']];
const WIDTHS = [['full', 'Teljes szélesség'], ['half', 'Fél szélesség'], ['third', 'Harmad szélesség'], ['quarter', 'Negyed szélesség'], ['auto', 'Automatikus']];
const ELEMENT_TYPES = new Set(['text', 'game', 'twitch', 'image', 'link', 'stats']);

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

function readElement(element) {
  const typeValue = element.querySelector('[name="element-type"]')?.value;
  const type = ELEMENT_TYPES.has(typeValue) ? typeValue : 'text';
  return {
    id: element.dataset.element || `element-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    title: element.querySelector('[name="element-title"]')?.value.trim() || '',
    content: element.querySelector('[name="element-content"]')?.value.trim() || '',
    width: element.querySelector('[data-layout-width]')?.value || 'full',
    align: element.querySelector('[data-layout-align]')?.value || 'left',
  };
}

function readBlock(block) {
  const elements = [...block.querySelectorAll('[data-element]')].map(readElement);
  const first = elements[0] || { type: 'text' };
  return {
    id: block.dataset.block || `block-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type: first.type,
    title: block.querySelector('[name="block-title"]')?.value.trim() || 'Box',
    content: '',
    width: block.querySelector('[data-layout-width]')?.value || 'full',
    elements: elements.length ? elements : [{ id: `element-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, type: 'text', title: '', content: '', width: 'full', align: 'left' }],
  };
}

function persistPageForm(form) {
  const pageId = form.querySelector('[name="id"]')?.value;
  if (!pageId) return false;

  const pages = getPages();
  const index = pages.findIndex((page) => page.id === pageId);
  if (index < 0) return false;

  const current = pages[index];
  pages[index] = {
    ...current,
    title: form.querySelector('[name="title"]')?.value.trim() || current.title,
    content: form.querySelector('[name="content"]')?.value.trim() || '',
    blocks: [...form.querySelectorAll('[data-block]')].map(readBlock),
  };

  return savePages(pages);
}

function start() {
  const observer = new MutationObserver(() => enhance(document));
  observer.observe(document.body, { childList: true, subtree: true });
  enhance(document);
  document.addEventListener('submit', (event) => {
    if (!event.target.matches('[data-page-form]')) return;
    setTimeout(() => {
      persistPageForm(event.target);
      enhance(document);
    }, 0);
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
else start();
