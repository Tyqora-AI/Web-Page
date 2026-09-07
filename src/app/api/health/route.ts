import { db, getDatabaseUrl } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const checks = {
    databaseUrl: Boolean(getDatabaseUrl()),
    authSecret: Boolean(process.env.AUTH_SECRET && process.env.AUTH_SECRET.length >= 32),
    databaseConnection: false,
    schema: false,
  };

  if (checks.databaseUrl) {
    try {
      const rows = await db()`SELECT
        to_regclass('public.users') IS NOT NULL AS users,
        to_regclass('public.products') IS NOT NULL AS products,
        to_regclass('public.orders') IS NOT NULL AS orders,
        to_regclass('public.inquiries') IS NOT NULL AS inquiries`;
      checks.databaseConnection = true;
      checks.schema = Boolean(rows[0]?.users && rows[0]?.products && rows[0]?.orders && rows[0]?.inquiries);
    } catch (error) {
      console.error("Health-check database failure", error);
    }
  }

  const ready = Object.values(checks).every(Boolean);
  return Response.json(
    { status: ready ? "ready" : "setup_required", service: "tyqora-web", checks },
    { status: ready ? 200 : 503, headers: { "Cache-Control": "no-store" } },
  );
}
