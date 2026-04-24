# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Campaign & Lead Tracker — a mock marketing tool where users manually create campaigns and generate AI ad copy variants using Gemini 2.5 Flash. No live ad-platform integration.

Full spec is at `docs/project.md`. Read it before touching any code.

## Commands

```bash
PORT=3001 npm run dev      # dev server (always use port 3001)
npm run build              # production build — run before every commit
npm run auth:migrate       # apply Better Auth schema migrations
```

Database (`DATABASE_URL` in `.env.local`):
```bash
psql "$DATABASE_URL"       # connect directly
```

## Architecture

### Database layer

Raw SQL via `pg`. Add `lib/db.ts` with a `Pool` singleton. Migrations are plain `.sql` files — run them with `psql` and commit the file. No ORM, no migration runner.

### Routes to build

| Route | Notes |
|---|---|
| `/` | Landing — links to sign-in or dashboard |
| `/dashboard` | Aggregate totals + top-5 table, auth-guarded |
| `/campaigns` | List all campaigns, auth-guarded |
| `/campaigns/new` | Create form + server action |
| `/campaigns/[id]` | Detail + ad copy list + AI generate button |
| `/campaigns/[id]/edit` | Edit form + server action |

### AI agent

Entry point: `app/campaigns/[id]/generate-copy/action.ts` (server action).

- Calls `generateObject` (Vercel AI SDK) with `google('gemini-2.5-flash')`
- Two tools: `getTopCampaignsByChannel` (`lib/tools/get-top-campaigns.ts`, required) + `google_search` (optional Gemini grounding)
- `stopWhen: stepCountIs(5)` caps the loop
- Output schema: `{ variants: [{ angle: 'benefits'|'urgency'|'question', copy_text: string }] }` — exactly 3
- Saves all 3 as `ad_copy` rows linked to the campaign
- Debug tool calls: log `result.steps`

### Database schema

`campaigns`: `id` (uuid PK), `name`, `channel` (meta_ads/google_ads/email/other), `start_date`, `end_date` (nullable), `spend_zar` (bigint rands), `leads_count` (int default 0), `status` (planned/live/ended), `notes`, `created_at`

`ad_copy`: `id` (uuid PK), `campaign_id` (FK → campaigns.id, ON DELETE CASCADE), `angle` (benefits/urgency/question), `copy_text`, `created_at`

## Commit format

`type(scope): description` — one commit per working feature.
Types: `feat`, `fix`, `chore`, `docs`

---

This file mirrors the repo operating rules in `AGENTS.md` for Claude-based agents.

If `CLAUDE.md` and `AGENTS.md` ever diverge, follow `AGENTS.md`.

## Scope

These instructions apply to this repository.

Read this file before making architectural, auth, tenancy, state, data-access, workflow, UI-system, or monorepo-boundary changes.

## Source Of Truth

Use these documents as the primary operating standard:

- `docs/process/product-engineering-sop.md`
- `docs/process/engineering-workflow.md`
- `docs/process/security-baseline.md`
- `docs/process/app-initialization-checklist.md`
- `docs/process/phase-0-product-architecture.md` when it exists for the app
- `docs/process/tenant-and-organization-follow-up.md`
- `docs/process/billing-and-entitlements-follow-up.md`
- `docs/process/testing-baseline.md`
- `docs/technical.md`

Do not silently diverge from the documented architecture or workflow.

## Working Posture

This repository follows a planning-first engineering process.

Before significant implementation work, confirm:

- product vision
- user hierarchy
- tenancy model
- billing model
- access-control model
- ownership boundaries
- backend posture
- module strategy

If those are not clear, finish the checklist first, then record the agreed answers in `docs/process/phase-0-product-architecture.md` before coding deeper.

## Default Stack Posture

Unless the repo docs say otherwise, assume:

- Next.js 16 App Router (Turbopack) as the main app and default BFF
- React 19
- `npm`
- Better Auth for authentication (server config in `lib/auth.ts`, client in `lib/auth-client.ts`)
- Postgres-ready data access via `pg` (raw queries; add an ORM only when the schema justifies it)
- shadcn-style UI primitives in `components/ui/`
- Single-app flat layout — routes in `app/`, components in `components/`, helpers in `lib/`, hooks in `hooks/`

## Implementation Rules

- Prefer no direct `useEffect` for normal application patterns.
- Use TanStack Query for server state when query-backed data is introduced.
- Use client UI stores only for transient UI state.
- Keep tenant and access boundaries explicit.
- Keep auth boundaries explicit.
- Keep billing provider logic separate from entitlement logic.
- Prefer existing UI primitives before building new ones.
- Prefer route-local private folders such as `app/(segment)/_components`, `_lib`, and `_hooks` before promoting code into top-level app folders.
- Be deliberate about dependency selection and avoid weakly maintained packages by default.
- Treat manifest and lockfile changes as reviewable security surface.
- Keep secrets out of source control, out of the client, and out of logs.

## Skill-First And MCP-First Rule

If a relevant skill, MCP, or official docs path exists for the task, use it before implementing.

Default order:

1. repo docs
2. relevant skill or MCP
3. official docs
4. implementation

During repo initialization, install the baseline `skill.sh` set for this template:

- Read `docs/process/app-initialization-checklist.md` first and turn the final answers into `docs/process/phase-0-product-architecture.md`.
- `vercel-react-best-practices`
- `vercel-composition-patterns`
- `better-auth-best-practices`
- `create-auth-skill`

Add `monorepo-management` only if the project evolves into a workspace or Turborepo setup. Add `organization-best-practices` only when the product explicitly commits to organizations, teams, or tenant-aware member management.

## Branching And Delivery

- Branch from `staging` for normal product work unless the repo says otherwise.
- Keep one main concern per branch.
- Use PRs for non-trivial work.
- Keep branches short-lived to reduce merge conflicts.
- Treat `staging` as the normal integration branch and `main` as the protected production branch.
- Update docs when workflow, auth, or architecture assumptions change.

## Verification

For non-trivial work, run:

- lint
- test
- typecheck
- build

If stronger checks exist and are trustworthy, run them too.

## Git Hygiene

Do not add AI attribution boilerplate to commits or PRs.

Keep commit messages and PR descriptions clean and focused on the actual change.
