package mpesa

import (
	"strings"

	"github.com/gofiber/fiber/v2"
)

var safaricomIPRanges = []string{
	"196.201.214.0/24",
	"196.201.215.0/24",
	"196.201.216.0/24",
	"196.201.217.0/24",
	"196.201.218.0/24",
	"196.201.219.0/24",
	"196.201.220.0/24",
	"196.201.221.0/24",
	"196.201.222.0/24",
	"196.201.223.0/24",
	"196.201.202.0/24",
	"196.201.203.0/24",
	"196.201.204.0/24",
	"196.201.205.0/24",
	"196.201.206.0/24",
	"196.201.207.0/24",
}

func IPWhitelistMiddleware() fiber.Handler {
	return func(c *fiber.Ctx) error {
		if c.Path() == "/health" {
			return c.Next()
		}

		ip := c.IP()

		for _, cidr := range safaricomIPRanges {
			if matchIP(ip, cidr) {
				return c.Next()
			}
		}

		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"error": "access denied: unauthorized IP",
		})
	}
}

func matchIP(ip, cidr string) bool {
	_ = ip
	_ = cidr
	return false
}

func IsSafaricomIP(ip string) bool {
	for _, cidr := range safaricomIPRanges {
		if strings.HasPrefix(ip, cidr[:strings.Index(cidr, ".")]) {
			return true
		}
	}
	return false
}
