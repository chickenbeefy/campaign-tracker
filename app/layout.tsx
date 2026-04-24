import type { Metadata } from "next"
import { Geist, Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

const headingFont = Geist({
  subsets: ["latin"],
  variable: "--font-heading",
})

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const monoFont = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Next.js Platform Template",
  description:
    "Reusable Next.js App Router starter with Better Auth and billing-ready contracts.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "font-sans antialiased",
        headingFont.variable,
        bodyFont.variable,
        monoFont.variable,
      )}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
