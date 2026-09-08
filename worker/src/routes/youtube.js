const YOUTUBE_API = 'https://www.googleapis.com/youtube/v3';

export async function getYouTubeChannel(env) {
  if (!env.YOUTUBE_API_KEY || !env.YOUTUBE_CHANNEL_ID) return { configured: false, channel: null, checkedAt: new Date().toISOString() };
  const params = new URLSearchParams({ part: 'snippet,statistics,contentDetails', id: env.YOUTUBE_CHANNEL_ID, key: env.YOUTUBE_API_KEY });
  const response = await fetch(`${YOUTUBE_API}/channels?${params}`);
  if (!response.ok) throw new Error(`YouTube channels request failed: ${response.status}`);
  const data = await response.json();
  const channel = data.items?.[0] || null;
  return { configured: true, channel: channel ? { id: channel.id, title: channel.snippet?.title || '', description: channel.snippet?.description || '', customUrl: channel.snippet?.customUrl || '', publishedAt: channel.snippet?.publishedAt || null, thumbnails: channel.snippet?.thumbnails || {}, subscriberCount: Number(channel.statistics?.subscriberCount || 0), videoCount: Number(channel.statistics?.videoCount || 0), viewCount: Number(channel.statistics?.viewCount || 0), uploadsPlaylistId: channel.contentDetails?.relatedPlaylists?.uploads || null } : null, checkedAt: new Date().toISOString() };
}
