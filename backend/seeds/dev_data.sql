-- Seed: Development Test Data
-- Run after all migrations, counties, and super_admin seeds

-- ============================================================
-- USERS
-- ============================================================
-- Password for all dev users: password123 (bcrypt hashed)
-- Hash: $2a$10$8K1p/a0dL1LXMIgoEDFrwOfMQkfAjkMBcGmZqFnBmEBycQ7u8Lxqy

-- REGIONAL ADMIN (Nairobi)
INSERT INTO users (id, email, phone, password_hash, role, county_id, full_name, business_name, status, email_verified_at, created_at, updated_at)
VALUES (
    'a0000000-0000-0000-0000-000000000002',
    'regional.nairobi@fundabiz.co.ke',
    '+254711100001',
    '$2a$10$8K1p/a0dL1LXMIgoEDFrwOfMQkfAjkMBcGmZqFnBmEBycQ7u8Lxqy',
    'REGIONAL_ADMIN',
    '00000000-0000-0000-0000-000000000047',
    'Jane Wanjiku',
    'Nairobi Regional Office',
    'active',
    NOW(),
    NOW(),
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- SME OWNER (Nairobi)
INSERT INTO users (id, email, phone, password_hash, role, county_id, full_name, business_name, status, email_verified_at, created_at, updated_at)
VALUES (
    'a0000000-0000-0000-0000-000000000003',
    'sme.nairobi@fundabiz.co.ke',
    '+254722200001',
    '$2a$10$8K1p/a0dL1LXMIgoEDFrwOfMQkfAjkMBcGmZqFnBmEBycQ7u8Lxqy',
    'SME_OWNER',
    '00000000-0000-0000-0000-000000000047',
    'Peter Kamau',
    'Nairobi Tech Solutions Ltd',
    'active',
    NOW(),
    NOW(),
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- SME OWNER (Mombasa)
INSERT INTO users (id, email, phone, password_hash, role, county_id, full_name, business_name, status, email_verified_at, created_at, updated_at)
VALUES (
    'a0000000-0000-0000-0000-000000000004',
    'sme.mombasa@fundabiz.co.ke',
    '+254722200002',
    '$2a$10$8K1p/a0dL1LXMIgoEDFrwOfMQkfAjkMBcGmZqFnBmEBycQ7u8Lxqy',
    'SME_OWNER',
    '00000000-0000-0000-0000-000000000001',
    'Fatima Ali',
    'Mombasa Fresh Produce',
    'active',
    NOW(),
    NOW(),
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- SME OWNER (Kisumu)
INSERT INTO users (id, email, phone, password_hash, role, county_id, full_name, business_name, status, email_verified_at, created_at, updated_at)
VALUES (
    'a0000000-0000-0000-0000-000000000005',
    'sme.kisumu@fundabiz.co.ke',
    '+254722200003',
    '$2a$10$8K1p/a0dL1LXMIgoEDFrwOfMQkfAjkMBcGmZqFnBmEBycQ7u8Lxqy',
    'SME_OWNER',
    '00000000-0000-0000-0000-000000000042',
    'Odhiambo Ochieng',
    'Kisumu Agri-Ventures',
    'active',
    NOW(),
    NOW(),
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- SUPPLIER (Nairobi)
INSERT INTO users (id, email, phone, password_hash, role, county_id, full_name, business_name, status, email_verified_at, created_at, updated_at)
VALUES (
    'a0000000-0000-0000-0000-000000000006',
    'supplier.nairobi@fundabiz.co.ke',
    '+254733300001',
    '$2a$10$8K1p/a0dL1LXMIgoEDFrwOfMQkfAjkMBcGmZqFnBmEBycQ7u8Lxqy',
    'SUPPLIER',
    '00000000-0000-0000-0000-000000000047',
    'James Mwangi',
    'Nairobi Wholesale Mart',
    'active',
    NOW(),
    NOW(),
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- SUPPLIER (Mombasa)
INSERT INTO users (id, email, phone, password_hash, role, county_id, full_name, business_name, status, email_verified_at, created_at, updated_at)
VALUES (
    'a0000000-0000-0000-0000-000000000007',
    'supplier.mombasa@fundabiz.co.ke',
    '+254733300002',
    '$2a$10$8K1p/a0dL1LXMIgoEDFrwOfMQkfAjkMBcGmZqFnBmEBycQ7u8Lxqy',
    'SUPPLIER',
    '00000000-0000-0000-0000-000000000001',
    'Hassan Abdalla',
    'Coast Wholesalers Ltd',
    'active',
    NOW(),
    NOW(),
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- FIELD AGENT (Nairobi)
INSERT INTO users (id, email, phone, password_hash, role, county_id, full_name, business_name, status, email_verified_at, created_at, updated_at)
VALUES (
    'a0000000-0000-0000-0000-000000000008',
    'agent.nairobi@fundabiz.co.ke',
    '+254744400001',
    '$2a$10$8K1p/a0dL1LXMIgoEDFrwOfMQkfAjkMBcGmZqFnBmEBycQ7u8Lxqy',
    'FIELD_AGENT',
    '00000000-0000-0000-0000-000000000047',
    'Grace Nyambura',
    'KYC Agent Nairobi',
    'active',
    NOW(),
    NOW(),
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- ============================================================
-- WALLETS
-- ============================================================
INSERT INTO wallets (id, user_id, balance, currency, wallet_type) VALUES
('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 100000000, 'KES', 'SYSTEM'),
('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000003', 5000000, 'KES', 'SME'),
('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000004', 2500000, 'KES', 'SME'),
('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000005', 1500000, 'KES', 'SME'),
('b0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000006', 8000000, 'KES', 'SUPPLIER'),
('b0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000007', 6000000, 'KES', 'SUPPLIER'),
('b0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000008', 500000, 'KES', 'AGENT')
ON CONFLICT (user_id) DO NOTHING;

-- ============================================================
-- LOAN
-- ============================================================
INSERT INTO loans (id, user_id, status, total_amount, disbursed_amount, repaid_amount, outstanding_amount, interest_rate, tenure_days, purpose, approved_by, approved_at, created_at, updated_at)
VALUES (
    'c0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000003',
    'active',
    20000000,
    20000000,
    2500000,
    17500000,
    0.1200,
    180,
    'Inventory purchase for Q4 - electronics and office supplies',
    'a0000000-0000-0000-0000-000000000001',
    NOW() - INTERVAL '30 days',
    NOW() - INTERVAL '35 days',
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Loan tranches
INSERT INTO loan_tranches (id, loan_id, tranche_number, amount, milestone, milestone_met, status, unlocked_at, disbursed_at)
VALUES
('c1000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 1, 10000000, 'Initial disbursement', true, 'disbursed', NOW() - INTERVAL '35 days', NOW() - INTERVAL '30 days'),
('c1000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 2, 6000000, 'Proof of inventory purchase', true, 'disbursed', NOW() - INTERVAL '20 days', NOW() - INTERVAL '18 days'),
('c1000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000001', 3, 4000000, 'Quarterly sales target met', false, 'locked', NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- ORDER
-- ============================================================
INSERT INTO orders (id, sme_user_id, supplier_user_id, status, escrow_amount, delivery_address, delivery_notes, gps_coordinates_lat, gps_coordinates_lng, sme_confirmed_at, dispatcher_name, dispatcher_phone, created_at, updated_at)
VALUES (
    'd0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000003',
    'a0000000-0000-0000-0000-000000000006',
    'delivered',
    750000,
    '123 Moi Avenue, Nairobi CBD, Nairobi',
    'Call before delivery - office is on 3rd floor',
    -1.2833333,
    36.8166667,
    NOW() - INTERVAL '2 days',
    'David Omondi',
    '+254712345678',
    NOW() - INTERVAL '10 days',
    NOW() - INTERVAL '2 days'
) ON CONFLICT (id) DO NOTHING;

-- Order items
INSERT INTO order_items (id, order_id, product_name, quantity, unit_price, total_price) VALUES
('d1000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'HP Laptop ProBook 450', 5, 85000, 425000),
('d1000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000001', 'Canon Printer MF3010', 3, 55000, 165000),
('d1000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000001', 'Office Desk Chair', 10, 16000, 160000)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- KYC APPLICATION
-- ============================================================
INSERT INTO kyc_applications (id, user_id, status, application_type, business_name, business_reg_number, business_type, year_established, county_id, sub_county, location_description, id_number, id_type, kra_pin, contact_phone, contact_email, risk_score, submitted_at, created_at, updated_at)
VALUES (
    'e0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000003',
    'approved',
    'SME',
    'Nairobi Tech Solutions Ltd',
    'CPR/2024/123456',
    'Technology - Retail & Services',
    2019,
    '00000000-0000-0000-0000-000000000047',
    'Westlands',
    '3rd Floor, Suite 3B, Westpark Towers, Moi Avenue',
    '12345678',
    'National ID',
    'P051234567Z',
    '+254722200001',
    'sme.nairobi@fundabiz.co.ke',
    25,
    NOW() - INTERVAL '40 days',
    NOW() - INTERVAL '45 days',
    NOW() - INTERVAL '35 days'
) ON CONFLICT (id) DO NOTHING;

-- KYC documents
INSERT INTO kyc_documents (id, application_id, document_type, s3_key, file_name, file_size, mime_type) VALUES
('e1000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'business_reg_cert', 'kyc/applications/e0000000/business_reg.pdf', 'business_registration.pdf', 245760, 'application/pdf'),
('e1000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000001', 'kra_pin_cert', 'kyc/applications/e0000000/kra_pin.pdf', 'kra_pin_certificate.pdf', 184320, 'application/pdf'),
('e1000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000001', 'id_front', 'kyc/applications/e0000000/id_front.jpg', 'national_id_front.jpg', 512000, 'image/jpeg'),
('e1000000-0000-0000-0000-000000000004', 'e0000000-0000-0000-0000-000000000001', 'id_back', 'kyc/applications/e0000000/id_back.jpg', 'national_id_back.jpg', 486400, 'image/jpeg')
ON CONFLICT (id) DO NOTHING;

-- KYC audit log
INSERT INTO kyc_audit_log (id, application_id, action, actor_id, notes) VALUES
('e2000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'submitted', 'a0000000-0000-0000-0000-000000000003', 'Application submitted by SME owner'),
('e2000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000001', 'review_started', 'a0000000-0000-0000-0000-000000000002', 'Review initiated by regional admin'),
('e2000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000001', 'approved', 'a0000000-0000-0000-0000-000000000002', 'All documents verified and approved')
ON CONFLICT (id) DO NOTHING;
