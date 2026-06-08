package auth_test

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/coreflex/fundabiz/internal/auth"
	"github.com/coreflex/fundabiz/internal/shared/config"
	"github.com/coreflex/fundabiz/internal/shared/db"
	"github.com/gofiber/fiber/v2"
	"github.com/stretchr/testify/assert"
)

func TestAuthService(t *testing.T) {
	cfg := config.LoadConfig()
	pgDSN := "postgres://" + cfg.PostgresUser + ":" + cfg.PostgresPassword + "@" + cfg.PostgresHost + ":" + cfg.PostgresPort + "/" + cfg.PostgresDB + "?sslmode=" + cfg.PostgresSSLMode
	pool, err := db.NewPool(context.Background(), pgDSN)
	assert.NoError(t, err)
	defer pool.Close()

	redisAddr := cfg.RedisHost + ":" + cfg.RedisPort
	rdb, err := db.NewRedisClient(redisAddr, cfg.RedisPassword, cfg.RedisDB)
	assert.NoError(t, err)
	defer rdb.Close()

	handler := auth.NewHandler(pool, rdb)

	app := fiber.New()
	app.Post("/auth/login", handler.Login)

	loginBody := map[string]string{
		"email":    "admin@fundabiz.co.ke",
		"password": "Admin123!",
	}

	req := httptest.NewRequest("POST", "/auth/login", toJSON(loginBody))
	req.Header.Set("Content-Type", "application/json")
	resp, err := app.Test(req)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, resp.StatusCode)
}

func toJSON(v interface{}) *bytes.Buffer {
	buf := new(bytes.Buffer)
	json.NewEncoder(buf).Encode(v)
	return buf
}