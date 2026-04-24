"use server"

import { redirect } from "next/navigation"
import { z } from "zod"

import { db } from "@/lib/db"

type ActionState = { error?: string } | null

const schema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Campaign name is required"),
  channel: z.enum(["meta_ads", "google_ads", "email", "other"]),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.preprocess((v) => (v === "" ? null : v), z.string().nullable()),
  spend_zar: z.coerce.number().int().min(0),
  leads_count: z.coerce.number().int().min(0),
  status: z.enum(["planned", "live", "ended"]),
  notes: z.preprocess((v) => (v === "" ? null : v), z.string().nullable()),
})

export async function updateCampaign(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const result = schema.safeParse(Object.fromEntries(formData))

  if (!result.success) {
    return { error: result.error.issues[0]?.message ?? "Invalid input" }
  }

  const { id, name, channel, start_date, end_date, spend_zar, leads_count, status, notes } =
    result.data

  await db.query(
    `UPDATE campaigns
     SET name=$1, channel=$2, start_date=$3, end_date=$4, spend_zar=$5,
         leads_count=$6, status=$7, notes=$8
     WHERE id=$9`,
    [name, channel, start_date, end_date, spend_zar, leads_count, status, notes, id],
  )

  redirect(`/campaigns/${id}`)
}
