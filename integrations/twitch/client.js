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
  if (cachedToken && cachedToken.clientId === clientId && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.value;

  const body = new URLSearchParams({ client_id: clientId, client_secret: clientSecret, grant_type: 'client_credentials' });
  const response = await fetch(TWITCH_TOKEN_URL, { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body });
  if (!response.ok) throw new Error(`Twitch token request failed: ${response.status}`);
  const data = await response.json();
  if (!data.access_token) throw new Error('Twitch token response did not contain an access token.');
  cachedToken = { clientId, value: data.access_token, expiresAt: Date.now() + Number(data.expires_in || 0) * 1000 };
  return cachedToken.value;
}

async function twitchGet(path, env) {
  const { clientId } = getCredentials(env);
  const token = await getAppAccessToken(env);
  const response = await fetch(`${TWITCH_API}${path}`, { headers: { 'client-id': clientId, authorization: `Bearer ${token}` } });
  if (!response.ok) throw new Error(`Twitch API request failed: ${response.status}`);
  return response.json();
}

export async function getTwitchStreamStatus(env, login = DEFAULT_BROADCASTER_LOGIN) {
  const data = await twitchGet(`/streams?user_login=${encodeURIComponent(login)}`, env);
  const stream = data.data?.[0] || null;
  return { live: Boolean(stream), channel: login, stream: stream ? { id: stream.id, userId: stream.user_id, userLogin: stream.user_login, userName: stream.user_name, gameId: stream.game_id, gameName: stream.game_name, title: stream.title, viewerCount: Number(stream.viewer_count || 0), startedAt: stream.started_at, language: stream.language, thumbnailUrl: stream.thumbnail_url, tags: stream.tags || [], contentClassificationLabels: stream.content_classification_labels || [] } : null, checkedAt: new Date().toISOString() };
}

export async function getTwitchChannel(env, login = DEFAULT_BROADCASTER_LOGIN) {
  const data = await twitchGet(`/users?login=${encodeURIComponent(login)}`, env);
  const user = data.data?.[0] || null;
  return { channel: user ? { id: user.id, login: user.login, displayName: user.display_name, description: user.description || '', profileImageUrl: user.profile_image_url || '', offlineImageUrl: user.offline_image_url || '', broadcasterType: user.broadcaster_type || '', createdAt: user.created_at || null } : null, checkedAt: new Date().toISOString() };
}

export async function getTwitchVideos(env, userId, { first = 20, after = '' } = {}) {
  if (!userId) return { videos: [], pagination: {}, checkedAt: new Date().toISOString() };
  const params = new URLSearchParams({ user_id: userId, first: String(Math.min(Math.max(Number(first) || 20, 1), 100)) });
  if (after) params.set('after', after);
  const data = await twitchGet(`/videos?${params}`, env);
  return { videos: (data.data || []).map(video => ({ id: video.id, streamId: video.stream_id || null, userId: video.user_id, userLogin: video.user_login, userName: video.user_name, title: video.title, description: video.description || '', createdAt: video.created_at, publishedAt: video.published_at || null, url: video.url, thumbnailUrl: video.thumbnail_url, viewable: video.viewable, viewCount: Number(video.view_count || 0), language: video.language, type: video.type, duration: video.duration, mutedSegments: video.muted_segments || [] })), pagination: data.pagination || {}, checkedAt: new Date().toISOString() };
}

export async function getTwitchClips(env, userId, { first = 20, startedAt = '', endedAt = '' } = {}) {
  if (!userId) return { clips: [], pagination: {}, checkedAt: new Date().toISOString() };
  const params = new URLSearchParams({ broadcaster_id: userId, first: String(Math.min(Math.max(Number(first) || 20, 1), 100)) });
  if (startedAt) params.set('started_at', startedAt);
  if (endedAt) params.set('ended_at', endedAt);
  const data = await twitchGet(`/clips?${params}`, env);
  return { clips: (data.data || []).map(clip => ({ id: clip.id, url: clip.url, embedUrl: clip.embed_url, broadcasterId: clip.broadcaster_id, broadcasterName: clip.broadcaster_name, creatorId: clip.creator_id, creatorName: clip.creator_name, videoId: clip.video_id || null, gameId: clip.game_id || null, language: clip.language, title: clip.title, viewCount: Number(clip.view_count || 0), createdAt: clip.created_at, thumbnailUrl: clip.thumbnail_url, duration: Number(clip.duration || 0) })), pagination: data.pagination || {}, checkedAt: new Date().toISOString() };
}

export async function getTwitchData(env, login = DEFAULT_BROADCASTER_LOGIN) {
  const [status, channel] = await Promise.all([getTwitchStreamStatus(env, login), getTwitchChannel(env, login)]);
  return { ...status, ...channel };
}
