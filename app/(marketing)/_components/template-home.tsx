import Link from "next/link"

const primaryLinkClass =
  "inline-flex h-8 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/80"

const secondaryLinkClass =
  "inline-flex h-8 items-center justify-center rounded-md bg-secondary px-4 text-sm font-medium text-secondary-foreground transition hover:bg-secondary/80"

export function TemplateHome() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.14),_transparent_38%),linear-gradient(180deg,_var(--background),_color-mix(in_oklch,_var(--background)_92%,_white_8%))]">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-6 py-20">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Next.js Starter
          </p>
          <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
            Your template is ready. Build something.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Next.js App Router, Better Auth, and PostgreSQL wired up so you can
            go straight to the feature you&apos;re building. Create an account,
            sign in, and start shipping.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link className={primaryLinkClass} href="/sign-up">
            Create an account
          </Link>
          <Link className={secondaryLinkClass} href="/sign-in">
            Sign in
          </Link>
        </div>
      </div>
    </main>
  )
}
