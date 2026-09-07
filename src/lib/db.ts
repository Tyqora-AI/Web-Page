import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let client: NeonQueryFunction<false, false> | undefined;

export function getDatabaseUrl(): string | undefined {
  return process.env.DATABASE_URL
    || process.env.POSTGRES_URL
    || process.env.POSTGRES_URL_NON_POOLING
    || process.env.DATABASE_URL_UNPOOLED;
}

export function db(): NeonQueryFunction<false, false> {
  const url = getDatabaseUrl();
  if (!url) throw new Error("A Neon database URL is not configured");
  client ??= neon(url);
  return client;
}

export type PublicUser = {
  id: string; name: string; email: string; organization: string;
  role: string; country: string; createdAt: string;
};

export function publicUser(row: Record<string, unknown>): PublicUser {
  return {
    id: String(row.id), name: String(row.name), email: String(row.email),
    organization: String(row.organization || ""), role: String(row.role || "Healthcare professional"),
    country: String(row.country || ""), createdAt: String(row.created_at),
  };
}
