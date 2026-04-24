import Link from "next/link"
import { RiBarChartBoxLine, RiMegaphoneLine } from "@remixicon/react"

import { SignOutButton } from "./sign-out-button"

export function Nav() {
  return (
    <header className="sticky top-0 z-10 border-b border-border/60 bg-card/90 backdrop-blur">
      <div className="mx-auto flex h-12 max-w-5xl items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-sm font-semibold text-foreground">
            Campaign Tracker
          </Link>
          <nav className="flex items-center gap-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <RiBarChartBoxLine className="size-3.5" />
              Dashboard
            </Link>
            <Link
              href="/campaigns"
              className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <RiMegaphoneLine className="size-3.5" />
              Campaigns
            </Link>
          </nav>
        </div>
        <SignOutButton />
      </div>
    </header>
  )
}
