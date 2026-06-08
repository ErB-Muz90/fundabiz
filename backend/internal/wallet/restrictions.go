package wallet

import (
	apperrors "github.com/coreflex/fundabiz/internal/shared/errors"
)

const (
	RoleSMEOwner = "SME_OWNER"
	RoleSupplier = "SUPPLIER"

	MaxTransferLimit = 500000.00
	DailyTransferLimit = 1000000.00
)

func ValidateTransaction(from, to *Wallet, amount float64) error {
	if from.Role == RoleSMEOwner {
		if to.Role != RoleSupplier {
			return apperrors.NewAppError("RESTRICTION_VIOLATION", "SME wallets can only transfer to verified suppliers", 422)
		}
	}

	if from.Role == RoleSMEOwner && from.Balance-amount < 0 {
		return apperrors.NewAppError("RESTRICTION_VIOLATION", "SME wallets cannot go into negative balance", 422)
	}

	if amount > MaxTransferLimit {
		return apperrors.NewAppError("LIMIT_EXCEEDED", "Transfer exceeds maximum limit of KES 500,000", 422)
	}

	return nil
}

func CanCashOut(role string) bool {
	if role == RoleSMEOwner {
		return false
	}
	return true
}

func CanOnlyUseEscrow(role string) bool {
	return role == RoleSMEOwner
}
