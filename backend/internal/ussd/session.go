package ussd

import (
	"context"
	"encoding/json"
	"time"

	"github.com/redis/go-redis/v9"
)

type SessionData struct {
	PhoneNumber  string `json:"phone_number"`
	SessionID    string `json:"session_id"`
	CurrentFlow  string `json:"current_flow"`
	LastInput    string `json:"last_input"`
	CreatedAt    int64  `json:"created_at"`
}

type SessionManager struct {
	client *redis.Client
}

func NewSessionManager(client *redis.Client) *SessionManager {
	return &SessionManager{client: client}
}

func (m *SessionManager) GetSession(phone string) *SessionData {
	key := "ussd:session:" + phone
	data, err := m.client.Get(context.Background(), key).Result()
	if err != nil {
		return &SessionData{
			PhoneNumber: phone,
			CreatedAt:   time.Now().Unix(),
		}
	}

	var session SessionData
	if err := json.Unmarshal([]byte(data), &session); err != nil {
		return &SessionData{
			PhoneNumber: phone,
			CreatedAt:   time.Now().Unix(),
		}
	}

	return &session
}

func (m *SessionManager) SetSession(phone string, session *SessionData) {
	key := "ussd:session:" + phone
	data, _ := json.Marshal(session)
	m.client.Set(context.Background(), key, string(data), 10*time.Minute)
}

func (m *SessionManager) ClearSession(phone string) {
	key := "ussd:session:" + phone
	m.client.Del(context.Background(), key)
}
