-- PENDING: WEB-013 / F1.1 tenant membership foundation.
-- Not in migrations/: requires separate approval and installation before
-- routes can use the site-membership authorization service.
-- Additive: no existing pages, revisions, redirects, or sessions are changed.
CREATE TABLE site_memberships (
  site_id TEXT NOT NULL REFERENCES sites(id) ON DELETE RESTRICT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin','editor','viewer')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','revoked')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (site_id, user_id)
);

CREATE INDEX idx_site_memberships_user_status
  ON site_memberships(user_id, status, site_id);

-- Preserve existing default-site access. This is a one-time compatibility
-- seed, NOT a fallback for other sites: every future site requires explicit
-- grants. No other site receives a membership automatically.
INSERT INTO site_memberships(site_id,user_id,role,status)
SELECT 'site-default', id, role, 'active'
FROM users
WHERE is_active = 1 AND role IN ('admin','editor','viewer')
  AND EXISTS (SELECT 1 FROM sites WHERE id='site-default' AND status='active');
