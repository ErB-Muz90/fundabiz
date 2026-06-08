package notification

import (
	"context"
	"encoding/json"
	"fmt"
	"log"

	"github.com/coreflex/fundabiz/internal/shared/config"
	"github.com/coreflex/fundabiz/internal/shared/queue"
	amqp "github.com/rabbitmq/amqp091-go"
)

type NotificationEvent struct {
	Type        string `json:"type"`
	Channel     string `json:"channel"`
	Recipient   string `json:"recipient"`
	Subject     string `json:"subject"`
	Message     string `json:"message"`
	DeviceToken string `json:"device_token,omitempty"`
}

type Worker struct {
	cfg *config.Config
	rmq *amqp.Channel
}

func NewWorker(cfg *config.Config, rmq *amqp.Channel) *Worker {
	return &Worker{cfg: cfg, rmq: rmq}
}

func (w *Worker) Start(ctx context.Context) error {
	_, err := queue.DeclareQueue(w.rmq, "notification.sms", true)
	if err != nil {
		return fmt.Errorf("declare sms queue: %w", err)
	}
	_, err = queue.DeclareQueue(w.rmq, "notification.email", true)
	if err != nil {
		return fmt.Errorf("declare email queue: %w", err)
	}
	_, err = queue.DeclareQueue(w.rmq, "notification.push", true)
	if err != nil {
		return fmt.Errorf("declare push queue: %w", err)
	}

	smsHandler := func(ctx context.Context, msg amqp.Delivery) error {
		var event NotificationEvent
		if err := json.Unmarshal(msg.Body, &event); err != nil {
			log.Printf("unmarshal sms event: %v", err)
			return nil
		}
		return SendSMS(w.cfg, event.Recipient, event.Message)
	}

	emailHandler := func(ctx context.Context, msg amqp.Delivery) error {
		var event NotificationEvent
		if err := json.Unmarshal(msg.Body, &event); err != nil {
			log.Printf("unmarshal email event: %v", err)
			return nil
		}
		return SendEmail(w.cfg, event.Recipient, event.Subject, event.Message)
	}

	pushHandler := func(ctx context.Context, msg amqp.Delivery) error {
		var event NotificationEvent
		if err := json.Unmarshal(msg.Body, &event); err != nil {
			log.Printf("unmarshal push event: %v", err)
			return nil
		}
		return SendPushNotification(w.cfg, event.DeviceToken, event.Subject, event.Message)
	}

	if err := queue.ConsumeEvents(ctx, w.rmq, "notification.sms", smsHandler, 5); err != nil {
		return fmt.Errorf("consume sms: %w", err)
	}
	if err := queue.ConsumeEvents(ctx, w.rmq, "notification.email", emailHandler, 5); err != nil {
		return fmt.Errorf("consume email: %w", err)
	}
	if err := queue.ConsumeEvents(ctx, w.rmq, "notification.push", pushHandler, 5); err != nil {
		return fmt.Errorf("consume push: %w", err)
	}

	return nil
}
