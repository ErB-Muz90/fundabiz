package flows

import "fmt"

func ConfirmDeliveryResponse(phoneNumber, orderID string) string {
	_ = phoneNumber
	_ = orderID
	return fmt.Sprintf("Delivery for order %s has been confirmed. Thank you!", orderID)
}
