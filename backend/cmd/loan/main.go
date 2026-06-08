package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/coreflex/fundabiz/internal/loan"
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

	handler := loan.NewHandler(pool)

	app := fiber.New()
	app.Use(cors.New())
	app.Use(logger.New())
	app.Use(recover.New())

	app.Get("/health", func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"status":  "healthy",
			"service": "fundabiz-loan",
			"version": "1.0.0",
		})
	})

	api := app.Group("/loans")
	api.Post("/", handler.CreateLoan)
	api.Get("/:id", handler.GetLoan)
	api.Get("/user/:userId", handler.ListUserLoans)
	api.Post("/:id/tranches", handler.UnlockTranche)

	go func() {
		if err := app.Listen(":4002"); err != nil {
			log.Fatalf("loan service: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	app.Shutdown()
}
