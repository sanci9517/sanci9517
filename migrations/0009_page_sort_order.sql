ALTER TABLE pages ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0;

UPDATE pages
SET sort_order = (
  SELECT COUNT(*)
  FROM pages AS p2
  WHERE p2.updated_at > pages.updated_at
     OR (p2.updated_at = pages.updated_at AND p2.title < pages.title)
     OR (p2.updated_at = pages.updated_at AND p2.title = pages.title AND p2.id < pages.id)
);

CREATE INDEX IF NOT EXISTS idx_pages_sort_order ON pages(sort_order);