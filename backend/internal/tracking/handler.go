package tracking

import (
	"net/http"

	apperrors "github.com/coreflex/fundabiz/internal/shared/errors"
	"github.com/gofiber/fiber/v2"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Handler struct {
	svc  *Service
	pool *pgxpool.Pool
}

func NewHandler(pool *pgxpool.Pool) *Handler {
	return &Handler{
		svc:  NewService(pool),
		pool: pool,
	}
}

func (h *Handler) GetTimeline(c *fiber.Ctx) error {
	orderID := c.Params("orderId")
	timeline, err := h.svc.GetTimeline(c.Context(), orderID)
	if err != nil {
		appErr, ok := err.(*apperrors.AppError)
		if ok {
			return c.Status(appErr.StatusCode).JSON(fiber.Map{"error": appErr.Message, "code": appErr.Code})
		}
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(http.StatusOK).JSON(timeline)
}

type addEventRequest struct {
	EventType string `json:"event_type"`
	Location  string `json:"location,omitempty"`
	Notes     string `json:"notes,omitempty"`
}

func (h *Handler) AddEvent(c *fiber.Ctx) error {
	orderID := c.Params("orderId")
	var req addEventRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "invalid request body"})
	}

	event, err := h.svc.AddEvent(c.Context(), orderID, req.EventType, req.Location, req.Notes)
	if err != nil {
		appErr, ok := err.(*apperrors.AppError)
		if ok {
			return c.Status(appErr.StatusCode).JSON(fiber.Map{"error": appErr.Message, "code": appErr.Code})
		}
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(http.StatusCreated).JSON(event)
}
