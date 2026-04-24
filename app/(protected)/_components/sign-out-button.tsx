"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"

import { authClient } from "@/lib/auth-client"

export function SignOutButton() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  function handleClick() {
    setErrorMessage(null)

    startTransition(() => {
      void authClient
        .signOut()
        .then(({ error }) => {
          if (error) {
            setErrorMessage(error.message ?? "Unable to sign out.")
            return
          }

          router.push("/sign-in")
          router.refresh()
        })
        .catch(() => {
          setErrorMessage("Unable to sign out.")
        })
    })
  }

  return (
    <div className="space-y-3">
      <Button onClick={handleClick} variant="secondary" disabled={isPending}>
        {isPending ? "Signing out..." : "Sign out"}
      </Button>
      {errorMessage ? (
        <p className="text-sm text-destructive">{errorMessage}</p>
      ) : null}
    </div>
  )
}
