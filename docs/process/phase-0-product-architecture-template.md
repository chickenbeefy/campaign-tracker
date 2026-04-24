# Phase 0 Product And Architecture Template

Use this after completing `docs/process/app-initialization-checklist.md`.

Copy this file to `docs/process/phase-0-product-architecture.md` and replace the prompts with the team's real answers.

This is the written source of truth for the app's starting architecture.

## 1. Product Summary

- Product name:
- One-paragraph summary:
- What it is:
- What it is not:
- Version-one focus:
- Out of scope for version one:

## 2. Customer And User Picture

- Who pays:
- Who uses it day to day:
- Who manages other users:
- Internal admin or support users:
- Main user levels:

## 3. Customer And Tenant Model

- Is this single-tenant, multi-tenant, or mixed:
- Top customer boundary:
- What one customer account owns:
- Can one user belong to more than one customer account:
- Does the app need account switching:
- How this affects permissions, billing, and reporting:

## 4. Sign-In And Access

- Sign-in methods:
- Invite-only or open sign-up:
- Email verification needed:
- First-login setup flow:
- Who can view:
- Who can edit:
- Who can manage settings:
- Who can manage billing:

## 5. Billing And Pricing

- Who gets billed:
- Pricing shape:
- Free tier or free trial:
- Features that should depend on plan:
- Internal users that should never count toward billing:
- What happens when payment fails:

## 6. Core Features And Optional Modules

- Features that are always included:
- Features that are optional:
- Modules or add-ons expected later:
- What should stay off by default:

## 7. App And Backend Posture

- Can one web app handle version one:
- Separate backend needed now:
- Worker or background jobs needed now:
- Heavy integrations or long-running processes expected:
- Notes on why this posture was chosen:

## 8. Workflow And Delivery Rules

- Branch strategy:
- What must pass before merge:
- PR expectations:
- Who reviews what:
- Docs that must stay updated:

## 9. Success Criteria

- Main user outcomes:
- Main business outcomes:
- What a good first release looks like:

## 10. Open Questions

- Questions still unresolved:
- Decisions intentionally delayed:
- What must be answered before deeper implementation:
