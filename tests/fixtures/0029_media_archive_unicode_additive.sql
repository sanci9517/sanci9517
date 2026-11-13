-- 77.44.7.D / D-06 REVIEW-ONLY SQLite candidate; not a production migration.
-- Additive: never DROP or mutate the three original 0028 archive triggers.
-- Source expression mirrors src/core/media-reference-sql.js (casefold + JSON decoding).
-- This file is intentionally under tests/fixtures, not migrations/ or scripts/pending/.
-- Production deployment requires an independently approved schema/backup gate.
CREATE TRIGGER media_archive_pages_insert_unicode_guard
BEFORE INSERT ON pages
WHEN EXISTS (
 SELECT 1 FROM media m
 WHERE m.site_id=NEW.site_id AND m.archived_at IS NOT NULL
 AND (
  instr(lower(COALESCE(NEW.content_json,'')),lower(m.id))>0
  OR (instr(COALESCE(NEW.content_json,''),char(92)||'u')>0 AND EXISTS (
   SELECT 1 FROM json_tree(CASE WHEN json_valid(NEW.content_json) THEN NEW.content_json ELSE 'null' END) j
   WHERE j.type='text' AND instr(lower(j.value),lower(m.id))>0))
  OR instr(lower(COALESCE(NEW.published_content_json,'')),lower(m.id))>0
  OR (instr(COALESCE(NEW.published_content_json,''),char(92)||'u')>0 AND EXISTS (
   SELECT 1 FROM json_tree(CASE WHEN json_valid(NEW.published_content_json) THEN NEW.published_content_json ELSE 'null' END) j
   WHERE j.type='text' AND instr(lower(j.value),lower(m.id))>0))
 )
)
BEGIN SELECT RAISE(ABORT,'ARCHIVED_MEDIA_REFERENCE'); END;

CREATE TRIGGER media_archive_pages_update_unicode_guard
BEFORE UPDATE OF content_json,published_content_json,site_id ON pages
WHEN EXISTS (
 SELECT 1 FROM media m
 WHERE m.site_id=NEW.site_id AND m.archived_at IS NOT NULL
 AND (
  instr(lower(COALESCE(NEW.content_json,'')),lower(m.id))>0
  OR (instr(COALESCE(NEW.content_json,''),char(92)||'u')>0 AND EXISTS (
   SELECT 1 FROM json_tree(CASE WHEN json_valid(NEW.content_json) THEN NEW.content_json ELSE 'null' END) j
   WHERE j.type='text' AND instr(lower(j.value),lower(m.id))>0))
  OR instr(lower(COALESCE(NEW.published_content_json,'')),lower(m.id))>0
  OR (instr(COALESCE(NEW.published_content_json,''),char(92)||'u')>0 AND EXISTS (
   SELECT 1 FROM json_tree(CASE WHEN json_valid(NEW.published_content_json) THEN NEW.published_content_json ELSE 'null' END) j
   WHERE j.type='text' AND instr(lower(j.value),lower(m.id))>0))
  OR (NEW.site_id<>OLD.site_id AND EXISTS (
   SELECT 1 FROM editor_revisions er WHERE er.page_id=NEW.id AND (
    instr(lower(COALESCE(er.document_json,'')),lower(m.id))>0
    OR (instr(COALESCE(er.document_json,''),char(92)||'u')>0 AND EXISTS (
     SELECT 1 FROM json_tree(CASE WHEN json_valid(er.document_json) THEN er.document_json ELSE 'null' END) j
     WHERE j.type='text' AND instr(lower(j.value),lower(m.id))>0))
   )))
 )
)
BEGIN SELECT RAISE(ABORT,'ARCHIVED_MEDIA_REFERENCE'); END;

CREATE TRIGGER media_archive_revisions_insert_unicode_guard
BEFORE INSERT ON editor_revisions
WHEN EXISTS (
 SELECT 1 FROM media m JOIN pages p ON p.site_id=m.site_id
 WHERE p.id=NEW.page_id AND m.archived_at IS NOT NULL
 AND (
  instr(lower(COALESCE(NEW.document_json,'')),lower(m.id))>0
  OR (instr(COALESCE(NEW.document_json,''),char(92)||'u')>0 AND EXISTS (
   SELECT 1 FROM json_tree(CASE WHEN json_valid(NEW.document_json) THEN NEW.document_json ELSE 'null' END) j
   WHERE j.type='text' AND instr(lower(j.value),lower(m.id))>0))
 )
)
BEGIN SELECT RAISE(ABORT,'ARCHIVED_MEDIA_REFERENCE'); END;

CREATE TRIGGER media_archive_revisions_update_unicode_guard
BEFORE UPDATE OF document_json,page_id ON editor_revisions
WHEN EXISTS (
 SELECT 1 FROM media m JOIN pages p ON p.site_id=m.site_id
 WHERE p.id=NEW.page_id AND m.archived_at IS NOT NULL
 AND (
  instr(lower(COALESCE(NEW.document_json,'')),lower(m.id))>0
  OR (instr(COALESCE(NEW.document_json,''),char(92)||'u')>0 AND EXISTS (
   SELECT 1 FROM json_tree(CASE WHEN json_valid(NEW.document_json) THEN NEW.document_json ELSE 'null' END) j
   WHERE j.type='text' AND instr(lower(j.value),lower(m.id))>0))
 )
)
BEGIN SELECT RAISE(ABORT,'ARCHIVED_MEDIA_REFERENCE'); END;
