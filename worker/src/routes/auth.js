import { clearAdminCookie, isAdminRequestAuthenticated, loginAdminRequest } from '../auth.js';
import { isAllowedAdminOrigin } from '../admin.js';

export async function handleAdminLogin(request, env, json) {
  if (!isAllowedAdminOrigin(request, env)) return json({ ok: false, error: 'Invalid request origin.' }, 403, { 'cache-control': 'no-store' }, request, env);
  const result = await loginAdminRequest(request, env);
  const headers = result.noStore ? { 'cache-control': 'no-store' } : {};
  if (result.setCookie) headers['set-cookie'] = result.setCookie;
  if (result.retryAfter) headers['retry-after'] = String(result.retryAfter);
  return json({ ok: result.ok, username: result.username || null, token: result.token || null, error: result.error || null }, result.status, headers, request, env);
}

export async function handleAdminLogout(request, env, json) {
  if (!isAllowedAdminOrigin(request, env)) return json({ ok: false, error: 'Invalid request origin.' }, 403, { 'cache-control': 'no-store' }, request, env);
  return json({ ok: true }, 200, { 'cache-control': 'no-store', 'set-cookie': clearAdminCookie() }, request, env);
}

export async function handleAdminAuthCheck(request, env, json) {
  const authenticated = await isAdminRequestAuthenticated(request, env);
  return json({ ok: authenticated, authenticated, username: authenticated ? env.ADMIN_USERNAME : null }, authenticated ? 200 : 401, { 'cache-control': 'no-store' }, request, env);
}
