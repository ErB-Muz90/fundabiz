package credit

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"
)

type CreditScorer struct {
	pool *pgxpool.Pool
}

func NewCreditScorer(pool *pgxpool.Pool) *CreditScorer {
	return &CreditScorer{pool: pool}
}

type CreditProfile struct {
	UserID              string  `json:"user_id"`
	RepaymentHistory    float64 `json:"repayment_history"`
	SalesGrowth         float64 `json:"sales_growth"`
	EscrowCompletionRate float64 `json:"escrow_completion_rate"`
	BusinessAgeMonths   int     `json:"business_age_months"`
	TotalScore          int     `json:"total_score"`
	Tier                string  `json:"tier"`
}

func (s *CreditScorer) CalculateCreditScore(ctx context.Context, userID string) (*CreditProfile, error) {
	repaymentFactor, err := RepaymentFactor(ctx, s.pool, userID)
	if err != nil {
		return nil, fmt.Errorf("repayment factor: %w", err)
	}

	salesGrowth, err := SalesGrowthFactor(ctx, s.pool, userID)
	if err != nil {
		return nil, fmt.Errorf("sales growth factor: %w", err)
	}

	escrowCompletion, err := EscrowCompletionFactor(ctx, s.pool, userID)
	if err != nil {
		return nil, fmt.Errorf("escrow completion factor: %w", err)
	}

	totalScore := repaymentFactor + int(salesGrowth) + int(escrowCompletion)
	tier := ScoreToTier(totalScore)

	return &CreditProfile{
		UserID:              userID,
		RepaymentHistory:    float64(repaymentFactor),
		SalesGrowth:         salesGrowth,
		EscrowCompletionRate: escrowCompletion,
		TotalScore:          totalScore,
		Tier:                tier,
	}, nil
}
