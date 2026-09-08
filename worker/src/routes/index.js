import { handleAdminAuthCheck, handleAdminLogin, handleAdminLogout } from './auth.js';
import { handleAdminAudit, handleAdminSettings } from './admin.js';
import { getPublicSiteState } from './public.js';
import { getClips, getVideos, twitchRoute } from './twitch.js';
import { getYouTubeChannel, getYouTubeLive, getYouTubeVideos } from './youtube.js';
import { getStorageHealth, healthResponse } from './health.js';

const BROADCASTER_LOGIN = 'sanci9517';

function notFound(request, env, json) {
  const path = new URL(request.url).pathname;
  return json({ ok: false, error: 'Not found', path }, 404, { 'cache-control': 'no-store' }, request, env);
}

async function youtubeRoute(handler, request, env, json) {
  try {
    return json({ ok: true, ...(await handler()) }, 200, { 'cache-control': 'public, max-age=30, stale-while-revalidate=120' }, request, env);
  } catch (error) {
    console.error('[Sanci9517] YouTube route error:', error);
    return json({ ok: false, error: 'YouTube data is temporarily unavailable.' }, 503, { 'cache-control': 'no-store' }, request, env);
  }
}

export function createRouteDispatcher({ json, corsHeaders, isTwitchConfigured, twitch }) {
  return async function dispatch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders(request, env) });
    if (request.method === 'POST' && url.pathname === '/admin/auth/login') return handleAdminLogin(request, env, json);
    if (request.method === 'POST' && url.pathname === '/admin/auth/logout') return handleAdminLogout(request, env, json);
    if (request.method === 'GET' && url.pathname === '/admin/auth/check') return handleAdminAuthCheck(request, env, json);
    if (url.pathname === '/admin/settings' && (request.method === 'GET' || request.method === 'PUT')) return handleAdminSettings(request, env, json);
    if (request.method === 'GET' && url.pathname === '/admin/audit') return handleAdminAudit(request, env, json);

    if (request.method === 'GET' && url.pathname === '/site-state') {
      try {
        return json({ ok: true, ...(await getPublicSiteState(env)) }, 200, { 'cache-control': 'public, max-age=30, stale-while-revalidate=120' }, request, env);
      } catch (error) {
        console.error('[Sanci9517] Public site state error:', error);
        return json({ ok: false, error: 'Site state is temporarily unavailable.' }, 503, { 'cache-control': 'no-store' }, request, env);
      }
    }

    if (request.method === 'GET' && url.pathname === '/health/storage') {
      try {
        const storage = await getStorageHealth(env);
        return json({ ok: storage.d1 && storage.kv, storage, checkedAt: new Date().toISOString() }, 200, {}, request, env);
      } catch (error) {
        console.error('[Sanci9517] Storage health error:', error);
        return json({ ok: false, storage: { d1: false, kv: false }, error: 'Storage health check failed.' }, 503, { 'cache-control': 'no-store' }, request, env);
      }
    }

    if (request.method === 'GET' && url.pathname === '/health') return json(healthResponse(env, { isTwitchConfigured, broadcasterLogin: BROADCASTER_LOGIN }), 200, {}, request, env);
    if (request.method === 'GET' && url.pathname === '/integrations/status') return json({ ok: true, integrations: healthResponse(env, { isTwitchConfigured, broadcasterLogin: BROADCASTER_LOGIN }).integrations }, 200, {}, request, env);

    if (request.method === 'GET' && url.pathname === '/twitch/status') return twitchRoute(() => twitch.getTwitchStreamStatus(env, BROADCASTER_LOGIN), request, env, json);
    if (request.method === 'GET' && url.pathname === '/twitch/channel') return twitchRoute(() => twitch.getTwitchChannel(env, BROADCASTER_LOGIN), request, env, json);
    if (request.method === 'GET' && url.pathname === '/twitch/statistics') return twitchRoute(() => twitch.getTwitchStatistics({ getStreamStatus: twitch.getTwitchStreamStatus, getChannel: twitch.getTwitchChannel, env, login: BROADCASTER_LOGIN }), request, env, json);
    if (request.method === 'GET' && url.pathname === '/twitch/videos') return twitchRoute(() => getVideos(env, BROADCASTER_LOGIN, url.searchParams, twitch), request, env, json);
    if (request.method === 'GET' && url.pathname === '/twitch/clips') return twitchRoute(() => getClips(env, BROADCASTER_LOGIN, url.searchParams, twitch), request, env, json);
    if (request.method === 'GET' && url.pathname === '/twitch/data') return twitchRoute(() => twitch.getTwitchData(env, BROADCASTER_LOGIN), request, env, json);

    if (request.method === 'GET' && url.pathname === '/youtube/channel') return youtubeRoute(() => getYouTubeChannel(env), request, env, json);
    if (request.method === 'GET' && url.pathname === '/youtube/videos') return youtubeRoute(() => getYouTubeVideos(env, url.searchParams), request, env, json);
    if (request.method === 'GET' && url.pathname === '/youtube/live') return youtubeRoute(() => getYouTubeLive(env), request, env, json);

    return notFound(request, env, json);
  };
}
