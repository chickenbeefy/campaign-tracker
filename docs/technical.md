# Next.js Platform Template

**Document type:** Template architecture and extension guide

## 1. Purpose

This repository is a clean starter for teams building products on Next.js App Router.

It is designed to provide:

- a single-app flat structure that stays easy to reason about
- a working Better Auth baseline
- neutral billing and tenancy posture until the app team makes real decisions
- shared checklists so teams decide the hard things up front instead of patching them in later

If the product later grows into multiple apps or shared packages, promote to a monorepo deliberately rather than starting there.

## 2. Structure

- `app/`
  - Next.js App Router application
  - route groups for `(marketing)`, `(auth)`, and `(protected)`
  - Better Auth route handler at `app/api/auth/[...all]/route.ts`
  - starter `sign-in`, `sign-up`, `verify-email`, `forgot-password`, `reset-password`, and protected route examples
- `components/`
  - cross-route app-specific components
  - `components/ui/` holds shadcn-style primitives (the registry target)
- `lib/`
  - server helpers, Better Auth server config (`lib/auth.ts`), client (`lib/auth-client.ts`), utility helpers
- `hooks/`
  - shared React hooks
- `docs/`
  - process documents, this technical guide, and per-project briefs (when a product is being built)

Recommended future additions (only when the product actually needs them):

- a dedicated backend or BFF — promote to a monorepo (`apps/web`, `apps/api`) at that point
- background workers or scheduled jobs — same
- shared packages — only when code is genuinely reused across more than one app

## 3. Where Product Code Should Go

Use these defaults unless the app has a documented reason to diverge.

- `app/`
  - route files, layouts, loading states, and route-group structure
- `app/(segment)/_components`, `_lib`, `_hooks`
  - route-local support files that should stay close to one route section without becoming routes
- `app/(marketing)/`
  - public landing or overview routes
- `app/(auth)/`
  - sign-in, sign-up, password reset, and other auth-facing routes
- `app/(protected)/`
  - authenticated app surfaces behind the protected layout
- `components/`
  - cross-route app-specific components that are reused across more than one route section
- `components/ui/`
  - shadcn-style reusable primitives (button, input, dialog, etc.)
- `lib/`
  - cross-route auth wiring, server helpers, integrations, and app-local utilities
- `hooks/`
  - app-local hooks

Next.js private folders are the default colocation tool for route-owned code.

Examples:

- `app/(auth)/_components/email-password-card.tsx`
- `app/(marketing)/_components/template-home.tsx`
- `app/(protected)/_components/sign-out-button.tsx`

## 4. Colocation And File Purpose Rules

Use a colocate-first approach.

That means:

- keep code as close as possible to where it is used
- keep route-specific code near the route section that owns it
- prefer route-local private folders before top-level app folders
- only promote a helper into `lib/` or a component into `components/` when at least two real consumers need it

Default rules:

- one file or module should have one clear purpose
- one file or module should have one clear reason to change
- do not create broad dumping-ground folders like `utils`, `helpers`, or `services` by default
- if a helper is only used by one route area, keep it local to that area
- keep tests close to the component, route, or helper they cover

The goal is to avoid fake structure and keep ownership obvious.

## 5. Protected Area Pattern

The default protected boundary for this template is:

- `app/(protected)/layout.tsx`

This layout is the auth gate for protected routes.

Protected pages should live under that route group, for example:

- `app/(protected)/app/page.tsx`

This keeps authentication checks centralized instead of repeating them on every page.

## 6. Folders Teams Should Not Edit

Do not write product code in generated or installed folders such as:

- `.next/`
- `node_modules/`

Those folders are build output or dependencies, not source code.

## 7. Auth Posture

Better Auth is the auth baseline for this template.

Current auth scope:

- email/password enabled
- route handler mounted at `/api/auth/[...all]`
- sign-in, sign-up, verify-email, forgot-password, and reset-password pages included
- protected route example included
- auth schema bootstrap is handled from the repo root with `npm run auth:migrate`
- optional SQL output can be generated with `npm run auth:generate`
- any Postgres works via `pg` (Supabase, Neon, local, or a VPS instance)
- starter email delivery logs verification and reset links to the server console until a real provider is added

Current non-decisions:

- no forced tenant model
- no forced organization model
- no forced hierarchy beyond "authenticated user"
- no forced onboarding path

Those choices belong in `docs/process/app-initialization-checklist.md`.

Once the tenant direction is real, use `docs/process/tenant-and-organization-follow-up.md` before turning the repo toward single-tenant, app-owned multi-tenant, or organization-plugin behavior.

If auth plugins or schema-affecting auth config change later, rerun the Better Auth bootstrap flow before assuming the database is current.

## 8. Billing Posture

Billing is intentionally kept out of the template core.

- no provider lock-in
- no assumption about per-seat, flat-rate, usage-based, or subscription pricing
- no billing code ships with the starter — the `docs/process/billing-and-entitlements-follow-up.md` doc covers how to add it once the pricing model is real

When billing answers are real, add provider code (for example a Polar or Stripe webhook handler in `app/api/`), keep entitlement logic separate from provider logic, and update the follow-up doc with the decisions.

## 9. Testing Posture

This template ships with a Vitest config at the repo root and a baseline test for the auth URL helper (`app/(auth)/_lib/auth-urls.test.ts`).

Use `docs/process/testing-baseline.md` before deciding whether the app also needs React Testing Library, Playwright, or integration tests against a real database.

## 10. Extension Principles

Before turning this template into a product repo, decide:

- single-tenant vs multi-tenant
- whether organizations are required
- user hierarchy and role depth
- onboarding model
- billing subject and pricing model
- how modules or feature gates should work

The template stays clean by making those decisions explicit instead of burying them in starter code.
