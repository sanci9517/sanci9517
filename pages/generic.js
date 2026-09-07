import { Header } from '../components/header.js';

export function renderGenericPage(root, site, page) {
  const title = page?.title || 'Új oldal';
  const path = page?.path || '/';
  const content = page?.content || site.description || '';
  const blocks = Array.isArray(page?.blocks) ? page.blocks : [];

  root.innerHTML = `
    <div class="generic-page">
      ${Header(site)}
      <main class="page-shell">
        <section class="section generic-page-content">
          <span class="eyebrow">Sanci · OLDAL</span>
          <h1>${escapeHtml(title)}</h1>
          <div class="generic-page-text">${formatContent(content)}</div>
          ${renderBlocks(blocks)}
          <div class="generic-page-meta">${escapeHtml(path)}</div>
        </section>
      </main>
      <footer class="site-footer">© ${new Date().getFullYear()} ${escapeHtml(site.brand)}</footer>
    </div>
  `;
}

function renderBlocks(blocks) {
  if (!blocks.length) return '';
  return `<section class="page-blocks" aria-label="Oldal boxai">${blocks.map((block) => `<article class="card page-block"><div class="card-label">${escapeHtml(block.title || 'Box')}</div><div class="card-content">${formatContent(block.content || '')}</div></article>`).join('')}</section>`;
}

function formatContent(value) {
  return escapeHtml(value).split(/\n{2,}/).map((paragraph) => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`).join('');
}

function escapeHtml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}
