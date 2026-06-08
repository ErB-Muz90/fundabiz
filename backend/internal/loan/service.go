package loan

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

func (s *Service) CreateLoan(ctx context.Context, req CreateLoanRequest) (*LoanResponse, error) {
	now := time.Now()

	loan := &Loan{
		ID:            uuid.New().String(),
		UserID:        req.UserID,
		Amount:        req.Amount,
		InterestRate:  req.InterestRate,
		Status:        "active",
		Purpose:       req.Purpose,
		CountyID:      req.CountyID,
		DisbursedAt:   &now,
		CreatedAt:     now,
		UpdatedAt:     now,
	}

	totalTranches := 4
	trancheAmount := req.Amount / float64(totalTranches)
	tranches := make([]Tranche, totalTranches)
	for i := 0; i < totalTranches; i++ {
		dueDate := now.AddDate(0, 1*(i+1), 0)
		status := "locked"
		if i == 0 {
			status = "unlocked"
		}
		tranches[i] = Tranche{
			ID:         uuid.New().String(),
			LoanID:     loan.ID,
			Milestone:  fmt.Sprintf("Tranche %d", i+1),
			Amount:     trancheAmount,
			Status:     status,
			DueDate:    dueDate,
			SequenceNo: i + 1,
			CreatedAt:  now,
		}
	}
	loan.Tranches = tranches

	if err := s.repo.CreateLoan(ctx, loan); err != nil {
		return nil, fmt.Errorf("create loan: %w", err)
	}

	return loan.ToResponse(), nil
}

func (s *Service) GetLoan(ctx context.Context, id string) (*LoanResponse, error) {
	loan, err := s.repo.GetLoan(ctx, id)
	if err != nil {
		return nil, apperrors.ErrNotFound
	}
	return loan.ToResponse(), nil
}

func (s *Service) ListUserLoans(ctx context.Context, userID string) ([]*LoanResponse, error) {
	loans, err := s.repo.ListUserLoans(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("list user loans: %w", err)
	}

	resp := make([]*LoanResponse, len(loans))
	for i, l := range loans {
		resp[i] = l.ToResponse()
	}
	return resp, nil
}

func (s *Service) UnlockTranche(ctx context.Context, loanID, trancheID string) (*TrancheResponse, error) {
	tranche, err := s.repo.GetTranche(ctx, trancheID)
	if err != nil {
		return nil, apperrors.ErrNotFound
	}

	if tranche.LoanID != loanID {
		return nil, apperrors.ErrValidation
	}

	if !tranche.CanUnlock() {
		return nil, apperrors.NewAppError("TRANCHE_LOCKED", "Tranche conditions not met", 422)
	}

	tranche.Status = "unlocked"
	tranche.UnlockedAt = time.Now()

	if err := s.repo.UpdateTranche(ctx, tranche); err != nil {
		return nil, fmt.Errorf("unlock tranche: %w", err)
	}

	return tranche.ToResponse(), nil
}
