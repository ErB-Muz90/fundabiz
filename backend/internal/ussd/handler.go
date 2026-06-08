package ussd

import (
	"strings"

	"github.com/coreflex/fundabiz/internal/ussd/flows"
	"github.com/gofiber/fiber/v2"
	"github.com/redis/go-redis/v9"
)

type USSDRequest struct {
	SessionID   string `json:"sessionId"`
	ServiceCode string `json:"serviceCode"`
	PhoneNumber string `json:"phoneNumber"`
	Text        string `json:"text"`
}

type USSDResponse struct {
	SessionID string `json:"sessionId"`
	Message   string `json:"message"`
	Type      string `json:"type"`
}

type Handler struct {
	session *SessionManager
}

func NewHandler(rdb *redis.Client) *Handler {
	return &Handler{
		session: NewSessionManager(rdb),
	}
}

func (h *Handler) Handle(c *fiber.Ctx) error {
	var req USSDRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request"})
	}

	input := req.Text
	parts := strings.Split(input, "*")
	level := len(parts)
	if input == "" {
		level = 0
	}

	session := h.session.GetSession(req.PhoneNumber)
	session.PhoneNumber = req.PhoneNumber
	session.SessionID = req.SessionID

	var response string
	var responseType string

	switch {
	case level == 0:
		response = flows.MainMenu()
		responseType = "CON"
		session.CurrentFlow = "main_menu"
	case level == 1 && parts[0] == "1":
		response = flows.CheckBalanceResponse(session.PhoneNumber)
		responseType = "END"
	case level == 1 && parts[0] == "2":
		response = flows.CheckLoanResponse(session.PhoneNumber)
		responseType = "END"
	case level == 1 && parts[0] == "3":
		session.CurrentFlow = "confirm_delivery"
		response = "Enter the order ID to confirm delivery:"
		responseType = "CON"
	case level == 2 && session.CurrentFlow == "confirm_delivery":
		response = flows.ConfirmDeliveryResponse(session.PhoneNumber, parts[1])
		responseType = "END"
	default:
		response = "Invalid option. Please try again."
		responseType = "END"
	}

	h.session.SetSession(req.PhoneNumber, session)

	return c.Status(fiber.StatusOK).JSON(USSDResponse{
		SessionID: req.SessionID,
		Message:   response,
		Type:      responseType,
	})
}
