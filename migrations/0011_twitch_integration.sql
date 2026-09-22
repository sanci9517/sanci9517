PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS twitch_connections (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  broadcaster_id TEXT NOT NULL UNIQUE,
  broadcaster_login TEXT NOT NULL,
  access_token_ciphertext TEXT NOT NULL,
  access_token_iv TEXT NOT NULL,
  refresh_token_ciphertext TEXT NOT NULL,
  refresh_token_iv TEXT NOT NULL,
  scopes_json TEXT NOT NULL DEFAULT '[]',
  access_token_expires_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'connected' CHECK (status IN ('connected','reauthorization_required','revoked')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_validated_at TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_twitch_connections_user_id ON twitch_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_twitch_connections_status ON twitch_connections(status);

CREATE TABLE IF NOT EXISTS twitch_oauth_states (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  state_hash TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  used_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_twitch_oauth_states_expires_at ON twitch_oauth_states(expires_at);