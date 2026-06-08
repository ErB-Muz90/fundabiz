package escrow

import (
	"net/http"

	apperrors "github.com/coreflex/fundabiz/internal/shared/errors"
	"github.com/gofiber/fiber/v2"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"
)

type Handler struct {
	svc  *Service
	pool *pgxpool.Pool
	rdb  *redis.Client
}

func NewHandler(pool *pgxpool.Pool, rdb *redis.Client) *Handler {
	return &Handler{
		svc:  NewService(pool, rdb),
		pool: pool,
		rdb:  rdb,
	}
}

type createEscrowRequest struct {
	BuyerID     string  `json:"buyer_id"`
	SupplierID  string  `json:"supplier_id"`
	OrderID     string  `json:"order_id"`
	Amount      float64 `json:"amount"`
	Description string  `json:"description"`
}

func (h *Handler) CreateEscrow(c *fiber.Ctx) error {
	var req createEscrowRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "invalid request body"})
	}

	escrowResp, err := h.svc.CreateEscrow(c.Context(), req.BuyerID, req.SupplierID, req.OrderID, req.Amount, req.Description)
	if err != nil {
		appErr, ok := err.(*apperrors.AppError)
		if ok {
			return c.Status(appErr.StatusCode).JSON(fiber.Map{"error": appErr.Message, "code": appErr.Code})
		}
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(http.StatusCreated).JSON(escrowResp)
}

func (h *Handler) GetEscrow(c *fiber.Ctx) error {
	id := c.Params("id")
	escrowResp, err := h.svc.GetEscrow(c.Context(), id)
	if err != nil {
		appErr, ok := err.(*apperrors.AppError)
		if ok {
			return c.Status(appErr.StatusCode).JSON(fiber.Map{"error": appErr.Message, "code": appErr.Code})
		}
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(http.StatusOK).JSON(escrowResp)
}

func (h *Handler) ReleaseFunds(c *fiber.Ctx) error {
	id := c.Params("id")
	escrowResp, err := h.svc.ReleaseFunds(c.Context(), id)
	if err != nil {
		appErr, ok := err.(*apperrors.AppError)
		if ok {
			return c.Status(appErr.StatusCode).JSON(fiber.Map{"error": appErr.Message, "code": appErr.Code})
		}
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(http.StatusOK).JSON(escrowResp)
}

func (h *Handler) RaiseDispute(c *fiber.Ctx) error {
	id := c.Params("id")
	var req struct {
		Reason string `json:"reason"`
		RaisedBy string `json:"raised_by"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "invalid request body"})
	}

	dispute, err := h.svc.RaiseDispute(c.Context(), id, req.RaisedBy, req.Reason)
	if err != nil {
		appErr, ok := err.(*apperrors.AppError)
		if ok {
			return c.Status(appErr.StatusCode).JSON(fiber.Map{"error": appErr.Message, "code": appErr.Code})
		}
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(http.StatusCreated).JSON(dispute)
}
