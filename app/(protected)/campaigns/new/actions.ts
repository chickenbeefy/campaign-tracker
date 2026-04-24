"use server"

import { redirect } from "next/navigation"
import { z } from "zod"

import { db } from "@/lib/db"

type ActionState = { error?: string } | null

const schema = z.object({
  name: z.string().min(1, "Campaign name is required"),
  channel: z.enum(["meta_ads", "google_ads", "email", "other"]),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.preprocess((v) => (v === "" ? null : v), z.string().nullable()),
  spend_zar: z.coerce.number().int().min(0),
  leads_count: z.coerce.number().int().min(0),
  status: z.enum(["planned", "live", "ended"]),
  notes: z.preprocess((v) => (v === "" ? null : v), z.string().nullable()),
})

export async function createCampaign(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const result = schema.safeParse(Object.fromEntries(formData))

  if (!result.success) {
    return { error: result.error.issues[0]?.message ?? "Invalid input" }
  }

  const { name, channel, start_date, end_date, spend_zar, leads_count, status, notes } =
    result.data

  await db.query(
    `INSERT INTO campaigns (name, channel, start_date, end_date, spend_zar, leads_count, status, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [name, channel, start_date, end_date, spend_zar, leads_count, status, notes],
  )

  redirect("/campaigns")
}
