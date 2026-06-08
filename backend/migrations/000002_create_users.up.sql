CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('SUPER_ADMIN','REGIONAL_ADMIN','SME_OWNER','SUPPLIER','FIELD_AGENT')),
    county_id UUID REFERENCES counties(id),
    full_name VARCHAR(200),
    business_name VARCHAR(200),
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    email_verified_at TIMESTAMPTZ,
    phone_verified_at TIMESTAMPTZ,
    mfa_secret VARCHAR(100),
    mfa_enabled BOOLEAN NOT NULL DEFAULT false,
    refresh_token_hash VARCHAR(255),
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
