package kyc

import (
	"context"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Document struct {
	ID        string    `json:"id"`
	AppID     string    `json:"app_id"`
	Type      string    `json:"type"`
	URL       string    `json:"url"`
	CreatedAt time.Time `json:"created_at"`
}

type DecisionHistory struct {
	ID         string    `json:"id"`
	AppID      string    `json:"app_id"`
	ReviewerID string    `json:"reviewer_id"`
	Decision   string    `json:"decision"`
	Reason     string    `json:"reason"`
	CreatedAt  time.Time `json:"created_at"`
}

type Repository struct {
	pool *pgxpool.Pool
}

func NewRepository(pool *pgxpool.Pool) *Repository {
	return &Repository{pool: pool}
}

func (r *Repository) CreateApplication(ctx context.Context, app *KYCApplication) error {
	query := `INSERT INTO kyc_applications (id, user_id, business_name, business_reg_number, business_age_months, county_id, id_number, status, risk_score, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`
	_, err := r.pool.Exec(ctx, query,
		app.ID, app.UserID, app.BusinessName, app.BusinessRegNumber, app.BusinessAgeMonths,
		app.CountyID, app.IDNumber, app.Status, app.RiskScore, app.CreatedAt, app.UpdatedAt,
	)
	if err != nil {
		return fmt.Errorf("insert kyc application: %w", err)
	}
	return nil
}

func (r *Repository) GetApplication(ctx context.Context, id string) (*KYCApplication, error) {
	query := `SELECT id, user_id, business_name, business_reg_number, business_age_months, county_id, id_number, status, risk_score, COALESCE(reviewer_id, ''), COALESCE(decision_reason, ''), created_at, updated_at FROM kyc_applications WHERE id = $1`
	app := &KYCApplication{}
	err := r.pool.QueryRow(ctx, query, id).Scan(
		&app.ID, &app.UserID, &app.BusinessName, &app.BusinessRegNumber, &app.BusinessAgeMonths,
		&app.CountyID, &app.IDNumber, &app.Status, &app.RiskScore, &app.ReviewerID, &app.DecisionReason, &app.CreatedAt, &app.UpdatedAt,
	)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, fmt.Errorf("application not found")
		}
		return nil, fmt.Errorf("query application: %w", err)
	}
	return app, nil
}

func (r *Repository) FindApplications(ctx context.Context, status, countyID string) ([]*KYCApplication, error) {
	query := `SELECT id, user_id, business_name, business_reg_number, business_age_months, county_id, id_number, status, risk_score, COALESCE(reviewer_id, ''), COALESCE(decision_reason, ''), created_at, updated_at FROM kyc_applications WHERE 1=1`
	var args []interface{}
	argIdx := 1

	if status != "" {
		query += fmt.Sprintf(" AND status = $%d", argIdx)
		args = append(args, status)
		argIdx++
	}
	if countyID != "" {
		query += fmt.Sprintf(" AND county_id = $%d", argIdx)
		args = append(args, countyID)
		argIdx++
	}

	query += " ORDER BY created_at DESC"

	rows, err := r.pool.Query(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("query applications: %w", err)
	}
	defer rows.Close()

	var apps []*KYCApplication
	for rows.Next() {
		app := &KYCApplication{}
		err := rows.Scan(
			&app.ID, &app.UserID, &app.BusinessName, &app.BusinessRegNumber, &app.BusinessAgeMonths,
			&app.CountyID, &app.IDNumber, &app.Status, &app.RiskScore, &app.ReviewerID, &app.DecisionReason, &app.CreatedAt, &app.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("scan application: %w", err)
		}
		apps = append(apps, app)
	}
	return apps, nil
}

func (r *Repository) UpdateApplication(ctx context.Context, app *KYCApplication) error {
	query := `UPDATE kyc_applications SET status = $1, risk_score = $2, reviewer_id = $3, decision_reason = $4, updated_at = $5 WHERE id = $6`
	_, err := r.pool.Exec(ctx, query, app.Status, app.RiskScore, app.ReviewerID, app.DecisionReason, app.UpdatedAt, app.ID)
	if err != nil {
		return fmt.Errorf("update application: %w", err)
	}
	return nil
}

func (r *Repository) AddDocument(ctx context.Context, doc *Document) error {
	query := `INSERT INTO kyc_documents (id, app_id, type, url, created_at) VALUES ($1, $2, $3, $4, $5)`
	_, err := r.pool.Exec(ctx, query, doc.ID, doc.AppID, doc.Type, doc.URL, doc.CreatedAt)
	if err != nil {
		return fmt.Errorf("insert document: %w", err)
	}
	return nil
}

func (r *Repository) GetDocuments(ctx context.Context, appID string) ([]Document, error) {
	query := `SELECT id, app_id, type, url, created_at FROM kyc_documents WHERE app_id = $1`
	rows, err := r.pool.Query(ctx, query, appID)
	if err != nil {
		return nil, fmt.Errorf("query documents: %w", err)
	}
	defer rows.Close()

	var docs []Document
	for rows.Next() {
		var d Document
		err := rows.Scan(&d.ID, &d.AppID, &d.Type, &d.URL, &d.CreatedAt)
		if err != nil {
			return nil, fmt.Errorf("scan document: %w", err)
		}
		docs = append(docs, d)
	}
	return docs, nil
}
