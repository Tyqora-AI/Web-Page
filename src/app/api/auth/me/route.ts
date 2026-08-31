import { sessionUserId } from "@/lib/auth";
import { db, publicUser } from "@/lib/db";

export async function GET() {
  try { const id = await sessionUserId(); if (!id) return Response.json({ user: null }); const rows = await db()`SELECT * FROM users WHERE id=${id} LIMIT 1`; return Response.json({ user: rows.length ? publicUser(rows[0]) : null }); }
  catch (error) { console.error(error); return Response.json({ error: "Account service unavailable." }, { status: 500 }); }
}
