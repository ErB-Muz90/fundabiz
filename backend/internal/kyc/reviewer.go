package kyc

import "time"

func Approve(app *KYCApplication, reviewerID string) {
	app.Status = "approved"
	app.ReviewerID = reviewerID
	app.UpdatedAt = time.Now()
}

func Reject(app *KYCApplication, reviewerID, reason string) {
	app.Status = "rejected"
	app.ReviewerID = reviewerID
	app.DecisionReason = reason
	app.UpdatedAt = time.Now()
}

func Flag(app *KYCApplication, reviewerID, reason string) {
	app.Status = "flagged"
	app.ReviewerID = reviewerID
	app.DecisionReason = reason
	app.UpdatedAt = time.Now()
}
