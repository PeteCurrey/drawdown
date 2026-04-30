-- Revenue & Payouts Table
CREATE TABLE IF NOT EXISTS affiliate_payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    link_id UUID REFERENCES affiliate_links(id) ON DELETE SET NULL,
    amount DECIMAL NOT NULL,
    currency TEXT DEFAULT 'GBP',
    payout_date DATE NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, cleared, failed
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE affiliate_payouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage revenue"
  ON affiliate_payouts FOR ALL
  USING (auth.role() = 'authenticated');

-- Create a view for aggregate revenue per link
CREATE OR REPLACE VIEW revenue_by_partner AS
SELECT 
    al.partner_name,
    al.slug,
    COUNT(ac.id) as total_clicks,
    COALESCE(SUM(ap.amount), 0) as total_revenue
FROM affiliate_links al
LEFT JOIN affiliate_clicks ac ON al.id = ac.link_id
LEFT JOIN affiliate_payouts ap ON al.id = ap.link_id
GROUP BY al.partner_name, al.slug;
