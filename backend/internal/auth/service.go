package auth

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"errors"
	"fmt"
	"os"
	"strconv"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"
	"github.com/coreflex/fundabiz/internal/shared/types"
	"golang.org/x/crypto/bcrypt"
)

type Service struct {
	repo    *Repository
	session *SessionStore
	otp     *OTPService
	rdb     *redis.Client
	pool    *pgxpool.Pool
	val     *validator.Validate
}

func NewService(pool *pgxpool.Pool, rdb *redis.Client) *Service {
	return &Service{
		repo:    NewRepository(pool),
		session: NewSessionStore(rdb),
		otp:     NewOTPService(rdb),
		rdb:     rdb,
		pool:    pool,
		val:     validator.New(),
	}
}

func (s *Service) RegisterSME(ctx context.Context, req RegisterSMERequest) (*AuthResponse, error) {
	if err := s.val.Struct(req); err != nil {
		return nil, fmt.Errorf("validation: %w", err)
	}

	if err := s.otp.Verify(ctx, req.Phone, req.MpesaOTP, "REGISTRATION"); err != nil {
		return nil, err
	}

	exists, _ := s.repo.EmailExists(ctx, req.Email)
	if exists {
		return nil, errors.New("email already registered")
	}
	exists, _ = s.repo.PhoneExists(ctx, req.Phone)
	if exists {
		return nil, errors.New("phone already registered")
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, fmt.Errorf("hash password: %w", err)
	}

	countyID, err := uuid.Parse(req.CountyID)
	if err != nil {
		return nil, fmt.Errorf("invalid county_id: %w", err)
	}

	user := &User{
		ID:           uuid.New(),
		Email:        req.Email,
		Phone:        req.Phone,
		PasswordHash: string(hash),
		Role:         types.RoleSMEOwner,
		Status:       types.StatusActive,
		CountyID:     &countyID,
		FirstName:    &req.FirstName,
		LastName:     &req.LastName,
		NationalID:   &req.NationalID,
	}

	if err := s.repo.CreateUser(ctx, user); err != nil {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		s.otp.Send(ctx, req.Phone, "REGISTRATION")
		return nil, fmt.Errorf("create user: %w", err)
	}

	tx, _ := s.pool.Begin(ctx)
	_, err = tx.Exec(ctx, `
		INSERT INTO onboarding.sme_profiles (user_id, business_name, business_reg_no, kra_pin, business_type)
		VALUES ($1, $2, $3, $4, $5)`,
		user.ID, req.BusinessName, req.BusinessRegNo, req.KRAPin, req.BusinessType)
	if err != nil {
		tx.Rollback(ctx)
		s.repo.UpdateStatus(ctx, user.ID, types.StatusRejected)
		return nil, fmt.Errorf("create sme profile: %w", err)
	}
	tx.Commit(ctx)

	session, err := s.session.Create(ctx, user, "", "")
	if err != nil {
		return nil, fmt.Errorf("create session: %w", err)
	}

	return s.buildAuthResponse(user, session)
}

func (s *Service) RegisterSupplier(ctx context.Context, req RegisterSupplierRequest) (*AuthResponse, error) {
	if err := s.val.Struct(req); err != nil {
		return nil, fmt.Errorf("validation: %w", err)
	}

	if err := s.otp.Verify(ctx, req.Phone, req.MpesaOTP, "REGISTRATION"); err != nil {
		return nil, err
	}

	exists, _ := s.repo.EmailExists(ctx, req.Email)
	if exists {
		return nil, errors.New("email already registered")
	}
	exists, _ = s.repo.PhoneExists(ctx, req.Phone)
	if exists {
		return nil, errors.New("phone already registered")
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, fmt.Errorf("hash password: %w", err)
	}

	countyID, err := uuid.Parse(req.CountyID)
	if err != nil {
		return nil, fmt.Errorf("invalid county_id: %w", err)
	}

	user := &User{
		ID:           uuid.New(),
		Email:        req.Email,
		Phone:        req.Phone,
		PasswordHash: string(hash),
		Role:         types.RoleSupplier,
		Status:       types.StatusActive,
		CountyID:     &countyID,
		FirstName:    &req.FirstName,
		LastName:     &req.LastName,
		NationalID:   &req.NationalID,
	}

	if err := s.repo.CreateUser(ctx, user); err != nil {
		ctx2, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		s.otp.Send(ctx2, req.Phone, "REGISTRATION")
		return nil, fmt.Errorf("create user: %w", err)
	}

	tx, _ := s.pool.Begin(ctx)
	_, err = tx.Exec(ctx, `
		INSERT INTO onboarding.supplier_profiles (user_id, business_name, business_reg_no, kra_pin, category)
		VALUES ($1, $2, $3, $4, $5)`,
		user.ID, req.BusinessName, req.BusinessRegNo, req.KRAPin, req.Category)
	if err != nil {
		tx.Rollback(ctx)
		s.repo.UpdateStatus(ctx, user.ID, types.StatusRejected)
		return nil, fmt.Errorf("create supplier profile: %w", err)
	}
	tx.Commit(ctx)

	session, err := s.session.Create(ctx, user, "", "")
	if err != nil {
		return nil, fmt.Errorf("create session: %w", err)
	}

	return s.buildAuthResponse(user, session)
}

func (s *Service) CreateSubUser(ctx context.Context, creatorID uuid.UUID, req CreateSubUserRequest) (*User, error) {
	if err := s.val.Struct(req); err != nil {
		return nil, fmt.Errorf("validation: %w", err)
	}

	creator, err := s.repo.GetByID(ctx, creatorID)
	if err != nil || creator == nil {
		return nil, errors.New("creator not found")
	}

	canCreate, ok := types.RoleCanCreate[creator.Role]
	if !ok {
		return nil, errors.New("you do not have permission to create users")
	}

	allowed := false
	for _, r := range canCreate {
		if r == req.Role {
			allowed = true
			break
		}
	}
	if !allowed {
		return nil, fmt.Errorf("you cannot create users with role %s", req.Role)
	}

	if creator.Role == types.RoleRegionalAdmin {
		existing, _ := s.repo.GetByID(ctx, creatorID)
		if existing.CountyID != nil {
			if req.CountyID != existing.CountyID.String() {
				return nil, errors.New("regional admin can only create users in their own county")
			}
		}
	}

	tempPass := generateTempPassword(12)
	hash, err := bcrypt.GenerateFromPassword([]byte(tempPass), bcrypt.DefaultCost)
	if err != nil {
		return nil, fmt.Errorf("hash password: %w", err)
	}

	countyID, err := uuid.Parse(req.CountyID)
	if err != nil {
		return nil, fmt.Errorf("invalid county_id: %w", err)
	}

	user := &User{
		ID:           uuid.New(),
		Email:        req.Email,
		Phone:        req.Phone,
		PasswordHash: string(hash),
		Role:         req.Role,
		Status:       types.StatusPending,
		CountyID:     &countyID,
		FirstName:    &req.FirstName,
		LastName:     &req.LastName,
		NationalID:   &req.NationalID,
	}

	if err := s.repo.CreateUser(ctx, user); err != nil {
		return nil, fmt.Errorf("create user: %w", err)
	}

	s.repo.LogAudit(ctx, creatorID, "CREATE_USER",
		fmt.Sprintf("Created %s user %s (%s)", req.Role, user.Email, user.ID.String()), "")

	fmt.Printf("[AUTH] Temporary password for %s: %s\n", user.Email, tempPass)
	_ = tempPass

	return user, nil
}

func (s *Service) Login(ctx context.Context, req LoginRequest, ua, ip string) (*AuthResponse, error) {
	user, err := s.repo.GetByEmail(ctx, req.Email)
	if err != nil || user == nil {
		return nil, errors.New("invalid credentials")
	}

	if user.Status != types.StatusActive && user.Status != types.StatusPending {
		return nil, errors.New("your account is " + string(user.Status))
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		s.repo.LogAudit(ctx, user.ID, "LOGIN_FAILED", "incorrect password", ip)
		return nil, errors.New("invalid credentials")
	}

	session, err := s.session.Create(ctx, user, ua, ip)
	if err != nil {
		return nil, fmt.Errorf("create session: %w", err)
	}

	s.repo.LogAudit(ctx, user.ID, "LOGIN_SUCCESS", "user logged in", ip)

	return s.buildAuthResponse(user, session)
}

func (s *Service) RefreshToken(ctx context.Context, refreshToken, ua, ip string) (*AuthResponse, error) {
	session, err := s.session.Rotate(ctx, refreshToken, ua, ip)
	if err != nil {
		return nil, err
	}

	user, err := s.repo.GetByID(ctx, session.UserID)
	if err != nil || user == nil {
		return nil, errors.New("user not found")
	}

	return s.buildAuthResponse(user, session)
}

func (s *Service) Logout(ctx context.Context, sessionID string) error {
	return s.session.Revoke(ctx, sessionID)
}

func (s *Service) RevokeAllSessions(ctx context.Context, userID uuid.UUID) error {
	return s.session.RevokeAll(ctx, userID)
}

func (s *Service) ListSessions(ctx context.Context, userID uuid.UUID, currentSessionID string) ([]SessionInfo, error) {
	return s.session.ListByUser(ctx, userID, currentSessionID)
}

func (s *Service) SendOTP(ctx context.Context, phone, purpose string) (*OTPResponse, error) {
	ttlStr := os.Getenv("OTP_COOLDOWN_SECONDS")
	cooldown, _ := strconv.Atoi(ttlStr)
	if cooldown == 0 {
		cooldown = 60
	}

	cooldownKey := fmt.Sprintf("otp_cooldown:%s:%s", purpose, phone)
	exists, _ := s.rdb.Exists(ctx, cooldownKey).Result()
	if exists > 0 {
		return nil, fmt.Errorf("please wait %d seconds before requesting another OTP", cooldown)
	}

	resp, err := s.otp.Send(ctx, phone, purpose)
	if err != nil {
		return nil, err
	}

	s.rdb.Set(ctx, cooldownKey, "1", time.Duration(cooldown)*time.Second)
	return resp, nil
}

func (s *Service) VerifyOTP(ctx context.Context, phone, code, purpose string) error {
	return s.otp.Verify(ctx, phone, code, purpose)
}

func (s *Service) InitiatePasswordReset(ctx context.Context, phone string) (*OTPResponse, error) {
	user, err := s.repo.GetByPhone(ctx, phone)
	if err != nil || user == nil {
		return &OTPResponse{
			Message:   "If the phone is registered, an OTP will be sent",
			Phone:     maskPhone(phone),
			ExpiresIn: 600,
		}, nil
	}

	return s.SendOTP(ctx, phone, "PASSWORD_RESET")
}

func (s *Service) ResetPassword(ctx context.Context, req PasswordResetRequest) error {
	if err := s.val.Struct(req); err != nil {
		return fmt.Errorf("validation: %w", err)
	}

	if err := s.otp.Verify(ctx, req.Phone, req.OTP, "PASSWORD_RESET"); err != nil {
		return err
	}

	user, err := s.repo.GetByPhone(ctx, req.Phone)
	if err != nil || user == nil {
		return errors.New("user not found")
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("hash password: %w", err)
	}

	if err := s.repo.UpdatePassword(ctx, user.ID, string(hash)); err != nil {
		return fmt.Errorf("update password: %w", err)
	}

	s.session.RevokeAll(ctx, user.ID)
	s.repo.LogAudit(ctx, user.ID, "PASSWORD_RESET", "password reset via OTP", "")

	return nil
}

func (s *Service) ChangePassword(ctx context.Context, userID uuid.UUID, currentPassword, newPassword string) error {
	user, err := s.repo.GetByID(ctx, userID)
	if err != nil || user == nil {
		return errors.New("user not found")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(currentPassword)); err != nil {
		return errors.New("current password is incorrect")
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("hash password: %w", err)
	}

	if err := s.repo.UpdatePassword(ctx, userID, string(hash)); err != nil {
		return fmt.Errorf("update password: %w", err)
	}

	s.repo.LogAudit(ctx, userID, "CHANGE_PASSWORD", "password changed", "")

	return nil
}

func (s *Service) GetUser(ctx context.Context, userID uuid.UUID) (*UserResponse, error) {
	user, err := s.repo.GetByID(ctx, userID)
	if err != nil || user == nil {
		return nil, errors.New("user not found")
	}
	return s.toUserResponse(user), nil
}

func (s *Service) buildAuthResponse(user *User, session *Session) (*AuthResponse, error) {
	accessToken, err := GenerateAccessToken(user, session.ID)
	if err != nil {
		return nil, err
	}

	expiryHours, _ := strconv.Atoi(os.Getenv("ACCESS_TOKEN_EXPIRY_HOURS"))
	if expiryHours == 0 {
		expiryHours = 24
	}
	if os.Getenv("APP_ENV") != "development" {
		expiryHours = 24
	}

	return &AuthResponse{
		AccessToken:  accessToken,
		RefreshToken: session.RefreshToken,
		ExpiresIn:    expiryHours * 3600,
		User:         *s.toUserResponse(user),
	}, nil
}

func (s *Service) toUserResponse(user *User) *UserResponse {
	resp := &UserResponse{
		ID:         user.ID,
		Email:      user.Email,
		Phone:      user.Phone,
		Role:       user.Role,
		Status:     user.Status,
		CountyID:   user.CountyID,
		MFAEnabled: user.MFAEnabled,
	}
	if user.FirstName != nil {
		resp.FirstName = *user.FirstName
	}
	if user.LastName != nil {
		resp.LastName = *user.LastName
	}
	return resp
}

func generateTempPassword(length int) string {
	b := make([]byte, length)
	rand.Read(b)
	return hex.EncodeToString(b)[:length]
}
