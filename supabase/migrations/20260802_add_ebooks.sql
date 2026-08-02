-- Add product_type column to courses table to distinguish ebooks from video courses
ALTER TABLE courses ADD COLUMN IF NOT EXISTS product_type TEXT DEFAULT 'course';

-- Insert the two new ebooks
-- Note: The prop-firm-survival-kit entry already exists; we update its product_type
INSERT INTO courses (slug, title, subtitle, description, price_gbp, is_published, is_free_for_floor, product_type)
VALUES
  (
    'how-to-trade',
    'How to Trade',
    'The Complete Institutional Trading Framework',
    'A 100-page trading framework covering market structure, session theory, order flow, execution mechanics, and professional risk management. Built for traders who are serious about learning correctly from the start.',
    7900,
    true,
    false,
    'ebook'
  ),
  (
    'the-edge',
    'The Edge Manual',
    'Advanced Strategy & Proprietary Setups',
    'Pete''s advanced 100-page playbook. Covers liquidity theory, institutional order flow, confluence trading, proprietary setups, and the psychological framework required to trade consistently at a high level.',
    5900,
    true,
    false,
    'ebook'
  )
ON CONFLICT (slug) DO NOTHING;

-- Mark survival kit as ebook type too
UPDATE courses SET product_type = 'ebook' WHERE slug = 'prop-firm-survival-kit';
