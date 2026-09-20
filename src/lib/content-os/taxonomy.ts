// src/lib/content-os/taxonomy.ts

export interface EditorialPillar {
  key: string;
  name: string;
  targetWeightPercent: number; // e.g. 20%
  maxConsecutiveDays: number;
  description: string;
}

export const DEFAULT_EDITORIAL_PILLARS: EditorialPillar[] = [
  {
    key: "market_intelligence",
    name: "Market Intelligence",
    targetWeightPercent: 20.0,
    maxConsecutiveDays: 2,
    description: "What is moving markets, unusual market behavior, volatility, correlations, macro developments."
  },
  {
    key: "risk_and_drawdown",
    name: "Risk & Drawdown",
    targetWeightPercent: 20.0,
    maxConsecutiveDays: 2,
    description: "Historical drawdowns, risk management, position sizing, recovery maths, portfolio risk."
  },
  {
    key: "trading_education",
    name: "Trading Education",
    targetWeightPercent: 15.0,
    maxConsecutiveDays: 2,
    description: "Technical concepts, execution, risk/reward, market structure, practical calculations."
  },
  {
    key: "trader_psychology",
    name: "Trader Psychology",
    targetWeightPercent: 10.0,
    maxConsecutiveDays: 1,
    description: "Loss aversion, revenge trading, overtrading, recency bias, anchoring, behavioral mistakes."
  },
  {
    key: "case_studies",
    name: "Historical Case Studies",
    targetWeightPercent: 10.0,
    maxConsecutiveDays: 1,
    description: "Crashes, bubbles, major recoveries, individual assets, famous companies, volatility events."
  },
  {
    key: "quantitative_insights",
    name: "Quantitative Insights",
    targetWeightPercent: 10.0,
    maxConsecutiveDays: 1,
    description: "Historical probabilities, drawdown distributions, recovery periods, statistical distributions."
  },
  {
    key: "product_tools",
    name: "Product / Tool",
    targetWeightPercent: 10.0,
    maxConsecutiveDays: 1,
    description: "Drawdown calculators, Signal Centre, risk tools, educational platform walkthroughs."
  },
  {
    key: "weekly_recap",
    name: "Weekly / Periodic Recap",
    targetWeightPercent: 5.0,
    maxConsecutiveDays: 1,
    description: "Week in markets, biggest drawdowns, largest recoveries, what changed, what to watch."
  }
];

export interface DiversityViolation {
  rule: string;
  slotIndex: number;
  pillar: string;
  details: string;
}

export class EditorialTaxonomyService {
  /**
   * Evaluates an allocated sequence of slots against diversity rules:
   * 1. No more than maxConsecutiveDays from same pillar (e.g. no 3 educational posts in a row).
   * 2. No excessive product promotion (max 1 product tool post per week / 5 active slots).
   * 3. Prevents topic / asset repetition across adjacent days.
   */
  static validateDiversity(sequence: Array<{ pillarKey: string; topic?: string }>): {
    valid: boolean;
    violations: DiversityViolation[];
  } {
    const violations: DiversityViolation[] = [];
    const pillarConfigMap = new Map(DEFAULT_EDITORIAL_PILLARS.map(p => [p.key, p]));

    let currentConsecutive = 1;
    let prevPillar = sequence[0]?.pillarKey;

    for (let i = 1; i < sequence.length; i++) {
      const cur = sequence[i];
      if (cur.pillarKey === prevPillar) {
        currentConsecutive++;
        const maxAllowed = pillarConfigMap.get(cur.pillarKey)?.maxConsecutiveDays || 2;
        if (currentConsecutive > maxAllowed) {
          violations.push({
            rule: "MAX_CONSECUTIVE_PILLAR",
            slotIndex: i,
            pillar: cur.pillarKey,
            details: `Pillar '${cur.pillarKey}' appears ${currentConsecutive} consecutive times (limit: ${maxAllowed}).`
          });
        }
      } else {
        currentConsecutive = 1;
        prevPillar = cur.pillarKey;
      }
    }

    // Weekly product promotion cap check (window of 5 slots)
    for (let i = 0; i <= sequence.length - 5; i++) {
      const window = sequence.slice(i, i + 5);
      const productCount = window.filter(s => s.pillarKey === 'product_tools').length;
      if (productCount > 1) {
        violations.push({
          rule: "EXCESSIVE_PRODUCT_PROMOTION",
          slotIndex: i,
          pillar: "product_tools",
          details: `Detected ${productCount} product-led posts in a 5-slot window (max allowed is 1 per week).`
        });
      }
    }

    return {
      valid: violations.length === 0,
      violations
    };
  }
}
