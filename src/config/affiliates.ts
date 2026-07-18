export const affiliateLinks: Record<string, {
  url: string;
  name: string;
  category: 'broker' | 'propfirm' | 'tool';
  hasAffiliateLink: boolean;
}> = {
  // PROP FIRMS
  'ftmo': {
    url: 'https://trader.ftmo.com/?affiliates=IuDKuiDWoYwPvOzBWcSy',
    name: 'FTMO',
    category: 'propfirm',
    hasAffiliateLink: true,
  },
  'the5ers': {
    url: 'https://the5ers.com', // PLACEHOLDER - replace with affiliate URL
    name: 'The5%ers',
    category: 'propfirm',
    hasAffiliateLink: false,
  },
  'funding-pips': {
    url: 'https://fundingpips.com', // PLACEHOLDER - replace with affiliate URL
    name: 'Funding Pips',
    category: 'propfirm',
    hasAffiliateLink: false,
  },

  // BROKERS
  'ig-markets': {
    url: 'https://www.ig.com/uk', // PLACEHOLDER - replace with affiliate URL
    name: 'IG Markets',
    category: 'broker',
    hasAffiliateLink: false,
  },
  'pepperstone': {
    url: 'https://pepperstone.com/en-gb/', // PLACEHOLDER - replace with affiliate URL
    name: 'Pepperstone',
    category: 'broker',
    hasAffiliateLink: false,
  },
  'ic-markets': {
    url: 'https://icmarkets.com/en-gb/', // PLACEHOLDER - replace with affiliate URL
    name: 'IC Markets',
    category: 'broker',
    hasAffiliateLink: false,
  },
  'trading-212': {
    url: 'https://www.trading212.com',
    name: 'Trading 212',
    category: 'broker',
    hasAffiliateLink: false,
  },
  'xtb': {
    url: 'https://www.xtb.com/uk',
    name: 'XTB',
    category: 'broker',
    hasAffiliateLink: false,
  },
  'cmc-markets': {
    url: 'https://www.cmcmarkets.com/en-gb/',
    name: 'CMC Markets',
    category: 'broker',
    hasAffiliateLink: false,
  },
  'fp-markets': {
    url: 'https://www.fpmarkets.com/',
    name: 'FP Markets',
    category: 'broker',
    hasAffiliateLink: false,
  },
  'city-index': {
    url: 'https://www.cityindex.com/en-uk/',
    name: 'City Index',
    category: 'broker',
    hasAffiliateLink: false,
  },

  // TOOLS
  'tradingview': {
    url: 'https://www.tradingview.com/?aff_id=165855',
    name: 'TradingView',
    category: 'tool',
    hasAffiliateLink: true,
  },
};
