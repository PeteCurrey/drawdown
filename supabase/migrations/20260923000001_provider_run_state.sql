-- ============================================================================
-- Migration: 20260923000001_provider_run_state.sql
--
-- Purpose:
--   Wire the data_provider_health table so the lobby-ingest cron can use it
--   as a serverless-safe schedule tracker.  The table itself already exists
--   (created in 20260920000001_intelligence_data_platform.sql).  This
--   migration adds the missing updated_at trigger and seeds a data_sources
--   entry for each of the seven core providers so that observation FK
--   constraints can be satisfied in future phases.
--
-- Safe to run multiple times (all statements are idempotent).
-- ============================================================================

-- 1. updated_at auto-maintenance trigger (was absent from original migration)
CREATE OR REPLACE TRIGGER set_data_provider_health_updated_at
    BEFORE UPDATE ON public.data_provider_health
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 2. Seed canonical data_sources rows for the seven core providers.
--    These are required for the FK on data_observations.source_id.
--    Observations cannot be persisted without them.
INSERT INTO public.data_sources (id, name, provider_id, category, reliability, source_type, url, attribution_required, attribution_text, refresh_frequency, active)
VALUES
  ('sec-edgar',      'U.S. SEC EDGAR',          'sec-edgar',      'CORPORATE',    'PRIMARY',   'filing', 'https://www.sec.gov/cgi-bin/browse-edgar', true,  'U.S. SEC EDGAR (sec.gov)',                                             'hourly',          true),
  ('central-banks',  'Global Central Banks',     'central-banks',  'CENTRAL_BANK', 'PRIMARY',   'rss',    'https://www.federalreserve.gov/feeds',     true,  'Official central bank communications',                                 'hourly',          true),
  ('regulators',     'Financial Regulators',     'regulators',     'REGULATOR',    'PRIMARY',   'rss',    'https://www.fca.org.uk/news/rss.xml',       true,  'Official financial regulator publications',                             'hourly',          true),
  ('cftc-cot',       'CFTC Commitments of Traders', 'cftc-cot',   'POSITIONING',  'PRIMARY',   'api',    'https://publicreporting.cftc.gov',          true,  'CFTC Commitments of Traders (cftc.gov)',                               'weekly',          true),
  ('fred-api',       'FRED — St. Louis Fed',     'fred-api',       'MACRO',        'PRIMARY',   'api',    'https://fred.stlouisfed.org',               false, 'FRED® Economic Data — Federal Reserve Bank of St. Louis (fred.stlouisfed.org)', 'daily',   true),
  ('eia-v2-api',     'U.S. EIA Energy Data',     'eia-v2-api',     'COMMODITIES',  'PRIMARY',   'api',    'https://api.eia.gov/v2',                    true,  'U.S. Energy Information Administration (eia.gov)',                     'daily',           true),
  ('twelve-data',    'Twelve Data Market Feed',  'twelve-data',    'MARKETS',      'AUTHORITATIVE_SECONDARY', 'api', 'https://api.twelvedata.com', false, 'Twelve Data (twelvedata.com)', 'every-5-minutes', true)
ON CONFLICT (id) DO UPDATE SET
  name             = EXCLUDED.name,
  active           = EXCLUDED.active,
  refresh_frequency = EXCLUDED.refresh_frequency,
  updated_at       = now();

-- 3. Seed canonical data_entities for FRED macro series so observations
--    can satisfy the FK on data_observations.entity_id.
INSERT INTO public.data_entities (id, entity_type, name, identifiers)
VALUES
  ('ind:fedfunds',  'INDICATOR', 'Federal Funds Effective Rate',       '{"fred_series": "FEDFUNDS"}'),
  ('ind:dgs10',     'INDICATOR', 'US 10-Year Treasury Yield',          '{"fred_series": "DGS10"}'),
  ('ind:dgs2',      'INDICATOR', 'US 2-Year Treasury Yield',           '{"fred_series": "DGS2"}'),
  ('ind:cpiaucsl',  'INDICATOR', 'CPI All Urban Consumers (Headline)', '{"fred_series": "CPIAUCSL"}'),
  ('ind:unrate',    'INDICATOR', 'US Unemployment Rate',               '{"fred_series": "UNRATE"}'),
  ('ind:gdp',       'INDICATOR', 'US Real GDP',                        '{"fred_series": "GDP"}'),
  ('ind:m2sl',      'INDICATOR', 'M2 Money Supply',                    '{"fred_series": "M2SL"}'),
  ('ind:t10y2y',    'INDICATOR', 'US 10Y-2Y Treasury Spread',          '{"fred_series": "T10Y2Y"}'),
  ('ind:ic4wsa',    'INDICATOR', 'Initial Jobless Claims (4wk avg)',   '{"fred_series": "IC4WSA"}'),
  ('comm:crude-wti','COMMODITY', 'WTI Crude Oil Spot Price',           '{"eia_series": "RWTC"}')
ON CONFLICT (id) DO NOTHING;
