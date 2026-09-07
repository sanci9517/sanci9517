import { clearAdminCookie, isAdminRequestAuthenticated, loginAdminRequest } from './auth.js';
import { getAdminAudit, getAdminSettings, isAllowedAdminOrigin, updateAdminSettings } from './admin.js';
import { getTwitchStreamStatus, isTwitchConfigured } from '../../integrations/twitch/client.js';

const DEFAULT_ADMIN_ORIGIN = 'https://sanci9517.github.io';
const YOUTUBE_API = 'https://www.googleapis.com/youtube/v3';
const BROADCASTER_LOGIN = 'sanci9517';
const PUBLIC_SETTING_KEYS = ['site-settings', 'navigation-settings-v2', 'page-settings'];

function corsHeaders(request, env) {
  const origin = request.headers.get('origin');
  const allowedOrigin = String(env.ADMIN_ORIGIN || DEFAULT_ADMIN_ORIGIN).replace(/\/$/, '');
  const headers = {
    'access-control-allow-methods': 'GET, POST, PUT, OPTIONS',
    'access-control-allow-headers': 'content-type, authorization',
    'access-control-allow-credentials': 'true',
    'vary': 'Origin',
  };
  if (origin && origin === allowedOrigin) headers['access-control-allow-origin'] = origin;
  else if (!origin) headers['access-control-allow-origin'] = allowedOrigin;
  return headers;
}

function json(data, status = 200, extraHeaders = {}, request = null, env = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', ...(request ? corsHeaders(request, env) : {}), ...extraHeaders },
  });
}

async function adminLogin(request, env) {
  if (!isAllowedAdminOrigin(request, env)) return json({ ok: false, error: 'Invalid request origin.' }, 403, { 'cache-control': 'no-store' }, request, env);
  const result = await loginAdminRequest(request, env);
  const headers = result.noStore ? { 'cache-control': 'no-store' } : {};
  if (result.setCookie) headers['set-cookie'] = result.setCookie;
  if (result.retryAfter) headers['retry-after'] = String(result.retryAfter);
  return json({ ok: result.ok, username: result.username || null, error: result.error || null }, result.status, headers, request, env);
}

async function getPublicSiteState(env) {
  const placeholders = PUBLIC_SETTING_KEYS.map(() => '?').join(',');
  const result = await env.DB.prepare(`SELECT key, value, updated_at FROM app_settings WHERE key IN (${placeholders}) ORDER BY key`).bind(...PUBLIC_SETTING_KEYS).all();
  const settings = {};
  for (const row of result.results || []) {
    try { settings[row.key] = JSON.parse(row.value); } catch { settings[row.key] = row.value; }
  }
  return { settings, updatedAt: result.results?.[0]?.updated_at || null };
}

async function getYouTubeChannel(env) {
  if (!env.YOUTUBE_API_KEY || !env.YOUTUBE_CHANNEL_ID) return { configured: false, channel: null, checkedAt: new Date().toISOString() };
  const params = new URLSearchParams({ part: 'snippet,statistics,contentDetails', id: env.YOUTUBE_CHANNEL_ID, key: env.YOUTUBE_API_KEY });
  const response = await fetch(`${YOUTUBE_API}/channels?${params}`);
  if (!response.ok) throw new Error(`YouTube channels request failed: ${response.status}`);
  const data = await response.json();
  const channel = data.items?.[0] || null;
  return { configured: true, channel: channel ? { id: channel.id, title: channel.snippet?.title || '', description: channel.snippet?.description || '', customUrl: channel.snippet?.customUrl || '', publishedAt: channel.snippet?.publishedAt || null, thumbnails: channel.snippet?.thumbnails || {}, subscriberCount: Number(channel.statistics?.subscriberCount || 0), videoCount: Number(channel.statistics?.videoCount || 0), viewCount: Number(channel.statistics?.viewCount || 0), uploadsPlaylistId: channel.contentDetails?.relatedPlaylists?.uploads || null } : null, checkedAt: new Date().toISOString() };
}

function getIntegrationStatus(env) {
  return {
    twitch: { configured: isTwitchConfigured(env), available: true, channel: BROADCASTER_LOGIN, capabilities: ['live', 'channel', 'stream', 'statistics'] },
    youtube: { configured: Boolean(env.YOUTUBE_API_KEY && env.YOUTUBE_CHANNEL_ID), available: true, channelId: env.YOUTUBE_CHANNEL_ID || null, capabilities: ['channel', 'videos', 'shorts', 'statistics', 'live'] },
    tiktok: { configured: Boolean(env.TIKTOK_CLIENT_KEY && env.TIKTOK_CLIENT_SECRET), available: true, capabilities: ['profile', 'videos', 'live', 'statistics'] },
    admin: { configured: Boolean(env.ADMIN_USERNAME && env.ADMIN_PASSWORD && env.ADMIN_AUTH_SECRET), available: true },
  };
}

async function getStorageHealth(env) {
  const d1Result = await env.DB.prepare('SELECT 1 AS ok').first();
  await env.CACHE.get('__sanci_health_probe__');
  return { d1: d1Result?.ok === 1, kv: true };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders(request, env) });
    if (request.method === 'POST' && url.pathname === '/admin/auth/login') return adminLogin(request, env);
    if (request.method === 'POST' && url.pathname === '/admin/auth/logout') {
      if (!isAllowedAdminOrigin(request, env)) return json({ ok: false, error: 'Invalid request origin.' }, 403, { 'cache-control': 'no-store' }, request, env);
      return json({ ok: true }, 200, { 'cache-control': 'no-store', 'set-cookie': clearAdminCookie() }, request, env);
    }
    if (request.method === 'GET' && url.pathname === '/admin/auth/check') {
      const authenticated = await isAdminRequestAuthenticated(request, env);
      return json({ ok: authenticated, authenticated, username: authenticated ? env.ADMIN_USERNAME : null }, authenticated ? 200 : 401, { 'cache-control': 'no-store' }, request, env);
    }
    if (url.pathname === '/admin/settings' && request.method === 'GET') {
      const result = await getAdminSettings(request, env, isAdminRequestAuthenticated);
      return json(result, result.status, result.ok ? {} : { 'cache-control': 'no-store' }, request, env);
    }
    if (url.pathname === '/admin/settings' && request.method === 'PUT') {
      const result = await updateAdminSettings(request, env, isAdminRequestAuthenticated);
      return json(result, result.status, { 'cache-control': 'no-store' }, request, env);
    }
    if (url.pathname === '/admin/audit' && request.method === 'GET') {
      const result = await getAdminAudit(request, env, isAdminRequestAuthenticated);
      return json(result, result.status, { 'cache-control': 'no-store' }, request, env);
    }
    if (request.method === 'GET' && url.pathname === '/site-state') {
      try { return json({ ok: true, ...(await getPublicSiteState(env)) }, 200, { 'cache-control': 'public, max-age=30, stale-while-revalidate=120' }, request, env); }
      catch (error) { console.error('[Sanci9517] Public site state error:', error); return json({ ok: false, error: 'Site state is temporarily unavailable.' }, 503, {}, request, env); }
    }
    if (request.method === 'GET' && url.pathname === '/health/storage') {
      try {
        const storage = await getStorageHealth(env);
        return json({ ok: storage.d1 && storage.kv, storage, checkedAt: new Date().toISOString() }, 200, {}, request, env);
      } catch (error) {
        console.error('[Sanci9517] Storage health error:', error);
        return json({ ok: false, storage: { d1: false, kv: false }, error: 'Storage health check failed.' }, 503, {}, request, env);
      }
    }
    if (request.method === 'GET' && url.pathname === '/health') return json({ ok: true, service: 'sanci9517-api', version: 'integration-foundation-1', environment: env.ENVIRONMENT || 'production', integrations: getIntegrationStatus(env), timestamp: new Date().toISOString() }, 200, {}, request, env);
    if (request.method === 'GET' && url.pathname === '/integrations/status') return json({ ok: true, integrations: getIntegrationStatus(env) }, 200, {}, request, env);
    if (request.method === 'GET' && url.pathname === '/twitch/status') { try { return json({ ok: true, ...(await getTwitchStreamStatus(env, BROADCASTER_LOGIN)) }, 200, {}, request, env); } catch (error) { console.error('[Sanci9517] Twitch status error:', error); return json({ ok: false, error: 'Twitch status is temporarily unavailable.' }, 503, {}, request, env); } }
    if (request.method === 'GET' && url.pathname === '/youtube/channel') { try { return json({ ok: true, ...(await getYouTubeChannel(env)) }, 200, {}, request, env); } catch (error) { console.error('[Sanci9517] YouTube channel error:', error); return json({ ok: false, error: 'YouTube channel is temporarily unavailable.' }, 503, {}, request, env); } }
    return json({ ok: false, error: 'Not found', path: url.pathname }, 404, {}, request, env);
  },
};
