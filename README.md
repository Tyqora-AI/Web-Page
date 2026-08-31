# Tyqora healthcare platform

A modern full-stack healthcare product website built with Next.js 16, React 19, TypeScript, Neon Postgres, and secure cookie authentication. The application uses the `src/` directory and is configured for Vercel.

## Project structure

```text
src/
  app/                 Next.js pages and serverless API routes
    account/           Registration and sign-in
    checkout/          Authenticated order workflow
    portal/            Customer dashboard
    product/           Product experience
    api/               Authentication, profile, order, and inquiry APIs
  components/          Shared interface components
  lib/                 Database, session, and validation utilities
db/schema.sql          Neon/Postgres schema
vercel.json            Vercel configuration
```

`tyqora-website.html` is retained only as the original design reference.

## Local development

1. Run `npm install`.
2. Copy `.env.example` to `.env.local` and provide `DATABASE_URL` and `AUTH_SECRET`.
3. Run [`db/schema.sql`](db/schema.sql) in the Neon SQL editor once.
4. Run `npm run dev` and open `http://localhost:3000`.

## Deploy to Vercel

1. Push the repository to GitHub, GitLab, or Bitbucket and import it into Vercel.
2. In the project dashboard, open **Storage → Create Database**, choose Neon, and connect it.
3. Add `AUTH_SECRET` as a sensitive environment variable and set `NEXT_PUBLIC_SITE_URL` to the production HTTPS URL.
4. Run `db/schema.sql` in Neon, then deploy. Vercel detects Next.js automatically.

Use `vercel env pull .env.local` to obtain Vercel-provisioned variables locally.

## Quality checks

```bash
npm run lint
npm run typecheck
npm run build
```

Before public launch, obtain clinical, regulatory, privacy, commercial, and legal approval for all product claims and market-specific workflows.
