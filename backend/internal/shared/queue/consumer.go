package queue

import (
	"context"
	"fmt"

	amqp "github.com/rabbitmq/amqp091-go"
)

type MessageHandler func(ctx context.Context, msg amqp.Delivery) error

func ConsumeEvents(ctx context.Context, ch *amqp.Channel, queue string, handler MessageHandler, concurrency int) error {
	msgs, err := ch.Consume(
		queue,
		"",
		false,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		return fmt.Errorf("consume queue %s: %w", queue, err)
	}

	sem := make(chan struct{}, concurrency)
	go func() {
		for {
			select {
			case <-ctx.Done():
				return
			case msg, ok := <-msgs:
				if !ok {
					return
				}
				sem <- struct{}{}
				go func(m amqp.Delivery) {
					defer func() { <-sem }()
					if err := handler(ctx, m); err != nil {
						_ = m.Nack(false, true)
						return
					}
					_ = m.Ack(false)
				}(msg)
			}
		}
	}()

	return nil
}
