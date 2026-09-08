const PLATFORM_DEFINITIONS = Object.freeze({
  twitch: Object.freeze({
    id: 'twitch',
    name: 'Twitch',
    statusEndpoint: '/twitch/status',
    capabilities: Object.freeze(['live', 'channel', 'stream', 'statistics', 'videos', 'clips']),
  }),
  youtube: Object.freeze({
    id: 'youtube',
    name: 'YouTube',
    statusEndpoint: '/youtube/channel',
    capabilities: Object.freeze(['channel', 'videos', 'shorts', 'statistics', 'live']),
  }),
  tiktok: Object.freeze({
    id: 'tiktok',
    name: 'TikTok',
    statusEndpoint: null,
    capabilities: Object.freeze(['profile', 'videos', 'live', 'statistics']),
  }),
});

export function getIntegrationDefinitions() {
  return PLATFORM_DEFINITIONS;
}

export function getIntegrationDefinition(platform) {
  return PLATFORM_DEFINITIONS[String(platform || '').toLowerCase()] || null;
}

export function normalizeIntegrationStatus(payload = {}) {
  const source = payload?.integrations && typeof payload.integrations === 'object'
    ? payload.integrations
    : payload;

  return Object.fromEntries(
    Object.entries(PLATFORM_DEFINITIONS).map(([id, definition]) => {
      const value = source?.[id];
      return [id, {
        id,
        name: definition.name,
        configured: Boolean(value?.configured),
        available: value?.available !== false,
        capabilities: definition.capabilities,
      }];
    }),
  );
}
