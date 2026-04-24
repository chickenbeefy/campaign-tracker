"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { RiSparklingLine } from "@remixicon/react"

import { Button } from "@/components/ui/button"
import { generateAdCopy } from "../generate-copy/action"

export function GenerateCopyButton({ campaignId }: { campaignId: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleClick() {
    setError(null)
    startTransition(async () => {
      try {
        await generateAdCopy(campaignId)
        router.refresh()
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong. Try again.")
      }
    })
  }

  return (
    <div className="space-y-2">
      <Button onClick={handleClick} disabled={isPending} size="sm">
        <RiSparklingLine className="size-3.5" />
        {isPending ? "Researching past campaigns…" : "Generate ad copy with AI"}
      </Button>
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : null}
    </div>
  )
}
