const PUBLIC_SETTING_KEYS = ['site-settings', 'navigation-settings-v2', 'page-settings'];

export async function getPublicSiteState(env) {
  const placeholders = PUBLIC_SETTING_KEYS.map(() => '?').join(',');
  const result = await env.DB.prepare(`SELECT key, value, updated_at FROM app_settings WHERE key IN (${placeholders}) ORDER BY key`).bind(...PUBLIC_SETTING_KEYS).all();
  const settings = {};
  for (const row of result.results || []) {
    try { settings[row.key] = JSON.parse(row.value); }
    catch { settings[row.key] = row.value; }
  }
  return { settings, updatedAt: result.results?.[0]?.updated_at || null };
}
