import { siteUrl } from '../core/config.js';

export function Header(site) {
  return `
    <header class="site-header">
      <a class="brand" href="${siteUrl('/')}" data-route aria-label="${site.brand} főoldal">
        <span class="brand-mark" aria-hidden="true">S</span>
        <span class="brand-name">Sanci</span>
      </a>

      <nav class="nav" aria-label="Fő navigáció">
        <a class="nav-link is-active" href="${siteUrl('/')}" data-route>Főoldal</a>
        <a class="nav-link nav-link-external" href="${site.links.twitch}" target="_blank" rel="noopener noreferrer">
          <span>Twitch</span>
          <span class="nav-external-icon" aria-hidden="true">↗</span>
        </a>
      </nav>
    </header>
  `;
}
