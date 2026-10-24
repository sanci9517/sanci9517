-- REVIEW ONLY. Execute as ONE D1 query transaction after approval and fresh preflight.
-- applied_at records reconciliation time, not historical installation time.
CREATE TABLE __ledger_reconcile_guard(ok INTEGER NOT NULL CHECK(ok=1));
INSERT INTO __ledger_reconcile_guard(ok) SELECT CASE WHEN EXISTS(SELECT 1 FROM sqlite_master WHERE type='index' AND name='idx_editor_revisions_created_at' AND tbl_name='editor_revisions' AND sql='CREATE INDEX idx_editor_revisions_created_at
  ON editor_revisions(created_at)')
 AND EXISTS(SELECT 1 FROM sqlite_master WHERE type='index' AND name='idx_editor_revisions_page' AND tbl_name='editor_revisions' AND sql='CREATE INDEX idx_editor_revisions_page
  ON editor_revisions(page_id, version DESC)')
 AND EXISTS(SELECT 1 FROM sqlite_master WHERE type='index' AND name='idx_editor_revisions_page_version' AND tbl_name='editor_revisions' AND sql='CREATE INDEX idx_editor_revisions_page_version
  ON editor_revisions(page_id, version DESC)')
 AND EXISTS(SELECT 1 FROM sqlite_master WHERE type='index' AND name='idx_media_site_archived' AND tbl_name='media' AND sql='CREATE INDEX idx_media_site_archived ON media(site_id,archived_at,created_at)')
 AND EXISTS(SELECT 1 FROM sqlite_master WHERE type='index' AND name='idx_media_site_id' AND tbl_name='media' AND sql='CREATE INDEX idx_media_site_id ON media(site_id)')
 AND EXISTS(SELECT 1 FROM sqlite_master WHERE type='index' AND name='idx_page_slug_redirects_page' AND tbl_name='page_slug_redirects' AND sql='CREATE INDEX idx_page_slug_redirects_page ON page_slug_redirects(page_id)')
 AND EXISTS(SELECT 1 FROM sqlite_master WHERE type='index' AND name='idx_pages_published_revision' AND tbl_name='pages' AND sql='CREATE INDEX idx_pages_published_revision
  ON pages(published_revision_id)')
 AND EXISTS(SELECT 1 FROM sqlite_master WHERE type='index' AND name='idx_pages_site_archive_order' AND tbl_name='pages' AND sql='CREATE INDEX idx_pages_site_archive_order ON pages(site_id,archived_at,sort_order)')
 AND EXISTS(SELECT 1 FROM sqlite_master WHERE type='index' AND name='idx_pages_site_id' AND tbl_name='pages' AND sql='CREATE INDEX idx_pages_site_id
  ON pages(site_id)')
 AND EXISTS(SELECT 1 FROM sqlite_master WHERE type='index' AND name='idx_pages_site_parent' AND tbl_name='pages' AND sql='CREATE INDEX idx_pages_site_parent ON pages(site_id,parent_page_id)')
 AND EXISTS(SELECT 1 FROM sqlite_master WHERE type='index' AND name='idx_pages_site_published_parent' AND tbl_name='pages' AND sql='CREATE INDEX idx_pages_site_published_parent ON pages(site_id,published_parent_page_id)')
 AND EXISTS(SELECT 1 FROM sqlite_master WHERE type='index' AND name='idx_pages_site_published_slug' AND tbl_name='pages' AND sql='CREATE UNIQUE INDEX idx_pages_site_published_slug ON pages(site_id,published_slug) WHERE published_slug IS NOT NULL')
 AND EXISTS(SELECT 1 FROM sqlite_master WHERE type='index' AND name='idx_pages_site_slug' AND tbl_name='pages' AND sql='CREATE UNIQUE INDEX idx_pages_site_slug ON pages(site_id,slug)')
 AND EXISTS(SELECT 1 FROM sqlite_master WHERE type='index' AND name='idx_pages_sort_order' AND tbl_name='pages' AND sql='CREATE INDEX idx_pages_sort_order
  ON pages(sort_order)')
 AND EXISTS(SELECT 1 FROM sqlite_master WHERE type='index' AND name='idx_site_domains_site' AND tbl_name='site_domains' AND sql='CREATE INDEX idx_site_domains_site ON site_domains(site_id,status)')
 AND EXISTS(SELECT 1 FROM sqlite_master WHERE type='index' AND name='idx_site_memberships_user_status' AND tbl_name='site_memberships' AND sql='CREATE INDEX idx_site_memberships_user_status
  ON site_memberships(user_id, status, site_id)')
 AND EXISTS(SELECT 1 FROM sqlite_master WHERE type='table' AND name='d1_migrations' AND tbl_name='d1_migrations' AND sql='CREATE TABLE d1_migrations(
		id         INTEGER PRIMARY KEY AUTOINCREMENT,
		name       TEXT UNIQUE,
		applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
)')
 AND EXISTS(SELECT 1 FROM sqlite_master WHERE type='table' AND name='editor_revisions' AND tbl_name='editor_revisions' AND sql='CREATE TABLE editor_revisions (
  id TEXT PRIMARY KEY,
  page_id TEXT NOT NULL,
  version INTEGER NOT NULL,
  document_json TEXT NOT NULL,
  created_by TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  note TEXT DEFAULT '''',
  UNIQUE(page_id, version),
  FOREIGN KEY(page_id) REFERENCES pages(id) ON DELETE CASCADE
)')
 AND EXISTS(SELECT 1 FROM sqlite_master WHERE type='table' AND name='media' AND tbl_name='media' AND sql='CREATE TABLE "media" (
  id TEXT PRIMARY KEY,
  object_key TEXT NOT NULL UNIQUE,
  original_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes INTEGER NOT NULL,
  alt_text TEXT NOT NULL DEFAULT '''',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  site_id TEXT NOT NULL
    REFERENCES sites(id) ON DELETE RESTRICT
, archived_at TEXT DEFAULT NULL)')
 AND EXISTS(SELECT 1 FROM sqlite_master WHERE type='table' AND name='page_slug_redirects' AND tbl_name='page_slug_redirects' AND sql='CREATE TABLE page_slug_redirects (
  site_id TEXT NOT NULL REFERENCES sites(id) ON DELETE RESTRICT,
  from_slug TEXT NOT NULL CHECK (
    length(from_slug) BETWEEN 1 AND 80
    AND from_slug NOT GLOB ''*[^a-z0-9-]*''
    AND from_slug NOT GLOB ''-*''
    AND from_slug NOT GLOB ''*-''
    AND instr(from_slug,''--'')=0
  ),
  page_id TEXT NOT NULL REFERENCES pages(id) ON DELETE RESTRICT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (site_id,from_slug)
)')
 AND EXISTS(SELECT 1 FROM sqlite_master WHERE type='table' AND name='pages' AND tbl_name='pages' AND sql='CREATE TABLE pages (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '''',
  content_json TEXT NOT NULL DEFAULT ''{}'',
  is_published INTEGER NOT NULL DEFAULT 1 CHECK (is_published IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  published_content_json TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  published_revision_id TEXT
    REFERENCES editor_revisions(id)
    ON DELETE SET NULL,
  site_id TEXT NOT NULL
    REFERENCES sites(id) ON DELETE RESTRICT
, published_slug TEXT, published_title TEXT, published_description TEXT, published_at TEXT, archived_at TEXT, parent_page_id TEXT REFERENCES pages(id) ON DELETE RESTRICT, published_parent_page_id TEXT REFERENCES pages(id) ON DELETE RESTRICT)')
 AND EXISTS(SELECT 1 FROM sqlite_master WHERE type='table' AND name='site_domains' AND tbl_name='site_domains' AND sql='CREATE TABLE site_domains (
  hostname TEXT PRIMARY KEY CHECK (hostname=lower(hostname) AND hostname NOT GLOB ''*[^a-z0-9.-]*''),
  site_id TEXT NOT NULL REFERENCES sites(id) ON DELETE RESTRICT,
  status TEXT NOT NULL CHECK (status IN (''pending'',''verified'',''revoked'')),
  verified_at TEXT,
  verification_method TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (status<>''verified'' OR (verified_at IS NOT NULL AND verification_method IS NOT NULL))
)')
 AND EXISTS(SELECT 1 FROM sqlite_master WHERE type='table' AND name='site_memberships' AND tbl_name='site_memberships' AND sql='CREATE TABLE site_memberships (
  site_id TEXT NOT NULL REFERENCES sites(id) ON DELETE RESTRICT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN (''admin'',''editor'',''viewer'')),
  status TEXT NOT NULL DEFAULT ''active'' CHECK (status IN (''active'',''revoked'')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (site_id, user_id)
)')
 AND EXISTS(SELECT 1 FROM sqlite_master WHERE type='table' AND name='site_scoped_settings' AND tbl_name='site_scoped_settings' AND sql='CREATE TABLE site_scoped_settings (
  site_id TEXT NOT NULL REFERENCES sites(id) ON DELETE RESTRICT,
  key TEXT NOT NULL CHECK (key IN (''site'')),
  value_json TEXT NOT NULL CHECK (json_valid(value_json)),
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(site_id, key)
)')
 AND EXISTS(SELECT 1 FROM sqlite_master WHERE type='trigger' AND name='editor_revisions_archived_guard' AND tbl_name='editor_revisions' AND sql='CREATE TRIGGER editor_revisions_archived_guard
BEFORE INSERT ON editor_revisions
WHEN EXISTS (SELECT 1 FROM pages WHERE id=NEW.page_id AND archived_at IS NOT NULL)
BEGIN
  SELECT RAISE(ABORT,''PAGE_ARCHIVED'');
END')
 AND EXISTS(SELECT 1 FROM sqlite_master WHERE type='trigger' AND name='media_archive_pages_insert_guard' AND tbl_name='pages' AND sql='CREATE TRIGGER media_archive_pages_insert_guard
BEFORE INSERT ON pages
WHEN EXISTS (
 SELECT 1 FROM media m WHERE m.site_id=NEW.site_id AND m.archived_at IS NOT NULL
 AND (instr(COALESCE(NEW.content_json,''''),m.id)>0 OR instr(COALESCE(NEW.published_content_json,''''),m.id)>0)
)
BEGIN SELECT RAISE(ABORT,''ARCHIVED_MEDIA_REFERENCE''); END')
 AND EXISTS(SELECT 1 FROM sqlite_master WHERE type='trigger' AND name='media_archive_pages_update_guard' AND tbl_name='pages' AND sql='CREATE TRIGGER media_archive_pages_update_guard
BEFORE UPDATE OF content_json,published_content_json ON pages
WHEN EXISTS (
 SELECT 1 FROM media m WHERE m.site_id=NEW.site_id AND m.archived_at IS NOT NULL
 AND (instr(COALESCE(NEW.content_json,''''),m.id)>0 OR instr(COALESCE(NEW.published_content_json,''''),m.id)>0)
)
BEGIN SELECT RAISE(ABORT,''ARCHIVED_MEDIA_REFERENCE''); END')
 AND EXISTS(SELECT 1 FROM sqlite_master WHERE type='trigger' AND name='media_archive_revisions_insert_guard' AND tbl_name='editor_revisions' AND sql='CREATE TRIGGER media_archive_revisions_insert_guard
BEFORE INSERT ON editor_revisions
WHEN EXISTS (
 SELECT 1 FROM media m JOIN pages p ON p.site_id=m.site_id
 WHERE p.id=NEW.page_id AND m.archived_at IS NOT NULL AND instr(NEW.document_json,m.id)>0
)
BEGIN SELECT RAISE(ABORT,''ARCHIVED_MEDIA_REFERENCE''); END')
 AND EXISTS(SELECT 1 FROM sqlite_master WHERE type='trigger' AND name='page_slug_redirect_immutable' AND tbl_name='page_slug_redirects' AND sql='CREATE TRIGGER page_slug_redirect_immutable
BEFORE UPDATE ON page_slug_redirects
BEGIN
 SELECT RAISE(ABORT,''REDIRECT_IMMUTABLE'');
END')
 AND EXISTS(SELECT 1 FROM sqlite_master WHERE type='trigger' AND name='page_slug_redirect_insert_guard' AND tbl_name='page_slug_redirects' AND sql='CREATE TRIGGER page_slug_redirect_insert_guard
BEFORE INSERT ON page_slug_redirects
BEGIN
 SELECT RAISE(ABORT,''REDIRECT_SITE_MISMATCH'') WHERE NOT EXISTS (
  SELECT 1 FROM pages p WHERE p.id=NEW.page_id AND p.site_id=NEW.site_id
 );
 SELECT RAISE(ABORT,''PAGE_SLUG_RESERVED'') WHERE EXISTS (
  SELECT 1 FROM pages p WHERE p.site_id=NEW.site_id AND p.id<>NEW.page_id
   AND (p.slug=NEW.from_slug OR p.published_slug=NEW.from_slug)
 );
END')
 AND EXISTS(SELECT 1 FROM sqlite_master WHERE type='trigger' AND name='pages_archive_navigation_guard' AND tbl_name='pages' AND sql='CREATE TRIGGER pages_archive_navigation_guard
BEFORE UPDATE OF archived_at ON pages
WHEN OLD.archived_at IS NULL AND NEW.archived_at IS NOT NULL
BEGIN
  SELECT RAISE(ABORT,''LAST_ACTIVE_PAGE'') WHERE
    (SELECT COUNT(*) FROM pages WHERE site_id=OLD.site_id AND archived_at IS NULL)<=1;
  SELECT RAISE(ABORT,''PAGE_IN_USE_BY_NAVIGATION'') WHERE EXISTS (
    SELECT 1 FROM site_navigation nav WHERE nav.site_id=OLD.site_id AND (
      EXISTS (SELECT 1 FROM json_tree(nav.draft_json) WHERE key=''pageId'' AND type=''text'' AND value=OLD.id)
      OR EXISTS (SELECT 1 FROM json_tree(nav.published_json) WHERE key=''pageId'' AND type=''text'' AND value=OLD.id)
    )
  );
END')
 AND EXISTS(SELECT 1 FROM sqlite_master WHERE type='trigger' AND name='pages_archived_edit_guard' AND tbl_name='pages' AND sql='CREATE TRIGGER pages_archived_edit_guard
BEFORE UPDATE OF content_json,title,slug,description,sort_order ON pages
WHEN OLD.archived_at IS NOT NULL AND NEW.archived_at IS NOT NULL
BEGIN
 SELECT RAISE(ABORT,''PAGE_ARCHIVED'');
END')
 AND EXISTS(SELECT 1 FROM sqlite_master WHERE type='trigger' AND name='pages_archived_publication_guard' AND tbl_name='pages' AND sql='CREATE TRIGGER pages_archived_publication_guard
BEFORE UPDATE ON pages
WHEN NEW.archived_at IS NOT NULL AND (
  NEW.is_published<>0 OR NEW.published_content_json IS NOT NULL OR NEW.published_revision_id IS NOT NULL
  OR NEW.published_slug IS NOT NULL OR NEW.published_title IS NOT NULL
  OR NEW.published_description IS NOT NULL OR NEW.published_at IS NOT NULL
)
BEGIN
  SELECT RAISE(ABORT,''PAGE_ARCHIVED'');
END')
 AND EXISTS(SELECT 1 FROM sqlite_master WHERE type='trigger' AND name='pages_draft_parent_guard' AND tbl_name='pages' AND sql='CREATE TRIGGER pages_draft_parent_guard
BEFORE UPDATE OF parent_page_id ON pages
WHEN NEW.parent_page_id IS NOT NULL
BEGIN
 SELECT RAISE(ABORT,''INVALID_PAGE_PARENT'') WHERE NEW.archived_at IS NOT NULL OR NOT EXISTS (
  SELECT 1 FROM pages parent WHERE parent.id=NEW.parent_page_id AND parent.site_id=NEW.site_id AND parent.archived_at IS NULL
 );
 SELECT RAISE(ABORT,''PAGE_HIERARCHY_CYCLE'') WHERE EXISTS (
  WITH RECURSIVE ancestors(id,parent_id) AS (
   SELECT id,parent_page_id FROM pages WHERE id=NEW.parent_page_id
   UNION
   SELECT p.id,p.parent_page_id FROM pages p JOIN ancestors a ON p.id=a.parent_id
  ) SELECT 1 FROM ancestors WHERE id=NEW.id
 );
END')
 AND EXISTS(SELECT 1 FROM sqlite_master WHERE type='trigger' AND name='pages_parent_delete_guard' AND tbl_name='pages' AND sql='CREATE TRIGGER pages_parent_delete_guard
BEFORE DELETE ON pages
WHEN EXISTS (SELECT 1 FROM pages child WHERE child.parent_page_id=OLD.id OR child.published_parent_page_id=OLD.id)
BEGIN
 SELECT RAISE(ABORT,''PAGE_HAS_CHILDREN'');
END')
 AND EXISTS(SELECT 1 FROM sqlite_master WHERE type='trigger' AND name='pages_parent_lifecycle_guard' AND tbl_name='pages' AND sql='CREATE TRIGGER pages_parent_lifecycle_guard
BEFORE UPDATE OF archived_at,is_published ON pages
WHEN (OLD.archived_at IS NULL AND NEW.archived_at IS NOT NULL) OR (OLD.is_published=1 AND NEW.is_published=0)
BEGIN
 SELECT RAISE(ABORT,''PAGE_HAS_CHILDREN'') WHERE OLD.archived_at IS NULL AND NEW.archived_at IS NOT NULL
  AND EXISTS (SELECT 1 FROM pages child WHERE child.parent_page_id=OLD.id OR child.published_parent_page_id=OLD.id);
 SELECT RAISE(ABORT,''PAGE_HAS_PUBLISHED_CHILDREN'') WHERE OLD.is_published=1 AND NEW.is_published=0
  AND EXISTS (SELECT 1 FROM pages child WHERE child.is_published=1 AND child.published_parent_page_id=OLD.id);
END')
 AND EXISTS(SELECT 1 FROM sqlite_master WHERE type='trigger' AND name='pages_prevent_navigation_target_delete' AND tbl_name='pages' AND sql='CREATE TRIGGER pages_prevent_navigation_target_delete
BEFORE DELETE ON pages
WHEN EXISTS (
  SELECT 1
  FROM site_navigation AS nav
  WHERE nav.site_id = OLD.site_id
    AND (
      EXISTS (
        SELECT 1 FROM json_tree(nav.draft_json)
        WHERE key = ''pageId'' AND type = ''text'' AND value = OLD.id
      )
      OR EXISTS (
        SELECT 1 FROM json_tree(nav.published_json)
        WHERE key = ''pageId'' AND type = ''text'' AND value = OLD.id
      )
    )
)
BEGIN
  SELECT RAISE(ABORT, ''PAGE_IN_USE_BY_NAVIGATION'');
END')
 AND EXISTS(SELECT 1 FROM sqlite_master WHERE type='trigger' AND name='pages_published_parent_guard' AND tbl_name='pages' AND sql='CREATE TRIGGER pages_published_parent_guard
BEFORE UPDATE OF published_parent_page_id,is_published ON pages
WHEN NEW.is_published=1 AND NEW.published_parent_page_id IS NOT NULL
BEGIN
 SELECT RAISE(ABORT,''INVALID_PUBLISHED_PAGE_PARENT'') WHERE NOT EXISTS (
  SELECT 1 FROM pages parent WHERE parent.id=NEW.published_parent_page_id AND parent.site_id=NEW.site_id
   AND parent.archived_at IS NULL AND parent.is_published=1
 );
 SELECT RAISE(ABORT,''PAGE_HIERARCHY_CYCLE'') WHERE EXISTS (
  WITH RECURSIVE ancestors(id,parent_id) AS (
   SELECT id,published_parent_page_id FROM pages WHERE id=NEW.published_parent_page_id
   UNION
   SELECT p.id,p.published_parent_page_id FROM pages p JOIN ancestors a ON p.id=a.parent_id
  ) SELECT 1 FROM ancestors WHERE id=NEW.id
 );
END')
 AND EXISTS(SELECT 1 FROM sqlite_master WHERE type='trigger' AND name='pages_redirect_delete_guard' AND tbl_name='pages' AND sql='CREATE TRIGGER pages_redirect_delete_guard
BEFORE DELETE ON pages
WHEN EXISTS (SELECT 1 FROM page_slug_redirects r WHERE r.page_id=OLD.id)
BEGIN
 SELECT RAISE(ABORT,''PAGE_HAS_REDIRECTS'');
END')
 AND EXISTS(SELECT 1 FROM sqlite_master WHERE type='trigger' AND name='pages_slug_namespace_insert_guard' AND tbl_name='pages' AND sql='CREATE TRIGGER pages_slug_namespace_insert_guard
BEFORE INSERT ON pages
WHEN EXISTS (SELECT 1 FROM page_slug_redirects r WHERE r.site_id=NEW.site_id AND r.from_slug=NEW.slug)
 OR (NEW.published_slug IS NOT NULL AND EXISTS (
  SELECT 1 FROM page_slug_redirects r WHERE r.site_id=NEW.site_id AND r.from_slug=NEW.published_slug
 ))
 OR EXISTS (SELECT 1 FROM pages p WHERE p.site_id=NEW.site_id AND p.published_slug=NEW.slug)
 OR (NEW.published_slug IS NOT NULL AND EXISTS (
  SELECT 1 FROM pages p WHERE p.site_id=NEW.site_id AND p.slug=NEW.published_slug
 ))
BEGIN
 SELECT RAISE(ABORT,''PAGE_SLUG_RESERVED'');
END')
 AND EXISTS(SELECT 1 FROM sqlite_master WHERE type='trigger' AND name='pages_slug_namespace_update_guard' AND tbl_name='pages' AND sql='CREATE TRIGGER pages_slug_namespace_update_guard
BEFORE UPDATE OF slug,published_slug,site_id ON pages
WHEN EXISTS (
  SELECT 1 FROM page_slug_redirects r WHERE r.site_id=NEW.site_id
   AND r.from_slug=NEW.slug AND r.page_id<>NEW.id
 )
 OR (NEW.published_slug IS NOT NULL AND EXISTS (
  SELECT 1 FROM page_slug_redirects r WHERE r.site_id=NEW.site_id AND r.from_slug=NEW.published_slug
 ))
 OR EXISTS (
  SELECT 1 FROM pages p WHERE p.site_id=NEW.site_id AND p.id<>NEW.id AND p.published_slug=NEW.slug
 )
 OR (NEW.published_slug IS NOT NULL AND EXISTS (
  SELECT 1 FROM pages p WHERE p.site_id=NEW.site_id AND p.id<>NEW.id AND p.slug=NEW.published_slug
 ))
BEGIN
 SELECT RAISE(ABORT,''PAGE_SLUG_RESERVED'');
END')
 AND (SELECT COUNT(*) FROM sqlite_master WHERE sql IS NOT NULL AND name NOT LIKE 'sqlite_%' AND tbl_name IN ('d1_migrations','editor_revisions','media','page_slug_redirects','pages','site_domains','site_memberships','site_scoped_settings'))=41
 AND NOT EXISTS(SELECT 1 FROM pragma_foreign_key_check)
 AND EXISTS(SELECT 1 FROM site_domains WHERE hostname='sanci9517-streamer-brand.sandor-bogadi95.workers.dev' AND site_id='site-default' AND status='verified' AND verification_method='cloudflare-worker-route' AND verified_at IS NOT NULL)
 AND NOT EXISTS(SELECT 1 FROM users u WHERE u.is_active=1 AND NOT EXISTS(SELECT 1 FROM site_memberships m WHERE m.site_id='site-default' AND m.user_id=u.id AND m.status='active' AND m.role=u.role))
 AND NOT EXISTS(SELECT 1 FROM site_settings s WHERE s.key='site' AND json_valid(s.value_json) AND NOT EXISTS(SELECT 1 FROM site_scoped_settings t WHERE t.site_id='site-default' AND t.key=s.key AND t.value_json=s.value_json))
 AND NOT EXISTS(SELECT 1 FROM sqlite_master WHERE name GLOB '__web013_*')
 AND EXISTS(SELECT 1 FROM d1_migrations WHERE name='0001_initial.sql')
 AND EXISTS(SELECT 1 FROM d1_migrations WHERE name='0002_twitch_oauth.sql')
 AND EXISTS(SELECT 1 FROM d1_migrations WHERE name='0001_initial_schema.sql')
 AND EXISTS(SELECT 1 FROM d1_migrations WHERE name='0002_auth_credentials.sql')
 AND EXISTS(SELECT 1 FROM d1_migrations WHERE name='0003_v2_initial_schema.sql')
 AND EXISTS(SELECT 1 FROM d1_migrations WHERE name='0004_v2_auth_credentials.sql')
 AND EXISTS(SELECT 1 FROM d1_migrations WHERE name='0004_system_page_content.sql')
 AND EXISTS(SELECT 1 FROM d1_migrations WHERE name='0002_editor_platform.sql')
 AND EXISTS(SELECT 1 FROM d1_migrations WHERE name='0003_legacy_pages.sql')
 AND EXISTS(SELECT 1 FROM d1_migrations WHERE name='0002_editor_revisions.sql')
 AND EXISTS(SELECT 1 FROM d1_migrations WHERE name='0005_canonical_page_storage.sql')
 AND EXISTS(SELECT 1 FROM d1_migrations WHERE name='0006_canonicalize_legacy_pages.sql')
 AND EXISTS(SELECT 1 FROM d1_migrations WHERE name='0007_sync_published_canonical_pages.sql')
 AND EXISTS(SELECT 1 FROM d1_migrations WHERE name='0008_restore_canonical_standard_pages.sql')
 AND EXISTS(SELECT 1 FROM d1_migrations WHERE name='0009_page_sort_order.sql')
 AND EXISTS(SELECT 1 FROM d1_migrations WHERE name='0010_canonical_revision_contract.sql')
 AND EXISTS(SELECT 1 FROM d1_migrations WHERE name='0011_twitch_integration.sql')
 AND EXISTS(SELECT 1 FROM d1_migrations WHERE name='0012_twitch_refresh_lock.sql')
 AND EXISTS(SELECT 1 FROM d1_migrations WHERE name='0013_schedule_source_sync.sql')
 AND EXISTS(SELECT 1 FROM d1_migrations WHERE name='0014_twitch_connection_status.sql')
 AND EXISTS(SELECT 1 FROM d1_migrations WHERE name='0015_site_ownership_foundation.sql')
 AND EXISTS(SELECT 1 FROM d1_migrations WHERE name='0016_twitch_oauth_site_ownership.sql')
 AND EXISTS(SELECT 1 FROM d1_migrations WHERE name='0017_site_ownership_not_null.sql')
 AND EXISTS(SELECT 1 FROM d1_migrations WHERE name='0018_published_page_metadata.sql')
 AND EXISTS(SELECT 1 FROM d1_migrations WHERE name='0019_published_page_timestamp.sql')
 AND EXISTS(SELECT 1 FROM d1_migrations WHERE name='0020_site_navigation_snapshots.sql')
 AND EXISTS(SELECT 1 FROM d1_migrations WHERE name='0021_prevent_deleting_navigation_pages.sql')
 AND EXISTS(SELECT 1 FROM d1_migrations WHERE name='0022_page_archive.sql')
 AND EXISTS(SELECT 1 FROM d1_migrations WHERE name='0023_page_hierarchy.sql')
 AND EXISTS(SELECT 1 FROM d1_migrations WHERE name='0024_page_slug_redirects.sql')
 AND NOT EXISTS(SELECT 1 FROM d1_migrations WHERE name IS NULL OR name NOT IN ('0001_initial.sql','0001_initial_schema.sql','0002_auth_credentials.sql','0002_editor_platform.sql','0002_editor_revisions.sql','0002_twitch_oauth.sql','0003_legacy_pages.sql','0003_v2_initial_schema.sql','0004_system_page_content.sql','0004_v2_auth_credentials.sql','0005_canonical_page_storage.sql','0006_canonicalize_legacy_pages.sql','0007_sync_published_canonical_pages.sql','0008_restore_canonical_standard_pages.sql','0009_page_sort_order.sql','0010_canonical_revision_contract.sql','0011_twitch_integration.sql','0012_twitch_refresh_lock.sql','0013_schedule_source_sync.sql','0014_twitch_connection_status.sql','0015_site_ownership_foundation.sql','0016_twitch_oauth_site_ownership.sql','0017_site_ownership_not_null.sql','0018_published_page_metadata.sql','0019_published_page_timestamp.sql','0020_site_navigation_snapshots.sql','0021_prevent_deleting_navigation_pages.sql','0022_page_archive.sql','0023_page_hierarchy.sql','0024_page_slug_redirects.sql','0025_site_domains_and_site_slug.sql','0026_site_memberships.sql','0027_site_scoped_settings.sql','0028_media_archive.sql')) THEN 1 ELSE 0 END;
INSERT INTO d1_migrations(name) SELECT '0025_site_domains_and_site_slug.sql' WHERE NOT EXISTS(SELECT 1 FROM d1_migrations WHERE name='0025_site_domains_and_site_slug.sql');
INSERT INTO d1_migrations(name) SELECT '0026_site_memberships.sql' WHERE NOT EXISTS(SELECT 1 FROM d1_migrations WHERE name='0026_site_memberships.sql');
INSERT INTO d1_migrations(name) SELECT '0027_site_scoped_settings.sql' WHERE NOT EXISTS(SELECT 1 FROM d1_migrations WHERE name='0027_site_scoped_settings.sql');
INSERT INTO d1_migrations(name) SELECT '0028_media_archive.sql' WHERE NOT EXISTS(SELECT 1 FROM d1_migrations WHERE name='0028_media_archive.sql');
DROP TABLE __ledger_reconcile_guard;
