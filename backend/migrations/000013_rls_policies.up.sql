-- Enable Row Level Security on all tables
ALTER TABLE counties ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE loan_tranches ENABLE ROW LEVEL SECURITY;
ALTER TABLE repayment_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE fraud_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_score_history ENABLE ROW LEVEL SECURITY;

-- Helper function to be used in RLS policies
-- Application must set app.user_role, app.user_id, app.user_county_id before queries
-- e.g. SELECT set_config('app.user_role', 'SUPER_ADMIN', true)

-- =====================
-- users table policies
-- =====================
CREATE POLICY users_super_admin ON users
    FOR ALL
    USING (current_setting('app.user_role', true) = 'SUPER_ADMIN');

CREATE POLICY users_regional_admin ON users
    FOR ALL
    USING (
        current_setting('app.user_role', true) = 'REGIONAL_ADMIN'
        AND county_id = current_setting('app.user_county_id', true)::UUID
    );

CREATE POLICY users_self ON users
    FOR ALL
    USING (id = current_setting('app.user_id', true)::UUID);

-- =====================
-- loans table policies
-- =====================
CREATE POLICY loans_super_admin ON loans
    FOR ALL
    USING (current_setting('app.user_role', true) = 'SUPER_ADMIN');

CREATE POLICY loans_regional_admin ON loans
    FOR ALL
    USING (
        current_setting('app.user_role', true) = 'REGIONAL_ADMIN'
        AND EXISTS (
            SELECT 1 FROM users
            WHERE users.id = loans.user_id
            AND users.county_id = current_setting('app.user_county_id', true)::UUID
        )
    );

CREATE POLICY loans_owner ON loans
    FOR ALL
    USING (user_id = current_setting('app.user_id', true)::UUID);

-- =====================
-- loan_tranches table policies
-- =====================
CREATE POLICY loan_tranches_view ON loan_tranches
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM loans
            WHERE loans.id = loan_tranches.loan_id
            AND (
                current_setting('app.user_role', true) = 'SUPER_ADMIN'
                OR (
                    current_setting('app.user_role', true) = 'REGIONAL_ADMIN'
                    AND EXISTS (
                        SELECT 1 FROM users
                        WHERE users.id = loans.user_id
                        AND users.county_id = current_setting('app.user_county_id', true)::UUID
                    )
                )
                OR loans.user_id = current_setting('app.user_id', true)::UUID
            )
        )
    );

-- =====================
-- orders table policies
-- =====================
CREATE POLICY orders_super_admin ON orders
    FOR ALL
    USING (current_setting('app.user_role', true) = 'SUPER_ADMIN');

CREATE POLICY orders_regional_admin ON orders
    FOR ALL
    USING (
        current_setting('app.user_role', true) = 'REGIONAL_ADMIN'
        AND EXISTS (
            SELECT 1 FROM users
            WHERE (
                users.id = orders.sme_user_id
                OR users.id = orders.supplier_user_id
            )
            AND users.county_id = current_setting('app.user_county_id', true)::UUID
        )
    );

CREATE POLICY orders_sme ON orders
    FOR ALL
    USING (sme_user_id = current_setting('app.user_id', true)::UUID);

CREATE POLICY orders_supplier ON orders
    FOR ALL
    USING (supplier_user_id = current_setting('app.user_id', true)::UUID);

-- =====================
-- order_items table policies (inherit from orders)
-- =====================
CREATE POLICY order_items_view ON order_items
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = order_items.order_id
            AND (
                current_setting('app.user_role', true) = 'SUPER_ADMIN'
                OR (
                    current_setting('app.user_role', true) = 'REGIONAL_ADMIN'
                    AND EXISTS (
                        SELECT 1 FROM users
                        WHERE (
                            users.id = orders.sme_user_id
                            OR users.id = orders.supplier_user_id
                        )
                        AND users.county_id = current_setting('app.user_county_id', true)::UUID
                    )
                )
                OR orders.sme_user_id = current_setting('app.user_id', true)::UUID
                OR orders.supplier_user_id = current_setting('app.user_id', true)::UUID
            )
        )
    );

-- =====================
-- order_events table policies (inherit from orders)
-- =====================
CREATE POLICY order_events_view ON order_events
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = order_events.order_id
            AND (
                current_setting('app.user_role', true) = 'SUPER_ADMIN'
                OR (
                    current_setting('app.user_role', true) = 'REGIONAL_ADMIN'
                    AND EXISTS (
                        SELECT 1 FROM users
                        WHERE (
                            users.id = orders.sme_user_id
                            OR users.id = orders.supplier_user_id
                        )
                        AND users.county_id = current_setting('app.user_county_id', true)::UUID
                    )
                )
                OR orders.sme_user_id = current_setting('app.user_id', true)::UUID
                OR orders.supplier_user_id = current_setting('app.user_id', true)::UUID
            )
        )
    );

-- =====================
-- kyc_applications table policies
-- =====================
CREATE POLICY kyc_applications_super_admin ON kyc_applications
    FOR ALL
    USING (current_setting('app.user_role', true) = 'SUPER_ADMIN');

CREATE POLICY kyc_applications_regional_admin ON kyc_applications
    FOR ALL
    USING (
        current_setting('app.user_role', true) = 'REGIONAL_ADMIN'
        AND county_id = current_setting('app.user_county_id', true)::UUID
    );

-- =====================
-- kyc_documents table policies (inherit from kyc_applications)
-- =====================
CREATE POLICY kyc_documents_view ON kyc_documents
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM kyc_applications
            WHERE kyc_applications.id = kyc_documents.application_id
            AND (
                current_setting('app.user_role', true) = 'SUPER_ADMIN'
                OR (
                    current_setting('app.user_role', true) = 'REGIONAL_ADMIN'
                    AND kyc_applications.county_id = current_setting('app.user_county_id', true)::UUID
                )
            )
        )
    );

-- =====================
-- kyc_audit_log table policies
-- =====================
CREATE POLICY kyc_audit_log_view ON kyc_audit_log
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM kyc_applications
            WHERE kyc_applications.id = kyc_audit_log.application_id
            AND (
                current_setting('app.user_role', true) = 'SUPER_ADMIN'
                OR (
                    current_setting('app.user_role', true) = 'REGIONAL_ADMIN'
                    AND kyc_applications.county_id = current_setting('app.user_county_id', true)::UUID
                )
            )
        )
    );

-- =====================
-- wallets table policies
-- =====================
CREATE POLICY wallets_super_admin ON wallets
    FOR ALL
    USING (current_setting('app.user_role', true) = 'SUPER_ADMIN');

CREATE POLICY wallets_regional_admin ON wallets
    FOR ALL
    USING (
        current_setting('app.user_role', true) = 'REGIONAL_ADMIN'
        AND EXISTS (
            SELECT 1 FROM users
            WHERE users.id = wallets.user_id
            AND users.county_id = current_setting('app.user_county_id', true)::UUID
        )
    );

CREATE POLICY wallets_owner ON wallets
    FOR ALL
    USING (user_id = current_setting('app.user_id', true)::UUID);

-- =====================
-- wallet_transactions table policies (inherit from wallets)
-- =====================
CREATE POLICY wallet_transactions_view ON wallet_transactions
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM wallets
            WHERE wallets.id = wallet_transactions.wallet_id
            AND (
                current_setting('app.user_role', true) = 'SUPER_ADMIN'
                OR (
                    current_setting('app.user_role', true) = 'REGIONAL_ADMIN'
                    AND EXISTS (
                        SELECT 1 FROM users
                        WHERE users.id = wallets.user_id
                        AND users.county_id = current_setting('app.user_county_id', true)::UUID
                    )
                )
                OR wallets.user_id = current_setting('app.user_id', true)::UUID
            )
        )
    );

-- =====================
-- repayment_events table policies
-- =====================
CREATE POLICY repayment_events_view ON repayment_events
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM loans
            WHERE loans.id = repayment_events.loan_id
            AND (
                current_setting('app.user_role', true) = 'SUPER_ADMIN'
                OR (
                    current_setting('app.user_role', true) = 'REGIONAL_ADMIN'
                    AND EXISTS (
                        SELECT 1 FROM users
                        WHERE users.id = loans.user_id
                        AND users.county_id = current_setting('app.user_county_id', true)::UUID
                    )
                )
                OR loans.user_id = current_setting('app.user_id', true)::UUID
            )
        )
    );

-- =====================
-- fraud_flags table policies
-- =====================
CREATE POLICY fraud_flags_super_admin ON fraud_flags
    FOR ALL
    USING (current_setting('app.user_role', true) = 'SUPER_ADMIN');

CREATE POLICY fraud_flags_regional_admin ON fraud_flags
    FOR ALL
    USING (
        current_setting('app.user_role', true) = 'REGIONAL_ADMIN'
        AND EXISTS (
            SELECT 1 FROM users
            WHERE users.id = fraud_flags.flagged_user_id
            AND users.county_id = current_setting('app.user_county_id', true)::UUID
        )
    );

-- =====================
-- credit_scores table policies
-- =====================
CREATE POLICY credit_scores_super_admin ON credit_scores
    FOR ALL
    USING (current_setting('app.user_role', true) = 'SUPER_ADMIN');

CREATE POLICY credit_scores_regional_admin ON credit_scores
    FOR ALL
    USING (
        current_setting('app.user_role', true) = 'REGIONAL_ADMIN'
        AND EXISTS (
            SELECT 1 FROM users
            WHERE users.id = credit_scores.user_id
            AND users.county_id = current_setting('app.user_county_id', true)::UUID
        )
    );

CREATE POLICY credit_scores_owner ON credit_scores
    FOR ALL
    USING (user_id = current_setting('app.user_id', true)::UUID);

-- =====================
-- credit_score_history table policies
-- =====================
CREATE POLICY credit_score_history_super_admin ON credit_score_history
    FOR ALL
    USING (current_setting('app.user_role', true) = 'SUPER_ADMIN');

CREATE POLICY credit_score_history_regional_admin ON credit_score_history
    FOR ALL
    USING (
        current_setting('app.user_role', true) = 'REGIONAL_ADMIN'
        AND EXISTS (
            SELECT 1 FROM users
            WHERE users.id = credit_score_history.user_id
            AND users.county_id = current_setting('app.user_county_id', true)::UUID
        )
    );

CREATE POLICY credit_score_history_owner ON credit_score_history
    FOR ALL
    USING (user_id = current_setting('app.user_id', true)::UUID);

-- =====================
-- counties table policies
-- =====================
CREATE POLICY counties_read_all ON counties
    FOR SELECT
    USING (true);
