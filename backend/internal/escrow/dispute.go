package escrow

import "time"

type EscrowDispute struct {
	ID         string    `json:"id"`
	EscrowID   string    `json:"escrow_id"`
	RaisedBy   string    `json:"raised_by"`
	Reason     string    `json:"reason"`
	Status     string    `json:"status"`
	ResolvedBy string    `json:"resolved_by,omitempty"`
	Resolution string    `json:"resolution,omitempty"`
	CreatedAt  time.Time `json:"created_at"`
	ResolvedAt time.Time `json:"resolved_at,omitempty"`
}

type EscrowEvent struct {
	ID        string    `json:"id"`
	EscrowID  string    `json:"escrow_id"`
	EventType string    `json:"event_type"`
	Data      string    `json:"data"`
	CreatedAt time.Time `json:"created_at"`
}

func RaiseDispute(escrowID, raisedBy, reason string) *EscrowDispute {
	return &EscrowDispute{
		ID:        generateID(),
		EscrowID:  escrowID,
		RaisedBy:  raisedBy,
		Reason:    reason,
		Status:    "open",
		CreatedAt: time.Now(),
	}
}

func ResolveDispute(dispute *EscrowDispute, resolvedBy, resolution string) {
	dispute.Status = "resolved"
	dispute.ResolvedBy = resolvedBy
	dispute.Resolution = resolution
	dispute.ResolvedAt = time.Now()
}

func generateID() string {
	return time.Now().Format("20060102150405") + "-" + randomSuffix()
}

func randomSuffix() string {
	return "xxxx"
}
