import { storage } from '../core/storage.js';

const SITE_SETTINGS_KEY = 'admin-website-settings';

export const site = Object.freeze({
  brand: 'Sanci9517',
  language: 'hu',
  description: 'Sanci9517 hivatalos streamer oldala.',
  links: {
    twitch: 'https://www.twitch.tv/sanci9517'
  }
});

export function getSite() {
  const saved = storage.get(SITE_SETTINGS_KEY, {});
  return {
    ...site,
    brand: saved.brand || site.brand,
    description: saved.description || site.description,
    links: { ...site.links },
  };
}
