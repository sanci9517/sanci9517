PRAGMA foreign_keys = ON;

-- Canonical editor storage:
-- pages.content_json is the current draft/canonical editor document.
-- pages.published_content_json is the last explicitly published snapshot.
ALTER TABLE pages ADD COLUMN published_content_json TEXT;

UPDATE pages
SET published_content_json = CASE
  WHEN is_published = 1 THEN content_json
  ELSE NULL
END
WHERE published_content_json IS NULL;
