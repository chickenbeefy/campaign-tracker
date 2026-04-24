import { tool } from "ai"
import { z } from "zod"

import { db } from "@/lib/db"

export const getTopCampaignsByChannel = tool({
  description:
    "Fetch the top campaigns on a given channel ordered by leads, including a sample of their best-performing ad copy. Use this to learn what has worked before writing new copy.",
  inputSchema: z.object({
    channel: z.string().describe("The ad channel, e.g. meta_ads, google_ads, email, other"),
    limit: z.number().int().min(1).max(10).describe("How many campaigns to return"),
  }),
  execute: async (input) => {
    const result = await db.query<{
      name: string
      channel: string
      leads_count: number
      spend_zar: string
      notes: string | null
      sample_ad_copy: string | null
    }>(
      `SELECT
         c.name,
         c.channel,
         c.leads_count,
         c.spend_zar,
         c.notes,
         (
           SELECT a.copy_text
           FROM ad_copy a
           WHERE a.campaign_id = c.id
           ORDER BY a.created_at DESC
           LIMIT 1
         ) AS sample_ad_copy
       FROM campaigns c
       WHERE c.channel = $1
       ORDER BY c.leads_count DESC
       LIMIT $2`,
      [input.channel, input.limit],
    )

    return { campaigns: result.rows }
  },
})
