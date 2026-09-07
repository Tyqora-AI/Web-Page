import { readFile } from "node:fs/promises";
import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL
  || process.env.POSTGRES_URL
  || process.env.POSTGRES_URL_NON_POOLING
  || process.env.DATABASE_URL_UNPOOLED;

if (!databaseUrl) {
  throw new Error("No Neon database URL is available in the current environment.");
}

const sql = neon(databaseUrl);
const schema = await readFile(new URL("../db/schema.sql", import.meta.url), "utf8");

for (const statement of schema.split(";").map((value) => value.trim()).filter(Boolean)) {
  await sql.query(statement);
}

// These statements also bring databases created from an earlier schema up to date.
await sql.query("ALTER TABLE orders ADD COLUMN IF NOT EXISTS idempotency_key VARCHAR(64)");
await sql.query("UPDATE orders SET idempotency_key = id WHERE idempotency_key IS NULL");
await sql.query("ALTER TABLE orders ALTER COLUMN idempotency_key SET NOT NULL");

const constraints = await sql.query(
  "SELECT conname FROM pg_constraint WHERE conname IN ('orders_user_idempotency_unique', 'orders_total_cents_positive')",
);
const names = new Set(constraints.map(({ conname }) => conname));

if (!names.has("orders_user_idempotency_unique")) {
  await sql.query("ALTER TABLE orders ADD CONSTRAINT orders_user_idempotency_unique UNIQUE (user_id, idempotency_key)");
}
if (!names.has("orders_total_cents_positive")) {
  await sql.query("ALTER TABLE orders ADD CONSTRAINT orders_total_cents_positive CHECK (total_cents > 0)");
}

console.log("Tyqora database schema is ready.");
