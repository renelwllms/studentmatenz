# StudentMate NZ

Production-ready marketing site and web app for international student support in New Zealand.

## Stack
- Next.js (App Router) + TypeScript
- Tailwind CSS
- Prisma + Postgres
- NextAuth (credentials-based)
- React Hook Form + Zod
- Framer Motion

## Setup
```bash
npm install
```

Create `.env` from the example:
```bash
cp .env.example .env
```

Run Prisma migrations and seed data:
```bash
npx prisma migrate dev --name init
npx prisma db seed
```

Start the dev server:
```bash
npm run dev
```

## Default access
- Admin login uses `ADMIN_EMAIL` + `ADMIN_PASSWORD` from `.env`.
- Seeded student portal code: `SM-1234` with phone `+64000000000`.

## Scripts
- `npm run dev` – local dev
- `npm run build` – production build
- `npm run start` – start production server

## Project structure
- `app/(marketing)` – marketing pages
- `app/(app)` – web app routes
- `app/api` – API routes
- `prisma/schema.prisma` – database schema
- `prisma/seed.ts` – seed data

## Deployment notes
- Deploy Next.js on Vercel
- Use a managed Postgres database (Supabase/Neon)
- Set `DATABASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`
- Configure `WHATSAPP_PROVIDER` to `mock`, `twilio`, or `meta`

## Disclaimers
- We are not licensed immigration advisers. We provide settlement guidance and practical support only.
- Emergency: Call 111 for Police/Fire/Ambulance in New Zealand.
