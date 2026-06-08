package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/coreflex/fundabiz/internal/auth"
	"github.com/coreflex/fundabiz/internal/shared/config"
	"github.com/coreflex/fundabiz/internal/shared/db"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	fiberlogger "github.com/gofiber/fiber/v2/middleware/logger"
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

	redisAddr := cfg.RedisHost + ":" + cfg.RedisPort
	rdb, err := db.NewRedisClient(redisAddr, cfg.RedisPassword, cfg.RedisDB)
	if err != nil {
		log.Fatalf("connect redis: %v", err)
	}
	defer rdb.Close()

	log.Printf("JWT_SECRET: %s\n", os.Getenv("JWT_SECRET"))
	handler := auth.NewHandler(pool, rdb)

	app := fiber.New(fiber.Config{
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  30 * time.Second,
	})

	app.Use(cors.New())
	app.Use(fiberlogger.New())
	app.Use(recover.New())

	app.Get("/health", handler.Health)

	api := app.Group("/auth")

	api.Post("/otp/send", handler.SendOTP)
	api.Post("/otp/verify", handler.VerifyOTP)

	api.Post("/register/sme", handler.RegisterSME)
	api.Post("/register/supplier", handler.RegisterSupplier)
	api.Post("/login", handler.Login)
	api.Post("/refresh", handler.Refresh)

	api.Post("/password/reset/initiate", handler.InitiatePasswordReset)
	api.Post("/password/reset", handler.ResetPassword)

	protected := api.Group("", auth.AuthRequired)

	protected.Get("/me", handler.Me)
	protected.Post("/logout", handler.Logout)
	protected.Post("/logout-all", handler.LogoutAll)
	protected.Get("/sessions", handler.ListSessions)
	protected.Delete("/sessions/:session_id", handler.RevokeSession)
	protected.Post("/password/change", handler.ChangePassword)
	protected.Post("/validate", handler.ValidateToken)
	protected.Post("/users/create", handler.CreateSubUser)

	go func() {
		if err := app.Listen(":4001"); err != nil {
			log.Fatalf("auth service: %v", err)
		}
	}()

	log.Println("auth service started on :4001")

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	app.Shutdown()
}
