import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { sessionUserId } from "@/lib/auth";
import { db, publicUser } from "@/lib/db";
import { PortalClient } from "./portal-client";

export const metadata: Metadata = { title: "Customer portal" };
export default async function PortalPage(){const id=await sessionUserId();if(!id)redirect("/account?next=/portal");const sql=db();const users=await sql`SELECT * FROM users WHERE id=${id} LIMIT 1`;if(!users.length)redirect("/account");const orders=await sql`SELECT o.id,o.quantity,o.total_cents AS "totalCents",o.status,o.created_at AS "createdAt",p.name AS "productName" FROM orders o JOIN products p ON p.id=o.product_id WHERE o.user_id=${id} ORDER BY o.created_at DESC`;return <PortalClient initialUser={publicUser(users[0])} initialOrders={orders as unknown as Order[]}/>}
export type Order={id:string;quantity:number;totalCents:number;status:string;createdAt:string;productName:string};
