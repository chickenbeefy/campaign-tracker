# App Initialization Checklist

Use this checklist before turning the template into a real product repo.

The goal is to decide the hard foundational items early instead of growing into patchwork later.

This checklist is meant to be understandable by technical and non-technical teammates.

Plain-English answers are good enough.

Good:

- "Each customer is a company account, and managers invite their staff."
- "We charge one flat monthly fee per company."
- "Support staff can view accounts but cannot change billing."

Too vague:

- "multi-tenant"
- "RBAC later"
- "billing TBD"

This checklist should be completed together with:

- `docs/process/product-engineering-sop.md`
- `docs/process/security-baseline.md`
- `docs/technical.md`
- Next.js MCP or official Next.js docs for App Router behavior
- Better Auth docs or MCP for plugins, sessions, and schema implications

If several sections below are still unanswered, pause implementation and resolve them before the repo starts carrying real product complexity.

## 0. Start Here First

Do not jump straight into building screens, auth, billing, or data models.

Use this order:

1. Read this checklist fully.
2. Answer the sections below with the team in plain language.
3. Copy `docs/process/phase-0-product-architecture-template.md` to `docs/process/phase-0-product-architecture.md`.
4. Record the final agreed answers there so future architecture decisions have a clear source of truth.
5. Update `AGENTS.md` and `CLAUDE.md` only after those answers are stable enough to become repo rules.

If the answers only live in a call, chat, or someone's head, the product is not ready for deeper implementation yet.

### How To Run This Exercise

Use a simple session, not a long process ceremony.

Recommended default:

- facilitator: engineering lead, CTO, or the person responsible for architecture decisions
- required voices: product owner or founder, plus the engineering lead
- time box: 1 to 3 focused hours for the first pass
- minimum sections to answer first: Product Shape, Who Will Use It, Customer And Tenant Model, Sign-In And Access, Billing, and Core vs Optional Features

If product and engineering disagree on an answer, do not average the two opinions together. Write down the unresolved decision in `docs/process/phase-0-product-architecture.md`, name the owner who will decide it, and pause deeper implementation in the affected area.

## 1. Agent And Reference Baseline

Before product work starts, install the baseline agent skills from `skill.sh` that this template expects teams to use:

- `vercel-react-best-practices`
- `vercel-composition-patterns`
- `better-auth-best-practices`
- `create-auth-skill`

Install `monorepo-management` only if the project evolves into a workspace or Turborepo setup. Install `organization-best-practices` only when the product has explicitly committed to organizations, teams, or tenant-aware member management.

Before guessing framework or auth behavior, confirm the team will use:

- Next.js MCP or official Next.js docs for App Router behavior
- Better Auth docs or MCP for plugins, sessions, and schema implications

Example CLI shape:

```bash
npx skills add <repo-url> --skill vercel-react-best-practices
npx skills add <repo-url> --skill vercel-composition-patterns
npx skills add <repo-url> --skill better-auth-best-practices
npx skills add <repo-url> --skill create-auth-skill
```

## 2. Product Shape

Answer in plain language:

- What is the product?
- What is it not?
- Is the app internal-only, B2B, B2C, or a hybrid?
- Will one codebase support one product, or several related products?
- Do you need modules from day one, or can they wait?
- What problem does version one solve first?
- What is intentionally out of scope for version one?

Example answers:

- "This is an internal operations tool for our own team. It is not customer-facing."
- "This is a B2B platform for gym operators. It is not a consumer app for gym members."
- "Version one handles reporting and staff workflows. Billing and mobile app support come later."

## 3. Who Will Use It?

List the real people involved, not just job titles in abstract.

Answer:

- Who pays for it?
- Who uses it day to day?
- Who approves or manages other users?
- Are there internal admins or support staff?
- Are there different levels like owner, manager, staff, viewer, or support?

Example answers:

- "The company owner pays, location managers use it daily, and staff only use a few screens."
- "Our internal support team needs read-only access to help customers."
- "There are only two user types for now: admin and member."

## 4. Customer And Tenant Model

This is one of the most important sections in the whole checklist.

In simple terms:

- A single-tenant product usually means one company, one internal team, or one customer environment owns the whole app.
- A multi-tenant product usually means the same app serves many separate customer accounts, such as companies, organizations, or workspaces.
- A mixed model usually means some parts are shared globally, but customer data, permissions, or billing still live inside separate accounts.

Plain-language examples:

- "Single-tenant: this is just for our company, so nobody needs to switch between customer accounts."
- "Multi-tenant: many customer organizations use the same app, and one user might belong to more than one organization."
- "Mixed: customers are separate, but our internal team can move across them for support."

Answer:

- Is this single-tenant, multi-tenant, or mixed?
- What is the top customer boundary: company, organization, workspace, location, client account, or something else?
- Does data belong to one person or to a shared company/workspace/account?
- Can one user belong to more than one customer account?
- Will users need to switch between accounts in version one?
- Will this customer boundary affect navigation, permissions, billing, or reporting?

Example answers:

- "Each customer is one company account. Their people all work inside that shared account."
- "Each agency can have multiple client workspaces, and some users will switch between them."
- "This is single-account software for one internal team, so there is no customer switching."

If you are unsure, write the business reality in plain language first. The technical model can be shaped after that.

After this section is answered, use `docs/process/tenant-and-organization-follow-up.md` to choose the implementation path that matches the business reality.

## 5. How Should Sign-In And Access Work?

Answer:

- How do people sign in?
- Can anyone sign up, or do they need an invite?
- Do we want email/password, Google, Microsoft, magic link, or SSO?
- Do new users need email verification?
- Do new users need a setup flow after they first log in?
- Who can view data, who can edit data, and who can manage billing or settings?

Example answers:

- "Only invited users can get in. No open sign-up."
- "Users sign in with email and password for now. Google can come later."
- "Owners can manage billing, managers can edit operations, and staff can only view and update assigned work."

## 6. Who Pays, And What Are They Paying For?

Answer:

- Who gets billed: an individual, a company, a workspace, a location, or something else?
- Is pricing flat, per seat, per location, per module, usage-based, or a mix?
- Are some people free, such as internal admins or support staff?
- Do we want a free tier, a free trial, sales-led contracts, or none of those?
- Are certain features only available on higher plans?

Example answers:

- "We charge one monthly fee per company."
- "We charge per active staff seat."
- "We charge per location, and advanced analytics is a paid add-on."
- "Internal support users should never count toward billing."

## 7. What Parts Of The Product Are Core, And What Parts Are Optional?

In plain language, a module is a product area that some customers may need and others may not.

Examples:

- analytics
- AI tools
- reporting
- advanced admin controls

If every customer gets everything, you probably do not need modules yet.

Answer:

- What is core and should always be on?
- What could be optional later?
- Do different customers need different product areas turned on or off?
- Will we eventually have modules or add-ons?

Example answers:

- "CRM is core, but analytics is optional."
- "Reporting is included for everyone. AI features are an add-on."
- "This product is simple and does not need modules yet."

If you already know there will be optional parts, write them down now. That decision affects auth, billing, navigation, and permissions later.

After Section 6 is answered, use `docs/process/billing-and-entitlements-follow-up.md` to shape modules, features, and quotas before choosing a billing provider.

## 8. Can One Web App Handle Everything For Now?

One web app is usually enough at the start.

A separate backend, worker, or jobs app is usually only needed when things like these become real:

- multiple clients need the same backend
- background jobs become central
- heavy imports, syncs, or long-running tasks become common
- scaling the backend separately starts to matter

Answer:

- Can the main web app handle version one by itself?
- Do we already know we need a separate backend, worker, or jobs app?
- Will there be imports, scheduled jobs, syncs, long-running tasks, or heavy integrations?
- Do audit logs, billing events, or entitlement changes need their own backend surface early?

Example answers:

- "One web app is enough for version one."
- "We need a worker later because imports and reports will run in the background."
- "We already know we need a separate API because multiple clients will use the same backend."

## 9. How Should The Team Work In This Repo?

Answer:

- Which branch model will the team use?
- What must pass before merge?
- Do all meaningful changes go through PRs?
- Who reviews what?
- What needs to be documented so new teammates do not have to guess?

Example answers:

- "All feature work branches from `staging` and merge back through PRs before promotion to `main`."
- "Lint, typecheck, and build must pass before merge."
- "Every non-trivial PR needs a short summary, verification notes, and linked issue."

## 10. Final Recorded Decision Output

Before serious feature work begins, make sure the team has written the final answers in:

- `docs/process/phase-0-product-architecture.md`

That file should capture:

- product summary
- who the customer is
- who the day-to-day users are
- whether the product is single-tenant, multi-tenant, or mixed
- what one customer account/workspace/company owns
- how sign-in works
- who can do what
- who gets billed
- how pricing works
- which features are core
- which features are optional
- whether one web app is enough for now
- how the team will branch, review, and merge

If these decisions only live in someone's head or in a chat thread, they are not stable enough yet.
