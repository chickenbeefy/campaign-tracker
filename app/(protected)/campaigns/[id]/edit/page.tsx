import Link from "next/link"
import { notFound } from "next/navigation"

import { db } from "@/lib/db"
import { CampaignForm } from "../../_components/campaign-form"
import { updateCampaign } from "./actions"

type Campaign = {
  id: string
  name: string
  channel: string
  start_date: Date
  end_date: Date | null
  spend_zar: string
  leads_count: number
  status: string
  notes: string | null
}

async function getCampaign(id: string) {
  const result = await db.query<Campaign>(
    "SELECT id, name, channel, start_date, end_date, spend_zar, leads_count, status, notes FROM campaigns WHERE id = $1",
    [id],
  )
  return result.rows[0] ?? null
}

function toDateInput(d: Date | null): string {
  if (!d) return ""
  return new Date(d).toISOString().slice(0, 10)
}

export default async function EditCampaignPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const campaign = await getCampaign(id)

  if (!campaign) notFound()

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link
          href={`/campaigns/${id}`}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          ← Back to campaign
        </Link>
        <h1 className="mt-1 font-heading text-2xl font-semibold">
          Edit campaign
        </h1>
      </div>

      <div className="rounded-2xl border border-border/70 bg-card/85 p-6 shadow-sm">
        <CampaignForm
          action={updateCampaign}
          submitLabel="Save changes"
          id={id}
          defaultValues={{
            name: campaign.name,
            channel: campaign.channel,
            start_date: toDateInput(campaign.start_date),
            end_date: toDateInput(campaign.end_date),
            spend_zar: Number(campaign.spend_zar),
            leads_count: campaign.leads_count,
            status: campaign.status,
            notes: campaign.notes,
          }}
        />
      </div>
    </div>
  )
}
