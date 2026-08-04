-- Migration: Create methodology_claims table
-- Path: supabase/migrations/20260804_methodology_claims.sql

DROP TABLE IF EXISTS methodology_claims CASCADE;

CREATE TABLE methodology_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  short_claim TEXT NOT NULL,
  original_wording TEXT,
  approved_wording TEXT NOT NULL,
  category TEXT NOT NULL, -- 'market-data' | 'technical-analysis' | 'artificial-intelligence' | ...
  status TEXT NOT NULL, -- 'verified' | 'partially_verified' | 'derived' | 'third_party' | 'illustrative' | 'planned' | 'unsupported' | 'retired'
  evidence_strength TEXT NOT NULL, -- 'strong' | 'moderate' | 'limited' | 'none'
  summary TEXT NOT NULL,
  what_it_means TEXT NOT NULL,
  what_it_does_not_mean TEXT NOT NULL,
  methodology TEXT NOT NULL,
  data_sources JSONB DEFAULT '[]'::jsonb, -- array of DataSourceReference
  calculations JSONB DEFAULT '[]'::jsonb, -- array of CalculationReference
  limitations JSONB DEFAULT '[]'::jsonb, -- array of string
  assumptions JSONB DEFAULT '[]'::jsonb, -- array of string
  update_frequency TEXT,
  sample_size TEXT,
  test_period TEXT,
  last_verified_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  next_review_at TIMESTAMPTZ,
  owner TEXT,
  reviewer TEXT,
  source_locations JSONB DEFAULT '[]'::jsonb, -- array of ClaimLocation
  public BOOLEAN NOT NULL DEFAULT true,
  related_claims TEXT[] DEFAULT '{}',
  related_tools TEXT[] DEFAULT '{}',
  corrections JSONB DEFAULT '[]'::jsonb, -- array of CorrectionRecord
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indices for faster querying
CREATE INDEX idx_methodology_claims_slug ON methodology_claims(slug);
CREATE INDEX idx_methodology_claims_category ON methodology_claims(category);
CREATE INDEX idx_methodology_claims_status ON methodology_claims(status);
CREATE INDEX idx_methodology_claims_public ON methodology_claims(public);

-- Enable RLS
ALTER TABLE methodology_claims ENABLE ROW LEVEL SECURITY;

-- Policies
-- 1. Public can read non-retired public claims
CREATE POLICY "Allow public select on active public claims"
  ON methodology_claims FOR SELECT TO public
  USING (public = true AND status != 'retired');

-- 2. Authenticated users (admin) can manage all claims
CREATE POLICY "Allow authenticated manage on methodology_claims"
  ON methodology_claims FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- Trigger for auto-updating updated_at
CREATE OR REPLACE FUNCTION handle_methodology_claims_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_methodology_claims_updated_at
  BEFORE UPDATE ON methodology_claims
  FOR EACH ROW
  EXECUTE FUNCTION handle_methodology_claims_updated_at();
