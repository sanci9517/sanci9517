import { Header } from '../components/header.js';
import { loadTwitchStatus } from '../twitch/status.js';
import { getPageByPath } from '../core/page-state.js';

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
  return `<section class="page-blocks" aria-label="Főoldal boxai">${blocks.map((block) => `<article class="card page-block"><div class="card-label">${escapeHtml(block.title || 'Box')}</div><div class="card-content">${formatContent(block.content || '')}</div></article>`).join('')}</section>`;
}

function formatContent(value) { return escapeHtml(value).split(/\n{2,}/).map((paragraph) => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`).join(''); }

async function updateTwitchPanel(root) {
  const state = root.querySelector('[data-twitch-state]'); const title = root.querySelector('[data-twitch-title]'); const details = root.querySelector('[data-twitch-details]'); const meta = root.querySelector('[data-twitch-meta]');
  try {
    const result = await loadTwitchStatus(); const stream = result?.stream;
    if (!stream) { state.textContent = 'Offline'; title.textContent = 'Jelenleg nincs élő adás.'; details.textContent = 'A következő élő adáskor ez a panel automatikusan frissíthető.'; meta.textContent = 'Twitch · offline'; return; }
    state.textContent = 'LIVE'; title.textContent = stream.title || 'Sanci9517 élő adása'; details.textContent = `${stream.gameName || 'Játék'} · ${stream.viewerCount.toLocaleString('hu-HU')} néző`; meta.textContent = `Twitch · élő · ${formatStartedAt(stream.startedAt)}`;
  } catch (error) { console.error('[Sanci9517] Twitch status error:', error); state.textContent = 'Nem elérhető'; title.textContent = 'Twitch kapcsolat ellenőrzése szükséges.'; details.textContent = 'Az oldal többi része ettől függetlenül működik.'; meta.textContent = 'Twitch · kapcsolat hiba'; }
}

function formatStartedAt(value) { if (!value) return 'időpont nélkül'; const date = new Date(value); if (Number.isNaN(date.getTime())) return 'időpont nélkül'; return date.toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' }); }
function escapeHtml(value) { return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;'); }
