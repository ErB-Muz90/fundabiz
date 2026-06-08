package kyc

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

type submitApplicationRequest struct {
	UserID            string `json:"user_id"`
	BusinessName      string `json:"business_name"`
	BusinessRegNumber string `json:"business_reg_number"`
	BusinessAgeMonths int    `json:"business_age_months"`
	CountyID          string `json:"county_id"`
	IDNumber          string `json:"id_number"`
	KCPE              string `json:"kcpe,omitempty"`
}

func (h *Handler) SubmitApplication(c *fiber.Ctx) error {
	var req submitApplicationRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "invalid request body"})
	}

	app, err := h.svc.SubmitApplication(c.Context(), req.UserID, req.BusinessName, req.BusinessRegNumber, req.BusinessAgeMonths, req.CountyID, req.IDNumber, req.KCPE)
	if err != nil {
		appErr, ok := err.(*apperrors.AppError)
		if ok {
			return c.Status(appErr.StatusCode).JSON(fiber.Map{"error": appErr.Message, "code": appErr.Code})
		}
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(http.StatusCreated).JSON(app)
}

func (h *Handler) GetQueue(c *fiber.Ctx) error {
	status := c.Query("status", "")
	countyID := c.Query("county_id", "")

	apps, err := h.svc.GetQueue(c.Context(), status, countyID)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(http.StatusOK).JSON(apps)
}

func (h *Handler) GetApplication(c *fiber.Ctx) error {
	id := c.Params("id")
	app, err := h.svc.GetApplication(c.Context(), id)
	if err != nil {
		appErr, ok := err.(*apperrors.AppError)
		if ok {
			return c.Status(appErr.StatusCode).JSON(fiber.Map{"error": appErr.Message, "code": appErr.Code})
		}
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(http.StatusOK).JSON(app)
}

type decisionRequest struct {
	ReviewerID string `json:"reviewer_id"`
	Reason     string `json:"reason"`
}

func (h *Handler) Approve(c *fiber.Ctx) error {
	id := c.Params("id")
	var req decisionRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "invalid request body"})
	}

	app, err := h.svc.ProcessDecision(c.Context(), id, req.ReviewerID, "approved", req.Reason)
	if err != nil {
		appErr, ok := err.(*apperrors.AppError)
		if ok {
			return c.Status(appErr.StatusCode).JSON(fiber.Map{"error": appErr.Message, "code": appErr.Code})
		}
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(http.StatusOK).JSON(app)
}

func (h *Handler) Reject(c *fiber.Ctx) error {
	id := c.Params("id")
	var req decisionRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "invalid request body"})
	}

	app, err := h.svc.ProcessDecision(c.Context(), id, req.ReviewerID, "rejected", req.Reason)
	if err != nil {
		appErr, ok := err.(*apperrors.AppError)
		if ok {
			return c.Status(appErr.StatusCode).JSON(fiber.Map{"error": appErr.Message, "code": appErr.Code})
		}
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(http.StatusOK).JSON(app)
}

func (h *Handler) Flag(c *fiber.Ctx) error {
	id := c.Params("id")
	var req decisionRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "invalid request body"})
	}

	app, err := h.svc.ProcessDecision(c.Context(), id, req.ReviewerID, "flagged", req.Reason)
	if err != nil {
		appErr, ok := err.(*apperrors.AppError)
		if ok {
			return c.Status(appErr.StatusCode).JSON(fiber.Map{"error": appErr.Message, "code": appErr.Code})
		}
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(http.StatusOK).JSON(app)
}
