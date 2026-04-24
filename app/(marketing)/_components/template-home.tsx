import Link from "next/link"

import { getServerSession } from "@/lib/auth"

const primaryLinkClass =
  "inline-flex h-9 items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition hover:bg-primary/80"

const secondaryLinkClass =
  "inline-flex h-9 items-center justify-center rounded-lg border border-border bg-card px-5 text-sm font-medium text-foreground transition hover:bg-muted"

export async function TemplateHome() {
  const session = await getServerSession()

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.10),_transparent_38%)] px-6">
      <div className="w-full max-w-lg text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Workshop project
        </p>
        <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight">
          Campaign &amp; Lead Tracker
        </h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          Create campaigns, track spend and leads, and generate AI-powered ad
          copy variants — all in one place.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          {session ? (
            <Link className={primaryLinkClass} href="/dashboard">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link className={primaryLinkClass} href="/sign-in">
                Sign in
              </Link>
              <Link className={secondaryLinkClass} href="/sign-up">
                Create account
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
