-- 77.44.7.D / D-06 malformed JSON with Unicode escapes.
-- MANUAL-ONLY CANDIDATE: not applied by deploy:safe; production needs a fresh
-- read-only preflight and separately approved D1 migration operation.
-- The 0029 guards decode valid JSON. These guards conservatively block only
-- malformed documents that contain a JSON Unicode-escape marker for assets
-- already archived in the owning site. Malformed documents without escapes
-- and references to other sites remain unaffected.
--
-- Each CREATE TRIGGER is a standalone, idempotent D1 REST query. The trigger
-- remains inert until the final guarded d1_migrations marker is inserted.
-- This makes a failed/interrupted sequence safe to resume without assuming
-- transaction semantics for a multi-statement REST request.

CREATE TRIGGER IF NOT EXISTS media_archive_pages_insert_malformed_guard
BEFORE INSERT ON pages
WHEN EXISTS (SELECT 1 FROM d1_migrations WHERE name='0031_media_archive_malformed_json_guard.sql')
AND EXISTS (
 SELECT 1 FROM media m
 WHERE m.site_id=NEW.site_id AND m.archived_at IS NOT NULL
 AND (
  (instr(COALESCE(NEW.content_json,''),char(92)||'u')>0 AND NOT json_valid(NEW.content_json))
  OR (instr(COALESCE(NEW.published_content_json,''),char(92)||'u')>0 AND NOT json_valid(NEW.published_content_json))
 )
)
BEGIN SELECT RAISE(ABORT,'ARCHIVED_MEDIA_REFERENCE'); END;

CREATE TRIGGER IF NOT EXISTS media_archive_pages_update_malformed_guard
BEFORE UPDATE OF content_json,published_content_json,site_id ON pages
WHEN EXISTS (SELECT 1 FROM d1_migrations WHERE name='0031_media_archive_malformed_json_guard.sql')
AND EXISTS (
 SELECT 1 FROM media m
 WHERE m.site_id=NEW.site_id AND m.archived_at IS NOT NULL
 AND (
  (instr(COALESCE(NEW.content_json,''),char(92)||'u')>0 AND NOT json_valid(NEW.content_json))
  OR (instr(COALESCE(NEW.published_content_json,''),char(92)||'u')>0 AND NOT json_valid(NEW.published_content_json))
  OR (NEW.site_id<>OLD.site_id AND EXISTS (
   SELECT 1 FROM editor_revisions er WHERE er.page_id=NEW.id
   AND instr(COALESCE(er.document_json,''),char(92)||'u')>0
   AND NOT json_valid(er.document_json)
  ))
 )
)
BEGIN SELECT RAISE(ABORT,'ARCHIVED_MEDIA_REFERENCE'); END;

CREATE TRIGGER IF NOT EXISTS media_archive_revisions_insert_malformed_guard
BEFORE INSERT ON editor_revisions
WHEN EXISTS (SELECT 1 FROM d1_migrations WHERE name='0031_media_archive_malformed_json_guard.sql')
AND EXISTS (
 SELECT 1 FROM media m JOIN pages p ON p.site_id=m.site_id
 WHERE p.id=NEW.page_id AND m.archived_at IS NOT NULL
 AND instr(COALESCE(NEW.document_json,''),char(92)||'u')>0
 AND NOT json_valid(NEW.document_json)
)
BEGIN SELECT RAISE(ABORT,'ARCHIVED_MEDIA_REFERENCE'); END;

CREATE TRIGGER IF NOT EXISTS media_archive_revisions_update_malformed_guard
BEFORE UPDATE OF document_json,page_id ON editor_revisions
WHEN EXISTS (SELECT 1 FROM d1_migrations WHERE name='0031_media_archive_malformed_json_guard.sql')
AND EXISTS (
 SELECT 1 FROM media m JOIN pages p ON p.site_id=m.site_id
 WHERE p.id=NEW.page_id AND m.archived_at IS NOT NULL
 AND instr(COALESCE(NEW.document_json,''),char(92)||'u')>0
 AND NOT json_valid(NEW.document_json)
)
BEGIN SELECT RAISE(ABORT,'ARCHIVED_MEDIA_REFERENCE'); END;
