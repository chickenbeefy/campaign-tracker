type AuthEmailPayload = {
  kind: "verification" | "password-reset"
  to: string
  subject: string
  url: string
}

function logAuthEmail(payload: AuthEmailPayload) {
  console.info(
    [
      "",
      "[Template auth email]",
      `kind: ${payload.kind}`,
      `to: ${payload.to}`,
      `subject: ${payload.subject}`,
      `url: ${payload.url}`,
      "provider: console placeholder",
      "",
    ].join("\n"),
  )
}

export async function sendVerificationLink(to: string, url: string) {
  logAuthEmail({
    kind: "verification",
    to,
    subject: "Verify your email address",
    url,
  })
}

export async function sendPasswordResetLink(to: string, url: string) {
  logAuthEmail({
    kind: "password-reset",
    to,
    subject: "Reset your password",
    url,
  })
}
