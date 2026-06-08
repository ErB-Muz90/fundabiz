package fraud

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"
)

func FlagTransaction(pool *pgxpool.Pool, flag *FraudFlag, transactionID string) error {
	query := `INSERT INTO fraud_flags (id, transaction_id, rule_name, severity, description, score, created_at)
		VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW())`
	_, err := pool.Exec(context.Background(), query, transactionID, flag.RuleName, flag.Severity, flag.Description, flag.Score)
	if err != nil {
		return fmt.Errorf("flag transaction: %w", err)
	}
	return nil
}

func FreezeAccount(pool *pgxpool.Pool, userID string) error {
	query := `UPDATE wallets SET frozen = true, updated_at = NOW() WHERE user_id = $1`
	_, err := pool.Exec(context.Background(), query, userID)
	if err != nil {
		return fmt.Errorf("freeze account: %w", err)
	}

	eventQuery := `INSERT INTO system_events (id, type, data, created_at)
		VALUES (gen_random_uuid(), 'account_frozen', $1, NOW())`
	_, err = pool.Exec(context.Background(), eventQuery, "Account frozen due to fraud detection: user_id="+userID)
	if err != nil {
		return fmt.Errorf("log freeze event: %w", err)
	}

	return nil
}

func EscalateToAdmin(pool *pgxpool.Pool, flags []*FraudFlag) error {
	for _, flag := range flags {
		query := `INSERT INTO admin_alerts (id, type, message, severity, created_at)
			VALUES (gen_random_uuid(), 'fraud_alert', $1, $2, NOW())`
		message := fmt.Sprintf("[%s] %s (score: %d)", flag.RuleName, flag.Description, flag.Score)
		_, err := pool.Exec(context.Background(), query, message, flag.Severity)
		if err != nil {
			return fmt.Errorf("escalate to admin: %w", err)
		}
	}
	return nil
}
