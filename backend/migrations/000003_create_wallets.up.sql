CREATE TABLE IF NOT EXISTS wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id),
    balance BIGINT NOT NULL DEFAULT 0 CHECK (balance >= 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'KES',
    wallet_type VARCHAR(20) NOT NULL CHECK (wallet_type IN ('SME','SUPPLIER','AGENT','SYSTEM')),
    is_frozen BOOLEAN NOT NULL DEFAULT false,
    frozen_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wallet_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID NOT NULL REFERENCES wallets(id),
    type VARCHAR(20) NOT NULL CHECK (type IN ('DEPOSIT','WITHDRAWAL','ESCROW_HOLD','ESCROW_RELEASE','B2B_TRANSFER','LOAN_DISBURSEMENT','LOAN_REPAYMENT','FEE')),
    amount BIGINT NOT NULL,
    balance_before BIGINT,
    balance_after BIGINT,
    reference_type VARCHAR(50),
    reference_id UUID,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
