-- Sanci9517 canonical page migration — 2026-09-16
-- One-time conversion: legacy page rows become canonical Visual Editor documents.
-- Legacy HTML files are archived separately; the editor/public system no longer reads legacySource.
PRAGMA foreign_keys = ON;

UPDATE pages
SET
  content_json = json_object(
    'schemaVersion', 2,
    'type', 'sanci-document',
    'pages', json_array(json_object(
      'id', id,
      'name', title,
      'slug', slug,
      'metadata', json_object('migratedAt','2026-09-16','migrationSource','legacy-html'),
      'settings', json_object(),
      'responsive', json_object('desktop',json_object(),'tablet',json_object(),'mobile',json_object()),
      'root', json_object(
        'id', 'root-' || id,
        'type', 'root',
        'name', 'Oldal',
        'parentId', NULL,
        'children', json_array(
          json_object(
            'id', 'migrated-' || slug || '-heading',
            'type', 'heading',
            'name', title,
            'parentId', 'root-' || id,
            'children', json_array(),
            'content', json_object('text', title),
            'layout', json_object('x',40,'y',40,'width',920,'height',90,'position','absolute'),
            'style', json_object('fontSize',32,'fontWeight',700,'color','#ffffff','background','transparent','border','none','radius',8),
            'responsive', json_object('desktop',json_object(),'tablet',json_object(),'mobile',json_object()),
            'interaction', json_object(),
            'visibility', 1,
            'locked', 0,
            'metadata', json_object(),
            'dataBindings', json_object(),
            'capabilities', json_object()
          ),
          json_object(
            'id', 'migrated-' || slug || '-content',
            'type', CASE slug WHEN 'schedule' THEN 'schedule' WHEN 'twitch' THEN 'live' WHEN 'youtube' THEN 'youtube' WHEN 'tiktok' THEN 'tiktok' WHEN 'vod' THEN 'vod' WHEN 'community' THEN 'community' ELSE 'text' END,
            'name', description,
            'parentId', 'root-' || id,
            'children', json_array(),
            'content', json_object('text', description),
            'layout', json_object('x',40,'y',155,'width',920,'height',120,'position','absolute'),
            'style', json_object('fontSize',16,'fontWeight',400,'color','#ffffff','background','transparent','border','none','radius',8),
            'responsive', json_object('desktop',json_object(),'tablet',json_object(),'mobile',json_object()),
            'interaction', json_object(),
            'visibility', 1,
            'locked', 0,
            'metadata', json_object(),
            'dataBindings', json_object(),
            'capabilities', json_object()
          )
        )
      )
    )),
  'activePageId', id
  ),
  published_content_json = content_json,
  is_published = 1,
  updated_at = CURRENT_TIMESTAMP
WHERE id LIKE 'legacy-%'
  AND json_extract(content_json, '$.type') IS NULL;

INSERT OR IGNORE INTO editor_revisions (id,page_id,version,document_json,created_by,note)
SELECT
  'migration-20260916-' || slug || '-v1',
  id,
  1,
  content_json,
  NULL,
  '2026-09-16 canonical migration from legacy HTML'
FROM pages
WHERE id LIKE 'legacy-%';
