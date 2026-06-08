package fraud

func CompositeRiskScore(flags []*FraudFlag) int {
	if len(flags) == 0 {
		return 0
	}

	totalScore := 0
	maxSeverityScore := 0

	for _, flag := range flags {
		totalScore += flag.Score
		switch flag.Severity {
		case "critical":
			maxSeverityScore = 100
		case "high":
			if maxSeverityScore < 70 {
				maxSeverityScore = 70
			}
		case "medium":
			if maxSeverityScore < 40 {
				maxSeverityScore = 40
			}
		case "low":
			if maxSeverityScore < 20 {
				maxSeverityScore = 20
			}
		}
	}

	avgScore := totalScore / len(flags)
	if avgScore > maxSeverityScore {
		return avgScore
	}
	return maxSeverityScore
}
