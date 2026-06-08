package auth

import (
	"fmt"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/coreflex/fundabiz/internal/shared/types"
)

type Claims struct {
	UserID    uuid.UUID  `json:"sub"`
	Role      types.Role `json:"role"`
	CountyID  *uuid.UUID `json:"county_id,omitempty"`
	SessionID string     `json:"session_id"`
	jwt.RegisteredClaims
}

func GenerateAccessToken(user *User, sessionID string) (string, error) {
	expiry := 15 * time.Minute
	if os.Getenv("APP_ENV") == "development" {
		expiry = 24 * time.Hour
	}

	claims := Claims{
		UserID:    user.ID,
		Role:      user.Role,
		CountyID:  user.CountyID,
		SessionID: sessionID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(expiry)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Issuer:    "fundabiz-auth",
			Subject:   user.ID.String(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(os.Getenv("JWT_SECRET")))
}

func ValidateAccessToken(tokenStr string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenStr, &Claims{}, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
		}
		return []byte(os.Getenv("JWT_SECRET")), nil
	})
	if err != nil {
		return nil, fmt.Errorf("invalid token: %v", err)
	}

	claims, ok := token.Claims.(*Claims)
	if !ok || !token.Valid {
		return nil, fmt.Errorf("invalid token claims")
	}
	return claims, nil
}
