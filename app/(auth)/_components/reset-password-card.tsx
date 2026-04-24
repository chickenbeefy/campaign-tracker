"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useState, useTransition } from "react"

import { Button } from "@/components/ui/button"

import { authClient } from "@/lib/auth-client"

import { AuthCardShell } from "./auth-card-shell"

type ResetPasswordCardProps = {
  isReady: boolean
  missingEnv: string[]
}

export function ResetPasswordCard({
  isReady,
  missingEnv,
}: ResetPasswordCardProps) {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const resetError = searchParams.get("error")
  const [isPending, startTransition] = useTransition()
  const [errorMessage, setErrorMessage] = useState<string | null>(
    resetError ? "This reset link is invalid or expired." : null,
  )
  const [isComplete, setIsComplete] = useState(false)

  async function handleSubmit(formData: FormData) {
    setErrorMessage(null)

    if (!isReady) {
      setErrorMessage(
        "Auth is not configured yet. Add the required env vars before testing password reset.",
      )
      return
    }

    if (!token) {
      setErrorMessage("This reset link is missing its token.")
      return
    }

    const password = String(formData.get("password") ?? "")
    const confirmPassword = String(formData.get("confirmPassword") ?? "")

    if (!password || !confirmPassword) {
      setErrorMessage("Fill out both password fields before continuing.")
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage("The passwords must match.")
      return
    }

    const { error } = await authClient.resetPassword({
      newPassword: password,
      token,
    })

    if (error) {
      setErrorMessage(error.message ?? "Unable to reset password.")
      return
    }

    setIsComplete(true)
  }

  return (
    <AuthCardShell
      title="Choose a new password"
      description="This starter includes the Better Auth token-based reset flow so teams do not need to invent it later."
      footerLinks={[
        { href: "/login", label: "Back to sign in" },
        { href: "/", label: "Back home", tone: "muted" },
      ]}
    >
      {isComplete ? (
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-muted/40 px-4 py-4 text-sm text-muted-foreground">
            Your password has been updated. You can sign in with the new password now.
          </div>
          <Link
            className="text-sm font-medium text-primary hover:underline"
            href="/login"
          >
            Continue to sign in
          </Link>
        </div>
      ) : (
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault()
            const formData = new FormData(event.currentTarget)
            startTransition(() => {
              void handleSubmit(formData)
            })
          }}
        >
          <label className="block space-y-2">
            <span className="text-sm font-medium">New password</span>
            <input
              name="password"
              type="password"
              placeholder="At least 12 characters"
              className="h-11 w-full rounded-2xl border border-border bg-background px-3 text-sm outline-none transition focus:border-primary"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium">Confirm password</span>
            <input
              name="confirmPassword"
              type="password"
              placeholder="Repeat your new password"
              className="h-11 w-full rounded-2xl border border-border bg-background px-3 text-sm outline-none transition focus:border-primary"
            />
          </label>

          {errorMessage ? (
            <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              {errorMessage}
            </div>
          ) : null}

          {!token ? (
            <div className="rounded-2xl border border-border bg-muted/40 px-3 py-3 text-sm text-muted-foreground">
              Open this page from a real reset link to continue.
            </div>
          ) : null}

          {!isReady ? (
            <div className="rounded-2xl border border-border bg-muted/40 px-3 py-3 text-sm text-muted-foreground">
              Missing env: {missingEnv.join(", ")}
            </div>
          ) : null}

          <Button className="w-full" disabled={isPending || !token}>
            {isPending ? "Working..." : "Update password"}
          </Button>
        </form>
      )}
    </AuthCardShell>
  )
}
