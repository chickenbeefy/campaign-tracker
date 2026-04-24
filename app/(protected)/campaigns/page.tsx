import Link from "next/link"
import { RiAddLine } from "@remixicon/react"

import { db } from "@/lib/db"

async function getCampaigns() {
  const result = await db.query<{
    id: string
    name: string
    channel: string
    start_date: Date
    status: string
    spend_zar: string
    leads_count: number
  }>(`
    SELECT id, name, channel, start_date, status, spend_zar, leads_count
    FROM campaigns
    ORDER BY created_at DESC
  `)
  return result.rows
}

const channelLabel: Record<string, string> = {
  meta_ads: "Meta Ads",
  google_ads: "Google Ads",
  email: "Email",
  other: "Other",
}

const channelClass: Record<string, string> = {
  meta_ads: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  google_ads: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  email: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  other: "bg-muted text-muted-foreground",
}

const statusClass: Record<string, string> = {
  planned: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  live: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  ended: "bg-muted text-muted-foreground",
}

export default async function CampaignsPage() {
  const campaigns = await getCampaigns()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Campaigns</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {campaigns.length} campaign{campaigns.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/campaigns/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition hover:bg-primary/80"
        >
          <RiAddLine className="size-3.5" />
          Add new campaign
        </Link>
      </div>

      <div className="rounded-2xl border border-border/70 bg-card/85 shadow-sm">
        {campaigns.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-muted-foreground">
            No campaigns yet.{" "}
            <Link href="/campaigns/new" className="text-primary hover:underline">
              Create your first one
            </Link>
            .
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 text-xs text-muted-foreground">
                  <th className="px-5 py-3 text-left font-medium">Name</th>
                  <th className="px-5 py-3 text-left font-medium">Channel</th>
                  <th className="px-5 py-3 text-left font-medium">Start Date</th>
                  <th className="px-5 py-3 text-left font-medium">Status</th>
                  <th className="px-5 py-3 text-right font-medium">Spend (R)</th>
                  <th className="px-5 py-3 text-right font-medium">Leads</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-border/30 last:border-0 transition-colors hover:bg-muted/30"
                  >
                    <td className="px-5 py-3 font-medium">
                      <Link href={`/campaigns/${c.id}`} className="hover:text-primary hover:underline">
                        {c.name}
                      </Link>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${channelClass[c.channel] ?? ""}`}>
                        {channelLabel[c.channel] ?? c.channel}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground tabular-nums">
                      {new Date(c.start_date).toLocaleDateString("en-ZA")}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusClass[c.status] ?? ""}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums">
                      {Number(c.spend_zar).toLocaleString()}
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums">
                      {c.leads_count.toLocaleString()}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/campaigns/${c.id}`}
                          className="text-xs text-primary hover:underline"
                        >
                          View
                        </Link>
                        <Link
                          href={`/campaigns/${c.id}/edit`}
                          className="text-xs text-muted-foreground hover:text-foreground hover:underline"
                        >
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
