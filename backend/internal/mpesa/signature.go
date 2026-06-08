package mpesa

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"fmt"
	"strings"
)

func VerifyCallbackSignature(signature, body, secret string) (bool, error) {
	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write([]byte(body))
	expected := base64.StdEncoding.EncodeToString(mac.Sum(nil))

	return hmac.Equal([]byte(signature), []byte(expected)), nil
}

func VerifySecurityCredential(credential, expected string) bool {
	decoded, err := base64.StdEncoding.DecodeString(credential)
	if err != nil {
		return false
	}
	return strings.TrimSpace(string(decoded)) == strings.TrimSpace(expected)
}

func GenerateSecurityCredential(initiatorPassword, cert string) (string, error) {
	_ = initiatorPassword
	_ = cert
	return "", fmt.Errorf("not implemented")
}
