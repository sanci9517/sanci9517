-- MANUAL-ONLY PROPOSAL. Do not apply until WEB-013 0025-0028 migration ledger is reconciled.
-- No automatic R2 deletion; first requires controlled rollout and explicit approval.
-- Inert retention state foundation; no automated deletion is enabled.
CREATE TABLE IF NOT EXISTS media_retention_requests (
 id TEXT PRIMARY KEY,
 site_id TEXT NOT NULL,
 asset_id TEXT NOT NULL,
 object_key TEXT NOT NULL,
 state TEXT NOT NULL DEFAULT 'requested'
  CHECK (state IN ('requested','quarantined','revalidated','cancelled','deleted','blocked')),
 requested_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 not_before TEXT NOT NULL,
 updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 attempt_count INTEGER NOT NULL DEFAULT 0 CHECK (attempt_count >= 0),
 last_error TEXT,
 FOREIGN KEY(asset_id) REFERENCES media(id),
 UNIQUE(site_id,asset_id)
);
CREATE INDEX IF NOT EXISTS idx_media_retention_due ON media_retention_requests(site_id,state,not_before);
