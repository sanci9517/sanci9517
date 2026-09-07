import { getPages, savePages } from '../../core/page-state.js';

const ALIGNS = [
  ['left', 'Balra'],
  ['center', 'Középre'],
  ['right', 'Jobbra'],
];
const WIDTHS = [
  ['full', 'Teljes szélesség'],
  ['half', 'Fél szélesség'],
  ['third', 'Harmad szélesség'],
  ['quarter', 'Negyed szélesség'],
  ['auto', 'Automatikus'],
];

function enhance(root = document) {
  root.querySelectorAll('[data-element]').forEach((element) => {
    if (element.querySelector('[data-layout-settings]')) return;

    const controls = document.createElement('div');
    controls.dataset.layoutSettings = 'true';
    controls.className = 'admin-element-layout-settings';
    controls.innerHTML = `
      <label class="admin-form-field">
        <span>Elem szélessége</span>
        <select data-layout-width>
          ${WIDTHS.map(([value, label]) => `<option value="${value}">${label}</option>`).join('')}
        </select>
      </label>
      <label class="admin-form-field">
        <span>Elem igazítása</span>
        <select data-layout-align>
          ${ALIGNS.map(([value, label]) => `<option value="${value}">${label}</option>`).join('')}
        </select>
      </label>
    `;

    const fields = element.querySelector('[data-element-fields]');
    (fields || element).appendChild(controls);

    const saved = findSavedElement(element);
    controls.querySelector('[data-layout-width]').value = saved?.width || 'full';
    controls.querySelector('[data-layout-align]').value = saved?.align || 'left';
  });
}

function findSavedElement(element) {
  const id = element.dataset.element;
  for (const page of getPages()) {
    for (const block of page.blocks || []) {
      const found = (block.elements || []).find((item) => item.id === id);
      if (found) return found;
    }
  }
  return null;
}

function persistLayout(form) {
  const pages = getPages();
  const pageId = form.querySelector('[name="id"]')?.value;
  const page = pages.find((item) => item.id === pageId);
  if (!page) return;

  const elementsById = new Map();
  form.querySelectorAll('[data-element]').forEach((element) => {
    elementsById.set(element.dataset.element, {
      width: element.querySelector('[data-layout-width]')?.value || 'full',
      align: element.querySelector('[data-layout-align]')?.value || 'left',
    });
  });

  page.blocks = (page.blocks || []).map((block) => ({
    ...block,
    elements: (block.elements || []).map((element) => ({
      ...element,
      ...(elementsById.get(element.id) || {}),
    })),
  }));

  savePages(pages);
}

function start() {
  const observer = new MutationObserver(() => enhance(document));
  observer.observe(document.body, { childList: true, subtree: true });
  enhance(document);

  document.addEventListener('submit', (event) => {
    if (event.target.matches('[data-page-form]')) {
      setTimeout(() => persistLayout(event.target), 0);
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start, { once: true });
} else {
  start();
}
