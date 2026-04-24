import { SignOutButton } from "../_components/sign-out-button"
import { getServerSession } from "@/lib/auth"

export default async function AppPage() {
  const session = await getServerSession()

  if (!session) {
    return null
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-6 px-6 py-12">
      <section className="rounded-[2rem] border border-border/70 bg-card/85 p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Signed in
        </p>
        <h1 className="mt-3 font-heading text-3xl font-semibold">
          Welcome, {session.user.name || session.user.email}
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          You&apos;re authenticated. Start building your app from here.
        </p>
        <div className="mt-6">
          <SignOutButton />
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-border/70 bg-card/85 p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Session</h2>
        <pre className="mt-4 overflow-x-auto rounded-2xl bg-muted/40 p-4 text-xs text-muted-foreground">
{JSON.stringify(
  {
    user: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
    },
    session: {
      id: session.session.id,
    },
  },
  null,
  2,
)}
        </pre>
      </section>
    </main>
  )
}
