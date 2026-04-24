# Security Baseline

## Purpose

Define the default security and dependency-hygiene posture for this repository.

This document complements the product and engineering SOP with more explicit guidance on:

- dependency selection
- package trust
- update cadence
- supply-chain protections
- auth and session hardening
- secrets handling
- repository security tooling

This should be practical, not theatrical. The goal is a strong default security posture, not a heavyweight compliance program.

## Core Rule

Security is not only about reacting to alerts.

It starts with what we choose to install, what we choose to trust, and how deliberately we maintain the software supply chain over time.

## 1. Dependency Intake Policy

Before adding a new package, ask:

- does the current stack or repo already solve this problem
- is this package clearly maintained
- is there evidence of recent releases or issue activity
- is there credible maintainer or organizational backing
- does the package have a reasonable security posture
- is the transitive dependency footprint acceptable
- is the license acceptable
- is the package likely to remain maintained over the next year

Default rules:

- prefer official, vendor-backed, or clearly maintained packages
- prefer boring packages over attractive but fragile ones
- avoid adding dependencies that only save a small amount of code while increasing long-term risk
- treat low-maintainer, abandoned-looking, or weakly reviewed packages as high risk by default

If a dependency is still worth adding despite weak maintenance signals, document why.

## 2. Supply-Chain Trust Signals

Useful trust signals include:

- active maintenance
- clear release cadence
- credible contributor base
- visible security policy
- predictable ownership
- signed releases or provenance support
- decent OpenSSF Scorecard results

Recommended references:

- [OpenSSF Scorecard](https://scorecard.dev/)
- [GitHub dependency review](https://docs.github.com/en/code-security/concepts/supply-chain-security/about-dependency-review)
- [npm trusted publishers](https://docs.npmjs.com/trusted-publishers/)
- [npm provenance](https://docs.npmjs.com/generating-provenance-statements/)

## 3. Update Policy

Separate dependency work into three lanes:

### Security fixes

- triage quickly
- patch promptly when risk is real
- prioritize auth, framework, database, HTTP, build, and runtime dependencies first

### Routine updates

- review on a regular cadence
- keep drift under control
- avoid letting the repo fall months behind on routine updates

### Major upgrades

- scope them explicitly
- review changelogs and migration guides
- test them in their own branch or PR when impact is meaningful

Default rule:

- do not auto-merge meaningful dependency updates without review

## 4. Manifest And Lockfile Review

When dependencies change, review:

- manifest files
- lockfile changes
- new direct dependencies
- surprising transitive additions
- scripts or postinstall behavior

Dependency changes are part of the review surface, not noise to scroll past.

## 5. Repository Security Baseline

Where the platform supports it, enable:

- dependency graph
- dependency review on pull requests
- Dependabot alerts
- Dependabot security updates
- Dependabot version updates on a controlled cadence
- secret scanning
- push protection
- code scanning

These controls should complement review, not replace it.

Recommended references:

- [GitHub dependency review](https://docs.github.com/en/code-security/concepts/supply-chain-security/about-dependency-review)
- [GitHub code scanning](https://docs.github.com/en/code-security/concepts/code-scanning/about-code-scanning)
- [GitHub secret scanning](https://docs.github.com/en/code-security/concepts/secret-security/about-secret-scanning)
- [GitHub Dependabot version updates](https://docs.github.com/en/code-security/concepts/supply-chain-security/about-dependabot-version-updates)

## 6. Auth And Session Hardening Baseline

For Better Auth based systems:

- keep `trustedOrigins` explicit
- do not disable CSRF or origin protections without a documented reason
- use secure cookie settings
- keep rate limiting enabled
- treat proxy header trust as a security decision, not a convenience toggle
- use secret rotation when supported

Recommended reference:

- [Better Auth security reference](https://better-auth.com/docs/reference/security)

## 7. Web App Hardening Baseline

For Next.js and similar web apps:

- use a Content Security Policy when feasible
- review security headers deliberately
- keep secrets server-side
- avoid exposing sensitive tokens to the browser
- keep server and client boundaries explicit

Recommended reference:

- [Next.js Content Security Policy guide](https://nextjs.org/docs/app/guides/content-security-policy)

## 8. Secrets Handling

Rules:

- do not commit secrets
- do not log secrets
- do not expose privileged credentials to the client
- use environment variables or a proper secret manager
- rotate exposed credentials immediately

If a secret leaks:

1. revoke or rotate it first
2. assess blast radius
3. clean up history if needed
4. open a tracked follow-up if the incident exposed a process weakness

## 9. Publishing And Package Ownership

If the team publishes packages:

- require organization-level 2FA where possible
- prefer trusted publishing
- prefer provenance generation
- avoid long-lived CI secrets if trusted publishing can replace them

Recommended references:

- [npm organization 2FA](https://docs.npmjs.com/requiring-two-factor-authentication-in-your-organization/)
- [npm trusted publishers](https://docs.npmjs.com/trusted-publishers/)
- [npm provenance](https://docs.npmjs.com/generating-provenance-statements/)

## 10. Incident Posture

If a package is suspected to be compromised:

1. stop routine upgrades on that package
2. identify direct and transitive usage
3. isolate or remove it if necessary
4. audit secrets, tokens, and build systems that may have been exposed
5. open an incident or tracked follow-up

If a package is simply abandoned:

- treat it as a migration risk
- decide whether to pin, replace, fork, or remove it before it becomes urgent

## Bottom Line

The safest dependency is the one we never needed to add.

When we do add dependencies, we should do it deliberately, review them properly, and maintain them on purpose rather than by accident.
