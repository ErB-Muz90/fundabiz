package escrow

import (
	"context"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type EscrowOrder struct {
	ID          string     `json:"id"`
	BuyerID     string     `json:"buyer_id"`
	SupplierID  string     `json:"supplier_id"`
	OrderID     string     `json:"order_id"`
	Amount      float64    `json:"amount"`
	Status      string     `json:"status"`
	Description string     `json:"description"`
	ReleasedAt  time.Time  `json:"released_at,omitempty"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
}

type EscrowResponse struct {
	ID          string    `json:"id"`
	BuyerID     string    `json:"buyer_id"`
	SupplierID  string    `json:"supplier_id"`
	OrderID     string    `json:"order_id"`
	Amount      float64   `json:"amount"`
	Status      string    `json:"status"`
	Description string    `json:"description"`
	ReleasedAt  time.Time `json:"released_at,omitempty"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

func (e *EscrowOrder) ToResponse() *EscrowResponse {
	return &EscrowResponse{
		ID:          e.ID,
		BuyerID:     e.BuyerID,
		SupplierID:  e.SupplierID,
		OrderID:     e.OrderID,
		Amount:      e.Amount,
		Status:      e.Status,
		Description: e.Description,
		ReleasedAt:  e.ReleasedAt,
		CreatedAt:   e.CreatedAt,
		UpdatedAt:   e.UpdatedAt,
	}
}

type Repository struct {
	pool *pgxpool.Pool
}

func NewRepository(pool *pgxpool.Pool) *Repository {
	return &Repository{pool: pool}
}

func (r *Repository) CreateEscrow(ctx context.Context, escrow *EscrowOrder) error {
	query := `INSERT INTO escrow_orders (id, buyer_id, supplier_id, order_id, amount, status, description, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`
	_, err := r.pool.Exec(ctx, query,
		escrow.ID, escrow.BuyerID, escrow.SupplierID, escrow.OrderID,
		escrow.Amount, escrow.Status, escrow.Description, escrow.CreatedAt, escrow.UpdatedAt,
	)
	if err != nil {
		return fmt.Errorf("insert escrow: %w", err)
	}
	return nil
}

func (r *Repository) GetEscrow(ctx context.Context, id string) (*EscrowOrder, error) {
	query := `SELECT id, buyer_id, supplier_id, order_id, amount, status, description, released_at, created_at, updated_at FROM escrow_orders WHERE id = $1`
	e := &EscrowOrder{}
	err := r.pool.QueryRow(ctx, query, id).Scan(
		&e.ID, &e.BuyerID, &e.SupplierID, &e.OrderID, &e.Amount,
		&e.Status, &e.Description, &e.ReleasedAt, &e.CreatedAt, &e.UpdatedAt,
	)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, fmt.Errorf("escrow not found")
		}
		return nil, fmt.Errorf("query escrow: %w", err)
	}
	return e, nil
}

func (r *Repository) UpdateEscrow(ctx context.Context, escrow *EscrowOrder) error {
	query := `UPDATE escrow_orders SET status = $1, released_at = $2, updated_at = $3 WHERE id = $4`
	_, err := r.pool.Exec(ctx, query, escrow.Status, escrow.ReleasedAt, escrow.UpdatedAt, escrow.ID)
	if err != nil {
		return fmt.Errorf("update escrow: %w", err)
	}
	return nil
}

func (r *Repository) CreateDispute(ctx context.Context, dispute *EscrowDispute) error {
	query := `INSERT INTO escrow_disputes (id, escrow_id, raised_by, reason, status, created_at)
		VALUES ($1, $2, $3, $4, $5, $6)`
	_, err := r.pool.Exec(ctx, query,
		dispute.ID, dispute.EscrowID, dispute.RaisedBy, dispute.Reason, dispute.Status, dispute.CreatedAt,
	)
	if err != nil {
		return fmt.Errorf("insert dispute: %w", err)
	}
	return nil
}

func (r *Repository) CreateEvent(ctx context.Context, event *EscrowEvent) error {
	query := `INSERT INTO escrow_events (id, escrow_id, event_type, data, created_at)
		VALUES ($1, $2, $3, $4, $5)`
	_, err := r.pool.Exec(ctx, query,
		event.ID, event.EscrowID, event.EventType, event.Data, event.CreatedAt,
	)
	if err != nil {
		return fmt.Errorf("insert escrow event: %w", err)
	}
	return nil
}
