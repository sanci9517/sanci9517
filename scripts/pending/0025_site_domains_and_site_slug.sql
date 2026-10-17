-- PENDING / NOT IN migrations/: requires approved production D1 change.
-- Run only after scripts/web013-site-scope-preflight.sql, verified backup/PITR,
-- write freeze and offline rehearsal against a current production export.
-- D1 must execute this file as one transaction; do not split statements.
PRAGMA defer_foreign_keys = ON;

CREATE TABLE __web013_pages_snapshot AS SELECT * FROM pages;
CREATE TABLE __web013_editor_revisions_snapshot AS SELECT * FROM editor_revisions;
CREATE TABLE __web013_page_slug_redirects_snapshot AS SELECT * FROM page_slug_redirects;

DROP TABLE page_slug_redirects;
DROP TABLE editor_revisions;
DROP TABLE pages;

CREATE TABLE pages (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  content_json TEXT NOT NULL DEFAULT '{}',
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
, published_slug TEXT, published_title TEXT, published_description TEXT, published_at TEXT, archived_at TEXT, parent_page_id TEXT REFERENCES pages(id) ON DELETE RESTRICT, published_parent_page_id TEXT REFERENCES pages(id) ON DELETE RESTRICT);

CREATE TABLE editor_revisions (
  id TEXT PRIMARY KEY,
  page_id TEXT NOT NULL,
  version INTEGER NOT NULL,
  document_json TEXT NOT NULL,
  created_by TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  note TEXT DEFAULT '',
  UNIQUE(page_id, version),
  FOREIGN KEY(page_id) REFERENCES pages(id) ON DELETE CASCADE
);

CREATE TABLE page_slug_redirects (
  site_id TEXT NOT NULL REFERENCES sites(id) ON DELETE RESTRICT,
  from_slug TEXT NOT NULL CHECK (
    length(from_slug) BETWEEN 1 AND 80
    AND from_slug NOT GLOB '*[^a-z0-9-]*'
    AND from_slug NOT GLOB '-*'
    AND from_slug NOT GLOB '*-'
    AND instr(from_slug,'--')=0
  ),
  page_id TEXT NOT NULL REFERENCES pages(id) ON DELETE RESTRICT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (site_id,from_slug)
);

INSERT INTO pages (id,slug,title,description,content_json,is_published,created_at,updated_at,published_content_json,sort_order,published_revision_id,site_id,published_slug,published_title,published_description,published_at,archived_at,parent_page_id,published_parent_page_id) SELECT id,slug,title,description,content_json,is_published,created_at,updated_at,published_content_json,sort_order,published_revision_id,site_id,published_slug,published_title,published_description,published_at,archived_at,parent_page_id,published_parent_page_id FROM __web013_pages_snapshot;
INSERT INTO editor_revisions (id,page_id,version,document_json,created_by,created_at,note) SELECT id,page_id,version,document_json,created_by,created_at,note FROM __web013_editor_revisions_snapshot;
INSERT INTO page_slug_redirects (site_id,from_slug,page_id,created_at) SELECT site_id,from_slug,page_id,created_at FROM __web013_page_slug_redirects_snapshot;

-- Draft URLs are unique within a site; duplicate slugs on different sites are valid.
CREATE UNIQUE INDEX idx_pages_site_slug ON pages(site_id,slug);
CREATE INDEX idx_editor_revisions_created_at
  ON editor_revisions(created_at);
CREATE INDEX idx_editor_revisions_page
  ON editor_revisions(page_id, version DESC);
CREATE INDEX idx_editor_revisions_page_version
  ON editor_revisions(page_id, version DESC);
CREATE INDEX idx_page_slug_redirects_page ON page_slug_redirects(page_id);
CREATE INDEX idx_pages_published_revision
  ON pages(published_revision_id);
CREATE INDEX idx_pages_site_archive_order ON pages(site_id,archived_at,sort_order);
CREATE INDEX idx_pages_site_id
  ON pages(site_id);
CREATE INDEX idx_pages_site_parent ON pages(site_id,parent_page_id);
CREATE INDEX idx_pages_site_published_parent ON pages(site_id,published_parent_page_id);
CREATE UNIQUE INDEX idx_pages_site_published_slug ON pages(site_id,published_slug) WHERE published_slug IS NOT NULL;
CREATE INDEX idx_pages_sort_order
  ON pages(sort_order);

CREATE TRIGGER editor_revisions_archived_guard
BEFORE INSERT ON editor_revisions
WHEN EXISTS (SELECT 1 FROM pages WHERE id=NEW.page_id AND archived_at IS NOT NULL)
BEGIN
  SELECT RAISE(ABORT,'PAGE_ARCHIVED');
END;

CREATE TRIGGER page_slug_redirect_immutable
BEFORE UPDATE ON page_slug_redirects
BEGIN
 SELECT RAISE(ABORT,'REDIRECT_IMMUTABLE');
END;

CREATE TRIGGER page_slug_redirect_insert_guard
BEFORE INSERT ON page_slug_redirects
BEGIN
 SELECT RAISE(ABORT,'REDIRECT_SITE_MISMATCH') WHERE NOT EXISTS (
  SELECT 1 FROM pages p WHERE p.id=NEW.page_id AND p.site_id=NEW.site_id
 );
 SELECT RAISE(ABORT,'PAGE_SLUG_RESERVED') WHERE EXISTS (
  SELECT 1 FROM pages p WHERE p.site_id=NEW.site_id AND p.id<>NEW.page_id
   AND (p.slug=NEW.from_slug OR p.published_slug=NEW.from_slug)
 );
END;

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

CREATE TRIGGER pages_archived_edit_guard
BEFORE UPDATE OF content_json,title,slug,description,sort_order ON pages
WHEN OLD.archived_at IS NOT NULL AND NEW.archived_at IS NOT NULL
BEGIN
 SELECT RAISE(ABORT,'PAGE_ARCHIVED');
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

CREATE TRIGGER pages_parent_delete_guard
BEFORE DELETE ON pages
WHEN EXISTS (SELECT 1 FROM pages child WHERE child.parent_page_id=OLD.id OR child.published_parent_page_id=OLD.id)
BEGIN
 SELECT RAISE(ABORT,'PAGE_HAS_CHILDREN');
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

CREATE TRIGGER pages_prevent_navigation_target_delete
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

CREATE TRIGGER pages_redirect_delete_guard
BEFORE DELETE ON pages
WHEN EXISTS (SELECT 1 FROM page_slug_redirects r WHERE r.page_id=OLD.id)
BEGIN
 SELECT RAISE(ABORT,'PAGE_HAS_REDIRECTS');
END;

CREATE TRIGGER pages_slug_namespace_insert_guard
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
 SELECT RAISE(ABORT,'PAGE_SLUG_RESERVED');
END;

CREATE TRIGGER pages_slug_namespace_update_guard
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
 SELECT RAISE(ABORT,'PAGE_SLUG_RESERVED');
END;

-- Only explicitly verified hostnames can resolve to a site. No wildcard aliases.
CREATE TABLE site_domains (
  hostname TEXT PRIMARY KEY CHECK (hostname=lower(hostname) AND hostname NOT GLOB '*[^a-z0-9.-]*'),
  site_id TEXT NOT NULL REFERENCES sites(id) ON DELETE RESTRICT,
  status TEXT NOT NULL CHECK (status IN ('pending','verified','revoked')),
  verified_at TEXT,
  verification_method TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (status<>'verified' OR (verified_at IS NOT NULL AND verification_method IS NOT NULL))
);
CREATE INDEX idx_site_domains_site ON site_domains(site_id,status);
-- Existing Cloudflare-owned Worker hostname is the sole trusted bootstrap mapping.
INSERT INTO site_domains(hostname,site_id,status,verified_at,verification_method)
VALUES ('sanci9517-streamer-brand.sandor-bogadi95.workers.dev','site-default','verified',CURRENT_TIMESTAMP,'cloudflare-worker-route');

-- A failed FK check aborts the transaction rather than silently returning rows.
CREATE TABLE __web013_fk_guard(ok INTEGER NOT NULL CHECK(ok=1));
INSERT INTO __web013_fk_guard(ok) SELECT CASE WHEN EXISTS(SELECT 1 FROM pragma_foreign_key_check) THEN 0 ELSE 1 END;
DROP TABLE __web013_fk_guard;
DROP TABLE __web013_pages_snapshot;
DROP TABLE __web013_editor_revisions_snapshot;
DROP TABLE __web013_page_slug_redirects_snapshot;
