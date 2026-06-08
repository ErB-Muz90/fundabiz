DROP INDEX IF EXISTS idx_users_county_id;
DROP INDEX IF EXISTS idx_users_role;

DROP INDEX IF EXISTS idx_loans_user_id;
DROP INDEX IF EXISTS idx_loans_status;

DROP INDEX IF EXISTS idx_orders_sme_user_id;
DROP INDEX IF EXISTS idx_orders_supplier_user_id;

DROP INDEX IF EXISTS idx_kyc_applications_status;
DROP INDEX IF EXISTS idx_kyc_applications_county_id;

DROP INDEX IF EXISTS idx_wallet_transactions_wallet_id;
DROP INDEX IF EXISTS idx_wallet_transactions_created_at;

DROP INDEX IF EXISTS idx_repayment_events_loan_id;

DROP INDEX IF EXISTS idx_fraud_flags_status;
DROP INDEX IF EXISTS idx_fraud_flags_severity;
