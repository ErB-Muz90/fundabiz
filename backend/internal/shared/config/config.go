package config

import (
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Config struct {
	ServerPort string

	PostgresHost     string
	PostgresPort     string
	PostgresUser     string
	PostgresPassword string
	PostgresDB       string
	PostgresSSLMode  string

	RedisHost     string
	RedisPort     string
	RedisPassword string
	RedisDB       int

	RabbitMQHost     string
	RabbitMQPort     string
	RabbitMQUser     string
	RabbitMQPassword string

	JWTSecret     string
	JWTExpiration string

	MPesaConsumerKey    string
	MPesaConsumerSecret string
	MPesaPassKey        string
	MPesaShortCode      string
	MPesaEnvironment    string
	MPesaSecurityCred   string

	ATAPIKey    string
	ATUsername  string
	ATSenderID  string

	AWSAccessKeyID     string
	AWSSecretAccessKey string
	AWSRegion          string
	S3Bucket           string

	SMTPHost     string
	SMTPPort     string
	SMTPUser     string
	SMTPPassword string
	SMTPFrom     string

	FirebaseCredentialsFile string

	CreditMinScore int
	CreditMaxScore int
}

func LoadConfig() *Config {
	_ = godotenv.Load()

	return &Config{
		ServerPort: getEnv("SERVER_PORT", "4000"),

		PostgresHost:     getEnv("POSTGRES_HOST", "localhost"),
		PostgresPort:     getEnv("POSTGRES_PORT", "5432"),
		PostgresUser:     getEnv("POSTGRES_USER", "fundabiz"),
		PostgresPassword: getEnv("POSTGRES_PASSWORD", "fundabiz"),
		PostgresDB:       getEnv("POSTGRES_DB", "fundabiz"),
		PostgresSSLMode:  getEnv("POSTGRES_SSLMODE", "disable"),

		RedisHost:     getEnv("REDIS_HOST", "localhost"),
		RedisPort:     getEnv("REDIS_PORT", "6379"),
		RedisPassword: getEnv("REDIS_PASSWORD", ""),
		RedisDB:       getEnvInt("REDIS_DB", 0),

		RabbitMQHost:     getEnv("RABBITMQ_HOST", "localhost"),
		RabbitMQPort:     getEnv("RABBITMQ_PORT", "5672"),
		RabbitMQUser:     getEnv("RABBITMQ_USER", "guest"),
		RabbitMQPassword: getEnv("RABBITMQ_PASSWORD", "guest"),

		JWTSecret:     getEnv("JWT_SECRET", "super-secret-key-change-in-production"),
		JWTExpiration: getEnv("JWT_EXPIRATION", "15m"),

		MPesaConsumerKey:    getEnv("MPESA_CONSUMER_KEY", ""),
		MPesaConsumerSecret: getEnv("MPESA_CONSUMER_SECRET", ""),
		MPesaPassKey:        getEnv("MPESA_PASS_KEY", ""),
		MPesaShortCode:      getEnv("MPESA_SHORT_CODE", "174379"),
		MPesaEnvironment:    getEnv("MPESA_ENVIRONMENT", "sandbox"),
		MPesaSecurityCred:   getEnv("MPESA_SECURITY_CREDENTIAL", ""),

		ATAPIKey:   getEnv("AT_API_KEY", ""),
		ATUsername: getEnv("AT_USERNAME", ""),
		ATSenderID: getEnv("AT_SENDER_ID", "FundaBiz"),

		AWSAccessKeyID:     getEnv("AWS_ACCESS_KEY_ID", ""),
		AWSSecretAccessKey: getEnv("AWS_SECRET_ACCESS_KEY", ""),
		AWSRegion:          getEnv("AWS_REGION", "eu-west-1"),
		S3Bucket:           getEnv("S3_BUCKET", "fundabiz-documents"),

		SMTPHost:     getEnv("SMTP_HOST", ""),
		SMTPPort:     getEnv("SMTP_PORT", "587"),
		SMTPUser:     getEnv("SMTP_USER", ""),
		SMTPPassword: getEnv("SMTP_PASSWORD", ""),
		SMTPFrom:     getEnv("SMTP_FROM", "noreply@fundabiz.co.ke"),

		FirebaseCredentialsFile: getEnv("FIREBASE_CREDENTIALS_FILE", ""),

		CreditMinScore: getEnvInt("CREDIT_MIN_SCORE", 0),
		CreditMaxScore: getEnvInt("CREDIT_MAX_SCORE", 1000),
	}
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func getEnvInt(key string, fallback int) int {
	if v := os.Getenv(key); v != "" {
		if i, err := strconv.Atoi(v); err == nil {
			return i
		}
	}
	return fallback
}
