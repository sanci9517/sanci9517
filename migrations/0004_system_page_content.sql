CREATE TABLE IF NOT EXISTS system_page_content (
  path TEXT PRIMARY KEY,
  content_json TEXT NOT NULL DEFAULT '{"version":1,"blocks":[]}',
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
