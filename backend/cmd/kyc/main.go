package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/coreflex/fundabiz/internal/kyc"
	"github.com/coreflex/fundabiz/internal/shared/config"
	"github.com/coreflex/fundabiz/internal/shared/db"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
)

func main() {
	cfg := config.LoadConfig()

	pgDSN := "postgres://" + cfg.PostgresUser + ":" + cfg.PostgresPassword + "@" + cfg.PostgresHost + ":" + cfg.PostgresPort + "/" + cfg.PostgresDB + "?sslmode=" + cfg.PostgresSSLMode
	pool, err := db.NewPool(context.Background(), pgDSN)
	if err != nil {
		log.Fatalf("connect postgres: %v", err)
	}
	defer pool.Close()

	handler := kyc.NewHandler(pool)

	app := fiber.New()
	app.Use(cors.New())
	app.Use(logger.New())
	app.Use(recover.New())

	app.Get("/health", func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"status":  "healthy",
			"service": "fundabiz-kyc",
			"version": "1.0.0",
		})
	})

	api := app.Group("/kyc/applications")
	api.Post("/", handler.SubmitApplication)
	api.Get("/", handler.GetQueue)
	api.Get("/:id", handler.GetApplication)
	api.Post("/:id/approve", handler.Approve)
	api.Post("/:id/reject", handler.Reject)
	api.Post("/:id/flag", handler.Flag)

	go func() {
		if err := app.Listen(":4006"); err != nil {
			log.Fatalf("kyc service: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	app.Shutdown()
}
