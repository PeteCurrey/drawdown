export type ToolTier = 'Free' | 'Foundation+' | 'Edge+' | 'Floor';

export interface ToolConfig {
  id: string;
  name: string;
  slug: string;
  tier: ToolTier;
  description: string;
  shortDescription: string;
}

export const TOOLS: Record<string, ToolConfig> = {
  'ai-trade-journal': {
    id: 'ai-trade-journal',
    name: 'AI Trade Journal',
    slug: '/tools/ai-trade-journal',
    tier: 'Edge+',
    description: 'The institution-grade journal that thinks. AI-powered analysis of your emotional state and execution quality.',
    shortDescription: 'AI-powered trading journal and emotional analysis.'
  },
  'risk-calculator': {
    id: 'risk-calculator',
    name: 'Risk Calculator',
    slug: '/tools/risk-calculator',
    tier: 'Free',
    description: 'professional-grade position sizing for serious risk management.',
    shortDescription: 'Professional position sizing and risk management.'
  },
  'ai-market-scanner': {
    id: 'ai-market-scanner',
    name: 'AI Market Scanner',
    slug: '/tools/ai-market-scanner',
    tier: 'Edge+',
    description: 'Technical price action scanner that finds high-probability setups across 40+ markets.',
    shortDescription: 'Technical setup and price action scanner.'
  },
  'strategy-backtester': {
    id: 'strategy-backtester',
    name: 'Strategy Backtester',
    slug: '/tools/strategy-backtester',
    tier: 'Edge+',
    description: 'Validate your edge. Test any strategy against 10 years of professional-grade tick data.',
    shortDescription: 'professional-grade backtesting engine.'
  },
  'intelligence-hub': {
    id: 'intelligence-hub',
    name: 'Intelligence Hub',
    slug: '/tools/intelligence-hub',
    tier: 'Foundation+',
    description: 'Your daily macro briefing. AI-aggregated sentiment and high-impact news delivery.',
    shortDescription: 'AI-powered daily macro and sentiment briefing.'
  },
  'technical-charts': {
    id: 'technical-charts',
    name: 'Technical Charts',
    slug: '/markets',
    tier: 'Foundation+',
    description: 'Clean, fast, professional-grade charting for all major global markets.',
    shortDescription: 'Professional charting and technical analysis.'
  },
  'algo-strategy-builder': {
    id: 'algo-strategy-builder',
    name: 'Algo Strategy Builder',
    slug: '/tools/algo-strategy-builder',
    tier: 'Floor',
    description: 'Describe your strategy. Get the code. AI-powered conversion of rules to Pine Script or Python.',
    shortDescription: 'AI-powered natural language to strategy code converter.'
  }
};
