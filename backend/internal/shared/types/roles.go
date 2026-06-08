package types

type Role string
type UserStatus string

const (
	RoleSuperAdmin    Role = "SUPER_ADMIN"
	RoleRegionalAdmin Role = "REGIONAL_ADMIN"
	RoleAgent         Role = "AGENT"
	RoleSMEOwner      Role = "SME_OWNER"
	RoleSupplier      Role = "SUPPLIER"
)

const (
	StatusPending   UserStatus = "PENDING"
	StatusActive    UserStatus = "ACTIVE"
	StatusSuspended UserStatus = "SUSPENDED"
	StatusRejected  UserStatus = "REJECTED"
)

var RoleCanCreate = map[Role][]Role{
	RoleSuperAdmin:    {RoleRegionalAdmin},
	RoleRegionalAdmin: {RoleAgent},
	RoleAgent:         {RoleSMEOwner, RoleSupplier},
}

var RolePermissions = map[Role][]string{
	RoleSuperAdmin: {
		"/api/v1/admin/*",
		"/api/v1/regions/*",
		"/api/v1/counties/*",
		"/api/v1/kyc/*",
		"/api/v1/fraud/*",
		"/api/v1/analytics/*",
		"/api/v1/users/*",
		"/api/v1/loans/*",
	},
	RoleRegionalAdmin: {
		"/api/v1/regions/my/*",
		"/api/v1/agents/*",
		"/api/v1/kyc/*",
		"/api/v1/smes/*",
		"/api/v1/suppliers/*",
		"/api/v1/disbursements/*",
	},
	RoleAgent: {
		"/api/v1/onboarding/*",
		"/api/v1/kyc/submit",
		"/api/v1/kyc/my-submissions",
	},
	RoleSMEOwner: {
		"/api/v1/sme/*",
		"/api/v1/wallet/my",
		"/api/v1/orders/*",
		"/api/v1/escrow/*",
		"/api/v1/loan/my",
		"/api/v1/suppliers/browse",
	},
	RoleSupplier: {
		"/api/v1/supplier/*",
		"/api/v1/orders/incoming",
		"/api/v1/escrow/my",
		"/api/v1/wallet/my",
		"/api/v1/catalog/*",
	},
}
