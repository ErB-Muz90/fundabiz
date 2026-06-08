package credit

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"
)

func RepaymentFactor(ctx context.Context, pool *pgxpool.Pool, userID string) (int, error) {
	query := `SELECT COUNT(*) FROM repayment_events re
		JOIN loans l ON l.id = re.loan_id
		WHERE l.user_id = $1`
	var totalRepayments int
	err := pool.QueryRow(ctx, query, userID).Scan(&totalRepayments)
	if err != nil {
		return 0, fmt.Errorf("count repayments: %w", err)
	}

	if totalRepayments > 50 {
		return 400, nil
	}
	if totalRepayments > 20 {
		return 300, nil
	}
	if totalRepayments > 10 {
		return 200, nil
	}
	if totalRepayments > 0 {
		return 100, nil
	}
	return 0, nil
}

func SalesGrowthFactor(ctx context.Context, pool *pgxpool.Pool, userID string) (float64, error) {
	_ = userID
	return 0, nil
}

func EscrowCompletionFactor(ctx context.Context, pool *pgxpool.Pool, userID string) (float64, error) {
	_ = userID
	return 0, nil
}
