package kyc

func CompositeKYCScore(app *KYCApplication) int {
	score := 0

	docScore := documentCompletenessScore(app)
	score += docScore

	ageScore := businessAgeScore(app.BusinessAgeMonths)
	score += ageScore

	return score
}

func documentCompletenessScore(app *KYCApplication) int {
	score := 0

	if app.BusinessName != "" {
		score += 20
	}
	if app.BusinessRegNumber != "" {
		score += 20
	}
	if app.IDNumber != "" {
		score += 20
	}
	if app.KCPE != "" {
		score += 10
	}

	return score
}

func businessAgeScore(months int) int {
	if months >= 24 {
		return 30
	}
	if months >= 12 {
		return 20
	}
	if months >= 6 {
		return 10
	}
	return 0
}

func identityVerificationScore(idVerified bool) int {
	if idVerified {
		return 30
	}
	return 0
}
