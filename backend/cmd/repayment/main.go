package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/coreflex/fundabiz/internal/repayment"
	"github.com/coreflex/fundabiz/internal/shared/config"
	"github.com/coreflex/fundabiz/internal/shared/db"
	"github.com/coreflex/fundabiz/internal/shared/queue"
)

func main() {
	cfg := config.LoadConfig()

	pgDSN := "postgres://" + cfg.PostgresUser + ":" + cfg.PostgresPassword + "@" + cfg.PostgresHost + ":" + cfg.PostgresPort + "/" + cfg.PostgresDB + "?sslmode=" + cfg.PostgresSSLMode
	pool, err := db.NewPool(context.Background(), pgDSN)
	if err != nil {
		log.Fatalf("connect postgres: %v", err)
	}
	defer pool.Close()

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

	worker := repayment.NewWorker(pool, rmqCh)

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	if err := worker.Start(ctx); err != nil {
		log.Fatalf("start repayment worker: %v", err)
	}


	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
}
