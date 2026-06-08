package rules

import (
	"context"
	"time"

	"github.com/coreflex/fundabiz/internal/fraud"
)

type RapidEscrowConfirmRule struct{}

func (r *RapidEscrowConfirmRule) Name() string {
	return "rapid_escrow_confirm"
}

func (r *RapidEscrowConfirmRule) Evaluate(ctx context.Context, tx *fraud.Transaction) *fraud.FraudFlag {
	if tx.EscrowCreateAt.IsZero() || tx.CreatedAt.IsZero() {
		return nil
	}

	duration := tx.CreatedAt.Sub(tx.EscrowCreateAt)
	if duration < 2*time.Minute {
		return &fraud.FraudFlag{
			RuleName:    r.Name(),
			Severity:    "high",
			Description: "Escrow confirmed less than 2 minutes after creation",
			Score:       40,
		}
	}

	return nil
}
