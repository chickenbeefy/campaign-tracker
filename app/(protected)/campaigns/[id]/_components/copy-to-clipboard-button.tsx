"use client"

import { useState } from "react"
import { RiCheckLine, RiFileCopyLine } from "@remixicon/react"

export function CopyToClipboardButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  async function handleClick() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
      title="Copy to clipboard"
    >
      {copied ? (
        <>
          <RiCheckLine className="size-3.5 text-green-600" />
          Copied
        </>
      ) : (
        <>
          <RiFileCopyLine className="size-3.5" />
          Copy
        </>
      )}
    </button>
  )
}
