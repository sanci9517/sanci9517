PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS editor_revisions (
  id TEXT PRIMARY KEY,
  page_id TEXT NOT NULL,
  version INTEGER NOT NULL,
  document_json TEXT NOT NULL,
  created_by TEXT,
  note TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(page_id, version),
  FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_editor_revisions_page_version
  ON editor_revisions(page_id, version DESC);

CREATE INDEX IF NOT EXISTS idx_editor_revisions_created_at
  ON editor_revisions(created_at);
