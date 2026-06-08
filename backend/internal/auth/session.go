package auth

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/redis/go-redis/v9"
)

type SessionStore struct {
	rdb *redis.Client
}

func NewSessionStore(rdb *redis.Client) *SessionStore {
	return &SessionStore{rdb: rdb}
}

func (s *SessionStore) Create(ctx context.Context, user *User, ua, ip string) (*Session, error) {
	sessionID := uuid.New().String()
	refreshToken, err := generateSecureToken(64)
	if err != nil {
		return nil, err
	}

	ttlHours, _ := strconv.Atoi(os.Getenv("REFRESH_TOKEN_TTL_HOURS"))
	if ttlHours == 0 {
		ttlHours = 168
	}

	session := &Session{
		ID:           sessionID,
		UserID:       user.ID,
		Role:         user.Role,
		CountyID:     user.CountyID,
		RefreshToken: refreshToken,
		UserAgent:    ua,
		IPAddress:    ip,
		CreatedAt:    time.Now(),
		ExpiresAt:    time.Now().Add(time.Duration(ttlHours) * time.Hour),
	}

	data, _ := json.Marshal(session)
	ttl := time.Duration(ttlHours) * time.Hour

	if err := s.rdb.Set(ctx, fmt.Sprintf("session:%s", sessionID), data, ttl).Err(); err != nil {
		return nil, err
	}
	if err := s.rdb.Set(ctx, fmt.Sprintf("refresh:%s", refreshToken), sessionID, ttl).Err(); err != nil {
		return nil, err
	}

	s.rdb.SAdd(ctx, fmt.Sprintf("user_sessions:%s", user.ID.String()), sessionID)
	s.rdb.Expire(ctx, fmt.Sprintf("user_sessions:%s", user.ID.String()), ttl)

	return session, nil
}

func (s *SessionStore) Rotate(ctx context.Context, oldRefreshToken string, ua, ip string) (*Session, error) {
	sessionID, err := s.rdb.Get(ctx, fmt.Sprintf("refresh:%s", oldRefreshToken)).Result()
	if err != nil {
		return nil, fmt.Errorf("invalid or expired refresh token")
	}

	data, err := s.rdb.Get(ctx, fmt.Sprintf("session:%s", sessionID)).Bytes()
	if err != nil {
		return nil, fmt.Errorf("session not found")
	}

	var session Session
	if err := json.Unmarshal(data, &session); err != nil {
		return nil, err
	}

	s.rdb.Del(ctx, fmt.Sprintf("refresh:%s", oldRefreshToken))
	s.rdb.Del(ctx, fmt.Sprintf("session:%s", sessionID))
	s.rdb.SRem(ctx, fmt.Sprintf("user_sessions:%s", session.UserID.String()), sessionID)

	newRefreshToken, _ := generateSecureToken(64)
	newSessionID := uuid.New().String()

	ttlHours := 168
	newSession := &Session{
		ID:           newSessionID,
		UserID:       session.UserID,
		Role:         session.Role,
		CountyID:     session.CountyID,
		RefreshToken: newRefreshToken,
		UserAgent:    ua,
		IPAddress:    ip,
		CreatedAt:    time.Now(),
		ExpiresAt:    time.Now().Add(time.Duration(ttlHours) * time.Hour),
	}

	ttl := time.Duration(ttlHours) * time.Hour
	newData, _ := json.Marshal(newSession)
	s.rdb.Set(ctx, fmt.Sprintf("session:%s", newSessionID), newData, ttl)
	s.rdb.Set(ctx, fmt.Sprintf("refresh:%s", newRefreshToken), newSessionID, ttl)
	s.rdb.SAdd(ctx, fmt.Sprintf("user_sessions:%s", session.UserID.String()), newSessionID)

	return newSession, nil
}

func (s *SessionStore) Exists(ctx context.Context, sessionID string) (bool, error) {
	if sessionID == "" {
		return false, nil
	}
	n, err := s.rdb.Exists(ctx, fmt.Sprintf("session:%s", sessionID)).Result()
	if err != nil {
		return false, err
	}
	return n > 0, nil
}

func (s *SessionStore) Revoke(ctx context.Context, sessionID string) error {
	data, err := s.rdb.Get(ctx, fmt.Sprintf("session:%s", sessionID)).Bytes()
	if err != nil {
		return nil
	}
	var session Session
	json.Unmarshal(data, &session)

	s.rdb.Del(ctx, fmt.Sprintf("session:%s", sessionID))
	s.rdb.Del(ctx, fmt.Sprintf("refresh:%s", session.RefreshToken))
	s.rdb.SRem(ctx, fmt.Sprintf("user_sessions:%s", session.UserID.String()), sessionID)
	return nil
}

func (s *SessionStore) RevokeAll(ctx context.Context, userID uuid.UUID) error {
	key := fmt.Sprintf("user_sessions:%s", userID.String())
	sessionIDs, _ := s.rdb.SMembers(ctx, key).Result()
	for _, sid := range sessionIDs {
		s.Revoke(ctx, sid)
	}
	s.rdb.Del(ctx, key)
	return nil
}

func (s *SessionStore) ListByUser(ctx context.Context, userID uuid.UUID, currentSessionID string) ([]SessionInfo, error) {
	key := fmt.Sprintf("user_sessions:%s", userID.String())
	sessionIDs, _ := s.rdb.SMembers(ctx, key).Result()

	var infos []SessionInfo
	for _, sid := range sessionIDs {
		data, err := s.rdb.Get(ctx, fmt.Sprintf("session:%s", sid)).Bytes()
		if err != nil {
			continue
		}
		var sess Session
		if err := json.Unmarshal(data, &sess); err != nil {
			continue
		}
		infos = append(infos, SessionInfo{
			SessionID: sess.ID,
			UserAgent: sess.UserAgent,
			IPAddress: maskIP(sess.IPAddress),
			CreatedAt: sess.CreatedAt,
			ExpiresAt: sess.ExpiresAt,
			Current:   sid == currentSessionID,
		})
	}
	return infos, nil
}

func generateSecureToken(length int) (string, error) {
	b := make([]byte, length)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return hex.EncodeToString(b), nil
}

func maskIP(ip string) string {
	parts := strings.Split(ip, ".")
	if len(parts) == 4 {
		return parts[0] + "." + parts[1] + ".***.***"
	}
	return ip
}
