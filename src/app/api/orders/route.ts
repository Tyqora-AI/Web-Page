import { randomBytes } from "node:crypto";
import { sessionUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { invalid, orderSchema } from "@/lib/validation";

export async function GET() {
  const id = await sessionUserId(); if (!id) return Response.json({ error: "Please sign in to continue." }, { status: 401 });
  try { const rows = await db()`SELECT o.id,o.quantity,o.total_cents AS "totalCents",o.status,o.created_at AS "createdAt",p.name AS "productName",p.id AS "productId" FROM orders o JOIN products p ON p.id=o.product_id WHERE o.user_id=${id} ORDER BY o.created_at DESC`; return Response.json({ orders: rows }); }
  catch (error) { console.error(error); return Response.json({ error: "Orders are temporarily unavailable." }, { status: 500 }); }
}
export async function POST(request: Request) {
  const userId = await sessionUserId(); if (!userId) return Response.json({ error: "Please sign in to continue." }, { status: 401 });
  try { const parsed = orderSchema.safeParse(await request.json()); if (!parsed.success) return invalid("Complete all required delivery fields."); const { productId, quantity, delivery: d } = parsed.data; const sql = db(); const products = await sql`SELECT price_cents FROM products WHERE id=${productId} AND status='available' LIMIT 1`; if (!products.length) return invalid("This product is not currently available."); const orderId = `TYQ-${Date.now().toString(36).toUpperCase()}-${randomBytes(2).toString("hex").toUpperCase()}`; await sql`INSERT INTO orders (id,user_id,product_id,quantity,total_cents,recipient_name,phone,address,city,region,country,postal_code,notes) VALUES (${orderId},${userId},${productId},${quantity},${Number(products[0].price_cents)*quantity},${d.name},${d.phone},${d.address},${d.city},${d.region},${d.country},${d.postalCode},${d.notes})`; return Response.json({ order: { id: orderId, status: "Request received" } }, { status: 201 }); }
  catch (error) { console.error(error); return Response.json({ error: "Order request could not be submitted." }, { status: 500 }); }
}
