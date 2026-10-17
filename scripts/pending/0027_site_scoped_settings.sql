-- WEB-013 / F1.1: staged, additive site-scoped settings.
-- DO NOT place in automatic migrations or enable the runtime flag until this
-- migration and its legacy default-site copy have been verified on D1.
-- Keep legacy site_settings intact for the existing default-site UI.
CREATE TABLE site_scoped_settings (
  site_id TEXT NOT NULL REFERENCES sites(id) ON DELETE RESTRICT,
  key TEXT NOT NULL CHECK (key IN ('site')),
  value_json TEXT NOT NULL CHECK (json_valid(value_json)),
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(site_id, key)
);

-- Copy the already-configured default site values, preserving legacy data.
INSERT INTO site_scoped_settings (site_id,key,value_json,updated_at)
SELECT 'site-default',key,value_json,updated_at
FROM site_settings
WHERE key='site'
  AND json_valid(value_json)
  AND EXISTS (SELECT 1 FROM sites WHERE id='site-default' AND status='active');
