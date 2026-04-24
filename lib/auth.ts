import { betterAuth } from "better-auth"
import { nextCookies, toNextJsHandler } from "better-auth/next-js"
import { headers } from "next/headers"
import { Pool } from "pg"

import { sendPasswordResetLink, sendVerificationLink } from "./auth-email"

const requiredAuthEnvKeys = [
  "BETTER_AUTH_SECRET",
  "BETTER_AUTH_URL",
  "DATABASE_URL",
] as const

type AuthEnvKey = (typeof requiredAuthEnvKeys)[number]

function getMissingAuthEnv(): AuthEnvKey[] {
  return requiredAuthEnvKeys.filter((key) => {
    const value = process.env[key]
    if (!value) return true
    if (key === "BETTER_AUTH_SECRET") return value.length < 32
    return false
  })
}

function readTrustedOrigins(raw?: string) {
  if (!raw) return []
  return raw
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
}

let pool: Pool | null = null

function createBetterAuth() {
  if (getMissingAuthEnv().length > 0) {
    return null
  }

  pool ??= new Pool({ connectionString: process.env.DATABASE_URL })

  return betterAuth({
    database: pool,
    baseURL: process.env.BETTER_AUTH_URL,
    secret: process.env.BETTER_AUTH_SECRET,
    trustedOrigins: readTrustedOrigins(process.env.BETTER_AUTH_TRUSTED_ORIGINS),
    emailVerification: {
      sendOnSignIn: true,
      sendOnSignUp: true,
      autoSignInAfterVerification: true,
      sendVerificationEmail: async ({ user, url }) => {
        void sendVerificationLink(user.email, url)
      },
      afterEmailVerification: async (user) => {
        console.info(`[auth] verified email for ${user.email}`)
      },
    },
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 12,
      autoSignIn: false,
      requireEmailVerification: true,
      resetPasswordTokenExpiresIn: 60 * 30,
      revokeSessionsOnPasswordReset: true,
      sendResetPassword: async ({ user, url }) => {
        void sendPasswordResetLink(user.email, url)
      },
    },
    plugins: [nextCookies()],
  })
}

export const auth = createBetterAuth()

export function getMissingAuthConfig() {
  return getMissingAuthEnv()
}

export function isAuthReady() {
  return getMissingAuthEnv().length === 0
}

export function getAuthOrNull() {
  return isAuthReady() ? auth : null
}

export async function getServerSession() {
  const a = getAuthOrNull()
  if (!a) return null
  return a.api.getSession({ headers: await headers() })
}

export function createUnavailableAuthResponse() {
  return Response.json(
    {
      message:
        "Better Auth is not configured. Add the required env vars to .env.local before using auth routes.",
      missing: getMissingAuthConfig(),
    },
    { status: 503 },
  )
}

export function getNextAuthHandlers() {
  if (!auth) return null
  return toNextJsHandler(auth)
}
