package queue

import (
	"fmt"

	amqp "github.com/rabbitmq/amqp091-go"
)

func ConnectRabbitMQ(host, port, user, password string) (*amqp.Connection, error) {
	dsn := fmt.Sprintf("amqp://%s:%s@%s:%s/", user, password, host, port)
	conn, err := amqp.Dial(dsn)
	if err != nil {
		return nil, fmt.Errorf("dial rabbitmq: %w", err)
	}
	return conn, nil
}

func DeclareQueue(ch *amqp.Channel, name string, durable bool) (amqp.Queue, error) {
	q, err := ch.QueueDeclare(
		name,
		durable,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		return amqp.Queue{}, fmt.Errorf("declare queue %s: %w", name, err)
	}
	return q, nil
}

func DeclareExchange(ch *amqp.Channel, name, kind string) error {
	err := ch.ExchangeDeclare(
		name,
		kind,
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		return fmt.Errorf("declare exchange %s: %w", name, err)
	}
	return nil
}

func BindQueue(ch *amqp.Channel, queue, routingKey, exchange string) error {
	return ch.QueueBind(queue, routingKey, exchange, false, nil)
}
