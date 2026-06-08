package repayment

import (
	"context"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

type RepaymentEvent struct {
	ID        string    `json:"id"`
	LoanID    string    `json:"loan_id"`
	Amount    float64   `json:"amount"`
	SaleID    string    `json:"sale_id"`
	CreatedAt time.Time `json:"created_at"`
}

type AppendOnlyLedger struct {
	pool *pgxpool.Pool
}

func (l *AppendOnlyLedger) Append(ctx context.Context, event RepaymentEvent) error {
	query := `INSERT INTO repayment_events (id, loan_id, amount, sale_id, created_at)
		VALUES ($1, $2, $3, $4, $5)`
	_, err := l.pool.Exec(ctx, query, event.ID, event.LoanID, event.Amount, event.SaleID, event.CreatedAt)
	if err != nil {
		return fmt.Errorf("append repayment event: %w", err)
	}
	return nil
}
