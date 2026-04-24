import { ForgotPasswordCard } from "../_components/forgot-password-card"
import { getMissingAuthConfig, isAuthReady } from "@/lib/auth"

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.12),_transparent_35%),linear-gradient(180deg,_var(--background),_color-mix(in_oklch,_var(--background)_92%,_white_8%))] px-6 py-10">
      <ForgotPasswordCard
        isReady={isAuthReady()}
        missingEnv={getMissingAuthConfig()}
      />
    </main>
  )
}
