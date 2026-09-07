const TWITCH_API = 'https://api.twitch.tv/helix';
const TWITCH_TOKEN_URL = 'https://id.twitch.tv/oauth2/token';
const DEFAULT_BROADCASTER_LOGIN = 'sanci9517';

let cachedToken = null;

function getCredentials(env) {
  return {
    clientId: env?.TWITCH_CLIENT_ID || '',
    clientSecret: env?.TWITCH_CLIENT_SECRET || '',
  };
}

export function isTwitchConfigured(env) {
  const { clientId, clientSecret } = getCredentials(env);
  return Boolean(clientId && clientSecret);
}

async function getAppAccessToken(env) {
  const { clientId, clientSecret } = getCredentials(env);
  if (!clientId || !clientSecret) throw new Error('Twitch API credentials are not configured.');
  if (cachedToken && cachedToken.clientId === clientId && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.value;
  }

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'client_credentials',
  });
  const response = await fetch(TWITCH_TOKEN_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!response.ok) throw new Error(`Twitch token request failed: ${response.status}`);
  const data = await response.json();
  if (!data.access_token) throw new Error('Twitch token response did not contain an access token.');

  cachedToken = {
    clientId,
    value: data.access_token,
    expiresAt: Date.now() + Number(data.expires_in || 0) * 1000,
  };
  return cachedToken.value;
}

async function twitchGet(path, env) {
  const { clientId } = getCredentials(env);
  const token = await getAppAccessToken(env);
  const response = await fetch(`${TWITCH_API}${path}`, {
    headers: {
      'client-id': clientId,
      authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error(`Twitch API request failed: ${response.status}`);
  return response.json();
}

export async function getTwitchStreamStatus(env, login = DEFAULT_BROADCASTER_LOGIN) {
  const data = await twitchGet(`/streams?user_login=${encodeURIComponent(login)}`, env);
  const stream = data.data?.[0] || null;
  return {
    live: Boolean(stream),
    channel: login,
    stream: stream ? {
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
      tags: stream.tags || [],
      contentClassificationLabels: stream.content_classification_labels || [],
    } : null,
    checkedAt: new Date().toISOString(),
  };
}

export async function getTwitchChannel(env, login = DEFAULT_BROADCASTER_LOGIN) {
  const data = await twitchGet(`/users?login=${encodeURIComponent(login)}`, env);
  const user = data.data?.[0] || null;
  return {
    channel: user ? {
      id: user.id,
      login: user.login,
      displayName: user.display_name,
      description: user.description || '',
      profileImageUrl: user.profile_image_url || '',
      offlineImageUrl: user.offline_image_url || '',
      broadcasterType: user.broadcaster_type || '',
      createdAt: user.created_at || null,
    } : null,
    checkedAt: new Date().toISOString(),
  };
}

export async function getTwitchData(env, login = DEFAULT_BROADCASTER_LOGIN) {
  const [status, channel] = await Promise.all([
    getTwitchStreamStatus(env, login),
    getTwitchChannel(env, login),
  ]);
  return { ...status, ...channel };
}
