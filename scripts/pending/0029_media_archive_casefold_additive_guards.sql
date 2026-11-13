-- 77.44.7.D D-06. REVIEW/PREFLIGHT: intentionally ADDITIVE, not DROP/REPLACE.
-- The three 0028 guards remain installed and unchanged throughout rollout.
-- Manual-only production schema change. Never run via the ordinary deploy path.
-- Preconditions: exactly one 0028 ledger row; exactly the original 3 guard
-- definitions, no other casefold guard; exact current Time Travel bookmark.
-- Execute each CREATE TRIGGER as one statement, verify after each step;
-- on partial failure, STOP: original guards still protect lowercase refs.
-- Enter 0029 ledger marker ONLY AFTER all three new guards are verified.
CREATE TRIGGER media_archive_pages_insert_casefold_guard
BEFORE INSERT ON pages
WHEN EXISTS (
 SELECT 1 FROM media m WHERE m.site_id=NEW.site_id AND m.archived_at IS NOT NULL
 AND (instr(lower(COALESCE(NEW.content_json,'')),lower(m.id))>0
      OR instr(lower(COALESCE(NEW.published_content_json,'')),lower(m.id))>0)
)
BEGIN SELECT RAISE(ABORT,'ARCHIVED_MEDIA_REFERENCE'); END;

CREATE TRIGGER media_archive_pages_update_casefold_guard
BEFORE UPDATE OF content_json,published_content_json ON pages
WHEN EXISTS (
 SELECT 1 FROM media m WHERE m.site_id=NEW.site_id AND m.archived_at IS NOT NULL
 AND (instr(lower(COALESCE(NEW.content_json,'')),lower(m.id))>0
      OR instr(lower(COALESCE(NEW.published_content_json,'')),lower(m.id))>0)
)
BEGIN SELECT RAISE(ABORT,'ARCHIVED_MEDIA_REFERENCE'); END;

CREATE TRIGGER media_archive_revisions_insert_casefold_guard
BEFORE INSERT ON editor_revisions
WHEN EXISTS (
 SELECT 1 FROM media m JOIN pages p ON p.site_id=m.site_id
 WHERE p.id=NEW.page_id AND m.archived_at IS NOT NULL
 AND instr(lower(COALESCE(NEW.document_json,'')),lower(m.id))>0
)
BEGIN SELECT RAISE(ABORT,'ARCHIVED_MEDIA_REFERENCE'); END;
