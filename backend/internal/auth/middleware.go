package auth

import (
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/coreflex/fundabiz/internal/shared/types"
)

func AuthRequired(c *fiber.Ctx) error {
	authHeader := c.Get("Authorization")
	if authHeader == "" {
		return c.Status(401).JSON(fiber.Map{"error": "authorization header required"})
	}

	parts := strings.SplitN(authHeader, " ", 2)
	if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
		return c.Status(401).JSON(fiber.Map{"error": "invalid authorization header"})
	}

	claims, err := ValidateAccessToken(parts[1])
	if err != nil {
		return c.Status(401).JSON(fiber.Map{"error": "invalid or expired access token"})
	}

	c.Locals("claims", claims)
	c.Locals("user_id", claims.UserID)
	c.Locals("role", claims.Role)
	return c.Next()
}

func RoleRequired(roles ...types.Role) fiber.Handler {
	roleSet := make(map[types.Role]bool, len(roles))
	for _, r := range roles {
		roleSet[r] = true
	}

	return func(c *fiber.Ctx) error {
		claims, ok := c.Locals("claims").(*Claims)
		if !ok {
			return c.Status(401).JSON(fiber.Map{"error": "not authenticated"})
		}

		if !roleSet[claims.Role] {
			return c.Status(403).JSON(fiber.Map{
				"error":          "insufficient permissions",
				"required_role":  roles,
				"current_role":   claims.Role,
			})
		}
		return c.Next()
	}
}

func PermissionRequired(permission string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		claims, ok := c.Locals("claims").(*Claims)
		if !ok {
			return c.Status(401).JSON(fiber.Map{"error": "not authenticated"})
		}

		perms, exists := types.RolePermissions[claims.Role]
		if !exists {
			return c.Status(403).JSON(fiber.Map{"error": "no permissions defined for role"})
		}

		allowed := false
		for _, p := range perms {
			if matchPermission(p, permission) {
				allowed = true
				break
			}
		}

		if !allowed {
			return c.Status(403).JSON(fiber.Map{
				"error":        "insufficient permissions",
				"permission":   permission,
				"current_role": claims.Role,
			})
		}
		return c.Next()
	}
}

func matchPermission(pattern, path string) bool {
	if strings.HasSuffix(pattern, "/*") {
		prefix := strings.TrimSuffix(pattern, "/*")
		return strings.HasPrefix(path, prefix)
	}
	return pattern == path
}
