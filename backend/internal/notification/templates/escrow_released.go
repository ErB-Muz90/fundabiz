package templates

import "fmt"

func EscrowReleasedMessage(orderID string, amount float64) string {
	return fmt.Sprintf("Your escrow order %s has been released. Amount of KES %.2f has been credited to your wallet.", orderID, amount)
}

func EscrowReleasedSMS(orderID string, amount float64) string {
	return fmt.Sprintf("FundaBiz: Escrow %s released! KES %.2f credited to wallet.", orderID, amount)
}

func EscrowReleasedSubject() string {
	return "Escrow Funds Released - FundaBiz"
}
