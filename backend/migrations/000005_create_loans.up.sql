CREATE TABLE IF NOT EXISTS loans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','active','completed','defaulted','cancelled')),
    total_amount BIGINT NOT NULL,
    disbursed_amount BIGINT NOT NULL DEFAULT 0,
    repaid_amount BIGINT NOT NULL DEFAULT 0,
    outstanding_amount BIGINT,
    interest_rate DECIMAL(5,4) NOT NULL DEFAULT 0.0800,
    tenure_days INT,
    purpose TEXT,
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS loan_tranches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    loan_id UUID NOT NULL REFERENCES loans(id),
    tranche_number INT NOT NULL,
    amount BIGINT NOT NULL,
    milestone VARCHAR(200),
    milestone_met BOOLEAN DEFAULT false,
    status VARCHAR(20) NOT NULL DEFAULT 'locked' CHECK (status IN ('locked','unlocked','disbursed')),
    unlocked_at TIMESTAMPTZ,
    disbursed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
