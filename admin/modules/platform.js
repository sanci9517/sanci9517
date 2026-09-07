import { api } from '../../core/api.js';

export async function loadIntegrationStatus() {
  return api.get('/integrations/status');
}

export async function loadTwitchOverview() {
  return api.get('/twitch/statistics');
}

export async function loadTwitchVideos({ first = 20, after = '' } = {}) {
  const query = new URLSearchParams({ first: String(first) });
  if (after) query.set('after', after);
  return api.get(`/twitch/videos?${query}`);
}

export async function loadTwitchClips({ first = 20, startedAt = '', endedAt = '' } = {}) {
  const query = new URLSearchParams({ first: String(first) });
  if (startedAt) query.set('started_at', startedAt);
  if (endedAt) query.set('ended_at', endedAt);
  return api.get(`/twitch/clips?${query}`);
}

export async function loadSystemHealth() {
  const [health, storage] = await Promise.all([
    api.get('/health'),
    api.get('/health/storage'),
  ]);
  return { health, storage };
}
