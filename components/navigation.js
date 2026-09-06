import { siteUrl } from '../core/config.js';
import { navigation } from '../data/navigation.js';

export function Navigation(site) {
  const items = navigation.map((item) => {
    if (item.type === 'external') {
      return `
        <a class="menu-link menu-link-external" href="${site.links[item.urlKey]}" target="_blank" rel="noopener noreferrer">
          <span>${item.label}</span>
          <span aria-hidden="true">↗</span>
        </a>
      `;
    }

    return `
      <a class="menu-link" href="${siteUrl(item.path)}" data-route>
        <span>${item.label}</span>
        <span class="menu-arrow" aria-hidden="true">→</span>
      </a>
    `;
  }).join('');

  return `
    <div class="navigation">
      <button class="menu-trigger" type="button" aria-expanded="false" aria-controls="site-menu">
        <span class="menu-trigger-icon" aria-hidden="true"><span></span><span></span><span></span></span>
        <span>Menü</span>
      </button>

      <div class="menu-backdrop" data-menu-close></div>

      <aside class="site-menu" id="site-menu" aria-label="Oldal menü" aria-hidden="true">
        <div class="site-menu-header">
          <div>
            <span class="site-menu-kicker">Sanci</span>
            <h2>Menü</h2>
          </div>
          <button class="menu-close" type="button" aria-label="Menü bezárása" data-menu-close>×</button>
        </div>

        <nav class="menu-list" aria-label="Oldal navigáció">
          ${items}
        </nav>

        <div class="site-menu-footer">Sanci9517 · streamer</div>
      </aside>
    </div>
  `;
}

export function initNavigation() {
  if (document.documentElement.dataset.navigationReady === 'true') return;
  document.documentElement.dataset.navigationReady = 'true';

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('.menu-trigger');
    if (trigger) {
      setMenuState(true);
      return;
    }

    const closeTarget = event.target.closest('[data-menu-close]');
    if (closeTarget) {
      setMenuState(false);
      return;
    }

    const routeLink = event.target.closest('.site-menu a[data-route]');
    if (routeLink) setMenuState(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenuState(false);
  });
}

function setMenuState(open) {
  document.documentElement.classList.toggle('menu-open', open);
  document.querySelectorAll('.menu-trigger').forEach((button) => {
    button.setAttribute('aria-expanded', String(open));
  });
  document.querySelectorAll('.site-menu').forEach((menu) => {
    menu.setAttribute('aria-hidden', String(!open));
  });
}
