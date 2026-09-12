-- ==============================================================================
-- Migration: 20260911_signal_freshness.sql
-- Description: Clean up stale active signals in production.
--
-- Audit Finding (Prompt 02 Phase 2D):
-- In production, 52 signals created in August 2026 remained marked `is_active = true`
-- in September 2026 because their `expires_at` was dynamically rolling forward
-- or set to distant dates, even though the underlying technical price analysis was weeks old.
--
-- Rule: TRUTH BEFORE FEATURES.
-- Signals must reflect live, timely market conditions. Signals older than their
-- timeframe freshness window must be deactivated.
--
-- Freshness Windows:
-- - 15M: 2 hours
-- - 1H:  4 hours
-- - 4H:  12 hours
-- - 1D:  48 hours
-- ==============================================================================

-- Deactivate 15M signals older than 2 hours
UPDATE signals
SET is_active = false
WHERE is_active = true
  AND timeframe IN ('15M', '15m')
  AND created_at < NOW() - INTERVAL '2 hours';

-- Deactivate 1H signals older than 4 hours
UPDATE signals
SET is_active = false
WHERE is_active = true
  AND timeframe IN ('1H', '1h')
  AND created_at < NOW() - INTERVAL '4 hours';

-- Deactivate 4H signals older than 12 hours
UPDATE signals
SET is_active = false
WHERE is_active = true
  AND timeframe IN ('4H', '4h')
  AND created_at < NOW() - INTERVAL '12 hours';

-- Deactivate 1D / all other signals older than 48 hours
UPDATE signals
SET is_active = false
WHERE is_active = true
  AND created_at < NOW() - INTERVAL '48 hours';

-- Add index on created_at and is_active for efficient freshness pruning
CREATE INDEX IF NOT EXISTS idx_signals_active_freshness
  ON signals (is_active, timeframe, created_at);
