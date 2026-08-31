import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let client: NeonQueryFunction<false, false> | undefined;

export function db(): NeonQueryFunction<false, false> {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not configured");
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
