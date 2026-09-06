import { sessionUserId } from "@/lib/auth";
import { db, publicUser } from "@/lib/db";
import { invalid, profileSchema } from "@/lib/validation";

export async function PATCH(request: Request) {
  const id = await sessionUserId(); if (!id) return Response.json({ error: "Please sign in to continue." }, { status: 401 });
  let body: unknown;
  try { body = await request.json(); }
  catch { return invalid("Request body must be valid JSON."); }
  try { const parsed = profileSchema.safeParse(body); if (!parsed.success) return invalid(); const v = parsed.data; const rows = await db()`UPDATE users SET name=${v.name},organization=${v.organization},role=${v.role},country=${v.country},updated_at=NOW() WHERE id=${id} RETURNING *`; return Response.json({ user: publicUser(rows[0]) }); }
  catch (error) { console.error(error); return Response.json({ error: "Profile could not be updated." }, { status: 500 }); }
}
