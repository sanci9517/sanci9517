-- RES-004: Soft-archive private media without deleting R2 binaries.
-- Existing assets remain active. Archived bytes continue to count toward site quota.
ALTER TABLE media ADD COLUMN archived_at TEXT DEFAULT NULL;
CREATE INDEX idx_media_site_archived ON media(site_id,archived_at,created_at);
