-- WEB-002/WEB-013: a published slug is moved only by the existing explicit publish.
-- Redirects keep page identity, so an old URL always resolves in one hop to its
-- current published slug. Existing pages and URLs are left untouched.
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
CREATE INDEX idx_page_slug_redirects_page ON page_slug_redirects(page_id);

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

-- Historical aliases cannot be silently reassigned to another page. An alias
-- of the same page may become its draft slug; publish removes that alias first.
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

CREATE TRIGGER page_slug_redirect_immutable
BEFORE UPDATE ON page_slug_redirects
BEGIN
 SELECT RAISE(ABORT,'REDIRECT_IMMUTABLE');
END;

CREATE TRIGGER pages_redirect_delete_guard
BEFORE DELETE ON pages
WHEN EXISTS (SELECT 1 FROM page_slug_redirects r WHERE r.page_id=OLD.id)
BEGIN
 SELECT RAISE(ABORT,'PAGE_HAS_REDIRECTS');
END;
