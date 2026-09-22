PRAGMA foreign_keys = ON;

-- Canonical revision/publish linkage.
-- A published page always points at the exact editor revision whose snapshot is LIVE.
ALTER TABLE pages
  ADD COLUMN published_revision_id TEXT
  REFERENCES editor_revisions(id)
  ON DELETE SET NULL;

-- Recover the linkage for existing published snapshots where an exact revision snapshot exists.
UPDATE pages
SET published_revision_id = (
  SELECT er.id
  FROM editor_revisions er
  WHERE er.page_id = pages.id
    AND er.document_json = pages.published_content_json
  ORDER BY er.version DESC
  LIMIT 1
)
WHERE is_published = 1
  AND published_content_json IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_pages_published_revision
  ON pages(published_revision_id);
