package notification

import (
	"fmt"

	"github.com/coreflex/fundabiz/internal/shared/config"
)

type FCMMessage struct {
	To   string `json:"to"`
	Notification struct {
		Title string `json:"title"`
		Body  string `json:"body"`
	} `json:"notification"`
}

func SendPushNotification(cfg *config.Config, deviceToken, title, body string) error {
	_ = cfg.FirebaseCredentialsFile
	_ = deviceToken
	_ = title
	_ = body
	return nil
}

func BuildFCMMessage(token, title, body string) *FCMMessage {
	return &FCMMessage{
		To: token,
		Notification: struct {
			Title string `json:"title"`
			Body  string `json:"body"`
		}{
			Title: title,
			Body:  body,
		},
	}
}

func SendFirebaseMessage(cfg *config.Config, msg *FCMMessage) error {
	_ = msg
	return fmt.Errorf("firebase not configured")
}
