import { Header } from '../components/header.js';

export function renderHome(root, site) {
  root.innerHTML = `
    <div class="home-page">
      ${Header(site)}
      <main class="page-shell">
        <section class="home-hero section" aria-labelledby="home-title">
          <div class="home-copy">
            <span class="eyebrow">SANCi9517 · STREAMER</span>
            <h1 id="home-title" class="home-title">A streamem.<br><span>Egy helyen.</span></h1>
            <p class="home-lead">${site.description}</p>
            <div class="actions home-actions">
              <a class="button button-primary" href="${site.links.twitch}" target="_blank" rel="noopener noreferrer">Twitch megnyitása</a>
            </div>
          </div>

          <aside class="home-panel" aria-label="Stream állapot">
            <div class="home-panel-top">
              <span class="home-panel-label">Sanci9517 Live rendszer</span>
              <span class="badge home-live-badge"><span class="status-dot"></span>Előkészítve</span>
            </div>
            <div class="home-panel-main">
              <h2>A következő szint itt kezdődik.</h2>
              <p>A Twitch kapcsolat, élő állapot, statisztikák és további funkciók modulárisan érkeznek a következő fejlesztési fázisokban.</p>
            </div>
            <div class="home-panel-bottom">Twitch integráció · következő fázis</div>
          </aside>
        </section>
      </main>
      <footer class="site-footer">© ${new Date().getFullYear()} ${site.brand}</footer>
    </div>
  `;
}
