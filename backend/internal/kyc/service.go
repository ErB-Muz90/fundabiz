package kyc

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

type KYCApplication struct {
	ID                string    `json:"id"`
	UserID            string    `json:"user_id"`
	BusinessName      string    `json:"business_name"`
	BusinessRegNumber string    `json:"business_reg_number"`
	BusinessAgeMonths int       `json:"business_age_months"`
	CountyID          string    `json:"county_id"`
	IDNumber          string    `json:"id_number"`
	KCPE              string    `json:"kcpe,omitempty"`
	Status            string    `json:"status"`
	RiskScore         int       `json:"risk_score"`
	ReviewerID        string    `json:"reviewer_id,omitempty"`
	DecisionReason    string    `json:"decision_reason,omitempty"`
	CreatedAt         time.Time `json:"created_at"`
	UpdatedAt         time.Time `json:"updated_at"`
}

func (s *Service) SubmitApplication(ctx context.Context, userID, businessName, businessRegNumber string, businessAgeMonths int, countyID, idNumber, kcpe string) (*KYCApplication, error) {
	now := time.Now()
	app := &KYCApplication{
		ID:                uuid.New().String(),
		UserID:            userID,
		BusinessName:      businessName,
		BusinessRegNumber: businessRegNumber,
		BusinessAgeMonths: businessAgeMonths,
		CountyID:          countyID,
		IDNumber:          idNumber,
		KCPE:              kcpe,
		Status:            "pending",
		CreatedAt:         now,
		UpdatedAt:         now,
	}

	riskScore := CompositeKYCScore(app)
	app.RiskScore = riskScore

	if riskScore > 80 {
		app.Status = "flagged"
	}

	if err := s.repo.CreateApplication(ctx, app); err != nil {
		return nil, fmt.Errorf("create application: %w", err)
	}

	return app, nil
}

func (s *Service) GetQueue(ctx context.Context, status, countyID string) ([]*KYCApplication, error) {
	apps, err := s.repo.FindApplications(ctx, status, countyID)
	if err != nil {
		return nil, fmt.Errorf("find applications: %w", err)
	}
	return apps, nil
}

func (s *Service) GetApplication(ctx context.Context, id string) (*KYCApplication, error) {
	app, err := s.repo.GetApplication(ctx, id)
	if err != nil {
		return nil, apperrors.ErrNotFound
	}
	return app, nil
}

func (s *Service) ProcessDecision(ctx context.Context, id, reviewerID, decision, reason string) (*KYCApplication, error) {
	app, err := s.repo.GetApplication(ctx, id)
	if err != nil {
		return nil, apperrors.ErrNotFound
	}

	if app.Status != "pending" && app.Status != "flagged" {
		return nil, apperrors.NewAppError("INVALID_STATUS", "Application already processed", 422)
	}

	switch decision {
	case "approved":
		Approve(app, reviewerID)
	case "rejected":
		Reject(app, reviewerID, reason)
	case "flagged":
		Flag(app, reviewerID, reason)
	default:
		return nil, apperrors.NewAppError("INVALID_DECISION", "Invalid decision", 422)
	}

	if err := s.repo.UpdateApplication(ctx, app); err != nil {
		return nil, fmt.Errorf("update application: %w", err)
	}

	return app, nil
}
