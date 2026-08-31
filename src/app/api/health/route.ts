export function GET() {
  return Response.json({
    status: "ok",
    service: "tyqora-web",
    ...(process.env.NODE_ENV !== "production" ? {
      setup: { database: Boolean(process.env.DATABASE_URL), authentication: Boolean(process.env.AUTH_SECRET) },
    } : {}),
  });
}
