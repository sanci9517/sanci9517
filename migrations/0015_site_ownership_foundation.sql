PRAGMA foreign_keys = ON;

-- E4.2: establish the first canonical site/tenant ownership boundary.
-- Existing production data is assigned to the deterministic bootstrap site.
CREATE TABLE IF NOT EXISTS sites (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','archived')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO sites (id, slug, name)
VALUES ('site-default', 'sanci9517', 'Sanci9517');

ALTER TABLE pages ADD COLUMN site_id TEXT NOT NULL DEFAULT 'site-default'
  REFERENCES sites(id) ON DELETE RESTRICT;
CREATE INDEX IF NOT EXISTS idx_pages_site_id ON pages(site_id);

ALTER TABLE schedule_items ADD COLUMN site_id TEXT NOT NULL DEFAULT 'site-default'
  REFERENCES sites(id) ON DELETE RESTRICT;
CREATE INDEX IF NOT EXISTS idx_schedule_site_starts
  ON schedule_items(site_id, starts_at);

ALTER TABLE media ADD COLUMN site_id TEXT NOT NULL DEFAULT 'site-default'
  REFERENCES sites(id) ON DELETE RESTRICT;
CREATE INDEX IF NOT EXISTS idx_media_site_id ON media(site_id);

ALTER TABLE social_accounts ADD COLUMN site_id TEXT NOT NULL DEFAULT 'site-default'
  REFERENCES sites(id) ON DELETE RESTRICT;
CREATE INDEX IF NOT EXISTS idx_social_accounts_site_id
  ON social_accounts(site_id);

ALTER TABLE twitch_connections ADD COLUMN site_id TEXT NOT NULL DEFAULT 'site-default'
  REFERENCES sites(id) ON DELETE RESTRICT;
CREATE INDEX IF NOT EXISTS idx_twitch_connections_site_id
  ON twitch_connections(site_id);

-- site_settings intentionally remains legacy/global in E4.2.
-- A canonical site-scoped settings contract will be introduced only
-- after its read/write consumers are audited, avoiding a parallel settings system.
