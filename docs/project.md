# Campaign & Lead Tracker — Project Spec

A mock marketing tool where users manually create campaigns and generate AI ad copy variants. No live ad-platform integration.

## Pages

| Route | What it does |
|---|---|
| `/` | Landing — link to `/sign-in` or `/dashboard` if logged in |
| `/sign-in` | Login (Better Auth) |
| `/sign-up` | Register (Better Auth) |
| `/dashboard` | Totals: spend, leads, cost-per-lead, top 5 campaigns |
| `/campaigns` | Logged-in list view of all campaigns |
| `/campaigns/new` | Create form |
| `/campaigns/[id]` | Detail view with generated ad copy + AI button |
| `/campaigns/[id]/edit` | Edit form |

## Database — `campaigns` table

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Primary key, auto |
| `name` | text | Required |
| `channel` | text | `meta_ads` / `google_ads` / `email` / `other` |
| `start_date` | date | Required |
| `end_date` | date | Nullable |
| `spend_zar` | bigint | In rands |
| `leads_count` | int | Default 0 |
| `status` | text | `planned` / `live` / `ended` |
| `notes` | text | Optional — describe target audience, offer, etc. |
| `created_at` | timestamptz | Default `now()` |

## Database — `ad_copy` table

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Primary key, auto |
| `campaign_id` | uuid | FK to campaigns.id, indexed, ON DELETE CASCADE |
| `angle` | text | `benefits` / `urgency` / `question` |
| `copy_text` | text | Required |
| `created_at` | timestamptz | Default `now()` |

## AI agent

**Trigger:** "Generate ad copy with AI" button on `/campaigns/[id]`

**Tools:**
- `getTopCampaignsByChannel(channel, limit)` — queries campaigns + sample ad_copy for the same channel, ordered by leads_count DESC
- `google_search` — optional Gemini Google Search grounding

**Behaviour:**
- Must call `getTopCampaignsByChannel` first
- May call `google_search` when helpful
- Up to 5 total tool calls (`stopWhen: stepCountIs(5)`)
- Output: `{ variants: [{ angle, copy_text }] }` — exactly 3 variants
- Each variant under 25 words, no emojis, max one exclamation mark
- All 3 saved as new `ad_copy` rows linked to the campaign

**System prompt (use verbatim):**
> "You are a marketing copywriter helping create ad copy for a mock campaign tracker. You have one required internal tool and one optional external tool:
> - getTopCampaignsByChannel: see what worked for previous campaigns on the same channel, including their ad copy and lead counts
> - google_search: use Google Search grounding only if you need up-to-date context or trend language
> You MUST call getTopCampaignsByChannel first to learn what worked before. You MAY use google_search if it helps, but do not depend on it to complete the task.
> Then write exactly 3 ad copy variants, each under 25 words, each with a different angle:
> - benefits: focus on what the customer gets
> - urgency: focus on why they should act now
> - question: open with a question that hooks the reader
> Do not use emojis. Do not use exclamation marks more than once per variant. Match the tone of what worked before, but don't copy it verbatim."

## Acceptance checklist

- [ ] Sign up + sign in works
- [ ] List page protected (redirects to `/sign-in` if logged out)
- [ ] Can create, view, edit, delete campaigns
- [ ] Dashboard shows correct totals (spend, leads, cost-per-lead)
- [ ] AI generate button returns 3 variants in <15 seconds
- [ ] Each variant has a different angle and is under 25 words
- [ ] Variants saved to `ad_copy` and persist on reload
- [ ] "Copy to clipboard" works on each variant
- [ ] Build passes (`npm run build`)
