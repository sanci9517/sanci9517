const DEFAULT_BROADCASTER_LOGIN = 'sanci9517';

function toNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

export function buildTwitchStatistics({ streamStatus = {}, channelData = {} } = {}) {
  const stream = streamStatus?.stream || null;
  const channel = channelData?.channel || null;

  return {
    channel: channel?.login || stream?.userLogin || DEFAULT_BROADCASTER_LOGIN,
    live: Boolean(streamStatus?.live),
    currentViewers: toNumber(stream?.viewerCount),
    game: stream?.gameName || null,
    title: stream?.title || null,
    language: stream?.language || null,
    startedAt: stream?.startedAt || null,
    profileImageUrl: channel?.profileImageUrl || '',
    broadcasterType: channel?.broadcasterType || '',
    channelCreatedAt: channel?.createdAt || null,
    checkedAt: new Date().toISOString(),
    sources: {
      stream: Boolean(streamStatus),
      channel: Boolean(channelData),
    },
  };
}

export async function getTwitchStatistics({ getStreamStatus, getChannel, env, login = DEFAULT_BROADCASTER_LOGIN } = {}) {
  if (typeof getStreamStatus !== 'function' || typeof getChannel !== 'function') {
    throw new Error('Twitch statistics dependencies are not configured.');
  }

  const [streamStatus, channelData] = await Promise.all([
    getStreamStatus(env, login),
    getChannel(env, login),
  ]);

  return buildTwitchStatistics({ streamStatus, channelData });
}
