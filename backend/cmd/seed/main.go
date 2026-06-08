package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/coreflex/fundabiz/internal/shared/config"
	shareddb "github.com/coreflex/fundabiz/internal/shared/db"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"golang.org/x/crypto/bcrypt"
)

type County struct {
	ID   string
	Name string
	Code string
}

var counties = []County{
	{Name: "Mombasa", Code: "001"},
	{Name: "Kwale", Code: "002"},
	{Name: "Kilifi", Code: "003"},
	{Name: "Tana River", Code: "004"},
	{Name: "Lamu", Code: "005"},
	{Name: "Taita Taveta", Code: "006"},
	{Name: "Garissa", Code: "007"},
	{Name: "Wajir", Code: "008"},
	{Name: "Mandera", Code: "009"},
	{Name: "Marsabit", Code: "010"},
	{Name: "Isiolo", Code: "011"},
	{Name: "Meru", Code: "012"},
	{Name: "Tharaka Nithi", Code: "013"},
	{Name: "Embu", Code: "014"},
	{Name: "Kitui", Code: "015"},
	{Name: "Machakos", Code: "016"},
	{Name: "Makueni", Code: "017"},
	{Name: "Nyandarua", Code: "018"},
	{Name: "Nyeri", Code: "019"},
	{Name: "Kirinyaga", Code: "020"},
	{Name: "Murang'a", Code: "021"},
	{Name: "Kiambu", Code: "022"},
	{Name: "Turkana", Code: "023"},
	{Name: "West Pokot", Code: "024"},
	{Name: "Samburu", Code: "025"},
	{Name: "Trans Nzoia", Code: "026"},
	{Name: "Uasin Gishu", Code: "027"},
	{Name: "Elgeyo Marakwet", Code: "028"},
	{Name: "Nandi", Code: "029"},
	{Name: "Baringo", Code: "030"},
	{Name: "Laikipia", Code: "031"},
	{Name: "Nakuru", Code: "032"},
	{Name: "Narok", Code: "033"},
	{Name: "Kajiado", Code: "034"},
	{Name: "Kericho", Code: "035"},
	{Name: "Bomet", Code: "036"},
	{Name: "Kakamega", Code: "037"},
	{Name: "Vihiga", Code: "038"},
	{Name: "Bungoma", Code: "039"},
	{Name: "Busia", Code: "040"},
	{Name: "Siaya", Code: "041"},
	{Name: "Kisumu", Code: "042"},
	{Name: "Homa Bay", Code: "043"},
	{Name: "Migori", Code: "044"},
	{Name: "Kisii", Code: "045"},
	{Name: "Nyamira", Code: "046"},
	{Name: "Nairobi", Code: "047"},
}

func main() {
	cfg := config.LoadConfig()

	pgDSN := "postgres://" + cfg.PostgresUser + ":" + cfg.PostgresPassword + "@" + cfg.PostgresHost + ":" + cfg.PostgresPort + "/" + cfg.PostgresDB + "?sslmode=" + cfg.PostgresSSLMode
	pool, err := shareddb.NewPool(context.Background(), pgDSN)
	if err != nil {
		log.Fatalf("connect to database: %v", err)
	}
	defer pool.Close()

	ctx := context.Background()

	seedCounties(ctx, pool)
	seedSuperAdmin(ctx, pool, cfg)
	seedDevData(ctx, pool)

	fmt.Println("Seeding completed successfully.")
}

func seedCounties(ctx context.Context, pool *pgxpool.Pool) {
	for _, county := range counties {
		id := uuid.New().String()
		query := `INSERT INTO counties (id, name, code, created_at) VALUES ($1, $2, $3, $4) ON CONFLICT (code) DO NOTHING`
		_, err := pool.Exec(ctx, query, id, county.Name, county.Code, time.Now())
		if err != nil {
			log.Printf("seed county %s: %v", county.Name, err)
		}
	}
	fmt.Printf("Seeded %d counties\n", len(counties))
}

func seedSuperAdmin(ctx context.Context, pool *pgxpool.Pool, cfg *config.Config) {
	hash, err := bcrypt.GenerateFromPassword([]byte("Admin123!"), bcrypt.DefaultCost)
	if err != nil {
		log.Fatalf("hash password: %v", err)
	}

	id := uuid.New().String()
	query := `INSERT INTO users (id, email, phone, password_hash, role, county_id, business_name, status, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, (SELECT id FROM counties WHERE code = $6), $7, $8, $9, $10) ON CONFLICT (email) DO NOTHING`
	_, err = pool.Exec(ctx, query,
		id, "admin@fundabiz.co.ke", "254700000000", string(hash),
		"SUPER_ADMIN", "047", "FundaBiz Admin", "ACTIVE", time.Now(), time.Now(),
	)
	if err != nil {
		log.Printf("seed super admin: %v", err)
	} else {
		fmt.Println("Seeded super admin user")
	}
}

func seedDevData(ctx context.Context, pool *pgxpool.Pool) {
	hash, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)

	users := []struct {
		Email        string
		Phone        string
		Role         string
		CountyID     string
		BusinessName string
	}{
		{"regional@fundabiz.co.ke", "254711111111", "REGIONAL_ADMIN", "001", "Regional Admin Mombasa"},
		{"sme1@fundabiz.co.ke", "254722222222", "SME_OWNER", "001", "Mombasa Fresh Produce"},
		{"sme2@fundabiz.co.ke", "254733333333", "SME_OWNER", "047", "Nairobi Tech Solutions"},
		{"supplier1@fundabiz.co.ke", "254744444444", "SUPPLIER", "001", "Coast Wholesalers Ltd"},
		{"agent1@fundabiz.co.ke", "254755555555", "FIELD_AGENT", "047", "KYC Agent Nairobi"},
	}

	for _, u := range users {
		id := uuid.New().String()
		query := `INSERT INTO users (id, email, phone, password_hash, role, county_id, business_name, status, created_at, updated_at)
			VALUES ($1, $2, $3, $4, $5, (SELECT id FROM counties WHERE code = $6), $7, $8, $9, $10) ON CONFLICT (email) DO NOTHING`
		_, err := pool.Exec(ctx, query,
			id, u.Email, u.Phone, string(hash), u.Role, u.CountyID, u.BusinessName, "ACTIVE", time.Now(), time.Now(),
		)
		if err != nil {
			log.Printf("seed user %s: %v", u.Email, err)
		}
	}

	fmt.Println("Seeded dev test data")
}
