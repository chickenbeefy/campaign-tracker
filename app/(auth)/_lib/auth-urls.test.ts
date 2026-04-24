import { describe, expect, it } from "vitest"

import {
  createResetPasswordRedirectUrl,
  createVerifyEmailCallbackUrl,
  createVerifyEmailNoticePath,
  defaultPostAuthPath,
  normalizeNextPath,
} from "./auth-urls"

describe("auth URL helpers", () => {
  it("falls back to the default post-auth path for unsafe values", () => {
    expect(normalizeNextPath()).toBe(defaultPostAuthPath)
    expect(normalizeNextPath("https://example.com")).toBe(defaultPostAuthPath)
  })

  it("builds the verify-email notice path with normalized next state", () => {
    expect(
      createVerifyEmailNoticePath({
        email: "team@example.com",
        next: "https://example.com",
        reason: "sign-up",
      }),
    ).toBe(
      "/verify-email?email=team%40example.com&next=%2Fapp&reason=sign-up",
    )
  })

  it("builds an absolute verification callback URL", () => {
    expect(
      createVerifyEmailCallbackUrl("https://template.test", "/dashboard"),
    ).toBe("https://template.test/verify-email?next=%2Fdashboard&success=1")
  })

  it("builds the password reset redirect URL", () => {
    expect(createResetPasswordRedirectUrl("https://template.test")).toBe(
      "https://template.test/reset-password",
    )
  })
})
