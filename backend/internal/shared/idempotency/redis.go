package idempotency

import (
	"context"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
)

type IdempotencyStore struct {
	client *redis.Client
}

func NewIdempotencyStore(client *redis.Client) *IdempotencyStore {
	return &IdempotencyStore{client: client}
}

func (s *IdempotencyStore) CheckAndStore(ctx context.Context, key string, ttl time.Duration) (bool, error) {
	ok, err := s.client.SetNX(ctx, "idempotency:"+key, "1", ttl).Result()
	if err != nil {
		return false, fmt.Errorf("idempotency check: %w", err)
	}
	return ok, nil
}

func (s *IdempotencyStore) Exists(ctx context.Context, key string) (bool, error) {
	n, err := s.client.Exists(ctx, "idempotency:"+key).Result()
	if err != nil {
		return false, fmt.Errorf("idempotency exists: %w", err)
	}
	return n > 0, nil
}

func (s *IdempotencyStore) Remove(ctx context.Context, key string) error {
	return s.client.Del(ctx, "idempotency:"+key).Err()
}
