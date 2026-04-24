import Link from "next/link"
import { notFound } from "next/navigation"

import { db } from "@/lib/db"
import { DeleteButton } from "./_components/delete-button"

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
  created_at: Date
}

type AdCopy = {
  id: string
  angle: string
  copy_text: string
  created_at: Date
}

async function getCampaign(id: string) {
  const result = await db.query<Campaign>(
    "SELECT * FROM campaigns WHERE id = $1",
    [id],
  )
  return result.rows[0] ?? null
}

async function getAdCopy(campaignId: string) {
  const result = await db.query<AdCopy>(
    "SELECT id, angle, copy_text, created_at FROM ad_copy WHERE campaign_id = $1 ORDER BY created_at DESC",
    [campaignId],
  )
  return result.rows
}

const channelLabel: Record<string, string> = {
  meta_ads: "Meta Ads",
  google_ads: "Google Ads",
  email: "Email",
  other: "Other",
}

const statusClass: Record<string, string> = {
  planned: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  live: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  ended: "bg-muted text-muted-foreground",
}

const angleClass: Record<string, string> = {
  benefits: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  urgency: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  question: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
}

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [campaign, adCopy] = await Promise.all([getCampaign(id), getAdCopy(id)])

  if (!campaign) notFound()

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            href="/campaigns"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            ← Campaigns
          </Link>
          <h1 className="mt-1 font-heading text-2xl font-semibold">
            {campaign.name}
          </h1>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href={`/campaigns/${id}/edit`}
            className="inline-flex h-7 items-center justify-center rounded-md border border-border px-3 text-xs font-medium transition hover:bg-muted"
          >
            Edit
          </Link>
          <DeleteButton id={id} />
        </div>
      </div>

      <div className="rounded-2xl border border-border/70 bg-card/85 p-6 shadow-sm">
        <h2 className="text-sm font-semibold">Campaign details</h2>
        <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 text-sm sm:grid-cols-3">
          <DetailItem label="Channel" value={channelLabel[campaign.channel] ?? campaign.channel} />
          <DetailItem
            label="Status"
            value={
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusClass[campaign.status] ?? ""}`}>
                {campaign.status}
              </span>
            }
          />
          <DetailItem
            label="Start date"
            value={new Date(campaign.start_date).toLocaleDateString("en-ZA")}
          />
          <DetailItem
            label="End date"
            value={
              campaign.end_date
                ? new Date(campaign.end_date).toLocaleDateString("en-ZA")
                : "—"
            }
          />
          <DetailItem
            label="Spend"
            value={`R ${Number(campaign.spend_zar).toLocaleString()}`}
          />
          <DetailItem
            label="Leads"
            value={campaign.leads_count.toLocaleString()}
          />
          {campaign.notes ? (
            <div className="col-span-2 sm:col-span-3">
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Notes
              </dt>
              <dd className="mt-1 text-foreground">{campaign.notes}</dd>
            </div>
          ) : null}
        </dl>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold">Generated ad copy</h2>
        </div>

        {adCopy.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/70 px-6 py-10 text-center">
            <p className="text-sm text-muted-foreground">
              No ad copy yet. Use the AI generator to create variants.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-3">
            {adCopy.map((copy) => (
              <div
                key={copy.id}
                className="rounded-2xl border border-border/70 bg-card/85 p-4 shadow-sm"
              >
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${angleClass[copy.angle] ?? ""}`}
                >
                  {copy.angle}
                </span>
                <p className="mt-3 text-sm leading-6">{copy.copy_text}</p>
                <p className="mt-3 text-xs text-muted-foreground">
                  {new Date(copy.created_at).toLocaleString("en-ZA")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function DetailItem({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 text-foreground">{value}</dd>
    </div>
  )
}
