import { api } from '../../core/api.js';

export async function loadIntegrationStatus() {
  return api.get('/integrations/status');
}

export async function loadTwitchOverview() {
  return api.get('/twitch/statistics');
}

export async function loadSystemHealth() {
  const [health, storage] = await Promise.all([
    api.get('/health'),
    api.get('/health/storage'),
  ]);
  return { health, storage };
}
