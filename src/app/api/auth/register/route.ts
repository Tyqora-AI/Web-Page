import { hash } from "bcryptjs";
import { assertSessionConfiguration, createSession } from "@/lib/auth";
import { db, publicUser } from "@/lib/db";
import { invalid, registerSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const parsed = registerSchema.safeParse(await request.json());
    if (!parsed.success) return invalid("Use a valid email and a 10+ character password with upper-case, lower-case, and numeric characters.");
    const { name, email, organization, role, password } = parsed.data;
    const sql = db();
    assertSessionConfiguration();
    const existing = await sql`SELECT id FROM users WHERE email=${email} LIMIT 1`;
    if (existing.length) return Response.json({ error: "An account with this email already exists." }, { status: 409 });
    const rows = await sql`INSERT INTO users (name,email,organization,role,password_hash) VALUES (${name},${email},${organization},${role},${await hash(password, 12)}) RETURNING *`;
    await createSession(String(rows[0].id));
    return Response.json({ user: publicUser(rows[0]) }, { status: 201 });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "";
    const missingSetup = process.env.NODE_ENV !== "production" && (message.includes("DATABASE_URL") || message.includes("AUTH_SECRET"));
    return Response.json({ error: missingSetup ? "Local authentication is not configured. Add DATABASE_URL and AUTH_SECRET to .env.local, run the database schema, and restart the development server." : "Account service is temporarily unavailable." }, { status: 500 });
  }
}
