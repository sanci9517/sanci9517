import { navigation } from '../data/navigation.js';
import { storage } from './storage.js';

const NAVIGATION_KEY = 'navigation-settings';

export function getNavigation() {
  const saved = storage.get(NAVIGATION_KEY, null);
  return Array.isArray(saved) ? saved : navigation;
}

export function saveNavigation(items) {
  return storage.set(NAVIGATION_KEY, items);
}
