import { IndividualTrade, FundedAccount } from "@/types/dashboard";

export interface PsychologyPattern {
  id: string;
  name: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  recommendation: string;
  detectedAt: string;
}

export interface TradeHistory {
  trades: IndividualTrade[];
  account: FundedAccount;
}

export class PatternDetector {
  private trades: IndividualTrade[];
  private account: FundedAccount;

  constructor(history: TradeHistory) {
    this.trades = [...history.trades].sort((a, b) => 
      new Date(b.entry_time).getTime() - new Date(a.entry_time).getTime()
    );
    this.account = history.account;
  }

  public detectPatterns(): PsychologyPattern[] {
    const patterns: PsychologyPattern[] = [];

    const revengeTrading = this.detectRevengeTrading();
    if (revengeTrading) patterns.push(revengeTrading);

    const overtrading = this.detectOvertrading();
    if (overtrading) patterns.push(overtrading);

    const poorRisk = this.detectPoorRiskManagement();
    if (poorRisk) patterns.push(poorRisk);

    const inconsistentSizing = this.detectInconsistentSizing();
    if (inconsistentSizing) patterns.push(inconsistentSizing);

    return patterns;
  }

  private detectRevengeTrading(): PsychologyPattern | null {
    // Look for a loss followed by a larger position size within a short window
    for (let i = 0; i < this.trades.length - 1; i++) {
      const current = this.trades[i];
      const previous = this.trades[i + 1];

      if (!previous.exit_time || !previous.net_pnl) continue;

      const timeDiff = new Date(current.entry_time).getTime() - new Date(previous.exit_time).getTime();
      const minutes = timeDiff / (1000 * 60);

      // If previous was a loss and next trade was within 30 mins with larger lots
      if (previous.net_pnl < 0 && minutes < 30 && current.lot_size > previous.lot_size) {
        return {
          id: 'revenge-trading',
          name: 'Revenge Trading Detected',
          severity: 'critical',
          description: `You increased your position size to ${current.lot_size} lots immediately after a loss of ${previous.net_pnl}. This is a classic "get-even" pattern.`,
          recommendation: 'Walk away from the screens for at least 2 hours. Your brain is in a high-cortisol state and cannot process risk objectively right now.',
          detectedAt: current.entry_time
        };
      }
    }
    return null;
  }

  private detectOvertrading(): PsychologyPattern | null {
    // Detect more than 5 trades in a single 24-hour period
    const today = new Date().toDateString();
    const tradesToday = this.trades.filter(t => new Date(t.entry_time).toDateString() === today);

    if (tradesToday.length > 8) {
      return {
        id: 'overtrading',
        name: 'Overtrading Pattern',
        severity: 'high',
        description: `You have taken ${tradesToday.length} trades today. High trade frequency often indicates impulsive entries and a loss of selectivity.`,
        recommendation: 'Cap your trades at 3-5 per day. Quality over quantity is the only way to survive as a retail trader.',
        detectedAt: new Date().toISOString()
      };
    }
    return null;
  }

  private detectPoorRiskManagement(): PsychologyPattern | null {
    // Detect any trade risking more than a certain % of account size
    // For this engine, we'll flag any net_pnl loss > 2% of account size as poor risk management
    const balance = this.account.account_size;
    
    const highRiskTrade = this.trades.find(t => {
      if (!t.net_pnl) return false;
      const lossPct = (Math.abs(t.net_pnl) / balance);
      return t.net_pnl < 0 && lossPct > 0.02; // Risking > 2% of total account
    });

    if (highRiskTrade) {
      return {
        id: 'poor-risk',
        name: 'High Risk Exposure',
        severity: 'high',
        description: `One or more trades resulted in a loss greater than 2% of your account size (£${Math.abs(highRiskTrade.net_pnl || 0)}). This is mathematically dangerous.`,
        recommendation: 'Lower your lot size. You should never risk more than 1% of your account on any single trade idea.',
        detectedAt: highRiskTrade.entry_time
      };
    }
    return null;
  }

  private detectInconsistentSizing(): PsychologyPattern | null {
    if (this.trades.length < 5) return null;

    const sizes = this.trades.map(t => t.lot_size);
    const avgSize = sizes.reduce((a, b) => a + b, 0) / sizes.length;
    
    // Flag if current trade is 3x larger than the average of last 10
    const current = this.trades[0];
    if (current.lot_size > avgSize * 2.5) {
      return {
        id: 'inconsistent-sizing',
        name: 'Aggressive Size Increase',
        severity: 'medium',
        description: `Your latest trade size of ${current.lot_size} lots is significantly higher than your average. This suggests "gambling" on a specific outcome.`,
        recommendation: 'Maintain a fixed risk amount. Standardized sizing is key to professional performance.',
        detectedAt: current.entry_time
      };
    }
    return null;
  }
}
