import { Header } from '../components/header.js';
import { loadTwitchStatus } from '../twitch/status.js';
import { getPageByPath } from '../core/page-state.js';

const ELEMENT_TYPES = new Set(['text', 'game', 'twitch', 'image', 'link', 'stats']);
const ELEMENT_ALIGNS = new Set(['left', 'center', 'right']);
const ELEMENT_WIDTHS = new Set(['full', 'half']);

export function renderHome(root, site) {
  const page = getPageByPath('/');
  const title = page?.title || 'A streamem. Egy helyen.';
  const content = page?.content || site.description;
  const blocks = Array.isArray(page?.blocks) ? page.blocks : [];

  root.innerHTML = `
    <div class="home-page">
      ${Header(site)}
      <main class="page-shell">
        <section class="home-hero section" aria-labelledby="home-title">
          <div class="home-copy">
            <span class="eyebrow">SANCi9517 · STREAMER</span>
            <h1 id="home-title" class="home-title">${escapeHtml(title)}</h1>
            <p class="home-lead">${escapeHtml(content)}</p>
            <div class="actions home-actions"><a class="button button-primary" href="${escapeHtml(site.links.twitch)}" target="_blank" rel="noopener noreferrer">Twitch megnyitása</a></div>
          </div>
          <aside class="home-panel" aria-label="Stream állapot" data-twitch-panel>
            <div class="home-panel-top"><span class="home-panel-label">Sanci9517 Live rendszer</span><span class="badge home-live-badge"><span class="status-dot"></span><span data-twitch-state>Betöltés…</span></span></div>
            <div class="home-panel-main"><h2 data-twitch-title>Twitch állapot ellenőrzése</h2><p data-twitch-details>A rendszer lekéri a Sanci9517 csatorna aktuális állapotát.</p></div>
            <div class="home-panel-bottom" data-twitch-meta>Twitch integráció · élő állapot</div>
          </aside>
        </section>
        ${renderBlocks(blocks)}
      </main>
      <footer class="site-footer">© ${new Date().getFullYear()} ${escapeHtml(site.brand)}</footer>
    </div>
  `;
  updateTwitchPanel(root);
}

function renderBlocks(blocks) {
  if (!blocks.length) return '';
  return `<section class="page-blocks" aria-label="Főoldal boxai">${blocks.map(renderBlock).join('')}</section>`;
}

function renderBlock(block) {
  const title = escapeHtml(block?.title || 'Box');
  const elements = Array.isArray(block?.elements) && block.elements.length
    ? block.elements
    : [{ type: block?.type || 'text', title: block?.title || '', content: block?.content || '' }];
  return `<article class="card page-block composite-block"><div class="card-label">${title}</div><div class="composite-elements">${elements.map(renderElement).join('')}</div></article>`;
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
  if (type === 'link') return `<div class="composite-element composite-element-link ${layoutClass}">${isHttpUrl(content) ? `<a class="button button-primary" href="${escapeHtml(content)}" target="_blank" rel="noopener noreferrer">${escapeHtml(title || 'Megnyitás')} ↗</a>` : `<div class="block-placeholder">Érvényes URL nincs megadva.</div>`}</div>`;
  if (type === 'stats') return `<div class="composite-element composite-element-stats ${layoutClass}"><span class="block-stat-value">${escapeHtml(content || '0')}</span><span class="block-stat-label">${escapeHtml(title || 'Statisztika')}</span></div>`;
  return `<div class="composite-element composite-element-text ${layoutClass}">${title ? `<strong>${escapeHtml(title)}</strong>` : ''}${formatContent(content)}</div>`;
}

async function updateTwitchPanel(root) {
  const state = root.querySelector('[data-twitch-state]'); const title = root.querySelector('[data-twitch-title]'); const details = root.querySelector('[data-twitch-details]'); const meta = root.querySelector('[data-twitch-meta]');
  try {
    const result = await loadTwitchStatus(); const stream = result?.stream;
    if (!stream) { state.textContent = 'Offline'; title.textContent = 'Jelenleg nincs élő adás.'; details.textContent = 'A következő élő adáskor ez a panel automatikusan frissíthető.'; meta.textContent = 'Twitch · offline'; }
    else { state.textContent = 'LIVE'; title.textContent = stream.title || 'Sanci9517 élő adása'; details.textContent = `${stream.gameName || 'Játék'} · ${stream.viewerCount.toLocaleString('hu-HU')} néző`; meta.textContent = `Twitch · élő · ${formatStartedAt(stream.startedAt)}`; }
  } catch (error) { console.error('[Sanci9517] Twitch status error:', error); state.textContent = 'Nem elérhető'; title.textContent = 'Twitch kapcsolat ellenőrzése szükséges.'; details.textContent = 'Az oldal többi része ettől függetlenül működik.'; meta.textContent = 'Twitch · kapcsolat hiba'; }
  updateTwitchElements(root);
}

async function updateTwitchElements(root) {
  const elements = root.querySelectorAll('[data-twitch-element]');
  if (!elements.length) return;
  try {
    const result = await loadTwitchStatus(); const stream = result?.stream;
    elements.forEach((element) => { const target = element.querySelector('[data-twitch-element-content]'); if (target) target.textContent = stream ? `🔴 LIVE · ${stream.gameName || 'Játék'} · ${Number(stream.viewerCount || 0).toLocaleString('hu-HU')} néző` : '⚫ Jelenleg offline'; });
  } catch { elements.forEach((element) => { const target = element.querySelector('[data-twitch-element-content]'); if (target) target.textContent = 'Twitch állapot jelenleg nem érhető el.'; }); }
}

function isHttpUrl(value) { return /^https?:\/\//i.test(value); }
function isImageUrl(value) { return isHttpUrl(value) && /\.(?:png|jpe?g|gif|webp|svg)(?:[?#].*)?$/i.test(value); }
function formatContent(value) { return escapeHtml(value).split(/\n{2,}/).map((paragraph) => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`).join(''); }
function formatStartedAt(value) { if (!value) return 'időpont nélkül'; const date = new Date(value); if (Number.isNaN(date.getTime())) return 'időpont nélkül'; return date.toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' }); }
function escapeHtml(value) { return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;'); }
