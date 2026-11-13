-- REVIEW ONLY / MANUAL D1 CHANGE, NOT AN AUTOMATIC MIGRATION.
-- 77.44.7.D / D-06. Requires explicit owner approval, a fresh SELECT-only
-- production preflight, and an atomic, isolated D1 migration runbook.
-- Never edit the already-applied immutable 0028 migration or trigger a
-- production migration through npm run deploy. No R2 object is deleted.
-- This file is deliberately kept under scripts/pending, not migrations/.
--
-- Preconditions: 0028 ledger marker and all three original guards present.
-- Execute ONLY with atomic rollback. The temporary guard enforces this prior
-- to the DROP/CREATE pair. Do not execute line-by-line against production.
CREATE TABLE __media_0029_casefold_guard(ok INTEGER NOT NULL CHECK(ok=1));
INSERT INTO __media_0029_casefold_guard(ok)
SELECT CASE WHEN
  (SELECT COUNT(*) FROM d1_migrations WHERE name='0028_media_archive.sql')=1
  AND (SELECT COUNT(*) FROM d1_migrations WHERE name='0029_media_archive_casefold_guards.sql')=0
  AND (SELECT COUNT(*) FROM sqlite_master
       WHERE type='trigger' AND name IN
       ('media_archive_pages_insert_guard','media_archive_pages_update_guard','media_archive_revisions_insert_guard'))=3
  AND (SELECT COUNT(*) FROM sqlite_master WHERE type='trigger' AND name IN
       ('media_archive_pages_insert_guard','media_archive_pages_update_guard','media_archive_revisions_insert_guard')
       AND instr(sql,'ARCHIVED_MEDIA_REFERENCE')>0 AND instr(sql,'lower(')=0)=3
THEN 1 ELSE 0 END;

DROP TRIGGER IF EXISTS media_archive_pages_insert_guard;
DROP TRIGGER IF EXISTS media_archive_pages_update_guard;
DROP TRIGGER IF EXISTS media_archive_revisions_insert_guard;

CREATE TRIGGER media_archive_pages_insert_guard
BEFORE INSERT ON pages
WHEN EXISTS (
 SELECT 1 FROM media m WHERE m.site_id=NEW.site_id AND m.archived_at IS NOT NULL
 AND (instr(lower(COALESCE(NEW.content_json,'')),lower(m.id))>0
      OR instr(lower(COALESCE(NEW.published_content_json,'')),lower(m.id))>0)
)
BEGIN SELECT RAISE(ABORT,'ARCHIVED_MEDIA_REFERENCE'); END;

CREATE TRIGGER media_archive_pages_update_guard
BEFORE UPDATE OF content_json,published_content_json ON pages
WHEN EXISTS (
 SELECT 1 FROM media m WHERE m.site_id=NEW.site_id AND m.archived_at IS NOT NULL
 AND (instr(lower(COALESCE(NEW.content_json,'')),lower(m.id))>0
      OR instr(lower(COALESCE(NEW.published_content_json,'')),lower(m.id))>0)
)
BEGIN SELECT RAISE(ABORT,'ARCHIVED_MEDIA_REFERENCE'); END;

CREATE TRIGGER media_archive_revisions_insert_guard
BEFORE INSERT ON editor_revisions
WHEN EXISTS (
 SELECT 1 FROM media m JOIN pages p ON p.site_id=m.site_id
 WHERE p.id=NEW.page_id AND m.archived_at IS NOT NULL
   AND instr(lower(COALESCE(NEW.document_json,'')),lower(m.id))>0
)
BEGIN SELECT RAISE(ABORT,'ARCHIVED_MEDIA_REFERENCE'); END;
-- The 0029 marker must commit or roll back together with the trigger swap.
INSERT INTO d1_migrations(name) VALUES('0029_media_archive_casefold_guards.sql');
DROP TABLE __media_0029_casefold_guard;
