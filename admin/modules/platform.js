import { adminApi } from './api.js';

export async function loadIntegrationStatus() {
  return adminApi.get('/integrations/status');
}

export async function loadTwitchOverview() {
  return adminApi.get('/twitch/statistics');
}

export async function loadTwitchVideos({ first = 20, after = '' } = {}) {
  const query = new URLSearchParams({ first: String(first) });
  if (after) query.set('after', after);
  return adminApi.get(`/twitch/videos?${query}`);
}

export async function loadTwitchClips({ first = 20, startedAt = '', endedAt = '' } = {}) {
  const query = new URLSearchParams({ first: String(first) });
  if (startedAt) query.set('started_at', startedAt);
  if (endedAt) query.set('ended_at', endedAt);
  return adminApi.get(`/twitch/clips?${query}`);
}

export async function loadSystemHealth() {
  const [health, storage] = await Promise.all([
    adminApi.get('/health'),
    adminApi.get('/health/storage'),
  ]);
  return { health, storage };
}
