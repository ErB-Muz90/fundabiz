package rules

import (
	"context"

	"github.com/coreflex/fundabiz/internal/fraud"
)

type MultiAccountDeviceRule struct{}

func (r *MultiAccountDeviceRule) Name() string {
	return "multi_account_device"
}

func (r *MultiAccountDeviceRule) Evaluate(ctx context.Context, tx *fraud.Transaction) *fraud.FraudFlag {
	if tx.DeviceID == "" {
		return nil
	}

	return nil
}
