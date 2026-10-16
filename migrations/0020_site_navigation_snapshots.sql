-- F1.1 / WEB-009: introduce one canonical site-scoped navigation snapshot.
-- Seed the current public menu from published pages so switching the public
-- renderer to this source can preserve each site's existing links and order.
CREATE TABLE IF NOT EXISTS site_navigation (
  site_id TEXT PRIMARY KEY NOT NULL
    REFERENCES sites(id) ON DELETE CASCADE,
  draft_json TEXT NOT NULL CHECK (json_valid(draft_json)),
  published_json TEXT NOT NULL CHECK (json_valid(published_json)),
  revision INTEGER NOT NULL DEFAULT 1 CHECK (revision >= 1),
  published_revision INTEGER NOT NULL DEFAULT 1 CHECK (published_revision >= 1),
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO site_navigation (
  site_id,
  draft_json,
  published_json,
  revision,
  published_revision
)
SELECT
  s.id,
  json_object(
    'schemaVersion', 1,
    'items', json(COALESCE((
      SELECT json_group_array(json_object(
        'id', 'page:' || p.id,
        'type', 'page',
        'pageId', p.id,
        'children', json('[]')
      ))
      FROM (
        SELECT id
        FROM pages
        WHERE site_id = s.id
          AND is_published = 1
          AND published_slug IS NOT NULL
          AND published_slug <> 'home'
        ORDER BY sort_order ASC, id ASC
        LIMIT 100
      ) AS p
    ), '[]'))
  ),
  json_object(
    'schemaVersion', 1,
    'items', json(COALESCE((
      SELECT json_group_array(json_object(
        'id', 'page:' || p.id,
        'type', 'page',
        'pageId', p.id,
        'children', json('[]')
      ))
      FROM (
        SELECT id
        FROM pages
        WHERE site_id = s.id
          AND is_published = 1
          AND published_slug IS NOT NULL
          AND published_slug <> 'home'
        ORDER BY sort_order ASC, id ASC
        LIMIT 100
      ) AS p
    ), '[]'))
  ),
  1,
  1
FROM sites AS s;
