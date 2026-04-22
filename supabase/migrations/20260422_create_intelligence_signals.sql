-- Migration: Create Intelligence Signals Table
CREATE TABLE IF NOT EXISTS intelligence_signals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  title TEXT NOT NULL,
  type TEXT CHECK (type IN ('correlation', 'unusual_volume', 'insider_cluster')),
  severity TEXT CHECK (severity IN ('high', 'medium', 'low')),
  content TEXT NOT NULL,
  related_symbols TEXT[] DEFAULT '{}',
  confidence_score NUMERIC(3, 2),
  notified BOOLEAN DEFAULT FALSE
);

-- Enable RLS
ALTER TABLE intelligence_signals ENABLE ROW LEVEL SECURITY;

-- Allow read access for edge/floor subscribers
CREATE POLICY "Allow read for premium subscribers" ON intelligence_signals
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.subscription_tier IN ('edge', 'floor')
    )
  );

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_signals_created_at ON intelligence_signals (created_at DESC);
