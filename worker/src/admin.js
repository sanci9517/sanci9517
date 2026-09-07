const MAX_SETTING_BYTES = 64 * 1024;
const MAX_AUDIT_ROWS = 100;

function getRequestOrigin(request) {
  return request.headers.get('origin') || '';
}

export function isAllowedAdminOrigin(request, env) {
  const origin = getRequestOrigin(request);
  if (!origin) return true;
  const allowed = String(env.ADMIN_ORIGIN || 'https://sanci9517.github.io').replace(/\/$/, '');
  return origin === allowed;
}

function jsonError(error, status) {
  return { ok: false, status, error };
}

async function isAuthenticated(request, env, authenticate) {
  return authenticate(request, env);
}

export async function getAdminSettings(request, env, authenticate) {
  if (!await isAuthenticated(request, env, authenticate)) return jsonError('Admin authentication required.', 401);
  try {
    const result = await env.DB.prepare('SELECT key, value, updated_at FROM app_settings ORDER BY key').all();
    const settings = {};
    for (const row of result.results || []) {
      try { settings[row.key] = JSON.parse(row.value); } catch { settings[row.key] = row.value; }
    }
    return { ok: true, status: 200, settings };
  } catch (error) {
    console.error('[Sanci9517] Admin settings read error:', error);
    return jsonError('Admin settings are temporarily unavailable.', 503);
  }
}

export async function updateAdminSettings(request, env, authenticate) {
  if (!isAllowedAdminOrigin(request, env)) return jsonError('Invalid request origin.', 403);
  if (!await isAuthenticated(request, env, authenticate)) return jsonError('Admin authentication required.', 401);

  let body;
  try { body = await request.json(); } catch { return jsonError('Invalid request.', 400); }
  const entries = body?.settings;
  if (!entries || typeof entries !== 'object' || Array.isArray(entries)) return jsonError('Settings object is required.', 400);

  const rows = Object.entries(entries);
  if (!rows.length) return jsonError('No settings supplied.', 400);

  try {
    const statements = [];
    for (const [key, value] of rows) {
      if (!/^[a-zA-Z0-9_.:-]{1,100}$/.test(key)) return jsonError(`Invalid setting key: ${key}`, 400);
      const serialized = JSON.stringify(value);
      if (serialized === undefined || new TextEncoder().encode(serialized).byteLength > MAX_SETTING_BYTES) {
        return jsonError(`Setting is too large: ${key}`, 413);
      }
      statements.push(env.DB.prepare(
        'INSERT INTO app_settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP'
      ).bind(key, serialized));
    }
    await env.DB.batch(statements);
    await env.DB.prepare('INSERT INTO admin_audit_log (action, details) VALUES (?, ?)').bind(
      'settings.update', JSON.stringify({ keys: rows.map(([key]) => key) })
    ).run();
    return { ok: true, status: 200, updated: rows.map(([key]) => key) };
  } catch (error) {
    console.error('[Sanci9517] Admin settings update error:', error);
    return jsonError('Admin settings could not be saved.', 503);
  }
}

export async function getAdminAudit(request, env, authenticate) {
  if (!await isAuthenticated(request, env, authenticate)) return jsonError('Admin authentication required.', 401);
  try {
    const result = await env.DB.prepare(
      'SELECT id, action, details, created_at FROM admin_audit_log ORDER BY id DESC LIMIT ?'
    ).bind(MAX_AUDIT_ROWS).all();
    return { ok: true, status: 200, audit: result.results || [] };
  } catch (error) {
    console.error('[Sanci9517] Admin audit read error:', error);
    return jsonError('Admin audit log is temporarily unavailable.', 503);
  }
}
