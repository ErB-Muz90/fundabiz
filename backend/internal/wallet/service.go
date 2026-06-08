package wallet

import (
	"context"
	"fmt"
	"time"

	apperrors "github.com/coreflex/fundabiz/internal/shared/errors"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Service struct {
	repo *Repository
}

func NewService(pool *pgxpool.Pool) *Service {
	return &Service{repo: NewRepository(pool)}
}

type WalletResponse struct {
	ID        string             `json:"id"`
	UserID    string             `json:"user_id"`
	Balance   float64            `json:"balance"`
	Currency  string             `json:"currency"`
	Role      string             `json:"role"`
	Ledger    []LedgerEntry      `json:"ledger,omitempty"`
	CreatedAt time.Time          `json:"created_at"`
	UpdatedAt time.Time          `json:"updated_at"`
}

func (s *Service) GetWallet(ctx context.Context, userID string) (*WalletResponse, error) {
	wallet, err := s.repo.GetWallet(ctx, userID)
	if err != nil {
		return nil, apperrors.ErrNotFound
	}

	ledger, err := s.repo.GetLedger(ctx, wallet.ID)
	if err != nil {
		return nil, fmt.Errorf("get ledger: %w", err)
	}

	return &WalletResponse{
		ID:        wallet.ID,
		UserID:    wallet.UserID,
		Balance:   wallet.Balance,
		Currency:  wallet.Currency,
		Role:      wallet.Role,
		Ledger:    ledger,
		CreatedAt: wallet.CreatedAt,
		UpdatedAt: wallet.UpdatedAt,
	}, nil
}

func (s *Service) Deposit(ctx context.Context, userID string, amount float64, method, reference string) (*WalletResponse, error) {
	if amount <= 0 {
		return nil, apperrors.NewAppError("INVALID_AMOUNT", "Deposit amount must be positive", 422)
	}

	tx, err := s.repo.pool.Begin(ctx)
	if err != nil {
		return nil, fmt.Errorf("begin tx: %w", err)
	}
	defer tx.Rollback(ctx)

	wallet, err := s.repo.GetWalletForUpdate(ctx, userID)
	if err != nil {
		return nil, apperrors.ErrNotFound
	}

	wallet.Balance += amount
	wallet.UpdatedAt = time.Now()

	if err := s.repo.UpdateWalletBalanceTx(ctx, tx, wallet); err != nil {
		return nil, fmt.Errorf("update wallet: %w", err)
	}

	entry := &LedgerEntry{
		ID:        uuid.New().String(),
		WalletID:  wallet.ID,
		Amount:    amount,
		Type:      "deposit",
		Reference: reference,
		Metadata:  method,
		CreatedAt: time.Now(),
	}
	if err := s.repo.InsertLedgerEntryTx(ctx, tx, entry); err != nil {
		return nil, fmt.Errorf("insert ledger: %w", err)
	}

	if err := tx.Commit(ctx); err != nil {
		return nil, fmt.Errorf("commit tx: %w", err)
	}

	return &WalletResponse{
		ID:        wallet.ID,
		UserID:    wallet.UserID,
		Balance:   wallet.Balance,
		Currency:  wallet.Currency,
		Role:      wallet.Role,
		CreatedAt: wallet.CreatedAt,
		UpdatedAt: wallet.UpdatedAt,
	}, nil
}

func (s *Service) Transfer(ctx context.Context, fromUserID, toUserID string, amount float64, reference string) (*WalletResponse, error) {
	if amount <= 0 {
		return nil, apperrors.NewAppError("INVALID_AMOUNT", "Transfer amount must be positive", 422)
	}

	fromWallet, err := s.repo.GetWallet(ctx, fromUserID)
	if err != nil {
		return nil, apperrors.ErrNotFound
	}

	toWallet, err := s.repo.GetWallet(ctx, toUserID)
	if err != nil {
		return nil, apperrors.ErrNotFound
	}

	if err := ValidateTransaction(fromWallet, toWallet, amount); err != nil {
		return nil, err
	}

	if fromWallet.Balance < amount {
		return nil, apperrors.NewAppError("INSUFFICIENT_FUNDS", "Insufficient balance", 422)
	}

	if err := B2BTransfer(ctx, s.repo.pool, fromWallet, toWallet, amount, reference); err != nil {
		return nil, fmt.Errorf("b2b transfer: %w", err)
	}

	fromWallet.Balance -= amount
	fromWallet.UpdatedAt = time.Now()

	return &WalletResponse{
		ID:        fromWallet.ID,
		UserID:    fromWallet.UserID,
		Balance:   fromWallet.Balance,
		Currency:  fromWallet.Currency,
		Role:      fromWallet.Role,
		CreatedAt: fromWallet.CreatedAt,
		UpdatedAt: fromWallet.UpdatedAt,
	}, nil
}
