-- PENDING: WEB-020 / WEB-011 first-party Forms submission domain.
-- Additive, manual-review candidate only. Do not apply through deploy:safe or
-- automatic Wrangler migrations. Requires a fresh SELECT-only production
-- preflight and operation-specific owner approval before production apply.
-- No existing pages, users, settings, or media rows are changed.

CREATE TABLE forms (
  id TEXT PRIMARY KEY NOT NULL,
  site_id TEXT NOT NULL REFERENCES sites(id) ON DELETE RESTRICT,
  name TEXT NOT NULL CHECK (length(trim(name)) BETWEEN 1 AND 100),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  current_version INTEGER NOT NULL DEFAULT 1 CHECK (current_version >= 1),
  published_version INTEGER CHECK (published_version IS NULL OR published_version >= 1),
  retention_days INTEGER NOT NULL DEFAULT 30 CHECK (retention_days BETWEEN 1 AND 365),
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  updated_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (site_id,id),
  FOREIGN KEY (site_id,id,published_version)
    REFERENCES form_revisions(site_id,form_id,version) ON DELETE RESTRICT
);

CREATE INDEX idx_forms_site_status_updated
  ON forms(site_id,status,updated_at DESC,id);

CREATE TABLE form_revisions (
  site_id TEXT NOT NULL,
  form_id TEXT NOT NULL,
  version INTEGER NOT NULL CHECK (version >= 1),
  definition_json TEXT NOT NULL CHECK (json_valid(definition_json)),
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (site_id,form_id,version),
  FOREIGN KEY (site_id,form_id) REFERENCES forms(site_id,id) ON DELETE RESTRICT
);

CREATE TABLE form_submissions (
  id TEXT PRIMARY KEY NOT NULL,
  site_id TEXT NOT NULL,
  form_id TEXT NOT NULL,
  form_version INTEGER NOT NULL,
  page_id TEXT NOT NULL,
  page_revision_id TEXT,
  values_json TEXT NOT NULL CHECK (json_valid(values_json)),
  consent_text TEXT NOT NULL CHECK (length(trim(consent_text)) BETWEEN 1 AND 2000),
  consent_version TEXT NOT NULL CHECK (length(trim(consent_version)) BETWEEN 1 AND 64),
  consent_accepted_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','reviewed','archived')),
  received_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TEXT NOT NULL,
  reviewed_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at TEXT,
  FOREIGN KEY (site_id,form_id,form_version)
    REFERENCES form_revisions(site_id,form_id,version) ON DELETE RESTRICT,
  FOREIGN KEY (site_id,form_id) REFERENCES forms(site_id,id) ON DELETE RESTRICT
);

CREATE INDEX idx_form_submissions_inbox
  ON form_submissions(site_id,form_id,status,received_at DESC,id);
CREATE INDEX idx_form_submissions_expiry
  ON form_submissions(expires_at,site_id,id);

-- Store only a keyed digest of the source IP, never the raw address. The
-- route supplies a short fixed window and expires rows on a bounded schedule.
CREATE TABLE form_submission_rate_limits (
  site_id TEXT NOT NULL,
  form_id TEXT NOT NULL,
  client_hash TEXT NOT NULL CHECK (length(client_hash) = 64),
  window_start INTEGER NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0 CHECK (attempts BETWEEN 0 AND 6),
  blocked_until INTEGER,
  expires_at INTEGER NOT NULL,
  PRIMARY KEY (site_id,form_id,client_hash,window_start),
  FOREIGN KEY (site_id,form_id) REFERENCES forms(site_id,id) ON DELETE CASCADE
);

CREATE INDEX idx_form_rate_limit_expiry
  ON form_submission_rate_limits(expires_at);
