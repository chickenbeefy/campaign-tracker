# Engineering Workflow

## Purpose

Define the default day-to-day delivery workflow for teams using this template.

Use `docs/process/product-engineering-sop.md` for product framing and architecture decisions. Use this file for how work should actually move through planning, branches, pull requests, review, CI, and deployment.

The goal is to remove guesswork without adding fake process.

## Systems Of Record

- Linear is the recommended source of truth for planning, issue status, milestones, and project progress.
- GitHub is the source of truth for code, branches, pull requests, reviews, CI, and protected-branch settings.
- Vercel is the default deployment platform for preview and production web deployments unless the repo is intentionally changed.

If the team uses a different planning or deployment tool, document that decision immediately instead of leaving it implicit.

## Reading This Workflow

If you are:

- a founder, PM, or product lead: start with `docs/process/app-initialization-checklist.md`, then review this file for how work will move after planning
- an engineering lead: read this file together with `AGENTS.md` and `docs/process/product-engineering-sop.md`
- a developer joining the repo: use this file as the default delivery contract

## Branch Strategy

This template uses a three-lane default model:

- `main` is the protected production branch
- `staging` is the active integration branch and the normal base for product work
- `feature/*` branches are short-lived delivery branches

Default delivery path:

`planning issue -> branch from staging -> pull request -> CI checks -> review -> merge to staging -> promote staging to main when stable`

### What "short-lived" means

As a default:

- aim for 1 to 3 working days
- try not to let a branch sit open past a week
- if a branch is getting large, split the work instead of letting it turn into a roadmap branch

### What "promote staging to main" means

This template does not assume a fixed weekly release day.

Use one of these simple triggers:

- promote when `staging` is stable and the intended slice is verified
- promote on a regular cadence the team actually follows, such as weekly
- promote after a bounded set of reviewed work is ready for production

Do not leave promotion vague. The team should write down its chosen cadence in the project-specific `docs/process/phase-0-product-architecture.md`.

## Planning Issue Structure

Use two issue shapes:

- implementation issues
- umbrella or tracker issues

### Implementation issues

These are the default.

They should map cleanly to:

- one branch
- one main concern
- one PR

Good examples:

- "Add invite-only sign-up flow"
- "Create billing entitlement helper"
- "Add dashboard activity table"

### Umbrella or tracker issues

Use these only when a workstream is intentionally split across multiple implementation issues.

They should:

- group child issues
- describe the exit condition for the whole track
- stay out of direct coding unless they have a real implementation slice of their own

Do not branch from the umbrella issue if the real work belongs to a child issue.

## Default Labels

Keep labels small and useful.

Recommended baseline:

- `Feature`
- `Bug`
- `Improvement`
- `Docs`
- `Chore`
- `Spike`

If labels stop helping triage, reduce them instead of adding more.

## Daily Workflow Checklist

1. Create or pick the planning issue.
2. Confirm the relevant Phase 0 assumptions still hold.
3. Load the relevant skill, MCP, and official docs path before implementing.
4. Branch from `staging`.
5. Keep the branch focused on one main concern.
6. Run local verification before opening or updating the PR.
7. Open a PR for non-trivial work.
8. Link the PR back to the planning issue.
9. Review the diff, CI results, and preview yourself.
10. If you found a bug that is not fixed in this branch, open a follow-up issue before merge.
11. Merge when the slice is coherent, verified, and ready for `staging`.

## What Counts As Non-Trivial Work

Non-trivial work means anything that should leave a reviewable record because it affects shared behavior, risk, or delivery quality.

Examples:

- auth changes
- billing or entitlement changes
- schema or migration changes
- shared package contract changes
- workflow or CI changes
- route, provider, or app-shell changes
- any change that touches multiple files or changes behavior in a meaningful way

Usually not non-trivial:

- typo fixes
- tiny copy-only edits
- local comments that do not change behavior
- single-file cleanup with no behavior change

When in doubt, open the PR.

## Keeping Branches Current

Use this default branch flow:

```bash
git checkout staging
git pull origin staging
git checkout -b feature/short-identifier
```

If your branch stays open for more than a few days, or adjacent work has moved in the same area, reconcile it with `staging` early.

Default rules:

- keep branches short-lived
- prefer vertical slices over mega branches
- avoid mixing unrelated refactors with feature work
- treat auth, shared providers, shared packages, and top-level docs as conflict hotspots

## Pull Requests

- Open a PR for any non-trivial work.
- Keep one main concern per PR.
- Prefer draft PRs early when you need CI, preview deployments, visibility, or alignment before the work is final.
- Prefer squash merge unless the repo intentionally chooses a different merge posture.
- Keep PRs small enough that one reviewer can validate them coherently.

### When to use a draft PR

Use a draft PR when:

- the branch needs CI before the work is complete
- you want preview deployments for design or product review
- the write scope is large enough that early visibility helps reduce overlap
- the architecture direction needs confirmation before final polish

Do not wait until the branch is "perfect" if early visibility would help the team.

## PR Description Contract

Every non-trivial PR should include:

- `Summary`
- `Included`
- `Verification`
- `Linked issues`
- `Notes`

In `Linked issues`:

- include the planning issue identifier or link
- use `Fixes #...` or `Closes #...` when a GitHub issue should close on merge
- use `Refs #...` when a GitHub issue is related but should stay open

The goal is to make it obvious:

- what changed
- why it changed
- how it was verified
- what it belongs to
- what is intentionally still out of scope

## Review Policy

Review should focus on:

- architectural fit
- auth and access boundaries
- tenant and billing correctness
- state ownership
- user-facing regressions
- verification quality

Default review posture:

- self-review is mandatory
- CI is mandatory for non-trivial work
- advisory AI review is helpful where it adds signal
- human approvals should stay proportional to actual team size

## GitHub Settings Baseline

For a serious early-stage repo, the default GitHub posture should be:

- pull requests required on protected branches
- squash merge enabled
- auto-delete branch on merge enabled
- linear history enabled on protected branches
- CI checks required on protected branches
- no force pushes to protected branches
- no protected branch deletion

Usually not needed on day one:

- multiple required human approvals
- CODEOWNERS review
- merge queue
- deployment approval gates for every branch

Add heavier gates only when the team size and risk level actually justify them.

## CI Policy

Default required local and CI checks:

- `npm run lint`
- `npm run test`
- `npm run typecheck`
- `npm run build`

Add tests, migration checks, or security scanning only when they are real and trustworthy.

## CD Policy

Default deployment posture:

- pull requests get preview deployments
- merges to `staging` trigger the primary staging or integration deployment
- merges to `main` create the production deployment

Do not add custom deployment complexity unless the default platform integration stops meeting the product's needs.

## Linear Workflow Guidance

If the team uses Linear, keep the default state model simple:

- `Todo`
- `In Progress`
- `In Review`
- `Done`

Helpful automation defaults:

- creating or copying the branch name can move the issue to `In Progress`
- opening or readying a PR can move the issue to `In Review`
- merging to `staging` can move the issue to `Done`

If the team later adds a formal QA step, document it here instead of inventing a second hidden workflow.

## Documentation Rules

- Update docs in the same change when workflow, auth, architecture, repo boundaries, or initialization assumptions change.
- Do not leave important rules trapped in PR comments or chat threads.
- If the project chooses a different branch model, promotion cadence, review posture, or deployment flow, update this file.

## Git Hygiene

- do not add AI attribution boilerplate to commits or PRs
- do not add `Co-Authored-By` unless the team intentionally requires it
- keep git history focused on the actual change

## Keep It Lean

The point of this workflow is to make delivery clearer, not slower.

Do not add extra states, review gates, labels, or automation unless they clearly improve correctness, security, or delivery speed.
