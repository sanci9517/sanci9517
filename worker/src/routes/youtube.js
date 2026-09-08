const YOUTUBE_API = 'https://www.googleapis.com/youtube/v3';
const DEFAULT_FIRST = 20;

function isConfigured(env) {
  return Boolean(env.YOUTUBE_API_KEY && env.YOUTUBE_CHANNEL_ID);
}

async function youtubeRequest(env, resource, params) {
  const query = new URLSearchParams({ ...params, key: env.YOUTUBE_API_KEY });
  const response = await fetch(`${YOUTUBE_API}/${resource}?${query}`);
  if (!response.ok) throw new Error(`YouTube ${resource} request failed: ${response.status}`);
  return response.json();
}

export async function getYouTubeChannel(env) {
  if (!isConfigured(env)) return { configured: false, channel: null, checkedAt: new Date().toISOString() };
  const data = await youtubeRequest(env, 'channels', { part: 'snippet,statistics,contentDetails', id: env.YOUTUBE_CHANNEL_ID });
  const channel = data.items?.[0] || null;
  return {
    configured: true,
    channel: channel ? {
      id: channel.id,
      title: channel.snippet?.title || '',
      description: channel.snippet?.description || '',
      customUrl: channel.snippet?.customUrl || '',
      publishedAt: channel.snippet?.publishedAt || null,
      thumbnails: channel.snippet?.thumbnails || {},
      subscriberCount: Number(channel.statistics?.subscriberCount || 0),
      videoCount: Number(channel.statistics?.videoCount || 0),
      viewCount: Number(channel.statistics?.viewCount || 0),
      uploadsPlaylistId: channel.contentDetails?.relatedPlaylists?.uploads || null,
    } : null,
    checkedAt: new Date().toISOString(),
  };
}

export async function getYouTubeVideos(env, searchParams = new URLSearchParams()) {
  if (!isConfigured(env)) return { configured: false, videos: [], pageInfo: null, nextPageToken: null, checkedAt: new Date().toISOString() };

  const channel = await getYouTubeChannel(env);
  const playlistId = channel.channel?.uploadsPlaylistId;
  if (!playlistId) return { configured: true, videos: [], pageInfo: null, nextPageToken: null, checkedAt: new Date().toISOString() };

  const first = Math.min(Math.max(Number(searchParams.get('first') || DEFAULT_FIRST), 1), 50);
  const playlistParams = { part: 'snippet,contentDetails', playlistId, maxResults: String(first) };
  const pageToken = searchParams.get('page_token');
  if (pageToken) playlistParams.pageToken = pageToken;

  const playlist = await youtubeRequest(env, 'playlistItems', playlistParams);
  const ids = (playlist.items || []).map(item => item.contentDetails?.videoId).filter(Boolean);
  let details = { items: [] };
  if (ids.length) details = await youtubeRequest(env, 'videos', { part: 'snippet,contentDetails,statistics', id: ids.join(',') });

  const detailMap = new Map((details.items || []).map(item => [item.id, item]));
  const videos = (playlist.items || []).map(item => {
    const id = item.contentDetails?.videoId;
    const detail = detailMap.get(id);
    return {
      id,
      title: item.snippet?.title || detail?.snippet?.title || '',
      description: item.snippet?.description || detail?.snippet?.description || '',
      publishedAt: item.contentDetails?.videoPublishedAt || item.snippet?.publishedAt || null,
      thumbnails: detail?.snippet?.thumbnails || item.snippet?.thumbnails || {},
      channelId: detail?.snippet?.channelId || env.YOUTUBE_CHANNEL_ID,
      duration: detail?.contentDetails?.duration || null,
      viewCount: Number(detail?.statistics?.viewCount || 0),
      likeCount: Number(detail?.statistics?.likeCount || 0),
      commentCount: Number(detail?.statistics?.commentCount || 0),
      url: id ? `https://www.youtube.com/watch?v=${encodeURIComponent(id)}` : null,
    };
  }).filter(video => video.id);

  return { configured: true, videos, pageInfo: playlist.pageInfo || null, nextPageToken: playlist.nextPageToken || null, checkedAt: new Date().toISOString() };
}

export async function getYouTubeLive(env) {
  if (!isConfigured(env)) return { configured: false, live: null, checkedAt: new Date().toISOString() };
  const data = await youtubeRequest(env, 'search', { part: 'snippet', channelId: env.YOUTUBE_CHANNEL_ID, eventType: 'live', type: 'video', maxResults: '1' });
  const item = data.items?.[0] || null;
  return {
    configured: true,
    live: item ? {
      videoId: item.id?.videoId || null,
      title: item.snippet?.title || '',
      description: item.snippet?.description || '',
      publishedAt: item.snippet?.publishedAt || null,
      thumbnails: item.snippet?.thumbnails || {},
      url: item.id?.videoId ? `https://www.youtube.com/watch?v=${encodeURIComponent(item.id.videoId)}` : null,
    } : null,
    checkedAt: new Date().toISOString(),
  };
}
