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

  // TOOLS
  'tradingview': {
    url: 'https://tradingview.com', // PLACEHOLDER - replace with referral URL
    name: 'TradingView',
    category: 'tool',
    hasAffiliateLink: false,
  },
};
