-- RES-004: Soft-archive private media without deleting R2 binaries.
-- Existing assets remain active. Archived bytes continue to count toward site quota.
ALTER TABLE media ADD COLUMN archived_at TEXT DEFAULT NULL;
CREATE INDEX idx_media_site_archived ON media(site_id,archived_at,created_at);

-- New published/draft/revision references must never point to an archived asset.
-- SQL-level guards close the gap between Editor preflight and concurrent archive.
CREATE TRIGGER media_archive_pages_insert_guard
BEFORE INSERT ON pages
WHEN EXISTS (
 SELECT 1 FROM media m WHERE m.site_id=NEW.site_id AND m.archived_at IS NOT NULL
 AND (instr(COALESCE(NEW.content_json,''),m.id)>0 OR instr(COALESCE(NEW.published_content_json,''),m.id)>0)
)
BEGIN SELECT RAISE(ABORT,'ARCHIVED_MEDIA_REFERENCE'); END;

CREATE TRIGGER media_archive_pages_update_guard
BEFORE UPDATE OF content_json,published_content_json ON pages
WHEN EXISTS (
 SELECT 1 FROM media m WHERE m.site_id=NEW.site_id AND m.archived_at IS NOT NULL
 AND (instr(COALESCE(NEW.content_json,''),m.id)>0 OR instr(COALESCE(NEW.published_content_json,''),m.id)>0)
)
BEGIN SELECT RAISE(ABORT,'ARCHIVED_MEDIA_REFERENCE'); END;

CREATE TRIGGER media_archive_revisions_insert_guard
BEFORE INSERT ON editor_revisions
WHEN EXISTS (
 SELECT 1 FROM media m JOIN pages p ON p.site_id=m.site_id
 WHERE p.id=NEW.page_id AND m.archived_at IS NOT NULL AND instr(NEW.document_json,m.id)>0
)
BEGIN SELECT RAISE(ABORT,'ARCHIVED_MEDIA_REFERENCE'); END;
