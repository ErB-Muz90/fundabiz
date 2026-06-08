package loan

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

func (h *Handler) CreateLoan(c *fiber.Ctx) error {
	var req CreateLoanRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "invalid request body"})
	}

	loan, err := h.svc.CreateLoan(c.Context(), req)
	if err != nil {
		appErr, ok := err.(*apperrors.AppError)
		if ok {
			return c.Status(appErr.StatusCode).JSON(fiber.Map{"error": appErr.Message, "code": appErr.Code})
		}
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(http.StatusCreated).JSON(loan)
}

func (h *Handler) GetLoan(c *fiber.Ctx) error {
	id := c.Params("id")
	loanResp, err := h.svc.GetLoan(c.Context(), id)
	if err != nil {
		appErr, ok := err.(*apperrors.AppError)
		if ok {
			return c.Status(appErr.StatusCode).JSON(fiber.Map{"error": appErr.Message, "code": appErr.Code})
		}
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(http.StatusOK).JSON(loanResp)
}

func (h *Handler) ListUserLoans(c *fiber.Ctx) error {
	userID := c.Params("userId")
	loans, err := h.svc.ListUserLoans(c.Context(), userID)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(http.StatusOK).JSON(loans)
}

type unlockTrancheRequest struct {
	TrancheID string `json:"tranche_id"`
}

func (h *Handler) UnlockTranche(c *fiber.Ctx) error {
	loanID := c.Params("id")
	var req unlockTrancheRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "invalid request body"})
	}

	tranche, err := h.svc.UnlockTranche(c.Context(), loanID, req.TrancheID)
	if err != nil {
		appErr, ok := err.(*apperrors.AppError)
		if ok {
			return c.Status(appErr.StatusCode).JSON(fiber.Map{"error": appErr.Message, "code": appErr.Code})
		}
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(http.StatusOK).JSON(tranche)
}
