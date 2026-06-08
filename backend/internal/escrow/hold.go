package escrow

import (
	"context"
)

func HoldFunds(ctx context.Context, orderID string, amount float64) error {
	_ = orderID
	_ = amount
	return nil
}
