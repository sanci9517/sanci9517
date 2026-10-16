-- WEB-002 foundation: page hierarchy is separate from the navigation tree and flat /p/<slug> routes.
-- Existing pages remain roots. The published parent changes only with an explicit page publish.
ALTER TABLE pages ADD COLUMN parent_page_id TEXT REFERENCES pages(id) ON DELETE RESTRICT;
ALTER TABLE pages ADD COLUMN published_parent_page_id TEXT REFERENCES pages(id) ON DELETE RESTRICT;
CREATE INDEX idx_pages_site_parent ON pages(site_id,parent_page_id);
CREATE INDEX idx_pages_site_published_parent ON pages(site_id,published_parent_page_id);

CREATE TRIGGER pages_draft_parent_guard
BEFORE UPDATE OF parent_page_id ON pages
WHEN NEW.parent_page_id IS NOT NULL
BEGIN
 SELECT RAISE(ABORT,'INVALID_PAGE_PARENT') WHERE NEW.archived_at IS NOT NULL OR NOT EXISTS (
  SELECT 1 FROM pages parent WHERE parent.id=NEW.parent_page_id AND parent.site_id=NEW.site_id AND parent.archived_at IS NULL
 );
 SELECT RAISE(ABORT,'PAGE_HIERARCHY_CYCLE') WHERE EXISTS (
  WITH RECURSIVE ancestors(id,parent_id) AS (
   SELECT id,parent_page_id FROM pages WHERE id=NEW.parent_page_id
   UNION
   SELECT p.id,p.parent_page_id FROM pages p JOIN ancestors a ON p.id=a.parent_id
  ) SELECT 1 FROM ancestors WHERE id=NEW.id
 );
END;

CREATE TRIGGER pages_published_parent_guard
BEFORE UPDATE OF published_parent_page_id,is_published ON pages
WHEN NEW.is_published=1 AND NEW.published_parent_page_id IS NOT NULL
BEGIN
 SELECT RAISE(ABORT,'INVALID_PUBLISHED_PAGE_PARENT') WHERE NOT EXISTS (
  SELECT 1 FROM pages parent WHERE parent.id=NEW.published_parent_page_id AND parent.site_id=NEW.site_id
   AND parent.archived_at IS NULL AND parent.is_published=1
 );
 SELECT RAISE(ABORT,'PAGE_HIERARCHY_CYCLE') WHERE EXISTS (
  WITH RECURSIVE ancestors(id,parent_id) AS (
   SELECT id,published_parent_page_id FROM pages WHERE id=NEW.published_parent_page_id
   UNION
   SELECT p.id,p.published_parent_page_id FROM pages p JOIN ancestors a ON p.id=a.parent_id
  ) SELECT 1 FROM ancestors WHERE id=NEW.id
 );
END;

CREATE TRIGGER pages_parent_lifecycle_guard
BEFORE UPDATE OF archived_at,is_published ON pages
WHEN (OLD.archived_at IS NULL AND NEW.archived_at IS NOT NULL) OR (OLD.is_published=1 AND NEW.is_published=0)
BEGIN
 SELECT RAISE(ABORT,'PAGE_HAS_CHILDREN') WHERE OLD.archived_at IS NULL AND NEW.archived_at IS NOT NULL
  AND EXISTS (SELECT 1 FROM pages child WHERE child.parent_page_id=OLD.id OR child.published_parent_page_id=OLD.id);
 SELECT RAISE(ABORT,'PAGE_HAS_PUBLISHED_CHILDREN') WHERE OLD.is_published=1 AND NEW.is_published=0
  AND EXISTS (SELECT 1 FROM pages child WHERE child.is_published=1 AND child.published_parent_page_id=OLD.id);
END;

CREATE TRIGGER pages_parent_delete_guard
BEFORE DELETE ON pages
WHEN EXISTS (SELECT 1 FROM pages child WHERE child.parent_page_id=OLD.id OR child.published_parent_page_id=OLD.id)
BEGIN
 SELECT RAISE(ABORT,'PAGE_HAS_CHILDREN');
END;
