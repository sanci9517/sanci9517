PRAGMA foreign_keys = ON;

ALTER TABLE schedule_items ADD COLUMN source TEXT NOT NULL DEFAULT 'manual';
ALTER TABLE schedule_items ADD COLUMN source_id TEXT;
ALTER TABLE schedule_items ADD COLUMN source_account_id TEXT;
ALTER TABLE schedule_items ADD COLUMN source_presence TEXT NOT NULL DEFAULT 'present'
  CHECK (source_presence IN ('present', 'missing'));
ALTER TABLE schedule_items ADD COLUMN source_synced_at TEXT;
ALTER TABLE schedule_items ADD COLUMN source_missing_at TEXT;
ALTER TABLE schedule_items ADD COLUMN is_recurring INTEGER NOT NULL DEFAULT 0
  CHECK (is_recurring IN (0, 1));
ALTER TABLE schedule_items ADD COLUMN source_category_id TEXT;
ALTER TABLE schedule_items ADD COLUMN source_category_name TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_schedule_source_identity
  ON schedule_items(source, source_account_id, source_id);

CREATE INDEX IF NOT EXISTS idx_schedule_source_account_starts
  ON schedule_items(source, source_account_id, starts_at);

CREATE INDEX IF NOT EXISTS idx_schedule_source_presence_starts
  ON schedule_items(source, source_account_id, source_presence, starts_at);

CREATE TABLE IF NOT EXISTS schedule_sync_state (
  id TEXT PRIMARY KEY,
  source TEXT NOT NULL,
  source_account_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'idle'
    CHECK (status IN (
      'idle',
      'running',
      'success',
      'source_empty',
      'reauthorization_required',
      'rate_limited',
      'failed'
    )),
  window_start_at TEXT,
  window_end_at TEXT,
  last_started_at TEXT,
  last_succeeded_at TEXT,
  last_completed_at TEXT,
  last_seen_count INTEGER NOT NULL DEFAULT 0,
  last_error_code TEXT,
  last_error_at TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(source, source_account_id)
);

CREATE INDEX IF NOT EXISTS idx_schedule_sync_state_status
  ON schedule_sync_state(status);

CREATE INDEX IF NOT EXISTS idx_schedule_sync_state_updated
  ON schedule_sync_state(updated_at);
