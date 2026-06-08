package fraud

import (
	"context"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Transaction struct {
	ID             string    `json:"id"`
	UserID         string    `json:"user_id"`
	Type           string    `json:"type"`
	Amount         float64   `json:"amount"`
	Phone          string    `json:"phone"`
	DeviceID       string    `json:"device_id"`
	EscrowID       string    `json:"escrow_id"`
	BuyerID        string    `json:"buyer_id"`
	SupplierID     string    `json:"supplier_id"`
	CreatedAt      time.Time `json:"created_at"`
	EscrowCreateAt time.Time `json:"escrow_created_at"`
	SalesCount     int       `json:"sales_count"`
}

type FraudFlag struct {
	RuleName    string `json:"rule_name"`
	Severity    string `json:"severity"`
	Description string `json:"description"`
	Score       int    `json:"score"`
}

type Rule interface {
	Name() string
	Evaluate(ctx context.Context, tx *Transaction) *FraudFlag
}

type Engine struct {
	rules []Rule
}

func NewEngine() *Engine {
	return &Engine{rules: make([]Rule, 0)}
}

func (e *Engine) AddRule(rule Rule) {
	e.rules = append(e.rules, rule)
}

func (e *Engine) RunRules(ctx context.Context, tx *Transaction) []*FraudFlag {
	var flags []*FraudFlag
	for _, rule := range e.rules {
		flag := rule.Evaluate(ctx, tx)
		if flag != nil {
			flags = append(flags, flag)
		}
	}
	return flags
}

type Handler struct {
	engine *Engine
	pool   *pgxpool.Pool
}

func NewHandler(engine *Engine, pool *pgxpool.Pool) *Handler {
	return &Handler{engine: engine, pool: pool}
}

func (h *Handler) Evaluate(c *fiber.Ctx) error {
	var tx Transaction
	if err := c.BodyParser(&tx); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid request body"})
	}

	flags := h.engine.RunRules(context.Background(), &tx)
	riskScore := CompositeRiskScore(flags)

	for _, flag := range flags {
		_ = FlagTransaction(h.pool, flag, tx.ID)
	}

	if riskScore > 70 {
		_ = FreezeAccount(h.pool, tx.UserID)
	}

	if riskScore > 50 {
		_ = EscalateToAdmin(h.pool, flags)
	}

	return c.Status(200).JSON(fiber.Map{
		"flags":      flags,
		"risk_score": riskScore,
	})
}
