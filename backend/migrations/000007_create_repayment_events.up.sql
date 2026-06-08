CREATE TABLE IF NOT EXISTS repayment_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    loan_id UUID NOT NULL REFERENCES loans(id),
    amount BIGINT NOT NULL,
    sale_id UUID,
    order_id UUID,
    transaction_id UUID,
    event_type VARCHAR(20) NOT NULL CHECK (event_type IN ('auto_deduction','manual_payment','lump_sum','refund')),
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE repayment_events IS 'APPEND-ONLY: no UPDATEs, only INSERTs. Balance is calculated as SUM of events.';
