package wallet

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

func B2BTransfer(ctx context.Context, pool *pgxpool.Pool, from, to *Wallet, amount float64, reference string) error {
	tx, err := pool.Begin(ctx)
	if err != nil {
		return fmt.Errorf("begin tx: %w", err)
	}
	defer tx.Rollback(ctx)

	deductQuery := `UPDATE wallets SET balance = balance - $1, updated_at = $2 WHERE id = $3 AND balance >= $1`
	tag, err := tx.Exec(ctx, deductQuery, amount, time.Now(), from.ID)
	if err != nil {
		return fmt.Errorf("deduct from sender: %w", err)
	}
	if tag.RowsAffected() == 0 {
		return fmt.Errorf("insufficient funds or wallet not found")
	}

	creditQuery := `UPDATE wallets SET balance = balance + $1, updated_at = $2 WHERE id = $3`
	_, err = tx.Exec(ctx, creditQuery, amount, time.Now(), to.ID)
	if err != nil {
		return fmt.Errorf("credit recipient: %w", err)
	}

	fromEntry := &LedgerEntry{
		ID:        uuid.New().String(),
		WalletID:  from.ID,
		Amount:    -amount,
		Type:      "transfer_out",
		Reference: reference,
		Metadata:  to.UserID,
		CreatedAt: time.Now(),
	}
	toEntry := &LedgerEntry{
		ID:        uuid.New().String(),
		WalletID:  to.ID,
		Amount:    amount,
		Type:      "transfer_in",
		Reference: reference,
		Metadata:  from.UserID,
		CreatedAt: time.Now(),
	}

	ledgerQuery := `INSERT INTO wallet_ledger (id, wallet_id, amount, type, reference, metadata, created_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7)`
	_, err = tx.Exec(ctx, ledgerQuery,
		fromEntry.ID, fromEntry.WalletID, fromEntry.Amount, fromEntry.Type, fromEntry.Reference, fromEntry.Metadata, fromEntry.CreatedAt,
	)
	if err != nil {
		return fmt.Errorf("insert from ledger: %w", err)
	}

	_, err = tx.Exec(ctx, ledgerQuery,
		toEntry.ID, toEntry.WalletID, toEntry.Amount, toEntry.Type, toEntry.Reference, toEntry.Metadata, toEntry.CreatedAt,
	)
	if err != nil {
		return fmt.Errorf("insert to ledger: %w", err)
	}

	return tx.Commit(ctx)
}
