import { twitchConfig } from './config.js';

export function getTwitchChannelUrl() {
  return `https://www.twitch.tv/${twitchConfig.broadcasterLogin}`;
}

export function getTwitchEmbedUrl(parent) {
  const safeParent = String(parent || window.location.hostname || 'localhost');
  return `https://player.twitch.tv/?channel=${encodeURIComponent(twitchConfig.broadcasterLogin)}&parent=${encodeURIComponent(safeParent)}`;
}

export function normalizeStream(stream) {
  if (!stream) return null;
  return {
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
    isLive: true,
  };
}
