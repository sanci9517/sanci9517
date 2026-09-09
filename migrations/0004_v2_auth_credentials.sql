ALTER TABLE users ADD COLUMN password_hash TEXT;
ALTER TABLE users ADD COLUMN password_salt TEXT;

CREATE INDEX IF NOT EXISTS idx_users_active_role ON users(is_active, role);
