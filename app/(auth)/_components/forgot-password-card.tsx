"use client"

import { useState, useTransition } from "react"

import { Button } from "@/components/ui/button"

import { authClient } from "@/lib/auth-client"

import { AuthCardShell } from "./auth-card-shell"
import { createResetPasswordRedirectUrl } from "../_lib/auth-urls"

type ForgotPasswordCardProps = {
  isReady: boolean
  missingEnv: string[]
}

export function ForgotPasswordCard({
  isReady,
  missingEnv,
}: ForgotPasswordCardProps) {
  const [isPending, startTransition] = useTransition()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setErrorMessage(null)

    if (!isReady) {
      setErrorMessage(
        "Auth is not configured yet. Add the required env vars before testing password reset.",
      )
      return
    }

    const email = String(formData.get("email") ?? "").trim()

    if (!email) {
      setErrorMessage("Enter your email address before continuing.")
      return
    }

    const { error } = await authClient.requestPasswordReset({
      email,
      redirectTo: createResetPasswordRedirectUrl(window.location.origin),
    })

    if (error) {
      setErrorMessage(error.message ?? "Unable to start password reset.")
      return
    }

    setSubmittedEmail(email)
  }

  return (
    <AuthCardShell
      title="Reset your password"
      description="This starter uses the built-in Better Auth reset flow and a provider-neutral console email placeholder."
      footerLinks={[
        { href: "/login", label: "Back to sign in" },
        { href: "/", label: "Back home", tone: "muted" },
      ]}
    >
      {submittedEmail ? (
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-muted/40 px-4 py-4 text-sm text-muted-foreground">
            If an account exists for{" "}
            <span className="font-medium text-foreground">{submittedEmail}</span>,
            {" "}a reset link has been sent.
          </div>
          <p className="text-sm text-muted-foreground">
            The starter logs email links to the server console until a real provider is added.
          </p>
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
            <span className="text-sm font-medium">Email</span>
            <input
              name="email"
              type="email"
              placeholder="team@example.com"
              className="h-11 w-full rounded-2xl border border-border bg-background px-3 text-sm outline-none transition focus:border-primary"
            />
          </label>

          {errorMessage ? (
            <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              {errorMessage}
            </div>
          ) : null}

          {!isReady ? (
            <div className="rounded-2xl border border-border bg-muted/40 px-3 py-3 text-sm text-muted-foreground">
              Missing env: {missingEnv.join(", ")}
            </div>
          ) : null}

          <Button className="w-full" disabled={isPending}>
            {isPending ? "Working..." : "Send reset link"}
          </Button>
        </form>
      )}
    </AuthCardShell>
  )
}
