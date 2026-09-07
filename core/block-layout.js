import { getPageByPath } from './page-state.js';

const WIDTHS = new Set(['full', 'half', 'third', 'quarter', 'auto']);

function apply(root = document) {
  const page = getPageByPath(window.location.pathname);
  if (!page) return;
  const blocks = Array.isArray(page.blocks) ? page.blocks : [];
  root.querySelectorAll('.page-block').forEach((element, index) => {
    const block = blocks[index];
    const width = WIDTHS.has(block?.width) ? block.width : 'full';
    element.classList.remove('composite-width-full', 'composite-width-half', 'composite-width-third', 'composite-width-quarter', 'composite-width-auto');
    element.classList.add(`composite-width-${width}`);
  });
}

function start() {
  const observer = new MutationObserver(() => apply(document));
  observer.observe(document.body, { childList: true, subtree: true });
  apply(document);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
else start();
