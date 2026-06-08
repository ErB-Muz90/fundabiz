package rules

import (
	"context"

	"github.com/coreflex/fundabiz/internal/fraud"
)

type DuplicatePhoneRule struct{}

func (r *DuplicatePhoneRule) Name() string {
	return "duplicate_phone"
}

func (r *DuplicatePhoneRule) Evaluate(ctx context.Context, tx *fraud.Transaction) *fraud.FraudFlag {
	if tx.Phone == "" {
		return nil
	}

	return nil
}
