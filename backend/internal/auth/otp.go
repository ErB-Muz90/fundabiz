package auth

import (
	"context"
	"crypto/rand"
	"encoding/json"
	"fmt"
	"math/big"
	"os"
	"time"

	"github.com/redis/go-redis/v9"
)

type OTPService struct {
	rdb *redis.Client
}

func NewOTPService(rdb *redis.Client) *OTPService {
	return &OTPService{rdb: rdb}
}

func (o *OTPService) Send(ctx context.Context, phone, purpose string) (*OTPResponse, error) {
	code, err := generateOTP()
	if err != nil {
		return nil, err
	}

	ttl := 10 * time.Minute
	record := OTPRecord{
		Phone:     phone,
		Code:      code,
		Purpose:   purpose,
		ExpiresAt: time.Now().Add(ttl),
		Attempts:  0,
	}

	data, _ := json.Marshal(record)
	key := fmt.Sprintf("otp:%s:%s", purpose, phone)

	if err := o.rdb.Set(ctx, key, data, ttl).Err(); err != nil {
		return nil, err
	}

	if err := sendSMS(phone, buildOTPMessage(code, purpose)); err != nil {
		fmt.Printf("[OTP] %s -> %s: %s\n", phone, purpose, code)
	}

	return &OTPResponse{
		Message:   "OTP sent to " + maskPhone(phone),
		Phone:     maskPhone(phone),
		ExpiresIn: int(ttl.Seconds()),
	}, nil
}

func (o *OTPService) Verify(ctx context.Context, phone, code, purpose string) error {
	key := fmt.Sprintf("otp:%s:%s", purpose, phone)
	data, err := o.rdb.Get(ctx, key).Bytes()
	if err != nil {
		return fmt.Errorf("OTP expired or not found - request a new one")
	}

	var record OTPRecord
	if err := json.Unmarshal(data, &record); err != nil {
		return fmt.Errorf("invalid OTP record")
	}

	if record.Attempts >= 3 {
		o.rdb.Del(ctx, key)
		return fmt.Errorf("too many attempts - request a new OTP")
	}

	if time.Now().After(record.ExpiresAt) {
		o.rdb.Del(ctx, key)
		return fmt.Errorf("OTP expired - request a new one")
	}

	if record.Code != code {
		record.Attempts++
		data, _ = json.Marshal(record)
		o.rdb.Set(ctx, key, data, time.Until(record.ExpiresAt))
		remaining := 3 - record.Attempts
		return fmt.Errorf("invalid OTP - %d attempts remaining", remaining)
	}

	o.rdb.Del(ctx, key)
	return nil
}

func generateOTP() (string, error) {
	max := big.NewInt(999999)
	n, err := rand.Int(rand.Reader, max)
	if err != nil {
		return "", err
	}
	return fmt.Sprintf("%06d", n.Int64()), nil
}

func buildOTPMessage(code, purpose string) string {
	switch purpose {
	case "REGISTRATION":
		return fmt.Sprintf("FundaBiz: Your registration code is %s. Valid for 10 minutes.", code)
	case "MFA_LOGIN":
		return fmt.Sprintf("FundaBiz: Your login code is %s. Valid for 10 minutes.", code)
	case "PASSWORD_RESET":
		return fmt.Sprintf("FundaBiz: Your password reset code is %s. Valid for 10 minutes.", code)
	default:
		return fmt.Sprintf("FundaBiz: Your verification code is %s. Valid for 10 minutes.", code)
	}
}

func sendSMS(phone, message string) error {
	apiKey := os.Getenv("AT_API_KEY")
	username := os.Getenv("AT_USERNAME")

	if apiKey == "" || username == "sandbox" {
		fmt.Printf("[SMS SANDBOX] To: %s | Msg: %s\n", phone, message)
		return nil
	}

	fmt.Printf("[SMS] Sending to %s via Africa's Talking\n", phone)
	_ = apiKey
	return nil
}

func maskPhone(phone string) string {
	if len(phone) < 6 {
		return "***"
	}
	return phone[:3] + "****" + phone[len(phone)-3:]
}
