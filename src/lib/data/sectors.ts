export interface MarketSector {
  id: string;
  name: string;
  performance: number; // Percentage change
  status: 'bullish' | 'bearish' | 'neutral';
  weight: number; // Relative importance (0-1)
  topInstruments: string[];
}

export const FTSE_SECTORS: MarketSector[] = [
  {
    id: 'energy',
    name: 'Energy',
    performance: 2.45,
    status: 'bullish',
    weight: 1,
    topInstruments: ['BP.', 'SHEL', 'HBR']
  },
  {
    id: 'financials',
    name: 'Financials',
    performance: -0.82,
    status: 'bearish',
    weight: 0.9,
    topInstruments: ['HSBA', 'BARC', 'LLOY']
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    performance: 1.15,
    status: 'bullish',
    weight: 0.8,
    topInstruments: ['AZN', 'GSK', 'HLN']
  },
  {
    id: 'consumer-staples',
    name: 'Consumer Staples',
    performance: 0.34,
    status: 'neutral',
    weight: 0.7,
    topInstruments: ['ULVR', 'DGE', 'BATS']
  },
  {
    id: 'industrials',
    name: 'Industrials',
    performance: -1.25,
    status: 'bearish',
    weight: 0.7,
    topInstruments: ['RR.', 'BA.', 'EXPN']
  },
  {
    id: 'technology',
    name: 'Technology',
    performance: 3.12,
    status: 'bullish',
    weight: 0.5,
    topInstruments: ['SGE', 'RKT', 'DARK']
  },
  {
    id: 'basic-materials',
    name: 'Basic Materials',
    performance: -2.15,
    status: 'bearish',
    weight: 0.6,
    topInstruments: ['RIO', 'GLEN', 'AAL']
  },
  {
    id: 'utilities',
    name: 'Utilities',
    performance: 0.12,
    status: 'neutral',
    weight: 0.4,
    topInstruments: ['NG.', 'UU.', 'SVT']
  },
  {
    id: 'real-estate',
    name: 'Real Estate',
    performance: -0.45,
    status: 'neutral',
    weight: 0.3,
    topInstruments: ['LAND', 'DLG', 'BLND']
  }
];
