package credit

type LoanTier struct {
	Name             string
	MinScore         int
	MaxScore         int
	MaxLoanAmount    float64
	InterestRate     float64
	MaxLoanTermDays  int
}

var Tiers = []LoanTier{
	{Name: "Bronze", MinScore: 0, MaxScore: 299, MaxLoanAmount: 10000, InterestRate: 0.15, MaxLoanTermDays: 30},
	{Name: "Silver", MinScore: 300, MaxScore: 599, MaxLoanAmount: 50000, InterestRate: 0.12, MaxLoanTermDays: 60},
	{Name: "Gold", MinScore: 600, MaxScore: 799, MaxLoanAmount: 200000, InterestRate: 0.10, MaxLoanTermDays: 90},
	{Name: "Platinum", MinScore: 800, MaxScore: 1000, MaxLoanAmount: 1000000, InterestRate: 0.08, MaxLoanTermDays: 180},
}

func ScoreToTier(score int) string {
	for _, tier := range Tiers {
		if score >= tier.MinScore && score <= tier.MaxScore {
			return tier.Name
		}
	}
	return "Bronze"
}

func GetTierDetails(tierName string) *LoanTier {
	for _, t := range Tiers {
		if t.Name == tierName {
			return &t
		}
	}
	return &Tiers[0]
}

func CalculateMaxLoan(score int) float64 {
	tier := GetTierDetails(ScoreToTier(score))
	return tier.MaxLoanAmount
}
