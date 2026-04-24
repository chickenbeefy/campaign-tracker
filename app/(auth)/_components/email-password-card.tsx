"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"

import { Button } from "@/components/ui/button"

import { authClient } from "@/lib/auth-client"

import { AuthCardShell } from "./auth-card-shell"
import {
  createVerifyEmailCallbackUrl,
  createVerifyEmailNoticePath,
} from "../_lib/auth-urls"

type EmailPasswordCardProps = {
  mode: "sign-in" | "sign-up"
  isReady: boolean
  missingEnv: string[]
}

export function EmailPasswordCard({
  mode,
  isReady,
  missingEnv,
}: EmailPasswordCardProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const isSignUp = mode === "sign-up"

  async function handleSubmit(formData: FormData) {
    setErrorMessage(null)

    if (!isReady) {
      setErrorMessage(
        "Auth is not configured yet. Add the required env vars before testing sign-in.",
      )
      return
    }

    const email = String(formData.get("email") ?? "")
    const password = String(formData.get("password") ?? "")
    const name = String(formData.get("name") ?? "")
    const verificationCallbackURL = createVerifyEmailCallbackUrl(
      window.location.origin,
    )

    if (!email || !password || (isSignUp && !name)) {
      setErrorMessage("Fill out the required fields before continuing.")
      return
    }

    if (isSignUp) {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
        callbackURL: verificationCallbackURL,
      })

      if (error) {
        setErrorMessage(error.message ?? "Unable to create an account.")
        return
      }

      router.push(
        createVerifyEmailNoticePath({
          email,
          reason: "sign-up",
        }),
      )
      router.refresh()
      return
    } else {
      const { error } = await authClient.signIn.email({
        email,
        password,
        callbackURL: verificationCallbackURL,
      })

      if (error) {
        if (
          typeof error === "object" &&
          error !== null &&
          "status" in error &&
          error.status === 403
        ) {
          router.push(
            createVerifyEmailNoticePath({
              email,
              reason: "sign-in",
            }),
          )
          router.refresh()
          return
        }

        setErrorMessage(error.message ?? "Unable to sign in.")
        return
      }
    }

    router.push("/dashboard")
    router.refresh()
  }

  return (
    <AuthCardShell
      title={isSignUp ? "Create a starter account" : "Sign in to the starter app"}
      description={
        isSignUp
          ? "This baseline includes verification and reset flows without forcing the product into a tenant or billing model too early."
          : "Use this route to verify Better Auth, protected routing, email verification, and password reset before customizing the product experience."
      }
      footerLinks={[
        isSignUp
          ? { href: "/sign-in", label: "Already have an account? Sign in" }
          : { href: "/sign-up", label: "Need an account? Create one" },
        { href: "/", label: "Back home", tone: "muted" },
      ]}
    >
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
        {isSignUp ? (
          <label className="block space-y-2">
            <span className="text-sm font-medium">Name</span>
            <input
              name="name"
              type="text"
              placeholder="Alex Builder"
              className="h-11 w-full rounded-2xl border border-border bg-background px-3 text-sm outline-none transition focus:border-primary"
            />
          </label>
        ) : null}

        <label className="block space-y-2">
          <span className="text-sm font-medium">Email</span>
          <input
            name="email"
            type="email"
            placeholder="team@example.com"
            className="h-11 w-full rounded-2xl border border-border bg-background px-3 text-sm outline-none transition focus:border-primary"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium">Password</span>
          <input
            name="password"
            type="password"
            placeholder="At least 12 characters"
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
          {isPending ? "Working..." : isSignUp ? "Create account" : "Sign in"}
        </Button>

        {!isSignUp ? (
          <div className="flex justify-end">
            <Link
              className="text-sm text-primary hover:underline"
              href="/forgot-password"
            >
              Forgot your password?
            </Link>
          </div>
        ) : null}
      </form>
    </AuthCardShell>
  )
}
