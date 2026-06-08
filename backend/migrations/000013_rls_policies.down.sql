-- Drop all RLS policies
DROP POLICY IF EXISTS users_super_admin ON users;
DROP POLICY IF EXISTS users_regional_admin ON users;
DROP POLICY IF EXISTS users_self ON users;

DROP POLICY IF EXISTS loans_super_admin ON loans;
DROP POLICY IF EXISTS loans_regional_admin ON loans;
DROP POLICY IF EXISTS loans_owner ON loans;

DROP POLICY IF EXISTS loan_tranches_view ON loan_tranches;

DROP POLICY IF EXISTS orders_super_admin ON orders;
DROP POLICY IF EXISTS orders_regional_admin ON orders;
DROP POLICY IF EXISTS orders_sme ON orders;
DROP POLICY IF EXISTS orders_supplier ON orders;

DROP POLICY IF EXISTS order_items_view ON order_items;

DROP POLICY IF EXISTS order_events_view ON order_events;

DROP POLICY IF EXISTS kyc_applications_super_admin ON kyc_applications;
DROP POLICY IF EXISTS kyc_applications_regional_admin ON kyc_applications;

DROP POLICY IF EXISTS kyc_documents_view ON kyc_documents;

DROP POLICY IF EXISTS kyc_audit_log_view ON kyc_audit_log;

DROP POLICY IF EXISTS wallets_super_admin ON wallets;
DROP POLICY IF EXISTS wallets_regional_admin ON wallets;
DROP POLICY IF EXISTS wallets_owner ON wallets;

DROP POLICY IF EXISTS wallet_transactions_view ON wallet_transactions;

DROP POLICY IF EXISTS repayment_events_view ON repayment_events;

DROP POLICY IF EXISTS fraud_flags_super_admin ON fraud_flags;
DROP POLICY IF EXISTS fraud_flags_regional_admin ON fraud_flags;

DROP POLICY IF EXISTS credit_scores_super_admin ON credit_scores;
DROP POLICY IF EXISTS credit_scores_regional_admin ON credit_scores;
DROP POLICY IF EXISTS credit_scores_owner ON credit_scores;

DROP POLICY IF EXISTS credit_score_history_super_admin ON credit_score_history;
DROP POLICY IF EXISTS credit_score_history_regional_admin ON credit_score_history;
DROP POLICY IF EXISTS credit_score_history_owner ON credit_score_history;

DROP POLICY IF EXISTS counties_read_all ON counties;

-- Disable Row Level Security on all tables
ALTER TABLE counties DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE wallets DISABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_documents DISABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_audit_log DISABLE ROW LEVEL SECURITY;
ALTER TABLE loans DISABLE ROW LEVEL SECURITY;
ALTER TABLE loan_tranches DISABLE ROW LEVEL SECURITY;
ALTER TABLE repayment_events DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_events DISABLE ROW LEVEL SECURITY;
ALTER TABLE fraud_flags DISABLE ROW LEVEL SECURITY;
ALTER TABLE credit_scores DISABLE ROW LEVEL SECURITY;
ALTER TABLE credit_score_history DISABLE ROW LEVEL SECURITY;
