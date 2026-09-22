PRAGMA foreign_keys = ON;

ALTER TABLE twitch_connections ADD COLUMN refresh_lock_token TEXT;
ALTER TABLE twitch_connections ADD COLUMN refresh_lock_until TEXT;

CREATE INDEX IF NOT EXISTS idx_twitch_connections_refresh_lock
  ON twitch_connections(refresh_lock_until);
