package repayment

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

const deductionRate = 0.08

func CalculateDeduction(saleAmount float64) float64 {
	return saleAmount * deductionRate
}

func ApplyDeduction(ctx context.Context, pool *pgxpool.Pool, loanID, saleID string, amount float64) error {
	event := RepaymentEvent{
		ID:        uuid.New().String(),
		LoanID:    loanID,
		Amount:    amount,
		SaleID:    saleID,
		CreatedAt: time.Now(),
	}

	ledger := &AppendOnlyLedger{pool: pool}
	if err := ledger.Append(ctx, event); err != nil {
		return fmt.Errorf("append repayment: %w", err)
	}

	return nil
}
