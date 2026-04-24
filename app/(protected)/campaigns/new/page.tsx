import { CampaignForm } from "../_components/campaign-form"
import { createCampaign } from "./actions"

export default function NewCampaignPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">New campaign</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Fill in the details to create a new campaign.
        </p>
      </div>

      <div className="rounded-2xl border border-border/70 bg-card/85 p-6 shadow-sm">
        <CampaignForm action={createCampaign} submitLabel="Create campaign" />
      </div>
    </div>
  )
}
