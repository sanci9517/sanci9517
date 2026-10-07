PRAGMA foreign_keys = ON;

PRAGMA quick_check;
PRAGMA foreign_key_check;

SELECT 'pages' AS table_name,
       COUNT(*) AS row_count,
       COALESCE(SUM(CASE WHEN site_id IS NULL THEN 1 ELSE 0 END),0) AS null_site_id
FROM pages;

SELECT 'schedule_items' AS table_name,
       COUNT(*) AS row_count,
       COALESCE(SUM(CASE WHEN site_id IS NULL THEN 1 ELSE 0 END),0) AS null_site_id
FROM schedule_items;

SELECT 'media' AS table_name,
       COUNT(*) AS row_count,
       COALESCE(SUM(CASE WHEN site_id IS NULL THEN 1 ELSE 0 END),0) AS null_site_id
FROM media;

SELECT 'social_accounts' AS table_name,
       COUNT(*) AS row_count,
       COALESCE(SUM(CASE WHEN site_id IS NULL THEN 1 ELSE 0 END),0) AS null_site_id
FROM social_accounts;

SELECT 'twitch_connections' AS table_name,
       COUNT(*) AS row_count,
       COALESCE(SUM(CASE WHEN site_id IS NULL THEN 1 ELSE 0 END),0) AS null_site_id
FROM twitch_connections;

SELECT 'twitch_oauth_states' AS table_name,
       COUNT(*) AS row_count,
       COALESCE(SUM(CASE WHEN site_id IS NULL THEN 1 ELSE 0 END),0) AS null_site_id
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
