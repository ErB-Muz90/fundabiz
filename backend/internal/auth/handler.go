package auth

import (
	"errors"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"
	"github.com/coreflex/fundabiz/internal/shared/types"
)

type Handler struct {
	svc *Service
}

func NewHandler(pool *pgxpool.Pool, rdb *redis.Client) *Handler {
	return &Handler{
		svc: NewService(pool, rdb),
	}
}

func (h *Handler) Health(c *fiber.Ctx) error {
	return c.Status(200).JSON(fiber.Map{
		"status":  "ok",
		"service": "auth",
		"version": "1.0.0",
	})
}

func (h *Handler) RegisterSME(c *fiber.Ctx) error {
	var req RegisterSMERequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid request body"})
	}

	resp, err := h.svc.RegisterSME(c.Context(), req)
	if err != nil {
		return mapServiceError(c, err)
	}
	return c.Status(201).JSON(resp)
}

func (h *Handler) RegisterSupplier(c *fiber.Ctx) error {
	var req RegisterSupplierRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid request body"})
	}

	resp, err := h.svc.RegisterSupplier(c.Context(), req)
	if err != nil {
		return mapServiceError(c, err)
	}
	return c.Status(201).JSON(resp)
}

func (h *Handler) CreateSubUser(c *fiber.Ctx) error {
	claims := c.Locals("claims").(*Claims)

	var req CreateSubUserRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid request body"})
	}

	if claims.Role != types.RoleSuperAdmin && claims.Role != types.RoleRegionalAdmin && claims.Role != types.RoleAgent {
		return c.Status(403).JSON(fiber.Map{"error": "insufficient permissions to create users"})
	}

	user, err := h.svc.CreateSubUser(c.Context(), claims.UserID, req)
	if err != nil {
		return mapServiceError(c, err)
	}
	return c.Status(201).JSON(fiber.Map{
		"message":    "user created successfully",
		"user_id":    user.ID,
		"role":       user.Role,
		"status":     user.Status,
	})
}

func (h *Handler) Login(c *fiber.Ctx) error {
	var req LoginRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid request body"})
	}

	resp, err := h.svc.Login(c.Context(), req, c.Get("User-Agent"), c.IP())
	if err != nil {
		return mapServiceError(c, err)
	}
	return c.Status(200).JSON(resp)
}

func (h *Handler) Refresh(c *fiber.Ctx) error {
	var req RefreshRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid request body"})
	}

	resp, err := h.svc.RefreshToken(c.Context(), req.RefreshToken, c.Get("User-Agent"), c.IP())
	if err != nil {
		return mapServiceError(c, err)
	}
	return c.Status(200).JSON(resp)
}

func (h *Handler) Logout(c *fiber.Ctx) error {
	claims := c.Locals("claims").(*Claims)
	if err := h.svc.Logout(c.Context(), claims.SessionID); err != nil {
		return mapServiceError(c, err)
	}
	return c.Status(200).JSON(fiber.Map{"message": "logged out successfully"})
}

func (h *Handler) LogoutAll(c *fiber.Ctx) error {
	claims := c.Locals("claims").(*Claims)
	if err := h.svc.RevokeAllSessions(c.Context(), claims.UserID); err != nil {
		return mapServiceError(c, err)
	}
	return c.Status(200).JSON(fiber.Map{"message": "all sessions revoked"})
}

func (h *Handler) ListSessions(c *fiber.Ctx) error {
	claims := c.Locals("claims").(*Claims)
	sessions, err := h.svc.ListSessions(c.Context(), claims.UserID, claims.SessionID)
	if err != nil {
		return mapServiceError(c, err)
	}
	return c.Status(200).JSON(fiber.Map{"sessions": sessions})
}

func (h *Handler) RevokeSession(c *fiber.Ctx) error {
	claims := c.Locals("claims").(*Claims)
	sessionID := c.Params("session_id")

	if sessionID == claims.SessionID {
		return c.Status(400).JSON(fiber.Map{"error": "cannot revoke current session - use logout instead"})
	}

	if err := h.svc.Logout(c.Context(), sessionID); err != nil {
		return mapServiceError(c, err)
	}
	return c.Status(200).JSON(fiber.Map{"message": "session revoked"})
}

func (h *Handler) SendOTP(c *fiber.Ctx) error {
	var req struct {
		Phone   string `json:"phone"`
		Purpose string `json:"purpose"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid request body"})
	}

	if req.Phone == "" || req.Purpose == "" {
		return c.Status(400).JSON(fiber.Map{"error": "phone and purpose are required"})
	}

	validPurposes := map[string]bool{"REGISTRATION": true, "PASSWORD_RESET": true, "MFA_LOGIN": true}
	if !validPurposes[req.Purpose] {
		return c.Status(400).JSON(fiber.Map{"error": "invalid purpose"})
	}

	resp, err := h.svc.SendOTP(c.Context(), req.Phone, req.Purpose)
	if err != nil {
		return mapServiceError(c, err)
	}
	return c.Status(200).JSON(resp)
}

func (h *Handler) VerifyOTP(c *fiber.Ctx) error {
	var req OTPVerifyRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid request body"})
	}

	if err := h.svc.VerifyOTP(c.Context(), req.Phone, req.OTP, req.Purpose); err != nil {
		return mapServiceError(c, err)
	}
	return c.Status(200).JSON(fiber.Map{"message": "OTP verified successfully"})
}

func (h *Handler) InitiatePasswordReset(c *fiber.Ctx) error {
	var req struct {
		Phone string `json:"phone"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid request body"})
	}

	resp, err := h.svc.InitiatePasswordReset(c.Context(), req.Phone)
	if err != nil {
		return mapServiceError(c, err)
	}
	return c.Status(200).JSON(resp)
}

func (h *Handler) ResetPassword(c *fiber.Ctx) error {
	var req PasswordResetRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid request body"})
	}

	if err := h.svc.ResetPassword(c.Context(), req); err != nil {
		return mapServiceError(c, err)
	}
	return c.Status(200).JSON(fiber.Map{"message": "password reset successfully"})
}

func (h *Handler) ChangePassword(c *fiber.Ctx) error {
	claims := c.Locals("claims").(*Claims)

	var req ChangePasswordRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid request body"})
	}

	if err := h.svc.ChangePassword(c.Context(), claims.UserID, req.CurrentPassword, req.NewPassword); err != nil {
		return mapServiceError(c, err)
	}
	return c.Status(200).JSON(fiber.Map{"message": "password changed successfully"})
}

func (h *Handler) Me(c *fiber.Ctx) error {
	claims := c.Locals("claims").(*Claims)
	user, err := h.svc.GetUser(c.Context(), claims.UserID)
	if err != nil {
		return mapServiceError(c, err)
	}
	return c.Status(200).JSON(user)
}

func (h *Handler) ValidateToken(c *fiber.Ctx) error {
	claims := c.Locals("claims").(*Claims)
	return c.Status(200).JSON(fiber.Map{
		"valid":      true,
		"user_id":    claims.UserID,
		"role":       claims.Role,
		"county_id":  claims.CountyID,
		"session_id": claims.SessionID,
	})
}

func mapServiceError(c *fiber.Ctx, err error) error {
	msg := err.Error()
	if msg == "invalid credentials" || msg == "invalid or expired refresh token" ||
		msg == "session not found" {
		return c.Status(401).JSON(fiber.Map{"error": msg})
	}
	if msg == "insufficient permissions" || msg == "you do not have permission to create users" ||
		len(msg) > 30 && (msg[:13] == "you cannot" || msg[:21] == "regional admin can") {
		return c.Status(403).JSON(fiber.Map{"error": msg})
	}
	if len(msg) > 7 && (msg[:6] == "create" || msg[:6] == "insert") {
		return c.Status(500).JSON(fiber.Map{"error": "internal server error"})
	}
	return c.Status(400).JSON(fiber.Map{"error": msg})
}

// Ensure types are used
var _ = uuid.UUID{}
var _ = errors.New
