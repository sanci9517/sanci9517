import { Header } from '../components/header.js';
import { Card } from '../components/card.js';

export function renderHome(root, site) {
  root.innerHTML = `
    ${Header(site)}
    <main class="page-shell">
      <section class="hero section">
        <div class="hero-copy">
          <span class="eyebrow">SANCi9517 · STREAMER</span>
          <h1>A streamem.<br><span>Egy helyen.</span></h1>
          <p>${site.description}</p>
          <div class="actions">
            <a class="button button-primary" href="${site.links.twitch}" target="_blank" rel="noopener">Twitch megnyitása</a>
          </div>
        </div>
        ${Card('Twitch', '<span class="status-dot"></span> Integráció előkészítve', 'A Twitch kapcsolat a következő fejlesztési fázisban kerül bekötésre.')}
      </section>
    </main>
    <footer class="site-footer">© ${new Date().getFullYear()} ${site.brand}</footer>
  `;
}
