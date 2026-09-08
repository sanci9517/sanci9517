import { navigation } from '../data/navigation.js';
import { storage } from './storage.js';

// v2 intentionally starts clean so the old broken editor state cannot leak into the new editor.
const NAVIGATION_KEY = 'navigation-settings-v2';
const RESERVED_PUBLIC_PATHS = new Set(['/admin']);

export function getNavigation() {
  const saved = storage.get(NAVIGATION_KEY, null);
  if (!Array.isArray(saved) || !saved.length) return navigation;

  return saved
    .map((item, index) => normalizeItem(item, index))
    .filter(Boolean)
    .sort((a, b) => a.order - b.order);
}

export function saveNavigation(items) {
  if (!Array.isArray(items)) return false;
  return storage.set(
    NAVIGATION_KEY,
    items.map((item, index) => normalizeItem(item, index)).filter(Boolean)
  );
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
