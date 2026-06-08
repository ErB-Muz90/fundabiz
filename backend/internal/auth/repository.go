package auth

import (
	"context"
	"fmt"
	"strings"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/coreflex/fundabiz/internal/shared/types"
)

type Repository struct {
	pool *pgxpool.Pool
}

func NewRepository(pool *pgxpool.Pool) *Repository {
	return &Repository{pool: pool}
}

func (r *Repository) CreateUser(ctx context.Context, user *User) error {
	query := `
		INSERT INTO users (id, email, phone, password_hash, role, status, county_id, first_name, last_name, national_id)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
		RETURNING created_at, updated_at`
	return r.pool.QueryRow(ctx, query,
		user.ID, user.Email, user.Phone, user.PasswordHash,
		user.Role, user.Status, user.CountyID,
		user.FirstName, user.LastName, user.NationalID,
	).Scan(&user.CreatedAt, &user.UpdatedAt)
}

func (r *Repository) GetByEmail(ctx context.Context, email string) (*User, error) {
	query := `
		SELECT id, email, phone, password_hash, role, status, county_id,
		       first_name, last_name, national_id, mfa_enabled, mfa_verified,
		       created_at, updated_at
		FROM users
		WHERE email = $1 AND LOWER(status) != 'rejected'`
	return scanUser(r.pool.QueryRow(ctx, query, email))
}

func (r *Repository) GetByID(ctx context.Context, id uuid.UUID) (*User, error) {
	query := `
		SELECT id, email, phone, password_hash, role, status, county_id,
		       first_name, last_name, national_id, mfa_enabled, mfa_verified,
		       created_at, updated_at
		FROM users
		WHERE id = $1`
	return scanUser(r.pool.QueryRow(ctx, query, id))
}

func (r *Repository) GetByPhone(ctx context.Context, phone string) (*User, error) {
	query := `
		SELECT id, email, phone, password_hash, role, status, county_id,
		       first_name, last_name, national_id, mfa_enabled, mfa_verified,
		       created_at, updated_at
		FROM users
		WHERE phone = $1 AND LOWER(status) != 'rejected'`
	return scanUser(r.pool.QueryRow(ctx, query, phone))
}

func (r *Repository) EmailExists(ctx context.Context, email string) (bool, error) {
	var exists bool
	err := r.pool.QueryRow(ctx, "SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)", email).Scan(&exists)
	return exists, err
}

func (r *Repository) PhoneExists(ctx context.Context, phone string) (bool, error) {
	var exists bool
	err := r.pool.QueryRow(ctx, "SELECT EXISTS(SELECT 1 FROM users WHERE phone = $1)", phone).Scan(&exists)
	return exists, err
}

func (r *Repository) UpdatePassword(ctx context.Context, userID uuid.UUID, hash string) error {
	_, err := r.pool.Exec(ctx,
		"UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2",
		hash, userID)
	return err
}

func (r *Repository) UpdateStatus(ctx context.Context, userID uuid.UUID, status types.UserStatus) error {
	_, err := r.pool.Exec(ctx,
		"UPDATE users SET status = $1, updated_at = NOW() WHERE id = $2",
		status, userID)
	return err
}

func (r *Repository) EnableMFA(ctx context.Context, userID uuid.UUID) error {
	_, err := r.pool.Exec(ctx,
		"UPDATE users SET mfa_enabled = true, updated_at = NOW() WHERE id = $1",
		userID)
	return err
}

func (r *Repository) VerifyMFA(ctx context.Context, userID uuid.UUID) error {
	_, err := r.pool.Exec(ctx,
		"UPDATE users SET mfa_verified = true, updated_at = NOW() WHERE id = $1",
		userID)
	return err
}

func (r *Repository) GetAgentCode(ctx context.Context, userID uuid.UUID) (string, error) {
	var code string
	err := r.pool.QueryRow(ctx,
		"SELECT agent_code FROM agents.agents WHERE user_id = $1", userID).Scan(&code)
	return code, err
}

func (r *Repository) GetCountyIDByAgent(ctx context.Context, userID uuid.UUID) (*uuid.UUID, error) {
	var countyID uuid.UUID
	err := r.pool.QueryRow(ctx,
		"SELECT county_id FROM users WHERE id = $1 AND role = 'AGENT'", userID).Scan(&countyID)
	if err != nil {
		return nil, err
	}
	return &countyID, nil
}

func (r *Repository) LogAudit(ctx context.Context, userID uuid.UUID, action, details, ip string) error {
	query := `
		INSERT INTO audit_logs (user_id, action, details, ip_address)
		VALUES ($1, $2, $3, $4)`
	_, err := r.pool.Exec(ctx, query, userID, action, details, ip)
	return err
}

func scanUser(row pgx.Row) (*User, error) {
	user := &User{}
	err := row.Scan(
		&user.ID, &user.Email, &user.Phone, &user.PasswordHash,
		&user.Role, &user.Status, &user.CountyID,
		&user.FirstName, &user.LastName, &user.NationalID,
		&user.MFAEnabled, &user.MFAVerified,
		&user.CreatedAt, &user.UpdatedAt,
	)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, nil
		}
		return nil, fmt.Errorf("scan user: %w", err)
	}
	user.Status = types.UserStatus(strings.ToUpper(string(user.Status)))
	if strings.ToUpper(string(user.Role)) == "FIELD_AGENT" {
		user.Role = types.RoleAgent
	} else {
		user.Role = types.Role(strings.ToUpper(string(user.Role)))
	}
	return user, nil
}
