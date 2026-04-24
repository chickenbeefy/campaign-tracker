# Tenant And Organization Follow-Up

Use this after Section 4 of `docs/process/app-initialization-checklist.md` has real answers.

The checklist decides the business reality first. This document helps the team choose the implementation path that matches that reality.

## Path 1: Single-Tenant

Choose this when:

- one company or one internal team owns the whole app
- there is no customer switching
- permissions are app-level, not customer-account-level

Recommended implementation posture:

- keep Better Auth as the login and session layer
- add only the app roles the product really needs
- keep billing and settings attached to the one account the app already serves

Do not add:

- organization switching
- invitation systems
- teams
- tenant-aware billing logic

## Path 2: App-Owned Multi-Tenant Workspaces

Choose this when:

- many customer accounts share the same product
- one user may belong to more than one customer account or workspace
- the product needs switching, but not full organization plugin behavior yet

Recommended implementation posture:

- keep Better Auth for identity and sessions
- add your own workspace or account tables in the product domain
- add membership records and active workspace context after the checklist confirms they are real needs

Decide early:

- what the top customer boundary really is
- whether switching changes navigation
- whether billing attaches to the company, workspace, location, or another boundary

## Path 3: Organization-Based Multi-Tenant

Choose this when:

- customers are clearly organizations
- invitations are part of the real product
- active organization context matters
- teams or tenant-aware member management are likely real needs

Recommended implementation posture:

- install and use organization-specific auth guidance
- add the Better Auth organization plugin
- rerun `npm run auth:migrate` after adding the plugin
- keep teams off until the product truly needs them

This is the point where `organization-best-practices` should be added to the active skill set.

## Update The Repo After Choosing

Once one of the paths above is selected:

1. record the decision in `docs/process/phase-0-product-architecture.md`
2. update `AGENTS.md` only if the repo is now committed to that model
3. update auth, navigation, billing, and permissions together instead of changing them in isolation
