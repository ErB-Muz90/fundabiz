package loan

import "time"

type CreateLoanRequest struct {
	UserID       string  `json:"user_id"`
	Amount       float64 `json:"amount"`
	InterestRate float64 `json:"interest_rate"`
	Purpose      string  `json:"purpose"`
	CountyID     string  `json:"county_id"`
}

type LoanResponse struct {
	ID           string             `json:"id"`
	UserID       string             `json:"user_id"`
	Amount       float64            `json:"amount"`
	InterestRate float64            `json:"interest_rate"`
	Status       string             `json:"status"`
	Purpose      string             `json:"purpose"`
	CountyID     string             `json:"county_id"`
	DisbursedAt  *time.Time         `json:"disbursed_at,omitempty"`
	Tranches     []TrancheResponse  `json:"tranches,omitempty"`
	CreatedAt    time.Time          `json:"created_at"`
	UpdatedAt    time.Time          `json:"updated_at"`
}

type TrancheResponse struct {
	ID         string    `json:"id"`
	LoanID     string    `json:"loan_id"`
	Milestone  string    `json:"milestone"`
	Amount     float64   `json:"amount"`
	Status     string    `json:"status"`
	DueDate    time.Time `json:"due_date"`
	SequenceNo int       `json:"sequence_no"`
	UnlockedAt time.Time `json:"unlocked_at,omitempty"`
}

func (l *Loan) ToResponse() *LoanResponse {
	resp := &LoanResponse{
		ID:           l.ID,
		UserID:       l.UserID,
		Amount:       l.Amount,
		InterestRate: l.InterestRate,
		Status:       l.Status,
		Purpose:      l.Purpose,
		CountyID:     l.CountyID,
		DisbursedAt:  l.DisbursedAt,
		CreatedAt:    l.CreatedAt,
		UpdatedAt:    l.UpdatedAt,
	}

	if len(l.Tranches) > 0 {
		tranches := make([]TrancheResponse, len(l.Tranches))
		for i, t := range l.Tranches {
			tranches[i] = *t.ToResponse()
		}
		resp.Tranches = tranches
	}

	return resp
}
