"use client"

import type { ReactNode } from "react"
import Link from "next/link"

type AuthCardShellProps = {
  title: string
  description: string
  children: ReactNode
  footerLinks: readonly {
    href: string
    label: string
    tone?: "primary" | "muted"
  }[]
}

export function AuthCardShell({
  title,
  description,
  children,
  footerLinks,
}: AuthCardShellProps) {
  return (
    <div className="w-full max-w-md rounded-3xl border border-border/70 bg-card/90 p-6 shadow-sm backdrop-blur">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Better Auth baseline
        </p>
        <h1 className="font-heading text-2xl font-semibold">{title}</h1>
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      </div>

      <div className="mt-6">{children}</div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm">
        {footerLinks.map((link) => (
          <Link
            key={`${link.href}-${link.label}`}
            className={
              link.tone === "muted"
                ? "text-muted-foreground hover:text-foreground"
                : "text-primary hover:underline"
            }
            href={link.href}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
