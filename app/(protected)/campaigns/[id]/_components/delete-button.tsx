"use client"

import { useTransition } from "react"

import { Button } from "@/components/ui/button"

import { deleteCampaign } from "../actions"

export function DeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    if (
      !window.confirm(
        "Delete this campaign? All ad copy variants will also be deleted. This cannot be undone.",
      )
    ) {
      return
    }

    startTransition(() => {
      void deleteCampaign(id)
    })
  }

  return (
    <Button variant="destructive" disabled={isPending} onClick={handleClick}>
      {isPending ? "Deleting…" : "Delete campaign"}
    </Button>
  )
}
