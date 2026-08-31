import { db } from "@/lib/db";
import { inquirySchema, invalid } from "@/lib/validation";

export async function POST(request: Request) {
  try { const parsed = inquirySchema.safeParse(await request.json()); if (!parsed.success) return invalid("Please complete your name, email, and message."); const v=parsed.data; await db()`INSERT INTO inquiries (name,email,organization,message) VALUES (${v.name},${v.email},${v.organization},${v.message})`; return Response.json({ ok: true }, { status: 201 }); }
  catch (error) { console.error(error); return Response.json({ error: "Your message could not be sent." }, { status: 500 }); }
}
