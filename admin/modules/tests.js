import { api } from '../../core/api.js';

export async function runControlCenterTests() {
  const checks = [
    ['Worker API', '/health'],
    ['Storage', '/health/storage'],
    ['Integrációk', '/integrations/status'],
    ['Twitch', '/twitch/status'],
    ['Twitch statisztika', '/twitch/statistics'],
    ['YouTube', '/youtube/channel'],
  ];

  return Promise.all(checks.map(async ([name, endpoint]) => {
    const started = performance.now();
    try {
      const data = await api.get(endpoint);
      return { name, endpoint, ok: true, ms: Math.round(performance.now() - started), data };
    } catch (error) {
      return { name, endpoint, ok: false, ms: Math.round(performance.now() - started), error: error.message };
    }
  }));
}
