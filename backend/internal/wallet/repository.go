package wallet

import (
	"context"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Wallet struct {
	ID        string    `json:"id"`
	UserID    string    `json:"user_id"`
	Balance   float64   `json:"balance"`
	Currency  string    `json:"currency"`
	Role      string    `json:"role"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type LedgerEntry struct {
	ID        string    `json:"id"`
	WalletID  string    `json:"wallet_id"`
	Amount    float64   `json:"amount"`
	Type      string    `json:"type"`
	Reference string    `json:"reference"`
	Metadata  string    `json:"metadata,omitempty"`
	CreatedAt time.Time `json:"created_at"`
}

type Repository struct {
	pool *pgxpool.Pool
}

func NewRepository(pool *pgxpool.Pool) *Repository {
	return &Repository{pool: pool}
}

func (r *Repository) GetWallet(ctx context.Context, userID string) (*Wallet, error) {
	query := `SELECT w.id, w.user_id, w.balance, w.currency, u.role, w.created_at, w.updated_at
		FROM wallets w JOIN users u ON u.id = w.user_id WHERE w.user_id = $1`
	w := &Wallet{}
	err := r.pool.QueryRow(ctx, query, userID).Scan(
		&w.ID, &w.UserID, &w.Balance, &w.Currency, &w.Role, &w.CreatedAt, &w.UpdatedAt,
	)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, fmt.Errorf("wallet not found")
		}
		return nil, fmt.Errorf("query wallet: %w", err)
	}
	return w, nil
}

func (r *Repository) GetWalletForUpdate(ctx context.Context, userID string) (*Wallet, error) {
	query := `SELECT w.id, w.user_id, w.balance, w.currency, u.role, w.created_at, w.updated_at
		FROM wallets w JOIN users u ON u.id = w.user_id WHERE w.user_id = $1 FOR UPDATE`
	w := &Wallet{}
	err := r.pool.QueryRow(ctx, query, userID).Scan(
		&w.ID, &w.UserID, &w.Balance, &w.Currency, &w.Role, &w.CreatedAt, &w.UpdatedAt,
	)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, fmt.Errorf("wallet not found")
		}
		return nil, fmt.Errorf("query wallet for update: %w", err)
	}
	return w, nil
}

func (r *Repository) UpdateWalletBalanceTx(ctx context.Context, tx pgx.Tx, wallet *Wallet) error {
	query := `UPDATE wallets SET balance = $1, updated_at = $2 WHERE id = $3`
	_, err := tx.Exec(ctx, query, wallet.Balance, wallet.UpdatedAt, wallet.ID)
	if err != nil {
		return fmt.Errorf("update wallet balance: %w", err)
	}
	return nil
}

func (r *Repository) InsertLedgerEntryTx(ctx context.Context, tx pgx.Tx, entry *LedgerEntry) error {
	query := `INSERT INTO wallet_ledger (id, wallet_id, amount, type, reference, metadata, created_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7)`
	_, err := tx.Exec(ctx, query,
		entry.ID, entry.WalletID, entry.Amount, entry.Type, entry.Reference, entry.Metadata, entry.CreatedAt,
	)
	if err != nil {
		return fmt.Errorf("insert ledger entry: %w", err)
	}
	return nil
}

func (r *Repository) GetLedger(ctx context.Context, walletID string) ([]LedgerEntry, error) {
	query := `SELECT id, wallet_id, amount, type, reference, COALESCE(metadata, ''), created_at
		FROM wallet_ledger WHERE wallet_id = $1 ORDER BY created_at DESC LIMIT 50`
	rows, err := r.pool.Query(ctx, query, walletID)
	if err != nil {
		return nil, fmt.Errorf("query ledger: %w", err)
	}
	defer rows.Close()

	var entries []LedgerEntry
	for rows.Next() {
		var e LedgerEntry
		err := rows.Scan(&e.ID, &e.WalletID, &e.Amount, &e.Type, &e.Reference, &e.Metadata, &e.CreatedAt)
		if err != nil {
			return nil, fmt.Errorf("scan ledger: %w", err)
		}
		entries = append(entries, e)
	}
	return entries, nil
}
