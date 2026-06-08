package queue

import (
	"context"
	"fmt"

	amqp "github.com/rabbitmq/amqp091-go"
)

func PublishEvent(ctx context.Context, ch *amqp.Channel, exchange, routingKey string, body []byte) error {
	err := ch.PublishWithContext(ctx,
		exchange,
		routingKey,
		false,
		false,
		amqp.Publishing{
			ContentType:  "application/json",
			DeliveryMode: amqp.Persistent,
			Body:         body,
		},
	)
	if err != nil {
		return fmt.Errorf("publish event: %w", err)
	}
	return nil
}
