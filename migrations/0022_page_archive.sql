-- WEB-003: archived pages retain drafts and revisions, never a LIVE snapshot.
ALTER TABLE pages ADD COLUMN archived_at TEXT;
CREATE INDEX idx_pages_site_archive_order ON pages(site_id,archived_at,sort_order);

CREATE TRIGGER pages_archive_navigation_guard
BEFORE UPDATE OF archived_at ON pages
WHEN OLD.archived_at IS NULL AND NEW.archived_at IS NOT NULL
BEGIN
  SELECT RAISE(ABORT,'LAST_ACTIVE_PAGE') WHERE
    (SELECT COUNT(*) FROM pages WHERE site_id=OLD.site_id AND archived_at IS NULL)<=1;
  SELECT RAISE(ABORT,'PAGE_IN_USE_BY_NAVIGATION') WHERE EXISTS (
    SELECT 1 FROM site_navigation nav WHERE nav.site_id=OLD.site_id AND (
      EXISTS (SELECT 1 FROM json_tree(nav.draft_json) WHERE key='pageId' AND type='text' AND value=OLD.id)
      OR EXISTS (SELECT 1 FROM json_tree(nav.published_json) WHERE key='pageId' AND type='text' AND value=OLD.id)
    )
  );
END;

CREATE TRIGGER pages_archived_publication_guard
BEFORE UPDATE ON pages
WHEN NEW.archived_at IS NOT NULL AND (
  NEW.is_published<>0 OR NEW.published_content_json IS NOT NULL OR NEW.published_revision_id IS NOT NULL
  OR NEW.published_slug IS NOT NULL OR NEW.published_title IS NOT NULL
  OR NEW.published_description IS NOT NULL OR NEW.published_at IS NOT NULL
)
BEGIN
  SELECT RAISE(ABORT,'PAGE_ARCHIVED');
END;

-- A stale editor save/publish/rollback must roll its whole D1 batch back.
CREATE TRIGGER editor_revisions_archived_guard
BEFORE INSERT ON editor_revisions
WHEN EXISTS (SELECT 1 FROM pages WHERE id=NEW.page_id AND archived_at IS NOT NULL)
BEGIN
  SELECT RAISE(ABORT,'PAGE_ARCHIVED');
END;

-- Close the race between route validation and a concurrent archive operation.
CREATE TRIGGER navigation_archived_target_update_guard
BEFORE UPDATE OF draft_json,published_json ON site_navigation
WHEN EXISTS (
 SELECT 1 FROM pages p WHERE p.site_id=NEW.site_id AND p.archived_at IS NOT NULL AND (
  EXISTS (SELECT 1 FROM json_tree(NEW.draft_json) WHERE key='pageId' AND type='text' AND value=p.id)
  OR EXISTS (SELECT 1 FROM json_tree(NEW.published_json) WHERE key='pageId' AND type='text' AND value=p.id)
 )
)
BEGIN
 SELECT RAISE(ABORT,'NAVIGATION_TARGET_ARCHIVED');
END;
CREATE TRIGGER navigation_archived_target_insert_guard
BEFORE INSERT ON site_navigation
WHEN EXISTS (
 SELECT 1 FROM pages p WHERE p.site_id=NEW.site_id AND p.archived_at IS NOT NULL AND (
  EXISTS (SELECT 1 FROM json_tree(NEW.draft_json) WHERE key='pageId' AND type='text' AND value=p.id)
  OR EXISTS (SELECT 1 FROM json_tree(NEW.published_json) WHERE key='pageId' AND type='text' AND value=p.id)
 )
)
BEGIN
 SELECT RAISE(ABORT,'NAVIGATION_TARGET_ARCHIVED');
END;

CREATE TRIGGER pages_archived_edit_guard
BEFORE UPDATE OF content_json,title,slug,description,sort_order ON pages
WHEN OLD.archived_at IS NOT NULL AND NEW.archived_at IS NOT NULL
BEGIN
 SELECT RAISE(ABORT,'PAGE_ARCHIVED');
END;
