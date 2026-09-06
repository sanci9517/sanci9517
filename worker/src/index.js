const CORS_HEADERS = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, OPTIONS',
  'access-control-allow-headers': 'content-type, authorization',
};

const TWITCH_API = 'https://api.twitch.tv/helix';
const TWITCH_TOKEN_URL = 'https://id.twitch.tv/oauth2/token';
const BROADCASTER_LOGIN = 'sanci9517';

let cachedToken = null;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      ...CORS_HEADERS,
    },
  });
}

async function getAppAccessToken(env) {
  if (!env.TWITCH_CLIENT_ID || !env.TWITCH_CLIENT_SECRET) {
    throw new Error('Twitch API credentials are not configured.');
  }

  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.value;
  }

  const body = new URLSearchParams({
    client_id: env.TWITCH_CLIENT_ID,
    client_secret: env.TWITCH_CLIENT_SECRET,
    grant_type: 'client_credentials',
  });

  const response = await fetch(TWITCH_TOKEN_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!response.ok) {
    throw new Error(`Twitch token request failed: ${response.status}`);
  }

  const data = await response.json();
  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + Number(data.expires_in || 0) * 1000,
  };

  return cachedToken.value;
}

async function getStreamStatus(env) {
  const token = await getAppAccessToken(env);
  const response = await fetch(
    `${TWITCH_API}/streams?user_login=${encodeURIComponent(BROADCASTER_LOGIN)}`,
    {
      headers: {
        'client-id': env.TWITCH_CLIENT_ID,
        authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Twitch streams request failed: ${response.status}`);
  }

  const data = await response.json();
  const stream = data.data?.[0] || null;

  return {
    live: Boolean(stream),
    channel: BROADCASTER_LOGIN,
    stream: stream
      ? {
          id: stream.id,
          userId: stream.user_id,
          userLogin: stream.user_login,
          userName: stream.user_name,
          gameId: stream.game_id,
          gameName: stream.game_name,
          title: stream.title,
          viewerCount: Number(stream.viewer_count || 0),
          startedAt: stream.started_at,
          language: stream.language,
          thumbnailUrl: stream.thumbnail_url,
        }
      : null,
    checkedAt: new Date().toISOString(),
  };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (request.method === 'GET' && url.pathname === '/health') {
      return json({
        ok: true,
        service: 'sanci9517-api',
        version: 'twitch-1',
        environment: env.ENVIRONMENT || 'production',
        timestamp: new Date().toISOString(),
      });
    }

    if (request.method === 'GET' && url.pathname === '/twitch/status') {
      try {
        return json({ ok: true, ...(await getStreamStatus(env)) });
      } catch (error) {
        console.error('[Sanci9517] Twitch status error:', error);
        return json({
          ok: false,
          error: 'Twitch status is temporarily unavailable.',
        }, 503);
      }
    }

    return json({
      ok: false,
      error: 'Not found',
      path: url.pathname,
    }, 404);
  },
};
