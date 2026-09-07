import { Header } from '../components/header.js';
import { loadTwitchStatus } from '../twitch/status.js';

const ELEMENT_TYPES = new Set(['text', 'game', 'twitch', 'image', 'link', 'stats']);
const ELEMENT_ALIGNS = new Set(['left', 'center', 'right']);
const ELEMENT_WIDTHS = new Set(['full', 'half']);

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
  updateTwitchElements(root);
}

function renderBlocks(blocks) {
  if (!blocks.length) return '';
  return `<section class="page-blocks" aria-label="Oldal boxai">${blocks.map(renderBlock).join('')}</section>`;
}

function renderBlock(block) {
  const title = escapeHtml(block?.title || 'Box');
  const elements = Array.isArray(block?.elements) && block.elements.length
    ? block.elements
    : [{ type: block?.type || 'text', title: block?.title || '', content: block?.content || '' }];

  return `<article class="card page-block composite-block">
    <div class="card-label">${title}</div>
    <div class="composite-elements">${elements.map(renderElement).join('')}</div>
  </article>`;
}

function renderElement(element) {
  const type = ELEMENT_TYPES.has(element?.type) ? element.type : 'text';
  const align = ELEMENT_ALIGNS.has(element?.align) ? element.align : 'left';
  const width = ELEMENT_WIDTHS.has(element?.width) ? element.width : 'full';
  const layoutClass = `composite-align-${align} composite-width-${width}`;
  const title = String(element?.title || '').trim();
  const content = String(element?.content || '').trim();

  if (type === 'game') return `<div class="composite-element composite-element-game ${layoutClass}"><span class="composite-element-icon">🎮</span><div><strong>${escapeHtml(title || 'Játék')}</strong><p>${escapeHtml(content || 'Nincs megadva')}</p></div></div>`;
  if (type === 'twitch') return `<div class="composite-element composite-element-twitch ${layoutClass}" data-twitch-element><span class="composite-element-icon">●</span><div><strong>${escapeHtml(title || 'Twitch')}</strong><p data-twitch-element-content>Állapot betöltése…</p></div></div>`;
  if (type === 'image') return `<div class="composite-element composite-element-image ${layoutClass}">${isImageUrl(content) ? `<img src="${escapeHtml(content)}" alt="${escapeHtml(title || 'Kép')}" loading="lazy">` : `<div class="block-placeholder">Érvényes kép URL nincs megadva.</div>`}</div>`;
  if (type === 'link') {
    const label = title || 'Megnyitás';
    return `<div class="composite-element composite-element-link ${layoutClass}">${isHttpUrl(content) ? `<a class="button button-primary" href="${escapeHtml(content)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)} ↗</a>` : `<div class="block-placeholder">Érvényes URL nincs megadva.</div>`}</div>`;
  }
  if (type === 'stats') return `<div class="composite-element composite-element-stats ${layoutClass}"><span class="block-stat-value">${escapeHtml(content || '0')}</span><span class="block-stat-label">${escapeHtml(title || 'Statisztika')}</span></div>`;

  return `<div class="composite-element composite-element-text ${layoutClass}">${title ? `<strong>${escapeHtml(title)}</strong>` : ''}${formatContent(content)}</div>`;
}

async function updateTwitchElements(root) {
  const elements = root.querySelectorAll('[data-twitch-element]');
  if (!elements.length) return;
  try {
    const result = await loadTwitchStatus();
    const stream = result?.stream;
    elements.forEach((element) => {
      const target = element.querySelector('[data-twitch-element-content]');
      if (!target) return;
      target.textContent = stream ? `🔴 LIVE · ${stream.gameName || 'Játék'} · ${Number(stream.viewerCount || 0).toLocaleString('hu-HU')} néző` : '⚫ Jelenleg offline';
    });
  } catch {
    elements.forEach((element) => {
      const target = element.querySelector('[data-twitch-element-content]');
      if (target) target.textContent = 'Twitch állapot jelenleg nem érhető el.';
    });
  }
}

function isHttpUrl(value) { return /^https?:\/\//i.test(value); }
function isImageUrl(value) { return isHttpUrl(value) && /\.(?:png|jpe?g|gif|webp|svg)(?:[?#].*)?$/i.test(value); }
function formatContent(value) { return escapeHtml(value).split(/\n{2,}/).map((paragraph) => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`).join(''); }
function escapeHtml(value) { return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;'); }
