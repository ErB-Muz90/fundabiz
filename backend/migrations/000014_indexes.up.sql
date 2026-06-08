CREATE INDEX IF NOT EXISTS idx_users_county_id ON users(county_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

CREATE INDEX IF NOT EXISTS idx_loans_user_id ON loans(user_id);
CREATE INDEX IF NOT EXISTS idx_loans_status ON loans(status);

CREATE INDEX IF NOT EXISTS idx_orders_sme_user_id ON orders(sme_user_id);
CREATE INDEX IF NOT EXISTS idx_orders_supplier_user_id ON orders(supplier_user_id);

CREATE INDEX IF NOT EXISTS idx_kyc_applications_status ON kyc_applications(status);
CREATE INDEX IF NOT EXISTS idx_kyc_applications_county_id ON kyc_applications(county_id);

CREATE INDEX IF NOT EXISTS idx_wallet_transactions_wallet_id ON wallet_transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_created_at ON wallet_transactions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_repayment_events_loan_id ON repayment_events(loan_id);

CREATE INDEX IF NOT EXISTS idx_fraud_flags_status ON fraud_flags(status);
CREATE INDEX IF NOT EXISTS idx_fraud_flags_severity ON fraud_flags(severity);
