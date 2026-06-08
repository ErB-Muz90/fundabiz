package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"os"

	"github.com/coreflex/fundabiz/internal/shared/config"
	"github.com/coreflex/fundabiz/internal/shared/db"
)

func main() {
	down := flag.Bool("down", false, "Run down migrations instead of up")
	flag.Parse()

	cfg := config.LoadConfig()

	pgDSN := "postgres://" + cfg.PostgresUser + ":" + cfg.PostgresPassword + "@" + cfg.PostgresHost + ":" + cfg.PostgresPort + "/" + cfg.PostgresDB + "?sslmode=" + cfg.PostgresSSLMode

	pool, err := db.NewPool(context.Background(), pgDSN)
	if err != nil {
		log.Fatalf("connect to database: %v", err)
	}
	defer pool.Close()

	migrationsPath := "migrations"
	if _, err := os.Stat(migrationsPath); os.IsNotExist(err) {
		log.Fatalf("migrations directory not found: %s", migrationsPath)
	}

	if *down {
		fmt.Println("Running down migrations...")
		if err := db.RunDownMigrations(pgDSN, migrationsPath); err != nil {
			log.Fatalf("run down migrations: %v", err)
		}
		fmt.Println("Down migrations completed successfully.")
	} else {
		fmt.Println("Running up migrations...")
		if err := db.RunMigrations(pgDSN, migrationsPath); err != nil {
			log.Fatalf("run up migrations: %v", err)
		}
		fmt.Println("Migrations completed successfully.")
	}
}
