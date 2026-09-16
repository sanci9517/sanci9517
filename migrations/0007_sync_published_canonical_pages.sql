-- Sanci9517 canonical publication repair — 2026-09-16
-- 0006 was already recorded by D1 before its final publication-sync SQL was present.
-- This migration explicitly makes the published snapshot canonical for every canonical page.
PRAGMA foreign_keys = ON;

UPDATE pages
SET
  published_content_json = content_json,
  is_published = 1,
  updated_at = CURRENT_TIMESTAMP
WHERE json_extract(content_json, '$.type') = 'sanci-document'
  AND json_array_length(json_extract(content_json, '$.pages')) = 1;
