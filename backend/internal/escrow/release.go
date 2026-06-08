package escrow

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"
)

func ReleaseFundsToSupplier(ctx context.Context, pool *pgxpool.Pool, escrow *EscrowOrder) error {
	tx, err := pool.Begin(ctx)
	if err != nil {
		return fmt.Errorf("begin tx: %w", err)
	}
	defer tx.Rollback(ctx)

	updateEscrow := `UPDATE escrow_orders SET status = 'released', released_at = NOW(), updated_at = NOW() WHERE id = $1 AND status = 'held'`
	tag, err := tx.Exec(ctx, updateEscrow, escrow.ID)
	if err != nil {
		return fmt.Errorf("update escrow status: %w", err)
	}
	if tag.RowsAffected() == 0 {
		return fmt.Errorf("escrow not in held status or not found")
	}

	creditSupplier := `UPDATE wallets SET balance = balance + $1, updated_at = NOW() WHERE user_id = $2`
	_, err = tx.Exec(ctx, creditSupplier, escrow.Amount, escrow.SupplierID)
	if err != nil {
		return fmt.Errorf("credit supplier: %w", err)
	}

	insertLedger := `INSERT INTO wallet_ledger (id, user_id, amount, type, reference, created_at)
		VALUES (gen_random_uuid(), $1, $2, 'escrow_release', $3, NOW())`
	_, err = tx.Exec(ctx, insertLedger, escrow.SupplierID, escrow.Amount, escrow.ID)
	if err != nil {
		return fmt.Errorf("insert ledger entry: %w", err)
	}

	return tx.Commit(ctx)
}
