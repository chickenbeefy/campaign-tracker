"use server"

import { google } from "@ai-sdk/google"
import { generateText, stepCountIs } from "ai"
import { z } from "zod"

import { db } from "@/lib/db"
import { getTopCampaignsByChannel } from "@/lib/tools/get-top-campaigns"

const variantsSchema = z.object({
  variants: z
    .array(
      z.object({
        angle: z.enum(["benefits", "urgency", "question"]),
        copy_text: z.string(),
      }),
    )
    .length(3),
})

export async function generateAdCopy(campaignId: string) {
  const campaignResult = await db.query<{
    name: string
    channel: string
    notes: string | null
  }>("SELECT name, channel, notes FROM campaigns WHERE id = $1", [campaignId])

  const campaign = campaignResult.rows[0]
  if (!campaign) throw new Error("Campaign not found")

  const result = await generateText({
    model: google("gemini-2.5-flash"),
    system: `You are a marketing copywriter helping create ad copy for a mock campaign tracker. You have one required internal tool and one optional external tool:
- getTopCampaignsByChannel: see what worked for previous campaigns on the same channel, including their ad copy and lead counts
- google_search: use Google Search grounding only if you need up-to-date context or trend language
You MUST call getTopCampaignsByChannel first to learn what worked before. You MAY use google_search if it helps, but do not depend on it to complete the task.
Then write exactly 3 ad copy variants, each under 25 words, each with a different angle:
- benefits: focus on what the customer gets
- urgency: focus on why they should act now
- question: open with a question that hooks the reader
Do not use emojis. Do not use exclamation marks more than once per variant. Match the tone of what worked before, but don't copy it verbatim.

Return ONLY a valid JSON object in this exact shape — no markdown, no explanation:
{"variants":[{"angle":"benefits","copy_text":"..."},{"angle":"urgency","copy_text":"..."},{"angle":"question","copy_text":"..."}]}`,
    prompt: `Campaign name: ${campaign.name}
Channel: ${campaign.channel}
Notes: ${campaign.notes ?? "None"}`,
    tools: {
      getTopCampaignsByChannel,
    },
    stopWhen: stepCountIs(5),
  })

  // Strip markdown fences if the model wraps the JSON anyway
  const raw = result.text.replace(/^```(?:json)?\n?/m, "").replace(/\n?```$/m, "").trim()
  const parsed = variantsSchema.parse(JSON.parse(raw))

  await db.query(
    `INSERT INTO ad_copy (campaign_id, angle, copy_text)
     SELECT $1, v.angle, v.copy_text
     FROM jsonb_to_recordset($2::jsonb) AS v(angle text, copy_text text)`,
    [campaignId, JSON.stringify(parsed.variants)],
  )

  return parsed
}
