import { siteUrl } from '../core/config.js';

export function Header(site) {
  return `
    <header class="site-header">
      <a class="brand" href="${siteUrl('/')}" aria-label="${site.brand} főoldal">
        <span class="brand-mark">S</span>
        <span>Sanci<strong>9517</strong></span>
      </a>
      <nav class="nav" aria-label="Fő navigáció">
        <a href="${siteUrl('/')}">Kezdőlap</a>
        <a href="${site.links.twitch}" target="_blank" rel="noopener">Twitch</a>
      </nav>
    </header>
  `;
}
