import { siteUrl } from '../core/config.js';
import { Navigation } from './navigation.js';

export function Header(site) {
  return `
    <header class="site-header">
      <a class="brand" href="${siteUrl('/')}" data-route aria-label="${site.brand} főoldal">
        <span class="brand-mark" aria-hidden="true">S</span>
        <span class="brand-name">Sanci</span>
      </a>
      ${Navigation(site)}
    </header>
  `;
}
