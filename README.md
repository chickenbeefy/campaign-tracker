# Next.js Template

Next.js App Router starter with Better Auth and PostgreSQL, wired up so you can go straight to the feature you're building.

## Stack

- Next.js 16 App Router (Turbopack)
- React 19
- Better Auth (email/password, verification, password reset)
- PostgreSQL via `pg`
- Tailwind CSS v4
- shadcn/ui primitives

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Set env vars

```bash
cp .env.example .env.local
```

Fill in:

- `DATABASE_URL` — Postgres connection string
- `BETTER_AUTH_SECRET` — 32+ char secret (`openssl rand -base64 32`)
- `BETTER_AUTH_URL` — e.g. `http://localhost:3000`

### 3. Create the Better Auth tables

```bash
npm run auth:migrate
```

### 4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Run on a different port with `PORT=3001 npm run dev`.

## Structure

- `app/` — routes and layouts
- `components/` — React components (shadcn primitives in `components/ui/`)
- `lib/` — helpers, Better Auth server config
- `hooks/` — React hooks

## Routes

| Route | Purpose |
|---|---|
| `/` | Landing page |
| `/sign-in` | Sign in |
| `/sign-up` | Create account |
| `/forgot-password` | Request reset link |
| `/reset-password` | Reset password with token |
| `/verify-email` | Email verification |
| `/app` | Protected route (requires session) |

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |
| `npm run test` | Vitest |
| `npm run auth:migrate` | Create Better Auth tables |
| `npm run auth:generate` | Regenerate `better-auth.schema.sql` |
