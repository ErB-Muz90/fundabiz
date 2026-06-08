package notification

import (
	"fmt"
	"net/smtp"

	"github.com/coreflex/fundabiz/internal/shared/config"
)

type EmailSender struct {
	host     string
	port     string
	user     string
	password string
	from     string
}

func NewEmailSender(cfg *config.Config) *EmailSender {
	return &EmailSender{
		host:     cfg.SMTPHost,
		port:     cfg.SMTPPort,
		user:     cfg.SMTPUser,
		password: cfg.SMTPPassword,
		from:     cfg.SMTPFrom,
	}
}

func SendEmail(cfg *config.Config, to, subject, body string) error {
	sender := NewEmailSender(cfg)

	auth := smtp.PlainAuth("", sender.user, sender.password, sender.host)

	msg := fmt.Sprintf("From: %s\r\nTo: %s\r\nSubject: %s\r\nMIME-Version: 1.0\r\nContent-Type: text/html; charset=UTF-8\r\n\r\n%s",
		sender.from, to, subject, body)

	addr := fmt.Sprintf("%s:%s", sender.host, sender.port)
	if err := smtp.SendMail(addr, auth, sender.from, []string{to}, []byte(msg)); err != nil {
		return fmt.Errorf("send email: %w", err)
	}

	return nil
}
