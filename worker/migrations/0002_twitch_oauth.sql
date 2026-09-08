CREATE TABLE IF NOT EXISTS twitch_oauth_tokens (
  id TEXT PRIMARY KEY,
  twitch_user_id TEXT NOT NULL,
  twitch_login TEXT NOT NULL,
  twitch_display_name TEXT NOT NULL,
  access_token_ciphertext TEXT NOT NULL,
  refresh_token_ciphertext TEXT NOT NULL,
  scopes_json TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
