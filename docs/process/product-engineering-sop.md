# Product Engineering SOP

## Purpose

Define the default product and engineering process for modern product teams building serious software from a planning-first posture.

This document is the upstream standard for:

- product framing
- architecture planning
- tenancy and billing design
- default stack posture
- skill and MCP usage
- implementation boundaries
- branching strategy
- merge-conflict prevention

This should be high-standard and low-ceremony. The goal is to build durable software quality without adding fake process.

## How To Use This SOP

Use this document in four moments:

1. before starting a new product or major feature track
2. before making architectural decisions that affect auth, tenancy, billing, or data ownership
3. before turning this template into a real product repository
4. when implementation starts moving faster than the product structure underneath it

The core rule is simple:

- do not start from code generation
- do not start from a mock alone
- do not start from a tool choice alone

Start from:

- the product vision
- the tenancy model
- the user hierarchy
- the billing model
- the ownership boundaries
- the implementation posture

If these are not clear, feature work should pause until they are.

## Non-Negotiable Principles

### 1. Planning is core engineering work

Planning is not pre-work or "just product stuff." It is engineering.

If tenancy, billing, access control, and ownership are unclear, implementation will be structurally wrong even if the code is clean.

### 2. The domain model comes before feature slicing

Before deciding what to build, define what entities exist and how they relate.

Examples:

- who is the customer
- who owns the data
- what is the tenant
- what is billed
- what is permissioned
- what is a workspace versus a domain record

### 3. Source-of-truth discipline beats improvisation

Use explicit documents and repo standards to shape implementation.

Do not let:

- model guesses
- ad hoc architecture
- disconnected screenshots
- local convenience

become the real source of truth.

### 4. Skills and MCPs come before custom implementation

If the project already has an approved skill, MCP, or official reference path for a problem, use it before implementing.

### 5. Default stack choices should be boring unless the use case demands otherwise

Use opinionated defaults for the common path and add extra services only when the product actually needs them.

### 6. Branches and PRs should reduce conflict surface, not increase it

Branching is not only about isolation. It is about avoiding unnecessary overlap, reducing merge pain, and making review comprehensible.

### 7. Process should stay proportional to team size

Keep the standards high, but keep the process lean.

## Phase 0: Product And Architecture Framing

This phase is mandatory before meaningful implementation begins.

In this template, Phase 0 is satisfied by completing `docs/process/app-initialization-checklist.md` and recording the final answers in `docs/process/phase-0-product-architecture.md`.

The sections below explain why each checklist area matters. They are not a second separate planning exercise.

### 0.1 Product vision

Define:

- what the product is
- what the product is not
- who it is for
- what problem it solves
- what stage it is in today
- what is intentionally deferred

At minimum, write down:

- one-paragraph product summary
- ideal customer profile
- top 3 user problems
- non-goals

### 0.2 User hierarchy

Define the real user hierarchy before feature work starts.

Questions:

- who is the buyer
- who is the primary operator
- who are secondary users
- are there internal admin or support users
- are there parent-child account relationships

Examples:

- `Platform owner -> organizations/workspaces/accounts -> members -> data`
- `Agency -> client accounts -> client members -> client data`
- `Owner -> owner-scoped data`

Do not leave this vague. User hierarchy affects auth, navigation, support tooling, invitations, and audit trails.

### 0.3 Tenancy model

Define the core tenancy boundary before feature work starts.

Questions:

- what is the top-level tenant entity
- can a user belong to one tenant or many
- does data belong to users or shared accounts
- which entities are true tenants
- which entities are just domain records
- what is isolated versus shared

Default recommendation for collaborative software:

- choose one explicit tenant boundary
- let shared business data belong to that boundary
- scope roles and permissions inside that boundary
- avoid mixing personal ownership and shared ownership without a clear reason

### 0.4 Billing model

Define the billing boundary early.

Questions:

- what entity is billed
- what does the subscription attach to
- what features are entitlement-controlled
- is billing per account, seat, usage unit, module, or hybrid
- do support users consume billable seats

Do not bolt billing on after the domain model is already written.

### 0.5 Access-control model

Define the access model before building protected features.

At minimum, document:

- read scope
- write scope
- administrative scope
- support or override scope
- audit-sensitive actions

### 0.6 Domain ownership boundaries

Define the core entities and who owns them.

This prevents confusion around:

- deletion semantics
- exports
- access checks
- RLS
- migration design
- support overrides

### 0.7 Source-of-truth model

Before building integrations, define:

- primary source systems
- mirrored systems
- derived systems
- browser-safe systems
- server-only systems

### 0.8 Success criteria and non-goals

Before implementation begins, define:

- what success looks like
- what the first release must include
- what the first release must not imply

### 0.9 Required output of Phase 0

Before implementation begins, there should be a clear artifact that covers:

- the completed reasoning from `docs/process/app-initialization-checklist.md`
- the final recorded answers in `docs/process/phase-0-product-architecture.md`
- any unresolved decisions that still block deeper implementation

That recorded output should cover:

- product summary
- ICP
- user hierarchy
- tenancy model
- billing model
- access-control model
- ownership boundaries
- source-of-truth systems
- success criteria
- non-goals

If this artifact does not exist, the project is not ready for meaningful implementation.

## Phase 1: Planning And Shaping

Once Phase 0 is clear, move into delivery planning.

### 1.1 Required inputs

- product brief or issue
- architecture assumptions
- tenancy, billing, and access model
- clear success condition

### 1.2 Useful optional inputs

- UI reference
- screenshot or mock
- second-model blind-spot review
- technical spike
- competitive examples

These are useful. They are not substitutes for Phase 0.

### 1.3 Planning outputs

Every meaningful implementation track should produce:

- a scoped game plan
- explicit assumptions
- explicit risks
- implementation slices
- PR sequence if the work is large
- what is in scope
- what is out of scope

### 1.4 Planning rule

Do not start from:

- "build this screen"
- "add this endpoint"
- "set up this service"

without first verifying the product and architecture frame that the work belongs inside.

## Phase 2: Default Stack Posture

These are the default stack decisions unless the project has a documented reason to diverge.

### 2.1 Frontend and BFF

Default:

- `Next.js`

Reason:

- strong frontend delivery defaults
- a built-in BFF layer
- clear browser-to-server boundaries
- enough power for many small-to-medium product footprints
- a good fit for mixed products where app flows, admin areas, settings, and marketing or docs surfaces live together

### 2.2 Authentication

Default:

- `Better Auth`

### 2.3 Database

Default:

- `Postgres`

### 2.4 Server state

Default:

- `TanStack Query`

### 2.5 Client UI state

Default:

- `Zustand`

Rule:

- use it for transient UI state only
- do not use it for fetched datasets
- do not use it for auth truth
- do not use it to duplicate server caches

### 2.6 React effect policy

Default:

- no direct `useEffect` unless clearly justified

Prefer:

- render-time derivation
- event handlers
- server components
- query abstractions
- `key`-based resets
- `useSyncExternalStore`
- purpose-built subscription hooks

### 2.7 Backend rule

Default:

- use `Next.js` as frontend plus BFF first

Move to a dedicated backend only when the use case clearly demands it.

Good triggers for a dedicated backend:

- multiple clients need the same API
- service boundaries are becoming real
- throughput or concurrency needs independent scaling
- event-driven behavior is central
- background jobs justify separation

If the app-initialization checklist says "one web app is enough for now," use these triggers as the test for when that answer should change.

## Phase 3: Skill-First And MCP-First Implementation

### 3.1 Core rule

If a repo-approved skill, MCP, or official reference path already exists for the area, use it before implementing.

### 3.2 Local skills before improvisation

Use the relevant local skill when it exists.

Examples:

- framework guidance before inventing custom Next.js patterns
- auth guidance before inventing Better Auth conventions
- composition guidance before bloated component APIs
- database guidance before ad hoc schema decisions
- monorepo guidance before package sprawl

### 3.3 MCPs before generic web search

Use MCP tools first when available.

Examples:

- Next.js MCP for framework behavior and runtime diagnostics
- Better Auth MCP for auth and plugin behavior
- official framework docs for routing and deployment behavior

### 3.4 Repo state over detached snapshots

Prefer working from:

- checked-out branch state
- real repo docs
- current diffs
- project-specific tooling
- official framework or library docs

instead of relying on detached snapshots as the primary engineering context.

### 3.5 Approved reference set

These links are approved upstream references for the current stack and workflow posture.

#### Skills and engineering references

- [git-commit](https://skills.sh/github/awesome-copilot/git-commit)
- [userinterface-wiki](https://skills.sh/raphaelsalaja/userinterface-wiki/userinterface-wiki)
- [tanstack-query-best-practices](https://skills.sh/deckardger/tanstack-agent-skills/tanstack-query-best-practices)
- [next-best-practices](https://skills.sh/vercel-labs/next-skills/next-best-practices)
- [shadcn](https://skills.sh/shadcn/ui/shadcn)
- [better-auth-best-practices](https://skills.sh/better-auth/skills/better-auth-best-practices)
- [better-auth-security-best-practices](https://skills.sh/better-auth/skills/better-auth-security-best-practices)
- [create-auth-skill](https://skills.sh/better-auth/skills/create-auth-skill)
- [organization-best-practices](https://skills.sh/better-auth/skills/organization-best-practices)
- [postgresql-code-review](https://skills.sh/github/awesome-copilot/postgresql-code-review)
- [postgres](https://skills.sh/planetscale/database-skills/postgres)
- [postgresql-optimization](https://skills.sh/github/awesome-copilot/postgresql-optimization)
- [vercel-react-best-practices](https://skills.sh/vercel-labs/agent-skills/vercel-react-best-practices)
- [vercel-composition-patterns](https://skills.sh/vercel-labs/agent-skills/vercel-composition-patterns)

#### MCP and official documentation references

- [shadcn MCP docs](https://ui.shadcn.com/docs/mcp)
- [Next.js MCP guide](https://nextjs.org/docs/app/guides/mcp)
- [Upstash Context7](https://github.com/upstash/context7)
- [Better Auth AI resources](https://better-auth.com/docs/ai-resources)

#### Security references

- [OpenSSF Scorecard](https://scorecard.dev/)
- [npm trusted publishers](https://docs.npmjs.com/trusted-publishers/)
- [npm provenance](https://docs.npmjs.com/generating-provenance-statements/)
- [npm organization 2FA](https://docs.npmjs.com/requiring-two-factor-authentication-in-your-organization/)
- [GitHub dependency review](https://docs.github.com/en/code-security/concepts/supply-chain-security/about-dependency-review)
- [GitHub code scanning](https://docs.github.com/en/code-security/concepts/code-scanning/about-code-scanning)
- [GitHub secret scanning](https://docs.github.com/en/code-security/concepts/secret-security/about-secret-scanning)
- [GitHub Dependabot version updates](https://docs.github.com/en/code-security/concepts/supply-chain-security/about-dependabot-version-updates)
- [Next.js Content Security Policy guide](https://nextjs.org/docs/app/guides/content-security-policy)
- [Better Auth security reference](https://better-auth.com/docs/reference/security)

### 3.6 Local preference rule

When both a local installed skill and an external reference exist:

- use the local installed skill first
- use the external link as upstream reference or confirmation path

This keeps implementation aligned with the actual working environment.

## Phase 4: Implementation Principles

### 4.1 Pragmatic SOLID

Use SOLID as an engineering filter, not as an excuse to over-abstract.

Expect:

- single-purpose modules where practical
- one clear reason to change per file or module where practical
- stable boundaries between concerns
- composition over inheritance
- abstractions that reduce coupling

Avoid:

- interface sprawl
- abstraction without multiple real consumers
- splitting simple code into too many layers

### 4.2 Boundary discipline

Keep these boundaries explicit:

- browser versus server
- server versus external systems
- auth boundary versus domain boundary
- tenant boundary versus domain record
- server state versus local UI state

### 4.3 Data access discipline

As a rule:

- the browser should not talk directly to protected external systems
- server-owned routes or server functions should own data access
- elevated credentials must remain server-side

### 4.4 UI system discipline

Use one clear UI primitive layer and keep it consistent.

Rules:

- prefer local primitives before bespoke controls
- keep code close to the route, component, or workflow that owns it
- in Next.js App Router, prefer route-local private folders such as `_components`, `_lib`, and `_hooks` before reaching for top-level app folders
- only promote code into shared layers when it has real reuse
- avoid generic dumping-ground folders such as `utils`, `helpers`, or `services`
- prefer composition over giant page components
- do not let multiple competing UI libraries accumulate without an intentional migration plan

### 4.5 New repo bootstrap rule

When bootstrapping or re-initializing a repo:

- start from the default stack
- establish theme or token direction early
- establish auth and tenant posture early
- establish billing and entitlement posture early

Do not leave these as post-bootstrap cleanup.

### 4.6 Security baseline

Security is part of engineering quality, not a later hardening pass.

Every serious product repo should define a default posture covering:

- auth hardening
- secrets handling
- dependency intake
- dependency updates
- supply-chain protections
- repository scanning

## Phase 5: Delivery Workflow

This section defines how work should move once planning and implementation posture are clear.

### 5.1 Systems of record

Use these defaults:

- Linear is the system of record for planning, issue state, milestones, and project progress
- GitHub is the system of record for code, branches, pull requests, CI, and protected-branch rules
- Vercel is the default deployment platform for preview and production web deployments
- project-specific runtime tools belong to the application layer, not the CI/CD orchestration layer

### 5.2 Default delivery path

Default flow:

- issue or brief
- branch from the correct base
- implement one main concern
- run local verification
- open PR
- review and iterate
- merge to the stable branch
- promote the stable branch to the protected main branch on the chosen cadence

The default should stay simple:

- one issue
- one branch
- one main concern
- one PR
- local verification
- self-review plus advisory review where useful

### 5.3 Daily workflow checklist

1. Create or pick the planning issue.
2. Confirm that the relevant Phase 0 assumptions still hold.
3. Load the relevant skill, MCP, and official reference path before implementing.
4. Branch from the correct base.
5. Keep the work to one main concern.
6. Run local verification before opening or updating the PR.
7. Open a PR for non-trivial work.
8. Link the PR back to the planning issue.
9. Request advisory review where appropriate.
10. Review the diff, local result, and preview yourself.
11. Merge only when the slice is coherent and verified.

### 5.4 Branch strategy

The repo currently uses a staging-first operating model:

- `staging` is the stable product branch and the base for near-term product work
- `main` is the protected default branch and merge target for stable promotion
- long-lived migration or experimental branches must remain clearly separate from the stable product line

Rule:

- start current product work from the stable product branch
- do not branch from unrelated migration streams
- do not branch from stale local branches

### 5.5 Keeping branches current

If a branch stays open for more than a short period, reconcile it with the base branch before the conflict surface grows.

Default:

- keep branches short-lived
- update from base when adjacent work moves
- prefer early reconciliation over large end-of-branch conflict resolution

### 5.6 Branch naming

Use clear, issue-linked branch names.

Recommended format:

- `feature/identifier`

Examples:

- `feature/auth-foundation`
- `feature/billing-entitlements`

### 5.7 One main concern per branch

Each branch should carry one main concern and one main PR concern.

Do not bundle:

- feature work plus unrelated refactors
- schema work plus broad cleanup
- UI work plus unrelated auth changes

### 5.8 Pull request rules

Open a PR for any non-trivial work involving:

- product features
- schema changes
- auth changes
- workflow or process changes
- UI work
- shared package contracts

Small local-only cleanup may not need full ceremony, but meaningful work should move through PRs.

### 5.9 PR packaging contract

Every non-trivial PR should include:

- `Summary`
- `Included`
- `Verification`
- `Linked issues`
- `Notes`

The PR should make it easy to answer:

- what changed
- why it changed
- how it was verified
- what issue it belongs to
- what is intentionally still out of scope

### 5.10 Git attribution policy

Do not add:

- `Co-Authored-By` trailers
- `Generated with ...` lines
- AI attribution boilerplate in commits or PRs

Keep git artifacts focused on the change itself.

## Phase 6: Review, CI, And CD

### 6.1 Review expectations

Review should validate:

- architectural fit
- scope correctness
- tenant and access correctness
- state ownership correctness
- verification completeness
- packaging hygiene

### 6.2 Required local checks

For non-trivial work, the default verification set is:

- lint
- typecheck
- build

### 6.3 CI policy

The default CI posture should include:

- lint
- typecheck
- build

### 6.4 CD policy

Default deployment posture:

- PRs get preview deployments
- `staging` merges trigger the main staging or integration deployment
- `main` merges trigger the production deployment

### 6.5 Protected branch posture

Protected mainline branches should generally enforce:

- pull requests
- linear history
- CI checks
- no force pushes
- no branch deletion

Human approval requirements can stay pragmatic for early-stage teams, but CI and history protection should remain in place.

## Phase 7: Branching And Merge-Conflict Prevention

### 7.1 Branch from the correct base

Always branch from the correct stable base for the active workstream.

Do not branch from:

- a stale local branch
- an unrelated feature branch
- an old PR branch
- an unrelated migration stream

### 7.2 Keep branches short-lived

The longer a branch lives, the more likely it is to conflict.

### 7.3 Slice work vertically

Prefer:

- one end-to-end slice
- one bounded workflow
- one bounded API surface

Over:

- giant shared refactors
- broad cross-cutting edits with unclear ownership

### 7.4 Avoid shared hotspots when possible

High-conflict files should be treated carefully.

Examples:

- shared auth config
- global providers
- root layouts
- shared navigation
- top-level docs
- package contracts

### 7.5 Conflict escalation rule

If a branch begins to overlap heavily with another open branch:

- pause
- identify the true ownership split
- reduce write overlap
- re-slice the work if needed

Do not brute-force structural branch conflicts if the real problem is planning.

## Phase 0 Quick Verification Gate

This is a summary gate, not a separate exercise.

If the checklist and `phase-0-product-architecture.md` are complete, this section should already be satisfied.

Before starting meaningful feature work, confirm that these are answered:

- product vision exists
- ICP exists
- user hierarchy exists
- tenancy model is defined
- billing model is defined
- access-control model is defined
- domain ownership boundaries are defined
- source-of-truth systems are defined
- default stack posture is agreed
- backend decision is explicit
- implementation plan exists
- write scope and branching approach are clear

If several of these are unknown, the correct action is usually to pause implementation and clarify them first.

## Recommended Default For Collaborative Products

Unless there is a stronger reason not to, prefer this default:

- users belong to one or more shared accounts, workspaces, or organizations
- the chosen tenant boundary owns business data
- billing attaches to that shared boundary
- permissions are scoped inside that shared boundary
- the frontend and BFF start in `Next.js`
- auth is handled by `Better Auth`
- the primary database is `Postgres`
- server state uses `TanStack Query`
- transient UI state uses a small client store only when needed

## Bottom Line

Good engineering does not start with code generation.

It starts with:

- a clear product vision
- a clear tenancy and ownership model
- a clear billing and access model
- a clear implementation posture
- a clear branching strategy
- a clear tool and skill usage model

Then implementation becomes much simpler.
