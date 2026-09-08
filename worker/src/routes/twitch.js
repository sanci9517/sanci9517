export async function twitchRoute(handler, request, env, json) {
  try {
    return json({ ok: true, ...(await handler()) }, 200, { 'cache-control': 'public, max-age=15, stale-while-revalidate=45' }, request, env);
  } catch (error) {
    console.error('[Sanci9517] Twitch route error:', error);
    return json({ ok: false, error: 'Twitch data is temporarily unavailable.' }, 503, { 'cache-control': 'no-store' }, request, env);
  }
}

export async function getVideos(env, login, searchParams, { getTwitchChannel, getTwitchVideos }) {
  const channel = await getTwitchChannel(env, login);
  return getTwitchVideos(env, channel.channel?.id, {
    first: searchParams.get('first') || 20,
    after: searchParams.get('after') || '',
  });
}

export async function getClips(env, login, searchParams, { getTwitchChannel, getTwitchClips }) {
  const channel = await getTwitchChannel(env, login);
  return getTwitchClips(env, channel.channel?.id, {
    first: searchParams.get('first') || 20,
    startedAt: searchParams.get('started_at') || '',
    endedAt: searchParams.get('ended_at') || '',
  });
}
