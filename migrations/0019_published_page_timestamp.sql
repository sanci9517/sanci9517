-- Explicit publish time is separate from the last draft edit time.
ALTER TABLE pages ADD COLUMN published_at TEXT;
UPDATE pages SET published_at=updated_at WHERE is_published=1 AND published_content_json IS NOT NULL;
