package templates

import "fmt"

func DeliveryConfirmedMessage(orderID string) string {
	return fmt.Sprintf("Delivery for order %s has been confirmed. The escrow funds will be released to the supplier.", orderID)
}

func DeliveryConfirmedSMS(orderID string) string {
	return fmt.Sprintf("FundaBiz: Delivery confirmed for order %s. Funds being released.", orderID)
}

func DeliveryConfirmedSubject() string {
	return "Delivery Confirmed - FundaBiz"
}
