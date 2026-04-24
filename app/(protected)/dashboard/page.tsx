import Link from "next/link"

import { db } from "@/lib/db"

async function getDashboardStats() {
  const totalsResult = await db.query<{
    total_spend: string
    total_leads: string
  }>(`
    SELECT
      COALESCE(SUM(spend_zar), 0) AS total_spend,
      COALESCE(SUM(leads_count), 0) AS total_leads
    FROM campaigns
  `)

  const topResult = await db.query<{
    id: string
    name: string
    channel: string
    leads_count: number
    spend_zar: string
    status: string
  }>(`
    SELECT id, name, channel, leads_count, spend_zar, status
    FROM campaigns
    ORDER BY leads_count DESC
    LIMIT 5
  `)

  const totals = totalsResult.rows[0]

  return {
    totalSpend: Number(totals?.total_spend ?? 0),
    totalLeads: Number(totals?.total_leads ?? 0),
    topCampaigns: topResult.rows,
  }
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

export default async function DashboardPage() {
  const { totalSpend, totalLeads, topCampaigns } = await getDashboardStats()
  const costPerLead = totalLeads > 0 ? totalSpend / totalLeads : null

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Aggregate performance across all campaigns.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Spend"
          value={`R ${totalSpend.toLocaleString()}`}
        />
        <StatCard
          label="Total Leads"
          value={totalLeads.toLocaleString()}
        />
        <StatCard
          label="Cost per Lead"
          value={costPerLead != null ? `R ${costPerLead.toFixed(2)}` : "—"}
        />
      </div>

      <div className="rounded-2xl border border-border/70 bg-card/85 shadow-sm">
        <div className="border-b border-border/60 px-5 py-4">
          <h2 className="text-sm font-semibold">Top 5 Campaigns by Leads</h2>
        </div>
        {topCampaigns.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muted-foreground">
            No campaigns yet.{" "}
            <Link href="/campaigns/new" className="text-primary hover:underline">
              Create one
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
                  <th className="px-5 py-3 text-left font-medium">Status</th>
                  <th className="px-5 py-3 text-right font-medium">Spend (R)</th>
                  <th className="px-5 py-3 text-right font-medium">Leads</th>
                </tr>
              </thead>
              <tbody>
                {topCampaigns.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-border/30 last:border-0 transition-colors hover:bg-muted/30"
                  >
                    <td className="px-5 py-3 font-medium">
                      <Link href={`/campaigns/${c.id}`} className="hover:text-primary hover:underline">
                        {c.name}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {channelLabel[c.channel] ?? c.channel}
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

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card/85 p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 font-heading text-3xl font-semibold">{value}</p>
    </div>
  )
}
