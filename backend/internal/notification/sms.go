package notification

import (
	"github.com/coreflex/fundabiz/internal/shared/config"
)

func SendSMS(cfg *config.Config, phone, message string) error {
	_ = cfg.ATAPIKey
	_ = cfg.ATUsername
	_ = cfg.ATSenderID
	_ = phone
	_ = message
	return nil
}

type ATSMSRequest struct {
	Username string `json:"username"`
	To       string `json:"to"`
	Message  string `json:"message"`
	From     string `json:"from"`
}

func FormatSMSRequest(cfg *config.Config, to, message string) *ATSMSRequest {
	return &ATSMSRequest{
		Username: cfg.ATUsername,
		To:       to,
		Message:  message,
		From:     cfg.ATSenderID,
	}
}
