export const defaultPostAuthPath = "/app"

function createLocalUrl(
  pathname: string,
  search: Record<string, string | undefined>,
) {
  const url = new URL(pathname, "http://template.local")

  for (const [key, value] of Object.entries(search)) {
    if (value) {
      url.searchParams.set(key, value)
    }
  }

  return `${url.pathname}${url.search}`
}

export function normalizeNextPath(raw?: string | null) {
  if (!raw || !raw.startsWith("/")) {
    return defaultPostAuthPath
  }

  return raw
}

export function createVerifyEmailNoticePath(options?: {
  email?: string
  next?: string
  reason?: "sign-up" | "sign-in"
}) {
  return createLocalUrl("/verify-email", {
    email: options?.email,
    next: normalizeNextPath(options?.next),
    reason: options?.reason,
  })
}

export function createVerifyEmailCallbackUrl(
  origin: string,
  next = defaultPostAuthPath,
) {
  return new URL(
    createLocalUrl("/verify-email", {
      next: normalizeNextPath(next),
      success: "1",
    }),
    origin,
  ).toString()
}

export function createResetPasswordRedirectUrl(origin: string) {
  return new URL("/reset-password", origin).toString()
}
