package escrow

import (
	"context"
	"fmt"
	"time"

	apperrors "github.com/coreflex/fundabiz/internal/shared/errors"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"
)

type Service struct {
	repo *Repository
	rdb  *redis.Client
}

func NewService(pool *pgxpool.Pool, rdb *redis.Client) *Service {
	return &Service{
		repo: NewRepository(pool),
		rdb:  rdb,
	}
}

func (s *Service) CreateEscrow(ctx context.Context, buyerID, supplierID, orderID string, amount float64, description string) (*EscrowResponse, error) {
	now := time.Now()
	escrow := &EscrowOrder{
		ID:          uuid.New().String(),
		BuyerID:     buyerID,
		SupplierID:  supplierID,
		OrderID:     orderID,
		Amount:      amount,
		Status:      "held",
		Description: description,
		CreatedAt:   now,
		UpdatedAt:   now,
	}

	if err := HoldFunds(ctx, escrow.ID, escrow.Amount); err != nil {
		return nil, apperrors.NewAppError("HOLD_FAILED", "Failed to hold funds: "+err.Error(), 422)
	}

	if err := s.repo.CreateEscrow(ctx, escrow); err != nil {
		return nil, fmt.Errorf("create escrow: %w", err)
	}

	return escrow.ToResponse(), nil
}

func (s *Service) GetEscrow(ctx context.Context, id string) (*EscrowResponse, error) {
	escrow, err := s.repo.GetEscrow(ctx, id)
	if err != nil {
		return nil, apperrors.ErrNotFound
	}
	return escrow.ToResponse(), nil
}

func (s *Service) ReleaseFunds(ctx context.Context, id string) (*EscrowResponse, error) {
	lockKey := "escrow:release:" + id
	lock := s.rdb.SetNX(ctx, lockKey, "1", 30*time.Second)
	if err := lock.Err(); err != nil {
		return nil, fmt.Errorf("acquire lock: %w", err)
	}
	if !lock.Val() {
		return nil, apperrors.NewAppError("LOCK_ACQUISITION_FAILED", "Another release is in progress", 409)
	}
	defer s.rdb.Del(ctx, lockKey)

	escrow, err := s.repo.GetEscrow(ctx, id)
	if err != nil {
		return nil, apperrors.ErrNotFound
	}

	if escrow.Status != "held" {
		return nil, apperrors.NewAppError("INVALID_STATUS", "Escrow is not in held status", 422)
	}

	if err := ReleaseFundsToSupplier(ctx, s.repo.pool, escrow); err != nil {
		return nil, fmt.Errorf("release funds: %w", err)
	}

	escrow.Status = "released"
	escrow.ReleasedAt = time.Now()
	escrow.UpdatedAt = time.Now()

	if err := s.repo.UpdateEscrow(ctx, escrow); err != nil {
		return nil, fmt.Errorf("update escrow: %w", err)
	}

	event := &EscrowEvent{
		ID:        uuid.New().String(),
		EscrowID:  escrow.ID,
		EventType: "released",
		Data:      "Funds released to supplier",
		CreatedAt: time.Now(),
	}
	_ = s.repo.CreateEvent(ctx, event)

	return escrow.ToResponse(), nil
}

func (s *Service) RaiseDispute(ctx context.Context, id, raisedBy, reason string) (*EscrowDispute, error) {
	escrow, err := s.repo.GetEscrow(ctx, id)
	if err != nil {
		return nil, apperrors.ErrNotFound
	}

	dispute := &EscrowDispute{
		ID:        uuid.New().String(),
		EscrowID:  id,
		RaisedBy:  raisedBy,
		Reason:    reason,
		Status:    "open",
		CreatedAt: time.Now(),
	}

	if err := s.repo.CreateDispute(ctx, dispute); err != nil {
		return nil, fmt.Errorf("create dispute: %w", err)
	}

	escrow.Status = "disputed"
	escrow.UpdatedAt = time.Now()
	_ = s.repo.UpdateEscrow(ctx, escrow)

	event := &EscrowEvent{
		ID:        uuid.New().String(),
		EscrowID:  escrow.ID,
		EventType: "disputed",
		Data:      reason,
		CreatedAt: time.Now(),
	}
	_ = s.repo.CreateEvent(ctx, event)

	return dispute, nil
}
