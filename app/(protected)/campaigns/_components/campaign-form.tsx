"use client"

import { useActionState } from "react"

import { Button } from "@/components/ui/button"

type ActionState = { error?: string } | null

type CampaignDefaults = {
  name?: string
  channel?: string
  start_date?: string
  end_date?: string | null
  spend_zar?: number | string
  leads_count?: number
  status?: string
  notes?: string | null
}

type CampaignFormProps = {
  action: (state: ActionState, data: FormData) => Promise<ActionState>
  defaultValues?: CampaignDefaults
  submitLabel?: string
  id?: string
}

const inputClass =
  "h-9 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/30"

const labelClass = "block space-y-1.5"
const labelTextClass = "text-sm font-medium"

export function CampaignForm({
  action,
  defaultValues,
  submitLabel = "Save campaign",
  id,
}: CampaignFormProps) {
  const [state, formAction, isPending] = useActionState(action, null)

  return (
    <form action={formAction} className="space-y-5">
      {id ? <input type="hidden" name="id" value={id} /> : null}
      {state?.error ? (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2.5 text-sm text-destructive">
          {state.error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <label className={`${labelClass} sm:col-span-2`}>
          <span className={labelTextClass}>Campaign name</span>
          <input
            name="name"
            type="text"
            defaultValue={defaultValues?.name ?? ""}
            placeholder="e.g. August IG Promo"
            className={inputClass}
            required
          />
        </label>

        <label className={labelClass}>
          <span className={labelTextClass}>Channel</span>
          <select
            name="channel"
            defaultValue={defaultValues?.channel ?? "meta_ads"}
            className={inputClass}
          >
            <option value="meta_ads">Meta Ads</option>
            <option value="google_ads">Google Ads</option>
            <option value="email">Email</option>
            <option value="other">Other</option>
          </select>
        </label>

        <label className={labelClass}>
          <span className={labelTextClass}>Status</span>
          <select
            name="status"
            defaultValue={defaultValues?.status ?? "planned"}
            className={inputClass}
          >
            <option value="planned">Planned</option>
            <option value="live">Live</option>
            <option value="ended">Ended</option>
          </select>
        </label>

        <label className={labelClass}>
          <span className={labelTextClass}>Start date</span>
          <input
            name="start_date"
            type="date"
            defaultValue={defaultValues?.start_date ?? ""}
            className={inputClass}
            required
          />
        </label>

        <label className={labelClass}>
          <span className={labelTextClass}>
            End date{" "}
            <span className="text-xs font-normal text-muted-foreground">(optional)</span>
          </span>
          <input
            name="end_date"
            type="date"
            defaultValue={defaultValues?.end_date ?? ""}
            className={inputClass}
          />
        </label>

        <label className={labelClass}>
          <span className={labelTextClass}>Spend (R)</span>
          <input
            name="spend_zar"
            type="number"
            min="0"
            defaultValue={defaultValues?.spend_zar ?? 0}
            className={inputClass}
          />
        </label>

        <label className={labelClass}>
          <span className={labelTextClass}>Leads count</span>
          <input
            name="leads_count"
            type="number"
            min="0"
            defaultValue={defaultValues?.leads_count ?? 0}
            className={inputClass}
          />
        </label>

        <label className={`${labelClass} sm:col-span-2`}>
          <span className={labelTextClass}>
            Notes{" "}
            <span className="text-xs font-normal text-muted-foreground">(optional)</span>
          </span>
          <textarea
            name="notes"
            rows={3}
            defaultValue={defaultValues?.notes ?? ""}
            placeholder="Target audience, offer, creative notes…"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/30 resize-none"
          />
        </label>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving…" : submitLabel}
        </Button>
        <a
          href="/campaigns"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Cancel
        </a>
      </div>
    </form>
  )
}
