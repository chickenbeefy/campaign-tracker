# Testing Baseline

## Purpose

Define the default testing posture for teams starting from this template.

The goal is to make testing expected from day one without forcing every product into a heavy QA stack immediately.

## Default Testing Stack

Start with:

- Vitest for fast unit tests
- colocated `*.test.ts` or `*.test.tsx` files near the code they cover

Add later when the app needs them:

- React Testing Library for interactive component tests
- Playwright for real browser journeys such as sign-in, billing, and high-risk end-to-end flows

This template keeps the initial scaffold light, but it should not stay test-free.

## What To Test First

Start with the parts that are easy to break and cheap to verify:

- auth URL helpers
- entitlement rules
- tenant or organization decision helpers
- formatting, mapping, or policy helpers
- route-local logic with one clear input/output contract

Before adding browser-heavy tests, make sure the pure helper layer is covered first.

## Colocation Rules

- keep tests next to the route, component, or helper they cover
- use `feature.test.ts` or `feature.test.tsx`
- do not create a giant top-level `tests` folder for normal unit coverage
- if a test only matters to one route area, keep it in that route area

## Verification Baseline

For non-trivial work, the default verification set is:

- `npm run lint`
- `npm run test`
- `npm run typecheck`
- `npm run build`

If an area already has tests, update them in the same change when behavior changes.

## When To Add Component Tests

Add React component tests when:

- a component has non-trivial interaction logic
- auth or billing UI states are easy to regress
- accessibility or loading/error states matter to the workflow

Use official framework guidance before adding deeper component test setup.

## When To Add End-To-End Tests

Add Playwright or equivalent browser tests before shipping flows such as:

- sign-in and sign-out
- email verification
- password reset
- billing checkout or plan changes
- tenant switching
- critical onboarding flows

These tests should cover the happy path first before trying to model every edge case.
