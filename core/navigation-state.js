import { navigation } from '../data/navigation.js';
import { storage } from './storage.js';

const NAVIGATION_KEY = 'navigation-settings-v2';
const RESERVED_PUBLIC_PATHS = new Set(['/admin']);
const LEGACY_BROKEN_PATHS = new Set(['/', '']);

export function getNavigation() {
  const saved = storage.get(NAVIGATION_KEY, null);
  if (!Array.isArray(saved) || !saved.length) return navigation;

  const normalized = saved
    .map((item, index) => normalizeItem(item, index))
    .filter(Boolean)
    .sort((a, b) => a.order - b.order);

  // A previous migration accidentally persisted only Főoldal + Twitch.
  // Do not let that stale two-item state permanently hide the real navigation.
  if (isKnownBrokenNavigation(normalized)) return navigation;
  return normalized;
}

export function saveNavigation(items) {
  if (!Array.isArray(items)) return false;
  return storage.set(
    NAVIGATION_KEY,
    items.map((item, index) => normalizeItem(item, index)).filter(Boolean)
  );
}

function isKnownBrokenNavigation(items) {
  if (items.length !== 2) return false;
  const route = items.find((item) => item.type === 'route');
  const external = items.find((item) => item.type === 'external');
  return route?.path === '/' && external?.urlKey === 'twitch';
}

function normalizeItem(item, index) {
  if (!item || typeof item !== 'object') return null;

  const type = item.type === 'external' ? 'external' : 'route';
  const label = String(item.label || '').trim() || `Menüpont ${index + 1}`;
  const normalized = {
    label,
    type,
    enabled: item.enabled !== false,
    order: Number.isInteger(item.order) ? item.order : index,
  };

  if (type === 'external') {
    normalized.url = String(item.url || '').trim();
    normalized.urlKey = String(item.urlKey || '').trim();
  } else {
    normalized.path = String(item.path || '/').trim() || '/';
    if (RESERVED_PUBLIC_PATHS.has(normalized.path)) return null;
  }

  return normalized;
}
