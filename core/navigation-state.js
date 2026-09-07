import { navigation } from '../data/navigation.js';
import { storage } from './storage.js';

const NAVIGATION_KEY = 'navigation-settings';

export function getNavigation() {
  const saved = storage.get(NAVIGATION_KEY, null);
  if (!Array.isArray(saved) || !saved.length) return navigation;

  // Recover from the earlier editor state where every saved item could become Twitch.
  const hasMeaningfulItem = saved.some((item) => {
    const label = String(item?.label || '').trim().toLowerCase();
    const url = String(item?.url || '').trim().toLowerCase();
    return label !== 'twitch' || (url && !url.includes('twitch.tv'));
  });

  if (!hasMeaningfulItem && saved.length > 1) return navigation;
  return saved;
}

export function saveNavigation(items) {
  if (!Array.isArray(items)) return false;
  return storage.set(NAVIGATION_KEY, items);
}
