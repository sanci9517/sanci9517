PRAGMA foreign_keys = ON;

PRAGMA quick_check;
PRAGMA foreign_key_check;

SELECT 'pages' AS table_name,
       COUNT(*) AS row_count,
       COALESCE(SUM(CASE WHEN site_id IS NULL THEN 1 ELSE 0 END),0) AS null_site_id
FROM pages
UNION ALL
SELECT 'schedule_items',
       COUNT(*),
       COALESCE(SUM(CASE WHEN site_id IS NULL THEN 1 ELSE 0 END),0)
FROM schedule_items
UNION ALL
SELECT 'media',
       COUNT(*),
       COALESCE(SUM(CASE WHEN site_id IS NULL THEN 1 ELSE 0 END),0)
FROM media
UNION ALL
SELECT 'social_accounts',
       COUNT(*),
       COALESCE(SUM(CASE WHEN site_id IS NULL THEN 1 ELSE 0 END),0)
FROM social_accounts
UNION ALL
SELECT 'twitch_connections',
       COUNT(*),
       COALESCE(SUM(CASE WHEN site_id IS NULL THEN 1 ELSE 0 END),0)
FROM twitch_connections
UNION ALL
SELECT 'twitch_oauth_states',
       COUNT(*),
       COALESCE(SUM(CASE WHEN site_id IS NULL THEN 1 ELSE 0 END),0)
FROM twitch_oauth_states;

SELECT name
FROM sqlite_master
WHERE type='index'
  AND name IN (
    'idx_pages_site_id',
    'idx_schedule_site_starts',
    'idx_media_site_id',
    'idx_social_accounts_site_id',
    'idx_twitch_connections_site_id',
    'idx_twitch_oauth_states_site_id'
  )
ORDER BY name;

SELECT name, sql
FROM sqlite_master
WHERE type='table'
  AND name IN (
    'sites',
    'pages',
    'schedule_items',
    'media',
    'social_accounts',
    'twitch_connections',
    'twitch_oauth_states'
  )
ORDER BY name;
