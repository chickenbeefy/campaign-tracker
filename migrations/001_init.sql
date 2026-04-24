CREATE TABLE IF NOT EXISTS campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  channel text NOT NULL CHECK (channel IN ('meta_ads', 'google_ads', 'email', 'other')),
  start_date date NOT NULL,
  end_date date,
  spend_zar bigint NOT NULL DEFAULT 0,
  leads_count int NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'live', 'ended')),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ad_copy (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  angle text NOT NULL CHECK (angle IN ('benefits', 'urgency', 'question')),
  copy_text text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ad_copy_campaign_id_idx ON ad_copy(campaign_id);
