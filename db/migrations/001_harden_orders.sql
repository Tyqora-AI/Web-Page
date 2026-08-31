-- Apply this only if db/schema.sql was run before idempotent orders were added.
ALTER TABLE orders ADD COLUMN IF NOT EXISTS idempotency_key VARCHAR(64);
UPDATE orders SET idempotency_key = id WHERE idempotency_key IS NULL;
ALTER TABLE orders ALTER COLUMN idempotency_key SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'orders_user_idempotency_unique') THEN
    ALTER TABLE orders ADD CONSTRAINT orders_user_idempotency_unique UNIQUE (user_id, idempotency_key);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'orders_total_cents_positive') THEN
    ALTER TABLE orders ADD CONSTRAINT orders_total_cents_positive CHECK (total_cents > 0);
  END IF;
END $$;
