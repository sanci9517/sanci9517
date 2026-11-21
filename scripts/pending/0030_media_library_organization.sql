-- RES-006: site-scoped Media Library folders, tags and collections.
-- MANUAL-ONLY CANDIDATE: never add this file to automatic migrations or apply
-- to production without the separate read-only preflight and explicit owner
-- approval required by AGENTS.md.

CREATE TABLE media_folders (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL REFERENCES sites(id) ON DELETE RESTRICT,
  name TEXT NOT NULL CHECK(length(name) BETWEEN 1 AND 80 AND name=trim(name)),
  name_key TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(site_id,id),
  UNIQUE(site_id,name_key)
);

CREATE TABLE media_tags (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL REFERENCES sites(id) ON DELETE RESTRICT,
  name TEXT NOT NULL CHECK(length(name) BETWEEN 1 AND 80 AND name=trim(name)),
  name_key TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(site_id,id),
  UNIQUE(site_id,name_key)
);

CREATE TABLE media_collections (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL REFERENCES sites(id) ON DELETE RESTRICT,
  name TEXT NOT NULL CHECK(length(name) BETWEEN 1 AND 80 AND name=trim(name)),
  name_key TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(site_id,id),
  UNIQUE(site_id,name_key)
);

CREATE UNIQUE INDEX idx_media_site_id_unique ON media(site_id,id);
ALTER TABLE media ADD COLUMN folder_id TEXT REFERENCES media_folders(id) ON DELETE SET NULL;
CREATE INDEX idx_media_site_folder_created ON media(site_id,folder_id,created_at DESC,id DESC);

CREATE TABLE media_asset_tags (
  site_id TEXT NOT NULL,
  asset_id TEXT NOT NULL,
  tag_id TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(site_id,asset_id,tag_id),
  FOREIGN KEY(site_id,asset_id) REFERENCES media(site_id,id) ON DELETE CASCADE,
  FOREIGN KEY(site_id,tag_id) REFERENCES media_tags(site_id,id) ON DELETE CASCADE
);
CREATE INDEX idx_media_asset_tags_tag ON media_asset_tags(site_id,tag_id,asset_id);

CREATE TABLE media_collection_assets (
  site_id TEXT NOT NULL,
  collection_id TEXT NOT NULL,
  asset_id TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0 CHECK(position BETWEEN 0 AND 999999),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(site_id,collection_id,asset_id),
  FOREIGN KEY(site_id,collection_id) REFERENCES media_collections(site_id,id) ON DELETE CASCADE,
  FOREIGN KEY(site_id,asset_id) REFERENCES media(site_id,id) ON DELETE CASCADE
);
CREATE INDEX idx_media_collection_assets_asset ON media_collection_assets(site_id,asset_id,collection_id);

CREATE TRIGGER media_folder_site_insert_guard
BEFORE INSERT ON media WHEN NEW.folder_id IS NOT NULL
BEGIN
  SELECT RAISE(ABORT,'MEDIA_FOLDER_SITE_MISMATCH') WHERE NOT EXISTS (
    SELECT 1 FROM media_folders f WHERE f.id=NEW.folder_id AND f.site_id=NEW.site_id
  );
END;
CREATE TRIGGER media_folder_site_update_guard
BEFORE UPDATE OF folder_id,site_id ON media WHEN NEW.folder_id IS NOT NULL
BEGIN
  SELECT RAISE(ABORT,'MEDIA_FOLDER_SITE_MISMATCH') WHERE NOT EXISTS (
    SELECT 1 FROM media_folders f WHERE f.id=NEW.folder_id AND f.site_id=NEW.site_id
  );
END;

-- Both membership tables use composite tenant foreign keys, so a caller can
-- never attach another site's asset, tag or collection even if IDs are known.
