PRAGMA defer_foreign_keys = ON;

-- E4.4.2: harden canonical site ownership to NOT NULL.
-- D1 runs each migration/query in an implicit transaction; FK enforcement is
-- deferred for the rebuild and validated again at transaction completion.
--
-- IMPORTANT: pages <-> editor_revisions form an FK cycle:
--   pages.published_revision_id -> editor_revisions.id (SET NULL)
--   editor_revisions.page_id   -> pages.id (CASCADE)
-- Snapshot both tables before dropping either original table so the
-- published_revision_id linkage and all revision rows survive the rebuild.

CREATE TABLE __e44_pages_snapshot_20261007 AS
SELECT
  id,
  slug,
  title,
  description,
  content_json,
  is_published,
  created_at,
  updated_at,
  published_content_json,
  sort_order,
  published_revision_id,
  site_id
FROM pages;

CREATE TABLE __e44_editor_revisions_snapshot_20261007 AS
SELECT
  id,
  page_id,
  version,
  document_json,
  created_by,
  created_at,
  note
FROM editor_revisions;

DROP TABLE editor_revisions;
DROP TABLE pages;

CREATE TABLE pages (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  content_json TEXT NOT NULL DEFAULT '{}',
  is_published INTEGER NOT NULL DEFAULT 1 CHECK (is_published IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  published_content_json TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  published_revision_id TEXT
    REFERENCES editor_revisions(id)
    ON DELETE SET NULL,
  site_id TEXT NOT NULL
    REFERENCES sites(id) ON DELETE RESTRICT
);

CREATE TABLE editor_revisions (
  id TEXT PRIMARY KEY,
  page_id TEXT NOT NULL,
  version INTEGER NOT NULL,
  document_json TEXT NOT NULL,
  created_by TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  note TEXT DEFAULT '',
  UNIQUE(page_id, version),
  FOREIGN KEY(page_id) REFERENCES pages(id) ON DELETE CASCADE
);

INSERT INTO pages (
  id,
  slug,
  title,
  description,
  content_json,
  is_published,
  created_at,
  updated_at,
  published_content_json,
  sort_order,
  published_revision_id,
  site_id
)
SELECT
  id,
  slug,
  title,
  description,
  content_json,
  is_published,
  created_at,
  updated_at,
  published_content_json,
  sort_order,
  published_revision_id,
  site_id
FROM __e44_pages_snapshot_20261007;

INSERT INTO editor_revisions (
  id,
  page_id,
  version,
  document_json,
  created_by,
  created_at,
  note
)
SELECT
  id,
  page_id,
  version,
  document_json,
  created_by,
  created_at,
  note
FROM __e44_editor_revisions_snapshot_20261007;

CREATE INDEX idx_pages_sort_order
  ON pages(sort_order);

CREATE INDEX idx_pages_published_revision
  ON pages(published_revision_id);

CREATE INDEX idx_pages_site_id
  ON pages(site_id);

CREATE INDEX idx_editor_revisions_page
  ON editor_revisions(page_id, version DESC);

CREATE INDEX idx_editor_revisions_page_version
  ON editor_revisions(page_id, version DESC);

CREATE INDEX idx_editor_revisions_created_at
  ON editor_revisions(created_at);

CREATE TABLE schedule_items_v2 (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  platform TEXT NOT NULL,
  starts_at TEXT NOT NULL,
  ends_at TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled'
    CHECK (status IN ('scheduled', 'live', 'completed', 'cancelled')),
  url TEXT,
  notes TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  source TEXT NOT NULL DEFAULT 'manual',
  source_id TEXT,
  source_account_id TEXT,
  source_presence TEXT NOT NULL DEFAULT 'present'
    CHECK (source_presence IN ('present', 'missing')),
  source_synced_at TEXT,
  source_missing_at TEXT,
  is_recurring INTEGER NOT NULL DEFAULT 0
    CHECK (is_recurring IN (0, 1)),
  source_category_id TEXT,
  source_category_name TEXT,
  site_id TEXT NOT NULL
    REFERENCES sites(id) ON DELETE RESTRICT
);

INSERT INTO schedule_items_v2 (
  id, title, platform, starts_at, ends_at, status, url, notes,
  created_at, updated_at, source, source_id, source_account_id,
  source_presence, source_synced_at, source_missing_at, is_recurring,
  source_category_id, source_category_name, site_id
)
SELECT
  id, title, platform, starts_at, ends_at, status, url, notes,
  created_at, updated_at, source, source_id, source_account_id,
  source_presence, source_synced_at, source_missing_at, is_recurring,
  source_category_id, source_category_name, site_id
FROM schedule_items;

DROP TABLE schedule_items;
ALTER TABLE schedule_items_v2 RENAME TO schedule_items;

CREATE INDEX idx_schedule_starts_at ON schedule_items(starts_at);
CREATE UNIQUE INDEX idx_schedule_source_identity
  ON schedule_items(source, source_account_id, source_id);
CREATE INDEX idx_schedule_source_account_starts
  ON schedule_items(source, source_account_id, starts_at);
CREATE INDEX idx_schedule_source_presence_starts
  ON schedule_items(source, source_account_id, source_presence, starts_at);
CREATE INDEX idx_schedule_site_starts
  ON schedule_items(site_id, starts_at);

CREATE TABLE media_v2 (
  id TEXT PRIMARY KEY,
  object_key TEXT NOT NULL UNIQUE,
  original_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes INTEGER NOT NULL,
  alt_text TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  site_id TEXT NOT NULL
    REFERENCES sites(id) ON DELETE RESTRICT
);

INSERT INTO media_v2 (
  id, object_key, original_name, mime_type, size_bytes, alt_text, created_at, site_id
)
SELECT
  id, object_key, original_name, mime_type, size_bytes, alt_text, created_at, site_id
FROM media;

DROP TABLE media;
ALTER TABLE media_v2 RENAME TO media;

CREATE INDEX idx_media_site_id ON media(site_id);

CREATE TABLE social_accounts_v2 (
  id TEXT PRIMARY KEY,
  platform TEXT NOT NULL
    CHECK (platform IN ('twitch', 'tiktok', 'youtube', 'discord', 'other')),
  handle TEXT NOT NULL,
  url TEXT NOT NULL,
  is_visible INTEGER NOT NULL DEFAULT 1 CHECK (is_visible IN (0, 1)),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  site_id TEXT NOT NULL
    REFERENCES sites(id) ON DELETE RESTRICT
);

INSERT INTO social_accounts_v2 (
  id, platform, handle, url, is_visible, sort_order, created_at, updated_at, site_id
)
SELECT
  id, platform, handle, url, is_visible, sort_order, created_at, updated_at, site_id
FROM social_accounts;

DROP TABLE social_accounts;
ALTER TABLE social_accounts_v2 RENAME TO social_accounts;

CREATE INDEX idx_social_accounts_site_id ON social_accounts(site_id);

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
  status TEXT NOT NULL DEFAULT 'connected'
    CHECK (status IN ('connected','reauthorization_required','revocation_pending','revoked')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_validated_at TEXT,
  refresh_lock_token TEXT,
  refresh_lock_until TEXT,
  site_id TEXT NOT NULL
    REFERENCES sites(id) ON DELETE RESTRICT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO twitch_connections_v2 (
  id, user_id, broadcaster_id, broadcaster_login,
  access_token_ciphertext, access_token_iv,
  refresh_token_ciphertext, refresh_token_iv,
  scopes_json, access_token_expires_at, status,
  created_at, updated_at, last_validated_at,
  refresh_lock_token, refresh_lock_until, site_id
)
SELECT
  id, user_id, broadcaster_id, broadcaster_login,
  access_token_ciphertext, access_token_iv,
  refresh_token_ciphertext, refresh_token_iv,
  scopes_json, access_token_expires_at, status,
  created_at, updated_at, last_validated_at,
  refresh_lock_token, refresh_lock_until, site_id
FROM twitch_connections;

DROP TABLE twitch_connections;
ALTER TABLE twitch_connections_v2 RENAME TO twitch_connections;

CREATE INDEX idx_twitch_connections_user_id ON twitch_connections(user_id);
CREATE INDEX idx_twitch_connections_status ON twitch_connections(status);
CREATE INDEX idx_twitch_connections_refresh_lock
  ON twitch_connections(refresh_lock_until);
CREATE INDEX idx_twitch_connections_site_id
  ON twitch_connections(site_id);

CREATE TABLE twitch_oauth_states_v2 (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  state_hash TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  used_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  site_id TEXT NOT NULL
    REFERENCES sites(id) ON DELETE RESTRICT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO twitch_oauth_states_v2 (
  id, user_id, state_hash, expires_at, used_at, created_at, site_id
)
SELECT
  id, user_id, state_hash, expires_at, used_at, created_at, site_id
FROM twitch_oauth_states;

DROP TABLE twitch_oauth_states;
ALTER TABLE twitch_oauth_states_v2 RENAME TO twitch_oauth_states;

CREATE INDEX idx_twitch_oauth_states_expires_at
  ON twitch_oauth_states(expires_at);

CREATE INDEX idx_twitch_oauth_states_site_id
  ON twitch_oauth_states(site_id);

DROP TABLE __e44_editor_revisions_snapshot_20261007;
DROP TABLE __e44_pages_snapshot_20261007;

PRAGMA foreign_key_check;
