package flows

import "fmt"

func MainMenu() string {
	return "Welcome to FundaBiz\n1. Check Balance\n2. Loan Info\n3. Confirm Delivery"
}

func HandleMainMenu(input string) string {
	switch input {
	case "1":
		return "Fetching your balance..."
	case "2":
		return "Fetching your loan info..."
	case "3":
		return "Enter order ID to confirm delivery:"
	default:
		return fmt.Sprintf("Invalid option: %s\n1. Check Balance\n2. Loan Info\n3. Confirm Delivery", input)
	}
}
