package repayment

import (
	"context"
	"encoding/json"
	"fmt"
	"log"

	"github.com/coreflex/fundabiz/internal/shared/queue"
	"github.com/jackc/pgx/v5/pgxpool"
	amqp "github.com/rabbitmq/amqp091-go"
)

type Worker struct {
	pool *pgxpool.Pool
	rmq  *amqp.Channel
}

func NewWorker(pool *pgxpool.Pool, rmq *amqp.Channel) *Worker {
	return &Worker{pool: pool, rmq: rmq}
}

func (w *Worker) Start(ctx context.Context) error {
	_, err := queue.DeclareQueue(w.rmq, "repayment.deduct", true)
	if err != nil {
		return fmt.Errorf("declare queue: %w", err)
	}

	handler := func(ctx context.Context, msg amqp.Delivery) error {
		var event struct {
			LoanID      string  `json:"loan_id"`
			UserID      string  `json:"user_id"`
			SaleID      string  `json:"sale_id"`
			SaleAmount  float64 `json:"sale_amount"`
		}
		if err := json.Unmarshal(msg.Body, &event); err != nil {
			log.Printf("unmarshal repayment event: %v", err)
			return nil
		}

		amount := CalculateDeduction(event.SaleAmount)
		if err := ApplyDeduction(ctx, w.pool, event.LoanID, event.SaleID, amount); err != nil {
			return fmt.Errorf("apply deduction: %w", err)
		}

		return nil
	}

	if err := queue.ConsumeEvents(ctx, w.rmq, "repayment.deduct", handler, 5); err != nil {
		return fmt.Errorf("consume events: %w", err)
	}

	return nil
}
