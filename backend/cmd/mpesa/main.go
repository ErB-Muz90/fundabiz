package main

import (
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/coreflex/fundabiz/internal/mpesa"
	"github.com/coreflex/fundabiz/internal/shared/config"
	"github.com/coreflex/fundabiz/internal/shared/db"
	"github.com/coreflex/fundabiz/internal/shared/idempotency"
	"github.com/coreflex/fundabiz/internal/shared/queue"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
)

func main() {
	cfg := config.LoadConfig()

	redisAddr := cfg.RedisHost + ":" + cfg.RedisPort
	rdb, err := db.NewRedisClient(redisAddr, cfg.RedisPassword, cfg.RedisDB)
	if err != nil {
		log.Fatalf("connect redis: %v", err)
	}
	defer rdb.Close()

	rmqConn, err := queue.ConnectRabbitMQ(cfg.RabbitMQHost, cfg.RabbitMQPort, cfg.RabbitMQUser, cfg.RabbitMQPassword)
	if err != nil {
		log.Fatalf("connect rabbitmq: %v", err)
	}
	defer rmqConn.Close()

	rmqCh, err := rmqConn.Channel()
	if err != nil {
		log.Fatalf("open rabbitmq channel: %v", err)
	}
	defer rmqCh.Close()

	idempotencyStore := idempotency.NewIdempotencyStore(rdb)
	handler := mpesa.NewHandler(cfg, rmqCh, idempotencyStore)

	app := fiber.New()
	app.Use(cors.New())
	app.Use(logger.New())
	app.Use(recover.New())

	app.Get("/health", func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"status":  "healthy",
			"service": "fundabiz-mpesa",
			"version": "1.0.0",
		})
	})

	app.Use(mpesa.IPWhitelistMiddleware())

	app.Post("/mpesa/callback", handler.Callback)

	go func() {
		if err := app.Listen(":4005"); err != nil {
			log.Fatalf("mpesa service: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	app.Shutdown()
}
