export const STRIPE_CONFIG = {
  prices: {
    foundation: {
      monthly: process.env.STRIPE_PRICE_FOUNDATION_MONTHLY || 'price_foundation_monthly_placeholder',
      annual: process.env.STRIPE_PRICE_FOUNDATION_ANNUAL || 'price_foundation_annual_placeholder',
    },
    edge: {
      monthly: process.env.STRIPE_PRICE_EDGE_MONTHLY || 'price_edge_monthly_placeholder',
      annual: process.env.STRIPE_PRICE_EDGE_ANNUAL || 'price_edge_annual_placeholder',
    },
    floor: {
      monthly: process.env.STRIPE_PRICE_FLOOR_MONTHLY || 'price_floor_monthly_placeholder',
      annual: process.env.STRIPE_PRICE_FLOOR_ANNUAL || 'price_floor_annual_placeholder',
    },
  },
  plans: {
    foundation: {
      name: 'Foundation',
      tier: 'foundation',
    },
    edge: {
      name: 'Edge',
      tier: 'edge',
    },
    floor: {
      name: 'The Floor',
      tier: 'floor',
    },
  }
} as const;
