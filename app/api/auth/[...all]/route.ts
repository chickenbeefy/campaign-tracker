import { createUnavailableAuthResponse, getNextAuthHandlers } from "@/lib/auth"

export async function GET(request: Request) {
  const handlers = getNextAuthHandlers()

  if (!handlers) {
    return createUnavailableAuthResponse()
  }

  return handlers.GET(request)
}

export async function POST(request: Request) {
  const handlers = getNextAuthHandlers()

  if (!handlers) {
    return createUnavailableAuthResponse()
  }

  return handlers.POST(request)
}
