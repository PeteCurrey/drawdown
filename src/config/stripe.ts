export const STRIPE_CONFIG = {
  prices: {
    'signal-centre': {
      monthly: {
        gbp: process.env.STRIPE_PRICE_SIGNAL_CENTRE_MONTHLY_GBP || 'price_signal_centre_monthly_gbp_placeholder',
        aud: process.env.STRIPE_PRICE_SIGNAL_CENTRE_MONTHLY_AUD || 'price_signal_centre_monthly_aud_placeholder',
        usd: process.env.STRIPE_PRICE_SIGNAL_CENTRE_MONTHLY_USD || 'price_signal_centre_monthly_usd_placeholder',
        sgd: process.env.STRIPE_PRICE_SIGNAL_CENTRE_MONTHLY_SGD || 'price_signal_centre_monthly_sgd_placeholder',
        hkd: process.env.STRIPE_PRICE_SIGNAL_CENTRE_MONTHLY_HKD || 'price_signal_centre_monthly_hkd_placeholder',
      },
      annual: {
        gbp: process.env.STRIPE_PRICE_SIGNAL_CENTRE_MONTHLY_GBP || 'price_signal_centre_monthly_gbp_placeholder',
        aud: process.env.STRIPE_PRICE_SIGNAL_CENTRE_MONTHLY_AUD || 'price_signal_centre_monthly_aud_placeholder',
        usd: process.env.STRIPE_PRICE_SIGNAL_CENTRE_MONTHLY_USD || 'price_signal_centre_monthly_usd_placeholder',
        sgd: process.env.STRIPE_PRICE_SIGNAL_CENTRE_MONTHLY_SGD || 'price_signal_centre_monthly_sgd_placeholder',
        hkd: process.env.STRIPE_PRICE_SIGNAL_CENTRE_MONTHLY_HKD || 'price_signal_centre_monthly_hkd_placeholder',
      },
    },
    foundation: {
      monthly: {
        gbp: process.env.STRIPE_PRICE_FOUNDATION_MONTHLY_GBP || 'price_foundation_monthly_gbp_placeholder',
        aud: process.env.STRIPE_PRICE_FOUNDATION_MONTHLY_AUD || 'price_foundation_monthly_aud_placeholder',
        usd: process.env.STRIPE_PRICE_FOUNDATION_MONTHLY_USD || 'price_foundation_monthly_usd_placeholder',
        sgd: process.env.STRIPE_PRICE_FOUNDATION_MONTHLY_SGD || 'price_foundation_monthly_sgd_placeholder',
        hkd: process.env.STRIPE_PRICE_FOUNDATION_MONTHLY_HKD || 'price_foundation_monthly_hkd_placeholder',
      },
      annual: {
        gbp: process.env.STRIPE_PRICE_FOUNDATION_ANNUAL_GBP || 'price_foundation_annual_gbp_placeholder',
        aud: process.env.STRIPE_PRICE_FOUNDATION_ANNUAL_AUD || 'price_foundation_annual_aud_placeholder',
        usd: process.env.STRIPE_PRICE_FOUNDATION_ANNUAL_USD || 'price_foundation_annual_usd_placeholder',
        sgd: process.env.STRIPE_PRICE_FOUNDATION_ANNUAL_SGD || 'price_foundation_annual_sgd_placeholder',
        hkd: process.env.STRIPE_PRICE_FOUNDATION_ANNUAL_HKD || 'price_foundation_annual_hkd_placeholder',
      },
    },
    edge: {
      monthly: {
        gbp: process.env.STRIPE_PRICE_EDGE_MONTHLY_GBP || 'price_edge_monthly_gbp_placeholder',
        aud: process.env.STRIPE_PRICE_EDGE_MONTHLY_AUD || 'price_edge_monthly_aud_placeholder',
        usd: process.env.STRIPE_PRICE_EDGE_MONTHLY_USD || 'price_edge_monthly_usd_placeholder',
        sgd: process.env.STRIPE_PRICE_EDGE_MONTHLY_SGD || 'price_edge_monthly_sgd_placeholder',
        hkd: process.env.STRIPE_PRICE_EDGE_MONTHLY_HKD || 'price_edge_monthly_hkd_placeholder',
      },
      annual: {
        gbp: process.env.STRIPE_PRICE_EDGE_ANNUAL_GBP || 'price_edge_annual_gbp_placeholder',
        aud: process.env.STRIPE_PRICE_EDGE_ANNUAL_AUD || 'price_edge_annual_aud_placeholder',
        usd: process.env.STRIPE_PRICE_EDGE_ANNUAL_USD || 'price_edge_annual_usd_placeholder',
        sgd: process.env.STRIPE_PRICE_EDGE_ANNUAL_SGD || 'price_edge_annual_sgd_placeholder',
        hkd: process.env.STRIPE_PRICE_EDGE_ANNUAL_HKD || 'price_edge_annual_hkd_placeholder',
      },
    },
    floor: {
      monthly: {
        gbp: process.env.STRIPE_PRICE_FLOOR_MONTHLY_GBP || 'price_floor_monthly_gbp_placeholder',
        aud: process.env.STRIPE_PRICE_FLOOR_MONTHLY_AUD || 'price_floor_monthly_aud_placeholder',
        usd: process.env.STRIPE_PRICE_FLOOR_MONTHLY_USD || 'price_floor_monthly_usd_placeholder',
        sgd: process.env.STRIPE_PRICE_FLOOR_MONTHLY_SGD || 'price_floor_monthly_sgd_placeholder',
        hkd: process.env.STRIPE_PRICE_FLOOR_MONTHLY_HKD || 'price_floor_monthly_hkd_placeholder',
      },
      annual: {
        gbp: process.env.STRIPE_PRICE_FLOOR_ANNUAL_GBP || 'price_floor_annual_gbp_placeholder',
        aud: process.env.STRIPE_PRICE_FLOOR_ANNUAL_AUD || 'price_floor_annual_aud_placeholder',
        usd: process.env.STRIPE_PRICE_FLOOR_ANNUAL_USD || 'price_floor_annual_usd_placeholder',
        sgd: process.env.STRIPE_PRICE_FLOOR_ANNUAL_SGD || 'price_floor_annual_sgd_placeholder',
        hkd: process.env.STRIPE_PRICE_FLOOR_ANNUAL_HKD || 'price_floor_annual_hkd_placeholder',
      },
    },
  },
  plans: {
    'signal-centre': {
      name: 'Signal Centre',
      tier: 'signal-centre',
    },
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
