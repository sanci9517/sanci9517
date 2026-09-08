export async function getStorageHealth(env) {
  const d1Result = await env.DB.prepare('SELECT 1 AS ok').first();
  await env.CACHE.get('__sanci_health_probe__');
  return { d1: d1Result?.ok === 1, kv: true };
}

export function getIntegrationStatus(env, { isTwitchConfigured, broadcasterLogin }) {
  const youtubeConfigured = Boolean(env.YOUTUBE_API_KEY && env.YOUTUBE_CHANNEL_ID);
  const tiktokConfigured = Boolean(env.TIKTOK_CLIENT_KEY && env.TIKTOK_CLIENT_SECRET);

  return {
    twitch: {
      configured: isTwitchConfigured(env),
      available: true,
      channel: broadcasterLogin,
      capabilities: ['live', 'channel', 'stream', 'statistics', 'videos', 'clips'],
    },
    youtube: {
      configured: youtubeConfigured,
      available: youtubeConfigured,
      channelId: env.YOUTUBE_CHANNEL_ID || null,
      capabilities: ['channel', 'videos', 'shorts', 'statistics', 'live'],
    },
    tiktok: {
      configured: tiktokConfigured,
      available: false,
      capabilities: ['profile', 'videos', 'live', 'statistics'],
      reason: tiktokConfigured ? 'API routes are not enabled yet.' : 'TikTok credentials are not configured.',
    },
    admin: {
      configured: Boolean(env.ADMIN_USERNAME && env.ADMIN_PASSWORD && env.ADMIN_AUTH_SECRET),
      available: true,
    },
  };
}

export function healthResponse(env, integrationOptions) {
  return {
    ok: true,
    service: 'sanci9517-api',
    version: 'admin-auth-bearer-2',
    workerName: 'sanci9517-api',
    environment: env.ENVIRONMENT || 'production',
    integrations: getIntegrationStatus(env, integrationOptions),
    timestamp: new Date().toISOString(),
  };
}
