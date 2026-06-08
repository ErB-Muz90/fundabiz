package main

import (
	"log"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"github.com/coreflex/fundabiz/internal/shared/config"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/limiter"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/gofiber/fiber/v2/middleware/proxy"
)

func main() {
	cfg := config.LoadConfig()

	app := fiber.New(fiber.Config{
		AppName: "FundaBiz Gateway",
	})

	app.Use(recover.New())
	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowMethods: strings.Join([]string{fiber.MethodGet, fiber.MethodPost, fiber.MethodPut, fiber.MethodDelete, fiber.MethodPatch, fiber.MethodOptions}, ","),
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
	}))

	app.Use(limiter.New(limiter.Config{
		Max:        100,
		Expiration: 1 * time.Minute,
	}))

	app.Get("/health", func(c *fiber.Ctx) error {
		_ = cfg
		return c.Status(http.StatusOK).JSON(fiber.Map{
			"status":  "healthy",
			"service": "fundabiz-gateway",
			"version": "1.0.0",
		})
	})

	routes := map[string]string{
		"/api/v1/auth":     "http://localhost:4001/auth",
		"/api/v1/loans":    "http://localhost:4002/loans",
		"/api/v1/escrow":   "http://localhost:4003/escrow",
		"/api/v1/wallets":  "http://localhost:4004/wallets",
		"/api/v1/mpesa":    "http://localhost:4005/mpesa",
		"/api/v1/kyc":      "http://localhost:4006/kyc",
		"/api/v1/fraud":    "http://localhost:4007/fraud",
		"/api/v1/tracking": "http://localhost:4010/tracking",
		"/api/v1/ussd":     "http://localhost:4011/ussd",
	}

	for prefix, target := range routes {
		path := prefix + "/*"
		app.All(path, func(c *fiber.Ctx) error {
			suffix := strings.TrimPrefix(c.Path(), prefix)
			url := target + suffix
			if err := proxy.Do(c, url); err != nil {
				log.Printf("proxy error: %v", err)
				return c.Status(http.StatusBadGateway).JSON(fiber.Map{
					"error": "service unavailable",
				})
			}
			return nil
		})
	}

	go func() {
		if err := app.Listen(":4000"); err != nil {
			log.Fatalf("gateway: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	app.Shutdown()
}
