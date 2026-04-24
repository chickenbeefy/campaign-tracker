import Link from "next/link"
import { redirect } from "next/navigation"

import { getMissingAuthConfig, getServerSession, isAuthReady } from "@/lib/auth"

const primaryLinkClass =
  "inline-flex h-7 items-center justify-center rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground transition hover:bg-primary/80"

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  if (!isAuthReady()) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 py-10">
        <div className="w-full max-w-xl rounded-[2rem] border border-border/70 bg-card/85 p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Setup required
          </p>
          <h1 className="mt-3 font-heading text-3xl font-semibold">
            Configure Better Auth before testing protected routes.
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            The starter keeps auth explicit. Add the missing env vars, wire your database, then try again.
          </p>
          <p className="mt-4 rounded-2xl border border-border bg-muted/40 px-3 py-3 text-sm text-muted-foreground">
            Missing env: {getMissingAuthConfig().join(", ")}
          </p>
          <div className="mt-6">
            <Link className={primaryLinkClass} href="/">
              Back to template overview
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const session = await getServerSession()

  if (!session) {
    redirect("/sign-in")
  }

  return children
}
