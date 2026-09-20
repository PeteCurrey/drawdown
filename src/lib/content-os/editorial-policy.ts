// src/lib/content-os/editorial-policy.ts

export const BANNED_CLICKBAIT_PHRASES = [
  "here's what you need to know",
  "markets are going crazy",
  "don't miss this",
  "5 things you must know",
  "you won't believe",
  "secret trading hack",
  "make guaranteed money",
  "financial freedom",
  "get rich quick",
  "passive income"
];

export const MANDATORY_FCA_DISCLAIMER = 
  "Spread Bets and CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage. Educational and quantitative research only; not financial advice.";

export interface EditorialEvaluation {
  passed: boolean;
  violations: string[];
  toneFeedback: string[];
}

export class EditorialPolicyService {
  /**
   * Evaluates text against Pete's voice profile and Drawdown's factual standards.
   */
  static evaluateContent(text: string): EditorialEvaluation {
    const lower = text.toLowerCase();
    const violations: string[] = [];
    const toneFeedback: string[] = [];

    // Check for banned clickbait phrases
    for (const phrase of BANNED_CLICKBAIT_PHRASES) {
      if (lower.includes(phrase)) {
        violations.push(`Banned clickbait phrase detected: "${phrase}"`);
      }
    }

    // Excessive exclamation marks check
    const exclamationCount = (text.match(/!/g) || []).length;
    if (exclamationCount > 2) {
      violations.push(`Excessive sensational punctuation (${exclamationCount} exclamation marks). Keep tone restrained and institutional.`);
    }

    // False certainty filter
    if (lower.includes("guaranteed to rise") || lower.includes("sure thing") || lower.includes("cannot lose")) {
      violations.push("Prohibited claim: Never express fake certainty or promise market outcomes.");
    }

    // Tone suggestions
    if (lower.includes("insane") || lower.includes("wild")) {
      toneFeedback.push("Consider substituting sensationalist terms ('wild', 'insane') with quantitative descriptors ('elevated volatility', 'historic deviation').");
    }

    return {
      passed: violations.length === 0,
      violations,
      toneFeedback
    };
  }

  /**
   * Ensures derivatives or trade ideas contain the required regulatory disclaimer.
   */
  static enforceDisclaimer(text: string, requiresDisclaimer: boolean): string {
    if (!requiresDisclaimer) return text;
    if (text.includes("Educational and quantitative research only; not financial advice")) {
      return text;
    }
    return `${text.trim()}\n\n---\n*Disclaimer: ${MANDATORY_FCA_DISCLAIMER}*`;
  }
}
