-- F1.1 / WEB-003 + WEB-009: do not leave saved menus pointing at a deleted page.
-- Keep this invariant in D1 as well as the Admin response so concurrent
-- navigation edits cannot race a page deletion.
CREATE TRIGGER IF NOT EXISTS pages_prevent_navigation_target_delete
BEFORE DELETE ON pages
WHEN EXISTS (
  SELECT 1
  FROM site_navigation AS nav
  WHERE nav.site_id = OLD.site_id
    AND (
      EXISTS (
        SELECT 1 FROM json_tree(nav.draft_json)
        WHERE key = 'pageId' AND type = 'text' AND value = OLD.id
      )
      OR EXISTS (
        SELECT 1 FROM json_tree(nav.published_json)
        WHERE key = 'pageId' AND type = 'text' AND value = OLD.id
      )
    )
)
BEGIN
  SELECT RAISE(ABORT, 'PAGE_IN_USE_BY_NAVIGATION');
END;
