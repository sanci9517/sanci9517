import { siteUrl, config } from '../core/config.js';
import { getNavigation } from '../core/navigation-state.js';

export function Navigation(site) {
  const currentPath = getCurrentRoutePath();
  const items = getNavigation()
    .filter((item) => item.enabled !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((item) => {
      if (item.type === 'external') {
        const href = item.url || (item.urlKey ? site.links?.[item.urlKey] : '') || '#';
        return `
          <a class="menu-link menu-link-external" href="${escapeAttribute(href)}" target="_blank" rel="noopener noreferrer">
            <span>${escapeHtml(item.label)}</span>
            <span aria-hidden="true">↗</span>
          </a>
        `;
      }

      const active = normalizePath(item.path) === currentPath;
      return `
        <a class="menu-link${active ? ' menu-link-active' : ''}" href="${siteUrl(item.path)}" data-route${active ? ' aria-current="page"' : ''}>
          <span>${escapeHtml(item.label)}</span>
          <span class="menu-arrow" aria-hidden="true">${active ? '●' : '→'}</span>
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
            <span class="site-menu-kicker">Navigáció</span>
            <h2>Menü</h2>
          </div>
          <button class="menu-close" type="button" aria-label="Menü bezárása" data-menu-close>×</button>
        </div>

        <nav class="menu-list" aria-label="Oldal navigáció">
          ${items}
        </nav>
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
      setMenuState(!document.documentElement.classList.contains('menu-open'));
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

function getCurrentRoutePath() {
  const pathname = normalizePath(window.location.pathname);
  const base = normalizePath(config.basePath);
  if (pathname === base) return '/';
  if (pathname.startsWith(`${base}/`)) return normalizePath(pathname.slice(base.length));
  return pathname;
}

function normalizePath(path) {
  const clean = String(path || '/').split('?')[0].split('#')[0];
  return clean.replace(/\/+$/, '') || '/';
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function escapeAttribute(value) {
  return escapeHtml(value);
}
