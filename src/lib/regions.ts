export type RegionCode = 'GB' | 'AU' | 'US' | 'SG' | 'HK';

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  currency: string;
  symbol: string;
  stripePriceId: string;
}

export const REGIONAL_PRICING: Record<RegionCode, Record<string, PricingPlan>> = {
  GB: {
    foundation: { id: 'foundation', name: 'Foundation', price: '49', currency: 'GBP', symbol: '£', stripePriceId: 'price_GB_foundation' },
    edge: { id: 'edge', name: 'Edge', price: '149', currency: 'GBP', symbol: '£', stripePriceId: 'price_GB_edge' },
    floor: { id: 'floor', name: 'Floor', price: '299', currency: 'GBP', symbol: '£', stripePriceId: 'price_GB_floor' },
  },
  AU: {
    foundation: { id: 'foundation', name: 'Foundation', price: '79', currency: 'AUD', symbol: 'A$', stripePriceId: 'price_AU_foundation' },
    edge: { id: 'edge', name: 'Edge', price: '239', currency: 'AUD', symbol: 'A$', stripePriceId: 'price_AU_edge' },
    floor: { id: 'floor', name: 'Floor', price: '479', currency: 'AUD', symbol: 'A$', stripePriceId: 'price_AU_floor' },
  },
  US: {
    foundation: { id: 'foundation', name: 'Foundation', price: '59', currency: 'USD', symbol: '$', stripePriceId: 'price_US_foundation' },
    edge: { id: 'edge', name: 'Edge', price: '179', currency: 'USD', symbol: '$', stripePriceId: 'price_US_edge' },
    floor: { id: 'floor', name: 'Floor', price: '359', currency: 'USD', symbol: '$', stripePriceId: 'price_US_floor' },
  },
  SG: {
    foundation: { id: 'foundation', name: 'Foundation', price: '79', currency: 'SGD', symbol: 'S$', stripePriceId: 'price_SG_foundation' },
    edge: { id: 'edge', name: 'Edge', price: '239', currency: 'SGD', symbol: 'S$', stripePriceId: 'price_SG_edge' },
    floor: { id: 'floor', name: 'Floor', price: '479', currency: 'SGD', symbol: 'S$', stripePriceId: 'price_SG_floor' },
  },
  HK: {
    foundation: { id: 'foundation', name: 'Foundation', price: '469', currency: 'HKD', symbol: 'HK$', stripePriceId: 'price_HK_foundation' },
    edge: { id: 'edge', name: 'Edge', price: '1399', currency: 'HKD', symbol: 'HK$', stripePriceId: 'price_HK_edge' },
    floor: { id: 'floor', name: 'Floor', price: '2799', currency: 'HKD', symbol: 'HK$', stripePriceId: 'price_HK_floor' },
  },
};

export function getRegionByCountry(countryCode?: string): RegionCode {
  if (!countryCode) return 'GB';
  const supported: RegionCode[] = ['GB', 'AU', 'US', 'SG', 'HK'];
  if (supported.includes(countryCode as RegionCode)) return countryCode as RegionCode;
  return 'GB'; // Fallback
}
