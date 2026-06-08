CREATE TABLE IF NOT EXISTS fraud_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    flagged_user_id UUID NOT NULL REFERENCES users(id),
    rule_name VARCHAR(100) NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low','medium','high','critical')),
    status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open','investigating','resolved','dismissed')),
    description TEXT,
    evidence JSONB,
    action_taken VARCHAR(100),
    flagged_by UUID REFERENCES users(id),
    reviewed_by UUID REFERENCES users(id),
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
