package templates

import "fmt"

func KYCApprovedMessage(businessName string) string {
	return fmt.Sprintf("Dear customer, your KYC application for %s has been approved. You can now access all FundaBiz features.", businessName)
}

func KYCApprovedSMS(businessName string) string {
	return fmt.Sprintf("FundaBiz: KYC for %s approved! You can now access full features.", businessName)
}

func KYCApprovedSubject() string {
	return "KYC Application Approved - FundaBiz"
}
