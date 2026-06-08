package loan

import (
	"context"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Loan struct {
	ID           string    `json:"id"`
	UserID       string    `json:"user_id"`
	Amount       float64   `json:"amount"`
	InterestRate float64   `json:"interest_rate"`
	Status       string    `json:"status"`
	Purpose      string    `json:"purpose"`
	CountyID     string    `json:"county_id"`
	DisbursedAt  *time.Time `json:"disbursed_at"`
	Tranches     []Tranche `json:"tranches"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type Tranche struct {
	ID          string    `json:"id"`
	LoanID      string    `json:"loan_id"`
	Milestone   string    `json:"milestone"`
	Amount      float64   `json:"amount"`
	Status      string    `json:"status"`
	DueDate     time.Time `json:"due_date"`
	SequenceNo  int       `json:"sequence_no"`
	UnlockedAt  time.Time `json:"unlocked_at,omitempty"`
	CreatedAt   time.Time `json:"created_at"`
}

func (t *Tranche) CanUnlock() bool {
	if t.Status == "unlocked" {
		return false
	}
	return t.DueDate.Before(time.Now()) || t.DueDate.Equal(time.Now())
}

func (t *Tranche) ToResponse() *TrancheResponse {
	return &TrancheResponse{
		ID:         t.ID,
		LoanID:     t.LoanID,
		Milestone:  t.Milestone,
		Amount:     t.Amount,
		Status:     t.Status,
		DueDate:    t.DueDate,
		SequenceNo: t.SequenceNo,
		UnlockedAt: t.UnlockedAt,
	}
}

type Repository struct {
	pool *pgxpool.Pool
}

func NewRepository(pool *pgxpool.Pool) *Repository {
	return &Repository{pool: pool}
}

func (r *Repository) CreateLoan(ctx context.Context, loan *Loan) error {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return fmt.Errorf("begin tx: %w", err)
	}
	defer tx.Rollback(ctx)

	query := `INSERT INTO loans (id, user_id, amount, interest_rate, status, purpose, county_id, disbursed_at, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`
	_, err = tx.Exec(ctx, query,
		loan.ID, loan.UserID, loan.Amount, loan.InterestRate, loan.Status,
		loan.Purpose, loan.CountyID, loan.DisbursedAt, loan.CreatedAt, loan.UpdatedAt,
	)
	if err != nil {
		return fmt.Errorf("insert loan: %w", err)
	}

	for _, t := range loan.Tranches {
		_, err = tx.Exec(ctx,
			`INSERT INTO tranches (id, loan_id, milestone, amount, status, due_date, sequence_no, created_at)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
			t.ID, t.LoanID, t.Milestone, t.Amount, t.Status, t.DueDate, t.SequenceNo, t.CreatedAt,
		)
		if err != nil {
			return fmt.Errorf("insert tranche: %w", err)
		}
	}

	return tx.Commit(ctx)
}

func (r *Repository) GetLoan(ctx context.Context, id string) (*Loan, error) {
	query := `SELECT id, user_id, amount, interest_rate, status, purpose, county_id, disbursed_at, created_at, updated_at FROM loans WHERE id = $1`
	loan := &Loan{}
	err := r.pool.QueryRow(ctx, query, id).Scan(
		&loan.ID, &loan.UserID, &loan.Amount, &loan.InterestRate, &loan.Status,
		&loan.Purpose, &loan.CountyID, &loan.DisbursedAt, &loan.CreatedAt, &loan.UpdatedAt,
	)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, fmt.Errorf("loan not found")
		}
		return nil, fmt.Errorf("query loan: %w", err)
	}

	tranches, err := r.GetTranchesByLoanID(ctx, id)
	if err != nil {
		return nil, err
	}
	loan.Tranches = tranches

	return loan, nil
}

func (r *Repository) ListUserLoans(ctx context.Context, userID string) ([]*Loan, error) {
	query := `SELECT id, user_id, amount, interest_rate, status, purpose, county_id, disbursed_at, created_at, updated_at FROM loans WHERE user_id = $1 ORDER BY created_at DESC`
	rows, err := r.pool.Query(ctx, query, userID)
	if err != nil {
		return nil, fmt.Errorf("query user loans: %w", err)
	}
	defer rows.Close()

	var loans []*Loan
	for rows.Next() {
		loan := &Loan{}
		err := rows.Scan(
			&loan.ID, &loan.UserID, &loan.Amount, &loan.InterestRate, &loan.Status,
			&loan.Purpose, &loan.CountyID, &loan.DisbursedAt, &loan.CreatedAt, &loan.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("scan loan: %w", err)
		}
		loans = append(loans, loan)
	}

	return loans, nil
}

func (r *Repository) GetTranche(ctx context.Context, trancheID string) (*Tranche, error) {
	query := `SELECT id, loan_id, milestone, amount, status, due_date, sequence_no, unlocked_at, created_at FROM tranches WHERE id = $1`
	t := &Tranche{}
	err := r.pool.QueryRow(ctx, query, trancheID).Scan(
		&t.ID, &t.LoanID, &t.Milestone, &t.Amount, &t.Status, &t.DueDate, &t.SequenceNo, &t.UnlockedAt, &t.CreatedAt,
	)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, fmt.Errorf("tranche not found")
		}
		return nil, fmt.Errorf("query tranche: %w", err)
	}
	return t, nil
}

func (r *Repository) GetTranchesByLoanID(ctx context.Context, loanID string) ([]Tranche, error) {
	query := `SELECT id, loan_id, milestone, amount, status, due_date, sequence_no, unlocked_at, created_at FROM tranches WHERE loan_id = $1 ORDER BY sequence_no`
	rows, err := r.pool.Query(ctx, query, loanID)
	if err != nil {
		return nil, fmt.Errorf("query tranches: %w", err)
	}
	defer rows.Close()

	var tranches []Tranche
	for rows.Next() {
		var t Tranche
		err := rows.Scan(&t.ID, &t.LoanID, &t.Milestone, &t.Amount, &t.Status, &t.DueDate, &t.SequenceNo, &t.UnlockedAt, &t.CreatedAt)
		if err != nil {
			return nil, fmt.Errorf("scan tranche: %w", err)
		}
		tranches = append(tranches, t)
	}
	return tranches, nil
}

func (r *Repository) UpdateTranche(ctx context.Context, tranche *Tranche) error {
	query := `UPDATE tranches SET status = $1, unlocked_at = $2 WHERE id = $3`
	_, err := r.pool.Exec(ctx, query, tranche.Status, tranche.UnlockedAt, tranche.ID)
	if err != nil {
		return fmt.Errorf("update tranche: %w", err)
	}
	return nil
}
