import { adminApi } from './api.js';

export async function runControlCenterTests() {
  const checks = [
    ['Worker API', '/health'],
    ['Storage', '/health/storage'],
    ['Integrációk', '/integrations/status'],
    ['Twitch live', '/twitch/status'],
    ['Twitch statisztika', '/twitch/statistics'],
    ['Twitch VOD', '/twitch/videos?first=5'],
    ['Twitch klipek', '/twitch/clips?first=5'],
    ['YouTube csatorna', '/youtube/channel'],
    ['YouTube videók', '/youtube/videos?first=5'],
    ['YouTube live', '/youtube/live'],
  ];

  return Promise.all(checks.map(async ([name, endpoint]) => {
    const started = performance.now();
    try {
      const data = await adminApi.get(endpoint);
      return { name, endpoint, ok: true, ms: Math.round(performance.now() - started), data };
    } catch (error) {
      return { name, endpoint, ok: false, ms: Math.round(performance.now() - started), error: error.message };
    }
  }));
}
