package auth

import (
	"time"

	"github.com/google/uuid"
	"github.com/coreflex/fundabiz/internal/shared/types"
)

type User struct {
	ID           uuid.UUID        `db:"id"           json:"id"`
	Email        string           `db:"email"        json:"email"`
	Phone        string           `db:"phone"        json:"phone"`
	PasswordHash string           `db:"password_hash" json:"-"`
	Role         types.Role       `db:"role"         json:"role"`
	Status       types.UserStatus `db:"status"       json:"status"`
	CountyID     *uuid.UUID       `db:"county_id"    json:"county_id,omitempty"`
	FirstName    *string          `db:"first_name"   json:"first_name,omitempty"`
	LastName     *string          `db:"last_name"    json:"last_name,omitempty"`
	NationalID   *string          `db:"national_id"  json:"national_id,omitempty"`
	MFAEnabled   bool             `db:"mfa_enabled"  json:"mfa_enabled"`
	MFAVerified  bool             `db:"mfa_verified" json:"mfa_verified"`
	CreatedAt    time.Time        `db:"created_at"   json:"created_at"`
	UpdatedAt    time.Time        `db:"updated_at"   json:"updated_at"`
}

type Session struct {
	ID           string     `json:"session_id"`
	UserID       uuid.UUID  `json:"user_id"`
	Role         types.Role `json:"role"`
	CountyID     *uuid.UUID `json:"county_id,omitempty"`
	RefreshToken string     `json:"refresh_token"`
	UserAgent    string     `json:"user_agent"`
	IPAddress    string     `json:"ip_address"`
	CreatedAt    time.Time  `json:"created_at"`
	ExpiresAt    time.Time  `json:"expires_at"`
}

type OTPRecord struct {
	Phone     string
	Code      string
	Purpose   string
	ExpiresAt time.Time
	Attempts  int
}

type RegisterSMERequest struct {
	FirstName    string `json:"first_name"  validate:"required,min=2,max=50"`
	LastName     string `json:"last_name"   validate:"required,min=2,max=50"`
	Phone        string `json:"phone"       validate:"required,len=10,startswith=07"`
	NationalID   string `json:"national_id" validate:"required,len=8"`
	CountyID     string `json:"county_id"   validate:"required,uuid"`
	BusinessName string `json:"business_name"   validate:"required,min=2,max=100"`
	BusinessRegNo string `json:"business_reg_no"`
	KRAPin       string `json:"kra_pin"`
	BusinessType string `json:"business_type"   validate:"required"`
	Email        string `json:"email"    validate:"required,email"`
	Password     string `json:"password" validate:"required,min=8"`
	MpesaOTP     string `json:"mpesa_otp" validate:"required,len=6"`
}

type RegisterSupplierRequest struct {
	FirstName     string `json:"first_name"      validate:"required"`
	LastName      string `json:"last_name"       validate:"required"`
	Phone         string `json:"phone"           validate:"required,len=10"`
	Email         string `json:"email"           validate:"required,email"`
	Password      string `json:"password"        validate:"required,min=8"`
	NationalID    string `json:"national_id"     validate:"required,len=8"`
	CountyID      string `json:"county_id"       validate:"required,uuid"`
	BusinessName  string `json:"business_name"   validate:"required"`
	BusinessRegNo string `json:"business_reg_no" validate:"required"`
	KRAPin        string `json:"kra_pin"         validate:"required"`
	Category      string `json:"category"        validate:"required"`
	MpesaOTP      string `json:"mpesa_otp"       validate:"required,len=6"`
}

type CreateSubUserRequest struct {
	FirstName  string     `json:"first_name"  validate:"required"`
	LastName   string     `json:"last_name"   validate:"required"`
	Email      string     `json:"email"       validate:"required,email"`
	Phone      string     `json:"phone"       validate:"required"`
	NationalID string     `json:"national_id" validate:"required"`
	CountyID   string     `json:"county_id"   validate:"required,uuid"`
	Role       types.Role `json:"role"        validate:"required"`
}

type LoginRequest struct {
	Email    string `json:"email"    validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

type OTPVerifyRequest struct {
	Phone   string `json:"phone"   validate:"required"`
	OTP     string `json:"otp"     validate:"required,len=6"`
	Purpose string `json:"purpose" validate:"required"`
}

type RefreshRequest struct {
	RefreshToken string `json:"refresh_token" validate:"required"`
}

type PasswordResetRequest struct {
	Phone       string `json:"phone"        validate:"required"`
	OTP         string `json:"otp"          validate:"required,len=6"`
	NewPassword string `json:"new_password" validate:"required,min=8"`
}

type ChangePasswordRequest struct {
	CurrentPassword string `json:"current_password" validate:"required"`
	NewPassword     string `json:"new_password"     validate:"required,min=8"`
}

type AuthResponse struct {
	AccessToken  string       `json:"access_token"`
	RefreshToken string       `json:"refresh_token"`
	ExpiresIn    int          `json:"expires_in"`
	User         UserResponse `json:"user"`
}

type UserResponse struct {
	ID         uuid.UUID        `json:"id"`
	Email      string           `json:"email"`
	Phone      string           `json:"phone"`
	FirstName  string           `json:"first_name"`
	LastName   string           `json:"last_name"`
	Role       types.Role       `json:"role"`
	Status     types.UserStatus `json:"status"`
	CountyID   *uuid.UUID       `json:"county_id,omitempty"`
	MFAEnabled bool             `json:"mfa_enabled"`
}

type OTPResponse struct {
	Message   string `json:"message"`
	Phone     string `json:"phone"`
	ExpiresIn int    `json:"expires_in"`
}

type SessionInfo struct {
	SessionID string    `json:"session_id"`
	UserAgent string    `json:"user_agent"`
	IPAddress string    `json:"ip_address"`
	CreatedAt time.Time `json:"created_at"`
	ExpiresAt time.Time `json:"expires_at"`
	Current   bool      `json:"current"`
}
