import { getAdminAudit, getAdminSettings, updateAdminSettings } from '../admin.js';
import { isAdminRequestAuthenticated } from '../auth.js';

export async function handleAdminSettings(request, env, json) {
  const result = request.method === 'GET'
    ? await getAdminSettings(request, env, isAdminRequestAuthenticated)
    : await updateAdminSettings(request, env, isAdminRequestAuthenticated);
  return json(result, result.status, { 'cache-control': 'no-store' }, request, env);
}

export async function handleAdminAudit(request, env, json) {
  const result = await getAdminAudit(request, env, isAdminRequestAuthenticated);
  return json(result, result.status, { 'cache-control': 'no-store' }, request, env);
}
