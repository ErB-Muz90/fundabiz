package kyc

import (
	"fmt"
	"time"
)

func GeneratePresignedUploadURL(key string) (string, error) {
	_ = key
	return "", fmt.Errorf("s3 not configured")
}

func GeneratePresignedViewURL(key string) (string, error) {
	_ = key
	return "", fmt.Errorf("s3 not configured")
}

type DocumentUploadURL struct {
	URL        string `json:"url"`
	Key        string `json:"key"`
	ExpiresAt  time.Time `json:"expires_at"`
}

func GetDocumentKey(appID, docType, filename string) string {
	return fmt.Sprintf("kyc/%s/%s/%s", appID, docType, filename)
}
