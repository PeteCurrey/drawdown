-- Create Institutional Accelerator as a standalone course/cohort product
INSERT INTO courses (
  slug,
  title,
  subtitle,
  description,
  price_gbp,
  is_published,
  is_free_for_floor,
  product_type,
  stripe_price_id
) VALUES (
  'institutional-accelerator',
  'Institutional Accelerator',
  '6-Week Premium Live Cohort & Quantitative Mentorship',
  'Move beyond retail speculation. A premium 6-week quantitative trading accelerator combining systematic probability, custom Pine Script indicator engineering, live hedge-fund risk audits, and direct corporate Limited Company tax compliance structures.',
  150000, -- £1,500
  true,
  false,
  'cohort',
  'price_1500_accelerator_placeholder' -- Matches STRIPE_CONFIG configuration
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  price_gbp = EXCLUDED.price_gbp,
  is_published = EXCLUDED.is_published,
  product_type = EXCLUDED.product_type;
