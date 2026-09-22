-- Sanci9517 canonical page repair — 2026-09-22
-- Restore the current public navigation pages as empty Editor v2 Page Model documents.
-- This is intentionally idempotent and never overwrites an existing page row.
PRAGMA foreign_keys = ON;

WITH standard_pages(id,slug,title,description) AS (
  VALUES
    ('page-home','home','Főoldal','Sanci9517 főoldala'),
    ('page-twitch','twitch','Élő adás','Twitch'),
    ('page-schedule','schedule','Adásrend','Időpontok'),
    ('page-youtube','youtube','YouTube','Videók'),
    ('page-tiktok','tiktok','TikTok','Rövid klipek'),
    ('page-about','about','Rólam','Sanci9517'),
    ('page-contact','contact','Kapcsolat','Elérhetőség')
),
documents(id,slug,title,description,document_json) AS (
  SELECT
    id,
    slug,
    title,
    description,
    json_object(
      'schemaVersion', 1,
      'type', 'sanci-page-document',
      'siteId', NULL,
      'activePageId', id,
      'pages', json_object(
        id, json_object(
          'id', id,
          'name', title,
          'slug', slug,
          'status', 'draft',
          'metadata', json_object(
            'title', title,
            'description', description,
            'canonical', '',
            'openGraph', json_object()
          ),
          'settings', json_object(
            'templateId', NULL,
            'access', 'public',
            'customCode', json_object('head', '', 'bodyStart', '', 'bodyEnd', '')
          ),
          'schemaVersion', 1,
          'rootId', 'root-' || id,
          'nodes', json_object(
            'root-' || id, json_object(
              'id', 'root-' || id,
              'type', 'root',
              'name', 'Oldal',
              'parentId', NULL,
              'children', json_array(),
              'props', json_object(),
              'style', json_object(),
              'responsive', json_object('desktop', json_object(), 'tablet', json_object(), 'mobile', json_object()),
              'states', json_object(),
              'visibility', json_object('desktop', 1, 'tablet', 1, 'mobile', 1),
              'locked', 0,
              'component', NULL,
              'dataBindings', json_object(),
              'interactions', json_array(),
              'accessibility', json_object(),
              'metadata', json_object()
            )
          ),
          'revision', 0
        )
      ),
      'metadata', json_object('createdBy', 'canonical-page-repair', 'createdAt', '2026-09-22')
    )
  FROM standard_pages
)
INSERT OR IGNORE INTO pages
  (id, slug, title, description, content_json, published_content_json, is_published, created_at, updated_at)
SELECT
  id, slug, title, description, document_json, document_json, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM documents;

INSERT OR IGNORE INTO editor_revisions
  (id, page_id, version, document_json, created_by, note)
SELECT
  'repair-20260922-' || id || '-v1',
  id,
  1,
  content_json,
  NULL,
  'Canonical üres oldal visszaállítva az Editor v2 Page Modelhez'
FROM pages
WHERE id IN (
  'page-home',
  'page-twitch',
  'page-schedule',
  'page-youtube',
  'page-tiktok',
  'page-about',
  'page-contact'
)
AND json_extract(content_json, '$.type') = 'sanci-page-document';
