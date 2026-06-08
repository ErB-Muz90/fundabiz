package templates

import "fmt"

func LoanDeductionMessage(loanID string, amount float64, outstanding float64) string {
	return fmt.Sprintf("A loan repayment of KES %.2f has been deducted for loan %s. Outstanding balance: KES %.2f.", amount, loanID, outstanding)
}

func LoanDeductionSMS(loanID string, amount float64, outstanding float64) string {
	return fmt.Sprintf("FundaBiz: KES %.2f deducted for loan %s. Balance: KES %.2f", amount, loanID, outstanding)
}

func LoanDeductionSubject() string {
	return "Loan Repayment Deduction - FundaBiz"
}
