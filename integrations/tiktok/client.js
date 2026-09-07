const TIKTOK_API_BASE = 'https://open.tiktokapis.com/v2';

export function getTikTokIntegrationConfig(env) {
  return {
    configured: Boolean(env.TIKTOK_CLIENT_KEY && env.TIKTOK_CLIENT_SECRET),
    platform: 'tiktok',
  };
}

export async function getTikTokProfile(env, accessToken) {
  if (!accessToken) throw new Error('TikTok access token is required.');

  const response = await fetch(`${TIKTOK_API_BASE}/user/info/?fields=display_name,avatar_url,open_id,union_id`, {
    headers: { authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) throw new Error(`TikTok profile request failed: ${response.status}`);
  return response.json();
}
