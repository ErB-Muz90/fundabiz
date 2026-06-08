-- Seed: Default Super Admin User
-- Run after 000002_create_users migration
-- Password: Admin123! (bcrypt hashed - replace with actual hash in production)
-- Hash: $2a$10$YourBcryptHashHere

INSERT INTO users (id, email, phone, password_hash, role, county_id, full_name, business_name, status, email_verified_at, created_at, updated_at)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'admin@fundabiz.co.ke',
    '+254700000000',
    '$2a$10$8K1p/a0dL1LXMIgoEDFrwOfMQkfAjkMBcGmZqFnBmEBycQ7u8Lxqy',
    'SUPER_ADMIN',
    '00000000-0000-0000-0000-000000000047',
    'System Admin',
    'FundaBiz Admin',
    'active',
    NOW(),
    NOW(),
    NOW()
)
ON CONFLICT (email) DO NOTHING;
