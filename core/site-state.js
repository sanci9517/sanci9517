import { site } from '../data/site.js';
import { storage } from './storage.js';

const SITE_SETTINGS_KEY = 'site-settings';
const LEGACY_SETTINGS_KEY = 'admin-website-settings';

export function getSite() {
  const saved = readSavedSettings();

  return {
    ...site,
    ...saved,
    links: {
      ...site.links,
      ...(saved.links || {}),
    },
  };
}

export function saveSiteSettings(settings) {
  const current = getSite();
  const next = {
    brand: settings.brand ?? current.brand,
    language: settings.language ?? current.language,
    description: settings.description ?? current.description,
    links: {
      ...current.links,
      ...(settings.links || {}),
    },
  };

  return storage.set(SITE_SETTINGS_KEY, next);
}

function readSavedSettings() {
  return storage.get(
    SITE_SETTINGS_KEY,
    storage.get(LEGACY_SETTINGS_KEY, {})
  ) || {};
}
