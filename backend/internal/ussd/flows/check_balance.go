package flows

import "fmt"

func CheckBalanceResponse(phoneNumber string) string {
	_ = phoneNumber
	return fmt.Sprintf("Your wallet balance is KES 0.00")
}
