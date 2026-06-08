package rules

import (
	"context"

	"github.com/coreflex/fundabiz/internal/fraud"
)

type SupplierLoopRule struct{}

func (r *SupplierLoopRule) Name() string {
	return "supplier_loop"
}

func (r *SupplierLoopRule) Evaluate(ctx context.Context, tx *fraud.Transaction) *fraud.FraudFlag {
	if tx.BuyerID == "" || tx.SupplierID == "" {
		return nil
	}

	if tx.BuyerID == tx.SupplierID {
		return &fraud.FraudFlag{
			RuleName:    r.Name(),
			Severity:    "critical",
			Description: "SME sending funds to self via supplier account",
			Score:       80,
		}
	}

	return nil
}
