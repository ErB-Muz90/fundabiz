package mpesa

import (
	"encoding/json"
	"log"
	"time"

	"github.com/coreflex/fundabiz/internal/shared/config"
	"github.com/coreflex/fundabiz/internal/shared/idempotency"
	"github.com/coreflex/fundabiz/internal/shared/queue"
	"github.com/gofiber/fiber/v2"
	amqp "github.com/rabbitmq/amqp091-go"
)

type CallbackHandler struct {
	cfg               *config.Config
	rmqCh             *amqp.Channel
	idempotencyStore  *idempotency.IdempotencyStore
}

func NewHandler(cfg *config.Config, rmqCh *amqp.Channel, store *idempotency.IdempotencyStore) *CallbackHandler {
	return &CallbackHandler{
		cfg:              cfg,
		rmqCh:            rmqCh,
		idempotencyStore: store,
	}
}

type MpesaCallbackBody struct {
	Body struct {
		StkCallback struct {
			MerchantRequestID string `json:"MerchantRequestID"`
			CheckoutRequestID string `json:"CheckoutRequestID"`
			ResultCode        int    `json:"ResultCode"`
			ResultDesc        string `json:"ResultDesc"`
			CallbackMetadata  struct {
				Item []struct {
					Name  string      `json:"Name"`
					Value interface{} `json:"Value"`
				} `json:"Item"`
			} `json:"CallbackMetadata"`
		} `json:"stkCallback"`
	} `json:"Body"`
}

func (h *CallbackHandler) Callback(c *fiber.Ctx) error {
	var callback MpesaCallbackBody
	if err := c.BodyParser(&callback); err != nil {
		log.Printf("failed to parse mpesa callback: %v", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid callback body"})
	}

	checkoutID := callback.Body.StkCallback.CheckoutRequestID
	if checkoutID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "missing checkout request id"})
	}

	isNew, err := h.idempotencyStore.CheckAndStore(c.Context(), "mpesa:"+checkoutID, 24*time.Hour)
	if err != nil {
		log.Printf("idempotency check failed: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "idempotency check failed"})
	}
	if !isNew {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "callback already processed"})
	}

	bodyBytes, err := json.Marshal(callback)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "marshal error"})
	}

	if err := queue.PublishEvent(c.Context(), h.rmqCh, "mpesa", "mpesa.callback", bodyBytes); err != nil {
		log.Printf("failed to enqueue mpesa callback: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "failed to enqueue"})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"ResultCode": 0,
		"ResultDesc": "success",
	})
}
