PRAGMA foreign_keys = OFF;

CREATE TABLE twitch_connections_v2 (
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
  status TEXT NOT NULL DEFAULT 'connected' CHECK (status IN ('connected','reauthorization_required','revocation_pending','revoked')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_validated_at TEXT,
  refresh_lock_token TEXT,
  refresh_lock_until TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO twitch_connections_v2 (
  id,user_id,broadcaster_id,broadcaster_login,
  access_token_ciphertext,access_token_iv,refresh_token_ciphertext,refresh_token_iv,
  scopes_json,access_token_expires_at,status,created_at,updated_at,last_validated_at,
  refresh_lock_token,refresh_lock_until
)
SELECT
  id,user_id,broadcaster_id,broadcaster_login,
  access_token_ciphertext,access_token_iv,refresh_token_ciphertext,refresh_token_iv,
  scopes_json,access_token_expires_at,status,created_at,updated_at,last_validated_at,
  refresh_lock_token,refresh_lock_until
FROM twitch_connections;

DROP TABLE twitch_connections;
ALTER TABLE twitch_connections_v2 RENAME TO twitch_connections;

CREATE INDEX IF NOT EXISTS idx_twitch_connections_user_id ON twitch_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_twitch_connections_status ON twitch_connections(status);
CREATE INDEX IF NOT EXISTS idx_twitch_connections_refresh_lock ON twitch_connections(refresh_lock_until);

PRAGMA foreign_keys = ON;
