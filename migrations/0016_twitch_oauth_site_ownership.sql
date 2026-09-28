PRAGMA foreign_keys = ON;

-- E4.3.4: bind Twitch OAuth state to the canonical site that initiated the flow.
ALTER TABLE twitch_oauth_states ADD COLUMN site_id TEXT
  REFERENCES sites(id) ON DELETE RESTRICT;

UPDATE twitch_oauth_states
SET site_id = 'site-default'
WHERE site_id IS NULL;

CREATE INDEX IF NOT EXISTS idx_twitch_oauth_states_site_id
  ON twitch_oauth_states(site_id);
