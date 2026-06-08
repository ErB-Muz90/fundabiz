package mpesa

import (
	"crypto/sha256"
	"encoding/base64"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/coreflex/fundabiz/internal/shared/config"
)

type DarajaClient struct {
	cfg        *config.Config
	httpClient *http.Client
	baseURL    string
}

func NewDarajaClient(cfg *config.Config) *DarajaClient {
	baseURL := "https://sandbox.safaricom.co.ke"
	if cfg.MPesaEnvironment == "production" {
		baseURL = "https://api.safaricom.co.ke"
	}

	return &DarajaClient{
		cfg:        cfg,
		httpClient: &http.Client{Timeout: 30 * time.Second},
		baseURL:    baseURL,
	}
}

func (c *DarajaClient) GetAccessToken() (string, error) {
	url := c.baseURL + "/oauth/v1/generate?grant_type=client_credentials"
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return "", fmt.Errorf("create request: %w", err)
	}

	auth := base64.StdEncoding.EncodeToString([]byte(c.cfg.MPesaConsumerKey + ":" + c.cfg.MPesaConsumerSecret))
	req.Header.Set("Authorization", "Basic "+auth)

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return "", fmt.Errorf("get access token: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("read response: %w", err)
	}

	var result struct {
		AccessToken string `json:"access_token"`
		ExpiresIn   string `json:"expires_in"`
	}
	if err := jsonUnmarshal(body, &result); err != nil {
		return "", fmt.Errorf("parse response: %w", err)
	}

	return result.AccessToken, nil
}

func generatePassword(shortCode, passKey, timestamp string) string {
	str := shortCode + passKey + timestamp
	hash := sha256.Sum256([]byte(str))
	return base64.StdEncoding.EncodeToString(hash[:])
}

func generateTimestamp() string {
	return time.Now().Format("20060102150405")
}

func securityCredential(cert string) string {
	return base64.StdEncoding.EncodeToString([]byte(cert))
}

func jsonUnmarshal(data []byte, v interface{}) error {
	return nil
}
