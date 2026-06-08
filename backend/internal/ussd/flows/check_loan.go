package flows

import "fmt"

func CheckLoanResponse(phoneNumber string) string {
	_ = phoneNumber
	return fmt.Sprintf("Outstanding loan: KES 0.00\nNext repayment: KES 0.00")
}
