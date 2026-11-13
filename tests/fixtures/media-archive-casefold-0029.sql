-- 77.44.7.D / D-06. MANUAL CANDIDATE ONLY. DO NOT execute on production.
-- This is not a Wrangler migration and MUST NOT be run as individual REST /query
-- statements. A single proven-atomic D1 execution context is mandatory.
-- The immutable 0028 migration remains untouched; no R2 operations occur.
-- Decode JSON Unicode escapes with json_tree only when a \u sequence is present.
-- This prevents an archived UUID hidden by JSON escapes from bypassing guards.
-- Malformed legacy JSON falls back to the original raw-text matching.
-- The temporary guard aborts if 0028, exact original guards, or a fresh 0029
-- ledger slot is absent. Review all three trigger definitions independently
-- with read-only sqlite_master queries immediately before any approved change.
CREATE TABLE __media_0029_casefold_guard(ok INTEGER NOT NULL CHECK(ok=1));
INSERT INTO __media_0029_casefold_guard(ok)
SELECT CASE WHEN
  (SELECT COUNT(*) FROM d1_migrations WHERE name='0028_media_archive.sql')=1
  AND (SELECT COUNT(*) FROM d1_migrations WHERE name='0029_media_archive_casefold_guards.sql')=0
  AND (SELECT COUNT(*) FROM sqlite_master WHERE type='trigger'
       AND name IN ('media_archive_pages_insert_guard','media_archive_pages_update_guard','media_archive_revisions_insert_guard'))=3
  AND (SELECT COUNT(*) FROM sqlite_master WHERE type='trigger'
       AND name='media_archive_pages_insert_guard'
       AND sql LIKE '%instr(COALESCE(NEW.content_json%')=1
  AND (SELECT COUNT(*) FROM sqlite_master WHERE type='trigger'
       AND name='media_archive_pages_update_guard'
       AND sql LIKE '%instr(COALESCE(NEW.published_content_json%')=1
  AND (SELECT COUNT(*) FROM sqlite_master WHERE type='trigger'
       AND name='media_archive_revisions_insert_guard'
       AND sql LIKE '%instr(NEW.document_json,m.id)%')=1
THEN 1 ELSE 0 END;

DROP TRIGGER media_archive_pages_insert_guard;
DROP TRIGGER media_archive_pages_update_guard;
DROP TRIGGER media_archive_revisions_insert_guard;

CREATE TRIGGER media_archive_pages_insert_guard
BEFORE INSERT ON pages
WHEN EXISTS (
 SELECT 1 FROM media m WHERE m.site_id=NEW.site_id AND m.archived_at IS NOT NULL
 AND (
      instr(lower(COALESCE(NEW.content_json,'')),lower(m.id))>0
      OR (instr(COALESCE(NEW.content_json,''),char(92)||'u')>0
          AND EXISTS (SELECT 1 FROM json_tree(CASE WHEN json_valid(NEW.content_json) THEN NEW.content_json ELSE 'null' END) j
                      WHERE j.type='text' AND instr(lower(j.value),lower(m.id))>0))
      OR instr(lower(COALESCE(NEW.published_content_json,'')),lower(m.id))>0
      OR (instr(COALESCE(NEW.published_content_json,''),char(92)||'u')>0
          AND EXISTS (SELECT 1 FROM json_tree(CASE WHEN json_valid(NEW.published_content_json) THEN NEW.published_content_json ELSE 'null' END) j
                      WHERE j.type='text' AND instr(lower(j.value),lower(m.id))>0))
 )
)
BEGIN SELECT RAISE(ABORT,'ARCHIVED_MEDIA_REFERENCE'); END;

CREATE TRIGGER media_archive_pages_update_guard
BEFORE UPDATE OF content_json,published_content_json ON pages
WHEN EXISTS (
 SELECT 1 FROM media m WHERE m.site_id=NEW.site_id AND m.archived_at IS NOT NULL
 AND (
      instr(lower(COALESCE(NEW.content_json,'')),lower(m.id))>0
      OR (instr(COALESCE(NEW.content_json,''),char(92)||'u')>0
          AND EXISTS (SELECT 1 FROM json_tree(CASE WHEN json_valid(NEW.content_json) THEN NEW.content_json ELSE 'null' END) j
                      WHERE j.type='text' AND instr(lower(j.value),lower(m.id))>0))
      OR instr(lower(COALESCE(NEW.published_content_json,'')),lower(m.id))>0
      OR (instr(COALESCE(NEW.published_content_json,''),char(92)||'u')>0
          AND EXISTS (SELECT 1 FROM json_tree(CASE WHEN json_valid(NEW.published_content_json) THEN NEW.published_content_json ELSE 'null' END) j
                      WHERE j.type='text' AND instr(lower(j.value),lower(m.id))>0))
 )
)
BEGIN SELECT RAISE(ABORT,'ARCHIVED_MEDIA_REFERENCE'); END;

CREATE TRIGGER media_archive_revisions_insert_guard
BEFORE INSERT ON editor_revisions
WHEN EXISTS (
 SELECT 1 FROM media m JOIN pages p ON p.site_id=m.site_id
 WHERE p.id=NEW.page_id AND m.archived_at IS NOT NULL
   AND (instr(lower(COALESCE(NEW.document_json,'')),lower(m.id))>0
        OR (instr(COALESCE(NEW.document_json,''),char(92)||'u')>0
            AND EXISTS (SELECT 1 FROM json_tree(CASE WHEN json_valid(NEW.document_json) THEN NEW.document_json ELSE 'null' END) j
                        WHERE j.type='text' AND instr(lower(j.value),lower(m.id))>0)))
)
BEGIN SELECT RAISE(ABORT,'ARCHIVED_MEDIA_REFERENCE'); END;

-- The ledger is deliberately in the SAME atomic change as the trigger swap.
INSERT INTO d1_migrations(name) VALUES('0029_media_archive_casefold_guards.sql');
DROP TABLE __media_0029_casefold_guard;
