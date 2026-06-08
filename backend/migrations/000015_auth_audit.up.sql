ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS national_id VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS mfa_verified BOOLEAN NOT NULL DEFAULT false;

UPDATE users SET first_name = SPLIT_PART(full_name, ' ', 1), last_name = SUBSTRING(full_name FROM POSITION(' ' IN full_name) + 1) WHERE full_name IS NOT NULL AND first_name IS NULL;

CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    action VARCHAR(50) NOT NULL,
    details TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

CREATE TABLE IF NOT EXISTS otp_attempts (
    id BIGSERIAL PRIMARY KEY,
    phone VARCHAR(20) NOT NULL,
    purpose VARCHAR(30) NOT NULL,
    attempts INT NOT NULL DEFAULT 1,
    last_attempt_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    blocked_until TIMESTAMPTZ,
    UNIQUE(phone, purpose)
);
