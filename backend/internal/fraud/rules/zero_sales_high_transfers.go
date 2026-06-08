package rules

import (
	"context"

	"github.com/coreflex/fundabiz/internal/fraud"
)

const highTransferThreshold = 50000.0

type ZeroSalesHighTransferRule struct{}

func (r *ZeroSalesHighTransferRule) Name() string {
	return "zero_sales_high_transfer"
}

func (r *ZeroSalesHighTransferRule) Evaluate(ctx context.Context, tx *fraud.Transaction) *fraud.FraudFlag {
	if tx.SalesCount == 0 && tx.Amount > highTransferThreshold {
		return &fraud.FraudFlag{
			RuleName:    r.Name(),
			Severity:    "high",
			Description: "Account with zero sales attempting large transfer",
			Score:       50,
		}
	}

	return nil
}
