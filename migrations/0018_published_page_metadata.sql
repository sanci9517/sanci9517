-- F0.3: preserve the live page identity independently of draft edits.
-- Existing pages are test content; retain their current published identity as a safe backfill.
ALTER TABLE pages ADD COLUMN published_slug TEXT;
ALTER TABLE pages ADD COLUMN published_title TEXT;
ALTER TABLE pages ADD COLUMN published_description TEXT;
UPDATE pages SET published_slug=slug,published_title=title,published_description=description WHERE is_published=1;
CREATE UNIQUE INDEX IF NOT EXISTS idx_pages_site_published_slug ON pages(site_id,published_slug) WHERE published_slug IS NOT NULL;
