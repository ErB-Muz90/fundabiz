package loan

import "time"

type TrancheMilestone struct {
	ID          string    `json:"id"`
	LoanID      string    `json:"loan_id"`
	Milestone   string    `json:"milestone"`
	Amount      float64   `json:"amount"`
	Status      string    `json:"status"`
	DueDate     time.Time `json:"due_date"`
	SequenceNo  int       `json:"sequence_no"`
	UnlockedAt  time.Time `json:"unlocked_at,omitempty"`
}

func (t *TrancheMilestone) CanUnlock() bool {
	if t.Status == "unlocked" {
		return false
	}
	return time.Now().After(t.DueDate) || time.Now().Equal(t.DueDate)
}

func VerifyMilestoneConditions(loan *Loan, sequenceNo int) bool {
	if sequenceNo <= 1 {
		return true
	}

	for _, t := range loan.Tranches {
		if t.SequenceNo == sequenceNo-1 && t.Status != "unlocked" {
			return false
		}
	}

	return true
}
