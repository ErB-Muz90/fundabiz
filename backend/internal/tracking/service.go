package tracking

import (
	"context"
	"fmt"
	"time"

	apperrors "github.com/coreflex/fundabiz/internal/shared/errors"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Service struct {
	repo *Repository
}

func NewService(pool *pgxpool.Pool) *Service {
	return &Service{repo: NewRepository(pool)}
}

type OrderEvent struct {
	ID        string    `json:"id"`
	OrderID   string    `json:"order_id"`
	EventType string    `json:"event_type"`
	Location  string    `json:"location,omitempty"`
	Notes     string    `json:"notes,omitempty"`
	CreatedAt time.Time `json:"created_at"`
}

type Timeline struct {
	OrderID string       `json:"order_id"`
	Events  []OrderEvent `json:"events"`
}

func (s *Service) GetTimeline(ctx context.Context, orderID string) (*Timeline, error) {
	events, err := s.repo.GetEventsByOrderID(ctx, orderID)
	if err != nil {
		return nil, apperrors.ErrNotFound
	}

	return &Timeline{
		OrderID: orderID,
		Events:  events,
	}, nil
}

func (s *Service) AddEvent(ctx context.Context, orderID, eventType, location, notes string) (*OrderEvent, error) {
	event := &OrderEvent{
		ID:        uuid.New().String(),
		OrderID:   orderID,
		EventType: eventType,
		Location:  location,
		Notes:     notes,
		CreatedAt: time.Now(),
	}

	if err := s.repo.CreateEvent(ctx, event); err != nil {
		return nil, fmt.Errorf("create event: %w", err)
	}

	return event, nil
}
