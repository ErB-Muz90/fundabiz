package tenant

import (
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

type Claims struct {
	UserID  string `json:"user_id"`
	Role    string `json:"role"`
	CountyID string `json:"county_id"`
}

func InjectCounty(c *fiber.Ctx) error {
	authHeader := c.Get("Authorization")
	if authHeader == "" {
		return c.Next()
	}

	tokenStr := strings.TrimPrefix(authHeader, "Bearer ")
	if tokenStr == "" {
		return c.Next()
	}

	token, _, err := new(jwt.Parser).ParseUnverified(tokenStr, jwt.MapClaims{})
	if err != nil {
		return c.Next()
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return c.Next()
	}

	if countyID, ok := claims["county_id"].(string); ok {
		c.Locals("county_id", countyID)
	}
	if userID, ok := claims["user_id"].(string); ok {
		c.Locals("user_id", userID)
	}
	if role, ok := claims["role"].(string); ok {
		c.Locals("role", role)
	}

	return c.Next()
}

func GetCountyID(c *fiber.Ctx) string {
	if v, ok := c.Locals("county_id").(string); ok {
		return v
	}
	return ""
}

func GetUserID(c *fiber.Ctx) string {
	if v, ok := c.Locals("user_id").(string); ok {
		return v
	}
	return ""
}

func GetRole(c *fiber.Ctx) string {
	if v, ok := c.Locals("role").(string); ok {
		return v
	}
	return ""
}
