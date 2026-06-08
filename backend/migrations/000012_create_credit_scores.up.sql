CREATE TABLE IF NOT EXISTS credit_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id),
    score INT NOT NULL CHECK (score >= 0 AND score <= 1000),
    tier VARCHAR(20),
    max_loan_amount BIGINT,
    interest_rate DECIMAL(5,4),
    factors JSONB,
    calculated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS credit_score_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    score INT NOT NULL,
    tier VARCHAR(20),
    calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
