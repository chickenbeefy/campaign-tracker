# Billing And Entitlements Follow-Up

Use this after Section 6 of `docs/process/app-initialization-checklist.md` has real answers.

This template keeps billing provider-neutral on purpose. The important early decision is not "which billing API do we use?" It is "what exactly does billing unlock or limit?"

## Keep Billing Provider-Neutral First

Start by defining:

- who is billed
- what plan or contract they are on
- which modules should be on or off
- which features should be on or off
- which quotas should be limited

The billing provider can update those values later. It should not become the only place where access rules live.

## Starter Entitlement Shape

The template models access in three buckets:

- modules
- features
- quotas

Example:

- module: reporting
- feature: CSV export
- quota: 5 included seats

This keeps auth separate from billing while still letting billing influence access.

## Good Default Rollout

1. start with manual entitlement values
2. prove the gating rules in the product
3. add a billing provider later to update the same entitlement model

That keeps the product logic stable even if billing operations change.
