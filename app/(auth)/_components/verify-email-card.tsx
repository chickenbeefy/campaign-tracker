"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useState, useTransition } from "react"

import { Button, buttonVariants } from "@/components/ui/button"

import { authClient } from "@/lib/auth-client"

import { AuthCardShell } from "./auth-card-shell"
import {
  createVerifyEmailCallbackUrl,
  normalizeNextPath,
} from "../_lib/auth-urls"

type VerifyEmailCardProps = {
  isReady: boolean
  missingEnv: string[]
}

export function VerifyEmailCard({
  isReady,
  missingEnv,
}: VerifyEmailCardProps) {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") ?? ""
  const reason = searchParams.get("reason")
  const success = searchParams.get("success") === "1"
  const hasTokenError = searchParams.get("error") === "invalid_token"
  const nextPath = normalizeNextPath(searchParams.get("next"))
  const [isPending, startTransition] = useTransition()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [resent, setResent] = useState(false)

  async function handleResend() {
    setErrorMessage(null)

    if (!isReady) {
      setErrorMessage(
        "Auth is not configured yet. Add the required env vars before testing email verification.",
      )
      return
    }

    if (!email) {
      setErrorMessage("Add the email address to this link before resending.")
      return
    }

    const { error } = await authClient.sendVerificationEmail({
      email,
      callbackURL: createVerifyEmailCallbackUrl(window.location.origin, nextPath),
    })

    if (error) {
      setErrorMessage(error.message ?? "Unable to resend verification email.")
      return
    }

    setResent(true)
  }

  const description = success
    ? "Your email has been verified. This baseline keeps the post-verification step explicit so teams can decide what should happen next."
    : hasTokenError
      ? "This verification link is invalid or expired. You can send a fresh one if you still have access to the email address."
      : reason === "sign-in"
        ? "This account still needs email verification before it can sign in. A fresh verification link should have been sent automatically."
        : "Create the account first, then check your inbox and verify the email before continuing."

  return (
    <AuthCardShell
      title={success ? "Email verified" : "Verify your email"}
      description={description}
      footerLinks={[
        { href: "/login", label: "Back to sign in" },
        { href: "/", label: "Back home", tone: "muted" },
      ]}
    >
      <div className="space-y-4">
        {success ? (
          <div className="rounded-2xl border border-border bg-muted/40 px-4 py-4 text-sm text-muted-foreground">
            You can continue to the protected starter route or customize the post-verification destination later.
          </div>
        ) : email ? (
          <div className="rounded-2xl border border-border bg-muted/40 px-4 py-4 text-sm text-muted-foreground">
            Verification email target:{" "}
            <span className="font-medium text-foreground">{email}</span>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-muted/40 px-4 py-4 text-sm text-muted-foreground">
            Open this page after sign-up or sign-in so the starter knows which email address to resend to.
          </div>
        )}

        {resent ? (
          <div className="rounded-2xl border border-border bg-muted/40 px-4 py-4 text-sm text-muted-foreground">
            A fresh verification email has been queued. The starter logs email links to the server console until a real provider is added.
          </div>
        ) : null}

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

        <div className="flex flex-wrap gap-3">
          {success ? (
            <Link className={buttonVariants()} href={nextPath}>
              Continue
            </Link>
          ) : (
            <Button
              disabled={isPending || !email}
              onClick={() => {
                startTransition(() => {
                  void handleResend()
                })
              }}
            >
              {isPending ? "Working..." : "Resend verification email"}
            </Button>
          )}
          <Link className={buttonVariants({ variant: "secondary" })} href="/register">
            Back to sign up
          </Link>
        </div>
      </div>
    </AuthCardShell>
  )
}
