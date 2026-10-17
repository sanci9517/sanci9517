-- Read-only preflight for the PENDING 0025 site-scope migration.
-- Inspect every result before authorizing any production D1 change.
PRAGMA quick_check;
PRAGMA foreign_key_check;

SELECT 'pages_schema' AS check_name, sql FROM sqlite_master WHERE type='table' AND name='pages';
SELECT 'page_related_schema' AS check_name, type, name, sql FROM sqlite_master
 WHERE (tbl_name IN ('pages','editor_revisions','page_slug_redirects') AND sql IS NOT NULL)
 ORDER BY type,name;
SELECT 'site_default' AS check_name, id, status FROM sites WHERE id='site-default';

SELECT 'pages' AS table_name, COUNT(*) AS row_count FROM pages
UNION ALL SELECT 'editor_revisions',COUNT(*) FROM editor_revisions
UNION ALL SELECT 'page_slug_redirects',COUNT(*) FROM page_slug_redirects;

SELECT 'null_or_orphan_site' AS check_name, COUNT(*) AS failures FROM pages p
 LEFT JOIN sites s ON s.id=p.site_id WHERE p.site_id IS NULL OR s.id IS NULL;
SELECT 'duplicate_site_slug' AS check_name, site_id,slug,COUNT(*) AS copies
 FROM pages GROUP BY site_id,slug HAVING COUNT(*)>1;
SELECT 'duplicate_site_published_slug' AS check_name, site_id,published_slug,COUNT(*) AS copies
 FROM pages WHERE published_slug IS NOT NULL GROUP BY site_id,published_slug HAVING COUNT(*)>1;
SELECT 'orphan_revision' AS check_name,COUNT(*) AS failures FROM editor_revisions r
 LEFT JOIN pages p ON p.id=r.page_id WHERE p.id IS NULL;
SELECT 'broken_published_revision' AS check_name,COUNT(*) AS failures FROM pages p
 LEFT JOIN editor_revisions r ON r.id=p.published_revision_id
 WHERE p.published_revision_id IS NOT NULL AND r.id IS NULL;
SELECT 'orphan_or_cross_site_redirect' AS check_name,COUNT(*) AS failures FROM page_slug_redirects r
 LEFT JOIN pages p ON p.id=r.page_id WHERE p.id IS NULL OR p.site_id<>r.site_id;
SELECT 'broken_parent' AS check_name,COUNT(*) AS failures FROM pages child
 LEFT JOIN pages parent ON parent.id=child.parent_page_id
 WHERE child.parent_page_id IS NOT NULL AND (parent.id IS NULL OR parent.site_id<>child.site_id);
SELECT 'broken_published_parent' AS check_name,COUNT(*) AS failures FROM pages child
 LEFT JOIN pages parent ON parent.id=child.published_parent_page_id
 WHERE child.published_parent_page_id IS NOT NULL AND (parent.id IS NULL OR parent.site_id<>child.site_id);
