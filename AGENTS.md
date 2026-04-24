# AGENTS.md

## Scope

These instructions apply to this repository.

Read this file before making architectural, auth, tenancy, state, data-access, workflow, UI-system, or monorepo-boundary changes.

`CLAUDE.md` should stay aligned with this file. If the two diverge, treat `AGENTS.md` as the repo-level source of truth.

## Primary Source Of Truth

- Product and architecture decisions live in `docs/process/product-engineering-sop.md`.
- Repo workflow and delivery rules live in `docs/process/engineering-workflow.md`.
- Security and dependency hygiene guidance lives in `docs/process/security-baseline.md`.
- Template topology and extension notes live in `docs/technical.md`.
- App-specific initialization decisions start in `docs/process/app-initialization-checklist.md`.
- Final recorded initialization answers belong in `docs/process/phase-0-product-architecture.md`, created from `docs/process/phase-0-product-architecture-template.md`.
- Tenant and organization follow-up guidance lives in `docs/process/tenant-and-organization-follow-up.md`.
- Billing and entitlement follow-up guidance lives in `docs/process/billing-and-entitlements-follow-up.md`.
- Testing guidance lives in `docs/process/testing-baseline.md`.
- If implementation starts drifting from the docs, update the docs instead of silently inventing a new pattern.

## Planning-First Rule

Do not turn this template into a real product by adding feature code first and figuring out the structure later.

Before meaningful implementation, confirm:

- product vision
- ICP
- user hierarchy
- tenancy model
- billing model
- access-control model
- ownership boundaries
- source-of-truth systems
- backend posture
- module strategy

If several of these are still unclear, pause, finish the checklist, and record the agreed answers in `docs/process/phase-0-product-architecture.md` before building deeper.

## Template Posture

This repository is a reusable starter, not a product build.

Keep it:

- generic
- composable
- easy to evolve into a monorepo or add a separate backend later if the product needs it
- free of hardcoded tenant, hierarchy, module, or pricing assumptions unless the checklist explicitly calls for them

The template should help teams make good decisions early, not bury those decisions in starter code.

## Stack Defaults

Unless the repo is intentionally changed, the default posture is:

- Framework: Next.js 16 App Router (Turbopack)
- UI runtime: React 19
- Package manager: `npm`
- Styling: Tailwind CSS v4 with CSS variables
- Auth: Better Auth (server config in `lib/auth.ts`, client in `lib/auth-client.ts`)
- Database posture: Postgres-ready via `pg` (raw queries; add an ORM only when the schema justifies it)
- UI primitives: shadcn-style components in `components/ui/`
- Structure: single Next.js app, flat layout

## Skills And MCPs: Required Usage

If a relevant skill, MCP, or official docs path exists for the task, use it before implementing.

Default order:

1. Repo docs
2. Relevant skill or MCP
3. Official docs
4. Implementation

Required defaults for this template:

- Before deeper implementation, read `docs/process/app-initialization-checklist.md` first and turn the final answers into `docs/process/phase-0-product-architecture.md`.
- During repo initialization, install the baseline `skill.sh` set before deeper implementation work begins.
- Baseline install set: `vercel-react-best-practices`, `vercel-composition-patterns`, `better-auth-best-practices`, `create-auth-skill`.
- Add `monorepo-management` only if the project evolves into a workspace or Turborepo setup.
- Add `organization-best-practices` only when the product explicitly commits to organizations, teams, or tenant-aware member management.
- Use `vercel-react-best-practices` for Next.js, React, routing, rendering, and performance work.
- Use `vercel-composition-patterns` for reusable component APIs, provider composition, and scalable UI structure.
- Use `better-auth-best-practices` and `create-auth-skill` for Better Auth work.
- Use `organization-best-practices` only after the product has explicitly decided it needs organizations, teams, or tenant-aware invitations.
- Use `tanstack-query-best-practices` when the app starts depending on TanStack Query for server-state ownership.
- Use `postgres` for schema, access-pattern, and Postgres design work.
- Use Next.js MCP or official Next.js docs before guessing App Router behavior.
- Use Better Auth docs or MCP before guessing plugin or schema behavior.

## React Effect Policy

Prefer a no-direct-`useEffect` style in application code.

Do not add `useEffect` for:

- derived state
- prop-to-state synchronization
- pagination resets
- filter synchronization
- user-action relays
- client-side data fetching

Prefer:

- render-time derivation
- event handlers
- server components
- route handlers
- TanStack Query
- `key`-based remounting
- `useSyncExternalStore` for real subscriptions

If a new direct `useEffect` is truly necessary, document the external system being synchronized and why simpler patterns do not fit.

## State Management Rules

- TanStack Query is for server state when the app introduces query-backed data fetching.
- Zustand or similar client stores should only be used for transient UI state.
- Do not duplicate fetched data in client UI stores.
- Do not use client state as the source of truth for authentication or billing state.

Examples of good transient state:

- sidebar state
- local dialogs
- ephemeral layout controls
- edit-mode toggles

## Auth, Tenant, And Billing Rules

- Better Auth is the only auth authority in this template.
- Do not assume single-tenant or multi-tenant without updating the checklist and docs.
- Do not assume organizations, workspaces, teams, or role hierarchies unless the project has explicitly chosen them.
- Keep the starter auth baseline simple enough that teams can add organizations, SSO, provider-specific flows, and support tooling later.
- Keep billing provider-agnostic until a real product decision is made.
- Model billing through checklists, contracts, entitlements, and access helpers first.
- Do not make billing the source of truth for authentication.
- If the product will support multiple modules, keep access and entitlement logic separate from the billing provider implementation.

## Structure And Boundary Rules

- Routes, layouts, and server actions live in `app/`.
- App-specific components live in `components/`; shared shadcn-style primitives in `components/ui/`.
- Helpers, server utilities, and Better Auth config live in `lib/`.
- React hooks live in `hooks/`.
- This template is a single Next.js app. If the product grows and needs a separate backend (worker, API service, admin app), promote to a monorepo deliberately and document the ownership boundary first in `docs/technical.md`.
- Keep browser/server boundaries explicit and keep privileged credentials server-side.

## UI And Composition Rules

- Shared shadcn-style primitives belong in `components/ui/`.
- App-specific shells, sections, and flows belong in `app/` (route-local) or `components/` (cross-route).
- Keep code as close as possible to where it is used.
- For route-owned code, default to `app/(segment)/_components`, `_lib`, and `_hooks` before adding to top-level app folders.
- Only move code into shared folders or packages when at least two real consumers need it.
- Prefer files and modules with one clear purpose and one clear reason to change.
- Do not create broad dumping-ground folders like `utils`, `helpers`, or `services` by default.
- When tests are added, keep them close to the route, component, or helper they cover.
- Keep tests close to the route, component, or helper they cover.
- Prefer small composed sections over giant page components.
- Prefer provider composition and simple boundaries over boolean-prop-heavy component APIs.
- Keep the starter visually neutral; do not turn it into a product-branded landing page.
- Prefer existing local primitives before adding another UI library or one-off component system.

## Branch And PR Rules

- Branch from `staging` for normal product work unless the repo documentation is intentionally changed.
- Use readable issue-linked names such as `feature/auth-foundation`.
- Keep one main concern per branch.
- Prefer short-lived branches.
- Open PRs for non-trivial work.
- Keep PRs small enough to review coherently.
- Keep `main` protected and treat `staging` as the normal promotion branch.
- Update docs in the same change when auth, workflow, repo boundaries, or initialization assumptions change.

## Verification Defaults

For non-trivial work, run:

- lint
- test
- typecheck
- build

If the repo later adds trustworthy tests, migration checks, or security checks, include them too.

## Git Hygiene

Do not add:

- `Co-Authored-By` trailers
- `Generated with ...` lines
- AI attribution boilerplate in commits or PR descriptions

Keep git artifacts focused on the actual change.

## If Unsure

Read:

- `docs/process/product-engineering-sop.md`
- `docs/process/engineering-workflow.md`
- `docs/process/security-baseline.md`
- `docs/process/app-initialization-checklist.md`
- `docs/technical.md`

Then use the relevant skill, MCP, or official docs before implementing.
