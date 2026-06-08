package wallet

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

func (h *Handler) GetWallet(c *fiber.Ctx) error {
	userID := c.Params("userId")
	walletResp, err := h.svc.GetWallet(c.Context(), userID)
	if err != nil {
		appErr, ok := err.(*apperrors.AppError)
		if ok {
			return c.Status(appErr.StatusCode).JSON(fiber.Map{"error": appErr.Message, "code": appErr.Code})
		}
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(http.StatusOK).JSON(walletResp)
}

type depositRequest struct {
	Amount  float64 `json:"amount"`
	Method  string  `json:"method"`
	Reference string `json:"reference"`
}

func (h *Handler) Deposit(c *fiber.Ctx) error {
	userID := c.Params("userId")
	var req depositRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "invalid request body"})
	}

	walletResp, err := h.svc.Deposit(c.Context(), userID, req.Amount, req.Method, req.Reference)
	if err != nil {
		appErr, ok := err.(*apperrors.AppError)
		if ok {
			return c.Status(appErr.StatusCode).JSON(fiber.Map{"error": appErr.Message, "code": appErr.Code})
		}
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(http.StatusOK).JSON(walletResp)
}

type transferRequest struct {
	ToUserID string  `json:"to_user_id"`
	Amount   float64 `json:"amount"`
	Reference string `json:"reference"`
}

func (h *Handler) Transfer(c *fiber.Ctx) error {
	userID := c.Params("userId")
	var req transferRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "invalid request body"})
	}

	walletResp, err := h.svc.Transfer(c.Context(), userID, req.ToUserID, req.Amount, req.Reference)
	if err != nil {
		appErr, ok := err.(*apperrors.AppError)
		if ok {
			return c.Status(appErr.StatusCode).JSON(fiber.Map{"error": appErr.Message, "code": appErr.Code})
		}
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(http.StatusOK).JSON(walletResp)
}
