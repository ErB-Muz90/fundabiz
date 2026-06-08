package tracking

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository struct {
	pool *pgxpool.Pool
}

func NewRepository(pool *pgxpool.Pool) *Repository {
	return &Repository{pool: pool}
}

func (r *Repository) CreateEvent(ctx context.Context, event *OrderEvent) error {
	query := `INSERT INTO order_events (id, order_id, event_type, location, notes, created_at)
		VALUES ($1, $2, $3, $4, $5, $6)`
	_, err := r.pool.Exec(ctx, query,
		event.ID, event.OrderID, event.EventType, event.Location, event.Notes, event.CreatedAt,
	)
	if err != nil {
		return fmt.Errorf("insert order event: %w", err)
	}
	return nil
}

func (r *Repository) GetEventsByOrderID(ctx context.Context, orderID string) ([]OrderEvent, error) {
	query := `SELECT id, order_id, event_type, COALESCE(location, ''), COALESCE(notes, ''), created_at
		FROM order_events WHERE order_id = $1 ORDER BY created_at ASC`
	rows, err := r.pool.Query(ctx, query, orderID)
	if err != nil {
		return nil, fmt.Errorf("query order events: %w", err)
	}
	defer rows.Close()

	var events []OrderEvent
	for rows.Next() {
		var e OrderEvent
		err := rows.Scan(&e.ID, &e.OrderID, &e.EventType, &e.Location, &e.Notes, &e.CreatedAt)
		if err != nil {
			return nil, fmt.Errorf("scan order event: %w", err)
		}
		events = append(events, e)
	}
	return events, nil
}
