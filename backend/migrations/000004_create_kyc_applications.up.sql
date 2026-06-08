CREATE TABLE IF NOT EXISTS kyc_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','review','approved','rejected','flagged')),
    application_type VARCHAR(20) NOT NULL CHECK (application_type IN ('SME','SUPPLIER')),
    business_name VARCHAR(200),
    business_reg_number VARCHAR(100),
    business_type VARCHAR(100),
    year_established INT,
    county_id UUID REFERENCES counties(id),
    sub_county VARCHAR(100),
    location_description TEXT,
    id_number VARCHAR(50),
    id_type VARCHAR(50),
    kra_pin VARCHAR(50),
    contact_phone VARCHAR(20),
    contact_email VARCHAR(255),
    risk_score INT,
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMPTZ,
    rejection_reason TEXT,
    submitted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS kyc_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES kyc_applications(id),
    document_type VARCHAR(50) NOT NULL,
    s3_key VARCHAR(500),
    file_name VARCHAR(255),
    file_size INT,
    mime_type VARCHAR(100),
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS kyc_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES kyc_applications(id),
    action VARCHAR(50) NOT NULL,
    actor_id UUID REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
