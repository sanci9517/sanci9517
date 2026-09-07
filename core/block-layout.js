import { getPageByPath } from './page-state.js';
import { config } from './config.js';

const WIDTHS = new Set(['full', 'half', 'third', 'quarter', 'auto']);

function getCurrentRoutePath() {
  const pathname = normalizePath(window.location.pathname);
  const base = normalizePath(config.basePath || '/');
  if (pathname === base) return '/';
  if (pathname.startsWith(`${base}/`)) return normalizePath(pathname.slice(base.length));
  return pathname;
}

function normalizePath(path) {
  const clean = String(path || '/').split('?')[0].split('#')[0].trim();
  if (!clean) return '/';
  const withSlash = clean.startsWith('/') ? clean : `/${clean}`;
  return withSlash.replace(/\/+$/, '') || '/';
}

function apply(root = document) {
  const page = getPageByPath(getCurrentRoutePath());
  if (!page) return;

  const blocks = Array.isArray(page.blocks) ? page.blocks : [];
  root.querySelectorAll('.page-block').forEach((element, index) => {
    const block = blocks[index];
    const width = WIDTHS.has(block?.width) ? block.width : 'full';
    element.classList.remove(
      'page-block-width-full',
      'page-block-width-half',
      'page-block-width-third',
      'page-block-width-quarter',
      'page-block-width-auto'
    );
    element.classList.add(`page-block-width-${width}`);
  });
}

function start() {
  const observer = new MutationObserver(() => apply(document));
  observer.observe(document.body, { childList: true, subtree: true });
  apply(document);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start, { once: true });
} else {
  start();
}
