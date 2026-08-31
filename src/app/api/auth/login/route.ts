import { compare } from "bcryptjs";
import { createSession } from "@/lib/auth";
import { db, publicUser } from "@/lib/db";
import { invalid, loginSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const parsed = loginSchema.safeParse(await request.json()); if (!parsed.success) return invalid();
    const rows = await db()`SELECT * FROM users WHERE email=${parsed.data.email} LIMIT 1`;
    if (!rows.length || !await compare(parsed.data.password, String(rows[0].password_hash))) return Response.json({ error: "Email or password is incorrect." }, { status: 401 });
    await createSession(String(rows[0].id)); return Response.json({ user: publicUser(rows[0]) });
  } catch (error) {
    console.error(error);
    const missingSetup = process.env.NODE_ENV !== "production" && error instanceof Error && error.message.includes("DATABASE_URL");
    return Response.json({ error: missingSetup ? "Local database is not configured. Add DATABASE_URL to .env.local, run the database schema, and restart the development server." : "Sign-in is temporarily unavailable." }, { status: 500 });
  }
}
