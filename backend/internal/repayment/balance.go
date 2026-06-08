package repayment

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"
)

type BalanceCalculator struct {
	pool *pgxpool.Pool
}

func NewBalanceCalculator(pool *pgxpool.Pool) *BalanceCalculator {
	return &BalanceCalculator{pool: pool}
}

func (c *BalanceCalculator) CalculateOutstanding(ctx context.Context, loanID string) (float64, error) {
	disbursedQuery := `SELECT COALESCE(amount, 0) FROM loans WHERE id = $1`
	var disbursed float64
	err := c.pool.QueryRow(ctx, disbursedQuery, loanID).Scan(&disbursed)
	if err != nil {
		return 0, fmt.Errorf("get loan amount: %w", err)
	}

	repaymentsQuery := `SELECT COALESCE(SUM(amount), 0) FROM repayment_events WHERE loan_id = $1`
	var repaid float64
	err = c.pool.QueryRow(ctx, repaymentsQuery, loanID).Scan(&repaid)
	if err != nil {
		return 0, fmt.Errorf("sum repayments: %w", err)
	}

	outstanding := disbursed - repaid
	if outstanding < 0 {
		outstanding = 0
	}

	return outstanding, nil
}
